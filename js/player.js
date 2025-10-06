class Player {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.element = document.getElementById('player');
        
        // Propiedades físicas
        this.x = 100;
        this.y = 0;  // Empezar en el suelo (0px desde bottom)
        this.width = 40;
        this.height = 50;

        // Propiedades de salto
        this.jumpHeight = 100;
        this.isJumping = false;
        this.jumpSpeed = 0;
        this.gravity = 0.8;
        this.groundY = 0;  // El suelo está en 0px desde bottom        // Estados del jugador
        this.isAlive = true;
        this.invulnerable = false;
        
        this.init();
    }
    
    init() {
        this.resetPosition();
        console.log('Player initialized');
    }
    
    jump() {
        if (this.isJumping || !this.isAlive) return false;
        
        this.isJumping = true;
        this.jumpSpeed = -15; // Velocidad inicial negativa (hacia arriba)
        
        // Añadir clase de animación
        this.element.classList.add('jumping');
        
        return true; // Salto exitoso
    }
    
    update() {
        if (!this.isAlive) return;
        
        // Actualizar física del salto
        if (this.isJumping) {
            this.jumpSpeed += this.gravity;
            this.y -= this.jumpSpeed;
            
            // Verificar si ha tocado el suelo
            if (this.y >= this.groundY) {
                this.land();
            }
            
            this.updatePosition();
        }
    }
    
    land() {
        this.y = this.groundY;
        this.isJumping = false;
        this.jumpSpeed = 0;
        this.element.classList.remove('jumping');
    }
    
    updatePosition() {
        this.element.style.bottom = this.y + 'px';
    }
    
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }
    
    getRect() {
        return this.element.getBoundingClientRect();
    }
    
    die() {
        this.isAlive = false;
        this.element.style.filter = 'grayscale(100%)';
        this.element.style.opacity = '0.7';
        
        // Animación de muerte
        this.element.style.animation = 'shake 0.5s ease-in-out';
    }
    
    reset() {
        this.isAlive = true;
        this.isJumping = false;
        this.jumpSpeed = 0;
        this.invulnerable = false;
        
        // Resetear estilos
        this.element.style.filter = '';
        this.element.style.opacity = '';
        this.element.style.animation = '';
        this.element.classList.remove('jumping');
        
        this.resetPosition();
    }
    
    resetPosition() {
        this.y = this.groundY;
        this.updatePosition();
    }
    
    makeInvulnerable(duration = 1000) {
        this.invulnerable = true;
        this.element.style.opacity = '0.5';
        
        setTimeout(() => {
            this.invulnerable = false;
            this.element.style.opacity = '';
        }, duration);
    }
    
    isColliding(otherBounds) {
        const playerBounds = this.getBounds();
        const tolerance = 5; // Tolerancia para colisiones más justas
        
        return !(playerBounds.right < otherBounds.left + tolerance || 
                playerBounds.left > otherBounds.right - tolerance || 
                playerBounds.bottom < otherBounds.top + tolerance || 
                playerBounds.top > otherBounds.bottom - tolerance);
    }
    
    // Método para debugging
    getState() {
        return {
            x: this.x,
            y: this.y,
            isJumping: this.isJumping,
            isAlive: this.isAlive,
            jumpSpeed: this.jumpSpeed,
            invulnerable: this.invulnerable
        };
    }
}