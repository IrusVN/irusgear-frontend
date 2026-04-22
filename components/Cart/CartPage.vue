<template>
  <section class="cart-page">
    <div class="container-xl">
      <CartProgress :current-step="1" />

      <CartAlertBanner
        v-if="summary.hasWarnings"
        tone="warning"
        title="Cần kiểm tra lại giỏ hàng"
        :description="warningBannerDescription"
        action-label="Kiểm tra ngay"
        @action="focusFirstWarning"
      />

      <CartAlertBanner
        v-if="lastRemovedItem"
        tone="success"
        :title="removedBannerTitle"
        description="Sản phẩm đã được lấy khỏi giỏ. Bạn có thể hoàn tác ngay nếu vừa thao tác nhầm."
        action-label="Hoàn tác"
        dismissible
        @action="handleUndoRemove"
        @dismiss="cartStore.dismissLastRemovedItem()"
      />

      <CartEmptyState v-if="!items.length && !isLoading" />

      <div v-else class="cart-page__layout">
        <div class="cart-page__items">
          <div class="cart-page__items-head">
            <div>
              <h2 class="cart-page__items-title">Danh sách sản phẩm</h2>
              <p class="cart-page__items-description">
                Bạn có thể cập nhật số lượng trực tiếp tại đây. Hệ thống sẽ làm mới giá và thành tiền ngay sau mỗi thao tác.
              </p>
            </div>
          </div>

          <article v-if="isLoading" class="cart-page__loading">
            Đang tải giỏ hàng...
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
import { storeToRefs } from "pinia";
import CartAlertBanner from "@/components/Cart/CartAlertBanner.vue";
import CartEmptyState from "@/components/Cart/CartEmptyState.vue";
import CartItemRow from "@/components/Cart/CartItemRow.vue";
import CartProgress from "@/components/Cart/CartProgress.vue";
import CartRecommendations from "@/components/Cart/CartRecommendations.vue";
import CartStickyCheckoutBar from "@/components/Cart/CartStickyCheckoutBar.vue";
import CartSummary from "@/components/Cart/CartSummary.vue";
import { useCartStore } from "@/stores/cartStore";
import { useGlobalToast } from "@/composables/useGlobalToast";

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
const toast = useGlobalToast();
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
    return `${blockingItems.value.length} sản phẩm hiện đang hết hàng hoặc không còn sẵn sàng để bán. Vui lòng rà soát lại trước khi tiếp tục.`;
  }

  const uniqueWarnings = [...new Set(warningItems.value.flatMap((item) => item.warnings || []))];

  if (uniqueWarnings.length === 1) {
    return uniqueWarnings[0];
  }

  return `${warningItems.value.length} sản phẩm đang có thay đổi về giá hoặc trạng thái tồn kho.`;
});

const removedBannerTitle = computed(() => {
  if (!lastRemovedItem.value?.productName) {
    return "Đã xóa sản phẩm khỏi giỏ";
  }

  return `Đã xóa ${lastRemovedItem.value.productName} khỏi giỏ`;
});

const primaryActionLabel = computed(() => {
  if (!items.value.length) {
    return "Giỏ đang trống";
  }

  return canCheckout.value ? "Tiến hành đặt hàng" : "Kiểm tra giỏ hàng";
});

const summaryHelperText = computed(() => {
  if (!items.value.length) {
    return "Thêm sản phẩm để bắt đầu bước tiếp theo.";
  }

  if (!canCheckout.value) {
    return "Một số sản phẩm chưa sẵn sàng. Mình sẽ đưa bạn tới đúng vị trí cần kiểm tra trong giỏ.";
  }

  return "Luồng thông tin nhận hàng và thanh toán sẽ được nối sang bước tiếp theo của dự án.";
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
    toast.error(error?.data?.message || "Không thể cập nhật số lượng sản phẩm.");
  }
};

const handleRemoveItem = async (itemId) => {
  try {
    await cartStore.removeItem(itemId);
  } catch (error) {
    toast.error(error?.data?.message || "Không thể xóa sản phẩm khỏi giỏ hàng.");
  }
};

const handleUndoRemove = async () => {
  try {
    await cartStore.undoLastRemoval();
    toast.success("Đã khôi phục sản phẩm vào giỏ hàng.");
  } catch (error) {
    toast.error(error?.data?.message || "Không thể khôi phục sản phẩm vừa xóa.");
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

  toast.info(
    "Luồng checkout đang được hoàn thiện. Cart đã sẵn sàng để nối sang bước thông tin và thanh toán ở phase tiếp theo.",
  );
};

const handleClearCart = async () => {
  try {
    await cartStore.clearCart();
    toast.success("Giỏ hàng đã được làm trống.");
  } catch (error) {
    toast.error(error?.data?.message || "Không thể làm trống giỏ hàng.");
  }
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
    padding-bottom: 110px;
  }

  .cart-page__layout {
    grid-template-columns: 1fr;
  }

  .cart-page__items-head {
    padding: 18px;
  }
}
</style>
