const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const studentOwnershipMiddleware = require(
  "../middleware/studentOwnershipMiddleware"
);

const {
  uploadResume,
  getResume,
  downloadResume,
  deleteResume,
  analyzeResume,
} = require("../controllers/resumeController");

// ==========================================
// TEST
// ==========================================

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Resume Route Working",
  });
});

// ==========================================
// UPLOAD RESUME
// ==========================================
// IMPORTANT:
// Do NOT use studentOwnershipMiddleware here.
// Multer/FormData is parsed inside resumeController.
// The controller uses req.user.id from JWT.

router.post(
  "/upload",
  authMiddleware,
  uploadResume
);

// ==========================================
// DOWNLOAD RESUME
// ==========================================

router.get(
  "/download/:userId",
  authMiddleware,
  studentOwnershipMiddleware,
  downloadResume
);

// ==========================================
// AI RESUME ANALYSIS
// ==========================================

router.get(
  "/analyze/:studentId",
  authMiddleware,
  studentOwnershipMiddleware,
  analyzeResume
);

// ==========================================
// GET RESUME
// ==========================================

router.get(
  "/:userId",
  authMiddleware,
  studentOwnershipMiddleware,
  getResume
);

// ==========================================
// DELETE RESUME
// ==========================================

router.delete(
  "/:userId",
  authMiddleware,
  studentOwnershipMiddleware,
  deleteResume
);

module.exports = router;