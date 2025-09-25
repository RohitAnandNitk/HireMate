import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Upload, Users, Mail, Calendar, UserCheck } from 'lucide-react';

const Process = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5;

  const stepIcons = [
    Upload,
    Users,
    Mail,
    Calendar,
    UserCheck
  ];

  const stepLabels = [
    "Resume Upload",
    "Resume Shortlisting", 
    "Send Email",
    "Interview Schedule",
    "Final Mail to Selected"
  ];

  const stepDescriptions = [
    "Upload and collect candidate resumes",
    "Review and shortlist qualified candidates",
    "Send invitation emails to shortlisted candidates",
    "Schedule interviews with selected candidates", 
    "Send final confirmation to hired candidates"
  ];

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex justify-center px-8 pb-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12 mt-0">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Recruitment Process</h1>
          <p className="text-gray-600">Follow the hiring workflow from resume collection to final selection</p>
        </div>

        {/* Stepper Container */}
        <div className="relative mb-12">
          <div className="flex items-center justify-center">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div key={index} className="flex items-center">
                {/* Circle Step */}
                <div className="relative">
                  <motion.div
                    className={`w-16 h-16 rounded-full border-4 flex items-center justify-center relative z-10 ${
                      index <= currentStep
                        ? 'border-black bg-black'
                        : 'border-gray-300 bg-white'
                    }`}
                    initial={false}
                    animate={{
                      scale: index === currentStep ? 1.1 : 1,
                      borderColor: index <= currentStep ? '#000000' : '#d1d5db',
                      backgroundColor: index <= currentStep ? '#000000' : '#ffffff'
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
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
                          <Check className="w-8 h-8 text-white" strokeWidth={3} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="icon"
                          className={`${
                            index <= currentStep ? 'text-white' : 'text-gray-500'
                          }`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {React.createElement(stepIcons[index], {
                            className: "w-8 h-8",
                            strokeWidth: 2
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Pulse Animation for Current Step */}
                  {index === currentStep && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-black"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.7, 0, 0.7]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
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
                      initial={{ width: '0%' }}
                      animate={{
                        width: index < currentStep ? '100%' : '0%'
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
                    className={`text-sm font-medium ${
                      index <= currentStep ? 'text-black' : 'text-gray-400'
                    }`}
                    animate={{
                      color: index <= currentStep ? '#000000' : '#9ca3af'
                    }}
                    transition={{ duration: 0.3 }}
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
                strokeWidth: 2
              })}
              <div className="text-left">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {stepLabels[currentStep]}
                </h2>
                <p className="text-gray-600">
                  {stepDescriptions[currentStep]}
                </p>
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
              initial={{ width: "20%" }}
              animate={{
                width: `${((currentStep + 1) / totalSteps) * 100}%`
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Control Button */}
        {currentStep < totalSteps - 1 && (
          <div className="flex justify-center">
            <motion.button
              onClick={nextStep}
              className="px-8 py-3 bg-gradient-to-r from-black to-gray-800 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all hover:from-gray-900 hover:to-black"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Proceed
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
