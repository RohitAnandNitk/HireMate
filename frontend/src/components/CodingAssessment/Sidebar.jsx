import { CheckCircle, XCircle, Circle } from "lucide-react";

export default function Sidebar({
  problems,
  selectedProblem,
  onSelectProblem,
  darkMode,
  problemStatus,
}) {
  const cardBg = darkMode ? "#1a1a1a" : "#ffffff";
  const textColor = darkMode ? "#e0e0e0" : "#1a1a1a";
  const borderColor = darkMode ? "#2a2a2a" : "#d0d0d0";
  const hoverBg = darkMode ? "#262626" : "#f0f0f0";
  const accentColor = darkMode ? "#3a3a3a" : "#e8e8e8";

  const getStatusIcon = (problemId) => {
    const status = problemStatus[problemId];
    if (!status) return <Circle size={16} />;

    if (status.result === "Accepted") {
      return <CheckCircle size={16} color="#4caf50" />;
    } else if (status.result) {
      return <XCircle size={16} color="#f44336" />;
    }
    return <Circle size={16} />;
  };

  return (
    <div
      style={{
        width: "100px",
        borderRight: `1px solid ${borderColor}`,
        display: "flex",
        flexDirection: "column",
        backgroundColor: cardBg,
        overflowY: "auto",
      }}
    >
      <div
        style={{
          padding: "16px",
          borderBottom: `1px solid ${borderColor}`,
          textAlign: "center",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          Problems
        </h3>
      </div>

      {problems && problems.length > 0 ? (
        problems.map((problem, index) => (
          <button
            key={problem._id}
            onClick={() => onSelectProblem(problem)}
            title={problem.title}
            style={{
              padding: "16px",
              border: "none",
              backgroundColor:
                selectedProblem?._id === problem._id
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
                selectedProblem?._id === problem._id
                  ? `3px solid ${darkMode ? "#fff" : "#000"}`
                  : "3px solid transparent",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              if (selectedProblem?._id !== problem._id)
                e.target.style.backgroundColor = hoverBg;
            }}
            onMouseLeave={(e) => {
              if (selectedProblem?._id !== problem._id)
                e.target.style.backgroundColor = "transparent";
            }}
          >
            <span>{index + 1}</span>
            {getStatusIcon(problem._id)}
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
