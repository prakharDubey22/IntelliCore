
const express = require("express");
const cors = require("cors");

const resumeRoutes = require("./routes/resumeRoutes");
const aiRoutes = require("./routes/aiRoutes");
const authRoutes = require("./routes/authRoutes");
const userroutes = require("./routes/userroutes");
const skillGapRoutes = require("./routes/SkillGapRoutes");
const placementReadinessRoutes = require("./routes/placementReadinessRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const careerChatRoutes = require("./routes/careerChatRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const placementProfileRoutes = require("./routes/placementProfileRoutes");
const mlPredictionRoutes = require("./routes/mlPredictionRoutes");

const app = express();

// CORS must be configured after creating the app
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userroutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/skill-gap", skillGapRoutes);
app.use("/api/placement-readiness", placementReadinessRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/career-chat", careerChatRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/placement-profile", placementProfileRoutes);
app.use("/api/ml-prediction", mlPredictionRoutes);

// Error handling
app.use(errorMiddleware);

module.exports = app;
