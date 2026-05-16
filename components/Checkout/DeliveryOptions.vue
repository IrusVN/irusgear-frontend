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
          class="swiper-button-prev delivery-swiper__prev"
          aria-label="Previous"
        >
          <ArrowIcon direction="left" :size="12" />
        </button>
        <button
          ref="nextBtn"
          class="swiper-button-next delivery-swiper__next"
          aria-label="Next"
        >
          <ArrowIcon direction="right" :size="12" />
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
import ArrowIcon from "@/components/Icons/ArrowIcon.vue";

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
    spaceBetween: 10,
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
  padding: 12px 48px;
  overflow: visible;
}

.delivery-swiper__prev,
.delivery-swiper__next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 1.5px solid #e4e4e7;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  color: #52525b;
  padding: 0;
  transition: background 0.15s ease, box-shadow 0.15s ease;
}

.delivery-swiper__prev {
  left: 8px;
}

.delivery-swiper__next {
  right: 8px;
}

.delivery-swiper__prev:hover,
.delivery-swiper__next:hover {
  background: #f4f4f5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.delivery-swiper__prev::after,
.delivery-swiper__next::after {
  display: none !important;
}

.delivery-swiper .swiper-button-disabled {
  opacity: 0;
  pointer-events: none;
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
  .delivery-swiper__prev,
  .delivery-swiper__next {
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
