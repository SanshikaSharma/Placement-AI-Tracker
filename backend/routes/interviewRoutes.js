const express = require("express");

const router = express.Router();

const {
  getInterviewQuestion,
  evaluateAnswer,
  getInterviewHistory,
  deleteInterviewHistory,
} = require("../controllers/interviewController");


router.get(
  "/question",
  getInterviewQuestion
);


router.post(
  "/evaluate",
  evaluateAnswer
);


router.get(
  "/history/:studentId",
  getInterviewHistory
);


router.delete(
  "/history/:studentId",
  deleteInterviewHistory
);


module.exports = router;