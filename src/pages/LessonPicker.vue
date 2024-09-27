<template>
  <transition
    appear
    enter-active-class="animated slideInLeft"
    leave-active-class="animated slideOutRight"
  >
    <q-page class="flex flex-center lesson-picker-container">
      <div class="content-wrapper">
        <h2 class="text-h4 q-mb-md">Choose Your Difficulty</h2>
        <div class="difficulty-buttons">
          <q-btn
            v-for="difficulty in difficulties"
            :key="difficulty.level"
            :label="difficulty.label"
            :color="difficulty.color"
            class="difficulty-button q-ma-sm"
            rounded
            size="lg"
            @click="selectDifficulty(difficulty.level)"
          />
        </div>
      </div>
    </q-page>
  </transition>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

defineOptions({
  name: "LessonPicker",
});

const router = useRouter();

const difficulties = ref([
  { level: "easy", label: "Easy (1-10)", color: "positive" },
  { level: "hard", label: "Hard (1-20)", color: "warning" },
  { level: "epic", label: "Epic (1-20, +/-)", color: "negative" },
]);

const selectDifficulty = (level) => {
  console.log(`Selected difficulty: ${level}`);
  // Navigate to the LessonPage
  router.push({ path: "/lesson", query: { difficulty: level } });
};
</script>

<style lang="scss" scoped>
.lesson-picker-container {
  min-height: 100vh;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.difficulty-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.difficulty-button {
  width: 200px;
  font-size: 1.2rem;
}
</style>
