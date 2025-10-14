export default function Input({ customInput, setCustomInput, darkMode }) {
  const cardBg = darkMode ? "#1a1a1a" : "#ffffff";
  const textColor = darkMode ? "#e0e0e0" : "#1a1a1a";
  const borderColor = darkMode ? "#2a2a2a" : "#d0d0d0";

  return (
    <div
      style={{
        flex: 1,
        borderRight: `1px solid ${borderColor}`,
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
        INPUT
      </label>
      <textarea
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        placeholder="Enter input here..."
        style={{
          flex: 1,
          padding: "8px",
          border: `1px solid ${borderColor}`,
          borderRadius: "4px",
          backgroundColor: cardBg,
          color: textColor,
          fontSize: "12px",
          fontFamily: "monospace",
          resize: "none",
        }}
      />
    </div>
  );
}
