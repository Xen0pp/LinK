'use client'

import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">LinK</h3>
            <p className="text-gray-300 mb-4">
              Making digital content accessible for everyone through AI-powered tools and sign language learning.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/tools" className="text-gray-300 hover:text-white transition-colors">Tools</Link></li>
              <li><Link href="/chat" className="text-gray-300 hover:text-white transition-colors">AI Assistant</Link></li>
              <li><Link href="/deaf" className="text-gray-300 hover:text-white transition-colors">ASL Learning</Link></li>
              <li><Link href="/blind" className="text-gray-300 hover:text-white transition-colors">Accessibility</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">About</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 LinK Accessibility Platform. Made with ❤️ for accessibility and inclusion.
          </p>
        </div>
      </div>
    </footer>
  )
} 