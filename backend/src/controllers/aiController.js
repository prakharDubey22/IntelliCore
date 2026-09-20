const Resume = require("../models/Resume");
const { analyzeResume } = require("../services/aiService");

const analyzeResumeController = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const resume = await Resume.findOne({ user: userId });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    const prompt = `
Analyze the following resume and provide a career analysis.

Resume:
${JSON.stringify(resume, null, 2)}

Return ONLY this JSON structure:

{
  "mainSkills": [],
  "strongAreas": [],
  "missingSkills": [],
  "suitableRoles": [],
  "suggestions": []
}

Rules:
- All fields must contain arrays of strings.
- Keep the analysis practical and relevant to the candidate.
- Do not return markdown.
- Do not add text outside the JSON.
`;

    const analysis = await analyzeResume({
      ...resume.toObject(),
      resumeAnalysisPrompt: prompt,
    });

    res.status(200).json({
      message: "Resume analyzed successfully",
      analysis,
    });
  } catch (error) {
    console.error("AI ERROR:", error.message);

    next(error);
  }
};

module.exports = {
  analyzeResumeController,
};