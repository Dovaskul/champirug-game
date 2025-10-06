class MushroomGame {
    constructor() {
        this.gameContainer = document.getElementById('gameContainer');
        this.player = new SimplePlayer(this.gameContainer);
        this.musicSystem = new MusicSystem();
        
        // UI Elements
        this.scoreElement = document.getElementById('score');
        this.timeElement = document.getElementById('time');
        this.highScoreElement = document.getElementById('highScore');
        this.instructions = document.getElementById('instructions');
        this.gameOver = document.getElementById('gameOver');
        this.finalScore = document.getElementById('finalScore');

        // Game state
        this.isRunning = false;
        this.score = 0;
        this.time = 0;
        this.speed = 3;
        this.enemies = [];
        this.bitcoins = [];
        
        // Timers
        this.gameLoopId = null;
        this.enemySpawnTimer = null;
        this.bitcoinSpawnTimer = null;
        this.scoreTimer = null;
        
        // High score
        this.highScore = parseInt(localStorage.getItem('mushroomHighScore')) || 0;
        this.updateHighScore();
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.gameLoop();
    }

    bindEvents() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.handleJump();
            }
            if (e.code === 'Escape') {
                e.preventDefault();
                if (this.isRunning) {
                    this.pauseGame();
                }
            }
        });

        // Mouse/Touch controls
        this.gameContainer.addEventListener('click', () => {
            this.handleJump();
        });

        this.gameContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleJump();
        });
    }

    handleJump() {
        console.log('Jump pressed! isRunning:', this.isRunning, 'gameOver display:', this.gameOver.style.display);
        
        // Si el juego no está corriendo, iniciarlo
        if (!this.isRunning) {
            console.log('Starting game...');
            this.startGame();
            return;
        }
        
        // Si el juego está corriendo, hacer saltar al jugador
        if (this.isRunning) {
            console.log('Attempting jump...');
            if (this.player.jump()) {
                console.log('Jump successful!');
                this.musicSystem.playSoundEffect('jump');
            } else {
                console.log('Jump failed - already jumping');
            }
        }
    }

    startGame() {
        this.isRunning = true;
        this.score = 0;
        this.time = 0;
        this.speed = 3;
        
        // Hide menus
        this.instructions.style.display = 'none';
        this.gameOver.style.display = 'none';
        
        // Reset player
        this.player.reset();
        
        // Clear existing enemies and bitcoins
        this.enemies.forEach(enemy => enemy.destroy());
        this.bitcoins.forEach(bitcoin => bitcoin.destroy());
        this.enemies = [];
        this.bitcoins = [];
        
        // Start music
        this.musicSystem.startBackgroundMusic();
        this.musicSystem.playSoundEffect('start');
        
        // Start timers
        this.startTimers();
        
        this.updateUI();
    }

    startTimers() {
        // Score timer
        this.scoreTimer = setInterval(() => {
            this.time++;
            this.score += 10;
            
            // Increase speed gradually
            if (this.time % 10 === 0) {
                this.speed += 0.2;
            }
            
            this.updateUI();
        }, 1000);

        // Enemy spawning - más frecuente en el suelo
        this.enemySpawnTimer = setInterval(() => {
            this.spawnEnemy();
        }, 2000 - (this.speed * 50)); // Más rápido conforme aumenta velocidad

        // Bitcoin spawning
        this.bitcoinSpawnTimer = setInterval(() => {
            if (Math.random() < 0.3) {
                this.spawnBitcoin();
            }
        }, 3000);
    }

    spawnEnemy() {
        const enemy = new SimpleEnemy(this.gameContainer, this.speed);
        this.enemies.push(enemy);
    }

    spawnBitcoin() {
        const bitcoin = new SimpleBitcoin(this.gameContainer, this.speed);
        this.bitcoins.push(bitcoin);
    }

    gameLoop() {
        if (this.isRunning) {
            // Update player
            this.player.update();
            
            // Update enemies
            this.enemies = this.enemies.filter(enemy => {
                const stillAlive = enemy.update();
                if (!stillAlive) {
                    enemy.destroy();
                }
                return stillAlive;
            });
            
            // Update bitcoins
            this.bitcoins = this.bitcoins.filter(bitcoin => {
                const stillAlive = bitcoin.update();
                if (!stillAlive) {
                    bitcoin.destroy();
                }
                return stillAlive;
            });
            
            // Check collisions
            this.checkCollisions();
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }

    checkCollisions() {
        const playerBounds = this.player.getBounds();
        
        // Check enemy collisions
        for (let enemy of this.enemies) {
            if (this.isColliding(playerBounds, enemy.getBounds())) {
                this.endGame();
                return;
            }
        }
        
        // Check bitcoin collisions
        this.bitcoins = this.bitcoins.filter(bitcoin => {
            if (this.isColliding(playerBounds, bitcoin.getBounds())) {
                this.score += 100;
                this.musicSystem.playSoundEffect('collect');
                bitcoin.destroy();
                this.updateUI();
                return false;
            }
            return true;
        });
    }

    isColliding(rect1, rect2) {
        return !(rect1.right < rect2.left || 
                rect1.left > rect2.right || 
                rect1.bottom < rect2.top || 
                rect1.top > rect2.bottom);
    }

    endGame() {
        this.isRunning = false;
        
        // Stop timers
        clearInterval(this.scoreTimer);
        clearInterval(this.enemySpawnTimer);
        clearInterval(this.bitcoinSpawnTimer);
        
        // Stop music
        this.musicSystem.stop();
        this.musicSystem.playSoundEffect('gameOver');
        
        // Show game over
        this.player.die();
        this.finalScore.textContent = this.score;
        this.gameOver.style.display = 'block';
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('mushroomHighScore', this.highScore);
            this.updateHighScore();
        }
    }

    resetGame() {
        this.isRunning = false;
        
        // Clear timers
        clearInterval(this.scoreTimer);
        clearInterval(this.enemySpawnTimer);
        clearInterval(this.bitcoinSpawnTimer);
        
        // Stop music
        this.musicSystem.stop();
        
        // Clear enemies and bitcoins
        this.enemies.forEach(enemy => enemy.destroy());
        this.bitcoins.forEach(bitcoin => bitcoin.destroy());
        this.enemies = [];
        this.bitcoins = [];
        
        // Reset player
        this.player.reset();
        
        // Show instructions
        this.instructions.style.display = 'block';
        this.gameOver.style.display = 'none';
        
        // Reset stats
        this.score = 0;
        this.time = 0;
        this.speed = 3;
        this.updateUI();
    }

    pauseGame() {
        // Simple pause implementation
        this.resetGame();
    }

    updateUI() {
        this.scoreElement.textContent = this.score;
        this.timeElement.textContent = this.time;
    }

    updateHighScore() {
        this.highScoreElement.textContent = this.highScore;
    }
}