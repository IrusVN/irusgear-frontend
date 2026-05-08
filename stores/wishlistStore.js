import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useFeGlobalStore } from "@/stores/feGlobalStore";
import { registerStore } from "@/utils/storeRegistry";

const createEmptyWishlist = () => ({
  id: null,
  items: [],
  summary: {
    itemCount: 0,
  },
});

export const useWishlistStore = defineStore("wishlist", () => {
  const feGlobalStore = useFeGlobalStore();

  const wishlist = ref(createEmptyWishlist());
  const isLoading = ref(false);
  const isMutating = ref(false);
  const hydrated = ref(false);

  const requestWishlist = async (apiPath, { method = "GET", body, params, itemId } = {}) => {
    feGlobalStore.setApiUrl(apiPath);

    if (method === "GET") {
      return feGlobalStore.fetchItem(params);
    }

    if (method === "POST") {
      return feGlobalStore.createItem(body);
    }

    if (method === "DELETE") {
      return feGlobalStore.deleteItem(itemId);
    }

    throw new Error(`Unsupported wishlist request method: ${method}`);
  };

  const normalizeWishlist = (payload = {}) => {
    const summary = payload?.summary || {};

    return {
      id: payload?.id ?? null,
      items: Array.isArray(payload?.items) ? payload.items : [],
      summary: {
        itemCount: Number(summary?.itemCount || 0),
      },
    };
  };

  const applyWishlistPayload = (payload) => {
    wishlist.value = normalizeWishlist(payload?.data ?? payload);
    hydrated.value = true;
    return wishlist.value;
  };

  const fetchWishlist = async ({ force = false, silent = false } = {}) => {
    if (hydrated.value && !force) {
      return wishlist.value;
    }

    if (!silent) {
      isLoading.value = true;
    }

    try {
      const response = await requestWishlist("wishlist");
      return applyWishlistPayload(response);
    } catch (error) {
      wishlist.value = createEmptyWishlist();
      hydrated.value = true;
      return wishlist.value;
    } finally {
      if (!silent) {
        isLoading.value = false;
      }
    }
  };

  const addItem = async (payload) => {
    isMutating.value = true;

    try {
      const response = await requestWishlist("wishlist/items", {
        method: "POST",
        body: payload,
      });

      return applyWishlistPayload(response);
    } finally {
      isMutating.value = false;
    }
  };

  const removeItem = async (itemId) => {
    isMutating.value = true;

    try {
      const response = await requestWishlist("wishlist/items", {
        method: "DELETE",
        itemId,
      });

      return applyWishlistPayload(response);
    } finally {
      isMutating.value = false;
    }
  };

  const clearWishlist = async () => {
    isMutating.value = true;

    try {
      const response = await requestWishlist("wishlist", {
        method: "DELETE",
      });

      return applyWishlistPayload(response);
    } finally {
      isMutating.value = false;
    }
  };

  const reset = () => {
    wishlist.value = createEmptyWishlist();
    isLoading.value = false;
    isMutating.value = false;
    hydrated.value = false;
  };

  registerStore({ reset });

  const itemCount = computed(() => Number(wishlist.value?.summary?.itemCount || 0));
  const items = computed(() => wishlist.value?.items || []);

  return {
    wishlist,
    isLoading,
    isMutating,
    hydrated,
    itemCount,
    items,
    fetchWishlist,
    addItem,
    removeItem,
    clearWishlist,
    reset,
  };
});
