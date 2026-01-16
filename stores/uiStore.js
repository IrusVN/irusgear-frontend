// stores/uiStore.js
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUiStore = defineStore("ui", () => {
  const isLoading = ref(false);
  const isCreating = ref(false);
  const isUpdating = ref(false);
  const isDeleting = ref(false);

  const showLoginModal = ref(false);

  const reset = () => {
    isLoading.value = false;
    isCreating.value = false;
    isUpdating.value = false;
    isDeleting.value = false;
    showLoginModal.value = false;
  };

  return {
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    showLoginModal,
    reset,
  };
});
