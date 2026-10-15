@echo off
setlocal enabledelayedexpansion
title SafeVoice AI Launcher

:: ============================================================================
:: Determine Project Directory
:: ============================================================================
set "SCRIPT_DIR=%~dp0"

if exist "%SCRIPT_DIR%backend\app.py" (
    set "BASE_DIR=%SCRIPT_DIR%"
) else if exist "%SCRIPT_DIR%G9_NLP- Bad words removal from social media text and voice recognition_Source Code\backend\app.py" (
    set "BASE_DIR=%SCRIPT_DIR%G9_NLP- Bad words removal from social media text and voice recognition_Source Code"
) else (
    echo [ERROR] Could not find SafeVoice AI source code folder!
    echo Looked in:
    echo   - %SCRIPT_DIR%
    echo   - %SCRIPT_DIR%G9_NLP- Bad words removal from social media text and voice recognition_Source Code
    pause
    exit /b 1
)

set "BACKEND_DIR=%BASE_DIR%\backend"
set "FRONTEND_DIR=%BASE_DIR%\frontend"

echo ============================================================================
echo                 SafeVoice AI - Full Stack Launcher
echo ============================================================================
echo.
echo [*] Base Directory:     %BASE_DIR%
echo [*] Backend Directory:  %BACKEND_DIR%
echo [*] Frontend Directory: %FRONTEND_DIR%
echo.

:: ============================================================================
:: 1. Check Python and Virtual Environment
:: ============================================================================
if exist "%BASE_DIR%\venv\Scripts\python.exe" (
    set "PYTHON_EXE=%BASE_DIR%\venv\Scripts\python.exe"
    echo [OK] Found project virtual environment: !PYTHON_EXE!
) else (
    python --version >nul 2>&1
    if !errorlevel! neq 0 (
        echo [ERROR] Python is not installed or not in your PATH!
        echo Please install Python 3.10+ from python.org and check "Add python.exe to PATH".
        echo.
        pause
        exit /b 1
    )
    set "PYTHON_EXE=python"
    for /f "tokens=*" %%i in ('python --version') do set "PY_VER=%%i"
    echo [OK] Detected system !PY_VER!
)

:: Verify backend dependencies
echo [*] Verifying backend dependencies...
"!PYTHON_EXE!" -c "import flask, flask_cors, speech_recognition" >nul 2>&1
if !errorlevel! neq 0 (
    echo [*] Installing backend packages from requirements.txt...
    "!PYTHON_EXE!" -m pip install -r "%BACKEND_DIR%\requirements.txt"
    if !errorlevel! neq 0 (
        echo [ERROR] Failed to install backend dependencies.
        pause
        exit /b 1
    )
)
echo [OK] Backend dependencies verified.

:: ============================================================================
:: 2. Check Node.js and NPM
:: ============================================================================
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in your PATH!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set "NODE_VER=%%i"
echo [OK] Detected Node.js %NODE_VER%

npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed or not in your PATH!
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set "NPM_VER=%%i"
echo [OK] Detected npm %NPM_VER%

:: Verify frontend node_modules
if not exist "%FRONTEND_DIR%\node_modules" (
    echo [*] node_modules not found. Running npm install...
    cd /d "%FRONTEND_DIR%"
    call npm install
    if !errorlevel! neq 0 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
    cd /d "%BASE_DIR%"
)
echo [OK] Frontend packages verified.

:: ============================================================================
:: 3. Check for Port Conflicts and Free Ports
:: ============================================================================
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING 2^>nul') do (
    echo [*] Port 5000 is occupied by PID %%a. Freeing port...
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5174 ^| findstr LISTENING 2^>nul') do (
    echo [*] Port 5174 is occupied by PID %%a. Freeing port...
    taskkill /F /PID %%a >nul 2>&1
)

:: ============================================================================
:: 4. Start Backend Server
:: ============================================================================
echo.
echo [*] Starting Flask Backend Server (Port 5000)...
start "SafeVoice AI - Backend (Flask :5000)" cmd /k "cd /d "%BACKEND_DIR%" && title SafeVoice AI - Backend (Port 5000) && echo Starting Flask Backend on http://127.0.0.1:5000... && "!PYTHON_EXE!" app.py"

:: Wait for backend to bind port
timeout /t 2 /nobreak >nul

:: ============================================================================
:: 5. Start Frontend Development Server
:: ============================================================================
echo [*] Starting Vite Frontend Server (Port 5174)...
start "SafeVoice AI - Frontend (React Vite :5174)" cmd /k "cd /d "%FRONTEND_DIR%" && title SafeVoice AI - Frontend (Port 5174) && echo Starting React Vite Dev Server on http://localhost:5174... && npm run dev"

:: Wait for frontend dev server
timeout /t 3 /nobreak >nul

:: ============================================================================
:: 6. Launch Web Browser
:: ============================================================================
echo [*] Opening SafeVoice AI in your default web browser...
start http://localhost:5174/

:: ============================================================================
:: 7. Ready Summary
:: ============================================================================
echo.
echo ============================================================================
echo                 SafeVoice AI is now RUNNING!
echo ============================================================================
echo.
echo   [Web UI]      http://localhost:5174/
echo   [API Health]  http://127.0.0.1:5000/api/health
echo.
echo   Press any key to stop all servers, or simply close this window.
echo   (Alternatively, double-click stop.bat at any time)
echo ============================================================================
echo.
pause

:: Auto-shutdown when user presses a key in this launcher window
echo.
echo [*] Stopping servers...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING 2^>nul') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5174 ^| findstr LISTENING 2^>nul') do (
    taskkill /F /PID %%a >nul 2>&1
)
echo [OK] All SafeVoice AI servers stopped.
timeout /t 2 >nul
exit /b 0
