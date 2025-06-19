'use client'

import React, { useState, Suspense } from 'react'
import { Toaster } from 'react-hot-toast'

// Firebase
import { auth } from '@/config/firebase'

// Components
import Navbar from './Navbar'
import Footer from './Footer'
import SkipLink from './SkipLink'
import VoiceGateway from './VoiceGateway'

// Accessibility
import { useAccessibility } from '@/utils/accessibility'

// Lazy load accessibility components
const AccessibilityWelcome = React.lazy(() => import('./AccessibilityWelcome'))

interface AppProviderProps {
  children: React.ReactNode
}

export default function AppProvider({ children }: AppProviderProps) {
  const [accessibilityMode, setAccessibilityMode] = useState<'deaf' | 'blind' | null>(null)
  
  // Safely use accessibility hook with error boundary
  try {
    useAccessibility()
  } catch (error) {
    console.warn('Accessibility hook error:', error)
  }

  // Test Firebase connection on app load
  React.useEffect(() => {
    console.log('🔥 Testing Firebase connection...')
    console.log('Firebase Auth instance:', !!auth)
    console.log('Firebase config check:', {
      hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      hasAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    })
    
    // Test if we can access auth
    if (auth) {
      console.log('✅ Firebase Auth is initialized')
      console.log('Current user on load:', auth.currentUser?.email || 'None')
    } else {
      console.error('❌ Firebase Auth is not initialized')
    }
  }, [])

  const handleModeSelect = (mode: 'deaf' | 'blind' | null) => {
    setAccessibilityMode(mode)
    localStorage.setItem('link-accessibility-mode', mode || '')
  }

  const handlePreferenceSet = (preference: 'deaf' | 'blind' | 'skip') => {
    localStorage.setItem('userPreference', preference)
    if (preference !== 'skip') {
      setAccessibilityMode(preference)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <SkipLink />
      <VoiceGateway onPreferenceSet={handlePreferenceSet} />
      
      {/* Lazy load AccessibilityWelcome with fallback */}
      <Suspense fallback={<div></div>}>
        <AccessibilityWelcome onModeSelect={handleModeSelect} />
      </Suspense>
      
      {/* Voice Status Indicator for Blind Mode */}
      {accessibilityMode === 'blind' && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm font-medium">Voice Ready</span>
          </div>
        </div>
      )}
      
      <div className="flex flex-col min-h-screen">
        <Navbar />
      
        <main 
          id="main-content" 
          className="flex-1"
          role="main"
          aria-label="Main content"
        >
          {children}
        </main>
      
        <Footer />
      </div>
    </div>
  )
} 