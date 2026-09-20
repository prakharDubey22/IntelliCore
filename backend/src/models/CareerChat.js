const mongoose = require("mongoose");

const careerChatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
          required: true,
        },

        content: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
      },
  {
    timestamps: true,
  }
);

const CareerChat = mongoose.model(
  "CareerChat",
  careerChatSchema
);

module.exports = CareerChat;