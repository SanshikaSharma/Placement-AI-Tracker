import api from "./api";

// Dashboard
export const getAdminDashboard = async () => {
  const res = await api.get("/admin/dashboard");
  return res.data;
};

// Students
export const getAllStudents = async () => {
  const res = await api.get("/admin/students");
  return res.data;
};

export const deleteStudent = async (id) => {
  const res = await api.delete(`/admin/student/${id}`);
  return res.data;
};

// Companies
export const getAllCompanies = async () => {
  const res = await api.get("/admin/companies");
  return res.data;
};

export const deleteCompany = async (id) => {
  const res = await api.delete(`/admin/company/${id}`);
  return res.data;
};

// Applications
export const getAllApplications = async () => {
  const res = await api.get("/admin/applications");
  return res.data;
};

export const updateApplicationStatus = async (id, status) => {
  const res = await api.put(`/admin/application/${id}`, { status });
  return res.data;
};

export const deleteApplication = async (id) => {
  const res = await api.delete(`/admin/application/${id}`);
  return res.data;
};