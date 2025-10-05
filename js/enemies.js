class Enemy {
    constructor(gameContainer, speed = 1, type = 'bear') {
        this.element = document.createElement('div');
        this.gameContainer = gameContainer;
        this.speed = speed;
        this.type = type;
        
        // Propiedades físicas
        this.width = 50;
        this.height = 40;
        this.x = -60;
        this.y = 80;
        
        // Configuración por tipo
        this.setupType();
        this.init();
    }
    
    setupType() {
        const enemyTypes = {
            bear: { emoji: '🐻', color: '#8B4513', speed: 1 },
            wolf: { emoji: '🐺', color: '#696969', speed: 1.2 },
            raccoon: { emoji: '🦝', color: '#A0522D', speed: 0.8 }
        };
        
        const config = enemyTypes[this.type] || enemyTypes.bear;
        this.emoji = config.emoji;
        this.color = config.color;
        this.speedMultiplier = config.speed;
    }
    
    init() {
        this.element.className = 'enemy';
        this.element.style.backgroundColor = this.color;
        this.element.style.animationDuration = `${3 / (this.speed * this.speedMultiplier)}s`;
        
        // Añadir emoji
        const emojiElement = document.createElement('div');
        emojiElement.textContent = this.emoji;
        emojiElement.style.cssText = `
            position: absolute;
            top: 5px;
            left: 8px;
            font-size: 24px;
        `;
        this.element.appendChild(emojiElement);
        
        this.gameContainer.appendChild(this.element);
    }
    
    getBounds() {
        const rect = this.element.getBoundingClientRect();
        const containerRect = this.gameContainer.getBoundingClientRect();
        
        return {
            x: rect.left - containerRect.left,
            y: rect.top - containerRect.top,
            width: this.width,
            height: this.height,
            left: rect.left - containerRect.left,
            right: rect.right - containerRect.left,
            top: rect.top - containerRect.top,
            bottom: rect.bottom - containerRect.top
        };
    }
    
    getRect() {
        return this.element.getBoundingClientRect();
    }
    
    isOffScreen() {
        const bounds = this.getBounds();
        return bounds.left > this.gameContainer.offsetWidth;
    }
    
    destroy() {
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
    
    // Método estático para crear enemigo aleatorio
    static createRandom(gameContainer, speed = 1) {
        const types = ['bear', 'wolf', 'raccoon'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        return new Enemy(gameContainer, speed, randomType);
    }
}

class Bitcoin {
    constructor(gameContainer, speed = 1) {
        this.element = document.createElement('div');
        this.gameContainer = gameContainer;
        this.speed = speed;
        
        // Propiedades físicas
        this.width = 30;
        this.height = 30;
        this.x = -40;
        this.y = 120; // Altura diferente a los enemigos
        this.value = 100000;
        
        // Efectos especiales
        this.glowIntensity = 0;
        this.glowDirection = 1;
        
        this.init();
    }
    
    init() {
        this.element.className = 'bitcoin';
        this.element.style.animationDuration = `${4 / this.speed}s, 1s`;
        
        // Añadir símbolo bitcoin
        const symbolElement = document.createElement('div');
        symbolElement.textContent = '₿';
        symbolElement.style.cssText = `
            position: absolute;
            top: 2px;
            left: 6px;
            font-size: 18px;
            color: #000;
            font-weight: bold;
        `;
        this.element.appendChild(symbolElement);
        
        this.gameContainer.appendChild(this.element);
        
        // Iniciar efecto de brillo
        this.startGlowEffect();
    }
    
    startGlowEffect() {
        setInterval(() => {
            this.glowIntensity += this.glowDirection * 0.1;
            
            if (this.glowIntensity >= 1) {
                this.glowDirection = -1;
            } else if (this.glowIntensity <= 0) {
                this.glowDirection = 1;
            }
            
            const glowValue = Math.floor(this.glowIntensity * 20);
            this.element.style.boxShadow = `0 0 ${glowValue}px #FFD700`;
        }, 50);
    }
    
    getBounds() {
        const rect = this.element.getBoundingClientRect();
        const containerRect = this.gameContainer.getBoundingClientRect();
        
        return {
            x: rect.left - containerRect.left,
            y: rect.top - containerRect.top,
            width: this.width,
            height: this.height,
            left: rect.left - containerRect.left,
            right: rect.right - containerRect.left,
            top: rect.top - containerRect.top,
            bottom: rect.bottom - containerRect.top
        };
    }
    
    getRect() {
        return this.element.getBoundingClientRect();
    }
    
    isOffScreen() {
        const bounds = this.getBounds();
        return bounds.left > this.gameContainer.offsetWidth;
    }
    
    collect() {
        // Efecto de colección
        this.element.style.animation = 'collectSpin 0.5s ease-in-out';
        this.element.style.transform = 'scale(1.5)';
        this.element.style.opacity = '0';
        
        setTimeout(() => {
            this.destroy();
        }, 500);
        
        return this.value;
    }
    
    destroy() {
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

class Powerup {
    constructor(gameContainer, speed = 1, type = 'shield') {
        this.element = document.createElement('div');
        this.gameContainer = gameContainer;
        this.speed = speed;
        this.type = type;
        
        // Propiedades físicas
        this.width = 25;
        this.height = 25;
        this.x = -30;
        this.y = 100;
        
        this.setupType();
        this.init();
    }
    
    setupType() {
        const powerupTypes = {
            shield: { emoji: '🛡️', effect: 'invulnerability', duration: 3000 },
            speed: { emoji: '⚡', effect: 'speed_boost', duration: 5000 },
            points: { emoji: '⭐', effect: 'bonus_points', value: 50000 }
        };
        
        const config = powerupTypes[this.type] || powerupTypes.shield;
        this.emoji = config.emoji;
        this.effect = config.effect;
        this.duration = config.duration;
        this.value = config.value;
    }
    
    init() {
        this.element.style.cssText = `
            position: absolute;
            bottom: 100px;
            right: -30px;
            width: ${this.width}px;
            height: ${this.height}px;
            background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
            border: 2px solid #000;
            border-radius: 50%;
            animation: moveLeft ${4 / this.speed}s linear infinite, pulse 1.5s ease-in-out infinite;
            z-index: 5;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
        `;
        
        this.element.textContent = this.emoji;
        this.gameContainer.appendChild(this.element);
    }
    
    getBounds() {
        const rect = this.element.getBoundingClientRect();
        const containerRect = this.gameContainer.getBoundingClientRect();
        
        return {
            x: rect.left - containerRect.left,
            y: rect.top - containerRect.top,
            width: this.width,
            height: this.height,
            left: rect.left - containerRect.left,
            right: rect.right - containerRect.left,
            top: rect.top - containerRect.top,
            bottom: rect.bottom - containerRect.top
        };
    }
    
    isOffScreen() {
        const bounds = this.getBounds();
        return bounds.left > this.gameContainer.offsetWidth;
    }
    
    collect() {
        this.element.style.animation = 'collectFloat 0.5s ease-out';
        this.element.style.opacity = '0';
        
        setTimeout(() => {
            this.destroy();
        }, 500);
        
        return {
            effect: this.effect,
            duration: this.duration,
            value: this.value
        };
    }
    
    destroy() {
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
    
    static createRandom(gameContainer, speed = 1) {
        const types = ['shield', 'speed', 'points'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        return new Powerup(gameContainer, speed, randomType);
    }
}

// Añadir estilos CSS adicionales para animaciones
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes collectSpin {
        0% { transform: rotate(0deg) scale(1); }
        100% { transform: rotate(360deg) scale(1.5); }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(additionalStyles);