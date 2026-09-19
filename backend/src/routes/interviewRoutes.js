const express = require("express");

const {
  startInterview,
  generateQuestions,
  submitAnswer,
  getInterview,
} = require("../controllers/interviewController");

const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

// Start interview
router.post(
  "/start",
  authMiddleware,
  startInterview
);

// Generate interview questions
router.post(
  "/questions",
  authMiddleware,
  generateQuestions
);

// Submit an answer
router.post(
  "/:id/answer",
  authMiddleware,
  submitAnswer
);

// Get interview
router.get(
  "/:id",
  authMiddleware,
  getInterview
);

module.exports = router;