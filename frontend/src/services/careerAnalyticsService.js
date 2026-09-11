import api from "./api";

export const getCareerAnalytics = async (
  studentId
) => {
  const res = await api.get(
    `/career-analytics/${studentId}`
  );

  return res.data;
};