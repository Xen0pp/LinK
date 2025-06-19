#!/bin/bash

echo "🔍 LinK Accessibility Platform - Connectivity Test"
echo "================================================="
echo ""

# Test backend health
echo "📡 Testing Backend API (Port 8000)..."
backend_response=$(curl -s http://localhost:8000/api/health 2>/dev/null)
if [ $? -eq 0 ] && echo "$backend_response" | grep -q "OK"; then
    echo "✅ Backend API is running successfully on port 8000"
    echo "   Status: $(echo "$backend_response" | jq -r '.status' 2>/dev/null || echo 'OK')"
else
    echo "❌ Backend API is not responding on port 8000"
fi

echo ""

# Test frontend
echo "🌐 Testing Frontend (Port 8001)..."
frontend_response=$(curl -s -I http://localhost:8001/ 2>/dev/null)
if [ $? -eq 0 ] && echo "$frontend_response" | grep -q "200 OK"; then
    echo "✅ Frontend is running successfully on port 8001"
    if echo "$frontend_response" | grep -q "X-Powered-By: Express"; then
        echo "   Server: Express (React Development Server)"
    fi
else
    echo "❌ Frontend is not responding on port 8001"
fi

echo ""

# Test CORS
echo "🔗 Testing CORS Configuration..."
cors_response=$(curl -s -H "Origin: http://localhost:8001" -H "Access-Control-Request-Method: GET" -X OPTIONS http://localhost:8000/api/health 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ CORS preflight request successful"
else
    echo "❌ CORS preflight request failed"
fi

echo ""

# Show running processes
echo "🔧 Current Server Processes:"
echo "Backend (Port 8000):"
ps aux | grep -E "node.*8000|node.*dist/app.js" | grep -v grep | head -2

echo ""
echo "Frontend (Port 8001):"
ps aux | grep -E "react-scripts.*start|node.*8001" | grep -v grep | head -2

echo ""
echo "📋 Summary:"
echo "- Backend API: http://localhost:8000/api"
echo "- Frontend App: http://localhost:8001"
echo "- Expected working flow: Frontend (8001) → Backend API (8000)"

echo ""
echo "🚀 If both services are running, refresh your browser at:"
echo "   http://localhost:8001/tools" 