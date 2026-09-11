import { FaTrash, FaFilePdf, FaUserGraduate } from "react-icons/fa";

function StudentCard({ student, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">

      <div className="flex justify-between items-start">

        <div>
          <h2 className="text-xl font-bold">{student.name}</h2>

          <p>{student.studentId}</p>

          <p>{student.email}</p>

          <p>{student.branch}</p>

          <p>Semester {student.semester}</p>

          <p className="mt-2">
            Status:
            <span className="ml-2 font-semibold text-blue-600">
              {student.placementStatus}
            </span>
          </p>
        </div>

        <FaUserGraduate size={45} className="text-blue-600" />

      </div>

      <div className="flex gap-3 mt-6">

        {student.resume?.filePath && (
          <a
            href={`http://localhost:5001/${student.resume.filePath.replace(/\\/g, "/")}`}
            target="_blank"
            rel="noreferrer"
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaFilePdf />
            Resume
          </a>
        )}

        <button
          onClick={() => onDelete(student._id)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaTrash />
          Delete
        </button>

      </div>
    </div>
  );
}

export default StudentCard;