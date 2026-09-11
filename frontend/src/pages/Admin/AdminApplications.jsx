import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
} from "../../services/adminService";

function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [companyFilter, setCompanyFilter] = useState("All");

  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  // =====================================================
  // VALID APPLICATION STATUSES
  // =====================================================

  const statusOptions = [
    "Applied",
    "Shortlisted",
    "Interview",
    "Selected",
    "Rejected",
  ];

  // =====================================================
  // LOAD APPLICATIONS
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const loadApplications = async () => {
      try {
        setLoading(true);

        const res = await getAllApplications();

        if (cancelled) return;

        if (res?.success) {
          setApplications(
            Array.isArray(res.applications) ? res.applications : []
          );
          setError("");
        } else {
          setError(res?.message || "Unable to load applications.");
        }
      } catch (err) {
        if (cancelled) return;

        console.error("Applications Error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load applications."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadApplications();

    return () => {
      cancelled = true;
    };
  }, []);

  // =====================================================
  // COMPANY LIST
  // =====================================================

  const companies = useMemo(() => {
    const companyMap = new Map();

    applications.forEach((application) => {
      const company = application?.company;

      if (company?._id && company?.companyName) {
        companyMap.set(company._id, company.companyName);
      }
    });

    return Array.from(companyMap.entries()).sort((a, b) =>
      a[1].localeCompare(b[1])
    );
  }, [applications]);

  // =====================================================
  // FILTER APPLICATIONS
  // =====================================================

  const filteredApplications = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return applications.filter((app) => {
      const studentName = String(
        app?.student?.name || ""
      ).toLowerCase();

      const studentEmail = String(
        app?.student?.email || ""
      ).toLowerCase();

      const studentId = String(
        app?.student?.studentId || ""
      ).toLowerCase();

      const companyName = String(
        app?.company?.companyName || ""
      ).toLowerCase();

      const role = String(
        app?.company?.role || ""
      ).toLowerCase();

      const status = app?.status || "";

      const companyId =
        app?.company?._id || "";

      const matchesSearch =
        !searchText ||
        studentName.includes(searchText) ||
        studentEmail.includes(searchText) ||
        studentId.includes(searchText) ||
        companyName.includes(searchText) ||
        role.includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter;

      const matchesCompany =
        companyFilter === "All" ||
        companyId === companyFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCompany
      );
    });
  }, [
    applications,
    search,
    statusFilter,
    companyFilter,
  ]);

  // =====================================================
  // UPDATE APPLICATION STATUS
  // =====================================================

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingId(id);

      const res = await updateApplicationStatus(
        id,
        newStatus
      );

      if (!res?.success) {
        alert(
          res?.message ||
            "Failed to update application status."
        );
        return;
      }

      setApplications((previousApplications) =>
        previousApplications.map((application) =>
          application._id === id
            ? {
                ...application,
                status: newStatus,
              }
            : application
        )
      );

      alert(
        res?.message ||
          "Application status updated successfully."
      );
    } catch (err) {
      console.error(
        "Update Status Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to update application status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // DELETE APPLICATION
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      const res = await deleteApplication(id);

      if (!res?.success) {
        alert(
          res?.message ||
            "Failed to delete application."
        );
        return;
      }

      setApplications((previousApplications) =>
        previousApplications.filter(
          (application) =>
            application._id !== id
        )
      );

      alert(
        res?.message ||
          "Application deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete Application Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to delete application."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // STATUS BADGE
  // =====================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-700";

      case "Shortlisted":
        return "bg-purple-100 text-purple-700";

      case "Interview":
        return "bg-yellow-100 text-yellow-700";

      case "Selected":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Withdrawn":
        return "bg-gray-200 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800">
            Loading Applications...
          </h1>

          <p className="text-gray-500 mt-2">
            Please wait while applications are loaded.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Manage Applications
          </h1>

          <div className="bg-red-100 border border-red-300 text-red-700 rounded-xl p-5">
            {error}
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Manage Applications
          </h1>

          <p className="text-gray-500 mt-2">
            View, filter, update and manage student applications.
          </p>
        </div>

        {/* SUMMARY CARDS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500 text-sm">
              Total Applications
            </p>

            <p className="text-3xl font-bold text-gray-800 mt-1">
              {applications.length}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500 text-sm">
              Applied
            </p>

            <p className="text-3xl font-bold text-blue-600 mt-1">
              {
                applications.filter(
                  (app) => app.status === "Applied"
                ).length
              }
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500 text-sm">
              Shortlisted
            </p>

            <p className="text-3xl font-bold text-purple-600 mt-1">
              {
                applications.filter(
                  (app) => app.status === "Shortlisted"
                ).length
              }
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500 text-sm">
              Selected
            </p>

            <p className="text-3xl font-bold text-green-600 mt-1">
              {
                applications.filter(
                  (app) => app.status === "Selected"
                ).length
              }
            </p>
          </div>

        </div>

        {/* SEARCH AND FILTER */}

        <div className="bg-white rounded-xl shadow p-5 md:p-6 mb-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* SEARCH */}

            <input
              type="text"
              placeholder="Search student, ID, email, company or role..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* STATUS FILTER */}

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">
                All Status
              </option>

              {statusOptions.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>

            {/* COMPANY FILTER */}

            <select
              value={companyFilter}
              onChange={(event) =>
                setCompanyFilter(event.target.value)
              }
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">
                All Companies
              </option>

              {companies.map(
                ([companyId, companyName]) => (
                  <option
                    key={companyId}
                    value={companyId}
                  >
                    {companyName}
                  </option>
                )
              )}
            </select>

          </div>

          {/* RESULT COUNT */}

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">

            <p className="text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-800">
                {filteredApplications.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-800">
                {applications.length}
              </span>{" "}
              applications
            </p>

            {(search ||
              statusFilter !== "All" ||
              companyFilter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                  setCompanyFilter("All");
                }}
                className="text-blue-600 hover:text-blue-800 font-medium text-left sm:text-right"
              >
                Clear Filters
              </button>
            )}

          </div>
        </div>

        {/* APPLICATION TABLE */}

        <div className="bg-white rounded-xl shadow-lg overflow-x-auto">

          <table className="w-full min-w-275">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">
                  Student
                </th>

                <th className="p-4 text-left">
                  Student ID
                </th>

                <th className="p-4 text-left">
                  Email
                </th>

                <th className="p-4 text-left">
                  Company
                </th>

                <th className="p-4 text-left">
                  Role
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Applied On
                </th>

                <th className="p-4 text-center">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredApplications.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="text-center p-12"
                  >
                    <div className="text-gray-500">

                      <p className="text-xl font-semibold">
                        No Applications Found
                      </p>

                      <p className="mt-2">
                        Try changing your search or filters.
                      </p>

                    </div>
                  </td>

                </tr>

              ) : (

                filteredApplications.map((app) => (

                  <tr
                    key={app._id}
                    className="border-b hover:bg-gray-50 transition"
                  >

                    {/* STUDENT */}

                    <td className="p-4">

                      {app?.student?._id ? (
                        <Link
                          to={`/admin/students/${app.student._id}`}
                          className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {app?.student?.name || "-"}
                        </Link>
                      ) : (
                        <span className="font-semibold">
                          {app?.student?.name || "-"}
                        </span>
                      )}

                    </td>

                    {/* STUDENT ID */}

                    <td className="p-4 text-gray-600">
                      {app?.student?.studentId || "-"}
                    </td>

                    {/* EMAIL */}

                    <td className="p-4 text-gray-600">
                      {app?.student?.email || "-"}
                    </td>

                    {/* COMPANY */}

                    <td className="p-4 font-medium">
                      {app?.company?.companyName || "-"}
                    </td>

                    {/* ROLE */}

                    <td className="p-4">
                      {app?.company?.role || "-"}
                    </td>

                    {/* STATUS */}

                    <td className="p-4">

                      <div className="flex flex-col gap-2">

                        <select
                          value={app.status || "Applied"}
                          disabled={
                            updatingId === app._id
                          }
                          onChange={(event) =>
                            handleStatusChange(
                              app._id,
                              event.target.value
                            )
                          }
                          className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        >

                          {/* Existing Withdrawn status can still be displayed */}

                          {app.status === "Withdrawn" && (
                            <option value="Withdrawn">
                              Withdrawn
                            </option>
                          )}

                          {statusOptions.map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {status}
                              </option>
                            )
                          )}

                        </select>

                        <span
                          className={`inline-block w-fit px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                            app.status
                          )}`}
                        >
                          {app.status || "Applied"}
                        </span>

                        {updatingId === app._id && (
                          <span className="text-xs text-gray-500">
                            Updating...
                          </span>
                        )}

                      </div>

                    </td>

                    {/* DATE */}

                    <td className="p-4 text-gray-600">

                      {app.appliedAt || app.createdAt
                        ? new Date(
                            app.appliedAt ||
                              app.createdAt
                          ).toLocaleDateString()
                        : "-"}

                    </td>

                    {/* ACTION */}

                    <td className="p-4">

                      <div className="flex items-center justify-center gap-2">

                        {app?.student?._id && (
                          <Link
                            to={`/admin/students/${app.student._id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition text-sm"
                          >
                            View
                          </Link>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(app._id)
                          }
                          disabled={
                            deletingId === app._id
                          }
                          className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg transition text-sm"
                        >
                          {deletingId === app._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>

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

export default AdminApplications;