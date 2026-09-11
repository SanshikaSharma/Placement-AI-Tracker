const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

// Routes
const profileRoutes = require("./routes/profileRoutes");
const authRoutes = require("./routes/authRoutes");
const placementRoutes = require("./routes/placementRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const companyRoutes = require("./routes/companyRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const aiResumeRoutes = require("./routes/aiResumeRoutes");
const eligibilityRoutes = require("./routes/eligibilityRoutes");
const adminRoutes = require("./routes/adminRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const careerAnalyticsRoutes = require("./routes/careerAnalyticsRoutes");

// Connect Database
connectDB();

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// Static uploads
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// ===============================
// TEST ROUTE
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Placement AI Tracker API Running 🚀",
  });
});

// ===============================
// API ROUTES
// ===============================

app.use(
  "/api/profile",
  profileRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/placement",
  placementRoutes
);

app.use(
  "/api/resume",
  resumeRoutes
);

app.use(
  "/api/company",
  companyRoutes
);

app.use(
  "/api/application",
  applicationRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/ai",
  aiResumeRoutes
);

app.use(
  "/api/eligibility",
  eligibilityRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/recommendations",
  recommendationRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/interview",
  interviewRoutes
);

app.use(
  "/api/career-analytics",
  careerAnalyticsRoutes
);

// ===============================
// 404 HANDLER
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ===============================
// GLOBAL ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {
  console.error(
    "Server Error:",
    err.message
  );

  res.status(
    err.status || 500
  ).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// ===============================
// START SERVER
// ===============================

const PORT =
  process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});