const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { sendEmail } = require("../utils/emailService");

// =====================================================
// REGISTER
// POST /api/auth/register
// =====================================================

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      studentId,
      college,
      branch,
      semester,
    } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      !name ||
      !email ||
      !password ||
      !studentId ||
      !college ||
      !branch ||
      semester === undefined ||
      semester === null
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are required",
      });
    }

    const normalizedEmail = String(email)
      .trim()
      .toLowerCase();

    const normalizedStudentId = String(studentId)
      .trim()
      .toLowerCase();

    // ==========================================
    // EMAIL VALIDATION
    // ==========================================

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // ==========================================
    // PASSWORD VALIDATION
    // ==========================================

    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters long",
      });
    }

    // ==========================================
    // SEMESTER VALIDATION
    // ==========================================

    const semesterNumber = Number(semester);

    if (
      !Number.isInteger(semesterNumber) ||
      semesterNumber < 1 ||
      semesterNumber > 8
    ) {
      return res.status(400).json({
        success: false,
        message: "Semester must be between 1 and 8",
      });
    }

    // ==========================================
    // CHECK DUPLICATE EMAIL
    // ==========================================

    const existingEmail = await User.findOne({
      email: normalizedEmail,
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists",
      });
    }

    // ==========================================
    // CHECK DUPLICATE STUDENT ID
    // ==========================================

    const existingStudent = await User.findOne({
      studentId: normalizedStudentId,
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this Student ID already exists",
      });
    }

    // ==========================================
    // HASH PASSWORD
    // ==========================================

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // ==========================================
    // CREATE USER
    // ==========================================

    const user = await User.create({
      name: String(name).trim(),

      email: normalizedEmail,

      password: hashedPassword,

      studentId: normalizedStudentId,

      college: String(college).trim(),

      branch: String(branch).trim(),

      semester: semesterNumber,

      role: "student",
    });

    // ==========================================
    // SEND WELCOME EMAIL
    // ==========================================
    // IMPORTANT:
    // `to` is the NEW student's email.
    // It is NOT EMAIL_USER.

    const emailResult = await sendEmail({
      to: normalizedEmail,

      subject:
        "Welcome to Placement AI Tracker 🎓",

      text: `
Hello ${user.name},

Welcome to Placement AI Tracker!

Your student account has been successfully created.

Student ID: ${user.studentId}
College: ${user.college}
Branch: ${user.branch}
Semester: ${user.semester}

You can now log in and start managing your placement preparation.

Regards,
Placement AI Tracker Team
      `.trim(),

      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px;">

          <h2 style="color: #2563eb;">
            Welcome to Placement AI Tracker 🎓
          </h2>

          <p>
            Hello <strong>${user.name}</strong>,
          </p>

          <p>
            Your student account has been successfully created.
          </p>

          <div style="
              background: #f3f4f6;
              padding: 18px;
              border-radius: 10px;
              margin: 20px 0;
          ">

            <p>
              <strong>Student ID:</strong>
              ${user.studentId}
            </p>

            <p>
              <strong>College:</strong>
              ${user.college}
            </p>

            <p>
              <strong>Branch:</strong>
              ${user.branch}
            </p>

            <p>
              <strong>Semester:</strong>
              ${user.semester}
            </p>

          </div>

          <p>
            You can now log in and start managing
            your placement preparation.
          </p>

          <p>
            Regards,<br />
            <strong>Placement AI Tracker Team</strong>
          </p>

        </div>
      `,
    });

    // ==========================================
    // EMAIL RESULT
    // ==========================================

    if (emailResult?.success) {
      console.log(
        `Welcome email sent to ${normalizedEmail}`
      );
    } else {
      console.error(
        "Welcome email failed:",
        emailResult?.message
      );
    }

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(201).json({
      success: true,

      message:
        "Registration successful",

      emailSent:
        emailResult?.success === true,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        college: user.college,
        branch: user.branch,
        semester: user.semester,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "Registration Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

// =====================================================
// LOGIN
// POST /api/auth/login
// =====================================================

const login = async (req, res) => {
  try {
    const { studentId, password } = req.body;

    if (!studentId || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Student ID and password are required",
      });
    }

    const normalizedStudentId = String(studentId)
      .trim()
      .toLowerCase();

    const user = await User.findOne({
      studentId: normalizedStudentId,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Student ID or password",
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Student ID or password",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT configuration is missing",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,

      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        college: user.college,
        branch: user.branch,
        semester: user.semester,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "Login Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

module.exports = {
  register,
  login,
};