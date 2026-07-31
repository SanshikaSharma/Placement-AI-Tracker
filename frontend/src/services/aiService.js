import api from "./api";

export const analyzeResume = async (userId) => {
  const response = await api.get(`/ai/analyze/${userId}`);
  return response.data;
};