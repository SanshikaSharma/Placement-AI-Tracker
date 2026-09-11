import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getAllStudents,
  deleteStudent,
} from "../../services/adminService";

function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadStudents = async () => {
      try {
        const res = await getAllStudents();

        if (mounted && res.success) {
          setStudents(res.students || []);
        }
      } catch (error) {
        console.error("Students Error:", error);

        if (mounted) {
          alert(
            error.response?.data?.message ||
              "Unable to load students"
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadStudents();

    return () => {
      mounted = false;
    };
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const res = await deleteStudent(id);

      if (res.success) {
        alert(
          res.message || "Student deleted successfully"
        );

        setStudents((previousStudents) =>
          previousStudents.filter(
            (student) => student._id !== id
          )
        );
      } else {
        alert(
          res.message || "Unable to delete student"
        );
      }
    } catch (error) {
      console.error("Delete Student Error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to delete student"
      );
    }
  };

  const filteredStudents = students.filter((student) => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) {
      return true;
    }

    const name = String(student.name || "").toLowerCase();
    const studentId = String(
      student.studentId || ""
    ).toLowerCase();
    const email = String(
      student.email || ""
    ).toLowerCase();
    const college = String(
      student.college || ""
    ).toLowerCase();
    const branch = String(
      student.branch || ""
    ).toLowerCase();

    return (
      name.includes(keyword) ||
      studentId.includes(keyword) ||
      email.includes(keyword) ||
      college.includes(keyword) ||
      branch.includes(keyword)
    );
  });

  if (loading) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-semibold">
          Loading Students...
        </h1>
      </div>
    );
  }

  return (
    <div className="p-8">

      {/* Header */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Manage Students
        </h1>

        <p className="text-gray-500 mt-2">
          View and manage registered students.
        </p>

      </div>

      {/* Search */}
      <div className="mb-6">

        <input
          type="text"
          placeholder="Search by name, student ID, email, college or branch"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          className="w-full border border-gray-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      {/* Student Count */}
      <div className="mb-5">

        <p className="text-gray-600">
          Showing{" "}
          <span className="font-bold">
            {filteredStudents.length}
          </span>{" "}
          of{" "}
          <span className="font-bold">
            {students.length}
          </span>{" "}
          students
        </p>

      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center">

          <h2 className="text-2xl font-semibold text-gray-700">
            No Students Found
          </h2>

          <p className="text-gray-500 mt-2">
            Try changing your search.
          </p>

        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="text-left p-4">
                  Name
                </th>

                <th className="text-left p-4">
                  Student ID
                </th>

                <th className="text-left p-4">
                  Email
                </th>

                <th className="text-left p-4">
                  College
                </th>

                <th className="text-left p-4">
                  Branch
                </th>

                <th className="text-left p-4">
                  Semester
                </th>

                <th className="text-left p-4">
                  Placement Status
                </th>

                <th className="text-center p-4">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredStudents.map((student) => (

                <tr
                  key={student._id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4 font-semibold">
  <Link
    to={`/admin/students/${student._id}`}
    className="text-blue-600 hover:text-blue-800 hover:underline"
  >
    {student.name || "-"}
  </Link>
</td>

                  <td className="p-4">
                    {student.studentId || "-"}
                  </td>

                  <td className="p-4">
                    {student.email || "-"}
                  </td>

                  <td className="p-4">
                    {student.college || "-"}
                  </td>

                  <td className="p-4">
                    {student.branch || "-"}
                  </td>

                  <td className="p-4">
                    {student.semester ?? "-"}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        student.placementStatus ===
                        "Placed"
                          ? "bg-green-100 text-green-700"
                          : student.placementStatus ===
                            "Selected"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {student.placementStatus ||
                        "Preparing"}
                    </span>

                  </td>

                  <td className="p-4 text-center">

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(student._id)
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
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

export default AdminStudents;