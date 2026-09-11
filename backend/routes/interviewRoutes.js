const express = require("express");

const router = express.Router();

const {
  getInterviewQuestion,
  evaluateAnswer,
  getInterviewHistory,
  deleteInterviewHistory,
} = require("../controllers/interviewController");

const authMiddleware = require("../middleware/authMiddleware");
const studentOwnershipMiddleware = require(
  "../middleware/studentOwnershipMiddleware"
);

// Get random interview question
router.get(
  "/question",
  authMiddleware,
  getInterviewQuestion
);

// Evaluate student's answer
router.post(
  "/evaluate",
  authMiddleware,
  studentOwnershipMiddleware,
  evaluateAnswer
);

// Get student's interview history
router.get(
  "/history/:studentId",
  authMiddleware,
  studentOwnershipMiddleware,
  getInterviewHistory
);

// Delete student's interview history
router.delete(
  "/history/:studentId",
  authMiddleware,
  studentOwnershipMiddleware,
  deleteInterviewHistory
);

module.exports = router;