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
          </div>

          <article v-if="isLoading" class="cart-page__loading">
            {{ $t('cart.loadingCart') }}
          </article>

          <CartItemRow
            v-for="item in items"
            :key="item.id"
            :item="item"
            :busy="cartStore.isItemPending(item.id)"
            @update-quantity="handleUpdateQuantity"
            @remove="handleRemoveItem"
          />

          <CartRecommendations :items="items" />
        </div>

        <CartSummary
          :summary="summary"
          :savings="savings"
          :busy="isSummaryBusy"
          :has-items="items.length > 0"
          :can-checkout="canCheckout"
          :primary-action-label="primaryActionLabel"
          :helper-text="summaryHelperText"
          @clear="handleClearCart"
          @checkout="handlePrimaryAction"
        />
      </div>
    </div>

    <CartStickyCheckoutBar
      :subtotal="summary.subtotal"
      :savings="savings"
      :busy="isSummaryBusy"
      :has-items="items.length > 0"
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
  savings,
  warningItems,
  blockingItems,
  hasPendingItems,
  canCheckout,
  lastRemovedItem,
} = storeToRefs(cartStore);

const summary = computed(() => cart.value?.summary || createFallbackSummary());

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

  return canCheckout.value ? t('cart.proceedOrder') : t('cart.checkCartItems');
});

const summaryHelperText = computed(() => {
  if (!items.value.length) {
    return t('cart.addProductNextStep');
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

const handleUpdateQuantity = async ({ itemId, quantity }) => {
  try {
    await cartStore.updateQuantity(itemId, quantity);
  } catch (error) {
    toast.error(error?.data?.message || t('cart.updateQuantityError'));
  }
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

const handlePrimaryAction = () => {
  if (!items.value.length) {
    return;
  }

  if (!canCheckout.value) {
    focusFirstWarning();
    return;
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
  align-items: flex-start;
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 26px;
  display: flex;
  gap: 14px;
  justify-content: space-between;
  padding: 20px 22px;
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
