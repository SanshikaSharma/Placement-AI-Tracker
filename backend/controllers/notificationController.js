const mongoose = require("mongoose");
const Notification = require("../models/Notification");

// =====================================================
// GET MY NOTIFICATIONS
// =====================================================

const getMyNotifications = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Student ID",
      });
    }

    const notifications = await Notification.find({
      student: studentId,
    }).sort({
      createdAt: -1,
    });

    const unreadCount = notifications.filter(
      (notification) => !notification.isRead
    ).length;

    return res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (error) {
    console.error(
      "Get Notifications Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load notifications",
    });
  }
};

// =====================================================
// CREATE NOTIFICATION
// =====================================================

const createNotification = async (req, res) => {
  try {
    const {
      student,
      title,
      message,
      type,
    } = req.body;

    if (!student || !title || !message) {
      return res.status(400).json({
        success: false,
        message:
          "Student, title and message are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(student)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Student ID",
      });
    }

    const notification = await Notification.create({
      student,
      title: title.trim(),
      message: message.trim(),
      type: type || "System",
    });

    return res.status(201).json({
      success: true,
      message:
        "Notification created successfully",
      notification,
    });
  } catch (error) {
    console.error(
      "Create Notification Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to create notification",
    });
  }
};

// =====================================================
// MARK ONE AS READ
// =====================================================

const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        notificationId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Notification ID",
      });
    }

    const notification =
      await Notification.findById(
        notificationId
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Admin is allowed to access notifications.
    // Students can only access their own notification.
    if (
      req.user.role !== "admin" &&
      String(notification.student) !==
        String(req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. You can only update your own notifications.",
      });
    }

    notification.isRead = true;

    await notification.save();

    return res.status(200).json({
      success: true,
      message:
        "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(
      "Mark Notification Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update notification",
    });
  }
};

// =====================================================
// MARK ALL AS READ
// =====================================================

const markAllAsRead = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Student ID",
      });
    }

    await Notification.updateMany(
      {
        student: studentId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "All notifications marked as read",
    });
  } catch (error) {
    console.error(
      "Mark All Notifications Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update notifications",
    });
  }
};

module.exports = {
  getMyNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
};