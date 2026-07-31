import { Link } from "react-router-dom";
import { deleteCompany } from "../../services/companyService";
import { applyToCompany } from "../../services/companyService";

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
      alert("Unable to Delete Company");
    }
  };
  const handleApply = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login first");
      return;
    }

    const res = await applyToCompany(user._id, company._id);

    alert(res.message);

  } catch (err) {
    console.error(err);

    alert(
      err.response?.data?.message ||
      "Unable to Apply"
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
          <strong>CGPA:</strong> {company.minimumCGPA}
        </p>

        <p>
          <strong>Status:</strong> {company.status}
        </p>

      </div>

      <div className="flex gap-3 mt-6">

        <Link
          to={`/companies/edit/${company._id}`}
          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-center py-2 rounded-lg"
        >
          <button
  onClick={handleApply}
  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg mb-3"
>
  Apply Now
</button>
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