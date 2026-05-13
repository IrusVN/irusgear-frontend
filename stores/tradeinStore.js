import { ref } from "vue";
import { defineStore } from "pinia";
import { useFeGlobalStore } from "@/stores/feGlobalStore";
import { registerStore } from "@/utils/storeRegistry";

export const useTradeinStore = defineStore("tradein", () => {
  const feGlobalStore = useFeGlobalStore();

  const tradeins = ref([]);
  const pagination = ref({ current_page: 1, total: 0, per_page: 10, last_page: 1 });
  const isLoading = ref(false);
  const hydrated = ref(false);

  const normalizeTradein = (raw) => ({
    id: raw.id,
    date: raw.date,
    status: raw.status,
    oldDevice: {
      name: raw.old_device?.name,
      image: raw.old_device?.image_url,
      capacity: raw.old_device?.capacity,
    },
    newDevice: {
      name: raw.new_device?.name,
      image: raw.new_device?.image_url,
      capacity: raw.new_device?.capacity,
    },
    oldValue: raw.old_value_formatted,
    newPrice: raw.new_price_formatted,
    topUp: raw.top_up_formatted,
  });

  const fetchTradeins = async ({ date_from, date_to, page = 1 } = {}) => {
    isLoading.value = true;
    try {
      feGlobalStore.setApiUrl("tradeins");
      const params = { page, limit: 10 };
      if (date_from) params.date_from = date_from;
      if (date_to) params.date_to = date_to;
      const res = await feGlobalStore.fetchItem(params);
      if (res?.success !== false) {
        tradeins.value = (res?.data?.tradeins || []).map(normalizeTradein);
        if (res?.data?.pagination) {
          pagination.value = res.data.pagination;
        }
        hydrated.value = true;
      }
      return tradeins.value;
    } catch (e) {
      tradeins.value = [];
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  const reset = () => {
    tradeins.value = [];
    pagination.value = { current_page: 1, total: 0, per_page: 10, last_page: 1 };
    isLoading.value = false;
    hydrated.value = false;
  };

  registerStore({ reset });

  return {
    tradeins,
    pagination,
    isLoading,
    hydrated,
    fetchTradeins,
    reset,
  };
});
