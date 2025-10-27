import { CheckCircle, XCircle, Circle } from "lucide-react";

export default function Sidebar({
  problems,
  selectedProblem,
  onSelectProblem,
  darkMode,
  problemStatus,
}) {
  const bgColor = darkMode ? "#1a1a1a" : "#ffffff";
  const borderColor = darkMode ? "#2a2a2a" : "#e5e5e5";
  const textColor = darkMode ? "#e0e0e0" : "#000000";
  const hoverBg = darkMode ? "#262626" : "#fafafa";
  const selectedBg = darkMode ? "#2a2a2a" : "#fafafa";

  const getStatusIcon = (problemId) => {
    const status = problemStatus[problemId];
    if (!status)
      return <Circle size={16} color={darkMode ? "#666666" : "#cccccc"} />;

    if (status.result === "Accepted") {
      return <CheckCircle size={16} color="#16a34a" />;
    } else if (status.result) {
      return <XCircle size={16} color="#dc2626" />;
    }
    return <Circle size={16} color={darkMode ? "#666666" : "#cccccc"} />;
  };

  return (
    <div
      style={{
        width: "100px",
        borderRight: `1px solid ${borderColor}`,
        display: "flex",
        flexDirection: "column",
        backgroundColor: bgColor,
        overflowY: "auto",
      }}
    >
      <div
        style={{
          padding: "20px 16px",
          borderBottom: `1px solid ${borderColor}`,
          textAlign: "center",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "1.5px",
            color: darkMode ? "#999999" : "#666666",
          }}
        >
          PROBLEMS
        </h3>
      </div>

      {problems && problems.length > 0 ? (
        problems.map((problem, index) => (
          <button
            key={problem._id}
            onClick={() => onSelectProblem(problem)}
            title={problem.title}
            style={{
              padding: "20px 16px",
              border: "none",
              backgroundColor:
                selectedProblem?._id === problem._id
                  ? selectedBg
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
                  ? `3px solid ${darkMode ? "#ffffff" : "#000000"}`
                  : "3px solid transparent",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
            onMouseEnter={(e) => {
              if (selectedProblem?._id !== problem._id) {
                e.currentTarget.style.backgroundColor = hoverBg;
              }
            }}
            onMouseLeave={(e) => {
              if (selectedProblem?._id !== problem._id) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            <span>{index + 1}</span>
            {getStatusIcon(problem._id)}
          </button>
        ))
      ) : (
        <div
          style={{
            padding: "20px 16px",
            color: darkMode ? "#666666" : "#999999",
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
