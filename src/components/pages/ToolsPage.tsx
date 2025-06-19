'use client'

import React from 'react'

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Accessibility Tools
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Discover our comprehensive suite of AI-powered accessibility tools designed to make digital content inclusive for everyone.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Image Captioning
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Generate AI-powered alt text for images to improve accessibility.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Text-to-Speech
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Convert text to natural-sounding speech for audio accessibility.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              OCR Text Extraction
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Extract text from images for screen reader compatibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 