import { Link } from "react-router-dom";
import { deleteCompany } from "../../services/companyService";
import { applyToCompany } from "../../services/applicationService";

function CompanyCard({ company }) {
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Delete ${company.companyName}?`
    );

    if (!confirmDelete) return;

    try {
      await deleteCompany(company._id);

      alert("Company Deleted Successfully");

      window.location.reload();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Unable to Delete Company"
      );
    }
  };

  const handleApply = async () => {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      alert("Please login first.");
      return;
    }

    const user = JSON.parse(storedUser);

    console.log("===== APPLY BUTTON =====");
    console.log("Logged-in User:", user);

    const studentId =
      user._id ||
      user.id ||
      user.userId;

    const companyId = company?._id;

    console.log("Student ID:", studentId);
    console.log("Company ID:", companyId);

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

    console.log(
      "Application Response:",
      res
    );

    alert(
      res.message ||
        "Application submitted successfully."
    );
  } catch (error) {
    console.error(
      "Apply Error:",
      error
    );

    alert(
      error.response?.data?.message ||
        "Application failed."
    );
  }
};

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

      <h2 className="text-2xl font-bold">
        {company.companyName}
      </h2>

      <p className="text-gray-500 mt-1">
        {company.role}
      </p>

      <div className="mt-5 space-y-2">
        <p>
          <strong>Package:</strong> {company.package}
        </p>

        <p>
          <strong>Location:</strong> {company.location}
        </p>

        <p>
          <strong>Minimum CGPA:</strong> {company.minimumCGPA}
        </p>

        <p>
          <strong>Status:</strong> {company.status}
        </p>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleApply}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
        >
          Apply Now
        </button>

        <Link
          to={`/companies/edit/${company._id}`}
          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-center py-2 rounded-lg"
        >
          Edit
        </Link>

        <button
          onClick={handleDelete}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default CompanyCard;