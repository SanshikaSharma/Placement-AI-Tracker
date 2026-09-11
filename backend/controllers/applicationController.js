const mongoose = require("mongoose");
const Application = require("../models/Application");
const Company = require("../models/Company");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { sendEmail } = require("../utils/emailService");

// =====================================================
// APPLY TO COMPANY
// =====================================================
const applyToCompany = async (req, res) => {
  try {
    const { companyId } = req.body;

    // Never trust studentId from frontend
    const studentId = req.user.id;

    // -----------------------------
    // Validate Company ID
    // -----------------------------
    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Company ID.",
      });
    }

    // -----------------------------
    // Validate Student ID
    // -----------------------------
    if (
      !studentId ||
      !mongoose.Types.ObjectId.isValid(studentId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Student ID.",
      });
    }

    // -----------------------------
    // Find Student
    // -----------------------------
    const student = await User.findById(studentId).select(
      "-password"
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    // -----------------------------
    // Find Company
    // -----------------------------
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    // -----------------------------
    // Check duplicate application
    // -----------------------------
    const existingApplication =
      await Application.findOne({
        student: studentId,
        company: companyId,
      });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message:
          "You have already applied to this company.",
      });
    }

    // -----------------------------
    // Create Application
    // -----------------------------
    const application = await Application.create({
      student: studentId,
      company: companyId,
      status: "Applied",
    });

    // -----------------------------
    // Create Notification
    // -----------------------------
    try {
      await Notification.create({
        student: studentId,
        title: "Application Submitted",
        message: `Your application for ${company.companyName} has been submitted successfully.`,
        type: "Application",
        isRead: false,
      });
    } catch (notificationError) {
      console.error(
        "Notification Error:",
        notificationError.message
      );
    }

    // -----------------------------
    // Send Email
    // -----------------------------
    try {
      if (student.email) {
        await sendEmail({
          to: student.email,

          subject: `Application Submitted - ${company.companyName}`,

          text: `Hello ${student.name || "Student"},

Your application for ${company.companyName} has been submitted successfully.

Company: ${company.companyName}
Role: ${company.role}
Package: ${company.package}
Location: ${company.location}
Status: Applied

You can check your application status from your Placement AI Tracker dashboard.

Regards,
Placement AI Tracker`,
        });
      }
    } catch (emailError) {
      // Email failure should not cancel application
      console.error(
        "Application Email Error:",
        emailError.message
      );
    }

    // -----------------------------
    // Success Response
    // -----------------------------
    return res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      application,
    });
  } catch (error) {
    console.error(
      "Apply To Company Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to submit application.",
    });
  }
};

// =====================================================
// GET MY APPLICATIONS
// =====================================================
const getMyApplications = async (req, res) => {
  try {
    const { studentId } = req.params;

    // -----------------------------
    // Validate Student ID
    // -----------------------------
    if (
      !studentId ||
      !mongoose.Types.ObjectId.isValid(studentId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Student ID.",
      });
    }

    // -----------------------------
    // Get Applications
    // -----------------------------
    const applications = await Application.find({
      student: studentId,
    })
      .populate(
        "company",
        "companyName role package location jobType eligibleBranches minimumCGPA skillsRequired eligibility description applyLink deadline status"
      )
      .populate(
        "student",
        "name email studentId college branch semester"
      )
      .sort({ createdAt: -1 });

    // -----------------------------
    // Response
    // -----------------------------
    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(
      "Get My Applications Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch applications.",
    });
  }
};

// =====================================================
// GET ALL APPLICATIONS
// ADMIN ONLY
// =====================================================
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate(
        "student",
        "name email studentId college branch semester"
      )
      .populate(
        "company",
        "companyName role package location jobType eligibleBranches minimumCGPA skillsRequired eligibility description applyLink deadline status"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(
      "Get All Applications Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch applications.",
    });
  }
};

// =====================================================
// UPDATE APPLICATION STATUS
// ADMIN ONLY
// =====================================================
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // -----------------------------
    // Validate Application ID
    // -----------------------------
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Application ID.",
      });
    }

    // -----------------------------
    // Allowed Statuses
    // -----------------------------
    const allowedStatuses = [
      "Applied",
      "Pending",
      "OA",
      "Shortlisted",
      "Interview",
      "Selected",
      "Rejected",
    ];

    if (
      !status ||
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status.",
      });
    }

    // -----------------------------
    // Find Application
    // -----------------------------
    const application =
      await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    // -----------------------------
    // Update Status
    // -----------------------------
    application.status = status;

    await application.save();

    return res.status(200).json({
      success: true,
      message:
        "Application status updated successfully.",
      application,
    });
  } catch (error) {
    console.error(
      "Update Application Status Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update application status.",
    });
  }
};

// =====================================================
// WITHDRAW APPLICATION
// =====================================================
const withdrawApplication = async (req, res) => {
  try {
    const { id } = req.params;

    // -----------------------------
    // Validate Application ID
    // -----------------------------
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Application ID.",
      });
    }

    // -----------------------------
    // Find Application
    // -----------------------------
    const application =
      await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    // -----------------------------
    // Ownership Check
    // -----------------------------
    if (
      req.user.role !== "admin" &&
      String(application.student) !==
        String(req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. You can only withdraw your own application.",
      });
    }

    // -----------------------------
    // Delete Application
    // -----------------------------
    await Application.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message:
        "Application withdrawn successfully.",
    });
  } catch (error) {
    console.error(
      "Withdraw Application Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to withdraw application.",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================
module.exports = {
  applyToCompany,
  getMyApplications,
  updateApplicationStatus,
  withdrawApplication,
  getAllApplications,
};