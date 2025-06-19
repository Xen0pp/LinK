import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface VoiceControlOptions {
  isBlindMode: boolean;
  onCommand?: (command: string) => void;
}

export const useVoiceControl = ({ isBlindMode, onCommand }: VoiceControlOptions) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [lastCommand, setLastCommand] = useState<string>('');
  const navigate = useNavigate();

  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.volume = 0.8;
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  }, []);

  const processCommand = useCallback((command: string) => {
    const lowerCommand = command.toLowerCase().trim();
    setLastCommand(command);

    console.log('Processing voice command:', lowerCommand);

    // Navigation commands
    if (lowerCommand.includes('go to home') || lowerCommand.includes('home page')) {
      navigate('/');
      speakText('Navigating to home page');
    } else if (lowerCommand.includes('go to about') || lowerCommand.includes('about page')) {
      navigate('/about');
      speakText('Navigating to about page');
    } else if (lowerCommand.includes('go to tools') || lowerCommand.includes('tools page')) {
      navigate('/tools');
      speakText('Navigating to AI tools page');
    } else if (lowerCommand.includes('go to chat') || lowerCommand.includes('chat page') || lowerCommand.includes('assistant')) {
      navigate('/chat');
      speakText('Navigating to AI assistant chat');
    } else if (lowerCommand.includes('deaf learning') || lowerCommand.includes('deaf section')) {
      navigate('/deaf');
      speakText('Navigating to deaf learning section');
    } else if (lowerCommand.includes('profile') || lowerCommand.includes('my profile')) {
      navigate('/profile');
      speakText('Navigating to your profile');
    } 
    // Authentication commands
    else if (lowerCommand.includes('sign in') || lowerCommand.includes('login') || lowerCommand.includes('log in')) {
      speakText('Opening sign in dialog. Please use visual interface to complete authentication.');
      // Trigger sign in modal - we'll need to pass this up to the parent component
      onCommand?.('open-auth');
    }
    // Help commands
    else if (lowerCommand.includes('help') || lowerCommand.includes('what can i do') || lowerCommand.includes('commands')) {
      const helpText = `Available voice commands: Say "go to home" for homepage, "go to tools" for AI tools, "go to chat" for assistant, "go to about" for information, "deaf learning" for sign language section, "profile" for your profile, "sign in" to authenticate, or "help" to repeat this message.`;
      speakText(helpText);
    }
    // Repeat/what did you say
    else if (lowerCommand.includes('repeat') || lowerCommand.includes('what did you say') || lowerCommand.includes('say again')) {
      speakText('I\'m listening for your voice commands. You can say things like "go to home", "go to tools", "go to chat", or "help" for more options.');
    }
    // Unknown command
    else {
      speakText(`I didn't understand "${command}". Try saying "help" to hear available commands.`);
    }
  }, [navigate, speakText, onCommand]);

  const startListening = useCallback(() => {
    if (!isBlindMode || !recognition) return;

    try {
      setIsListening(true);
      recognition.start();
      console.log('Voice recognition started');
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setIsListening(false);
    }
  }, [isBlindMode, recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
      console.log('Voice recognition stopped');
    }
  }, [recognition]);

  useEffect(() => {
    if (!isBlindMode) return;

    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      speakText('Voice control is not supported in this browser. Please use a modern browser like Chrome or Firefox.');
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
    };

    recognitionInstance.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log('Voice command received:', transcript);
      processCommand(transcript);
    };

    recognitionInstance.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'no-speech') {
        speakText('I didn\'t hear anything. Please try again.');
      } else if (event.error === 'network') {
        speakText('Network error. Please check your internet connection.');
      } else {
        speakText('Sorry, there was an error with voice recognition. Please try again.');
      }
    };

    recognitionInstance.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
      
      // Auto-restart listening after a short delay in blind mode
      if (isBlindMode) {
        setTimeout(() => {
          if (isBlindMode) {
            startListening();
          }
        }, 2000);
      }
    };

    setRecognition(recognitionInstance);

    // Start listening automatically in blind mode
    if (isBlindMode) {
      setTimeout(() => {
        startListening();
      }, 1000);
    }

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, [isBlindMode, processCommand, startListening]);

  // Keyboard shortcut for manual voice activation
  useEffect(() => {
    if (!isBlindMode) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Press spacebar to manually trigger voice recognition
      if (event.code === 'Space' && !isListening) {
        event.preventDefault();
        startListening();
        speakText('Listening...');
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isBlindMode, isListening, startListening, speakText]);

  return {
    isListening,
    lastCommand,
    startListening,
    stopListening,
    speakText
  };
}; 