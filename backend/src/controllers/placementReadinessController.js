const Resume = require("../models/Resume");
const PlacementReadiness = require("../models/PlacementReadiness");
const { analyzeResume } = require("../services/aiService");

const analyzePlacementReadiness = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { targetRole } = req.body;

    if (!targetRole) {
      return res.status(400).json({
        message: "Target role is required",
      });
    }

    const resume = await Resume.findOne({
      user: userId,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    const prompt = `
Analyze this candidate's placement readiness for the following role.

Target Role:
${targetRole}

Resume:
${JSON.stringify(resume, null, 2)}

Evaluate these areas from 0 to 100:

1. Technical Skills
2. Projects
3. Experience
4. Resume Quality
5. Interview Preparation

Also calculate an overall score from 0 to 100.

Give practical recommendations.

Return ONLY this JSON structure:

{
  "technicalSkills": 0,
  "projects": 0,
  "experience": 0,
  "resumeQuality": 0,
  "interviewPreparation": 0,
  "overallScore": 0,
  "recommendations": []
}

Rules:
- All scores must be numbers between 0 and 100.
- recommendations must be an array of strings.
- Do not return markdown.
- Do not add text outside the JSON.
`;

    const analysis = await analyzeResume({
      ...resume.toObject(),
      placementReadinessPrompt: prompt,
    });

    const placementReadiness = await PlacementReadiness.create({
      user: userId,
      targetRole,
      technicalSkills: analysis.technicalSkills,
      projects: analysis.projects,
      experience: analysis.experience,
      resumeQuality: analysis.resumeQuality,
      interviewPreparation: analysis.interviewPreparation,
      overallScore: analysis.overallScore,
      recommendations: analysis.recommendations || [],
    });

    res.status(200).json({
      message: "Placement readiness analysis completed",
      placementReadiness,
    });
  } catch (error) {
    console.error("PLACEMENT READINESS ERROR:", error.message);

    next(error);
  }
};

module.exports = {
  analyzePlacementReadiness,
};