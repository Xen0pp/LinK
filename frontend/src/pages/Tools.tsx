import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  PhotoIcon,
  SpeakerWaveIcon,
  DocumentTextIcon,
  CloudArrowUpIcon,
  PlayIcon,
  StopIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Debug function to test backend connectivity
const testBackendConnection = async () => {
  try {
    console.log('Testing backend connection to:', API_BASE_URL);
    const response = await axios.get(`${API_BASE_URL}/health`);
    console.log('Backend connection successful:', response.data);
    toast.success('Backend connection successful!');
    return true;
  } catch (error) {
    console.error('Backend connection failed:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to backend server. Please ensure it\'s running on port 8000.');
      } else if (error.response?.status === 404) {
        toast.error('Backend API not found. Please check the server configuration.');
      } else {
        toast.error(`Backend error: ${error.response?.status || 'Unknown'}`);
      }
    } else {
      toast.error('Unexpected error connecting to backend');
    }
    return false;
  }
};

interface ToolResult {
  type: 'image-caption' | 'text-to-speech' | 'ocr' | 'simplification';
  data: any;
  loading: boolean;
}

const Tools: React.FC = () => {
  const [results, setResults] = useState<Record<string, ToolResult>>({});
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Test backend connection on component mount
  React.useEffect(() => {
    testBackendConnection().then(setBackendConnected);
  }, []);

  const updateResult = (toolId: string, result: Partial<ToolResult>) => {
    setResults(prev => ({
      ...prev,
      [toolId]: { ...prev[toolId], ...result }
    }));
  };

  // Image Captioning Tool
  const ImageCaptionTool = () => {
    const onDrop = async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      updateResult('image-caption', { loading: true, type: 'image-caption', data: null });

      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await axios.post(`${API_BASE_URL}/ai/image-caption`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        updateResult('image-caption', { 
          loading: false, 
          data: { 
            caption: response.data.caption,
            imageUrl: URL.createObjectURL(file)
          }
        });
        toast.success('Image caption generated successfully!');
      } catch (error) {
        updateResult('image-caption', { loading: false, data: null });
        console.error('Image caption error:', error);
        if (axios.isAxiosError(error) && error.code === 'ERR_NETWORK') {
          toast.error('Backend server is not available. Please try again later.');
        } else {
          toast.error('Failed to generate image caption');
        }
      }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
      maxFiles: 1
    });

    const result = results['image-caption'];

    return (
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          Generate descriptive alt text for images using AI vision models.
        </p>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
            isDragActive 
              ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/20 scale-105' 
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50/50 dark:hover:bg-gray-700/50'
          }`}
        >
          <input {...getInputProps()} />
          <CloudArrowUpIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {isDragActive ? 'Drop the image here...' : 'Drag & drop an image, or click to select'}
          </p>
        </div>

        {result?.loading && (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">Analyzing image...</p>
          </div>
        )}

        {result?.data && (
          <div className="space-y-4">
            <img 
              src={result.data.imageUrl} 
              alt="Content for captioning"
              className="max-w-full h-40 object-cover rounded-lg mx-auto shadow-md"
            />
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Generated Caption:</h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{result.data.caption}</p>
              <button
                onClick={() => navigator.clipboard.writeText(result.data.caption)}
                className="mt-3 inline-flex items-center text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <DocumentDuplicateIcon className="h-3 w-3 mr-1" />
                Copy to clipboard
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Text-to-Speech Tool
  const TextToSpeechTool = () => {
    const [text, setText] = useState('');
    const [volume, setVolume] = useState(1.0);

    const handleTextToSpeech = async () => {
      if (!text.trim()) {
        toast.error('Please enter some text');
        return;
      }

      updateResult('text-to-speech', { loading: true, type: 'text-to-speech', data: null });

      try {
        const response = await axios.post(`${API_BASE_URL}/ai/text-to-speech`, 
          { text },
          { responseType: 'blob' }
        );
        
        console.log('TTS Response received:', response.data.size, 'bytes');
        
        // Check if we got a valid audio response
        if (response.data && response.data.size > 0) {
          const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
          const audioUrl = URL.createObjectURL(audioBlob);
          
          console.log('Created audio URL:', audioUrl);
          
          updateResult('text-to-speech', { 
            loading: false, 
            data: { audioUrl, text, source: 'backend' }
          });
          toast.success('Audio generated successfully!');
        } else {
          // Backend returned empty buffer, fallback to browser TTS
          console.log('Backend returned empty audio, using browser TTS fallback');
          handleBrowserTTS();
        }
      } catch (error) {
        console.error('Text-to-speech error:', error);
        if (axios.isAxiosError(error) && error.code === 'ERR_NETWORK') {
          toast.error('Backend server is not available. Using browser text-to-speech.');
          handleBrowserTTS();
        } else {
          toast.error('Backend TTS failed. Using browser text-to-speech.');
          handleBrowserTTS();
        }
      }
    };

    const handleBrowserTTS = () => {
      if ('speechSynthesis' in window) {
        updateResult('text-to-speech', { 
          loading: false, 
          data: { text, source: 'browser' }
        });
        toast.success('Using browser text-to-speech!');
      } else {
        updateResult('text-to-speech', { loading: false, data: null });
        toast.error('Text-to-speech not supported in this browser');
      }
    };

    const playAudio = (audioUrl: string) => {
      if (audioRef.current) {
        console.log('Setting audio source to:', audioUrl);
        
        // Reset the audio element first
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = audioUrl;
        
        // Ensure audio is properly loaded and has volume
        audioRef.current.load();
        audioRef.current.volume = volume;
        
        console.log('Attempting to play audio with volume:', volume);
        console.log('Audio element ready state:', audioRef.current.readyState);
        
        // Wait a moment for the audio to load
        setTimeout(() => {
          if (audioRef.current) {
            const playPromise = audioRef.current.play();
            
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  console.log('Audio started playing successfully');
                  setIsPlaying(prev => ({ ...prev, 'text-to-speech': true }));
                })
                .catch((error) => {
                  console.error('Audio play failed:', error);
                  console.log('Audio duration:', audioRef.current?.duration);
                  console.log('Audio ready state:', audioRef.current?.readyState);
                  
                  if (error.name === 'NotAllowedError') {
                    toast.error('Audio blocked by browser. Please allow audio or use browser TTS.');
                  } else if (error.name === 'NotSupportedError') {
                    toast.error('Audio format not supported. Using browser TTS.');
                    const result = results['text-to-speech'];
                    if (result?.data?.text) {
                      playBrowserTTS(result.data.text);
                    }
                  } else {
                    toast.error('Failed to play audio. Using browser TTS as fallback.');
                    const result = results['text-to-speech'];
                    if (result?.data?.text) {
                      playBrowserTTS(result.data.text);
                    }
                  }
                });
            }
          }
        }, 100); // Small delay to ensure audio is loaded
      }
    };

    const playBrowserTTS = (text: string) => {
      if ('speechSynthesis' in window) {
        // Stop any current speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.volume = volume; // Use user-selected volume
        utterance.pitch = 1.0;
        utterance.lang = 'en-US';
        
        // Try to get a better voice
        const voices = speechSynthesis.getVoices();
        const englishVoice = voices.find(voice => 
          voice.lang.startsWith('en') && voice.localService
        ) || voices.find(voice => voice.lang.startsWith('en'));
        
        if (englishVoice) {
          utterance.voice = englishVoice;
        }
        
        utterance.onstart = () => {
          console.log('Browser TTS started');
          setIsPlaying(prev => ({ ...prev, 'text-to-speech': true }));
        };
        
        utterance.onend = () => {
          console.log('Browser TTS ended');
          setIsPlaying(prev => ({ ...prev, 'text-to-speech': false }));
        };
        
        utterance.onerror = (error) => {
          console.error('Speech synthesis error:', error);
          setIsPlaying(prev => ({ ...prev, 'text-to-speech': false }));
          toast.error('Speech synthesis failed');
        };
        
        speechSynthesis.speak(utterance);
        console.log('Started browser TTS with voice:', englishVoice?.name || 'default');
      } else {
        toast.error('Text-to-speech not supported in this browser');
      }
    };

    const stopAudio = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      // Also stop browser TTS
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      
      setIsPlaying(prev => ({ ...prev, 'text-to-speech': false }));
    };

    const testSystemAudio = () => {
      // Test if system audio is working
      if ('speechSynthesis' in window) {
        const testText = "Testing audio output";
        const utterance = new SpeechSynthesisUtterance(testText);
        utterance.volume = volume;
        speechSynthesis.speak(utterance);
        toast.success('Audio test started - you should hear "Testing audio output"');
      } else {
        toast.error('Speech synthesis not supported');
      }
    };

    const result = results['text-to-speech'];

    return (
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          Convert text to natural-sounding speech for audio accessibility.
        </p>

        {/* Volume Control */}
        <div className="bg-gray-50/50 dark:bg-gray-700/50 rounded-lg p-3">
          <label htmlFor="volume-control" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            Volume: {Math.round(volume * 100)}%
          </label>
          <div className="flex items-center space-x-3">
            <input
              id="volume-control"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
            />
            <button
              onClick={testSystemAudio}
              className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition-colors"
            >
              Test
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="tts-text" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter text to convert to speech:
          </label>
          <textarea
            id="tts-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your text here..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-sm"
            rows={3}
          />
        </div>

        <button
          onClick={handleTextToSpeech}
          disabled={result?.loading || !text.trim()}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm"
        >
          {result?.loading ? 'Generating...' : 'Generate Speech'}
        </button>

        {result?.data && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm flex items-center">
              Generated Audio
              <span className="text-xs font-normal ml-2 px-2 py-1 bg-white/60 dark:bg-gray-800/60 text-green-600 dark:text-green-400 rounded-full">
                {result.data.source === 'browser' ? 'Browser TTS' : 'AI Generated'}
              </span>
            </h4>
            
            <div className="space-y-3">
              {/* Audio Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (result.data.source === 'browser') {
                      playBrowserTTS(result.data.text);
                    } else {
                      playAudio(result.data.audioUrl);
                    }
                  }}
                  disabled={isPlaying['text-to-speech']}
                  className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
                  title="Play Audio"
                >
                  <PlayIcon className="h-4 w-4" />
                </button>
                
                <button
                  onClick={stopAudio}
                  className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                  title="Stop Audio"
                >
                  <StopIcon className="h-4 w-4" />
                </button>
                
                {/* Download Button - only for AI generated audio */}
                {result.data.source === 'backend' && result.data.audioUrl && (
                  <a
                    href={result.data.audioUrl}
                    download={`tts_${Date.now()}.mp3`}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium transition-colors"
                    title="Download Audio"
                  >
                    📥 Download
                  </a>
                )}
                
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  {isPlaying['text-to-speech'] ? 'Playing...' : 'Ready to play'}
                </span>
              </div>
              
              {/* Status Messages */}
              {result.data.source === 'browser' && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  Using browser's built-in text-to-speech as fallback
                </p>
              )}
              
              {result.data.source === 'backend' && (
                <p className="text-xs text-green-600 dark:text-green-400">
                  High-quality AI-generated audio from ElevenLabs
                </p>
              )}
            </div>
          </div>
        )}

        <audio 
          ref={audioRef} 
          onEnded={() => setIsPlaying(prev => ({ ...prev, 'text-to-speech': false }))}
          onError={(e) => {
            console.error('Audio element error:', e);
            setIsPlaying(prev => ({ ...prev, 'text-to-speech': false }));
            toast.error('Audio playback failed');
          }}
          onLoadedData={() => console.log('Audio loaded successfully')}
          onCanPlayThrough={() => console.log('Audio can play through')}
        >
          <track kind="captions" srcLang="en" label="English captions" />
        </audio>
      </div>
    );
  };

  // OCR Tool
  const OCRTool = () => {
    const onDrop = async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      updateResult('ocr', { loading: true, type: 'ocr', data: null });

      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await axios.post(`${API_BASE_URL}/ai/ocr`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        updateResult('ocr', { 
          loading: false, 
          data: { 
            text: response.data.text,
            imageUrl: URL.createObjectURL(file)
          }
        });
        toast.success('Text extracted successfully!');
      } catch (error) {
        updateResult('ocr', { loading: false, data: null });
        console.error('OCR error:', error);
        if (axios.isAxiosError(error) && error.code === 'ERR_NETWORK') {
          toast.error('Backend server is not available. Please try again later.');
        } else {
          toast.error('Failed to extract text');
        }
      }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
      maxFiles: 1
    });

    const result = results['ocr'];

    return (
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          Extract text from images for screen reader compatibility.
        </p>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
            isDragActive 
              ? 'border-purple-400 bg-purple-50/50 dark:bg-purple-900/20 scale-105' 
              : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 hover:bg-gray-50/50 dark:hover:bg-gray-700/50'
          }`}
        >
          <input {...getInputProps()} />
          <CloudArrowUpIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {isDragActive ? 'Drop the image here...' : 'Drag & drop an image with text, or click to select'}
          </p>
        </div>

        {result?.loading && (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">Extracting text...</p>
          </div>
        )}

        {result?.data && (
          <div className="space-y-4">
            <img 
              src={result.data.imageUrl} 
              alt="Content for text extraction"
              className="max-w-full h-40 object-cover rounded-lg mx-auto shadow-md"
            />
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Extracted Text:</h4>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">{result.data.text}</p>
              <button
                onClick={() => navigator.clipboard.writeText(result.data.text)}
                className="mt-3 inline-flex items-center text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                <DocumentDuplicateIcon className="h-3 w-3 mr-1" />
                Copy to clipboard
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Text Simplification Tool - placeholder for future implementation

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            AI-Powered Accessibility Tools
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Transform your content with our comprehensive suite of free AI accessibility tools. 
            Make your digital content inclusive and accessible to everyone with cutting-edge technology.
          </p>
          
          {/* Backend Connection Status */}
          {backendConnected !== null && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold mt-8 shadow-lg ${
                backendConnected 
                  ? 'bg-gradient-to-r from-green-400 to-green-600 text-white' 
                  : 'bg-gradient-to-r from-red-400 to-red-600 text-white'
              }`}
            >
              <div className={`w-3 h-3 rounded-full mr-3 ${
                backendConnected ? 'bg-green-200 animate-pulse' : 'bg-red-200'
              }`}></div>
              {backendConnected ? '🚀 All Tools Available' : '⚠️ Some Tools May Be Unavailable'}
            </motion.div>
          )}
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Captioning Tool */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <PhotoIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    AI Image Captioning
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Vision AI</p>
                </div>
              </div>
              <ImageCaptionTool />
            </div>
          </motion.div>

          {/* Text-to-Speech Tool */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <SpeakerWaveIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Text-to-Speech
                  </h3>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">Audio AI</p>
                </div>
              </div>
              <TextToSpeechTool />
            </div>
          </motion.div>

          {/* OCR Tool */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-1 xl:col-span-1"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <DocumentTextIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    OCR Text Extraction
                  </h3>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Document AI</p>
                </div>
              </div>
              <OCRTool />
            </div>
          </motion.div>
        </div>

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              More Tools Coming Soon! 🚀
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We're continuously working to expand our accessibility toolkit with more AI-powered features.
            </p>
            
            {/* Coming Soon Preview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl p-4 text-white opacity-75">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <span className="text-lg">🎯</span>
                </div>
                <h4 className="font-semibold">Text Simplification</h4>
                <p className="text-sm text-orange-100 mt-1">Make complex text easier to understand</p>
              </div>
              
              <div className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl p-4 text-white opacity-75">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <span className="text-lg">🌍</span>
                </div>
                <h4 className="font-semibold">Language Translation</h4>
                <p className="text-sm text-pink-100 mt-1">Break down language barriers</p>
              </div>
              
              <div className="bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl p-4 text-white opacity-75">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <span className="text-lg">🎤</span>
                </div>
                <h4 className="font-semibold">Speech-to-Text</h4>
                <p className="text-sm text-teal-100 mt-1">Convert audio to readable text</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Tools;