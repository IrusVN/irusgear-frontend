<template>
  <div class="home-page pb-4 bg-light">
    <HomeHero />

    <div class="container-xl px-3 py-4">
      <HomeProdSection section-key="device" />

      <HomeAccessoryGrid />

      <HomeProdSection section-key="laptop" />

      <HomeProdSection section-key="watchAudio" :desktop-product-rows="1" />

      <HomeProdSection section-key="tv" :desktop-product-rows="1" />

      <HomeProdSection section-key="homeLife" :desktop-product-rows="1" />

      <HomeProdSection section-key="cooling" :desktop-product-rows="1" />

      <HomeUsedGoodsGrid />

      <!-- <HomeNews /> -->
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useHead, useI18n } from "#imports";
import { useHomeSectionsStore } from "~/stores/homeSectionsStore";

definePageMeta({ layout: "default" });

const { t } = useI18n();
useHead({ title: computed(() => t("page_titles.home")) });

const homeSectionsStore = useHomeSectionsStore();

onMounted(() => {
  homeSectionsStore.initHomeSections();
});

</script>

<style scoped>
</style>
