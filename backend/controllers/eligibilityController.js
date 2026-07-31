const User = require("../models/User");
const Company = require("../models/Company");
const calculateEligibility = require("../utils/eligibilityChecker");

const checkEligibility = async (req, res) => {
  try {
    const { studentId, companyId } = req.params;

    const user = await User.findById(studentId);
    const company = await Company.findById(companyId);

    if (!user || !company) {
      return res.status(404).json({
        success: false,
        message: "User or Company not found",
      });
    }

    const analysis = calculateEligibility(user, company);

    res.status(200).json({
      success: true,
      analysis,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  checkEligibility,
};