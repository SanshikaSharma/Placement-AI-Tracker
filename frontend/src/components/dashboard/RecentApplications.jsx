function RecentApplications({ applications }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-5">
        Recent Applications
      </h2>

      {applications.length === 0 ? (
        <p className="text-gray-500">
          No applications found.
        </p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="py-3">Company</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {applications
              .slice()
              .reverse()
              .slice(0, 5)
              .map((app) => (
                <tr
                  key={app._id}
                  className="border-b"
                >
                  <td className="py-3">
                    {app.company?.companyName}
                  </td>

                  <td>{app.status}</td>

                  <td>
                    {new Date(
                      app.appliedDate
                    ).toLocaleDateString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RecentApplications;