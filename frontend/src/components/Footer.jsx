import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaGoogle } from "react-icons/fa";

function Footer() {
  const primaryColor = "#5bf0a5";
  const primaryColorHover = "#3dd989";

  return (
    <footer className="py-16 px-6 md:px-12 lg:px-24 bg-black border-t border-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="font-bold text-3xl mb-6 text-white">
              Ad<span style={{ color: primaryColorHover }}>G</span>enie
              <span style={{ color: primaryColor }}>.</span>
            </div>
            <p className="text-gray-400 mb-8 max-w-md">
              AI-powered ad generation platform that helps businesses create
              stunning, high-converting ads in seconds.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer hover:bg-gray-800 transition-colors">
                <FaTwitter />
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer hover:bg-gray-800 transition-colors">
                <FaFacebook />
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer hover:bg-gray-800 transition-colors">
                <FaInstagram />
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer hover:bg-gray-800 transition-colors">
                <FaGoogle />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Use Cases
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Updates
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Resources</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Community
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Legal
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 mb-4 md:mb-0">
            © {new Date().getFullYear()} AdGenie. All rights reserved.
          </div>
          <div className="flex gap-6 text-gray-500 text-sm">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;