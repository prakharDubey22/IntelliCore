const express = require("express");

const {
  analyzePlacementReadiness,
} = require("../controllers/placementReadinessController");

const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  analyzePlacementReadiness
);

module.exports = router;