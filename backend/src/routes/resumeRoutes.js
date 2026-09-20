const express = require("express");

const {
  createResume,
  getResume,
} = require("../controllers/resumeController");

const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

router.post("/", authMiddleware, createResume);

router.get("/", authMiddleware, getResume);

module.exports = router;