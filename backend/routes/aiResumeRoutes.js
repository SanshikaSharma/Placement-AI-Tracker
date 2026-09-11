const express = require("express");

const router = express.Router();

const {
  analyzeUserResume,
} = require("../controllers/aiResumeController");

const authMiddleware = require("../middleware/authMiddleware");
const studentOwnershipMiddleware = require(
  "../middleware/studentOwnershipMiddleware"
);

router.get(
  "/analyze/:userId",
  authMiddleware,
  studentOwnershipMiddleware,
  analyzeUserResume
);

module.exports = router;