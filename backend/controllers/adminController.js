const User = require("../models/User");
const Company = require("../models/Company");
const Application = require("../models/Application");
const Notification = require("../models/Notification");

const { sendEmail } = require("../utils/emailService");

// ======================================================
// ADMIN DASHBOARD
// ======================================================

const getDashboardStats = async (req, res) => {
  try {
    // --------------------------------------------------
    // BASIC COUNTS
    // --------------------------------------------------

    const totalStudents = await User.countDocuments({
      role: "student",
    });

    const totalCompanies = await Company.countDocuments();

    const totalApplications =
      await Application.countDocuments();

    // --------------------------------------------------
    // APPLICATION STATUS COUNTS
    // --------------------------------------------------

    const selectedApplications =
      await Application.countDocuments({
        status: "Selected",
      });

    const appliedApplications =
      await Application.countDocuments({
        status: "Applied",
      });

    const pendingApplications =
      await Application.countDocuments({
        status: "Pending",
      });

    const oaApplications =
      await Application.countDocuments({
        status: "OA",
      });

    const shortlistedApplications =
      await Application.countDocuments({
        status: "Shortlisted",
      });

    const interviewApplications =
      await Application.countDocuments({
        status: "Interview",
      });

    const rejectedApplications =
      await Application.countDocuments({
        status: "Rejected",
      });

    // --------------------------------------------------
    // RESUME COUNT
    // --------------------------------------------------

    const resumeUploaded =
      await User.countDocuments({
        role: "student",
        "resume.fileName": {
          $exists: true,
          $ne: "",
        },
      });

    // --------------------------------------------------
    // PLACEMENT PERCENTAGE
    // --------------------------------------------------

    const placementPercentage =
      totalStudents > 0
        ? Number(
            (
              (selectedApplications /
                totalStudents) *
              100
            ).toFixed(1)
          )
        : 0;

    // --------------------------------------------------
    // RECENT APPLICATIONS
    // --------------------------------------------------

    const recentApplications =
      await Application.find()
        .populate(
          "student",
          "name studentId email"
        )
        .populate("company")
        .sort({
          createdAt: -1,
        })
        .limit(5);

    // --------------------------------------------------
    // UPCOMING COMPANIES
    // --------------------------------------------------

    const upcomingCompanies =
      await Company.find()
        .sort({
          deadline: 1,
          createdAt: -1,
        })
        .limit(5);

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    res.status(200).json({
      success: true,

      totalStudents,

      totalCompanies,

      totalApplications,

      selectedStudents:
        selectedApplications,

      pendingApplications:
        appliedApplications +
        pendingApplications +
        oaApplications,

      resumeUploaded,

      placementPercentage,

      recentApplications,

      upcomingCompanies,

      // Additional statistics
      applicationStats: {
        applied: appliedApplications,
        pending: pendingApplications,
        oa: oaApplications,
        shortlisted:
          shortlistedApplications,
        interview:
          interviewApplications,
        selected:
          selectedApplications,
        rejected:
          rejectedApplications,
      },
    });
  } catch (error) {
    console.error(
      "Dashboard Stats Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to load dashboard statistics",
    });
  }
};

// ======================================================
// ADMIN ANALYTICS
// ======================================================

const getAnalytics = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({
      role: "student",
    });

    const totalCompanies =
      await Company.countDocuments();

    const totalApplications =
      await Application.countDocuments();

    const selectedApplications =
      await Application.countDocuments({
        status: "Selected",
      });

    const rejectedApplications =
      await Application.countDocuments({
        status: "Rejected",
      });

    const interviewApplications =
      await Application.countDocuments({
        status: "Interview",
      });

    const appliedApplications =
      await Application.countDocuments({
        status: "Applied",
      });

    const pendingApplications =
      await Application.countDocuments({
        status: "Pending",
      });

    const shortlistedApplications =
      await Application.countDocuments({
        status: "Shortlisted",
      });

    const oaApplications =
      await Application.countDocuments({
        status: "OA",
      });

    res.status(200).json({
      success: true,

      analytics: {
        totalStudents,
        totalCompanies,
        totalApplications,
        selectedApplications,
        rejectedApplications,
        interviewApplications,
        appliedApplications,
        pendingApplications,
        shortlistedApplications,
        oaApplications,
      },
    });
  } catch (error) {
    console.error(
      "Analytics Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to load analytics",
    });
  }
};

// ======================================================
// GET ALL STUDENTS
// ======================================================

const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({
      role: "student",
    })
      .select("-password")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error(
      "Get Students Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to load students",
    });
  }
};

// ======================================================
// GET SINGLE STUDENT DETAILS
// ======================================================

const getStudentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await User.findOne({
      _id: id,
      role: "student",
    }).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const applications =
      await Application.find({
        student: id,
      })
        .populate("company")
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      student,
      applications,
    });
  } catch (error) {
    console.error(
      "Student Details Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to load student details",
    });
  }
};

// ======================================================
// DELETE STUDENT
// ======================================================

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await User.findOne({
      _id: id,
      role: "student",
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    await Application.deleteMany({
      student: id,
    });

    await Notification.deleteMany({
      student: id,
    });

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Student Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to delete student",
    });
  }
};

// ======================================================
// GET ALL COMPANIES
// ======================================================

const getAllCompanies = async (req, res) => {
  try {
    const companies =
      await Company.find().sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: companies.length,
      companies,
    });
  } catch (error) {
    console.error(
      "Get Companies Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to load companies",
    });
  }
};

// ======================================================
// DELETE COMPANY
// ======================================================

const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const company =
      await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    await Application.deleteMany({
      company: id,
    });

    await Company.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Company Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to delete company",
    });
  }
};

// ======================================================
// GET ALL APPLICATIONS
// ======================================================

const getAllApplications = async (req, res) => {
  try {
    const applications =
      await Application.find()
        .populate(
          "student",
          "-password"
        )
        .populate("company")
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(
      "Get Applications Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to load applications",
    });
  }
};

// ======================================================
// UPDATE APPLICATION STATUS
// ======================================================

const updateApplicationStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const applicationId = id;

    const { status } = req.body;

    console.log(
      "UPDATE APPLICATION:",
      applicationId,
      status
    );

    // --------------------------------------------------
    // VALIDATE STATUS
    // --------------------------------------------------

    const allowedStatuses = [
      "Applied",
      "Pending",
      "OA",
      "Shortlisted",
      "Interview",
      "Selected",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
    }

    // --------------------------------------------------
    // FIND APPLICATION
    // --------------------------------------------------

    const application =
      await Application.findById(
        applicationId
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // --------------------------------------------------
    // UPDATE STATUS
    // --------------------------------------------------

    application.status = status;

    await application.save();

    // --------------------------------------------------
    // FIND STUDENT
    // --------------------------------------------------

    const student = await User.findById(
      application.student
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // --------------------------------------------------
    // FIND COMPANY
    // --------------------------------------------------

    const company =
      await Company.findById(
        application.company
      );

    const companyName = company
      ? company.name
      : "the company";

    // --------------------------------------------------
    // DEFAULT NOTIFICATION / EMAIL
    // --------------------------------------------------

    let notificationTitle =
      "Application Status Updated";

    let notificationMessage =
      `Your application for ${companyName} has been updated to ${status}.`;

    let notificationType =
      "Application";

    let emailSubject =
      `Application Status Updated - ${companyName}`;

    let emailText =
      `Your application for ${companyName} has been updated to ${status}.`;

    let emailHtml = `
      <h2>Application Status Updated</h2>

      <p>Hello ${student.name || "Student"},</p>

      <p>
        Your application for
        <strong>${companyName}</strong>
        has been updated to:
      </p>

      <h3>${status}</h3>

      <p>
        Please check your placement portal
        for more details.
      </p>

      <br>

      <p>
        Regards,<br>
        Placement AI Tracker
      </p>
    `;

    // --------------------------------------------------
    // INTERVIEW
    // --------------------------------------------------

    if (status === "Interview") {
      notificationTitle =
        "Interview Update";

      notificationMessage =
        `Your application for ${companyName} has been moved to Interview stage.`;

      notificationType =
        "Interview";

      emailSubject =
        `Interview Update - ${companyName}`;

      emailText =
        `Your application for ${companyName} has been moved to the Interview stage.`;

      emailHtml = `
        <h2>Interview Update</h2>

        <p>Hello ${student.name || "Student"},</p>

        <p>
          Your application for
          <strong>${companyName}</strong>
          has been moved to the
          <strong>Interview</strong> stage.
        </p>

        <p>
          Please check your placement portal
          for more details.
        </p>

        <br>

        <p>
          Regards,<br>
          Placement AI Tracker
        </p>
      `;
    }

    // --------------------------------------------------
    // SELECTED
    // --------------------------------------------------

    else if (status === "Selected") {
      notificationTitle =
        "Congratulations! 🎉";

      notificationMessage =
        `Congratulations! You have been selected by ${companyName}.`;

      notificationType =
        "Selection";

      emailSubject =
        `Congratulations! You have been selected by ${companyName}`;

      emailText =
        `Congratulations! You have been selected by ${companyName}.`;

      emailHtml = `
        <h2>Congratulations! 🎉</h2>

        <p>Hello ${student.name || "Student"},</p>

        <p>
          We are happy to inform you that you have been
          <strong>selected</strong> by
          <strong>${companyName}</strong>.
        </p>

        <p>
          Congratulations on your achievement!
        </p>

        <p>
          Please check your placement portal
          for further details.
        </p>

        <br>

        <p>
          Regards,<br>
          Placement AI Tracker
        </p>
      `;
    }

    // --------------------------------------------------
    // REJECTED
    // --------------------------------------------------

    else if (status === "Rejected") {
      notificationTitle =
        "Application Status Update";

      notificationMessage =
        `Your application for ${companyName} was not selected at this stage. Keep applying and keep improving.`;

      notificationType =
        "Rejection";

      emailSubject =
        `Application Status Update - ${companyName}`;

      emailText =
        `Your application for ${companyName} was not selected at this stage. Keep applying and keep improving.`;

      emailHtml = `
        <h2>Application Status Update</h2>

        <p>Hello ${student.name || "Student"},</p>

        <p>
          Your application for
          <strong>${companyName}</strong>
          was not selected at this stage.
        </p>

        <p>
          Do not lose hope. Keep applying,
          learning and improving your skills.
        </p>

        <br>

        <p>
          Regards,<br>
          Placement AI Tracker
        </p>
      `;
    }

    // --------------------------------------------------
    // CREATE NOTIFICATION
    // --------------------------------------------------

    await Notification.create({
      student: student._id,
      title: notificationTitle,
      message: notificationMessage,
      type: notificationType,
    });

    // --------------------------------------------------
    // SEND EMAIL
    // --------------------------------------------------

    const emailResult =
      await sendEmail({
        to: student.email,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
      });

    // --------------------------------------------------
    // GET UPDATED APPLICATION
    // --------------------------------------------------

    const updatedApplication =
      await Application.findById(
        applicationId
      )
        .populate(
          "student",
          "-password"
        )
        .populate("company");

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    res.status(200).json({
      success: true,
      message:
        "Application status updated successfully",

      application:
        updatedApplication,

      notificationCreated: true,

      emailSent:
        emailResult.success,

      emailMessage:
        emailResult.success
          ? "Status email sent successfully"
          : emailResult.message,
    });
  } catch (error) {
    console.error(
      "Update Application Status Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to update application status",
      error: error.message,
    });
  }
};

// ======================================================
// GET STUDENT RESUME
// ======================================================

const getStudentResume = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await User.findOne({
      _id: id,
      role: "student",
    }).select(
      "name email resume"
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (
      !student.resume ||
      !student.resume.fileName
    ) {
      return res.status(404).json({
        success: false,
        message: "Resume not uploaded",
      });
    }

    res.status(200).json({
      success: true,
      resume: student.resume,
    });
  } catch (error) {
    console.error(
      "Get Resume Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to load resume",
    });
  }
};

// ======================================================
// DELETE APPLICATION
// ======================================================

const deleteApplication = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const application =
      await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    await Application.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message:
        "Application deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Application Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to delete application",
    });
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  getDashboardStats,
  getAnalytics,
  getAllStudents,
  getStudentDetails,
  deleteStudent,
  getAllCompanies,
  deleteCompany,
  getAllApplications,
  updateApplicationStatus,
  getStudentResume,
  deleteApplication,
};