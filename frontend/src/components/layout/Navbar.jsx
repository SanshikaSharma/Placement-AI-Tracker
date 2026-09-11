import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";

function Navbar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();

  const user = JSON.parse(
    sessionStorage.getItem("user") || "{}"
  );

  const handleLogout = () => {
    // Clear only this browser tab's login data
    sessionStorage.clear();

    alert("Logout Successful");

    // Prevent going back to dashboard
    navigate("/login", { replace: true });

    // Reload application
    window.location.reload();
  };

  return (
    <header className="h-20 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-8">

      {/* Left */}
      <div className="flex items-center gap-5">

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-2xl text-gray-700 hover:text-blue-700"
        >
          <FaBars />
        </button>

        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search companies, students, applications..."
            className="w-96 pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

      </div>

      {/* Right */}
      <div className="flex items-center gap-6">

        <button className="relative text-2xl text-gray-600">
          <FaBell />

          <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            3
          </span>
        </button>

        <div className="flex items-center gap-3">

          <FaUserCircle className="text-5xl text-blue-700" />

          <div>
            <h3 className="font-semibold">
              {user.name || "Student"}
            </h3>

            <p className="text-sm text-gray-500">
              {user.branch || "CSE"} • Semester{" "}
              {user.semester || "-"}
            </p>
          </div>

        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

    </header>
  );
}

export default Navbar;