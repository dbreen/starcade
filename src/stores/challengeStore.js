import { defineStore } from 'pinia'

export const useChallengeStore = defineStore('challenge', {
  state: () => ({
    totalStars: 0,
    lastChallengeStars: 0,
    correctAnswers: 0,
    difficulty: 'easy',
    totalQuestions: 5
  }),
  actions: {
    updateStars(stars) {
      this.lastChallengeStars = stars
      this.totalStars += stars
    },
    incrementCorrectAnswers() {
      this.correctAnswers++
    },
    setDifficulty(difficulty) {
      this.difficulty = difficulty
    },
    setTotalQuestions(total) {
      this.totalQuestions = total
    },
    resetChallenge() {
      this.correctAnswers = 0
    }
  }
})
