import React from "react";
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  FileText,
  Star,
  BarChart3,
  Briefcase,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/HiRekruit.png";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/job-creation" },
  { label: "Drives", icon: Briefcase, path: "/drives" },
  { label: "All Resumes", icon: FileText, path: "/resumes" },
  { label: "Shortlisted", icon: Star, path: "/shortlisted" },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen border-r border-gray-200 bg-white/80 backdrop-blur-sm transform transition-all duration-300 ease-in-out z-40
      ${isOpen ? "w-56" : "w-16"}`}
    >
      {/* Desktop header */}
      <div className="flex justify-between items-center px-4 py-4 h-16 border-b border-gray-200">
        {isOpen && <img src={logo} alt="HiRekruit" className="h-[20px]" />}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors ml-auto"
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-2 overflow-y-auto h-[calc(100vh-4rem)]">
        {items.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              onClick={() => navigate(item.path)}
              key={item.label}
              className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-all duration-200
                ${
                  isActive
                    ? "text-gray-900 font-medium bg-gray-100 border-r-4 border-black"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              title={!isOpen ? item.label : ""}
            >
              <IconComponent size={20} className="flex-shrink-0" />
              <span
                className={`transition-all duration-200 overflow-hidden ${
                  isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;