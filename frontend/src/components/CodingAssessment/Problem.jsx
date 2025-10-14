export default function Problem({ problem, darkMode }) {
  const textColor = darkMode ? "#e0e0e0" : "#1a1a1a";
  const accentColor = darkMode ? "#3a3a3a" : "#e8e8e8";

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              opacity: 0.6,
              fontWeight: "600",
              letterSpacing: "1px",
            }}
          >
            PROBLEM #{problem.number}
          </span>
        </div>
        <h1
          style={{ margin: "0 0 16px 0", fontSize: "24px", fontWeight: "700" }}
        >
          {problem.title}
        </h1>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h3
          style={{
            fontSize: "13px",
            fontWeight: "600",
            marginBottom: "8px",
            opacity: 0.8,
          }}
        >
          DESCRIPTION
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            lineHeight: "1.6",
            whiteSpace: "pre-wrap",
            color: textColor,
          }}
        >
          {problem.description}
        </p>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h3
          style={{
            fontSize: "13px",
            fontWeight: "600",
            marginBottom: "8px",
            opacity: 0.8,
          }}
        >
          CONSTRAINTS
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            fontFamily: "monospace",
            color: textColor,
          }}
        >
          {problem.constraints}
        </p>
      </div>

      <div>
        <h3
          style={{
            fontSize: "13px",
            fontWeight: "600",
            marginBottom: "8px",
            opacity: 0.8,
          }}
        >
          TEST CASES
        </h3>
        {problem.testCases.map((tc, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: "12px",
              padding: "12px",
              backgroundColor: accentColor,
              borderRadius: "6px",
              fontSize: "13px",
            }}
          >
            <div style={{ marginBottom: "6px" }}>
              <span style={{ opacity: 0.7 }}>Input: </span>
              <span style={{ fontFamily: "monospace" }}>{tc.input}</span>
            </div>
            <div>
              <span style={{ opacity: 0.7 }}>Output: </span>
              <span style={{ fontFamily: "monospace" }}>{tc.output}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
