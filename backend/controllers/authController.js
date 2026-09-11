const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


// ======================================================
// REGISTER USER
// ======================================================

const registerUser = async (req, res) => {
  try {
    const {
      name,
      studentId,
      email,
      password,
      college,
      branch,
      semester,
    } = req.body;

    // -----------------------------
    // Required fields
    // -----------------------------

    if (
      !name ||
      !studentId ||
      !email ||
      !password ||
      !college ||
      !branch ||
      semester === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // -----------------------------
    // Basic validation
    // -----------------------------

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters long",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const normalizedStudentId =
      studentId.trim();

    // -----------------------------
    // Check duplicate email
    // -----------------------------

    const existingEmail =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // -----------------------------
    // Check duplicate student ID
    // -----------------------------

    const existingStudent =
      await User.findOne({
        studentId: normalizedStudentId,
      });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Student ID already registered",
      });
    }

    // -----------------------------
    // Hash password
    // -----------------------------

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // -----------------------------
    // Create user
    // -----------------------------

    const user = await User.create({
      name: name.trim(),
      studentId: normalizedStudentId,
      email: normalizedEmail,
      password: hashedPassword,
      college: college.trim(),
      branch: branch.trim(),
      semester: Number(semester),
    });

    // -----------------------------
    // Response
    // -----------------------------

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        studentId: user.studentId,
        email: user.email,
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


// ======================================================
// LOGIN USER
// ======================================================

const loginUser = async (req, res) => {
  try {
    const {
      studentId,
      password,
    } = req.body;

    // -----------------------------
    // Validate input
    // -----------------------------

    if (!studentId || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Student ID and password are required",
      });
    }

    // -----------------------------
    // Find user
    // -----------------------------

    const user = await User.findOne({
      studentId: studentId.trim(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid student ID or password",
      });
    }

    // -----------------------------
    // Compare password
    // -----------------------------

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid student ID or password",
      });
    }

    // -----------------------------
    // Check JWT secret
    // -----------------------------

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is not configured"
      );

      return res.status(500).json({
        success: false,
        message:
          "Server authentication configuration error",
      });
    }

    // -----------------------------
    // Create JWT
    // -----------------------------

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // -----------------------------
    // Send safe user data
    // NEVER send password
    // -----------------------------

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        studentId: user.studentId,
        email: user.email,
        college: user.college,
        branch: user.branch,
        semester: user.semester,
        role: user.role,
        profileImage:
          user.profileImage || null,
        resume:
          user.resume || null,
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
  registerUser,
  loginUser,
};