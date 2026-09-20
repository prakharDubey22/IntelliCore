const Resume = require("../models/Resume");
const SkillGap = require("../models/SkillGap");
const { analyzeResume } = require("../services/aiService");

const analyzeSkillGap = async (req, res, next) => {
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
Analyze the candidate's skill gap for the target job role.

Target Role:
${targetRole}

Current Resume:
${JSON.stringify(resume, null, 2)}

Return ONLY this JSON structure:

{
  "currentSkills": [],
  "requiredSkills": [],
  "missingSkills": [],
  "recommendations": []
}

Rules:
- All skills must be strings.
- currentSkills should contain skills already present.
- requiredSkills should contain skills normally required for the target role.
- missingSkills should contain required skills that the candidate does not currently have.
- recommendations should contain practical learning recommendations.
- Do not return markdown.
- Do not add text outside the JSON.
`;

    const analysis = await analyzeResume({
      ...resume.toObject(),
      skillGapPrompt: prompt,
    });

    const skillGap = await SkillGap.create({
      user: userId,
      targetRole,
      currentSkills: analysis.currentSkills || [],
      requiredSkills: analysis.requiredSkills || [],
      missingSkills: analysis.missingSkills || [],
      recommendations: analysis.recommendations || [],
    });

    res.status(200).json({
      message: "Skill gap analysis completed",
      skillGap,
    });
  } catch (error) {
    console.error("SKILL GAP ERROR:", error.message);

    next(error);
  }
};

module.exports = {
  analyzeSkillGap,
};