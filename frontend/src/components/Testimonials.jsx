import React from "react";
import { User } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Shikha Gupta",
    role: "Human Resources",
    text: "This platform has changed the way I hire. Highly recommend!",
  },
  {
    id: 2,
    name: "Heena H.",
    role: "Human Resources",
    text: "A seamless experience from start to finish.",
  },
  {
    id: 3,
    name: "Piyush Patel",
    role: "UI/UX Designer",
    text: "Intuitive and simple. It saves me hours every week!",
  },
  {
    id: 4,
    name: "Udit Jain",
    role: "Backend Engineer",
    text: "Amazing tool! Smooth workflows and excellent UI.",
  },
  {
    id: 5,
    name: "Sachin Kumar",
    role: "Recruiter",
    text: "Finding the right talent is now effortless.",
  },
  {
    id: 6,
    name: "Rohit Sharma",
    role: "Team Lead",
    text: "The automation here is a game changer for hiring.",
  },
  {
    id: 7,
    name: "Rohit Anand",
    role: "Project Manager",
    text: "Streamlined our entire recruitment pipeline.",
  },
  {
    id: 8,
    name: "Rahul Kumar",
    role: "Co-founder",
    text: "I’ve tried many platforms, this one is the best!",
  },
  {
    id: 9,
    name: "Anshu Raj",
    role: "CEO",
    text: "Super clean design and works like magic.",
  },
  {
    id: 10,
    name: "Aman Sheoran",
    role: "CTO",
    text: "Love how smooth the process is now.",
  },
];

const Testimonials = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="flex gap-6 animate-scroll">
        {[...testimonials, ...testimonials].map((t, index) => (
          <div
            key={index}
            className="min-w-[300px] max-w-[300px] bg-white rounded-xl shadow-md p-6 flex-shrink-0"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm italic">"{t.text}"</p>
          </div>
        ))}
      </div>

      {/* Gradient fade for edges */}
      <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default Testimonials;
