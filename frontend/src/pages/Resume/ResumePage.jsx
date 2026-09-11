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

  const getCurrentUser = () => {
    const storedUser = sessionStorage.getItem("user");

    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("User Data Error:", error);
      return null;
    }
  };

  const loadResume = useCallback(async () => {
    try {
      const currentUser = getCurrentUser();
      const userId = currentUser?._id || currentUser?.id;

      if (!userId) {
        setMessage("Please login again.");
        return;
      }

      const data = await getResume(userId);

      if (data.success) {
        setResume(data.resume);
      }
    } catch (error) {
      // 404 simply means this student has no uploaded resume
      if (error.response?.status === 404) {
        setResume(null);
        console.log("No resume uploaded for current student.");
      } else {
        console.error("Get Resume Error:", error);
      }
    }
  }, []);

 useEffect(() => {
  let cancelled = false;

  const fetchResume = async () => {
    try {
      const storedUser = sessionStorage.getItem("user");

      if (!storedUser) {
        if (!cancelled) {
          setMessage("Please login again.");
        }
        return;
      }

      const currentUser = JSON.parse(storedUser);
      const userId = currentUser?._id || currentUser?.id;

      if (!userId) {
        if (!cancelled) {
          setMessage("Please login again.");
        }
        return;
      }

      const data = await getResume(userId);

      if (!cancelled && data.success) {
        setResume(data.resume);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        if (!cancelled) {
          setResume(null);
        }
      } else {
        console.error("Get Resume Error:", error);

        if (!cancelled) {
          setMessage(
            error.response?.data?.message ||
              "Unable to load resume."
          );
        }
      }
    }
  };

  fetchResume();

  return () => {
    cancelled = true;
  };
}, []);

  const handleUpload = async () => {
    const currentUser = getCurrentUser();
    const userId = currentUser?._id || currentUser?.id;

    if (!userId) {
      setMessage("Please login again.");
      return;
    }

    if (!file) {
      setMessage("Please select a PDF.");
      return;
    }

    const formData = new FormData();

    formData.append("resume", file);
    formData.append("userId", userId);

    try {
      setLoading(true);
      setMessage("");

      const res = await uploadResume(formData);

      setMessage(res.message);
      setFile(null);

      const input = document.getElementById("resumeInput");

      if (input) {
        input.value = "";
      }

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
    const currentUser = getCurrentUser();
    const userId = currentUser?._id || currentUser?.id;

    if (!userId) {
      setMessage("Please login again.");
      return;
    }

    if (!window.confirm("Delete Resume?")) return;

    try {
      const res = await deleteResume(userId);

      setMessage(res.message);
      setResume(null);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Delete Failed"
      );
    }
  };

  const handleDownload = () => {
    const currentUser = getCurrentUser();
    const userId = currentUser?._id || currentUser?.id;

    if (!userId) {
      setMessage("Please login again.");
      return;
    }

    downloadResume(userId);
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
              <strong>File:</strong>{" "}
              {resume.originalName}
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
                onClick={handleDownload}
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