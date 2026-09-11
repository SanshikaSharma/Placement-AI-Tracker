import { useEffect, useMemo, useState } from "react";
import {
  getAllStudents,
  deleteStudent,
} from "../../services/adminService";

function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadStudents() {
    try {
      const res = await getAllStudents();

      if (res.success) {
        setStudents(res.students || []);
      }
    } catch (err) {
      console.error(err);
      alert("Unable to load students");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function init() {
      await loadStudents();
    }

    init();
  }, []);

  const filteredStudents = useMemo(() => {
    const keyword = search.toLowerCase();

    return students.filter((student) => {
      return (
        (student.name || "").toLowerCase().includes(keyword) ||
        (student.email || "").toLowerCase().includes(keyword) ||
        (student.studentId || "").toLowerCase().includes(keyword)
      );
    });
  }, [students, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      const res = await deleteStudent(id);

      alert(res.message);

      setStudents((prev) =>
        prev.filter((student) => student._id !== id)
      );
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Delete failed"
      );
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-xl">
        Loading Students...
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Manage Students
      </h1>

      <input
        type="text"
        placeholder="Search by Name, Email or Student ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-3 rounded-lg w-full mb-6"
      />

      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          No Students Found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow rounded-xl">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Student ID</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Branch</th>
                <th className="p-3 text-left">Semester</th>
                <th className="p-3 text-left">CGPA</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id} className="border-b">
                  <td className="p-3">{student.name}</td>
                  <td className="p-3">{student.studentId}</td>
                  <td className="p-3">{student.email}</td>
                  <td className="p-3">{student.branch}</td>
                  <td className="p-3">{student.semester}</td>
                  <td className="p-3">{student.cgpa}</td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}

export default ManageStudents;