import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Upload, Play, Pause, Volume2, VolumeX, Eye, Headphones, Activity, Mic, MicOff, HelpCircle, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { useVoiceControl } from '../contexts/VoiceControlContext';

interface VoiceStatus {
  isListening: boolean;
  isOnBreak: boolean;
  isProcessing: boolean;
  lastCommand: string;
  commandCount: number;
}

const Blind: React.FC = () => {
  // Use global voice control context
  const { voiceStatus, toggleBlindMode, speak, addCustomCommand, removeCustomCommand, supportStatus } = useVoiceControl();
  
  // Local state for page-specific features
  const [isOCRActive, setIsOCRActive] = useState(false);
  const [isScreenReader, setIsScreenReader] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isLocalVoiceEnabled, setIsLocalVoiceEnabled] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize page-specific voice commands when component mounts
  useEffect(() => {
    // Add page-specific commands
    addCustomCommand('upload image', () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
        speak('Opening file selector for image upload');
      }
    }, 'Upload an image for OCR text extraction');

    addCustomCommand('start screen reader', () => {
      setIsScreenReader(true);
      startScreenReader();
    }, 'Start reading page content aloud');

    addCustomCommand('stop screen reader', () => {
      setIsScreenReader(false);
      stopScreenReader();
    }, 'Stop reading page content');

    addCustomCommand('show help', () => {
      setShowHelp(true);
      announceBlindHelp();
    }, 'Show help for blind accessibility features');

    addCustomCommand('hide help', () => {
      setShowHelp(false);
      speak('Help closed');
    }, 'Hide the help panel');

    addCustomCommand('what is on this page', () => {
      announcePageDescription();
    }, 'Describe the contents and features of this page');

    // Cleanup function to remove custom commands when component unmounts
      return () => {
      removeCustomCommand('upload image');
      removeCustomCommand('start screen reader');
      removeCustomCommand('stop screen reader');
      removeCustomCommand('show help');
      removeCustomCommand('hide help');
      removeCustomCommand('what is on this page');
    };
  }, [addCustomCommand, removeCustomCommand, speak]);

  // Welcome message when entering the page
  useEffect(() => {
    setTimeout(() => {
      if (voiceStatus.isBlindMode) {
        speak('Welcome to Blind Accessibility Section. Voice commands are active globally. Say "what is on this page" to learn about available features, or "help" for all commands.');
      } else {
        speak('Welcome to Blind Accessibility Section. Click "Activate Global Blind Mode" to enable voice commands throughout the entire application.');
      }
    }, 1000);
  }, [speak, voiceStatus.isBlindMode]);

  const announcePageDescription = useCallback(() => {
    const description = `
      You are on the Blind Accessibility page. This page offers several tools:
      
      1. Global Blind Mode - Enables voice commands throughout the entire LinK application
      2. Image to Text OCR - Upload images to extract and read text content
      3. Screen Reader - Reads page content aloud with navigation controls
      4. Voice Control Settings - Manage voice recognition preferences
      
      Main actions available:
      - Say "upload image" to select and process an image
      - Say "start screen reader" to begin reading page content
      - Say "activate global mode" to enable voice commands everywhere
      - Say "help" to hear all available commands
    `;
    
    speak(description);
  }, [speak]);

  const announceBlindHelp = useCallback(() => {
    const helpText = `
      Blind Accessibility Voice Commands:
      
      Global Navigation:
      - "go home", "go to chat", "deaf learning", "ai tools", "about page"
      - "scroll up", "scroll down", "go to top", "go to bottom"
      - "go back", "refresh page"
      
      Page Specific:
      - "upload image" - Select image for OCR text extraction
      - "start screen reader" - Begin reading page content
      - "stop screen reader" - Stop reading content
      - "what is on this page" - Describe page features
      - "activate global mode" - Enable voice commands everywhere
      
      Voice Control:
      - "help" - Repeat available commands
      - "disable voice" - Turn off voice recognition
      - "exit blind mode" - Disable global blind accessibility
      
      The voice recognition listens continuously and takes automatic breaks for stability.
    `;
    
    speak(helpText);
  }, [speak]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      speak('Please upload an image file');
      toast.error('Please upload an image file');
      return;
    }

    setIsProcessingOCR(true);
    speak('Processing image for text extraction. Please wait.');

    try {
      // Simple OCR simulation - in a real app, you'd use Tesseract.js or an API
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target?.result as string;
        
        // Simulate OCR processing
        setTimeout(() => {
          const sampleText = "This is extracted text from your uploaded image. In a production environment, this would be processed using OCR technology like Tesseract.js to extract actual text from the image.";
          setExtractedText(sampleText);
          setIsProcessingOCR(false);
          speak('Text extraction completed. The extracted text is now available. Would you like me to read it?');
          
          // Auto-read extracted text after a short delay
          setTimeout(() => {
            speak(`Extracted text: ${sampleText}`);
          }, 2000);
        }, 3000);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      setIsProcessingOCR(false);
      speak('Error processing image. Please try again.');
      toast.error('Error processing image');
    }
  };

  const startScreenReader = useCallback(() => {
    setIsScreenReader(true);
    setIsSpeaking(true);
    
    const content = document.querySelector('#main-content');
    if (content) {
      const textContent = content.textContent || '';
      const cleanText = textContent.replace(/\s+/g, ' ').trim();
      speak(`Starting screen reader. Page content: ${cleanText}`);
    } else {
      speak('Starting screen reader. Reading current page content.');
    }
  }, [speak]);

  const stopScreenReader = useCallback(() => {
    setIsScreenReader(false);
    setIsSpeaking(false);
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    speak('Screen reader stopped');
  }, [speak]);

  const toggleGlobalBlindMode = () => {
    toggleBlindMode(!voiceStatus.isBlindMode);
  };

  const VoiceStatusIndicator = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Activity className="h-5 w-5 mr-2 text-blue-600" />
          Voice Status
        </h3>
        <div className={`w-3 h-3 rounded-full ${
          voiceStatus.isListening ? 'bg-green-500 animate-pulse' : 
          voiceStatus.isOnBreak ? 'bg-yellow-500' : 
          voiceStatus.isProcessing ? 'bg-blue-500 animate-spin' : 'bg-gray-400'
        }`}></div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Mode:</span>
          <span className={`text-sm font-medium ${voiceStatus.isBlindMode ? 'text-green-600' : 'text-gray-500'}`}>
            {voiceStatus.isBlindMode ? 'Global Blind Mode' : 'Local Mode'}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {voiceStatus.isProcessing ? 'Processing...' : 
             voiceStatus.isOnBreak ? 'Taking Break' : 
             voiceStatus.isListening ? 'Listening' : 'Ready'}
          </span>
        </div>
        
        {voiceStatus.lastCommand && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Last Command:</span>
            <span className="text-sm text-blue-600 dark:text-blue-400 max-w-32 truncate">
              "{voiceStatus.lastCommand}"
            </span>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Commands Used:</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">{voiceStatus.commandCount}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-6">
          <Eye className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Blind Accessibility Tools
            </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Advanced voice-controlled accessibility features designed for users with visual impairments.
          Experience seamless navigation and content interaction through voice commands and audio feedback.
        </p>
      </div>

      {/* Global Blind Mode Toggle */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                <Zap className="h-6 w-6 mr-2 text-purple-600" />
                Global Blind Mode
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Enable voice commands throughout the entire LinK application. When activated, you can navigate 
                between pages, access features, and control the interface using voice commands from anywhere.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                ✨ Works on all pages • 🎤 Continuous listening • 🔄 Auto-restart • 📱 Global navigation
              </div>
            </div>
            <button
              onClick={toggleGlobalBlindMode}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                voiceStatus.isBlindMode
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
              aria-label={voiceStatus.isBlindMode ? 'Disable global blind mode' : 'Activate global blind mode'}
            >
              {voiceStatus.isBlindMode ? 'Deactivate Global Mode' : 'Activate Global Mode'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Voice Control Status */}
        <div className="lg:col-span-1">
          <VoiceStatusIndicator />
          
          {/* Voice Support Status */}
          <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Headphones className="h-5 w-5 mr-2 text-green-600" />
              Voice Support
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Speech Recognition:</span>
                <span className={`text-sm font-medium ${supportStatus.speechRecognition ? 'text-green-600' : 'text-red-600'}`}>
                  {supportStatus.speechRecognition ? '✅ Supported' : '❌ Not Supported'}
                </span>
                </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Speech Synthesis:</span>
                <span className={`text-sm font-medium ${supportStatus.speechSynthesis ? 'text-green-600' : 'text-red-600'}`}>
                  {supportStatus.speechSynthesis ? '✅ Supported' : '❌ Not Supported'}
                      </span>
                    </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Full Support:</span>
                <span className={`text-sm font-medium ${supportStatus.fullSupport ? 'text-green-600' : 'text-red-600'}`}>
                  {supportStatus.fullSupport ? '✅ Ready' : '❌ Limited'}
                      </span>
                    </div>
                  </div>

            {!supportStatus.fullSupport && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                <p className="text-sm text-yellow-800 dark:text-yellow-400">
                  ⚠️ For full functionality, please use Chrome, Edge, or Safari browsers.
                </p>
                    </div>
                  )}
                </div>
                </div>

        {/* Main Features */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image to Text OCR */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Camera className="h-6 w-6 mr-3 text-blue-600" />
              Image to Text (OCR)
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Upload images to extract and read text content aloud. Perfect for reading documents, signs, labels, and printed materials.
            </p>

                <div className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                onChange={handleFileUpload}
                    className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingOCR}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <Upload className="h-5 w-5 mr-2" />
                {isProcessingOCR ? 'Processing Image...' : 'Upload Image'}
              </button>
              
              {extractedText && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Extracted Text:</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{extractedText}</p>
                  <button
                    onClick={() => speak(extractedText)}
                    className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    Read Aloud
                  </button>
                    </div>
                  )}
            </div>
                      </div>
                      
          {/* Screen Reader Controls */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Headphones className="h-6 w-6 mr-3 text-green-600" />
              Screen Reader
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Read page content aloud with intelligent text parsing and natural speech patterns.
            </p>
            
            <div className="flex space-x-4">
              <button
                onClick={startScreenReader}
                disabled={isScreenReader}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Reading
              </button>
              
              <button
                onClick={stopScreenReader}
                disabled={!isScreenReader}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center"
              >
                <Pause className="h-5 w-5 mr-2" />
                Stop Reading
              </button>
                      </div>
            
            {isScreenReader && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                <p className="text-sm text-green-800 dark:text-green-400 flex items-center">
                  <Mic className="h-4 w-4 mr-2" />
                  Screen reader is active and reading page content.
                </p>
                    </div>
                  )}
                </div>

          {/* Help Panel */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
                <HelpCircle className="h-6 w-6 mr-3 text-purple-600" />
                Voice Commands Help
              </h2>
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                {showHelp ? 'Hide Help' : 'Show Help'}
              </button>
                </div>
                
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Say "help" or click the button above to see all available voice commands for this page and global navigation.
            </p>
            
            {showHelp && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Page Commands:</h4>
                    <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                      <li>• "upload image" - Select image file</li>
                      <li>• "start screen reader" - Begin reading</li>
                      <li>• "stop screen reader" - Stop reading</li>
                      <li>• "what is on this page" - Page description</li>
                      <li>• "activate global mode" - Enable global voice</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Global Commands:</h4>
                    <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                      <li>• "go home" - Navigate to home page</li>
                      <li>• "go to chat" - Open chat assistant</li>
                      <li>• "deaf learning" - ASL learning section</li>
                      <li>• "ai tools" - AI accessibility tools</li>
                      <li>• "help" - Show all commands</li>
                    </ul>
                    </div>
                </div>
              </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blind; 