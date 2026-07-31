import api from "./api";

export const uploadResume = async (formData) => {
  const res = await api.post("/resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const getResume = async (userId) => {
  const res = await api.get(`/resume/${userId}`);
  return res.data;
};

export const deleteResume = async (userId) => {
  const res = await api.delete(`/resume/${userId}`);
  return res.data;
};

export const downloadResume = (userId) => {
  window.open(
    `http://localhost:5001/api/resume/download/${userId}`,
    "_blank"
  );
};