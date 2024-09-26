<template>
  <q-page class="flex flex-center dashboard-container">
    <div class="content-wrapper">
      <img
        alt="Starcade logo"
        src="~assets/starcade-nobg.png"
        style="width: 200px; height: 200px"
      />
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

defineOptions({
  name: "DashboardPage",
});

const router = useRouter();

const goToLessonPicker = () => {
  router.push("/lesson-picker");
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  min-height: 100vh; /* Ensure it covers the full viewport height */
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.play-button {
  font-size: 1.5rem;
  padding: 0.5rem 2rem;
}
</style>
