const User = require("../models/User");
const Company = require("../models/Company");
const calculateEligibility = require("../utils/eligibilityChecker");

// ==========================================
// CHECK STUDENT ELIGIBILITY FOR COMPANY
// ==========================================
const checkEligibility = async (req, res) => {
  try {
    const { studentId, companyId } = req.params;

    // Find student
    const user = await User.findById(studentId);

    // Find company
    const company = await Company.findById(companyId);

    // Validate records
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Calculate eligibility
    const analysis = calculateEligibility(user, company);

    return res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Eligibility Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  checkEligibility,
};