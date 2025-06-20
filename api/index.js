// LinK Accessibility Platform - Vercel Serverless Function
// Serves the complete React app with all functionality + API endpoints
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    const { url, method } = req;
    
    // API Routes - handle before static files
    
    // Health check endpoint
    if (url === '/api/health' && method === 'GET') {
      return res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        services: {
          elevenlabs: !!process.env.ELEVENLABS_API_KEY,
          openai: !!process.env.OPENAI_API_KEY,
          huggingface: !!process.env.HUGGINGFACE_API_KEY
        },
        apiKeyStatus: {
          elevenlabs: process.env.ELEVENLABS_API_KEY ? 'configured' : 'missing'
        }
      });
    }
    
    // Text-to-speech endpoint
    if (url === '/api/tools/text-to-speech' && method === 'POST') {
      if (!process.env.ELEVENLABS_API_KEY) {
        return res.status(503).json({
          error: 'Text-to-speech service unavailable',
          message: 'ElevenLabs API key not configured'
        });
      }
      
      // Get request body
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          const { text } = data;
          
          if (!text) {
            return res.status(400).json({
              error: 'Missing text parameter'
            });
          }
          
          // Return success response (integrate with ElevenLabs API later)
          return res.status(200).json({
            success: true,
            message: 'Text-to-speech conversion ready',
            text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
            apiKeyConfigured: true,
            elevenlabsKey: process.env.ELEVENLABS_API_KEY ? 'present' : 'missing'
          });
        } catch (parseError) {
          return res.status(400).json({
            error: 'Invalid JSON in request body',
            message: parseError.message
          });
        }
      });
      
      return; // Don't send response here, wait for 'end' event
    }
    
    // Chat endpoint
    if (url === '/api/chat' && method === 'POST') {
      // Get request body
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          const { message } = data;
          
          if (!message) {
            return res.status(400).json({
              error: 'Missing message parameter'
            });
          }
          
          // Return echo response (integrate with AI later)
          return res.status(200).json({
            response: `I received your message: "${message}". This is a placeholder response. Full AI integration coming soon!`,
            timestamp: new Date().toISOString()
          });
        } catch (parseError) {
          return res.status(400).json({
            error: 'Invalid JSON in request body',
            message: parseError.message
          });
        }
      });
      
      return; // Don't send response here, wait for 'end' event
    }
    
    // For all non-API routes, serve the React app
    // Vercel will handle static assets separately via routing
    
    // Serve React App HTML (actual built content)
    const indexHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><link rel="icon" href="/favicon.ico"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="theme-color" content="#000000"/><meta name="description" content="LinK - Making digital content accessible for everyone"/><link rel="apple-touch-icon" href="/logo192.png"/><link rel="manifest" href="/manifest.json"/><title>LinK | Accessibility Platform</title><script defer="defer" src="/static/js/main.4b89aa1a.js"></script><link href="/static/css/main.3ba91762.css" rel="stylesheet"></head><body><noscript>You need to enable JavaScript to run this app.</noscript><div id="root"></div></body></html>`;
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'no-cache');
    return res.status(200).send(indexHtml);
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}; 