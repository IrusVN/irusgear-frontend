<template>
  <section class="address-section" aria-labelledby="address-heading">
    <div class="address-section__header">
      <div class="address-section__header-row">
        <h2 id="address-heading" class="address-section__title">
          <i class="bi bi-geo-alt"></i>
          {{ $t("checkout.deliveryAddress") }}
        </h2>
        <button
          v-if="checkoutStore.savedAddresses.length > 0 && !checkoutStore.isEditingAddress"
          type="button"
          class="address-section__add-btn"
          @click="checkoutStore.openAddressForm()"
        >
          <i class="bi bi-plus-lg"></i>
          {{ $t("checkout.addNewAddress") }}
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div
      v-if="checkoutStore.addressesLoading"
      class="address-section__carousel-wrapper"
    >
      <div class="swiper-container address-swiper">
        <div class="swiper-wrapper">
          <div
            v-for="i in 2"
            :key="i"
            class="swiper-slide address-section__skeleton-card"
          ></div>
        </div>
      </div>
    </div>

    <!-- Address list -->
    <div
      v-else-if="checkoutStore.savedAddresses.length > 0 && !checkoutStore.isEditingAddress"
      class="address-section__carousel-wrapper"
    >
      <div ref="swiperEl" class="swiper-container address-swiper">
        <div class="swiper-wrapper">
          <AddressCard
            v-for="address in checkoutStore.savedAddresses"
            :key="address.id"
            class="swiper-slide"
            :address="address"
            :selected="String(address.id) === String(checkoutStore.selectedAddressId)"
            @select="checkoutStore.selectAddress(address.id)"
            @edit="checkoutStore.openAddressForm(address)"
            @delete="handleDeleteAddress(address.id)"
            @set-default="checkoutStore.setDefaultAddress(address.id)"
          />
        </div>

        <button
          ref="prevBtn"
          type="button"
          class="address-swiper__nav address-swiper__nav--prev"
          aria-label="Địa chỉ trước"
        >
          <i class="bi bi-chevron-left"></i>
        </button>
        <button
          ref="nextBtn"
          type="button"
          class="address-swiper__nav address-swiper__nav--next"
          aria-label="Địa chỉ tiếp theo"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!checkoutStore.isEditingAddress"
      class="address-section__empty"
    >
      <div class="address-section__empty-icon">
        <i class="bi bi-map"></i>
      </div>
      <p class="address-section__empty-text">{{ $t("checkout.noAddress") }}</p>
      <button
        type="button"
        class="address-section__add-btn"
        @click="checkoutStore.openAddressForm()"
      >
        <i class="bi bi-plus-lg"></i>
        {{ $t("checkout.addNewAddress") }}
      </button>
    </div>

    <!-- Address form -->
    <AddressForm
      v-if="checkoutStore.isEditingAddress"
      :saving="checkoutStore.addressSaving"
      @save="handleSaveAddress"
      @cancel="checkoutStore.closeAddressForm()"
    />
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { toast } from "vue-sonner";
import { useCheckoutStore } from "@/stores/checkoutStore";
import AddressCard from "@/components/Checkout/AddressCard.vue";
import AddressForm from "@/components/Checkout/AddressForm.vue";

const checkoutStore = useCheckoutStore();
const { t } = useI18n();

const swiperEl = ref(null);
const prevBtn = ref(null);
const nextBtn = ref(null);
let addressSwiper = null;

onMounted(async () => {
  if (!import.meta.client || !swiperEl.value) return;

  const [{ default: Swiper }, modules] = await Promise.all([
    import("swiper"),
    import("swiper/modules"),
  ]);

  const { Navigation } = modules;

  addressSwiper = new Swiper(swiperEl.value, {
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
  if (addressSwiper && !addressSwiper.destroyed) {
    addressSwiper.destroy(true, true);
  }
});

const handleSaveAddress = async (addressData) => {
  try {
    if (checkoutStore.editingAddressId) {
      await checkoutStore.updateAddress(checkoutStore.editingAddressId, addressData);
      toast.success(t("checkout.addressUpdated"));
    } else {
      await checkoutStore.saveAddress(addressData);
      toast.success(t("checkout.addressAdded"));
    }
  } catch (e) {
    const message = e?.message || e?.data?.message || t("checkout.addressError");
    toast.error(message);
  }
};

const handleDeleteAddress = async (id) => {
  try {
    await checkoutStore.deleteAddress(id);
    toast.success(t("checkout.addressDeleted"));
  } catch (e) {
    toast.error(e?.data?.message || t("checkout.deleteError"));
  }
};
</script>

<style scoped>
@import "swiper/css";
@import "swiper/css/navigation";

.address-section {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  overflow: hidden;
  max-width: 870px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

.address-section__header {
  padding: 14px 16px 12px;
  border-bottom: 1px solid #f0f0f2;
}

.address-section__header-row {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.address-section__title {
  align-items: center;
  color: #18181b;
  display: flex;
  font-size: 15px;
  font-weight: 700;
  gap: 6px;
  margin: 0;
}

.address-section__title i {
  color: var(--irus-color-accent);
  font-size: 18px;
}

.address-section__carousel-wrapper {
  position: relative;
}

/* Swiper overrides */
.address-swiper {
  padding: 14px 56px;
  overflow: visible;
}

.address-swiper__nav {
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

.address-swiper__nav i {
  font-weight: 700;
  line-height: 1;
}

.address-swiper__nav--prev {
  left: 8px;
}

.address-swiper__nav--next {
  right: 8px;
}

.address-swiper__nav:hover {
  background: var(--irus-color-accent, #ef4444);
  color: #fff;
  box-shadow:
    0 4px 10px rgba(15, 23, 42, 0.1),
    0 12px 24px rgba(15, 23, 42, 0.18);
  transform: translateY(-50%) scale(1.06);
}

.address-swiper__nav:active {
  transform: translateY(-50%) scale(0.96);
}

.address-swiper__nav:focus-visible {
  box-shadow:
    0 0 0 3px var(--irus-color-accent-soft, rgba(239, 68, 68, 0.25)),
    0 8px 24px rgba(15, 23, 42, 0.12);
}

/* Reset mọi pseudo-arrow do Swiper hoặc framework khác inject để
   không bị overlap với <i class="bi bi-chevron-*"> bên trong button. */
.address-swiper__nav::before,
.address-swiper__nav::after {
  content: none !important;
  display: none !important;
}

.address-swiper .swiper-button-disabled {
  opacity: 0;
  pointer-events: none;
  transform: translateY(-50%) scale(0.85);
}

/* Skeleton */
.address-section__skeleton-card {
  background: linear-gradient(90deg, #f4f4f5 25%, #e4e4e7 50%, #f4f4f5 75%);
  background-size: 200% 100%;
  border-radius: 12px;
  height: 90px;
  min-width: 300px;
  max-width: 300px;
  animation: shimmer 1.5s infinite;
  box-sizing: border-box;
}

/* Address card inside swiper */
.address-swiper .swiper-slide {
  width: 300px;
  min-width: 300px;
  max-width: 300px;
}

.address-section__empty {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 32px 20px;
  text-align: center;
}

.address-section__empty-icon {
  color: #d4d4d8;
  font-size: 48px;
}

.address-section__empty-text {
  color: #71717a;
  font-size: 14px;
  margin: 0;
}

.address-section__add-btn {
  align-items: center;
  background: var(--irus-color-surface-strong);
  border: none;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  font-size: 13px;
  font-weight: 600;
  gap: 6px;
  padding: 8px 14px;
  transition: background 0.15s ease;
  white-space: nowrap;
}

.address-section__add-btn:hover {
  background: #1a1a1a;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (max-width: 767.98px) {
  .address-swiper__nav {
    display: none;
  }

  .address-swiper {
    padding: 10px 14px;
  }
}

@media (max-width: 575.98px) {
  .address-section__header {
    padding: 12px 14px 10px;
  }

  .address-section__title {
    font-size: 14px;
  }

  .address-section__title i {
    font-size: 16px;
  }

  .address-section__add-btn {
    font-size: 12px;
    padding: 6px 12px;
  }

  .address-section__skeleton-card {
    height: 80px;
    min-width: calc(100vw - 48px);
    max-width: calc(100vw - 48px);
  }

  .address-swiper {
    padding: 10px 14px;
  }

  .address-swiper .swiper-slide {
    width: calc(100vw - 48px);
    min-width: calc(100vw - 48px);
    max-width: calc(100vw - 48px);
  }
}
</style>
