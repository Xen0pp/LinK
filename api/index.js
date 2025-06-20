// Minimal Vercel Serverless Function for LinK Accessibility Platform
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
    
    // Root endpoint
    if (url === '/' && method === 'GET') {
      return res.status(200).json({
        message: 'LinK Accessibility Platform API',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString(),
        endpoints: {
          health: '/api/health',
          textToSpeech: '/api/tools/text-to-speech',
          chat: '/api/chat'
        }
      });
    }
    
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
          
          // Return success response
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
          
          // Return echo response
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
    
    // 404 for unknown routes
    return res.status(404).json({
      error: 'Route not found',
      message: `The requested route ${url} does not exist.`,
      method: method,
      availableRoutes: {
        root: 'GET /',
        health: 'GET /api/health',
        textToSpeech: 'POST /api/tools/text-to-speech',
        chat: 'POST /api/chat'
      }
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}; 