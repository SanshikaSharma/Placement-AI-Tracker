const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ======================================================
// REGISTER USER
// ======================================================
const registerUser = async (req, res) => {
  try {
    console.log("========== REGISTER ==========");
    console.log("REGISTER BODY:", req.body);

    const {
      name,
      studentId,
      email,
      password,
      college,
      branch,
      semester,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !studentId ||
      !email ||
      !password ||
      !college ||
      !branch ||
      !semester
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    // Check email
    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Check student ID
    const studentExists = await User.findOne({ studentId });

    if (studentExists) {
      return res.status(400).json({
        success: false,
        message: "Student ID already registered",
      });
    }

    // Hash password
    console.log("Original Password:", password);
    const hashedPassword = await bcrypt.hash(password, 10);
console.log("Hashed Password:", hashedPassword);
    // Create user
    const user = await User.create({
      name,
      studentId,
      email,
      password: hashedPassword,
      college,
      branch,
      semester: Number(semester),
    });

    console.log("USER CREATED:");
    console.log(user);

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      user: {
        id: user._id,
        name: user.name,
        studentId: user.studentId,
        email: user.email,
        college: user.college,
        branch: user.branch,
        semester: user.semester,
      },
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// LOGIN USER
// ======================================================
const loginUser = async (req, res) => {
  try {
    console.log("========== LOGIN ==========");
    console.log(req.body);

    const { studentId, password } = req.body;

    if (!studentId || !password) {
      return res.status(400).json({
        success: false,
        message: "Student ID and Password are required",
      });
    }

    const user = await User.findOne({ studentId });

    console.log("User Found:", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("Entered Password:", password);
    console.log("Stored Password:", user.password);

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
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

    res.status(200).json({
      success: true,
      message: "Login Successful",
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
        profileImage: user.profileImage,
        resume: user.resume,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};