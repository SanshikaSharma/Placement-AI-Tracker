import api from "./api";

export const applyToCompany = async (data) => {
  const res = await api.post("/application/apply", data);
  return res.data;
};

export const getMyApplications = async (studentId) => {
  const res = await api.get(`/application/student/${studentId}`);
  return res.data;
};

export const withdrawApplication = async (applicationId) => {
  const res = await api.delete(`/application/${applicationId}`);
  return res.data;
};