const express = require("express");

const router = express.Router();

const {
  getMyNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const studentOwnershipMiddleware = require(
  "../middleware/studentOwnershipMiddleware"
);

// ==========================================
// STUDENT: Get Own Notifications
// ==========================================
router.get(
  "/student/:studentId",
  authMiddleware,
  studentOwnershipMiddleware,
  getMyNotifications
);

// ==========================================
// ADMIN: Create Notification
// ==========================================
router.post(
  "/",
  adminMiddleware,
  createNotification
);

// ==========================================
// STUDENT: Mark Own Notification as Read
// ==========================================
router.put(
  "/:notificationId/read",
  authMiddleware,
  markAsRead
);

// ==========================================
// STUDENT: Mark All Own Notifications as Read
// ==========================================
router.put(
  "/student/:studentId/read-all",
  authMiddleware,
  studentOwnershipMiddleware,
  markAllAsRead
);

module.exports = router;