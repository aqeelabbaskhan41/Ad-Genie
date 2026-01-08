import React from "react";
import { FaCheck, FaArrowRight, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Footer from "../components/Footer";
function PricingPage() {
  const navigate = useNavigate();

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

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      description: "Perfect for trying out AdGenie",
      popular: false,
      features: [
        "10 AI-generated ads/month",
        "Basic editing tools",
        "1 platform connection",
        "Email support",
        "Up to 5 projects",
        "Basic analytics",
      ],
      buttonText: "Get Started Free",
      buttonVariant: "outline",
    },
    {
      name: "Pro",
      price: "$49",
      period: "per month",
      description: "For growing businesses",
      popular: true,
      features: [
        "100 AI-generated ads/month",
        "Advanced editing tools",
        "5 platform connections",
        "Priority support",
        "Analytics dashboard",
        "A/B testing tools",
        "Custom branding",
        "Video ad generation",
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "primary",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "custom",
      description: "For large teams & agencies",
      popular: false,
      features: [
        "Unlimited AI ads",
        "All premium features",
        "Unlimited platforms",
        "Dedicated support",
        "Custom integrations",
        "API access",
        "Team collaboration",
        "White-label solution",
      ],
      buttonText: "Contact Sales",
      buttonVariant: "secondary",
    },
  ];

  const features = [
    {
      title: "Everything in all plans",
      icon: <FaCheck className="text-green-500" />,
      items: [
        "AI-powered ad generation",
        "Multi-platform support (Facebook, Instagram, Google)",
        "Real-time analytics",
        "Mobile app access",
        "Regular updates",
        "Community access",
      ],
    },
    {
      title: "Additional Enterprise Features",
      icon: <FaCheck className="text-green-500" />,
      items: [
        "Custom AI model training",
        "On-premise deployment",
        "SLA guarantee",
        "Dedicated account manager",
        "Custom workflow automation",
        "Bulk user management",
      ],
    },
  ];

  const testimonials = [
    {
      quote: "The Pro plan paid for itself in the first month. Our ad creation time dropped by 70%.",
      name: "Sarah Chen",
      role: "Marketing Director",
      company: "TechScale",
      rating: 5,
    },
    {
      quote: "We scaled from 10 to 500 ads per month without adding more staff. Game changer!",
      name: "Marcus Rivera",
      role: "Growth Lead",
      company: "StartupXYZ",
      rating: 5,
    },
    {
      quote: "The Enterprise solution transformed our entire marketing workflow. ROI has been incredible.",
      name: "Jessica Park",
      role: "E-commerce Manager",
      company: "StyleCart",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Hero Pricing Section */}
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
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white"
            >
              Choose Your
              <span style={{ color: primaryColor }}> Perfect Plan</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto"
            >
              Start free, upgrade when you need more. All plans include our core AI features
              to help you create stunning ads in seconds.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Pricing Cards Grid - Exactly 3 cards like HomePage */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white p-8 rounded-3xl border-2 ${
                  plan.popular 
                    ? "border-primaryColor shadow-2xl relative" 
                    : "border-gray-200"
                } shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div
                      className="px-6 py-1.5 rounded-full text-sm font-bold text-black shadow-lg"
                      style={{ backgroundColor: primaryColor }}
                    >
                      MOST POPULAR
                    </div>
                  </div>
                )}
                
                {/* Plan Header */}
                <div className="mb-6 pt-2">
                  <h3 className="text-2xl font-bold mb-2 text-black">{plan.name}</h3>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-black">{plan.price}</span>
                    {plan.price !== "Custom" && plan.period !== "forever" && (
                      <span className="text-lg text-gray-600">/month</span>
                    )}
                  </div>
                  <p className="text-gray-600 mt-2 text-sm">{plan.description}</p>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-gray-700"
                    >
                      <FaCheck className="text-green-500 mt-1 flex-shrink-0" /> 
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={`w-full py-3.5 rounded-full font-semibold text-lg transition-all duration-300 ${
                    plan.popular
                      ? "text-black hover:scale-[1.02]"
                      : "border-2 border-gray-800 text-black hover:bg-gray-50"
                  }`}
                  style={{
                    backgroundColor: plan.popular ? primaryColor : "transparent",
                  }}
                >
                  {plan.buttonText}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Annual Billing Toggle */}
          <div className="max-w-md mx-auto mb-16">
            <div className="flex items-center justify-center gap-1 p-1.5 rounded-full bg-gray-100 border border-gray-200">
              <button className="px-8 py-3 rounded-full text-sm font-semibold text-gray-700 hover:text-black transition-colors">
                Monthly Billing
              </button>
              <button className="px-8 py-3 rounded-full text-sm font-semibold text-white shadow-md"
                style={{ backgroundColor: primaryColor }}
              >
                Annual (Save 20%)
              </button>
            </div>
          </div>

          {/* Features Comparison */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-10 text-black">
              Compare All Features
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {features.map((section, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 p-8 rounded-3xl border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-4">
                    {section.icon}
                    <h3 className="text-xl font-bold text-black">{section.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {section.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-center gap-3 text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-10 text-black">
              Loved by Marketers Worldwide
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-500 text-sm" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 text-base italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-black text-sm">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {testimonial.role} • {testimonial.company}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-center mb-10 text-black">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "Can I change plans later?",
                  a: "Yes, you can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately.",
                },
                {
                  q: "Is there a free trial?",
                  a: "Yes! All paid plans come with a 14-day free trial. No credit card required for the Starter plan.",
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.",
                },
                {
                  q: "Can I cancel anytime?",
                  a: "Absolutely. You can cancel your subscription at any time, no questions asked.",
                },
                {
                  q: "Do you offer discounts for non-profits?",
                  a: "Yes! We offer 50% off for registered non-profits. Contact our sales team for verification.",
                },
              ].map((faq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors"
                >
                  <h3 className="text-base font-semibold mb-2 text-black">{faq.q}</h3>
                  <p className="text-gray-600 text-sm">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Final CTA Section */}
          <div className="max-w-4xl mx-auto text-center bg-gray-50 p-10 rounded-3xl mb-16">
            <h2 className="text-3xl font-bold mb-5 text-black">
              Still Not Sure Which Plan is Right?
            </h2>
            <p className="text-lg mb-8 text-gray-600 max-w-2xl mx-auto">
              Our team is here to help you choose the perfect plan for your needs.
              Book a personalized demo to see AdGenie in action.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="px-8 py-3.5 rounded-full font-semibold text-lg inline-flex items-center gap-3 transition-all hover:scale-105 text-black shadow-lg"
                style={{ backgroundColor: primaryColor }}
              >
                Book a Demo <FaArrowRight />
              </button>
              <button className="px-8 py-3.5 rounded-full font-semibold text-lg inline-flex items-center gap-3 transition-all hover:bg-gray-900 border-2 border-gray-800 text-white hover:scale-105"
                style={{ backgroundColor: '#1f2937' }}
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>
<Footer/>
    </div>
    
  );
}

export default PricingPage;