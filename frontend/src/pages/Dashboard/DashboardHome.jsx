import { useEffect, useState } from "react";
import { getDashboardData } from "../../services/dashboardService";

import StatCard from "../../components/dashboard/StatCard";
import ActivityChart from "../../components/dashboard/ActivityChart";
import StatusPieChart from "../../components/dashboard/StatusPieChart";
import RecentApplications from "../../components/dashboard/RecentApplications";
import UpcomingDeadlines from "../../components/dashboard/UpcomingDeadlines";
import AICareerInsights from "../../components/dashboard/AICareerInsights";

import {
  FaBuilding,
  FaBriefcase,
  FaUserCheck,
  FaTrophy,
  FaBell,
} from "react-icons/fa";

function DashboardHome() {
  const [stats, setStats] = useState({
    companies: 0,
    applications: 0,
    shortlisted: 0,
    offers: 0,
  });

  const [applications, setApplications] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardData();

        setApplications(data.applications);
        setCompanies(data.companies);

        const interview = data.applications.filter(
          (app) => app.status === "Interview"
        ).length;

        const selected = data.applications.filter(
          (app) => app.status === "Selected"
        ).length;

        const applied = data.applications.filter(
          (app) => app.status === "Applied"
        ).length;

        const rejected = data.applications.filter(
          (app) => app.status === "Rejected"
        ).length;

        setStats({
          companies: data.companies.length,
          applications: data.applications.length,
          shortlisted: interview,
          offers: selected,
        });

        setStatusData([
          {
            name: "Applied",
            value: applied,
          },
          {
            name: "Interview",
            value: interview,
          },
          {
            name: "Selected",
            value: selected,
          },
          {
            name: "Rejected",
            value: rejected,
          },
        ]);

        // Temporary chart data
        // Next step we'll generate this automatically
        setChartData([
          { month: "Jan", applications: 2 },
          { month: "Feb", applications: 5 },
          { month: "Mar", applications: 8 },
          { month: "Apr", applications: 10 },
          { month: "May", applications: 14 },
          {
            month: "Jun",
            applications: data.applications.length,
          },
        ]);
      } catch (error) {
        console.log("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}

      <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-1">
            Here's an overview of your placement journey.
          </p>
        </div>

        <button className="relative bg-white border border-gray-200 p-3 rounded-xl shadow-sm hover:shadow-md transition">
          <FaBell className="text-gray-700 text-xl" />

          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>

      </header>

      {/* Dashboard */}

      <div className="p-8">

        {/* Stat Cards */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <StatCard
            title="Companies"
            value={stats.companies}
            change="Live Data"
            icon={<FaBuilding />}
            color="bg-blue-500"
          />

          <StatCard
            title="Applications"
            value={stats.applications}
            change="Live Data"
            icon={<FaBriefcase />}
            color="bg-purple-500"
          />

          <StatCard
            title="Interview"
            value={stats.shortlisted}
            change="Live Data"
            icon={<FaUserCheck />}
            color="bg-green-500"
          />

          <StatCard
            title="Selected"
            value={stats.offers}
            change="Live Data"
            icon={<FaTrophy />}
            color="bg-yellow-500"
          />

        </div>

        {/* Charts */}

        <div className="grid lg:grid-cols-2 gap-6 mt-8">

          <ActivityChart
            data={chartData}
          />

          <StatusPieChart
            data={statusData}
          />

        </div>

        {/* Recent Applications */}

        <div className="grid lg:grid-cols-2 gap-6 mt-8">

  <RecentApplications
    applications={applications}
  />

  <UpcomingDeadlines
    companies={companies}
  />
  <div className="grid lg:grid-cols-2 gap-6 mt-8">
  <AICareerInsights stats={stats} />

  <div className="bg-white rounded-2xl shadow-md p-6">
    <h2 className="text-xl font-bold mb-5">
      Quick Actions
    </h2>

    <div className="grid grid-cols-2 gap-4">
      <button className="bg-blue-600 text-white rounded-xl py-3 hover:bg-blue-700 transition">
        + Add Company
      </button>

      <button className="bg-green-600 text-white rounded-xl py-3 hover:bg-green-700 transition">
        + Apply Job
      </button>

      <button className="bg-purple-600 text-white rounded-xl py-3 hover:bg-purple-700 transition">
        Analytics
      </button>

      <button className="bg-orange-600 text-white rounded-xl py-3 hover:bg-orange-700 transition">
        My Profile
      </button>
    </div>
  </div>
</div>

</div>

      </div>

    </div>
  );
}

export default DashboardHome;