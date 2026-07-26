function UpcomingDeadlines({ companies = [] }) {
  const upcoming = companies
    .filter((company) => company.deadline)
    .sort(
      (a, b) => new Date(a.deadline) - new Date(b.deadline)
    )
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">
        Upcoming Deadlines
      </h2>

      {upcoming.length === 0 ? (
        <p className="text-gray-500">
          No upcoming deadlines.
        </p>
      ) : (
        upcoming.map((company) => (
          <div
            key={company._id}
            className="flex justify-between border-b py-3"
          >
            <div>
              <h3 className="font-semibold">
                {company.companyName}
              </h3>

              <p className="text-gray-500 text-sm">
                {company.role}
              </p>
            </div>

            <span className="text-red-500">
              {new Date(company.deadline).toLocaleDateString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default UpcomingDeadlines;