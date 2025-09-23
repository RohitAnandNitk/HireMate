// Chatbot.jsx
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Send, MessageCircle, X, User, ShipWheel } from "lucide-react";
import saarthiImage from "../assets/image.png"; // Saarthi logo
import { motion } from "framer-motion";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm Saarthi, your HireKruit assistant. How can I help you today?",
            sender: "bot",
            timestamp: new Date(),
        },
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const chatRef = useRef(null);

    // API placeholders
    const GROK_API_KEY = "your-grok-api-key-here";
    const GROK_API_URL = "https://api.x.ai/v1/chat/completions";

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Close chatbot on outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (chatRef.current && !chatRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const sendMessageToGrok = async (message) => {
        try {
            const response = await fetch(GROK_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${GROK_API_KEY}`,
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "system",
                            content:
                                "You are Saarthi, a helpful assistant for HireKruit - a recruitment and hiring platform. Be friendly, professional, and concise.",
                        },
                        { role: "user", content: message },
                    ],
                    model: "grok-beta",
                    stream: false,
                    temperature: 0.7,
                }),
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            return data.choices?.[0]?.message?.content ?? "Sorry, no reply.";
        } catch (err) {
            console.error("Grok error:", err);
            return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
        }
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: inputMessage,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((p) => [...p, userMessage]);
        setInputMessage("");
        setIsLoading(true);

        try {
            const botResponse = await sendMessageToGrok(userMessage.text);
            setMessages((p) => [
                ...p,
                {
                    id: Date.now() + 1,
                    text: botResponse,
                    sender: "bot",
                    timestamp: new Date(),
                },
            ]);
        } catch {
            setMessages((p) => [
                ...p,
                {
                    id: Date.now() + 1,
                    text: "I'm sorry, something went wrong. Please try again.",
                    sender: "bot",
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (ts) =>
        ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const ui = (
        <div
            className="fixed bottom-6 right-6 flex flex-col items-end space-y-4 z-50"
            ref={chatRef}
        >
            {/* Chat window */}
            <div
                className={`mb-1 w-80 max-w-[92vw] h-[520px] bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden transition-all duration-300 ease-out transform ${isOpen
                        ? "translate-y-0 opacity-100 pointer-events-auto"
                        : "translate-y-6 opacity-0 pointer-events-none"
                    }`}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center overflow-hidden">
                            <img
                                src={saarthiImage}
                                alt="Saarthi"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Saarthi</h3>
                            <p className="text-blue-100 text-sm">HireKruit Assistant</p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto h-[340px] bg-gradient-to-b from-blue-50 to-white">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"
                                }`}
                            style={{ animation: "fadeInSlide 0.35s ease-out" }}
                        >
                            <div
                                className={`flex items-start space-x-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                                    }`}
                            >
                                <div
                                    className={`  flex items-center justify-center overflow-hidden ${message.sender === "user"
                                            ? "w-6 h-6 rounded-full bg-blue-600 text-white"
                                            : " w-10 h-4 rounded-full bg-white"
                                        }`}
                                >
                                    {message.sender === "user" ? (
                                        <User className="w-4 h-4" />
                                    ) : (
                                        <ShipWheel className="w-8 h-8 text-blue-600" />
                                    )}
                                </div>
                                <div
                                    className={`px-4 py-2 rounded-2xl ${message.sender === "user"
                                            ? "bg-blue-600 text-white rounded-br-md"
                                            : "bg-white text-gray-800 border border-blue-100 rounded-bl-md shadow-sm"
                                        }`}
                                >
                                    <p className="text-sm">{message.text}</p>
                                    <p className="text-xs mt-1 text-gray-400">
                                        {formatTime(message.timestamp)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex items-start space-x-2">
                                <div className="w-8 h-8 rounded-full bg-white border border-blue-200 flex items-center justify-center overflow-hidden">
                                    <ShipWheel className="w-8 h-8 text-blue-600 animate-pulse" />
                                </div>
                                <div className="bg-white border border-blue-100 rounded-2xl px-4 py-2 shadow-sm">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100" />
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-blue-100 bg-white">
                    <div className="flex space-x-2">
                        <textarea
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-2 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none min-h-[44px] text-sm"
                            rows={1}
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-4 text-center">Powered by HireKruit</p>
                </div>
            </div>

            {/* Floating Button */}
            <motion.button
                onClick={() => setIsOpen((s) => !s)}
                className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white overflow-hidden
    ${isOpen ? "bg-gray-600 rotate-45" : "bg-gradient-to-r from-blue-600 to-blue-700"}
  `}
                animate={{ rotate: 360 }}
                transition={{
                    repeat: Infinity,
                    duration: 12, // adjust speed (lower = faster)
                    ease: "linear",
                }}
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <img
                        src={saarthiImage}
                        alt="Saarthi"
                        className="w-14 h-14 rounded-full object-cover"
                    />
                )}
            </motion.button>

            <style>{`
        @keyframes fadeInSlide {
          from { opacity:0; transform: translateY(10px); }
          to { opacity:1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );

    if (!mounted) return null;
    return createPortal(ui, document.body);
};

export default Chatbot;
