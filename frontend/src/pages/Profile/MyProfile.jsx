```jsx
import { useEffect, useState } from "react";
import { getProfile } from "../../services/profileService";
import { analyzeResume } from "../../services/aiResumeService";
import {
  uploadResume,
  getResume,
  downloadResume,
  deleteResume,
} from "../../services/resumeService";

function MyProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [resume, setResume] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
const [analysis, setAnalysis] = useState(null);
const [analyzing, setAnalyzing] = useState(false);


  const fetchProfile = async (id) => {
    try {
      const response = await getProfile(id);

      if (response.success) {
        setUser(response.user);

        const resumeResponse = await getResume(id);

        if (resumeResponse.success) {
          setResume(resumeResponse.resume);
        }
      }
    } catch (error) {
      console.error("Profile Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(storedUser);

        const id = parsedUser._id || parsedUser.id;

        if (!id) {
          setLoading(false);
          return;
        }

        await fetchProfile(id);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a PDF");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("resume", selectedFile);
      formData.append("userId", user._id || user.id);

      const res = await uploadResume(formData);

      alert(res.message);

      setResume(res.resume);

      setSelectedFile(null);

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Resume Upload Failed"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResume = async () => {
    const confirmDelete = window.confirm(
      "Delete Resume?"
    );

    if (!confirmDelete) return;

    try {
      await deleteResume(user._id || user.id);

      setResume(null);

      alert("Resume Deleted Successfully");

    } catch (err) {
      console.error(err);

      alert("Unable to Delete Resume");
    }
  };

  const handleDownloadResume = () => {
    downloadResume(user._id || user.id);
  };
const handleAnalyzeResume = async () => {
  try {
    setAnalyzing(true);

    const res = await analyzeResume(user._id || user.id);

    if (res.success) {
      setAnalysis(res.analysis);
    }
  } catch (err) {
    console.error(err);

    alert(
      err.response?.data?.message ||
      "Resume analysis failed"
    );
  } finally {
    setAnalyzing(false);
  }
};
  if (loading) {
    return (
      <div className="p-8 text-xl">
        Loading Profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-red-600 text-xl">
        User not found
      </div>
    );
  }

  return (
    <div className="p-8">

      <div className="bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-8">
          My Profile
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <h3 className="font-semibold">Name</h3>
            <p>{user.name}</p>
          </div>

          <div>
            <h3 className="font-semibold">Student ID</h3>
            <p>{user.studentId}</p>
          </div>

          <div>
            <h3 className="font-semibold">Email</h3>
            <p>{user.email}</p>
          </div>

          <div>
            <h3 className="font-semibold">College</h3>
            <p>{user.college}</p>
          </div>

          <div>
            <h3 className="font-semibold">Branch</h3>
            <p>{user.branch}</p>
          </div>

          <div>
            <h3 className="font-semibold">Semester</h3>
            <p>{user.semester}</p>
          </div>

          <div>
            <h3 className="font-semibold">CGPA</h3>
            <p>{user.cgpa}</p>
          </div>

          <div>
            <h3 className="font-semibold">Phone</h3>
            <p>{user.phone || "-"}</p>
          </div>

          <div>
            <h3 className="font-semibold">
              Placement Status
            </h3>
            <p>{user.placementStatus}</p>
          </div>

        </div>

      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

        <h2 className="text-2xl font-bold mb-6">
          Resume
        </h2>

        {resume?.fileName ? (

          <>
            <p>
              <strong>File :</strong> {resume.originalName}
            </p>

            <p className="mt-2">
              <strong>Uploaded :</strong>{" "}
              {resume.uploadedAt
                ? new Date(
                    resume.uploadedAt
                  ).toLocaleString()
                : "-"}
            </p>

          <div className="flex flex-wrap gap-4 mt-6">

  <button
    onClick={handleDownloadResume}
    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
  >
    Download Resume
  </button>

  <button
    onClick={handleDeleteResume}
    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
  >
    Delete Resume
  </button>

  <button
    onClick={handleAnalyzeResume}
    disabled={analyzing}
    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg"
  >
    {analyzing ? "Analyzing..." : "Analyze Resume"}
  </button>

</div>

          </>

        ) : (

          <>

            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="border p-3 rounded-lg w-full"
            />

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-5 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
            >
              {uploading
                ? "Uploading..."
                : "Upload Resume"}
            </button>

          </>

        )}

      </div>

    </div>
    {analysis && (
  <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">

    <h2 className="text-2xl font-bold mb-6">
      AI Resume Analysis
    </h2>

    <div className="grid md:grid-cols-2 gap-6">

      <div>
        <h3 className="font-semibold">Resume Score</h3>
        <p>{analysis.resumeScore}%</p>
      </div>

      <div>
        <h3 className="font-semibold">ATS Score</h3>
        <p>{analysis.atsScore}%</p>
      </div>

    </div>

    <div className="mt-6">
      <h3 className="font-bold text-green-700">
        Skills Found
      </h3>

      <ul className="list-disc ml-6 mt-2">
        {analysis.foundSkills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </div>

    <div className="mt-6">
      <h3 className="font-bold text-red-700">
        Missing Skills
      </h3>

      <ul className="list-disc ml-6 mt-2">
        {analysis.missingSkills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </div>

    <div className="mt-6">
      <h3 className="font-bold">
        Strengths
      </h3>

      <ul className="list-disc ml-6 mt-2">
        {analysis.strengths.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>

    <div className="mt-6">
      <h3 className="font-bold">
        Weaknesses
      </h3>

      <ul className="list-disc ml-6 mt-2">
        {analysis.weaknesses.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>

    <div className="mt-6">
      <h3 className="font-bold">
        Suggestions
      </h3>

      <ul className="list-disc ml-6 mt-2">
        {analysis.suggestions.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>

    <div className="mt-8 bg-green-100 p-5 rounded-xl">
      <h3 className="font-bold text-lg">
        Recommendation
      </h3>

      <p className="mt-2">
        {analysis.recommendation}
      </p>
    </div>

  </div>
)}
  );
}

export default MyProfile;
```
