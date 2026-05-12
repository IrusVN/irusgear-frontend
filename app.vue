<template>
  <div>
    <LogoLoadingOverlay v-bind="logoLoadingProps" />

    <NuxtLayout>
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </NuxtLayout>

    <Toaster
      position="bottom-right"
      theme="light"
      :duration="3000"
    />
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";
import LogoLoadingOverlay from "@/components/Common/LogoLoadingOverlay.vue";
import { useUiStore } from "@/stores/uiStore";

const uiStore = useUiStore();
const { logoLoadingProps } = storeToRefs(uiStore);
</script>
