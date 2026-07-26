import {
  FaHome,
  FaBuilding,
  FaBriefcase,
  FaFileAlt,
  FaChartBar,
  FaCalendarAlt,
  FaBell,
  FaCog,
} from "react-icons/fa";

const menus = [
  { name: "Dashboard", icon: <FaHome /> },
  { name: "Companies", icon: <FaBuilding /> },
  { name: "Applications", icon: <FaBriefcase /> },
  { name: "Resume AI", icon: <FaFileAlt /> },
  { name: "Analytics", icon: <FaChartBar /> },
  { name: "Calendar", icon: <FaCalendarAlt /> },
  { name: "Notifications", icon: <FaBell /> },
  { name: "Settings", icon: <FaCog /> },
];

function Sidebar() {
  return (
    <div className="w-72 h-screen bg-white shadow-lg border-r">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-blue-600">
          Placement AI
        </h1>

        <p className="text-sm text-gray-500">
          Career Platform
        </p>
      </div>

      <div className="mt-6">
        {menus.map((menu) => (
          <div
            key={menu.name}
            className="flex items-center gap-4 px-6 py-4 hover:bg-blue-50 cursor-pointer transition-all"
          >
            <span className="text-blue-600 text-lg">
              {menu.icon}
            </span>

            <span className="font-medium">
              {menu.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;