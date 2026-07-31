function TopCompanies() {
  const companies = [
    "Google",
    "Microsoft",
    "Amazon",
    "Adobe",
    "Oracle",
    "Infosys",
    "TCS",
    "Accenture",
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-5">
        Top Hiring Companies
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {companies.map((company, index) => (
          <div
            key={index}
            className="bg-blue-50 rounded-xl p-4 text-center font-semibold"
          >
            {company}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopCompanies;