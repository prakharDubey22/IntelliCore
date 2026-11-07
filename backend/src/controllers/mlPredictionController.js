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

const ML_SERVICE_URL =  "http://localhost:5001";

// Used only when the student has no data for these yet.
// They are reported back as "assumedInputs" so the page can say so.
const DEFAULT_RESUME_SCORE = 60;
const DEFAULT_MOCK_INTERVIEW_SCORE = 60;

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

    // Resume score: prefer the ATS score, then the resume completeness score
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

    // Mock interview score: average of the AI interview scores (0-100)
    let mockInterviewScore = getInterviewStats(interviews).average;

    if (mockInterviewScore === null) {
      mockInterviewScore = DEFAULT_MOCK_INTERVIEW_SCORE;
      assumedInputs.push({
        key: "mock_interview_score",
        label: "Mock interview score",
        value: mockInterviewScore,
      });
    }

    const education = (resume && resume.education && resume.education[0]) || {};

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
      certifications_count: resume ? (resume.certifications || []).length : 0,
      coding_hours_per_week: profile.codingHoursPerWeek,
      interview_practice_hours_per_week: profile.interviewPracticeHoursPerWeek,
      resume_score: resumeScore,
      mock_interview_score: mockInterviewScore,
      degree: profile.degree || education.degree || "BTech",
      branch: profile.branch || education.fieldOfStudy || "Other",
      preferred_role:
        (skillGap && skillGap.targetRole) ||
        (roadmap && roadmap.targetRole) ||
        "Software Developer",
    };

    let response;

    try {
      response = await fetch(`${ML_SERVICE_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(features),
        signal: AbortSignal.timeout(20000),
      });
    } catch (error) {
      console.error("ML SERVICE UNREACHABLE:", error.message);

      return res.status(503).json({
        message:
          "The prediction service is not available right now. Please try again later.",
      });
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("ML SERVICE ERROR:", response.status, JSON.stringify(data));

      return res.status(502).json({
        message: "The prediction service returned an error",
      });
    }

    res.status(200).json({
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
