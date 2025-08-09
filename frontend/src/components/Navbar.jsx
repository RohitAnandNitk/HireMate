import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const navbarVariants = {
    hidden: { 
      y: -50, 
      opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      y: -20, 
      opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const logoGlowVariants = {
    initial: {
      textShadow: "0 0 3px #10b981, 0 0 6px #10b981"
    },
    animate: {
      textShadow: [
        "0 0 3px #10b981, 0 0 6px #10b981",
        "0 0 5px #10b981, 0 0 10px #10b981",
        "0 0 3px #10b981, 0 0 6px #10b981"
      ],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const handleNavClick = (item) => {
    if (item.name === 'Register') {
      setModalContent('register');
      setIsModalOpen(true);
    } else {
      setModalContent(item.name.toLowerCase());
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent('');
  };

  const menuItems = [
    { name: 'About', href: '#about' },
    { name: 'Features', href: '#features' },
    { name: 'Contact', href: '#contact' },
    { name: 'Register', href: '#register', isButton: true }
  ];

  const renderModalContent = () => {
    switch(modalContent) {
      case 'about':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">About HireMate</h2>
            <p className="text-gray-300 mb-4">
              HireMate is an AI-powered recruitment platform that revolutionizes the hiring process. 
              Our advanced algorithms help you find the perfect candidates faster and more efficiently than ever before.
            </p>
            <div className="flex flex-col gap-2 text-left text-gray-300">
              <div>🚀 AI-powered candidate matching</div>
              <div>📊 Advanced analytics and insights</div>
              <div>⚡ Streamlined interview process</div>
              <div>🎯 Precision talent acquisition</div>
            </div>
          </div>
        );
      case 'features':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="bg-slate-800/50 p-4 rounded-lg border border-emerald-500/20">
                <h3 className="font-bold text-emerald-400 mb-2">Smart Matching</h3>
                <p className="text-gray-300 text-sm">AI algorithms match candidates based on skills, experience, and cultural fit.</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-emerald-500/20">
                <h3 className="font-bold text-emerald-400 mb-2">Automated Screening</h3>
                <p className="text-gray-300 text-sm">Intelligent resume screening and initial candidate assessment.</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-emerald-500/20">
                <h3 className="font-bold text-emerald-400 mb-2">Interview Scheduler</h3>
                <p className="text-gray-300 text-sm">Seamless interview scheduling with calendar integration.</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-emerald-500/20">
                <h3 className="font-bold text-emerald-400 mb-2">Analytics Dashboard</h3>
                <p className="text-gray-300 text-sm">Comprehensive insights and hiring metrics tracking.</p>
              </div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center justify-center gap-3">
                <span className="text-emerald-400">📧</span>
                <span>support@hiremate.ai</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-emerald-400">📞</span>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-emerald-400">🏢</span>
                <span>123 Tech Street, San Francisco, CA</span>
              </div>
              <div className="flex justify-center gap-4 mt-6">
                <motion.button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Email Us
                </motion.button>
                <motion.button
                  className="border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white px-4 py-2 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Schedule Call
                </motion.button>
              </div>
            </div>
          </div>
        );
      case 'register':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Join HireMate</h2>
            <form className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full p-3 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full p-3 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Company Name"
                  className="w-full p-3 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <select className="w-full p-3 bg-slate-800/50 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                  <option value="">Select Company Size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="200+">200+ employees</option>
                </select>
              </div>
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Free Trial
              </motion.button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <motion.nav 
        className="flex justify-between my-3 mx-4 rounded-xl p-3 h-[60px] items-center backdrop-blur-md bg-gradient-to-r from-slate-900/90 via-emerald-900/50 to-slate-900/90 border border-emerald-500/30 shadow-2xl"
        variants={navbarVariants}
        initial="hidden"
        animate="visible"
        whileHover={{
          boxShadow: "0 15px 35px rgba(16, 185, 129, 0.4), 0 0 25px rgba(16, 185, 129, 0.3)",
          transition: { duration: 0.3 }
        }}
      >
        {/* Logo */}
        <motion.div 
          className="ml-3 text-emerald-400 font-bold text-xl cursor-pointer"
          variants={itemVariants}
          onClick={() => window.location.reload()}
        >
          <motion.span
            variants={logoGlowVariants}
            initial="initial"
            animate="animate"
            whileHover={{ 
              scale: 1.1,
              transition: { duration: 0.2 }
            }}
          >
            HireMate
          </motion.span>
        </motion.div>

        {/* Navigation Items */}
        <motion.ul 
          className="flex items-center"
          variants={itemVariants}
        >
          {menuItems.map((item, index) => (
            <motion.li 
              key={item.name}
              className="mx-4 cursor-pointer relative"
              variants={itemVariants}
              onHoverStart={() => setHoveredItem(index)}
              onHoverEnd={() => setHoveredItem(null)}
            >
              {item.isButton ? (
                <motion.button
                  onClick={() => handleNavClick(item)}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium text-sm relative overflow-hidden shadow-lg"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 8px 20px rgba(16, 185, 129, 0.5)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">{item.name}</span>
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => handleNavClick(item)}
                  className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 font-medium text-sm relative px-2 py-1"
                  whileHover={{ 
                    scale: 1.05,
                    color: "#10b981"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                  
                  {/* Animated underline */}
                  <motion.div
                    className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: hoveredItem === index ? "100%" : 0 
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              )}

              {/* Hover glow effect */}
              {hoveredItem === index && !item.isButton && (
                <motion.div
                  className="absolute inset-0 rounded-lg bg-emerald-400/10 -z-10"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.li>
          ))}
        </motion.ul>

        {/* Floating particles for extra ambiance */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400 rounded-full opacity-40"
              style={{
                left: `${15 + (i * 8)}%`,
                top: `${30 + (i % 3) * 15}%`,
              }}
              animate={{
                y: [0, -8, 0],
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 2.5 + Math.random(),
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.nav>

      {/* Modal */}
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <motion.div
            className="bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900 p-8 rounded-2xl border border-emerald-500/30 shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="w-6"></div>
              <motion.button
                onClick={closeModal}
                className="text-gray-400 hover:text-white text-2xl"
                whileHover={{ scale: 1.1 }}
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

export default Navbar;