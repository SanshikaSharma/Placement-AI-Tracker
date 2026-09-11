const mongoose = require("mongoose");
const User = require("../models/User");

// =====================================================
// GET ALL PROFILES
// =====================================================

const getAllProfiles = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(
      "Get All Profiles Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load profiles",
    });
  }
};

// =====================================================
// GET SINGLE PROFILE
// =====================================================

const getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID",
      });
    }

    const user = await User.findById(id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(
      "Get Profile Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load profile",
    });
  }
};

// =====================================================
// UPDATE PROFILE
// =====================================================

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // ---------------------------------------------
    // Validate User ID
    // ---------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID",
      });
    }

    // ---------------------------------------------
    // Find existing user
    // ---------------------------------------------

    const existingUser =
      await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ---------------------------------------------
    // ONLY THESE FIELDS CAN BE UPDATED
    // ---------------------------------------------

    const allowedFields = [
      "name",
      "email",
      "college",
      "branch",
      "semester",
      "cgpa",
      "phone",
      "gender",
      "dob",
      "address",
      "skills",
      "projects",
      "certifications",
      "linkedin",
      "github",
      "profileImage",
    ];

    const updateData = {};

    for (const field of allowedFields) {
      if (
        Object.prototype.hasOwnProperty.call(
          req.body,
          field
        )
      ) {
        updateData[field] = req.body[field];
      }
    }

    // ---------------------------------------------
    // Prevent empty update
    // ---------------------------------------------

    if (
      Object.keys(updateData).length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No valid profile fields provided",
      });
    }

    // ---------------------------------------------
    // STRING VALIDATION
    // ---------------------------------------------

    const stringFields = [
      "name",
      "email",
      "college",
      "branch",
      "phone",
      "gender",
      "dob",
      "address",
      "linkedin",
      "github",
    ];

    for (const field of stringFields) {
      if (
        updateData[field] !== undefined &&
        typeof updateData[field] !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message:
            `${field} must be a valid text value`,
        });
      }
    }

    // ---------------------------------------------
    // TRIM STRING VALUES
    // ---------------------------------------------

    for (const field of stringFields) {
      if (
        typeof updateData[field] === "string"
      ) {
        updateData[field] =
          updateData[field].trim();
      }
    }

    // ---------------------------------------------
    // NAME VALIDATION
    // ---------------------------------------------

    if (
      updateData.name !== undefined &&
      !updateData.name
    ) {
      return res.status(400).json({
        success: false,
        message: "Name cannot be empty",
      });
    }

    // ---------------------------------------------
    // EMAIL VALIDATION
    // ---------------------------------------------

    if (updateData.email !== undefined) {
      const email =
        updateData.email.toLowerCase();

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid email",
        });
      }

      const emailExists =
        await User.findOne({
          email,
          _id: { $ne: id },
        });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message:
            "Email is already registered",
        });
      }

      updateData.email = email;
    }

    // ---------------------------------------------
    // SEMESTER VALIDATION
    // ---------------------------------------------

    if (updateData.semester !== undefined) {
      const semester =
        Number(updateData.semester);

      if (
        !Number.isInteger(semester) ||
        semester < 1 ||
        semester > 8
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Semester must be between 1 and 8",
        });
      }

      updateData.semester = semester;
    }

    // ---------------------------------------------
    // CGPA VALIDATION
    // ---------------------------------------------

    if (updateData.cgpa !== undefined) {
      const cgpa =
        Number(updateData.cgpa);

      if (
        Number.isNaN(cgpa) ||
        cgpa < 0 ||
        cgpa > 10
      ) {
        return res.status(400).json({
          success: false,
          message:
            "CGPA must be between 0 and 10",
        });
      }

      updateData.cgpa = cgpa;
    }

    // ---------------------------------------------
    // ARRAY VALIDATION
    // ---------------------------------------------

    const arrayFields = [
      "skills",
      "projects",
      "certifications",
    ];

    for (const field of arrayFields) {
      if (updateData[field] !== undefined) {
        if (!Array.isArray(updateData[field])) {
          return res.status(400).json({
            success: false,
            message:
              `${field} must be an array`,
          });
        }

        updateData[field] =
          updateData[field]
            .filter(
              (item) =>
                typeof item === "string"
            )
            .map((item) => item.trim())
            .filter(Boolean);
      }
    }

    // ---------------------------------------------
    // UPDATE USER
    // ---------------------------------------------

    const updatedUser =
      await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Profile Updated Successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(
      "Update Profile Error:",
      error.message
    );

    // MongoDB duplicate key
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "Email or Student ID already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to update profile",
    });
  }
};

module.exports = {
  getAllProfiles,
  getProfile,
  updateProfile,
};