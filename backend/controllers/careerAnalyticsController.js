const User = require("../models/User");
const Application = require("../models/Application");
const Interview = require("../models/Interview");

const getCareerAnalytics = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await User.findById(studentId).select(
      "name email branch semester skills resume"
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const applications = await Application.find({
      student: studentId,
    }).populate("company", "name");

    const interviews = await Interview.find({
      student: studentId,
    });

    // -----------------------------
    // APPLICATION ANALYTICS
    // -----------------------------

    const totalApplications = applications.length;

    const applied = applications.filter(
      (app) => app.status === "Applied"
    ).length;

    const shortlisted = applications.filter(
      (app) => app.status === "Shortlisted"
    ).length;

    const interview = applications.filter(
      (app) => app.status === "Interview"
    ).length;

    const selected = applications.filter(
      (app) => app.status === "Selected"
    ).length;

    const rejected = applications.filter(
      (app) => app.status === "Rejected"
    ).length;

    const pending = applications.filter(
      (app) =>
        app.status === "Pending" ||
        app.status === "OA"
    ).length;

    const successRate =
      totalApplications > 0
        ? Math.round(
            (selected / totalApplications) * 100
          )
        : 0;

    const interviewRate =
      totalApplications > 0
        ? Math.round(
            (interview / totalApplications) * 100
          )
        : 0;

    // -----------------------------
    // INTERVIEW ANALYTICS
    // -----------------------------

    const totalInterviews = interviews.length;

    const averageInterviewScore =
      totalInterviews > 0
        ? Math.round(
            interviews.reduce(
              (sum, item) => sum + item.score,
              0
            ) / totalInterviews
          )
        : 0;

    // -----------------------------
    // RESUME ANALYTICS
    // -----------------------------

    let resumeUploaded = false;

    if (
      student.resume &&
      (
        student.resume.fileName ||
        student.resume.fileUrl ||
        student.resume.path
      )
    ) {
      resumeUploaded = true;
    }

    // -----------------------------
    // SKILLS
    // -----------------------------

    const skills = student.skills || [];

    const skillScore = Math.min(
      skills.length * 10,
      100
    );

    // -----------------------------
    // PROFILE SCORE
    // -----------------------------

    let profileScore = 0;

    if (student.name) profileScore += 20;
    if (student.email) profileScore += 20;
    if (student.branch) profileScore += 15;
    if (student.semester) profileScore += 15;
    if (skills.length > 0) profileScore += 15;
    if (resumeUploaded) profileScore += 15;

    // -----------------------------
    // CAREER READINESS SCORE
    // -----------------------------

    const careerReadiness = Math.round(
      profileScore * 0.25 +
        skillScore * 0.20 +
        averageInterviewScore * 0.30 +
        Math.min(totalApplications * 5, 100) *
          0.15 +
        (resumeUploaded ? 100 : 0) * 0.10
    );

    // -----------------------------
    // APPLICATION STATUS DATA
    // -----------------------------

    const applicationStatus = [
      {
        status: "Applied",
        count: applied,
      },
      {
        status: "Pending",
        count: pending,
      },
      {
        status: "Shortlisted",
        count: shortlisted,
      },
      {
        status: "Interview",
        count: interview,
      },
      {
        status: "Selected",
        count: selected,
      },
      {
        status: "Rejected",
        count: rejected,
      },
    ];

    // -----------------------------
    // SUGGESTIONS
    // -----------------------------

    const suggestions = [];

    if (!resumeUploaded) {
      suggestions.push(
        "Upload your resume to improve your placement readiness."
      );
    }

    if (skills.length < 3) {
      suggestions.push(
        "Add more technical skills to your profile."
      );
    }

    if (averageInterviewScore < 60) {
      suggestions.push(
        "Practice more AI interview questions to improve your interview score."
      );
    }

    if (totalApplications < 5) {
      suggestions.push(
        "Apply to more suitable companies to increase your opportunities."
      );
    }

    if (shortlisted === 0 && totalApplications >= 5) {
      suggestions.push(
        "Improve your resume and apply for roles matching your skills."
      );
    }

    if (careerReadiness >= 80) {
      suggestions.push(
        "Your placement preparation is strong. Focus on mock interviews and company-specific preparation."
      );
    }

    if (suggestions.length === 0) {
      suggestions.push(
        "Keep practicing consistently and track your placement progress."
      );
    }

    res.status(200).json({
      success: true,

      student: {
        name: student.name,
        branch: student.branch,
        semester: student.semester,
      },

      analytics: {
        totalApplications,
        applied,
        pending,
        shortlisted,
        interview,
        selected,
        rejected,

        successRate,
        interviewRate,

        totalInterviews,
        averageInterviewScore,

        resumeUploaded,
        totalSkills: skills.length,

        profileScore,
        skillScore,
        careerReadiness,
      },

      applicationStatus,

      skills,

      suggestions,
    });
  } catch (error) {
    console.error(
      "Career Analytics Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to load career analytics",
    });
  }
};

module.exports = {
  getCareerAnalytics,
};