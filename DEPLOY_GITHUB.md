# 🚀 CÓMO SUBIR CHAMPIRUG A GITHUB PAGES

## Paso 1: Crear repositorio en GitHub
1. Ve a https://github.com
2. Click en "New repository"
3. Nombre: `champirug-game`
4. Marca "Public"
5. Click "Create repository"

## Paso 2: Subir archivos
```bash
cd C:\Users\chema\VSCODE\champirug
git init
git add .
git commit -m "Initial Champirug game release"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/champirug-game.git
git push -u origin main
```

## Paso 3: Activar GitHub Pages
1. Ve a tu repositorio → Settings
2. Scroll hasta "Pages"
3. Source: "Deploy from a branch"
4. Branch: "main"
5. Folder: "/ (root)"
6. Click "Save"

## Paso 4: Acceder al juego
- URL: `https://TU_USUARIO.github.io/champirug-game/champirug_v2.1.html`
- Tiempo de activación: 5-10 minutos

## ✅ Archivos necesarios:
- champirug_v2.1.html
- sprites/champi1.png
- sprites/bear1.png  
- sounds/Pixel Chaos.mp3