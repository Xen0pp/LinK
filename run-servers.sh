#!/bin/bash

# Kill any existing servers
echo "Stopping existing servers..."
pkill -f "node.*app.js" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true
sleep 2

# Create environment file if not exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
NODE_ENV=development
PORT=8000
CORS_ORIGINS=http://localhost:3000
EOF
fi

echo "Starting backend server on port 8000..."
cd backend
PORT=8000 node dist/app.js &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 5

echo "Starting frontend server on port 3000..."
cd ../frontend
PORT=3000 npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Servers are starting..."
echo "🔗 Frontend: http://localhost:3000"
echo "🔗 Backend API: http://localhost:8000"
echo "🔗 Health Check: http://localhost:8000/api/health"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait 