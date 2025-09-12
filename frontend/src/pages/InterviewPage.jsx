import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  Settings,
  Monitor,
} from "lucide-react";
import { getMockInterviewPrompt } from "../Prompts/MockInterviewPrompt";
import Vapi from "@vapi-ai/web"; // make sure you installed this
import config from "../Config/BaseURL";
const BASE_URL = config.BASE_URL;

const InterviewPage = () => {
  const location = useLocation();
  const resumeData = location.state?.resumeData; // ✅ get from router state
  const resumeText = resumeData?.resume_content || "";

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [vapiClient, setVapiClient] = useState(null);

  // Vapi setup
  useEffect(() => {
    if (!resumeText) return;

    console.log(
      "Resume Text received in InterviewPage:",
      resumeText.substring(0, 100)
    );

    const apiKey = import.meta.env.VITE_PUBLIC_VAPI_API_KEY;
    if (!apiKey) {
      console.error("❌ Missing VAPI API Key. Check your .env file.");
      return;
    }

    const client = new Vapi(apiKey);
    let finalMessages = [];

    client.on("message", (msg) => {
      if (msg.messages && Array.isArray(msg.messages)) {
        finalMessages = msg.messages;
        setConversation([...msg.messages]);

        const lastAssistantMessage = msg.messages
          .filter((m) => m.role === "assistant")
          .pop();

        if (lastAssistantMessage) {
          setCurrentQuestion(
            lastAssistantMessage.message || lastAssistantMessage.content
          );
        }
      }
    });

    client.on("call-end", async () => {
      console.log("Interview ended 🛑");
      setInterviewStarted(false);
      setIsRecording(false);

      const conversationOnly = finalMessages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({
          role: m.role,
          content: m.message || m.content,
          timestamp: m.time,
          secondsFromStart: m.secondsFromStart,
        }));

      try {
        const res = await fetch(`${BASE_URL}/api/interview/evaluate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeText, transcript: conversationOnly }),
        });
        const data = await res.json();
        console.log("Evaluation Result:", data.decision, data.feedback);
      } catch (err) {
        console.error("Evaluation error:", err);
      }
    });

    client.on("error", (error) => console.error("Vapi error:", error));
    setVapiClient(client);

    return () => {
      if (client) {
        client.stop().catch(console.error);
      }
    };
  }, [resumeText]);

  // Start interview
  const handleStartInterview = async () => {
    if (!vapiClient || !resumeText) {
      console.error("Cannot start interview: missing vapiClient or resumeText");
      return;
    }

    try {
      await vapiClient.start({
        model: {
          provider: "openai",
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: getMockInterviewPrompt(resumeText),
            },
          ],
        },
      });

      setInterviewStarted(true);
      setIsRecording(true);
      setCurrentQuestion("Starting interview...");
    } catch (error) {
      console.error("Vapi start error:", error);
    }
  };

  // End interview
  const handleEndInterview = async () => {
    if (vapiClient) {
      try {
        await vapiClient.stop();
      } catch (error) {
        console.error("Error stopping interview:", error);
      }
    }
    setInterviewStarted(false);
    setIsRecording(false);
  };

  // ✅ Auto-start interview when everything is ready
  useEffect(() => {
    if (vapiClient && resumeText && !interviewStarted) {
      console.log("Auto-starting interview...");
      handleStartInterview();
    }
  }, [vapiClient, resumeText]);

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
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  {resumeData?.name || "Candidate"} • Mock Interview
                </div>
                <div className="text-sm text-gray-600">
                  {interviewStarted ? "In Progress" : "Not Started"}
                </div>
              </div>
            </div>
            {interviewStarted && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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
              <div className="text-center">
                <h3 className="text-white text-lg font-medium mb-2">
                  AI Interviewer
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-white text-sm opacity-80">
                    {currentQuestion || "Waiting..."}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm text-gray-600 italic">
                {currentQuestion ||
                  `"Tell me about your experience with React and how you've used it in previous projects."`}
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
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">
                  {resumeData?.name || "Candidate"}
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Good Connection</span>
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
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isMuted
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
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isVideoOff
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
              disabled={!resumeText || !vapiClient}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                resumeText && vapiClient
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Phone className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleEndInterview}
              className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
            >
              <Phone className="w-5 h-5" />
            </button>
          )}

          {/* Settings */}
          <button className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors">
            <Settings className="w-5 h-5" />
          </button>

          {/* Screen Share */}
          <button className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors">
            <Monitor className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
