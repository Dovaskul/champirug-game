# Champirug v3.0 - Online Leaderboard Update

## 🔥 New Features in v3.0:

### 🌐 Online Leaderboard System
- **Firebase Realtime Database integration**
- **Global scoreboard** - compete with players worldwide
- **Real-time updates** - see other players' scores instantly
- **Player names** - personalized leaderboard entries
- **Hybrid system** - combines local and online scores

### 🏆 Enhanced Leaderboard Features
- **Visual indicators**: 🌐 shows online scores vs local scores
- **Player registration** - enter your name for global competition
- **Automatic synchronization** with online database
- **Persistent player names** - remembers your identity
- **Top 10 global rankings**

### 🔧 Technical Improvements
- **Firebase Realtime Database** configuration
- **Async/await** pattern for better data handling
- **Error handling** for offline scenarios
- **Fallback to local storage** when offline
- **Clean UI indicators** for online/offline status

## 🚀 How Online Leaderboard Works:

1. **First Play**: Game asks for your name
2. **Score Submission**: Automatically saves to global database
3. **Live Updates**: See global top scores in real-time
4. **Offline Support**: Falls back to local scores if Firebase unavailable

## 📁 New Files:
- `js/firebase-config.js` - Firebase configuration and leaderboard management
- `champirug_v3.html` - Complete v3.0 with online features

## 🌐 Firebase Setup Required:
- Create Firebase project at https://console.firebase.google.com
- Enable Realtime Database in test mode
- Update `databaseURL` in firebase-config.js

## 🎮 Play Online:
Visit: https://dovaskul.github.io/champirug-game/

---
*Now you can compete with players around the world! 🌍*