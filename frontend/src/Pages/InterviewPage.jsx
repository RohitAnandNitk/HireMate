import React, { useState, useEffect } from "react";
import Vapi from "@vapi-ai/web";

export default function InterviewPage() {
  const [vapiClient, setVapiClient] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [conversation, setConversation] = useState([]);

  useEffect(() => {
    const client = new Vapi(import.meta.env.VITE_PUBLIC_VAPI_API_KEY);

    // ✅ Event listeners
    client.on("call-start", () => console.log("Interview started ✅"));

    client.on("message", (msg) => {
      console.log("Message:", msg);
      setConversation((prev) => [...prev, msg]); // store transcript
    });

    client.on("call-end", async () => {
      console.log("Interview ended 🛑");
      try {
        const res = await fetch(
          "http://localhost:5000/api/interview/evaluate",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              resumeText,
              transcript: conversation,
            }),
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
  }, [conversation, resumeText]);

  const handleResumeUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch(
        "http://localhost:5000/api/interview/upload-resume",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Resume upload failed ❌");

      const data = await res.json();
      console.log("Upload response:", data);

      if (data.resumeText) {
        setResumeText(data.resumeText);
        setResumeUploaded(true);
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const startInterview = async () => {
    if (!vapiClient || !resumeText) return;

    try {
      await vapiClient.start({
        model: {
          provider: "openai",
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are an experienced HR interviewer conducting a professional voice interview. 
              Use the candidate's resume below to guide your questions:

              ${resumeText}

              Instructions:
              - Act like a real interviewer with name "Ankush", not like an assistant.
              - Begin by greeting the candidate and introducing yourself.
              - Ask candidate to introduce themselves.
             `,
            },
          ],
        },
      });
    } catch (error) {
      console.error("Vapi start error:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-8">Voice Mock Interview</h1>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleResumeUpload}
        className="mb-4"
      />

      <button
        onClick={startInterview}
        disabled={!resumeUploaded}
        className={`px-6 py-3 rounded-lg shadow-lg ${
          resumeUploaded ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-500"
        }`}
      >
        Start Interview 🎤
      </button>
    </div>
  );
}
