import api from "./api";

export const getRecommendations = async (studentId) => {
  const res = await api.get(
    `/recommendations/${studentId}`
  );

  return res.data;
};