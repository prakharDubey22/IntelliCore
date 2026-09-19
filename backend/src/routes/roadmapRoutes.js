const express = require("express");

const {
  generateRoadmap,
} = require("../controllers/roadmapController");

const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  generateRoadmap
);

module.exports = router;