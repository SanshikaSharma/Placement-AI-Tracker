import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
   {
  name: "Dashboard",
  path: "/dashboard",
  icon: "🏠",
},
    {
      name: "My Profile",
      path: "/profile",
      icon: "👤",
    },
    {
      name: "Resume",
      path: "/resume",
      icon: "📄",
    },
    {
      name: "AI Resume Analysis",
      path: "/resume-analysis",
      icon: "🤖",
    },
    {
      name: "Companies",
      path: "/companies",
      icon: "🏢",
    },
    {
      name: "Applications",
      path: "/applications",
      icon: "📄",
    },
    {
      name: "My Applications",
      path: "/my-applications",
      icon: "📋",
    },
    {
      name: "Placements",
      path: "/placements",
      icon: "💼",
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: "📊",
    },
  
  ];

  return (
    <aside className="w-64 min-h-screen bg-blue-900 text-white shadow-lg">

      <div className="p-6 border-b border-blue-700">
        <h1 className="text-2xl font-bold">
          Placement AI
        </h1>

        <p className="text-blue-200 text-sm">
          Student Portal
        </p>
      </div>

      <nav className="mt-6 px-3">

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                isActive
                  ? "bg-white text-blue-900 font-semibold"
                  : "hover:bg-blue-800"
              }`
            }
          >
            <span className="text-xl">
              {item.icon}
            </span>

            <span>{item.name}</span>
          </NavLink>
        ))}

      </nav>

    </aside>
  );
}

export default Sidebar;