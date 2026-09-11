import api from "./api";

// Get student's notifications
export const getMyNotifications = async (studentId) => {
  const res = await api.get(
    `/notifications/student/${studentId}`
  );

  return res.data;
};

// Create notification
export const createNotification = async (data) => {
  const res = await api.post(
    "/notifications",
    data
  );

  return res.data;
};

// Mark one notification as read
export const markNotificationAsRead = async (
  notificationId
) => {
  const res = await api.put(
    `/notifications/${notificationId}/read`
  );

  return res.data;
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (
  studentId
) => {
  const res = await api.put(
    `/notifications/student/${studentId}/read-all`
  );

  return res.data;
};
export const deleteNotification =
  async (notificationId) => {
    const res = await api.delete(
      `/notifications/${notificationId}`
    );

    return res.data;
  };