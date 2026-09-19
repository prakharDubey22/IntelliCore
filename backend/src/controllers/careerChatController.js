const CareerChat = require("../models/CareerChat");
const { analyzeResume } = require("../services/aiService");

// Send a career question
const sendMessage = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        message: "Message must not exceed 2000 characters",
      });
    }

    let chat = await CareerChat.findOne({
      user: userId,
    });

    if (!chat) {
      chat = await CareerChat.create({
        user: userId,
        messages: [],
      });
    }

    chat.messages.push({
      role: "user",
      content: message,
    });

    const prompt = `
You are a career guidance assistant.

User's career question:
${message}

Conversation history:
${JSON.stringify(chat.messages, null, 2)}

Give a practical and concise answer.

Return ONLY this JSON structure:

{
  "answer": ""
}

Rules:
- answer must be a string.
- Focus on career, skills, jobs, interviews, learning paths, and placements.
- Do not return markdown.
- Do not add text outside the JSON.
`;

    const analysis = await analyzeResume({
      careerChatPrompt: prompt,
    });

    chat.messages.push({
      role: "assistant",
      content: analysis.answer || "",
    });

    await chat.save();

    res.status(200).json({
      message: "Career response generated successfully",
      chat,
    });
  } catch (error) {
    console.error("CAREER CHAT ERROR:", error.message);
    next(error);
  }
};

module.exports = {
  sendMessage,
};