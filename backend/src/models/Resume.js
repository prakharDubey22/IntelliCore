const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    summary: {
      type: String,
      trim: true,
    },

    education: [
      {
        degree: {
          type: String,
          trim: true,
        },

        institution: {
          type: String,
          trim: true,
        },

        fieldOfStudy: {
          type: String,
          trim: true,
        },

        startYear: {
          type: Number,
        },

        endYear: {
          type: Number,
        },
      },
    ],

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    experience: [
      {
        company: {
          type: String,
          trim: true,
        },

        role: {
          type: String,
          trim: true,
        },

        startDate: {
          type: String,
        },

        endDate: {
          type: String,
        },

        description: {
          type: String,
          trim: true,
        },
      },
    ],

    projects: [
      {
        title: {
          type: String,
          trim: true,
        },

        description: {
          type: String,
          trim: true,
        },

        technologies: [
          {
            type: String,
            trim: true,
          },
        ],
      },
    ],

    certifications: [
      {
        name: {
          type: String,
          trim: true,
        },

        organization: {
          type: String,
          trim: true,
        },

        year: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;