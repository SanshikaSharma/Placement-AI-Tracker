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

    // Read Resume PDF
    const pdfBuffer = fs.readFileSync(user.resume.filePath);

    // Extract text from PDF
    const pdfData = await pdf(pdfBuffer);

    // Analyze extracted text
    const result = analyzeResume(pdfData.text);

    res.status(200).json({
      success: true,
      analysis: result,
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