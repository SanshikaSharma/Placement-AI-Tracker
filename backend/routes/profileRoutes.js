
const express = require("express");
const Profile = require("../models/Profile");

const router = express.Router();

// Test route
router.get("/", (req, res) => {
  res.send("Profile Route Working");
});

// GET all profiles
router.get("/all", async (req, res) => {
  try {
    const profiles = await Profile.find();

    res.json({
      success: true,
      profiles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// CREATE profile
router.post("/create", async (req, res) => {
  try {
    const { name, email } = req.body;

    const profile = await Profile.create({ name, email });

    res.status(201).json({
      success: true,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ❌ DELETE profile (NEW)
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Profile.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const updatedProfile = await Profile.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.json({
      success: true,
      profile: updatedProfile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
module.exports = router;
// Get Single Profile
router.get("/:id", async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});