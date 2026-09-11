import { useEffect, useState } from "react";
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
        console.error("Failed to fetch companies:", err);
      }
    }

    fetchCompanies();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Companies
        </h1>

        <p className="text-gray-500 mt-2">
          Explore available companies and placement opportunities.
        </p>
      </div>

      {/* Companies */}
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
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CompanyList;