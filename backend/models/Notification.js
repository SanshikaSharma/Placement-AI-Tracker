const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // Student who will receive the notification
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Notification title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Notification message
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Notification type
    type: {
      type: String,
      enum: [
        "Application",
        "Company",
        "Interview",
        "Selection",
        "Rejection",
        "System",
      ],
      default: "System",
    },

    // Whether student has read it
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);