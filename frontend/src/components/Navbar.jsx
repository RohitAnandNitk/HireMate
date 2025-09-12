import React, { useState } from "react";
import logo from "../assets/hiremate.png";
import { Menu, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClasses = ({ isActive }) =>
    `text-sm font-medium py-2 px-3 rounded-lg transition-all duration-200 ${
      isActive
        ? "text-blue-600 bg-blue-50"
        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
    }`;

  return (
    <nav className="w-full bg-white shadow-2xl"> {/* full-width navbar */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="HireMate Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-lg font-semibold text-gray-900">
              HireMate
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" className={navLinkClasses} end>
              Home
            </NavLink>
            <NavLink to="/about" className={navLinkClasses}>
              About
            </NavLink>
            <NavLink to="/services" className={navLinkClasses}>
              Services
            </NavLink>
            <NavLink to="/clients" className={navLinkClasses}>
              Clients
            </NavLink>
            <NavLink to="/contact" className={navLinkClasses}>
              Contact
            </NavLink>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200/60 pt-4 pb-2">
            <div className="flex flex-col space-y-2">
              <NavLink to="/" className={navLinkClasses} end>
                Home
              </NavLink>
              <NavLink to="/about" className={navLinkClasses}>
                About
              </NavLink>
              <NavLink to="/services" className={navLinkClasses}>
                Services
              </NavLink>
              <NavLink to="/clients" className={navLinkClasses}>
                Clients
              </NavLink>
              <NavLink to="/contact" className={navLinkClasses}>
                Contact
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
