import { onUnmounted, unref, watchEffect } from "vue";
import { useBreadcrumbStore } from "@/stores/breadcrumbStore";

export const useBreadcrumb = (trailSource, options = {}) => {
  const breadcrumbStore = useBreadcrumbStore();

  const resolveSource = () => {
    if (typeof trailSource === "function") return trailSource();
    return unref(trailSource);
  };

  const applyTrail = () => {
    const value = resolveSource();
    if (Array.isArray(value) && value.length) {
      breadcrumbStore.setTrail(value, options);
      return;
    }
    breadcrumbStore.clearTrail();
  };

  watchEffect(() => {
    applyTrail();
  });

  onUnmounted(() => {
    if (!options.persistOnUnmount) {
      breadcrumbStore.clearTrail();
    }
  });

  return {
    setTrail: breadcrumbStore.setTrail,
    setFromApiTrail: breadcrumbStore.setFromApiTrail,
    clearTrail: breadcrumbStore.clearTrail,
  };
};
