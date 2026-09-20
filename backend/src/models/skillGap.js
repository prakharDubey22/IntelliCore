const mongoose = require("mongoose");

const skillGapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetRole: {
      type: String,
      required: true,
      trim: true,
    },

    currentSkills: [
      {
        type: String,
        trim: true,
      },
    ],

    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],

    missingSkills: [
      {
        type: String,
        trim: true,
      },
    ],

    recommendations: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const SkillGap = mongoose.model("SkillGap", skillGapSchema);

module.exports = SkillGap;