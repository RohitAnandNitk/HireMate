// Key changes in Assessment.jsx

// 1. Remove submissionId state (we'll use candidate_id + drive_id instead)
// 2. Update handleRun to send candidate_id and drive_id
// 3. Update handleFinalSubmit to use new /final-submit endpoint

import { useState, useEffect, useRef } from "react";
import { Sun, Moon } from "lucide-react";
import Instructions from "./Instructions";
import Sidebar from "../components/CodingAssessment/Sidebar";
import Problem from "../components/CodingAssessment/Problem";
import CodeEditor from "../components/CodingAssessment/CodeEditor";
import Input from "../components/CodingAssessment/Input";
import Output from "../components/CodingAssessment/Output";
import { useParams } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Assessment() {
  const { driveId: routeDriveId, candidateId: routeCandidateId } = useParams();
  const [darkMode, setDarkMode] = useState(true);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // Assessment details
  const [driveId, setDriveId] = useState(null);
  const [candidateId, setCandidateId] = useState(null);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);

  // Store code for each problem
  const [problemCode, setProblemCode] = useState({});
  const [language, setLanguage] = useState("python");
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");

  // Track submission status for each problem
  const [problemStatus, setProblemStatus] = useState({});

  const [dividerPos, setDividerPos] = useState(50);
  const [verticalDividerPos, setVerticalDividerPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isVerticalDragging, setIsVerticalDragging] = useState(false);
  const containerRef = useRef(null);
  const verticalContainerRef = useRef(null);

  // Get current code for selected problem
  const code = problemCode[selectedProblem?._id] || "";

  // Update code for current problem
  const setCode = (newCode) => {
    if (selectedProblem) {
      setProblemCode((prev) => ({
        ...prev,
        [selectedProblem._id]: newCode,
      }));
    }
  };

  // Handle language change
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);

    // Update the default code for the current problem when language changes
    if (selectedProblem) {
      const defaultCode = getDefaultCode(newLanguage);
      setProblemCode((prev) => ({
        ...prev,
        [selectedProblem._id]: defaultCode,
      }));
    }
  };

  // Timer effect
  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timerActive, timeRemaining]);

  // Fetch problems when assessment starts
  useEffect(() => {
    if (assessmentStarted && problems.length === 0) {
      fetchProblems();
    }
  }, [assessmentStarted]);

  const fetchProblems = async () => {
    try {
      setLoading(true);

      // Priority: Route params > Query params > Default values
      const urlParams = new URLSearchParams(window.location.search);
      const drive_id = routeDriveId || urlParams.get("drive_id");
      const candidate_id = routeCandidateId || urlParams.get("candidate_id");

      // Validation
      if (!drive_id || !candidate_id) {
        throw new Error(
          "Drive ID and Candidate ID are required to start the assessment"
        );
      }

      setDriveId(drive_id);
      setCandidateId(candidate_id);

      console.log("Starting assessment for:", { drive_id, candidate_id });

      // Fetch coding questions for this drive directly
      const questionsResponse = await fetch(
        `${BASE_URL}/api/coding-assessment/problem?drive_id=${drive_id}`
      );

      if (!questionsResponse.ok) {
        if (questionsResponse.status === 404) {
          throw new Error(
            "Drive not found or no coding questions assigned to this assessment."
          );
        }
        throw new Error("Failed to fetch coding questions");
      }

      const questions = await questionsResponse.json();

      if (!questions || questions.length === 0) {
        throw new Error("No coding questions found for this assessment");
      }

      // Transform questions to match frontend format
      const transformedQuestions = questions.map((q, index) => ({
        _id: q._id,
        id: q._id,
        number: index + 1,
        title: q.title,
        description: q.description,
        constraints: q.constraints,
        testCases: q.test_cases.map((tc) => ({
          input: tc.input,
          output: tc.output,
        })),
        difficulty: q.difficulty,
        tags: q.tags,
      }));

      setProblems(transformedQuestions);
      setSelectedProblem(transformedQuestions[0]);

      // Initialize code storage for each problem
      const initialCode = {};
      transformedQuestions.forEach((problem) => {
        initialCode[problem._id] = getDefaultCode(language);
      });
      setProblemCode(initialCode);
    } catch (err) {
      console.error("Error fetching problems:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultCode = (lang) => {
    const templates = {
      python: "# Write your code here\n",
      javascript: "// Write your code here\n",
      java: "// Write your code here\n",
      cpp: "// Write your code here\n",
    };
    return templates[lang] || "";
  };

  const handleStartAssessment = () => {
    setAssessmentStarted(true);
    setTimerActive(true);
  };

  const handleTimeUp = async () => {
    alert("Time's up! Your assessment has been automatically submitted.");
    await handleFinalSubmit();
  };

  const handleRun = async () => {
    if (!selectedProblem || !driveId || !candidateId) {
      setOutput(
        JSON.stringify({
          status: { description: "Error", id: -1 },
          stderr: "Assessment not properly initialized",
        })
      );
      return;
    }

    try {
      setIsRunning(true);
      setOutput("Running...");

      // Send candidate_id and drive_id instead of submission_id
      const response = await fetch(
        `${BASE_URL}/api/coding-assessment/submission/submit-question`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            candidate_id: candidateId,
            drive_id: driveId,
            question_id: selectedProblem._id,
            source_code: code,
            language: language,
            time_taken: 3600 - timeRemaining, // Time spent so far
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit question");
      }

      const data = await response.json();

      // Update problem status
      setProblemStatus((prev) => ({
        ...prev,
        [selectedProblem._id]: {
          result: data.result,
          testCasesPassed: data.test_cases_passed,
          totalTestCases: data.total_test_cases,
        },
      }));

      // Format output
      setOutput(
        JSON.stringify(
          {
            success: data.success,
            result: data.result,
            test_cases_passed: data.test_cases_passed,
            total_test_cases: data.total_test_cases,
            results: data.results,
          },
          null,
          2
        )
      );
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

  const handleFinalSubmit = async () => {
    if (!driveId || !candidateId) {
      alert("Assessment not properly initialized");
      return;
    }

    try {
      // Call final submit endpoint
      const response = await fetch(
        `${BASE_URL}/api/coding-assessment/submission/final-submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            candidate_id: candidateId,
            drive_id: driveId,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const stats = data.statistics;
        alert(
          `Assessment Completed!\n\nQuestions Solved: ${stats.questions_solved}/${stats.total_questions}\nScore: ${stats.score_percentage}%\n\nThank you for completing the assessment!`
        );

        // Optionally redirect to a completion page
        // window.location.href = "/assessment-complete";
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit assessment");
      }
    } catch (err) {
      console.error("Error submitting assessment:", err);
      alert(`Error submitting assessment: ${err.message}`);
    }
  };

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
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
        totalQuestions={problems.length}
        timeLimit={60}
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
          <h2>Loading assessment...</h2>
          <p>Please wait while we fetch your questions.</p>
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
          <h2>Error loading assessment</h2>
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
        problemStatus={problemStatus}
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

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                padding: "6px 12px",
                backgroundColor:
                  timeRemaining < 300
                    ? "#ff4444"
                    : darkMode
                    ? "#2a2a2a"
                    : "#e8e8e8",
                borderRadius: "6px",
                fontWeight: "600",
                fontSize: "16px",
                fontFamily: "monospace",
              }}
            >
              {formatTime(timeRemaining)}
            </div>

            <button
              onClick={handleFinalSubmit}
              style={{
                padding: "6px 16px",
                backgroundColor: "#4caf50",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              Submit Assessment
            </button>

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
              setLanguage={handleLanguageChange}
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
