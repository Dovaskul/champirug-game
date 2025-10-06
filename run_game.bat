@echo off
cd /d "C:\Users\chema\VSCODE\champirug"
echo 🍄 Iniciando Champirug v2.0 Hardcore Edition...
echo 🌐 Servidor HTTP en http://localhost:8000
echo 🎮 Presiona Ctrl+C para detener el servidor
echo.
"C:\Users\chema\VSCODE\ENV\telegram_bot_env\Scripts\python.exe" -m http.server 8000
pause