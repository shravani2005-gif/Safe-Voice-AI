@echo off
title SafeVoice AI - Stop Servers
echo ============================================================================
echo                Stopping SafeVoice AI Backend and Frontend
echo ============================================================================
echo.
echo [*] Checking for processes listening on port 5000 (Flask Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING 2^>nul') do (
    echo [*] Terminating Backend process PID %%a...
    taskkill /F /PID %%a >nul 2>&1
)

echo [*] Checking for processes listening on port 5174 (Vite Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5174 ^| findstr LISTENING 2^>nul') do (
    echo [*] Terminating Frontend process PID %%a...
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo [OK] SafeVoice AI servers have been stopped.
echo.
pause
