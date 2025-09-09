import React, { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Phone, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InterviewPage = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);

  const handleStartInterview = () => {
    setInterviewStarted(true);
    setIsRecording(true);
  };

  const handleEndInterview = () => {
    setInterviewStarted(false);
    setIsRecording(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Live Interview Session</h1>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  Sarah Johnson • Frontend Developer
                </div>
                <div className="text-sm text-gray-600">15:30 - 16:30</div>
              </div>
            </div>
            {interviewStarted ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Live</span>
                <span className="text-sm text-gray-600">25:55</span>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Not started</div>
            )}
          </div>
        </div>

        {/* Animate between Start & Interview sections */}
        <AnimatePresence mode="wait">
          {!interviewStarted ? (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center justify-center text-center"
            >
              <h2 className="text-lg font-medium text-gray-800 mb-4">Interview not started</h2>
              <button
                onClick={handleStartInterview}
                className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start Interview
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="interview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              {/* Main Video Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* AI Interviewer Section */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center relative">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                        <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                          <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                        </div>
                      </div>
                      <h3 className="text-white text-lg font-medium mb-2">AI Interviewer</h3>
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-1 h-4 bg-white bg-opacity-60 rounded-full animate-pulse"></div>
                          <div className="w-1 h-6 bg-white bg-opacity-80 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1 h-4 bg-white bg-opacity-60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-1 h-6 bg-white bg-opacity-80 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                        </div>
                        <span className="text-white text-sm opacity-80">Speaking...</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-gray-600 italic">
                      "Tell me about your experience with React and how you've used it in previous projects."
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
                    {isRecording && (
                      <div className="absolute top-4 left-4 bg-red-500 bg-opacity-90 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        Recording
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Sarah Johnson</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Good Connection</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-center gap-4">
                  {/* Mic */}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      isMuted ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  {/* Video */}
                  <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      isVideoOff ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                  </button>

                  {/* End Interview */}
                  <button
                    onClick={handleEndInterview}
                    className="px-4 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>End Interview</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InterviewPage;
