@echo off
REM Digital Museum Guide - Automated Setup Script for Windows
REM This script sets up the entire application

cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║      Digital Museum Guide - Automated Setup Script         ║
echo ║                                                            ║
echo ║           Setting up your museum tracking app...           ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
echo ⏳ Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ✗ Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo After installation, run this script again.
    echo.
    pause
    exit /b 1
)

node --version
echo ✓ Node.js found!
echo.

REM Check if npm is installed
echo ⏳ Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ✗ npm is not installed!
    pause
    exit /b 1
)

npm --version
echo ✓ npm found!
echo.

REM Install backend dependencies
echo ╔════════════════════════════════════════════════════════════╗
echo ║         Step 1: Installing Backend Dependencies            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

cd backend
if %errorlevel% neq 0 (
    echo ✗ Error: Could not find backend folder
    pause
    exit /b 1
)

echo 📦 Installing npm packages...
call npm install

if %errorlevel% neq 0 (
    echo ✗ Error installing dependencies
    pause
    exit /b 1
)

echo.
echo ✓ Backend dependencies installed successfully!
echo.
cd ..

REM Verify setup
echo ╔════════════════════════════════════════════════════════════╗
echo ║         Step 2: Verifying Installation                     ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

if exist backend\server.js (
    echo ✓ backend\server.js found
) else (
    echo ✗ backend\server.js NOT found
)

if exist backend\package.json (
    echo ✓ backend\package.json found
) else (
    echo ✗ backend\package.json NOT found
)

if exist frontend\index.html (
    echo ✓ frontend\index.html found
) else (
    echo ✗ frontend\index.html NOT found
)

if exist frontend\css\styles.css (
    echo ✓ frontend\css\styles.css found
) else (
    echo ✗ frontend\css\styles.css NOT found
)

if exist frontend\js\script.js (
    echo ✓ frontend\js\script.js found
) else (
    echo ✗ frontend\js\script.js NOT found
)

if exist data\museums.json (
    echo ✓ data\museums.json found
) else (
    echo ✗ data\museums.json NOT found
)

if exist data\quiz.json (
    echo ✓ data\quiz.json found
) else (
    echo ✗ data\quiz.json NOT found
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║               Setup Complete! 🎉                           ║
echo ║                                                            ║
echo ║                                                            ║
echo ║  Your Digital Museum Guide is ready to run!               ║
echo ║                                                            ║
echo ║  Next Steps:                                              ║
echo ║  ──────────                                               ║
echo ║                                                            ║
echo ║  1. Open TWO PowerShell/Command Prompt windows             ║
echo ║                                                            ║
echo ║  2. In WINDOW 1 (Backend Server):                          ║
echo ║     cd backend                                             ║
echo ║     npm start                                              ║
echo ║     ← Keep this running!                                   ║
echo ║                                                            ║
echo ║  3. In WINDOW 2 (Frontend Server):                         ║
echo ║     cd frontend                                            ║
echo ║     python -m http.server 8000                             ║
echo ║     OR: npx http-server                                    ║
echo ║                                                            ║
echo ║  4. Open your browser and go to:                           ║
echo ║     http://localhost:8000                                  ║
echo ║                                                            ║
echo ║  5. Create an account and start exploring!                 ║
echo ║                                                            ║
echo ║  📚 Documentation:                                          ║
echo ║     - QUICKSTART.md (5-minute setup)                       ║
echo ║     - README.md (complete guide)                           ║
echo ║     - TECHNICAL.md (architecture)                          ║
echo ║     - DEPLOYMENT.md (production)                           ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

pause
