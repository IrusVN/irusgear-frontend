import { defineStore } from "pinia";
import { ref } from "vue";
import { useRuntimeConfig } from "#imports";

export const useHomeStore = defineStore("home", () => {
  const config = useRuntimeConfig();

  const megaMenuSections = ref([]);
  const activeMegaMenuKey = ref("");
  const megaMenuLoading = ref(false);
  const megaMenuLoaded = ref(false);
  const megaMenuError = ref(null);

  let megaMenuPromise = null;

  const setActiveMegaMenuKey = (key) => {
    if (!key) return;
    activeMegaMenuKey.value = key;
  };

  const fetchMegaMenu = async ({ force = false } = {}) => {
    if (megaMenuLoading.value && megaMenuPromise) {
      return megaMenuPromise;
    }

    if (megaMenuLoaded.value && !force) {
      return megaMenuSections.value;
    }

    megaMenuLoading.value = true;
    megaMenuError.value = null;

    megaMenuPromise = (async () => {
      try {
        const res = await fetch(`${config.public.apiBaseUrl}/collections/mega-menu`);
        if (!res.ok) throw new Error("Fetch mega menu failed");

        const json = await res.json();
        const sections = json?.data?.sections || json?.sections || [];

        megaMenuSections.value = Array.isArray(sections) ? sections : [];
        if (!activeMegaMenuKey.value || !megaMenuSections.value.some((section) => section.key === activeMegaMenuKey.value)) {
          activeMegaMenuKey.value = megaMenuSections.value[0]?.key || "";
        }

        megaMenuLoaded.value = true;
        return megaMenuSections.value;
      } catch (error) {
        megaMenuError.value = error instanceof Error ? error.message : "Fetch mega menu failed";
        throw error;
      } finally {
        megaMenuLoading.value = false;
        megaMenuPromise = null;
      }
    })();

    return megaMenuPromise;
  };

  const resetMegaMenu = () => {
    megaMenuSections.value = [];
    activeMegaMenuKey.value = "";
    megaMenuLoading.value = false;
    megaMenuLoaded.value = false;
    megaMenuError.value = null;
    megaMenuPromise = null;
  };

  return {
    megaMenuSections,
    activeMegaMenuKey,
    megaMenuLoading,
    megaMenuLoaded,
    megaMenuError,
    setActiveMegaMenuKey,
    fetchMegaMenu,
    resetMegaMenu,
  };
});
