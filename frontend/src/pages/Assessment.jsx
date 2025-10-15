import { useState, useEffect, useRef } from "react";
import { Sun, Moon } from "lucide-react";
import Instructions from "./Instructions";
import Sidebar from "../components/CodingAssessment/Sidebar";
import Problem from "../components/CodingAssessment/Problem";
import CodeEditor from "../components/CodingAssessment/CodeEditor";
import Input from "../components/CodingAssessment/Input";
import Output from "../components/CodingAssessment/Output";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Assessment() {
  const [darkMode, setDarkMode] = useState(true);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // Store code for each problem
  const [problemCode, setProblemCode] = useState({});
  const [language, setLanguage] = useState("python");
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");

  const [dividerPos, setDividerPos] = useState(50);
  const [verticalDividerPos, setVerticalDividerPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isVerticalDragging, setIsVerticalDragging] = useState(false);
  const containerRef = useRef(null);
  const verticalContainerRef = useRef(null);

  // Get current code for selected problem
  const code = problemCode[selectedProblem?.id] || "";

  // Update code for current problem
  const setCode = (newCode) => {
    if (selectedProblem) {
      setProblemCode((prev) => ({
        ...prev,
        [selectedProblem.id]: newCode,
      }));
    }
  };

  useEffect(() => {
    if (assessmentStarted && problems.length === 0) {
      fetchProblems();
    }
  }, [assessmentStarted]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/coding-assessment/problem`);
      if (!response.ok) throw new Error("Failed to fetch problem");

      const data = await response.json();
      setProblems(data);
      setSelectedProblem(data[0]);
    } catch (err) {
      console.error("Error fetching problems:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartAssessment = () => {
    setAssessmentStarted(true);
  };

  const handleRun = async () => {
    try {
      setIsRunning(true);
      setOutput("Running...");

      const response = await fetch(
        `${BASE_URL}/api/coding-assessment/submission/run`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            problem_id: selectedProblem.id,
            language,
            input: customInput,
          }),
        }
      );

      const data = await response.json();
      setOutput(JSON.stringify(data));
    } catch (err) {
      console.error("Error running code:", err);
      setOutput(
        JSON.stringify({
          status: { description: "Connection Error", id: -1 },
          stderr: err.message,
        })
      );
    } finally {
      setIsRunning(false);
    }
  };

  // Horizontal divider (Problem | Editor)
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

  // Vertical divider (Input | Output)
  const handleVerticalMouseDown = () => setIsVerticalDragging(true);

  useEffect(() => {
    const handleMouseUp = () => setIsVerticalDragging(false);
    const handleMouseMove = (e) => {
      if (!isVerticalDragging || !verticalContainerRef.current) return;
      const container = verticalContainerRef.current;
      const rect = container.getBoundingClientRect();
      const newPos = ((e.clientX - rect.left) / rect.width) * 100;
      if (newPos > 20 && newPos < 80) setVerticalDividerPos(newPos);
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isVerticalDragging]);

  if (!assessmentStarted) {
    return (
      <Instructions
        onStartAssessment={handleStartAssessment}
        darkMode={darkMode}
      />
    );
  }

  if (loading) {
    const bgColor = darkMode ? "#0d0d0d" : "#f8f9fa";
    const textColor = darkMode ? "#e0e0e0" : "#1a1a1a";
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: bgColor,
          color: textColor,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2>Loading problems...</h2>
          <p>Please wait while we fetch the assessment questions.</p>
        </div>
      </div>
    );
  }

  if (error) {
    const bgColor = darkMode ? "#0d0d0d" : "#f8f9fa";
    const textColor = darkMode ? "#e0e0e0" : "#1a1a1a";
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: bgColor,
          color: textColor,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2>Error loading problems</h2>
          <p>{error}</p>
          <button
            onClick={fetchProblems}
            style={{
              padding: "10px 20px",
              marginTop: "20px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
      <Sidebar
        problems={problems}
        selectedProblem={selectedProblem}
        onSelectProblem={setSelectedProblem}
        darkMode={darkMode}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
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
            Assessment ({problems.length} Problems)
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

        <div
          ref={containerRef}
          style={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
            position: "relative",
          }}
        >
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

          <div
            onMouseDown={handleMouseDown}
            style={{
              width: "6px",
              backgroundColor: isDragging
                ? darkMode
                  ? "#444"
                  : "#999"
                : borderColor,
              cursor: "col-resize",
              transition: isDragging ? "none" : "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = darkMode ? "#333" : "#bbb";
            }}
            onMouseLeave={(e) => {
              if (!isDragging) e.target.style.backgroundColor = borderColor;
            }}
          />

          <div
            style={{
              width: `${100 - dividerPos}%`,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              backgroundColor: bgColor,
            }}
          >
            <CodeEditor
              code={code}
              setCode={setCode}
              language={language}
              setLanguage={setLanguage}
              onRun={handleRun}
              darkMode={darkMode}
              isRunning={isRunning}
            />

            <div
              ref={verticalContainerRef}
              style={{
                flex: 0.4,
                display: "flex",
                borderTop: `1px solid ${borderColor}`,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{ width: `${verticalDividerPos}%`, overflow: "hidden" }}
              >
                <Input
                  customInput={customInput}
                  setCustomInput={setCustomInput}
                  darkMode={darkMode}
                />
              </div>

              <div
                onMouseDown={handleVerticalMouseDown}
                style={{
                  width: "6px",
                  backgroundColor: isVerticalDragging
                    ? darkMode
                      ? "#444"
                      : "#999"
                    : borderColor,
                  cursor: "col-resize",
                  transition: isVerticalDragging
                    ? "none"
                    : "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = darkMode ? "#333" : "#bbb";
                }}
                onMouseLeave={(e) => {
                  if (!isVerticalDragging)
                    e.target.style.backgroundColor = borderColor;
                }}
              />

              <div
                style={{
                  width: `${100 - verticalDividerPos}%`,
                  overflow: "hidden",
                }}
              >
                <Output output={output} darkMode={darkMode} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
