<template>
  <transition
    appear
    enter-active-class="animated slideInLeft"
    leave-active-class="animated slideOutRight"
  >
    <q-page class="flex flex-center lesson-page-container">
      <div class="content-wrapper">
        <h2 class="text-h4 q-mb-md">Math Puzzle</h2>
        <q-linear-progress
          :value="currentQuestion / totalQuestions"
          class="q-mb-md"
          rounded
          size="20px"
          :color="progressColor"
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
          type="number"
          filled
          label="Your answer"
          class="q-mb-md"
        />
        <q-btn
          :label="currentQuestion === totalQuestions ? 'Finish' : 'Go'"
          color="primary"
          @click="checkAnswer"
          :icon-right="answerIcon"
        />
      </div>
    </q-page>
  </transition>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

defineOptions({
  name: "LessonPage",
});

const router = useRouter();
const totalQuestions = 10;
const currentQuestion = ref(1);
const userAnswer = ref(null);
const answerIcon = ref(null);

const progressColor = computed(() => {
  const progress = currentQuestion.value / totalQuestions;
  if (progress < 0.33) return "red";
  if (progress < 0.66) return "orange";
  return "green";
});

const generateMathQuestion = () => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operation = Math.random() < 0.5 ? "+" : "-";
  return `${num1} ${operation} ${num2}`;
};

const currentMathQuestion = ref(generateMathQuestion());

const checkAnswer = () => {
  const correctAnswer = eval(currentMathQuestion.value);
  if (userAnswer.value === correctAnswer) {
    answerIcon.value = "check_circle";
  } else {
    answerIcon.value = "cancel";
  }

  setTimeout(() => {
    if (currentQuestion.value < totalQuestions) {
      currentQuestion.value++;
      currentMathQuestion.value = generateMathQuestion();
      userAnswer.value = null;
      answerIcon.value = null;
    } else {
      // Lesson completed, navigate back to dashboard
      router.push("/");
    }
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
}

.question-container {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
}
</style>
