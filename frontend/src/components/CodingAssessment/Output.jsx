import { CheckCircle, XCircle, Clock, Info, AlertTriangle } from "lucide-react";

export default function Output({ output, darkMode }) {
  let parsedOutput = null;
  let isError = false;
  let isSuccess = false;
  let testResults = null;

  try {
    if (output && typeof output === "string" && output.trim().startsWith("{")) {
      parsedOutput = JSON.parse(output);

      if (parsedOutput.success !== undefined) {
        testResults = parsedOutput;
        isSuccess = parsedOutput.result === "Accepted";
        isError = !isSuccess && parsedOutput.result !== undefined;
      } else if (parsedOutput.status?.id !== 3 || parsedOutput.stderr) {
        isError = true;
      } else if (parsedOutput.stdout) {
        isSuccess = true;
      }
    }
  } catch (e) {
    // Not JSON
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        overflow: "hidden",
        backgroundColor: "#ffffff",
      }}
    >
      <label
        style={{
          fontSize: "11px",
          fontWeight: "700",
          marginBottom: "12px",
          color: "#999999",
          letterSpacing: "1.5px",
        }}
      >
        OUTPUT
      </label>

      <div
        style={{
          flex: 1,
          overflow: "auto",
          border: "1px solid #e5e5e5",
          borderRadius: "6px",
          backgroundColor: "#fafafa",
        }}
      >
        {!output ? (
          <div
            style={{
              padding: "40px 20px",
              textAlign: "center",
              color: "#999999",
            }}
          >
            <Info size={32} style={{ marginBottom: "12px", opacity: 0.5 }} />
            <p style={{ margin: 0, fontSize: "13px" }}>
              Run your code to see output here
            </p>
          </div>
        ) : testResults ? (
          <div style={{ padding: "16px" }}>
            {/* Overall Status */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px",
                borderRadius: "8px",
                marginBottom: "16px",
                backgroundColor: isSuccess
                  ? "#f0fdf4"
                  : isError
                  ? "#fef2f2"
                  : "#fffbeb",
                border: "none",
              }}
            >
              {isSuccess ? (
                <CheckCircle size={20} color="#16a34a" />
              ) : isError ? (
                <XCircle size={20} color="#dc2626" />
              ) : (
                <AlertTriangle size={20} color="#d97706" />
              )}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "14px",
                    color: isSuccess
                      ? "#16a34a"
                      : isError
                      ? "#dc2626"
                      : "#d97706",
                  }}
                >
                  {testResults.result || "Unknown"}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#666666",
                    marginTop: "2px",
                  }}
                >
                  {testResults.test_cases_passed || 0} /{" "}
                  {testResults.total_test_cases || 0} test cases passed
                </div>
              </div>
            </div>

            {/* Test Results */}
            {testResults.results && testResults.results.length > 0 && (
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    marginBottom: "12px",
                    color: "#999999",
                    letterSpacing: "1.5px",
                  }}
                >
                  TEST CASE DETAILS
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {testResults.results.map((result, idx) => {
                    const isPassed = result.result === "Accepted";
                    return (
                      <div
                        key={idx}
                        style={{
                          padding: "12px",
                          backgroundColor: "#ffffff",
                          borderRadius: "6px",
                          fontSize: "12px",
                          borderLeft: `3px solid ${
                            isPassed ? "#16a34a" : "#dc2626"
                          }`,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "8px",
                            fontWeight: "600",
                          }}
                        >
                          {isPassed ? (
                            <CheckCircle size={14} color="#16a34a" />
                          ) : (
                            <XCircle size={14} color="#dc2626" />
                          )}
                          <span style={{ color: "#000000" }}>
                            Test Case {result.test_case_number || idx + 1}
                          </span>
                        </div>
                        <div
                          style={{
                            paddingLeft: "22px",
                            color: "#666666",
                            lineHeight: "1.6",
                          }}
                        >
                          <div style={{ marginBottom: "4px" }}>
                            <span
                              style={{ fontSize: "11px", color: "#999999" }}
                            >
                              INPUT:{" "}
                            </span>
                            <span
                              style={{
                                fontFamily: "monospace",
                                color: "#333333",
                              }}
                            >
                              {result.stdin || "N/A"}
                            </span>
                          </div>
                          <div style={{ marginBottom: "4px" }}>
                            <span
                              style={{ fontSize: "11px", color: "#999999" }}
                            >
                              EXPECTED:{" "}
                            </span>
                            <span
                              style={{
                                fontFamily: "monospace",
                                color: "#333333",
                              }}
                            >
                              {result.expected || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span
                              style={{ fontSize: "11px", color: "#999999" }}
                            >
                              OUTPUT:{" "}
                            </span>
                            <span
                              style={{
                                fontFamily: "monospace",
                                color: isPassed ? "#16a34a" : "#dc2626",
                                fontWeight: "600",
                              }}
                            >
                              {result.stdout || result.stderr || "No output"}
                            </span>
                          </div>
                          {result.time && (
                            <div
                              style={{
                                marginTop: "6px",
                                fontSize: "10px",
                                color: "#999999",
                              }}
                            >
                              Execution time: {result.time}s
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
          <div style={{ padding: "16px" }}>
            {/* Legacy Output */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px",
                borderRadius: "6px",
                marginBottom: "16px",
                backgroundColor: isError
                  ? "#fef2f2"
                  : isSuccess
                  ? "#f0fdf4"
                  : "#f0f9ff",
              }}
            >
              {isError ? (
                <XCircle size={18} color="#dc2626" />
              ) : isSuccess ? (
                <CheckCircle size={18} color="#16a34a" />
              ) : (
                <Info size={18} color="#0284c7" />
              )}
              <span
                style={{
                  fontWeight: "600",
                  fontSize: "13px",
                  color: "#000000",
                }}
              >
                {parsedOutput.status?.description || "Unknown Status"}
              </span>
              {parsedOutput.time && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "11px",
                    color: "#999999",
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

            {isSuccess && parsedOutput.stdout && (
              <pre
                style={{
                  margin: 0,
                  padding: "12px",
                  backgroundColor: "#ffffff",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontFamily: "Monaco, Courier New, monospace",
                  color: "#000000",
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  lineHeight: "1.6",
                }}
              >
                {parsedOutput.stdout}
              </pre>
            )}

            {isError && parsedOutput.stderr && (
              <pre
                style={{
                  margin: 0,
                  padding: "12px",
                  backgroundColor: "#ffffff",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontFamily: "Monaco, Courier New, monospace",
                  color: "#dc2626",
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  lineHeight: "1.6",
                }}
              >
                {parsedOutput.stderr}
              </pre>
            )}
          </div>
        ) : (
          <pre
            style={{
              margin: 0,
              padding: "16px",
              fontSize: "12px",
              fontFamily: "Monaco, Courier New, monospace",
              color: "#000000",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              lineHeight: "1.6",
            }}
          >
            {output}
          </pre>
        )}
      </div>
    </div>
  );
}
