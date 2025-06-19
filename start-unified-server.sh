#!/bin/bash

echo "🚀 LinK Accessibility Platform - Unified Server Startup"
echo "======================================================="
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

# Stop any existing servers
print_status "Stopping any existing servers..."
pkill -f "node dist/app.js" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true
sleep 2

# Create required directories
print_status "Creating required directories..."
mkdir -p logs uploads

# Check if frontend build exists
if [ ! -d "frontend/build" ]; then
    print_status "Building React frontend..."
    cd frontend
    npm run build
    cd ..
    print_success "Frontend built successfully"
else
    print_success "Frontend build already exists"
fi

# Check if backend is compiled
if [ ! -f "backend/dist/app.js" ]; then
    print_status "Building backend..."
    cd backend
    npm run build
    cd ..
    print_success "Backend built successfully"
else
    print_success "Backend build already exists"
fi

# Start the unified server
print_status "Starting unified server on port 8000..."
cd backend

# Start in background
PORT=8000 nohup node dist/app.js > ../logs/server.log 2>&1 &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Check if server is running
if ps -p $SERVER_PID > /dev/null; then
    print_success "✅ Unified server started successfully!"
    echo ""
    print_success "🌐 Access your application at: http://localhost:8000"
    print_success "📊 API Documentation at: http://localhost:8000/api-docs"
    print_success "🏥 Health Check at: http://localhost:8000/api/health"
    echo ""
    print_status "Server is running in the background (PID: $SERVER_PID)"
    print_status "Logs are available at: logs/server.log"
    echo ""
    
    # Test the endpoints
    print_status "Testing endpoints..."
    if curl -s http://localhost:8000/api/health > /dev/null; then
        print_success "✅ API is responding correctly"
    else
        print_warning "⚠️ API test failed"
    fi
    
    if curl -s -I http://localhost:8000/ | grep -q "200 OK"; then
        print_success "✅ Frontend is being served correctly"
    else
        print_warning "⚠️ Frontend test failed"
    fi
    
    echo ""
    print_success "🎉 LinK Accessibility Platform is ready!"
    print_status "Both frontend and backend are now running on the same port (8000)"
    print_status "This eliminates CORS issues and backend connectivity problems"
    echo ""
    print_status "To stop the server, run: pkill -f 'node dist/app.js'"
    print_status "To view logs, run: tail -f logs/server.log"
    
else
    print_error "❌ Failed to start server"
    print_error "Check logs/server.log for error details"
    exit 1
fi 