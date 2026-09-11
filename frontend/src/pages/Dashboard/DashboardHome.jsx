import { useEffect, useState } from "react";

import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import StatCard from "../../components/dashboard/StatCard";
import ProgressCard from "../../components/dashboard/ProgressCard";
import ResumeStatus from "../../components/dashboard/ResumeStatus";
import UpcomingDrives from "../../components/dashboard/UpcomingDrives";
import RecentApplications from "../../components/dashboard/RecentApplications";

import { getDashboardData } from "../../services/dashboardService";

function DashboardHome() {
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const storedUser = sessionStorage.getItem("user");

        if (!storedUser) {
          setLoading(false);
          return;
        }

        const currentUser =
          JSON.parse(storedUser);

        setUser(currentUser);

        if (!currentUser.id) {
          console.error(
            "Student ID not found"
          );
          setLoading(false);
          return;
        }

        const data =
          await getDashboardData(
            currentUser.id
          );

        if (data.success) {
          setDashboard(data);
        }
      } catch (error) {
        console.error(
          "Dashboard Error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (!user || !dashboard) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-600">
          Unable to load dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">

      <WelcomeBanner
        name={user.name || "Student"}
      />

      {/* ==============================
          STAT CARDS
      ============================== */}

      <div className="grid md:grid-cols-4 gap-6 mt-8">

        <StatCard
          title="ATS Score"
          value={
            dashboard.resumeUploaded
              ? `${dashboard.atsScore}%`
              : "N/A"
          }
          icon="🎯"
          color="bg-green-600"
        />

        <StatCard
          title="Applications"
          value={dashboard.applicationCount}
          icon="📄"
          color="bg-blue-600"
        />

        <StatCard
          title="Companies"
          value={dashboard.companyCount}
          icon="🏢"
          color="bg-purple-600"
        />

        <StatCard
          title="Interviews"
          value={dashboard.interviewCount}
          icon="💼"
          color="bg-orange-600"
        />

      </div>

      {/* ==============================
          PROGRESS + RESUME
      ============================== */}

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        <ProgressCard
          progress={
            dashboard.profileProgress || 0
          }
        />

        <ResumeStatus
          uploaded={
            dashboard.resumeUploaded
          }
          analyzed={
            dashboard.resumeAnalyzed
          }
        />

      </div>

      {/* ==============================
          UPCOMING + RECENT
      ============================== */}

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        <UpcomingDrives />

        <RecentApplications />

      </div>

    </div>
  );
}

export default DashboardHome;