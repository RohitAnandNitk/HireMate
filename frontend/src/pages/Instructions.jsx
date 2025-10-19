import {
  CheckCircle,
  AlertCircle,
  Clock,
  BookOpen,
  Code,
  Award,
} from "lucide-react";

export default function Instructions({
  onStartAssessment,
  darkMode,
  totalQuestions = 3,
  timeLimit = 60,
}) {
  const bgColor = darkMode ? "#0d0d0d" : "#f8f9fa";
  const cardBg = darkMode ? "#1a1a1a" : "#ffffff";
  const textColor = darkMode ? "#e0e0e0" : "#1a1a1a";
  const borderColor = darkMode ? "#2a2a2a" : "#d0d0d0";
  const accentColor = darkMode ? "#3a3a3a" : "#e8e8e8";

  const handleStartClick = () => {
    console.log("Start button clicked");
    if (typeof onStartAssessment === "function") {
      onStartAssessment();
      console.log("onStartAssessment called successfully");
    } else {
      console.error(
        "ERROR: onStartAssessment is not a function!",
        onStartAssessment
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Left Section - Branding */}
      <div
        style={{
          flex: 1,
          padding: "60px 40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderRight: `1px solid ${borderColor}`,
          backgroundColor: cardBg,
        }}
      >
        <div style={{ marginBottom: "60px" }}>
          <div
            style={{
              fontSize: "48px",
              fontWeight: "900",
              marginBottom: "12px",
              letterSpacing: "-2px",
            }}
          >
            CODE
            <br />
            ASSESSMENT
          </div>
          <div style={{ fontSize: "16px", opacity: 0.7, lineHeight: "1.6" }}>
            Test your coding skills with real-world problems. Solve challenges,
            write clean code, and showcase your abilities.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}
          >
            <Code size={24} style={{ marginTop: "4px", opacity: 0.7 }} />
            <div>
              <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                Real Coding Problems
              </div>
              <div style={{ fontSize: "14px", opacity: 0.7 }}>
                Solve actual coding problems with multiple test cases
              </div>
            </div>
          </div>

          <div
            style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}
          >
            <Clock size={24} style={{ marginTop: "4px", opacity: 0.7 }} />
            <div>
              <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                Timed Challenge
              </div>
              <div style={{ fontSize: "14px", opacity: 0.7 }}>
                Complete all problems within {timeLimit} minutes
              </div>
            </div>
          </div>

          <div
            style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}
          >
            <CheckCircle size={24} style={{ marginTop: "4px", opacity: 0.7 }} />
            <div>
              <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                Instant Feedback
              </div>
              <div style={{ fontSize: "14px", opacity: 0.7 }}>
                Get immediate results with detailed test case outputs
              </div>
            </div>
          </div>

          <div
            style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}
          >
            <Award size={24} style={{ marginTop: "4px", opacity: 0.7 }} />
            <div>
              <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                Auto-graded
              </div>
              <div style={{ fontSize: "14px", opacity: 0.7 }}>
                Solutions are automatically evaluated and scored
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Instructions */}
      <div
        style={{
          flex: 1,
          padding: "60px 40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflowY: "auto",
        }}
      >
        {/* Assessment Header */}
        <div style={{ marginBottom: "40px" }}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: "600",
              letterSpacing: "2px",
              opacity: 0.6,
              marginBottom: "8px",
            }}
          >
            ASSESSMENT DETAILS
          </div>
          <h1
            style={{ margin: "0 0 8px 0", fontSize: "32px", fontWeight: "700" }}
          >
            Coding Challenge
          </h1>
          <div style={{ fontSize: "14px", opacity: 0.7 }}>
            Put your coding skills to the test
          </div>
        </div>

        {/* Quick Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              padding: "16px",
              backgroundColor: accentColor,
              borderRadius: "8px",
              border: `1px solid ${borderColor}`,
            }}
          >
            <div
              style={{ fontSize: "12px", opacity: 0.7, marginBottom: "4px" }}
            >
              Total Questions
            </div>
            <div style={{ fontSize: "28px", fontWeight: "700" }}>
              {totalQuestions}
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              backgroundColor: accentColor,
              borderRadius: "8px",
              border: `1px solid ${borderColor}`,
            }}
          >
            <div
              style={{ fontSize: "12px", opacity: 0.7, marginBottom: "4px" }}
            >
              Time Limit
            </div>
            <div style={{ fontSize: "28px", fontWeight: "700" }}>
              {timeLimit} min
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div style={{ marginBottom: "40px" }}>
          <h3
            style={{
              fontSize: "13px",
              fontWeight: "600",
              marginBottom: "16px",
              opacity: 0.8,
            }}
          >
            INSTRUCTIONS
          </h3>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {[
              "Read each problem statement and constraints carefully",
              "Write your solution in the code editor using your preferred language",
              "Click 'Run Code' to test against all test cases",
              "You can switch between problems anytime during the assessment",
              "Submit your complete assessment before time runs out",
              "All code is auto-saved as you type",
            ].map((instruction, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  padding: "12px",
                  backgroundColor: accentColor,
                  borderRadius: "6px",
                  fontSize: "13px",
                }}
              >
                <div
                  style={{
                    minWidth: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    backgroundColor: darkMode ? "#2a2a2a" : "#d0d0d0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: "600",
                  }}
                >
                  {idx + 1}
                </div>
                <div style={{ flex: 1, paddingTop: "2px" }}>{instruction}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Note */}
        <div
          style={{
            padding: "16px",
            backgroundColor: accentColor,
            borderRadius: "8px",
            border: `1px solid ${borderColor}`,
            display: "flex",
            gap: "12px",
            marginBottom: "40px",
          }}
        >
          <AlertCircle
            size={20}
            style={{ marginTop: "2px", flexShrink: 0, opacity: 0.7 }}
          />
          <div>
            <div
              style={{
                fontWeight: "600",
                marginBottom: "4px",
                fontSize: "13px",
              }}
            >
              Important
            </div>
            <div style={{ fontSize: "12px", opacity: 0.8, lineHeight: "1.5" }}>
              Once you start, the timer begins. Ensure stable internet
              connection and close unnecessary applications. Your progress is
              automatically saved.
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartClick}
          type="button"
          style={{
            padding: "14px 32px",
            backgroundColor: darkMode ? "#ffffff" : "#000000",
            color: darkMode ? "#000000" : "#ffffff",
            border: "none",
            borderRadius: "6px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s",
            width: "100%",
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = "0.85";
            e.target.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = "1";
            e.target.style.transform = "scale(1)";
          }}
        >
          Start Assessment
        </button>

        <div
          style={{
            marginTop: "16px",
            fontSize: "12px",
            opacity: 0.6,
            textAlign: "center",
          }}
        >
          Good luck! Do your best 🚀
        </div>
      </div>
    </div>
  );
}
