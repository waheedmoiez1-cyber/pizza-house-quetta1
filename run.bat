@echo off
title Pizza House Quetta - Production Server Launcher
color 0A

echo ===================================================
echo   PIZZA HOUSE QUETTA - 1-CLICK PRODUCTION LAUNCHER
echo ===================================================
echo.

:: Step 1: Check Node.js installation
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

:: Step 2: Check node_modules
if not exist "node_modules" (
    echo [1/3] Installing dependencies...
    call npm install
    echo.
) else (
    echo [1/3] Dependencies verified.
)

:: Step 3: Check build
if not exist ".next" (
    echo [2/3] Building production bundle...
    call npm run build
    echo.
) else (
    echo [2/3] Production build verified.
)

:: Step 4: Open Browser after short delay & Start Server
echo [3/3] Launching Pizza House Quetta on http://localhost:3000 ...
echo.
echo ===================================================
echo   Storefront:  http://localhost:3000
echo   Admin Panel: http://localhost:3000/admin/login
echo   (Press Ctrl+C in this window to stop the server)
echo ===================================================
echo.

start "" powershell -Command "Start-Sleep -Seconds 3; Start-Process 'http://localhost:3000'"
call npx next start -p 3000

pause
