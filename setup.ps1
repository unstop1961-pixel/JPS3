#!/usr/bin/env pwsh

# Digital Museum Guide - Automated Setup Script for PowerShell
# This script sets up the entire application on Windows

Write-Host "`n" -ForegroundColor White
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║      Digital Museum Guide - Automated Setup Script         ║" -ForegroundColor Cyan
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "║           Setting up your museum tracking app...           ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host "`n" -ForegroundColor White

# Check if Node.js is installed
Write-Host "⏳ Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "After installation, run this script again." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if npm is installed
Write-Host "⏳ Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm is not installed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Install backend dependencies
Write-Host "`n" -ForegroundColor White
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         Step 1: Installing Backend Dependencies            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path "backend")) {
    Write-Host "✗ Error: Could not find backend folder" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Set-Location backend

Write-Host "📦 Installing npm packages..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Error installing dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "✓ Backend dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

Set-Location ..

# Verify setup
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         Step 2: Verifying Installation                     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$filesOk = $true

if (Test-Path "backend\server.js") {
    Write-Host "✓ backend\server.js found" -ForegroundColor Green
} else {
    Write-Host "✗ backend\server.js NOT found" -ForegroundColor Red
    $filesOk = $false
}

if (Test-Path "backend\package.json") {
    Write-Host "✓ backend\package.json found" -ForegroundColor Green
} else {
    Write-Host "✗ backend\package.json NOT found" -ForegroundColor Red
    $filesOk = $false
}

if (Test-Path "frontend\index.html") {
    Write-Host "✓ frontend\index.html found" -ForegroundColor Green
} else {
    Write-Host "✗ frontend\index.html NOT found" -ForegroundColor Red
    $filesOk = $false
}

if (Test-Path "frontend\css\styles.css") {
    Write-Host "✓ frontend\css\styles.css found" -ForegroundColor Green
} else {
    Write-Host "✗ frontend\css\styles.css NOT found" -ForegroundColor Red
    $filesOk = $false
}

if (Test-Path "frontend\js\script.js") {
    Write-Host "✓ frontend\js\script.js found" -ForegroundColor Green
} else {
    Write-Host "✗ frontend\js\script.js NOT found" -ForegroundColor Red
    $filesOk = $false
}

if (Test-Path "data\museums.json") {
    Write-Host "✓ data\museums.json found" -ForegroundColor Green
} else {
    Write-Host "✗ data\museums.json NOT found" -ForegroundColor Red
    $filesOk = $false
}

if (Test-Path "data\quiz.json") {
    Write-Host "✓ data\quiz.json found" -ForegroundColor Green
} else {
    Write-Host "✗ data\quiz.json NOT found" -ForegroundColor Red
    $filesOk = $false
}

Write-Host ""

if ($filesOk) {
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║               Setup Complete! 🎉                           ║" -ForegroundColor Cyan
    Write-Host "║                                                            ║" -ForegroundColor White
    Write-Host "║                                                            ║" -ForegroundColor White
    Write-Host "║  Your Digital Museum Guide is ready to run!               ║" -ForegroundColor Green
    Write-Host "║                                                            ║" -ForegroundColor White
    Write-Host "║  Next Steps:                                              ║" -ForegroundColor White
    Write-Host "║  ──────────                                               ║" -ForegroundColor White
    Write-Host "║                                                            ║" -ForegroundColor White
    Write-Host "║  1. Open TWO PowerShell windows                            ║" -ForegroundColor White
    Write-Host "║                                                            ║" -ForegroundColor White
    Write-Host "║  2. In WINDOW 1 (Backend Server):                          ║" -ForegroundColor White
    Write-Host "║     cd backend                                             ║" -ForegroundColor Cyan
    Write-Host "║     npm start                                              ║" -ForegroundColor Cyan
    Write-Host "║     ← Keep this running!                                   ║" -ForegroundColor White
    Write-Host "║                                                            ║" -ForegroundColor White
    Write-Host "║  3. In WINDOW 2 (Frontend Server):                         ║" -ForegroundColor White
    Write-Host "║     cd frontend                                            ║" -ForegroundColor Cyan
    Write-Host "║     python -m http.server 8000                             ║" -ForegroundColor Cyan
    Write-Host "║     OR: npx http-server                                    ║" -ForegroundColor Cyan
    Write-Host "║                                                            ║" -ForegroundColor White
    Write-Host "║  4. Open your browser and go to:                           ║" -ForegroundColor White
    Write-Host "║     http://localhost:8000                                  ║" -ForegroundColor Cyan
    Write-Host "║                                                            ║" -ForegroundColor White
    Write-Host "║  5. Create an account and start exploring!                 ║" -ForegroundColor Green
    Write-Host "║                                                            ║" -ForegroundColor White
    Write-Host "║  📚 Documentation:                                          ║" -ForegroundColor White
    Write-Host "║     - QUICKSTART.md (5-minute setup)                       ║" -ForegroundColor Yellow
    Write-Host "║     - README.md (complete guide)                           ║" -ForegroundColor Yellow
    Write-Host "║     - TECHNICAL.md (architecture)                          ║" -ForegroundColor Yellow
    Write-Host "║     - DEPLOYMENT.md (production)                           ║" -ForegroundColor Yellow
    Write-Host "║                                                            ║" -ForegroundColor White
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
} else {
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Red
    Write-Host "║               Setup Incomplete! ✗                          ║" -ForegroundColor Red
    Write-Host "║                                                            ║" -ForegroundColor White
    Write-Host "║  Some files are missing. Please check above.              ║" -ForegroundColor Yellow
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Red
}

Write-Host ""
Read-Host "Press Enter to exit"
