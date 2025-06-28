# 🔒 LinK Accessibility Platform - Security Guide

## 🚨 **CRITICAL SECURITY NOTICE**

This document outlines essential security practices for the LinK Accessibility Platform. **Failure to follow these guidelines could result in API key exposure and security breaches.**

## 🔑 **Environment Variables & API Keys**

### ⚠️ **NEVER Commit API Keys**

**❌ NEVER do this:**
```javascript
const API_KEY = 'hf_ABC***EXAMPLE***NEVER_REAL_KEY'; // EXPOSED!
```

**✅ ALWAYS do this:**
```javascript
const API_KEY = process.env.HUGGINGFACE_API_KEY; // Secure!
```

### 🔧 **Environment Setup**

1. **Copy the template:**
   ```bash
   cp env.example .env
   ```

2. **Add your real API keys to `.env`:**
   ```bash
   GOOGLE_GEMINI_API_KEY=your_actual_key_here
   HUGGINGFACE_API_KEY=your_actual_key_here
   ELEVENLABS_API_KEY=your_actual_key_here
   ```

3. **Verify `.env` is gitignored:**
   ```bash
   git status  # .env should NOT appear in changes
   ```

## 🛡️ **API Key Management**

### **Required API Keys**

| Service | Purpose | Get Key From |
|---------|---------|--------------|
| **Google Gemini** | Chat assistant & text processing | [Google AI Studio](https://makersuite.google.com/app/apikey) |
| **Hugging Face** | Image captioning & NLP models | [Hugging Face Tokens](https://huggingface.co/settings/tokens) |
| **ElevenLabs** | Text-to-speech conversion | [ElevenLabs API Keys](https://elevenlabs.io/app/settings/api-keys) |

### **Key Security Best Practices**

1. **Rotate keys regularly** (every 90 days)
2. **Use read-only permissions** when possible
3. **Set usage limits** on API services
4. **Monitor key usage** for suspicious activity
5. **Revoke compromised keys immediately**

## 🚫 **Git Security**

### **Protected Files (Never Commit)**

```bash
# Environment files
.env
.env.local
.env.production

# API key files
secrets.json
api-keys.json
credentials.json

# Certificate files
*.key
*.pem
*.crt

# Database credentials
database.json
connection-string.txt
```

### **Git Hook for Secret Detection**

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
# Check for potential secrets before commit

if grep -r "hf_" --include="*.ts" --include="*.js" .; then
    echo "❌ HUGGING FACE API KEY DETECTED!"
    exit 1
fi

if grep -r "sk_" --include="*.ts" --include="*.js" .; then
    echo "❌ ELEVENLABS API KEY DETECTED!"
    exit 1
fi

if grep -r "AIza" --include="*.ts" --include="*.js" .; then
    echo "❌ GOOGLE API KEY DETECTED!"
    exit 1
fi

echo "✅ No API keys detected in commit"
```

## 🔐 **Backend Security**

### **Helmet.js Configuration**

Our backend uses security headers:

```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
    },
  },
}));
```

### **Rate Limiting**

```typescript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
```

### **CORS Configuration**

```typescript
const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:8000'],
  credentials: true,
};
```

## 🌐 **Frontend Security**

### **XSS Prevention**

- All user inputs are sanitized
- Content Security Policy (CSP) headers
- No `dangerouslySetInnerHTML` usage

### **HTTPS Enforcement**

For production deployment:

```javascript
// Always use HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

## 🕵️ **Security Monitoring**

### **Audit Commands**

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Check for secrets in git history
git log --grep="key\|secret\|password" --oneline

# Scan for hardcoded secrets
grep -r "sk_\|hf_\|AIza" --include="*.ts" --include="*.js" .
```

### **Security Scanning Tools**

1. **GitHub Secret Scanning** (automatic)
2. **npm audit** for dependency vulnerabilities
3. **ESLint security rules**
4. **Snyk** for vulnerability scanning

## ⚡ **Incident Response**

### **If API Keys Are Exposed**

1. **Immediately revoke the exposed keys**
2. **Generate new API keys**
3. **Update the `.env` file**
4. **Check usage logs for unauthorized access**
5. **Rotate all related credentials**

### **Git History Cleanup**

If keys were committed:

```bash
# Remove from git history (DANGEROUS - backup first!)
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch path/to/file/with/secrets' \
  --prune-empty --tag-name-filter cat -- --all
```

## 🔍 **Regular Security Checklist**

- [ ] All API keys in environment variables
- [ ] `.env` file not committed to git
- [ ] Dependencies up to date (`npm audit`)
- [ ] HTTPS enabled in production
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] Error messages don't expose internals
- [ ] Logs don't contain sensitive data
- [ ] API key usage monitored

## 📞 **Security Contact**

If you discover a security vulnerability:

1. **DO NOT** create a public issue
2. Email security concerns privately
3. Include detailed steps to reproduce
4. Allow time for patches before disclosure

## 🏆 **Security by Design**

Our platform follows:

- **Principle of Least Privilege**
- **Defense in Depth**
- **Fail Secure**
- **Zero Trust Architecture**
- **Regular Security Audits**

---

## 🛡️ **Remember: Security is Everyone's Responsibility!**

When in doubt, assume it's sensitive and protect it. It's better to be overly cautious with security than to expose user data or API credentials.

**Stay secure! 🔒** 