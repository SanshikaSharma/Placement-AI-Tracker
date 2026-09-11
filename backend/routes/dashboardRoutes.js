const express = require("express");

const router = express.Router();

const {
  getDashboard,
} = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");
const studentOwnershipMiddleware = require(
  "../middleware/studentOwnershipMiddleware"
);

// Student dashboard
router.get(
  "/:studentId",
  authMiddleware,
  studentOwnershipMiddleware,
  getDashboard
);

module.exports = router;