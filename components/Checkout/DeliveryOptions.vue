<template>
  <section class="delivery-options" aria-labelledby="delivery-heading">
    <div class="delivery-options__header">
      <h2 id="delivery-heading" class="delivery-options__title">
        <i class="bi bi-truck"></i>
        {{ $t("checkout.deliveryMethod") }}
      </h2>
    </div>

    <!-- Hint khi chưa chọn địa chỉ — options vẫn hiển thị bên dưới để user xem trước -->
    <div v-if="!checkoutStore.selectedAddressId" class="delivery-options__hint">
      <i class="bi bi-info-circle"></i>
      <span>{{ $t("checkout.selectAddressForAccurateFee") }}</span>
    </div>

    <!-- Loading -->
    <div
      v-if="checkoutStore.deliveryLoading && !checkoutStore.deliveryOptions.length"
      class="delivery-options__loading"
    >
      <div v-for="i in 3" :key="i" class="delivery-options__skeleton"></div>
    </div>

    <!-- Options carousel -->
    <div v-else class="delivery-options__carousel-wrapper">
      <div ref="swiperEl" class="swiper-container delivery-swiper">
        <div class="swiper-wrapper">
          <DeliveryOptionCard
            v-for="option in checkoutStore.deliveryOptions"
            :key="option.id"
            class="swiper-slide"
            :option="option"
            :selected="String(option.id) === String(checkoutStore.selectedDeliveryId)"
            @select="checkoutStore.selectDelivery(option.id)"
          />
        </div>

        <button
          ref="prevBtn"
          type="button"
          class="delivery-swiper__nav delivery-swiper__nav--prev"
          aria-label="Phương thức trước"
        >
          <i class="bi bi-chevron-left"></i>
        </button>
        <button
          ref="nextBtn"
          type="button"
          class="delivery-swiper__nav delivery-swiper__nav--next"
          aria-label="Phương thức tiếp theo"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>

      <!-- Time slot picker (when applicable) -->
      <DeliveryTimeSlot
        v-if="checkoutStore.selectedDelivery?.hasTimeSlots"
        :delivery-id="checkoutStore.selectedDeliveryId"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useCheckoutStore } from "@/stores/checkoutStore";
import DeliveryOptionCard from "@/components/Checkout/DeliveryOptionCard.vue";
import DeliveryTimeSlot from "@/components/Checkout/DeliveryTimeSlot.vue";

const checkoutStore = useCheckoutStore();

const swiperEl = ref(null);
const prevBtn = ref(null);
const nextBtn = ref(null);
let deliverySwiper = null;

// Luôn fetch delivery options ngay khi mount, không cần chờ user chọn address.
// Lần đầu sẽ dùng fallback (hoặc default từ BE); khi user chọn address sẽ re-fetch
// để có phí ship chính xác theo địa chỉ.
checkoutStore.fetchDeliveryOptions();

// Watch address — chọn address mới → re-fetch để cập nhật phí ship chính xác
watch(
  () => checkoutStore.selectedAddressId,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      checkoutStore.fetchDeliveryOptions();
    }
  },
);

onMounted(async () => {
  if (!import.meta.client || !swiperEl.value) return;

  const [{ default: Swiper }, modules] = await Promise.all([
    import("swiper"),
    import("swiper/modules"),
  ]);

  const { Navigation } = modules;

  deliverySwiper = new Swiper(swiperEl.value, {
    modules: [Navigation],
    slidesPerView: "auto",
    spaceBetween: 16,
    navigation: {
      nextEl: nextBtn.value,
      prevEl: prevBtn.value,
    },
    observer: true,
    observeParents: true,
  });
});

onUnmounted(() => {
  if (deliverySwiper && !deliverySwiper.destroyed) {
    deliverySwiper.destroy(true, true);
  }
});
</script>

<style scoped>
@import "swiper/css";
@import "swiper/css/navigation";

.delivery-options {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  overflow: hidden;
  width: 870px;
}

.delivery-options__header {
  border-bottom: 1px solid #f0f0f2;
  padding: 18px 20px 14px;
}

.delivery-options__title {
  align-items: center;
  color: #18181b;
  display: flex;
  font-size: 17px;
  font-weight: 700;
  gap: 8px;
  margin: 0;
}

.delivery-options__title i {
  color: var(--irus-color-accent);
}

.delivery-options__hint {
  align-items: center;
  background: #fff7ed;
  border-bottom: 1px solid #fed7aa;
  color: #92400e;
  display: flex;
  font-size: 13px;
  gap: 8px;
  padding: 10px 20px;
}

.delivery-options__hint i {
  color: #d97706;
  flex-shrink: 0;
}

.delivery-options__loading {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 20px;
}

.delivery-options__skeleton {
  background: linear-gradient(90deg, #f4f4f5 25%, #e4e4e7 50%, #f4f4f5 75%);
  background-size: 200% 100%;
  border-radius: 14px;
  height: 76px;
  animation: shimmer 1.5s infinite;
}

.delivery-options__carousel-wrapper {
  position: relative;
}

/* Swiper overrides */
.delivery-swiper {
  padding: 14px 56px;
  overflow: visible;
}

.delivery-swiper__nav {
  align-items: center;
  background: #fff;
  border: 0;
  border-radius: 999px;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.06),
    0 8px 24px rgba(15, 23, 42, 0.12);
  color: #18181b;
  cursor: pointer;
  display: flex;
  font-size: 18px;
  height: 40px;
  justify-content: center;
  outline: 0;
  padding: 0;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: background 0.18s ease, box-shadow 0.18s ease,
    transform 0.18s ease, color 0.18s ease;
  width: 40px;
  z-index: 10;
}

.delivery-swiper__nav i {
  font-weight: 700;
  line-height: 1;
}

.delivery-swiper__nav--prev {
  left: 8px;
}

.delivery-swiper__nav--next {
  right: 8px;
}

.delivery-swiper__nav:hover {
  background: var(--irus-color-accent, #ef4444);
  color: #fff;
  box-shadow:
    0 4px 10px rgba(15, 23, 42, 0.1),
    0 12px 24px rgba(15, 23, 42, 0.18);
  transform: translateY(-50%) scale(1.06);
}

.delivery-swiper__nav:active {
  transform: translateY(-50%) scale(0.96);
}

.delivery-swiper__nav:focus-visible {
  box-shadow:
    0 0 0 3px var(--irus-color-accent-soft, rgba(239, 68, 68, 0.25)),
    0 8px 24px rgba(15, 23, 42, 0.12);
}

/* Reset mọi pseudo-arrow do Swiper hoặc framework khác inject để
   không bị overlap với <i class="bi bi-chevron-*"> bên trong button. */
.delivery-swiper__nav::before,
.delivery-swiper__nav::after {
  content: none !important;
  display: none !important;
}

.delivery-swiper .swiper-button-disabled {
  opacity: 0;
  pointer-events: none;
  transform: translateY(-50%) scale(0.85);
}

.delivery-swiper .swiper-slide {
  width: 320px;
  min-width: 320px;
  max-width: 320px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (max-width: 767.98px) {
  .delivery-swiper__nav {
    display: none;
  }

  .delivery-swiper {
    padding: 10px 14px;
  }
}

@media (max-width: 575.98px) {
  .delivery-swiper .swiper-slide {
    width: calc(100vw - 28px);
    min-width: calc(100vw - 28px);
    max-width: calc(100vw - 28px);
  }

  .delivery-swiper {
    padding: 10px 14px;
  }

  .delivery-options__header {
    padding: 14px 16px 12px;
  }

  .delivery-options__title {
    font-size: 15px;
  }

  .delivery-options__empty,
  .delivery-options__loading {
    padding: 12px 16px;
  }
}
</style>
