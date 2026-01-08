import React, { useState, useEffect } from "react";
import { 
  FaUser, 
  FaEnvelope, 
  FaCalendar, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEdit, 
  FaSave,
  FaUpload,
  FaChartLine,
  FaImage,
  FaVideo,
  FaFileAlt,
  FaCog,
  FaShieldAlt,
  FaBell,
  FaGlobe,
  FaArrowRight,
  FaCheckCircle,
  FaShare,
  FaBuilding,
  FaChevronDown
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Footer from "./../components/Footer";

function ProfilePage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isUploading, setIsUploading] = useState(false);
  const [showMobileTabs, setShowMobileTabs] = useState(false);

  const primaryColor = "#5bf0a5";
  const primaryColorHover = "#3dd989";

  // User data state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    phone: "",
    company: "",
    website: ""
  });

  // Check authentication and load user data
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      navigate('/login');
      return;
    }

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setFormData({
          name: parsedUser.name || "John Doe",
          email: parsedUser.email || "john@example.com",
          bio: parsedUser.bio || "Digital marketing specialist passionate about AI-powered advertising.",
          location: parsedUser.location || "San Francisco, CA",
          phone: parsedUser.phone || "+1 (555) 123-4567",
          company: parsedUser.company || "TechCorp Inc.",
          website: parsedUser.website || "https://johndoe.com"
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Load user stats
    setStats({
      adsCreated: 42,
      campaigns: 8,
      totalViews: "125K",
      engagementRate: "4.8%",
      activeProjects: 3,
      monthlyUsage: "78%"
    });
  }, [navigate]);

  // If no token, show loading
  if (!localStorage.getItem('token')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    // Here you would typically send the updated data to your backend
    console.log('Saving profile:', formData);
    
    // Update localStorage
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    setIsEditing(false);
  };

  const handleImageUpload = (e) => {
    setIsUploading(true);
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      // Here you would handle the actual image upload
      console.log('Image uploaded');
    }, 1500);
  };

  const recentActivities = [
    { id: 1, action: "Created new ad campaign", time: "2 hours ago", icon: <FaImage /> },
    { id: 2, action: "Generated 5 AI ads", time: "Yesterday", icon: <FaChartLine /> },
    { id: 3, action: "Updated billing information", time: "2 days ago", icon: <FaCog /> },
    { id: 4, action: "Shared campaign results", time: "3 days ago", icon: <FaShare /> },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: <FaUser /> },
    { id: "activity", label: "Activity", icon: <FaChartLine /> },
    { id: "settings", label: "Settings", icon: <FaCog /> },
    { id: "security", label: "Security", icon: <FaShieldAlt /> },
    { id: "notifications", label: "Notifications", icon: <FaBell /> },
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Hero Profile Section */}
      <section className="pt-20 pb-12 sm:pb-16 px-4 sm:px-6 md:px-12 lg:px-24 bg-black relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-5"
            style={{
              background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
            }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              {/* Profile Picture with Upload - Mobile Responsive */}
              <div className="relative group self-center sm:self-auto">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full border-4 border-white overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <FaUser className="text-3xl sm:text-4xl md:text-5xl text-gray-400" />
                </div>
                <label 
                  htmlFor="profileImage"
                  className="absolute bottom-0 right-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center cursor-pointer transition-all group-hover:scale-110"
                  style={{ backgroundColor: primaryColor }}
                >
                  <FaUpload className="text-white text-xs sm:text-sm" />
                  <input 
                    type="file" 
                    id="profileImage" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
                {isUploading && (
                  <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* User Info - Mobile Responsive */}
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-transparent border-b border-gray-400 text-white focus:outline-none focus:border-white w-full max-w-xs text-center sm:text-left"
                      placeholder="Your Name"
                    />
                  ) : (
                    formData.name
                  )}
                </h1>
                <p className="text-gray-300 flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base">
                  <FaEnvelope className="text-xs sm:text-sm" /> 
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-transparent border-b border-gray-400 text-white focus:outline-none focus:border-white text-sm w-full max-w-xs text-center sm:text-left"
                      placeholder="your@email.com"
                    />
                  ) : (
                    formData.email
                  )}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm mt-2 flex items-center justify-center sm:justify-start gap-2">
                  <FaCalendar /> Member since {user ? new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Jan 2024'}
                </p>
              </div>
            </div>

            {/* Edit/Save Button - Mobile Responsive */}
            <div className="flex justify-center md:justify-end">
              <button
                onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all hover:scale-105 text-black"
                style={{ 
                  backgroundColor: primaryColor,
                }}
              >
                {isEditing ? (
                  <>
                    <FaSave className="text-sm" /> Save
                  </>
                ) : (
                  <>
                    <FaEdit className="text-sm" /> Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Tabs Dropdown */}
          <div className="md:hidden mb-6">
            <button
              onClick={() => setShowMobileTabs(!showMobileTabs)}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-300 bg-white text-black"
            >
              <div className="flex items-center gap-2">
                {tabs.find(t => t.id === activeTab)?.icon}
                <span className="font-medium">{tabs.find(t => t.id === activeTab)?.label || 'Select Tab'}</span>
              </div>
              <FaChevronDown className={`transition-transform ${showMobileTabs ? 'rotate-180' : ''}`} />
            </button>
            
            {showMobileTabs && (
              <div className="absolute z-10 mt-1 w-full max-w-[calc(100%-2rem)] bg-white border border-gray-300 rounded-lg shadow-lg">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setShowMobileTabs(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-3 text-left transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-gray-100 text-black font-medium' 
                        : 'text-black hover:bg-gray-50'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Tabs Navigation */}
          <div className="hidden md:block mb-8">
            <div className="flex flex-wrap gap-2 border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'text-black'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={{
                    borderBottomColor: activeTab === tab.id ? primaryColor : undefined,
                    color: activeTab === tab.id ? primaryColor : undefined
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left Column - Profile Info & Stats */}
            <div className="lg:col-span-2">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <>
                  {/* User Stats - Mobile Responsive */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {stats && Object.entries(stats).map(([key, value], index) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-1">{value}</div>
                        <div className="text-xs sm:text-sm text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Bio & Details - Mobile Responsive */}
                  <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-black">About</h3>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm text-black"
                        style={{ '--tw-ring-color': primaryColor }}
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-gray-600 text-sm sm:text-base">{formData.bio}</p>
                    )}
                    
                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: primaryColor + '20' }}
                        >
                          <FaMapMarkerAlt style={{ color: primaryColor }} className="text-sm sm:text-base" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs sm:text-sm text-gray-500">Location</div>
                          {isEditing ? (
                            <input
                              type="text"
                              name="location"
                              value={formData.location}
                              onChange={handleInputChange}
                              className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-black text-black w-full text-sm sm:text-base"
                              placeholder="City, Country"
                            />
                          ) : (
                            <div className="font-medium text-sm sm:text-base text-black">{formData.location}</div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: primaryColor + '20' }}
                        >
                          <FaPhone style={{ color: primaryColor }} className="text-sm sm:text-base" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs sm:text-sm text-gray-500">Phone</div>
                          {isEditing ? (
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-black text-black w-full text-sm sm:text-base"
                              placeholder="Phone number"
                            />
                          ) : (
                            <div className="font-medium text-sm sm:text-base text-black">{formData.phone}</div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: primaryColor + '20' }}
                        >
                          <FaBuilding style={{ color: primaryColor }} className="text-sm sm:text-base" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs sm:text-sm text-gray-500">Company</div>
                          {isEditing ? (
                            <input
                              type="text"
                              name="company"
                              value={formData.company}
                              onChange={handleInputChange}
                              className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-black text-black w-full text-sm sm:text-base"
                              placeholder="Company name"
                            />
                          ) : (
                            <div className="font-medium text-sm sm:text-base text-black">{formData.company}</div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: primaryColor + '20' }}
                        >
                          <FaGlobe style={{ color: primaryColor }} className="text-sm sm:text-base" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs sm:text-sm text-gray-500">Website</div>
                          {isEditing ? (
                            <input
                              type="url"
                              name="website"
                              value={formData.website}
                              onChange={handleInputChange}
                              className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-black text-black w-full text-sm sm:text-base"
                              placeholder="https://example.com"
                            />
                          ) : (
                            <div className="font-medium text-sm sm:text-base text-black">
                              <a href={formData.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                {formData.website.replace('https://', '')}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Projects - Mobile Responsive */}
                  <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <h3 className="text-lg sm:text-xl font-bold text-black">Recent Projects</h3>
                      <button className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2"
                        style={{ color: primaryColor }}
                      >
                        View All <FaArrowRight className="text-xs" />
                      </button>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      {[
                        { name: "Summer Campaign 2024", status: "Active", progress: 75, ads: 12 },
                        { name: "Product Launch", status: "Completed", progress: 100, ads: 8 },
                        { name: "Brand Awareness", status: "Planning", progress: 30, ads: 5 },
                      ].map((project, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                          <div className="mb-2 sm:mb-0">
                            <div className="font-medium text-sm sm:text-base text-black">{project.name}</div>
                            <div className="flex items-center gap-2 sm:gap-4 mt-1 sm:mt-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                project.status === 'Active' ? 'bg-green-100 text-green-800' :
                                project.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {project.status}
                              </span>
                              <span className="text-xs sm:text-sm text-gray-500">{project.ads} ads</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl sm:text-2xl font-bold text-black">{project.progress}%</div>
                            <div className="text-xs text-gray-500">Progress</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Activity Tab */}
              {activeTab === "activity" && (
                <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-black">Recent Activity</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: primaryColor + '20' }}
                        >
                          <div style={{ color: primaryColor }} className="text-sm sm:text-base">{activity.icon}</div>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm sm:text-base text-black">{activity.action}</div>
                          <div className="text-xs sm:text-sm text-gray-500">{activity.time}</div>
                        </div>
                        <FaCheckCircle className="text-green-500 text-sm sm:text-base" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-black">Account Settings</h3>
                  <div className="space-y-4 sm:space-y-6">
                    {[
                      { title: "Email Preferences", description: "Manage how often you receive emails" },
                      { title: "Billing Information", description: "Update payment methods and invoices" },
                      { title: "Privacy Settings", description: "Control your data and privacy options" },
                      { title: "API Access", description: "Manage API keys and integrations" },
                    ].map((setting, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-100">
                        <div className="mb-2 sm:mb-0">
                          <div className="font-medium text-sm sm:text-base text-black">{setting.title}</div>
                          <div className="text-xs sm:text-sm text-gray-500">{setting.description}</div>
                        </div>
                        <button className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors text-black">
                          Manage
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Quick Actions & Plan */}
            <div className="lg:col-span-1 space-y-6 sm:space-y-8">
              {/* Current Plan - Mobile Responsive */}
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-black">Your Plan</h3>
                <div className="p-3 sm:p-4 rounded-lg mb-3 sm:mb-4"
                  style={{ backgroundColor: primaryColor + '20' }}
                >
                  <div className="text-xl sm:text-2xl font-bold text-black mb-1">Pro Plan</div>
                  <div className="text-xs sm:text-sm text-gray-600">$49/month</div>
                </div>
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Ads Generated</span>
                    <span className="font-medium text-black">42/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                    <div 
                      className="h-1.5 sm:h-2 rounded-full"
                      style={{ 
                        backgroundColor: primaryColor,
                        width: '42%'
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    42 ads used this month
                  </div>
                </div>
                <button className="w-full py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base text-black transition-all hover:scale-105"
                  style={{ backgroundColor: primaryColor }}
                >
                  Upgrade Plan
                </button>
              </div>

              {/* Quick Actions - Mobile Responsive */}
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-black">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:flex sm:flex-col gap-2 sm:gap-3">
                  {[
                    { icon: <FaImage />, label: "Create Ad", color: primaryColor },
                    { icon: <FaVideo />, label: "Generate Video", color: "#8B5CF6" },
                    { icon: <FaChartLine />, label: "Analytics", color: "#10B981" },
                    { icon: <FaFileAlt />, label: "Reports", color: "#F59E0B" },
                  ].map((action, index) => (
                    <button
                      key={index}
                      className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: action.color }}
                      >
                        {action.icon}
                      </div>
                      <span className="font-medium text-xs sm:text-sm text-black">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ProfilePage;