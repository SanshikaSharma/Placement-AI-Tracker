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
// GET /api/resume/test
// ==========================================

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Resume Route Working",
  });
});

// ==========================================
// UPLOAD RESUME
// POST /api/resume/upload
// ==========================================

router.post(
  "/upload",
  authMiddleware,
  studentOwnershipMiddleware,
  uploadResume
);

// ==========================================
// DOWNLOAD RESUME
// IMPORTANT: BEFORE /:userId
// ==========================================

router.get(
  "/download/:userId",
  authMiddleware,
  studentOwnershipMiddleware,
  downloadResume
);
// ==========================================
// AI RESUME ANALYSIS
// IMPORTANT: BEFORE /:userId
// ==========================================

router.get(
  "/analyze/:studentId",
  authMiddleware,
  studentOwnershipMiddleware,
  analyzeResume
);

// ==========================================
// GET RESUME
// GET /api/resume/:userId
// ==========================================

router.get(
  "/:userId",
  authMiddleware,
  studentOwnershipMiddleware,
  getResume
);

// ==========================================
// DELETE RESUME
// DELETE /api/resume/:userId
// ==========================================

router.delete(
  "/:userId",
  authMiddleware,
  studentOwnershipMiddleware,
  deleteResume
);

module.exports = router;