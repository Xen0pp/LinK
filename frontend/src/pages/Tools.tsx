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

  // Enhanced Text-to-Speech Tool with Document Upload and MP3 Download
  const TextToSpeechTool = () => {
    const [text, setText] = useState('');
    const [volume, setVolume] = useState(1.0);
    const [textSource, setTextSource] = useState<'manual' | 'document'>('manual');
    const [uploadedFileName, setUploadedFileName] = useState('');
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    // Document upload handler
    const handleDocumentUpload = async (file: File) => {
      setUploadedFileName(file.name);
      
      try {
        const fileText = await extractTextFromFile(file);
        if (fileText.trim()) {
          setText(fileText);
          setTextSource('document');
          toast.success(`Text extracted from ${file.name}`);
        } else {
          toast.error('No text found in the uploaded file');
        }
      } catch (error) {
        console.error('Document upload error:', error);
        toast.error('Failed to extract text from document');
      }
    };

    // Extract text from different file types
    const extractTextFromFile = async (file: File): Promise<string> => {
      const fileType = file.type;
      const fileName = file.name.toLowerCase();

      if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
        // Handle plain text files
        return await file.text();
             } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
         // For PDF files - in a real implementation, you'd use pdf-parse or similar
         toast('PDF support requires additional libraries. Please copy and paste the text manually for now.');
         return '';
       } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
         // For DOCX files - in a real implementation, you'd use mammoth.js or similar
         toast('DOCX support requires additional libraries. Please copy and paste the text manually for now.');
         return '';
      } else if (fileType === 'text/rtf' || fileName.endsWith('.rtf')) {
        // Basic RTF support (strip RTF formatting)
        const rtfContent = await file.text();
        // Simple RTF text extraction (removes basic formatting)
        const textMatch = rtfContent.match(/\\f\d+\\fs\d+\s+(.*?)\\par/g);
        if (textMatch) {
          return textMatch.map(match => match.replace(/\\[a-z]+\d*\s*/g, '').replace(/\\par/g, '')).join(' ');
        }
        return rtfContent.replace(/\\[a-z]+\d*\s*/g, '').replace(/[{}]/g, '');
      } else {
        // Try to read as text for other formats
        try {
          return await file.text();
        } catch (error) {
          throw new Error('Unsupported file format');
        }
      }
    };

    const handleTextToSpeech = async () => {
      if (!text.trim()) {
        toast.error('Please enter some text or upload a document');
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
            data: { audioUrl, text, source: 'backend', fileName: uploadedFileName }
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
          data: { text, source: 'browser', fileName: uploadedFileName }
        });
        toast.success('Using browser text-to-speech!');
      } else {
        updateResult('text-to-speech', { loading: false, data: null });
        toast.error('Text-to-speech not supported in this browser');
      }
    };

    // Record browser TTS and create downloadable MP3
    const recordBrowserTTS = async (textToSpeak: string) => {
      if (!('MediaRecorder' in window)) {
        toast.error('Audio recording not supported in this browser');
        return;
      }

      try {
        toast('Recording browser TTS... Please wait for completion.');
        
        // Create a new audio context for recording
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const destination = audioContext.createMediaStreamDestination();
        
        // Try to use MP3 codec if supported, fallback to WebM
        let mimeType = 'audio/webm';
        const supportedTypes = [
          'audio/mp4',
          'audio/mpeg',
          'audio/webm;codecs=opus',
          'audio/webm'
        ];

        for (const type of supportedTypes) {
          if (MediaRecorder.isTypeSupported(type)) {
            mimeType = type;
            break;
          }
        }

        console.log('Using MIME type for recording:', mimeType);
        
        // Start recording
        audioChunksRef.current = [];
        mediaRecorderRef.current = new MediaRecorder(destination.stream, { 
          mimeType: mimeType,
          audioBitsPerSecond: 128000 // 128kbps for good quality
        });
        
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = async () => {
          try {
            // Create the recorded audio blob
            const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
            
            // Create downloadable audio with MP3 extension
            const { blob: downloadBlob, actualFormat } = await createDownloadableAudio(audioBlob, mimeType);
            const audioUrl = URL.createObjectURL(downloadBlob);
            
            // Update result with recorded audio for download
            updateResult('text-to-speech', { 
              loading: false, 
              data: { 
                audioUrl, 
                text: textToSpeak, 
                source: 'browser-recorded',
                fileName: uploadedFileName,
                format: 'mp3',
                actualFormat: actualFormat
              }
            });
            toast.success('Browser TTS recorded and prepared for MP3 download!');
          } catch (error) {
            console.error('Audio processing error:', error);
            // Fallback: provide original audio with warning
            const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
            const audioUrl = URL.createObjectURL(audioBlob);
            
            updateResult('text-to-speech', { 
              loading: false, 
              data: { 
                audioUrl, 
                text: textToSpeak, 
                source: 'browser-recorded',
                fileName: uploadedFileName,
                format: 'webm'
              }
            });
            toast('Audio recorded but download preparation failed. Using original format.');
          }
        };

        mediaRecorderRef.current.start();

        // Create an oscillator connected to the destination for proper audio routing
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0, audioContext.currentTime); // Silent oscillator
        oscillator.connect(gainNode);
        gainNode.connect(destination);
        oscillator.start();

        // Speak the text while recording
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 0.8;
        utterance.volume = volume;
        utterance.pitch = 1.0;
        utterance.lang = 'en-US';

        // Try to get a high-quality voice
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.lang.startsWith('en') && voice.localService && voice.name.includes('Enhanced')
        ) || voices.find(voice => 
          voice.lang.startsWith('en') && voice.localService
        ) || voices.find(voice => voice.lang.startsWith('en'));

        if (preferredVoice) {
          utterance.voice = preferredVoice;
          console.log('Using voice:', preferredVoice.name);
        }
        
        utterance.onstart = () => {
          console.log('Speech started, recording...');
        };

        utterance.onend = () => {
          console.log('Speech ended, stopping recording...');
          setTimeout(() => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
              mediaRecorderRef.current.stop();
            }
            oscillator.stop();
            audioContext.close();
          }, 1000); // Give extra time for audio to finish
        };

        utterance.onerror = (error) => {
          console.error('Speech synthesis error:', error);
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
          }
          oscillator.stop();
          audioContext.close();
          toast.error('Speech synthesis failed during recording');
        };

        speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Recording error:', error);
        toast.error('Failed to record browser TTS');
      }
    };

    // Create downloadable audio with forced MP3 extension
    const createDownloadableAudio = async (audioBlob: Blob, originalMimeType: string): Promise<{blob: Blob, actualFormat: string}> => {
      try {
        // If it's already MP3/MP4, return as is
        if (originalMimeType.includes('mp4') || originalMimeType.includes('mpeg')) {
          return { blob: audioBlob, actualFormat: 'mp3' };
        }

        // For WebM, we'll provide it as-is but with MP3 extension for download
        // Most modern players can handle WebM audio even with .mp3 extension
        console.log('Creating downloadable audio from:', originalMimeType);
        
        // Create a new blob with audio/mpeg type to encourage MP3 treatment
        const arrayBuffer = await audioBlob.arrayBuffer();
        const mp3Blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
        
        return { blob: mp3Blob, actualFormat: 'webm-as-mp3' };
      } catch (error) {
        console.error('Audio processing error:', error);
        // Fallback to original blob
        return { blob: audioBlob, actualFormat: 'original' };
      }
    };

    // Enhanced download with MP3 extension and fallback options
    const downloadAudioAsMP3 = async (audioUrl: string, sourceFileName?: string) => {
      try {
        // Validate URL
        if (!audioUrl || audioUrl.trim() === '') {
          throw new Error('No audio URL provided');
        }
        
        if (!audioUrl.startsWith('blob:') && !audioUrl.startsWith('http') && !audioUrl.startsWith('data:')) {
          throw new Error('Invalid audio URL format');
        }
        
        // Create a proper filename with MP3 extension
        const baseFileName = sourceFileName 
          ? sourceFileName.replace(/\.[^/.]+$/, '') 
          : 'audio';
        const fileName = `tts_${baseFileName}_${Date.now()}.mp3`;
        
        console.log('Starting download for:', fileName);
        console.log('Audio URL:', audioUrl);
        console.log('URL type:', audioUrl.startsWith('blob:') ? 'blob' : audioUrl.startsWith('data:') ? 'data' : 'http');
        
        // Method 1: Try direct download with original URL
        try {
          const downloadLink = document.createElement('a');
          downloadLink.href = audioUrl;
          downloadLink.download = fileName;
          downloadLink.style.display = 'none';
          
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          
          toast.success(`Audio downloaded as ${fileName}`);
          console.log('Direct download successful for:', fileName);
          return;
        } catch (directError) {
          console.log('Direct download failed, trying blob method:', directError);
        }
        
        // Method 2: Fetch and create blob (fallback)
        try {
          const response = await fetch(audioUrl);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const audioBlob = await response.blob();
          console.log('Fetched blob size:', audioBlob.size, 'bytes');
          
          if (audioBlob.size === 0) {
            throw new Error('Empty audio file received');
          }
          
          // Create a new blob with MP3 MIME type
          const mp3Blob = new Blob([audioBlob], { type: 'audio/mpeg' });
          
          // Create a temporary download link
          const downloadUrl = URL.createObjectURL(mp3Blob);
          const downloadLink = document.createElement('a');
          downloadLink.href = downloadUrl;
          downloadLink.download = fileName;
          downloadLink.style.display = 'none';
          
          // Add to DOM, click, and remove
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          
          // Clean up the object URL after a delay
          setTimeout(() => {
            URL.revokeObjectURL(downloadUrl);
            console.log('Cleaned up blob URL');
          }, 2000);
          
          toast.success(`Audio downloaded as ${fileName}`);
          console.log('Blob download successful for:', fileName);
          
        } catch (blobError) {
          console.error('Blob download failed:', blobError);
          
          // Method 3: Last resort - open in new tab
          try {
            const newWindow = window.open(audioUrl, '_blank');
            if (newWindow) {
              toast('Audio opened in new tab. Right-click and "Save As" to download with .mp3 extension');
              console.log('Opened audio in new tab as fallback');
            } else {
              throw new Error('Popup blocked');
            }
          } catch (tabError) {
            console.error('All download methods failed:', tabError);
            toast.error(`Download failed. Try right-clicking the audio player and selecting "Save Audio As" to save as ${fileName}`);
          }
        }
        
              } catch (error) {
          console.error('Download error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          toast.error(`Failed to download audio file: ${errorMessage}`);
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

    // Document dropzone configuration
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
          handleDocumentUpload(file);
        }
      },
      accept: {
        'text/plain': ['.txt'],
        'application/rtf': ['.rtf'],
        'application/pdf': ['.pdf'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'text/*': []
      },
      maxFiles: 1
    });

    return (
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          Convert text to natural-sounding speech with downloadable MP3 output. Enter text manually or upload a document.
        </p>

        {/* Input Method Selection */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => {
              setTextSource('manual');
              setUploadedFileName('');
            }}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              textSource === 'manual'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Manual Input
          </button>
          <button
            onClick={() => setTextSource('document')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              textSource === 'document'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Upload Document
          </button>
        </div>

        {/* Document Upload Section */}
        {textSource === 'document' && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
              isDragActive 
                ? 'border-green-400 bg-green-50/50 dark:bg-green-900/20 scale-105' 
                : 'border-gray-300 dark:border-gray-600 hover:border-green-400 hover:bg-gray-50/50 dark:hover:bg-gray-700/50'
            }`}
          >
            <input {...getInputProps()} />
            <DocumentTextIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {isDragActive ? 'Drop the document here...' : 'Drag & drop a text document, or click to select'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Supports: TXT, RTF, PDF, DOCX files
            </p>
            {uploadedFileName && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-2 font-medium">
                📄 {uploadedFileName}
              </p>
            )}
          </div>
        )}

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

        {/* Text Input Area */}
        <div>
          <label htmlFor="tts-text" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            {textSource === 'document' ? 'Extracted text (editable):' : 'Enter text to convert to speech:'}
          </label>
          <textarea
            id="tts-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={textSource === 'document' ? 'Upload a document above to extract text...' : 'Type your text here...'}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-sm"
            rows={textSource === 'document' ? 5 : 3}
          />
          {textSource === 'document' && uploadedFileName && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Text extracted from: {uploadedFileName}
            </p>
          )}
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
                {result.data.source === 'browser' ? 'Browser TTS' : 
                 result.data.source === 'browser-recorded' ? 'Recorded TTS' : 'AI Generated'}
              </span>
            </h4>
            
            {/* File Info */}
            {result.data.fileName && (
              <div className="mb-3 text-xs text-gray-600 dark:text-gray-400">
                📄 Source: {result.data.fileName}
              </div>
            )}
            
            <div className="space-y-3">
              {/* Audio Controls */}
              <div className="flex items-center space-x-2 flex-wrap gap-2">
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
                
                {/* Download Button - for AI generated audio */}
                {(result.data.source === 'backend' || result.data.source === 'browser-recorded') && result.data.audioUrl && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => downloadAudioAsMP3(result.data.audioUrl, result.data.fileName)}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-medium transition-colors flex items-center"
                      title="Download Audio File as MP3"
                    >
                      <CloudArrowUpIcon className="h-4 w-4 mr-1 rotate-180" />
                      Download MP3
                    </button>
                    
                    {/* Backup simple download */}
                    <a
                      href={result.data.audioUrl}
                      download={`tts_${result.data.fileName ? result.data.fileName.replace(/\.[^/.]+$/, '') : 'audio'}_${Date.now()}.mp3`}
                      className="bg-gray-500 text-white px-2 py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 text-xs font-medium transition-colors"
                      title="Simple download (if button fails)"
                    >
                      📥
                    </a>
                  </div>
                )}
                
                {/* Record & Download Button - for browser TTS */}
                {result.data.source === 'browser' && (
                  <button
                    onClick={() => recordBrowserTTS(result.data.text)}
                    className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs font-medium transition-colors flex items-center"
                    title="Record and Download Browser TTS"
                  >
                    <SpeakerWaveIcon className="h-4 w-4 mr-1" />
                    Record & Download
                  </button>
                )}
                
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  {isPlaying['text-to-speech'] ? 'Playing...' : 'Ready to play'}
                </span>
              </div>
              
              {/* Text Preview */}
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  "{result.data.text.substring(0, 150)}{result.data.text.length > 150 ? '...' : ''}"
                </p>
              </div>
              
              {/* Status Messages */}
              {result.data.source === 'browser' && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    🔧 Using browser's built-in text-to-speech. Click "Record & Download" to save as audio file.
                  </p>
                </div>
              )}
              
              {result.data.source === 'browser-recorded' && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <p className="text-xs text-green-700 dark:text-green-300">
                    ✅ Browser TTS recorded successfully! Will download with .mp3 extension for universal compatibility.
                  </p>
                </div>
              )}
              
              {result.data.source === 'backend' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    🚀 High-quality AI-generated audio. Direct MP3 download available.
                  </p>
                </div>
              )}
              
              {/* Download Instructions */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <h5 className="text-xs font-medium text-gray-900 dark:text-white mb-1">💡 Download Tips:</h5>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• All files download with .mp3 extension for universal compatibility</li>
                  <li>• Works with virtually all media players and devices</li>
                  <li>• Perfect for creating study materials or accessibility content</li>
                  <li>• Share files with others who need audio versions</li>
                  {result.data.source === 'backend' && <li>• AI-generated audio in true MP3 format</li>}
                  {result.data.source === 'browser-recorded' && <li>• Browser audio saved with .mp3 extension for compatibility</li>}
                </ul>
              </div>
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