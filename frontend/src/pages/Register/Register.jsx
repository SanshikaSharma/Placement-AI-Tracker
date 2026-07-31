import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    email: "",
    password: "",
    college: "",
    branch: "",
    semester: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/auth/register", formData);

      setSuccess("Registration Successful!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-blue-900 to-blue-600 flex items-center justify-center px-6 py-10">

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-10">

        <h1 className="text-4xl font-bold text-center text-blue-700">
          Student Registration
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Placement AI Tracker
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-5">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-5">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-5"
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border rounded-xl p-4"
          />

          <input
            type="text"
            name="studentId"
            placeholder="Student ID"
            value={formData.studentId}
            onChange={handleChange}
            required
            className="border rounded-xl p-4"
          />

          <input
            type="email"
            name="email"
            placeholder="College Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border rounded-xl p-4"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="border rounded-xl p-4"
          />

          <input
            type="text"
            name="college"
            placeholder="College"
            value={formData.college}
            onChange={handleChange}
            required
            className="border rounded-xl p-4"
          />

          <input
            type="text"
            name="branch"
            placeholder="Branch"
            value={formData.branch}
            onChange={handleChange}
            required
            className="border rounded-xl p-4"
          />

          <input
            type="text"
            name="semester"
            placeholder="Semester"
            value={formData.semester}
            onChange={handleChange}
            required
            className="border rounded-xl p-4 md:col-span-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-blue-700 text-white py-4 rounded-xl hover:bg-blue-800 transition"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-8">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-700 font-semibold"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;