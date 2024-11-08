import { defineStore } from "pinia";

export const useChallengeStore = defineStore("challenge", {
  state: () => ({
    totalStars: 0,
    lastChallengeStars: 0,
    correctAnswers: 0,
    difficulty: "easy",
    totalQuestions: 5,
    starHistory: [], // Array of {stars: number, timestamp: Date} objects
  }),

  getters: {
    weeklyStars: (state) => {
      const now = new Date();
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay())); // Start of current week (Sunday)
      weekStart.setHours(0, 0, 0, 0);

      return state.starHistory
        .filter((record) => new Date(record.timestamp) >= weekStart)
        .reduce((total, record) => total + record.stars, 0);
    },

    dailyStars: (state) => {
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const now = new Date();
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay())); // Start of current week (Sunday)
      weekStart.setHours(0, 0, 0, 0);

      // Initialize daily totals
      const dailyTotals = days.reduce((acc, day) => {
        acc[day] = 0;
        return acc;
      }, {});

      // Sum stars for each day
      state.starHistory
        .filter((record) => new Date(record.timestamp) >= weekStart)
        .forEach((record) => {
          const day = days[new Date(record.timestamp).getDay()];
          dailyTotals[day] += record.stars;
        });

      return dailyTotals;
    },
  },

  actions: {
    updateStars(stars) {
      this.lastChallengeStars = stars;
      this.totalStars += stars;
      this.starHistory.push({
        stars,
        timestamp: new Date().toISOString(),
      });
      // Save to localStorage
      this.saveToStorage();
    },

    incrementCorrectAnswers() {
      this.correctAnswers++;
    },

    setDifficulty(difficulty) {
      this.difficulty = difficulty;
    },

    setTotalQuestions(total) {
      this.totalQuestions = total;
    },

    resetChallenge() {
      this.correctAnswers = 0;
    },

    // Load state from localStorage
    loadFromStorage() {
      const stored = localStorage.getItem("starcade-progress");
      if (stored) {
        const data = JSON.parse(stored);
        this.totalStars = data.totalStars;
        this.starHistory = data.starHistory;
      }
    },

    // Save state to localStorage
    saveToStorage() {
      localStorage.setItem(
        "starcade-progress",
        JSON.stringify({
          totalStars: this.totalStars,
          starHistory: this.starHistory,
        })
      );
    },
  },
});
