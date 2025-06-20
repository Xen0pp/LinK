# Vercel Deployment Guide for LinK Accessibility Platform

## 🚀 **IMPORTANT: Deployment Success Despite TypeScript Warnings**

**If you see TypeScript errors during build but the log ends with "Deployment completed" - your deployment has SUCCEEDED!** The TypeScript errors are from unused backend files and don't affect the JavaScript API.

## Quick Setup Steps

### 1. Environment Variables Setup in Vercel
Before deploying, you MUST set these environment variables in your Vercel dashboard:

1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables" in the sidebar
4. Add the following variables:

**Required Variables:**
```
NODE_ENV=production
ELEVENLABS_API_KEY=sk_cb52c8a63316a3470602a501e685899869a35446cb63fa57
```

**Optional but Recommended:**
```
OPENAI_API_KEY=your_openai_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
AI_TEXT_TO_SPEECH_ENABLED=true
LOG_LEVEL=info
```

### 2. Current Deployment Status

✅ **Your API is likely already deployed!** Check these URLs:
- `https://your-app.vercel.app/` - API info
- `https://your-app.vercel.app/api/health` - Health check

### 3. Deploy Commands

#### Option A: Auto Deploy (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Vercel will automatically deploy on every push to main branch

#### Option B: Manual Deploy
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 4. Project Configuration

The project is configured as a **Pure JavaScript API** with:
- **Entry Point**: `api/index.js` (no compilation needed)
- **Build Command**: None (JavaScript runs directly)
- **Dependencies**: Only production dependencies used
- **Framework**: Express.js serverless function

### 5. API Endpoints Available

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API information and available endpoints |
| `/api/health` | GET | Health check with service status |
| `/api/tools/text-to-speech` | POST | Text-to-speech conversion |
| `/api/chat` | POST | AI chat assistant (placeholder) |

### 6. Testing Your Deployment

```bash
# Test API root
curl https://your-app.vercel.app/

# Test health check
curl https://your-app.vercel.app/api/health

# Expected health response:
{
  "status": "healthy",
  "timestamp": "2024-01-XX...",
  "version": "1.0.0",
  "environment": "production",
  "services": {
    "elevenlabs": true,
    "openai": false,
    "huggingface": false
  }
}

# Test text-to-speech endpoint
curl -X POST https://your-app.vercel.app/api/tools/text-to-speech \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world"}'
```

### 7. Troubleshooting

**Build Shows TypeScript Errors?**
- ✅ **This is normal!** TypeScript errors from unused backend files don't affect deployment
- ✅ Look for "Deployment completed" at the end of the log
- ✅ Test your API endpoints to confirm it's working

**Runtime Errors?**
- Check Vercel function logs in dashboard
- Ensure ELEVENLABS_API_KEY is properly set
- Test endpoints individually

**API Not Working?**
- Verify CORS settings (currently allows all origins)
- Check environment variables in Vercel settings
- Test with curl or browser

### 8. Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | Yes | Application environment | `production` |
| `ELEVENLABS_API_KEY` | Yes | ElevenLabs TTS API key | `sk_...` |
| `OPENAI_API_KEY` | No | OpenAI GPT API key | `sk-...` |
| `HUGGINGFACE_API_KEY` | No | Hugging Face API key | `hf_...` |

### 9. Success Indicators

✅ **Deployment Successful When:**
- Log ends with "Deployment completed"
- API root responds: `https://your-app.vercel.app/`
- Health check responds: `https://your-app.vercel.app/api/health`
- ElevenLabs service shows `true` in health check

### 10. Updating API Keys

To update your ElevenLabs API key:
1. Go to Vercel dashboard → Settings → Environment Variables
2. Find `ELEVENLABS_API_KEY`
3. Click "Edit" and update the value: `sk_cb52c8a63316a3470602a501e685899869a35446cb63fa57`
4. Click "Save"
5. Redeploy (automatic or manual)

---

## ✨ **Key Benefits of Current Setup**

- ✅ **No TypeScript Compilation**: Pure JavaScript, no build errors
- ✅ **No Frontend Dependencies**: API-only, no build complexity
- ✅ **Self-contained**: All logic in single file
- ✅ **Vercel Optimized**: Designed for serverless platform
- ✅ **Your API Key**: Already configured and ready

---

## Need Help?

- **Test Your API**: Use the curl commands above
- **Vercel Logs**: Check function logs for runtime errors
- **API Status**: Always check `/api/health` first
