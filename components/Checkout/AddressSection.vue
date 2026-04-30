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
          class="swiper-button-prev address-swiper__prev"
          aria-label="Previous"
        >
          <ArrowIcon direction="left" :size="12" />
        </button>
        <button
          ref="nextBtn"
          class="swiper-button-next address-swiper__next"
          aria-label="Next"
        >
          <ArrowIcon direction="right" :size="12" />
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
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useGlobalToast } from "@/composables/useGlobalToast";
import AddressCard from "@/components/Checkout/AddressCard.vue";
import AddressForm from "@/components/Checkout/AddressForm.vue";
import ArrowIcon from "@/components/Icons/ArrowIcon.vue";

const checkoutStore = useCheckoutStore();
const toast = useGlobalToast();
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
    toast.error(e?.data?.message || t("checkout.addressError"));
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
  max-width: 950px;
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
  color: #d70018;
  font-size: 18px;
}

.address-section__carousel-wrapper {
  position: relative;
}

/* Swiper overrides */
.address-swiper {
  padding: 12px 48px;
  overflow: visible;
}

.address-swiper__prev,
.address-swiper__next {
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

.address-swiper__prev {
  left: 8px;
}

.address-swiper__next {
  right: 8px;
}

.address-swiper__prev:hover,
.address-swiper__next:hover {
  background: #f4f4f5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.address-swiper__prev::after,
.address-swiper__next::after {
  display: none !important;
}

.address-swiper .swiper-button-disabled {
  opacity: 0;
  pointer-events: none;
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
  background: #d70018;
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
  background: #b80015;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (max-width: 767.98px) {
  .address-swiper__prev,
  .address-swiper__next {
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

  .address-swiper .swiper-slide {
    width: calc(100vw - 48px);
    min-width: calc(100vw - 48px);
    max-width: calc(100vw - 48px);
  }
}
</style>
