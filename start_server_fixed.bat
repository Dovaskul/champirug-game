@echo off
REM Forzar cambio de directorio al juego
cd /d "C:\Users\chema\VSCODE\champirug"
echo ========================================
echo        MUSHROOM JUMP 8-BIT SERVER
echo ========================================
echo Current Directory: %CD%
echo Server URL: http://localhost:9000
echo ========================================
echo.
echo Starting server from correct directory...
echo.

REM Verificar que estamos en el directorio correcto
if not exist "index.html" (
    echo ERROR: index.html not found in current directory!
    echo Current directory: %CD%
    pause
    exit /b 1
)

echo ✓ Found index.html - Starting server...
"C:\Users\chema\VSCODE\ENV\telegram_bot_env\Scripts\python.exe" -m http.server 9000
pause