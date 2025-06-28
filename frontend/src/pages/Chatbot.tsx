import React, { useState, useEffect, useRef } from 'react';
import { 
  PaperAirplaneIcon, 
  ChatBubbleLeftIcon,
  UserIcon,
  ComputerDesktopIcon,
  ClockIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { chatAPI, handleAPIError } from '../utils/apiClient';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load quick suggestions on mount
  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      const data = await chatAPI.getQuickSuggestions();
      setSuggestions(data.suggestions);
    } catch (err) {
      console.error('Failed to load suggestions:', err);
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString() + '-user',
      role: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatAPI.sendMessage(message.trim(), sessionId || undefined);
      
      if (!sessionId) {
        setSessionId(response.sessionId);
      }

      const assistantMessage: ChatMessage = {
        id: response.message.id,
        role: 'assistant',
        content: response.message.content,
        timestamp: new Date(response.message.timestamp)
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Announce new message to screen readers
      setTimeout(() => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = `AI Assistant replied: ${assistantMessage.content}`;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
          document.body.removeChild(announcement);
        }, 1000);
      }, 100);

    } catch (err) {
      const errorInfo = handleAPIError(err);
      setError(errorInfo.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(currentMessage);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const clearChat = async () => {
    if (sessionId) {
      try {
        await chatAPI.clearSession(sessionId);
      } catch (err) {
        console.error('Failed to clear session:', err);
      }
    }
    setMessages([]);
    setSessionId(null);
    setError(null);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(currentMessage);
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          AI Accessibility Assistant
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Ask me anything about web accessibility, WCAG guidelines, assistive technologies, 
          or how to make your digital content more inclusive.
        </p>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {/* Chat Header */}
        <div className="bg-primary-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ChatBubbleLeftIcon className="h-6 w-6" />
            <span className="font-semibold">Accessibility Chat</span>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="flex items-center space-x-1 px-3 py-1 bg-primary-700 hover:bg-primary-800 rounded-md transition-colors"
              aria-label="Clear chat history"
            >
              <TrashIcon className="h-4 w-4" />
              <span className="text-sm">Clear</span>
            </button>
          )}
        </div>

        {/* Messages Area */}
        <div className="h-96 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite" aria-label="Chat messages">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <ComputerDesktopIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Welcome to your AI Accessibility Assistant!</p>
              <p>Ask me about WCAG guidelines, assistive technologies, or inclusive design practices.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <ComputerDesktopIcon className="h-5 w-5 text-primary-600" />
                  </div>
                )}
                
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs ${
                      message.role === 'user' ? 'text-primary-100' : 'text-gray-500'
                    }`}>
                      <ClockIcon className="inline h-3 w-3 mr-1" />
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                  </div>
                )}
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <ComputerDesktopIcon className="h-5 w-5 text-primary-600" />
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-t border-red-200 p-4">
            <p className="text-red-800 text-sm">Error: {error}</p>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-2">
              <div className="flex-1">
                <label htmlFor="message-input" className="sr-only">
                  Type your accessibility question
                </label>
                <textarea
                  id="message-input"
                  ref={inputRef}
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about accessibility guidelines, WCAG compliance, assistive technologies..."
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  disabled={isLoading}
                  maxLength={1000}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {currentMessage.length}/1000 characters • Press Enter to send, Shift+Enter for new line
                </div>
              </div>
              <button
                type="submit"
                disabled={!currentMessage.trim() || isLoading}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 self-start"
                aria-label="Send message"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Quick Suggestions */}
        {messages.length === 0 && suggestions.length > 0 && (
          <div className="border-t border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick questions to get started:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestions.slice(0, 6).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-3">
          How can I help you today?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h3 className="font-medium mb-2">WCAG Guidelines</h3>
            <ul className="space-y-1 text-blue-700">
              <li>• Compliance requirements</li>
              <li>• Best practices</li>
              <li>• Testing strategies</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Assistive Technologies</h3>
            <ul className="space-y-1 text-blue-700">
              <li>• Screen readers</li>
              <li>• Voice navigation</li>
              <li>• Keyboard accessibility</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Design & Development</h3>
            <ul className="space-y-1 text-blue-700">
              <li>• Color contrast</li>
              <li>• Semantic HTML</li>
              <li>• ARIA implementation</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">User Experience</h3>
            <ul className="space-y-1 text-blue-700">
              <li>• Inclusive design</li>
              <li>• User testing</li>
              <li>• Accessibility audits</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot; 