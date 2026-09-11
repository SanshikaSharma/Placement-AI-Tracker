import { useEffect, useMemo, useState } from "react";
import { getMyApplications } from "../../services/applicationService";

function ApplicationAnalytics() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadApplications = async () => {
      try {
        setLoading(true);
        setError("");

        // =====================================
        // GET LOGGED-IN USER
        // =====================================

        const storedUser =
          sessionStorage.getItem("user") ||
          localStorage.getItem("user");

        if (!storedUser) {
          throw new Error("Please login first.");
        }

        let user;

        try {
          user = JSON.parse(storedUser);
        } catch (parseError) {
          console.error(
            "User JSON Error:",
            parseError
          );

          throw new Error(
            "Invalid login information. Please login again.", { cause: parseError }
          );
        }

        const studentId =
          user._id ||
          user.id ||
          user.userId;

        if (!studentId) {
          throw new Error(
            "Student ID not found. Please logout and login again."
          );
        }

        console.log(
          "Application Analytics Student ID:",
          studentId
        );

        // =====================================
        // GET ONLY LOGGED-IN STUDENT'S DATA
        // =====================================

        const data =
          await getMyApplications(studentId);

        console.log(
          "Application Analytics Response:",
          data
        );

        if (mounted) {
          setApplications(
            Array.isArray(data.applications)
              ? data.applications
              : []
          );
        }
      } catch (err) {
        console.error(
          "Analytics Error:",
          err
        );

        if (mounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load application analytics."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadApplications();

    return () => {
      mounted = false;
    };
  }, []);

  // =====================================
  // ANALYTICS
  // =====================================

  const analytics = useMemo(() => {
    const total = applications.length;

    const applied = applications.filter(
      (app) => app.status === "Applied"
    ).length;

    const pending = applications.filter(
      (app) =>
        app.status === "Pending" ||
        app.status === "OA"
    ).length;

    const shortlisted = applications.filter(
      (app) => app.status === "Shortlisted"
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
        ? Math.round(
            (selected / total) * 100
          )
        : 0;

    const active =
      total - selected - rejected;

    return {
      total,
      applied,
      pending,
      shortlisted,
      interview,
      selected,
      rejected,
      successRate,
      active,
    };
  }, [applications]);

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-2xl shadow p-10 text-center">

          <h1 className="text-2xl font-bold text-gray-800">
            Loading Application Analytics...
          </h1>

          <p className="text-gray-500 mt-3">
            Please wait while we analyze your applications.
          </p>

        </div>
      </div>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8">

          <h1 className="text-2xl font-bold text-red-600">
            Unable to Load Analytics
          </h1>

          <p className="text-red-500 mt-3">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-gray-800">
          📊 Application Analytics
        </h1>

        <p className="text-gray-600 mt-2">
          Track your placement application progress.
        </p>

      </div>

      {/* ================================= */}
      {/* STAT CARDS */}
      {/* ================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <Card
          title="Total Applications"
          value={analytics.total}
          className="bg-blue-600"
        />

        <Card
          title="Applied"
          value={analytics.applied}
          className="bg-cyan-600"
        />

        <Card
          title="Pending / OA"
          value={analytics.pending}
          className="bg-yellow-500"
        />

        <Card
          title="Shortlisted"
          value={analytics.shortlisted}
          className="bg-orange-500"
        />

        <Card
          title="Interviews"
          value={analytics.interview}
          className="bg-purple-600"
        />

        <Card
          title="Selected"
          value={analytics.selected}
          className="bg-green-600"
        />

        <Card
          title="Rejected"
          value={analytics.rejected}
          className="bg-red-600"
        />

        <Card
          title="Active Applications"
          value={analytics.active}
          className="bg-indigo-600"
        />

      </div>

      {/* ================================= */}
      {/* SUCCESS RATE */}
      {/* ================================= */}

      <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

        <h2 className="text-2xl font-bold text-gray-800">
          Placement Success Rate
        </h2>

        <div className="flex items-center gap-5 mt-5">

          <div className="flex-1 bg-gray-200 rounded-full h-5 overflow-hidden">

            <div
              className="bg-green-500 h-5 rounded-full transition-all duration-700"
              style={{
                width: `${analytics.successRate}%`,
              }}
            />

          </div>

          <span className="text-2xl font-bold text-gray-800">
            {analytics.successRate}%
          </span>

        </div>

      </div>

      {/* ================================= */}
      {/* STATUS SUMMARY */}
      {/* ================================= */}

      <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Application Status Summary
        </h2>

        <div className="space-y-5">

          <StatusBar
            label="Applied"
            value={analytics.applied}
            total={analytics.total}
          />

          <StatusBar
            label="Pending / OA"
            value={analytics.pending}
            total={analytics.total}
          />

          <StatusBar
            label="Shortlisted"
            value={analytics.shortlisted}
            total={analytics.total}
          />

          <StatusBar
            label="Interview"
            value={analytics.interview}
            total={analytics.total}
          />

          <StatusBar
            label="Selected"
            value={analytics.selected}
            total={analytics.total}
          />

          <StatusBar
            label="Rejected"
            value={analytics.rejected}
            total={analytics.total}
          />

        </div>

      </div>

      {/* ================================= */}
      {/* RECENT APPLICATIONS */}
      {/* ================================= */}

      <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Recent Applications
        </h2>

        {applications.length === 0 ? (
          <div className="text-center py-8">

            <p className="text-gray-500">
              No Applications Found
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="text-left p-4">
                    Company
                  </th>

                  <th className="text-left p-4">
                    Role
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
                        b.appliedAt ||
                          b.createdAt
                      ) -
                      new Date(
                        a.appliedAt ||
                          a.createdAt
                      )
                  )
                  .slice(0, 5)
                  .map((app) => (

                    <tr
                      key={app._id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-4 font-medium">
                        {app.company?.companyName ||
                          app.company?.name ||
                          "-"}
                      </td>

                      <td className="p-4">
                        {app.company?.role ||
                          "-"}
                      </td>

                      <td className="p-4">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            app.status === "Selected"
                              ? "bg-green-100 text-green-700"
                              : app.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : app.status === "Interview"
                              ? "bg-purple-100 text-purple-700"
                              : app.status === "Shortlisted"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
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

// =====================================
// STAT CARD
// =====================================

function Card({
  title,
  value,
  className,
}) {
  return (
    <div
      className={`${className} text-white p-6 rounded-2xl shadow-lg`}
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

// =====================================
// STATUS BAR
// =====================================

function StatusBar({
  label,
  value,
  total,
}) {
  const percentage =
    total > 0
      ? Math.round(
          (value / total) * 100
        )
      : 0;

  return (
    <div>

      <div className="flex justify-between mb-2">

        <span className="font-medium text-gray-700">
          {label}
        </span>

        <span className="text-gray-500">
          {value} ({percentage}%)
        </span>

      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">

        <div
          className="bg-blue-600 h-3 rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}

export default ApplicationAnalytics;