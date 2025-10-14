export default function Sidebar({
  problems,
  selectedProblem,
  onSelectProblem,
  darkMode,
}) {
  const cardBg = darkMode ? "#1a1a1a" : "#ffffff";
  const textColor = darkMode ? "#e0e0e0" : "#1a1a1a";
  const borderColor = darkMode ? "#2a2a2a" : "#d0d0d0";
  const hoverBg = darkMode ? "#262626" : "#f0f0f0";
  const accentColor = darkMode ? "#3a3a3a" : "#e8e8e8";

  return (
    <div
      style={{
        width: "240px",
        borderRight: `1px solid ${borderColor}`,
        display: "flex",
        flexDirection: "column",
        backgroundColor: cardBg,
        overflowY: "auto",
      }}
    >
      <div
        style={{ padding: "16px", borderBottom: `1px solid ${borderColor}` }}
      >
        <h3
          style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600" }}
        >
          Problems ({problems.length})
        </h3>
      </div>

      {problems.map((problem) => (
        <button
          key={problem.id}
          onClick={() => onSelectProblem(problem)}
          style={{
            padding: "12px 16px",
            border: "none",
            backgroundColor:
              selectedProblem.id === problem.id ? accentColor : "transparent",
            color: textColor,
            textAlign: "left",
            cursor: "pointer",
            borderBottom: `1px solid ${borderColor}`,
            fontSize: "13px",
            transition: "all 0.2s",
            borderLeft:
              selectedProblem.id === problem.id
                ? `3px solid ${darkMode ? "#fff" : "#000"}`
                : "3px solid transparent",
            paddingLeft: selectedProblem.id === problem.id ? "13px" : "16px",
          }}
          onMouseEnter={(e) => {
            if (selectedProblem.id !== problem.id)
              e.target.style.backgroundColor = hoverBg;
          }}
          onMouseLeave={(e) => {
            if (selectedProblem.id !== problem.id)
              e.target.style.backgroundColor = "transparent";
          }}
        >
          <div style={{ fontSize: "12px", opacity: 0.7, marginBottom: "4px" }}>
            #{problem.number}
          </div>
          <div style={{ fontWeight: "500" }}>{problem.title}</div>
        </button>
      ))}
    </div>
  );
}
