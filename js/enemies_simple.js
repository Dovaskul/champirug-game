class SimpleEnemy {
    constructor(gameContainer, speed = 3) {
        this.gameContainer = gameContainer;
        this.speed = speed;
        this.element = document.createElement('div');

        // Propiedades físicas
        this.width = 40;
        this.height = 40;
        this.x = 800; // Empezar fuera de pantalla derecha
        
        // Alturas variadas: suelo, baja, media, alta
        const heights = [0, 30, 60, 100, 140];
        this.y = heights[Math.floor(Math.random() * heights.length)];

        this.init();
    }    init() {
        this.element.className = 'enemy simple-enemy';
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        this.element.style.left = this.x + 'px';
        this.element.style.bottom = this.y + 'px';
        
        this.gameContainer.appendChild(this.element);
    }

    update() {
        // Mover hacia la izquierda
        this.x -= this.speed;
        this.element.style.left = this.x + 'px';
        
        // Eliminar si sale de pantalla
        if (this.x < -this.width) {
            this.destroy();
            return false;
        }
        
        return true;
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

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

class SimpleBitcoin {
    constructor(gameContainer, speed = 3) {
        this.gameContainer = gameContainer;
        this.speed = speed;
        this.element = document.createElement('div');

        // Propiedades físicas
        this.width = 30;
        this.height = 30;
        this.x = 800;
        
        // Alturas más variadas para los bitcoins: suelo, baja, media, media-alta, alta
        const heights = [0, 25, 50, 80, 110, 150];
        this.y = heights[Math.floor(Math.random() * heights.length)];

        this.init();
    }    init() {
        this.element.className = 'bitcoin simple-bitcoin';
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        this.element.style.left = this.x + 'px';
        this.element.style.bottom = this.y + 'px';
        
        this.gameContainer.appendChild(this.element);
    }

    update() {
        this.x -= this.speed;
        this.element.style.left = this.x + 'px';
        
        if (this.x < -this.width) {
            this.destroy();
            return false;
        }
        
        return true;
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

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}