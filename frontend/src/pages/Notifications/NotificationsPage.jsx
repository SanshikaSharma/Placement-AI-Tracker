import { useEffect, useState } from "react";

import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/notificationService";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getCurrentUser = () => {
    const storedUser = sessionStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("User Parse Error:", error);
      return null;
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadNotifications = async () => {
      try {
        const user = getCurrentUser();

        const studentId =
          user?._id || user?.id;

        if (!studentId) {
          if (!cancelled) {
            setError(
              "Please login again."
            );
            setLoading(false);
          }

          return;
        }

        const res =
          await getMyNotifications(studentId);

        if (!cancelled && res.success) {
          setNotifications(
            res.notifications || []
          );

          setUnreadCount(
            res.unreadCount || 0
          );
        }
      } catch (error) {
        console.error(
          "Notifications Error:",
          error
        );

        if (!cancelled) {
          setError(
            error.response?.data?.message ||
              "Unable to load notifications."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadNotifications();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleMarkAsRead = async (
    notificationId
  ) => {
    try {
      await markNotificationAsRead(
        notificationId
      );

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );

      setUnreadCount((previous) =>
        Math.max(previous - 1, 0)
      );
    } catch (error) {
      console.error(
        "Mark Read Error:",
        error
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const user = getCurrentUser();

      const studentId =
        user?._id || user?.id;

      if (!studentId) {
        return;
      }

      await markAllNotificationsAsRead(
        studentId
      );

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Mark All Read Error:",
        error
      );
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "Application":
        return "📩";

      case "Company":
        return "🏢";

      case "Interview":
        return "🎤";

      case "Selection":
        return "🎉";

      case "Rejection":
        return "❌";

      default:
        return "🔔";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold">
          Loading Notifications...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8">

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <h1 className="text-3xl font-bold text-gray-800">
                🔔 Notifications
              </h1>

              <p className="text-gray-500 mt-2">
                {unreadCount} unread
                {unreadCount === 1
                  ? " notification"
                  : " notifications"}
              </p>

            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition"
              >
                ✓ Mark All as Read
              </button>
            )}

          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 bg-red-100 border border-red-200 text-red-700 p-4 rounded-xl">
              {error}
            </div>
          )}

          {/* Notification List */}
          <div className="mt-8 space-y-4">

            {notifications.length === 0 ? (
              <div className="text-center py-16">

                <div className="text-6xl">
                  🔔
                </div>

                <h2 className="text-2xl font-bold text-gray-700 mt-5">
                  No Notifications
                </h2>

                <p className="text-gray-500 mt-2">
                  You're all caught up!
                </p>

              </div>
            ) : (
              notifications.map(
                (notification) => (
                  <div
                    key={notification._id}
                    className={`rounded-2xl border p-5 transition ${
                      notification.isRead
                        ? "bg-gray-50 border-gray-200"
                        : "bg-blue-50 border-blue-200 shadow-sm"
                    }`}
                  >

                    <div className="flex gap-4">

                      {/* Icon */}
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm shrink-0">
                        {getNotificationIcon(
                          notification.type
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                          <h3
                            className={`text-lg ${
                              notification.isRead
                                ? "font-semibold text-gray-700"
                                : "font-bold text-gray-900"
                            }`}
                          >
                            {notification.title}
                          </h3>

                          {!notification.isRead && (
                            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full w-fit">
                              NEW
                            </span>
                          )}

                        </div>

                        <p className="text-gray-600 mt-2">
                          {notification.message}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">

                          <span className="text-sm text-gray-400">
                            {notification.createdAt
                              ? new Date(
                                  notification.createdAt
                                ).toLocaleString()
                              : ""}
                          </span>

                          {!notification.isRead && (
                            <button
                              onClick={() =>
                                handleMarkAsRead(
                                  notification._id
                                )
                              }
                              className="text-blue-600 hover:text-blue-800 font-semibold text-sm w-fit"
                            >
                              Mark as Read
                            </button>
                          )}

                        </div>

                      </div>

                    </div>

                  </div>
                )
              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default NotificationsPage;