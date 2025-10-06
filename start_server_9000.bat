@echo off
cd /d "C:\Users\chema\VSCODE\champirug"
echo ========================================
echo        MUSHROOM JUMP 8-BIT SERVER
echo ========================================
echo Directory: %CD%
echo Server: http://localhost:9000
echo ========================================
echo.
"C:\Users\chema\VSCODE\ENV\telegram_bot_env\Scripts\python.exe" -m http.server 9000
pause