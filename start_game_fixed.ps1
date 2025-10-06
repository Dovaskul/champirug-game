# Script to start Mushroom Jump 8-bit game
# Version: 2.0 Hardcore Edition

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "     MUSHROOM JUMP 8-BIT v2.0       " -ForegroundColor Yellow
Write-Host "       HARDCORE EDITION              " -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Force change to correct directory
$gameDir = "C:\Users\chema\VSCODE\champirug"
Set-Location $gameDir
$currentDir = Get-Location
Write-Host "Game directory: $currentDir" -ForegroundColor Gray

# Verify game files exist
if (Test-Path "index.html") {
    Write-Host "✓ Game files found" -ForegroundColor Green
} else {
    Write-Host "✗ Error: index.html not found" -ForegroundColor Red
    Write-Host "Make sure you're in the champirug folder" -ForegroundColor Yellow
    pause
    exit
}

Write-Host ""
Write-Host "Starting HTTP server..." -ForegroundColor Cyan
Write-Host "Game URL: http://localhost:8080" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Start HTTP server from correct directory
try {
    & "C:\Users\chema\VSCODE\ENV\telegram_bot_env\Scripts\python.exe" -m http.server 8080
} catch {
    Write-Host "Error starting server: $_" -ForegroundColor Red
    pause
}