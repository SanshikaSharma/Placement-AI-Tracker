import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import "../styles/Dashboard.css";
import "../styles/DashboardCards.css";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PlacementChart from "../components/PlacementChart";
import ResumeUpload from "../components/ResumeUpload";
import ResumeAnalysis from "../components/ResumeAnalysis";
import AddPlacementForm from "../components/AddPlacementForm";
import PlacementTable from "../components/PlacementTable";


function PlacementDashboard() {
  // Placement Data
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Placement
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");

const [interviewDate, setInterviewDate] = useState("");
const [interviewRound, setInterviewRound] = useState("");
const [notes, setNotes] = useState("");
  // Search / Filter / Sort
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const placementsPerPage = 5;

  // Edit Placement
  const [editingId, setEditingId] = useState(null);
  const [editingCompany, setEditingCompany] = useState("");
  const [editingRole, setEditingRole] = useState("");
  const [editingStatus, setEditingStatus] = useState("Applied");

  // Load Placements
useEffect(() => {
  const loadPlacements = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5001/api/placement/all"
      );

      if (res.data.success) {
        setPlacements(res.data.placements);
      }
    } catch (error) {
      console.error("Error loading placements:", error);
    } finally {
      setLoading(false);
    }
  };

  loadPlacements();
}, []);
 
   
    // Add Placement
  const handleAddPlacement = async () => {
    if (!company.trim() || !role.trim()) {
     toast.warning("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5001/api/placement/create",
        {
  company,
  role,
  status,
  interviewDate,
  interviewRound,
  notes,
}
      );

      if (res.data.success) {
        setPlacements((prev) => [...prev, res.data.placement]);

        setCompany("");
        setRole("");
        setStatus("Applied");

        setInterviewDate("");
setInterviewRound("");
setNotes("");

        toast.success("Placement Added Successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add placement");
    }
  };

  // Delete Placement
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this placement?")) return;

    try {
      const res = await axios.delete(
        `http://localhost:5001/api/placement/delete/${id}`
      );

      if (res.data.success) {
        setPlacements((prev) =>
          prev.filter((item) => item._id !== id)
        );

       toast.success("Placement Deleted Successfully");
      }
    } catch (error) {
      console.error(error);
     toast.error("Delete Failed");
    }
  };

  // Edit Placement
  const handleEdit = (placement) => {
    setEditingId(placement._id);
    setEditingCompany(placement.company);
    setEditingRole(placement.role);
    setEditingStatus(placement.status);
  };

  // Update Placement
  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5001/api/placement/update/${editingId}`,
        {
          company: editingCompany,
          role: editingRole,
          status: editingStatus,
        }
      );

      if (res.data.success) {
        setPlacements((prev) =>
          prev.map((item) =>
            item._id === editingId
              ? res.data.placement
              : item
          )
        );

        setEditingId(null);

       toast.success("Placement Updated Successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Update Failed");
    }
  };

  // Search + Filter + Sort
  const filteredPlacements = placements
    .filter((placement) => {
      const matchesSearch =
        placement.company
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        placement.role
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        placement.status === filter;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortOrder === "Newest") {
        return (
          new Date(b.dateApplied) -
          new Date(a.dateApplied)
        );
      }

      return (
        new Date(a.dateApplied) -
        new Date(b.dateApplied)
      );
    });

  // Pagination
  const indexOfLastPlacement =
    currentPage * placementsPerPage;

  const indexOfFirstPlacement =
    indexOfLastPlacement - placementsPerPage;

  const currentPlacements =
    filteredPlacements.slice(
      indexOfFirstPlacement,
      indexOfLastPlacement
    );

  const totalPages = Math.ceil(
    filteredPlacements.length /
      placementsPerPage
  );

  if (loading) {
    return <h2>Loading...</h2>;
  }
    return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f5f7fb",
      }}
    >
      <Sidebar />

      <div
        className="dashboard-container"
        style={{
          flex: 1,
          padding: "20px 30px",
          overflowY: "auto",
        }}
      >
        <Navbar />

        <h1 className="dashboard-title">
          🚀 Placement AI Tracker
        </h1>

        <PlacementChart placements={placements} />

        <br />

        <ResumeUpload />
        <ResumeAnalysis />

        <hr />
<AddPlacementForm
  company={company}
  setCompany={setCompany}
  role={role}
  setRole={setRole}
  status={status}
  setStatus={setStatus}
  interviewDate={interviewDate}
  setInterviewDate={setInterviewDate}
  interviewRound={interviewRound}
  setInterviewRound={setInterviewRound}
  notes={notes}
  setNotes={setNotes}
  handleAddPlacement={handleAddPlacement}
/>
        <hr />

        <div
          style={{
            display: "flex",
            gap: "15px",
            marginBottom: "20px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="🔍 Search Company or Role"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={{
              flex: 1,
              minWidth: "250px",
              padding: "10px",
              borderRadius: "8px",
            }}
          />

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >
            <option value="All">All</option>
            <option value="Applied">Applied</option>
            <option value="OA">OA</option>
            <option value="Interview">Interview</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value)
            }
          >
            <option value="Newest">
              Newest First
            </option>
            <option value="Oldest">
              Oldest First
            </option>
          </select>
        </div>

        <hr />

        <h2>Placement Statistics</h2>

        <div className="stats-container">

          <div className="stat-card">
            <h3>Total</h3>
            <h2>{placements.length}</h2>
          </div>

          <div className="stat-card">
            <h3>Applied</h3>
            <h2>
              {
                placements.filter(
                  (p) =>
                    p.status === "Applied"
                ).length
              }
            </h2>
          </div>

          <div className="stat-card">
            <h3>OA</h3>
            <h2>
              {
                placements.filter(
                  (p) => p.status === "OA"
                ).length
              }
            </h2>
          </div>

          <div className="stat-card">
            <h3>Interview</h3>
            <h2>
              {
                placements.filter(
                  (p) =>
                    p.status ===
                    "Interview"
                ).length
              }
            </h2>
          </div>

          <div className="stat-card">
            <h3>Selected</h3>
            <h2>
              {
                placements.filter(
                  (p) =>
                    p.status ===
                    "Selected"
                ).length
              }
            </h2>
          </div>

          <div className="stat-card">
            <h3>Rejected</h3>
            <h2>
              {
                placements.filter(
                  (p) =>
                    p.status ===
                    "Rejected"
                ).length
              }
            </h2>
          </div>

        </div>

        <hr />

        <h2>All Placements</h2>
        <PlacementTable
  currentPlacements={currentPlacements}
  filteredPlacements={filteredPlacements}
  editingId={editingId}
  editingCompany={editingCompany}
  setEditingCompany={setEditingCompany}
  editingRole={editingRole}
  setEditingRole={setEditingRole}
  editingStatus={editingStatus}
  setEditingStatus={setEditingStatus}
  handleUpdate={handleUpdate}
  handleEdit={handleEdit}
  handleDelete={handleDelete}
  setEditingId={setEditingId}
/>

<div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
    marginTop: "25px",
  }}
>
  <button
    className="update-btn"
    onClick={() =>
      setCurrentPage((prev) => prev - 1)
    }
    disabled={currentPage === 1}
  >
    ◀ Previous
  </button>

  <span
    style={{
      fontWeight: "bold",
      fontSize: "16px",
    }}
  >
    Page {currentPage} of {totalPages}
  </span>

  <button
    className="update-btn"
    onClick={() =>
      setCurrentPage((prev) => prev + 1)
    }
    disabled={currentPage === totalPages}
  >
    Next ▶
  </button>
</div>

      </div>
    </div>
  );
}

export default PlacementDashboard;