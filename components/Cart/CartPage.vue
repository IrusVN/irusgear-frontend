<template>
  <section class="cart-page">
    <div class="container-xl">
      <CartProgress :current-step="1" />

      <CartAlertBanner
        v-if="summary.hasWarnings"
        tone="warning"
        :title="$t('cart.checkCart')"
        :description="warningBannerDescription"
        :action-label="$t('cart.checkNow')"
        @action="focusFirstWarning"
      />

      <CartAlertBanner
        v-if="lastRemovedItem"
        tone="success"
        :title="removedBannerTitle"
        :description="$t('cart.productRemoved')"
        :action-label="$t('cart.undo')"
        dismissible
        @action="handleUndoRemove"
        @dismiss="cartStore.dismissLastRemovedItem()"
      />

      <CartEmptyState v-if="!items.length && !isLoading" />

      <div v-else class="cart-page__layout">
        <div class="cart-page__items">
          <div class="cart-page__items-head">
            <div>
              <h2 class="cart-page__items-title">{{ $t('cart.productList') }}</h2>
              <p class="cart-page__items-description">
                {{ $t('cart.updateQuantityNote') }}
              </p>
            </div>

            <div v-if="items.length" class="cart-page__bulk">
              <label class="cart-page__select-all">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  :indeterminate.prop="!isAllSelected && selectedCount > 0"
                  @change="handleToggleAll"
                />
                <span class="cart-page__select-all-box" aria-hidden="true">
                  <i class="bi bi-check2"></i>
                </span>
                <span class="cart-page__select-all-label">
                  {{ $t('cart.selectAll') }}
                  <span class="cart-page__select-count">({{ selectedCount }}/{{ items.length }})</span>
                </span>
              </label>

              <button
                v-if="selectedCount > 0"
                type="button"
                class="cart-page__bulk-remove"
                @click="handleRemoveSelected"
              >
                <i class="bi bi-trash3"></i>
                {{ $t('cart.removeSelected') }}
              </button>
            </div>
          </div>

          <article v-if="isLoading" class="cart-page__loading">
            {{ $t('cart.loadingCart') }}
          </article>

          <CartItemRow
            v-for="item in items"
            :key="item.id"
            :item="item"
            :busy="cartStore.isItemPending(item.id)"
            :selected="cartStore.isItemSelected(item.id)"
            @update-quantity="handleUpdateQuantity"
            @remove="handleRemoveItem"
            @toggle-select="cartStore.toggleItemSelection"
          />

          <CartRecommendations :items="items" />
        </div>

        <CartSummary
          :summary="selectionSummary"
          :savings="selectionSavings"
          :busy="isSummaryBusy"
          :has-items="items.length > 0"
          :selected-count="selectedCount"
          :total-count="items.length"
          :can-checkout="canCheckout"
          :primary-action-label="primaryActionLabel"
          :helper-text="summaryHelperText"
          @clear="handleClearCart"
          @checkout="handlePrimaryAction"
        />
      </div>
    </div>

    <CartStickyCheckoutBar
      :subtotal="selectionSummary.subtotal"
      :savings="selectionSavings"
      :busy="isSummaryBusy"
      :has-items="items.length > 0 && selectedCount > 0"
      :button-label="primaryActionLabel"
      @checkout="handlePrimaryAction"
    />
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useI18n, useLocalePath, navigateTo } from "#imports";
import { storeToRefs } from "pinia";
import { toast } from "vue-sonner";
import CartAlertBanner from "@/components/Cart/CartAlertBanner.vue";
import CartEmptyState from "@/components/Cart/CartEmptyState.vue";
import CartItemRow from "@/components/Cart/CartItemRow.vue";
import CartProgress from "@/components/Cart/CartProgress.vue";
import CartRecommendations from "@/components/Cart/CartRecommendations.vue";
import CartStickyCheckoutBar from "@/components/Cart/CartStickyCheckoutBar.vue";
import CartSummary from "@/components/Cart/CartSummary.vue";
import { useCartStore } from "@/stores/cartStore";

const createFallbackSummary = () => ({
  itemCount: 0,
  lineCount: 0,
  subtotal: {
    value: 0,
    formatted: "0đ",
  },
  snapshotSubtotal: {
    value: 0,
    formatted: "0đ",
  },
  hasWarnings: false,
});

const cartStore = useCartStore();
const { t } = useI18n();
const localePath = useLocalePath();
const {
  cart,
  isLoading,
  isMutating,
  items,
  warningItems,
  blockingItems,
  hasPendingItems,
  canCheckout,
  lastRemovedItem,
  selectedItems,
  selectedCount,
  selectedSubtotal,
  isAllSelected,
} = storeToRefs(cartStore);

const summary = computed(() => cart.value?.summary || createFallbackSummary());

// Summary chỉ tính theo items được chọn (không phải toàn bộ cart).
const selectionSummary = computed(() => {
  const total = items.value.length;
  return {
    itemCount: selectedItems.value.reduce((sum, i) => sum + Number(i.quantity || 0), 0),
    lineCount: selectedCount.value,
    subtotal: selectedSubtotal.value,
    snapshotSubtotal: {
      value: selectedItems.value.reduce(
        (sum, i) => sum + Number(i.unitPrice?.value || 0) * Number(i.quantity || 0),
        0,
      ),
      formatted: "",
    },
    hasWarnings: selectedItems.value.some((i) => Array.isArray(i.warnings) && i.warnings.length),
    totalItemCount: total,
  };
});

const selectionSavings = computed(() => {
  const saved = Math.max(
    Number(selectionSummary.value.snapshotSubtotal?.value || 0) -
      Number(selectionSummary.value.subtotal?.value || 0),
    0,
  );
  return {
    value: saved,
    formatted: `${new Intl.NumberFormat("vi-VN").format(saved)}đ`,
  };
});

const isSummaryBusy = computed(() => Boolean(isMutating.value || hasPendingItems.value));

const warningBannerDescription = computed(() => {
  if (!warningItems.value.length) {
    return "";
  }

  if (blockingItems.value.length) {
    return t('cart.itemCountWarning', { count: blockingItems.value.length });
  }

  const uniqueWarnings = [...new Set(warningItems.value.flatMap((item) => item.warnings || []))];

  if (uniqueWarnings.length === 1) {
    return uniqueWarnings[0];
  }

  return t('cart.priceStockChange', { count: warningItems.value.length });
});

const removedBannerTitle = computed(() => {
  if (!lastRemovedItem.value?.productName) {
    return t('cart.productRemovedTitle');
  }

  return t('cart.productRemovedTitleWithName', { name: lastRemovedItem.value.productName });
});

const primaryActionLabel = computed(() => {
  if (!items.value.length) {
    return t('cart.emptyCart');
  }
  if (selectedCount.value === 0) {
    return t('cart.selectItemsToCheckout');
  }
  return canCheckout.value ? t('cart.proceedOrder') : t('cart.checkCartItems');
});

const summaryHelperText = computed(() => {
  if (!items.value.length) {
    return t('cart.addProductNextStep');
  }
  if (selectedCount.value === 0) {
    return t('cart.noItemSelectedHint');
  }
  if (!canCheckout.value) {
    return t('cart.someItemsNotReady');
  }
  return t('cart.nextStepNote');
});

const focusFirstWarning = () => {
  if (!import.meta.client) {
    return;
  }

  const warningItem = document.querySelector(".cart-item--warning");
  warningItem?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
};

const handleUpdateQuantity = ({ itemId, quantity }) => {
  // Optimistic + debounced — không cần await, lỗi sẽ hiển thị qua toast trong store rollback
  try {
    cartStore.scheduleQuantityUpdate(itemId, quantity);
  } catch (error) {
    toast.error(error?.data?.message || t('cart.updateQuantityError'));
  }
};

const handleToggleAll = () => {
  if (isAllSelected.value) {
    cartStore.deselectAllItems();
  } else {
    cartStore.selectAllItems();
  }
};

const handleRemoveSelected = () => {
  if (!selectedCount.value) return;
  toast(t('cart.confirmRemoveSelected', { count: selectedCount.value }), {
    cancel: { label: t('common.confirmNo'), onClick: () => {} },
    action: {
      label: t('common.confirmYes'),
      onClick: async () => {
        try {
          await cartStore.removeSelectedItems();
          toast.success(t('cart.removeSelectedSuccess'));
        } catch (error) {
          toast.error(error?.data?.message || t('cart.removeFromCartError'));
        }
      },
    },
  });
};

const handleRemoveItem = async (itemId) => {
  const item = items.value.find((i) => i.id === itemId);
  toast(t('cart.confirmRemoveItem', { name: item?.productName }), {
    cancel: { label: t('common.confirmNo'), onClick: () => {} },
    action: {
      label: t('common.confirmYes'),
      onClick: async () => {
        try {
          await cartStore.removeItem(itemId);
        } catch (error) {
          toast.error(error?.data?.message || t('cart.removeFromCartError'));
        }
      },
    },
  });
};

const handleUndoRemove = async () => {
  try {
    await cartStore.undoLastRemoval();
    toast.success(t('cart.restoreToCart'));
  } catch (error) {
    toast.error(error?.data?.message || t('cart.restoreError'));
  }
};

const handlePrimaryAction = async () => {
  if (!items.value.length) {
    return;
  }

  if (selectedCount.value === 0) {
    toast.warning(t('cart.noItemSelected'));
    return;
  }

  if (!canCheckout.value) {
    focusFirstWarning();
    return;
  }

  // Flush pending quantity changes trước khi sang checkout để BE chắc chắn có data mới nhất
  try {
    await cartStore.flushPendingQuantityUpdates();
  } catch {
    // ignore — vẫn cho navigate, backend sẽ validate lại
  }

  navigateTo(localePath("/cart/checkout"));
};

const handleClearCart = () => {
  toast(t('cart.confirmClearCart'), {
    cancel: { label: t('common.confirmNo'), onClick: () => {} },
    action: {
      label: t('common.confirmYes'),
      onClick: async () => {
        try {
          await cartStore.clearCart();
          toast.success(t('cart.clearCart'));
        } catch (error) {
          toast.error(error?.data?.message || t('cart.clearCartError'));
        }
      },
    },
  });
};
</script>

<style scoped>
.cart-page {
  padding: 18px 0 40px;
}

.cart-page__layout {
  align-items: start;
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 1.7fr) minmax(320px, 0.95fr);
}

.cart-page__items {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.cart-page__items-head {
  align-items: center;
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 26px;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: space-between;
  padding: 20px 22px;
}

.cart-page__bulk {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.cart-page__select-all {
  align-items: center;
  background: #f7f7f8;
  border-radius: 999px;
  cursor: pointer;
  display: inline-flex;
  gap: 10px;
  padding: 8px 14px 8px 10px;
  position: relative;
}

.cart-page__select-all input {
  height: 0;
  margin: 0;
  opacity: 0;
  position: absolute;
  width: 0;
}

.cart-page__select-all-box {
  align-items: center;
  background: #fff;
  border: 2px solid #d4d4d8;
  border-radius: 6px;
  color: transparent;
  display: inline-flex;
  font-size: 13px;
  height: 20px;
  justify-content: center;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  width: 20px;
}

.cart-page__select-all input:checked + .cart-page__select-all-box {
  background: var(--irus-color-accent);
  border-color: var(--irus-color-accent);
  color: #fff;
}

.cart-page__select-all input:indeterminate + .cart-page__select-all-box {
  background: var(--irus-color-accent);
  border-color: var(--irus-color-accent);
  color: #fff;
  position: relative;
}

.cart-page__select-all input:indeterminate + .cart-page__select-all-box::after {
  background: #fff;
  border-radius: 1px;
  content: "";
  height: 2px;
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
}

.cart-page__select-all input:indeterminate + .cart-page__select-all-box i {
  display: none;
}

.cart-page__select-all-label {
  color: #18181b;
  font-size: 13px;
  font-weight: 700;
}

.cart-page__select-count {
  color: #71717a;
  font-weight: 600;
  margin-left: 4px;
}

.cart-page__bulk-remove {
  align-items: center;
  background: transparent;
  border: 1px solid #fecaca;
  border-radius: 999px;
  color: #b91c1c;
  cursor: pointer;
  display: inline-flex;
  font-size: 13px;
  font-weight: 700;
  gap: 6px;
  padding: 8px 14px;
  transition: background 0.15s ease;
}

.cart-page__bulk-remove:hover {
  background: #fef2f2;
}

.cart-page__items-title {
  color: #18181b;
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 6px;
}

.cart-page__items-description {
  color: #71717a;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

.cart-page__loading {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 24px;
  color: #71717a;
  padding: 18px;
}

@media (max-width: 991.98px) {
  .cart-page {
    padding-bottom: 170px;
  }

  .cart-page__layout {
    grid-template-columns: 1fr;
  }

  .cart-page__items-head {
    padding: 18px;
  }
}

@media (max-width: 767.98px) {
  .cart-page {
    padding-bottom: 160px;
  }
}

@media (max-width: 575.98px) {
  .cart-page {
    padding-bottom: 145px;
  }
}

@media (max-width: 480px) {
  .cart-page {
    padding-bottom: 130px;
  }
}
</style>
