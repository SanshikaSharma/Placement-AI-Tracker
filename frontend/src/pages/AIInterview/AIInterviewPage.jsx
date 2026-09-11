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

// Get the MongoDB user ID from different possible login-response structures
const getStudentId = () => {
  const storedUser = sessionStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    const parsedUser = JSON.parse(storedUser);

    return (
      parsedUser?._id ||
      parsedUser?.id ||
      parsedUser?.user?._id ||
      parsedUser?.user?.id ||
      parsedUser?.student?._id ||
      parsedUser?.student?.id ||
      null
    );
  } catch (error) {
    console.error("User parsing error:", error);
    return null;
  }
};

const getStoredUser = () => {
  const storedUser = sessionStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    const parsedUser = JSON.parse(storedUser);

    // If login stores { user: {...} }, use the nested user
    if (parsedUser?.user) {
      return parsedUser.user;
    }

    return parsedUser;
  } catch (error) {
    console.error("User parsing error:", error);
    return null;
  }
};

const AIInterviewPage = () => {
  const [user] = useState(() => getStoredUser());

  const [studentId] = useState(() => getStudentId());

  const [category, setCategory] = useState("Technical");

  const [difficulty, setDifficulty] = useState("Easy");

  const [question, setQuestion] = useState("");

  const [answer, setAnswer] = useState("");

  const [score, setScore] = useState(null);

  const [feedback, setFeedback] = useState("");

  const [history, setHistory] = useState([]);

  const [averageScore, setAverageScore] = useState(0);

  const [loading, setLoading] = useState(false);

  const [evaluating, setEvaluating] = useState(false);

  const [error, setError] = useState("");

  // Load interview history
  useEffect(() => {
    if (!studentId) {
      return;
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
          setHistory(res.interviews || []);
          setAverageScore(res.averageScore || 0);
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

  // Load question
  const loadQuestion = async () => {
    try {
      setLoading(true);
      setError("");

      setScore(null);
      setFeedback("");
      setAnswer("");

      const res =
        await getInterviewQuestion(
          category,
          difficulty
        );

      if (res?.success && res?.question) {
        setQuestion(
          res.question.question || ""
        );
      } else {
        setQuestion("");

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

      setQuestion("");

      setError(
        err?.response?.data?.message ||
          "Unable to load interview question."
      );
    } finally {
      setLoading(false);
    }
  };

  // Submit answer
  const handleSubmit = async () => {
    if (!studentId) {
      alert(
        "Student ID not found. Please logout and login again."
      );
      return;
    }

    if (!question) {
      alert(
        "Please get an interview question first."
      );
      return;
    }

    if (!answer.trim()) {
      alert(
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
          : 0
      );

      setFeedback(
        res.feedback ||
          "No feedback available."
      );

      // Refresh history
      try {
        const historyRes =
          await getInterviewHistory(studentId);

        if (historyRes?.success) {
          setHistory(
            historyRes.interviews || []
          );

          setAverageScore(
            historyRes.averageScore || 0
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

  // Delete history
  const handleResetHistory = async () => {
    if (!studentId) {
      alert(
        "Student ID not found. Please login again."
      );
      return;
    }

    const confirmed = window.confirm(
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

      alert(
        err?.response?.data?.message ||
          "Unable to delete interview history."
      );
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1100px",
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: "25px",
        }}
      >
        <h1
          style={{
            marginBottom: "8px",
          }}
        >
          🤖 AI Interview Preparation
        </h1>

        <p
          style={{
            color: "#666",
            margin: 0,
          }}
        >
          Practice interview questions and improve
          your interview preparation.
        </p>

        {user?.name && (
          <p
            style={{
              marginTop: "10px",
              color: "#555",
            }}
          >
            Welcome, <strong>{user.name}</strong>
          </p>
        )}
      </div>

      {/* Login warning */}
      {!studentId && (
        <div
          style={{
            padding: "15px",
            marginBottom: "20px",
            background: "#fff3cd",
            color: "#856404",
            borderRadius: "10px",
            border: "1px solid #ffeeba",
          }}
        >
          Your login session could not be
          identified. Please logout and login again.
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            padding: "14px",
            marginBottom: "20px",
            background: "#ffe5e5",
            color: "#b00020",
            borderRadius: "10px",
            border: "1px solid #ffcccc",
          }}
        >
          {error}
        </div>
      )}

      {/* Statistics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "15px",
          marginBottom: "25px",
        }}
      >
        <div
          style={{
            padding: "20px",
            borderRadius: "12px",
            background: "#f5f7ff",
            border: "1px solid #e2e6ff",
          }}
        >
          <p
            style={{
              margin: "0 0 8px",
              color: "#666",
            }}
          >
            Total Attempts
          </p>

          <h2 style={{ margin: 0 }}>
            {history.length}
          </h2>
        </div>

        <div
          style={{
            padding: "20px",
            borderRadius: "12px",
            background: "#f5f7ff",
            border: "1px solid #e2e6ff",
          }}
        >
          <p
            style={{
              margin: "0 0 8px",
              color: "#666",
            }}
          >
            Average Score
          </p>

          <h2 style={{ margin: 0 }}>
            {averageScore}/100
          </h2>
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          padding: "25px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          marginBottom: "20px",
          background: "#fff",
        }}
      >
        <h2 style={{ marginTop: 0 }}>
          Start Interview Practice
        </h2>

        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            marginTop: "20px",
          }}
        >
          <div>
            <label
              htmlFor="interview-category"
              style={{
                fontWeight: "600",
              }}
            >
              Category
            </label>

            <br />

            <select
              id="interview-category"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              style={{
                padding: "10px",
                marginTop: "7px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                minWidth: "190px",
              }}
            >
              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="interview-difficulty"
              style={{
                fontWeight: "600",
              }}
            >
              Difficulty
            </label>

            <br />

            <select
              id="interview-difficulty"
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value)
              }
              style={{
                padding: "10px",
                marginTop: "7px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                minWidth: "150px",
              }}
            >
              {difficulties.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={loadQuestion}
              disabled={
                loading || !studentId
              }
              style={{
                padding: "11px 20px",
                border: "none",
                borderRadius: "8px",
                cursor:
                  loading || !studentId
                    ? "not-allowed"
                    : "pointer",
                background: "#222",
                color: "#fff",
              }}
            >
              {loading
                ? "Loading..."
                : "🎯 Get Question"}
            </button>
          </div>
        </div>
      </div>

      {/* Question */}
      {question && (
        <div
          style={{
            padding: "25px",
            borderRadius: "12px",
            border: "1px solid #ddd",
            marginBottom: "20px",
            background: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "15px",
            }}
          >
            <span
              style={{
                padding: "5px 10px",
                borderRadius: "20px",
                background: "#eef2ff",
                fontSize: "13px",
              }}
            >
              {category}
            </span>

            <span
              style={{
                padding: "5px 10px",
                borderRadius: "20px",
                background: "#f3f3f3",
                fontSize: "13px",
              }}
            >
              {difficulty}
            </span>
          </div>

          <h2
            style={{
              lineHeight: "1.5",
            }}
          >
            {question}
          </h2>

          <textarea
            value={answer}
            onChange={(e) =>
              setAnswer(e.target.value)
            }
            placeholder="Type your interview answer here..."
            rows={8}
            style={{
              width: "100%",
              marginTop: "15px",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              resize: "vertical",
              boxSizing: "border-box",
              fontFamily: "inherit",
              fontSize: "15px",
            }}
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              evaluating || !studentId
            }
            style={{
              marginTop: "15px",
              padding: "12px 25px",
              border: "none",
              borderRadius: "8px",
              cursor:
                evaluating || !studentId
                  ? "not-allowed"
                  : "pointer",
              background: "#222",
              color: "#fff",
            }}
          >
            {evaluating
              ? "Evaluating..."
              : "🤖 Evaluate My Answer"}
          </button>
        </div>
      )}

      {/* Result */}
      {score !== null && (
        <div
          style={{
            padding: "25px",
            borderRadius: "12px",
            border: "1px solid #ddd",
            marginBottom: "25px",
            background: "#fff",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            📊 Interview Result
          </h2>

          <div
            style={{
              fontSize: "42px",
              fontWeight: "700",
              margin: "15px 0",
            }}
          >
            {score}/100
          </div>

          <p>
            <strong>Feedback:</strong>
          </p>

          <p
            style={{
              lineHeight: "1.6",
              color: "#555",
            }}
          >
            {feedback}
          </p>

          <button
            type="button"
            onClick={loadQuestion}
            disabled={loading}
            style={{
              padding: "10px 20px",
              marginTop: "10px",
              border: "none",
              borderRadius: "8px",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              background: "#222",
              color: "#fff",
            }}
          >
            🔄 Next Question
          </button>
        </div>
      )}

      {/* History */}
      <div
        style={{
          padding: "25px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          background: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            📚 Interview History
          </h2>

          {history.length > 0 && (
            <button
              type="button"
              onClick={handleResetHistory}
              style={{
                padding: "9px 15px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p style={{ color: "#666" }}>
            No interview attempts yet.
          </p>
        ) : (
          history.map((item) => (
            <div
              key={item._id}
              style={{
                padding: "18px 0",
                borderBottom:
                  "1px solid #eee",
              }}
            >
              <div
                style={{
                  marginBottom: "8px",
                }}
              >
                <strong>
                  {item.category}
                </strong>

                <span
                  style={{
                    color: "#666",
                  }}
                >
                  {" "}
                  • {item.difficulty}
                </span>
              </div>

              <p
                style={{
                  fontWeight: "600",
                  lineHeight: "1.5",
                }}
              >
                {item.question}
              </p>

              <p
                style={{
                  color: "#555",
                  lineHeight: "1.5",
                }}
              >
                <strong>
                  Your Answer:
                </strong>{" "}
                {item.answer}
              </p>

              <p>
                <strong>
                  Score: {item.score}/100
                </strong>
              </p>

              <p
                style={{
                  color: "#555",
                  lineHeight: "1.5",
                }}
              >
                <strong>
                  Feedback:
                </strong>{" "}
                {item.feedback}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AIInterviewPage;