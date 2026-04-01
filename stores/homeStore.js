import { defineStore } from "pinia";
import { ref } from "vue";
import { useRuntimeConfig } from "#imports";

export const useHomeStore = defineStore("home", () => {
  const config = useRuntimeConfig();

  const megaMenuSections = ref([]);
  const megaMenuLeafByKey = ref({});
  const activeMegaMenuKey = ref("");
  const megaMenuLoading = ref(false);
  const megaMenuLoaded = ref(false);
  const megaMenuError = ref(null);

  let megaMenuPromise = null;

  const setActiveMegaMenuKey = (key) => {
    if (!key) return;
    activeMegaMenuKey.value = key;
  };

  const toLeafMapFromSections = (sections) => {
    const next = {};

    (Array.isArray(sections) ? sections : []).forEach((section) => {
      if (!section?.key) return;
      next[section.key] = {
        key: section.key,
        title: section.title,
        children: Array.isArray(section.children) ? section.children : [],
      };
    });

    return next;
  };

  const toLeafMapFromItems = (items) => {
    const rootMap = {};

    (Array.isArray(items) ? items : []).forEach((item) => {
      const rootKey = item?.root_key;
      if (!rootKey) return;

      if (!rootMap[rootKey]) {
        rootMap[rootKey] = {
          key: rootKey,
          title: item.root_title || rootKey,
          children: [],
        };
      }

      const rootNode = rootMap[rootKey];
      const groupKey = item?.group_key || "others";
      const groupTitle = item?.group_title || "Khac";

      let groupNode = rootNode.children.find((group) => group.key === groupKey);
      if (!groupNode) {
        groupNode = {
          key: groupKey,
          title: groupTitle,
          items: [],
        };
        rootNode.children.push(groupNode);
      }

      groupNode.items.push({
        type: item.type || "link",
        title: item.title || "",
        slug: item.slug || "",
        url: item.url || (item.slug ? `/${item.slug}` : ""),
        image: item.image || "",
        badge: item.badge || "",
      });
    });

    return rootMap;
  };

  const leafMapToSections = (leafMap) =>
    Object.values(leafMap || {}).map((root) => ({
      key: root.key,
      title: root.title,
      children: Array.isArray(root.children) ? root.children : [],
    }));

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
        const items = json?.data?.items || json?.items || [];

        if (Array.isArray(items) && items.length) {
          megaMenuLeafByKey.value = toLeafMapFromItems(items);
          megaMenuSections.value = leafMapToSections(megaMenuLeafByKey.value);
        } else {
          megaMenuSections.value = Array.isArray(sections) ? sections : [];
          megaMenuLeafByKey.value = toLeafMapFromSections(megaMenuSections.value);
        }

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

  const fetchMegaMenuLeaves = async ({ force = false } = {}) => {
    const sections = await fetchMegaMenu({ force });
    megaMenuLeafByKey.value = toLeafMapFromSections(sections);
    return megaMenuLeafByKey.value;
  };

  const resetMegaMenu = () => {
    megaMenuSections.value = [];
    megaMenuLeafByKey.value = {};
    activeMegaMenuKey.value = "";
    megaMenuLoading.value = false;
    megaMenuLoaded.value = false;
    megaMenuError.value = null;
    megaMenuPromise = null;
  };

  return {
    megaMenuSections,
    megaMenuLeafByKey,
    activeMegaMenuKey,
    megaMenuLoading,
    megaMenuLoaded,
    megaMenuError,
    setActiveMegaMenuKey,
    fetchMegaMenu,
    fetchMegaMenuLeaves,
    resetMegaMenu,
  };
});
