import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import api from "../../services/api";

function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadAnalytics = async () => {
      try {
        const response = await api.get(
          "/admin/dashboard"
        );

        console.log(
          "Admin Analytics Response:",
          response.data
        );

        if (!ignore && response.data.success) {
          setData(response.data);
          setApplications(
            response.data.recentApplications || []
          );
        }
      } catch (err) {
        console.error(
          "Admin Analytics Error:",
          err
        );

        if (!ignore) {
          setError(
            err.response?.data?.message ||
              "Unable to load analytics."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadAnalytics();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-10">
        <h1 className="text-3xl font-bold">
          Loading Analytics...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10">
        <div className="bg-red-100 text-red-700 p-5 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-10">
        No analytics data available.
      </div>
    );
  }

  const chartData = [
    {
      name: "Applied",
      value: applications.filter(
        (app) => app.status === "Applied"
      ).length,
    },
    {
      name: "Interview",
      value: applications.filter(
        (app) => app.status === "Interview"
      ).length,
    },
    {
      name: "Selected",
      value: applications.filter(
        (app) => app.status === "Selected"
      ).length,
    },
    {
      name: "Rejected",
      value: applications.filter(
        (app) => app.status === "Rejected"
      ).length,
    },
  ];

  const COLORS = [
    "#3B82F6",
    "#F59E0B",
    "#22C55E",
    "#EF4444",
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Admin Analytics
        </h1>

        <p className="text-gray-600 mt-2">
          Placement and application statistics
        </p>

      </div>

      {/* =========================
          STAT CARDS
      ========================= */}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title="Total Students"
          value={data.totalStudents || 0}
          color="bg-blue-600"
        />

        <StatCard
          title="Total Companies"
          value={data.totalCompanies || 0}
          color="bg-purple-600"
        />

        <StatCard
          title="Total Applications"
          value={data.totalApplications || 0}
          color="bg-orange-500"
        />

        <StatCard
          title="Selected Students"
          value={data.selectedStudents || 0}
          color="bg-green-600"
        />

      </div>

      {/* =========================
          SECOND ROW
      ========================= */}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

        <StatCard
          title="Pending Applications"
          value={data.pendingApplications || 0}
          color="bg-yellow-500"
        />

        <StatCard
          title="Resumes Uploaded"
          value={data.resumeUploaded || 0}
          color="bg-indigo-600"
        />

        <StatCard
          title="Placement Percentage"
          value={`${data.placementPercentage || 0}%`}
          color="bg-teal-600"
        />

      </div>

      {/* =========================
          CHARTS
      ========================= */}

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        {/* PIE CHART */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-2xl font-bold mb-5">
            Application Status
          </h2>

          {data.totalApplications > 0 ? (
            <ResponsiveContainer
              width="100%"
              height={350}
            >
              <PieChart>

                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label
                >
                  {chartData.map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          COLORS[index]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-87.5 flex items-center justify-center text-gray-500">
              No application data available.
            </div>
          )}

        </div>

        {/* BAR CHART */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-2xl font-bold mb-5">
            Application Overview
          </h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <BarChart data={chartData}>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="value"
                fill="#2563EB"
                radius={[6, 6, 0, 0]}
              />

            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* =========================
          RECENT APPLICATIONS
      ========================= */}

      <div className="bg-white rounded-xl shadow p-6 mt-8">

        <h2 className="text-2xl font-bold mb-5">
          Recent Applications
        </h2>

        {applications.length === 0 ? (
          <p className="text-gray-500">
            No applications found.
          </p>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full border-collapse">

              <thead>

                <tr className="bg-gray-100">

                  <th className="text-left p-3">
                    Student
                  </th>

                  <th className="text-left p-3">
                    Company
                  </th>

                  <th className="text-left p-3">
                    Status
                  </th>

                  <th className="text-left p-3">
                    Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {applications.map(
                  (application) => {

                    const status =
                      application.status;

                    let statusClass =
                      "bg-gray-100 text-gray-700";

                    if (
                      status === "Applied"
                    ) {
                      statusClass =
                        "bg-blue-100 text-blue-700";
                    }

                    if (
                      status === "Interview"
                    ) {
                      statusClass =
                        "bg-yellow-100 text-yellow-700";
                    }

                    if (
                      status === "Selected"
                    ) {
                      statusClass =
                        "bg-green-100 text-green-700";
                    }

                    if (
                      status === "Rejected"
                    ) {
                      statusClass =
                        "bg-red-100 text-red-700";
                    }

                    return (
                      <tr
                        key={
                          application._id
                        }
                        className="border-b"
                      >

                        <td className="p-3">

                          {application.student
                            ?.name ||
                            "Unknown Student"}

                        </td>

                        <td className="p-3">

                          {application.company
                            ?.companyName ||
                            "Unknown Company"}

                        </td>

                        <td className="p-3">

                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClass}`}
                          >
                            {status}
                          </span>

                        </td>

                        <td className="p-3">

                          {application.createdAt
                            ? new Date(
                                application.createdAt
                              ).toLocaleDateString()
                            : "-"}

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

function StatCard({
  title,
  value,
  color,
}) {
  return (
    <div
      className={`${color} text-white rounded-xl shadow-lg p-6`}
    >

      <p className="text-lg opacity-90">
        {title}
      </p>

      <h2 className="text-4xl font-bold mt-3">
        {value}
      </h2>

    </div>
  );
}

export default AdminAnalytics;