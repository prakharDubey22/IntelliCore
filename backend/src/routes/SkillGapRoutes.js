const express = require("express");

const {
  analyzeSkillGap,
} = require("../controllers/skillGapController");

const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  analyzeSkillGap
);

module.exports = router;