<template>
  <q-page class="flex results-page-container">
    <div class="content-wrapper q-pt-xl">
      <div class="summary-container q-pa-md">
        <h2 class="text-h4 q-mb-md">Challenge Complete!</h2>
        <p class="text-h6">Correct Answers: {{ correctAnswers }}</p>
        <p class="text-subtitle1">
          Difficulty:
          {{ difficulty.charAt(0).toUpperCase() + difficulty.slice(1) }}
        </p>
        <div class="stars-container q-mt-md">
          <q-icon
            v-for="star in 3"
            :key="star"
            name="star"
            size="40px"
            :color="star <= baseStars ? 'yellow' : 'grey'"
          />
        </div>
        <div v-if="correctAnswers === 0" class="sad-face-container q-mt-md">
          <q-icon name="sentiment_very_dissatisfied" size="60px" color="grey" />
        </div>
        <div v-if="bonusStar" class="bonus-star q-mt-md">
          <q-icon name="star" size="40px" color="purple" />
          <span class="text-h6 q-ml-sm">Bonus Star for 100% Correct!</span>
        </div>
        <p class="text-h6 q-mt-md">
          Stars Earned: {{ baseStars }}
          <span v-if="bonusStar" style="color: purple"> + 1 </span>
        </p>
        <p class="text-h6">Total Stars: {{ challengeStore.totalStars }}</p>
        <div class="q-mt-md">
          <q-btn
            v-if="correctAnswers === 0"
            label="Try Again"
            color="secondary"
            @click="resetChallenge"
            class="go-btn q-mb-md"
          />
          <q-btn
            label="Back to Dashboard"
            color="primary"
            @click="router.push('/')"
            class="go-btn"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useChallengeStore } from "../stores/challengeStore";
import confetti from "canvas-confetti";

const router = useRouter();
const challengeStore = useChallengeStore();

const correctAnswers = computed(() => challengeStore.correctAnswers);
const difficulty = computed(() => challengeStore.difficulty);
const totalQuestions = computed(() => challengeStore.totalQuestions);

const baseStars = computed(() => {
  if (correctAnswers.value === 0) return 0;
  if (difficulty.value === "easy") return 1;
  if (difficulty.value === "hard") return 2;
  return 3;
});

const bonusStar = computed(() => {
  return correctAnswers.value === totalQuestions.value;
});

const totalStars = computed(() => {
  return baseStars.value + (bonusStar.value ? 1 : 0);
});

onMounted(() => {
  challengeStore.updateStars(totalStars.value);
  triggerConfetti();
});

const triggerConfetti = () => {
  if (correctAnswers.value > 0) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }
};

const resetChallenge = () => {
  challengeStore.resetChallenge();
  router.push({ name: "LessonPage", query: { difficulty: difficulty.value } });
};
</script>

<style lang="scss" scoped>
.results-page-container {
  min-height: 100vh;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 80%;
  max-width: 500px;
  margin: 0 auto;
}

.summary-container {
  background-color: #f0f0f0;
  border-radius: 10px;
  width: 100%;
}

.stars-container,
.bonus-star {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.bonus-star {
  color: purple;
}

.go-btn {
  font-size: 1rem;
  padding: 0 16px;
  height: 36px;
  width: 100%;
}
</style>
