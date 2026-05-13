import { ref } from "vue";
import { defineStore } from "pinia";
import { useFeGlobalStore } from "@/stores/feGlobalStore";
import { registerStore } from "@/utils/storeRegistry";

export const useOrdersStore = defineStore("orders", () => {
  const feGlobalStore = useFeGlobalStore();

  const orders = ref([]);
  const pagination = ref({ current_page: 1, total: 0, per_page: 10, last_page: 1 });
  const isLoading = ref(false);
  const hydrated = ref(false);

  // FE tab key → BE status value(s)
  const tabStatusMap = {
    all: null,
    pending: "pending",
    processing: "processing",
    shipping: ["shipped", "delivering"],
    delivered: "delivered",
    cancelled: "cancelled",
  };

  const normalizeOrder = (raw) => ({
    id: raw.id,
    date: raw.date,
    status: raw.status,
    totalFormatted: raw.total_formatted,
    itemCount: raw.item_count,
    items: Array.isArray(raw.items) ? raw.items : [],
  });

  const buildParams = (filters = {}) => {
    const params = {};
    const status = filters.status || "all";
    if (status !== "all") {
      const mapped = tabStatusMap[status];
      if (Array.isArray(mapped)) {
        params.status = mapped.join(",");
      } else {
        params.status = mapped;
      }
    }
    if (filters.date_from) params.date_from = filters.date_from;
    if (filters.date_to) params.date_to = filters.date_to;
    return params;
  };

  const fetchOrders = async ({ status = "all", date_from, date_to, page = 1 } = {}) => {
    isLoading.value = true;
    try {
      feGlobalStore.setApiUrl("orders");
      const params = { page, limit: 10, ...buildParams({ status, date_from, date_to }) };
      const res = await feGlobalStore.fetchItem(params);
      if (res?.success !== false) {
        orders.value = (res?.data?.orders || []).map(normalizeOrder);
        if (res?.data?.pagination) {
          pagination.value = res.data.pagination;
        }
        hydrated.value = true;
      }
      return orders.value;
    } catch (e) {
      orders.value = [];
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  const reset = () => {
    orders.value = [];
    pagination.value = { current_page: 1, total: 0, per_page: 10, last_page: 1 };
    isLoading.value = false;
    hydrated.value = false;
  };

  registerStore({ reset });

  return {
    orders,
    pagination,
    isLoading,
    hydrated,
    fetchOrders,
    reset,
  };
});
