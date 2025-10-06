// Punto de entrada principal del juego Champiñón Saltarín
document.addEventListener('DOMContentLoaded', () => {
    console.log('Starting Mushroom Jump 8-bit...');
    
    // Verificar soporte del navegador
    if (!checkBrowserSupport()) {
        showBrowserError();
        return;
    }
    
    // Mostrar información de carga
    showLoadingScreen();
    
    // Inicializar el juego después de un pequeño delay para mostrar la pantalla de carga
    setTimeout(() => {
        initializeGame();
        hideLoadingScreen();
    }, 1500);
});

function checkBrowserSupport() {
    const requiredFeatures = [
        'requestAnimationFrame',
        'localStorage',
        'addEventListener'
    ];
    
    return requiredFeatures.every(feature => window[feature]);
}

function showBrowserError() {
    document.body.innerHTML = `
        <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            font-family: Arial, sans-serif;
            background: #f0f0f0;
            text-align: center;
            padding: 20px;
        ">
            <h1 style="color: #FF6B6B;">❌ Navegador No Compatible</h1>
            <p>Tu navegador no soporta las características necesarias para este juego.</p>
            <p>Por favor, actualiza tu navegador o usa uno moderno como:</p>
            <ul style="list-style: none; padding: 0;">
                <li>🌐 Chrome (recomendado)</li>
                <li>🦊 Firefox</li>
                <li>🔷 Edge</li>
                <li>🍎 Safari</li>
            </ul>
        </div>
    `;
}

function showLoadingScreen() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loadingScreen';
    loadingDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        font-family: 'Press Start 2P', monospace;
        color: white;
        text-align: center;
    `;
    
    loadingDiv.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 20px; animation: bounce 1s infinite;">M</div>
        <div style="font-size: 24px; margin-bottom: 10px;">CHAMPIRUG</div>
        <div style="font-size: 12px; margin-bottom: 30px;">Cargando juego...</div>
        <div style="width: 200px; height: 4px; background: rgba(255,255,255,0.3); border-radius: 2px;">
            <div style="width: 0%; height: 100%; background: white; border-radius: 2px; animation: loadBar 1.5s ease-out forwards;"></div>
        </div>
    `;
    
    document.body.appendChild(loadingDiv);
    
    // Añadir animaciones CSS
    const loadingStyles = document.createElement('style');
    loadingStyles.textContent = `
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        @keyframes loadBar {
            0% { width: 0%; }
            100% { width: 100%; }
        }
    `;
    document.head.appendChild(loadingStyles);
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease-out';
        
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }
}

function initializeGame() {
    try {
        // Inicializar el juego principal
        const game = new ChampignonGame();
        
        // Hacer el juego accesible globalmente para debugging
        window.champignonGame = game;
        
        // Configurar manejadores de eventos globales
        setupGlobalHandlers(game);
        
        // Configurar controles de desarrollo (solo en desarrollo)
        if (isDevelopmentMode()) {
            setupDevControls(game);
        }
        
        console.log('✅ Juego inicializado correctamente');
        
        // Mostrar mensaje de bienvenida
        showWelcomeMessage();
        
    } catch (error) {
        console.error('❌ Error al inicializar el juego:', error);
        showInitializationError(error);
    }
}

function setupGlobalHandlers(game) {
    // Manejar visibilidad de la página
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && game.gameRunning) {
            console.log('Tab hidden - game paused automatically');
            // El juego ya maneja esto internamente
        }
    });
    
    // Prevenir zoom en dispositivos móviles
    document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    });
    
    // Prevenir doble tap zoom
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Prevenir scroll con barra espaciadora
    window.addEventListener('keydown', (e) => {
        if (e.keyCode === 32 && e.target === document.body) {
            e.preventDefault();
        }
    });
}

function setupDevControls(game) {
    // Controles de desarrollo (solo visible en consola)
    window.devControls = {
        getGameState: () => game.getGameState(),
        addScore: (points) => {
            game.score += points;
            game.updateUI();
            console.log(`🎯 Añadidos ${points} puntos`);
        },
        setSpeed: (speed) => {
            game.gameSpeed = speed;
            console.log(`⚡ Velocidad cambiada a ${speed}`);
        },
        spawnEnemy: () => {
            game.spawnEnemy();
            console.log('🐻 Enemigo generado manualmente');
        },
        spawnBitcoin: () => {
            game.spawnBitcoin();
            console.log('₿ Bitcoin generado manualmente');
        },
        godMode: () => {
            game.godMode = !game.godMode;
            console.log(`🛡️ Modo Dios: ${game.godMode ? 'ON' : 'OFF'}`);
        }
    };
    
    console.log('🔧 Controles de desarrollo disponibles en window.devControls');
}

function isDevelopmentMode() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.protocol === 'file:';
}

function showWelcomeMessage() {
    console.log(`
===== MUSHROOM JUMP 8-BIT =====
Controls:
   • ESPACIO o CLICK: Saltar
   • ESPACIO: Iniciar/Reiniciar

🎯 Objetivos:
   • Esquiva los osos para sobrevivir
   • Recoge bitcoins para puntos extra
   • Sobrevive el mayor tiempo posible

📊 Puntuación:
   • +1,000 puntos por segundo
   • +100,000 puntos por bitcoin

¡Que empiece la aventura! 🚀
=====================================
    `);
}

function showInitializationError(error) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #FF6B6B;
        color: white;
        padding: 20px;
        border-radius: 10px;
        font-family: 'Press Start 2P', monospace;
        text-align: center;
        z-index: 1000;
        max-width: 400px;
    `;
    
    errorDiv.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 10px;">❌</div>
        <div style="font-size: 16px; margin-bottom: 10px;">Error de Inicialización</div>
        <div style="font-size: 10px; margin-bottom: 15px;">${error.message}</div>
        <button onclick="location.reload()" style="
            background: white;
            color: #FF6B6B;
            border: none;
            padding: 10px 20px;
            font-family: inherit;
            font-size: 10px;
            border-radius: 5px;
            cursor: pointer;
        ">Recargar Página</button>
    `;
    
    document.body.appendChild(errorDiv);
}

// Función para estadísticas del juego
function logGameStats() {
    if (window.champignonGame) {
        const stats = window.champignonGame.getGameState();
        console.table(stats);
    }
}

// Función utilitaria para información del rendimiento
function logPerformanceInfo() {
    const performance = window.performance;
    if (performance) {
        console.log('📊 Información de rendimiento:');
        console.log(`• Tiempo de carga: ${performance.timing.loadEventEnd - performance.timing.navigationStart}ms`);
        console.log(`• Memoria usada: ${(performance.memory?.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB` || 'No disponible');
    }
}

// Exportar funciones útiles para debugging
window.champirugUtils = {
    logGameStats,
    logPerformanceInfo,
    checkBrowserSupport
};

// Mensaje de información en consola
console.log('Champirug Utils available at window.champirugUtils');