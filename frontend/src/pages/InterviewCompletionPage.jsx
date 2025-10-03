import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  Mail,
  Phone,
  ArrowLeft,
  Home,
  FileText,
  Calendar,
  Star,
  Loader2,
  AlertCircle,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const InterviewCompletionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, driveId, resumeText, conversation } = location.state || {};

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationComplete, setEvaluationComplete] = useState(false);
  const [evaluationError, setEvaluationError] = useState(null);

  // Call evaluation API when component mounts
  useEffect(() => {
    const evaluateInterview = async () => {
      if (!conversation || !resumeText || conversation.length === 0) {
        console.warn("No conversation data available for evaluation");
        setEvaluationError("No interview data available for evaluation");
        return;
      }

      setIsEvaluating(true);
      setEvaluationError(null);

      try {
        console.log("📊 Sending conversation for evaluation...");
        console.log("Conversation data:", conversation);
        console.log("Resume text available:", !!resumeText);
        console.log("Drive ID:", driveId);

        const response = await fetch(`${BASE_URL}/api/interview/evaluate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resumeText,
            transcript: conversation,
            driveId,
            userData,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Evaluation Result:", data);
          setEvaluationComplete(true);
        } else {
          const errorText = await response.text();
          console.error("❌ Evaluation failed:", response.status, errorText);
          setEvaluationError(
            `Evaluation failed: ${response.status} - ${errorText}`
          );
        }
      } catch (error) {
        console.error("❌ Evaluation error:", error);
        setEvaluationError(`Network error: ${error.message}`);
      } finally {
        setIsEvaluating(false);
      }
    };

    // Start evaluation after a short delay to allow UI to render
    const timer = setTimeout(() => {
      evaluateInterview();
    }, 1000);

    return () => clearTimeout(timer);
  }, [conversation, resumeText, driveId, userData]);

  // Update time every second for the completion timestamp
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format date and time
  const formatDateTime = (date) => {
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // If no user data, redirect to home
  useEffect(() => {
    if (!userData) {
      console.warn("No user data available, redirecting to home");
      navigate("/");
    }
  }, [userData, navigate]);

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Evaluation Status Component
  const EvaluationStatus = () => {
    if (isEvaluating) {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <div>
              <h3 className="font-medium text-blue-900">
                We will Evaluate Your Interview and get back to you soon!
              </h3>
            </div>
          </div>
        </div>
      );
    }

    if (evaluationError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="font-medium text-red-900">Evaluation Error</h3>
              <p className="text-sm text-red-700">{evaluationError}</p>
              <p className="text-xs text-red-600 mt-1">
                Don't worry - your interview has been saved and our team will
                review it manually.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // if (evaluationComplete && evaluationResult) {
    //   return (
    //     <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
    //       <div className="flex items-center gap-3">
    //         <CheckCircle className="w-5 h-5 text-green-600" />
    //         <div>
    //           <h3 className="font-medium text-green-900">
    //             Evaluation Complete
    //           </h3>
    //           <p className="text-sm text-green-700">
    //             Your interview has been successfully evaluated and submitted to
    //             our hiring team.
    //           </p>
    //           {evaluationResult.decision && (
    //             <p className="text-xs text-green-600 mt-1 font-medium">
    //               Initial Assessment: {evaluationResult.decision}
    //             </p>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   );
    // }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            {isEvaluating ? (
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            ) : (
              <CheckCircle className="w-10 h-10 text-green-600" />
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEvaluating
              ? "Processing Your Interview"
              : "Interview Completed Successfully!"}
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isEvaluating
              ? "Please wait while we analyze your interview responses and prepare your evaluation."
              : "Thank you for taking the time to complete your interview. Your responses have been recorded and evaluated."}
          </p>
        </div>

        {/* Evaluation Status */}
        <EvaluationStatus />

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          {/* Candidate Information */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Interview Summary
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">
                      {userData.name
                        ? userData.name.charAt(0).toUpperCase()
                        : "C"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {userData.name || "Candidate"}
                    </p>
                    <p className="text-sm text-gray-500">Interviewee</p>
                  </div>
                </div>

                {userData.email && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{userData.email}</span>
                  </div>
                )}

                {userData.phone && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{userData.phone}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <div>
                    <p className="text-sm font-medium">Interview Completed</p>
                    <p className="text-xs text-gray-500">
                      {formatDateTime(currentTime)}
                    </p>
                  </div>
                </div>

                {/* <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <div>
                    <p className="text-sm font-medium">Session Summary</p>
                    <p className="text-xs text-gray-500">
                      {conversation
                        ? `${conversation.length} messages exchanged`
                        : "Full session completed"}
                    </p>
                  </div>
                </div> */}

                {driveId && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <FileText className="w-4 h-4" />
                    <div>
                      <p className="text-sm font-medium">Application ID</p>
                      <p className="text-xs text-gray-500 font-mono">
                        {driveId}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Questions or Concerns?
            </h3>
            <p className="text-gray-600 mb-4">
              If you have any questions about your interview or the hiring
              process, please don't hesitate to reach out to our HR team.
            </p>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>hr@company.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            {isEvaluating
              ? "Please wait while we process your interview. Do not close this page."
              : "Thank you for your interest in joining our team. We appreciate the time you've invested in this process."}
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Interview completed at {formatDateTime(currentTime)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterviewCompletionPage;
