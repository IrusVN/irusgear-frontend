import { computed, ref } from "vue";
import { defineStore } from "pinia";

const defaultConfig = {
  compactUi: true,
  showOnHome: false,
  prependHome: true,
  homeLabel: "Trang chủ",
  homeTo: "/",
};

const normalizeItem = (item) => {
  if (!item || typeof item !== "object") return null;
  const label = String(item.label || item.name || "").trim();
  if (!label) return null;
  const to = item.to || item.url || null;
  return {
    label,
    to: to ? String(to) : null,
  };
};

export const useBreadcrumbStore = defineStore("breadcrumb", () => {
  const fullTrail = ref([]);
  const config = ref({ ...defaultConfig });

  const hasTrail = computed(() => Array.isArray(fullTrail.value) && fullTrail.value.length > 0);

  const setConfig = (nextConfig = {}) => {
    config.value = {
      ...config.value,
      ...nextConfig,
    };
  };

  const setTrail = (items = [], nextConfig = {}) => {
    setConfig(nextConfig);

    const normalized = (Array.isArray(items) ? items : [])
      .map(normalizeItem)
      .filter(Boolean);

    if (!normalized.length) {
      fullTrail.value = [];
      return;
    }

    const first = normalized[0];
    const shouldPrependHome = config.value.prependHome;
    const homeLabel = config.value.homeLabel;
    const homeTo = config.value.homeTo;

    if (shouldPrependHome && (!first || first.label !== homeLabel)) {
      fullTrail.value = [{ label: homeLabel, to: homeTo }, ...normalized];
      return;
    }

    fullTrail.value = normalized;
  };

  const setFromApiTrail = (apiItems = [], nextConfig = {}) => {
    const items = (Array.isArray(apiItems) ? apiItems : []).map((it) => ({
      label: it?.name || it?.label,
      to: it?.url || it?.to,
    }));
    setTrail(items, nextConfig);
  };

  const clearTrail = () => {
    fullTrail.value = [];
  };

  return {
    fullTrail,
    config,
    hasTrail,
    setConfig,
    setTrail,
    setFromApiTrail,
    clearTrail,
  };
});
