const mongoose = require("mongoose");

const placementReadinessSchema = new mongoose.Schema(
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

    technicalSkills: {
      type: Number,
      min: 0,
      max: 100,
    },

    projects: {
      type: Number,
      min: 0,
      max: 100,
    },

    experience: {
      type: Number,
      min: 0,
      max: 100,
    },

    resumeQuality: {
      type: Number,
      min: 0,
      max: 100,
    },

    interviewPreparation: {
      type: Number,
      min: 0,
      max: 100,
    },

    overallScore: {
      type: Number,
      min: 0,
      max: 100,
    },

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

const PlacementReadiness = mongoose.model(
  "PlacementReadiness",
  placementReadinessSchema
);

module.exports = PlacementReadiness;