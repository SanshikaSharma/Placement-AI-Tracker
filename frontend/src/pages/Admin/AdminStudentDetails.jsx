import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

function AdminStudentDetails() {
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchStudent = async () => {
      try {
        const response = await api.get(
          `/admin/student/${id}`
        );

        if (!response.data.success) {
          throw new Error(
            response.data.message ||
              "Unable to load student"
          );
        }

        if (mounted) {
          setStudent(response.data.student);
        }
      } catch (err) {
        console.error(
          "Student Details Error:",
          err
        );

        if (mounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load student details"
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchStudent();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-2xl shadow p-10 text-center">
          <h1 className="text-2xl font-bold">
            Loading Student Details...
          </h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Link
          to="/admin/students"
          className="inline-block mb-6 bg-gray-800 hover:bg-gray-900 text-white px-5 py-3 rounded-xl"
        >
          ← Back to Students
        </Link>

        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-2">
            Unable to Load Student
          </h2>

          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return null;
  }

  const skills = Array.isArray(student.skills)
    ? student.skills
    : [];

  const projects = Array.isArray(student.projects)
    ? student.projects
    : [];

  const certifications = Array.isArray(
    student.certifications
  )
    ? student.certifications
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Student Details
          </h1>

          <p className="text-gray-500 mt-2">
            Complete student profile information.
          </p>
        </div>

        <Link
          to="/admin/students"
          className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-3 rounded-xl font-semibold transition"
        >
          ← Back to Students
        </Link>

      </div>

      {/* PROFILE HEADER */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">

          <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">

            {student.profileImage ? (
              <img
                src={student.profileImage}
                alt={student.name || "Student"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-blue-600">
                {student.name
                  ? student.name
                      .charAt(0)
                      .toUpperCase()
                  : "S"}
              </span>
            )}

          </div>

          <div className="text-center md:text-left">

            <h2 className="text-3xl font-bold text-gray-800">
              {student.name || "-"}
            </h2>

            <p className="text-gray-500 mt-1">
              Student ID:{" "}
              {student.studentId || "-"}
            </p>

            <div className="mt-4">

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  student.placementStatus ===
                  "Placed"
                    ? "bg-green-100 text-green-700"
                    : student.placementStatus ===
                      "Selected"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {student.placementStatus ||
                  "Preparing"}
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* BASIC INFORMATION */}
      <Section title="Basic Information">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <InfoItem
            label="Full Name"
            value={student.name}
          />

          <InfoItem
            label="Student ID"
            value={student.studentId}
          />

          <InfoItem
            label="Email"
            value={student.email}
          />

          <InfoItem
            label="Phone"
            value={student.phone}
          />

          <InfoItem
            label="College"
            value={student.college}
          />

          <InfoItem
            label="Branch"
            value={student.branch}
          />

          <InfoItem
            label="Semester"
            value={student.semester}
          />

          <InfoItem
            label="CGPA"
            value={student.cgpa}
          />

          <InfoItem
            label="Gender"
            value={student.gender}
          />

          <InfoItem
            label="Date of Birth"
            value={student.dob}
          />

          <InfoItem
            label="Placement Status"
            value={
              student.placementStatus
            }
          />

          <InfoItem
            label="Address"
            value={student.address}
          />

        </div>

      </Section>

      {/* SKILLS */}
      <Section title="Skills">

        {skills.length === 0 ? (
          <p className="text-gray-500">
            No skills added.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">

            {skills.map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium"
              >
                {typeof skill === "object"
                  ? skill.name || "Skill"
                  : skill}
              </span>
            ))}

          </div>
        )}

      </Section>

      {/* PROJECTS */}
      <Section title="Projects">

        {projects.length === 0 ? (
          <p className="text-gray-500">
            No projects added.
          </p>
        ) : (
          <div className="space-y-3">

            {projects.map((project, index) => (
              <div
                key={index}
                className="border rounded-xl p-4 bg-gray-50"
              >
                <p className="font-semibold text-gray-800">
                  {typeof project === "object"
                    ? project.title ||
                      project.name ||
                      "Project"
                    : project}
                </p>

                {typeof project ===
                  "object" &&
                  project.description && (
                    <p className="text-gray-500 mt-1">
                      {project.description}
                    </p>
                  )}
              </div>
            ))}

          </div>
        )}

      </Section>

      {/* CERTIFICATIONS */}
      <Section title="Certifications">

        {certifications.length === 0 ? (
          <p className="text-gray-500">
            No certifications added.
          </p>
        ) : (
          <div className="space-y-3">

            {certifications.map(
              (certificate, index) => (
                <div
                  key={index}
                  className="border rounded-xl p-4 bg-gray-50"
                >
                  <p className="font-semibold text-gray-800">
                    {typeof certificate ===
                    "object"
                      ? certificate.name ||
                        certificate.title ||
                        "Certification"
                      : certificate}
                  </p>
                </div>
              )
            )}

          </div>
        )}

      </Section>

      {/* SOCIAL PROFILES */}
      <Section title="Social Profiles">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <InfoItem
            label="LinkedIn"
            value={student.linkedin}
          />

          <InfoItem
            label="GitHub"
            value={student.github}
          />

        </div>

      </Section>

   {/* RESUME */}
<Section title="Resume">

  {student.resume ? (
    <div className="border rounded-xl p-5 bg-gray-50">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <p className="font-semibold text-gray-800">
            {student.resume.originalName ||
              student.resume.fileName ||
              "Resume"}
          </p>

          {student.resume.uploadedAt && (
            <p className="text-sm text-gray-500 mt-1">
              Uploaded:{" "}
              {new Date(
                student.resume.uploadedAt
              ).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="flex gap-3">

          <a
            href={`http://localhost:5001/api/admin/student/${student._id}/resume`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition"
          >
            👁 View Resume
          </a>

          <a
            href={`http://localhost:5001/api/admin/student/${student._id}/resume`}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold transition"
          >
            ⬇ Download
          </a>

        </div>

      </div>

    </div>
  ) : (
    <p className="text-gray-500">
      No resume uploaded.
    </p>
  )}

</Section>

    </div>
  );
}

// ======================================================
// SECTION COMPONENT
// ======================================================

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {title}
      </h2>

      {children}

    </div>
  );
}

// ======================================================
// INFO COMPONENT
// ======================================================

function InfoItem({ label, value }) {
  const hasValue =
    value !== undefined &&
    value !== null &&
    String(value).trim() !== "";

  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">
        {label}
      </p>

      <p className="font-semibold text-gray-800 wrap-break-word">
        {hasValue ? String(value) : "-"}
      </p>
    </div>
  );
}

export default AdminStudentDetails;