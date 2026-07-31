import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCompany } from "../../services/companyService";

function AddCompany() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    role: "",
    package: "",
    location: "",
    jobType: "Full Time",
    eligibleBranches: "",
    minimumCGPA: "",
    skillsRequired: "",
    eligibility: "",
    description: "",
    applyLink: "",
    deadline: "",
    status: "Open",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        eligibleBranches: formData.eligibleBranches
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        skillsRequired: formData.skillsRequired
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        minimumCGPA: Number(formData.minimumCGPA),
      };

    await createCompany(payload);

      alert("Company Added Successfully");

      navigate("/companies");

    } catch (err) {
      console.error(err);
      alert("Unable to Add Company");
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-8">

      <h1 className="text-3xl font-bold mb-8">
        Add New Company
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6"
      >

        <input
          name="companyName"
          placeholder="Company Name"
          className="border rounded-xl p-3"
          onChange={handleChange}
          required
        />

        <input
          name="role"
          placeholder="Job Role"
          className="border rounded-xl p-3"
          onChange={handleChange}
          required
        />

        <input
          name="package"
          placeholder="Package"
          className="border rounded-xl p-3"
          onChange={handleChange}
          required
        />

        <input
          name="location"
          placeholder="Location"
          className="border rounded-xl p-3"
          onChange={handleChange}
          required
        />

        <select
          name="jobType"
          className="border rounded-xl p-3"
          onChange={handleChange}
        >
          <option>Full Time</option>
          <option>Internship</option>
          <option>Internship + PPO</option>
          <option>Part Time</option>
        </select>

        <input
          name="minimumCGPA"
          placeholder="Minimum CGPA"
          className="border rounded-xl p-3"
          onChange={handleChange}
        />

        <input
          name="eligibleBranches"
          placeholder="CSE, IT, AI"
          className="border rounded-xl p-3"
          onChange={handleChange}
        />

        <input
          name="skillsRequired"
          placeholder="React, Node.js, DSA"
          className="border rounded-xl p-3"
          onChange={handleChange}
        />

        <input
          name="deadline"
          type="date"
          className="border rounded-xl p-3"
          onChange={handleChange}
          required
        />

        <input
          name="applyLink"
          placeholder="Apply Link"
          className="border rounded-xl p-3"
          onChange={handleChange}
        />

        <input
          name="eligibility"
          placeholder="Eligibility"
          className="border rounded-xl p-3 md:col-span-2"
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          rows="5"
          placeholder="Job Description"
          className="border rounded-xl p-3 md:col-span-2"
          onChange={handleChange}
        />

        <button
          className="bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl md:col-span-2"
        >
          Add Company
        </button>

      </form>

    </div>
  );
}

export default AddCompany;