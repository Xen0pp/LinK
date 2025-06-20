// Minimal Vercel Serverless Function for LinK Accessibility Platform
// Last updated: 2025-06-20 20:22 - HTML Interface Added
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
    
    // Root endpoint - serve HTML interface
    if (url === '/' && method === 'GET') {
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LinK Accessibility Platform</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            max-width: 600px;
            width: 90%;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            font-weight: 700;
        }
        .subtitle {
            font-size: 1.2rem;
            margin-bottom: 30px;
            opacity: 0.9;
        }
        .status {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
        }
        .status-item {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            font-size: 1.1rem;
        }
        .status-value {
            font-weight: bold;
        }
        .endpoints {
            margin-top: 30px;
        }
        .endpoint {
            background: rgba(255, 255, 255, 0.15);
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .method {
            background: rgba(255, 255, 255, 0.3);
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 0.9rem;
            font-weight: bold;
        }
        .test-section {
            margin-top: 30px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 20px;
        }
        .test-button {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            margin: 5px;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        .test-button:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
        .result {
            margin-top: 15px;
            padding: 15px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            text-align: left;
            font-family: monospace;
            font-size: 0.9rem;
            max-height: 200px;
            overflow-y: auto;
        }
        .hidden { display: none; }
        .success { color: #90EE90; }
        .error { color: #FFB6C1; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔗 LinK</h1>
        <div class="subtitle">Accessibility Platform API</div>
        
        <div class="status">
            <div class="status-item">
                <span>Status:</span>
                <span class="status-value success">✅ Online</span>
            </div>
            <div class="status-item">
                <span>Version:</span>
                <span class="status-value">1.0.0</span>
            </div>
            <div class="status-item">
                <span>ElevenLabs API:</span>
                <span class="status-value" id="elevenlabs-status">🔄 Checking...</span>
            </div>
        </div>
        
        <div class="endpoints">
            <h3>Available Endpoints</h3>
            <div class="endpoint">
                <span>/api/health</span>
                <span class="method">GET</span>
            </div>
            <div class="endpoint">
                <span>/api/tools/text-to-speech</span>
                <span class="method">POST</span>
            </div>
            <div class="endpoint">
                <span>/api/chat</span>
                <span class="method">POST</span>
            </div>
        </div>
        
        <div class="test-section">
            <h3>Test API</h3>
            <button class="test-button" onclick="testHealth()">Test Health Check</button>
            <button class="test-button" onclick="testTTS()">Test Text-to-Speech</button>
            <button class="test-button" onclick="testChat()">Test Chat</button>
            <div id="test-result" class="result hidden"></div>
        </div>
    </div>

    <script>
        // Check ElevenLabs status on load
        fetch('/api/health')
            .then(res => res.json())
            .then(data => {
                const status = document.getElementById('elevenlabs-status');
                if (data.services && data.services.elevenlabs) {
                    status.innerHTML = '✅ Configured';
                    status.className = 'status-value success';
                } else {
                    status.innerHTML = '❌ Not Configured';
                    status.className = 'status-value error';
                }
            })
            .catch(() => {
                document.getElementById('elevenlabs-status').innerHTML = '❓ Unknown';
            });

        function showResult(data, isError = false) {
            const result = document.getElementById('test-result');
            result.className = 'result ' + (isError ? 'error' : 'success');
            result.textContent = JSON.stringify(data, null, 2);
        }

        function testHealth() {
            fetch('/api/health')
                .then(res => res.json())
                .then(data => showResult(data))
                .catch(err => showResult({error: err.message}, true));
        }

        function testTTS() {
            fetch('/api/tools/text-to-speech', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({text: 'Hello, this is a test of the text-to-speech API!'})
            })
                .then(res => res.json())
                .then(data => showResult(data))
                .catch(err => showResult({error: err.message}, true));
        }

        function testChat() {
            fetch('/api/chat', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({message: 'Hello, how are you?'})
            })
                .then(res => res.json())
                .then(data => showResult(data))
                .catch(err => showResult({error: err.message}, true));
        }
    </script>
</body>
</html>`;
      
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);
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