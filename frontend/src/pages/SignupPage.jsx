import React, { useState } from "react";
import { FaArrowRight, FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../services/api";

function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false
  });

  const primaryColor = "#5bf0a5";
  const primaryColorHover = "#3dd989";

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation checks
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    if (!formData.agreeTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // Call signup API
      const response = await signup(formData.name, formData.email, formData.password);

      // Save token and user to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect to dashboard or home
      navigate('/');
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black px-4 sm:px-6 lg:px-8 py-6 sm:py-8" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header with Logo */}
      <div className="w-full max-w-6xl mx-auto mb-6 sm:mb-8">
        <div className="flex justify-start">
          <Link to="/" className="font-bold text-xl sm:text-2xl cursor-pointer text-black">
            <span style={{ color: primaryColorHover }}>Ad</span>Genie<span style={{ color: primaryColor }}>.</span>
          </Link>
        </div>
      </div>

      {/* Horizontal Card Form */}
      <div className="w-full max-w-5xl mx-auto">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-200 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            
            {/* Left Side - Form */}
            <div className="lg:w-1/2 p-6 sm:p-8 md:p-10 lg:p-12">
              <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                  Create Your Account
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Start creating amazing ads with AI-powered AdGenie
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 sm:mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Signup Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Name and Email - Stack on mobile, grid on md+ */}
                <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4 md:gap-6">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="appearance-none block w-full pl-10 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all disabled:bg-gray-100 bg-white text-black"
                        style={{ 
                          borderColor: '#d1d5db',
                          '--tw-ring-color': primaryColor
                        }}
                        placeholder="Aqeel Abbas"
                      />
                    </div>
                  </div>

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
                        placeholder="aqeel@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Password and Confirm Password - Stack on mobile, grid on sm+ */}
                <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4 md:gap-6">
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
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="appearance-none block w-full pl-10 pr-10 py-2.5 sm:py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all disabled:bg-gray-100 bg-white text-black"
                        style={{ 
                          borderColor: '#d1d5db',
                          '--tw-ring-color': primaryColor
                        }}
                        placeholder="Create password"
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

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="appearance-none block w-full pl-10 pr-10 py-2.5 sm:py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all disabled:bg-gray-100 bg-white text-black"
                        style={{ 
                          borderColor: '#d1d5db',
                          '--tw-ring-color': primaryColor
                        }}
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={loading}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:opacity-50"
                      >
                        {showConfirmPassword ? (
                          <FaEyeSlash className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                        ) : (
                          <FaEye className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start pt-2">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="h-5 w-5 rounded border-gray-300 mt-0.5 shrink-0 disabled:opacity-50"
                    style={{ borderColor: '#d1d5db' }}
                    required
                  />
                  <label htmlFor="agreeTerms" className="ml-3 block text-xs sm:text-sm text-gray-700">
                    I agree to AdGenie's{" "}
                    <a href="#" className="font-medium hover:text-black transition-colors" style={{ color: primaryColor }}>
                      Terms of Use
                    </a>{" "}
                    and{" "}
                    <a href="#" className="font-medium hover:text-black transition-colors" style={{ color: primaryColor }}>
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Sign Up Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-2.5 sm:py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm sm:text-base font-semibold text-black transition-all hover:shadow-md mt-2 sm:mt-4 disabled:opacity-70"
                  style={{ 
                    backgroundColor: primaryColor,
                  }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = primaryColorHover)}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = primaryColor)}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                  {!loading && <FaArrowRight className="ml-2 sm:ml-3 h-4 w-4" />}
                </button>

                {/* Already have an account? Log in */}
                <div className="mt-4 sm:mt-6 text-center">
                  <p className="text-gray-600 text-sm">
                    Already have an account?{" "}
                    <Link 
                      to="/login" 
                      className="font-semibold hover:text-black transition-colors"
                      style={{ color: primaryColor }}
                    >
                      Log in
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            {/* Right Side - Info & Stats */}
            <div className="lg:w-1/2 bg-gray-50 text-black p-6 sm:p-8 md:p-10 lg:p-12">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                    Why Join AdGenie?
                  </h2>
                  
                  <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: primaryColor }}>
                        <span className="text-black font-bold text-sm sm:text-base">✓</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base mb-1">AI-Powered Creation</h3>
                        <p className="text-gray-600 text-xs sm:text-sm">Generate ads 10x faster with advanced AI</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: primaryColor }}>
                        <span className="text-black font-bold text-sm sm:text-base">✓</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base mb-1">Multi-Platform Support</h3>
                        <p className="text-gray-600 text-xs sm:text-sm">Create for Facebook, Instagram, Google, and more</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: primaryColor }}>
                        <span className="text-black font-bold text-sm sm:text-base">✓</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base mb-1">Smart Analytics</h3>
                        <p className="text-gray-600 text-xs sm:text-sm">Track performance and optimize your ads</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-gray-100 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200">
                  <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Platform Stats</h3>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <div className="text-xl sm:text-2xl font-bold mb-1">10K+</div>
                      <div className="text-gray-600 text-xs sm:text-sm">Ads Created</div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold mb-1">68%</div>
                      <div className="text-gray-600 text-xs sm:text-sm">Higher CTR</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 sm:mt-8">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 text-xs sm:text-sm text-gray-600">
            <a href="#" className="hover:text-black transition-colors">Legal Center</a>
            <a href="#" className="hover:text-black transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-black transition-colors">Cookie Policy</a>
          </div>
          <div className="text-center text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
            © 2025 AdGenie. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;