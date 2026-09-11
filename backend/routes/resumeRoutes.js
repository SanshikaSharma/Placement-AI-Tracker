const express = require("express");

const router = express.Router();

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
  uploadResume
);

// ==========================================
// DOWNLOAD RESUME
// IMPORTANT: BEFORE /:userId
// ==========================================

router.get(
  "/download/:userId",
  downloadResume
);

// ==========================================
// AI RESUME ANALYSIS
// IMPORTANT: BEFORE /:userId
// ==========================================

router.get(
  "/analyze/:studentId",
  analyzeResume
);

// ==========================================
// GET RESUME
// GET /api/resume/:userId
// ==========================================

router.get(
  "/:userId",
  getResume
);

// ==========================================
// DELETE RESUME
// DELETE /api/resume/:userId
// ==========================================

router.delete(
  "/:userId",
  deleteResume
);

module.exports = router;