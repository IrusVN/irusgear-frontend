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
  let fetchingPromise = null;
  const lastAddedItem = ref(null);
  const lastRemovedItem = ref(null);
  const isAddToCartSheetOpen = ref(false);
  const pendingItemIds = ref([]);

  // Selection state — track itemIds user đã UN-check (mặc định mọi item đều được chọn).
  // Item mới add vào tự động được chọn vì không có trong unselectedItemIds.
  const unselectedItemIds = ref([]);

  // Debounce timers cho quantity update — key = itemId, value = { timer, latestQuantity }.
  // Click + hoặc - liên tục sẽ reset timer; chỉ 1 API call duy nhất sau khi user dừng.
  const quantityDebounceMap = new Map();
  const DEBOUNCE_QUANTITY_MS = 500;

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
      unselectedItemIds.value = [];
    } else {
      // Dọn unselected: xoá id không còn trong cart (item đã bị remove).
      const validIdSet = new Set(cart.value.items.map((item) => String(item.id)));
      unselectedItemIds.value = unselectedItemIds.value
        .map(String)
        .filter((id) => validIdSet.has(id));
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

    if (fetchingPromise && !force) {
      return fetchingPromise;
    }

    if (!silent) {
      isLoading.value = true;
    }

    fetchingPromise = (async () => {
      try {
        const response = await requestCart("cart");
        applyCartPayload(response);
        return cart.value;
      } catch (error) {
        cart.value = createEmptyCart();
        hydrated.value = true;
        return cart.value;
      } finally {
        if (!silent) {
          isLoading.value = false;
        }
        fetchingPromise = null;
      }
    })();

    return fetchingPromise;
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

  /**
   * Gọi API patch quantity ngay lập tức (không debounce).
   * Internal — chỉ dùng cho legacy paths; UI nên dùng scheduleQuantityUpdate.
   */
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

  /**
   * Optimistic + debounced quantity update.
   * User click + hoặc - liên tục:
   *   - UI cập nhật ngay (mutate item.quantity + recompute line total)
   *   - Timer 500ms được reset mỗi click
   *   - Khi user dừng, 1 API PATCH duy nhất với quantity cuối cùng
   * Tránh case user phải chờ N API calls khi giảm từ 4 → 1.
   */
  const scheduleQuantityUpdate = (itemId, quantity) => {
    const idStr = String(itemId);
    const item = cart.value.items.find((i) => String(i.id) === idStr);
    if (!item) return;

    const nextQuantity = Math.max(0, Number(quantity) || 0);

    // Nếu cố xuống 0 → debounce remove (không gọi removeItem ngay để cho phép user undo bằng nhấn +)
    if (nextQuantity <= 0) {
      // Optimistic không cho giảm dưới 1 — user phải dùng nút thùng rác để remove
      return;
    }

    // 1. Optimistic update: mutate cart ngay để UI phản hồi tức thời
    const unitPrice = Number(item.currentUnitPrice?.value || item.unitPrice?.value || 0);
    item.quantity = nextQuantity;
    item.currentLineTotal = formatMoney(unitPrice * nextQuantity);

    // Recompute summary subtotal từ tất cả items đang trong cart
    const newSubtotal = cart.value.items.reduce((sum, i) => {
      const price = Number(i.currentUnitPrice?.value || i.unitPrice?.value || 0);
      return sum + price * Number(i.quantity || 0);
    }, 0);
    cart.value.summary.subtotal = formatMoney(newSubtotal);
    cart.value.summary.itemCount = cart.value.items.reduce((sum, i) => sum + Number(i.quantity || 0), 0);

    // 2. Debounce API call — reset timer nếu user click tiếp
    const existing = quantityDebounceMap.get(idStr);
    if (existing?.timer) {
      clearTimeout(existing.timer);
    }

    const pending = existing || { originalQuantity: item.quantity };
    pending.latestQuantity = nextQuantity;

    pending.timer = setTimeout(async () => {
      const finalQuantity = pending.latestQuantity;
      quantityDebounceMap.delete(idStr);

      addPendingItem(itemId);
      try {
        const response = await requestCart("cart/items", {
          method: "PATCH",
          itemId,
          body: { quantity: finalQuantity },
        });
        applyCartPayload(response);
      } catch (e) {
        // Rollback bằng fetchCart force để lấy state thật
        await fetchCart({ force: true, silent: true }).catch(() => {});
        throw e;
      } finally {
        removePendingItem(itemId);
      }
    }, DEBOUNCE_QUANTITY_MS);

    quantityDebounceMap.set(idStr, pending);
  };

  /**
   * Flush debounce: gọi API ngay (vd trước khi navigate sang checkout).
   */
  const flushPendingQuantityUpdates = async () => {
    const pendingEntries = [...quantityDebounceMap.entries()];
    if (pendingEntries.length === 0) return;

    const promises = pendingEntries.map(async ([idStr, pending]) => {
      if (pending.timer) clearTimeout(pending.timer);
      quantityDebounceMap.delete(idStr);
      addPendingItem(idStr);
      try {
        const response = await requestCart("cart/items", {
          method: "PATCH",
          itemId: idStr,
          body: { quantity: pending.latestQuantity },
        });
        applyCartPayload(response);
      } finally {
        removePendingItem(idStr);
      }
    });

    await Promise.all(promises);
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

  // --- Selection getters ---
  const isItemSelected = (itemId) => !unselectedItemIds.value.includes(String(itemId));
  const selectedItems = computed(() =>
    items.value.filter((item) => !unselectedItemIds.value.includes(String(item.id))),
  );
  const selectedItemIds = computed(() => selectedItems.value.map((item) => Number(item.id)));
  const selectedCount = computed(() => selectedItems.value.length);
  const isAllSelected = computed(
    () => items.value.length > 0 && selectedCount.value === items.value.length,
  );
  const selectedSubtotal = computed(() =>
    formatMoney(
      selectedItems.value.reduce((sum, item) => {
        const price = Number(item.currentUnitPrice?.value || item.unitPrice?.value || 0);
        return sum + price * Number(item.quantity || 0);
      }, 0),
    ),
  );
  // Tổng số lượng (sum quantity) chỉ tính trên selected items — khác với selectedCount (số dòng).
  const selectedItemCount = computed(() =>
    selectedItems.value.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
  );
  // Tiết kiệm cho selected items = snapshot subtotal - current subtotal
  const selectedSavings = computed(() => {
    const snapshot = selectedItems.value.reduce((sum, item) => {
      const price = Number(item.unitPrice?.value || 0);
      return sum + price * Number(item.quantity || 0);
    }, 0);
    const current = Number(selectedSubtotal.value?.value || 0);
    return formatMoney(Math.max(snapshot - current, 0));
  });
  const selectedBlockingItems = computed(() =>
    selectedItems.value.filter(
      (item) => item?.availability?.isActive === false || item?.availability?.inStock === false,
    ),
  );
  const canCheckout = computed(
    () => selectedItems.value.length > 0 && selectedBlockingItems.value.length === 0,
  );

  // --- Selection actions ---
  const toggleItemSelection = (itemId) => {
    const idStr = String(itemId);
    if (unselectedItemIds.value.includes(idStr)) {
      unselectedItemIds.value = unselectedItemIds.value.filter((id) => id !== idStr);
    } else {
      unselectedItemIds.value = [...unselectedItemIds.value, idStr];
    }
  };

  const selectAllItems = () => {
    unselectedItemIds.value = [];
  };

  const deselectAllItems = () => {
    unselectedItemIds.value = items.value.map((item) => String(item.id));
  };

  const removeSelectedItems = async () => {
    const ids = selectedItemIds.value;
    if (!ids.length) return;
    // Gọi tuần tự để BE có thời gian apply (mỗi DELETE trả về cart mới)
    for (const id of ids) {
      try {
        await removeItem(id);
      } catch {
        // continue
      }
    }
  };

  const reset = () => {
    cart.value = createEmptyCart();
    isLoading.value = false;
    isMutating.value = false;
    hydrated.value = false;
    fetchingPromise = null;
    lastAddedItem.value = null;
    lastRemovedItem.value = null;
    isAddToCartSheetOpen.value = false;
    pendingItemIds.value = [];
    unselectedItemIds.value = [];
    // Clear pending debounce timers
    for (const [, pending] of quantityDebounceMap) {
      if (pending.timer) clearTimeout(pending.timer);
    }
    quantityDebounceMap.clear();
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
    scheduleQuantityUpdate,
    flushPendingQuantityUpdates,
    removeItem,
    undoLastRemoval,
    dismissLastRemovedItem,
    clearCart,
    closeAddToCartSheet,
    isItemPending,
    // Selection
    unselectedItemIds,
    selectedItems,
    selectedItemIds,
    selectedCount,
    selectedItemCount,
    selectedSubtotal,
    selectedSavings,
    selectedBlockingItems,
    isAllSelected,
    isItemSelected,
    toggleItemSelection,
    selectAllItems,
    deselectAllItems,
    removeSelectedItems,
    reset,
  };
});
