const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Basic information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // Profile information
    phone: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    bio: {
      type: String,
      trim: true,
    },

    // Education
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

        graduationYear: {
          type: Number,
        },
      },
    ],

    // Skills
    skills: [
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

const User = mongoose.model("User", userSchema);

module.exports = User;