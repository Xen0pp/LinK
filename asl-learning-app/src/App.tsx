import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';

// Firebase
import { auth } from './config/firebase';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Pages
import Home from './pages/Home';
import ASLLearning from './pages/ASLLearning';
import BlindTools from './pages/BlindTools';
import Chat from './pages/Chat';
import About from './pages/About';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Hooks
import { useAccessibility } from './hooks/useAccessibility';
import { useLocalStorage } from './hooks/useLocalStorage';

// Types
import { AccessibilityMode, UserPreferences } from './types';

// Lazy loaded components
const AccessibilityWelcome = React.lazy(() => import('./components/accessibility/AccessibilityWelcome'));
const VoiceGateway = React.lazy(() => import('./components/accessibility/VoiceGateway'));

function App() {
  const [user, loading, error] = useAuthState(auth);
  const [accessibilityMode, setAccessibilityMode] = useLocalStorage<AccessibilityMode>('accessibility-mode', null);
  const [userPreferences, setUserPreferences] = useLocalStorage<UserPreferences>('user-preferences', {
    accessibilityMode: null,
    fontSize: 'medium',
    highContrast: false,
    reduceMotion: false,
    voiceEnabled: false,
    language: 'en',
    theme: 'light'
  });

  // Initialize accessibility features
  useAccessibility(userPreferences);

  // Handle Firebase Auth state changes
  useEffect(() => {
    if (user) {
      console.log('✅ User authenticated:', user.email);
      // Load user preferences from Firestore if needed
    } else if (!loading) {
      console.log('👤 User not authenticated');
    }
  }, [user, loading]);

  // Handle accessibility mode selection
  const handleAccessibilityModeSelect = (mode: AccessibilityMode) => {
    setAccessibilityMode(mode);
    setUserPreferences(prev => ({
      ...prev,
      accessibilityMode: mode
    }));
  };

  // Handle preference updates
  const handlePreferenceUpdate = (newPreferences: Partial<UserPreferences>) => {
    setUserPreferences(prev => ({
      ...prev,
      ...newPreferences
    }));
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600">{error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className={`min-h-screen transition-colors duration-300 ${
          userPreferences.highContrast ? 'high-contrast' : 'bg-gray-50'
        } ${
          userPreferences.fontSize === 'large' ? 'large-text' : ''
        } ${
          userPreferences.reduceMotion ? 'motion-reduce' : ''
        }`}>
          
          {/* Skip to main content link for screen readers */}
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-primary-600 text-white px-4 py-2 rounded-lg"
          >
            Skip to main content
          </a>

          {/* Voice Gateway for voice commands */}
          {userPreferences.voiceEnabled && (
            <Suspense fallback={null}>
              <VoiceGateway 
                onPreferenceUpdate={handlePreferenceUpdate}
                currentPreferences={userPreferences}
              />
            </Suspense>
          )}
          
          {/* Accessibility Welcome Modal */}
          {!accessibilityMode && (
            <Suspense fallback={null}>
              <AccessibilityWelcome 
                onModeSelect={handleAccessibilityModeSelect}
                currentMode={accessibilityMode}
              />
            </Suspense>
          )}
          
          {/* Voice Status Indicator */}
          {userPreferences.voiceEnabled && (
            <div className="voice-indicator">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-sm font-medium">Voice Active</span>
              </div>
            </div>
          )}
          
          <div className="flex flex-col min-h-screen">
            {/* Navigation */}
            <Navbar 
              user={user}
              preferences={userPreferences}
              onPreferenceUpdate={handlePreferenceUpdate}
            />
          
            {/* Main Content */}
            <main 
              id="main-content" 
              className="flex-1"
              role="main"
              aria-label="Main content"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: userPreferences.reduceMotion ? 0 : 0.3,
                  ease: "easeOut"
                }}
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/asl/*" element={<ASLLearning />} />
                  <Route path="/blind-tools" element={<BlindTools />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </motion.div>
            </main>
          
            {/* Footer */}
            <Footer />
          </div>
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: userPreferences.highContrast ? '#000' : '#363636',
                color: '#fff',
                fontSize: userPreferences.fontSize === 'large' ? '18px' : '14px',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
            containerStyle={{
              top: 80,
            }}
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
