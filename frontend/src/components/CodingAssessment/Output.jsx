export default function Output({ output, darkMode }) {
  const cardBg = darkMode ? "#1a1a1a" : "#ffffff";
  const textColor = darkMode ? "#e0e0e0" : "#1a1a1a";
  const borderColor = darkMode ? "#2a2a2a" : "#d0d0d0";

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "12px",
        overflow: "hidden",
      }}
    >
      <label
        style={{
          fontSize: "12px",
          fontWeight: "600",
          marginBottom: "8px",
          opacity: 0.8,
        }}
      >
        OUTPUT
      </label>
      <pre
        style={{
          flex: 1,
          margin: 0,
          padding: "8px",
          border: `1px solid ${borderColor}`,
          borderRadius: "4px",
          backgroundColor: cardBg,
          color: textColor,
          fontSize: "12px",
          fontFamily: "monospace",
          overflow: "auto",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
        }}
      >
        {output || "Run code to see output..."}
      </pre>
    </div>
  );
}
