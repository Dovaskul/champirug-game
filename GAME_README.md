# 🍄 Champirug Game

**A fun HTML5 mushroom jumping game with custom sprites and dynamic sizing!**

![Game Screenshot](https://img.shields.io/badge/Game-HTML5-orange) ![Version](https://img.shields.io/badge/Version-2.1-blue) ![Status](https://img.shields.io/badge/Status-Playable-green)

## 🎮 Play Online
**🌐 [Play Champirug Now!](https://dovaskul.github.io/champirug-game/)**

## 🎯 Game Features

### 🕹️ Gameplay
- **🍄 Controllable Mushroom**: Move with arrow keys
- **🐻 Avoid Bears**: Dynamic enemy spawning  
- **🪙 Collect Coins**: Enhanced sound effects
- **🏆 Leaderboard**: Local high scores system
- **🎵 Background Music**: "Pixel Chaos" soundtrack

### 🎨 Visual & Audio
- **Custom Sprites**: High-quality PNG artwork
- **Dynamic Sizing**: Responsive to screen resolution
- **8-bit Style**: Retro gaming aesthetic
- **Web Audio API**: Professional sound system
- **Multi-harmonic Effects**: Realistic coin sounds

### 📱 Technical Features
- **Fully Responsive**: Works on desktop, tablet, mobile
- **No Dependencies**: Pure HTML5/CSS3/JavaScript
- **Offline Capable**: Once loaded, works without internet
- **Cross-Browser**: Chrome, Firefox, Safari, Edge
- **Progressive Enhancement**: Graceful fallbacks

## 🎮 Controls
- **⬆️ Up Arrow**: Move up
- **⬇️ Down Arrow**: Move down  
- **⬅️ Left Arrow**: Move left
- **➡️ Right Arrow**: Move right
- **Space**: Start/Restart game
- **🔊 Music Button**: Toggle audio

## 🛠️ Technical Stack
- **HTML5**: Game structure and canvas
- **CSS3**: Responsive design with viewport units
- **Vanilla JavaScript**: Game logic and physics
- **Web Audio API**: Sound effects and music
- **LocalStorage**: High scores persistence

## 📁 Project Structure
```
champirug-game/
├── index.html              # Main game file
├── champirug_v2.1.html     # Named version
├── sprites/
│   ├── champi1.png         # Custom mushroom sprite
│   └── bear1.png           # Custom bear sprite
├── sounds/
│   └── Pixel Chaos.mp3     # Background music
└── docs/
    ├── README_v2.1.md      # Detailed changelog
    └── GITHUB_PAGES_GUIDE.md
```

## 🚀 Development

### Local Development
```bash
# Clone the repository
git clone https://github.com/Dovaskul/champirug-game.git
cd champirug-game

# Start local server
python -m http.server 9000

# Open in browser
http://localhost:9000
```

### Version History
- **v2.1**: Custom sprites with dynamic sizing
- **v2.0**: English translation + enhanced audio
- **v1.0**: Original Spanish version with emojis

## 🎯 Game Mechanics

### Scoring System
- **Survival Time**: +10 points per second
- **Coin Collection**: +100 points per coin
- **High Scores**: Top 10 saved locally

### Dynamic Difficulty
- **Enemy Speed**: Increases over time
- **Spawn Rate**: More frequent enemies
- **Score Multiplier**: Bonus for longer survival

## 🌟 Highlights
- **Viewport-Based Sizing**: `min(8vw, 8vh, 80px)` for perfect scaling
- **Professional Sprites**: Custom artwork replacing emojis
- **Real-time Adaptation**: Resizes instantly on window changes
- **Performance Optimized**: 60fps gameplay
- **Accessibility**: Keyboard-only controls

## 🤝 Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License
This project is open source and available under the [MIT License](LICENSE).

## 🎮 Created By
**Dovaskul** - [GitHub Profile](https://github.com/Dovaskul)

---
**🍄 Have fun playing Champirug! 🎮**