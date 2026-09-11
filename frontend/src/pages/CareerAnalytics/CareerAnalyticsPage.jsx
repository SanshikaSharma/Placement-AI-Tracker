import { useEffect, useState } from "react";

import {
  getCareerAnalytics,
} from "../../services/careerAnalyticsService";

/* =========================================================
   GET STORED USER
========================================================= */

const getStoredUser = () => {
  const storedUser =
    sessionStorage.getItem("user") ||
    localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    const parsedUser =
      JSON.parse(storedUser);

    if (parsedUser?.user) {
      return parsedUser.user;
    }

    return parsedUser;
  } catch (error) {
    console.error(
      "User parsing error:",
      error
    );

    return null;
  }
};

/* =========================================================
   GET STUDENT ID
========================================================= */

const getStudentId = () => {
  const user = getStoredUser();

  if (!user) {
    return null;
  }

  return (
    user?._id ||
    user?.id ||
    user?.userId ||
    user?.studentId ||
    user?.user?._id ||
    user?.user?.id ||
    user?.student?._id ||
    user?.student?.id ||
    null
  );
};

/* =========================================================
   SAFE SCORE
========================================================= */

const safeScore = (value) => {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(0, number)
  );
};

/* =========================================================
   SCORE COLOR
========================================================= */

const getScoreColor = (score) => {
  const value = safeScore(score);

  if (value >= 80) {
    return "#16a34a";
  }

  if (value >= 60) {
    return "#2563eb";
  }

  if (value >= 40) {
    return "#f59e0b";
  }

  return "#ef4444";
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const CareerAnalyticsPage = () => {
  const [user, setUser] =
    useState(() => getStoredUser());

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     LOAD ANALYTICS
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadAnalytics = async () => {
      try {
        const currentUser =
          getStoredUser();

        if (!currentUser) {
          if (!cancelled) {
            setError(
              "Please login again."
            );
            setLoading(false);
          }

          return;
        }

        const studentId =
          getStudentId();

        if (!studentId) {
          if (!cancelled) {
            setUser(currentUser);

            setError(
              "Student information not found. Please logout and login again."
            );

            setLoading(false);
          }

          return;
        }

        if (!cancelled) {
          setUser(currentUser);
        }

        const res =
          await getCareerAnalytics(
            studentId
          );

        if (cancelled) {
          return;
        }

        if (res?.success) {
          setData(res);
          setError("");
        } else {
          setError(
            res?.message ||
              "Unable to load career analytics."
          );
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

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingIcon}>
            📊
          </div>

          <h2>
            Loading Career Analytics
          </h2>

          <p>
            Preparing your placement
            performance report...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.errorCard}>
            <div style={styles.errorIcon}>
              ⚠️
            </div>

            <h2>
              Unable to Load Analytics
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              style={styles.retryButton}
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.emptyCard}>
            <div style={styles.emptyIcon}>
              📊
            </div>

            <h2>
              No Analytics Available
            </h2>

            <p>
              Complete your profile and
              start applying to companies
              to generate analytics.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const analytics =
    data.analytics || {};

  const applicationStatus =
    Array.isArray(
      data.applicationStatus
    )
      ? data.applicationStatus
      : [];

  const skills =
    Array.isArray(data.skills)
      ? data.skills
      : [];

  const suggestions =
    Array.isArray(data.suggestions)
      ? data.suggestions
      : [];

  const careerReadiness =
    safeScore(
      analytics.careerReadiness
    );

  const profileScore =
    safeScore(
      analytics.profileScore
    );

  const skillScore =
    safeScore(
      analytics.skillScore
    );

  const interviewScore =
    safeScore(
      analytics.averageInterviewScore
    );

  const successRate =
    safeScore(
      analytics.successRate
    );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* ================= HEADER ================= */}

        <div style={styles.header}>

          <div>
            <div style={styles.titleRow}>

              <div style={styles.mainIcon}>
                📊
              </div>

              <div>
                <span style={styles.pageBadge}>
                  STUDENT PERFORMANCE
                </span>

                <h1 style={styles.title}>
                  Career Analytics
                </h1>

                <p style={styles.subtitle}>
                  Track your placement preparation,
                  application performance and career
                  readiness.
                </p>
              </div>

            </div>
          </div>

          <div style={styles.studentBox}>

            <div style={styles.studentAvatar}>
              {(
                data.student?.name ||
                user?.name ||
                "S"
              )
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <span
                style={
                  styles.studentLabel
                }
              >
                Student
              </span>

              <strong
                style={
                  styles.studentName
                }
              >
                {data.student?.name ||
                  user?.name ||
                  "Student"}
              </strong>

              <span
                style={
                  styles.studentDetails
                }
              >
                {data.student?.branch ||
                  "CSE"}
                {" • "}
                Semester{" "}
                {data.student?.semester ||
                  "—"}
              </span>
            </div>

          </div>

        </div>

        {/* ================= READINESS ================= */}

        <section style={styles.readinessCard}>

          <div style={styles.readinessContent}>

            <div>
              <span
                style={
                  styles.sectionBadge
                }
              >
                🚀 OVERALL PERFORMANCE
              </span>

              <h2
                style={
                  styles.readinessTitle
                }
              >
                Career Readiness
              </h2>

              <p
                style={
                  styles.readinessDescription
                }
              >
                Your overall preparation score
                based on your profile, skills,
                applications and interview
                performance.
              </p>
            </div>

            <div
              style={{
                ...styles.readinessScore,
                color:
                  getScoreColor(
                    careerReadiness
                  ),
              }}
            >
              {careerReadiness}
              <span>
                /100
              </span>
            </div>

          </div>

          <div
            style={
              styles.readinessProgressOuter
            }
          >
            <div
              style={{
                ...styles.readinessProgressInner,
                width: `${careerReadiness}%`,
                background:
                  getScoreColor(
                    careerReadiness
                  ),
              }}
            />
          </div>

          <div
            style={
              styles.readinessBottom
            }
          >
            <span>
              0
            </span>

            <strong>
              {careerReadiness >= 80
                ? "Excellent preparation 🎉"
                : careerReadiness >= 60
                ? "Good progress 👍"
                : careerReadiness >= 40
                ? "Keep improving 💪"
                : "Needs improvement 🚀"}
            </strong>

            <span>
              100
            </span>
          </div>

        </section>

        {/* ================= STATISTICS ================= */}

        <div style={styles.grid}>

          <StatCard
            title="Applications"
            value={
              analytics.totalApplications ||
              0
            }
            icon="📨"
            background="#eef2ff"
          />

          <StatCard
            title="Selected"
            value={
              analytics.selected ||
              0
            }
            icon="🎉"
            background="#ecfdf5"
          />

          <StatCard
            title="Shortlisted"
            value={
              analytics.shortlisted ||
              0
            }
            icon="⭐"
            background="#fff7ed"
          />

          <StatCard
            title="Interviews"
            value={
              analytics.totalInterviews ||
              0
            }
            icon="🎤"
            background="#fdf4ff"
          />

          <StatCard
            title="Interview Score"
            value={`${interviewScore}/100`}
            icon="🤖"
            background="#eff6ff"
          />

          <StatCard
            title="Success Rate"
            value={`${successRate}%`}
            icon="📈"
            background="#f0fdf4"
          />

          <StatCard
            title="Skills"
            value={
              analytics.totalSkills ||
              0
            }
            icon="💻"
            background="#f5f3ff"
          />

          <StatCard
            title="Resume"
            value={
              analytics.resumeUploaded
                ? "Uploaded"
                : "Missing"
            }
            icon="📄"
            background={
              analytics.resumeUploaded
                ? "#ecfdf5"
                : "#fef2f2"
            }
          />

        </div>

        {/* ================= APPLICATION STATUS ================= */}

        <section style={styles.card}>

          <div style={styles.cardHeader}>
            <div>
              <span
                style={
                  styles.sectionBadge
                }
              >
                📌 APPLICATIONS
              </span>

              <h2 style={styles.cardTitle}>
                Application Status
              </h2>

              <p
                style={
                  styles.cardDescription
                }
              >
                Overview of your placement
                application pipeline.
              </p>
            </div>
          </div>

          {applicationStatus.length ===
          0 ? (
            <div style={styles.smallEmpty}>
              No application status data
              available.
            </div>
          ) : (
            <div
              style={
                styles.statusGrid
              }
            >
              {applicationStatus.map(
                (item) => (
                  <div
                    key={
                      item.status
                    }
                    style={
                      styles.statusItem
                    }
                  >
                    <div>
                      <span
                        style={
                          styles.statusLabel
                        }
                      >
                        {item.status}
                      </span>

                      <strong
                        style={
                          styles.statusValue
                        }
                      >
                        {item.count}
                      </strong>
                    </div>

                    <div
                      style={
                        styles.statusIcon
                      }
                    >
                      {getStatusIcon(
                        item.status
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          )}

        </section>

        {/* ================= SKILLS ================= */}

        <section style={styles.card}>

          <div style={styles.cardHeader}>
            <div>
              <span
                style={
                  styles.sectionBadge
                }
              >
                💻 SKILL PROFILE
              </span>

              <h2 style={styles.cardTitle}>
                Your Skills
              </h2>

              <p
                style={
                  styles.cardDescription
                }
              >
                Skills currently added to your
                placement profile.
              </p>
            </div>

            <div style={styles.countBadge}>
              {skills.length} Skills
            </div>
          </div>

          {skills.length === 0 ? (
            <div style={styles.smallEmpty}>
              No skills added yet. Update
              your profile to improve your
              career score.
            </div>
          ) : (
            <div style={styles.skills}>
              {skills.map(
                (skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    style={styles.skill}
                  >
                    <span>
                      ✓
                    </span>

                    {skill}
                  </span>
                )
              )}
            </div>
          )}

        </section>

        {/* ================= PREPARATION SCORES ================= */}

        <section style={styles.card}>

          <div style={styles.cardHeader}>
            <div>
              <span
                style={
                  styles.sectionBadge
                }
              >
                🎯 PREPARATION
              </span>

              <h2 style={styles.cardTitle}>
                Preparation Scores
              </h2>

              <p
                style={
                  styles.cardDescription
                }
              >
                See which areas are strong and
                which areas need more attention.
              </p>
            </div>
          </div>

          <div style={styles.scoreList}>

            <ScoreRow
              title="Profile Score"
              score={profileScore}
              icon="👤"
            />

            <ScoreRow
              title="Skill Score"
              score={skillScore}
              icon="💻"
            />

            <ScoreRow
              title="Interview Score"
              score={interviewScore}
              icon="🤖"
            />

          </div>

        </section>

        {/* ================= SUGGESTIONS ================= */}

        <section style={styles.suggestionCard}>

          <div style={styles.cardHeader}>
            <div>
              <span
                style={
                  styles.sectionBadge
                }
              >
                💡 AI INSIGHTS
              </span>

              <h2 style={styles.cardTitle}>
                Career Improvement Suggestions
              </h2>

              <p
                style={
                  styles.cardDescription
                }
              >
                Focus on these areas to improve
                your placement readiness.
              </p>
            </div>
          </div>

          {suggestions.length === 0 ? (
            <div style={styles.smallEmpty}>
              🎉 No major improvement areas
              detected. Keep going!
            </div>
          ) : (
            <div
              style={
                styles.suggestionList
              }
            >
              {suggestions.map(
                (suggestion, index) => (
                  <div
                    key={index}
                    style={
                      styles.suggestion
                    }
                  >
                    <div
                      style={
                        styles.suggestionNumber
                      }
                    >
                      {index + 1}
                    </div>

                    <div>
                      <strong
                        style={
                          styles.suggestionTitle
                        }
                      >
                        Improvement Area
                      </strong>

                      <p
                        style={
                          styles.suggestionText
                        }
                      >
                        {suggestion}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

        </section>

      </div>
    </div>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  title,
  value,
  icon,
  background,
}) => {
  return (
    <div style={styles.statCard}>

      <div
        style={{
          ...styles.statIcon,
          background,
        }}
      >
        {icon}
      </div>

      <div>
        <span style={styles.statTitle}>
          {title}
        </span>

        <strong style={styles.statValue}>
          {value}
        </strong>
      </div>

    </div>
  );
};

/* =========================================================
   SCORE ROW
========================================================= */

const ScoreRow = ({
  title,
  score,
  icon,
}) => {
  const safe = safeScore(score);

  return (
    <div style={styles.scoreRow}>

      <div style={styles.scoreTop}>

        <div style={styles.scoreName}>
          <span style={styles.scoreIcon}>
            {icon}
          </span>

          <strong>
            {title}
          </strong>
        </div>

        <strong
          style={{
            color:
              getScoreColor(safe),
          }}
        >
          {safe}/100
        </strong>

      </div>

      <div
        style={
          styles.scoreOuter
        }
      >
        <div
          style={{
            ...styles.scoreInner,
            width: `${safe}%`,
            background:
              getScoreColor(safe),
          }}
        />
      </div>

    </div>
  );
};

/* =========================================================
   STATUS ICON
========================================================= */

const getStatusIcon = (status) => {
  const value =
    String(status || "")
      .toLowerCase();

  if (value.includes("selected")) {
    return "🎉";
  }

  if (value.includes("shortlisted")) {
    return "⭐";
  }

  if (value.includes("interview")) {
    return "🎤";
  }

  if (value.includes("reject")) {
    return "❌";
  }

  if (value.includes("pending")) {
    return "⏳";
  }

  return "📋";
};

/* =========================================================
   STYLES
========================================================= */

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
    padding: "35px 20px 60px",
    boxSizing: "border-box",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  loadingCard: {
    maxWidth: "500px",
    margin: "100px auto",
    padding: "45px",
    background: "#ffffff",
    borderRadius: "22px",
    textAlign: "center",
    boxShadow:
      "0 10px 35px rgba(15,23,42,0.08)",
  },

  loadingIcon: {
    fontSize: "45px",
    marginBottom: "10px",
  },

  errorCard: {
    maxWidth: "600px",
    margin: "80px auto",
    padding: "40px",
    background: "#ffffff",
    borderRadius: "22px",
    textAlign: "center",
    boxShadow:
      "0 10px 35px rgba(15,23,42,0.08)",
  },

  errorIcon: {
    fontSize: "45px",
  },

  retryButton: {
    marginTop: "15px",
    padding: "12px 20px",
    border: "none",
    borderRadius: "11px",
    background: "#4f46e5",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
  },

  emptyCard: {
    maxWidth: "600px",
    margin: "80px auto",
    padding: "40px",
    background: "#ffffff",
    borderRadius: "22px",
    textAlign: "center",
    boxShadow:
      "0 10px 35px rgba(15,23,42,0.08)",
  },

  emptyIcon: {
    fontSize: "45px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "25px",
    marginBottom: "28px",
    flexWrap: "wrap",
  },

  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  mainIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    boxShadow:
      "0 10px 25px rgba(79,70,229,0.25)",
  },

  pageBadge: {
    display: "inline-block",
    color: "#4f46e5",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  title: {
    margin: "3px 0 4px",
    fontSize: "32px",
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "15px",
    lineHeight: "1.6",
  },

  studentBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "15px 20px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "17px",
    boxShadow:
      "0 6px 20px rgba(15,23,42,0.05)",
  },

  studentAvatar: {
    width: "46px",
    height: "46px",
    borderRadius: "14px",
    background:
      "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "18px",
  },

  studentLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: "11px",
  },

  studentName: {
    display: "block",
    marginTop: "2px",
    color: "#1e293b",
    fontSize: "16px",
  },

  studentDetails: {
    display: "block",
    marginTop: "2px",
    color: "#64748b",
    fontSize: "13px",
  },

  sectionBadge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "#eef2ff",
    color: "#4f46e5",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "0.5px",
  },

  readinessCard: {
    padding: "30px",
    marginBottom: "20px",
    background:
      "linear-gradient(135deg, #ffffff, #f8faff)",
    border: "1px solid #ddd6fe",
    borderRadius: "22px",
    boxShadow:
      "0 10px 35px rgba(79,70,229,0.08)",
  },

  readinessContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  readinessTitle: {
    margin: "9px 0 5px",
    fontSize: "23px",
    color: "#111827",
  },

  readinessDescription: {
    maxWidth: "650px",
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  readinessScore: {
    fontSize: "48px",
    fontWeight: "900",
    whiteSpace: "nowrap",
  },

  readinessScoreSpan: {
    fontSize: "20px",
  },

  readinessProgressOuter: {
    height: "13px",
    marginTop: "25px",
    background: "#e2e8f0",
    borderRadius: "999px",
    overflow: "hidden",
  },

  readinessProgressInner: {
    height: "100%",
    borderRadius: "999px",
    transition:
      "width 0.6s ease",
  },

  readinessBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "8px",
    color: "#94a3b8",
    fontSize: "12px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "15px",
    marginBottom: "20px",
  },

  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "19px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "17px",
    boxShadow:
      "0 6px 20px rgba(15,23,42,0.05)",
  },

  statIcon: {
    width: "47px",
    height: "47px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    flexShrink: 0,
  },

  statTitle: {
    display: "block",
    color: "#64748b",
    fontSize: "12px",
  },

  statValue: {
    display: "block",
    marginTop: "3px",
    color: "#111827",
    fontSize: "23px",
  },

  card: {
    padding: "28px",
    marginBottom: "20px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    boxShadow:
      "0 7px 25px rgba(15,23,42,0.05)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "22px",
    flexWrap: "wrap",
  },

  cardTitle: {
    margin: "8px 0 4px",
    color: "#111827",
    fontSize: "21px",
  },

  cardDescription: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },

  statusGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
  },

  statusItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "17px",
    borderRadius: "14px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
  },

  statusLabel: {
    display: "block",
    color: "#64748b",
    fontSize: "12px",
  },

  statusValue: {
    display: "block",
    marginTop: "4px",
    color: "#111827",
    fontSize: "23px",
  },

  statusIcon: {
    fontSize: "25px",
  },

  countBadge: {
    padding: "7px 12px",
    borderRadius: "999px",
    background: "#eef2ff",
    color: "#4f46e5",
    fontSize: "12px",
    fontWeight: "700",
  },

  skills: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },

  skill: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "9px 14px",
    borderRadius: "999px",
    background:
      "linear-gradient(135deg, #eef2ff, #f5f3ff)",
    color: "#4338ca",
    border: "1px solid #ddd6fe",
    fontSize: "13px",
    fontWeight: "600",
  },

  scoreList: {
    display: "flex",
    flexDirection: "column",
    gap: "23px",
  },

  scoreRow: {
    width: "100%",
  },

  scoreTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "9px",
  },

  scoreName: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#334155",
  },

  scoreIcon: {
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  scoreOuter: {
    height: "10px",
    borderRadius: "999px",
    background: "#e2e8f0",
    overflow: "hidden",
  },

  scoreInner: {
    height: "100%",
    borderRadius: "999px",
    transition:
      "width 0.5s ease",
  },

  suggestionCard: {
    padding: "28px",
    background:
      "linear-gradient(135deg, #ffffff, #f8faff)",
    border: "1px solid #ddd6fe",
    borderRadius: "20px",
    boxShadow:
      "0 8px 30px rgba(79,70,229,0.06)",
  },

  suggestionList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  suggestion: {
    display: "flex",
    alignItems: "flex-start",
    gap: "13px",
    padding: "16px",
    borderRadius: "14px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
  },

  suggestionNumber: {
    width: "32px",
    height: "32px",
    flexShrink: 0,
    borderRadius: "10px",
    background:
      "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "13px",
  },

  suggestionTitle: {
    color: "#334155",
    fontSize: "13px",
  },

  suggestionText: {
    margin: "5px 0 0",
    color: "#64748b",
    lineHeight: "1.6",
    fontSize: "14px",
  },

  smallEmpty: {
    padding: "25px",
    textAlign: "center",
    background: "#f8fafc",
    borderRadius: "14px",
    color: "#64748b",
    fontSize: "14px",
  },
};

export default CareerAnalyticsPage;