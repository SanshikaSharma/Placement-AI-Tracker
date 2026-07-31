const Company = require("../models/Company");
const Application = require("../models/Application");
const User = require("../models/User");

const getDashboard = async (req, res) => {
  try {
    const totalCompanies = await Company.countDocuments();

    const totalApplications = await Application.countDocuments();

    const selected = await Application.countDocuments({
      status: "Selected",
    });

    const pending = await Application.countDocuments({
     status: "Applied"
    });

    const recentApplications = await Application.find()
    .populate("company", "companyName")
      .sort({ createdAt: -1 })
      .limit(5);

    const upcomingCompanies = await Company.find()
      .sort({ driveDate: 1 })
      .limit(5);

    res.json({
      success: true,

      totalCompanies,
      totalApplications,
      selected,
      pending,

      recentApplications,
      upcomingCompanies,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
};