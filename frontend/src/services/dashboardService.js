import api from "./api";

export const getDashboardData = async (studentId) => {
  const res = await api.get(
    `/dashboard/${studentId}`
  );

  return res.data;
};