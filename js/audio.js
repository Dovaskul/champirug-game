class MusicSystem {
    constructor() {
        this.audioContext = null;
        this.musicEnabled = true;
        this.currentTrack = null;
        this.musicVolume = 0.3;
        this.muteButton = document.getElementById('muteButton');
        
        // Patrones musicales más variados
        this.musicPatterns = {
            main: [
                { notes: [523, 659, 784, 659, 523], durations: [0.2, 0.2, 0.4, 0.2, 0.4] },
                { notes: [440, 554, 659, 523], durations: [0.3, 0.3, 0.3, 0.5] },
                { notes: [784, 659, 523, 440, 523], durations: [0.2, 0.2, 0.2, 0.3, 0.3] }
            ],
            fast: [
                { notes: [880, 1046, 1244, 1046, 880, 740], durations: [0.15, 0.15, 0.2, 0.15, 0.15, 0.3] },
                { notes: [659, 784, 932, 784, 659], durations: [0.2, 0.2, 0.3, 0.2, 0.4] }
            ],
            bass: [
                { notes: [196, 220, 246, 220, 196], durations: [0.4, 0.3, 0.3, 0.3, 0.5] },
                { notes: [164, 196, 220, 196], durations: [0.5, 0.4, 0.4, 0.6] }
            ]
        };

        this.init();
    }

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Audio not supported:', error);
            return;
        }

        // Setup mute button
        if (this.muteButton) {
            this.muteButton.addEventListener('click', () => this.toggleMusic());
        }
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        
        if (this.muteButton) {
            this.muteButton.textContent = this.musicEnabled ? '🔊 MUSIC ON' : '🔇 MUSIC OFF';
            this.muteButton.classList.toggle('muted', !this.musicEnabled);
        }

        if (!this.musicEnabled && this.currentTrack) {
            clearTimeout(this.currentTrack);
            this.currentTrack = null;
        } else if (this.musicEnabled) {
            this.startBackgroundMusic();
        }
    }

    startBackgroundMusic() {
        if (!this.audioContext || !this.musicEnabled) return;

        // Resume audio context if suspended
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        this.playRandomPattern();
    }

    playRandomPattern() {
        if (!this.musicEnabled || !this.audioContext) return;

        // Elegir patrón aleatorio
        const patternTypes = Object.keys(this.musicPatterns);
        const randomType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
        const patterns = this.musicPatterns[randomType];
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];

        this.playPattern(pattern, () => {
            // Pausa variable entre patrones
            const pauseDuration = 1000 + Math.random() * 2000;
            this.currentTrack = setTimeout(() => this.playRandomPattern(), pauseDuration);
        });
    }

    playPattern(pattern, callback) {
        if (!this.audioContext || !this.musicEnabled) return;

        let currentTime = this.audioContext.currentTime;
        
        pattern.notes.forEach((frequency, index) => {
            const duration = pattern.durations[index];
            this.playNote(frequency, currentTime, duration);
            currentTime += duration;
        });

        // Callback cuando termine el patrón
        if (callback) {
            const totalDuration = pattern.durations.reduce((sum, dur) => sum + dur, 0);
            setTimeout(callback, totalDuration * 1000);
        }
    }

    playNote(frequency, startTime, duration) {
        if (!this.audioContext || !this.musicEnabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'square'; // 8-bit sound

        // Envelope para sonido más suave
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(this.musicVolume, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration - 0.01);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }

    // Efectos de sonido del juego
    playSoundEffect(type) {
        if (!this.audioContext) return;

        const effects = {
            jump: { freq: 659, duration: 0.1 },
            collect: { freq: 784, duration: 0.2 },
            gameOver: { freq: 196, duration: 0.5 },
            start: { freq: 523, duration: 0.2 }
        };

        const effect = effects[type];
        if (!effect) return;

        this.playNote(effect.freq, this.audioContext.currentTime, effect.duration);
    }

    stop() {
        if (this.currentTrack) {
            clearTimeout(this.currentTrack);
            this.currentTrack = null;
        }
    }
}