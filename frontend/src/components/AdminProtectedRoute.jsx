import { Navigate, Outlet } from "react-router-dom";

function AdminProtectedRoute() {
 const token = sessionStorage.getItem("token");
const rawUser = sessionStorage.getItem("user");

  // eslint-disable-next-line no-useless-assignment
  let user = null;

  try {
    user = rawUser ? JSON.parse(rawUser) : null;
  } catch (error) {
    console.error("Invalid user data:", error);
    user = null;
  }

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/admin-login" replace />;
  }

  // Logged in but not an admin
  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default AdminProtectedRoute;