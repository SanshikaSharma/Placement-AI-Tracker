import { useEffect, useState } from "react";
import api from "../../services/api";
import SearchBar from "../../components/SearchBar";

function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");

useEffect(() => {
  const fetchCompanies = async () => {
    try {
      const res = await api.get("/company/all");
      setCompanies(res.data.companies || []);
    } catch (err) {
      console.error(err);
    }
  };

  fetchCompanies();
}, []);
 const filteredCompanies = companies.filter((company) => {
  const name = company.companyName || "";
  return name.toLowerCase().includes(search.toLowerCase());
});

  return (
    <div className="p-8">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Companies
        </h1>
      </div>

      <div className="mb-6">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search companies..."
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-4 text-left">Company</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Package</th>
              <th className="p-4 text-left">Deadline</th>
            </tr>

          </thead>

          <tbody>

            {filteredCompanies.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-8"
                >
                  No companies found.
                </td>
              </tr>
            ) : (
              filteredCompanies.map((company) => (
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
                    {company.location}
                  </td>

                  <td className="p-4">
                    {company.package}
                  </td>

                  <td className="p-4">
                    {company.deadline
                      ? new Date(
                          company.deadline
                        ).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default CompanyList;