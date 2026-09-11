import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllCompanies,
  deleteCompany,
} from "../../services/adminService";

function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // ==========================================
  // LOAD COMPANIES
  // ==========================================
  useEffect(() => {
    let cancelled = false;

    const loadCompanies = async () => {
      try {
        const response = await getAllCompanies();

        console.log("COMPANIES RESPONSE:", response);

        if (cancelled) {
          return;
        }

        if (response && response.success) {
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
        if (cancelled) {
          return;
        }

        console.error(
          "GET COMPANIES ERROR:",
          err
        );

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
  // SEARCH COMPANIES
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

      if (response && response.success) {
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
      </div>
    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================
  return (
    <div className="p-8">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-4xl font-bold">
            Manage Companies
          </h1>

          <p className="text-gray-500 mt-2">
            View, edit and manage placement
            companies.
          </p>
        </div>

        <Link
          to="/companies/add"
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold transition text-center"
        >
          + Add Company
        </Link>

      </div>

      {/* =====================================
          SEARCH
      ====================================== */}

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

      {/* =====================================
          COUNT
      ====================================== */}

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

      {/* =====================================
          NO COMPANIES
      ====================================== */}

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

        /* ===================================
           COMPANY TABLE
        ==================================== */

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

                      {/* NUMBER */}

                      <td className="p-4">
                        {index + 1}
                      </td>

                      {/* COMPANY */}

                      <td className="p-4">

                        <div className="font-semibold">
                          {company.companyName ||
                            "-"}
                        </div>

                      </td>

                      {/* ROLE */}

                      <td className="p-4">
                        {company.role || "-"}
                      </td>

                      {/* PACKAGE */}

                      <td className="p-4">
                        {company.package || "-"}
                      </td>

                      {/* LOCATION */}

                      <td className="p-4">
                        {company.location || "-"}
                      </td>

                      {/* DEADLINE */}

                      <td className="p-4">

                        {company.deadline
                          ? new Date(
                              company.deadline
                            ).toLocaleDateString()
                          : "-"}

                      </td>

                      {/* STATUS */}

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

                      {/* ACTIONS */}

                      <td className="p-4">

                        <div className="flex gap-2 justify-center">

                          <Link
                            to={`/companies/edit/${company._id}`}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition"
                          >
                            Edit
                          </Link>

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

    </div>
  );
}

export default ManageCompanies;