import { Link } from "react-router-dom";
import { applyToCompany } from "../../services/applicationService";

function CompanyCard({ company }) {
  const handleApply = async () => {
    try {
      const storedUser =
        localStorage.getItem("user") ||
        sessionStorage.getItem("user");

      if (!storedUser) {
        alert("Please login first.");
        return;
      }

      const user = JSON.parse(storedUser);

      const studentId =
        user._id ||
        user.id ||
        user.userId;

      const companyId = company?._id;

      if (!studentId) {
        alert(
          "Student ID not found. Please logout and login again."
        );
        return;
      }

      if (!companyId) {
        alert("Company ID not found.");
        return;
      }

      const res = await applyToCompany({
        companyId,
        studentId,
      });

      alert(
        res.message ||
          "Application submitted successfully."
      );
    } catch (error) {
      console.error("Apply Error:", error);

      alert(
        error.response?.data?.message ||
          "Application failed."
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

      {/* Company Name */}
      <h2 className="text-2xl font-bold">
        {company.companyName}
      </h2>

      {/* Role */}
      <p className="text-gray-500 mt-1">
        {company.role}
      </p>

      {/* Company Details */}
      <div className="mt-5 space-y-2">
        <p>
          <strong>Package:</strong>{" "}
          {company.package}
        </p>

        <p>
          <strong>Location:</strong>{" "}
          {company.location}
        </p>

        <p>
          <strong>Minimum CGPA:</strong>{" "}
          {company.minimumCGPA}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {company.status}
        </p>
      </div>

      {/* Student Actions */}
      <div className="flex gap-3 mt-6">

        <button
          onClick={handleApply}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
        >
          Apply Now
        </button>

        <Link
          to={`/company/${company._id}`}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg"
        >
          View Details
        </Link>

      </div>
    </div>
  );
}

export default CompanyCard;