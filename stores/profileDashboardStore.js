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
  const offersLoading = ref(false);
  const hydrated = ref(false);

  const normalizeVoucherItem = (raw) => ({
    id: raw.id || raw.code,
    itemType: "voucher",
    code: raw.code || null,
    title: raw.code ? `Mã ${raw.code}` : raw.title || "",
    description: buildVoucherDescription(raw),
    value: raw.value || null,
    formattedValue: buildVoucherValue(raw),
    type: raw.type || null,
    minOrderAmount: raw.min_order_amount || null,
    expiredAt: raw.expired_at || null,
    isUsed: Boolean(raw.is_used),
    isLocked: false,
    icon: raw.icon || "bi bi-ticket-perforated",
    original: raw,
  });

  const buildVoucherValue = (v) => {
    if (!v.value && v.value !== 0) return null;
    if (v.type === "percentage") return `${v.value}%`;
    if (v.type === "fixed") return v.value_formatted || `${new Intl.NumberFormat("vi-VN").format(v.value)}đ`;
    return v.value_formatted || `${new Intl.NumberFormat("vi-VN").format(v.value)}đ`;
  };

  const buildVoucherDescription = (v) => {
    const parts = [];
    if (v.min_order_amount) {
      const minFormatted = `${new Intl.NumberFormat("vi-VN").format(v.min_order_amount)}đ`;
      parts.push(`Đơn tối thiểu ${minFormatted}`);
    }
    if (v.max_discount_amount) {
      const maxFormatted = `${new Intl.NumberFormat("vi-VN").format(v.max_discount_amount)}đ`;
      parts.push(`Giảm tối đa ${maxFormatted}`);
    }
    if (v.applicable_categories?.length) {
      parts.push(`Áp dụng: ${v.applicable_categories.join(", ")}`);
    }
    return parts.join(" · ") || null;
  };

  const normalizeBenefitItem = (raw) => ({
    id: raw.id,
    itemType: "benefit",
    title: raw.title || "",
    description: raw.description || null,
    value: null,
    formattedValue: null,
    type: raw.type || null,
    isLocked: Boolean(raw.is_locked),
    icon: raw.icon || "bi bi-gift",
    original: raw,
  });

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
      // Fetch offers from vouchers + member-rank/benefits in parallel
      fetchOffers();
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

  const fetchOffers = async () => {
    offersLoading.value = true;
    try {
      const [vouchersRes, benefitsRes] = await Promise.allSettled([
        (() => {
          feGlobalStore.setApiUrl("checkout/vouchers");
          return feGlobalStore.fetchItem();
        })(),
        (() => {
          feGlobalStore.setApiUrl("member-rank/benefits");
          return feGlobalStore.fetchItem();
        })(),
      ]);

      const normalizedItems = [];

      // Normalize vouchers
      if (vouchersRes.status === "fulfilled" && vouchersRes.value?.success !== false) {
        const vouchers = vouchersRes.value?.data?.vouchers || vouchersRes.value?.data || [];
        vouchers.forEach((v) => normalizedItems.push(normalizeVoucherItem(v)));
      }

      // Normalize member-rank benefits (shopping_benefits + service_policies)
      if (benefitsRes.status === "fulfilled" && benefitsRes.value?.success !== false) {
        const benefitsData = benefitsRes.value?.data || {};
        const shopping = benefitsData.shopping_benefits || [];
        const services = benefitsData.service_policies || [];
        [...shopping, ...services].forEach((b) => normalizedItems.push(normalizeBenefitItem(b)));
      }

      offers.value = {
        total: normalizedItems.length,
        seeAllUrl: offers.value.seeAllUrl || "/promotion",
        items: normalizedItems,
      };
    } catch (e) {
      // Silently fail — offers will show empty state
    } finally {
      offersLoading.value = false;
    }
  };

  const removeFavoriteItem = (itemId) => {
    const currentItems = favorites.value.items || [];

    favorites.value = {
      ...favorites.value,
      total: Math.max(0, Number(favorites.value.total || currentItems.length) - 1),
      items: currentItems.filter((item) => String(item.id) !== String(itemId)),
    };
  };

  const reset = () => {
    recentOrders.value = { total: 0, seeAllUrl: "", orders: [] };
    offers.value = { total: 0, seeAllUrl: "", items: [] };
    favorites.value = { total: 0, seeAllUrl: "", items: [] };
    isLoading.value = false;
    offersLoading.value = false;
    hydrated.value = false;
  };

  registerStore({ reset });

  return {
    recentOrders,
    offers,
    favorites,
    isLoading,
    offersLoading,
    hydrated,
    fetchDashboard,
    fetchOffers,
    removeFavoriteItem,
    reset,
  };
});
