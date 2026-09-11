const express = require("express");

const router = express.Router();

const {
  getRecommendations,
} = require("../controllers/recommendationController");

// ======================================
// GET RECOMMENDED COMPANIES
// ======================================

router.get(
  "/:studentId",
  getRecommendations
);

module.exports = router;