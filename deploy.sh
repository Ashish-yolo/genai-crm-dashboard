#!/bin/bash

echo "🚀 GenAI CRM Dashboard - Production Deployment Setup"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Check for required files
if [ ! -f "server/package.json" ]; then
    echo "❌ Backend server files not found. Please ensure server/ directory exists."
    exit 1
fi

echo "✅ Project structure verified"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend dependency installation failed"
    exit 1
fi

# Install backend dependencies  
echo "📦 Installing backend dependencies..."
cd server && npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend dependency installation failed"
    exit 1
fi
cd ..

# Build frontend
echo "🔨 Building frontend for production..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

echo "✅ Build completed successfully!"
echo ""
echo "🎯 Next Steps for Deployment:"
echo "1. Push your code to GitHub"
echo "2. Go to render.com and create a new Web Service"
echo "3. Connect your GitHub repository"
echo "4. Use the configuration from render.yaml"
echo "5. Set environment variables:"
echo "   - ANTHROPIC_API_KEY=your_api_key_here"
echo "   - FRONTEND_URL=your_frontend_domain"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
echo "🎉 Your GenAI CRM Dashboard is ready for production!"