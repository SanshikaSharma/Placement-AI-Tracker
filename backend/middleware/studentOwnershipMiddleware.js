const mongoose = require("mongoose");

const studentOwnershipMiddleware = (req, res, next) => {
  try {
    // Authentication check
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Admin has access to all student data
    if (req.user.role === "admin") {
      return next();
    }

    // Safely get student/user ID from all possible locations
    const requestedStudentId =
      req.params?.studentId ||
      req.params?.userId ||
      req.params?.id ||
      req.body?.studentId ||
      req.body?.student ||
      req.query?.studentId ||
      req.query?.userId;

    // Student ID missing
    if (!requestedStudentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(requestedStudentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Student ID",
      });
    }

    // Check ownership
    if (String(req.user.id) !== String(requestedStudentId)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only access your own data.",
      });
    }

    next();
  } catch (error) {
    console.error(
      "Student Ownership Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Authorization check failed",
    });
  }
};

module.exports = studentOwnershipMiddleware;