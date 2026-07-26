import api from "./api";

export const getDashboardData = async () => {
  const [companies, applications, profiles] = await Promise.all([
    api.get("/company/all"),
    api.get("/application/all"),
    api.get("/profile/all"),
  ]);

  return {
    companies: companies.data.companies || [],
    applications: applications.data.applications || [],
    profiles: profiles.data.profiles || [],
  };
};