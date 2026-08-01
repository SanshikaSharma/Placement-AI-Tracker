import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCompanyById,
  updateCompany,
} from "../../services/companyService";

function EditCompany() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    companyName: "",
    role: "",
    package: "",
    location: "",
    jobType: "Full Time",
    minimumCGPA: "",
    eligibleBranches: "",
    skillsRequired: "",
    eligibility: "",
    description: "",
    applyLink: "",
    deadline: "",
    status: "Open",
  });

  useEffect(() => {
    let mounted = true;

    async function loadCompany() {
      try {
        const res = await getCompanyById(id);

        if (!mounted) return;

        const company = res.company;

        setFormData({
          companyName: company.companyName || "",
          role: company.role || "",
          package: company.package || "",
          location: company.location || "",
          jobType: company.jobType || "Full Time",
          minimumCGPA: company.minimumCGPA || "",
          eligibleBranches: (company.eligibleBranches || []).join(", "),
          skillsRequired: (company.skillsRequired || []).join(", "),
          eligibility: company.eligibility || "",
          description: company.description || "",
          applyLink: company.applyLink || "",
          deadline: company.deadline
            ? company.deadline.substring(0, 10)
            : "",
          status: company.status || "Open",
        });
      } catch (err) {
        console.error(err);
        alert("Unable to Load Company");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadCompany();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateCompany(id, {
        ...formData,
        minimumCGPA: Number(formData.minimumCGPA),
        eligibleBranches: formData.eligibleBranches
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        skillsRequired: formData.skillsRequired
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      });

      alert("Company Updated Successfully");

      navigate("/companies");
    } catch (err) {
      console.error(err);
      alert("Update Failed");
    }
  };

  if (loading) {
    return (
      <div className="text-center text-2xl font-bold p-10">
        Loading Company...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-3xl p-10">

      <h1 className="text-4xl font-bold mb-10">
        Edit Company
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6"
      >

        {/* Company Name */}

        <div>
          <label className="block mb-2 font-semibold">
            Company Name
          </label>

          <input
            type="text"
            name="companyName"
            placeholder="Enter Company Name"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full border rounded-xl p-4"
            required
          />
        </div>

        {/* Role */}

        <div>
          <label className="block mb-2 font-semibold">
            Job Role
          </label>

          <input
            type="text"
            name="role"
            placeholder="Software Engineer"
            value={formData.role}
            onChange={handleChange}
            className="w-full border rounded-xl p-4"
            required
          />
        </div>

        {/* Package */}

        <div>
          <label className="block mb-2 font-semibold">
            Package
          </label>

          <input
            type="text"
            name="package"
            placeholder="12 LPA"
            value={formData.package}
            onChange={handleChange}
            className="w-full border rounded-xl p-4"
            required
          />
        </div>

        {/* Location */}

        <div>
          <label className="block mb-2 font-semibold">
            Location
          </label>

          <input
            type="text"
            name="location"
            placeholder="Bangalore"
            value={formData.location}
            onChange={handleChange}
            className="w-full border rounded-xl p-4"
            required
          />
        </div>

        {/* Job Type */}

        <div>
          <label className="block mb-2 font-semibold">
            Job Type
          </label>

          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            className="w-full border rounded-xl p-4"
          >
            <option>Full Time</option>
            <option>Internship</option>
            <option>Internship + PPO</option>
            <option>Part Time</option>
          </select>
        </div>

        {/* Deadline */}

        <div>
          <label className="block mb-2 font-semibold">
            Application Deadline
          </label>

          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full border rounded-xl p-4"
          />
        </div>

        {/* Eligible Branches */}

        <div>
          <label className="block mb-2 font-semibold">
            Eligible Branches
          </label>

          <input
            type="text"
            name="eligibleBranches"
            placeholder="CSE, IT, AI"
            value={formData.eligibleBranches}
            onChange={handleChange}
            className="w-full border rounded-xl p-4"
          />
        </div>

        {/* Minimum CGPA */}

        <div>
          <label className="block mb-2 font-semibold">
            Minimum CGPA
          </label>

          <input
            type="number"
            step="0.1"
            name="minimumCGPA"
            placeholder="7.5"
            value={formData.minimumCGPA}
            onChange={handleChange}
            className="w-full border rounded-xl p-4"
          />
        </div>

        {/* Skills */}

        <div className="md:col-span-2">
          <label className="block mb-2 font-semibold">
            Skills Required
          </label>

          <input
            type="text"
            name="skillsRequired"
            placeholder="React, Node.js, MongoDB"
            value={formData.skillsRequired}
            onChange={handleChange}
            className="w-full border rounded-xl p-4"
          />
        </div>

        {/* Apply Link */}

        <div className="md:col-span-2">
          <label className="block mb-2 font-semibold">
            Apply Link
          </label>

          <input
            type="text"
            name="applyLink"
            placeholder="https://careers.company.com"
            value={formData.applyLink}
            onChange={handleChange}
            className="w-full border rounded-xl p-4"
          />
        </div>

        {/* Eligibility */}

        <div className="md:col-span-2">
          <label className="block mb-2 font-semibold">
            Eligibility
          </label>

          <input
            type="text"
            name="eligibility"
            placeholder="Only 2027 Batch"
            value={formData.eligibility}
            onChange={handleChange}
            className="w-full border rounded-xl p-4"
          />
        </div>

        {/* Description */}

        <div className="md:col-span-2">
          <label className="block mb-2 font-semibold">
            Job Description
          </label>

          <textarea
            rows="6"
            name="description"
            placeholder="Enter Job Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-xl p-4"
          />
        </div>

        {/* Button */}

        <button
          type="submit"
          className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl text-lg font-semibold"
        >
          Update Company
        </button>

      </form>

    </div>
  );
}

export default EditCompany;