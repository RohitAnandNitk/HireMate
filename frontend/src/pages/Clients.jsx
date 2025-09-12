import React, { useState, useEffect } from "react";
import { Star, Quote, TrendingUp, Users, Clock, Award } from "lucide-react";

// Custom hook for animated counter
const useAnimatedCounter = (end, duration = 2000, startAnimation = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;

    let startTime = null;
    let startCount = 0;

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      if (progress < duration) {
        const currentCount = Math.floor((progress / duration) * end);
        setCount(currentCount);
        requestAnimationFrame(animateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animateCount);
  }, [end, duration, startAnimation]);

  return count;
};

const Clients = () => {
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    // Start animation when component mounts
    const timer = setTimeout(() => {
      setStartAnimation(true);
    }, 500); // Small delay for better effect

    return () => clearTimeout(timer);
  }, []);

  // Animated counters
  const clientsCount = useAnimatedCounter(500, 2000, startAnimation);
  const resumesCount = useAnimatedCounter(2000, 2500, startAnimation);
  const retentionCount = useAnimatedCounter(95, 2200, startAnimation);
  const savingsCount = useAnimatedCounter(60, 1800, startAnimation);

  const testimonials = [
    {
      name: "Sarah Johnson",
      title: "HR Director",
      company: "TechFlow Solutions",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b742?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "HireMate has completely transformed our recruitment process. We've reduced our time-to-hire by 60% and the quality of candidates has significantly improved. The AI-powered matching is incredibly accurate.",
    },
    {
      name: "Michael Chen",
      title: "Talent Acquisition Manager",
      company: "InnovateHub",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "The bulk upload feature alone has saved us countless hours. What used to take our team days now happens in minutes. The analytics dashboard gives us insights we never had before.",
    },
    {
      name: "Emily Rodriguez",
      title: "Head of People",
      company: "GrowthLab",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "We've seen a 40% increase in diversity in our candidate pool since implementing HireMate. The bias-free screening has been a game-changer for our inclusive hiring initiatives.",
    },
    {
      name: "David Park",
      title: "Recruitment Lead",
      company: "NextGen Dynamics",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "The ROI on HireMate has been exceptional. We've reduced our recruitment costs by 45% while dramatically improving our hiring success rate. It's an indispensable tool for any modern HR team.",
    },
    {
      name: "Lisa Thompson",
      title: "VP of Human Resources",
      company: "ScaleTech",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "HireMate's collaborative features have revolutionized how our distributed team works together. The integration with our existing tools was seamless and the support team was exceptional.",
    },
    {
      name: "James Wilson",
      title: "Chief People Officer",
      company: "FutureVision Corp",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "We process over 10,000 resumes monthly and HireMate handles it effortlessly. The accuracy and speed are unmatched. Our recruiters can now focus on building relationships instead of manual screening.",
    },
  ];

  const companies = [
    {
      name: "TechFlow Solutions",
      logo: "TF",
      employees: "500-1000",
      industry: "Technology",
    },
    {
      name: "InnovateHub",
      logo: "IH",
      employees: "200-500",
      industry: "Software",
    },
    {
      name: "GrowthLab",
      logo: "GL",
      employees: "100-200",
      industry: "Marketing",
    },
    {
      name: "NextGen Dynamics",
      logo: "ND",
      employees: "1000+",
      industry: "Manufacturing",
    },
    {
      name: "ScaleTech",
      logo: "ST",
      employees: "2000+",
      industry: "Enterprise Software",
    },
    {
      name: "FutureVision Corp",
      logo: "FV",
      employees: "5000+",
      industry: "Consulting",
    },
    {
      name: "Digital Pioneers",
      logo: "DP",
      employees: "300-500",
      industry: "Digital Agency",
    },
    {
      name: "CloudFirst Inc",
      logo: "CF",
      employees: "800-1200",
      industry: "Cloud Services",
    },
  ];

  const caseStudies = [
    {
      company: "TechFlow Solutions",
      challenge: "Manual screening of 200+ weekly applications",
      solution:
        "Implemented HireMate's AI-powered resume parsing and filtering",
      results: [
        "60% reduction in time-to-hire",
        "85% improvement in candidate quality",
        "40% cost savings in recruitment",
      ],
    },
    {
      company: "ScaleTech",
      challenge: "Scaling recruitment for rapid growth",
      solution: "Deployed enterprise-grade HireMate with custom workflows",
      results: [
        "10x increase in processing capacity",
        "95% faster initial screening",
        "50% improvement in hiring success rate",
      ],
    },
    {
      company: "GrowthLab",
      challenge: "Improving diversity in hiring",
      solution: "Used HireMate's bias-free screening algorithms",
      results: [
        "40% increase in diverse candidates",
        "Eliminated unconscious bias in initial screening",
        "Improved employer brand reputation",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Leading Companies
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Discover how organizations worldwide are transforming their hiring
            processes with HireMate's AI-powered recruitment solutions.
          </p>
        </div>
      </section>

      {/* Client Stats */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-6 transform transition-all duration-500 hover:scale-105">
              <div className={`text-4xl font-bold text-blue-600 mb-2 transition-all duration-500 ${startAnimation ? 'animate-pulse' : ''}`}>
                {clientsCount}+
              </div>
              <div className="text-gray-600 font-medium">Active Clients</div>
            </div>
            <div className="p-6 transform transition-all duration-500 hover:scale-105">
              <div className={`text-4xl font-bold text-cyan-600 mb-2 transition-all duration-500 ${startAnimation ? 'animate-pulse' : ''}`}>
                {resumesCount >= 1000 ? `${Math.floor(resumesCount/1000)}M` : resumesCount}+
              </div>
              <div className="text-gray-600 font-medium">Resumes Processed</div>
            </div>
            <div className="p-6 transform transition-all duration-500 hover:scale-105">
              <div className={`text-4xl font-bold text-green-600 mb-2 transition-all duration-500 ${startAnimation ? 'animate-pulse' : ''}`}>
                {retentionCount}%
              </div>
              <div className="text-gray-600 font-medium">Client Retention</div>
            </div>
            <div className="p-6 transform transition-all duration-500 hover:scale-105">
              <div className={`text-4xl font-bold text-purple-600 mb-2 transition-all duration-500 ${startAnimation ? 'animate-pulse' : ''}`}>
                {savingsCount}%
              </div>
              <div className="text-gray-600 font-medium">
                Average Time Savings
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
            What Our Clients Say
          </h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {testimonial.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{testimonial.title}</p>
                    <p className="text-blue-600 text-sm font-medium">
                      {testimonial.company}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <Quote className="w-8 h-8 text-gray-300 mb-4" />
                <p className="text-gray-700 italic">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Companies */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
            Our Clients
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {companies.map((company, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-lg">
                    {company.logo}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {company.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {company.employees} employees
                </p>
                <p className="text-xs text-gray-500">{company.industry}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
            Success Stories
          </h2>
          <div className="space-y-12">
            {caseStudies.map((study, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="grid lg:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      {study.company}
                    </h3>
                    <div className="mb-6">
                      <h4 className="font-semibold text-red-600 mb-2">
                        Challenge
                      </h4>
                      <p className="text-gray-700">{study.challenge}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-600 mb-2">
                        Solution
                      </h4>
                      <p className="text-gray-700">{study.solution}</p>
                    </div>
                  </div>
                  <div className="lg:col-span-2">
                    <h4 className="font-semibold text-green-600 mb-4">
                      Results
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {study.results.map((result, resultIndex) => (
                        <div
                          key={resultIndex}
                          className="bg-green-50 p-4 rounded-xl border border-green-100 hover:bg-green-100 transition-colors duration-300"
                        >
                          <TrendingUp className="w-6 h-6 text-green-600 mb-2" />
                          <p className="text-green-800 font-medium text-sm">
                            {result}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Focus */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Industries We Serve
          </h2>
          <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              "Technology",
              "Healthcare",
              "Finance",
              "Manufacturing",
              "Retail",
              "Consulting",
            ].map((industry, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-20 p-4 rounded-xl backdrop-blur-sm shadow-lg text-center hover:shadow-2xl hover:bg-opacity-30 transition-all duration-300 transform hover:-translate-y-1"
              >
                <p className="text-black font-semibold">{industry}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Join Our Success Stories
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Ready to transform your hiring process? Join hundreds of companies
            who trust HireMate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              Get Started Today
            </button>
            <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105">
              View Case Studies
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      
    </div>
  );
};

export default Clients;