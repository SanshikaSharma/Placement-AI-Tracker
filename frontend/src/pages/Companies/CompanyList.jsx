import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCompanies } from "../../services/companyService";
import CompanyCard from "../../components/company/CompanyCard";

function CompanyList() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function fetchCompanies() {
      try {
        const res = await getCompanies();

        if (mounted) {
          setCompanies(res.companies || []);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchCompanies();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="p-8">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Companies
        </h1>

        <Link
          to="/companies/add"
          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-xl"
        >
          + Add Company
        </Link>

      </div>

      {companies.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          No Companies Found
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {companies.map((company) => (
           <CompanyCard
  key={company._id}
  company={company}
  onDelete={(id) =>
    setCompanies((prev) =>
      prev.filter((company) => company._id !== id)
    )
  }
/>
          ))}
        </div>
      )}

    </div>
  );
}

export default CompanyList;