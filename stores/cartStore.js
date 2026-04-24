import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useFeGlobalStore } from "@/stores/feGlobalStore";
import { registerStore } from "@/utils/storeRegistry";

const formatMoney = (value = 0) => {
  const normalizedValue = Number(value) || 0;

  return {
    value: normalizedValue,
    formatted: `${new Intl.NumberFormat("vi-VN").format(normalizedValue)}đ`,
  };
};

const cloneCartItem = (item) => {
  if (!item) {
    return null;
  }

  return JSON.parse(JSON.stringify(item));
};

const createEmptyCart = () => ({
  id: null,
  items: [],
  summary: {
    itemCount: 0,
    lineCount: 0,
    subtotal: formatMoney(0),
    snapshotSubtotal: formatMoney(0),
    hasWarnings: false,
  },
});

export const useCartStore = defineStore("cart", () => {
  const feGlobalStore = useFeGlobalStore();

  const cart = ref(createEmptyCart());
  const isLoading = ref(false);
  const isMutating = ref(false);
  const hydrated = ref(false);
  const lastAddedItem = ref(null);
  const lastRemovedItem = ref(null);
  const isAddToCartSheetOpen = ref(false);
  const pendingItemIds = ref([]);

  const requestCart = async (apiPath, { method = "GET", body, params, itemId } = {}) => {
    feGlobalStore.setApiUrl(apiPath);

    if (method === "GET") {
      return feGlobalStore.fetchItem(params);
    }

    if (method === "POST") {
      return feGlobalStore.createItem(body);
    }

    if (method === "PATCH") {
      return itemId == null
        ? feGlobalStore.patchItem(body)
        : feGlobalStore.patchItem(itemId, body);
    }

    if (method === "DELETE") {
      return feGlobalStore.deleteItem(itemId);
    }

    throw new Error(`Unsupported cart request method: ${method}`);
  };

  const addPendingItem = (itemId) => {
    const nextId = String(itemId);

    if (pendingItemIds.value.includes(nextId)) {
      return;
    }

    pendingItemIds.value = [...pendingItemIds.value, nextId];
  };

  const removePendingItem = (itemId) => {
    const nextId = String(itemId);
    pendingItemIds.value = pendingItemIds.value.filter((id) => id !== nextId);
  };

  const normalizeCart = (payload = {}) => {
    const summary = payload?.summary || {};

    return {
      id: payload?.id ?? null,
      items: Array.isArray(payload?.items) ? payload.items : [],
      summary: {
        itemCount: Number(summary?.itemCount || 0),
        lineCount: Number(summary?.lineCount || 0),
        subtotal: summary?.subtotal || formatMoney(0),
        snapshotSubtotal: summary?.snapshotSubtotal || formatMoney(0),
        hasWarnings: Boolean(summary?.hasWarnings),
      },
    };
  };

  const applyCartPayload = (payload) => {
    cart.value = normalizeCart(payload?.data ?? payload);
    hydrated.value = true;

    if (!cart.value.items.length) {
      lastAddedItem.value = null;
      isAddToCartSheetOpen.value = false;
    }

    return cart.value;
  };

  const setLastAddedItemFromResponse = (response, nextCart = cart.value) => {
    const addedItemId = String(response?.meta?.addedItemId || "");

    lastAddedItem.value =
      nextCart.items.find((item) => String(item.id) === addedItemId) ||
      nextCart.items[0] ||
      null;
  };

  const fetchCart = async ({ force = false, silent = false } = {}) => {
    if (hydrated.value && !force) {
      return cart.value;
    }

    if (!silent) {
      isLoading.value = true;
    }

    try {
      const response = await requestCart("cart");
      return applyCartPayload(response);
    } catch (error) {
      cart.value = createEmptyCart();
      hydrated.value = true;
      return cart.value;
    } finally {
      if (!silent) {
        isLoading.value = false;
      }
    }
  };

  const addItem = async (payload, { showSheet = true } = {}) => {
    isMutating.value = true;

    try {
      const response = await requestCart("cart/items", {
        method: "POST",
        body: payload,
      });
      const nextCart = applyCartPayload(response);
      setLastAddedItemFromResponse(response, nextCart);

      if (showSheet && import.meta.client && window.innerWidth < 992 && lastAddedItem.value) {
        isAddToCartSheetOpen.value = true;
      } else {
        isAddToCartSheetOpen.value = false;
      }

      return response;
    } finally {
      isMutating.value = false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (Number(quantity) <= 0) {
      return removeItem(itemId);
    }

    addPendingItem(itemId);

    try {
      const response = await requestCart("cart/items", {
        method: "PATCH",
        itemId,
        body: { quantity },
      });

      return applyCartPayload(response);
    } finally {
      removePendingItem(itemId);
    }
  };

  const removeItem = async (itemId) => {
    const removedItemSnapshot = cloneCartItem(
      cart.value.items.find((item) => String(item.id) === String(itemId)),
    );

    addPendingItem(itemId);

    try {
      const response = await requestCart("cart/items", {
        method: "DELETE",
        itemId,
      });

      lastRemovedItem.value = removedItemSnapshot;

      return applyCartPayload(response);
    } finally {
      removePendingItem(itemId);
    }
  };

  const undoLastRemoval = async () => {
    if (!lastRemovedItem.value?.productId) {
      return null;
    }

    const payload = {
      product_id: Number(lastRemovedItem.value.productId),
      product_variant_id: lastRemovedItem.value.productVariantId
        ? Number(lastRemovedItem.value.productVariantId)
        : null,
      quantity: Number(lastRemovedItem.value.quantity || 1),
      selected_options: lastRemovedItem.value.selectedOptions || {},
    };

    const response = await addItem(payload, { showSheet: false });
    lastRemovedItem.value = null;

    return response;
  };

  const dismissLastRemovedItem = () => {
    lastRemovedItem.value = null;
  };

  const clearCart = async () => {
    isMutating.value = true;

    try {
      const response = await requestCart("cart", {
        method: "DELETE",
      });

      lastAddedItem.value = null;
      lastRemovedItem.value = null;
      isAddToCartSheetOpen.value = false;

      return applyCartPayload(response);
    } finally {
      isMutating.value = false;
    }
  };

  const closeAddToCartSheet = () => {
    isAddToCartSheetOpen.value = false;
  };

  const isItemPending = (itemId) => pendingItemIds.value.includes(String(itemId));

  const itemCount = computed(() => Number(cart.value?.summary?.itemCount || 0));
  const items = computed(() => cart.value?.items || []);
  const subtotal = computed(() => cart.value?.summary?.subtotal || createEmptyCart().summary.subtotal);
  const snapshotSubtotal = computed(
    () => cart.value?.summary?.snapshotSubtotal || createEmptyCart().summary.snapshotSubtotal,
  );
  const savings = computed(() =>
    formatMoney(
      Math.max(
        Number(snapshotSubtotal.value?.value || 0) - Number(subtotal.value?.value || 0),
        0,
      ),
    ),
  );
  const hasWarnings = computed(() => Boolean(cart.value?.summary?.hasWarnings));
  const warningItems = computed(() =>
    items.value.filter((item) => Array.isArray(item?.warnings) && item.warnings.length > 0),
  );
  const blockingItems = computed(() =>
    items.value.filter(
      (item) => item?.availability?.isActive === false || item?.availability?.inStock === false,
    ),
  );
  const hasPendingItems = computed(() => pendingItemIds.value.length > 0);
  const canCheckout = computed(() => items.value.length > 0 && blockingItems.value.length === 0);

  const reset = () => {
    cart.value = createEmptyCart();
    isLoading.value = false;
    isMutating.value = false;
    hydrated.value = false;
    lastAddedItem.value = null;
    lastRemovedItem.value = null;
    isAddToCartSheetOpen.value = false;
    pendingItemIds.value = [];
  };

  registerStore({ reset });

  return {
    cart,
    isLoading,
    isMutating,
    hydrated,
    lastAddedItem,
    lastRemovedItem,
    isAddToCartSheetOpen,
    pendingItemIds,
    itemCount,
    items,
    subtotal,
    snapshotSubtotal,
    savings,
    hasWarnings,
    warningItems,
    blockingItems,
    hasPendingItems,
    canCheckout,
    fetchCart,
    addItem,
    updateQuantity,
    removeItem,
    undoLastRemoval,
    dismissLastRemovedItem,
    clearCart,
    closeAddToCartSheet,
    isItemPending,
    reset,
  };
});
