'use client'

import React from 'react'

export default function BlindPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Voice Control & OCR
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Hands-free navigation and text extraction with voice commands for enhanced accessibility.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Voice Navigation
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Navigate the application using voice commands for hands-free accessibility.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Text Extraction
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Extract and read text from images using OCR technology.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 