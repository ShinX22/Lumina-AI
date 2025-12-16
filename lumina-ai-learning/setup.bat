@echo off
REM 🚀 Lumina - Quick Start Script for Windows
REM This script sets up your project

echo 🎯 Lumina Setup - Quick Start
echo ==================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js is not installed!
    echo 📥 Download from: https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js detected: %NODE_VERSION%
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if errorlevel 1 (
    echo ❌ npm install failed!
    pause
    exit /b 1
)

echo ✅ Dependencies installed
echo.

REM Create .env.local
echo 🔑 Setting up environment...
if not exist ".env.local" (
    (
        echo VITE_GEMINI_API_KEY=your_api_key_here
    ) > .env.local
    echo ✅ Created .env.local
    echo.
    echo ⚠️  IMPORTANT: Update .env.local with your Gemini API key
    echo 📥 Get key from: https://aistudio.google.com/app/apikey
) else (
    echo ✅ .env.local already exists
)

echo.
echo ==================================
echo ✨ Setup complete!
echo.
echo 🚀 Start development server:
echo    npm run dev
echo.
echo 🏗️  Build for production:
echo    npm run build
echo.
echo 📖 More info:
echo    - README.md - Full documentation
echo    - SETUP.md - Installation guide
echo    - HACKATHON.md - Submission info
echo.
pause
