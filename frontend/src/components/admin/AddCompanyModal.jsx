import { useState } from "react";
import { createCompany } from "../../services/companyService";

function AddCompanyModal({ closeModal, refreshCompanies }) {
  const [formData, setFormData] = useState({
    companyName: "",
    role: "",
    package: "",
    location: "",
    eligibility: "",
    deadline: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await createCompany(formData);

      alert(res.message);

      refreshCompanies();

      closeModal();

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Unable to Add Company"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl p-8 w-125">

        <h2 className="text-2xl font-bold mb-6">
          Add Company
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            name="companyName"
            placeholder="Company Name"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            name="role"
            placeholder="Role"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            name="package"
            placeholder="Package"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            name="location"
            placeholder="Location"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            name="eligibility"
            placeholder="Eligibility"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <input
            type="date"
            name="deadline"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={closeModal}
              className="px-5 py-2 bg-gray-300 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-blue-700 text-white rounded-lg"
            >
              Add Company
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddCompanyModal;