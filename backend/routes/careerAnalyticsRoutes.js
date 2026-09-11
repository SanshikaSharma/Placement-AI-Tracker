const express = require("express");

const router = express.Router();

const {
  getCareerAnalytics,
} = require("../controllers/careerAnalyticsController");

router.get(
  "/:studentId",
  getCareerAnalytics
);

module.exports = router;