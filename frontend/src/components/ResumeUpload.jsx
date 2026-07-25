import { useState } from "react";
import axios from "axios";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");

  const token = localStorage.getItem("token");

  // Upload Resume
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a resume.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axios.post(
        "http://localhost:5001/api/resume/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);
      setUploadedFileName(res.data.file);
    } catch (error) {
      alert(
        error.response?.data?.message || "Upload failed"
      );
    }
  };

  // View Resume
  const handleView = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5001/api/resume/preview",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const fileURL = URL.createObjectURL(res.data);
      window.open(fileURL, "_blank");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to view resume"
      );
    }
  };

  // Download Resume
  const handleDownload = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5001/api/resume/download",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([res.data])
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = "Resume.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Download failed"
      );
    }
  };

  // Delete Resume
  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        "http://localhost:5001/api/resume/delete",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);
      setUploadedFileName("");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  return (
    <div className="form-section">
      <h2>Resume Manager</h2>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br />
      <br />

      <button onClick={handleUpload}>
        Upload Resume
      </button>

      <br />
      <br />

      <button onClick={handleView}>
        View Resume
      </button>

      <button onClick={handleDownload}>
        Download Resume
      </button>

      <button onClick={handleDelete}>
        Delete Resume
      </button>

      <br />
      <br />

      {uploadedFileName && (
        <p>
          Uploaded File:
          <br />
          {uploadedFileName}
        </p>
      )}
    </div>
  );
}

export default ResumeUpload;