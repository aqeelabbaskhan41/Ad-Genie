import React from "react";
import {
  FaArrowRight,
  FaPlay,
  FaStar,
  FaCheck,
  FaLightbulb,
  FaVideo,
  FaChartLine,
  FaMagic,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaGoogle
} from "react-icons/fa";
import { IoSparkles, IoRocket } from "react-icons/io5";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Footer from "../components/Footer";

function HomePage() {
  const navigate = useNavigate()

  useEffect(() => {
    
    const token = localStorage.getItem('token');
  
    
    if (token === null) {
      navigate('/login');
    }
  }, [navigate])
  


  const primaryColor = "#5bf0a5";
  const primaryColorHover = "#3dd989";
  // const primaryColorLight = "#e8fdf4";

  // Floating animation variants
  const adVariants = {
    float1: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    float2: {
      y: [0, -25, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5,
      },
    },
    float3: {
      y: [0, -15, 0],
      transition: {
        duration: 3.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1,
      },
    },
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Hero Section - Black Background */}
      <section className="pt-3 pb-32 px-6 md:px-12 lg:px-24 bg-black relative overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-5"
            style={{
              background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
            }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full opacity-5"
            style={{
              background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
            }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white"
              >
                Create <span style={{ color: primaryColor }}>Stunning Ads</span>
                <br />
                in Seconds with AI
              </motion.h1>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-gray-300 mb-10 max-w-xl"
              >
                Generate high-converting ads for all platforms. No design skills
                needed. Let AI handle the creativity while you focus on growth.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 mb-16"
              >
                <button
                  className="px-8 py-4 rounded-full font-semibold text-lg inline-flex items-center gap-3 transition-all hover:scale-105 text-black shadow-lg"
                  style={{ backgroundColor: primaryColor }}
                  onClick={()=>{navigate('/chat')}}
                >
                  Start Creating Free <FaArrowRight />
                </button>
                <button className="px-8 py-4 rounded-full font-semibold text-lg inline-flex items-center gap-3 transition-all hover:bg-gray-900 border-2 border-gray-800 text-white hover:scale-105">
                  <FaPlay className="text-white" /> Watch Demo
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8"
              >
                {[
                  {
                    value: "10K+",
                    label: "Ads Created",
                    icon: <IoRocket className="text-gray-400" />,
                  },
                  {
                    value: "68%",
                    label: "Higher CTR",
                    icon: <FaChartLine className="text-gray-400" />,
                  },
                  {
                    value: "5x",
                    label: "Faster",
                    icon: <FaMagic className="text-gray-400" />,
                  },
                  {
                    value: "4.9/5",
                    label: "Rating",
                    icon: (
                      <div className="flex">
                        <FaStar className="text-yellow-500" />
                        <FaStar className="text-yellow-500" />
                        <FaStar className="text-yellow-500" />
                        <FaStar className="text-yellow-500" />
                        <FaStar className="text-yellow-500" />
                      </div>
                    ),
                  },
                ].map((stat, index) => (
                  <div key={index} className="text-left">
                    <div className="text-2xl font-bold mb-1 text-white flex items-center gap-2">
                      {stat.icon} {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Side - Ad Previews Grid with Actual Images */}
            <div className="relative h-[600px]">
              {/* Floating Ad Preview 1 - Modern Tech Product */}
              <motion.div
                variants={adVariants}
                animate="float1"
                className="absolute top-0 right-0 w-64 h-80 rounded-2xl overflow-hidden border-2 border-gray-800 shadow-2xl group cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Modern tech product ad"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-white">
                    <div className="font-bold text-lg mb-2">
                      Tech Product Ad
                    </div>
                    <div className="text-sm text-gray-300">
                      Generated for Instagram
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-400">
                    CTR: 4.8% • 2.3K Engagements
                  </div>
                </div>
              </motion.div>

              {/* Floating Ad Preview 2 - Fashion/E-commerce */}
              <motion.div
                variants={adVariants}
                animate="float2"
                className="absolute top-32 left-0 w-56 h-72 rounded-2xl overflow-hidden border-2 border-gray-800 shadow-2xl group cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Fashion e-commerce ad"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-white">
                    <div className="font-bold text-lg mb-2">Fashion Ad</div>
                    <div className="text-sm text-gray-300">
                      AI-generated Video Script
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-400">
                    ROAS: 3.2x • 15K Views
                  </div>
                </div>
              </motion.div>

              {/* Floating Ad Preview 3 - Food/Service */}
              <motion.div
                variants={adVariants}
                animate="float3"
                className="absolute bottom-0 right-20 w-60 h-64 rounded-2xl overflow-hidden border-2 border-gray-800 shadow-2xl group cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Food service ad"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-white">
                    <div className="font-bold text-lg mb-2">
                      Food Service Ad
                    </div>
                    <div className="text-sm text-gray-300">
                      Google Ads Optimized
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-400">
                    CTR: 5.2% • 8.7K Clicks
                  </div>
                </div>
              </motion.div>

              {/* Additional Floating Elements */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-10 left-20 w-40 h-48 rounded-xl overflow-hidden border border-gray-700 shadow-xl opacity-80 group cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Beauty product ad"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black to-transparent">
                  <div className="text-white text-sm font-semibold">
                    Beauty Ad
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, -3, 3, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
                className="absolute bottom-20 left-40 w-36 h-44 rounded-xl overflow-hidden border border-gray-700 shadow-xl opacity-80 group cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Travel ad"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black to-transparent">
                  <div className="text-white text-sm font-semibold">
                    Travel Ad
                  </div>
                </div>
              </motion.div>

              {/* Decorative elements */}
              <div
                className="absolute -top-6 -left-6 w-32 h-32 rounded-full opacity-10"
                style={{ backgroundColor: primaryColor }}
              ></div>

              {/* Floating AI badge */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-1/2 right-1/2 transform translate-x-16 -translate-y-8"
              >
                <div className="px-4 py-2 rounded-full text-sm font-semibold bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg">
                  AI Generated
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - White Background */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white rounded-3xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-black">
              Everything You Need for
              <span style={{ color: primaryColor }}> Perfect Ads</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From idea to launch, our AI handles the entire creative process
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaLightbulb />,
                title: "AI Idea Generator",
                desc: "Get creative ad concepts based on your product",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: <FaVideo />,
                title: "Lates Blogs",
                desc: "Read engaging blogs on same platform",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: <FaMagic />,
                title: "Smart Editor",
                desc: "AI-powered editing tools",
                gradient: "from-green-500 to-emerald-500",
              },
              {
                icon: <FaChartLine />,
                title: "Analytics",
                desc: "Track and optimize performance",
                gradient: "from-orange-500 to-red-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:scale-[1.02]"
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-2xl text-white bg-linear-to-br ${feature.gradient}`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-black">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - Black Background */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Create Ads in
              <span style={{ color: primaryColor }}> 3 Simple Steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Describe Your Product",
                desc: "Tell our AI about your product, target audience, and campaign goals",
                icon: <FaLightbulb className="text-3xl" />,
              },
              {
                step: "02",
                title: "AI Generates Ads",
                desc: "Our AI creates multiple ad variations with images, copy, and CTAs",
                icon: <FaMagic className="text-3xl" />,
              },
              {
                step: "03",
                title: "Edit & Publish",
                desc: "Fine-tune with our editor and publish directly to platforms",
                icon: <IoRocket className="text-3xl" />,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative mb-8"></div>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white bg-gray-900 border border-gray-800">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">
                  {item.title}
                </h3>
                <p className="text-gray-300">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms Section - White Background */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white rounded-3xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-black">
              Works with All
              <span style={{ color: primaryColor }}> Major Platforms</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Publish directly to all major advertising platforms
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: <FaFacebook />, name: "Facebook", color: "#1877F2" },
              { icon: <FaInstagram />, name: "Instagram", color: "#E4405F" },
              { icon: <FaTwitter />, name: "Twitter", color: "#1DA1F2" },
              { icon: <FaGoogle />, name: "Google Ads", color: "#4285F4" },
              { icon: "T", name: "TikTok", color: "#000000" },
              { icon: "in", name: "LinkedIn", color: "#0A66C2" },
            ].map((platform, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex flex-col items-center p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all border border-gray-200"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4 text-white shadow-lg"
                  style={{ backgroundColor: platform.color }}
                >
                  {platform.icon}
                </div>
                <span className="font-semibold text-black">
                  {platform.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Black Background */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Loved by
              <span style={{ color: primaryColor }}> Marketers</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              See what our customers say about AdGenie
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Cut our ad creation time by 80% and improved CTR by 45%. Game changer.",
                name: "Sarah Chen",
                role: "Marketing Director",
                company: "TechScale",
                avatar: "S",
              },
              {
                quote:
                  "The AI suggestions are surprisingly creative. Our best performing ads came from Adgenie.",
                name: "Marcus Rivera",
                role: "Growth Lead",
                company: "StartupXYZ",
                avatar: "M",
              },
              {
                quote:
                  "No more waiting for designers. We create 20+ ads per week now with AdGenie.",
                name: "Jessica Park",
                role: "E-commerce Manager",
                company: "StyleCart",
                avatar: "J",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900 p-8 rounded-3xl border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-300 mb-8 text-lg italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {testimonial.role} • {testimonial.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview Section - White Background */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white rounded-3xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-black">
              Simple,
              <span style={{ color: primaryColor }}> Transparent Pricing</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Start free, upgrade when you need more
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "Free",
                description: "Perfect for trying out AdGenie",
                features: [
                  "10 AI-generated ads/month",
                  "Basic editing tools",
                  "1 platform connection",
                  "Email support",
                ],
                buttonText: "Get Started Free",
                popular: false,
              },
              {
                name: "Pro",
                price: "$49",
                description: "For growing businesses",
                features: [
                  "100 AI-generated ads/month",
                  "Advanced editing tools",
                  "5 platform connections",
                  "Priority support",
                  "Analytics dashboard",
                ],
                buttonText: "Start Free Trial",
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large teams & agencies",
                features: [
                  "Unlimited AI ads",
                  "All premium features",
                  "Unlimited platforms",
                  "Dedicated support",
                  "Custom integrations",
                ],
                buttonText: "Contact Sales",
                popular: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white p-8 rounded-3xl border-2 ${
                  plan.popular ? "border-primaryColor" : "border-gray-200"
                } shadow-lg hover:shadow-xl transition-all`}
              >
                {plan.popular && (
                  <div
                    className="inline-flex px-4 py-1 rounded-full text-sm font-semibold mb-4 text-black"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2 text-black">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold mb-2 text-black">
                  {plan.price}
                  {typeof plan.price === "string" &&
                    plan.price !== "Custom" && (
                      <span className="text-lg text-gray-600">/month</span>
                    )}
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <FaCheck className="text-green-500" /> {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-full font-semibold transition-all hover:scale-105 ${
                    plan.popular
                      ? "text-black"
                      : "border-2 border-gray-800 text-black hover:bg-gray-50"
                  }`}
                  style={{
                    backgroundColor: plan.popular
                      ? primaryColor
                      : "transparent",
                  }}
                >
                  {plan.buttonText}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section - Black Background */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
          
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Transform Your
              <span style={{ color: primaryColor }}> Ad Creation?</span>
            </h2>
            <p className="text-xl mb-10 text-gray-300">
              Join 5,000+ marketers who save 10+ hours weekly with AdGenie
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                className="px-8 py-4 rounded-full font-semibold text-lg inline-flex items-center gap-3 transition-all hover:scale-105 text-black shadow-xl"
                style={{ backgroundColor: primaryColor }}
              >
                Start Free Trial <FaArrowRight />
              </button>
              <button className="px-8 py-4 rounded-full font-semibold text-lg inline-flex items-center gap-3 transition-all hover:bg-gray-900 border-2 border-gray-800 text-white hover:scale-105">
                Book a Demo
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <FaCheck style={{ color: primaryColor }} /> No credit card
                required
              </div>
              <div className="flex items-center gap-2">
                <FaCheck style={{ color: primaryColor }} /> Free for first 10
                ads
              </div>
              <div className="flex items-center gap-2">
                <FaCheck style={{ color: primaryColor }} /> Cancel anytime
              </div>
              <div className="flex items-center gap-2">
                <FaCheck style={{ color: primaryColor }} /> 14-day money back
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    <Footer/>
    </div>
  );
}

export default HomePage;
