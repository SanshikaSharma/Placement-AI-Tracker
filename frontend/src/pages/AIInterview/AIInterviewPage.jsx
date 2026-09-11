import { useEffect, useState } from "react";

import {
  getInterviewQuestion,
  evaluateInterviewAnswer,
  getInterviewHistory,
  deleteInterviewHistory,
} from "../../services/interviewService";

const categories = [
  "HR",
  "Technical",
  "DSA",
  "Web Development",
  "Database",
  "Aptitude",
  "Behavioral",
];

const difficulties = ["Easy", "Medium", "Hard"];

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
    const parsedUser = JSON.parse(storedUser);

    if (parsedUser?.user) {
      return parsedUser.user;
    }

    return parsedUser;
  } catch (error) {
    console.error("User parsing error:", error);
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
   MAIN COMPONENT
========================================================= */

const AIInterviewPage = () => {
  const [user] = useState(() => getStoredUser());

  const [studentId] = useState(() =>
    getStudentId()
  );

  const [category, setCategory] =
    useState("Technical");

  const [difficulty, setDifficulty] =
    useState("Easy");

  const [question, setQuestion] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const [score, setScore] =
    useState(null);

  const [feedback, setFeedback] =
    useState("");

  const [history, setHistory] =
    useState([]);

  const [averageScore, setAverageScore] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [evaluating, setEvaluating] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =======================================================
     LOAD HISTORY
  ======================================================= */

  useEffect(() => {
    if (!studentId) {
      return undefined;
    }

    let cancelled = false;

    const loadHistory = async () => {
      try {
        const res =
          await getInterviewHistory(studentId);

        if (cancelled) {
          return;
        }

        if (res?.success) {
          setHistory(
            Array.isArray(res.interviews)
              ? res.interviews
              : []
          );

          setAverageScore(
            Number(res.averageScore) || 0
          );
        }
      } catch (err) {
        if (!cancelled) {
          console.error(
            "History loading error:",
            err
          );
        }
      }
    };

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [studentId]);

  /* =======================================================
     LOAD QUESTION
  ======================================================= */

  const loadQuestion = async () => {
    try {
      setLoading(true);
      setError("");

      setQuestion("");
      setAnswer("");
      setScore(null);
      setFeedback("");

      const res =
        await getInterviewQuestion(
          category,
          difficulty
        );

      if (
        res?.success &&
        res?.question
      ) {
        setQuestion(
          res.question.question || ""
        );
      } else {
        setError(
          res?.message ||
            "Unable to load interview question."
        );
      }
    } catch (err) {
      console.error(
        "Question loading error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to load interview question."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     SUBMIT ANSWER
  ======================================================= */

  const handleSubmit = async () => {
    if (!studentId) {
      setError(
        "Student ID not found. Please logout and login again."
      );
      return;
    }

    if (!question) {
      setError(
        "Please get an interview question first."
      );
      return;
    }

    if (!answer.trim()) {
      setError(
        "Please write your answer first."
      );
      return;
    }

    try {
      setEvaluating(true);
      setError("");

      const res =
        await evaluateInterviewAnswer({
          student: studentId,
          category,
          difficulty,
          question,
          answer: answer.trim(),
        });

      if (!res?.success) {
        setError(
          res?.message ||
            "Unable to evaluate answer."
        );
        return;
      }

      setScore(
        typeof res.score === "number"
          ? res.score
          : Number(res.score) || 0
      );

      setFeedback(
        res.feedback ||
          "No feedback available."
      );

      /* Refresh history */

      try {
        const historyRes =
          await getInterviewHistory(
            studentId
          );

        if (historyRes?.success) {
          setHistory(
            Array.isArray(
              historyRes.interviews
            )
              ? historyRes.interviews
              : []
          );

          setAverageScore(
            Number(
              historyRes.averageScore
            ) || 0
          );
        }
      } catch (historyError) {
        console.error(
          "History refresh error:",
          historyError
        );
      }
    } catch (err) {
      console.error(
        "Answer evaluation error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to evaluate answer."
      );
    } finally {
      setEvaluating(false);
    }
  };

  /* =======================================================
     DELETE HISTORY
  ======================================================= */

  const handleResetHistory = async () => {
    if (!studentId) {
      setError(
        "Student ID not found. Please login again."
      );
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete your interview history?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteInterviewHistory(
        studentId
      );

      setHistory([]);
      setAverageScore(0);
      setScore(null);
      setFeedback("");
    } catch (err) {
      console.error(
        "Delete history error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to delete interview history."
      );
    }
  };

  /* =======================================================
     SCORE COLOR
  ======================================================= */

  const getScoreColor = (value) => {
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
              <div style={styles.robotIcon}>
                🤖
              </div>

              <div>
                <h1 style={styles.title}>
                  AI Interview Preparation
                </h1>

                <p style={styles.subtitle}>
                  Practice real interview questions,
                  evaluate your answers and improve
                  your confidence.
                </p>
              </div>
            </div>
          </div>

          {user?.name && (
            <div style={styles.welcomeCard}>
              <div style={styles.welcomeIcon}>
                👋
              </div>

              <div>
                <span style={styles.welcomeSmall}>
                  Welcome back
                </span>

                <strong style={styles.welcomeName}>
                  {user.name}
                </strong>
              </div>
            </div>
          )}
        </div>

        {/* ================= LOGIN WARNING ================= */}

        {!studentId && (
          <div style={styles.warning}>
            <span style={styles.alertIcon}>
              ⚠️
            </span>

            <div>
              <strong>
                Login session not found
              </strong>

              <p style={styles.alertText}>
                Please logout and login again
                before using AI Interview.
              </p>
            </div>
          </div>
        )}

        {/* ================= ERROR ================= */}

        {error && (
          <div style={styles.error}>
            <span>⚠️</span>

            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              style={styles.closeError}
            >
              ×
            </button>
          </div>
        )}

        {/* ================= STATS ================= */}

        <div style={styles.statsGrid}>

          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                background:
                  "#eef2ff",
              }}
            >
              📝
            </div>

            <div>
              <span style={styles.statLabel}>
                Total Attempts
              </span>

              <strong style={styles.statValue}>
                {history.length}
              </strong>
            </div>
          </div>

          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                background:
                  "#ecfdf5",
              }}
            >
              🎯
            </div>

            <div>
              <span style={styles.statLabel}>
                Average Score
              </span>

              <strong style={styles.statValue}>
                {averageScore}/100
              </strong>
            </div>
          </div>

          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                background:
                  "#fff7ed",
              }}
            >
              🏆
            </div>

            <div>
              <span style={styles.statLabel}>
                Best Score
              </span>

              <strong style={styles.statValue}>
                {history.length > 0
                  ? Math.max(
                      ...history.map(
                        (item) =>
                          Number(
                            item.score
                          ) || 0
                      )
                    )
                  : 0}
                /100
              </strong>
            </div>
          </div>

        </div>

        {/* ================= PRACTICE CARD ================= */}

        <section style={styles.practiceCard}>

          <div style={styles.sectionHeader}>
            <div>
              <span style={styles.sectionBadge}>
                🎯 PRACTICE MODE
              </span>

              <h2 style={styles.sectionTitle}>
                Start Interview Practice
              </h2>

              <p style={styles.sectionDescription}>
                Choose a category and difficulty
                to generate your next question.
              </p>
            </div>
          </div>

          <div style={styles.controls}>

            <div style={styles.controlGroup}>
              <label
                htmlFor="interview-category"
                style={styles.label}
              >
                Category
              </label>

              <select
                id="interview-category"
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
                style={styles.select}
              >
                {categories.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>
            </div>

            <div style={styles.controlGroup}>
              <label
                htmlFor="interview-difficulty"
                style={styles.label}
              >
                Difficulty
              </label>

              <select
                id="interview-difficulty"
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(
                    e.target.value
                  )
                }
                style={styles.select}
              >
                {difficulties.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>
            </div>

            <button
              type="button"
              onClick={loadQuestion}
              disabled={
                loading || !studentId
              }
              style={{
                ...styles.primaryButton,
                opacity:
                  loading ||
                  !studentId
                    ? 0.6
                    : 1,
              }}
            >
              {loading
                ? "⏳ Loading..."
                : "🎯 Get Question"}
            </button>

          </div>
        </section>

        {/* ================= QUESTION ================= */}

        {question && (
          <section style={styles.questionCard}>

            <div style={styles.questionTop}>
              <div>
                <span style={styles.questionNumber}>
                  INTERVIEW QUESTION
                </span>

                <div style={styles.badges}>
                  <span style={styles.categoryBadge}>
                    {category}
                  </span>

                  <span
                    style={{
                      ...styles.difficultyBadge,
                      ...(difficulty ===
                      "Hard"
                        ? styles.hardBadge
                        : difficulty ===
                          "Medium"
                        ? styles.mediumBadge
                        : styles.easyBadge),
                    }}
                  >
                    {difficulty}
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.questionBox}>
              <span style={styles.questionMark}>
                Q
              </span>

              <h2 style={styles.questionText}>
                {question}
              </h2>
            </div>

            <div style={styles.answerSection}>
              <label
                htmlFor="interview-answer"
                style={styles.answerLabel}
              >
                Your Answer
              </label>

              <textarea
                id="interview-answer"
                value={answer}
                onChange={(e) =>
                  setAnswer(
                    e.target.value
                  )
                }
                placeholder="Write your answer as if you are speaking to an interviewer..."
                rows={8}
                style={styles.textarea}
              />

              <div style={styles.answerFooter}>
                <span style={styles.characterCount}>
                  {answer.length} characters
                </span>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={
                    evaluating ||
                    !studentId
                  }
                  style={{
                    ...styles.evaluateButton,
                    opacity:
                      evaluating ||
                      !studentId
                        ? 0.6
                        : 1,
                  }}
                >
                  {evaluating
                    ? "🤖 Evaluating..."
                    : "🤖 Evaluate My Answer"}
                </button>
              </div>
            </div>

          </section>
        )}

        {/* ================= RESULT ================= */}

        {score !== null && (
          <section
            style={{
              ...styles.resultCard,
              borderTop: `5px solid ${getScoreColor(
                score
              )}`,
            }}
          >

            <div style={styles.resultHeader}>
              <div>
                <span style={styles.sectionBadge}>
                  📊 AI EVALUATION
                </span>

                <h2 style={styles.sectionTitle}>
                  Interview Result
                </h2>
              </div>

              <div
                style={{
                  ...styles.scoreCircle,
                  borderColor:
                    getScoreColor(
                      score
                    ),
                }}
              >
                <strong
                  style={{
                    color:
                      getScoreColor(
                        score
                      ),
                  }}
                >
                  {score}
                </strong>

                <span>/100</span>
              </div>
            </div>

            <div style={styles.resultProgress}>
              <div
                style={{
                  ...styles.resultProgressFill,
                  width: `${Math.min(
                    100,
                    Math.max(0, score)
                  )}%`,
                  background:
                    getScoreColor(
                      score
                    ),
                }}
              />
            </div>

            <div style={styles.feedbackBox}>
              <div style={styles.feedbackIcon}>
                💡
              </div>

              <div>
                <strong style={styles.feedbackTitle}>
                  AI Feedback
                </strong>

                <p style={styles.feedbackText}>
                  {feedback}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={loadQuestion}
              disabled={loading}
              style={styles.nextButton}
            >
              {loading
                ? "Loading..."
                : "🔄 Next Question"}
            </button>

          </section>
        )}

        {/* ================= HISTORY ================= */}

        <section style={styles.historyCard}>

          <div style={styles.historyHeader}>
            <div>
              <span style={styles.sectionBadge}>
                📚 PROGRESS
              </span>

              <h2 style={styles.sectionTitle}>
                Interview History
              </h2>

              <p style={styles.sectionDescription}>
                Review your previous attempts
                and track your improvement.
              </p>
            </div>

            {history.length > 0 && (
              <button
                type="button"
                onClick={
                  handleResetHistory
                }
                style={styles.clearButton}
              >
                🗑 Clear History
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div style={styles.emptyHistory}>
              <div style={styles.emptyIcon}>
                🎤
              </div>

              <h3>
                No interview attempts yet
              </h3>

              <p>
                Start your first interview
                practice above.
              </p>
            </div>
          ) : (
            <div style={styles.historyList}>
              {history.map(
                (item, index) => {
                  const itemScore =
                    Number(
                      item.score
                    ) || 0;

                  return (
                    <div
                      key={
                        item._id ||
                        `${item.question}-${index}`
                      }
                      style={styles.historyItem}
                    >
                      <div style={styles.historyItemTop}>
                        <div>
                          <div style={styles.historyBadges}>
                            <span
                              style={
                                styles.categoryBadge
                              }
                            >
                              {item.category}
                            </span>

                            <span
                              style={
                                styles.historyDifficulty
                              }
                            >
                              {item.difficulty}
                            </span>
                          </div>

                          <h3
                            style={
                              styles.historyQuestion
                            }
                          >
                            {item.question}
                          </h3>
                        </div>

                        <div
                          style={{
                            ...styles.historyScore,
                            color:
                              getScoreColor(
                                itemScore
                              ),
                          }}
                        >
                          {itemScore}
                          <span>
                            /100
                          </span>
                        </div>
                      </div>

                      <div
                        style={
                          styles.historyAnswer
                        }
                      >
                        <strong>
                          Your Answer
                        </strong>

                        <p>
                          {item.answer}
                        </p>
                      </div>

                      <div
                        style={
                          styles.historyFeedback
                        }
                      >
                        <strong>
                          💡 Feedback
                        </strong>

                        <p>
                          {item.feedback}
                        </p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}

        </section>

      </div>
    </div>
  );
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
    maxWidth: "1180px",
    margin: "0 auto",
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

  robotIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "18px",
    background:
      "linear-gradient(135deg, #4f46e5, #7c3aed)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    boxShadow:
      "0 10px 25px rgba(79,70,229,0.25)",
  },

  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: "15px",
    lineHeight: "1.6",
  },

  welcomeCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "15px 20px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    boxShadow:
      "0 5px 20px rgba(15,23,42,0.06)",
  },

  welcomeIcon: {
    fontSize: "24px",
  },

  welcomeSmall: {
    display: "block",
    fontSize: "12px",
    color: "#94a3b8",
  },

  welcomeName: {
    display: "block",
    marginTop: "3px",
    fontSize: "16px",
    color: "#1e293b",
  },

  warning: {
    display: "flex",
    gap: "13px",
    alignItems: "flex-start",
    padding: "16px 18px",
    marginBottom: "20px",
    borderRadius: "14px",
    background: "#fffbeb",
    border: "1px solid #fde68a",
    color: "#92400e",
  },

  alertIcon: {
    fontSize: "20px",
  },

  alertText: {
    margin: "4px 0 0",
    fontSize: "14px",
  },

  error: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 16px",
    marginBottom: "20px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    borderRadius: "14px",
    fontSize: "14px",
  },

  closeError: {
    marginLeft: "auto",
    border: "none",
    background: "transparent",
    color: "#991b1b",
    fontSize: "22px",
    cursor: "pointer",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "22px",
  },

  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "20px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    boxShadow:
      "0 6px 20px rgba(15,23,42,0.05)",
  },

  statIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
  },

  statLabel: {
    display: "block",
    color: "#64748b",
    fontSize: "13px",
  },

  statValue: {
    display: "block",
    marginTop: "4px",
    color: "#111827",
    fontSize: "25px",
  },

  practiceCard: {
    padding: "28px",
    marginBottom: "20px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    boxShadow:
      "0 8px 30px rgba(15,23,42,0.06)",
  },

  sectionHeader: {
    marginBottom: "22px",
  },

  sectionBadge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "#eef2ff",
    color: "#4f46e5",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "0.5px",
  },

  sectionTitle: {
    margin: "9px 0 4px",
    color: "#111827",
    fontSize: "22px",
  },

  sectionDescription: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },

  controls: {
    display: "grid",
    gridTemplateColumns:
      "minmax(180px, 1fr) minmax(150px, 0.8fr) auto",
    gap: "16px",
    alignItems: "end",
  },

  controlGroup: {
    minWidth: 0,
  },

  label: {
    display: "block",
    marginBottom: "8px",
    color: "#334155",
    fontWeight: "700",
    fontSize: "13px",
  },

  select: {
    width: "100%",
    padding: "13px 14px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#1e293b",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },

  primaryButton: {
    padding: "13px 22px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg, #111827, #334155)",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    minHeight: "46px",
    boxShadow:
      "0 7px 18px rgba(15,23,42,0.18)",
  },

  questionCard: {
    padding: "30px",
    marginBottom: "20px",
    background: "#ffffff",
    border: "1px solid #ddd6fe",
    borderRadius: "20px",
    boxShadow:
      "0 10px 35px rgba(79,70,229,0.08)",
  },

  questionTop: {
    marginBottom: "20px",
  },

  questionNumber: {
    color: "#6366f1",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  badges: {
    display: "flex",
    gap: "8px",
    marginTop: "10px",
    flexWrap: "wrap",
  },

  categoryBadge: {
    display: "inline-block",
    padding: "6px 11px",
    borderRadius: "999px",
    background: "#eef2ff",
    color: "#4f46e5",
    fontSize: "12px",
    fontWeight: "700",
  },

  difficultyBadge: {
    display: "inline-block",
    padding: "6px 11px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
  },

  easyBadge: {
    background: "#dcfce7",
    color: "#166534",
  },

  mediumBadge: {
    background: "#fef3c7",
    color: "#92400e",
  },

  hardBadge: {
    background: "#fee2e2",
    color: "#991b1b",
  },

  questionBox: {
    display: "flex",
    gap: "18px",
    alignItems: "flex-start",
    padding: "22px",
    background:
      "linear-gradient(135deg, #eef2ff, #f5f3ff)",
    borderRadius: "16px",
    marginBottom: "24px",
  },

  questionMark: {
    width: "40px",
    height: "40px",
    flexShrink: 0,
    borderRadius: "12px",
    background: "#4f46e5",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  questionText: {
    margin: 0,
    color: "#1e293b",
    fontSize: "20px",
    lineHeight: "1.55",
  },

  answerSection: {
    marginTop: "10px",
  },

  answerLabel: {
    display: "block",
    marginBottom: "9px",
    fontWeight: "700",
    color: "#334155",
  },

  textarea: {
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    resize: "vertical",
    boxSizing: "border-box",
    fontFamily: "inherit",
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#1e293b",
    outline: "none",
    minHeight: "170px",
    background: "#f8fafc",
  },

  answerFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    marginTop: "12px",
    flexWrap: "wrap",
  },

  characterCount: {
    color: "#94a3b8",
    fontSize: "12px",
  },

  evaluateButton: {
    padding: "13px 20px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow:
      "0 7px 18px rgba(79,70,229,0.25)",
  },

  resultCard: {
    padding: "28px",
    marginBottom: "20px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    boxShadow:
      "0 10px 30px rgba(15,23,42,0.07)",
  },

  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  scoreCircle: {
    width: "92px",
    height: "92px",
    borderRadius: "50%",
    border: "6px solid",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  resultProgress: {
    height: "10px",
    margin: "22px 0",
    borderRadius: "999px",
    background: "#e2e8f0",
    overflow: "hidden",
  },

  resultProgressFill: {
    height: "100%",
    borderRadius: "999px",
    transition: "width 0.5s ease",
  },

  feedbackBox: {
    display: "flex",
    gap: "13px",
    padding: "18px",
    borderRadius: "15px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
  },

  feedbackIcon: {
    fontSize: "22px",
  },

  feedbackTitle: {
    color: "#1e293b",
  },

  feedbackText: {
    margin: "7px 0 0",
    color: "#475569",
    lineHeight: "1.6",
    fontSize: "14px",
  },

  nextButton: {
    marginTop: "18px",
    padding: "12px 18px",
    border: "none",
    borderRadius: "11px",
    background: "#111827",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "700",
  },

  historyCard: {
    padding: "28px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    boxShadow:
      "0 8px 30px rgba(15,23,42,0.05)",
  },

  historyHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "22px",
  },

  clearButton: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #fecaca",
    background: "#fff5f5",
    color: "#b91c1c",
    cursor: "pointer",
    fontWeight: "600",
  },

  emptyHistory: {
    textAlign: "center",
    padding: "45px 20px",
    background: "#f8fafc",
    borderRadius: "16px",
    border: "1px dashed #cbd5e1",
  },

  emptyIcon: {
    fontSize: "42px",
    marginBottom: "8px",
  },

  historyList: {
    display: "flex",
    flexDirection: "column",
  },

  historyItem: {
    padding: "22px 0",
    borderBottom: "1px solid #e2e8f0",
  },

  historyItemTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    alignItems: "flex-start",
  },

  historyBadges: {
    display: "flex",
    gap: "8px",
    marginBottom: "10px",
    flexWrap: "wrap",
  },

  historyDifficulty: {
    padding: "6px 11px",
    borderRadius: "999px",
    background: "#f1f5f9",
    color: "#475569",
    fontSize: "12px",
    fontWeight: "700",
  },

  historyQuestion: {
    margin: 0,
    color: "#1e293b",
    fontSize: "16px",
    lineHeight: "1.5",
  },

  historyScore: {
    fontSize: "26px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  historyAnswer: {
    marginTop: "15px",
    padding: "14px",
    background: "#f8fafc",
    borderRadius: "12px",
  },

  historyFeedback: {
    marginTop: "10px",
    padding: "14px",
    background: "#f5f3ff",
    borderRadius: "12px",
  },
};

export default AIInterviewPage;