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
    jobType: "",
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

        const company = res.company;

        if (!mounted) return;

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
    return <h2 className="text-2xl p-8">Loading...</h2>;
  }

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-8">
        Edit Company
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6"
      >
        <input name="companyName" value={formData.companyName} onChange={handleChange} className="border rounded-xl p-3" required />
        <input name="role" value={formData.role} onChange={handleChange} className="border rounded-xl p-3" required />
        <input name="package" value={formData.package} onChange={handleChange} className="border rounded-xl p-3" required />
        <input name="location" value={formData.location} onChange={handleChange} className="border rounded-xl p-3" required />
        <input name="minimumCGPA" value={formData.minimumCGPA} onChange={handleChange} className="border rounded-xl p-3" />
        <input name="eligibleBranches" value={formData.eligibleBranches} onChange={handleChange} className="border rounded-xl p-3" />
        <input name="skillsRequired" value={formData.skillsRequired} onChange={handleChange} className="border rounded-xl p-3" />
        <input name="deadline" type="date" value={formData.deadline} onChange={handleChange} className="border rounded-xl p-3" />
        <input name="applyLink" value={formData.applyLink} onChange={handleChange} className="border rounded-xl p-3 md:col-span-2" />
        <input name="eligibility" value={formData.eligibility} onChange={handleChange} className="border rounded-xl p-3 md:col-span-2" />
        <textarea name="description" value={formData.description} onChange={handleChange} rows="5" className="border rounded-xl p-3 md:col-span-2" />

        <button className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl md:col-span-2">
          Update Company
        </button>
      </form>
    </div>
  );
}

export default EditCompany;