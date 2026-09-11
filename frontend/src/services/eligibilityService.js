import api from "./api";

// ==========================================
// Check Student Eligibility
// ==========================================
export const checkEligibility = async (studentId, companyId) => {
  const res = await api.get(
    `/eligibility/${studentId}/${companyId}`
  );

  return res.data;
};