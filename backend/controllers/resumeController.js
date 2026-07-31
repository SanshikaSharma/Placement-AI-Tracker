const User = require("../models/User");
const fs = require("fs");
const path = require("path");

// Upload Resume
const uploadResume = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete previous resume
    if (
      user.resume?.filePath &&
      fs.existsSync(user.resume.filePath)
    ) {
      fs.unlinkSync(user.resume.filePath);
    }

    user.resume = {
      fileName: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      uploadedAt: new Date(),
    };

    await user.save();

    res.json({
      success: true,
      message: "Resume uploaded successfully",
      resume: user.resume,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Resume Details
const getResume = async (req, res) => {
  try {

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      resume: user.resume,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Download Resume
const downloadResume = async (req, res) => {
  try {

    const user = await User.findById(req.params.userId);

    if (!user || !user.resume.filePath) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.download(
      path.resolve(user.resume.filePath),
      user.resume.originalName
    );

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Resume
const deleteResume = async (req, res) => {
  try {

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      user.resume.filePath &&
      fs.existsSync(user.resume.filePath)
    ) {
      fs.unlinkSync(user.resume.filePath);
    }

    user.resume = {
      fileName: "",
      originalName: "",
      filePath: "",
      uploadedAt: null,
    };

    await user.save();

    res.json({
      success: true,
      message: "Resume deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  uploadResume,
  getResume,
  downloadResume,
  deleteResume,
};