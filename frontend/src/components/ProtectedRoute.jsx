import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {
  const token = sessionStorage.getItem("token");
  const user = sessionStorage.getItem("user");

  // Not logged in
  if (!token || !user) {
    sessionStorage.clear();
    return <Navigate to="/login" replace />;
  }

  let userData;

  try {
    userData = JSON.parse(user);
  } catch (error) {
    console.error("Invalid user data:", error);

    sessionStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // Admin-only route
  if (adminOnly && userData.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;