const express = require("express");

const router = express.Router();

const {
  getCareerAnalytics,
} = require("../controllers/careerAnalyticsController");

const authMiddleware = require("../middleware/authMiddleware");
const studentOwnershipMiddleware = require(
  "../middleware/studentOwnershipMiddleware"
);

router.get(
  "/:studentId",
  authMiddleware,
  studentOwnershipMiddleware,
  getCareerAnalytics
);

module.exports = router;