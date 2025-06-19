import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MicrophoneIcon, 
  SpeakerWaveIcon,
  EyeIcon,
  HandRaisedIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Button, 
  Typography, 
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceGatewayProps {
  onPreferenceSet: (preference: 'deaf' | 'blind' | 'skip') => void;
}

const VoiceGateway: React.FC<VoiceGatewayProps> = ({ onPreferenceSet }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [hasSpoken, setHasSpoken] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [browserSupported, setBrowserSupported] = useState(true);
  
  const navigate = useNavigate();
  const recognitionRef = useRef<any>(null);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Check if this is the user's first visit
    const hasVisited = localStorage.getItem('linK_hasVisited');
    const userPreference = localStorage.getItem('linK_userPreference');
    
    if (!hasVisited && !userPreference) {
      setIsOpen(true);
      // Check browser support for speech recognition
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        setBrowserSupported(false);
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen && !hasSpoken && browserSupported) {
      // Speak the welcome message
      speakWelcomeMessage();
    }
  }, [isOpen, browserSupported, hasSpoken]);

  const speakWelcomeMessage = () => {
    if ('speechSynthesis' in window) {
      const welcomeText = `Welcome to LinK Accessibility Platform! 
        I can help you navigate to the right section. 
        Please say "Deaf Learning" if you need help with sign language, 
        or say "Blind Accessibility" if you need voice-guided navigation. 
        You can also say "Skip" to browse manually.`;
      
      const utterance = new SpeechSynthesisUtterance(welcomeText);
      utterance.rate = 0.8;
      utterance.volume = 0.8;
      utterance.onend = () => {
        setHasSpoken(true);
        if (browserSupported) {
          startListening();
        }
      };
      
      speechSynthRef.current = utterance;
      speechSynthesis.speak(utterance);
    } else {
      setHasSpoken(true);
    }
  };

  const startListening = () => {
    if (!browserSupported) {
      setErrorMessage('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage('');
      };
      
      recognition.onresult = (event: any) => {
        const result = event.results[0][0].transcript.toLowerCase().trim();
        setTranscript(result);
        processVoiceCommand(result);
      };
      
      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'no-speech') {
          setErrorMessage('No speech detected. Please try again.');
        } else if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access denied. Please enable microphone permissions.');
        } else {
          setErrorMessage('Speech recognition error. Please try again.');
        }
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      setErrorMessage('Failed to start speech recognition. Please try using the manual buttons.');
      setIsListening(false);
    }
  };

  const processVoiceCommand = (command: string) => {
    // Clean up the command
    const cleanCommand = command.replace(/[.,!?]/g, '').toLowerCase();
    
    if (cleanCommand.includes('deaf') || cleanCommand.includes('sign language')) {
      handlePreferenceSelection('deaf');
    } else if (cleanCommand.includes('blind') || cleanCommand.includes('voice') || cleanCommand.includes('accessibility')) {
      handlePreferenceSelection('blind');
    } else if (cleanCommand.includes('skip') || cleanCommand.includes('manual') || cleanCommand.includes('browse')) {
      handlePreferenceSelection('skip');
    } else {
      // Didn't understand, provide feedback
      speakFeedback(`I heard "${command}". Please say "Deaf Learning", "Blind Accessibility", or "Skip".`);
      setTimeout(() => setTranscript(''), 3000);
    }
  };

  const speakFeedback = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handlePreferenceSelection = (preference: 'deaf' | 'blind' | 'skip') => {
    // Store the preference and mark as visited
    localStorage.setItem('linK_hasVisited', 'true');
    localStorage.setItem('linK_userPreference', preference);
    
    // Stop any ongoing speech
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    
    // Provide confirmation
    let confirmationText = '';
    let route = '';
    
    switch (preference) {
      case 'deaf':
        confirmationText = "Welcome to Deaf Learning! Let's master sign language step-by-step. You can start with flashcards, or explore our dictionary. Your journey begins now!";
        route = '/deaf';
        break;
      case 'blind':
        confirmationText = "Welcome to Blind Accessibility Mode. I'll assist you with voice guidance throughout. Just say what you need help with – and we'll get started!";
        route = '/blind';
        break;
      case 'skip':
        confirmationText = "You can explore all features manually. Welcome to LinK!";
        route = '/';
        break;
    }
    
    speakFeedback(confirmationText);
    
    // Close modal and navigate
    setTimeout(() => {
      setIsOpen(false);
      onPreferenceSet(preference);
      if (route !== '/') {
        navigate(route);
      }
    }, 1000);
  };

  const handleManualSelection = (preference: 'deaf' | 'blind' | 'skip') => {
    handlePreferenceSelection(preference);
  };

  const handleClose = () => {
    // Stop speech and recognition
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    handlePreferenceSelection('skip');
  };

  return (
    <Dialog 
      open={isOpen} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        className: "dark:bg-gray-900 dark:text-white"
      }}
    >
      <DialogTitle className="text-center pb-2">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" className="font-bold text-purple-600 dark:text-purple-400 mb-2">
            Welcome to LinK!
          </Typography>
          <Typography variant="subtitle1" className="text-gray-600 dark:text-gray-300">
            Accessibility-First Learning Platform
          </Typography>
        </motion.div>
      </DialogTitle>
      
      <DialogContent className="pb-6">
        <div className="space-y-6">
          {/* Voice Status */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
              >
                <MicrophoneIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2 animate-pulse" />
                <Typography variant="body1" className="text-blue-800 dark:text-blue-200">
                  Listening... Speak your preference
                </Typography>
                {transcript && (
                  <Typography variant="body2" className="text-blue-600 dark:text-blue-400 mt-2">
                    I heard: "{transcript}"
                  </Typography>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          {errorMessage && (
            <Alert severity="warning" className="mb-4">
              {errorMessage}
            </Alert>
          )}

          {/* Browser Support Warning */}
          {!browserSupported && (
            <Alert severity="info" className="mb-4">
              Voice recognition is not supported in this browser. Please use the buttons below to make your selection.
            </Alert>
          )}

          {/* Instructions */}
          <div className="text-center space-y-4">
            <Typography variant="h6" className="font-semibold">
              How would you like to get started?
            </Typography>
            <Typography variant="body1" className="text-gray-600 dark:text-gray-300">
              Choose your preferred way to navigate and learn:
            </Typography>
          </div>

          {/* Manual Selection Buttons */}
          <div className="grid gap-4 md:grid-cols-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outlined"
                onClick={() => handleManualSelection('deaf')}
                className="w-full h-32 flex flex-col items-center justify-center space-y-2 border-2 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                <HandRaisedIcon className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                <div className="text-center">
                  <Typography variant="h6" className="font-semibold">
                    Deaf Learning
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                    Sign language & visual learning
                  </Typography>
                </div>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outlined"
                onClick={() => handleManualSelection('blind')}
                className="w-full h-32 flex flex-col items-center justify-center space-y-2 border-2 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <SpeakerWaveIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                <div className="text-center">
                  <Typography variant="h6" className="font-semibold">
                    Blind Accessibility
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                    Voice navigation & audio feedback
                  </Typography>
                </div>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outlined"
                onClick={() => handleManualSelection('skip')}
                className="w-full h-32 flex flex-col items-center justify-center space-y-2 border-2 hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <EyeIcon className="h-12 w-12 text-gray-600 dark:text-gray-400" />
                <div className="text-center">
                  <Typography variant="h6" className="font-semibold">
                    Browse Manually
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                    Explore all features yourself
                  </Typography>
                </div>
              </Button>
            </motion.div>
          </div>

          {/* Voice Control Section */}
          {browserSupported && hasSpoken && (
            <div className="text-center space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
                Or use voice commands:
              </Typography>
              <Button
                variant="contained"
                onClick={startListening}
                disabled={isListening}
                className="bg-green-600 hover:bg-green-700 text-white"
                startIcon={isListening ? <CircularProgress size={20} /> : <MicrophoneIcon className="h-5 w-5" />}
              >
                {isListening ? 'Listening...' : 'Start Voice Command'}
              </Button>
            </div>
          )}

          {/* Close Button */}
          <div className="text-center pt-4">
            <Button
              variant="text"
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              startIcon={<XMarkIcon className="h-4 w-4" />}
            >
              Skip and browse manually
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceGateway; 