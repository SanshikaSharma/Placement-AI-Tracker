const fs = require("fs");
const pdf = require("pdf-parse");
const User = require("../models/User");
const analyzeResume = require("../utils/resumeAnalyzer");

const analyzeUserResume = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.resume || !user.resume.filePath) {
      return res.status(404).json({
        success: false,
        message: "Resume not uploaded",
      });
    }

    if (!fs.existsSync(user.resume.filePath)) {
      return res.status(404).json({
        success: false,
        message: "Resume file not found",
      });
    }

    // Read resume PDF
    const pdfBuffer = fs.readFileSync(user.resume.filePath);

    // Extract PDF text
    const pdfData = await pdf(pdfBuffer);

    // Analyze resume
    const result = analyzeResume(pdfData.text);

    // Extract profile information
    const profile = result.extractedProfile || {};

    // Update only information that was actually found
    const updateData = {};

    if (profile.skills && profile.skills.length > 0) {
      updateData.skills = profile.skills;
    }

    if (profile.projects && profile.projects.length > 0) {
      updateData.projects = profile.projects;
    }

    if (profile.certifications && profile.certifications.length > 0) {
      updateData.certifications = profile.certifications;
    }

    if (profile.phone) {
      updateData.phone = profile.phone;
    }

    if (profile.linkedin) {
      updateData.linkedin = profile.linkedin;
    }

    if (profile.github) {
      updateData.github = profile.github;
    }

    if (profile.cgpa && profile.cgpa > 0) {
      updateData.cgpa = profile.cgpa;
    }

    if (profile.address) {
      updateData.address = profile.address;
    }

    // Do not overwrite existing name/email with empty values
    if (!user.name && profile.name) {
      updateData.name = profile.name;
    }

    if (!user.email && profile.email) {
      updateData.email = profile.email;
    }

    // Save extracted profile data
    if (Object.keys(updateData).length > 0) {
      await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      );
    }

    // Return AI analysis
    res.status(200).json({
      success: true,
      message: "Resume analyzed and profile updated successfully",
      analysis: result,
      profileUpdated: updateData,
    });
  } catch (error) {
    console.error("AI Resume Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  analyzeUserResume,
};