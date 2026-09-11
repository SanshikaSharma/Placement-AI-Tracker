import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

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

function ApplicationAnalytics() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadApplications() {
      try {
        const res = await api.get("/application/all");

        console.log("Analytics Applications:", res.data);

        if (!ignore) {
          setApplications(res.data.applications || []);
        }
      } catch (error) {
        console.error("Analytics Error:", error);

        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Unable to load application analytics."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadApplications();

    return () => {
      ignore = true;
    };
  }, []);

  // ==========================================
  // APPLICATION COUNTS
  // ==========================================

  const analytics = useMemo(() => {
    const total = applications.length;

    const applied = applications.filter(
      (app) => app.status === "Applied"
    ).length;

    const shortlisted = applications.filter(
      (app) =>
        app.status === "Shortlisted" ||
        app.status === "OA"
    ).length;

    const interview = applications.filter(
      (app) => app.status === "Interview"
    ).length;

    const selected = applications.filter(
      (app) => app.status === "Selected"
    ).length;

    const rejected = applications.filter(
      (app) => app.status === "Rejected"
    ).length;

    const successRate =
      total > 0
        ? Math.round((selected / total) * 100)
        : 0;

    return {
      total,
      applied,
      shortlisted,
      interview,
      selected,
      rejected,
      successRate,
    };
  }, [applications]);

  // ==========================================
  // CHART DATA
  // ==========================================

  const chartData = [
    {
      name: "Applied",
      value: analytics.applied,
    },
    {
      name: "Shortlisted",
      value: analytics.shortlisted,
    },
    {
      name: "Interview",
      value: analytics.interview,
    },
    {
      name: "Selected",
      value: analytics.selected,
    },
    {
      name: "Rejected",
      value: analytics.rejected,
    },
  ];

  const COLORS = [
    "#2196F3",
    "#FFC107",
    "#FF9800",
    "#4CAF50",
    "#F44336",
  ];

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">
          Application Analytics
        </h1>

        <p className="mt-4">
          Loading analytics...
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">
          Application Analytics
        </h1>

        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          📊 Application Analytics
        </h1>

        <p className="text-gray-600 mt-2">
          Track your placement application progress.
        </p>
      </div>

      {/* STAT CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <Card
          title="Total Applications"
          value={analytics.total}
          color="#007bff"
        />

        <Card
          title="Applied"
          value={analytics.applied}
          color="#17a2b8"
        />

        <Card
          title="Shortlisted"
          value={analytics.shortlisted}
          color="#ffc107"
        />

        <Card
          title="Interviews"
          value={analytics.interview}
          color="#fd7e14"
        />

        <Card
          title="Selected"
          value={analytics.selected}
          color="#28a745"
        />

        <Card
          title="Rejected"
          value={analytics.rejected}
          color="#dc3545"
        />

      </div>

      {/* SUCCESS RATE */}

      <div className="bg-white rounded-xl shadow-lg p-6 mt-8">

        <h2 className="text-2xl font-bold">
          Placement Success Rate
        </h2>

        <div className="flex items-center gap-6 mt-5">

          <div className="w-full bg-gray-200 rounded-full h-5">

            <div
              className="bg-green-500 h-5 rounded-full transition-all"
              style={{
                width: `${analytics.successRate}%`,
              }}
            />

          </div>

          <span className="text-2xl font-bold">
            {analytics.successRate}%
          </span>

        </div>

      </div>

      {/* CHARTS */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

        {/* PIE CHART */}

        <div className="bg-white rounded-xl shadow-lg p-6">

          <h2 className="text-2xl font-bold mb-4">
            Application Distribution
          </h2>

          {analytics.total === 0 ? (
            <div className="h-75 flex items-center justify-center text-gray-500">
              No application data available.
            </div>
          ) : (
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <PieChart>

                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >

                  {chartData.map((entry, index) => (
                    <Cell
                      key={`${entry.name}-${index}`}
                      fill={COLORS[index]}
                    />
                  ))}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>
            </ResponsiveContainer>
          )}

        </div>

        {/* BAR CHART */}

        <div className="bg-white rounded-xl shadow-lg p-6">

          <h2 className="text-2xl font-bold mb-4">
            Application Status
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart data={chartData}>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="name" />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Bar
                dataKey="value"
                fill="#1976d2"
                radius={[6, 6, 0, 0]}
              />

            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* RECENT APPLICATIONS */}

      <div className="bg-white rounded-xl shadow-lg p-6 mt-8">

        <h2 className="text-2xl font-bold mb-6">
          Recent Applications
        </h2>

        {applications.length === 0 ? (

          <p className="text-gray-500">
            No Applications Found
          </p>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="text-left p-4">
                    Company
                  </th>

                  <th className="text-left p-4">
                    Status
                  </th>

                  <th className="text-left p-4">
                    Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {applications
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(
                        b.appliedAt || b.createdAt
                      ) -
                      new Date(
                        a.appliedAt || a.createdAt
                      )
                  )
                  .slice(0, 5)
                  .map((app) => (

                    <tr
                      key={app._id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-4">
                        {app.company?.companyName ||
                          app.company?.name ||
                          "-"}
                      </td>

                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                          {app.status || "Unknown"}
                        </span>
                      </td>

                      <td className="p-4">
                        {new Date(
                          app.appliedAt ||
                            app.createdAt
                        ).toLocaleDateString()}
                      </td>

                    </tr>

                  ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

// ==========================================
// STAT CARD
// ==========================================

function Card({ title, value, color }) {
  return (
    <div
      style={{
        background: color,
      }}
      className="text-white p-6 rounded-xl shadow-lg"
    >

      <p className="text-lg font-medium">
        {title}
      </p>

      <h2 className="text-4xl font-bold mt-3">
        {value}
      </h2>

    </div>
  );
}

export default ApplicationAnalytics;