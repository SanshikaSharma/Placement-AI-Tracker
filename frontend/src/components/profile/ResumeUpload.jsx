import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUpload, FaFilePdf, FaEye, FaDownload } from "react-icons/fa";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    // ⚠️ Replace with an actual Profile _id from your database for now.
    formData.append("profileId", "PASTE_PROFILE_ID_HERE");

    try {
      setUploading(true);

      const res = await axios.post(
        "http://localhost:5001/api/resume/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResumeUrl(res.data.resumeUrl);
      toast.success("Resume uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">

      <h2 className="text-2xl font-bold mb-6">
        Resume Upload
      </h2>

      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
      >
        <FaUpload />
        {uploading ? "Uploading..." : "Upload Resume"}
      </button>

      {resumeUrl && (
        <div className="mt-8 border rounded-xl p-5 bg-gray-50">

          <div className="flex items-center gap-3 mb-4">
            <FaFilePdf className="text-red-600 text-3xl" />
            <span className="font-semibold">
              Resume Uploaded Successfully
            </span>
          </div>

          <div className="flex gap-4">

            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FaEye />
              View
            </a>

            <a
              href={resumeUrl}
              download
              className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FaDownload />
              Download
            </a>

          </div>

        </div>
      )}
    </div>
  );
}

export default ResumeUpload;