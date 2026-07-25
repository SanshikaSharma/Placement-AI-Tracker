import { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

function AddCompany({ refreshCompanies }) {
  const [company, setCompany] = useState({
    companyName: "",
    role: "",
    package: "",
    location: "",
    eligibility: "",
    deadline: "",
  });

  const handleChange = (e) => {
    setCompany({
      ...company,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
  "/company/add",
  company
);

      toast.success(res.data.message);

if (refreshCompanies) {
  refreshCompanies();
}

setCompany({
        companyName: "",
        role: "",
        package: "",
        location: "",
        eligibility: "",
        deadline: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to add company"
      );
    }
  };

  return (
    <div className="form-section">
      <h2>Add Company</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={company.companyName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="role"
          placeholder="Role"
          value={company.role}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="package"
          placeholder="Package"
          value={company.package}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={company.location}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="eligibility"
          placeholder="Eligibility"
          value={company.eligibility}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="deadline"
          value={company.deadline}
          onChange={handleChange}
          required
        />

        <button type="submit">
          Add Company
        </button>
      </form>
    </div>
  );
}

export default AddCompany;