#!/bin/bash

# LinK Accessibility Platform - Deployment Script
# Run this script to build and deploy your application

set -e

echo "🚀 LinK Accessibility Platform - Deployment Script"
echo "=================================================="
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

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "frontend" ] && [ ! -d "backend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check deployment platform
echo "Choose your deployment platform:"
echo "1) Vercel (Recommended)"
echo "2) Netlify"
echo "3) Railway"
echo "4) Build only (manual deployment)"
echo ""
read -p "Enter your choice (1-4): " platform

case $platform in
    1)
        DEPLOY_PLATFORM="vercel"
        ;;
    2)
        DEPLOY_PLATFORM="netlify"
        ;;
    3)
        DEPLOY_PLATFORM="railway"
        ;;
    4)
        DEPLOY_PLATFORM="build-only"
        ;;
    *)
        print_error "Invalid choice. Defaulting to build-only."
        DEPLOY_PLATFORM="build-only"
        ;;
esac

print_status "Selected platform: $DEPLOY_PLATFORM"
echo ""

# Check environment variables
print_status "Checking environment variables..."
if [ ! -f ".env" ]; then
    print_warning "No .env file found. Make sure to set environment variables in your deployment platform."
fi

# Build frontend
print_status "Building frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..."
    npm install --legacy-peer-deps
fi

print_status "Building React application..."
npm run build
print_success "Frontend build completed!"

# Build backend
print_status "Building backend..."
cd ../backend
if [ ! -d "node_modules" ]; then
    print_status "Installing backend dependencies..."
    npm install
fi

print_status "Building TypeScript backend..."
npm run build
print_success "Backend build completed!"

cd ..

# Deploy based on platform
case $DEPLOY_PLATFORM in
    "vercel")
        print_status "Deploying to Vercel..."
        
        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            print_status "Installing Vercel CLI..."
            npm install -g vercel
        fi
        
        print_status "Deploying to Vercel..."
        vercel --confirm
        
        print_success "🎉 Deployed to Vercel!"
        print_status "Your app is live! Check the Vercel dashboard for the URL."
        ;;
        
    "netlify")
        print_status "Preparing for Netlify deployment..."
        
        if ! command -v netlify &> /dev/null; then
            print_status "Installing Netlify CLI..."
            npm install -g netlify-cli
        fi
        
        print_status "Deploying to Netlify..."
        netlify deploy --prod --dir=frontend/build
        
        print_success "🎉 Deployed to Netlify!"
        ;;
        
    "railway")
        print_status "Preparing for Railway deployment..."
        
        if ! command -v railway &> /dev/null; then
            print_warning "Railway CLI not found. Please install it:"
            echo "npm install -g @railway/cli"
            echo "Or deploy via Railway dashboard: https://railway.app"
        else
            railway deploy
            print_success "🎉 Deployed to Railway!"
        fi
        ;;
        
    "build-only")
        print_success "✅ Build completed successfully!"
        echo ""
        print_status "Your built files are ready:"
        echo "  📁 Frontend: frontend/build/"
        echo "  📁 Backend: backend/dist/"
        echo ""
        print_status "Manual deployment options:"
        echo "  🔗 Upload frontend/build/ to any static hosting"
        echo "  🚀 Deploy backend/dist/ to any Node.js hosting"
        echo "  📚 Check DEPLOYMENT_GUIDE.md for detailed instructions"
        ;;
esac

echo ""
print_status "Deployment checklist:"
echo "  □ Set environment variables on your platform"
echo "  □ Configure custom domain (optional)"
echo "  □ Test your deployed application"
echo "  □ Set up monitoring and analytics"
echo ""

print_success "🎉 Deployment process completed!"
print_status "Visit DEPLOYMENT_GUIDE.md for detailed platform-specific instructions."
echo "" 