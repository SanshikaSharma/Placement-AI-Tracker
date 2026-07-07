const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Applied",
        "OA",
        "Interview",
        "Rejected",
        "Selected",
      ],
      default: "Applied",
    },

    dateApplied: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Placement",
  placementSchema
);