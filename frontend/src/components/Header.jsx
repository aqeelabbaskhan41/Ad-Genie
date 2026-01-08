import React, { useState, useEffect } from "react";
import { FaArrowRight, FaChevronDown, FaTimes, FaSignOutAlt, FaCog } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const [openFeatures, setOpenFeatures] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  // Custom color and variants
  const primaryColor = "#5bf0a5";
  const primaryColorHover = "#3dd989";
  const primaryColorLight = "#e8fdf4";

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close features dropdown if clicking outside
      if (openFeatures && !event.target.closest('.features-dropdown')) {
        setOpenFeatures(false);
      }
      // Close profile dropdown if clicking outside
      if (openProfile && !event.target.closest('.profile-dropdown')) {
        setOpenProfile(false);
      }
      // Close mobile menu if clicking outside
      if (mobileMenuOpen && !event.target.closest('.mobile-menu')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [openFeatures, openProfile, mobileMenuOpen]);

  // Close mobile menu when clicking a link
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setOpenFeatures(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setOpenProfile(false);
    navigate('/login');
  };

  // Handle mobile features dropdown toggle
  const toggleMobileFeatures = () => {
    setOpenFeatures(!openFeatures);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4">
      <div className={`max-w-7xl mx-auto bg-white rounded-full shadow-md px-6 md:px-8 py-3 md:py-4 flex items-center justify-between text-black transition-all duration-300 ${
        isScrolled ? 'shadow-lg' : 'shadow-md'
      }`} style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* Logo */}
        <Link to="/" className="font-bold text-xl md:text-2xl cursor-pointer" style={{ fontWeight: 700 }}>
          <span style={{ color: primaryColorHover }}>Ad</span>Genie<span style={{ color: primaryColor }}>.</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-8 relative features-dropdown">
          {/* Features Dropdown */}
          <div className="relative">
            <button 
              className="flex items-center gap-2 font-medium px-4 py-2 rounded-full transition cursor-pointer" 
              style={{ 
                fontWeight: 500,
                backgroundColor: openFeatures ? primaryColorLight : "transparent",
                color: openFeatures ? primaryColor : "black"
              }}
              onClick={() => setOpenFeatures(!openFeatures)}
            >
              Features <FaChevronDown size={12} className={`transition-transform ${openFeatures ? 'rotate-180' : ''}`} />
            </button>

            {openFeatures && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-xl rounded-2xl border border-gray-200 z-50 py-3">
                <div className="flex flex-col">
                  <Link 
                    to="/ai-ad-creation" 
                    className="px-4 py-3 text-left transition font-medium cursor-pointer hover:bg-gray-50 rounded-lg mx-2"
                    style={{ fontWeight: 500 }}
                    onClick={() => setOpenFeatures(false)}
                  >
                    AI Ad Creation
                  </Link>
                
                  <Link 
                    to="/editor" 
                    className="px-4 py-3 text-left transition font-medium cursor-pointer hover:bg-gray-50 rounded-lg mx-2"
                    style={{ fontWeight: 500 }}
                    onClick={() => setOpenFeatures(false)}
                  >
                    Ad Editing
                  </Link>
                  <Link 
                    to="/analytics" 
                    className="px-4 py-3 text-left transition font-medium cursor-pointer hover:bg-gray-50 rounded-lg mx-2"
                    style={{ fontWeight: 500 }}
                    onClick={() => setOpenFeatures(false)}
                  >
                    Analytics
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link to="/blog" className="cursor-pointer transition font-medium px-4 py-2 rounded-full hover:bg-gray-200">
            Blog
          </Link>
          <Link to="/pricing" className="cursor-pointer transition font-medium px-4 py-2 rounded-full hover:bg-gray-200">
            Pricing
          </Link>
          <Link to="/contact" className="cursor-pointer transition font-medium px-4 py-2 rounded-full hover:bg-gray-200">
            Contact
          </Link>
        </div>

        {/* Desktop Auth / CTA Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/chat" className="cursor-pointer transition font-medium px-4 py-2 rounded-full hover:bg-gray-200">
            Generate Image
          </Link>
          
          {user ? (
            // Profile dropdown for logged-in users - Using your exact styling
            <div className="relative profile-dropdown">
              <button
                onClick={() => setOpenProfile(!openProfile)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
              >
                <div className="w-9 h-9 rounded-full border-2 border-black flex items-center justify-center">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <FaCircleUser size={14} className="text-black" />
                  </div>
                </div>
              </button>

              {openProfile && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="font-medium text-black truncate">
                      {user.name || 'User'}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {user.email || ''}
                    </div>
                  </div>
                  
                  {/* Profile link */}
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50"
                    onClick={() => setOpenProfile(false)}
                  >
                    <FaCircleUser /> Profile
                  </Link>
                  
                  {/* Settings link */}
                  <Link 
                    to="/settings" 
                    className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50"
                    onClick={() => setOpenProfile(false)}
                  >
                    <FaCog /> Settings
                  </Link>
                  
                  {/* Logout button */}
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-gray-50 w-full"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Login button for non-logged-in users
            <Link to="/login">
              <button 
                className="px-5 md:px-6 py-2 rounded-full font-semibold inline-flex items-center gap-2 transition-colors text-black cursor-pointer hover:shadow-lg hover:scale-105"
                style={{ 
                  fontWeight: 600,
                  backgroundColor: primaryColor
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = primaryColorHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
              >
                Login <FaArrowRight size={14} />
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 mobile-menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <FaTimes className="w-6 h-6" />
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Mobile Menu Overlay - Fixed with higher z-index */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-9999">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu Panel */}
            <div className="absolute right-4 top-4 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden mobile-menu">
              <div className="py-4">
                {/* User info in mobile menu */}
                {user && (
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full border-2 border-black flex items-center justify-center">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <FaCircleUser size={14} className="text-black" />
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-black">
                          {user.name || 'User'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email || ''}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mobile Features Dropdown */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <button 
                    className="flex items-center justify-between w-full text-left font-medium"
                    onClick={toggleMobileFeatures}
                  >
                    <span>Features</span>
                    <FaChevronDown size={12} className={`transition-transform ${openFeatures ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {openFeatures && (
                    <div className="mt-3 ml-4 space-y-2">
                      <Link 
                        to="/ai-ad-creation" 
                        className="block w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50"
                        onClick={closeMobileMenu}
                      >
                        AI Ad Creation
                      </Link>
                      <Link 
                        to="/video-ads" 
                        className="block w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50"
                        onClick={closeMobileMenu}
                      >
                        Video Ads
                      </Link>
                      <Link 
                        to="/ad-editing" 
                        className="block w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50"
                        onClick={closeMobileMenu}
                      >
                        Ad Editing
                      </Link>
                      <Link 
                        to="/analytics" 
                        className="block w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50"
                        onClick={closeMobileMenu}
                      >
                        Analytics
                      </Link>
                    </div>
                  )}
                </div>

                {/* Mobile Navigation Links */}
                <Link 
                  to="/blog" 
                  className="block px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  Blog
                </Link>
                <Link 
                  to="/pricing" 
                  className="block px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  Pricing
                </Link>
                <Link 
                  to="/contact" 
                  className="block px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  Contact
                </Link>

                {/* Mobile Auth Buttons */}
                <div className="p-4 space-y-3">
                  <Link 
                    to="/chat" 
                    className="block w-full text-center py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50"
                    onClick={closeMobileMenu}
                  >
                    Generate Images
                  </Link>
                  
                  {user ? (
                    // Logged in user options
                    <>
                      <Link 
                        to="/profile"
                        className="block w-full text-center py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50"
                        onClick={closeMobileMenu}
                      >
                        Profile
                      </Link>
                      <button 
                        onClick={() => {
                          handleLogout();
                          closeMobileMenu();
                        }}
                        className="w-full py-3 rounded-lg font-medium text-white border border-red-500 hover:bg-red-600"
                        style={{ backgroundColor: '#ef4444' }}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    // Login button for non-logged-in users
                    <Link 
                      to="/login"
                      onClick={closeMobileMenu}
                    >
                      <button 
                        className="w-full py-3 rounded-lg font-semibold text-black"
                        style={{ 
                          backgroundColor: primaryColor
                        }}
                      >
                        Login
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;