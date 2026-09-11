import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: "📊",
    },
    {
      name: "Students",
      path: "/admin/students",
      icon: "👨‍🎓",
    },
    {
      name: "Companies",
      path: "/admin/companies",
      icon: "🏢",
    },
    {
      name: "Applications",
      path: "/admin/applications",
      icon: "📄",
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: "📈",
    },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/admin-login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static
          top-0 left-0
          z-40
          h-screen
          w-64
          bg-gray-900
          text-white
          flex flex-col
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >

        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-gray-700">
          <div>
            <h1 className="text-xl font-bold">
              Placement AI
            </h1>

            <p className="text-xs text-gray-400 mt-1">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">

          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <span className="text-lg">
                {item.icon}
              </span>

              <span className="font-medium">
                {item.name}
              </span>
            </NavLink>
          ))}

        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg
                       text-gray-300 hover:bg-red-600 hover:text-white
                       transition"
          >
            <span>🚪</span>

            <span className="font-medium">
              Logout
            </span>
          </button>

        </div>

      </aside>

      {/* Main Area */}
      <div className="flex-1 min-w-0">

        {/* Top Header */}
        <header className="h-20 bg-white border-b flex items-center justify-between px-4 sm:px-6">

          {/* Mobile Menu */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-2xl text-gray-700"
          >
            ☰
          </button>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Admin Panel
            </h2>

            <p className="text-sm text-gray-500 hidden sm:block">
              Manage your placement platform
            </p>
          </div>

          {/* Admin Profile */}
          <div className="flex items-center gap-3">

            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-800">
                Administrator
              </p>

              <p className="text-xs text-gray-500">
                Admin
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-blue-600 text-white
                            flex items-center justify-center font-bold">
              A
            </div>

          </div>

        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;