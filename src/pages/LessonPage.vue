<template>
  <q-page class="flex lesson-page-container">
    <div class="content-wrapper q-pt-xl">
      <template v-if="!showSummary">
        <h2 class="text-h4 q-mb-md">Math Challenge</h2>
        <q-linear-progress
          :value="currentQuestion / totalQuestions"
          class="q-mb-md"
          rounded
          size="20px"
          color="purple"
        >
          <div class="absolute-full flex flex-center">
            <q-badge
              color="white"
              text-color="black"
              :label="`${currentQuestion} of ${totalQuestions}`"
            />
          </div>
        </q-linear-progress>
        <div class="question-container q-mb-md">
          <p class="text-h5">{{ currentMathQuestion }}</p>
        </div>
        <q-input
          v-model.number="userAnswer"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          filled
          label="Your answer"
          class="q-mb-md answer-input"
          ref="answerInput"
          @keyup.enter="checkAnswer"
        />
        <q-btn
          :label="currentQuestion === totalQuestions ? 'Finish' : 'Check'"
          color="primary"
          @click="checkAnswer"
          class="go-btn q-mb-md"
          :disable="isProcessing || !isInputValid"
        />
        <q-icon
          v-if="answerIcon"
          :name="answerIcon"
          size="40px"
          :color="answerIcon === 'check_circle' ? 'positive' : 'negative'"
        />
      </template>
      <template v-else>
        <h2 class="text-h4 q-mb-md">Challenge Complete!</h2>
        <div class="summary-container q-pa-md">
          <p class="text-h6">Correct Answers: {{ correctAnswers }}</p>
          <p class="text-h6">
            Incorrect Answers: {{ totalQuestions - correctAnswers }}
          </p>
          <div class="stars-container q-mt-md">
            <q-icon
              v-for="star in starsEarned"
              :key="star"
              name="star"
              size="40px"
              color="yellow"
            />
          </div>
          <p class="text-h6 q-mt-md">
            Stars Earned: {{ starsEarned }}
          </p>
          <p class="text-h6">
            Bonus Stars: {{ starsEarned - (starsEarned > 3 ? 3 : starsEarned) }}
          </p>
          <p class="text-h6">
            Total Stars: {{ challengeStore.totalStars }}
          </p>
        </div>
        <q-btn
          label="Back to Dashboard"
          color="primary"
          @click="router.push('/')"
          class="go-btn q-mt-lg"
        />
      </template>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useChallengeStore } from "../stores/challengeStore";
import confetti from 'canvas-confetti';

defineOptions({
  name: "LessonPage",
});

const router = useRouter();
const route = useRoute();
const challengeStore = useChallengeStore();
const answerInput = ref(null);
const totalQuestions = 5;
const currentQuestion = ref(1);
const userAnswer = ref(null);
const answerIcon = ref(null);
const isProcessing = ref(false);
const correctAnswers = ref(0);
const showSummary = ref(false);
const difficulty = ref(route.query.difficulty || 'easy');

const isInputValid = computed(() => {
  return userAnswer.value !== null && userAnswer.value !== "";
});

const starsEarned = computed(() => {
  const percentage = (correctAnswers.value / totalQuestions) * 100;
  let baseStars = 1;
  if (percentage >= 90) baseStars = 3;
  else if (percentage >= 70) baseStars = 2;

  // Add bonus stars based on difficulty
  const bonusStars = difficulty.value === 'easy' ? 1 : difficulty.value === 'hard' ? 2 : 3;
  return baseStars + bonusStars;
});

const generateMathQuestion = () => {
  let num1, num2, operation;

  switch (difficulty.value) {
    case 'easy':
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      operation = '+';
      break;
    case 'hard':
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
      operation = '+';
      break;
    case 'epic':
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
      operation = Math.random() < 0.5 ? '+' : '-';
      if (operation === '-' && num1 < num2) {
        [num1, num2] = [num2, num1]; // Swap to ensure positive result
      }
      break;
  }

  return `${num1} ${operation} ${num2}`;
};

const currentMathQuestion = ref(generateMathQuestion());

const focusInput = () => {
  nextTick(() => {
    answerInput.value.focus();
  });
};

onMounted(() => {
  focusInput();
});

const checkAnswer = () => {
  if (isProcessing.value) return;

  isProcessing.value = true;
  const correctAnswer = eval(currentMathQuestion.value);
  if (userAnswer.value === correctAnswer) {
    answerIcon.value = "check_circle";
    correctAnswers.value++;
  } else {
    answerIcon.value = "cancel";
  }

  setTimeout(() => {
    if (currentQuestion.value < totalQuestions) {
      currentQuestion.value++;
      currentMathQuestion.value = generateMathQuestion();
      userAnswer.value = null;
      answerIcon.value = null;
      focusInput();
    } else {
      // Show summary
      showSummary.value = true;
      challengeStore.updateStars(starsEarned.value);
      triggerConfetti();
    }
    isProcessing.value = false;
  }, 1000);
};

const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
};
</script>

<style lang="scss" scoped>
.lesson-page-container {
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

.question-container {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
}

.answer-input {
  width: 100%;
  font-size: 1.5rem;

  :deep(.q-field__native) {
    padding: 12px;
  }

  :deep(.q-field__label) {
    font-size: 1rem;
    top: 12px;
  }

  :deep(.q-field__control) {
    height: 56px;
  }
}

.go-btn {
  font-size: 1.2rem;
  padding: 12px 24px;
}

.summary-container {
  background-color: #f0f0f0;
  border-radius: 10px;
  width: 100%;
}

.stars-container {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
