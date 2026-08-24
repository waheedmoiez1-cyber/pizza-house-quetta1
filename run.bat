@echo off
setlocal EnableExtensions
title Pizza House Quetta - Environment Launcher
color 0A

REM ===================================================================
REM  1. PATH & PREFLIGHT VERIFICATION
REM ===================================================================
where node >nul 2>nul
if %errorlevel% neq 0 (
    if exist "%ProgramFiles%\nodejs\node.exe" (
        set "PATH=%ProgramFiles%\nodejs;%PATH%"
    ) else if exist "%LocalAppData%\Programs\node\node.exe" (
        set "PATH=%LocalAppData%\Programs\node;%PATH%"
    ) else if exist "%ProgramFiles(x86)%\nodejs\node.exe" (
        set "PATH=%ProgramFiles(x86)%\nodejs;%PATH%"
    ) else (
        echo [ERROR] Node.js is not found in PATH!
        echo Please install Node.js v18 or higher from https://nodejs.org
        pause
        exit /b 1
    )
)

REM Ensure .env.local exists; copy from .env.example if missing
if not exist ".env.local" (
    if exist ".env.example" (
        echo [*] .env.local not found. Creating default from .env.example...
        copy ".env.example" ".env.local" >nul
        echo [OK] .env.local initialized.
    )
)

REM ===================================================================
REM  2. DIRECT CLI COMMAND ROUTER
REM ===================================================================
if /i "%1"=="dev" goto start_dev
if /i "%1"=="start" goto start_prod
if /i "%1"=="prod" goto start_prod
if /i "%1"=="build" goto run_build
if /i "%1"=="install" goto run_install
if /i "%1"=="db" goto run_db_status
if /i "%1"=="sync" goto run_sync
if /i "%1"=="clean" goto run_clean
if /i "%1"=="kill" goto kill_port
if /i "%1"=="browser" goto open_browser

REM ===================================================================
REM  3. INTERACTIVE CONTROL CENTER MENU
REM ===================================================================
:menu
cls
echo ===================================================================
echo     PIZZA HOUSE QUETTA  --  UNIFIED ENVIRONMENT LAUNCHER
echo ===================================================================
echo.
echo   Environment Status:
echo     - Node.js Version: 
node -v 2>nul
echo     - Config File:     .env.local [Loaded]
echo     - Storefront:      http://localhost:3000
echo     - Admin Portal:    http://localhost:3000/admin/login
echo.
echo ===================================================================
echo   [1] Start Production Server  (Fast, Optimized, Auto-Build)
echo   [2] Start Development Server (Live Reload, Turbopack)
echo   [3] Build Production Bundle  (npm run build)
echo   [4] Install / Repair Modules (npm install)
echo   [5] Check MySQL & DB Status  (Diagnostic Test)
echo   [6] Sync Cloud Redis / Upstash (scripts/sync_cloud_db.js)
echo   [7] Open Storefront and Admin in Browser
echo   [8] Free Port 3000 (Kill Stuck Node.js Processes)
echo   [9] Clean Cache (.next build folder)
echo   [0] Exit
echo ===================================================================
echo.
set "choice="
set /p choice="Select an option [1-9, 0 to exit]: "

if "%choice%"=="1" goto start_prod
if "%choice%"=="2" goto start_dev
if "%choice%"=="3" goto run_build
if "%choice%"=="4" goto run_install
if "%choice%"=="5" goto run_db_status
if "%choice%"=="6" goto run_sync
if "%choice%"=="7" goto open_browser
if "%choice%"=="8" goto kill_port
if "%choice%"=="9" goto run_clean
if "%choice%"=="0" exit /b 0

echo [!] Invalid selection. Please enter a valid number from 0 to 9.
timeout /t 2 >nul
goto menu

REM ===================================================================
REM  COMMAND IMPLEMENTATIONS
REM ===================================================================

:start_prod
cls
echo ===================================================================
echo   PIZZA HOUSE QUETTA - PRODUCTION SERVER
echo ===================================================================
echo.
if not exist "node_modules" (
    echo [*] Installing dependencies first...
    call npm install
    echo.
)
if not exist ".next" (
    echo [*] Building production bundle...
    call npm run build
    echo.
)
echo [*] Launching Storefront on http://localhost:3000 ...
echo [*] Admin Credentials: admin / Dtan@1234
echo.
start "" powershell -NoProfile -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:3000'"
call npx next start -p 3000
if "%~1"=="" (
    pause
    goto menu
) else (
    exit /b 0
)

:start_dev
cls
echo ===================================================================
echo   PIZZA HOUSE QUETTA - DEVELOPMENT MODE (TURBOPACK)
echo ===================================================================
echo.
if not exist "node_modules" (
    echo [*] Installing dependencies first...
    call npm install
    echo.
)
echo [*] Launching Next.js Dev Server on http://localhost:3000 ...
start "" powershell -NoProfile -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:3000'"
call npm run dev
if "%~1"=="" (
    pause
    goto menu
) else (
    exit /b 0
)

:run_build
cls
echo ===================================================================
echo   BUILDING PRODUCTION BUNDLE (NEXT.JS + TURBOPACK)
echo ===================================================================
echo.
call npm run build
echo.
echo [*] Build completed.
if "%~1"=="" (
    pause
    goto menu
) else (
    exit /b 0
)

:run_install
cls
echo ===================================================================
echo   INSTALLING / REPAIRING DEPENDENCIES
echo ===================================================================
echo.
call npm install
echo.
echo [*] Dependencies installed successfully.
if "%~1"=="" (
    pause
    goto menu
) else (
    exit /b 0
)

:run_db_status
cls
if exist "scripts\db_status.js" (
    node scripts\db_status.js
) else (
    echo [ERROR] scripts\db_status.js not found.
)
if "%~1"=="" (
    pause
    goto menu
) else (
    exit /b 0
)

:run_sync
cls
echo ===================================================================
echo   SYNCING DATABASE TO UPSTASH REDIS CLOUD
echo ===================================================================
echo.
if exist "scripts\sync_cloud_db.js" (
    node scripts\sync_cloud_db.js
) else (
    echo [ERROR] scripts\sync_cloud_db.js not found.
)
echo.
if "%~1"=="" (
    pause
    goto menu
) else (
    exit /b 0
)

:open_browser
echo [*] Opening Storefront (http://localhost:3000)...
start "" http://localhost:3000
echo [*] Opening Admin Portal (http://localhost:3000/admin/login)...
start "" http://localhost:3000/admin/login
if "%~1"=="" (
    timeout /t 2 >nul
    goto menu
) else (
    exit /b 0
)

:kill_port
cls
echo ===================================================================
echo   TERMINATING PROCESSES OCCUPYING PORT 3000
echo ===================================================================
echo.
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue; Write-Host ('[OK] Terminated PID ' + $_.OwningProcess) }"
echo.
echo [*] Port 3000 cleanup complete.
if "%~1"=="" (
    pause
    goto menu
) else (
    exit /b 0
)

:run_clean
cls
echo ===================================================================
echo   CLEANING APPLICATION CACHE
echo ===================================================================
echo.
if exist ".next" (
    echo [*] Removing .next cache directory...
    rmdir /s /q ".next"
    echo [OK] .next removed.
) else (
    echo [*] No .next folder found.
)
echo.
if "%~1"=="" (
    pause
    goto menu
) else (
    exit /b 0
)
