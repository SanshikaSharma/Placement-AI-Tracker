const express = require("express");
const Application = require("../models/Application");

const router = express.Router();

// Add Application
router.post("/add", async (req, res) => {
  try {
    const application = await Application.create(req.body);

    res.status(201).json({
      success: true,
      message: "Application added successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get All Applications
router.get("/all", async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("company")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update Status
router.put("/update/:id", async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.json({
      success: true,
      message: "Application updated successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete Application
router.delete("/delete/:id", async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(
      req.params.id
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;