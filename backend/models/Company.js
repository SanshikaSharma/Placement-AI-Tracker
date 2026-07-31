const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    package: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    jobType: {
      type: String,
      default: "Full Time",
    },

    eligibleBranches: [
      {
        type: String,
      },
    ],

    minimumCGPA: {
      type: Number,
      default: 0,
    },

    skillsRequired: [
      {
        type: String,
      },
    ],

    eligibility: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    applyLink: {
      type: String,
      default: "",
    },

    deadline: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      default: "Open",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Company", companySchema);