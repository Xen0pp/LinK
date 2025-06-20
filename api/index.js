// Vercel Serverless Function for LinK Accessibility Platform API
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:3000', 
    'http://localhost:5000', 
    'http://localhost:8000', 
    'http://localhost:8001',
    'https://vercel.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    services: {
      elevenlabs: !!process.env.ELEVENLABS_API_KEY,
      openai: !!process.env.OPENAI_API_KEY,
      huggingface: !!process.env.HUGGINGFACE_API_KEY
    }
  });
});

// Simple AI tools endpoint
app.post('/api/tools/text-to-speech', async (req, res) => {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      return res.status(503).json({
        error: 'Text-to-speech service unavailable',
        message: 'ElevenLabs API key not configured'
      });
    }

    const { text } = req.body;
    if (!text) {
      return res.status(400).json({
        error: 'Missing text parameter'
      });
    }

    // For now, return a success response
    // In production, this would call the ElevenLabs API
    res.json({
      success: true,
      message: 'Text-to-speech conversion initiated',
      text: text.substring(0, 100) + (text.length > 100 ? '...' : '')
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Chat endpoint
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({
      error: 'Missing message parameter'
    });
  }

  // Simple echo response for now
  res.json({
    response: `I received your message: "${message}". This is a placeholder response. Full AI integration coming soon!`,
    timestamp: new Date().toISOString()
  });
});

// Serve React frontend static files (if they exist)
try {
  const frontendBuildPath = path.join(__dirname, '../frontend/build');
  app.use(express.static(frontendBuildPath));
  
  // Serve React app for all non-API routes (SPA routing)
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({
        error: 'Route not found',
        message: `The requested API route ${req.originalUrl} does not exist.`,
        availableRoutes: ['/api/health', '/api/tools/text-to-speech', '/api/chat']
      });
    }
    
    // Try to serve React app
    try {
      res.sendFile(path.join(frontendBuildPath, 'index.html'));
    } catch (err) {
      // Fallback if React build doesn't exist
      res.json({
        message: 'LinK Accessibility Platform API',
        version: '1.0.0',
        status: 'running',
        note: 'Frontend build not found, serving API only',
        endpoints: {
          health: '/api/health',
          textToSpeech: '/api/tools/text-to-speech',
          chat: '/api/chat'
        }
      });
    }
  });
} catch (err) {
  console.log('Frontend build not found, serving API only');
  
  // Root endpoint fallback
  app.get('/', (req, res) => {
    res.json({
      message: 'LinK Accessibility Platform API',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        health: '/api/health',
        textToSpeech: '/api/tools/text-to-speech',
        chat: '/api/chat'
      }
    });
  });
}

module.exports = app; 