<template>
  <q-page class="lesson-picker-container q-pa-md">
    <q-card class="content-wrapper q-pa-lg">
      <div class="challenge-type q-mb-lg">
        <h2 class="text-h5">Choose Challenge:</h2>

        <q-separator />

        <h3 class="text-h5 q-mb-sm">Challenge Type</h3>
        <q-option-group
          v-model="selectedType"
          :options="challengeTypes"
          color="primary"
        >
          <template v-slot:label="opt">
            <div class="flex items-center">
              <q-icon
                v-if="opt.icon"
                :name="opt.icon"
                size="2rem"
                class="q-mr-sm"
              />
              {{ opt.label }}
            </div>
          </template>
        </q-option-group>
      </div>

      <q-separator />

      <div class="difficulty q-mb-lg">
        <h3 class="text-h5 q-mb-sm">Difficulty</h3>
        <q-option-group v-model="selectedDifficulty" :options="difficulties">
          <template v-slot:label="opt">
            <q-chip :color="opt.color" text-color="white" class="q-mr-sm">
              {{ opt.label }}
            </q-chip>
          </template>
        </q-option-group>
      </div>

      <q-btn
        label="Begin!"
        color="primary"
        class="begin-button q-mt-md"
        rounded
        size="lg"
        :disable="!isSelectionComplete"
        @click="beginChallenge"
      />
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

defineOptions({
  name: "LessonPicker",
});

const router = useRouter();

const challengeTypes = [
  { label: "Math Problems", value: "math", icon: "calculate" },
  { label: "Word Problems", value: "word", icon: "text_fields" },
  { label: "Word Scramble", value: "scramble", icon: "shuffle" },
];

const difficulties = [
  { label: "Easy", value: "easy", color: "positive" },
  { label: "Hard", value: "hard", color: "warning" },
  { label: "Epic", value: "epic", color: "negative" },
];

const selectedType = ref(null);
const selectedDifficulty = ref(null);

const isSelectionComplete = computed(() => {
  return selectedType.value && selectedDifficulty.value;
});

const beginChallenge = () => {
  console.log(
    `Selected type: ${selectedType.value}, difficulty: ${selectedDifficulty.value}`
  );
  // Navigate to the LessonPage
  router.push({
    path: "/lesson",
    query: {
      type: selectedType.value,
      difficulty: selectedDifficulty.value,
    },
  });
};
</script>

<style lang="scss" scoped>
.lesson-picker-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 2rem;
}

.content-wrapper {
  width: 90%;
  max-width: 600px;
  text-align: center;
}

.challenge-type,
.difficulty {
  width: 100%;
}

.begin-button {
  width: 200px;
  font-size: 1.2rem;
}
</style>
