# 🍄 Champiñón Saltarín 8-bit (Champirug)

Un juego estilo **Chrome Dino** con un champiñón pixelado que debe esquivar osos y recoger bitcoins para ganar puntos.

![Champirug Logo](https://img.shields.io/badge/🍄-Champirug-red?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## 🎮 Características del Juego

### Mecánicas Principales
- **Personaje**: Champiñón rojo con sombrero marrón (estilo Mario 8-bit)
- **Enemigos**: Osos 🐻, lobos 🐺 y mapaches 🦝 que aparecen cada 5-10 segundos aleatoriamente
- **Coleccionables**: Bitcoins dorados ₿ que aparecen cada 10-40 segundos
- **Puntuación**: 1,000 puntos por segundo + 100,000 por bitcoin
- **Dificultad progresiva**: El juego se acelera cada 30 segundos
- **Power-ups**: Escudos 🛡️, velocidad ⚡ y puntos extra ⭐

### Controles
- **Espacio** o **Click**: Saltar
- **Espacio**: Iniciar/Reiniciar juego

### Características Técnicas
- **Estética 8-bit**: Fuente pixelada Press Start 2P, colores retro, animaciones suaves
- **Audio 8-bit**: Sonidos generados con Web Audio API
- **Responsive**: Se adapta a diferentes tamaños de pantalla
- **High Score**: Puntuación máxima guardada localmente
- **Detección de colisiones**: Sistema preciso de colisiones
- **Modo desarrollo**: Controles especiales para debugging

## 🚀 Cómo Ejecutar

### Opción 1: Servidor Local con Python (Recomendado)
```powershell
# Navegar al directorio del proyecto
cd "C:\Users\chema\VSCODE\champirug"

# Servidor HTTP simple con Python
python -m http.server 8000
```
📍 **Abrir en navegador:** http://localhost:8000

### Opción 2: Servidor con Node.js
```powershell
# Con npx (Node.js requerido)
npx http-server -p 8000

# O con live-server para desarrollo
npx live-server --port=8000
```

### Opción 3: Live Server en VS Code
1. Instala la extensión "Live Server" en VS Code
2. Haz click derecho en `index.html`
3. Selecciona "Open with Live Server"

### Opción 4: Abrir Directamente (Limitado)
Simplemente abre el archivo `index.html` en tu navegador (algunos navegadores modernos pueden restringir ciertas funciones).

## 📁 Estructura del Proyecto

```
champirug/
├── index.html                  # Página principal del juego
├── css/
│   └── style.css              # Estilos 8-bit completos
├── js/
│   ├── main.js                # Punto de entrada y utilidades
│   ├── game.js                # Lógica principal del juego
│   ├── player.js              # Clase del jugador (champiñón)
│   └── enemies.js             # Clases de enemigos, bitcoins y power-ups
├── assets/
│   └── images/                # Imágenes del juego (futuro)
├── README.md                  # Documentación del proyecto
├── package.json               # Configuración del proyecto
└── .gitignore                 # Archivos ignorados por Git
```

## 🎯 Sistema de Puntuación

| Acción | Puntos |
|--------|--------|
| Supervivencia | +1,000 puntos/segundo |
| Recoger Bitcoin ₿ | +100,000 puntos |
| Power-up Estrella ⭐ | +50,000 puntos |
| Record Personal | Guardado localmente |

## 🕹️ Controles y Mecánicas

### Controles Básicos
- **Inicio**: Presiona ESPACIO para comenzar
- **Saltar**: ESPACIO o CLICK en la pantalla
- **Reiniciar**: ESPACIO después del Game Over
- **Pausa**: Se pausa automáticamente al cambiar de pestaña

### Mecánicas Avanzadas
- **Dificultad Progresiva**: Cada 30 segundos aumenta la velocidad
- **Múltiples Enemigos**: Osos, lobos y mapaches con diferentes velocidades
- **Power-ups Aleatorios**: Aparecen ocasionalmente con efectos especiales
- **Colisiones Precisas**: Sistema de detección con tolerancia ajustable

## 🎨 Estética 8-bit

### Diseño Visual
- **Fuente**: Press Start 2P (Google Fonts)
- **Paleta de Colores**: Inspirada en juegos retro de los 80s
- **Animaciones**: Suaves transiciones CSS con efectos pixelados
- **Efectos Especiales**: Brillos, pulsos y animaciones de colección

### Audio
- **Sonidos 8-bit**: Generados en tiempo real con Web Audio API
- **Efectos**: Salto, colección, game over y inicio
- **Sin Música de Fondo**: Para mantener la concentración del jugador

## 🔧 Personalización y Desarrollo

### Modificar Dificultad
En `js/game.js`, puedes ajustar:
```javascript
// Frecuencia de enemigos (milisegundos)
this.enemyTimer = setInterval(() => {
    this.spawnEnemy();
}, this.getRandomInterval(5000, 10000));

// Frecuencia de bitcoins
this.bitcoinTimer = setInterval(() => {
    this.spawnBitcoin();
}, this.getRandomInterval(10000, 40000));

// Incremento de velocidad cada 30 segundos
if (this.time % 30 === 0) {
    this.difficulty += 0.2;
    this.gameSpeed += 0.1;
}
```

### Cambiar Puntuación
```javascript
// Puntos por segundo
this.score += 1000;

// Puntos por bitcoin
this.score += 100000;
```

### Añadir Nuevos Enemigos
En `js/enemies.js`:
```javascript
const enemyTypes = {
    newEnemy: { emoji: '🦊', color: '#FF4500', speed: 1.5 }
};
```

### Controles de Desarrollo
En la consola del navegador (F12):
```javascript
// Ver estado del juego
devControls.getGameState();

// Añadir puntos
devControls.addScore(50000);

// Cambiar velocidad
devControls.setSpeed(2);

// Generar enemigos/bitcoins manualmente
devControls.spawnEnemy();
devControls.spawnBitcoin();

// Modo invencible
devControls.godMode();
```

## 🐛 Resolución de Problemas

### El juego no carga
- ✅ Asegúrate de usar un servidor HTTP (no `file://`)
- ✅ Verifica que todos los archivos estén en su lugar
- ✅ Abre la consola del navegador (F12) para ver errores
- ✅ Comprueba que tu navegador sea compatible (Chrome, Firefox, Edge, Safari modernos)

### Sin sonido
- ✅ Los navegadores modernos requieren interacción del usuario para audio
- ✅ Haz click en la pantalla antes de que empiecen los sonidos
- ✅ Verifica que el volumen del navegador no esté silenciado

### Rendimiento lento
- ✅ Cierra otras pestañas del navegador
- ✅ El juego está optimizado para Chrome/Firefox modernos
- ✅ Verifica que no tengas muchas extensiones ejecutándose

### Problemas en móviles
- ✅ Usa Chrome o Safari en dispositivos móviles
- ✅ Asegúrate de que JavaScript esté habilitado
- ✅ Intenta en modo horizontal para mejor experiencia

## 🚀 Futuras Mejoras

### Próximas Características
- [ ] Más tipos de enemigos (serpientes, arañas, etc.)
- [ ] Sistema de vidas múltiples
- [ ] Power-ups con efectos visuales mejorados
- [ ] Múltiples niveles con diferentes fondos
- [ ] Tabla de puntuaciones online
- [ ] Sprites personalizados en lugar de emojis
- [ ] Música de fondo opcional
- [ ] Modo cooperativo local
- [ ] Logros y desafíos

### Mejoras Técnicas
- [ ] Service Worker para juego offline
- [ ] Progressive Web App (PWA)
- [ ] WebGL para mejores gráficos
- [ ] Optimización para dispositivos de gama baja
- [ ] Soporte para gamepads

## 📊 Estadísticas del Proyecto

- **Líneas de código**: ~1,200
- **Archivos**: 8 principales
- **Tamaño**: ~50 KB total
- **Navegadores soportados**: Chrome 60+, Firefox 55+, Safari 11+, Edge 79+
- **Rendimiento**: 60 FPS en dispositivos modernos

## 🤝 Contribuir

### Reportar Bugs
1. Abre un issue describiendo el problema
2. Incluye información del navegador y sistema operativo
3. Adjunta capturas de pantalla si es posible
4. Proporciona pasos para reproducir el bug

### Sugerir Mejoras
1. Revisa las futuras mejoras planificadas
2. Crea un issue con tu sugerencia
3. Explica el beneficio para los jugadores
4. Propón una implementación si es posible

### Desarrollar
1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crea un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Puedes:
- ✅ Usar comercialmente
- ✅ Modificar el código
- ✅ Distribuir copias
- ✅ Uso privado
- ❌ Sin garantía

## 👥 Créditos

- **Desarrollo**: Chema
- **Inspiración**: Chrome Dino Game
- **Fuente**: Press Start 2P (Google Fonts)
- **Emojis**: Unicode Consortium
- **Audio**: Web Audio API

## 📞 Contacto

- **GitHub**: [Dovaskul](https://github.com/Dovaskul)
- **Proyecto**: [Champirug Repository](https://github.com/Dovaskul/champirug)

---

**¡Disfruta saltando con el champiñón! 🍄🎮**

*¿Podrás sobrevivir y conseguir el high score? ¡Demuéstralo!*