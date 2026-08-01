import api from "./api";

// ===========================
// Get All Companies
// ===========================
export const getCompanies = async () => {
  const res = await api.get("/company");
  return res.data;
};

// ===========================
// Get Company By ID
// ===========================
export const getCompanyById = async (id) => {
  const res = await api.get(`/company/${id}`);
  return res.data;
};

// ===========================
// Add Company
// ===========================
export const createCompany = async (data) => {
  const res = await api.post("/company", data);
  return res.data;
};

// ===========================
// Update Company
// ===========================
export const updateCompany = async (id, data) => {
  const res = await api.put(`/company/${id}`, data);
  return res.data;
};

// ===========================
// Delete Company
// ===========================
export const deleteCompany = async (id) => {
  const res = await api.delete(`/company/${id}`);
  return res.data;
};

// ===========================
// Apply Company
// ===========================
export const applyToCompany = async (companyId) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user._id) {
    throw new Error("User not logged in.");
  }

  const res = await api.post("/application/apply", {
    companyId,
    studentId: user._id,
  });

  return res.data;
};