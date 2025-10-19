import { CheckCircle, XCircle, Clock, Info, AlertTriangle } from "lucide-react";

export default function Output({ output, darkMode }) {
  const cardBg = darkMode ? "#1a1a1a" : "#ffffff";
  const textColor = darkMode ? "#e0e0e0" : "#1a1a1a";
  const borderColor = darkMode ? "#2a2a2a" : "#d0d0d0";
  const successBg = darkMode ? "#1a2e1a" : "#e8f5e9";
  const successColor = darkMode ? "#4caf50" : "#2e7d32";
  const errorBg = darkMode ? "#2e1a1a" : "#ffebee";
  const errorColor = darkMode ? "#f44336" : "#c62828";
  const infoBg = darkMode ? "#1a1a2e" : "#e3f2fd";
  const infoColor = darkMode ? "#2196f3" : "#1565c0";
  const warningBg = darkMode ? "#2e2a1a" : "#fff3e0";
  const warningColor = darkMode ? "#ff9800" : "#e65100";

  // Parse output if it's JSON
  let parsedOutput = null;
  let isError = false;
  let isSuccess = false;
  let testResults = null;

  try {
    if (output && typeof output === "string" && output.trim().startsWith("{")) {
      parsedOutput = JSON.parse(output);

      // Check if it's test results from our API
      if (parsedOutput.success !== undefined) {
        testResults = parsedOutput;
        isSuccess = parsedOutput.result === "Accepted";
        isError = !isSuccess && parsedOutput.result !== undefined;
      }
      // Legacy Judge0 format
      else if (parsedOutput.status?.id !== 3 || parsedOutput.stderr) {
        isError = true;
      } else if (parsedOutput.stdout) {
        isSuccess = true;
      }
    }
  } catch (e) {
    // Not JSON, treat as plain text
  }

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

      <div
        style={{
          flex: 1,
          overflow: "auto",
          border: `1px solid ${borderColor}`,
          borderRadius: "4px",
          backgroundColor: cardBg,
        }}
      >
        {!output ? (
          // No output yet
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: textColor,
              opacity: 0.5,
            }}
          >
            <Info size={32} style={{ marginBottom: "8px", opacity: 0.5 }} />
            <p style={{ margin: 0, fontSize: "13px" }}>
              Run your code to see output here
            </p>
          </div>
        ) : testResults ? (
          // Test results from our API
          <div style={{ padding: "12px" }}>
            {/* Overall Status Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px",
                borderRadius: "6px",
                marginBottom: "12px",
                backgroundColor: isSuccess
                  ? successBg
                  : isError
                  ? errorBg
                  : warningBg,
                border: `1px solid ${
                  isSuccess ? successColor : isError ? errorColor : warningColor
                }`,
              }}
            >
              {isSuccess ? (
                <CheckCircle size={20} color={successColor} />
              ) : isError ? (
                <XCircle size={20} color={errorColor} />
              ) : (
                <AlertTriangle size={20} color={warningColor} />
              )}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "14px",
                    color: isSuccess
                      ? successColor
                      : isError
                      ? errorColor
                      : warningColor,
                  }}
                >
                  {testResults.result || "Unknown"}
                </div>
                <div
                  style={{ fontSize: "12px", opacity: 0.8, marginTop: "2px" }}
                >
                  Test Cases: {testResults.test_cases_passed || 0} /{" "}
                  {testResults.total_test_cases || 0} passed
                </div>
              </div>
            </div>

            {/* Individual Test Results */}
            {testResults.results && testResults.results.length > 0 && (
              <div style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    marginBottom: "8px",
                    opacity: 0.7,
                  }}
                >
                  TEST CASE RESULTS
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {testResults.results.map((result, idx) => {
                    const isPassed = result.result === "Accepted";
                    return (
                      <div
                        key={idx}
                        style={{
                          padding: "10px",
                          backgroundColor: isPassed ? successBg : errorBg,
                          border: `1px solid ${
                            isPassed ? successColor : errorColor
                          }`,
                          borderRadius: "4px",
                          fontSize: "12px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            marginBottom: "6px",
                            fontWeight: "600",
                          }}
                        >
                          {isPassed ? (
                            <CheckCircle size={14} color={successColor} />
                          ) : (
                            <XCircle size={14} color={errorColor} />
                          )}
                          Test Case {result.test_case_number || idx + 1}
                        </div>
                        <div style={{ paddingLeft: "20px" }}>
                          <div style={{ marginBottom: "4px" }}>
                            <span style={{ opacity: 0.7 }}>Input: </span>
                            <span style={{ fontFamily: "monospace" }}>
                              {result.stdin || "N/A"}
                            </span>
                          </div>
                          <div style={{ marginBottom: "4px" }}>
                            <span style={{ opacity: 0.7 }}>Expected: </span>
                            <span style={{ fontFamily: "monospace" }}>
                              {result.expected || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span style={{ opacity: 0.7 }}>Output: </span>
                            <span
                              style={{
                                fontFamily: "monospace",
                                color: isPassed ? successColor : errorColor,
                              }}
                            >
                              {result.stdout || result.stderr || "No output"}
                            </span>
                          </div>
                          {result.time && (
                            <div
                              style={{
                                marginTop: "4px",
                                fontSize: "10px",
                                opacity: 0.7,
                              }}
                            >
                              Time: {result.time}s
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : parsedOutput ? (
          // Legacy Judge0 output
          <div style={{ padding: "12px" }}>
            {/* Status Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                borderRadius: "6px",
                marginBottom: "12px",
                backgroundColor: isError
                  ? errorBg
                  : isSuccess
                  ? successBg
                  : infoBg,
                border: `1px solid ${
                  isError ? errorColor : isSuccess ? successColor : infoColor
                }`,
              }}
            >
              {isError ? (
                <XCircle size={18} color={errorColor} />
              ) : isSuccess ? (
                <CheckCircle size={18} color={successColor} />
              ) : (
                <Info size={18} color={infoColor} />
              )}
              <span
                style={{
                  fontWeight: "600",
                  fontSize: "13px",
                  color: isError
                    ? errorColor
                    : isSuccess
                    ? successColor
                    : infoColor,
                }}
              >
                {parsedOutput.status?.description || "Unknown Status"}
              </span>
              {parsedOutput.time && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "11px",
                    opacity: 0.7,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Clock size={12} />
                  {parsedOutput.time}s
                </span>
              )}
            </div>

            {/* Success Output */}
            {isSuccess && parsedOutput.stdout && (
              <div style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    marginBottom: "6px",
                    opacity: 0.7,
                  }}
                >
                  OUTPUT
                </div>
                <pre
                  style={{
                    margin: 0,
                    padding: "12px",
                    backgroundColor: successBg,
                    border: `1px solid ${successColor}`,
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontFamily: "monospace",
                    color: textColor,
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                  }}
                >
                  {parsedOutput.stdout}
                </pre>
              </div>
            )}

            {/* Error Output */}
            {isError && parsedOutput.stderr && (
              <div style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    marginBottom: "6px",
                    color: errorColor,
                  }}
                >
                  ERROR
                </div>
                <pre
                  style={{
                    margin: 0,
                    padding: "12px",
                    backgroundColor: errorBg,
                    border: `1px solid ${errorColor}`,
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontFamily: "monospace",
                    color: errorColor,
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                  }}
                >
                  {parsedOutput.stderr}
                </pre>
              </div>
            )}

            {/* Compile Output */}
            {parsedOutput.compile_output && (
              <div style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    marginBottom: "6px",
                    opacity: 0.7,
                  }}
                >
                  COMPILE OUTPUT
                </div>
                <pre
                  style={{
                    margin: 0,
                    padding: "12px",
                    backgroundColor: cardBg,
                    border: `1px solid ${borderColor}`,
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontFamily: "monospace",
                    color: textColor,
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                  }}
                >
                  {parsedOutput.compile_output}
                </pre>
              </div>
            )}

            {/* Additional Info */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                marginTop: "12px",
              }}
            >
              {parsedOutput.memory && (
                <div
                  style={{
                    padding: "8px",
                    backgroundColor: darkMode ? "#2a2a2a" : "#f5f5f5",
                    borderRadius: "4px",
                    fontSize: "11px",
                  }}
                >
                  <div style={{ opacity: 0.7, marginBottom: "2px" }}>
                    Memory
                  </div>
                  <div style={{ fontWeight: "600" }}>
                    {parsedOutput.memory} KB
                  </div>
                </div>
              )}
              {parsedOutput.time && (
                <div
                  style={{
                    padding: "8px",
                    backgroundColor: darkMode ? "#2a2a2a" : "#f5f5f5",
                    borderRadius: "4px",
                    fontSize: "11px",
                  }}
                >
                  <div style={{ opacity: 0.7, marginBottom: "2px" }}>Time</div>
                  <div style={{ fontWeight: "600" }}>
                    {parsedOutput.time} sec
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Plain text output (fallback)
          <pre
            style={{
              margin: 0,
              padding: "12px",
              fontSize: "12px",
              fontFamily: "monospace",
              color: textColor,
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {output}
          </pre>
        )}
      </div>
    </div>
  );
}
