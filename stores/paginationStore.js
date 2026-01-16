// stores/paginationStore.js
import { defineStore } from "pinia";
import { ref } from "vue";

export const usePaginationStore = defineStore("pagination", () => {
  const page = ref(1);
  const limit = ref(12);
  const total = ref(0);
  const pages = ref(1);

  const setPagination = (meta) => {
    total.value = meta.total;
    pages.value = meta.pages;
  };

  const reset = () => {
    page.value = 1;
    total.value = 0;
    pages.value = 1;
  };

  return {
    page,
    limit,
    total,
    pages,
    setPagination,
    reset,
  };
});
