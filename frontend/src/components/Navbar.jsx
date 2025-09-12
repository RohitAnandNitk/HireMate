import React from "react";
import logo from "../assets/hiremate.png";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="w-full px-4 py-3">
      <nav className="bg-white/90 backdrop-blur-lg border border-gray-200/60 rounded-2xl shadow-2xl shadow-gray-200/20 w-full  max-w-screen-xl mx-auto">
        <div className="px-6 lg:px-8">
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
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="...">
                Home
              </Link>
              <Link to="/about" className="...">
                About
              </Link>
              <Link to="/services" className="...">
                Services
              </Link>
              <Link to="/clients" className="...">
                Clients
              </Link>
              <Link to="/contact" className="...">
                Contact
              </Link>
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
              <div className="flex flex-col space-y-3">
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 font-medium text-sm py-2 px-3 rounded-lg hover:bg-blue-50 transition-all duration-200"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 font-medium text-sm py-2 px-3 rounded-lg hover:bg-blue-50 transition-all duration-200"
                >
                  About
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 font-medium text-sm py-2 px-3 rounded-lg hover:bg-blue-50 transition-all duration-200"
                >
                  Services
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 font-medium text-sm py-2 px-3 rounded-lg hover:bg-blue-50 transition-all duration-200"
                >
                  Clients
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 font-medium text-sm py-2 px-3 rounded-lg hover:bg-blue-50 transition-all duration-200"
                >
                  Contact
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
