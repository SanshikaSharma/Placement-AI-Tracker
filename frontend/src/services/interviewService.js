import api from "./api";

export const getInterviewQuestion = async (
  category,
  difficulty
) => {
  const res = await api.get(
    `/interview/question?category=${encodeURIComponent(
      category
    )}&difficulty=${encodeURIComponent(
      difficulty
    )}`
  );

  return res.data;
};


export const evaluateInterviewAnswer = async (
  data
) => {
  const res = await api.post(
    "/interview/evaluate",
    data
  );

  return res.data;
};


export const getInterviewHistory = async (
  studentId
) => {
  const res = await api.get(
    `/interview/history/${studentId}`
  );

  return res.data;
};


export const deleteInterviewHistory = async (
  studentId
) => {
  const res = await api.delete(
    `/interview/history/${studentId}`
  );

  return res.data;
};