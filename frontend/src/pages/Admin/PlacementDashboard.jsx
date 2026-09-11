import { useEffect, useState } from "react";
import api from "../../services/api";
import DashboardCard from "../../components/admin/DashboardCard";

import {
  FaUsers,
  FaBuilding,
  FaFileAlt,
  FaCheckCircle,
  FaClock,
  FaFileUpload,
  FaChartLine,
} from "react-icons/fa";

function PlacementDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    totalApplications: 0,
    selected: 0,
    pending: 0,
    resumeUploaded: 0,
    placementPercentage: 0,
    recentApplications: [],
    upcomingCompanies: [],
  });

  const [loading, setLoading] = useState(true);

  // ===============================
  // Load Dashboard
  // ===============================

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const res = await api.get("/dashboard");

      console.log("Dashboard:", res.data);

      setStats({
        totalStudents: res.data.totalStudents || 0,
        totalCompanies: res.data.totalCompanies || 0,
        totalApplications: res.data.totalApplications || 0,
        selected: res.data.selected || 0,
        pending: res.data.pending || 0,
        resumeUploaded: res.data.resumeUploaded || 0,
        placementPercentage: res.data.placementPercentage || 0,
        recentApplications: res.data.recentApplications || [],
        upcomingCompanies: res.data.upcomingCompanies || [],
      });
    } catch (error) {
      console.error("Dashboard Error:", error);
      alert("Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  const fetchDashboard = async () => {
    await loadDashboard();
  };

  fetchDashboard();
}, []);

  // ===============================
  // Loading Screen
  // ===============================

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">

        <div className="text-3xl font-bold text-blue-700">

          Loading Dashboard...

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold">
            Admin Dashboard
          </h1>

          <p className="text-gray-600 mt-2">
            Placement AI Tracker
          </p>

        </div>

      </div>

      {/* Statistics Cards Start */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        <DashboardCard
          title="Students"
          value={stats.totalStudents}
          icon={<FaUsers className="text-blue-600" />}
          bgColor="bg-blue-100"
          textColor="text-blue-700"
        />

        <DashboardCard
          title="Companies"
          value={stats.totalCompanies}
          icon={<FaBuilding className="text-purple-600" />}
          bgColor="bg-purple-100"
          textColor="text-purple-700"
        />

        <DashboardCard
          title="Applications"
          value={stats.totalApplications}
          icon={<FaFileAlt className="text-orange-600" />}
          bgColor="bg-orange-100"
          textColor="text-orange-700"
        />

        <DashboardCard
          title="Selected"
          value={stats.selected}
          icon={<FaCheckCircle className="text-green-600" />}
          bgColor="bg-green-100"
          textColor="text-green-700"
        />

        <DashboardCard
          title="Pending"
          value={stats.pending}
          icon={<FaClock className="text-yellow-600" />}
          bgColor="bg-yellow-100"
          textColor="text-yellow-700"
        />

        <DashboardCard
          title="Resume Uploaded"
          value={stats.resumeUploaded}
          icon={<FaFileUpload className="text-pink-600" />}
          bgColor="bg-pink-100"
          textColor="text-pink-700"
        />

        <DashboardCard
          title="Placement %"
          value={`${stats.placementPercentage}%`}
          icon={<FaChartLine className="text-indigo-600" />}
          bgColor="bg-indigo-100"
          textColor="text-indigo-700"
        />

      </div>

      {/* Recent Applications starts below */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-10">

        <div className="p-6 border-b">

          <h2 className="text-2xl font-bold">
            Recent Applications
          </h2>

          <p className="text-gray-500 mt-1">
            Latest student applications
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="text-left p-4">
                  Student
                </th>

                <th className="text-left p-4">
                  Company
                </th>

                <th className="text-left p-4">
                  Status
                </th>

                <th className="text-left p-4">
                  Applied Date
                </th>

              </tr>

            </thead>

            <tbody>

              {stats.recentApplications.length === 0 ? (

                <tr>

                  <td
                    colSpan="4"
                    className="text-center p-10"
                  >
                    No Recent Applications
                  </td>

                </tr>

              ) : (

                stats.recentApplications.map((app) => (

                  <tr
                    key={app._id}
                    className="border-b hover:bg-gray-50 transition"
                  >

                    <td className="p-4 font-medium">

                      {app.student?.name || "-"}

                    </td>

                    <td className="p-4">

                      {app.company?.companyName || "-"}

                    </td>

                    <td className="p-4">

                      <span
                        className={`px-4 py-1 rounded-full text-white text-sm font-semibold

                        ${
                          app.status === "Applied"
                            ? "bg-blue-500"
                            : app.status === "Shortlisted"
                            ? "bg-yellow-500"
                            : app.status === "Interview"
                            ? "bg-purple-500"
                            : app.status === "Selected"
                            ? "bg-green-600"
                            : app.status === "Rejected"
                            ? "bg-red-600"
                            : "bg-gray-500"
                        }
                        `}
                      >

                        {app.status}

                      </span>

                    </td>

                    <td className="p-4">

                      {new Date(
                        app.appliedAt
                      ).toLocaleDateString()}

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Upcoming Companies Starts */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="text-2xl font-bold">
            Upcoming Companies
          </h2>

          <p className="text-gray-500 mt-1">
            Upcoming placement drives
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">
                  Company
                </th>

                <th className="p-4 text-left">
                  Role
                </th>

                <th className="p-4 text-left">
                  Package
                </th>

                <th className="p-4 text-left">
                  Location
                </th>

                <th className="p-4 text-left">
                  Deadline
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {stats.upcomingCompanies.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center py-10"
                  >
                    No Upcoming Companies
                  </td>

                </tr>

              ) : (

                stats.upcomingCompanies.map((company) => (

                  <tr
                    key={company._id}
                    className="border-b hover:bg-gray-50 transition"
                  >

                    <td className="p-4 font-semibold">
                      {company.companyName}
                    </td>

                    <td className="p-4">
                      {company.role}
                    </td>

                    <td className="p-4">
                      {company.package}
                    </td>

                    <td className="p-4">
                      {company.location}
                    </td>

                    <td className="p-4">
                      {new Date(
                        company.deadline
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-4">

                      <span
                        className={`px-4 py-1 rounded-full text-white text-sm

                        ${
                          company.status === "Open"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }

                        `}
                      >
                        {company.status}
                      </span>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );
}

export default PlacementDashboard;