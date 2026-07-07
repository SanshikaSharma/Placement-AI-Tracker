const express = require("express");
const Placement = require("../models/Placement");

const router = express.Router();

// Create Placement
router.post("/create", async (req, res) => {
  try {
    const placement = await Placement.create(req.body);

    res.status(201).json({
      success: true,
      placement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get All Placements
router.get("/all", async (req, res) => {
  try {
    const placements = await Placement.find();

    res.json({
      success: true,
      placements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;