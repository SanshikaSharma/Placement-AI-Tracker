const mongoose = require("mongoose");

const User = require("../models/User");
const Company = require("../models/Company");

const calculateRecommendationScore = require(
  "../utils/recommendationEngine"
);

// ======================================
// GET RECOMMENDED COMPANIES
// ======================================
const getRecommendations = async (req, res) => {
  try {
    const { studentId } = req.params;

    // ----------------------------------
    // Validate Student ID
    // ----------------------------------
    if (
      !studentId ||
      !mongoose.Types.ObjectId.isValid(studentId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Student ID.",
      });
    }

    // ----------------------------------
    // Find Student
    // ----------------------------------
    const user = await User.findById(studentId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    // ----------------------------------
    // Get Open Companies
    // ----------------------------------
    const companies = await Company.find({
      status: { $ne: "Closed" },
    }).sort({
      deadline: 1,
    });

    // ----------------------------------
    // Calculate Recommendation
    // ----------------------------------
    const recommendations = companies
      .map((company) => {
        const analysis =
          calculateRecommendationScore(
            user,
            company
          );

        return {
          company,
          score: analysis.score,
          recommendation:
            analysis.recommendation,
          reasons: analysis.reasons,
          missingSkills:
            analysis.missingSkills,
        };
      })
      .filter(
        (item) => item.company.deadline &&
          new Date(item.company.deadline) >= new Date()
      )
      .sort((a, b) => b.score - a.score);

    return res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (error) {
    console.error(
      "Recommendation Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to generate recommendations.",
    });
  }
};

module.exports = {
  getRecommendations,
};