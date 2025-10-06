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
        
        // Game states
        this.score = 0;
        this.time = 0;
        this.gameRunning = false;
        this.isJumping = false;
        this.enemies = [];
        this.bitcoins = [];
        this.gameSpeed = 1;
        this.difficulty = 1;
        
        // High score persistente
        this.highScore = localStorage.getItem('mushroomHighScore') || 0;
        this.highScoreElement.textContent = this.formatScore(this.highScore);
        
        // Audio configuration
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
        console.log('Mushroom Game initialized');
    }
    
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Audio not available:', error);
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
        // Teclado con eventos de keydown y keyup para salto variable
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (!this.gameRunning && this.gameOver.style.display === 'none') {
                    this.startGame();
                } else if (this.gameRunning && !this.isJumping) {
                    this.jump(); // Iniciar salto variable
                } else if (!this.gameRunning) {
                    this.resetGame();
                }
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (e.code === 'Space' && this.isJumping && this.gameRunning) {
                e.preventDefault();
                this.executeJump(); // Ejecutar salto con la potencia acumulada
            }
        });
        
        // Click/Touch con eventos de inicio y fin
        this.gameContainer.addEventListener('mousedown', (e) => {
            this.handleMouseDown();
        });
        
        this.gameContainer.addEventListener('mouseup', (e) => {
            this.handleMouseUp();
        });
        
        // Touch events for mobile
        this.gameContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleMouseDown();
        });
        
        this.gameContainer.addEventListener('touchend', (e) => {
            e.preventDefault();  
            this.handleMouseUp();
        });
        
        // Page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.gameRunning) {
                this.pauseGame();
            }
        });
    }
    
    handleMouseDown() {
        if (!this.gameRunning && this.gameOver.style.display === 'none') {
            this.startGame();
        } else if (this.gameRunning && !this.isJumping) {  
            this.jump();
        } else if (!this.gameRunning) {
            this.resetGame();
        }
    }
    
    handleMouseUp() {
        if (this.isJumping && this.gameRunning) {
            this.executeJump();
        }
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
            
            // Increase difficulty more aggressively every 15 seconds
            if (this.time % 15 === 0) {
                this.difficulty += 0.3;
                this.gameSpeed += 0.15;
                console.log(`Difficulty increased: ${this.difficulty.toFixed(1)}`);
                
                // Add enemy burst when difficulty increases
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => this.spawnEnemy(), i * 500);
                }
            }
            
            // Additional enemy spawn every 5 seconds for constant pressure
            if (this.time % 5 === 0) {
                this.spawnEnemy();
                if (this.difficulty > 2) {
                    setTimeout(() => this.spawnEnemy(), 1000);
                }
            }
        }, 1000);
        
        // Much more frequent enemy spawn (much more difficult)
        this.enemyTimer = setInterval(() => {
            this.spawnEnemy();
            // Additional enemy spawn for higher difficulty
            if (Math.random() < 0.4 + (this.difficulty * 0.1)) {
                setTimeout(() => this.spawnEnemy(), this.getRandomInterval(800, 1500));
            }
            // Occasionally spawn groups of enemies
            if (Math.random() < 0.2 + (this.difficulty * 0.05)) {
                setTimeout(() => this.spawnEnemy(), this.getRandomInterval(400, 800));
                setTimeout(() => this.spawnEnemy(), this.getRandomInterval(1200, 1800));
            }
        }, this.getRandomInterval(2000, 4000) / this.difficulty); // Much more frequent
        
        // Spawn additional enemies every few seconds
        this.additionalEnemyTimer = setInterval(() => {
            for (let i = 0; i < Math.floor(this.difficulty); i++) {
                setTimeout(() => this.spawnEnemy(), i * this.getRandomInterval(300, 600));
            }
        }, this.getRandomInterval(3000, 6000));
        
        this.bitcoinTimer = setInterval(() => {
            this.spawnBitcoin();
        }, this.getRandomInterval(8000, 25000)); // Bitcoins slightly more frequent to compensate
        
        console.log('Game initialized!');
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
        pauseDiv.innerHTML = 'PAUSED<br><br>Click here to continue';
        
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

        // Sistema de salto inmediato con carga opcional
        this.startVariableJump();
    }    startVariableJump() {
        this.isJumping = true;
        this.jumpStartTime = Date.now();
        this.jumpPower = 0.3; // Salto mínimo inmediato
        this.maxJumpHeight = 234; // 30% higher than 180px
        this.minJumpHeight = 120;
        this.maxJumpDuration = 400; // Maximum charge time in ms

        this.player.classList.add('jumping');
        this.playSound('jump');

        // Ejecutar salto mínimo inmediato para eliminar delay
        this.executeQuickJump();
        
        // Comenzar la carga del salto para potencia adicional
        this.chargeJump();
    }
    
    chargeJump() {
        if (!this.isJumping) return;

        const currentTime = Date.now();
        const chargeDuration = Math.min(currentTime - this.jumpStartTime, this.maxJumpDuration);

        // Calcular la potencia del salto (0 a 1)
        this.jumpPower = chargeDuration / this.maxJumpDuration;

        // Mostrar indicador de carga visual
        this.showJumpChargeIndicator();

        // NO mover al jugador durante la carga - solo mostrar indicador
        // El jugador se mantiene en el suelo hasta ejecutar el salto

        // Continuar cargando si el espacio sigue presionado
        requestAnimationFrame(() => this.chargeJump());
    }    showJumpChargeIndicator() {
        // Crear indicador si no existe
        if (!this.jumpIndicator) {
            this.jumpIndicator = document.createElement('div');
            this.jumpIndicator.className = 'jump-charge-indicator';
            
            this.jumpChargeBar = document.createElement('div');
            this.jumpChargeBar.className = 'jump-charge-bar';
            
            this.jumpIndicator.appendChild(this.jumpChargeBar);
            this.gameContainer.appendChild(this.jumpIndicator);
        }
        
        // Actualizar la barra de carga
        this.jumpChargeBar.style.width = (this.jumpPower * 100) + '%';
    }
    
    hideJumpChargeIndicator() {
        if (this.jumpIndicator && this.jumpIndicator.parentNode) {
            this.jumpIndicator.parentNode.removeChild(this.jumpIndicator);
            this.jumpIndicator = null;
            this.jumpChargeBar = null;
        }
    }
    
    executeQuickJump() {
        // Salto inmediato sin delay para respuesta instantánea
        const quickHeight = this.minJumpHeight;
        this.player.style.bottom = quickHeight + 'px';
        this.currentJumpHeight = quickHeight;
    }

    executeJump() {
        if (!this.isJumping) return;

        // Ocultar indicador de carga
        this.hideJumpChargeIndicator();

        // Calcular la altura final del salto
        const finalHeight = this.minJumpHeight + (this.maxJumpHeight - this.minJumpHeight) * this.jumpPower;

        // Solo actualizar si la nueva altura es mayor que la actual
        if (finalHeight > this.currentJumpHeight) {
            this.player.style.bottom = finalHeight + 'px';
            this.currentJumpHeight = finalHeight;
        }

        // Jump duration based on height
        const jumpDuration = 300 + (this.jumpPower * 200); // Entre 300ms y 500ms

        // Different sound based on jump power
        if (this.jumpPower > 0.8) {
            this.playSound('jump'); // Salto alto
        } else if (this.jumpPower > 0.4) {
            this.sounds.jump.freq = 500; // Salto medio
            this.playSound('jump');
            this.sounds.jump.freq = 659; // Restaurar
        } else {
            this.sounds.jump.freq = 400; // Salto bajo
            this.playSound('jump');
            this.sounds.jump.freq = 659; // Restaurar
        }

        setTimeout(() => {
            this.player.style.bottom = '0px'; // Volver al suelo
            setTimeout(() => {
                this.isJumping = false;
                this.player.classList.remove('jumping');
                this.jumpPower = 0;
                this.currentJumpHeight = 0;
            }, 100); // Reducir delay de respuesta
        }, jumpDuration);
    }    spawnEnemy() {
        if (!this.gameRunning) return;
        
        const enemy = document.createElement('div');
        enemy.className = 'enemy';
        
        // More aggressive variable speed
        const speedVariation = 1 + (Math.random() * this.difficulty * 0.3);
        const baseSpeed = this.gameSpeed * speedVariation;
        enemy.style.animationDuration = `${2.5 / baseSpeed}s`; // Faster base speed
        
        // Ocasionalmente spawn enemigos voladores MUY altos - esquivables saltando
        if (Math.random() < 0.15) {
            enemy.style.bottom = '280px'; // Enemigos que vuelan MUY alto (esquivables agachándose)
            enemy.classList.add('flying-enemy');
        }
        
        // Enemigos más grandes ocasionalmente
        if (Math.random() < 0.1 + (this.difficulty * 0.05)) {
            enemy.style.transform = 'scale(1.3)';
            enemy.classList.add('big-enemy');
        }
        
        this.gameContainer.appendChild(enemy);
        this.enemies.push(enemy);
        
        // Limpiar enemigo después de que salga de pantalla
        setTimeout(() => {
            if (enemy.parentNode) {
                enemy.parentNode.removeChild(enemy);
                this.enemies = this.enemies.filter(e => e !== enemy);
            }
        }, (3500 / baseSpeed));
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
        
        console.log('Bitcoin collected! +100,000 points');
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
        clearInterval(this.additionalEnemyTimer);
        clearInterval(this.bitcoinTimer);
        
        // Limpiar elementos del juego
        this.cleanupGameElements();
        
        // Actualizar high score
        this.updateHighScore();
        
        // Mostrar pantalla de game over
        this.finalScore.textContent = this.formatScore(this.score);
        this.gameOver.style.display = 'block';
        
        console.log(`Game Over! Score: ${this.formatScore(this.score)}`);
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
            localStorage.setItem('mushroomHighScore', this.highScore);
            this.highScoreElement.textContent = this.formatScore(this.highScore);
            console.log('New high score!');
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
        this.player.style.bottom = '0px'; // Posición correcta en el suelo
        this.isJumping = false;
        this.cleanupGameElements();
        this.hideJumpChargeIndicator();
        
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