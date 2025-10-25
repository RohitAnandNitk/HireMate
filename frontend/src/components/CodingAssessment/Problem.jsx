export default function Problem({ problem, darkMode }) {
  const textColor = darkMode ? "#e0e0e0" : "#000000";
  const secondaryColor = darkMode ? "#999999" : "#666666";
  const bgColor = darkMode ? "#1a1a1a" : "#fafafa";
  const borderColor = darkMode ? "#2a2a2a" : "#e5e5e5";

  if (!problem) {
    return (
      <div style={{ padding: "20px", color: textColor }}>
        <p>Loading problem...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px" }}>
      {/* Header Section */}
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              color: secondaryColor,
              fontWeight: "700",
              letterSpacing: "1.5px",
            }}
          >
            PROBLEM #{problem.number}
          </span>
          {problem.difficulty && (
            <span
              style={{
                fontSize: "10px",
                padding: "4px 10px",
                borderRadius: "12px",
                backgroundColor:
                  problem.difficulty === "easy"
                    ? darkMode
                      ? "#1a2e1a"
                      : "#f0fdf4"
                    : problem.difficulty === "medium"
                    ? darkMode
                      ? "#2e2a1a"
                      : "#fffbeb"
                    : darkMode
                    ? "#2e1a1a"
                    : "#fef2f2",
                color:
                  problem.difficulty === "easy"
                    ? "#16a34a"
                    : problem.difficulty === "medium"
                    ? "#d97706"
                    : "#dc2626",
                fontWeight: "700",
                letterSpacing: "0.5px",
              }}
            >
              {problem.difficulty.toUpperCase()}
            </span>
          )}
        </div>

        <h1
          style={{
            margin: "0 0 16px 0",
            fontSize: "28px",
            fontWeight: "700",
            color: textColor,
            lineHeight: "1.3",
          }}
        >
          {problem.title}
        </h1>

        {problem.tags && problem.tags.length > 0 && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {problem.tags.map((tag, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: "11px",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  backgroundColor: bgColor,
                  color: secondaryColor,
                  fontWeight: "600",
                  border: `1px solid ${borderColor}`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      <div style={{ marginBottom: "32px" }}>
        <h3
          style={{
            fontSize: "11px",
            fontWeight: "700",
            marginBottom: "12px",
            color: secondaryColor,
            letterSpacing: "1.5px",
          }}
        >
          DESCRIPTION
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: "15px",
            lineHeight: "1.7",
            whiteSpace: "pre-wrap",
            color: textColor,
          }}
        >
          {problem.description}
        </p>
      </div>

      {/* Constraints */}
      {problem.constraints && (
        <div style={{ marginBottom: "32px" }}>
          <h3
            style={{
              fontSize: "11px",
              fontWeight: "700",
              marginBottom: "12px",
              color: secondaryColor,
              letterSpacing: "1.5px",
            }}
          >
            CONSTRAINTS
          </h3>
          <div
            style={{
              padding: "16px",
              backgroundColor: bgColor,
              borderRadius: "8px",
              borderLeft: `3px solid ${borderColor}`,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                fontFamily: "Monaco, Courier New, monospace",
                color: textColor,
                whiteSpace: "pre-wrap",
                lineHeight: "1.6",
              }}
            >
              {problem.constraints}
            </p>
          </div>
        </div>
      )}

      {/* Test Cases */}
      <div>
        <h3
          style={{
            fontSize: "11px",
            fontWeight: "700",
            marginBottom: "12px",
            color: secondaryColor,
            letterSpacing: "1.5px",
          }}
        >
          TEST CASES
        </h3>
        {problem.testCases && problem.testCases.length > 0 ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {problem.testCases.map((tc, idx) => (
              <div
                key={idx}
                style={{
                  padding: "16px",
                  backgroundColor: bgColor,
                  borderRadius: "8px",
                  fontSize: "13px",
                  border: `1px solid ${borderColor}`,
                }}
              >
                <div style={{ marginBottom: "8px" }}>
                  <span
                    style={{
                      color: secondaryColor,
                      fontWeight: "600",
                      fontSize: "11px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    INPUT
                  </span>
                  <div
                    style={{
                      fontFamily: "Monaco, Courier New, monospace",
                      color: textColor,
                      marginTop: "4px",
                      fontSize: "13px",
                    }}
                  >
                    {tc.input}
                  </div>
                </div>
                <div>
                  <span
                    style={{
                      color: secondaryColor,
                      fontWeight: "600",
                      fontSize: "11px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    OUTPUT
                  </span>
                  <div
                    style={{
                      fontFamily: "Monaco, Courier New, monospace",
                      color: textColor,
                      marginTop: "4px",
                      fontSize: "13px",
                    }}
                  >
                    {tc.output}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: secondaryColor, fontSize: "14px" }}>
            No test cases available
          </p>
        )}
      </div>
    </div>
  );
}
