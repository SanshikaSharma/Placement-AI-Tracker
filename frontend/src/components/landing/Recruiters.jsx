function Recruiters() {
  const companies = [
    "Google",
    "Microsoft",
    "Amazon",
    "Adobe",
    "Oracle",
    "Infosys",
    "TCS",
    "Accenture",
    "Deloitte",
    "Capgemini",
    "IBM",
    "Wipro",
  ];

  return (
    <section
      id="companies"
      className="py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-8">

        <h2 className="text-5xl font-bold text-center text-slate-800">
          Top Recruiting Companies
        </h2>

        <p className="text-center text-gray-500 mt-5 mb-16">
          Trusted by leading companies hiring talented students.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

          {companies.map((company) => (
            <div
              key={company}
              className="bg-slate-50 rounded-3xl p-10 shadow hover:shadow-xl hover:-translate-y-2 transition duration-300 flex justify-center items-center"
            >
              <h3 className="text-2xl font-bold text-blue-700">
                {company}
              </h3>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Recruiters;