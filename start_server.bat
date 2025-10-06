@echo off
cd /d "C:\Users\chema\VSCODE\champirug"
echo ========================================
echo        MUSHROOM JUMP 8-BIT SERVER
echo ========================================
echo Directory: %CD%
echo Server: http://localhost:8080
echo ========================================
echo.
"C:\Users\chema\VSCODE\ENV\telegram_bot_env\Scripts\python.exe" -m http.server 8080
pause