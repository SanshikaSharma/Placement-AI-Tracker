import { useEffect, useState } from "react";

import {
  getCareerAnalytics,
} from "../../services/careerAnalyticsService";


const CareerAnalyticsPage = () => {
  const [user, setUser] = useState(null);

  const [data, setData] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    let cancelled = false;

    const loadAnalytics = async () => {
      try {
        const storedUser =
          sessionStorage.getItem("user");

        if (!storedUser) {
          setError("Please login again.");
          setLoading(false);
          return;
        }

        const currentUser =
          JSON.parse(storedUser);

       const studentId =
  currentUser?._id ||
  currentUser?.id ||
  currentUser?.user?._id;

if (!studentId) {
  console.log(
    "Career Analytics - Stored User:",
    currentUser
  );

  setError("Student information not found.");
  setLoading(false);
  return;
}

        if (!cancelled) {
          setUser(currentUser);
        }

      const res =
  await getCareerAnalytics(studentId);

        if (!cancelled) {
          if (res?.success) {
            setData(res);
          } else {
            setError(
              res?.message ||
                "Unable to load analytics."
            );
          }
        }
      } catch (err) {
        console.error(
          "Career Analytics Error:",
          err
        );

        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              "Unable to load career analytics."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, []);


  if (loading) {
    return (
      <div style={styles.container}>
        <h2>Loading Career Analytics...</h2>
      </div>
    );
  }


  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          {error}
        </div>
      </div>
    );
  }


  if (!data) {
    return (
      <div style={styles.container}>
        <h2>No analytics available.</h2>
      </div>
    );
  }


  const analytics = data.analytics;


  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <div>
          <h1>
            📊 Career Analytics
          </h1>

          <p>
            Track your placement preparation
            and career progress.
          </p>
        </div>

        <div style={styles.studentBox}>
          <strong>
            {data.student?.name ||
              user?.name ||
              "Student"}
          </strong>

          <span>
            {data.student?.branch || ""}
            {" • "}
            Semester{" "}
            {data.student?.semester || ""}
          </span>
        </div>
      </div>


      {/* Career Readiness */}

      <div style={styles.readinessCard}>
        <div>
          <p style={styles.smallTitle}>
            Overall Career Readiness
          </p>

          <h1 style={styles.bigScore}>
            {analytics.careerReadiness}/100
          </h1>

          <p>
            {analytics.careerReadiness >= 80
              ? "Excellent preparation"
              : analytics.careerReadiness >= 60
              ? "Good progress"
              : "Needs improvement"}
          </p>
        </div>

        <div style={styles.progressOuter}>
          <div
            style={{
              ...styles.progressInner,
              width: `${analytics.careerReadiness}%`,
            }}
          />
        </div>
      </div>


      {/* Main Statistics */}

      <div style={styles.grid}>

        <StatCard
          title="Applications"
          value={analytics.totalApplications}
          icon="📨"
        />

        <StatCard
          title="Selected"
          value={analytics.selected}
          icon="🎉"
        />

        <StatCard
          title="Shortlisted"
          value={analytics.shortlisted}
          icon="⭐"
        />

        <StatCard
          title="Interviews"
          value={analytics.totalInterviews}
          icon="🎤"
        />

        <StatCard
          title="Interview Score"
          value={`${analytics.averageInterviewScore}/100`}
          icon="🤖"
        />

        <StatCard
          title="Success Rate"
          value={`${analytics.successRate}%`}
          icon="📈"
        />

        <StatCard
          title="Skills"
          value={analytics.totalSkills}
          icon="💻"
        />

        <StatCard
          title="Resume"
          value={
            analytics.resumeUploaded
              ? "Uploaded"
              : "Missing"
          }
          icon="📄"
        />

      </div>


      {/* Application Status */}

      <section style={styles.card}>
        <h2>
          📌 Application Status
        </h2>

        <div style={styles.statusGrid}>
          {data.applicationStatus.map(
            (item) => (
              <div
                key={item.status}
                style={styles.statusItem}
              >
                <span>
                  {item.status}
                </span>

                <strong>
                  {item.count}
                </strong>
              </div>
            )
          )}
        </div>
      </section>


      {/* Skills */}

      <section style={styles.card}>
        <h2>
          💻 Your Skills
        </h2>

        {data.skills.length === 0 ? (
          <p>
            No skills added yet.
          </p>
        ) : (
          <div style={styles.skills}>
            {data.skills.map(
              (skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  style={styles.skill}
                >
                  {skill}
                </span>
              )
            )}
          </div>
        )}
      </section>


      {/* Scores */}

      <section style={styles.card}>
        <h2>
          🎯 Preparation Scores
        </h2>

        <ScoreRow
          title="Profile Score"
          score={analytics.profileScore}
        />

        <ScoreRow
          title="Skill Score"
          score={analytics.skillScore}
        />

        <ScoreRow
          title="Interview Score"
          score={analytics.averageInterviewScore}
        />

      </section>


      {/* Suggestions */}

      <section style={styles.card}>
        <h2>
          💡 Career Improvement Suggestions
        </h2>

        {data.suggestions.map(
          (suggestion, index) => (
            <div
              key={index}
              style={styles.suggestion}
            >
              <span>💡</span>

              <p>{suggestion}</p>
            </div>
          )
        )}
      </section>

    </div>
  );
};


const StatCard = ({
  title,
  value,
  icon,
}) => {
  return (
    <div style={styles.statCard}>
      <div style={styles.statIcon}>
        {icon}
      </div>

      <div>
        <p style={styles.statTitle}>
          {title}
        </p>

        <h2 style={styles.statValue}>
          {value}
        </h2>
      </div>
    </div>
  );
};


const ScoreRow = ({
  title,
  score,
}) => {
  return (
    <div style={styles.scoreRow}>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <strong>{title}</strong>

        <span>{score}/100</span>
      </div>

      <div style={styles.scoreOuter}>
        <div
          style={{
            ...styles.scoreInner,
            width: `${score}%`,
          }}
        />
      </div>

    </div>
  );
};


const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "30px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "25px",
    flexWrap: "wrap",
  },

  headerTitle: {
    marginBottom: "5px",
  },

  studentBox: {
    padding: "15px 20px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  readinessCard: {
    padding: "25px",
    borderRadius: "16px",
    border: "1px solid #ddd",
    marginBottom: "25px",
  },

  smallTitle: {
    margin: 0,
    color: "#666",
  },

  bigScore: {
    fontSize: "42px",
    margin: "8px 0",
  },

  progressOuter: {
    height: "12px",
    background: "#eee",
    borderRadius: "20px",
    overflow: "hidden",
    marginTop: "20px",
  },

  progressInner: {
    height: "100%",
    background: "#4f46e5",
    borderRadius: "20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginBottom: "25px",
  },

  statCard: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "14px",
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },

  statIcon: {
    fontSize: "30px",
  },

  statTitle: {
    margin: 0,
    color: "#666",
  },

  statValue: {
    margin: "5px 0 0",
  },

  card: {
    padding: "25px",
    border: "1px solid #ddd",
    borderRadius: "14px",
    marginBottom: "20px",
  },

  statusGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "12px",
  },

  statusItem: {
    padding: "15px",
    background: "#f7f7f7",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
  },

  skills: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },

  skill: {
    padding: "8px 14px",
    borderRadius: "20px",
    background: "#eef2ff",
  },

  scoreRow: {
    marginBottom: "20px",
  },

  scoreOuter: {
    height: "10px",
    background: "#eee",
    borderRadius: "10px",
    overflow: "hidden",
    marginTop: "8px",
  },

  scoreInner: {
    height: "100%",
    background: "#4f46e5",
  },

  suggestion: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
    padding: "12px",
    marginBottom: "10px",
    background: "#f8f9ff",
    borderRadius: "10px",
  },

  error: {
    padding: "15px",
    background: "#ffe5e5",
    color: "#b00020",
    borderRadius: "10px",
  },
};


export default CareerAnalyticsPage;