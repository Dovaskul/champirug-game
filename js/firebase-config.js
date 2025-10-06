// Firebase Configuration for Champirug Leaderboard
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, push, set, get, orderByValue, limitToLast, query } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyRpfHUh1cAlJiul5W9BtiGkqihl1D_j0",
  authDomain: "champi-22efb.firebaseapp.com",
  projectId: "champi-22efb",
  storageBucket: "champi-22efb.firebasestorage.app",
  messagingSenderId: "263144232269",
  appId: "1:263144232269:web:1a9874d93a667a1f279304",
  measurementId: "G-208QEHZJTZ",
  databaseURL: "https://champi-22efb-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Leaderboard Manager Class
class FirebaseLeaderboard {
  constructor() {
    this.leaderboardRef = ref(database, 'leaderboard');
  }

  // Save a new score
  async saveScore(playerName, score) {
    try {
      const scoreData = {
        name: playerName,
        score: score,
        timestamp: Date.now(),
        date: new Date().toLocaleString()
      };
      
      await push(this.leaderboardRef, scoreData);
      console.log('Score saved successfully!');
      return true;
    } catch (error) {
      console.error('Error saving score:', error);
      return false;
    }
  }

  // Get top scores
  async getTopScores(limit = 10) {
    try {
      const topScoresQuery = query(
        this.leaderboardRef,
        orderByValue(),
        limitToLast(limit)
      );
      
      const snapshot = await get(topScoresQuery);
      
      if (snapshot.exists()) {
        const scores = [];
        snapshot.forEach((childSnapshot) => {
          scores.push(childSnapshot.val());
        });
        
        // Sort by score descending
        return scores
          .sort((a, b) => b.score - a.score)
          .slice(0, limit);
      }
      
      return [];
    } catch (error) {
      console.error('Error getting scores:', error);
      return [];
    }
  }

  // Get player's best score
  async getPlayerBest(playerName) {
    try {
      const snapshot = await get(this.leaderboardRef);
      
      if (snapshot.exists()) {
        let bestScore = 0;
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          if (data.name === playerName && data.score > bestScore) {
            bestScore = data.score;
          }
        });
        return bestScore;
      }
      
      return 0;
    } catch (error) {
      console.error('Error getting player best:', error);
      return 0;
    }
  }
}

// Export for use in the game
window.FirebaseLeaderboard = FirebaseLeaderboard;