<template>
  <div>
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
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useHead, useI18n } from "#imports";
import { useHomeSectionsStore } from "~/stores/homeSectionsStore";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";

definePageMeta({ layout: "default" });

const HOME_LOGO_LOADING_KEY = "home-auth-bootstrap";
const HOME_LOGO_LOADING_PROPS = Object.freeze({
  delay: 0,
  minVisible: 600,
  overlayBackground: "hsla(0, 0%, 100%, .6) 50% no-repeat",
  ariaLabel: "Dang tai trang chu",
});

const { t } = useI18n();
useHead({ title: computed(() => t("page_titles.home")) });

const homeSectionsStore = useHomeSectionsStore();
const authStore = useAuthStore();
const uiStore = useUiStore();
const { sessionResolved, sessionLoading } = storeToRefs(authStore);
const shouldShowHomeEntryLoader = computed(
  () => sessionLoading.value && !sessionResolved.value,
);

watch(
  shouldShowHomeEntryLoader,
  (shouldShow) => {
    if (shouldShow) {
      uiStore.showLogoLoading(HOME_LOGO_LOADING_KEY, HOME_LOGO_LOADING_PROPS);
      return;
    }

    uiStore.hideLogoLoading(HOME_LOGO_LOADING_KEY);
  },
  { immediate: true },
);

onMounted(() => {
  homeSectionsStore.initHomeSections().catch(() => {});
});

onBeforeUnmount(() => {
  uiStore.hideLogoLoading(HOME_LOGO_LOADING_KEY);
});

</script>

<style scoped>
</style>
