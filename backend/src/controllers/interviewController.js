const Interview = require("../models/Interview");
const Resume = require("../models/Resume");
const { analyzeResume } = require("../services/aiService");

// Start a new interview
const startInterview = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { targetRole } = req.body;

    if (!targetRole) {
      return res.status(400).json({
        message: "Target role is required",
      });
    }

    const interview = await Interview.create({
      user: userId,
      targetRole,
      questions: [],
    });

    res.status(201).json({
      message: "Interview started successfully",
      interview,
    });
  } catch (error) {
    console.error("INTERVIEW ERROR:", error.message);
    next(error);
  }
};

// Generate interview questions
const generateQuestions = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { targetRole } = req.body;

    if (!targetRole) {
      return res.status(400).json({
        message: "Target role is required",
      });
    }

    const resume = await Resume.findOne({
      user: userId,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    const prompt = `
Generate 5 technical interview questions for a candidate applying for:

Target Role:
${targetRole}

Candidate Resume:
${JSON.stringify(resume, null, 2)}

Requirements:
1. Questions should match the candidate's current skills.
2. Include easy, medium, and difficult questions.
3. Focus on practical technical interview questions.

Return ONLY this JSON structure:

{
  "questions": [
    {
      "question": "",
      "difficulty": ""
    }
  ]
}

Rules:
- Generate exactly 5 questions.
- difficulty must be Easy, Medium, or Hard.
- Do not return markdown.
- Do not add text outside the JSON.
`;

    const analysis = await analyzeResume({
      ...resume.toObject(),
      interviewPrompt: prompt,
    });

    res.status(200).json({
      message: "Interview questions generated successfully",
      questions: analysis.questions || [],
    });
  } catch (error) {
    console.error("INTERVIEW QUESTION ERROR:", error.message);
    next(error);
  }
};

// Submit an answer
const submitAnswer = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        message: "Question and answer are required",
      });
    }

    if (answer.length > 5000) {
      return res.status(400).json({
        message: "Answer must not exceed 5000 characters",
      });
    }

    const interview = await Interview.findOne({
      _id: id,
      user: userId,
    });

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    const prompt = `
Evaluate the following interview answer.

Target Role:
${interview.targetRole}

Question:
${question}

Candidate Answer:
${answer}

Evaluate based on:
1. Technical correctness
2. Understanding
3. Clarity
4. Practical knowledge

Return ONLY this JSON structure:

{
  "score": 0,
  "feedback": "",
  "strengths": [],
  "improvements": []
}

Rules:
- score must be a number from 0 to 10.
- feedback must be a short explanation.
- strengths must be an array of strings.
- improvements must be an array of strings.
- Do not return markdown.
- Do not add text outside the JSON.
`;

    const analysis = await analyzeResume({
      interviewPrompt: prompt,
    });

    interview.questions.push({
      question,
      answer,
      feedback: JSON.stringify({
        feedback: analysis.feedback || "",
        strengths: analysis.strengths || [],
        improvements: analysis.improvements || [],
      }),
      score: analysis.score,
    });

    await interview.save();

    res.status(200).json({
      message: "Answer evaluated successfully",
      interview,
    });
  } catch (error) {
    console.error("INTERVIEW ANSWER ERROR:", error.message);
    next(error);
  }
};

// Get interview
const getInterview = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const interview = await Interview.findOne({
      _id: id,
      user: userId,
    });

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    res.status(200).json({
      message: "Interview fetched successfully",
      interview,
    });
  } catch (error) {
    console.error("GET INTERVIEW ERROR:", error.message);
    next(error);
  }
};

module.exports = {
  startInterview,
  generateQuestions,
  submitAnswer,
  getInterview,
};