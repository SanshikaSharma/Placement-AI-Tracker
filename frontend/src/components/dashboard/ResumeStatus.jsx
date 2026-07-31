function ResumeStatus({
  uploaded = true,
  analyzed = true,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-5">
        Resume Status
      </h2>

      <div className="space-y-4">

        <div className="flex justify-between">
          <span>Resume Uploaded</span>

          <span className={uploaded ? "text-green-600" : "text-red-600"}>
            {uploaded ? "✔ Uploaded" : "✖ Not Uploaded"}
          </span>
        </div>

        <div className="flex justify-between">
          <span>AI Analysis</span>

          <span className={analyzed ? "text-green-600" : "text-red-600"}>
            {analyzed ? "✔ Completed" : "✖ Pending"}
          </span>
        </div>

      </div>

    </div>
  );
}

export default ResumeStatus;