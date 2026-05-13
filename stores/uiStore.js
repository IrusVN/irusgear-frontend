// stores/uiStore.js
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { registerStore } from "@/utils/storeRegistry";

const DEFAULT_LOGO_LOADING_PROPS = Object.freeze({
  theme: "dark",
  delay: 0,
  minVisible: 600,
  lockScroll: true,
  zIndex: 2000,
  overlayBackground: "transparent",
  ariaLabel: "Dang tai noi dung",
});

export const useUiStore = defineStore("ui", () => {
  const isLoading = ref(false);
  const isCreating = ref(false);
  const isUpdating = ref(false);
  const isDeleting = ref(false);
  const showLoginModal = ref(false);
  const logoLoadingStack = ref([]);

  const activeLogoLoadingEntry = computed(
    () => logoLoadingStack.value[logoLoadingStack.value.length - 1] || null,
  );
  const isLogoLoadingVisible = computed(() => Boolean(activeLogoLoadingEntry.value));
  const logoLoadingProps = computed(() => ({
    ...DEFAULT_LOGO_LOADING_PROPS,
    ...(activeLogoLoadingEntry.value?.options || {}),
    visible: isLogoLoadingVisible.value,
  }));

  const showLogoLoading = (key, options = {}) => {
    if (!key) {
      return;
    }

    logoLoadingStack.value = [
      ...logoLoadingStack.value.filter((entry) => entry.key !== key),
      {
        key,
        options: {
          ...DEFAULT_LOGO_LOADING_PROPS,
          ...options,
        },
      },
    ];
  };

  const hideLogoLoading = (key) => {
    if (!key) {
      logoLoadingStack.value = [];
      return;
    }

    logoLoadingStack.value = logoLoadingStack.value.filter((entry) => entry.key !== key);
  };

  const reset = () => {
    isLoading.value = false;
    isCreating.value = false;
    isUpdating.value = false;
    isDeleting.value = false;
    showLoginModal.value = false;
    logoLoadingStack.value = [];
  };

  registerStore({ reset });

  return {
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    showLoginModal,
    isLogoLoadingVisible,
    logoLoadingProps,
    showLogoLoading,
    hideLogoLoading,
    reset,
  };
});
