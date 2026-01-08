import React, { useState } from "react";
import { 
  FaSearch, 
  FaCalendar, 
  FaUser, 
  FaTag, 
  FaArrowRight,
  FaBookmark,
  FaShare,
  FaEye,
  FaComments,
  FaChevronRight,
  FaFilter,
  FaFire,
  FaChartLine,
  FaNewspaper,
  FaLightbulb,
  FaStar,
  FaBullhorn
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Footer from "./../components/Footer";

function BlogsPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null) {
      navigate('/login');
    }
  }, [navigate]);

  const primaryColor = "#5bf0a5";
  const primaryColorHover = "#3dd989";

  // If no token, show loading
  if (!localStorage.getItem('token')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const categories = [
    { id: "all", name: "All", icon: <FaNewspaper />, count: 6 },
    { id: "ai", name: "AI", icon: <FaLightbulb />, count: 8 },
    { id: "marketing", name: "Marketing", icon: <FaBullhorn />, count: 6 },
    { id: "design", name: "Design", icon: <FaEye />, count: 5 },
    { id: "analytics", name: "Analytics", icon: <FaChartLine />, count: 4 },
    { id: "strategy", name: "Strategy", icon: <FaStar />, count: 3 },
  ];

  const trendingTags = [
    "AI Advertising", "CTR", "Video Ads", "ROI", 
    "A/B Testing", "Facebook", "Instagram", "Google", 
    "Personalization", "Automation"
  ];

  const blogs = [
    {
      id: 1,
      title: "The Future of AI in Advertising: What's Next in 2025",
      excerpt: "Discover how AI is revolutionizing digital advertising with predictive analytics and personalized content generation.",
      author: "Alex Johnson",
      date: "Mar 15, 2025",
      readTime: "8 min",
      category: "ai",
      tags: ["AI", "Future", "Advertising"],
      views: "2.4K",
      comments: 42,
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: true,
      trending: true
    },
    {
      id: 2,
      title: "10 Proven Strategies to Double Your Ad CTR in 30 Days",
      excerpt: "Learn actionable techniques used by top marketers to dramatically improve click-through rates.",
      author: "Sarah Chen",
      date: "Mar 12, 2025",
      readTime: "6 min",
      category: "marketing",
      tags: ["CTR", "Optimization", "Strategy"],
      views: "3.1K",
      comments: 28,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: true,
      trending: false
    },
    {
      id: 3,
      title: "How We Achieved 300% ROI Using AI-Powered Ad Generation",
      excerpt: "Case study breakdown of how a startup transformed their ad performance with intelligent automation.",
      author: "Marcus Rivera",
      date: "Mar 10, 2025",
      readTime: "10 min",
      category: "analytics",
      tags: ["ROI", "Case Study", "Success"],
      views: "4.2K",
      comments: 56,
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: false,
      trending: true
    },
    {
      id: 4,
      title: "The Psychology Behind High-Converting Ad Designs",
      excerpt: "Understanding user psychology to create ads that not only attract but convert at unprecedented rates.",
      author: "Jessica Park",
      date: "Mar 8, 2025",
      readTime: "7 min",
      category: "design",
      tags: ["Design", "Psychology", "Conversion"],
      views: "2.8K",
      comments: 31,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: false,
      trending: false
    },
    {
      id: 5,
      title: "Video Ads vs Static Images: Which Performs Better in 2025?",
      excerpt: "Comprehensive analysis of video and image ad performance across different platforms and audiences.",
      author: "David Kim",
      date: "Mar 5, 2025",
      readTime: "9 min",
      category: "marketing",
      tags: ["Video", "Comparison", "Performance"],
      views: "3.5K",
      comments: 47,
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: false,
      trending: true
    },
    {
      id: 6,
      title: "Mastering Facebook & Instagram Ad Algorithms in 2025",
      excerpt: "Deep dive into the latest algorithm changes and how to optimize your ads for maximum reach.",
      author: "Michael Brown",
      date: "Mar 3, 2025",
      readTime: "11 min",
      category: "strategy",
      tags: ["Facebook", "Instagram", "Algorithms"],
      views: "5.2K",
      comments: 63,
      image: "https://images.unsplash.com/photo-1611262588024-d12430b98920?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: true,
      trending: false
    },
  ];

  const featuredBlogs = blogs.filter(blog => blog.featured);
  const trendingBlogs = blogs.filter(blog => blog.trending);

  const filteredBlogs = blogs.filter(blog => {
    if (activeCategory === "all") return true;
    return blog.category === activeCategory;
  }).filter(blog => {
    if (!searchQuery) return true;
    return blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
           blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Hero Section */}
      <section className="pt-16 pb-20 md:pb-24 px-4 sm:px-6 md:px-12 lg:px-24 bg-black relative overflow-hidden">
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
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-5"
            style={{
              background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
            }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-white"
            >
              Marketing <span style={{ color: primaryColor }}>Insights</span>
              <br className="hidden sm:block" />
              & <span style={{ color: primaryColor }}>Expert</span> Knowledge
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-10 max-w-3xl mx-auto px-4"
            >
              Stay ahead with cutting-edge strategies, case studies, and AI-powered advertising insights.
            </motion.p>

          {/* Search Bar - Centered & Responsive */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.3 }}
  className="max-w-2xl mx-auto px-4 sm:px-0"
>
  <div className="relative flex items-center">
    {/* Search Icon */}
    <FaSearch className="absolute left-4 text-gray-400 text-sm sm:text-base pointer-events-none" />

    {/* Input */}
    <input
      type="text"
      placeholder="Search articles..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="
        w-full
        pl-10 sm:pl-12
        pr-24 sm:pr-32
        h-12 sm:h-14
        text-sm sm:text-base
        rounded-lg sm:rounded-xl
        bg-gray-900
        border border-gray-800
        text-white
        placeholder-gray-400
        focus:outline-none focus:ring-2 focus:border-transparent
      "
      style={{ '--tw-ring-color': primaryColor }}
    />

    {/* Button */}
    <button
      className="
        absolute right-2
        h-9 sm:h-10
        px-3 sm:px-4
        rounded-md sm:rounded-lg
        text-sm sm:text-base
        font-medium
        flex items-center justify-center
      "
      style={{ backgroundColor: primaryColor, color: 'black' }}
    >
      Search
    </button>
  </div>
</motion.div>

          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Categories Filter - Improved Responsiveness */}
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border text-xs sm:text-sm font-medium transition-all ${
                    activeCategory === category.id
                      ? 'text-black'
                      : 'text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                  style={{
                    backgroundColor: activeCategory === category.id ? primaryColor : 'transparent',
                    borderColor: activeCategory === category.id ? primaryColor : undefined
                  }}
                >
                  {category.icon}
                  <span className="hidden sm:inline">{category.name}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                    activeCategory === category.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Active Filters - Improved Responsiveness */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <FaFilter className="text-gray-400 text-sm" />
                  <span className="text-xs sm:text-sm text-gray-600">
                    {filteredBlogs.length} of {blogs.length} articles
                  </span>
                </div>
                {searchQuery && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm text-gray-600">Search:</span>
                    <span className="text-xs sm:text-sm font-medium truncate max-w-[100px] sm:max-w-none">{searchQuery}</span>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
              <select className="text-xs sm:text-sm border text-black border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': primaryColor }}
              >
                <option>Newest</option>
                <option>Popular</option>
                <option>Trending</option>
              </select>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Main Content - 2 columns */}
            <div className="lg:col-span-2">
              {/* Featured Articles */}
              {featuredBlogs.length > 0 && (
                <div className="mb-8 sm:mb-12">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-black">Featured Articles</h2>
                    <button className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 hover:gap-2 sm:hover:gap-3 transition-all"
                      style={{ color: primaryColor }}
                    >
                      View All <FaChevronRight className="text-xs sm:text-sm" />
                    </button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    {featuredBlogs.map((blog, index) => (
                      <motion.article
                        key={blog.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 group cursor-pointer"
                      >
                        <div className="relative h-40 sm:h-48 overflow-hidden">
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium text-black"
                              style={{ backgroundColor: primaryColor }}
                            >
                              Featured
                            </span>
                          </div>
                          <div className="absolute top-3 right-3 flex gap-1 sm:gap-2">
                            <button className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:text-black hover:bg-white transition-colors text-xs">
                              <FaBookmark />
                            </button>
                            <button className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:text-black hover:bg-white transition-colors text-xs">
                              <FaShare />
                            </button>
                          </div>
                        </div>
                        <div className="p-4 sm:p-6">
                          <div className="flex items-center flex-wrap gap-2 text-xs text-gray-500 mb-2 sm:mb-3">
                            <span className="flex items-center gap-1">
                              <FaCalendar className="text-xs" /> {blog.date}
                            </span>
                            <span>•</span>
                            <span>{blog.readTime}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <FaUser className="text-xs" /> {blog.author}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-3 text-black group-hover:text-gray-700 transition-colors line-clamp-2">
                            {blog.title}
                          </h3>
                          <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{blog.excerpt}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                            <div className="flex gap-1 sm:gap-2 flex-wrap">
                              {blog.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <FaEye className="text-xs" /> {blog.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaComments className="text-xs" /> {blog.comments}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </div>
              )}

              {/* Latest Articles */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-black">Latest Articles</h2>
                <div className="space-y-4 sm:space-y-6">
                  {filteredBlogs.map((blog, index) => (
                    <motion.article
                      key={blog.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        <div className="sm:w-40 lg:w-48 flex-shrink-0">
                          <div className="relative h-40 sm:h-32 lg:h-36 rounded-lg sm:rounded-xl overflow-hidden">
                            <img
                              src={blog.image}
                              alt={blog.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            {blog.trending && (
                              <div className="absolute top-2 right-2">
                                <span className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 bg-red-500 text-white">
                                  <FaFire className="text-xs" /> Trending
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-2 sm:mb-3">
                            <div className="flex items-center flex-wrap gap-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <FaCalendar className="text-xs" /> {blog.date}
                              </span>
                              <span>•</span>
                              <span>{blog.readTime}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <FaUser className="text-xs" /> {blog.author}
                              </span>
                            </div>
                            <div className="flex gap-1 sm:gap-2">
                              <button className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-black hover:border-gray-400 transition-colors text-xs">
                                <FaBookmark />
                              </button>
                            </div>
                          </div>
                          <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-3 text-black group-hover:text-gray-700 transition-colors line-clamp-2">
                            {blog.title}
                          </h3>
                          <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{blog.excerpt}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                            <div className="flex gap-1 sm:gap-2 flex-wrap">
                              {blog.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                                  <FaTag className="inline mr-1 text-xs" /> {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 text-xs text-gray-500">
                              <span className="flex items-center gap-1 sm:gap-2">
                                <FaEye className="text-xs" /> {blog.views}
                              </span>
                              <span className="flex items-center gap-1 sm:gap-2">
                                <FaComments className="text-xs" /> {blog.comments}
                              </span>
                              <button className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 hover:gap-2 sm:hover:gap-3 transition-all"
                                style={{ color: primaryColor }}
                              >
                                Read More <FaArrowRight className="text-xs" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 mt-8 lg:mt-0">
              {/* Trending Now */}
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <FaFire className="text-sm sm:text-base" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-black">Trending Now</h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {trendingBlogs.map((blog, index) => (
                    <div key={blog.id} className="flex items-start gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                      <span className="text-lg sm:text-xl font-bold text-gray-300 group-hover:text-gray-400">{index + 1}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-xs sm:text-sm text-black group-hover:text-gray-700 mb-1 line-clamp-2">
                          {blog.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{blog.views} views</span>
                          <span>•</span>
                          <span>{blog.comments} comments</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Tags */}
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-black">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {trendingTags.map((tag, index) => (
                    <button
                      key={index}
                      className="px-2 sm:px-3 py-1.5 sm:py-2 rounded text-xs sm:text-sm border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors text-gray-700 hover:text-black"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter Subscription */}
              <div className="bg-gradient-to-br from-black to-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Stay Updated</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">
                  Get weekly insights and AI advertising tips delivered to your inbox.
                </p>
                <div className="space-y-2 sm:space-y-3">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-white border border-gray-700 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                    style={{ '--tw-ring-color': primaryColor }}
                  />
                  <button
                    className="w-full py-2.5 sm:py-3 rounded-lg font-medium text-black flex items-center justify-center gap-2 hover:shadow-md transition-all text-sm sm:text-base"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Subscribe <FaArrowRight className="text-xs sm:text-sm" />
                  </button>
                </div>
                <p className="text-gray-400 text-xs mt-3 sm:mt-4">
                  No spam. Unsubscribe anytime.
                </p>
              </div>

              {/* Authors Spotlight */}
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-black">Top Authors</h3>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { name: "Sarah Chen", role: "AI Expert", articles: 18 },
                    { name: "Marcus Rivera", role: "Strategist", articles: 12 },
                    { name: "Jessica Park", role: "Designer", articles: 9 },
                  ].map((author, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-xs sm:text-sm">
                        {author.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-xs sm:text-sm text-black">{author.name}</h4>
                        <p className="text-xs text-gray-500">{author.role}</p>
                        <p className="text-xs text-gray-400">{author.articles} articles</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Load More */}
          <div className="mt-8 sm:mt-12 text-center">
            <button
              className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium border-2 border-gray-800 text-black hover:bg-gray-50 transition-all text-sm sm:text-base"
            >
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-24 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white">
            Want to Share Your Insights?
          </h2>
          <p className="text-lg sm:text-xl mb-8 sm:mb-10 text-gray-300 max-w-2xl mx-auto px-4">
            Join our community of marketing experts and share your knowledge with thousands of readers.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium sm:font-semibold text-sm sm:text-lg inline-flex items-center justify-center gap-2 sm:gap-3 hover:scale-105 text-black transition-all"
              style={{ backgroundColor: primaryColor }}
            >
              Write for Us <FaArrowRight className="text-sm" />
            </button>
            <button className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium sm:font-semibold text-sm sm:text-lg inline-flex items-center justify-center gap-2 sm:gap-3 hover:bg-gray-800 border-2 border-gray-700 text-white hover:scale-105 transition-all">
              View Guest Guidelines
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default BlogsPage;