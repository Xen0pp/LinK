import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
}

interface HeaderProps {
  accessibilitySettings: AccessibilitySettings;
  onUpdateSettings: (settings: Partial<AccessibilitySettings>) => void;
}

const Header: React.FC<HeaderProps> = ({ accessibilitySettings, onUpdateSettings }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isA11yMenuOpen, setIsA11yMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'Tools', href: '/tools', current: location.pathname === '/tools' },
    { name: 'AI Assistant', href: '/chat', current: location.pathname === '/chat' },
    { name: 'Settings', href: '/settings', current: location.pathname === '/settings' },
    { name: 'About', href: '/about', current: location.pathname === '/about' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleA11yMenu = () => {
    setIsA11yMenuOpen(!isA11yMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-3"
              aria-label="Accessibility Hub - Go to homepage"
            >
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl" aria-hidden="true">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Accessibility Hub</h1>
                <p className="text-sm text-gray-600 sr-only">
                  Centralized directory for assistive AI tools
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8" role="navigation" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  item.current
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Accessibility Controls */}
          <div className="flex items-center space-x-4">
            {/* Accessibility Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={toggleA11yMenu}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                aria-label="Accessibility settings"
                aria-expanded={isA11yMenuOpen}
                aria-haspopup="menu"
              >
                <AdjustmentsHorizontalIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              {isA11yMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                  role="menu"
                  aria-labelledby="accessibility-menu-button"
                >
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Accessibility Settings
                    </h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={accessibilitySettings.highContrast}
                          onChange={(e) => onUpdateSettings({ highContrast: e.target.checked })}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">High Contrast</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={accessibilitySettings.largeText}
                          onChange={(e) => onUpdateSettings({ largeText: e.target.checked })}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Large Text</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={accessibilitySettings.reducedMotion}
                          onChange={(e) => onUpdateSettings({ reducedMotion: e.target.checked })}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Reduce Motion</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              aria-label="Open main menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    item.current
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-current={item.current ? 'page' : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 