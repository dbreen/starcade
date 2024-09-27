import { defineStore } from 'pinia'

export const useChallengeStore = defineStore('challenge', {
  state: () => ({
    totalStars: 0,
    lastChallengeStars: 0,
  }),
  actions: {
    updateStars(stars) {
      this.lastChallengeStars = stars
      this.totalStars += stars
    },
  },
})
