const express = require("express");

const {
  getDashboard,
} = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getDashboard
);

module.exports = router;