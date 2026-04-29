<template>
  <section class="address-section" aria-labelledby="address-heading">
    <div class="address-section__header">
      <h2 id="address-heading" class="address-section__title">
        <i class="bi bi-geo-alt"></i>
        {{ $t("checkout.deliveryAddress") }}
      </h2>
    </div>

    <!-- Loading state -->
    <div v-if="checkoutStore.addressesLoading" class="address-section__loading">
      <div v-for="i in 2" :key="i" class="address-section__skeleton-card"></div>
    </div>

    <!-- Address list -->
    <div
      v-else-if="checkoutStore.savedAddresses.length > 0 && !checkoutStore.isEditingAddress"
      class="address-section__list"
    >
      <AddressCard
        v-for="address in checkoutStore.savedAddresses"
        :key="address.id"
        :address="address"
        :selected="String(address.id) === String(checkoutStore.selectedAddressId)"
        @select="checkoutStore.selectAddress(address.id)"
        @edit="checkoutStore.openAddressForm(address)"
        @delete="handleDeleteAddress(address.id)"
        @set-default="checkoutStore.setDefaultAddress(address.id)"
      />
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

    <!-- Add new button (has addresses but not editing) -->
    <button
      v-if="checkoutStore.savedAddresses.length > 0 && !checkoutStore.isEditingAddress"
      type="button"
      class="address-section__add-btn address-section__add-btn--outline"
      @click="checkoutStore.openAddressForm()"
    >
      <i class="bi bi-plus-lg"></i>
      {{ $t("checkout.addNewAddress") }}
    </button>

    <!-- Address form -->
    <AddressForm
      v-if="checkoutStore.isEditingAddress"
      @save="handleSaveAddress"
      @cancel="checkoutStore.closeAddressForm()"
    />
  </section>
</template>

<script setup>
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useGlobalToast } from "@/composables/useGlobalToast";
import AddressCard from "@/components/Checkout/AddressCard.vue";
import AddressForm from "@/components/Checkout/AddressForm.vue";

const checkoutStore = useCheckoutStore();
const toast = useGlobalToast();
const { t } = useI18n();

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
.address-section {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  overflow: hidden;
}

.address-section__header {
  padding: 18px 20px 14px;
  border-bottom: 1px solid #f0f0f2;
}

.address-section__title {
  align-items: center;
  color: #18181b;
  display: flex;
  font-size: 17px;
  font-weight: 700;
  gap: 8px;
  margin: 0;
}

.address-section__title i {
  color: #d70018;
}

.address-section__loading {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 20px;
}

.address-section__skeleton-card {
  background: linear-gradient(90deg, #f4f4f5 25%, #e4e4e7 50%, #f4f4f5 75%);
  background-size: 200% 100%;
  border-radius: 14px;
  height: 110px;
  animation: shimmer 1.5s infinite;
}

.address-section__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 20px;
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
  border-radius: 12px;
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  font-size: 14px;
  font-weight: 600;
  gap: 6px;
  padding: 10px 18px;
  transition: background 0.15s ease;
}

.address-section__add-btn:hover {
  background: #b80015;
}

.address-section__add-btn--outline {
  background: #fff;
  border: 1.5px dashed #d70018;
  color: #d70018;
  margin: 0 20px 16px;
}

.address-section__add-btn--outline:hover {
  background: #fff7f7;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
