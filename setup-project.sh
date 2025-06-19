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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
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

# Step 2: Clean up any existing processes
print_step "2. Cleaning up existing processes..."
echo ""
pkill -f "node dist/app.js" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true
print_success "Cleaned up existing server processes"

# Step 3: Install Backend Dependencies
print_step "3. Installing Backend Dependencies..."
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

# Step 4: Install Frontend Dependencies
print_step "4. Installing Frontend Dependencies..."
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

# Step 5: Create Required Directories
print_step "5. Creating Required Directories..."
echo ""
mkdir -p logs uploads backend/dist frontend/build
print_success "Required directories created"

# Step 6: Build Backend
print_step "6. Building Backend (TypeScript Compilation)..."
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

# Step 7: Build Frontend
print_step "7. Building Frontend (React Production Build)..."
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

# Step 8: Environment Setup
print_step "8. Setting up Environment..."
echo ""
if [ ! -f ".env" ]; then
    print_status "Creating environment file..."
    cat > .env << EOF
# LinK Accessibility Platform Environment Configuration
NODE_ENV=development
PORT=8000

# Database Configuration (Optional - using file-based storage)
MONGODB_URI=mongodb://localhost:27017/accessibility-hub
POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/accessibility_hub

# CORS Configuration
CORS_ORIGINS=http://localhost:8000,http://localhost:3000

# API Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Feature Flags
SWAGGER_ENABLED=true

# AI Service Configuration (Add your API keys here)
# GEMINI_API_KEY=your_gemini_key_here
# ELEVENLABS_API_KEY=your_elevenlabs_key_here
# HUGGINGFACE_API_TOKEN=your_huggingface_token_here
EOF
    print_success "Environment file created"
else
    print_success "Environment file already exists"
fi

# Step 9: Verify Build Files
print_step "9. Verifying Build Files..."
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

# Step 10: Final Setup Summary
print_step "10. Setup Complete!"
echo ""
print_success "🎉 LinK Accessibility Platform is ready to start!"
echo ""
echo "📋 Setup Summary:"
echo "   ✅ Node.js and npm verified"
echo "   ✅ Backend dependencies installed"
echo "   ✅ Frontend dependencies installed"
echo "   ✅ Backend compiled (TypeScript → JavaScript)"
echo "   ✅ Frontend built (React production build)"
echo "   ✅ Environment configured"
echo "   ✅ Required directories created"
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