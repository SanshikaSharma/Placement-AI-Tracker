const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
  uploadResume,
  getResume,
  downloadResume,
  deleteResume,
} = require("../controllers/resumeController");

router.post(
  "/upload",
  upload.single("resume"),
  uploadResume
);

router.get("/:userId", getResume);

router.get("/download/:userId", downloadResume);

router.delete("/:userId", deleteResume);

module.exports = router;