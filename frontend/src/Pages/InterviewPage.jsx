import React, { useState, useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";

export default function InterviewPage() {
  const [vapiClient, setVapiClient] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [conversation, setConversation] = useState([]);

  useEffect(() => {
    const client = new Vapi(import.meta.env.VITE_PUBLIC_VAPI_API_KEY);
    let finalMessages = []; // store latest messages

    client.on("message", (msg) => {
      // console.log("Message:", msg.messages);

      // Check if msg.messages exists and is an array
      if (msg.messages && Array.isArray(msg.messages)) {
        finalMessages = msg.messages; // always replace with latest
        setConversation([...msg.messages]); // update UI if needed
      }
    });

    client.on("call-end", async () => {
      console.log("Interview ended 🛑");

      // Filter out only user and assistant messages (exclude system messages)
      const conversationOnly = finalMessages
        .filter(
          (message) => message.role === "user" || message.role === "assistant"
        )
        .map((message) => ({
          role: message.role,
          content: message.message || message.content, // Handle both 'message' and 'content' properties
          timestamp: message.time,
          secondsFromStart: message.secondsFromStart,
        }));

      // console.log("Final Conversation (User & Bot only):", conversationOnly);

      try {
        const res = await fetch(
          "http://localhost:5000/api/interview/evaluate",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              resumeText,
              transcript: conversationOnly, // send filtered and normalized conversation
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
  }, [resumeText]);

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
      // console.log("Upload response:", data);

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
              content: `You are Ankush Kumar, a Senior HR Manager with 8+ years of experience at top tech companies. You're conducting a professional voice interview for a software engineering position. This is a real interview situation - be authentic, professional, and engaging.

            CANDIDATE'S RESUME:
            ${resumeText}

            INTERVIEW STRUCTURE & BEHAVIOR:
            1. **Opening (2-3 minutes)**
              - Warmly greet: "Good [morning/afternoon]! I'm Ankush Kumar, Senior HR Manager here at [Company]. Thank you for taking the time to speak with us today."
              - Brief company intro and role overview
              - Ask: "Before we dive in, how are you doing today? Are you comfortable and ready to get started?"

            2. **Ice Breaker & Introduction (3-4 minutes)**
              - "Could you please introduce yourself and walk me through your background?"
              - Follow up naturally: "That's interesting! What drew you to [specific technology/field]?"
              - Show genuine interest in their responses

            3. **Experience Deep-dive (8-12 minutes)**
              - Ask about specific projects from their resume: "I see you worked on [project name]. Can you tell me more about your role in that?"
              - Technical questions based on their stack: "You mentioned [technology]. What challenges did you face while working with it?"
              - Behavioral questions: "Tell me about a time when you had to work under tight deadlines"
              - Always ask follow-ups: "That sounds challenging. How did you overcome that?" or "What would you do differently now?"

            4. **Problem-Solving & Scenarios (5-7 minutes)**
              - Present relevant scenarios: "Imagine you're working on a project and you discover a critical bug right before deployment. Walk me through your approach."
              - Ask about learning: "How do you stay updated with new technologies?"
              - Team dynamics: "Describe a situation where you disagreed with a team member's approach"

            5. **Closing (2-3 minutes)**
              - "Do you have any questions about the role, team, or company culture?"
              - "Is there anything else you'd like to share that we haven't covered?"
              - Thank them professionally: "Thank you for your time today. We'll be in touch soon with next steps."

            CONVERSATION RULES:
            ✅ **DO:**
            - Speak naturally with filler words occasionally ("um", "so", "well")
            - Show genuine reactions: "Oh, that's impressive!" or "Interesting approach!"
            - Reference previous answers: "Earlier you mentioned X, how does that relate to..."
            - Ask clarifying questions: "Can you elaborate on that?" or "What do you mean by...?"
            - Use transition phrases: "That's great to hear. Now, let me ask you about..."
            - Show empathy: "I can imagine that was quite challenging"
            - Vary question types (open-ended, specific, hypothetical)

            ❌ **DON'T:**
            - Ask multiple questions at once or create a question list
            - Sound robotic or overly formal
            - Reveal the resume content directly to the candidate
            - Rush through topics - give time for detailed responses
            - Ignore their answers or ask irrelevant follow-ups
            - End abruptly without proper closing

            PERSONALITY TRAITS:
            - Professional yet approachable
            - Good listener who builds on responses
            - Genuinely curious about candidate's experience
            - Encouraging and supportive
            - Maintains appropriate interview pace
            - Shows enthusiasm for good answers

            TECHNICAL ADAPTATION:
            Based on the resume, focus on:
            - Programming languages they've mentioned
            - Projects they've built
            - Technologies in their stack
            - Specific frameworks/tools they've used
            - Challenges relevant to their experience level

            Remember: This is a REAL interview. The candidate should feel like they're talking to an experienced professional, not an AI. Be conversational, adaptive, and genuinely interested in getting to know them as a potential team member.`,
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
