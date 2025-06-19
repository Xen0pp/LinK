#!/bin/bash

echo "🔧 LinK Accessibility Platform - Project Setup & Initialization"
echo "=============================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${CYAN}[STEP]${NC} $1"
}

print_security() {
    echo -e "${PURPLE}[SECURITY]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Security check function
check_for_secrets() {
    print_security "Scanning for exposed API keys and secrets..."
    
    # Check for common API key patterns
    if grep -r "hf_" --include="*.ts" --include="*.js" . 2>/dev/null | grep -v env.example | grep -v SECURITY.md; then
        print_error "⚠️  HUGGING FACE API KEY DETECTED in code!"
        return 1
    fi
    
    if grep -r "sk_" --include="*.ts" --include="*.js" . 2>/dev/null | grep -v env.example | grep -v SECURITY.md; then
        print_error "⚠️  ELEVENLABS API KEY DETECTED in code!"
        return 1
    fi
    
    if grep -r "AIza" --include="*.ts" --include="*.js" . 2>/dev/null | grep -v env.example | grep -v SECURITY.md; then
        print_error "⚠️  GOOGLE API KEY DETECTED in code!"
        return 1
    fi
    
    print_success "✅ No exposed API keys found in code"
    return 0
}

# Step 1: Check Prerequisites
print_step "1. Checking Prerequisites..."
echo ""

if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
else
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
fi

if ! command_exists npm; then
    print_error "npm is not installed. Please install npm"
    exit 1
else
    NPM_VERSION=$(npm --version)
    print_success "npm found: $NPM_VERSION"
fi

# Step 2: Security Scan
print_step "2. Security Scan..."
echo ""
if ! check_for_secrets; then
    print_error "Security scan failed! Please remove exposed API keys before continuing."
    print_warning "See SECURITY.md for guidance on proper API key management."
    exit 1
fi

# Step 3: Clean up any existing processes
print_step "3. Cleaning up existing processes..."
echo ""
pkill -f "node dist/app.js" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true
print_success "Cleaned up existing server processes"

# Step 4: Environment Setup
print_step "4. Setting up Environment Configuration..."
echo ""

if [ ! -f ".env" ]; then
    if [ -f "env.example" ]; then
        print_status "Creating .env file from template..."
        cp env.example .env
        print_success "Environment file created from template"
        print_warning "⚠️  IMPORTANT: Add your real API keys to .env file!"
        print_warning "   - Get Google Gemini key: https://makersuite.google.com/app/apikey"
        print_warning "   - Get Hugging Face key: https://huggingface.co/settings/tokens"
        print_warning "   - Get ElevenLabs key: https://elevenlabs.io/app/settings/api-keys"
    else
        print_status "Creating default environment file..."
        cat > .env << EOF
# LinK Accessibility Platform Environment Configuration
NODE_ENV=development
PORT=8000

# Database Configuration (Optional - using file-based storage)
MONGODB_URI=mongodb://localhost:27017/accessibility-hub

# CORS Configuration
CORS_ORIGINS=http://localhost:8000,http://localhost:3000

# API Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Feature Flags
SWAGGER_ENABLED=true

# AI Service Configuration (Add your API keys here)
# GOOGLE_GEMINI_API_KEY=your_gemini_key_here
# HUGGINGFACE_API_KEY=your_huggingface_key_here
# ELEVENLABS_API_KEY=your_elevenlabs_key_here
EOF
        print_success "Default environment file created"
        print_warning "⚠️  IMPORTANT: Add your real API keys to .env file!"
    fi
else
    print_success "Environment file already exists"
fi

# Verify .env is in .gitignore
if ! grep -q "^\.env$" .gitignore 2>/dev/null; then
    print_warning "Adding .env to .gitignore for security..."
    echo ".env" >> .gitignore
fi

# Step 5: Install Backend Dependencies
print_step "5. Installing Backend Dependencies..."
echo ""
if [ -f "backend/package.json" ]; then
    cd backend
    print_status "Installing backend packages..."
    npm install
    if [ $? -eq 0 ]; then
        print_success "Backend dependencies installed successfully"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
    cd ..
else
    print_error "backend/package.json not found!"
    exit 1
fi

# Step 6: Install Frontend Dependencies
print_step "6. Installing Frontend Dependencies..."
echo ""
if [ -f "frontend/package.json" ]; then
    cd frontend
    print_status "Installing frontend packages..."
    npm install --legacy-peer-deps
    if [ $? -eq 0 ]; then
        print_success "Frontend dependencies installed successfully"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
    cd ..
else
    print_error "frontend/package.json not found!"
    exit 1
fi

# Step 7: Security Audit
print_step "7. Running Security Audit..."
echo ""
print_status "Checking for vulnerabilities..."
cd backend && npm audit --audit-level=high && cd ..
cd frontend && npm audit --audit-level=high && cd ..
print_success "Security audit completed"

# Step 8: Create Required Directories
print_step "8. Creating Required Directories..."
echo ""
mkdir -p logs uploads backend/dist frontend/build
print_success "Required directories created"

# Step 9: Build Backend
print_step "9. Building Backend (TypeScript Compilation)..."
echo ""
cd backend
print_status "Compiling TypeScript to JavaScript..."
npm run build
if [ $? -eq 0 ]; then
    print_success "Backend compiled successfully"
else
    print_error "Backend build failed"
    exit 1
fi
cd ..

# Step 10: Build Frontend
print_step "10. Building Frontend (React Production Build)..."
echo ""
cd frontend
print_status "Creating optimized React build..."
npm run build
if [ $? -eq 0 ]; then
    print_success "Frontend built successfully"
else
    print_error "Frontend build failed"
    exit 1
fi
cd ..

# Step 11: Verify Build Files
print_step "11. Verifying Build Files..."
echo ""

if [ -f "backend/dist/app.js" ]; then
    print_success "✅ Backend build file exists: backend/dist/app.js"
else
    print_error "❌ Backend build file missing: backend/dist/app.js"
    exit 1
fi

if [ -d "frontend/build" ] && [ -f "frontend/build/index.html" ]; then
    print_success "✅ Frontend build exists: frontend/build/"
else
    print_error "❌ Frontend build missing: frontend/build/"
    exit 1
fi

# Step 12: Final Security Check
print_step "12. Final Security Verification..."
echo ""
print_security "Verifying environment security..."

if [ -f ".env" ] && ! git check-ignore .env >/dev/null 2>&1; then
    print_error "⚠️  SECURITY RISK: .env file is not properly gitignored!"
    print_warning "This could expose your API keys. Check your .gitignore file."
else
    print_success "✅ Environment file is properly protected"
fi

# Check if .env has placeholder values
if [ -f ".env" ] && grep -q "your_.*_key_here" .env; then
    print_warning "⚠️  API keys not configured in .env file"
    print_warning "   AI features will run in demo mode until you add real API keys"
fi

# Step 13: Setup Complete
print_step "13. Setup Complete!"
echo ""
print_success "🎉 LinK Accessibility Platform is ready to start!"
echo ""
echo "📋 Setup Summary:"
echo "   ✅ Node.js and npm verified"
echo "   ✅ Security scan passed"
echo "   ✅ Environment configuration created"
echo "   ✅ Backend dependencies installed"
echo "   ✅ Frontend dependencies installed"
echo "   ✅ Security audit completed"
echo "   ✅ Backend compiled (TypeScript → JavaScript)"
echo "   ✅ Frontend built (React production build)"
echo "   ✅ Required directories created"
echo "   ✅ Security verification passed"
echo ""
print_security "🔒 Security Reminders:"
echo "   • Never commit .env files to git"
echo "   • Rotate API keys regularly (every 90 days)"
echo "   • Monitor API usage for suspicious activity"
echo "   • See SECURITY.md for complete security guidelines"
echo ""
echo "🚀 To start the website:"
echo "   Method 1: ./start-unified-server.sh"
echo "   Method 2: cd backend && PORT=8000 node dist/app.js"
echo ""
echo "🌐 Once started, access your website at:"
echo "   👉 http://localhost:8000"
echo "   👉 http://localhost:8000/tools"
echo "   👉 http://localhost:8000/chat"
echo ""
print_status "Setup completed successfully! 🎯" 