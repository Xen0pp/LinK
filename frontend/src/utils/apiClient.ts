import axios from 'axios';

// Create axios instance with base configuration
// Using relative paths since frontend and backend are served from same port
const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Tool API functions
export const toolsAPI = {
  // Get all tools with filtering
  getTools: async (params?: {
    search?: string;
    category?: string;
    difficulty?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/tools', { params });
    return response.data;
  },

  // Get specific tool by ID
  getTool: async (id: string) => {
    const response = await api.get(`/tools/${id}`);
    return response.data;
  },

  // Get tools by category
  getToolsByCategory: async (category: string) => {
    const response = await api.get(`/tools/category/${category}`);
    return response.data;
  },

  // Get featured tools
  getFeaturedTools: async () => {
    const response = await api.get('/tools/popular/featured');
    return response.data;
  },

  // Rate a tool
  rateTool: async (id: string, rating: number) => {
    const response = await api.post(`/tools/${id}/rate`, { rating });
    return response.data;
  },
};

// AI API functions
export const aiAPI = {
  // Generate image caption
  generateCaption: async (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post('/ai/image-caption', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Simplify text
  simplifyText: async (text: string) => {
    const response = await api.post('/ai/text-simplify', { text });
    return response.data;
  },

  // Extract text from image (OCR)
  extractText: async (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post('/ai/ocr', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Text to speech
  textToSpeech: async (text: string, voice?: string) => {
    const response = await api.post('/ai/text-to-speech', { text, voice });
    return response.data;
  },

  // Speech to text
  speechToText: async (audioFile: File) => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    
    const response = await api.post('/ai/speech-to-text', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Check color contrast
  checkContrast: async (foregroundColor: string, backgroundColor: string) => {
    const response = await api.post('/ai/contrast-check', {
      foregroundColor,
      backgroundColor,
    });
    return response.data;
  },
};

// Chat API functions
export const chatAPI = {
  // Send message to AI assistant
  sendMessage: async (message: string, sessionId?: string) => {
    const response = await api.post('/chat', { message, sessionId });
    return response.data;
  },

  // Get chat session history
  getChatSession: async (sessionId: string) => {
    const response = await api.get(`/chat/${sessionId}`);
    return response.data;
  },

  // Clear chat session
  clearSession: async (sessionId: string) => {
    const response = await api.delete(`/chat/${sessionId}`);
    return response.data;
  },

  // Get quick suggestions
  getQuickSuggestions: async () => {
    const response = await api.get('/chat/suggestions/quick');
    return response.data;
  },

  // Submit feedback on AI response
  submitFeedback: async (data: {
    sessionId: string;
    messageId: string;
    rating?: number;
    feedback?: string;
  }) => {
    const response = await api.post('/chat/feedback', data);
    return response.data;
  },
};

// User API functions
export const userAPI = {
  // Get user preferences
  getPreferences: async () => {
    const response = await api.get('/user/preferences');
    return response.data;
  },

  // Update user preferences
  updatePreferences: async (preferences: Record<string, any>) => {
    const response = await api.post('/user/preferences', preferences);
    return response.data;
  },

  // Submit general feedback
  submitFeedback: async (data: {
    type?: string;
    subject?: string;
    message: string;
    rating?: number;
  }) => {
    const response = await api.post('/user/feedback', data);
    return response.data;
  },

  // Get user statistics
  getStats: async () => {
    const response = await api.get('/user/stats');
    return response.data;
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

// File upload helper
export const uploadFile = async (
  endpoint: string,
  file: File,
  fieldName: string = 'file',
  onProgress?: (progressEvent: any) => void
) => {
  const formData = new FormData();
  formData.append(fieldName, file);

  const response = await api.post(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: onProgress,
  });

  return response.data;
};

// Error handler utility
export const handleAPIError = (error: any) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.error || error.response.data?.message || 'Server error';
    const status = error.response.status;
    return { message, status, type: 'server' };
  } else if (error.request) {
    // Request was made but no response received
    return { message: 'Network error - please check your connection', type: 'network' };
  } else {
    // Something else happened
    return { message: error.message || 'An unexpected error occurred', type: 'client' };
  }
};

export default api; 