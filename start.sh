#!/bin/bash

# AI Drill Bit Wear Prediction System - Startup Script
# This script starts both the React frontend and Flask backend

echo "🚀 Starting AI Drill Bit Wear Prediction System..."
echo "================================================"

# Check if we're in the correct directory
if [ ! -d "Back" ] || [ ! -d "Front" ]; then
    echo "❌ Error: Please run this script from the webapp directory"
    echo "   Directory should contain both 'Back' and 'Front' folders"
    exit 1
fi

# Function to cleanup background processes
cleanup() {
    echo "🧹 Cleaning up background processes..."
    pkill -f "python.*app_simple.py" 2>/dev/null
    pkill -f "npm.*dev" 2>/dev/null
    pkill -f "vite" 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start Flask Backend
echo "🔧 Starting Flask Backend..."
cd Back

# Check if requirements are installed
if [ ! -f "requirements_simple.txt" ]; then
    echo "❌ Error: requirements_simple.txt not found in Back directory"
    exit 1
fi

# Install backend dependencies if needed
if ! python3 -c "import flask, numpy, pandas, PIL, sklearn, joblib" 2>/dev/null; then
    echo "📦 Installing backend dependencies..."
    pip install -r requirements_simple.txt
fi

# Start Flask server in background
echo "🌐 Starting Flask server on http://localhost:5000"
python3 app_simple.py &
BACKEND_PID=$!

# Wait a moment for Flask to start
sleep 3

# Check if Flask started successfully
if ! curl -s http://localhost:5000/health > /dev/null; then
    echo "❌ Flask backend failed to start"
    cleanup
    exit 1
fi

echo "✅ Flask backend started successfully (PID: $BACKEND_PID)"

# Start React Frontend
echo "🎨 Starting React Frontend..."
cd ../Front

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start React development server
echo "🌐 Starting React server on http://localhost:3000"
npm run dev &
FRONTEND_PID=$!

# Wait a moment for React to start
sleep 5

echo ""
echo "✅ System started successfully!"
echo "================================================"
echo "📊 Flask Backend: http://localhost:5000"
echo "🎨 React Frontend: http://localhost:3000"
echo "📖 API Documentation: http://localhost:5000/"
echo "🧪 Health Check: http://localhost:5000/health"
echo ""
echo "💡 Press Ctrl+C to stop both servers"
echo "================================================"

# Wait for user interrupt
wait

# Cleanup function will be called on Ctrl+C
