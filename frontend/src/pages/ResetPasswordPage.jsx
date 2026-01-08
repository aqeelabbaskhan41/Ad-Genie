import React, { useState } from "react";
import { FaArrowRight, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { Link, useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/api";

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  const primaryColor = "#5bf0a5";
  const primaryColorHover = "#3dd989";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, formData.newPassword, formData.confirmPassword);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message || "Failed to reset password");
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
            src="https://images.unsplash.com/photo-1713716722076-df4fc658b328?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
            alt="Person using laptop"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
        </div>
        
        {/* Logo on Left Side */}
        <div className="relative z-10 w-full flex items-center justify-center p-6 md:p-8">
          <div className="text-center max-w-md">
            <div className="font-bold text-2xl sm:text-3xl md:text-4xl cursor-pointer mb-2 md:mb-4" style={{ fontWeight: 700 }}>
              <span style={{ color: primaryColorHover }}>Ad</span>Genie<span style={{ color: primaryColor }}>.</span>
            </div>
            <p className="text-gray-300 text-base sm:text-lg md:text-xl">AI-Powered Ad Creation</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
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
            <div className="text-left mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-black">Create New Password</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Enter your new password</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleChange}
                    disabled={loading}
                    className="appearance-none block w-full pl-10 pr-10 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm disabled:bg-gray-100 bg-white text-black"
                    style={{ borderColor: '#d1d5db', '--tw-ring-color': primaryColor }}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? <FaEyeSlash className="h-4 w-4 text-gray-400" /> : <FaEye className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
              </div>

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
                    type={showConfirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    className="appearance-none block w-full pl-10 pr-10 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm disabled:bg-gray-100 bg-white text-black"
                    style={{ borderColor: '#d1d5db', '--tw-ring-color': primaryColor }}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    disabled={loading}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirm ? <FaEyeSlash className="h-4 w-4 text-gray-400" /> : <FaEye className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2.5 sm:py-3 px-4 rounded-lg text-sm font-semibold text-black transition-all disabled:opacity-70 shadow-sm hover:shadow-md"
                style={{ backgroundColor: primaryColor }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = primaryColorHover)}
                onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = primaryColor)}
              >
                {loading ? "Resetting..." : "Reset Password"}
                {!loading && <FaArrowRight className="ml-2 h-4 w-4" />}
              </button>
            </form>

            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-gray-600 text-sm">
                <Link to="/login" className="font-semibold hover:text-black inline-flex items-center gap-1" style={{ color: primaryColor }}>
                  Back to Login
                  <FaArrowRight className="h-3 w-3" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;