
const PlacementProfile = require("../models/PlacementProfile");
const Resume = require("../models/Resume");
const ResumeAnalysis = require("../models/ResumeAnalysis");
const SkillGap = require("../models/skillGap");
const Roadmap = require("../models/Roadmap");
const Interview = require("../models/interview");

const {
  getAtsScore,
  getResumeQuality,
  getInterviewStats,
} = require("../services/readinessService");

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || "http://localhost:8000";

const DEFAULT_RESUME_SCORE = 60;
const DEFAULT_MOCK_INTERVIEW_SCORE = 60;

// Calls the ML service with limited retries for temporary errors.
const callMlService = async (features) => {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(`${ML_SERVICE_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(features),
        signal: AbortSignal.timeout(20000),
      });

      // Detect Render Free-plan hibernation rate limiting.
      const renderLimit = response.headers.get("x-render-routing");

      if (renderLimit === "hibernate-rate-limited") {
        console.error(
          "Render Free service rate limit reached. Stopping retries."
        );

        return response;
      }

      // Retry other temporary rate-limit and unavailable errors.
      if (
        (response.status === 429 || response.status === 503) &&
        attempt < maxAttempts
      ) {
        const delay = attempt * 5000;

        console.log(
          `ML service returned ${response.status}. Retrying in ${delay}ms...`
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      return response;
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }

      const delay = attempt * 5000;

      console.log(
        `ML request failed. Retrying in ${delay}ms...`
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

const getMlPrediction = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const [profile, resume, resumeAnalysis, skillGap, roadmap, interviews] =
      await Promise.all([
        PlacementProfile.findOne({ user: userId }),
        Resume.findOne({ user: userId }),
        ResumeAnalysis.findOne({ user: userId }),
        SkillGap.findOne({ user: userId }).sort({ createdAt: -1 }),
        Roadmap.findOne({ user: userId }).sort({ createdAt: -1 }),
        Interview.find({ user: userId }),
      ]);

    if (!profile) {
      return res.status(200).json({
        message: "Placement profile is required",
        profileComplete: false,
        prediction: null,
      });
    }

    const assumedInputs = [];

    // Resume score: prefer ATS score, then resume completeness score.
    let resumeScore = getAtsScore(resumeAnalysis);

    if (resumeScore === null) {
      resumeScore = getResumeQuality(resume);
    }

    if (resumeScore === null) {
      resumeScore = DEFAULT_RESUME_SCORE;

      assumedInputs.push({
        key: "resume_score",
        label: "Resume score",
        value: resumeScore,
      });
    }

    // Average score of AI mock interviews.
    let mockInterviewScore = getInterviewStats(interviews).average;

    if (mockInterviewScore === null) {
      mockInterviewScore = DEFAULT_MOCK_INTERVIEW_SCORE;

      assumedInputs.push({
        key: "mock_interview_score",
        label: "Mock interview score",
        value: mockInterviewScore,
      });
    }

    const education =
      (resume && resume.education && resume.education[0]) || {};

    const features = {
      cgpa: profile.cgpa,
      backlogs: profile.backlogs,
      attendance_pct: profile.attendancePct,
      coding_skill_score: profile.codingSkillScore,
      dsa_score: profile.dsaScore,
      core_cs_score: profile.coreCsScore,
      aptitude_score: profile.aptitudeScore,
      communication_score: profile.communicationScore,
      english_score: profile.englishScore,
      projects_count: resume ? (resume.projects || []).length : 0,
      internships_count: resume ? (resume.experience || []).length : 0,
      certifications_count: resume
        ? (resume.certifications || []).length
        : 0,
      coding_hours_per_week: profile.codingHoursPerWeek,
      interview_practice_hours_per_week:
        profile.interviewPracticeHoursPerWeek,
      resume_score: resumeScore,
      mock_interview_score: mockInterviewScore,
      degree: profile.degree || education.degree || "BTech",
      branch: profile.branch || education.fieldOfStudy || "Other",
      preferred_role:
        (skillGap && skillGap.targetRole) ||
        (roadmap && roadmap.targetRole) ||
        "Software Developer",
    };

    console.log("Calling ML Service:", `${ML_SERVICE_URL}/predict`);

    let response;

    try {
      response = await callMlService(features);
    } catch (error) {
      console.error("ML SERVICE UNREACHABLE:", error.message);

      return res.status(503).json({
        message:
          "The prediction service is temporarily unavailable. Please try again later.",
      });
    }

    const responseText = await response.text();

    console.log("ML RESPONSE STATUS:", response.status);
    console.log(
      "ML RESPONSE HEADERS:",
      Object.fromEntries(response.headers.entries())
    );
    console.log("ML RESPONSE BODY:", responseText);

    let data = {};

    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      data = { rawResponse: responseText };
    }

    if (!response.ok) {
      console.error("ML SERVICE ERROR:", response.status, data);

      return res.status(502).json({
        message: "The prediction service returned an error",
        mlStatus: response.status,
        mlError: data,
      });
    }

    return res.status(200).json({
      message: "Prediction generated successfully",
      profileComplete: true,
      prediction: {
        predictedClass: data.predictedClass,
        placementReadyProbability: data.placementReadyProbability,
        probabilities: data.probabilities,
      },
      usedInputs: data.usedInputs,
      mappedInputs: data.mappedInputs || {},
      assumedInputs,
    });
  } catch (error) {
    console.error("ML PREDICTION ERROR:", error.message);
    next(error);
  }
};

module.exports = {
  getMlPrediction,
};
