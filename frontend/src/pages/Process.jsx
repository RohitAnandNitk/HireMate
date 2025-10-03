import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Upload,
  Users,
  Mail,
  Calendar,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";

const BaseURL = import.meta.env.VITE_BASE_URL;

const Process = () => {
  const { driveId } = useParams();
  console.log("Drive ID:", driveId);
  // Initialize currentStep as null to distinguish between "not loaded" and "step 0"
  const [currentStep, setCurrentStep] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null);
  const totalSteps = 5;

  const stepIcons = [Upload, Users, Mail, Calendar, UserCheck];

  const stepLabels = [
    "Resume Upload",
    "Resume Shortlisting",
    "Send Email",
    "Interview Schedule",
    "Final Mail to Selected",
  ];

  const stepDescriptions = [
    "Upload and collect candidate resumes",
    "Review and shortlist qualified candidates",
    "Send invitation emails to shortlisted candidates",
    "Schedule interviews with selected candidates",
    "Send final confirmation to hired candidates",
  ];

  // Map step indices to DriveStatus enum values
  const stepToStatus = [
    "resumeUploaded",
    "resumeShortlisted",
    "emailSent",
    "InterviewScheduled",
    "selectionEmailSent",
  ];

  // Map DriveStatus values to step indices
  const statusToStep = {
    resumeUploaded: 0,
    resumeShortlisted: 1,
    emailSent: 2,
    InterviewScheduled: 3,
    selectionEmailSent: 4,
  };

  // Fetch current drive status on component mount
  useEffect(() => {
    if (driveId) {
      console.log("Component mounted with driveId:", driveId);
      fetchDriveStatus();
    } else {
      console.log("No driveId provided");
      setError("Drive ID is required");
    }
  }, [driveId]);

  const fetchDriveStatus = async () => {
    console.log("Fetching status for drive ID:", driveId);
    try {
      setLoading(true);
      setError(null);

      // Use the full drive details endpoint to get complete drive data
      const response = await fetch(`${BaseURL}/api/drive/${driveId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Drive not found");
        } else if (response.status === 400) {
          throw new Error("Invalid drive ID format");
        }
        throw new Error(
          `HTTP ${response.status}: Failed to fetch drive details`
        );
      }

      const data = await response.json();
      console.log("Fetched drive data:", data);

      // Get the current status from the drive data
      const currentStatus = data.drive?.status || "resumeUploaded";
      console.log("Current drive status from DB:", currentStatus);

      // Map the status to step index
      const stepIndex =
        statusToStep[currentStatus] !== undefined
          ? statusToStep[currentStatus]
          : 0;
      console.log(
        "Mapping status to step index:",
        currentStatus,
        "->",
        stepIndex
      );

      // Update the current step to match database status
      setCurrentStep(stepIndex);
      console.log("Current step updated to:", stepIndex);
    } catch (err) {
      console.error("Error fetching drive status:", err);
      setError(`Failed to load drive status: ${err.message}`);
      // Don't set default step on error - keep loading state or show error
    } finally {
      setLoading(false);
    }
  };

  const updateDriveStatus = async (newStatus) => {
    console.log("updating drive status function called");
    if (!driveId) {
      setError("Drive ID is required");
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("Updating drive status to:", newStatus);
      const response = await fetch(`${BaseURL}/api/drive/${driveId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update drive status");
      }

      const data = await response.json();
      console.log("Drive status updated successfully:", data);
      return true;
    } catch (err) {
      console.error("Error updating drive status:", err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    if (currentStep < totalSteps - 1) {
      const nextStepIndex = currentStep + 1;
      const newStatus = stepToStatus[nextStepIndex];

      const success = await updateDriveStatus(newStatus);
      if (success) {
        setCurrentStep(nextStepIndex);
      }
    }
  };

  const goToStep = async (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < totalSteps && stepIndex !== currentStep) {
      const newStatus = stepToStatus[stepIndex];

      const success = await updateDriveStatus(newStatus);
      if (success) {
        setCurrentStep(stepIndex);
      }
    }
  };

  // Show loading when currentStep is null (not yet loaded from DB)
  if (loading || currentStep === null) {
    return (
      <Loader
        message="Loading drive status..."
        subMessage={`Drive ID: ${driveId}`}
        error={error}
        onRetry={fetchDriveStatus}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex justify-center px-8 pb-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12 mt-0">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Recruitment Process
          </h1>
          <p className="text-gray-600">
            Follow the hiring workflow from resume collection to final selection
          </p>
          {driveId && (
            <p className="text-sm text-gray-500 mt-2">Drive ID: {driveId}</p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Stepper Container */}
        <div className="relative mb-12">
          <div className="flex items-center justify-center">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div key={index} className="flex items-center">
                {/* Circle Step */}
                <div className="relative">
                  <motion.div
                    className={`w-16 h-16 rounded-full border-4 flex items-center justify-center relative z-10 cursor-pointer ${
                      index <= currentStep
                        ? "border-black bg-black"
                        : "border-gray-300 bg-white"
                    }`}
                    initial={false}
                    animate={{
                      scale: index === currentStep ? 1.1 : 1,
                      borderColor: index <= currentStep ? "#000000" : "#d1d5db",
                      backgroundColor:
                        index <= currentStep ? "#000000" : "#ffffff",
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    onClick={() => !loading && goToStep(index)}
                    whileHover={{ scale: loading ? 1 : 1.05 }}
                  >
                    <AnimatePresence mode="wait">
                      {index < currentStep ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{ duration: 0.4, ease: "backOut" }}
                        >
                          <Check
                            className="w-8 h-8 text-white"
                            strokeWidth={3}
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="icon"
                          className={`${
                            index <= currentStep
                              ? "text-white"
                              : "text-gray-500"
                          }`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {React.createElement(stepIcons[index], {
                            className: "w-8 h-8",
                            strokeWidth: 2,
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Loading spinner for current step */}
                    {loading && index === currentStep && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                      </div>
                    )}
                  </motion.div>

                  {/* Pulse Animation for Current Step */}
                  {index === currentStep && !loading && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-black"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.7, 0, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </div>

                {/* Connecting Line */}
                {index < totalSteps - 1 && (
                  <div className="relative w-24 h-1 mx-4">
                    <div className="absolute w-full h-full bg-gray-300 rounded-full" />
                    <motion.div
                      className="absolute h-full bg-black rounded-full"
                      initial={{ width: "0%" }}
                      animate={{
                        width: index < currentStep ? "100%" : "0%",
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Step Labels */}
          <div className="flex items-center justify-center mt-6">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div key={index} className="flex items-center">
                <div className="text-center w-20">
                  <motion.p
                    className={`text-sm font-medium cursor-pointer ${
                      index <= currentStep ? "text-black" : "text-gray-400"
                    }`}
                    animate={{
                      color: index <= currentStep ? "#000000" : "#9ca3af",
                    }}
                    transition={{ duration: 0.3 }}
                    onClick={() => !loading && goToStep(index)}
                    whileHover={{ scale: loading ? 1 : 1.05 }}
                  >
                    {stepLabels[index]}
                  </motion.p>
                </div>
                {index < totalSteps - 1 && <div className="w-24 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Step Description */}
        <div className="text-center mb-12">
          <motion.div
            className="inline-block"
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-center mb-4">
              {React.createElement(stepIcons[currentStep], {
                className: "w-12 h-12 text-black mr-4",
                strokeWidth: 2,
              })}
              <div className="text-left">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {stepLabels[currentStep]}
                </h2>
                <p className="text-gray-600">{stepDescriptions[currentStep]}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md mx-auto mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-black to-gray-800 h-3 rounded-full"
              initial={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              animate={{
                width: `${((currentStep + 1) / totalSteps) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Control Button */}
        {currentStep < totalSteps - 1 && (
          <div className="flex justify-center space-x-4">
            <motion.button
              onClick={nextStep}
              disabled={loading}
              className={`px-8 py-3 rounded-lg font-medium shadow-lg transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-black to-gray-800 text-white hover:shadow-xl hover:from-gray-900 hover:to-black"
              }`}
              whileHover={!loading ? { scale: 1.05 } : {}}
              whileTap={!loading ? { scale: 0.95 } : {}}
            >
              {loading ? "Updating..." : "Proceed to Next Step"}
            </motion.button>
          </div>
        )}

        {/* Completion Message */}
        <AnimatePresence>
          {currentStep === totalSteps - 1 && (
            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-200 rounded-full mb-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, ease: "backOut", delay: 0.3 }}
                >
                  <Check className="w-10 h-10 text-black" strokeWidth={3} />
                </motion.div>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">
                Recruitment Complete!
              </h3>
              <p className="text-gray-600">
                All candidates have been processed and final selections made.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Process;
