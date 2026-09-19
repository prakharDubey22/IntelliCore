const express = require("express");
const resumeRoutes = require("./routes/resumeRoutes");
const aiRoutes = require("./routes/aiRoutes");
const authRoutes = require("./routes/authRoutes");
const userroutes = require("./routes/userroutes");
const skillGapRoutes = require("./routes/skillGapRoutes");
const placementReadinessRoutes = require("./routes/placementReadinessRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const careerChatRoutes = require("./routes/careerChatRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userroutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/skill-gap", skillGapRoutes);
app.use(
  "/api/placement-readiness",
  placementReadinessRoutes
);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/career-chat", careerChatRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(errorMiddleware);

module.exports = app;