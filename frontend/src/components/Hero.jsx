import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  const glowVariants = {
    initial: {
      textShadow: "0 0 4px #10b981, 0 0 8px #10b981"
    },
    animate: {
      textShadow: [
        "0 0 4px #10b981, 0 0 8px #10b981",
        "0 0 6px #10b981, 0 0 12px #10b981",
        "0 0 4px #10b981, 0 0 8px #10b981"
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const handleGetStarted = () => {
    setModalType('getStarted');
    setIsModalOpen(true);
  };

  const handleLearnMore = () => {
    setModalType('learnMore');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType('');
  };

  const renderModalContent = () => {
    if (modalType === 'getStarted') {
      return (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Get Started with HireMate</h2>
          <p className="text-gray-300 mb-8">Choose your path to revolutionize your hiring process</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 p-6 rounded-xl border border-emerald-500/30 hover:border-emerald-400/50 transition-all cursor-pointer"
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-white mb-3">Free Trial</h3>
              <p className="text-gray-300 mb-4">Start with our 14-day free trial. No credit card required.</p>
              <ul className="text-sm text-gray-400 text-left space-y-2">
                <li>✓ Up to 10 job postings</li>
                <li>✓ AI candidate matching</li>
                <li>✓ Basic analytics</li>
                <li>✓ Email support</li>
              </ul>
              <motion.button 
                className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Free Trial
              </motion.button>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-emerald-500/30 to-emerald-700/30 p-6 rounded-xl border-2 border-emerald-400/50 hover:border-emerald-300/70 transition-all cursor-pointer relative overflow-hidden"
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute top-2 right-2 bg-emerald-400 text-slate-900 px-2 py-1 rounded-full text-xs font-bold">
                POPULAR
              </div>
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-bold text-white mb-3">Enterprise Demo</h3>
              <p className="text-gray-300 mb-4">Schedule a personalized demo with our experts.</p>
              <ul className="text-sm text-gray-400 text-left space-y-2">
                <li>✓ Unlimited job postings</li>
                <li>✓ Advanced AI features</li>
                <li>✓ Custom integrations</li>
                <li>✓ Priority support</li>
              </ul>
              <motion.button 
                className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Schedule Demo
              </motion.button>
            </motion.div>
          </div>
        </div>
      );
    } else if (modalType === 'learnMore') {
      return (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">How HireMate Works</h2>
          
          <div className="space-y-8">
            <motion.div
              className="flex items-start gap-6 text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-emerald-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Create Job Postings</h3>
                <p className="text-gray-300">Use our AI-powered job description generator to create compelling postings that attract the right candidates.</p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-start gap-6 text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-emerald-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">AI-Powered Matching</h3>
                <p className="text-gray-300">Our advanced algorithms analyze resumes and match candidates based on skills, experience, and cultural fit.</p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-start gap-6 text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-emerald-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Streamlined Interviews</h3>
                <p className="text-gray-300">Automated scheduling, video interviews, and AI-assisted evaluation tools make the process efficient.</p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-start gap-6 text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-emerald-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Make Data-Driven Decisions</h3>
                <p className="text-gray-300">Access detailed analytics and insights to continuously improve your hiring process and outcomes.</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="mt-8 p-6 bg-emerald-900/30 rounded-xl border border-emerald-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-bold text-emerald-400 mb-3">Why Choose HireMate?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-white font-semibold">75% Faster</div>
                <div className="text-gray-400">Hiring Process</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-white font-semibold">90% Match</div>
                <div className="text-gray-400">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">💰</div>
                <div className="text-white font-semibold">60% Cost</div>
                <div className="text-gray-400">Reduction</div>
              </div>
            </div>
          </motion.div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-8 relative">
        {/* Remove background - using App's unified background */}

        <motion.div
          className="container mx-auto relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex justify-between items-center">
            <motion.div
              className="flex-1 max-w-4xl"
              variants={itemVariants}
            >
              <motion.h1 
                className="font-bold text-4xl md:text-5xl lg:text-6xl leading-tight text-white"
                variants={textVariants}
              >
                Automate your hiring with{' '}
                <motion.span 
                  className="text-emerald-400 inline-block"
                  variants={glowVariants}
                  initial="initial"
                  animate="animate"
                >
                  HireMate
                </motion.span>
              </motion.h1>
              
              <motion.p
                className="text-lg md:text-xl text-gray-300 mt-6 max-w-2xl leading-relaxed"
                variants={itemVariants}
              >
                Transform your recruitment process with AI-powered automation. 
                Find the perfect candidates faster than ever before with intelligent matching and streamlined workflows.
              </motion.p>

              <motion.div
                className="mt-10 flex flex-col sm:flex-row gap-4"
                variants={itemVariants}
              >
                <motion.button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3 rounded-lg text-base font-semibold transition-all shadow-lg hover:shadow-emerald-500/25"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 15px 30px rgba(16, 185, 129, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Free
                </motion.button>
                
                <motion.button
                  onClick={handleLearnMore}
                  className="border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white px-8 py-3 rounded-lg text-base font-semibold transition-all backdrop-blur-sm"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 15px 30px rgba(16, 185, 129, 0.2)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </motion.div>

              {/* Stats Section */}
              <motion.div
                className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6"
                variants={itemVariants}
              >
                <div className="text-center sm:text-left">
                  <div className="text-2xl font-bold text-emerald-400">10K+</div>
                  <div className="text-gray-400 text-sm">Companies Trust Us</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-2xl font-bold text-emerald-400">500K+</div>
                  <div className="text-gray-400 text-sm">Successful Hires</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-2xl font-bold text-emerald-400">75%</div>
                  <div className="text-gray-400 text-sm">Faster Hiring</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="hidden lg:flex flex-1 justify-center items-center"
              variants={itemVariants}
            >
              <motion.div
                className="relative"
                variants={floatingVariants}
                animate="animate"
              >
                {/* Enhanced animated geometric shapes */}
                <motion.div
                  className="w-80 h-80 relative"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                >
                  <motion.div
                    className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl shadow-xl"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <motion.div
                    className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-300 to-emerald-500 rounded-full shadow-lg"
                    animate={{ 
                      scale: [1, 0.7, 1],
                      y: [0, -30, 0]
                    }}
                    transition={{ 
                      duration: 3.5, 
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  />
                  
                  <motion.div
                    className="absolute bottom-0 left-0 w-24 h-12 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-lg"
                    animate={{ 
                      scaleX: [1, 1.8, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  />
                  
                  <motion.div
                    className="absolute bottom-0 right-0 w-18 h-18 bg-gradient-to-bl from-emerald-300 to-emerald-600 rounded-2xl shadow-xl"
                    animate={{ 
                      rotate: [0, -180, 0],
                      scale: [1, 0.8, 1]
                    }}
                    transition={{ 
                      duration: 6, 
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2
                    }}
                  />
                  
                  {/* Central glow effect with enhanced styling */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-400 rounded-full opacity-20 blur-xl"
                    animate={{ 
                      scale: [1, 2, 1],
                      opacity: [0.2, 0.6, 0.2]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Floating particles removed to use unified App background */}
        </motion.div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <motion.div
            className="bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900 p-8 rounded-3xl border border-emerald-500/30 shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <div className="w-8"></div>
              <motion.button
                onClick={closeModal}
                className="text-gray-400 hover:text-white text-3xl font-light"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </motion.button>
            </div>
            {renderModalContent()}
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Hero;