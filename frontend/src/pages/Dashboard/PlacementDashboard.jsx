import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyApplications } from "../../services/applicationService";

function PlacementDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const storedUser =
          sessionStorage.getItem("user") ||
          localStorage.getItem("user");

        if (!storedUser) {
          throw new Error("Please login first.");
        }

        const user = JSON.parse(storedUser);

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
          "Placement Dashboard Student ID:",
          studentId
        );

        // Use the SAME working service as My Applications
        const data = await getMyApplications(studentId);

        console.log(
          "Placement Dashboard Applications:",
          data
        );

        if (mounted) {
          setApplications(data.applications || []);
        }
      } catch (err) {
        console.error(
          "Placement Dashboard Load Error:",
          err
        );

        if (mounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load placement data."
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

  // -----------------------------
  // Statistics
  // -----------------------------

  const totalApplications = applications.length;

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

  const selectionRate =
    totalApplications > 0
      ? ((selected / totalApplications) * 100).toFixed(1)
      : 0;

  // -----------------------------
  // Loading
  // -----------------------------

  if (loading) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-2xl shadow p-10 text-center">
          <p className="text-lg text-gray-600">
            Loading placement data...
          </p>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Error
  // -----------------------------

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-2xl shadow p-10 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-3">
            Unable to Load
          </h1>

          <p className="text-gray-600 mb-6">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Placement Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Track your placement applications and progress.
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">
            Total Applications
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {totalApplications}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">
            Applied
          </p>

          <h2 className="text-3xl font-bold mt-2 text-blue-600">
            {applied}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">
            Shortlisted
          </p>

          <h2 className="text-3xl font-bold mt-2 text-yellow-600">
            {shortlisted}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">
            Selected
          </p>

          <h2 className="text-3xl font-bold mt-2 text-green-600">
            {selected}
          </h2>
        </div>

      </div>

      {/* Application Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">
            Pending / OA
          </p>

          <p className="text-2xl font-bold mt-2">
            {pending}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">
            Interview
          </p>

          <p className="text-2xl font-bold mt-2">
            {interview}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">
            Rejected
          </p>

          <p className="text-2xl font-bold mt-2 text-red-600">
            {rejected}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">
            Selection Rate
          </p>

          <p className="text-2xl font-bold mt-2 text-green-600">
            {selectionRate}%
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">
            Active Applications
          </p>

          <p className="text-2xl font-bold mt-2">
            {totalApplications - selected - rejected}
          </p>
        </div>

      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-2xl shadow p-6">

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              Recent Applications
            </h2>

            <p className="text-gray-500 mt-1">
              Your latest placement applications
            </p>
          </div>

          <Link
            to="/applications"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View All
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">
              No applications found.
            </p>

            <Link
              to="/companies"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              Explore Companies
            </Link>
          </div>
        ) : (
          <div className="space-y-4">

            {applications
              .slice(0, 5)
              .map((application) => (

                <div
                  key={application._id}
                  className="border rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >

                  <div>
                    <h3 className="font-bold text-lg">
                      {application.company?.companyName ||
                        application.company?.name ||
                        "Company"}
                    </h3>

                    <p className="text-gray-500">
                      {application.company?.role ||
                        "Placement Opportunity"}
                    </p>

                    {application.company?.location && (
                      <p className="text-sm text-gray-400 mt-1">
                        📍 {application.company.location}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        application.status === "Selected"
                          ? "bg-green-100 text-green-700"
                          : application.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : application.status === "Interview"
                          ? "bg-purple-100 text-purple-700"
                          : application.status === "Shortlisted"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {application.status || "Applied"}
                    </span>

                    {application.company?._id && (
                      <Link
                        to={`/company/${application.company._id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View
                      </Link>
                    )}

                  </div>

                </div>

              ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default PlacementDashboard;