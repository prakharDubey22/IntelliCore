const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema(
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

    currentLevel: {
      type: String,
      trim: true,
    },

    phases: [
      {
        title: {
          type: String,
          trim: true,
        },

        duration: {
          type: String,
          trim: true,
        },

        skills: [
          {
            type: String,
            trim: true,
          },
        ],

        tasks: [
          {
            type: String,
            trim: true,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Roadmap = mongoose.model("Roadmap", roadmapSchema);

module.exports = Roadmap;