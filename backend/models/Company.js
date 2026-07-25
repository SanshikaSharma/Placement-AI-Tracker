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
    eligibility: {
      type: String,
      required: true,
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