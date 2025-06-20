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
PORT=8000
ELEVENLABS_API_KEY=sk_cb52c8a63316a3470602a501e685899869a35446cb63fa57
```

**Optional but Recommended:**
```
OPENAI_API_KEY=your_openai_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
AI_TEXT_TO_SPEECH_ENABLED=true
AI_IMAGE_CAPTIONING_ENABLED=true
AI_CHAT_ASSISTANT_ENABLED=true
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
- **Entry Point**: `api/index.ts`
- **Build Command**: `vercel-build` (automatically detected)
- **Dependencies**: All backend dependencies in root package.json
- **Framework**: Node.js (Express serverless function)

### 4. How It Works

1. **Build Process**: 
   - Vercel installs dependencies from root package.json
   - Runs `vercel-build` script which builds both frontend and backend
   - Creates serverless function from `api/index.ts`

2. **Routing**:
   - All requests `/*` → `api/index.ts` serverless function
   - Express app handles API routes and frontend serving internally

3. **Production Setup**:
   - Serverless function handles everything
   - React build files served statically by Express
   - No CORS issues (same origin)

### 5. Troubleshooting

**Build Fails?**
- Ensure all environment variables are set in Vercel dashboard
- Check that dependencies are properly listed in root package.json
- Verify Node.js version compatibility (≥18.0.0)

**Runtime Errors?**
- Check Vercel function logs in dashboard
- Ensure ELEVENLABS_API_KEY is properly set
- Verify all required dependencies are in package.json

**API Not Working?**
- Check that API calls use relative paths (`/api/...`)
- Verify backend routes are properly configured
- Check environment variables in Vercel settings

### 6. Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | Yes | Application environment | `production` |
| `PORT` | Yes | Server port | `8000` |
| `ELEVENLABS_API_KEY` | Yes | ElevenLabs TTS API key | `sk_...` |
| `OPENAI_API_KEY` | No | OpenAI GPT API key | `sk-...` |
| `HUGGINGFACE_API_KEY` | No | Hugging Face API key | `hf_...` |

### 7. Success Indicators

✅ **Deployment Successful When:**
- Build completes without errors
- Health check endpoint responds: `https://your-app.vercel.app/api/health`
- Frontend loads correctly: `https://your-app.vercel.app`
- No CORS errors in browser console
- Text-to-speech features work (if ELEVENLABS_API_KEY is set)

### 8. Post-Deployment Verification

```bash
# Test API health
curl https://your-app.vercel.app/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-01-XX...",
  "services": {
    "elevenlabs": true,
    "openai": false,
    "huggingface": false
  }
}
```

### 9. Updating API Keys

To update your ElevenLabs API key:
1. Go to Vercel dashboard → Settings → Environment Variables
2. Find `ELEVENLABS_API_KEY`
3. Click "Edit" and update the value
4. Click "Save"
5. Redeploy (automatic or manual)

### 10. Key Changes Made

- ✅ **Dependencies**: Moved all backend dependencies to root package.json
- ✅ **Build Script**: Added `vercel-build` for Vercel's build process
- ✅ **Simplified Config**: Removed complex install commands
- ✅ **Serverless Ready**: Optimized for Vercel's serverless platform

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Project Issues**: Check GitHub repository issues
- **API Keys**: Verify in respective service dashboards (ElevenLabs, OpenAI, etc.)
