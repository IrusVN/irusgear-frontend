<template>
  <div>
    <LogoLoadingOverlay v-bind="logoLoadingProps" />

    <NuxtLayout>
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import LogoLoadingOverlay from "@/components/Common/LogoLoadingOverlay.vue";
import { useUiStore } from "@/stores/uiStore";

const uiStore = useUiStore();
const { logoLoadingProps } = storeToRefs(uiStore);
</script>
