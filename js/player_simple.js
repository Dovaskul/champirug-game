class SimplePlayer {
    constructor(gameContainer) {
        this.gameContainer = gameContainer;
        this.element = document.getElementById('player');
        
        // Propiedades físicas
        this.width = 40;
        this.height = 40;
        this.x = 80; // Posición fija X
        this.y = 0;  // Posición Y (0 = suelo)
        
        // Propiedades de salto - simple como Chrome Dino
        this.isJumping = false;
        this.jumpForce = 0;
        this.gravity = 0.6;
        this.jumpSpeed = -12; // Fuerza inicial del salto
        this.maxJumpHeight = 150;
        
        this.init();
    }

    init() {
        if (!this.element) {
            console.error('Player element not found!');
            return;
        }
        
        // Posición inicial en el suelo
        this.element.style.left = this.x + 'px';
        this.element.style.bottom = '0px';
        this.element.classList.add('player-visible');
    }

    jump() {
        if (this.isJumping) return false;
        
        this.isJumping = true;
        this.jumpForce = this.jumpSpeed;
        this.element.classList.add('jumping');
        
        return true;
    }

    update() {
        if (this.isJumping) {
            // Aplicar gravedad
            this.jumpForce += this.gravity;
            this.y -= this.jumpForce;
            
            // Verificar si toca el suelo
            if (this.y >= 0) {
                this.y = 0;
                this.isJumping = false;
                this.jumpForce = 0;
                this.element.classList.remove('jumping');
            }
            
            // Actualizar posición visual
            this.element.style.bottom = this.y + 'px';
        }
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

    reset() {
        this.y = 0;
        this.isJumping = false;
        this.jumpForce = 0;
        this.element.style.bottom = '0px';
        this.element.classList.remove('jumping');
        this.element.classList.add('player-visible');
    }

    die() {
        this.element.classList.add('player-dead');
    }
}