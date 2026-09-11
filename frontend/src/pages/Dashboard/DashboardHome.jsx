import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import StatCard from "../../components/dashboard/StatCard";
import ProgressCard from "../../components/dashboard/ProgressCard";
import ResumeStatus from "../../components/dashboard/ResumeStatus";
import UpcomingDrives from "../../components/dashboard/UpcomingDrives";
import RecentApplications from "../../components/dashboard/RecentApplications";

import { getDashboardData } from "../../services/dashboardService";
import { getMyApplications } from "../../services/applicationService";
import { getMyNotifications } from "../../services/notificationService";
import { getCareerAnalytics } from "../../services/careerAnalyticsService";

function DashboardHome() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState(null);
  const [careerAnalytics, setCareerAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const currentUser = getCurrentUser();

        if (!currentUser) {
          if (!cancelled) {
            setError("Please login to continue.");
          }
          return;
        }

        const studentId =
          currentUser.id ||
          currentUser._id;

        if (!studentId) {
          if (!cancelled) {
            setError("Student information not found.");
          }
          return;
        }

        if (!cancelled) {
          setUser(currentUser);
        }

        /*
         * Load dashboard data
         */
        try {
          const dashboardData =
            await getDashboardData(studentId);

          if (
            !cancelled &&
            dashboardData?.success
          ) {
            setDashboard(dashboardData);
          }
        } catch (dashboardError) {
          console.error(
            "Dashboard Data Error:",
            dashboardError
          );
        }

        /*
         * Load applications
         */
        try {
          const applicationData =
            await getMyApplications(studentId);

          if (!cancelled) {
            if (applicationData?.success) {
              setApplications(
                applicationData.applications ||
                  []
              );
            }
          }
        } catch (applicationError) {
          console.error(
            "Application Data Error:",
            applicationError
          );
        }

        /*
         * Load notifications
         */
        try {
          const notificationData =
            await getMyNotifications(studentId);

          if (!cancelled) {
            if (notificationData?.success) {
              setNotifications(
                notificationData
              );
            }
          }
        } catch (notificationError) {
          console.error(
            "Notification Data Error:",
            notificationError
          );
        }

        /*
         * Load career analytics
         */
        try {
          const analyticsData =
            await getCareerAnalytics(studentId);

          if (!cancelled) {
            if (analyticsData?.success) {
              setCareerAnalytics(
                analyticsData
              );
            }
          }
        } catch (analyticsError) {
          console.error(
            "Career Analytics Error:",
            analyticsError
          );
        }
      } catch (error) {
        console.error(
          "Dashboard Error:",
          error
        );

        if (!cancelled) {
          setError(
            "Unable to load dashboard."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">
            ⏳
          </div>

          <p className="text-gray-600 text-lg">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center max-w-md w-full">

          <div className="text-5xl mb-4">
            ⚠️
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Dashboard unavailable
          </h2>

          <p className="text-gray-600 mb-6">
            {error ||
              "Please login again to access your dashboard."}
          </p>

          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const applicationCount =
    dashboard?.applicationCount ??
    applications.length ??
    0;

  const companyCount =
    dashboard?.companyCount ?? 0;

  const interviewCount =
    dashboard?.interviewCount ?? 0;

  const profileProgress =
    dashboard?.profileProgress ??
    0;

  const resumeUploaded =
    Boolean(
      dashboard?.resumeUploaded
    );

  const resumeAnalyzed =
    Boolean(
      dashboard?.resumeAnalyzed
    );

  const atsScore =
    dashboard?.atsScore ?? 0;

  const careerReadiness =
    careerAnalytics?.analytics
      ?.careerReadiness ??
    careerAnalytics?.careerReadiness ??
    0;

  const unreadNotifications =
    notifications?.unreadCount ?? 0;

  const selectedApplications =
    applications.filter(
      (application) =>
        application.status ===
        "Selected"
    ).length;

  const interviewApplications =
    applications.filter(
      (application) =>
        application.status ===
        "Interview"
    ).length;

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">

      {/* =========================
          WELCOME
      ========================= */}

      <WelcomeBanner
        name={user.name || "Student"}
      />

      {/* =========================
          QUICK ACTIONS
      ========================= */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

        <button
          onClick={() =>
            navigate("/companies")
          }
          className="bg-white rounded-2xl shadow-sm p-5 text-left hover:shadow-md hover:-translate-y-1 transition"
        >
          <div className="text-3xl mb-2">
            🏢
          </div>

          <h3 className="font-bold text-gray-800">
            Find Companies
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Explore placement opportunities
          </p>
        </button>

        <button
          onClick={() =>
            navigate("/applications")
          }
          className="bg-white rounded-2xl shadow-sm p-5 text-left hover:shadow-md hover:-translate-y-1 transition"
        >
          <div className="text-3xl mb-2">
            📄
          </div>

          <h3 className="font-bold text-gray-800">
            Apply Now
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Track new job opportunities
          </p>
        </button>

        <button
          onClick={() =>
            navigate("/resume-analysis")
          }
          className="bg-white rounded-2xl shadow-sm p-5 text-left hover:shadow-md hover:-translate-y-1 transition"
        >
          <div className="text-3xl mb-2">
            🤖
          </div>

          <h3 className="font-bold text-gray-800">
            Analyze Resume
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Improve your ATS score
          </p>
        </button>

        <button
          onClick={() =>
            navigate("/ai-interview")
          }
          className="bg-white rounded-2xl shadow-sm p-5 text-left hover:shadow-md hover:-translate-y-1 transition"
        >
          <div className="text-3xl mb-2">
            🎤
          </div>

          <h3 className="font-bold text-gray-800">
            Practice Interview
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Improve interview performance
          </p>
        </button>

      </div>

      {/* =========================
          STAT CARDS
      ========================= */}

      <div className="grid md:grid-cols-4 gap-6 mt-8">

        <StatCard
          title="ATS Score"
          value={
            resumeUploaded
              ? `${atsScore}%`
              : "N/A"
          }
          icon="🎯"
          color="bg-green-600"
        />

        <StatCard
          title="Applications"
          value={applicationCount}
          icon="📄"
          color="bg-blue-600"
        />

        <StatCard
          title="Companies"
          value={companyCount}
          icon="🏢"
          color="bg-purple-600"
        />

        <StatCard
          title="Interviews"
          value={interviewCount}
          icon="💼"
          color="bg-orange-600"
        />

      </div>

      {/* =========================
          CAREER SUMMARY
      ========================= */}

      <div className="grid md:grid-cols-4 gap-6 mt-6">

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="text-sm text-gray-500">
            Career Readiness
          </p>

          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {Math.round(careerReadiness)}%
          </h2>

          <p className="text-xs text-gray-500 mt-2">
            Overall placement preparation
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="text-sm text-gray-500">
            Selected
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {selectedApplications}
          </h2>

          <p className="text-xs text-gray-500 mt-2">
            Successful applications
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="text-sm text-gray-500">
            Interview Stage
          </p>

          <h2 className="text-3xl font-bold text-orange-600 mt-2">
            {interviewApplications}
          </h2>

          <p className="text-xs text-gray-500 mt-2">
            Applications in interview
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="text-sm text-gray-500">
            Notifications
          </p>

          <h2 className="text-3xl font-bold text-red-500 mt-2">
            {unreadNotifications}
          </h2>

          <p className="text-xs text-gray-500 mt-2">
            Unread notifications
          </p>
        </div>

      </div>

      {/* =========================
          PROFILE + RESUME
      ========================= */}

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        <ProgressCard
          progress={profileProgress}
        />

        <ResumeStatus
          uploaded={resumeUploaded}
          analyzed={resumeAnalyzed}
        />

      </div>

      {/* =========================
          UPCOMING + RECENT
      ========================= */}

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        <UpcomingDrives />

        <RecentApplications />

      </div>

      {/* =========================
          FINAL ACTIONS
      ========================= */}

      <div className="bg-white rounded-2xl shadow-sm p-6 mt-8">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Continue your placement preparation 🚀
            </h2>

            <p className="text-gray-500 mt-1">
              Keep improving your profile, resume and interview skills.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={() =>
                navigate("/career-analytics")
              }
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
              Career Analytics
            </button>

            <button
              onClick={() =>
                navigate("/recommendations")
              }
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition"
            >
              View Recommendations
            </button>

            <button
              onClick={() =>
                navigate("/notifications")
              }
              className="px-5 py-3 rounded-xl bg-gray-800 hover:bg-gray-900 text-white font-semibold transition"
            >
              Notifications
              {unreadNotifications > 0 &&
                ` (${unreadNotifications})`}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default DashboardHome;