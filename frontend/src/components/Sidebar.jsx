import React, { useState } from "react";
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  FileText,
  Star,
  BarChart3,
  Settings,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "All Resumes", icon: FileText, path: "/resumes" },
  { label: "Shortlisted", icon: Star, path: "/shortlisted" },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 👈 for active route detection
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <div className="md:hidden p-2 border-b border-gray-200 bg-white/80 backdrop-blur-sm flex justify-between items-center">
        <div className="text-sm font-semibold text-gray-800">HireMate</div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full md:h-auto border-r border-gray-200 bg-white/80 backdrop-blur-sm transform transition-all duration-300 ease-in-out z-50
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${isOpen ? "w-56" : "w-16 md:w-16"}`}
      >
        {/* Desktop toggle button */}
        <div className="hidden md:flex justify-between items-center px-4 py-4">
          {isOpen && (
            <div className="text-sm font-semibold text-gray-800 transition-opacity duration-200">
              HireMate
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors ml-auto"
          >
            {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Mobile header */}
        <div className="md:hidden px-4 py-4 border-b border-gray-200">
          <div className="text-sm font-semibold text-gray-800">HireMate</div>
        </div>

        <nav className="mt-2">
          {items.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path; // 👈 check current route
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
                    isOpen
                      ? "opacity-100 w-auto"
                      : "opacity-0 w-0 md:opacity-0 md:w-0"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
