import { FaUserCircle } from "react-icons/fa";

function Navbar() {
  return (
    <div
      style={{
        height: "70px",
        background: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 30px",
        borderBottom: "1px solid #ddd",
        marginBottom: "20px",
      }}
    >
      <h2 style={{ color: "#1e293b" }}>
        Placement AI Tracker
      </h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <FaUserCircle size={32} />
        <span>Welcome</span>
      </div>
    </div>
  );
}

export default Navbar;