const express = require("express");

const router = express.Router();

const {
  getAllProfiles,
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

// ==========================
// IMPORTANT: STATIC ROUTES FIRST
// ==========================
router.get("/all", getAllProfiles);

// ==========================
// SINGLE PROFILE
// ==========================
router.get("/:id", getProfile);

// ==========================
// UPDATE PROFILE
// ==========================
router.put("/:id", updateProfile);

module.exports = router;