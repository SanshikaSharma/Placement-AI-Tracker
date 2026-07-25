import { useEffect, useState } from "react";
import axios from "axios";

function ApplicationTracker() {
  const [companies, setCompanies] = useState([]);
 const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
const [editingApplication, setEditingApplication] = useState(null);

const [editForm, setEditForm] = useState({
  status: "",
  notes: "",
});
  const [formData, setFormData] = useState({
    company: "",
    status: "Applied",
    notes: "",
  });

  // Load Companies
  const loadCompanies = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5001/api/company/all"
      );

      setCompanies(res.data.companies || []);
    } catch (error) {
      console.log(error);
    }
  };

  // Load Applications
  const loadApplications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5001/api/application/all"
      );

      setApplications(res.data.applications || []);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdate = async () => {
  try {
    const res = await axios.put(
      `http://localhost:5001/api/application/update/${editingApplication._id}`,
      editForm
    );

    alert(res.data.message);

    setEditingApplication(null);

    await loadApplications();

  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Failed to update application"
    );
  }
};
const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this application?"
  );

  if (!confirmDelete) return;

  try {
    const res = await axios.delete(
      `http://localhost:5001/api/application/delete/${id}`
    );

    alert(res.data.message);

    await loadApplications();
  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Delete failed"
    );
  }
};
  // Add Application
  const handleSubmit = async () => {
    if (!formData.company) {
      alert("Please select a company");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5001/api/application/add",
        formData
      );

      alert(res.data.message);

      setFormData({
        company: "",
        status: "Applied",
        notes: "",
      });

      await loadApplications();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to add application"
      );
    }
  };

  // Load data when page opens
  useEffect(() => {
    const fetchData = async () => {
      await loadCompanies();
      await loadApplications();
    };

    fetchData();
  }, []);

  return (
    <div className="form-section">
      <h2>Application Tracker</h2>

      <select
        value={formData.company}
        onChange={(e) =>
          setFormData({
            ...formData,
            company: e.target.value,
          })
        }
      >
        <option value="">Select Company</option>

        {companies.map((company) => (
          <option
            key={company._id}
            value={company._id}
          >
            {company.companyName}
          </option>
        ))}
      </select>

      <br />
      <br />

      <select
        value={formData.status}
        onChange={(e) =>
          setFormData({
            ...formData,
            status: e.target.value,
          })
        }
      >
        <option value="Applied">Applied</option>
        <option value="OA">OA</option>
        <option value="Interview">Interview</option>
        <option value="Selected">Selected</option>
        <option value="Rejected">Rejected</option>
      </select>

      <br />
      <br />

      <textarea
        placeholder="Notes"
        rows="4"
        cols="40"
        value={formData.notes}
        onChange={(e) =>
          setFormData({
            ...formData,
            notes: e.target.value,
          })
        }
      />

      <br />
      <br />

      <button onClick={handleSubmit}>
        Add Application
      </button>

      <hr style={{ margin: "30px 0" }} />

      <h3>Application List</h3>
      <input
  type="text"
  placeholder="🔍 Search Company..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  }}
/>
<select
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
  style={{
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  }}
>
  <option value="All">All Status</option>
  <option value="Applied">Applied</option>
  <option value="OA">OA</option>
  <option value="Interview">Interview</option>
  <option value="Selected">Selected</option>
  <option value="Rejected">Rejected</option>
</select>
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
       applications
  .filter((application) =>
    application.company?.companyName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  )
  .filter((application) =>
    statusFilter === "All"
      ? true
      : application.status === statusFilter
  )
  .map((application) => (
          <div
            key={application._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "15px",
              background: "#fff",
            }}
          >
            <h4>
              {application.company?.companyName ||
                "Company"}
            </h4>

            <p>
              <strong>Status:</strong>{" "}
              {application.status}
            </p>

            <p>
              <strong>Notes:</strong>{" "}
              {application.notes}
            </p>

            <p>
              <strong>Applied Date:</strong>{" "}
              {new Date(
                application.appliedDate
              ).toLocaleDateString()}
            </p>
           <button
  onClick={() => {
    setEditingApplication(application);

    setEditForm({
      status: application.status,
      notes: application.notes,
    });
  }}
  style={{
    background: "green",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  }}
>
  Edit
</button>
            <button
  onClick={() => handleDelete(application._id)}
  style={{
    background: "red",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  }}
>
  Delete
</button>
          </div>
        ))
      )}
      {editingApplication && (
  <div
    style={{
      position: "fixed",
      top: "5%",
      left: "50%",
      transform: "translateX(-50%)",
      background: "#fff",
      padding: "20px",
      width: "400px",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0,0,0,0.3)",
      zIndex: 1000,
      maxHeight: "90vh",
      overflowY: "auto",
    }}
  >
    <h2>Edit Application</h2>

    <select
      value={editForm.status}
      onChange={(e) =>
        setEditForm({
          ...editForm,
          status: e.target.value,
        })
      }
    >
      <option value="Applied">Applied</option>
      <option value="OA">OA</option>
      <option value="Interview">Interview</option>
      <option value="Selected">Selected</option>
      <option value="Rejected">Rejected</option>
    </select>

    <br />
    <br />

    <textarea
      rows="4"
      cols="35"
      value={editForm.notes}
      onChange={(e) =>
        setEditForm({
          ...editForm,
          notes: e.target.value,
        })
      }
    />

    <br />
    <br />

    <button onClick={handleUpdate}>
      Update
    </button>

    <button
      onClick={() => setEditingApplication(null)}
      style={{ marginLeft: "10px" }}
    >
      Cancel
    </button>
  </div>
)}
    </div>
  );
}

export default ApplicationTracker;