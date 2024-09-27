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
          <div class="row items-center">
            <div class="col-6 text-right q-pr-sm">
              <p class="text-h5 q-mb-none">{{ currentMathQuestion }} =</p>
            </div>
            <div class="col-6 text-left q-pl-sm">
              <q-input
                v-model.number="userAnswer"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                filled
                dense
                class="answer-input"
                ref="answerInput"
                @keyup.enter="checkAnswer"
              />
            </div>
          </div>
          <div class="row items-center justify-center q-mt-sm">
            <div class="button-icon-wrapper">
              <q-btn
                :label="currentQuestion === totalQuestions ? 'Finish' : 'Check'"
                color="primary"
                @click="checkAnswer"
                class="go-btn"
                :disable="isProcessing || !isInputValid"
              />
              <q-icon
                v-if="answerIcon"
                :name="answerIcon"
                size="24px"
                :color="answerIcon === 'check_circle' ? 'positive' : 'negative'"
                class="answer-icon"
              />
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <h2 class="text-h4 q-mb-md">Challenge Complete!</h2>
        <div class="summary-container q-pa-md">
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
            <q-icon
              name="sentiment_very_dissatisfied"
              size="60px"
              color="grey"
            />
          </div>
          <div v-if="bonusStar" class="bonus-star q-mt-md">
            <q-icon name="star" size="40px" color="purple" />
            <span class="text-h6 q-ml-sm">Bonus Star for 100% Completion!</span>
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
      </template>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useChallengeStore } from "../stores/challengeStore";
import confetti from "canvas-confetti";

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
const difficulty = ref(route.query.difficulty || "easy");

const isInputValid = computed(() => {
  return userAnswer.value !== null && userAnswer.value !== "";
});

const baseStars = computed(() => {
  if (correctAnswers.value === 0) return 0;
  if (difficulty.value === "easy") return 1;
  if (difficulty.value === "hard") return 2;
  return 3;
});

const bonusStar = computed(() => {
  return correctAnswers.value === totalQuestions;
});

const totalStars = computed(() => {
  return baseStars.value + (bonusStar.value ? 1 : 0);
});

const generateMathQuestion = () => {
  let num1, num2, operation;

  switch (difficulty.value) {
    case "easy":
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      operation = "+";
      break;
    case "hard":
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
      operation = "+";
      break;
    case "epic":
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
      operation = Math.random() < 0.5 ? "+" : "-";
      if (operation === "-" && num1 < num2) {
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
  if (isProcessing.value || !isInputValid.value) return;

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
      challengeStore.updateStars(totalStars.value);
      triggerConfetti();
    }
    isProcessing.value = false;
  }, 1000);
};

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
  currentQuestion.value = 1;
  correctAnswers.value = 0;
  showSummary.value = false;
  currentMathQuestion.value = generateMathQuestion();
  userAnswer.value = null;
  answerIcon.value = null;
  focusInput();
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
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 10px;
  width: 100%;
}

.answer-input {
  width: 100%;
  max-width: 120px;
  font-size: 1.2rem;

  :deep(.q-field__native) {
    padding: 4px 8px;
  }

  :deep(.q-field__control) {
    height: 36px;
    background-color: #ffffff;
  }
}

.button-icon-wrapper {
  position: relative;
  display: inline-block;
  width: 120px; /* Adjust this value based on your button's width */
}

.go-btn {
  font-size: 1rem;
  padding: 0 16px;
  height: 36px;
  width: 100%;
}

.answer-icon {
  position: absolute;
  right: -40px;
  top: 50%;
  transform: translateY(-50%);
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
</style>
