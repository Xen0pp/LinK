// Vercel Serverless Function for LinK Accessibility Platform API
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import routes (we'll import the compiled JS versions)
let app;

try {
  // Try to import the compiled backend
  const backendApp = require('../backend/dist/app.js');
  app = backendApp.default || backendApp;
} catch (error) {
  console.error('Failed to import backend app:', error);
  
  // Fallback: Create a minimal Express app
  app = express();
  
  // Basic middleware
  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5000', 'https://vercel.app'],
    credentials: true,
  }));
  
  app.use(express.json({ limit: '10mb' }));
  
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'OK',
      message: 'LinK Accessibility Platform API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: 'production'
    });
  });
  
  // Root endpoint
  app.get('/', (req, res) => {
    res.json({
      message: 'LinK Accessibility Platform API',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        health: '/api/health'
      }
    });
  });
  
  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      error: 'Route not found',
      message: `The requested route ${req.originalUrl} does not exist.`
    });
  });
}

module.exports = app; 