@echo off
title Pizza House Quetta - Development Mode Launcher
color 0E

echo ===================================================
echo   PIZZA HOUSE QUETTA - DEVELOPMENT MODE LAUNCHER
echo ===================================================
echo.

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo Opening browser at http://localhost:3000 ...
timeout /t 2 /nobreak >nul
start http://localhost:3000

echo Starting Next.js development server...
call npm run dev

pause
