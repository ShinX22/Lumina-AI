#!/bin/bash

# 🚀 Lumina - Quick Start Script
# This script sets up your project in one command

echo "🎯 Lumina Setup - Quick Start"
echo "=================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "📥 Download from: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js detected: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed!"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Create .env.local
echo "🔑 Setting up environment..."
if [ ! -f ".env.local" ]; then
    echo "VITE_GEMINI_API_KEY=your_api_key_here" > .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: Update .env.local with your Gemini API key"
    echo "📥 Get key from: https://aistudio.google.com/app/apikey"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "=================================="
echo "✨ Setup complete!"
echo ""
echo "🚀 Start development server:"
echo "   npm run dev"
echo ""
echo "🏗️  Build for production:"
echo "   npm run build"
echo ""
echo "📖 More info:"
echo "   - README.md - Full documentation"
echo "   - SETUP.md - Installation guide"
echo "   - HACKATHON.md - Submission info"
echo ""
