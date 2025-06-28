import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

interface VoiceStatus {
  isListening: boolean;
  isOnBreak: boolean;
  isProcessing: boolean;
  lastCommand: string;
  commandCount: number;
  isBlindMode: boolean;
  isGlobalVoiceEnabled: boolean;
}

interface VoiceControlContextType {
  voiceStatus: VoiceStatus;
  toggleBlindMode: (enabled: boolean) => void;
  toggleGlobalVoice: (enabled: boolean) => void;
  speak: (text: string, interrupt?: boolean) => void;
  addCustomCommand: (command: string, action: () => void, description: string) => void;
  removeCustomCommand: (command: string) => void;
  announcePageChange: (pageName: string) => void;
  supportStatus: {
    speechRecognition: boolean;
    speechSynthesis: boolean;
    fullSupport: boolean;
  };
}

const VoiceControlContext = createContext<VoiceControlContextType | undefined>(undefined);

export const useVoiceControl = () => {
  const context = useContext(VoiceControlContext);
  if (!context) {
    throw new Error('useVoiceControl must be used within a VoiceControlProvider');
  }
  return context;
};

interface VoiceControlProviderProps {
  children: React.ReactNode;
}

export const VoiceControlProvider: React.FC<VoiceControlProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>({
    isListening: false,
    isOnBreak: false,
    isProcessing: false,
    lastCommand: '',
    commandCount: 0,
    isBlindMode: false,
    isGlobalVoiceEnabled: false
  });

  const [supportStatus, setSupportStatus] = useState({
    speechRecognition: false,
    speechSynthesis: false,
    fullSupport: false
  });

  const [customCommands, setCustomCommands] = useState<{[key: string]: {action: () => void, description: string}}>({});

  const recognitionRef = useRef<any>(null);
  const listenTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const breakTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSpeakingRef = useRef(false);

  // Check voice support on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechSynthesis = 'speechSynthesis' in window;
    const recognition = !!SpeechRecognition;
    
    setSupportStatus({
      speechRecognition: recognition,
      speechSynthesis: speechSynthesis,
      fullSupport: recognition && speechSynthesis
    });

    // Load saved blind mode preference
    const savedBlindMode = localStorage.getItem('linK_blindMode') === 'true';
    if (savedBlindMode) {
      setVoiceStatus(prev => ({ ...prev, isBlindMode: true, isGlobalVoiceEnabled: true }));
    }
  }, []);

  // Initialize voice recognition when blind mode is enabled
  useEffect(() => {
    if (supportStatus.fullSupport && voiceStatus.isBlindMode && voiceStatus.isGlobalVoiceEnabled) {
      initializeGlobalVoiceRecognition();
    } else {
      cleanupVoiceRecognition();
    }

    return () => {
      cleanupVoiceRecognition();
    };
  }, [supportStatus.fullSupport, voiceStatus.isBlindMode, voiceStatus.isGlobalVoiceEnabled]);

  // Announce page changes in blind mode
  useEffect(() => {
    if (voiceStatus.isBlindMode) {
      const pageName = getPageName(location.pathname);
      setTimeout(() => {
        announcePageChange(pageName);
      }, 500);
    }
  }, [location.pathname, voiceStatus.isBlindMode]);

  const getPageName = (pathname: string): string => {
    const routes: {[key: string]: string} = {
      '/': 'Home Page',
      '/chat': 'Chat Assistant',
      '/deaf': 'Deaf Learning Section',
      '/blind': 'Blind Accessibility Section',
      '/tools': 'AI Tools',
      '/about': 'About Page',
      '/settings': 'Settings'
    };
    return routes[pathname] || 'Unknown Page';
  };

  const speak = useCallback((text: string, interrupt: boolean = true) => {
    if (!supportStatus.speechSynthesis) return;

    if (interrupt && speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    isSpeakingRef.current = true;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.volume = 0.8;
    utterance.lang = 'en-US';
    
    utterance.onend = () => {
      isSpeakingRef.current = false;
      setVoiceStatus(prev => ({ ...prev, isProcessing: false }));
    };
    
    utterance.onerror = () => {
      isSpeakingRef.current = false;
      setVoiceStatus(prev => ({ ...prev, isProcessing: false }));
    };

    speechSynthesis.speak(utterance);
  }, [supportStatus.speechSynthesis]);

  const toggleBlindMode = useCallback((enabled: boolean) => {
    setVoiceStatus(prev => ({ 
      ...prev, 
      isBlindMode: enabled,
      isGlobalVoiceEnabled: enabled 
    }));
    
    localStorage.setItem('linK_blindMode', enabled.toString());
    
    if (enabled) {
      speak('Blind accessibility mode activated. Global voice commands are now enabled throughout the application. Say "help" to hear available commands.');
      setTimeout(() => {
        const pageName = getPageName(location.pathname);
        speak(`You are currently on the ${pageName}.`);
      }, 3000);
    } else {
      speak('Blind accessibility mode deactivated. Global voice commands are now disabled.');
    }
  }, [speak, location.pathname]);

  const toggleGlobalVoice = useCallback((enabled: boolean) => {
    setVoiceStatus(prev => ({ ...prev, isGlobalVoiceEnabled: enabled }));
    
    if (enabled && voiceStatus.isBlindMode) {
      speak('Global voice recognition enabled. I will listen continuously across all pages.');
    } else {
      speak('Global voice recognition disabled.');
    }
  }, [speak, voiceStatus.isBlindMode]);

  const announcePageChange = useCallback((pageName: string) => {
    if (voiceStatus.isBlindMode) {
      speak(`Navigated to ${pageName}. Say "help" or "what can I do" to hear available commands on this page.`);
    }
  }, [voiceStatus.isBlindMode, speak]);

  const addCustomCommand = useCallback((command: string, action: () => void, description: string) => {
    setCustomCommands(prev => ({
      ...prev,
      [command.toLowerCase()]: { action, description }
    }));
  }, []);

  const removeCustomCommand = useCallback((command: string) => {
    setCustomCommands(prev => {
      const updated = { ...prev };
      delete updated[command.toLowerCase()];
      return updated;
    });
  }, []);

  const initializeGlobalVoiceRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('🌐 Global voice recognition started');
      setVoiceStatus(prev => ({ 
        ...prev, 
        isListening: true, 
        isOnBreak: false 
      }));
    };

    recognition.onresult = (event: any) => {
      const lastResult = event.results[event.results.length - 1];
      if (lastResult.isFinal) {
        const transcript = lastResult[0].transcript.trim();
        const confidence = lastResult[0].confidence;
        
        if (confidence > 0.4 || confidence === undefined) {
          console.log('🌐 Global voice command:', transcript, 'confidence:', confidence);
          
          setVoiceStatus(prev => ({ 
            ...prev, 
            lastCommand: transcript,
            commandCount: prev.commandCount + 1,
            isProcessing: true
          }));

          processGlobalVoiceCommand(transcript);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('🌐 Global voice error:', event.error);
      
      setVoiceStatus(prev => ({ 
        ...prev, 
        isListening: false,
        isProcessing: false
      }));
      
      if (event.error === 'no-speech') {
        setTimeout(() => {
          if (voiceStatus.isGlobalVoiceEnabled) {
            restartGlobalListening();
          }
        }, 800);
      } else if (event.error === 'not-allowed') {
        speak('Microphone access denied. Please enable microphone permissions.');
        setVoiceStatus(prev => ({ ...prev, isGlobalVoiceEnabled: false }));
      } else {
        setTimeout(() => {
          if (voiceStatus.isGlobalVoiceEnabled) {
            restartGlobalListening();
          }
        }, 1500);
      }
    };

    recognition.onend = () => {
      console.log('🌐 Global voice recognition ended');
      setVoiceStatus(prev => ({ 
        ...prev, 
        isListening: false,
        isProcessing: false
      }));
      
      if (voiceStatus.isGlobalVoiceEnabled) {
        scheduleGlobalRestart();
      }
    };

    recognitionRef.current = recognition;
    startGlobalListening();
  }, [voiceStatus.isGlobalVoiceEnabled]);

  const startGlobalListening = useCallback(() => {
    if (!recognitionRef.current || !voiceStatus.isGlobalVoiceEnabled) return;

    try {
      if (listenTimeoutRef.current) clearTimeout(listenTimeoutRef.current);
      if (breakTimeoutRef.current) clearTimeout(breakTimeoutRef.current);

      recognitionRef.current.start();
      
      // Take breaks every 20 seconds for stability
      listenTimeoutRef.current = setTimeout(() => {
        takeGlobalListeningBreak();
      }, 20000);

    } catch (error) {
      console.error('Error starting global voice recognition:', error);
      setTimeout(() => {
        if (voiceStatus.isGlobalVoiceEnabled) {
          startGlobalListening();
        }
      }, 2000);
    }
  }, [voiceStatus.isGlobalVoiceEnabled]);

  const takeGlobalListeningBreak = useCallback(() => {
    console.log('🌐 Taking global listening break');
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition for break:', error);
      }
    }

    setVoiceStatus(prev => ({ 
      ...prev, 
      isListening: false, 
      isOnBreak: true 
    }));

    breakTimeoutRef.current = setTimeout(() => {
      if (voiceStatus.isGlobalVoiceEnabled) {
        console.log('🌐 Resuming global listening after break');
        setVoiceStatus(prev => ({ ...prev, isOnBreak: false }));
        startGlobalListening();
      }
    }, 1500); // 1.5 second break
  }, [voiceStatus.isGlobalVoiceEnabled, startGlobalListening]);

  const restartGlobalListening = useCallback(() => {
    if (!voiceStatus.isGlobalVoiceEnabled) return;
    
    console.log('🌐 Restarting global voice recognition');
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition for restart:', error);
      }
    }

    setTimeout(() => {
      if (voiceStatus.isGlobalVoiceEnabled) {
        startGlobalListening();
      }
    }, 1000);
  }, [voiceStatus.isGlobalVoiceEnabled, startGlobalListening]);

  const scheduleGlobalRestart = useCallback(() => {
    if (!voiceStatus.isGlobalVoiceEnabled) return;
    
    restartTimeoutRef.current = setTimeout(() => {
      if (voiceStatus.isGlobalVoiceEnabled) {
        startGlobalListening();
      }
    }, 2000);
  }, [voiceStatus.isGlobalVoiceEnabled, startGlobalListening]);

  const cleanupVoiceRecognition = useCallback(() => {
    console.log('🌐 Cleaning up global voice recognition');
    
    if (listenTimeoutRef.current) clearTimeout(listenTimeoutRef.current);
    if (breakTimeoutRef.current) clearTimeout(breakTimeoutRef.current);
    if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition during cleanup:', error);
      }
    }

    setVoiceStatus(prev => ({ 
      ...prev, 
      isListening: false, 
      isOnBreak: false 
    }));
  }, []);

  const processGlobalVoiceCommand = useCallback((command: string) => {
    const lowerCommand = command.toLowerCase().trim();
    
    // Check custom commands first
    if (customCommands[lowerCommand]) {
      customCommands[lowerCommand].action();
      speak('Command executed.');
      return;
    }

    // Global navigation commands
    if (lowerCommand.includes('go home') || lowerCommand.includes('home page') || lowerCommand.includes('navigate home')) {
      navigate('/');
      speak('Going to home page');
    } else if (lowerCommand.includes('go to chat') || lowerCommand.includes('chat assistant') || lowerCommand.includes('open chat')) {
      navigate('/chat');
      speak('Opening chat assistant');
    } else if (lowerCommand.includes('deaf learning') || lowerCommand.includes('deaf section') || lowerCommand.includes('sign language')) {
      navigate('/deaf');
      speak('Going to deaf learning section');
    } else if (lowerCommand.includes('blind section') || lowerCommand.includes('blind accessibility') || lowerCommand.includes('accessibility tools')) {
      navigate('/blind');
      speak('Going to blind accessibility section');
    } else if (lowerCommand.includes('ai tools') || lowerCommand.includes('go to tools') || lowerCommand.includes('tools page')) {
      navigate('/tools');
      speak('Going to AI tools page');
    } else if (lowerCommand.includes('about page') || lowerCommand.includes('go to about') || lowerCommand.includes('about us')) {
      navigate('/about');
      speak('Going to about page');
    }
    
    // Voice control commands
    else if (lowerCommand.includes('disable voice') || lowerCommand.includes('stop voice') || lowerCommand.includes('turn off voice')) {
      toggleGlobalVoice(false);
    } else if (lowerCommand.includes('enable voice') || lowerCommand.includes('start voice') || lowerCommand.includes('turn on voice')) {
      toggleGlobalVoice(true);
    } else if (lowerCommand.includes('exit blind mode') || lowerCommand.includes('disable blind mode') || lowerCommand.includes('turn off accessibility')) {
      toggleBlindMode(false);
    }
    
    // Information commands
    else if (lowerCommand.includes('where am i') || lowerCommand.includes('current page') || lowerCommand.includes('what page')) {
      const pageName = getPageName(location.pathname);
      speak(`You are currently on the ${pageName}.`);
    } else if (lowerCommand.includes('help') || lowerCommand.includes('what can i do') || lowerCommand.includes('commands') || lowerCommand.includes('available commands')) {
      announceGlobalHelp();
    } else if (lowerCommand.includes('refresh') || lowerCommand.includes('reload page') || lowerCommand.includes('refresh page')) {
      window.location.reload();
      speak('Page refreshed');
    }
    
    // Utility commands
    else if (lowerCommand.includes('scroll up') || lowerCommand.includes('go up')) {
      window.scrollBy(0, -300);
      speak('Scrolled up');
    } else if (lowerCommand.includes('scroll down') || lowerCommand.includes('go down')) {
      window.scrollBy(0, 300);
      speak('Scrolled down');
    } else if (lowerCommand.includes('scroll to top') || lowerCommand.includes('go to top')) {
      window.scrollTo(0, 0);
      speak('Scrolled to top of page');
    } else if (lowerCommand.includes('scroll to bottom') || lowerCommand.includes('go to bottom')) {
      window.scrollTo(0, document.body.scrollHeight);
      speak('Scrolled to bottom of page');
    }
    
    // Browser commands
    else if (lowerCommand.includes('go back') || lowerCommand.includes('previous page') || lowerCommand.includes('back')) {
      window.history.back();
      speak('Going back to previous page');
    } else if (lowerCommand.includes('go forward') || lowerCommand.includes('next page') || lowerCommand.includes('forward')) {
      window.history.forward();
      speak('Going forward');
    }
    
    // Unknown command
    else {
      speak(`I didn't understand "${command}". Say "help" to hear available commands.`);
    }
  }, [navigate, location.pathname, customCommands, toggleBlindMode, toggleGlobalVoice, speak]);

  const announceGlobalHelp = useCallback(() => {
    const currentPage = getPageName(location.pathname);
    
    let helpText = `Global voice commands available on ${currentPage}:
    
    Navigation: "go home", "go to chat", "deaf learning", "blind section", "ai tools", "about page"
    Page Control: "scroll up", "scroll down", "go to top", "go to bottom", "refresh page", "go back", "go forward"
    Information: "where am i", "current page", "help"
    Voice Control: "disable voice", "exit blind mode"
    
    Page-specific commands may also be available. Try saying "what can I do here" for page-specific help.`;

    speak(helpText);
  }, [location.pathname, speak]);

  const value: VoiceControlContextType = {
    voiceStatus,
    toggleBlindMode,
    toggleGlobalVoice,
    speak,
    addCustomCommand,
    removeCustomCommand,
    announcePageChange,
    supportStatus
  };

  return (
    <VoiceControlContext.Provider value={value}>
      {children}
    </VoiceControlContext.Provider>
  );
}; 