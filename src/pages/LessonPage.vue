<template>
  <q-page class="flex lesson-page-container">
    <div class="content-wrapper q-pt-xl">
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
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useChallengeStore } from "../stores/challengeStore";

const router = useRouter();
const challengeStore = useChallengeStore();
const answerInput = ref(null);
const totalQuestions = 5;
const currentQuestion = ref(1);
const userAnswer = ref(null);
const answerIcon = ref(null);
const isProcessing = ref(false);

const difficulty = computed(() => challengeStore.difficulty);

const isInputValid = computed(() => {
  return userAnswer.value !== null && userAnswer.value !== "";
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
  challengeStore.setTotalQuestions(totalQuestions);
  focusInput();
});

const checkAnswer = () => {
  if (isProcessing.value || !isInputValid.value) return;

  isProcessing.value = true;
  const correctAnswer = eval(currentMathQuestion.value);
  if (userAnswer.value === correctAnswer) {
    answerIcon.value = "check_circle";
    challengeStore.incrementCorrectAnswers();
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
      // Navigate to results page
      router.push({ name: 'ResultsPage' });
    }
    isProcessing.value = false;
  }, 1000);
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
</style>
