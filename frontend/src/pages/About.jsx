import React, { useState, useEffect } from "react";
import { Users, Target, Award, Zap } from "lucide-react";

// Custom hook for animated counter
const useAnimatedCounter = (end, duration = 2000, startAnimation = false, decimal = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;

    let startTime = null;

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      if (progress < duration) {
        const currentCount = decimal 
          ? parseFloat(((progress / duration) * end).toFixed(1))
          : Math.floor((progress / duration) * end);
        setCount(currentCount);
        requestAnimationFrame(animateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animateCount);
  }, [end, duration, startAnimation, decimal]);

  return count;
};

// Intersection Observer hook for triggering animation when section comes into view
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [element, setElement] = useState(null);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        observer.unobserve(element); // Trigger only once
      }
    }, { threshold: 0.3, ...options });

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [element, options]);

  return [setElement, isIntersecting];
};

const About = () => {
  const [statsRef, statsVisible] = useIntersectionObserver();

  // Animated counters for stats
  const screeningSpeed = useAnimatedCounter(95, 2000, statsVisible);
  const candidatesCount = useAnimatedCounter(50, 2200, statsVisible);
  const accuracyRate = useAnimatedCounter(99.8, 2500, statsVisible, true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            About{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              HiRekruit
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            We're revolutionizing recruitment with AI-powered solutions that
            make hiring faster, fairer, and more effective for companies
            worldwide.
          </p>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-red-50 p-8 rounded-2xl border border-red-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <h2 className="text-3xl font-bold text-red-700 mb-6">
                The Problem
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Recruitment is one of the most time-consuming and
                  resource-heavy processes for organizations.
                </p>
                <ul className="space-y-2 pl-6">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>
                      Manual resume screening through hundreds or thousands of
                      applications
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>
                      Significant delays and inefficiencies in the hiring
                      process
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>
                      Human biases affecting diversity and inclusion efforts
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>
                      Missed opportunities due to overwhelming candidate volumes
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 p-8 rounded-2xl border border-green-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <h2 className="text-3xl font-bold text-green-700 mb-6">
                Our Solution
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  HiRekruit leverages cutting-edge AI technologies to automate
                  and optimize recruitment tasks.
                </p>
                <ul className="space-y-2 pl-6">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>
                      Automated resume parsing and candidate information
                      extraction
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>
                      Smart shortlisting based on role requirements and skills
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Real-time tracking and analytics dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>
                      Bias elimination through objective AI-assisted evaluation
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-all duration-300 group-hover:scale-110">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Innovation
              </h3>
              <p className="text-gray-600">
                Continuously pushing the boundaries of AI technology to solve
                complex recruitment challenges.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-all duration-300 group-hover:scale-110">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Precision
              </h3>
              <p className="text-gray-600">
                Delivering accurate, data-driven insights that help you make the
                right hiring decisions.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-all duration-300 group-hover:scale-110">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Inclusivity
              </h3>
              <p className="text-gray-600">
                Promoting fair and unbiased hiring practices to build diverse,
                high-performing teams.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-all duration-300 group-hover:scale-110">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Excellence
              </h3>
              <p className="text-gray-600">
                Committed to delivering exceptional results and exceeding our
                clients' expectations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl border border-blue-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <h2 className="text-3xl font-bold text-blue-700 mb-6">
                Our Mission
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                To democratize access to intelligent recruitment tools,
                empowering organizations of all sizes to make faster, fairer,
                and more effective hiring decisions through the power of
                artificial intelligence.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <h2 className="text-3xl font-bold text-purple-700 mb-6">
                Our Vision
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                To create a world where every hiring decision is data-driven,
                bias-free, and optimized for success, where the best candidates
                are matched with the right opportunities regardless of
                background or circumstance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-gray-50" ref={statsRef}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">
            HiRekruit by the Numbers
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className={`text-4xl font-bold text-blue-600 mb-2 transition-all duration-500 ${statsVisible ? 'animate-pulse' : ''}`}>
                {screeningSpeed}%
              </div>
              <div className="text-gray-600 font-medium">Faster Screening</div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className={`text-4xl font-bold text-cyan-600 mb-2 transition-all duration-500 ${statsVisible ? 'animate-pulse' : ''}`}>
                {candidatesCount}K+
              </div>
              <div className="text-gray-600 font-medium">
                Candidates Processed
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className={`text-4xl font-bold text-green-600 mb-2 transition-all duration-500 ${statsVisible ? 'animate-pulse' : ''}`}>
                {accuracyRate}%
              </div>
              <div className="text-gray-600 font-medium">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default About;