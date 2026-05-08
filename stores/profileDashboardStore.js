import { ref } from "vue";
import { defineStore } from "pinia";
import { useFeGlobalStore } from "@/stores/feGlobalStore";
import { registerStore } from "@/utils/storeRegistry";

export const useProfileDashboardStore = defineStore("profileDashboard", () => {
  const feGlobalStore = useFeGlobalStore();

  const recentOrders = ref({ total: 0, seeAllUrl: "", orders: [] });
  const offers = ref({ total: 0, seeAllUrl: "", items: [] });
  const favorites = ref({ total: 0, seeAllUrl: "", items: [] });
  const isLoading = ref(false);
  const hydrated = ref(false);

  const normalizeOrder = (raw) => ({
    id: raw.id,
    date: raw.date,
    status: raw.status,
    totalFormatted: raw.total_formatted,
    itemCount: raw.item_count,
    items: Array.isArray(raw.items) ? raw.items : [],
  });

  const fetchDashboard = async ({ recent_orders_limit = 4, favorites_limit = 6 } = {}) => {
    if (hydrated.value) return { recentOrders: recentOrders.value, offers: offers.value, favorites: favorites.value };
    isLoading.value = true;
    try {
      feGlobalStore.setApiUrl("profile/dashboard");
      const res = await feGlobalStore.fetchItem({ recent_orders_limit, favorites_limit });
      if (res?.success !== false) {
        const data = res?.data || {};
        recentOrders.value = {
          total: data.recent_orders?.total || 0,
          seeAllUrl: data.recent_orders?.see_all_url || "/orders",
          orders: (data.recent_orders?.orders || []).map(normalizeOrder),
        };
        offers.value = {
          total: data.offers?.total || 0,
          seeAllUrl: data.offers?.see_all_url || "",
          items: data.offers?.items || [],
        };
        favorites.value = {
          total: data.favorites?.total || 0,
          seeAllUrl: data.favorites?.see_all_url || "",
          items: data.favorites?.items || [],
        };
        hydrated.value = true;
      }
      return { recentOrders: recentOrders.value, offers: offers.value, favorites: favorites.value };
    } catch (e) {
      recentOrders.value = { total: 0, seeAllUrl: "/orders", orders: [] };
      offers.value = { total: 0, seeAllUrl: "", items: [] };
      favorites.value = { total: 0, seeAllUrl: "", items: [] };
      return { recentOrders: recentOrders.value, offers: offers.value, favorites: favorites.value };
    } finally {
      isLoading.value = false;
    }
  };

  const reset = () => {
    recentOrders.value = { total: 0, seeAllUrl: "", orders: [] };
    offers.value = { total: 0, seeAllUrl: "", items: [] };
    favorites.value = { total: 0, seeAllUrl: "", items: [] };
    isLoading.value = false;
    hydrated.value = false;
  };

  registerStore({ reset });

  return {
    recentOrders,
    offers,
    favorites,
    isLoading,
    hydrated,
    fetchDashboard,
    reset,
  };
});
