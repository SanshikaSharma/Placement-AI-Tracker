const express = require("express");

const router = express.Router();

const {
  getAdminDashboard,
} = require("../controllers/adminController");

router.get("/dashboard", getAdminDashboard);

console.log("Admin Route Initialized");
module.exports = router;