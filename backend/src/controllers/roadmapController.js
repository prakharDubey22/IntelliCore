const Resume = require("../models/Resume");
const Roadmap = require("../models/Roadmap");
const { analyzeResume } = require("../services/aiService");

const generateRoadmap = async (req, res, next) => {
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
Create a practical career roadmap for this candidate.

Target Role:
${targetRole}

Candidate Resume:
${JSON.stringify(resume, null, 2)}

The candidate is a B.Tech student preparing for placements.

Return ONLY this JSON structure:

{
  "currentLevel": "",
  "phases": [
    {
      "title": "",
      "duration": "",
      "skills": [],
      "tasks": []
    }
  ]
}

Rules:
- currentLevel should describe the candidate's current level.
- Create 4 to 6 learning phases.
- Each phase must have a title.
- Each phase must have a realistic duration.
- skills must be an array of strings.
- tasks must be an array of practical tasks or projects.
- Make the roadmap practical for placement preparation.
- Do not return markdown.
- Do not add text outside the JSON.
`;

    const analysis = await analyzeResume({
      ...resume.toObject(),
      roadmapPrompt: prompt,
    });

    const roadmap = await Roadmap.create({
      user: userId,
      targetRole,
      currentLevel: analysis.currentLevel || "",
      phases: analysis.phases || [],
    });

    res.status(200).json({
      message: "Career roadmap generated successfully",
      roadmap,
    });
  } catch (error) {
    console.error("ROADMAP ERROR:", error.message);

    next(error);
  }
};

module.exports = {
  generateRoadmap,
};