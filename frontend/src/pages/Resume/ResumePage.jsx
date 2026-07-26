import ResumeUpload from "../../components/profile/ResumeUpload";

function ResumePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Resume Management
      </h1>

      <ResumeUpload />
    </div>
  );
}

export default ResumePage;