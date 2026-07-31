const express = require("express");

const router = express.Router();

const {
  applyToCompany,
  getMyApplications,
  updateApplicationStatus,
  withdrawApplication,
  getAllApplications,
} = require("../controllers/applicationController");

// Apply
router.post("/apply", applyToCompany);

// Student Applications
router.get("/student/:studentId", getMyApplications);

// ⭐ New Route
router.get("/all", getAllApplications);

// Update Status
router.put("/:id/status", updateApplicationStatus);

// Withdraw
router.delete("/:id", withdrawApplication);

module.exports = router;