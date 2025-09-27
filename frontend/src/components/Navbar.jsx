import React, { useState } from "react";
import logo from "../assets/HiRekruit.png";
import { Menu, X, LogOut, User, ChevronDown } from "lucide-react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  const navLinkClasses = ({ isActive }) =>
    `text-sm font-medium py-2 px-3 rounded-lg transition-all duration-200 ${
      isActive
        ? "text-blue-600 bg-blue-50"
        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
    }`;

  const handleSignUp = async () => {
    setIsNavigating(true);
    // Add a slight delay for smooth animation
    setTimeout(() => {
      navigate("/signup");
      setIsNavigating(false);
    }, 150);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  return (
    <nav className="w-full bg-white shadow-2xl sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="HiRekruit Logo"
              className="w-10 h-10 object-contain"
            />
            <div className="px-0 py-4 flex items-center justify-between">
              <Link to="/" className="transition-transform duration-200 hover:scale-105">
                <span className="text-lg font-semibold text-gray-900 cursor-pointer">
                  <span className="text-blue-600">HiRe</span>kruit
                </span>
              </Link>
            </div>
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

            {/* Authentication Section */}
            {isSignedIn ? (
              <div className="relative ml-4">
                <button
                  onClick={handleUserDropdown}
                  className="flex items-center space-x-2 bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-all duration-200 border border-blue-200"
                >
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <User size={14} className="text-white" />
                  </div>
                  <span className="text-sm font-medium">
                    {user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User'}
                  </span>
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-200 ${
                      isUserDropdownOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.emailAddresses[0]?.emailAddress}
                      </p>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 flex items-center space-x-2"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleSignUp}
                disabled={isNavigating}
                className={`ml-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-md hover:shadow-lg ${
                  isNavigating ? 'animate-pulse' : ''
                }`}
              >
                {isNavigating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  'Sign Up'
                )}
              </button>
            )}
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
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="border-t border-gray-200/60 pt-4 pb-2">
            <div className="flex flex-col space-y-2">
              <NavLink 
                to="/" 
                className={navLinkClasses} 
                end
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink 
                to="/about" 
                className={navLinkClasses}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </NavLink>
              <NavLink 
                to="/services" 
                className={navLinkClasses}
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </NavLink>
              <NavLink 
                to="/clients" 
                className={navLinkClasses}
                onClick={() => setIsMenuOpen(false)}
              >
                Clients
              </NavLink>
              <NavLink 
                to="/contact" 
                className={navLinkClasses}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </NavLink>
              
              {/* Mobile Authentication */}
              <div className="pt-2 border-t border-gray-200/60 mt-2">
                {isSignedIn ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm text-gray-600">
                      Welcome, {user?.firstName || 'User'}!
                    </div>
                    <Link
                      to="/dashboard"
                      className="block text-sm font-medium py-2 px-3 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left text-sm font-medium py-2 px-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      handleSignUp();
                      setIsMenuOpen(false);
                    }}
                    disabled={isNavigating}
                    className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 ${
                      isNavigating ? 'animate-pulse' : ''
                    }`}
                  >
                    {isNavigating ? 'Loading...' : 'Sign Up'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for dropdown */}
      {isUserDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserDropdownOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;