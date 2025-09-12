import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/hiremate.png';
import {
    Menu,
    X,
    Play,
    CheckCircle,
    Clock,
    CreditCard,
    BarChart3,
    Users,
    Target,
    Calendar,
    FileText,
    TrendingUp,
    Star,
    Code,
    Database,
    Zap
} from 'lucide-react';
import Testimonials from '../components/Testimonials';

const Home = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentStat, setCurrentStat] = useState(0);
    const [typewriterText, setTypewriterText] = useState('');
    const [typewriterIndex, setTypewriterIndex] = useState(0);
    const [showCursor, setShowCursor] = useState(true);

    const typewriterWords = [
        'AI-Powered Recruiting',
        'Smart Candidate Screening',
        'Automated Interviews',
        'Data-Driven Hiring'
    ];

    const currentWord = typewriterWords[Math.floor(typewriterIndex / 50) % typewriterWords.length];

    const stats = [
        { value: '95%', label: 'Faster Screening', color: 'text-blue-600' },
        { value: '50K+', label: 'Candidates Processed', color: 'text-cyan-600' },
        { value: '99.8%', label: 'Accuracy Rate', color: 'text-blue-700' }
    ];

    // Typewriter effect
    useEffect(() => {
        const interval = setInterval(() => {
            const wordIndex = Math.floor(typewriterIndex / 50) % typewriterWords.length;
            const charIndex = typewriterIndex % 50;
            const word = typewriterWords[wordIndex];

            if (charIndex < word.length) {
                setTypewriterText(word.substring(0, charIndex + 1));
            } else if (charIndex < word.length + 20) {
                setTypewriterText(word);
            } else {
                setTypewriterText('');
            }

            setTypewriterIndex(prev => prev + 1);
        }, 100);

        return () => clearInterval(interval);
    }, [typewriterIndex]);

    // Cursor blink effect
    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 500);
        return () => clearInterval(cursorInterval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStat((prev) => (prev + 1) % stats.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Floating elements data
    const floatingElements = [
        { icon: Code, delay: 0, x: 10, y: 20 },
        { icon: Database, delay: 1000, x: 80, y: 10 },
        { icon: Zap, delay: 2000, x: 15, y: 70 },
        { icon: Users, delay: 1500, x: 85, y: 60 },
        { icon: Target, delay: 500, x: 50, y: 15 },
        { icon: BarChart3, delay: 2500, x: 70, y: 80 }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
            {/* Custom CSS for animations */}
            <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        @keyframes scroll-right {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }
        
        .animate-scroll-right {
          animation: scroll-right 45s linear infinite;
        }
      `}</style>
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating Icons */}
                {floatingElements.map((element, index) => {
                    const IconComponent = element.icon;
                    return (
                        <div
                            key={index}
                            className="absolute animate-bounce opacity-10"
                            style={{
                                left: `${element.x}%`,
                                top: `${element.y}%`,
                                animationDelay: `${element.delay}ms`,
                                animationDuration: '3s'
                            }}
                        >
                            <IconComponent size={24} className="text-blue-600" />
                        </div>
                    );
                })}

                {/* Animated Gradient Orbs */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full animate-pulse"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

                {/* Moving Background Lines */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-300/30 to-transparent animate-pulse"></div>
                    <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                    <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-300/30 to-transparent animate-pulse" style={{ animationDelay: '3s' }}></div>
                </div>
            </div>


            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 relative z-10">
                <div className="grid lg:grid-cols-2 gap-10 items-center">

                    {/* Left Content */}
                    <div className="space-y-6">
                        {/* Typewriter Badge */}
                        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-full text-sm font-medium">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="min-w-44">
                                {typewriterText}
                                <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
                            </span>
                        </div>

                        {/* Main Heading */}
                        <div className="space-y-3">
                            <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                                Transform Your{' '}
                                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent">
                                    Hiring Process
                                </span>{' '}
                                with AI
                            </h1>
                        </div>

                        {/* Description */}
                        <p className="text-base text-gray-600 leading-relaxed max-w-2xl">
                            Streamline recruitment with our intelligent dashboard. Automate candidate screening,
                            schedule interviews, and make data-driven hiring decisions faster than ever before.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 py-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center transform hover:scale-105 transition-transform duration-300">
                                    <div className={`text-xl lg:text-2xl font-bold ${stat.color} mb-1`}>
                                        {stat.value}
                                    </div>
                                    <div className="text-xs text-gray-600 font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button 
                            onClick={()=>navigate('/dashboard')}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-sm transform hover:scale-105 duration-200">
                                <span>Get Started Free</span>
                            </button>
                            <button className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-blue-300 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2 text-sm transform hover:scale-105 duration-200">
                                <Play size={16} />
                                <span>Watch Demo</span>
                            </button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                            <div className="flex items-center space-x-2 text-green-600 text-sm">
                                <CheckCircle size={16} />
                                <span className="font-medium">No Credit Card Required</span>
                            </div>
                            <div className="flex items-center space-x-2 text-green-600 text-sm">
                                <Clock size={16} />
                                <span className="font-medium">14-Day Free Trial</span>
                            </div>
                            <div className="flex items-center space-x-2 text-green-600 text-sm">
                                <X size={16} />
                                <span className="font-medium">Cancel Anytime</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Dashboard Preview */}
                    <div className="relative">
                        {/* Main Dashboard */}
                        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
                            {/* Browser Bar */}
                            <div className="bg-gray-100 px-3 py-2 flex items-center space-x-2 border-b">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                </div>
                                <div className="flex-1 bg-white rounded px-2 py-1 text-xs text-gray-500 mx-3">
                                    dashboard.aihiring.com
                                </div>
                            </div>

                            {/* Dashboard Content */}
                            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900">Recruitment Dashboard</h3>
                                        <p className="text-xs text-gray-600">Today's Overview</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                                            <BarChart3 size={12} className="text-blue-600" />
                                        </div>
                                        <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center">
                                            <Users size={12} className="text-gray-600" />
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-white rounded-lg p-3 shadow-sm">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-medium text-gray-600">Active Jobs</span>
                                            <Target size={12} className="text-blue-500" />
                                        </div>
                                        <div className="text-lg font-bold text-gray-900">24</div>
                                        <div className="text-xs text-green-600 flex items-center">
                                            <TrendingUp size={8} className="mr-1" />
                                            +12% from last week
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 shadow-sm">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-medium text-gray-600">Interviews</span>
                                            <Calendar size={12} className="text-cyan-500" />
                                        </div>
                                        <div className="text-lg font-bold text-gray-900">142</div>
                                        <div className="text-xs text-green-600 flex items-center">
                                            <TrendingUp size={8} className="mr-1" />
                                            +8% from last week
                                        </div>
                                    </div>
                                </div>

                                {/* Chart Area */}
                                <div className="bg-white rounded-lg p-3 mb-4 shadow-sm">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-medium text-gray-900 text-sm">Hiring Pipeline</span>
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                                        </div>
                                    </div>
                                    <div className="h-16 bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 rounded-md opacity-70 animate-pulse"></div>
                                </div>

                                {/* Recent Candidates */}
                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-medium text-gray-900 text-sm">Recent Candidates</span>
                                        <FileText size={12} className="text-gray-400" />
                                    </div>
                                    <div className="space-y-2">
                                        {[
                                            { name: 'Sarah Chen', role: 'Frontend Dev', avatar: '👩‍💻' },
                                            { name: 'Mike Johnson', role: 'Data Scientist', avatar: '👨‍🔬' },
                                            { name: 'Lisa Wang', role: 'UI Designer', avatar: '👩‍🎨' }
                                        ].map((candidate, index) => (
                                            <div key={index} className="flex items-center space-x-2 hover:bg-blue-50 p-1 rounded transition-colors">
                                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">
                                                    {candidate.avatar}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-xs font-medium text-gray-900">{candidate.name}</div>
                                                    <div className="text-xs text-gray-500">{candidate.role}</div>
                                                </div>
                                                <div className="flex space-x-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={8} className="text-yellow-400 fill-current" />
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute -top-3 -right-3 w-16 h-16 bg-cyan-400 rounded-full opacity-20 animate-bounce"></div>
                        <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-400 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute top-1/2 -right-6 w-8 h-8 bg-indigo-400 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '2s' }}></div>
                    </div>
                </div>
            </div>
            {/* Testimonials Section 10 cards with infinite scrolling from right to left  */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 relative z-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What Our Users Say</h2>
                <div className="overflow-hidden">
                    <Testimonials />
                </div>
            </div>

        </div>
    );
};

export default Home;