import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MicrophoneIcon,
  PhotoIcon,
  SpeakerWaveIcon,
  StopIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { 
  MicrophoneIcon as MicrophoneIconSolid,
  SpeakerWaveIcon as SpeakerWaveIconSolid
} from '@heroicons/react/24/solid';
import { Button, Card, CardContent, Typography, Alert, Box } from '@mui/material';
import Tesseract from 'tesseract.js';
import VoiceController, { 
  getNavigationCommands, 
  getBlindSectionCommands, 
  checkVoiceSupport,
  getPreferredVoice 
} from '../utils/voiceControl';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Blind: React.FC = () => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [lastVoiceCommand, setLastVoiceCommand] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [supportStatus, setSupportStatus] = useState(checkVoiceSupport());
  
  const voiceController = useRef<VoiceController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize voice controller
  useEffect(() => {
    if (supportStatus.fullSupport) {
      voiceController.current = new VoiceController({
        onListening: setIsListening,
        onResult: setLastVoiceCommand,
        onError: (error) => {
          console.error('Voice error:', error);
          toast.error('Voice recognition error');
        },
        language: 'en-US'
      });

      // Setup commands
      setupVoiceCommands();

      // Welcome message
      setTimeout(() => {
        speak('Welcome to the Blind accessibility section. Say "show help" to hear available commands.');
      }, 1000);

      return () => {
        if (voiceController.current) {
          voiceController.current.destroy();
        }
      };
    }
  }, []);

  const setupVoiceCommands = useCallback(() => {
    if (!voiceController.current) return;

    // Navigation commands
    const navCommands = getNavigationCommands(navigate);
    voiceController.current.addCommands(navCommands);

    // Blind section specific commands
    const blindCommands = getBlindSectionCommands({
      uploadImage: triggerImageUpload,
      readText: readExtractedText,
      stopReading: stopSpeaking,
      showHelp: () => setShowHelp(true),
      clearText: clearExtractedText,
    });
    voiceController.current.addCommands(blindCommands);

    // Additional convenience commands
    voiceController.current.addCommand('start listening', startListening, 'Start voice recognition');
    voiceController.current.addCommand('stop listening', stopListening, 'Stop voice recognition');
  }, [navigate]);

  const speak = useCallback((text: string, options?: any) => {
    if (!voiceController.current) return;
    
    setIsSpeaking(true);
    voiceController.current.speak(text, {
      voice: getPreferredVoice('en'),
      rate: 0.9,
      ...options,
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  }, []);

  const stopSpeaking = useCallback(() => {
    if (voiceController.current) {
      voiceController.current.stopSpeaking();
      setIsSpeaking(false);
    }
  }, []);

  const startListening = useCallback(() => {
    if (voiceController.current) {
      const success = voiceController.current.startListening();
      if (success) {
        speak('Voice recognition started. I am listening for commands.');
      }
    }
  }, [speak]);

  const stopListening = useCallback(() => {
    if (voiceController.current) {
      voiceController.current.stopListening();
      speak('Voice recognition stopped.');
    }
  }, [speak]);

  const triggerImageUpload = useCallback(() => {
    fileInputRef.current?.click();
    speak('Please select an image file for text extraction.');
  }, [speak]);

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      speak('Please select a valid image file.');
      return;
    }

    setIsProcessingOCR(true);
    speak('Processing image for text extraction. Please wait.');

    try {
      const { data: { text, confidence } } = await Tesseract.recognize(
        file,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
            }
          }
        }
      );

      if (text.trim()) {
        setExtractedText(text.trim());
        speak(`Text extraction complete. Found ${text.split(' ').length} words with ${Math.round(confidence)}% confidence. Say "read text" to hear the extracted content.`);
        toast.success('Text extracted successfully');
      } else {
        speak('No text was found in the image. Please try with a different image.');
                 toast('No text found in image', { icon: '⚠️' });
      }
    } catch (error) {
      console.error('OCR Error:', error);
      speak('Error processing image. Please try again.');
      toast.error('Error processing image');
    } finally {
      setIsProcessingOCR(false);
    }
  }, [speak]);

  const readExtractedText = useCallback(() => {
    if (!extractedText.trim()) {
      speak('No text available to read. Please upload an image first.');
      return;
    }

    speak(`Reading extracted text: ${extractedText}`);
  }, [extractedText, speak]);

  const clearExtractedText = useCallback(() => {
    setExtractedText('');
    speak('Extracted text cleared.');
  }, [speak]);

  const voiceCommands = [
    { command: 'upload image', description: 'Select an image file for OCR text extraction' },
    { command: 'read text', description: 'Read the extracted text aloud' },
    { command: 'stop reading', description: 'Stop text-to-speech playback' },
    { command: 'clear text', description: 'Clear the extracted text' },
    { command: 'show help', description: 'Display this help information' },
    { command: 'start listening', description: 'Start voice recognition' },
    { command: 'stop listening', description: 'Stop voice recognition' },
    { command: 'go home', description: 'Navigate to home page' },
    { command: 'go to tools', description: 'Navigate to tools page' },
    { command: 'go to deaf section', description: 'Navigate to deaf learning section' },
    { command: 'go to chat', description: 'Navigate to AI chat assistant' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="text-blue-600 dark:text-blue-400">Voice Control</span> Accessibility
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Navigate hands-free with voice commands and extract text from images using OCR technology.
            </p>

            {/* Support Status */}
            {!supportStatus.fullSupport && (
              <Alert severity="warning" className="mb-6 max-w-lg mx-auto">
                <Typography variant="body2">
                  {!supportStatus.speechRecognition && 'Voice recognition not supported. '}
                  {!supportStatus.speechSynthesis && 'Text-to-speech not supported. '}
                  Some features may be limited in this browser.
                </Typography>
              </Alert>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Voice Control Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <MicrophoneIcon className="h-6 w-6 text-blue-600" />
                  <Typography variant="h6" className="font-semibold">
                    Voice Control
                  </Typography>
                </div>

                <div className="space-y-4">
                  {/* Voice Status */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {isListening ? (
                        <MicrophoneIconSolid className="h-5 w-5 text-green-600 animate-pulse" />
                      ) : (
                        <MicrophoneIcon className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="text-sm font-medium">
                        {isListening ? 'Listening...' : 'Voice recognition off'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isSpeaking ? (
                        <SpeakerWaveIconSolid className="h-5 w-5 text-blue-600 animate-pulse" />
                      ) : (
                        <SpeakerWaveIcon className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="text-sm">
                        {isSpeaking ? 'Speaking' : 'Silent'}
                      </span>
                    </div>
                  </div>

                  {/* Voice Commands */}
                  <div className="space-y-2">
                    <Button
                      variant={isListening ? "contained" : "outlined"}
                      color={isListening ? "error" : "primary"}
                      onClick={isListening ? stopListening : startListening}
                      disabled={!supportStatus.speechRecognition}
                      startIcon={isListening ? <StopIcon className="h-4 w-4" /> : <MicrophoneIcon className="h-4 w-4" />}
                      fullWidth
                      size="large"
                      aria-label={isListening ? "Stop voice recognition" : "Start voice recognition"}
                    >
                      {isListening ? 'Stop Listening' : 'Start Voice Recognition'}
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={() => setShowHelp(true)}
                      startIcon={<QuestionMarkCircleIcon className="h-4 w-4" />}
                      fullWidth
                      aria-label="Show voice commands help"
                    >
                      Show Voice Commands
                    </Button>
                  </div>

                  {/* Last Command */}
                  {lastVoiceCommand && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                      <Typography variant="body2" className="text-blue-800 dark:text-blue-200">
                        Last command: "{lastVoiceCommand}"
                      </Typography>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* OCR Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <DocumentTextIcon className="h-6 w-6 text-green-600" />
                  <Typography variant="h6" className="font-semibold">
                    Text Extraction (OCR)
                  </Typography>
                </div>

                <div className="space-y-4">
                  {/* Upload Control */}
                  <Button
                    variant="contained"
                    onClick={triggerImageUpload}
                    disabled={isProcessingOCR}
                    startIcon={<PhotoIcon className="h-4 w-4" />}
                    fullWidth
                    size="large"
                    aria-label="Upload image for text extraction"
                  >
                    {isProcessingOCR ? 'Processing Image...' : 'Upload Image'}
                  </Button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    aria-label="Select image file for OCR"
                  />

                  {/* OCR Progress */}
                  {isProcessingOCR && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                        <Typography variant="body2" className="text-yellow-800 dark:text-yellow-200">
                          Extracting text from image...
                        </Typography>
                      </div>
                    </div>
                  )}

                  {/* Extracted Text */}
                  {extractedText && (
                    <div className="space-y-2">
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg max-h-40 overflow-y-auto">
                        <Typography variant="body2" className="whitespace-pre-wrap">
                          {extractedText}
                        </Typography>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outlined"
                          onClick={readExtractedText}
                          disabled={isSpeaking || !supportStatus.speechSynthesis}
                          startIcon={<SpeakerWaveIcon className="h-4 w-4" />}
                          aria-label="Read extracted text aloud"
                        >
                          Read Aloud
                        </Button>
                        
                        <Button
                          variant="outlined"
                          onClick={stopSpeaking}
                          disabled={!isSpeaking}
                          startIcon={<StopIcon className="h-4 w-4" />}
                          aria-label="Stop reading"
                        >
                          Stop
                        </Button>
                        
                        <Button
                          variant="outlined"
                          onClick={clearExtractedText}
                          startIcon={<TrashIcon className="h-4 w-4" />}
                          aria-label="Clear extracted text"
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Voice Commands Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Typography variant="h6" className="font-semibold">
                    Voice Commands
                  </Typography>
                  <Button
                    onClick={() => setShowHelp(false)}
                    aria-label="Close help dialog"
                  >
                    ✕
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {voiceCommands.map((cmd, index) => (
                    <div key={index} className="flex flex-col space-y-1">
                      <code className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        "{cmd.command}"
                      </code>
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-300 ml-2">
                        {cmd.description}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Blind; 