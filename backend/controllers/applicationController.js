const mongoose = require("mongoose");

const Application = require("../models/Application");
const Company = require("../models/Company");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { sendEmail } = require("../utils/emailService");

// =============================
// APPLY TO COMPANY
// =============================
const applyToCompany = async (req, res) => {
  try {
    const { companyId, studentId } = req.body;

    console.log("===== APPLY REQUEST =====");
    console.log("Company ID:", companyId);
    console.log("Student ID:", studentId);

    // --------------------------------
    // Check IDs are provided
    // --------------------------------
    if (!companyId || !studentId) {
      return res.status(400).json({
        success: false,
        message: "Company ID and Student ID are required.",
      });
    }

    // --------------------------------
    // Check MongoDB ObjectIds
    // --------------------------------
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Company ID.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Student ID.",
      });
    }

    // --------------------------------
    // Check student exists
    // --------------------------------
    const student = await User.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    // --------------------------------
    // Check company exists
    // --------------------------------
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    // --------------------------------
    // Check duplicate application
    // --------------------------------
    const alreadyApplied = await Application.findOne({
      company: companyId,
      student: studentId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this company.",
      });
    }

    // --------------------------------
    // Create application
    // --------------------------------
    const application = await Application.create({
      company: companyId,
      student: studentId,
      status: "Applied",
    });

    console.log("Application Created:", application._id);

    // --------------------------------
    // CREATE IN-APP NOTIFICATION
    // --------------------------------
    try {
      await Notification.create({
        student: studentId,
        title: "Application Submitted",
        message:
          "Your application has been submitted successfully.",
        type: "Application",
      });

      console.log("Application Notification Created");
    } catch (notificationError) {
      console.error(
        "Application Notification Error:",
        notificationError.message
      );
    }

    // --------------------------------
    // SEND EMAIL
    // --------------------------------
    try {
      console.log("EMAIL RECIPIENT:", student.email);
      
      const emailResult = await sendEmail({
        to: student.email,
        subject:
          "Application Submitted - Placement AI Tracker",

        text: `Hello ${student.name},

Your application has been successfully submitted for ${company.companyName}.

You can check your application status from your Placement AI Tracker dashboard.

Best regards,
Placement AI Tracker`,

        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Application Submitted ✅</h2>

            <p>Hello <strong>${student.name}</strong>,</p>

            <p>
              Your application has been successfully submitted for
              <strong>${company.companyName}</strong>.
            </p>

            <p>
              You can check your application status from your
              Placement AI Tracker dashboard.
            </p>

            <p>
              Best regards,<br>
              <strong>Placement AI Tracker</strong>
            </p>
          </div>
        `,
      });

      if (emailResult.success) {
        console.log("Application Email Sent Successfully");
      } else {
        console.error(
          "Application Email Failed:",
          emailResult.message
        );
      }
    } catch (emailError) {
      console.error(
        "Application Email Error:",
        emailError.message
      );
    }

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      application,
    });
  } catch (error) {
    console.error("Apply To Company Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to submit application.",
    });
  }
};

// =============================
// GET MY APPLICATIONS
// =============================
const getMyApplications = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Student ID.",
      });
    }

    const applications = await Application.find({
      student: studentId,
    })
      .populate("company")
      .sort({ createdAt: -1 });

    const validApplications = applications.filter(
      (app) => app.company
    );

    return res.json({
      success: true,
      count: validApplications.length,
      applications: validApplications,
    });
  } catch (error) {
    console.error("Get My Applications Error:", error);

    return res.status(500).json({
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
      .populate("student", "-password")
      .populate("company")
      .sort({ createdAt: -1 });

    const validApplications = applications.filter(
      (app) => app.student && app.company
    );

    return res.json({
      success: true,
      count: validApplications.length,
      applications: validApplications,
    });
  } catch (error) {
    console.error("Get All Applications Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// UPDATE APPLICATION STATUS
// =============================
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Applied",
      "Interview",
      "Selected",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status.",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(req.params.id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Application ID.",
      });
    }

    // --------------------------------
    // Update application
    // --------------------------------
    const application =
      await Application.findByIdAndUpdate(
        req.params.id,
        {
          status,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    // --------------------------------
    // Get student information
    // --------------------------------
    const student = await User.findById(
      application.student
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    // --------------------------------
    // Get company information
    // --------------------------------
    const company = await Company.findById(
      application.company
    );

    // --------------------------------
    // Notification defaults
    // --------------------------------
    let notificationTitle =
      "Application Status Updated";

    let notificationMessage =
      `Your application status has been changed to ${status}.`;

    let notificationType = "Application";

    let emailSubject =
      "Application Status Updated - Placement AI Tracker";

    let emailMessage =
      `Your application status has been changed to ${status}.`;

    // --------------------------------
    // INTERVIEW
    // --------------------------------
    if (status === "Interview") {
      notificationTitle = "🎤 Interview Update";

      notificationMessage =
        "Your application has moved to the interview stage.";

      notificationType = "Interview";

      emailSubject =
        "🎤 Interview Update - Placement AI Tracker";

      emailMessage =
        "Your application has moved to the interview stage. Please check your placement dashboard for further updates.";
    }

    // --------------------------------
    // SELECTED
    // --------------------------------
    if (status === "Selected") {
      notificationTitle = "🎉 Congratulations!";

      notificationMessage =
        "You have been selected. Congratulations on your achievement!";

      notificationType = "Selection";

      emailSubject =
        "🎉 Congratulations! You Have Been Selected";

      emailMessage =
        "Congratulations! You have been selected. We are happy to share this achievement with you.";
    }

    // --------------------------------
    // REJECTED
    // --------------------------------
    if (status === "Rejected") {
      notificationTitle = "Application Update";

      notificationMessage =
        "Your application was not selected this time. Keep applying and improving.";

      notificationType = "Rejection";

      emailSubject =
        "Application Update - Placement AI Tracker";

      emailMessage =
        "Your application was not selected this time. Don't lose confidence. Keep applying and improving your skills.";
    }

    // --------------------------------
    // CREATE IN-APP NOTIFICATION
    // --------------------------------
    try {
      await Notification.create({
        student: application.student,
        title: notificationTitle,
        message: notificationMessage,
        type: notificationType,
      });

      console.log("Status Notification Created");
    } catch (notificationError) {
      console.error(
        "Status Notification Error:",
        notificationError.message
      );
    }

    // --------------------------------
    // SEND STATUS EMAIL
    // --------------------------------
    try {
      const companyName =
        company?.companyName || "the company";

      const emailResult = await sendEmail({
        to: student.email,
        subject: emailSubject,

        text: `Hello ${student.name},

${emailMessage}

Company: ${companyName}
Current Status: ${status}

Please check your Placement AI Tracker dashboard for more details.

Best regards,
Placement AI Tracker`,

        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>${notificationTitle}</h2>

            <p>
              Hello <strong>${student.name}</strong>,
            </p>

            <p>
              ${emailMessage}
            </p>

            <p>
              <strong>Company:</strong> ${companyName}
            </p>

            <p>
              <strong>Current Status:</strong> ${status}
            </p>

            <p>
              Please check your Placement AI Tracker
              dashboard for more details.
            </p>

            <p>
              Best regards,<br>
              <strong>Placement AI Tracker</strong>
            </p>
          </div>
        `,
      });

      if (emailResult.success) {
        console.log(
          "Status Email Sent Successfully"
        );
      } else {
        console.error(
          "Status Email Failed:",
          emailResult.message
        );
      }
    } catch (emailError) {
      console.error(
        "Status Email Error:",
        emailError.message
      );
    }

    return res.json({
      success: true,
      message: "Status updated successfully.",
      application,
    });
  } catch (error) {
    console.error(
      "Update Application Status Error:",
      error
    );

    return res.status(500).json({
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
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Application ID.",
      });
    }

    const application =
      await Application.findByIdAndDelete(
        req.params.id
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    return res.json({
      success: true,
      message: "Application withdrawn successfully.",
    });
  } catch (error) {
    console.error(
      "Withdraw Application Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// EXPORT CONTROLLERS
// =============================
module.exports = {
  applyToCompany,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  withdrawApplication,
};