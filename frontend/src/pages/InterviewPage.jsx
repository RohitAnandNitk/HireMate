import React, { useState, useEffect } from "react";
import { Mic, MicOff, Video, VideoOff, Phone, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Vapi from "@vapi-ai/web";
import { getMockInterviewPrompt } from "../Prompts/MockInterviewPrompt";
import { useParams } from "react-router-dom";
const InterviewPage = ({ candidateId }) => {
  // Core state
  const [vapiClient, setVapiClient] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [conversation, setConversation] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(
    "Waiting for interview to start..."
  );

  // UI state
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewDuration, setInterviewDuration] = useState(0);
  //api calling

  const { id } = useParams(); // gets "453453kkaldjfkal"
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    // Fetch resume details using the id
    const fetchResume = async () => {
      try {
        const response = await fetch(`/api/resumes/${id}`);
        const data = await response.json();
        setResumeData(data);
      } catch (error) {
        console.error("Error fetching resume:", error);
      }
    };

    fetchResume();
  }, [id]);

  // Timer
  useEffect(() => {
    let interval;
    if (interviewStarted) {
      interval = setInterval(() => {
        setInterviewDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [interviewStarted]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // 🔹 Fetch resume from backend using candidateId
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/candidates/${candidateId}/resume`
        );
        if (!res.ok) throw new Error("Failed to fetch resume");
        const data = await res.json();
        if (data.resumeText) {
          setResumeText(data.resumeText);
        }
      } catch (err) {
        console.error("Error fetching resume:", err);
      }
    };
    if (candidateId) fetchResume();
  }, [candidateId]);

  // Vapi setup
  useEffect(() => {
    const client = new Vapi(import.meta.env.VITE_PUBLIC_VAPI_API_KEY);
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
        const res = await fetch(
          "http://localhost:5000/api/interview/evaluate",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resumeText, transcript: conversationOnly }),
          }
        );
        const data = await res.json();
        console.log("Evaluation Result:", data.decision, data.feedback);
      } catch (err) {
        console.error("Evaluation error:", err);
      }
    });

    client.on("error", (error) => console.error("Vapi error:", error));
    setVapiClient(client);
  }, [resumeText]);

  // Start interview
  const handleStartInterview = async () => {
    if (!vapiClient || !resumeText) return;

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
      setInterviewDuration(0);
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
    setInterviewDuration(0);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                AI Mock Interview Session
              </h1>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                {resumeText ? (
                  <span className="text-green-600">
                    Resume Loaded • AI Interview
                  </span>
                ) : (
                  <span className="text-gray-500">Fetching resume...</span>
                )}
              </div>
            </div>
            {interviewStarted ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Live</span>
                <span className="text-sm text-gray-600">
                  {formatDuration(interviewDuration)}
                </span>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Not started</div>
            )}
          </div>
        </div>

        {/* Start button */}
        {!interviewStarted && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center justify-center text-center"
          >
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              {resumeText
                ? "Ready to start your AI mock interview"
                : "Fetching candidate resume..."}
            </h2>
            <button
              onClick={handleStartInterview}
              disabled={!resumeText}
              className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                resumeText
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Play className="w-5 h-5" />
              Start Interview
            </button>
          </motion.div>
        )}

        {/* Interview UI (same as before) */}
        {interviewStarted && (
          <motion.div
            key="interview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            {/* ... (keep your AI interviewer + candidate video grid + controls) ... */}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default InterviewPage;
