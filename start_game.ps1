# Champirug Game Server
# Ejecuta este script para iniciar el juego

Write-Host "🍄 CHAMPIRUG v2.0 HARDCORE EDITION 🍄" -ForegroundColor Red
Write-Host "=======================================" -ForegroundColor Yellow
Write-Host ""

# Cambiar al directorio del juego
Set-Location "C:\Users\chema\VSCODE\champirug"
Write-Host "📁 Directorio: $(Get-Location)" -ForegroundColor Green

# Verificar archivos
Write-Host "🔍 Verificando archivos del juego..." -ForegroundColor Cyan
if (Test-Path "index.html") {
    Write-Host "✅ index.html encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ index.html NO encontrado" -ForegroundColor Red
    exit 1
}

if (Test-Path "css\style.css") {
    Write-Host "✅ style.css encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ style.css NO encontrado" -ForegroundColor Red
}

# Mostrar información
Write-Host ""
Write-Host "🌐 Servidor se iniciará en: http://localhost:8000" -ForegroundColor Yellow
Write-Host "🎮 Para jugar: Abre tu navegador y ve a http://localhost:8000" -ForegroundColor Yellow
Write-Host "⏹️  Para detener: Presiona Ctrl+C" -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 Iniciando servidor..." -ForegroundColor Green
Write-Host ""

# Iniciar servidor
try {
    & "C:\Users\chema\VSCODE\ENV\telegram_bot_env\Scripts\python.exe" -m http.server 8000
} catch {
    Write-Host "❌ Error al iniciar servidor: $_" -ForegroundColor Red
    Read-Host "Presiona Enter para continuar"
}