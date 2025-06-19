import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  PaperAirplaneIcon,
  UserIcon,
  CpuChipIcon,
  LightBulbIcon,
  BookOpenIcon,
  QuestionMarkCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface QuickTopic {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  prompt: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hi there! Welcome to LinK. I\'m here to help you make your digital content more accessible. Whether you need guidance on accessibility standards, best practices, or specific accommodations, I\'m happy to assist. How are you doing today?',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const quickTopics: QuickTopic[] = [
    {
      id: 'wcag-basics',
      title: 'WCAG Basics',
      description: 'Learn about Web Content Accessibility Guidelines',
      icon: BookOpenIcon,
      prompt: 'Can you explain the basics of WCAG and its importance?'
    },
    {
      id: 'alt-text',
      title: 'Alt Text Best Practices',
      description: 'How to write effective alt text for images',
      icon: LightBulbIcon,
      prompt: 'What are the best practices for writing alt text for images?'
    },
    {
      id: 'keyboard-navigation',
      title: 'Keyboard Navigation',
      description: 'Making your site keyboard accessible',
      icon: QuestionMarkCircleIcon,
      prompt: 'How can I ensure my website is fully keyboard accessible?'
    },
    {
      id: 'color-contrast',
      title: 'Color Contrast',
      description: 'Understanding color contrast requirements',
      icon: LightBulbIcon,
      prompt: 'What are the color contrast requirements for accessibility?'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      console.log('Sending message to:', `${API_BASE_URL}/chat`);
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        message: content.trim(),
      });
      
      console.log('Chat response received:', response.data);

      // Remove typing indicator and add actual response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== 'typing');
        const assistantMessage: Message = {
          id: Date.now().toString(),
          type: 'assistant',
          content: response.data.response,
          timestamp: new Date(),
        };
        return [...filtered, assistantMessage];
      });
    } catch (error) {
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      
      console.error('Chat error:', error);
      
      let errorContent = 'Sorry, I seem to be having connection issues at the moment. While I get that sorted out, here\'s a quick tip: Remember that good accessibility starts with proper semantic HTML structure, descriptive alt text, and ensuring keyboard navigation works well. How about we try your question again in a moment?';
      
      if (axios.isAxiosError(error) && error.code === 'ERR_NETWORK') {
        errorContent = 'I\'m currently having trouble connecting to my backend services. Please make sure the backend server is running and try again. In the meantime, here\'s a quick accessibility tip: Always use semantic HTML elements like <header>, <nav>, <main>, and <footer> to help screen readers understand your page structure!';
        toast.error('Backend server is not available. Please try again later.');
      } else {
        toast.error('Failed to get response from AI assistant');
      }
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: errorContent,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const handleQuickTopic = (topic: QuickTopic) => {
    sendMessage(topic.prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            LinK Assistant
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your digital accessibility companion, ready to help make the web more inclusive for everyone.
          </p>
        </motion.div>

        {/* Quick Topics */}
        {messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Help Topics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickTopics.map((topic) => {
                const Icon = topic.icon;
                return (
                  <button
                    key={topic.id}
                    onClick={() => handleQuickTopic(topic)}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 text-left hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {topic.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {topic.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Chat Container */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 ${message.type === 'user' ? 'ml-3' : 'mr-3'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                      }`}>
                        {message.type === 'user' ? (
                          <UserIcon className="h-5 w-5" />
                        ) : (
                          <CpuChipIcon className="h-5 w-5" />
                        )}
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className={`px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}>
                      {message.isTyping ? (
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <div className={`flex items-center mt-1 text-xs ${
                            message.type === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            <ClockIcon className="h-3 w-3 mr-1" />
                            {formatTimestamp(message.timestamp)}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="message-input" className="sr-only">
                  Type your accessibility question
                </label>
                <textarea
                  ref={inputRef}
                  id="message-input"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me about accessibility, WCAG guidelines, or best practices..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                  rows={2}
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </form>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This AI assistant provides general accessibility guidance.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Chat; 