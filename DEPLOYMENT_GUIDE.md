# 🚀 LinK Accessibility Platform - Deployment Guide

## 🌟 **Quick Deployment Options**

### **Option 1: Vercel (Recommended) 🔥**

**Why Vercel?**
- ✅ Perfect for React + Node.js API
- ✅ Free tier with generous limits
- ✅ Automatic deployments from GitHub
- ✅ Global CDN and edge functions
- ✅ Built-in analytics and monitoring

**Step-by-Step:**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Build your frontend:**
   ```bash
   cd frontend
   npm run build
   cd ..
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Set Environment Variables:**
   ```bash
   vercel env add GOOGLE_GEMINI_API_KEY
   vercel env add ELEVENLABS_API_KEY
   vercel env add HUGGINGFACE_API_KEY
   vercel env add JWT_SECRET
   ```

5. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

**Your URLs:**
- Frontend: `https://your-project.vercel.app`
- API: `https://your-project.vercel.app/api/health`

---

### **Option 2: Netlify 🌐**

**Perfect for:** Static sites with serverless functions

**Steps:**
1. **Build frontend:**
   ```bash
   cd frontend && npm run build
   ```

2. **Deploy:**
   - Connect GitHub repository
   - Set build command: `cd frontend && npm run build`
   - Set publish directory: `frontend/build`

3. **Add Netlify Functions:**
   - Convert backend routes to Netlify Functions
   - Deploy API endpoints as serverless functions

---

### **Option 3: Railway 🚂**

**Perfect for:** Full-stack apps with databases

**Steps:**
1. **Connect GitHub:**
   ```bash
   # Railway will auto-detect your setup
   ```

2. **Configure Build:**
   ```bash
   # Frontend build: cd frontend && npm run build
   # Backend start: cd backend && npm start
   ```

3. **Set Environment Variables:**
   - Add all your API keys in Railway dashboard

---

### **Option 4: DigitalOcean App Platform 🌊**

**Steps:**
1. **Create App:**
   - Connect GitHub repository
   - Auto-detect Node.js app

2. **Configure Components:**
   - Frontend: Static site from `frontend/build`
   - Backend: Web service from `backend/`

3. **Environment Variables:**
   - Add API keys in DO dashboard

---

## 🔧 **Pre-Deployment Checklist**

### **1. Environment Variables Setup**
Create production environment file:
```bash
# Required for production
GOOGLE_GEMINI_API_KEY=your_key_here
ELEVENLABS_API_KEY=your_key_here
HUGGINGFACE_API_KEY=your_key_here
JWT_SECRET=your_super_secure_secret
NODE_ENV=production
```

### **2. Build Preparation**
```bash
# Frontend build
cd frontend
npm run build

# Backend build
cd ../backend
npm run build
```

### **3. Firebase Setup**
- Create Firebase project
- Enable Authentication (Email/Password + Google)
- Create Firestore database
- Update Firebase config with production URLs

### **4. Domain Configuration**
- Update CORS origins in backend
- Update Firebase authorized domains
- Set production URLs in environment variables

---

## 🛠️ **Docker Deployment (Advanced)**

**Dockerfile:**
```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

# Build frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ ./
RUN npm run build

# Build backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ ./
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/backend/dist ./
COPY --from=builder /app/frontend/build ./public
EXPOSE 8000
CMD ["node", "app.js"]
```

**Deploy with:**
```bash
docker build -t link-accessibility .
docker run -p 8000:8000 link-accessibility
```

---

## 📊 **Platform Comparison**

| Platform | Free Tier | Ease of Use | Full-Stack | Database | Custom Domain |
|----------|-----------|-------------|------------|----------|---------------|
| **Vercel** | ✅ Generous | ⭐⭐⭐⭐⭐ | ✅ | External | ✅ |
| **Netlify** | ✅ Good | ⭐⭐⭐⭐ | Functions only | External | ✅ |
| **Railway** | ✅ Limited | ⭐⭐⭐⭐ | ✅ | ✅ Built-in | ✅ |
| **Heroku** | ❌ Paid only | ⭐⭐⭐ | ✅ | ✅ Add-ons | ✅ |
| **DigitalOcean** | ❌ Paid | ⭐⭐⭐ | ✅ | ✅ | ✅ |

---

## 🎯 **Recommended Approach**

### **For Learning/Portfolio:**
1. **Vercel** (free, easy, perfect for your setup)
2. **Netlify** (alternative, great for static sites)

### **For Production:**
1. **Railway** (includes database)
2. **DigitalOcean App Platform** (scalable)
3. **AWS/GCP/Azure** (enterprise-grade)

---

## 🔍 **Post-Deployment Testing**

**Test these URLs:**
```bash
# Health check
curl https://your-domain.com/api/health

# Frontend
https://your-domain.com

# Authentication
https://your-domain.com/auth

# API documentation
https://your-domain.com/api-docs
```

---

## 🚨 **Security Checklist**

- [ ] Remove development API keys
- [ ] Use production Firebase project
- [ ] Enable HTTPS (automatic on most platforms)
- [ ] Set secure CORS origins
- [ ] Use strong JWT secrets
- [ ] Enable rate limiting
- [ ] Set up monitoring

---

Your LinK accessibility platform is ready for the world! 🌍✨ 