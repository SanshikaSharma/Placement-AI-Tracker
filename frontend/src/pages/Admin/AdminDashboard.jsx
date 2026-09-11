import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getAdminDashboard } from "../../services/adminService";
import StatCard from "../../components/admin/StatCard";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    totalApplications: 0,
    selectedStudents: 0,
    pendingApplications: 0,
    resumeUploaded: 0,
    placementPercentage: 0,
    recentApplications: [],
    upcomingCompanies: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getAdminDashboard();

        if (cancelled) return;

        if (res?.success) {
          setDashboard({
            totalStudents: res.totalStudents || 0,
            totalCompanies: res.totalCompanies || 0,
            totalApplications: res.totalApplications || 0,
            selectedStudents: res.selectedStudents || 0,
            pendingApplications: res.pendingApplications || 0,
            resumeUploaded: res.resumeUploaded || 0,
            placementPercentage:
              res.placementPercentage || 0,
            recentApplications:
              Array.isArray(res.recentApplications)
                ? res.recentApplications
                : [],
            upcomingCompanies:
              Array.isArray(res.upcomingCompanies)
                ? res.upcomingCompanies
                : [],
          });
        } else {
          setError(
            res?.message ||
              "Unable to load dashboard."
          );
        }
      } catch (err) {
        if (cancelled) return;

        console.error(
          "Admin Dashboard Error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load admin dashboard."
        );
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

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Selected":
        return "bg-green-100 text-green-700";

      case "Shortlisted":
        return "bg-purple-100 text-purple-700";

      case "Interview":
        return "bg-yellow-100 text-yellow-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Applied":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">

          <div className="animate-pulse">

            <div className="h-9 bg-gray-200 rounded-lg w-72 mb-3"></div>

            <div className="h-5 bg-gray-200 rounded-lg w-96 mb-10"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

              {[1, 2, 3, 4, 5, 6, 7].map(
                (item) => (
                  <div
                    key={item}
                    className="bg-white rounded-2xl shadow p-6 h-32"
                  >
                    <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                )
              )}

            </div>

          </div>

        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">

        <div className="max-w-7xl mx-auto">

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Admin Dashboard
          </h1>

          <div className="bg-white rounded-2xl shadow p-8">

            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5">
              <p className="font-semibold">
                Unable to load dashboard
              </p>

              <p className="mt-1 text-sm">
                {error}
              </p>
            </div>

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">

      <div className="max-w-7xl mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>

            <p className="text-blue-600 font-semibold text-sm mb-1">
              PLACEMENT AI TRACKER
            </p>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Admin Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Manage students, companies and placement applications.
            </p>

          </div>

          <div className="flex gap-3">

            <Link
              to="/admin/students"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition"
            >
              Students
            </Link>

            <Link
              to="/admin/applications"
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-medium transition"
            >
              Applications
            </Link>

          </div>

        </div>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          <StatCard
            title="Students"
            value={dashboard.totalStudents}
            color="bg-blue-600"
            to="/admin/students"
          />

          <StatCard
            title="Companies"
            value={dashboard.totalCompanies}
            color="bg-green-600"
            to="/admin/companies"
          />

          <StatCard
            title="Applications"
            value={dashboard.totalApplications}
            color="bg-purple-600"
            to="/admin/applications"
          />

          <StatCard
            title="Selected"
            value={dashboard.selectedStudents}
            color="bg-orange-500"
          />

          <StatCard
            title="Pending"
            value={dashboard.pendingApplications}
            color="bg-yellow-500"
          />

          <StatCard
            title="Resume Uploaded"
            value={dashboard.resumeUploaded}
            color="bg-indigo-600"
          />

          <StatCard
            title="Placement %"
            value={`${dashboard.placementPercentage}%`}
            color="bg-pink-600"
          />

        </div>

        {/* =================================================
            PLACEMENT OVERVIEW
        ================================================= */}

        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                Placement Overview
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Current overall placement progress.
              </p>
            </div>

            <span className="text-2xl font-bold text-pink-600">
              {dashboard.placementPercentage}%
            </span>

          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">

            <div
              className="bg-pink-600 h-4 rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(
                  Math.max(
                    Number(
                      dashboard.placementPercentage
                    ) || 0,
                    0
                  ),
                  100
                )}%`,
              }}
            ></div>

          </div>

          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0%</span>
            <span>100%</span>
          </div>

        </div>

        {/* =================================================
            RECENT APPLICATIONS
        ================================================= */}

        <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6 mt-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                Recent Applications
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Latest student placement applications.
              </p>
            </div>

            <Link
              to="/admin/applications"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              View All →
            </Link>

          </div>

          {dashboard.recentApplications.length === 0 ? (

            <div className="text-center py-10">

              <p className="text-gray-500 font-medium">
                No Recent Applications
              </p>

              <p className="text-gray-400 text-sm mt-1">
                Applications will appear here when students apply.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-162.5">

                <thead>

                  <tr className="border-b bg-gray-50">

                    <th className="text-left p-3 text-sm font-semibold text-gray-600">
                      Student
                    </th>

                    <th className="text-left p-3 text-sm font-semibold text-gray-600">
                      Company
                    </th>

                    <th className="text-left p-3 text-sm font-semibold text-gray-600">
                      Role
                    </th>

                    <th className="text-left p-3 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {dashboard.recentApplications.map(
                    (application) => (

                      <tr
                        key={application._id}
                        className="border-b last:border-b-0 hover:bg-gray-50 transition"
                      >

                        <td className="p-3">

                          {application.student?._id ? (
                            <Link
                              to={`/admin/students/${application.student._id}`}
                              className="font-semibold text-blue-600 hover:underline"
                            >
                              {application.student?.name || "-"}
                            </Link>
                          ) : (
                            <span className="font-semibold text-gray-800">
                              {application.student?.name || "-"}
                            </span>
                          )}

                        </td>

                        <td className="p-3 text-gray-700">
                          {application.company?.companyName ||
                            "-"}
                        </td>

                        <td className="p-3 text-gray-600">
                          {application.company?.role || "-"}
                        </td>

                        <td className="p-3">

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                              application.status
                            )}`}
                          >
                            {application.status ||
                              "Applied"}
                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* =================================================
            UPCOMING COMPANIES
        ================================================= */}

        <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6 mt-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

            <div>

              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                Upcoming Companies
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Companies with upcoming placement deadlines.
              </p>

            </div>

            <Link
              to="/admin/companies"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Manage Companies →
            </Link>

          </div>

          {dashboard.upcomingCompanies.length === 0 ? (

            <div className="text-center py-10">

              <p className="text-gray-500 font-medium">
                No Upcoming Companies
              </p>

              <p className="text-gray-400 text-sm mt-1">
                Upcoming company drives will appear here.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-150">

                <thead>

                  <tr className="border-b bg-gray-50">

                    <th className="text-left p-3 text-sm font-semibold text-gray-600">
                      Company
                    </th>

                    <th className="text-left p-3 text-sm font-semibold text-gray-600">
                      Role
                    </th>

                    <th className="text-left p-3 text-sm font-semibold text-gray-600">
                      Deadline
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {dashboard.upcomingCompanies.map(
                    (company) => (

                      <tr
                        key={company._id}
                        className="border-b last:border-b-0 hover:bg-gray-50 transition"
                      >

                        <td className="p-3 font-semibold text-gray-800">
                          {company.companyName || "-"}
                        </td>

                        <td className="p-3 text-gray-600">
                          {company.role || "-"}
                        </td>

                        <td className="p-3">

                          {company.deadline ? (
                            <span className="text-gray-600">
                              {new Date(
                                company.deadline
                              ).toLocaleDateString()}
                            </span>
                          ) : (
                            "-"
                          )}

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6 mt-8 mb-6">

          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Quick Actions
          </h2>

          <p className="text-gray-500 text-sm mt-1 mb-5">
            Quickly access important admin sections.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <Link
              to="/admin/students"
              className="border border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:bg-blue-50 transition"
            >
              <p className="font-semibold text-gray-800">
                Manage Students
              </p>

              <p className="text-sm text-gray-500 mt-1">
                View student profiles and resumes.
              </p>
            </Link>

            <Link
              to="/admin/companies"
              className="border border-gray-200 rounded-xl p-4 hover:border-green-400 hover:bg-green-50 transition"
            >
              <p className="font-semibold text-gray-800">
                Manage Companies
              </p>

              <p className="text-sm text-gray-500 mt-1">
                View and manage placement companies.
              </p>
            </Link>

            <Link
              to="/admin/applications"
              className="border border-gray-200 rounded-xl p-4 hover:border-purple-400 hover:bg-purple-50 transition"
            >
              <p className="font-semibold text-gray-800">
                Manage Applications
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Update application status.
              </p>
            </Link>

            <Link
              to="/admin/analytics"
              className="border border-gray-200 rounded-xl p-4 hover:border-pink-400 hover:bg-pink-50 transition"
            >
              <p className="font-semibold text-gray-800">
                View Analytics
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Analyze placement performance.
              </p>
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;