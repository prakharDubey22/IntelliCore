const Resume = require("../models/Resume");

const createResume = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const {
      summary,
      education,
      skills,
      experience,
      projects,
      certifications,
    } = req.body;

    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({
        message: "Skills must be provided as an array",
      });
    }

    const resume = await Resume.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        summary,
        education,
        skills,
        experience,
        projects,
        certifications,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Resume saved successfully",
      resume,
    });
  } catch (error) {
    console.error("RESUME SAVE ERROR:", error.message);

    next(error);
  }
};

const getResume = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const resume = await Resume.findOne({
      user: userId,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    res.status(200).json({
      message: "Resume fetched successfully",
      resume,
    });
  } catch (error) {
    console.error("RESUME FETCH ERROR:", error.message);

    next(error);
  }
};

module.exports = {
  createResume,
  getResume,
};