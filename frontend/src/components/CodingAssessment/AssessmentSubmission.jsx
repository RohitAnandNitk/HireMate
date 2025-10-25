import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Code, TrendingUp, Clock } from "lucide-react";
import { useEffect, useState } from "react";

export default function AssessmentSubmission() {
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const { statistics, candidateId, driveId, timeTaken } = location.state || {};

  useEffect(() => {
    // If no data is passed, redirect to home or assessment page
    if (!statistics) {
      navigate("/");
    }
  }, [statistics, navigate]);

  if (!statistics) {
    return null;
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const bgColor = darkMode ? "#0d0d0d" : "#ffffff";
  const borderColor = darkMode ? "#2a2a2a" : "#e5e5e5";
  const textColor = darkMode ? "#e0e0e0" : "#000000";
  const cardBg = darkMode ? "#1a1a1a" : "#fafafa";

  const totalProblems = statistics.total_questions || 0;
  const solvedProblems = statistics.problems_solved || 0;
  const totalTime = timeTaken || statistics.total_time_taken || 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "40px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: "800px", width: "100%" }}>
        {/* Success Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              backgroundColor: "#f0fdf4",
              marginBottom: "32px",
            }}
          >
            <CheckCircle size={60} color="#16a34a" strokeWidth={2.5} />
          </div>
          <h1
            style={{
              margin: "0 0 16px 0",
              fontSize: "40px",
              fontWeight: "700",
              color: textColor,
            }}
          >
            Assessment Submitted Successfully!
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "18px",
              color: darkMode ? "#999999" : "#666666",
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: "1.6",
            }}
          >
            Thank you for completing the coding assessment. Your submission has
            been recorded.
          </p>
        </div>

        {/* Statistics Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "24px",
            marginBottom: "48px",
          }}
        >
          {/* Total Problems */}
          <div
            style={{
              padding: "32px 24px",
              backgroundColor: cardBg,
              borderRadius: "12px",
              border: `1px solid ${borderColor}`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                padding: "12px",
                backgroundColor: darkMode ? "#2a2a2a" : "#f5f5f5",
                borderRadius: "12px",
                marginBottom: "16px",
              }}
            >
              <Code size={32} color={darkMode ? "#e0e0e0" : "#000000"} />
            </div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: "700",
                color: darkMode ? "#999999" : "#666666",
                letterSpacing: "1.5px",
                marginBottom: "8px",
              }}
            >
              TOTAL PROBLEMS
            </div>
            <div
              style={{
                fontSize: "48px",
                fontWeight: "700",
                color: textColor,
                lineHeight: "1",
              }}
            >
              {totalProblems}
            </div>
          </div>

          {/* Problems Attempted */}
          <div
            style={{
              padding: "32px 24px",
              backgroundColor: cardBg,
              borderRadius: "12px",
              border: `1px solid ${borderColor}`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                padding: "12px",
                backgroundColor: "#fffbeb",
                borderRadius: "12px",
                marginBottom: "16px",
              }}
            >
              <TrendingUp size={32} color="#d97706" />
            </div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: "700",
                color: darkMode ? "#999999" : "#666666",
                letterSpacing: "1.5px",
                marginBottom: "8px",
              }}
            >
              ATTEMPTED
            </div>
            <div
              style={{
                fontSize: "48px",
                fontWeight: "700",
                color: textColor,
                lineHeight: "1",
              }}
            >
              {solvedProblems}
            </div>
          </div>

          {/* Time Taken */}
          <div
            style={{
              padding: "32px 24px",
              backgroundColor: cardBg,
              borderRadius: "12px",
              border: `1px solid ${borderColor}`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                padding: "12px",
                backgroundColor: "#f0f9ff",
                borderRadius: "12px",
                marginBottom: "16px",
              }}
            >
              <Clock size={32} color="#0284c7" />
            </div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: "700",
                color: darkMode ? "#999999" : "#666666",
                letterSpacing: "1.5px",
                marginBottom: "8px",
              }}
            >
              TIME TAKEN
            </div>
            <div
              style={{
                fontSize: "48px",
                fontWeight: "700",
                color: textColor,
                lineHeight: "1",
              }}
            >
              {formatTime(totalTime)}
            </div>
          </div>
        </div>

        {/* Thank You Message */}
        <div
          style={{
            padding: "32px",
            backgroundColor: cardBg,
            borderRadius: "12px",
            border: `1px solid ${borderColor}`,
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          <h2
            style={{
              margin: "0 0 16px 0",
              fontSize: "24px",
              fontWeight: "700",
              color: textColor,
            }}
          >
            Thank You!
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: "16px",
              color: darkMode ? "#999999" : "#666666",
              lineHeight: "1.8",
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Your submission has been recorded and will be reviewed by our team.
            You will receive feedback via email within 3-5 business days. We
            appreciate your time and effort in completing this assessment.
          </p>
        </div>

        {/* Action Button */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "16px 48px",
              backgroundColor: darkMode ? "#ffffff" : "#000000",
              color: darkMode ? "#000000" : "#ffffff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
