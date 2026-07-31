import { useEffect, useState, useCallback } from "react";
import {
  uploadResume,
  getResume,
  deleteResume,
  downloadResume,
} from "../../services/resumeService";

function ResumePage() {
  const [file, setFile] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

 const loadResume = useCallback(async () => {
  try {
    if (!user?.id) return;

    const data = await getResume(user.id);

    if (data.success) {
      setResume(data.resume);
    }
  } catch (error) {
    console.error(error);
  }
}, [user?.id]);

 useEffect(() => {
  const fetchData = async () => {
    await loadResume();
  };

  fetchData();
}, [loadResume]);
  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("userId", user.id);

    try {
      setLoading(true);

      const res = await uploadResume(formData);

      setMessage(res.message);

      setFile(null);

      document.getElementById("resumeInput").value = "";

      await loadResume();
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Upload Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete Resume?")) return;

    try {
      const res = await deleteResume(user.id);

      setMessage(res.message);

      setResume(null);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Delete Failed"
      );
    }
  };

  return (
    <div className="p-8">

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold mb-8">
          Resume Management
        </h1>

        <input
          id="resumeInput"
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-3 rounded-lg w-full"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full mt-5 bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800"
        >
          {loading ? "Uploading..." : "Upload Resume"}
        </button>

        {message && (
          <div className="mt-4 font-semibold text-green-700">
            {message}
          </div>
        )}

        {resume && resume.originalName && (
          <div className="mt-10 border rounded-xl p-6 bg-gray-50">

            <h2 className="text-2xl font-semibold mb-4">
              Uploaded Resume
            </h2>

            <p>
              <strong>File:</strong> {resume.originalName}
            </p>

            <p className="mt-2">
              <strong>Uploaded:</strong>{" "}
              {resume.uploadedAt
                ? new Date(
                    resume.uploadedAt
                  ).toLocaleString()
                : "-"}
            </p>

            <div className="flex gap-4 mt-6 flex-wrap">

              <button
                onClick={() =>
                  downloadResume(user.id)
                }
                className="bg-green-600 text-white px-5 py-2 rounded-lg"
              >
                Download
              </button>

              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-5 py-2 rounded-lg"
              >
                Delete
              </button>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default ResumePage;