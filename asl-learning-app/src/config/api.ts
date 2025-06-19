import axios from 'axios';

// API Base URL - adjust based on your backend deployment
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// API Endpoints
export const endpoints = {
  // Authentication
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    profile: '/auth/profile',
  },
  
  // AI Services
  ai: {
    chat: '/ai/chat',
    analyze: '/ai/analyze',
    generateSpeech: '/ai/speech',
    transcribe: '/ai/transcribe',
  },
  
  // Chat
  chat: {
    messages: '/chat/messages',
    send: '/chat/send',
    history: '/chat/history',
  },
  
  // Tools
  tools: {
    list: '/tools',
    analyze: '/tools/analyze',
    process: '/tools/process',
  },
  
  // Health Check
  health: '/health',
  
  // User Management
  user: {
    profile: '/user/profile',
    preferences: '/user/preferences',
    progress: '/user/progress',
    stats: '/user/stats',
  },
};

export default api; 