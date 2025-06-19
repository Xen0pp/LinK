#!/bin/bash

# Accessibility Hub - Simple Local Setup
# Runs the application directly without Docker

set -e

echo "🌟 Accessibility Hub - Simple Local Setup"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
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

# Kill any existing processes
print_status "Stopping any existing servers..."
pkill -f "node.*app.js" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true
sleep 2

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or later."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi

print_status "Node.js version: $(node --version)"
print_status "npm version: $(npm --version)"

# Create environment file
if [ ! -f .env ]; then
    print_status "Creating environment file..."
    cat > .env << EOF
# Local development settings
NODE_ENV=development
PORT=8000
FRONTEND_PORT=3000
MONGODB_URI=mongodb://localhost:27017/accessibility-hub
POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/accessibility_hub
REDIS_URL=redis://localhost:6379
CORS_ORIGINS=http://localhost:3000,http://localhost:5000
EOF
    
    print_success "Environment file created"
fi

# Create directories
print_status "Creating directories..."
mkdir -p uploads logs

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd frontend
npm install
print_success "Frontend dependencies installed"

# Build frontend
print_status "Building frontend..."
npm run build
print_success "Frontend built successfully"

# Go back to root
cd ..

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
npm install
print_success "Backend dependencies installed"

# Build backend
print_status "Building backend..."
npm run build
print_success "Backend built successfully"

# Go back to root
cd ..

print_success "🎉 Build completed successfully!"
echo ""
print_success "✅ No databases required - using file-based storage!"
echo ""
print_status "The application will run with:"
echo "   - File-based data storage (no PostgreSQL/MongoDB needed)"
echo "   - In-memory caching"
echo "   - Local file uploads"
echo "   - All AI features enabled"
echo ""
print_status "Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   Health Check: http://localhost:8000/api/health"
echo ""

# Ask if user wants to start the application
read -p "Do you want to start the application now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Starting backend server..."
    cd backend
    PORT=8000 npm run dev &
    BACKEND_PID=$!
    
    print_status "Waiting for backend to start..."
    sleep 5
    
    print_status "Starting frontend server..."
    cd ../frontend
    PORT=3000 npm start &
    FRONTEND_PID=$!
    
    print_success "🎉 Accessibility Hub is now running!"
    echo ""
    echo "🌐 Open your browser and go to:"
    echo "   👉 http://localhost:3000"
    echo ""
    echo "📊 API Documentation available at:"
    echo "   👉 http://localhost:8000/api-docs"
    echo ""
    echo "Press Ctrl+C to stop both servers"
    
    # Wait for user to stop
    trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
    wait
fi 