# Vercel Deployment Guide for LinK Accessibility Platform

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

### 2. Deploy Commands

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

### 3. Project Configuration

The project is configured as a **Node.js serverless function** with:
- **Entry Point**: `api/index.js` (JavaScript, no TypeScript compilation)
- **Build Command**: `vercel-build` (builds React frontend only)
- **Dependencies**: Backend dependencies in root package.json
- **Framework**: Express.js serverless function

### 4. How It Works

1. **Build Process**: 
   - Vercel installs dependencies from root package.json
   - Runs `vercel-build` script which builds React frontend
   - Deploys `api/index.js` as serverless function (no compilation needed)

2. **Routing**:
   - All requests `/*` → `api/index.js` serverless function
   - Express app handles API routes and frontend serving

3. **API Endpoints Available**:
   - `GET /api/health` - Health check with service status
   - `POST /api/tools/text-to-speech` - Text-to-speech conversion
   - `POST /api/chat` - AI chat assistant (placeholder)

### 5. Troubleshooting

**Build Fails?**
- Ensure environment variables are set in Vercel dashboard
- Check that frontend build completes successfully
- Verify Node.js version compatibility (≥18.0.0)

**Runtime Errors?**
- Check Vercel function logs in dashboard
- Ensure ELEVENLABS_API_KEY is properly set
- Test endpoints individually

**API Not Working?**
- Check that API calls use correct paths (`/api/...`)
- Verify CORS settings for your domain
- Check environment variables in Vercel settings

### 6. Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | Yes | Application environment | `production` |
| `ELEVENLABS_API_KEY` | Yes | ElevenLabs TTS API key | `sk_...` |
| `OPENAI_API_KEY` | No | OpenAI GPT API key | `sk-...` |
| `HUGGINGFACE_API_KEY` | No | Hugging Face API key | `hf_...` |

### 7. Success Indicators

✅ **Deployment Successful When:**
- Build completes without TypeScript errors
- Health check responds: `https://your-app.vercel.app/api/health`
- Frontend loads (if build exists): `https://your-app.vercel.app`
- API endpoints return valid JSON responses

### 8. Post-Deployment Verification

```bash
# Test API health
curl https://your-app.vercel.app/api/health

# Expected response:
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

### 9. Key Improvements Made

- ✅ **No TypeScript Compilation**: Uses JavaScript directly, avoiding compilation errors
- ✅ **Simplified Build**: Only builds React frontend, no backend compilation
- ✅ **Self-contained API**: All backend logic in single JavaScript file
- ✅ **Better Error Handling**: Graceful fallbacks if frontend build fails
- ✅ **Vercel Optimized**: Designed specifically for Vercel serverless platform

### 10. Updating API Keys

To update your ElevenLabs API key:
1. Go to Vercel dashboard → Settings → Environment Variables
2. Find `ELEVENLABS_API_KEY`
3. Click "Edit" and update the value: `sk_cb52c8a63316a3470602a501e685899869a35446cb63fa57`
4. Click "Save"
5. Redeploy (automatic or manual)

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **API Testing**: Use browser or curl to test endpoints
- **Logs**: Check Vercel function logs for runtime errors
