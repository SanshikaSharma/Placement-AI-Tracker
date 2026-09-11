const express = require("express");

const router = express.Router();

const {
  getRecommendations,
} = require("../controllers/recommendationController");

const authMiddleware = require("../middleware/authMiddleware");
const studentOwnershipMiddleware = require(
  "../middleware/studentOwnershipMiddleware"
);

router.get(
  "/:studentId",
  authMiddleware,
  studentOwnershipMiddleware,
  getRecommendations
);

module.exports = router;