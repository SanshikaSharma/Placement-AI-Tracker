import api from "./api";

// =============================
// Get Admin Dashboard
// =============================
export const getAdminDashboard = async () => {
  const res = await api.get("/admin/dashboard");
  return res.data;
};