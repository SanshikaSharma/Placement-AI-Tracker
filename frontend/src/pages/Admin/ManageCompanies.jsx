import { useEffect, useState } from "react";
import {
  getCompanies,
  deleteCompany,
} from "../../services/companyService";

import AddCompanyModal from "../../components/admin/AddCompanyModal";

function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchCompanies = async () => {
    try {
      setLoading(true);

      const res = await getCompanies();

      setCompanies(res.companies || []);
    } catch (err) {
      console.error(err);
      alert("Unable to load companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const loadCompanies = async () => {
    await fetchCompanies();
  };

  loadCompanies();
}, []);
  const refreshCompanies = async () => {
  await fetchCompanies();
};
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this company?"
    );

    if (!confirmDelete) return;

    try {
      const res = await deleteCompany(id);

      alert(res.message);

      await fetchCompanies();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Unable to delete company"
      );
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-xl font-semibold">
        Loading Companies...
      </div>
    );
  }

  return (
    <div className="p-8">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Manage Companies
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-xl"
        >
          + Add Company
        </button>

      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">Company</th>

              <th className="p-4 text-left">Role</th>

              <th className="p-4 text-left">Package</th>

              <th className="p-4 text-left">Location</th>

              <th className="p-4 text-left">Status</th>

              <th className="p-4 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {companies.length === 0 ? (
              <tr>

                <td
                  colSpan="6"
                  className="text-center py-10"
                >
                  No Companies Found
                </td>

              </tr>
            ) : (
              companies.map((company) => (
                <tr
                  key={company._id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-4">
                    {company.companyName}
                  </td>

                  <td className="p-4">
                    {company.role}
                  </td>

                  <td className="p-4">
                    {company.package}
                  </td>

                  <td className="p-4">
                    {company.location}
                  </td>

                  <td className="p-4">

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      {company.status}
                    </span>

                  </td>

                  <td className="p-4 text-center">

                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(company._id)
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

      {showModal && (
        <AddCompanyModal
          closeModal={() => setShowModal(false)}
          refreshCompanies={refreshCompanies}
        />
      )}

    </div>
  );
}

export default ManageCompanies;