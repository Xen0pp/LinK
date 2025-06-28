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
import GlobalVoiceIndicator from './components/GlobalVoiceIndicator';

// Contexts
import { VoiceControlProvider } from './contexts/VoiceControlContext';

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
  const [helpCooldown, setHelpCooldown] = useState(false);
  
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

  const triggerHelp = () => {
    if (helpCooldown) return;
    
    const helpText = `LinK Navigation Help: 
      You can say "go to home" for the main page, 
      "go to tools" for AI accessibility tools, 
      "go to chat" for our AI assistant, 
      "deaf learning" for sign language section, 
      "blind accessibility" for voice-guided features, 
      or "profile" for your account settings. 
      You can also use the visual navigation menu at the top of the page.
      Press F1 anytime to repeat this help message.`;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(helpText);
      utterance.rate = 0.8;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
    
    // Set cooldown to prevent spam
    setHelpCooldown(true);
    setTimeout(() => setHelpCooldown(false), 3000);
  };

  // Add global keyboard shortcut for help
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F1') {
        event.preventDefault();
        triggerHelp();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Router>
      <VoiceControlProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <SkipLink />
          <VoiceGateway onPreferenceSet={handlePreferenceSet} />
          
          {/* Lazy load AccessibilityWelcome with fallback */}
          <Suspense fallback={<div></div>}>
            <AccessibilityWelcome onModeSelect={handleModeSelect} />
          </Suspense>
          
          {/* Global Voice Status Indicator */}
          <GlobalVoiceIndicator />

        {/* Help Button - Always visible for navigation assistance */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={triggerHelp}
            className={`${helpCooldown ? 'opacity-50 cursor-not-allowed' : 'hover:from-purple-700 hover:to-blue-700 transform hover:scale-105'} bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200`}
            aria-label="Get navigation help and instructions (F1)"
            title="Click for navigation help (or press F1)"
            disabled={helpCooldown}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
        
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
      </VoiceControlProvider>
    </Router>
  );
}

export default App;
