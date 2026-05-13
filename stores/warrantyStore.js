import { ref } from "vue";
import { defineStore } from "pinia";
import { useFeGlobalStore } from "@/stores/feGlobalStore";
import { registerStore } from "@/utils/storeRegistry";

export const useWarrantyStore = defineStore("warranty", () => {
  const feGlobalStore = useFeGlobalStore();

  const warranties = ref([]);
  const pagination = ref({ current_page: 1, total: 0, per_page: 10, last_page: 1 });
  const isLoading = ref(false);
  const hydrated = ref(false);

  const tabStatusMap = {
    all: null,
    received: "received",
    coordinating: "coordinating",
    repairing: "repairing",
    done: "done",
    returned: "returned",
  };

  const normalizeWarranty = (raw) => ({
    id: raw.warranty_code || raw.id,
    date: raw.date,
    status: raw.status,
    product: raw.product,
    purchaseDate: raw.purchase_date,
    warrantyEnd: raw.warranty_end,
    serviceCenter: raw.service_center,
    timeline: Array.isArray(raw.timeline) ? raw.timeline : [],
  });

  const buildParams = (filters = {}) => {
    const params = {};
    const status = filters.status || "all";
    if (status !== "all") {
      params.status = tabStatusMap[status];
    }
    if (filters.q) params.q = filters.q;
    return params;
  };

  const fetchWarranties = async ({ status = "all", q = "", page = 1 } = {}) => {
    isLoading.value = true;
    try {
      feGlobalStore.setApiUrl("warranties");
      const params = { page, limit: 10, ...buildParams({ status, q }) };
      const res = await feGlobalStore.fetchItem(params);
      if (res?.success !== false) {
        warranties.value = (res?.data?.warranties || []).map(normalizeWarranty);
        if (res?.data?.pagination) {
          pagination.value = res.data.pagination;
        }
        hydrated.value = true;
      }
      return warranties.value;
    } catch (e) {
      warranties.value = [];
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  const reset = () => {
    warranties.value = [];
    pagination.value = { current_page: 1, total: 0, per_page: 10, last_page: 1 };
    isLoading.value = false;
    hydrated.value = false;
  };

  registerStore({ reset });

  return {
    warranties,
    pagination,
    isLoading,
    hydrated,
    fetchWarranties,
    reset,
  };
});
