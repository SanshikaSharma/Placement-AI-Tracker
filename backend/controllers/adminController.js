const User = require("../models/User");
const Company = require("../models/Company");
const Application = require("../models/Application");

const getAdminDashboard = async (req, res) => {
  
  console.log("ADMIN DASHBOARD API HIT");

  try {
    const users = await User.find();
    const companies = await Company.find();
    const applications = await Application.find();

    res.json({
      success: true,
      totalStudents: users.length,
      totalCompanies: companies.length,
      totalApplications: applications.length,
      selectedStudents: applications.filter(
        (app) => app.status === "Selected"
      ).length,
      recentApplications: [],
      recentCompanies: [],
    });

  } catch (error) {
    console.error("ADMIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
};

module.exports = {
  getAdminDashboard,
};