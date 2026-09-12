import { useEffect, useMemo, useState } from "react";
import {
  getAllCompanies,
  deleteCompany,
  addCompany,
  updateCompany,
} from "../../services/adminService";

function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deletingId, setDeletingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const emptyForm = {
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
  };

  const [form, setForm] = useState(emptyForm);

  // ==========================================
  // LOAD COMPANIES
  // ==========================================
  useEffect(() => {
    let cancelled = false;

    const loadCompanies = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAllCompanies();

        console.log("COMPANIES RESPONSE:", response);

        if (cancelled) return;

        if (response?.success) {
          setCompanies(
            Array.isArray(response.companies)
              ? response.companies
              : []
          );
        } else {
          setError(
            response?.message ||
              "Unable to load companies."
          );
        }
      } catch (err) {
        if (cancelled) return;

        console.error("GET COMPANIES ERROR:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load companies."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCompanies();

    return () => {
      cancelled = true;
    };
  }, []);

  // ==========================================
  // SEARCH
  // ==========================================
  const filteredCompanies = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return companies;
    }

    return companies.filter((company) => {
      const companyName = String(
        company.companyName || ""
      ).toLowerCase();

      const role = String(
        company.role || ""
      ).toLowerCase();

      const location = String(
        company.location || ""
      ).toLowerCase();

      return (
        companyName.includes(keyword) ||
        role.includes(keyword) ||
        location.includes(keyword)
      );
    });
  }, [companies, search]);

  // ==========================================
  // OPEN ADD MODAL
  // ==========================================
  const handleAdd = () => {
    setEditingCompany(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================
  const handleEdit = (company) => {
    setEditingCompany(company);

    setForm({
      companyName: company.companyName || "",
      role: company.role || "",
      package: company.package || "",
      location: company.location || "",
      jobType: company.jobType || "Full Time",

      eligibleBranches: Array.isArray(
        company.eligibleBranches
      )
        ? company.eligibleBranches.join(", ")
        : "",

      minimumCGPA:
        company.minimumCGPA !== undefined &&
        company.minimumCGPA !== null
          ? String(company.minimumCGPA)
          : "",

      skillsRequired: Array.isArray(
        company.skillsRequired
      )
        ? company.skillsRequired.join(", ")
        : "",

      eligibility: company.eligibility || "",
      description: company.description || "",
      applyLink: company.applyLink || "",

      deadline: company.deadline
        ? new Date(company.deadline)
            .toISOString()
            .split("T")[0]
        : "",

      status: company.status || "Open",
    });

    setShowModal(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================
  const handleCloseModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingCompany(null);
    setForm(emptyForm);
  };

  // ==========================================
  // FORM CHANGE
  // ==========================================
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // SAVE COMPANY
  // ==========================================
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.companyName.trim()) {
      alert("Company name is required.");
      return;
    }

    if (!form.role.trim()) {
      alert("Role is required.");
      return;
    }

    if (!form.package.trim()) {
      alert("Package is required.");
      return;
    }

    if (!form.location.trim()) {
      alert("Location is required.");
      return;
    }

    if (!form.eligibility.trim()) {
      alert("Eligibility is required.");
      return;
    }

    if (!form.deadline) {
      alert("Deadline is required.");
      return;
    }

    const minimumCGPA =
      form.minimumCGPA === ""
        ? 0
        : Number(form.minimumCGPA);

    if (
      Number.isNaN(minimumCGPA) ||
      minimumCGPA < 0 ||
      minimumCGPA > 10
    ) {
      alert("Minimum CGPA must be between 0 and 10.");
      return;
    }

    const companyData = {
      companyName: form.companyName.trim(),
      role: form.role.trim(),
      package: form.package.trim(),
      location: form.location.trim(),
      jobType: form.jobType,

      eligibleBranches: form.eligibleBranches
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),

      minimumCGPA,

      skillsRequired: form.skillsRequired
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),

      eligibility: form.eligibility.trim(),
      description: form.description.trim(),
      applyLink: form.applyLink.trim(),
      deadline: form.deadline,
      status: form.status,
    };

    try {
      setSaving(true);

      let response;

      // ========================================
      // UPDATE
      // ========================================
      if (editingCompany) {
        response = await updateCompany(
          editingCompany._id,
          companyData
        );

        console.log(
          "UPDATE COMPANY RESPONSE:",
          response
        );

        if (response?.success) {
          const updatedCompany =
            response.company || {
              ...editingCompany,
              ...companyData,
            };

          setCompanies((previousCompanies) =>
            previousCompanies.map((company) =>
              company._id === editingCompany._id
                ? updatedCompany
                : company
            )
          );

          alert(
            response.message ||
              "Company updated successfully."
          );

          handleCloseModal();
        } else {
          alert(
            response?.message ||
              "Unable to update company."
          );
        }
      }

      // ========================================
      // ADD
      // ========================================
      else {
        response = await addCompany(companyData);

        console.log(
          "ADD COMPANY RESPONSE:",
          response
        );

        if (response?.success) {
          if (response.company) {
            setCompanies((previousCompanies) => [
              response.company,
              ...previousCompanies,
            ]);
          } else {
            const refreshed =
              await getAllCompanies();

            if (refreshed?.success) {
              setCompanies(
                Array.isArray(
                  refreshed.companies
                )
                  ? refreshed.companies
                  : []
              );
            }
          }

          alert(
            response.message ||
              "Company added successfully."
          );

          handleCloseModal();
        } else {
          alert(
            response?.message ||
              "Unable to add company."
          );
        }
      }
    } catch (err) {
      console.error(
        "SAVE COMPANY ERROR:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to save company."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE COMPANY
  // ==========================================
  const handleDelete = async (
    id,
    companyName
  ) => {
    if (!id) {
      alert("Company ID is missing.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        companyName || "this company"
      }?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await deleteCompany(id);

      console.log(
        "DELETE COMPANY RESPONSE:",
        response
      );

      if (response?.success) {
        alert(
          response.message ||
            "Company deleted successfully."
        );

        setCompanies((previousCompanies) =>
          previousCompanies.filter(
            (company) => company._id !== id
          )
        );
      } else {
        alert(
          response?.message ||
            "Unable to delete company."
        );
      }
    } catch (err) {
      console.error(
        "DELETE COMPANY ERROR:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Delete failed."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">
          Loading Companies...
        </h1>

        <p className="text-gray-500 mt-2">
          Please wait while companies are loaded.
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-6">
          Manage Companies
        </h1>

        <div className="bg-red-100 border border-red-300 text-red-700 p-5 rounded-xl">
          {error}
        </div>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================
  return (
    <div className="p-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-4xl font-bold">
            Manage Companies
          </h1>

          <p className="text-gray-500 mt-2">
            View, add, edit and manage placement
            companies.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold transition"
        >
          + Add Company
        </button>

      </div>

      {/* SEARCH */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search by company, role or location..."
          className="border border-gray-300 rounded-xl p-4 w-full outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* COUNT */}
      <div className="mb-5 text-gray-600">
        Showing{" "}
        <span className="font-semibold">
          {filteredCompanies.length}
        </span>{" "}
        of{" "}
        <span className="font-semibold">
          {companies.length}
        </span>{" "}
        companies
      </div>

      {/* EMPTY */}
      {filteredCompanies.length === 0 ? (
        <div className="bg-white shadow rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold">
            No Companies Found
          </h2>

          <p className="text-gray-500 mt-2">
            {search
              ? "No company matches your search."
              : "No companies have been added yet."}
          </p>
        </div>
      ) : (
        /* TABLE */
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">
                    #
                  </th>

                  <th className="p-4 text-left">
                    Company
                  </th>

                  <th className="p-4 text-left">
                    Role
                  </th>

                  <th className="p-4 text-left">
                    Package
                  </th>

                  <th className="p-4 text-left">
                    Location
                  </th>

                  <th className="p-4 text-left">
                    Deadline
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                  <th className="p-4 text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCompanies.map(
                  (company, index) => (
                    <tr
                      key={company._id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-4">
                        {index + 1}
                      </td>

                      <td className="p-4">
                        <div className="font-semibold">
                          {company.companyName ||
                            "-"}
                        </div>
                      </td>

                      <td className="p-4">
                        {company.role || "-"}
                      </td>

                      <td className="p-4">
                        {company.package || "-"}
                      </td>

                      <td className="p-4">
                        {company.location || "-"}
                      </td>

                      <td className="p-4">
                        {company.deadline
                          ? new Date(
                              company.deadline
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            company.status ===
                            "Open"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {company.status ||
                            "Unknown"}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex gap-2 justify-center">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(company)
                            }
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                company._id,
                                company.companyName
                              )
                            }
                            disabled={
                              deletingId ===
                              company._id
                            }
                            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition"
                          >
                            {deletingId ===
                            company._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>
                      </td>

                    </tr>
                  )
                )}
              </tbody>

            </table>

          </div>

        </div>
      )}

      {/* ==========================================
          ADD / EDIT MODAL
      ========================================== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between p-6 border-b">

              <div>
                <h2 className="text-2xl font-bold">
                  {editingCompany
                    ? "Edit Company"
                    : "Add Company"}
                </h2>

                <p className="text-gray-500 mt-1">
                  {editingCompany
                    ? "Update company placement details."
                    : "Add a new placement company."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={saving}
                className="text-gray-500 hover:text-red-600 text-3xl disabled:opacity-50"
              >
                ×
              </button>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="p-6"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* COMPANY */}
                <div>
                  <label className="block font-semibold mb-2">
                    Company Name *
                  </label>

                  <input
                    type="text"
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder="e.g. Google"
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                {/* ROLE */}
                <div>
                  <label className="block font-semibold mb-2">
                    Role *
                  </label>

                  <input
                    type="text"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    placeholder="e.g. Software Engineer"
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                {/* PACKAGE */}
                <div>
                  <label className="block font-semibold mb-2">
                    Package *
                  </label>

                  <input
                    type="text"
                    name="package"
                    value={form.package}
                    onChange={handleChange}
                    placeholder="e.g. 12 LPA"
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                {/* LOCATION */}
                <div>
                  <label className="block font-semibold mb-2">
                    Location *
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Bangalore"
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                {/* JOB TYPE */}
                <div>
                  <label className="block font-semibold mb-2">
                    Job Type
                  </label>

                  <select
                    name="jobType"
                    value={form.jobType}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                  >
                    <option value="Full Time">
                      Full Time
                    </option>
                    <option value="Internship">
                      Internship
                    </option>
                    <option value="Part Time">
                      Part Time
                    </option>
                  </select>
                </div>

                {/* CGPA */}
                <div>
                  <label className="block font-semibold mb-2">
                    Minimum CGPA
                  </label>

                  <input
                    type="number"
                    name="minimumCGPA"
                    value={form.minimumCGPA}
                    onChange={handleChange}
                    min="0"
                    max="10"
                    step="0.1"
                    placeholder="e.g. 7.0"
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                {/* BRANCHES */}
                <div>
                  <label className="block font-semibold mb-2">
                    Eligible Branches
                  </label>

                  <input
                    type="text"
                    name="eligibleBranches"
                    value={form.eligibleBranches}
                    onChange={handleChange}
                    placeholder="CSE, IT, ECE"
                    className="w-full border rounded-lg p-3"
                  />

                  <p className="text-xs text-gray-500 mt-1">
                    Separate branches with commas.
                  </p>
                </div>

                {/* SKILLS */}
                <div>
                  <label className="block font-semibold mb-2">
                    Required Skills
                  </label>

                  <input
                    type="text"
                    name="skillsRequired"
                    value={form.skillsRequired}
                    onChange={handleChange}
                    placeholder="JavaScript, React, Node.js"
                    className="w-full border rounded-lg p-3"
                  />

                  <p className="text-xs text-gray-500 mt-1">
                    Separate skills with commas.
                  </p>
                </div>

                {/* DEADLINE */}
                <div>
                  <label className="block font-semibold mb-2">
                    Application Deadline *
                  </label>

                  <input
                    type="date"
                    name="deadline"
                    value={form.deadline}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                {/* STATUS */}
                <div>
                  <label className="block font-semibold mb-2">
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                  >
                    <option value="Open">
                      Open
                    </option>

                    <option value="Closed">
                      Closed
                    </option>
                  </select>
                </div>

              </div>

              {/* ELIGIBILITY */}
              <div className="mt-5">
                <label className="block font-semibold mb-2">
                  Eligibility *
                </label>

                <input
                  type="text"
                  name="eligibility"
                  value={form.eligibility}
                  onChange={handleChange}
                  placeholder="BTech CSE with minimum 7 CGPA"
                  className="w-full border rounded-lg p-3"
                />
              </div>

              {/* APPLY LINK */}
              <div className="mt-5">
                <label className="block font-semibold mb-2">
                  Apply Link
                </label>

                <input
                  type="url"
                  name="applyLink"
                  value={form.applyLink}
                  onChange={handleChange}
                  placeholder="https://company.com/careers"
                  className="w-full border rounded-lg p-3"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="mt-5">
                <label className="block font-semibold mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter job description..."
                  className="w-full border rounded-lg p-3 resize-none"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 mt-6">

                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="px-5 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:bg-gray-400"
                >
                  {saving
                    ? "Saving..."
                    : editingCompany
                    ? "Update Company"
                    : "Add Company"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default ManageCompanies;