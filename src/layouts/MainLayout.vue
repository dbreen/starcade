<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          class="hidden"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>Starcade</q-toolbar-title>

        <div class="star-count">
          <q-icon
            name="star"
            :color="challengeStore.totalStars > 0 ? 'yellow' : 'grey'"
            size="24px"
          />
          <span class="q-ml-sm">x {{ challengeStore.totalStars }}</span>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item-label header> Menu </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { useChallengeStore } from "../stores/challengeStore";

defineOptions({
  name: "MainLayout",
});

const challengeStore = useChallengeStore();

const linksList = [
  {
    title: "Home",
    caption: "Main page",
    icon: "school",
    link: "/",
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style lang="scss" scoped>
.star-count {
  display: flex;
  align-items: center;
  font-size: 18px;
}
</style>
