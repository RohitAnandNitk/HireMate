import Editor from "@monaco-editor/react";
import { Loader2 } from "lucide-react";

const LANGUAGES = [
  { name: "python", label: "Python" },
  { name: "javascript", label: "JavaScript" },
  { name: "java", label: "Java" },
  { name: "cpp", label: "C++" },
];

export default function CodeEditor({
  code,
  setCode,
  language,
  setLanguage,
  onRun,
  darkMode,
  isRunning,
}) {
  const cardBg = darkMode ? "#1a1a1a" : "#ffffff";
  const textColor = darkMode ? "#e0e0e0" : "#1a1a1a";
  const borderColor = darkMode ? "#2a2a2a" : "#d0d0d0";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 0.6,
        overflow: "hidden",
      }}
    >
      {/* Language Selector & Run Button */}
      <div
        style={{
          padding: "12px 20px",
          borderBottom: `1px solid ${borderColor}`,
          display: "flex",
          gap: "8px",
          alignItems: "center",
          backgroundColor: cardBg,
        }}
      >
        <label style={{ fontSize: "13px", fontWeight: "500" }}>Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: "4px",
            border: `1px solid ${borderColor}`,
            backgroundColor: cardBg,
            color: textColor,
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.name} value={lang.name}>
              {lang.label}
            </option>
          ))}
        </select>

        <button
          onClick={onRun}
          disabled={isRunning}
          style={{
            marginLeft: "auto",
            padding: "6px 16px",
            backgroundColor: darkMode ? "#2a2a2a" : "#e8e8e8",
            color: textColor,
            border: `1px solid ${borderColor}`,
            borderRadius: "4px",
            cursor: isRunning ? "not-allowed" : "pointer",
            fontSize: "13px",
            fontWeight: "500",
            transition: "all 0.2s",
            opacity: isRunning ? 0.6 : 1,
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          onMouseEnter={(e) => {
            if (!isRunning) {
              e.target.style.backgroundColor = darkMode ? "#3a3a3a" : "#d8d8d8";
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = darkMode ? "#2a2a2a" : "#e8e8e8";
          }}
        >
          {isRunning && (
            <Loader2
              size={14}
              style={{ animation: "spin 1s linear infinite" }}
            />
          )}
          {isRunning ? "Running..." : "Run Code"}
        </button>
      </div>

      {/* Editor */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <Editor
          height="100%"
          theme={darkMode ? "vs-dark" : "vs-light"}
          language={language}
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "Monaco, Courier New, monospace",
            scrollBeyondLastLine: false,
          }}
        />
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
