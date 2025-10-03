import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  Settings,
  Monitor,
  Loader2,
  AlertCircle,
} from "lucide-react";

import Vapi from "@vapi-ai/web";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const InterviewPage = () => {
  // Get drive ID from URL params
  const { driveId } = useParams();
  console.log("Drive ID from URL:", driveId);

  // Get user data and prompt from location state
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, prompt } = location.state || {};

  // State management
  const [resumeText, setResumeText] = useState(userData?.resume_content || "");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [vapiClient, setVapiClient] = useState(null);
  const [isVapiReady, setIsVapiReady] = useState(false);

  // New states for interview completion check
  const [isCheckingCompletion, setIsCheckingCompletion] = useState(true);
  const [interviewAlreadyCompleted, setInterviewAlreadyCompleted] =
    useState(false);

  // Check if interview is already completed
  const checkInterviewCompletion = useCallback(async () => {
    if (!driveId) {
      setConnectionError("Drive ID is required");
      setIsCheckingCompletion(false);
      return;
    }

    try {
      setIsCheckingCompletion(true);
      console.log("🔍 Checking interview completion status...");

      const response = await fetch(
        `${BASE_URL}/api/interview/candidate/${driveId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📋 Interview status response:", data);

      // Check if interview is completed
      if (data.interview_completed && data.interview_completed !== "no") {
        console.log("⚠️ Interview already completed");
        setInterviewAlreadyCompleted(true);

        // Navigate to interview already done page after a brief delay
        // setTimeout(() => {
        //   navigate("/interview-already-completed", {
        //     state: {
        //       userData,
        //       driveId,
        //       completionData: data,
        //     },
        //   });
        // }, 2000);
      } else {
        console.log("✅ Interview not completed yet, proceeding...");
        setInterviewAlreadyCompleted(false);
      }
    } catch (error) {
      console.error("❌ Error checking interview completion:", error);
      setConnectionError(`Failed to check interview status: ${error.message}`);
    } finally {
      setIsCheckingCompletion(false);
    }
  }, [driveId, navigate, userData]);

  // Initialize VAPI client
  const initializeVapi = useCallback(() => {
    // Don't initialize if interview is already completed
    if (interviewAlreadyCompleted) {
      return null;
    }

    const apiKey = import.meta.env.VITE_PUBLIC_VAPI_API_KEY;

    if (!apiKey) {
      console.error("❌ Missing VAPI API Key. Check your .env file.");
      setConnectionError("Missing API configuration");
      setIsConnecting(false);
      return null;
    }

    if (!resumeText) {
      console.warn("⚠️ No resume text available");
      setConnectionError("No resume data available");
      setIsConnecting(false);
      return null;
    }

    console.log("🔄 Initializing VAPI client...");
    setIsConnecting(true);
    setConnectionError(null);

    try {
      const client = new Vapi(apiKey);

      if (!client) {
        throw new Error("Failed to create VAPI client instance");
      }

      let finalMessages = [];

      // Handle incoming messages
      client.on("message", (msg) => {
        console.log("📨 VAPI message received:", msg);

        if (msg.messages && Array.isArray(msg.messages)) {
          finalMessages = msg.messages;
          setConversation([...msg.messages]);

          const lastAssistantMessage = msg.messages
            .filter((m) => m.role === "assistant")
            .pop();

          if (lastAssistantMessage) {
            const questionText =
              lastAssistantMessage.message || lastAssistantMessage.content;
            setCurrentQuestion(questionText);
            console.log("🤖 Current question:", questionText);
          }
        }
      });

      // Handle call start
      client.on("call-start", () => {
        console.log("✅ Interview call started");
        setInterviewStarted(true);
        setIsRecording(true);
        setIsConnecting(false);
        setCurrentQuestion("Interview started. Please introduce yourself.");
      });

      // Handle call end
      client.on("call-end", async () => {
        console.log("🛑 Interview ended");
        setInterviewStarted(false);
        setIsRecording(false);
        setIsConnecting(false);

        // Process conversation for evaluation
        const conversationOnly = finalMessages
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({
            role: m.role,
            content: m.message || m.content,
            timestamp: m.time,
            secondsFromStart: m.secondsFromStart,
          }));

        // Send for evaluation
        if (conversationOnly.length > 0) {
          try {
            console.log("📊 Sending conversation for evaluation...");
            const res = await fetch(`${BASE_URL}/api/interview/evaluate`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                resumeText,
                transcript: conversationOnly,
                driveId,
              }),
            });

            if (res.ok) {
              const data = await res.json();
              console.log(
                "✅ Evaluation Result:",
                data.decision,
                data.feedback
              );
            } else {
              console.error("❌ Evaluation failed:", res.status);
            }
          } catch (err) {
            console.error("❌ Evaluation error:", err);
          }
        }
      });

      // Handle errors
      client.on("error", (error) => {
        console.error("❌ VAPI error:", error);
        setConnectionError(`Connection error: ${error.message || error}`);
        setIsConnecting(false);
        setInterviewStarted(false);
        setIsRecording(false);
      });

      // Handle speech start/end for better UX
      client.on("speech-start", () => {
        console.log("🗣️ User started speaking");
      });

      client.on("speech-end", () => {
        console.log("🤫 User stopped speaking");
      });

      setVapiClient(client);
      setIsVapiReady(true);
      setIsConnecting(false);
      console.log("✅ VAPI client initialized successfully");

      return client;
    } catch (error) {
      console.error("❌ Failed to initialize VAPI:", error);
      setConnectionError(`Failed to initialize: ${error.message}`);
      setIsConnecting(false);
      setIsVapiReady(false);
      return null;
    }
  }, [resumeText, driveId, interviewAlreadyCompleted]);

  // Start interview function
  const handleStartInterview = useCallback(async () => {
    if (!vapiClient || !resumeText) {
      console.error(
        "❌ Cannot start interview: missing vapiClient or resumeText"
      );
      setConnectionError("Cannot start interview - missing requirements");
      return;
    }

    if (!prompt) {
      console.error("❌ No interview prompt available");
      setConnectionError("No interview configuration available");
      return;
    }

    setIsConnecting(true);
    setConnectionError(null);

    try {
      console.log("🚀 Starting interview with prompt...");

      await vapiClient.start({
        model: {
          provider: "openai",
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: prompt,
            },
          ],
        },
        voice: {
          provider: "11labs", // or "deepgram" based on your preference
          voiceId: "21m00Tcm4TlvDq8ikWAM", // Professional voice
        },
      });

      console.log("✅ Interview start request sent");
    } catch (error) {
      console.error("❌ Failed to start interview:", error);
      setConnectionError(`Failed to start: ${error.message}`);
      setIsConnecting(false);
    }
  }, [vapiClient, resumeText, prompt]);

  // End interview function
  const handleEndInterview = useCallback(async () => {
    console.log("🛑 User clicked End Interview button");

    // Immediately stop the interview
    if (vapiClient && typeof vapiClient.stop === "function") {
      setIsConnecting(true);
      try {
        console.log("🛑 Stopping VAPI client...");
        await vapiClient.stop();
        console.log("✅ VAPI client stopped successfully");
      } catch (error) {
        console.error("❌ Error stopping VAPI client:", error);
      }
    }

    // Process current conversation data
    const conversationData = conversation
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role,
        content: m.message || m.content,
        timestamp: m.time,
        secondsFromStart: m.secondsFromStart,
      }));

    console.log(
      "📋 Processed conversation for completion page:",
      conversationData.length,
      "messages"
    );

    // Update UI state
    setInterviewStarted(false);
    setIsRecording(false);
    setIsConnecting(false);

    // Navigate immediately to completion page with all data
    navigate("/interview-completion", {
      state: {
        userData,
        driveId,
        resumeText,
        conversation: conversationData,
      },
    });
  }, [vapiClient, conversation, navigate, userData, driveId, resumeText]);

  // Check interview completion when component mounts
  useEffect(() => {
    checkInterviewCompletion();
  }, [checkInterviewCompletion]);

  // Initialize VAPI when component mounts or dependencies change
  useEffect(() => {
    let client = null;

    if (
      resumeText &&
      !vapiClient &&
      !isCheckingCompletion &&
      !interviewAlreadyCompleted
    ) {
      client = initializeVapi();
    }

    // Cleanup function
    return () => {
      if (client && typeof client.stop === "function") {
        console.log("🧹 Cleaning up VAPI client...");
        try {
          const stopPromise = client.stop();
          if (stopPromise && typeof stopPromise.catch === "function") {
            stopPromise.catch(console.error);
          }
        } catch (error) {
          console.error("Error during VAPI cleanup:", error);
        }
      }
    };
  }, [
    resumeText,
    initializeVapi,
    vapiClient,
    isCheckingCompletion,
    interviewAlreadyCompleted,
  ]);

  // Auto-start interview when VAPI is ready
  useEffect(() => {
    if (
      isVapiReady &&
      vapiClient &&
      resumeText &&
      !interviewStarted &&
      !isConnecting &&
      !interviewAlreadyCompleted
    ) {
      console.log("🎬 Auto-starting interview...");
      // Add a small delay to ensure everything is properly initialized
      const timer = setTimeout(() => {
        handleStartInterview();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [
    isVapiReady,
    vapiClient,
    resumeText,
    interviewStarted,
    isConnecting,
    handleStartInterview,
    interviewAlreadyCompleted,
  ]);

  // Connection status component
  const ConnectionStatus = () => {
    if (isCheckingCompletion) {
      return (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          Checking interview status...
        </div>
      );
    }

    if (interviewAlreadyCompleted) {
      return (
        <div className="flex items-center gap-2 text-sm text-orange-600">
          <AlertCircle className="w-4 h-4" />
          Interview already completed
        </div>
      );
    }

    if (isConnecting) {
      return (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          Connecting...
        </div>
      );
    }

    if (connectionError) {
      return (
        <div className="text-sm text-red-600">Error: {connectionError}</div>
      );
    }

    if (interviewStarted) {
      return (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Interview Active
        </div>
      );
    }

    if (isVapiReady) {
      return <div className="text-sm text-gray-600">Ready to start</div>;
    }

    return <div className="text-sm text-gray-400">Initializing...</div>;
  };

  // Show interview already completed message
  if (interviewAlreadyCompleted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Interview Already Completed
          </h2>
          <p className="text-gray-600 mb-6">
            You have already completed your interview for this position. Thank
            You!
          </p>
          {/* <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Redirecting...
          </div> */}
        </div>
      </div>
    );
  }

  // Show loading state while checking completion
  if (isCheckingCompletion) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
          <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Preparing Interview
          </h2>
          <p className="text-gray-600">
            Checking your interview status and preparing the session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Live Interview Session
              </h1>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      interviewStarted ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></div>
                  {userData?.name || "Candidate"} • Mock Interview
                </div>
                <ConnectionStatus />
              </div>
            </div>
            {interviewStarted && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-900">Live</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Video Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* AI Interviewer Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center relative">
              <div className="text-center p-4">
                <h3 className="text-white text-lg font-medium mb-2">
                  AI Interviewer
                </h3>
                {isConnecting && (
                  <Loader2 className="w-6 h-6 text-white animate-spin mx-auto" />
                )}
              </div>
              {interviewStarted && (
                <div className="absolute top-4 right-4 bg-white bg-opacity-20 text-white px-2 py-1 rounded text-xs">
                  Speaking
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="text-sm text-gray-600 italic min-h-[40px]">
                {connectionError ? (
                  <span className="text-red-600">
                    Connection Error: {connectionError}
                  </span>
                ) : currentQuestion ? (
                  currentQuestion
                ) : isConnecting ? (
                  "Connecting to interviewer..."
                ) : (
                  "Waiting to start interview..."
                )}
              </p>
            </div>
          </div>

          {/* Candidate Video Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden relative">
            <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
              <div className="text-gray-400 text-center">
                <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Video will be implemented here</p>
              </div>

              {/* Recording Indicator */}
              {isRecording && (
                <div className="absolute top-4 left-4 bg-red-500 bg-opacity-90 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  Recording
                </div>
              )}

              {/* Connection Status Overlay */}
              {isConnecting && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p className="text-sm">Connecting...</p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">
                  {userData?.name || "Candidate"}
                </span>
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      connectionError
                        ? "bg-red-500"
                        : interviewStarted
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  ></div>
                  <span className="text-xs text-gray-600">
                    {connectionError
                      ? "Connection Error"
                      : interviewStarted
                      ? "Connected"
                      : "Connecting"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-center gap-4">
          {/* Microphone Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            disabled={!interviewStarted}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              !interviewStarted
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : isMuted
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {isMuted ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          {/* Video Toggle */}
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            disabled={!interviewStarted}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              !interviewStarted
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : isVideoOff
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {isVideoOff ? (
              <VideoOff className="w-5 h-5" />
            ) : (
              <Video className="w-5 h-5" />
            )}
          </button>

          {/* Start/End Call */}
          {!interviewStarted ? (
            <button
              onClick={handleStartInterview}
              disabled={
                !isVapiReady || !resumeText || isConnecting || !!connectionError
              }
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isVapiReady && resumeText && !isConnecting && !connectionError
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isConnecting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Phone className="w-5 h-5" />
              )}
            </button>
          ) : (
            <button
              onClick={handleEndInterview}
              disabled={false}
              className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
              title="End Interview"
            >
              <Phone className="w-5 h-5" />
            </button>
          )}

          {/* Settings */}
          <button
            disabled={isConnecting}
            className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Screen Share */}
          <button
            disabled={!interviewStarted || isConnecting}
            className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <Monitor className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
