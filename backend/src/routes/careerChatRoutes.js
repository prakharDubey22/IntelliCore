const express = require("express");

const {
  sendMessage,
} = require("../controllers/careerChatController");

const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

// Send career message
router.post(
  "/",
  authMiddleware,
  sendMessage
);

module.exports = router;