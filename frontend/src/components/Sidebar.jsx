import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaBuilding,
  FaClipboardList,
  FaChartPie,
  FaFileAlt,
  FaSignOutAlt,
} from "react-icons/fa";

function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { name: "Profile", path: "/", icon: <FaUser /> },
    { name: "Companies", path: "/companies", icon: <FaBuilding /> },
    { name: "Applications", path: "/applications", icon: <FaClipboardList /> },
    { name: "Analytics", path: "/analytics", icon: <FaChartPie /> },
    { name: "Resume Analyzer", path: "/placements", icon: <FaFileAlt /> },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div
      style={{
        width: "250px",
        minHeight: "100vh",
        background: "#1e293b",
        color: "white",
        padding: "20px",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <h2 style={{ marginBottom: "30px" }}>
        Placement AI Tracker
      </h2>

      {menu.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            color:
              location.pathname === item.path
                ? "#38bdf8"
                : "white",
            padding: "12px 0",
            fontSize: "17px",
          }}
        >
          {item.icon}
          {item.name}
        </Link>
      ))}

      <button
        onClick={logout}
        style={{
          marginTop: "40px",
          width: "100%",
          padding: "12px",
          background: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
}

export default Sidebar;