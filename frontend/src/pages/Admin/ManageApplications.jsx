import { useEffect, useMemo, useState } from "react";
import {
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
} from "../../services/adminService";

function ManageApplications() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ==========================
  // LOAD APPLICATIONS
  // ==========================
  const loadApplications = async () => {
    try {
      setLoading(true);

      const res = await getAllApplications();

      if (res.success) {
        setApplications(res.applications || []);
      }
    } catch (error) {
      console.error(error);
      alert("Unable to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadApplications();
    };

    fetchData();
  }, []);

  // ==========================
  // SEARCH (Optimized)
  // ==========================
  const filteredApplications = useMemo(() => {
    const searchText = search.toLowerCase();

    return applications.filter((app) => {
      const student = app.student?.name?.toLowerCase() || "";
      const company = app.company?.companyName?.toLowerCase() || "";

      return (
        student.includes(searchText) ||
        company.includes(searchText)
      );
    });
  }, [applications, search]);

  // ==========================
  // UPDATE STATUS
  // ==========================
  const handleStatusChange = async (id, status) => {
    try {
      const res = await updateApplicationStatus(id, status);

      alert(res.message);

      await loadApplications();
    } catch (error) {
      console.error(error);
      alert("Unable to update status");
    }
  };

  // ==========================
  // DELETE
  // ==========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this application?"
    );

    if (!confirmDelete) return;

    try {
      const res = await deleteApplication(id);

      alert(res.message);

      await loadApplications();
    } catch (error) {
      console.error(error);
      alert("Unable to delete application");
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-2xl font-semibold">
        Loading Applications...
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">
        Manage Applications
      </h1>

      <input
        type="text"
        placeholder="Search Student or Company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg px-4 py-3 w-full mb-8"
      />

      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Student</th>
              <th className="p-4 text-left">Company</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredApplications.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-6"
                >
                  No Applications Found
                </td>
              </tr>
            ) : (
              filteredApplications.map((app) => (
                <tr
                  key={app._id}
                  className="border-b"
                >
                  <td className="p-4">
                    {app.student?.name || "-"}
                  </td>

                  <td className="p-4">
                    {app.company?.companyName || "-"}
                  </td>

                  <td className="p-4">
                    {app.company?.role || "-"}
                  </td>

                  <td className="p-4">
                    <select
                      value={app.status}
                      onChange={(e) =>
                        handleStatusChange(
                          app._id,
                          e.target.value
                        )
                      }
                      className="border rounded px-3 py-2"
                    >
                      <option value="Applied">
                        Applied
                      </option>

                      <option value="Shortlisted">
                        Shortlisted
                      </option>

                      <option value="Selected">
                        Selected
                      </option>

                      <option value="Rejected">
                        Rejected
                      </option>
                    </select>
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() =>
                        handleDelete(app._id)
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageApplications;