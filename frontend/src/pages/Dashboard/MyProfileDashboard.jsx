import { useEffect, useState } from "react";
import api from "../../services/api";

function MyProfileDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Get logged in user from localStorage
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (!storedUser || !storedUser.id) {
          console.log("User not found in localStorage");
          setLoading(false);
          return;
        }

        // Fetch profile using User ID
        const res = await api.get(`/profile/${storedUser.id}`);

        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error("Profile Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading Profile...
      </div>
    );
  }

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

        {/* Header */}
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

        {/* Details */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">

          <div className="bg-gray-50 rounded-2xl p-5 shadow">
            <h3 className="font-semibold text-gray-700">
              Student ID
            </h3>
            <p className="mt-2 text-lg">
              {user.studentId || "-"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 shadow">
            <h3 className="font-semibold text-gray-700">
              College
            </h3>
            <p className="mt-2 text-lg">
              {user.college || "-"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 shadow">
            <h3 className="font-semibold text-gray-700">
              Branch
            </h3>
            <p className="mt-2 text-lg">
              {user.branch || "-"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 shadow">
            <h3 className="font-semibold text-gray-700">
              Semester
            </h3>
            <p className="mt-2 text-lg">
              {user.semester || "-"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 shadow">
            <h3 className="font-semibold text-gray-700">
              Role
            </h3>
            <p className="mt-2 text-lg capitalize">
              {user.role}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 shadow">
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

    </div>
  );
}

export default MyProfileDashboard;