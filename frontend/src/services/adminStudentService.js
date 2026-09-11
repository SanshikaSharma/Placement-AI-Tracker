import api from "./api";

export const getAllStudents = async () => {
  const res = await api.get("/admin/students");
  return res.data;
};

export const deleteStudent = async (id) => {
  const res = await api.delete(`/admin/student/${id}`);
  return res.data;
};