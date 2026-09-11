const fs = require("fs");
const pdf = require("pdf-parse");

const Company = require("../models/Company");
const Application = require("../models/Application");
const User = require("../models/User");

const analyzeResume = require("../utils/resumeAnalyzer");

const getDashboard = async (req, res) => {
  try {
    const { studentId } = req.params;

    // ==============================
    // CHECK STUDENT
    // ==============================

    const student = await User.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // ==============================
    // STUDENT APPLICATIONS ONLY
    // ==============================

    const applications = await Application.find({
      student: studentId,
    });

    const applicationCount =
      applications.length;

    // ==============================
    // INTERVIEWS
    // ==============================

    const interviewCount =
      applications.filter(
        (app) => app.status === "Interview"
      ).length;

    // ==============================
    // SELECTED
    // ==============================

    const selectedCount =
      applications.filter(
        (app) => app.status === "Selected"
      ).length;

    // ==============================
    // AVAILABLE COMPANIES
    // ==============================

    const companyCount =
      await Company.countDocuments();

    // ==============================
    // RESUME
    // ==============================

    const resumeUploaded = !!(
      student.resume &&
      student.resume.fileName
    );

    // ==============================
    // ATS SCORE
    // SAME ANALYZER AS AI PAGE
    // ==============================

    let atsScore = 0;
    let resumeAnalyzed = false;

    if (
      resumeUploaded &&
      student.resume.filePath
    ) {
      try {
        // Read student's resume PDF
        const pdfBuffer =
          fs.readFileSync(
            student.resume.filePath
          );

        // Extract text
        const pdfData =
          await pdf(pdfBuffer);

        // Use the SAME analyzer used
        // by AI Resume Analysis
        const analysis =
          analyzeResume(pdfData.text);

        atsScore =
          analysis.atsScore || 0;

        resumeAnalyzed = true;
      } catch (resumeError) {
        console.error(
          "Dashboard Resume Analysis Error:",
          resumeError
        );

        atsScore = 0;
        resumeAnalyzed = false;
      }
    }

    // ==============================
    // PROFILE PROGRESS
    // ==============================

    let completedFields = 0;

    const totalFields = 8;

    if (student.name) {
      completedFields++;
    }

    if (student.email) {
      completedFields++;
    }

    if (student.college) {
      completedFields++;
    }

    if (student.branch) {
      completedFields++;
    }

    if (student.semester) {
      completedFields++;
    }

    if (
      student.skills &&
      student.skills.length > 0
    ) {
      completedFields++;
    }

    if (
      student.projects &&
      student.projects.length > 0
    ) {
      completedFields++;
    }

    if (resumeUploaded) {
      completedFields++;
    }

    const profileProgress =
      Math.round(
        (completedFields /
          totalFields) *
          100
      );

    // ==============================
    // UPCOMING COMPANIES
    // ==============================

    const upcomingCompanies =
      await Company.find({
        deadline: {
          $gte: new Date(),
        },
      })
        .sort({
          deadline: 1,
        })
        .limit(5);

    // ==============================
    // RECENT APPLICATIONS
    // ==============================

    const recentApplications =
      await Application.find({
        student: studentId,
      })
        .populate("company")
        .sort({
          createdAt: -1,
        })
        .limit(5);

    // ==============================
    // RESPONSE
    // ==============================

    return res.status(200).json({
      success: true,

      student: {
        id: student._id,
        name: student.name,
        studentId: student.studentId,
      },

      // SAME ATS SCORE AS
      // AI RESUME ANALYSIS
      atsScore,

      resumeUploaded,

      resumeAnalyzed,

      applicationCount,

      interviewCount,

      selectedCount,

      companyCount,

      profileProgress,

      recentApplications,

      upcomingCompanies,
    });
  } catch (error) {
    console.error(
      "Student Dashboard Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
};