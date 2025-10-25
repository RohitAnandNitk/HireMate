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
  const bgColor = "#ffffff";
  const cardBg = "#ffffff";
  const textColor = "#000000";
  const borderColor = "#000000";
  const accentColor = "#f5f5f5";

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
        overflow: "hidden",
      }}
    >
      {/* Left Section - Branding */}
      <div
        style={{
          flex: 1,
          padding: "40px 32px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderRight: `2px solid ${borderColor}`,
          backgroundColor: cardBg,
          overflowY: "auto",
          maxHeight: "100vh",
        }}
      >
        <div style={{ marginBottom: "48px" }}>
          <div
            style={{
              fontSize: "42px",
              fontWeight: "900",
              marginBottom: "12px",
              letterSpacing: "-2px",
              border: "4px solid #000000",
              padding: "16px 20px",
              display: "inline-block",
              lineHeight: "1.1",
            }}
          >
            CODE
            <br />
            ASSESSMENT
          </div>
          <div
            style={{
              fontSize: "15px",
              color: "#666666",
              lineHeight: "1.6",
              marginTop: "20px",
              maxWidth: "400px",
            }}
          >
            Test your coding skills with real-world problems. Solve challenges,
            write clean code, and showcase your abilities.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              gap: "14px",
              alignItems: "flex-start",
              padding: "14px",
              border: "2px solid #e0e0e0",
              borderRadius: "8px",
            }}
          >
            <Code
              size={22}
              style={{ marginTop: "2px", color: "#000000", flexShrink: 0 }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: "600",
                  marginBottom: "4px",
                  fontSize: "14px",
                }}
              >
                Real Coding Problems
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#666666",
                  lineHeight: "1.5",
                }}
              >
                Solve actual coding problems with multiple test cases
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "14px",
              alignItems: "flex-start",
              padding: "14px",
              border: "2px solid #e0e0e0",
              borderRadius: "8px",
            }}
          >
            <Clock
              size={22}
              style={{ marginTop: "2px", color: "#000000", flexShrink: 0 }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: "600",
                  marginBottom: "4px",
                  fontSize: "14px",
                }}
              >
                Timed Challenge
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#666666",
                  lineHeight: "1.5",
                }}
              >
                Complete all problems within {timeLimit} minutes
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "14px",
              alignItems: "flex-start",
              padding: "14px",
              border: "2px solid #e0e0e0",
              borderRadius: "8px",
            }}
          >
            <CheckCircle
              size={22}
              style={{ marginTop: "2px", color: "#000000", flexShrink: 0 }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: "600",
                  marginBottom: "4px",
                  fontSize: "14px",
                }}
              >
                Instant Feedback
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#666666",
                  lineHeight: "1.5",
                }}
              >
                Get immediate results with detailed test case outputs
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "14px",
              alignItems: "flex-start",
              padding: "14px",
              border: "2px solid #e0e0e0",
              borderRadius: "8px",
            }}
          >
            <Award
              size={22}
              style={{ marginTop: "2px", color: "#000000", flexShrink: 0 }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: "600",
                  marginBottom: "4px",
                  fontSize: "14px",
                }}
              >
                Auto-graded
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#666666",
                  lineHeight: "1.5",
                }}
              >
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
          padding: "40px 32px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflowY: "auto",
          maxHeight: "100vh",
        }}
      >
        <div style={{ maxWidth: "500px", margin: "0 auto", width: "100%" }}>
          {/* Assessment Header */}
          <div style={{ marginBottom: "32px" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: "2px",
                color: "#666666",
                marginBottom: "8px",
              }}
            >
              ASSESSMENT DETAILS
            </div>
            <h1
              style={{
                margin: "0 0 8px 0",
                fontSize: "28px",
                fontWeight: "700",
              }}
            >
              Coding Challenge
            </h1>
            <div style={{ fontSize: "14px", color: "#666666" }}>
              Put your coding skills to the test
            </div>
          </div>

          {/* Quick Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                padding: "18px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "2px solid #000000",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#666666",
                  marginBottom: "8px",
                  fontWeight: "600",
                  letterSpacing: "0.5px",
                }}
              >
                Total Questions
              </div>
              <div style={{ fontSize: "28px", fontWeight: "700" }}>
                {totalQuestions}
              </div>
            </div>

            <div
              style={{
                padding: "18px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "2px solid #000000",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#666666",
                  marginBottom: "8px",
                  fontWeight: "600",
                  letterSpacing: "0.5px",
                }}
              >
                Time Limit
              </div>
              <div style={{ fontSize: "28px", fontWeight: "700" }}>
                {timeLimit} min
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div style={{ marginBottom: "32px" }}>
            <h3
              style={{
                fontSize: "12px",
                fontWeight: "600",
                marginBottom: "14px",
                color: "#666666",
                letterSpacing: "1px",
              }}
            >
              INSTRUCTIONS
            </h3>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {[
                "Read each problem statement carefully",
                "Write your solution in the code editor",
                "Click 'Run Code' to test against test cases",
                "Switch between problems anytime",
                "Submit before time runs out",
                "All code is auto-saved as you type",
              ].map((instruction, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                    padding: "12px",
                    backgroundColor: "#ffffff",
                    border: "2px solid #e0e0e0",
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                >
                  <div
                    style={{
                      minWidth: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      backgroundColor: "#000000",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: "700",
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div
                    style={{ flex: 1, paddingTop: "2px", lineHeight: "1.5" }}
                  >
                    {instruction}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Note */}
          <div
            style={{
              padding: "14px",
              backgroundColor: "#fffbeb",
              borderRadius: "8px",
              border: "2px solid #f59e0b",
              display: "flex",
              gap: "12px",
              marginBottom: "32px",
            }}
          >
            <AlertCircle
              size={20}
              style={{ marginTop: "2px", flexShrink: 0, color: "#f59e0b" }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: "600",
                  marginBottom: "4px",
                  fontSize: "13px",
                }}
              >
                Important
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#666666",
                  lineHeight: "1.5",
                }}
              >
                Once you start, the timer begins. Ensure stable internet
                connection. Your progress is automatically saved.
              </div>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartClick}
            type="button"
            style={{
              padding: "16px 32px",
              backgroundColor: "#000000",
              color: "#ffffff",
              border: "2px solid #000000",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
              width: "100%",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#333333";
              e.target.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#000000";
              e.target.style.transform = "scale(1)";
            }}
          >
            Start Assessment
          </button>

          <div
            style={{
              marginTop: "14px",
              fontSize: "12px",
              color: "#666666",
              textAlign: "center",
            }}
          >
            Good luck! Do your best 🚀
          </div>
        </div>
      </div>
    </div>
  );
}
