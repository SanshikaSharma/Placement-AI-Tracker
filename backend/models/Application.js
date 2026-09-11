const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    // ==========================
    // STUDENT
    // ==========================
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================
    // COMPANY
    // ==========================
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    // ==========================
    // APPLICATION STATUS
    // ==========================
    status: {
      type: String,
      enum: [
        "Applied",
        "Pending",
        "OA",
        "Shortlisted",
        "Interview",
        "Selected",
        "Rejected",
      ],
      default: "Applied",
    },

    // ==========================
    // APPLIED DATE
    // ==========================
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Application",
  applicationSchema
);