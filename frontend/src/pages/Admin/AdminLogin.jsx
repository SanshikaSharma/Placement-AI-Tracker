import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

function AdminLogin() {
  const navigate = useNavigate();

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await api.post(
        "/auth/login",
        {
          studentId,
          password,
        }
      );

      console.log(
        "Admin Login Response:",
        response.data
      );

      if (!response.data.success) {
        setError(
          response.data.message ||
            "Login failed"
        );
        return;
      }

      const user =
        response.data.user;

      // =====================================
      // CHECK ADMIN ROLE
      // =====================================
      if (
        !user ||
        user.role !== "admin"
      ) {
        setError(
          "Access denied. This account is not an admin account."
        );
        return;
      }

      // =====================================
      // SAVE ADMIN SESSION
      // IMPORTANT:
      // Use sessionStorage because the
      // whole project uses sessionStorage
      // =====================================
      sessionStorage.setItem(
        "token",
        response.data.token
      );

      sessionStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      console.log(
        "Admin session saved:",
        user
      );

      alert(
        "Admin Login Successful"
      );

      // =====================================
      // GO TO ADMIN DASHBOARD
      // =====================================
      navigate("/admin");
    } catch (error) {
      console.error(
        "Admin Login Error:",
        error
      );

      setError(
        error.response?.data
          ?.message ||
          "Admin Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center px-6">

      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="text-center mb-8">

          <div className="text-5xl mb-4">
            🛡️
          </div>

          <h1 className="text-4xl font-bold text-gray-800">
            Admin Login
          </h1>

          <p className="text-gray-500 mt-2">
            Placement AI Tracker
          </p>

        </div>

        {/* ================================= */}
        {/* ERROR */}
        {/* ================================= */}

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg mb-5">
            {error}
          </div>
        )}

        {/* ================================= */}
        {/* LOGIN FORM */}
        {/* ================================= */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* ADMIN ID */}

          <div>

            <label className="block text-gray-700 font-semibold mb-2">
              Admin ID
            </label>

            <input
              type="text"
              value={studentId}
              onChange={(event) =>
                setStudentId(
                  event.target.value
                )
              }
              placeholder="Enter Admin ID"
              required
              className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* PASSWORD */}

          <div>

            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Enter Admin Password"
              required
              className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 text-white py-4 rounded-xl font-semibold transition"
          >
            {loading
              ? "Logging In..."
              : "Admin Login"}
          </button>

        </form>

        {/* ================================= */}
        {/* STUDENT LOGIN */}
        {/* ================================= */}

        <div className="text-center mt-6">

          <p className="text-gray-600">

            Are you a student?{" "}

            <Link
              to="/login"
              className="text-blue-700 font-semibold hover:underline"
            >
              Student Login
            </Link>

          </p>

        </div>

        {/* ================================= */}
        {/* BACK TO HOME */}
        {/* ================================= */}

        <div className="text-center mt-4">

          <Link
            to="/"
            className="text-gray-500 hover:text-blue-700"
          >
            ← Back to Home
          </Link>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;