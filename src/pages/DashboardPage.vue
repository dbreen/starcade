<template>
  <q-page class="flex flex-center dashboard-container">
    <img
      alt="Starcade logo"
      src="~assets/starcade-nobg.png"
      style="width: 200px; height: 200px"
    />
    <q-btn class="glossy" rounded color="deep-orange" label="Play" />
  </q-page>
</template>

<script setup>
defineOptions({
  name: "DashboardPage",
});
</script>

<style lang="scss" scoped>
.dashboard-container {
  min-height: 100vh; /* Ensure it covers the full viewport height */
  background: radial-gradient(circle, $secondary, $primary);
}
</style>
