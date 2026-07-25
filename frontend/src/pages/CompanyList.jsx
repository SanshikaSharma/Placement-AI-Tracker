import { useEffect, useState } from "react";
import axios from "axios";
import AddCompany from "./AddCompany";
import { toast } from "react-toastify";

function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const [editingCompany, setEditingCompany] = useState(null);

const [editForm, setEditForm] = useState({
  companyName: "",
  role: "",
  package: "",
  location: "",
  eligibility: "",
  deadline: "",
  status: "",
});
  // Load Companies
  const fetchCompanies = async () => {
  try {
    setLoading(true);

    const res = await axios.get(
      "http://localhost:5001/api/company/all"
    );

    setCompanies(res.data.companies || []);
  } catch (error) {
    console.error("Error loading companies:", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const load = async () => {
    await fetchCompanies();
  };

  load();
}, []);
// Edit Company
const handleEdit = (company) => {
  setEditingCompany(company._id);

  setEditForm({
    companyName: company.companyName,
    role: company.role,
    package: company.package,
    location: company.location,
    eligibility: company.eligibility,
    deadline: company.deadline
      ? company.deadline.substring(0, 10)
      : "",
    status: company.status,
  });
};
// Update Company
const handleUpdate = async () => {
  try {
    const res = await axios.put(
      `http://localhost:5001/api/company/update/${editingCompany}`,
      editForm
    );

    toast.success(res.data.message);

    setCompanies((prev) =>
      prev.map((company) =>
        company._id === editingCompany
          ? res.data.company
          : company
      )
    );

    setEditingCompany(null);

  } catch (error) {
   toast.error(
  error.response?.data?.message ||
  "Update failed"
);
  }
};
  // Delete Company
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this company?"
    );

    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        `http://localhost:5001/api/company/delete/${id}`
      );

      toast.success(res.data.message);

      // Remove deleted company from UI
      setCompanies((prevCompanies) =>
        prevCompanies.filter(
          (company) => company._id !== id
        )
      );

    } catch (error) {
      toast.error(
  error.response?.data?.message ||
  "Failed to delete company"
);
    }
  };


  if (loading) {
    return <h2>Loading Companies...</h2>;
  }


  return (
    <div className="form-section">
     <AddCompany refreshCompanies={fetchCompanies} />

<hr style={{ margin: "30px 0" }} />

      <h2>Company List</h2>
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
    fontSize: "16px",
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
    fontSize: "16px",
  }}
>
  <option value="All">All Companies</option>
  <option value="Open">Open</option>
  <option value="Closed">Closed</option>
</select>
      {companies.length === 0 ? (
        <p>No companies added yet.</p>

      ) : (

      companies
  .filter((company) =>
    company.companyName
      .toLowerCase()
      .includes(search.toLowerCase())
  )
  .filter((company) =>
    statusFilter === "All"
      ? true
      : company.status === statusFilter
  )
  .map((company) => (

          <div
            key={company._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "15px",
              background: "#fff",
            }}
          >

            <h3>{company.companyName}</h3>

            <p>
              <strong>Role:</strong> {company.role}
            </p>

            <p>
              <strong>Package:</strong> {company.package}
            </p>

            <p>
              <strong>Location:</strong> {company.location}
            </p>

            <p>
              <strong>Eligibility:</strong>{" "}
              {company.eligibility}
            </p>

            <p>
              <strong>Deadline:</strong>{" "}
              {company.deadline
                ? new Date(company.deadline).toLocaleDateString()
                : "N/A"}
            </p>

            <p>
              <strong>Status:</strong> {company.status}
            </p>

<button
  onClick={() => handleEdit(company)}
  style={{
    background: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
    marginRight: "10px",
  }}
>
  Edit
</button>
            <button
              onClick={() => handleDelete(company._id)}
              style={{
                background: "red",
                color: "white",
                border: "none",
                padding: "10px 18px",
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
{editingCompany && (
  <div
   style={{
  position: "fixed",
  top: "5%",
  left: "50%",
  transform: "translateX(-50%)",
  background: "#fff",
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  width: "450px",
  maxHeight: "90vh",
  overflowY: "auto",
  zIndex: 1000,
  boxShadow: "0 0 10px rgba(0,0,0,0.3)",
}}
  >
    <h2>Edit Company</h2>

    <input
      type="text"
      placeholder="Company Name"
      value={editForm.companyName}
      onChange={(e) =>
        setEditForm({
          ...editForm,
          companyName: e.target.value,
        })
      }
    />

    <br /><br />

    <input
      type="text"
      placeholder="Role"
      value={editForm.role}
      onChange={(e) =>
        setEditForm({
          ...editForm,
          role: e.target.value,
        })
      }
    />

    <br /><br />

    <input
      type="text"
      placeholder="Package"
      value={editForm.package}
      onChange={(e) =>
        setEditForm({
          ...editForm,
          package: e.target.value,
        })
      }
    />
    <br /><br />

<input
  type="text"
  placeholder="Location"
  value={editForm.location}
  onChange={(e) =>
    setEditForm({
      ...editForm,
      location: e.target.value,
    })
  }
/>
<br /><br />

<input
  type="text"
  placeholder="Eligibility"
  value={editForm.eligibility}
  onChange={(e) =>
    setEditForm({
      ...editForm,
      eligibility: e.target.value,
    })
  }
/>
    <br /><br />

<input
  type="date"
  value={editForm.deadline}
  onChange={(e) =>
    setEditForm({
      ...editForm,
      deadline: e.target.value,
    })
  }
/>
<br /><br />

<select
  value={editForm.status}
  onChange={(e) =>
    setEditForm({
      ...editForm,
      status: e.target.value,
    })
  }
>
  <option value="Open">Open</option>
  <option value="Closed">Closed</option>
</select>

    <button onClick={handleUpdate}>
      Update
    </button>

    <button
      onClick={() => setEditingCompany(null)}
      style={{ marginLeft: "10px" }}
    >
      Cancel
    </button>
  </div>
)}
    </div>
  );
}

export default CompanyList;