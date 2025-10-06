# CHAMPIRUG v2.1 - Custom Sprites Edition

## 🎨 **New Features in v2.1**

### 📱 **Dynamic Responsive Sprites**
- **Custom sprites** replacing emojis for mushroom and bear
- **Resolution-based sizing** using viewport units (vw/vh)
- **Automatic proportions** maintained across all screen sizes
- **Min/Max limits** to ensure playability on any device

### 🖼️ **Sprite Implementation**
- **Mushroom Player**: `sprites/champi1.png`
  - Size: `min(8vw, 8vh, 80px)` with 40px minimum
  - High-quality custom artwork
  - Maintains aspect ratio perfectly
  
- **Bear Enemy**: `sprites/bear1.png` 
  - Size: `min(7vw, 7vh, 70px)` with 35px minimum
  - Professional sprite design
  - Responsive to screen changes

- **Bitcoin Coin**: Enhanced emoji with dynamic sizing
  - Size: `min(5vw, 5vh, 50px)` with 25px minimum
  - Scales proportionally with other elements

### 🔧 **Technical Improvements**
- **Real-time resize handling**: Sprites adapt instantly to window changes
- **Viewport-based calculations**: Uses vw/vh units for perfect scaling
- **Performance optimized**: CSS `background-size: contain` for crisp rendering
- **Cross-device compatibility**: Works on desktop, tablet, and mobile

### 📐 **Dynamic Sizing System**
```css
/* Player sizing example */
width: min(8vw, 8vh, 80px);  /* 8% of viewport, max 80px */
height: min(8vw, 8vh, 80px);
max-width: 80px;             /* Upper limit */
min-width: 40px;             /* Lower limit */
```

### 🎮 **Enhanced Gameplay**
- **Better collision detection** with properly sized sprites
- **Improved visibility** of custom artwork
- **Consistent proportions** across all resolutions
- **Professional appearance** with custom graphics

## 📁 **File Structure**
```
champirug/
├── sprites/
│   ├── champi1.png          # Custom mushroom sprite
│   └── bear1.png            # Custom bear sprite
├── champirug_v2.1.html      # New version with custom sprites
├── champirug_v2.html        # Previous version (emoji-based)
└── sounds/
    └── Pixel Chaos.mp3      # Background music
```

## 🎯 **Responsive Design Features**

### 📱 **Mobile Devices** (< 600px)
- Player: ~32-48px (minimum ensures visibility)
- Enemy: ~28-42px (proportional to player)
- Coin: ~20-30px (collectible size)

### 💻 **Tablets** (600px - 1200px)  
- Player: ~48-64px (comfortable touch targets)
- Enemy: ~42-56px (clear threat visibility)
- Coin: ~30-40px (easy collection)

### 🖥️ **Desktop** (> 1200px)
- Player: ~64-80px (maximum detail)
- Enemy: ~56-70px (full sprite clarity)
- Coin: ~40-50px (perfect balance)

## 🚀 **How to Test v2.1**

1. **Open**: http://localhost:9000/champirug_v2.1.html
2. **Resize window** to see dynamic scaling in action
3. **Try different devices** or browser zoom levels
4. **Compare** with v2.0 to see sprite quality difference

## ✨ **Visual Improvements**
- **High-resolution sprites** replace pixelated emojis
- **Consistent art style** throughout the game
- **Better contrast** against background
- **Professional game appearance**
- **Smooth scaling** without pixelation

## 🔄 **Backward Compatibility**
- All v2.0 features maintained
- English interface preserved
- Enhanced audio system included
- Leaderboard functionality intact
- Background music integration working

**🌐 Play the enhanced version**: http://localhost:9000/champirug_v2.1.html