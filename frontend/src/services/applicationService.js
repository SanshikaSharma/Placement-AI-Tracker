import api from "./api";

// ============================
// Get My Applications
// ============================
export const getMyApplications = async (studentId) => {
  const res = await api.get(`/application/student/${studentId}`);
  return res.data;
};

// ============================
// Withdraw Application
// ============================
export const withdrawApplication = async (applicationId) => {
  const res = await api.delete(`/application/${applicationId}`);
  return res.data;
};