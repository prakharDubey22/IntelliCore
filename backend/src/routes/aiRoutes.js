const express = require("express");

const {
  analyzeResumeController,
} = require("../controllers/aiController");

const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

router.post(
  "/analyze-resume",
  authMiddleware,
  analyzeResumeController
);

module.exports = router;