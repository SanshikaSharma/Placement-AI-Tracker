const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    resume: {
  type: String,
  default: "",
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);