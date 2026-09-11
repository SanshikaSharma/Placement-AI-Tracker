const express = require("express");

const router = express.Router();

const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getDashboardStats,
  getAnalytics,
  getAllStudents,
  getStudentDetails,
  getStudentResume,
  deleteStudent,
  getAllCompanies,
  deleteCompany,
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
} = require("../controllers/adminController");

// ======================================================
// ADMIN AUTHENTICATION
// ======================================================

router.use(adminMiddleware);

// ======================================================
// ADMIN DASHBOARD
// ======================================================

router.get("/dashboard", getDashboardStats);

router.get("/analytics", getAnalytics);

// ======================================================
// STUDENTS
// ======================================================

router.get("/students", getAllStudents);

router.get("/student/:id", getStudentDetails);

router.get("/student/:id/resume", getStudentResume);

router.delete("/student/:id", deleteStudent);

// ======================================================
// COMPANIES
// ======================================================

router.get("/companies", getAllCompanies);

router.delete("/company/:id", deleteCompany);

// ======================================================
// APPLICATIONS
// ======================================================

router.get("/applications", getAllApplications);

router.put(
  "/application/:id",
  updateApplicationStatus
);

router.delete(
  "/application/:id",
  deleteApplication
);

// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;