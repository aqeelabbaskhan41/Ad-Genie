import React from "react";
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaClock, 
  FaPaperPlane, 
  FaCheckCircle,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaArrowRight
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "./../components/Footer";

function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <FaEnvelope className="text-2xl" />,
      title: "Email",
      details: ["support@adgenie.com", "sales@adgenie.com"],
      subtitle: "We'll reply within 24 hours"
    },
    {
      icon: <FaPhone className="text-2xl" />,
      title: "Phone",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
      subtitle: "Mon-Fri from 9am to 6pm"
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl" />,
      title: "Office",
      details: ["123 Tech Street", "San Francisco, CA 94107"],
      subtitle: "Come visit our HQ"
    },
    {
      icon: <FaClock className="text-2xl" />,
      title: "Hours",
      details: ["Monday - Friday: 9am - 6pm", "Saturday: 10am - 4pm"],
      subtitle: "Sunday: Closed"
    }
  ];

  const faqs = [
    {
      question: "How quickly do you respond to support requests?",
      answer: "We typically respond within 1-2 hours during business hours. For urgent issues, we have a priority support channel."
    },
    {
      question: "Do you offer custom enterprise solutions?",
      answer: "Yes! Our enterprise team can create custom AI models and workflows tailored to your specific business needs."
    },
    {
      question: "Can I schedule a personalized demo?",
      answer: "Absolutely! You can book a 30-minute personalized demo with one of our product specialists."
    },
    {
      question: "What's your refund policy?",
      answer: "We offer a 14-day money-back guarantee on all paid plans. No questions asked."
    }
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Hero Contact Section */}
      <section className="pt-16 pb-24 px-6 md:px-12 lg:px-24 bg-black relative overflow-hidden">
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
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white"
            >
              Let's <span style={{ color: primaryColor }}>Connect</span> <span>&</span>
              <br />
               Build Something <span style={{ color: primaryColor }}>Amazing</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto"
            >
              Have questions about AdGenie? Our team is here to help. Reach out and 
              we'll get back to you as soon as possible.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 mb-20">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
            >
              <div className="p-8 md:p-10">
                <h2 className="text-3xl font-bold mb-8 text-black">
                  Send us a Message
                </h2>
                
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <FaCheckCircle className="text-6xl mx-auto mb-6" style={{ color: primaryColor }} />
                    <h3 className="text-2xl font-bold mb-3 text-black">Message Sent!</h3>
                    <p className="text-gray-600">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all bg-white text-black"
                          style={{ 
                            borderColor: '#d1d5db',
                            '--tw-ring-color': primaryColor
                          }}
                          placeholder="Aqeel Abbas"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all bg-white text-black"
                          style={{ 
                            borderColor: '#d1d5db',
                            '--tw-ring-color': primaryColor
                          }}
                          placeholder="aqeel@example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all bg-white text-black"
                          style={{ 
                            borderColor: '#d1d5db',
                            '--tw-ring-color': primaryColor
                          }}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subject *
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all bg-white text-black"
                          style={{ 
                            borderColor: '#d1d5db',
                            '--tw-ring-color': primaryColor
                          }}
                        >
                          <option value="">Select a subject</option>
                          <option value="support">Technical Support</option>
                          <option value="sales">Sales Inquiry</option>
                          <option value="partnership">Partnership</option>
                          <option value="feedback">Product Feedback</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="6"
                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-all bg-white text-black"
                        style={{ 
                          borderColor: '#d1d5db',
                          '--tw-ring-color': primaryColor
                        }}
                        placeholder="Tell us how we can help..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-black transition-all hover:shadow-md disabled:opacity-70"
                      style={{ 
                        backgroundColor: primaryColor,
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = primaryColorHover}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                    >
                      Send Message <FaPaperPlane className="ml-3 h-4 w-4" />
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-10 text-black">
                Get in Touch
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:border-gray-300 transition-colors overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {info.icon}
                        </div>
                        <h3 className="text-xl font-bold text-black">{info.title}</h3>
                      </div>
                      <div className="space-y-2">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-700 text-sm">{detail}</p>
                        ))}
                      </div>
                      <p className="text-gray-500 text-xs mt-3">{info.subtitle}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8">
                  <h3 className="text-xl font-bold mb-6 text-black">Connect With Us</h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Follow us on social media for the latest updates, tips, and success stories.
                  </p>
                  <div className="flex gap-4">
                    <a href="#" className="w-12 h-12 rounded-full border border-gray-300 bg-gray-50 flex items-center justify-center text-gray-700 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-colors">
                      <FaFacebook className="text-xl" />
                    </a>
                    <a href="#" className="w-12 h-12 rounded-full border border-gray-300 bg-gray-50 flex items-center justify-center text-gray-700 hover:text-white hover:bg-pink-600 hover:border-pink-600 transition-colors">
                      <FaInstagram className="text-xl" />
                    </a>
                    <a href="#" className="w-12 h-12 rounded-full border border-gray-300 bg-gray-50 flex items-center justify-center text-gray-700 hover:text-white hover:bg-blue-400 hover:border-blue-400 transition-colors">
                      <FaTwitter className="text-xl" />
                    </a>
                    <a href="#" className="w-12 h-12 rounded-full border border-gray-300 bg-gray-50 flex items-center justify-center text-gray-700 hover:text-white hover:bg-blue-700 hover:border-blue-700 transition-colors">
                      <FaLinkedin className="text-xl" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12 text-black">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <h3 className="text-xl font-bold mb-4 text-black">{faq.question}</h3>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Map/Office Location */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12 text-black">
              Visit Our Office
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-64 md:h-80 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-b border-gray-200">
                <div className="text-center">
                  <FaMapMarkerAlt className="text-4xl mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 text-sm">Interactive Map Would Appear Here</p>
                  <p className="text-xs text-gray-500 mt-2">123 Tech Street, San Francisco, CA 94107</p>
                </div>
              </div>
              <div className="p-8">
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <h4 className="font-bold mb-3 text-black text-sm">Parking</h4>
                    <p className="text-gray-600 text-xs">Free visitor parking available in the adjacent lot.</p>
                  </div>
                  <div>
                    <h4 className="font-bold mb-3 text-black text-sm">Public Transport</h4>
                    <p className="text-gray-600 text-xs">5-minute walk from Montgomery BART station.</p>
                  </div>
                  <div>
                    <h4 className="font-bold mb-3 text-black text-sm">Accessibility</h4>
                    <p className="text-gray-600 text-xs">Wheelchair accessible with ramps and elevators.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Support CTA */}
          <div className="max-w-4xl mx-auto text-center bg-white p-12 rounded-3xl mb-20 shadow-lg border border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-black">
              Need Immediate Help?
            </h2>
            <p className="text-xl mb-10 text-gray-600 max-w-2xl mx-auto">
              Our support team is available 24/7 for urgent technical issues.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center gap-3 transition-all hover:shadow-md text-black"
                style={{ backgroundColor: primaryColor }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = primaryColorHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
              >
                Emergency Support <FaArrowRight />
              </button>
              <button className="px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center gap-3 transition-all border-2 border-gray-800 text-black hover:bg-gray-50"
                style={{ backgroundColor: 'transparent' }}
              >
                Schedule a Call
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ContactPage;