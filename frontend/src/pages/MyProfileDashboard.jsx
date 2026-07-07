import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MyProfileDashboard() {
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState("");

  const [editData, setEditData] = useState({
    name: "",
    email: "",
  });

  // Fetch Profiles
  useEffect(() => {
    const token = localStorage.getItem("token");

if (!token) {
  navigate("/login");
  return;
}
    let mounted = true;

    const fetchProfiles = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/profile/all"
        );

        if (
          mounted &&
          res?.data?.success &&
          Array.isArray(res.data.profiles)
        ) {
          setProfiles(res.data.profiles);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProfiles();

    return () => {
      mounted = false;
    };

 }, [navigate]);

  // Open Edit Popup
  const openEdit = (profile) => {
    setEditId(profile._id);

    setEditData({
      name: profile.name || "",
      email: profile.email || "",
    });

    setShowEdit(true);
  };

  // Update Profile
  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5001/api/profile/update/${editId}`,
        editData
      );

      if (res.data.success) {
        setProfiles((prev) =>
          prev.map((p) =>
            p._id === editId
              ? res.data.profile
              : p
          )
        );

        setShowEdit(false);
        setEditId("");

        setEditData({
          name: "",
          email: "",
        });

        alert("Profile Updated Successfully");
      }
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  // Delete Profile
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:5001/api/profile/delete/${id}`
      );

      if (res.data.success) {
        setProfiles((prev) =>
          prev.filter((p) => p._id !== id)
        );
      }
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };
const filteredProfiles = profiles.filter((profile) =>
  profile.name
    ?.toLowerCase()
    .includes(search.toLowerCase())
);
  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <button
  onClick={() => {
    localStorage.removeItem("token");
    navigate("/login");
  }}
  style={{
    float: "right",
    padding: "10px",
  }}
>
  Logout
</button>
      <h1>My Profile Dashboard</h1>
      <input
  type="text"
  placeholder="Search Profile..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    width: "300px",
    padding: "10px",
    marginBottom: "20px",
    marginLeft: "10px",
  }}
/>

      <button
        onClick={() => navigate("/")}
        style={{
          marginBottom: "20px",
          padding: "8px 15px",
        }}
      >
        Add New Profile
      </button>

      {filteredProfiles.length === 0 ? (
        <h3>No Profiles Found</h3>
      ) : (
     filteredProfiles.map((profile) => (
          <div
            key={profile._id}
            style={{
              border: "1px solid gray",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "10px",
            }}
          >
            <h3>{profile.name}</h3>

            <p>{profile.email}</p>

            <button
              onClick={() => openEdit(profile)}
              style={{
                marginRight: "10px",
              }}
            >
              <button
  onClick={() =>
    navigate(`/profile/${profile._id}`)
  }
  style={{
    marginRight: "10px",
  }}
>
  View
</button>
              Edit
            </button>

            <button
              onClick={() =>
                handleDelete(profile._id)
              }
            >
              Delete
            </button>
          </div>
        ))
      )}

      {/* Edit Popup */}
      {showEdit && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "350px",
            }}
          >
            <h2>Edit Profile</h2>

            <input
              type="text"
              placeholder="Name"
              value={editData.name}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  name: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
              }}
            />

            <input
              type="email"
              placeholder="Email"
              value={editData.email}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  email: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "20px",
              }}
            />

            <button
              onClick={handleUpdate}
              style={{
                marginRight: "10px",
              }}
            >
              Update
            </button>

            <button
              onClick={() =>
                setShowEdit(false)
              }
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyProfileDashboard;