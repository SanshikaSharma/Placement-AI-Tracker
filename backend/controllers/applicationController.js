const Application = require("../models/Application");
const Company = require("../models/Company");

// =============================
// APPLY TO COMPANY
// =============================
const Application = require("../models/Application");

const applyToCompany = async (req, res) => {
  try {
    const { companyId, studentId } = req.body;

    if (!companyId || !studentId) {
      return res.status(400).json({
        success: false,
        message: "Company ID and Student ID are required.",
      });
    }

    const alreadyApplied = await Application.findOne({
      company: companyId,
      student: studentId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "Already Applied.",
      });
    }

    const application = await Application.create({
      company: companyId,
      student: studentId,
      status: "Applied",
      appliedDate: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Application Submitted Successfully",
      application,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =============================
// GET MY APPLICATIONS
// =============================
const getMyApplications = async (req, res) => {
  try {
    const { studentId } = req.params;

    const applications = await Application.find({
      student: studentId,
    })
      .populate("company")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// UPDATE STATUS (Admin)
// =============================
const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
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
      message: "Status Updated",
      application,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// WITHDRAW APPLICATION
// =============================
const withdrawApplication = async (req, res) => {
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
      message: "Application Withdrawn Successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =============================
// GET ALL APPLICATIONS
// =============================
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("company")
      .populate("student")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      applications,
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
  applyToCompany,
  getMyApplications,
  updateApplicationStatus,
  withdrawApplication,
  getAllApplications,
};