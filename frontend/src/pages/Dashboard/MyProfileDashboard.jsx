import { useEffect, useState } from "react";
import api from "../../services/api";

function MyProfileDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    college: "",
    branch: "",
    semester: "",
    cgpa: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    skills: "",
    projects: "",
    certifications: "",
    linkedin: "",
    github: "",
  });

  // Get currently logged-in student
  const getCurrentUser = () => {
    const storedUser = sessionStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("User Data Error:", error);
      return null;
    }
  };

  // Load current student's profile
  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      try {
        const storedUser = sessionStorage.getItem("user");

        if (!storedUser) {
          if (!cancelled) {
            setLoading(false);
          }
          return;
        }

        const currentUser = JSON.parse(storedUser);
        const userId = currentUser?._id || currentUser?.id;

        if (!userId) {
          if (!cancelled) {
            setLoading(false);
          }
          return;
        }

        const res = await api.get(`/profile/${userId}`);

        if (!cancelled && res.data.success) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.error("Profile Error:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  // Open edit modal
  const openEditModal = () => {
    setFormData({
      name: user.name || "",
      college: user.college || "",
      branch: user.branch || "",
      semester: user.semester || "",
      cgpa: user.cgpa || "",
      phone: user.phone || "",
      gender: user.gender || "",
      dob: user.dob || "",
      address: user.address || "",
      skills: user.skills?.join(", ") || "",
      projects: user.projects?.join(", ") || "",
      certifications: user.certifications?.join(", ") || "",
      linkedin: user.linkedin || "",
      github: user.github || "",
    });

    setMessage("");
    setEditMode(true);
  };

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Save profile
  const handleSave = async () => {
    try {
      const storedUser = getCurrentUser();
      const userId = storedUser?._id || storedUser?.id;

      if (!userId) {
        setMessage("Please login again.");
        return;
      }

      if (!formData.name.trim()) {
        setMessage("Name is required.");
        return;
      }

      setSaving(true);
      setMessage("");

      const updatedData = {
        name: formData.name.trim(),
        college: formData.college.trim(),
        branch: formData.branch.trim(),
        semester: Number(formData.semester) || 1,
        cgpa: Number(formData.cgpa) || 0,
        phone: formData.phone.trim(),
        gender: formData.gender.trim(),
        dob: formData.dob,
        address: formData.address.trim(),

        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),

        projects: formData.projects
          .split(",")
          .map((project) => project.trim())
          .filter(Boolean),

        certifications: formData.certifications
          .split(",")
          .map((certificate) => certificate.trim())
          .filter(Boolean),

        linkedin: formData.linkedin.trim(),
        github: formData.github.trim(),
      };

      const res = await api.put(
        `/profile/${userId}`,
        updatedData
      );

      if (res.data.success) {
        const updatedUser = res.data.user;

        setUser(updatedUser);

        // Keep sessionStorage updated
        const updatedSessionUser = {
          ...storedUser,
          ...updatedUser,
          id: updatedUser._id || storedUser.id,
        };

        sessionStorage.setItem(
          "user",
          JSON.stringify(updatedSessionUser)
        );

        setMessage("Profile updated successfully!");

        setTimeout(() => {
          setEditMode(false);
          setMessage("");
        }, 1000);
      } else {
        setMessage(
          res.data.message || "Profile update failed."
        );
      }
    } catch (error) {
      console.error("Update Profile Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading Profile...
      </div>
    );
  }

  // Profile not found
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-xl">
        Profile Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div className="flex items-center gap-6">

            <div className="w-24 h-24 rounded-full bg-blue-700 text-white flex items-center justify-center text-4xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                {user.name}
              </h1>

              <p className="text-gray-600">
                {user.email}
              </p>

              <p className="text-blue-700 font-medium mt-2">
                {user.role?.toUpperCase()}
              </p>
            </div>

          </div>

          {/* EDIT BUTTON */}
          <button
            onClick={openEditModal}
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow transition"
          >
            ✏️ Edit Profile
          </button>

        </div>

        {/* PROFILE DETAILS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">

          {/* Student ID */}
          <div className="bg-gray-50 rounded-2xl p-5 shadow">
            <h3 className="font-semibold text-gray-700">
              Student ID
            </h3>

            <p className="mt-2 text-lg">
              {user.studentId || "-"}
            </p>
          </div>

          {/* College */}
          <div className="bg-gray-50 rounded-2xl p-5 shadow">
            <h3 className="font-semibold text-gray-700">
              College
            </h3>

            <p className="mt-2 text-lg">
              {user.college || "-"}
            </p>
          </div>

          {/* Branch */}
          <div className="bg-gray-50 rounded-2xl p-5 shadow">
            <h3 className="font-semibold text-gray-700">
              Branch
            </h3>

            <p className="mt-2 text-lg">
              {user.branch || "-"}
            </p>
          </div>

          {/* Semester */}
          <div className="bg-gray-50 rounded-2xl p-5 shadow">
            <h3 className="font-semibold text-gray-700">
              Semester
            </h3>

            <p className="mt-2 text-lg">
              {user.semester || "-"}
            </p>
          </div>

          {/* CGPA */}
          <div className="bg-gray-50 rounded-2xl p-5 shadow">
            <h3 className="font-semibold text-gray-700">
              CGPA
            </h3>

            <p className="mt-2 text-lg">
              {user.cgpa || "-"}
            </p>
          </div>

          {/* Phone */}
          <div className="bg-gray-50 rounded-2xl p-5 shadow">
            <h3 className="font-semibold text-gray-700">
              Phone
            </h3>

            <p className="mt-2 text-lg">
              {user.phone || "-"}
            </p>
          </div>

          {/* Gender */}
          <div className="bg-gray-50 rounded-2xl p-5 shadow">
            <h3 className="font-semibold text-gray-700">
              Gender
            </h3>

            <p className="mt-2 text-lg">
              {user.gender || "-"}
            </p>
          </div>

          {/* DOB */}
          <div className="bg-gray-50 rounded-2xl p-5 shadow">
            <h3 className="font-semibold text-gray-700">
              Date of Birth
            </h3>

            <p className="mt-2 text-lg">
              {user.dob || "-"}
            </p>
          </div>

          {/* Address */}
          <div className="bg-gray-50 rounded-2xl p-5 shadow">
            <h3 className="font-semibold text-gray-700">
              Address
            </h3>

            <p className="mt-2 text-lg">
              {user.address || "-"}
            </p>
          </div>

          {/* Skills */}
          <div className="bg-gray-50 rounded-2xl p-5 shadow md:col-span-2">
            <h3 className="font-semibold text-gray-700">
              Skills
            </h3>

            <div className="flex flex-wrap gap-2 mt-3">
              {user.skills?.length > 0 ? (
                user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p>-</p>
              )}
            </div>
          </div>

          {/* Projects */}
          <div className="bg-gray-50 rounded-2xl p-5 shadow md:col-span-2">
            <h3 className="font-semibold text-gray-700">
              Projects
            </h3>

            <div className="mt-3">
              {user.projects?.length > 0 ? (
                <ul className="list-disc ml-5 space-y-1">
                  {user.projects.map((project, index) => (
                    <li key={index}>{project}</li>
                  ))}
                </ul>
              ) : (
                <p>-</p>
              )}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-gray-50 rounded-2xl p-5 shadow md:col-span-2">
            <h3 className="font-semibold text-gray-700">
              Certifications
            </h3>

            <div className="mt-3">
              {user.certifications?.length > 0 ? (
                <ul className="list-disc ml-5 space-y-1">
                  {user.certifications.map(
                    (certificate, index) => (
                      <li key={index}>
                        {certificate}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>-</p>
              )}
            </div>
          </div>

          {/* LinkedIn */}
          <div className="bg-gray-50 rounded-2xl p-5 shadow">
            <h3 className="font-semibold text-gray-700">
              LinkedIn
            </h3>

            <p className="mt-2 break-all">
              {user.linkedin || "-"}
            </p>
          </div>

          {/* GitHub */}
          <div className="bg-gray-50 rounded-2xl p-5 shadow">
            <h3 className="font-semibold text-gray-700">
              GitHub
            </h3>

            <p className="mt-2 break-all">
              {user.github || "-"}
            </p>
          </div>

          {/* Resume */}
          <div className="bg-gray-50 rounded-2xl p-5 shadow md:col-span-3">
            <h3 className="font-semibold text-gray-700">
              Resume
            </h3>

            <p className="mt-2 text-lg">
              {user.resume?.originalName
                ? user.resume.originalName
                : "No Resume Uploaded"}
            </p>
          </div>

        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {editMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8">

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-8">

              <h2 className="text-3xl font-bold">
                Edit Profile
              </h2>

              <button
                onClick={() => setEditMode(false)}
                className="text-gray-500 hover:text-red-600 text-2xl"
              >
                ✕
              </button>

            </div>

            {/* Form */}
            <div className="grid md:grid-cols-2 gap-5">

              {/* Basic Fields */}
              {[
                ["name", "Full Name"],
                ["college", "College"],
                ["branch", "Branch"],
                ["semester", "Semester"],
                ["cgpa", "CGPA"],
                ["phone", "Phone"],
                ["gender", "Gender"],
                ["dob", "Date of Birth"],
                ["address", "Address"],
                ["linkedin", "LinkedIn URL"],
                ["github", "GitHub URL"],
              ].map(([field, label]) => (
                <div key={field}>

                  <label className="block font-semibold text-gray-700 mb-2">
                    {label}
                  </label>

                  <input
                    type={field === "dob" ? "date" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>
              ))}

              {/* Skills */}
              <div className="md:col-span-2">

                <label className="block font-semibold text-gray-700 mb-2">
                  Skills
                </label>

                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="C++, React, MongoDB, Python"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <p className="text-sm text-gray-500 mt-1">
                  Separate skills using commas.
                </p>

              </div>

              {/* Projects */}
              <div className="md:col-span-2">

                <label className="block font-semibold text-gray-700 mb-2">
                  Projects
                </label>

                <textarea
                  name="projects"
                  value={formData.projects}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Placement AI Tracker, E-Commerce Website"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <p className="text-sm text-gray-500 mt-1">
                  Separate projects using commas.
                </p>

              </div>

              {/* Certifications */}
              <div className="md:col-span-2">

                <label className="block font-semibold text-gray-700 mb-2">
                  Certifications
                </label>

                <textarea
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                  rows="3"
                  placeholder="AWS Certificate, Python Certificate"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <p className="text-sm text-gray-500 mt-1">
                  Separate certifications using commas.
                </p>

              </div>

            </div>

            {/* Message */}
            {message && (
              <div className="mt-5 p-3 rounded-xl bg-green-100 text-green-700 font-semibold">
                {message}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-8">

              <button
                onClick={() => {
                  setEditMode(false);
                  setMessage("");
                }}
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 font-semibold disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold disabled:bg-gray-400"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default MyProfileDashboard;