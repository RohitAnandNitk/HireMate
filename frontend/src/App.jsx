import React from 'react'
import { motion } from 'framer-motion'
import Hero from "./components/Hero"
import Navbar from "./components/Navbar"

function App() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 relative overflow-hidden">
      {/* Enhanced unified background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/60 via-emerald-900/20 to-slate-950/80"></div>
      
      {/* Unified grid pattern */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.15) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>
      
      {/* Unified floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-emerald-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -150, 0],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 5 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Navbar */}
      <div className="relative z-50 pt-4">
        <Navbar />
      </div>
      
      {/* Hero Section */}
      <div className="relative z-10">
        <Hero />
      </div>
      
      {/* Subtle background glow effects */}
      <div className="absolute top-1/3 left-1/5 w-96 h-96 bg-emerald-500/4 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/5 w-96 h-96 bg-emerald-400/4 rounded-full blur-3xl"></div>
      <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-emerald-300/3 rounded-full blur-2xl"></div>
    </div>
  )
}

export default App
