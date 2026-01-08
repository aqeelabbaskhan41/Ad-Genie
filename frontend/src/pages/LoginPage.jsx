import React, { useState } from "react";
import { FaArrowRight, FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/api";

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const primaryColor = "#5bf0a5";
  const primaryColorHover = "#3dd989";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate inputs
      if (!formData.email || !formData.password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      // Call login API
      const response = await login(formData.email, formData.password);

      // Save token to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect to dashboard or home
      navigate('/');
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col sm:flex-row" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* Left Side - Image Section (Hidden on small, shown on sm+) */}
      <div className="hidden sm:flex sm:w-1/2 relative min-h-screen">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1713716722076-df4fc658b328?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fGFkJTIwb2YlMjBwcm9kdWN0JTIwbmV3fGVufDB8fDB8fHww"
            alt="Person using laptop"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
        </div>
        
        {/* Logo on Left Side (Hidden on small, shown on sm+) */}
        <div className="relative z-10 w-full flex items-center justify-center p-6 md:p-8">
          <div className="text-center max-w-md">
            <div className="font-bold text-2xl sm:text-3xl md:text-4xl cursor-pointer mb-2 md:mb-4" style={{ fontWeight: 700 }}>
              <span style={{ color: primaryColorHover }}>Ad</span>Genie<span style={{ color: primaryColor }}>.</span>
            </div>
            <p className="text-gray-300 text-base sm:text-lg md:text-xl">AI-Powered Ad Creation</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full sm:w-1/2 flex flex-col min-h-screen overflow-y-auto">
        {/* Mobile Logo (Hidden on sm+) */}
        <div className="sm:hidden pt-6 px-6 text-center mb-4">
          <div className="font-bold text-2xl cursor-pointer mb-1" style={{ fontWeight: 700 }}>
            <span style={{ color: primaryColorHover }}>Ad</span>
            <span className="text-black">Genie</span>
            <span style={{ color: primaryColor }}>.</span>
          </div>
          <p className="text-black text-sm">AI-Powered Ad Creation</p>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex flex-col justify-center items-center px-4 py-6 sm:py-0 sm:px-6 md:px-8 lg:px-12">
          <div className="w-full max-w-xs sm:max-w-sm">
            {/* Form Header */}
            <div className="text-left mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-black">
                Welcome back
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Log in to your account
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all disabled:bg-gray-100 bg-white text-black"
                    style={{ 
                      borderColor: '#d1d5db',
                      '--tw-ring-color': primaryColor
                    }}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="appearance-none block w-full pl-10 pr-10 py-2.5 sm:py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all disabled:bg-gray-100 bg-white text-black"
                    style={{ 
                      borderColor: '#d1d5db',
                      '--tw-ring-color': primaryColor
                    }}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:opacity-50"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <FaEye className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-center pt-2">
                <a 
                  href="/forgot-password" 
                  className="text-sm font-medium hover:text-black transition-colors"
                  style={{ color: primaryColor }}
                >
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2.5 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-black transition-all hover:shadow-md mt-2 disabled:opacity-70"
                style={{ 
                  backgroundColor: primaryColor,
                }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = primaryColorHover)}
                onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = primaryColor)}
              >
                {loading ? "Logging in..." : "Log in"}
                {!loading && <FaArrowRight className="ml-2 h-4 w-4" />}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <Link 
                  to="/signup" 
                  className="font-semibold hover:text-black transition-colors inline-flex items-center gap-1"
                  style={{ color: primaryColor }}
                >
                  Sign up for free
                  <FaArrowRight className="h-3 w-3" />
                </Link>
              </p>
            </div>

            {/* Simple Footer Links */}
            <div className="mt-8 sm:mt-10 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs text-gray-600">
                <a href="#" className="hover:text-black transition-colors">Legal Center</a>
                <a href="#" className="hover:text-black transition-colors">Terms of Use</a>
                <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;