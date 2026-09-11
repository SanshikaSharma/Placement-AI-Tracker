import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMyNotifications } from "../../services/notificationService";

function Sidebar() {
  const [unreadCount, setUnreadCount] = useState(0);

  const getCurrentUser = () => {
    const storedUser = sessionStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("User Data Parse Error:", error);
      return null;
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadUnreadNotifications = async () => {
      try {
        const user = getCurrentUser();

        const studentId = user?._id || user?.id;

        if (!studentId) {
          return;
        }

        const res = await getMyNotifications(studentId);

        if (!cancelled && res.success) {
          setUnreadCount(res.unreadCount || 0);
        }
      } catch (error) {
        console.error(
          "Notification Count Error:",
          error
        );
      }
    };

    loadUnreadNotifications();

    // Check for new notifications every 30 seconds
    const interval = setInterval(
      loadUnreadNotifications,
      30000
    );

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

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
      name: "Recommendations",
      path: "/recommendations",
      icon: "⭐",
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: "📊",
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: "🔔",
    },
    {
  name: "AI Interview",
  path: "/ai-interview",
  icon: "🤖",
}
  ];

  return (
    <aside className="w-64 min-h-screen bg-blue-900 text-white shadow-lg">

      {/* Logo */}
      <div className="p-6 border-b border-blue-700">
        <h1 className="text-2xl font-bold">
          Placement AI
        </h1>

        <p className="text-blue-200 text-sm">
          Student Portal
        </p>
      </div>

      {/* Navigation */}
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

            <span className="flex-1">
              {item.name}
            </span>

            {/* Notification Badge */}
            {item.path === "/notifications" &&
              unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold min-w-5.5 h-5.5 px-1 rounded-full flex items-center justify-center">
                  {unreadCount > 99
                    ? "99+"
                    : unreadCount}
                </span>
              )}
          </NavLink>
        ))}

      </nav>

    </aside>
  );
}

export default Sidebar;