const User = require("../models/User");
const Resume = require("../models/Resume");
const SkillGap = require("../models/SkillGap");
const PlacementReadiness = require("../models/PlacementReadiness");
const Roadmap = require("../models/Roadmap");
const Interview = require("../models/Interview");
const CareerChat = require("../models/CareerChat");

const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const [
      user,
      resume,
      skillGap,
      placementReadiness,
      roadmap,
      interviews,
      careerChat,
    ] = await Promise.all([
      User.findById(userId).select("-password"),
      Resume.findOne({ user: userId }),
      SkillGap.find({ user: userId }).sort({ createdAt: -1 }),
      PlacementReadiness.find({ user: userId }).sort({ createdAt: -1 }),
      Roadmap.find({ user: userId }).sort({ createdAt: -1 }),
      Interview.find({ user: userId }).sort({ createdAt: -1 }),
      CareerChat.findOne({ user: userId }),
    ]);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Dashboard data fetched successfully",

      dashboard: {
        user,
        resume,
        skillGap,
        placementReadiness,
        roadmap,
        interviews,
        careerChat,
      },
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error.message);

    next(error);
  }
};

module.exports = {
  getDashboard,
};