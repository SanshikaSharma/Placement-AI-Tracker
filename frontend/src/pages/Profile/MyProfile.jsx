import { useEffect, useState } from "react";
import { getProfile } from "../../services/profileService";

function MyProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Declare function BEFORE useEffect
  const fetchProfile = async (id) => {
    try {
      const response = await getProfile(id);

      if (response.success) {
        setUser(response.user);
      }
    } catch (error) {
      console.error("Profile Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(storedUser);

        if (!parsedUser?.id) {
          setLoading(false);
          return;
        }

        await fetchProfile(parsedUser.id);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-xl">
        Loading Profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-red-600 text-xl">
        User not found
      </div>
    );
  }

  return (
    <div className="p-8">

      <div className="bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-8">
          My Profile
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <h3 className="font-semibold">Name</h3>
            <p>{user.name}</p>
          </div>

          <div>
            <h3 className="font-semibold">Student ID</h3>
            <p>{user.studentId}</p>
          </div>

          <div>
            <h3 className="font-semibold">Email</h3>
            <p>{user.email}</p>
          </div>

          <div>
            <h3 className="font-semibold">College</h3>
            <p>{user.college}</p>
          </div>

          <div>
            <h3 className="font-semibold">Branch</h3>
            <p>{user.branch}</p>
          </div>

          <div>
            <h3 className="font-semibold">Semester</h3>
            <p>{user.semester}</p>
          </div>

          <div>
            <h3 className="font-semibold">CGPA</h3>
            <p>{user.cgpa}</p>
          </div>

          <div>
            <h3 className="font-semibold">Phone</h3>
            <p>{user.phone || "-"}</p>
          </div>

          <div>
            <h3 className="font-semibold">Placement Status</h3>
            <p>{user.placementStatus}</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default MyProfile;