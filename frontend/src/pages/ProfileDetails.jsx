import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ProfileDetails() {
  const { id } = useParams();
 const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/profile/${id}`
        );

        if (res.data.success) {
          setProfile(res.data.profile);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!profile) {
    return <h2>Profile Not Found</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1><button
  onClick={() => navigate("/dashboard")}
  style={{
    marginBottom: "20px",
    padding: "8px 15px",
  }}
>
  Back to Dashboard
</button></h1>

      <h3>Name:</h3>
<p>{profile.name || "N/A"}</p>

<h3>Email:</h3>
<p>{profile.email || "N/A"}</p>

<h3>College:</h3>
<p>{profile.college || "N/A"}</p>

<h3>Branch:</h3>
<p>{profile.branch || "N/A"}</p>

<h3>Semester:</h3>
<p>{profile.semester || "N/A"}</p>

<h3>Skills:</h3>
<p>
  {profile.skills?.length
    ? profile.skills.join(", ")
    : "N/A"}
</p>

<h3>Projects:</h3>
<p>
  {profile.projects?.length
    ? profile.projects.join(", ")
    : "N/A"}
</p>

<h3>Placement Status:</h3>
<p>
  {profile.placementStatus || "N/A"}
</p>

<h3>Profile ID:</h3>
<p>{profile._id}</p>
    </div>
  );
}

export default ProfileDetails;