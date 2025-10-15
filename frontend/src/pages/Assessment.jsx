import { useState, useEffect, useRef } from "react";
import { Sun, Moon } from "lucide-react";
import Instructions from "./Instructions";
import Sidebar from "../components/CodingAssessment/Sidebar";
import Problem from "../components/CodingAssessment/Problem";
import CodeEditor from "../components/CodingAssessment/CodeEditor";
import Input from "../components/CodingAssessment/Input";
import Output from "../components/CodingAssessment/Output";

const PROBLEMS = [
  {
    id: 1,
    number: 1,
    title: "Sum of Two Numbers",
    description:
      "Given two integers, return their sum.\n\nExample:\nInput: a = 5, b = 3\nOutput: 8",
    constraints: "1 ≤ a, b ≤ 10^9",
    testCases: [
      { input: "5 3", output: "8" },
      { input: "10 20", output: "30" },
      { input: "0 0", output: "0" },
    ],
  },
  {
    id: 2,
    number: 2,
    title: "Reverse String",
    description:
      "Reverse the given string.\n\nExample:\nInput: hello\nOutput: olleh",
    constraints: "1 ≤ length ≤ 10^5",
    testCases: [
      { input: "hello", output: "olleh" },
      { input: "world", output: "dlrow" },
    ],
  },
  {
    id: 3,
    number: 3,
    title: "Check Palindrome",
    description:
      "Check if a string is a palindrome.\n\nExample:\nInput: racecar\nOutput: true",
    constraints: "1 ≤ length ≤ 10^4",
    testCases: [
      { input: "racecar", output: "true" },
      { input: "hello", output: "false" },
    ],
  },
];

export default function Assessment() {
  const [darkMode, setDarkMode] = useState(true);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(PROBLEMS[0]);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
  const [dividerPos, setDividerPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  // Debug: Log when component renders
  console.log("=== Assessment Component Render ===");
  console.log("assessmentStarted:", assessmentStarted);
  console.log("darkMode:", darkMode);

  // Handler function to start assessment
  const handleStartAssessment = () => {
    console.log("handleStartAssessment function called!");
    setAssessmentStarted(true);
  };

  const handleRun = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          problem_id: selectedProblem.id,
          language,
          input: customInput,
        }),
      });

      const data = await response.text();
      setOutput(data);
    } catch (err) {
      setOutput("Error running code");
    }
  };

  const handleMouseDown = () => setIsDragging(true);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const newPos = ((e.clientX - rect.left) / rect.width) * 100;
      if (newPos > 30 && newPos < 70) setDividerPos(newPos);
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDragging]);

  // CONDITIONAL RENDERING: Show Instructions first
  if (!assessmentStarted) {
    console.log("Rendering Instructions page...");
    return (
      <Instructions
        onStartAssessment={handleStartAssessment}
        darkMode={darkMode}
      />
    );
  }

  // After assessment starts: Show main assessment interface
  console.log("Rendering Assessment interface...");

  const bgColor = darkMode ? "#0d0d0d" : "#f8f9fa";
  const cardBg = darkMode ? "#1a1a1a" : "#ffffff";
  const textColor = darkMode ? "#e0e0e0" : "#1a1a1a";
  const borderColor = darkMode ? "#2a2a2a" : "#d0d0d0";

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: "system-ui, -apple-system, sans-serif",
        transition: "all 0.3s ease",
      }}
    >
      {/* Sidebar */}
      <Sidebar
        problems={PROBLEMS}
        selectedProblem={selectedProblem}
        onSelectProblem={setSelectedProblem}
        darkMode={darkMode}
      />

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "12px 20px",
            borderBottom: `1px solid ${borderColor}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: cardBg,
          }}
        >
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
            Assessment
          </h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              display: "flex",
              alignItems: "center",
              color: textColor,
            }}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Content Area with Draggable Divider */}
        <div
          ref={containerRef}
          style={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Left: Problem Statement */}
          <div
            style={{
              width: `${dividerPos}%`,
              borderRight: `1px solid ${borderColor}`,
              overflowY: "auto",
              padding: "20px",
              backgroundColor: bgColor,
            }}
          >
            <Problem problem={selectedProblem} darkMode={darkMode} />
          </div>

          {/* Draggable Divider */}
          <div
            onMouseDown={handleMouseDown}
            style={{
              width: "6px",
              backgroundColor: borderColor,
              cursor: "col-resize",
              transition: isDragging ? "none" : "background-color 0.2s",
              backgroundColor: isDragging
                ? darkMode
                  ? "#444"
                  : "#999"
                : borderColor,
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = darkMode ? "#333" : "#bbb";
            }}
            onMouseLeave={(e) => {
              if (!isDragging) e.target.style.backgroundColor = borderColor;
            }}
          />

          {/* Right: Code Editor & I/O */}
          <div
            style={{
              width: `${100 - dividerPos}%`,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              backgroundColor: bgColor,
            }}
          >
            {/* Code Editor */}
            <CodeEditor
              code={code}
              setCode={setCode}
              language={language}
              setLanguage={setLanguage}
              onRun={handleRun}
              darkMode={darkMode}
            />

            {/* Input & Output */}
            <div
              style={{
                flex: 0.4,
                display: "flex",
                borderTop: `1px solid ${borderColor}`,
                overflow: "hidden",
              }}
            >
              <Input
                customInput={customInput}
                setCustomInput={setCustomInput}
                darkMode={darkMode}
              />
              <Output output={output} darkMode={darkMode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
