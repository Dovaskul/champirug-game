class ChampignonGame {
    constructor() {
        this.player = document.getElementById('player');
        this.gameContainer = document.getElementById('gameContainer');
        this.scoreElement = document.getElementById('score');
        this.timeElement = document.getElementById('time');
        this.highScoreElement = document.getElementById('highScore');
        this.instructions = document.getElementById('instructions');
        this.gameOver = document.getElementById('gameOver');
        this.finalScore = document.getElementById('finalScore');
        
        // Estados del juego
        this.score = 0;
        this.time = 0;
        this.gameRunning = false;
        this.isJumping = false;
        this.enemies = [];
        this.bitcoins = [];
        this.gameSpeed = 1;
        this.difficulty = 1;
        
        // High score persistente
        this.highScore = localStorage.getItem('champignonHighScore') || 0;
        this.highScoreElement.textContent = this.formatScore(this.highScore);
        
        // Configuración de audio
        this.audioContext = null;
        this.sounds = {
            jump: { freq: 659, duration: 0.1 },
            collect: { freq: 784, duration: 0.3 },
            gameOver: { freq: 196, duration: 0.5 },
            start: { freq: 523, duration: 0.2 }
        };
        
        this.init();
    }
    
    init() {
        this.initAudio();
        this.bindEvents();
        this.gameLoop();
        console.log('🍄 Champiñón Game inicializado');
    }
    
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Audio no disponible:', error);
        }
    }
    
    playSound(soundName) {
        if (!this.audioContext || !this.sounds[soundName]) return;
        
        const sound = this.sounds[soundName];
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = sound.freq;
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + sound.duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + sound.duration);
    }
    
    bindEvents() {
        // Teclado
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.handleAction();
            }
        });
        
        // Click/Touch
        this.gameContainer.addEventListener('click', () => {
            this.handleAction();
        });
        
        // Touch events para móviles
        this.gameContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleAction();
        });
        
        // Visibilidad de la página
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.gameRunning) {
                this.pauseGame();
            }
        });
    }
    
    handleAction() {
        if (!this.gameRunning && this.gameOver.style.display === 'none') {
            this.startGame();
        } else if (this.gameRunning) {
            this.jump();
        } else {
            this.resetGame();
        }
    }
    
    startGame() {
        this.gameRunning = true;
        this.instructions.style.display = 'none';
        this.gameOver.style.display = 'none';
        
        // Reanudar audio context
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        this.playSound('start');
        
        // Iniciar timers
        this.scoreTimer = setInterval(() => {
            this.time++;
            this.score += 1000;
            this.updateUI();
            
            // Aumentar dificultad cada 30 segundos
            if (this.time % 30 === 0) {
                this.difficulty += 0.2;
                this.gameSpeed += 0.1;
                console.log(`🔥 Dificultad aumentada: ${this.difficulty.toFixed(1)}`);
            }
        }, 1000);
        
        this.enemyTimer = setInterval(() => {
            this.spawnEnemy();
        }, this.getRandomInterval(5000, 10000) / this.difficulty);
        
        this.bitcoinTimer = setInterval(() => {
            this.spawnBitcoin();
        }, this.getRandomInterval(10000, 40000));
        
        console.log('🎮 Juego iniciado');
    }
    
    pauseGame() {
        if (!this.gameRunning) return;
        
        clearInterval(this.scoreTimer);
        clearInterval(this.enemyTimer);
        clearInterval(this.bitcoinTimer);
        
        // Mostrar mensaje de pausa
        const pauseDiv = document.createElement('div');
        pauseDiv.id = 'pauseMessage';
        pauseDiv.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 20px;
            border: 3px solid white;
            border-radius: 10px;
            font-size: 16px;
            text-align: center;
            z-index: 25;
        `;
        pauseDiv.innerHTML = '⏸️ PAUSADO<br><br>Haz click aquí para continuar';
        
        this.gameContainer.appendChild(pauseDiv);
        
        pauseDiv.addEventListener('click', () => {
            this.gameContainer.removeChild(pauseDiv);
            this.resumeGame();
        });
    }
    
    resumeGame() {
        this.startGame(); // Reinicia los timers
    }
    
    jump() {
        if (this.isJumping || !this.gameRunning) return;
        
        this.isJumping = true;
        this.player.classList.add('jumping');
        this.player.style.bottom = '180px';
        
        this.playSound('jump');
        
        setTimeout(() => {
            this.player.style.bottom = '80px';
            setTimeout(() => {
                this.isJumping = false;
                this.player.classList.remove('jumping');
            }, 200);
        }, 300);
    }
    
    spawnEnemy() {
        if (!this.gameRunning) return;
        
        const enemy = document.createElement('div');
        enemy.className = 'enemy';
        enemy.style.animationDuration = `${3 / this.gameSpeed}s`;
        
        // Añadir variación de enemigos
        const enemyTypes = ['🐻', '🐺', '🦝'];
        const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        enemy.style.setProperty('--enemy-emoji', `"${randomType}"`);
        
        this.gameContainer.appendChild(enemy);
        this.enemies.push(enemy);
        
        // Limpiar enemigo después de que salga de pantalla
        setTimeout(() => {
            if (enemy.parentNode) {
                enemy.parentNode.removeChild(enemy);
                this.enemies = this.enemies.filter(e => e !== enemy);
            }
        }, (4000 / this.gameSpeed));
    }
    
    spawnBitcoin() {
        if (!this.gameRunning) return;
        
        const bitcoin = document.createElement('div');
        bitcoin.className = 'bitcoin';
        bitcoin.style.animationDuration = `${4 / this.gameSpeed}s, 1s`;
        
        this.gameContainer.appendChild(bitcoin);
        this.bitcoins.push(bitcoin);
        
        // Limpiar bitcoin después de que salga de pantalla
        setTimeout(() => {
            if (bitcoin.parentNode) {
                bitcoin.parentNode.removeChild(bitcoin);
                this.bitcoins = this.bitcoins.filter(b => b !== bitcoin);
            }
        }, (5000 / this.gameSpeed));
    }
    
    checkCollisions() {
        const playerRect = this.player.getBoundingClientRect();
        
        // Colisión con enemigos
        this.enemies.forEach(enemy => {
            const enemyRect = enemy.getBoundingClientRect();
            if (this.isColliding(playerRect, enemyRect)) {
                this.endGame();
            }
        });
        
        // Colisión con bitcoins
        this.bitcoins.forEach((bitcoin, index) => {
            const bitcoinRect = bitcoin.getBoundingClientRect();
            if (this.isColliding(playerRect, bitcoinRect)) {
                this.collectBitcoin(bitcoin, index);
            }
        });
    }
    
    collectBitcoin(bitcoin, index) {
        this.score += 100000;
        this.updateUI();
        
        this.playSound('collect');
        
        // Efecto visual de colección
        this.showCollectEffect(bitcoin);
        
        // Remover bitcoin
        bitcoin.parentNode.removeChild(bitcoin);
        this.bitcoins.splice(index, 1);
        
        console.log('₿ Bitcoin colectado! +100,000 puntos');
    }
    
    showCollectEffect(element) {
        const effect = document.createElement('div');
        effect.className = 'collect-effect';
        effect.textContent = '+100K';
        
        const rect = element.getBoundingClientRect();
        const containerRect = this.gameContainer.getBoundingClientRect();
        
        effect.style.left = (rect.left - containerRect.left) + 'px';
        effect.style.top = (rect.top - containerRect.top) + 'px';
        
        this.gameContainer.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 1000);
    }
    
    isColliding(rect1, rect2) {
        // Colisión con margen de tolerancia
        const tolerance = 5;
        return !(rect1.right < rect2.left + tolerance || 
                rect1.left > rect2.right - tolerance || 
                rect1.bottom < rect2.top + tolerance || 
                rect1.top > rect2.bottom - tolerance);
    }
    
    endGame() {
        this.gameRunning = false;
        
        this.playSound('gameOver');
        
        // Limpiar timers
        clearInterval(this.scoreTimer);
        clearInterval(this.enemyTimer);
        clearInterval(this.bitcoinTimer);
        
        // Limpiar elementos del juego
        this.cleanupGameElements();
        
        // Actualizar high score
        this.updateHighScore();
        
        // Mostrar pantalla de game over
        this.finalScore.textContent = this.formatScore(this.score);
        this.gameOver.style.display = 'block';
        
        console.log(`💀 Game Over! Puntuación: ${this.formatScore(this.score)}`);
    }
    
    cleanupGameElements() {
        this.enemies.forEach(enemy => {
            if (enemy.parentNode) enemy.parentNode.removeChild(enemy);
        });
        this.bitcoins.forEach(bitcoin => {
            if (bitcoin.parentNode) bitcoin.parentNode.removeChild(bitcoin);
        });
        this.enemies = [];
        this.bitcoins = [];
    }
    
    updateHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('champignonHighScore', this.highScore);
            this.highScoreElement.textContent = this.formatScore(this.highScore);
            console.log('🏆 ¡Nuevo récord!');
        }
    }
    
    resetGame() {
        this.score = 0;
        this.time = 0;
        this.gameSpeed = 1;
        this.difficulty = 1;
        this.updateUI();
        this.instructions.style.display = 'block';
        this.gameOver.style.display = 'none';
        this.player.style.bottom = '80px';
        this.isJumping = false;
        this.cleanupGameElements();
        
        console.log('🔄 Juego reiniciado');
    }
    
    updateUI() {
        this.scoreElement.textContent = this.formatScore(this.score);
        this.timeElement.textContent = this.time;
    }
    
    formatScore(score) {
        return parseInt(score).toLocaleString();
    }
    
    getRandomInterval(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    gameLoop() {
        if (this.gameRunning) {
            this.checkCollisions();
        }
        requestAnimationFrame(() => this.gameLoop());
    }
    
    // Método para debugging
    getGameState() {
        return {
            score: this.score,
            time: this.time,
            gameSpeed: this.gameSpeed,
            difficulty: this.difficulty,
            enemiesCount: this.enemies.length,
            bitcoinsCount: this.bitcoins.length,
            isRunning: this.gameRunning
        };
    }
}