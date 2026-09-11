const express = require("express");

const router = express.Router();

const {
  applyToCompany,
  getMyApplications,
  updateApplicationStatus,
  withdrawApplication,
  getAllApplications,
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const studentOwnershipMiddleware = require(
  "../middleware/studentOwnershipMiddleware"
);


// Student applies to company
router.post(
  "/apply",
  authMiddleware,
  applyToCompany
);


// Student gets own applications
router.get(
  "/student/:studentId",
  authMiddleware,
  studentOwnershipMiddleware,
  getMyApplications
);


// Admin gets all applications
router.get(
  "/all",
  adminMiddleware,
  getAllApplications
);


// Admin updates application status
router.put(
  "/:id/status",
  adminMiddleware,
  updateApplicationStatus
);


// Student/admin withdraws application
router.delete(
  "/:id",
  authMiddleware,
  withdrawApplication
);


module.exports = router;