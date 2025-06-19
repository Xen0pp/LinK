'use client'

import React from 'react'
import Link from 'next/link'
import { 
  EyeIcon, 
  SpeakerWaveIcon, 
  CursorArrowRippleIcon, 
  AcademicCapIcon,
  ArrowRightIcon,
  UsersIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  LanguageIcon,
  HandRaisedIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const HomePage: React.FC = () => {
  const features = [
    {
      icon: PhotoIcon,
      title: 'Image Captioning',
      description: 'AI-powered alt text generation for images to improve accessibility.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: SpeakerWaveIcon,
      title: 'Text-to-Speech',
      description: 'Convert text to natural-sounding speech for audio accessibility.',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: DocumentTextIcon,
      title: 'OCR Text Extraction',
      description: 'Extract text from images for screen reader compatibility.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: DocumentTextIcon,
      title: 'Text Simplification',
      description: 'Simplify complex text for better readability and comprehension.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'AI Assistant',
      description: 'Get expert accessibility advice and WCAG guidance.',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="block">LinK</span>
              <span className="block text-blue-600 dark:text-blue-400">
                Accessibility Made Simple
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Creating connections between people and accessible technology. 
              Our AI-powered tools make digital content inclusive for everyone.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link
                href="/tools"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Explore Tools
                <ArrowRightIcon className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
              
              <Link
                href="/chat"
                className="inline-flex items-center px-8 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <ChatBubbleLeftRightIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                AI Assistant
              </Link>
            </div>

            {/* New Sections Highlight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Link
                href="/deaf"
                className="group p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-transparent hover:border-purple-300"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <HandRaisedIcon className="h-8 w-8 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Sign Language Learning
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Interactive flashcards, quizzes, and progress tracking for ASL learning
                </p>
              </Link>

              <Link
                href="/blind"
                className="group p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-transparent hover:border-blue-300"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <EyeIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Voice Control & OCR
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Hands-free navigation and text extraction with voice commands
                </p>
              </Link>
            </div>
          </motion.div>
        </div>
          
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-200 dark:bg-purple-900 rounded-full opacity-20 blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Comprehensive Accessibility Tools
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our AI-powered tools help you create inclusive digital experiences 
              that work for everyone, regardless of their abilities.
            </p>
          </motion.div>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.bgColor} dark:bg-gray-600 mb-4`}>
                    <Icon className={`h-6 w-6 ${feature.color} dark:text-gray-300`} aria-hidden="true" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 dark:bg-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Make Your Content Accessible?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Start using our free AI-powered accessibility tools today and create 
              inclusive digital experiences for all users.
            </p>
            
            <Link
              href="/tools"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white transition-colors duration-200"
            >
              Get Started Now
              <ArrowRightIcon className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default HomePage 