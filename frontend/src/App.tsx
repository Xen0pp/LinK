import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

// Firebase
import { auth } from './config/firebase';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SkipLink from './components/SkipLink';
import VoiceGateway from './components/VoiceGateway';
import UserProfile from './components/auth/UserProfile';

// Pages
import Home from './pages/Home';
import Tools from './pages/Tools';
import Chat from './pages/Chat';
import Deaf from './pages/Deaf';
import Blind from './pages/Blind';
import About from './pages/About';
import NotFound from './pages/NotFound';

// Accessibility with error handling
import { useAccessibility } from './utils/accessibility';

// Lazy load accessibility components to prevent blocking
const AccessibilityWelcome = React.lazy(() => import('./components/AccessibilityWelcome'));

function App() {
  const [accessibilityMode, setAccessibilityMode] = useState<'deaf' | 'blind' | null>(null);
  
  // Safely use accessibility hook with error boundary
  try {
    useAccessibility();
  } catch (error) {
    console.warn('Accessibility hook error:', error);
  }

  // Test Firebase connection on app load
  React.useEffect(() => {
    console.log('🔥 Testing Firebase connection...');
    console.log('Firebase Auth instance:', !!auth);
    console.log('Firebase config check:', {
      hasApiKey: !!process.env.REACT_APP_FIREBASE_API_KEY,
      hasAuthDomain: !!process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      hasProjectId: !!process.env.REACT_APP_FIREBASE_PROJECT_ID
    });
    
    // Test if we can access auth
    if (auth) {
      console.log('✅ Firebase Auth is initialized');
      console.log('Current user on load:', auth.currentUser?.email || 'None');
    } else {
      console.error('❌ Firebase Auth is not initialized');
    }
  }, []);

  const handleModeSelect = (mode: 'deaf' | 'blind' | null) => {
    setAccessibilityMode(mode);
    localStorage.setItem('link-accessibility-mode', mode || '');
  };

  const handlePreferenceSet = (preference: 'deaf' | 'blind' | 'skip') => {
    localStorage.setItem('userPreference', preference);
    if (preference !== 'skip') {
      setAccessibilityMode(preference);
    }
  };

  return (
    <Router>
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tools" element={<Tools />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/deaf" element={<Deaf />} />
                <Route path="/blind" element={<Blind />} />
                <Route path="/about" element={<About />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </motion.div>
          </main>
        
          <Footer />
        </div>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
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
  );
}

export default App;
