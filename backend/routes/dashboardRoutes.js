const express = require("express");

const router = express.Router();

const {
  getDashboard,
} = require("../controllers/dashboardController");

// Student dashboard
router.get("/:studentId", getDashboard);

module.exports = router;