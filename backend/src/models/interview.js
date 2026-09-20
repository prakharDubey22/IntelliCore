const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
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

    questions: [
      {
        question: {
          type: String,
          trim: true,
        },

        answer: {
          type: String,
          trim: true,
        },

        feedback: {
          type: String,
          trim: true,
        },

        score: {
          type: Number,
          min: 0,
          max: 10,
        },
      },
    ],

    overallScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    overallFeedback: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model("Interview", interviewSchema);

module.exports = Interview;