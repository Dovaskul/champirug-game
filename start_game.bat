@echo off
echo ========================================
echo        CHAMPIRUG GAME SERVER
echo ========================================
echo Starting from: %CD%
echo.

REM Check if we're in the correct directory
if not exist "index.html" (
    echo ERROR: index.html not found!
    echo Changing to correct directory...
    cd /d "C:\Users\chema\VSCODE\champirug"
)

if exist "index.html" (
    echo ✓ Found index.html - Starting server...
    echo Server URL: http://localhost:9000
    echo ========================================
    echo.
    C:\Users\chema\VSCODE\ENV\telegram_bot_env\Scripts\python.exe -m http.server 9000
) else (
    echo ERROR: Could not find game files!
    pause
)