const express = require("express");

const router = express.Router();

const {
  getMyNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");

// Get student's notifications
router.get(
  "/student/:studentId",
  getMyNotifications
);

// Create notification
router.post(
  "/",
  createNotification
);

// Mark one notification as read
router.put(
  "/:notificationId/read",
  markAsRead
);

// Mark all notifications as read
router.put(
  "/student/:studentId/read-all",
  markAllAsRead
);

module.exports = router;