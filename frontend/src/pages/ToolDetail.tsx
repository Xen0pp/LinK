import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  CloudArrowUpIcon,
  PlayIcon,
  StopIcon,
  DocumentTextIcon,
  EyeIcon,
  SpeakerWaveIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { toolsAPI, aiAPI, handleAPIError } from '../utils/apiClient';

interface Tool {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: 'visual' | 'auditory' | 'motor' | 'cognitive';
  tags: string[];
  demoType: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  popularity: number;
  rating: number;
  usageCount: number;
  githubUrl?: string;
  documentationUrl?: string;
  implementationGuide: string;
  accessibilityFeatures: string[];
  wcagCompliance: string[];
  supportedLanguages: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

const ToolDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Demo states
  const [demoResult, setDemoResult] = useState<any>(null);
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    if (id) {
      fetchTool();
    }
  }, [id]);

  const fetchTool = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await toolsAPI.getTool(id!);
      setTool(data.tool);
    } catch (err) {
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setDemoResult(null);
      setDemoError(null);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    }
  };

  const runDemo = async () => {
    if (!tool) return;
    
    try {
      setDemoLoading(true);
      setDemoError(null);
      let result;

      switch (tool.demoType) {
        case 'image-caption':
          if (!selectedFile) {
            setDemoError('Please select an image file');
            return;
          }
          result = await aiAPI.generateCaption(selectedFile);
          break;
          
        case 'text-simplify':
          if (!textInput.trim()) {
            setDemoError('Please enter some text to simplify');
            return;
          }
          result = await aiAPI.simplifyText(textInput);
          break;
          
        case 'ocr':
          if (!selectedFile) {
            setDemoError('Please select an image file');
            return;
          }
          result = await aiAPI.extractText(selectedFile);
          break;
          
        case 'text-to-speech':
          if (!textInput.trim()) {
            setDemoError('Please enter some text to convert to speech');
            return;
          }
          result = await aiAPI.textToSpeech(textInput);
          break;
          
        case 'speech-to-text':
          if (!selectedFile) {
            setDemoError('Please select an audio file');
            return;
          }
          result = await aiAPI.speechToText(selectedFile);
          break;
          
        default:
          setDemoError('Demo not available for this tool');
          return;
      }
      
      setDemoResult(result);
    } catch (err) {
      const errorInfo = handleAPIError(err);
      setDemoError(errorInfo.message);
    } finally {
      setDemoLoading(false);
    }
  };

  const playAudio = () => {
    if (audioRef.current && demoResult?.audioUrl) {
      audioRef.current.play();
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i}>
          {i <= rating ? (
            <StarIconSolid className="h-5 w-5 text-yellow-400" />
          ) : (
            <StarIcon className="h-5 w-5 text-gray-300" />
          )}
        </span>
      );
    }
    return <div className="flex items-center space-x-0.5">{stars}</div>;
  };

  const renderDemo = () => {
    if (!tool) return null;

    switch (tool.demoType) {
      case 'image-caption':
      case 'ocr':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <div className="flex items-center space-x-4">
                <input
                  id="image-upload"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  aria-describedby="image-upload"
                >
                  <CloudArrowUpIcon className="h-5 w-5" />
                  <span>Choose Image</span>
                </button>
                {selectedFile && (
                  <span className="text-sm text-gray-600">{selectedFile.name}</span>
                )}
              </div>
            </div>
            
            {previewUrl && (
              <div>
                <img
                  src={previewUrl}
                  alt="Preview of uploaded file for processing"
                  className="max-w-md max-h-64 object-contain border border-gray-200 rounded-lg"
                />
              </div>
            )}
            
            <button
              onClick={runDemo}
              disabled={!selectedFile || demoLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {demoLoading ? 'Processing...' : tool.demoType === 'image-caption' ? 'Generate Caption' : 'Extract Text'}
            </button>
          </div>
        );

      case 'text-simplify':
      case 'text-to-speech':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
                Enter Text
              </label>
              <textarea
                id="text-input"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={tool.demoType === 'text-simplify' ? 
                  'Enter complex text that you want to simplify...' : 
                  'Enter text that you want to convert to speech...'
                }
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <button
              onClick={runDemo}
              disabled={!textInput.trim() || demoLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {demoLoading ? 'Processing...' : tool.demoType === 'text-simplify' ? 'Simplify Text' : 'Convert to Speech'}
            </button>
          </div>
        );

      case 'speech-to-text':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="audio-upload" className="block text-sm font-medium text-gray-700 mb-2">
                Upload Audio File
              </label>
              <div className="flex items-center space-x-4">
                <input
                  id="audio-upload"
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  aria-describedby="audio-upload"
                >
                  <CloudArrowUpIcon className="h-5 w-5" />
                  <span>Choose Audio</span>
                </button>
                {selectedFile && (
                  <span className="text-sm text-gray-600">{selectedFile.name}</span>
                )}
              </div>
            </div>
            
            <button
              onClick={runDemo}
              disabled={!selectedFile || demoLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {demoLoading ? 'Transcribing...' : 'Transcribe Audio'}
            </button>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-600">Interactive demo not available for this tool.</p>
            <p className="text-sm text-gray-500 mt-2">
              Please visit the GitHub repository or documentation for implementation details.
            </p>
          </div>
        );
    }
  };

  const renderResult = () => {
    if (!demoResult) return null;

    return (
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-3 flex items-center">
          <DocumentTextIcon className="h-5 w-5 mr-2" />
          Result
        </h4>
        
        {tool?.demoType === 'image-caption' && (
          <div>
            <p className="text-green-700 mb-2">Generated Caption:</p>
            <p className="bg-white p-3 rounded border text-gray-800">{demoResult.caption}</p>
            <p className="text-sm text-green-600 mt-2">
              Processing time: {demoResult.processingTime}ms
            </p>
          </div>
        )}
        
        {tool?.demoType === 'text-simplify' && (
          <div>
            <p className="text-green-700 mb-2">Simplified Text:</p>
            <p className="bg-white p-3 rounded border text-gray-800">{demoResult.simplified}</p>
            <div className="text-sm text-green-600 mt-2">
              <p>Original: {demoResult.stats.originalLength} characters</p>
              <p>Simplified: {demoResult.stats.simplifiedLength} characters</p>
              <p>Processing time: {demoResult.processingTime}ms</p>
            </div>
          </div>
        )}
        
        {tool?.demoType === 'ocr' && (
          <div>
            <p className="text-green-700 mb-2">Extracted Text:</p>
            <p className="bg-white p-3 rounded border text-gray-800 whitespace-pre-wrap">{demoResult.text}</p>
            <div className="text-sm text-green-600 mt-2">
              <p>Characters: {demoResult.stats.characterCount}</p>
              <p>Words: {demoResult.stats.wordCount}</p>
              <p>Processing time: {demoResult.processingTime}ms</p>
            </div>
          </div>
        )}
        
        {tool?.demoType === 'text-to-speech' && (
          <div>
            <p className="text-green-700 mb-2">Generated Speech:</p>
            <div className="flex items-center space-x-4">
              <button
                onClick={playAudio}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <PlayIcon className="h-4 w-4" />
                <span>Play Audio</span>
              </button>
              <span className="text-sm text-green-600">
                Duration: {demoResult.duration}s
              </span>
            </div>
            <audio ref={audioRef} src={demoResult.audioUrl}>
              <track kind="captions" src="" label="No captions available" />
              Your browser does not support the audio element.
            </audio>
            <p className="text-sm text-green-600 mt-2">
              Processing time: {demoResult.processingTime}ms
            </p>
          </div>
        )}
        
        {tool?.demoType === 'speech-to-text' && (
          <div>
            <p className="text-green-700 mb-2">Transcription:</p>
            <p className="bg-white p-3 rounded border text-gray-800">{demoResult.transcription}</p>
            <div className="text-sm text-green-600 mt-2">
              <p>Characters: {demoResult.stats.characterCount}</p>
              <p>Words: {demoResult.stats.wordCount}</p>
              <p>Processing time: {demoResult.processingTime}ms</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tool Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The requested tool could not be found.'}</p>
          <Link to="/tools" className="btn-primary">
            Back to Tools
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8" aria-label="Breadcrumb">
        <Link
          to="/tools"
          className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Tools
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tool Information */}
        <div>
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-3xl">{tool.category === 'visual' ? '👁️' : tool.category === 'auditory' ? '👂' : tool.category === 'motor' ? '✋' : '🧠'}</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{tool.name}</h1>
                <p className="text-lg text-gray-600">{tool.shortDescription}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                {renderStars(Math.round(tool.rating))}
                <span className="text-sm text-gray-600">({tool.rating.toFixed(1)})</span>
              </div>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-600">{tool.usageCount.toLocaleString()} uses</span>
              <span className="text-sm text-gray-500">•</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                tool.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                tool.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {tool.difficulty}
              </span>
            </div>
          </div>

          <div className="prose prose-lg max-w-none mb-6">
            <p>{tool.description}</p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Implementation Guide</h3>
              <p className="text-gray-700">{tool.implementationGuide}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Accessibility Features</h3>
              <ul className="list-disc list-inside space-y-1">
                {tool.accessibilityFeatures.map((feature, index) => (
                  <li key={index} className="text-gray-700">{feature}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">WCAG Compliance</h3>
              <div className="flex flex-wrap gap-2">
                {tool.wcagCompliance.map((compliance, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {compliance}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Supported Languages</h3>
              <div className="flex flex-wrap gap-2">
                {tool.supportedLanguages.map((language, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tool.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              {tool.githubUrl && (
                <a
                  href={tool.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  View on GitHub
                </a>
              )}
              {tool.documentationUrl && (
                <a
                  href={tool.documentationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  Documentation
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Demo */}
        <div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Interactive Demo
            </h2>

            {renderDemo()}

            {demoError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{demoError}</p>
              </div>
            )}

            {renderResult()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetail; 