const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Basic Details
    name: {
      type: String,
      required: true,
    },

    studentId: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    // Academic Details
    college: {
      type: String,
      default: "",
    },

    branch: {
      type: String,
      default: "",
    },

    semester: {
      type: Number,
      default: 1,
    },

    cgpa: {
      type: Number,
      default: 0,
    },
    skills: [
  {
    type: String,
  },
],

    // Personal Details
    phone: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      default: "",
    },

    dob: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    // Skills
    skills: {
      type: [String],
      default: [],
    },

    // Projects
    projects: {
      type: [String],
      default: [],
    },

    // Certifications
    certifications: {
      type: [String],
      default: [],
    },

    // Social
    linkedin: {
      type: String,
      default: "",
    },

    github: {
      type: String,
      default: "",
    },

    // Placement
    placementStatus: {
      type: String,
      enum: [
        "Preparing",
        "Applied",
        "Interview",
        "Selected",
        "Rejected",
      ],
      default: "Preparing",
    },

    // Role
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    // Profile Image
    profileImage: {
      type: String,
      default: "",
    },

    // Resume
    resume: {
      fileName: {
        type: String,
        default: "",
      },

      originalName: {
        type: String,
        default: "",
      },

      filePath: {
        type: String,
        default: "",
      },

      uploadedAt: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);