import { useEffect, useState } from "react";
import axios from "axios";

function PlacementDashboard() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadPlacements = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/placement/all"
        );

        if (!ignore && res.data.success) {
          setPlacements(res.data.placements);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadPlacements();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Placement Dashboard</h1>

      {placements.length === 0 ? (
        <h3>No Placements Found</h3>
      ) : (
        placements.map((placement) => (
          <div
            key={placement._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
            }}
          >
            <h2>{placement.company}</h2>

            <p>
              <strong>Role:</strong> {placement.role}
            </p>

            <p>
              <strong>Status:</strong> {placement.status}
            </p>

            <p>
              <strong>Applied On:</strong>{" "}
              {new Date(
                placement.dateApplied
              ).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default PlacementDashboard;