const express = require("express");
const upload = require("../config/multer");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const analyzeResume = require("../services/resumeAnalyzer");


// ==================== Upload Resume ====================
router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.resume = {
      fileName: req.file.filename,
      originalName: req.file.originalname,
      filePath: path.resolve(req.file.path),
      uploadedAt: new Date(),
    };

    await user.save();

    res.json({
      success: true,
      message: "Resume uploaded successfully",
      file: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==================== Preview Resume ====================
router.get("/preview", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || !user.resume.filePath) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    if (!fs.existsSync(user.resume.filePath)) {
      return res.status(404).json({
        success: false,
        message: "Resume file missing",
      });
    }

    res.sendFile(user.resume.filePath);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==================== Download Resume ====================
router.get("/download", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || !user.resume.filePath) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.download(
      user.resume.filePath,
      user.resume.originalName
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==================== Delete Resume ====================
router.delete("/delete", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || !user.resume.filePath) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    if (fs.existsSync(user.resume.filePath)) {
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
});

// ==================== Replace Resume ====================
router.put("/replace", upload.single("resume"), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

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
      fileName: req.file.filename,
      originalName: req.file.originalname,
      filePath: path.resolve(req.file.path),
      uploadedAt: new Date(),
    };

    await user.save();

    res.json({
      success: true,
      message: "Resume replaced successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// ==================== Analyze Resume ====================
router.get("/analyze", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || !user.resume.filePath) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const analysis = await analyzeResume(user.resume.filePath);

    res.json({
      success: true,
      analysis,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
module.exports = router;