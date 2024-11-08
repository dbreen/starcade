<template>
  <q-page class="flex flex-center dashboard-container">
    <div class="content-wrapper">
      <img
        alt="Starcade logo"
        src="~assets/starcade-nobg.png"
        style="width: 200px; height: 200px"
      />

      <!-- Weekly Progress Card -->
      <q-card class="progress-card">
        <q-card-section>
          <div class="text-h6 text-center q-mb-md">
            Weekly Progress: {{ weeklyStars }} ⭐
          </div>

          <div class="daily-progress">
            <div v-for="(stars, day) in dailyStars" :key="day" class="day-item">
              <div class="day-label">{{ day.slice(0, 3) }}</div>
              <q-circular-progress
                :value="stars * 10"
                size="50px"
                :thickness="0.2"
                color="primary"
                track-color="grey-3"
                class="q-ma-sm"
                show-value
              >
                {{ stars }}
              </q-circular-progress>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-btn
        class="glossy play-button"
        rounded
        color="primary"
        label="Play"
        size="lg"
        @click="goToLessonPicker"
      />
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useChallengeStore } from "src/stores/challengeStore";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";

defineOptions({
  name: "DashboardPage",
});

const router = useRouter();
const challengeStore = useChallengeStore();
const { weeklyStars, dailyStars } = storeToRefs(challengeStore);

onMounted(() => {
  challengeStore.loadFromStorage();
});

const goToLessonPicker = () => {
  router.push("/lesson-picker");
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  min-height: 100vh;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 1rem;
}

.progress-card {
  width: 100%;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.9);
}

.daily-progress {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 1rem;
}

.day-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.day-label {
  font-weight: bold;
  color: #666;
}

.play-button {
  font-size: 1.5rem;
  padding: 0.5rem 2rem;
}
</style>
