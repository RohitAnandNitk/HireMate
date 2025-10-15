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
        width: "80px",
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
          style={{
            margin: 0,
            fontSize: "12px",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          Problems
        </h3>
      </div>

      {problems && problems.length > 0 ? (
        problems.map((problem, index) => (
          <button
            key={problem.id}
            onClick={() => onSelectProblem(problem)}
            title={problem.title} // Show title on hover
            style={{
              padding: "16px",
              border: "none",
              backgroundColor:
                selectedProblem?.id === problem.id
                  ? accentColor
                  : "transparent",
              color: textColor,
              textAlign: "center",
              cursor: "pointer",
              borderBottom: `1px solid ${borderColor}`,
              fontSize: "18px",
              fontWeight: "600",
              transition: "all 0.2s",
              borderLeft:
                selectedProblem?.id === problem.id
                  ? `3px solid ${darkMode ? "#fff" : "#000"}`
                  : "3px solid transparent",
            }}
            onMouseEnter={(e) => {
              if (selectedProblem?.id !== problem.id)
                e.target.style.backgroundColor = hoverBg;
            }}
            onMouseLeave={(e) => {
              if (selectedProblem?.id !== problem.id)
                e.target.style.backgroundColor = "transparent";
            }}
          >
            {index + 1}
          </button>
        ))
      ) : (
        <div
          style={{
            padding: "16px",
            color: textColor,
            opacity: 0.7,
            textAlign: "center",
            fontSize: "12px",
          }}
        >
          No problems
        </div>
      )}
    </div>
  );
}
