import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6,12 C6,12 7,11 9,11 C11,11 13,13 15,13 C17,13 18,12 18,12 M6,7 C6,7 7,6 9,6 C11,6 13,8 15,8 C17,8 18,7 18,7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">LinK</h2>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Connecting people with powerful AI accessibility tools to create inclusive digital 
              experiences that work for everyone, regardless of their abilities.
            </p>
            <p className="text-gray-400 text-sm">
              Making the digital world accessible, one feature at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Quick Links</h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/tools" 
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    Browse Tools
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/chat" 
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    AI Assistant
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/settings" 
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    Accessibility Settings
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about" 
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    About Us
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Get Started */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Get Started</h3>
            <nav aria-label="Getting started links">
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/tools/image-caption" 
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    Image Captioning
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/tools/text-to-speech" 
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    Text-to-Speech
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/tools/ocr" 
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    OCR Text Extraction
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} LinK. Making accessibility technology accessible to everyone.
          </p>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a 
              href="mailto:contact@accessibilityhub.org" 
              className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              aria-label="Contact us via email"
            >
              Contact
            </a>
            <a 
              href="#privacy" 
              className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
            >
              Privacy Policy
            </a>
            <a 
              href="#terms" 
              className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
            >
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 