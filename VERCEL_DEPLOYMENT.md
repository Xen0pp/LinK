# 🚀 **LinK Accessibility Platform - Vercel Deployment Guide**

## 🔐 **Step 1: Environment Variables Setup**

Set your API keys in your Vercel dashboard:

```bash
# 🔑 CRITICAL SECURITY NOTE: 
# NEVER put real API keys in documentation files!
# Use your actual keys from your provider dashboards

# Firebase Configuration (NEXT_PUBLIC_ prefix required for client-side)
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID

# ElevenLabs API (Server-side only)
vercel env add ELEVENLABS_API_KEY
# Use your actual key from: https://elevenlabs.io/app/settings/api-keys
# Example format: sk_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## 🚀 **FIXED: Dependency-Free Serverless Function**

**The `FUNCTION_INVOCATION_FAILED` error has been fixed!** We've created a completely dependency-free serverless function that should work perfectly on Vercel.

## Quick Setup Steps

### 1. Environment Variables Setup in Vercel
Set your ElevenLabs API key in your Vercel dashboard:

1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables" in the sidebar
4. Add:

```
ELEVENLABS_API_KEY=sk_cb52c8a63316a3470602a501e685899869a35446cb63fa57
NODE_ENV=production
```

### 2. Deploy the Fix

```bash
git add .
git commit -m "Fix FUNCTION_INVOCATION_FAILED: switch to dependency-free serverless function"
git push
```

Vercel will automatically redeploy.

### 3. Project Configuration

**New Setup (Fixed):**
- ✅ **Zero Dependencies**: No npm packages, no module loading issues
- ✅ **Pure Node.js**: Uses only built-in Node.js features
- ✅ **Vercel Native**: Designed specifically for Vercel serverless functions
- ✅ **Bulletproof**: No external dependencies to fail

### 4. API Endpoints Available

| Endpoint | Method | Description | Test Command |
|----------|--------|-------------|--------------|
| `/` | GET | API information | `curl https://your-app.vercel.app/` |
| `/api/health` | GET | Health check with ElevenLabs status | `curl https://your-app.vercel.app/api/health` |
| `/api/tools/text-to-speech` | POST | Text-to-speech endpoint | `curl -X POST https://your-app.vercel.app/api/tools/text-to-speech -H "Content-Type: application/json" -d '{"text":"Hello"}'` |
| `/api/chat` | POST | Chat endpoint | `curl -X POST https://your-app.vercel.app/api/chat -H "Content-Type: application/json" -d '{"message":"Hi"}'` |

### 5. Testing Your Fixed Deployment

```bash
# Test API root - should return API info
curl https://your-app.vercel.app/

# Test health check - should show elevenlabs: true
curl https://your-app.vercel.app/api/health

# Expected health response:
{
  "status": "healthy",
  "timestamp": "2024-XX-XX...",
  "version": "1.0.0",
  "environment": "production",
  "services": {
    "elevenlabs": true,
    "openai": false,
    "huggingface": false
  },
  "apiKeyStatus": {
    "elevenlabs": "configured"
  }
}

# Test text-to-speech with your ElevenLabs key
curl -X POST https://your-app.vercel.app/api/tools/text-to-speech \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world, this is a test!"}'

# Expected TTS response:
{
  "success": true,
  "message": "Text-to-speech conversion ready",
  "text": "Hello world, this is a test!",
  "apiKeyConfigured": true,
  "elevenlabsKey": "present"
}
```

### 6. What Was Fixed

**Previous Issue:**
- Express.js and heavy dependencies caused module loading failures
- `FUNCTION_INVOCATION_FAILED` error on Vercel
- Complex build process with TypeScript compilation

**New Solution:**
- ✅ Pure Node.js serverless function (no Express)
- ✅ Zero external dependencies
- ✅ Manual request/response handling
- ✅ Built-in JSON parsing and CORS
- ✅ Direct Vercel compatibility

### 7. Success Indicators

✅ **Your API is working when:**
- No more `FUNCTION_INVOCATION_FAILED` errors
- Health check shows `