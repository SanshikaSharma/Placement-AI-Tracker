import api from "./api";

export const uploadResume = async (formData) => {
  const res = await api.post("/resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const getResume = async (studentId) => {
  const res = await api.get(`/resume/${studentId}`);
  return res.data;
};

export const analyzeResume = async (studentId) => {
  const res = await api.post(`/resume/analyze/${studentId}`);
  return res.data;
};

export const deleteResume = async (studentId) => {
  const res = await api.delete(`/resume/${studentId}`);
  return res.data;
};

/*
 * Live-safe resume download URL
 */
export const getResumeDownloadUrl = (studentId) => {
  const baseUrl =
    import.meta.env.VITE_API_URL ||
    "https://placement-ai-tracker-backend.onrender.com/api";

  return `${baseUrl}/resume/download/${studentId}`;
};

/*
 * Backward-compatible function.
 * ResumePage.jsx already uses downloadResume,
 * so we keep the existing export.
 */
export const downloadResume = (studentId) => {
  return getResumeDownloadUrl(studentId);
};