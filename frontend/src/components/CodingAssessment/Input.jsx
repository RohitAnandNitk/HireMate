export default function Input({ customInput, setCustomInput, darkMode }) {
  const bgColor = darkMode ? "#1a1a1a" : "#ffffff";
  const borderColor = darkMode ? "#2a2a2a" : "#e5e5e5";
  const textColor = darkMode ? "#e0e0e0" : "#000000";
  const inputBg = darkMode ? "#0d0d0d" : "#fafafa";
  const focusBg = darkMode ? "#1a1a1a" : "#ffffff";
  const focusBorder = darkMode ? "#ffffff" : "#000000";

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        overflow: "hidden",
        backgroundColor: bgColor,
        height: "100%",
      }}
    >
      <label
        style={{
          fontSize: "11px",
          fontWeight: "700",
          marginBottom: "12px",
          color: darkMode ? "#999999" : "#666666",
          letterSpacing: "1.5px",
        }}
      >
        CUSTOM INPUT
      </label>
      <textarea
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        placeholder="Enter custom input for testing..."
        style={{
          flex: 1,
          padding: "12px",
          border: `1px solid ${borderColor}`,
          borderRadius: "6px",
          backgroundColor: inputBg,
          color: textColor,
          fontSize: "13px",
          fontFamily: "Monaco, Courier New, monospace",
          resize: "none",
          outline: "none",
          lineHeight: "1.6",
          transition: "all 0.2s",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = focusBorder;
          e.currentTarget.style.backgroundColor = focusBg;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = borderColor;
          e.currentTarget.style.backgroundColor = inputBg;
        }}
      />
      <div
        style={{
          marginTop: "8px",
          fontSize: "11px",
          color: darkMode ? "#666666" : "#999999",
          fontStyle: "italic",
        }}
      >
        Leave empty to use default test cases
      </div>
    </div>
  );
}
