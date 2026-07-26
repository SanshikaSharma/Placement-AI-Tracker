function UpcomingDeadlines({ companies }) {
  const upcoming = [...companies]
    .filter((company) => company.deadline)
    .sort(
      (a, b) =>
        new Date(a.deadline) - new Date(b.deadline)
    )
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-5">
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

              <p className="text-sm text-gray-500">
                {company.role}
              </p>
            </div>

            <div className="text-red-600 font-medium">
              {new Date(
                company.deadline
              ).toLocaleDateString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default UpcomingDeadlines;