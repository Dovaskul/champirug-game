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
        this.enemies = [];
        this.bitcoins = [];
        this.gameSpeed = 1;
        this.difficulty = 1;

        // Simple jump system like Chrome Dino
        this.isJumping = false;
        this.jumpHeight = 150;
        this.jumpDuration = 600;
        this.groundLevel = 12;

        // High score
        this.highScore = localStorage.getItem('mushroomHighScore') || 0;
        this.highScoreElement.textContent = this.formatScore(this.highScore);

        // Background music
        this.musicContext = null;
        this.backgroundMusic = null;

        this.init();
    }

    init() {
        this.initAudio();
        this.bindEvents();
        this.gameLoop();
        console.log('Game initialized!');
    }

    initAudio() {
        try {
            this.musicContext = new (window.AudioContext || window.webkitAudioContext)();
            this.startBackgroundMusic();
        } catch (error) {
            console.warn('Audio not available:', error);
        }
    }

    startBackgroundMusic() {
        if (!this.musicContext) return;

        // Simple 8-bit style background music
        const playNote = (frequency, duration, delay = 0) => {
            setTimeout(() => {
                if (!this.gameRunning) return;
                
                const oscillator = this.musicContext.createOscillator();
                const gainNode = this.musicContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.musicContext.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = 'square';
                
                gainNode.gain.setValueAtTime(0.05, this.musicContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.musicContext.currentTime + duration);
                
                oscillator.start(this.musicContext.currentTime);
                oscillator.stop(this.musicContext.currentTime + duration);
            }, delay);
        };

        // Main melody loop (8-bit style)
        const playMelody = () => {
            if (!this.gameRunning) return;
            
            // Simple ascending melody
            const notes = [262, 294, 330, 349, 392, 440, 494, 523]; // C major scale
            const rhythm = [0.3, 0.3, 0.3, 0.3, 0.4, 0.4, 0.4, 0.6];
            
            let currentTime = 0;
            notes.forEach((note, index) => {
                playNote(note, rhythm[index], currentTime * 1000);
                currentTime += rhythm[index];
            });
            
            // Bass line
            setTimeout(() => {
                playNote(130, 0.8, 0);    // C bass
                playNote(164, 0.8, 1000); // E bass
                playNote(196, 0.8, 2000); // G bass
                playNote(130, 0.8, 3000); // C bass
            }, 0);
            
            // Repeat every 4 seconds
            setTimeout(playMelody, 4000);
        };

        if (this.gameRunning) {
            playMelody();
        }
    }

    bindEvents() {
        // Simple keyboard controls like Chrome Dino
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                this.handleJump();
            }
            if (e.code === 'Escape') {
                e.preventDefault();
                this.pauseGame();
            }
        });

        // Mouse/touch controls
        this.gameContainer.addEventListener('click', () => {
            this.handleJump();
        });

        this.gameContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleJump();
        });
    }

    handleJump() {
        if (!this.gameRunning && this.gameOver.style.display === 'none') {
            this.startGame();
        } else if (this.gameRunning && !this.isJumping) {
            this.jump();
        } else if (!this.gameRunning) {
            this.resetGame();
        }
    }

    // Simple jump like Chrome Dino - NO DELAYS, NO COMPLEX PHYSICS
    jump() {
        if (this.isJumping) return;
        
        this.isJumping = true;
        this.playJumpSound();
        
        // Immediate jump to peak height
        this.player.style.bottom = (this.groundLevel + this.jumpHeight) + 'px';
        this.player.classList.add('jumping');
        
        // Return to ground after jump duration
        setTimeout(() => {
            this.player.style.bottom = this.groundLevel + 'px';
            this.player.classList.remove('jumping');
            
            setTimeout(() => {
                this.isJumping = false;
            }, 100); // Small delay to prevent double jumping
        }, this.jumpDuration);
    }

    playJumpSound() {
        if (!this.musicContext) return;
        
        const oscillator = this.musicContext.createOscillator();
        const gainNode = this.musicContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.musicContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.musicContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, this.musicContext.currentTime + 0.1);
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0.1, this.musicContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.musicContext.currentTime + 0.1);
        
        oscillator.start(this.musicContext.currentTime);
        oscillator.stop(this.musicContext.currentTime + 0.1);
    }

    startGame() {
        this.gameRunning = true;
        this.instructions.style.display = 'none';
        this.gameOver.style.display = 'none';
        
        // Reset player position
        this.player.style.bottom = this.groundLevel + 'px';
        this.isJumping = false;

        // Resume audio context
        if (this.musicContext && this.musicContext.state === 'suspended') {
            this.musicContext.resume();
        }

        this.startBackgroundMusic();

        // Score timer
        this.scoreTimer = setInterval(() => {
            this.time++;
            this.score += 100;
            this.updateUI();

            // Increase difficulty every 30 seconds
            if (this.time % 30 === 0) {
                this.difficulty += 0.5;
                this.gameSpeed += 0.2;
                console.log(`Difficulty: ${this.difficulty}`);
            }
        }, 1000);

        // Enemy spawning - more frequent than Chrome Dino for challenge
        this.enemyTimer = setInterval(() => {
            this.spawnEnemy();
        }, this.getRandomInterval(1500, 3000) / this.difficulty);

        // Bitcoin spawning
        this.bitcoinTimer = setInterval(() => {
            this.spawnBitcoin();
        }, this.getRandomInterval(8000, 15000));

        console.log('Game started!');
    }

    spawnEnemy() {
        if (!this.gameRunning) return;

        const enemy = document.createElement('div');
        enemy.className = 'enemy';

        // Ensure enemies spawn on ground level where player can hit them
        // NO floating enemies that are impossible to dodge
        enemy.style.bottom = this.groundLevel + 'px';

        // Speed variation
        const speed = this.gameSpeed * (0.8 + Math.random() * 0.4);
        enemy.style.animationDuration = `${3 / speed}s`;

        // Occasionally spawn flying enemies that are VERY high (dodgeable by not jumping)
        if (Math.random() < 0.2) {
            enemy.style.bottom = (this.groundLevel + this.jumpHeight + 50) + 'px'; // Way above jump height
            enemy.classList.add('flying-enemy');
        }

        this.gameContainer.appendChild(enemy);
        this.enemies.push(enemy);

        // Clean up enemy after it leaves screen
        setTimeout(() => {
            if (enemy.parentNode) {
                enemy.parentNode.removeChild(enemy);
            }
            const index = this.enemies.indexOf(enemy);
            if (index > -1) {
                this.enemies.splice(index, 1);
            }
        }, 4000);
    }

    spawnBitcoin() {
        if (!this.gameRunning) return;

        const bitcoin = document.createElement('div');
        bitcoin.className = 'bitcoin';

        // Bitcoins at jump height - must jump to collect
        bitcoin.style.bottom = (this.groundLevel + this.jumpHeight - 30) + 'px';
        bitcoin.style.animationDuration = `${4 / this.gameSpeed}s`;

        this.gameContainer.appendChild(bitcoin);
        this.bitcoins.push(bitcoin);

        setTimeout(() => {
            if (bitcoin.parentNode) {
                bitcoin.parentNode.removeChild(bitcoin);
            }
            const index = this.bitcoins.indexOf(bitcoin);
            if (index > -1) {
                this.bitcoins.splice(index, 1);
            }
        }, 5000);
    }

    gameLoop() {
        if (this.gameRunning) {
            this.checkCollisions();
        }
        requestAnimationFrame(() => this.gameLoop());
    }

    checkCollisions() {
        const playerRect = this.player.getBoundingClientRect();
        const containerRect = this.gameContainer.getBoundingClientRect();

        // Check enemy collisions
        this.enemies.forEach(enemy => {
            const enemyRect = enemy.getBoundingClientRect();
            
            if (this.isColliding(playerRect, enemyRect, containerRect)) {
                this.gameOver();
                return;
            }
        });

        // Check bitcoin collisions
        this.bitcoins.forEach((bitcoin, index) => {
            const bitcoinRect = bitcoin.getBoundingClientRect();
            
            if (this.isColliding(playerRect, bitcoinRect, containerRect)) {
                this.collectBitcoin(bitcoin, index);
            }
        });
    }

    isColliding(rect1, rect2, container) {
        const tolerance = 5;
        
        const r1 = {
            left: rect1.left - container.left,
            right: rect1.right - container.left,
            top: rect1.top - container.top,
            bottom: rect1.bottom - container.top
        };
        
        const r2 = {
            left: rect2.left - container.left,
            right: rect2.right - container.left,
            top: rect2.top - container.top,
            bottom: rect2.bottom - container.top
        };

        return !(r1.right < r2.left + tolerance ||
                r1.left > r2.right - tolerance ||
                r1.bottom < r2.top + tolerance ||
                r1.top > r2.bottom - tolerance);
    }

    collectBitcoin(bitcoin, index) {
        this.score += 1000;
        this.updateUI();
        
        if (bitcoin.parentNode) {
            bitcoin.parentNode.removeChild(bitcoin);
        }
        this.bitcoins.splice(index, 1);
        
        this.playCollectSound();
    }

    playCollectSound() {
        if (!this.musicContext) return;
        
        const oscillator = this.musicContext.createOscillator();
        const gainNode = this.musicContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.musicContext.destination);
        
        oscillator.frequency.setValueAtTime(1000, this.musicContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1500, this.musicContext.currentTime + 0.2);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, this.musicContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.musicContext.currentTime + 0.2);
        
        oscillator.start(this.musicContext.currentTime);
        oscillator.stop(this.musicContext.currentTime + 0.2);
    }

    gameOver() {
        this.gameRunning = false;
        this.updateHighScore();
        this.cleanupTimers();
        
        this.finalScore.textContent = this.formatScore(this.score);
        this.gameOver.style.display = 'block';
        
        console.log(`Game Over! Score: ${this.formatScore(this.score)}`);
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
        this.difficulty = 1;
        this.gameSpeed = 1;
        this.gameRunning = false;
        this.isJumping = false;

        this.instructions.style.display = 'block';
        this.gameOver.style.display = 'none';
        this.player.style.bottom = this.groundLevel + 'px';
        this.player.classList.remove('jumping');
        
        this.cleanupGameElements();
        this.cleanupTimers();
        this.updateUI();
        
        console.log('Game reset');
    }

    pauseGame() {
        if (!this.gameRunning) return;
        
        this.gameRunning = false;
        this.cleanupTimers();
        
        // Show pause message
        const pauseDiv = document.createElement('div');
        pauseDiv.className = 'instructions';
        pauseDiv.innerHTML = 'PAUSED<br><br>Click to continue';
        pauseDiv.style.zIndex = '25';
        
        pauseDiv.addEventListener('click', () => {
            pauseDiv.remove();
            this.startGame();
        });
        
        this.gameContainer.appendChild(pauseDiv);
    }

    cleanupTimers() {
        if (this.scoreTimer) clearInterval(this.scoreTimer);
        if (this.enemyTimer) clearInterval(this.enemyTimer);
        if (this.bitcoinTimer) clearInterval(this.bitcoinTimer);
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

    updateUI() {
        this.scoreElement.textContent = this.formatScore(this.score);
        this.timeElement.textContent = this.time + 's';
    }

    formatScore(score) {
        return score.toString().padStart(5, '0');
    }

    getRandomInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}