const express = require("express");

const router = express.Router();

const {
  analyzeUserResume,
} = require("../controllers/aiResumeController");

router.get("/analyze/:userId", analyzeUserResume);

module.exports = router;