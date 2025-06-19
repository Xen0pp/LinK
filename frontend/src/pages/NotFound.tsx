import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  WrenchScrewdriverIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const NotFound: React.FC = () => {
  const quickLinks = [
    {
      name: 'Home',
      href: '/',
      icon: HomeIcon,
      description: 'Return to the homepage',
    },
    {
      name: 'AI Tools',
      href: '/tools',
      icon: WrenchScrewdriverIcon,
      description: 'Explore accessibility tools',
    },
    {
      name: 'AI Assistant',
      href: '/chat',
      icon: ChatBubbleLeftRightIcon,
      description: 'Get accessibility help',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              404
            </div>
            <MagnifyingGlassIcon className="h-16 w-16 text-gray-400 mx-auto" />
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Sorry, we couldn't find the page you're looking for. 
            The page might have been moved, deleted, or you entered the wrong URL.
          </p>

          {/* Quick Links */}
          <div className="space-y-4 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Where would you like to go?
            </h2>
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {link.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {link.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            ← Go Back
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound; 