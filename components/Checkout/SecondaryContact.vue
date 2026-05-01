<template>
  <section class="secondary-contact" aria-labelledby="secondary-heading">
    <label class="secondary-contact__checkbox-row">
      <input type="checkbox" v-model="checkoutStore.secondaryContact.enabled" />
      <i class="bi bi-person-plus"></i>
      <span class="secondary-contact__label fw-semibold">{{ $t("checkout.deliverToOther") }}</span>
    </label>

    <div v-if="checkoutStore.secondaryContact.enabled" class="secondary-contact__body">
      <div class="secondary-contact__fields">
        <div class="secondary-contact__row">
          <div class="secondary-contact__field">
            <label class="secondary-contact__label">{{ $t("checkout.receiverName") }}</label>
            <input
              v-model="checkoutStore.secondaryContact.name"
              type="text"
              class="secondary-contact__input"
              :placeholder="$t('checkout.receiverNamePlaceholder')"
            />
          </div>
          <div class="secondary-contact__field">
            <label class="secondary-contact__label">{{ $t("checkout.phone") }}</label>
            <input
              v-model="checkoutStore.secondaryContact.phone"
              type="tel"
              class="secondary-contact__input"
              :placeholder="$t('checkout.phonePlaceholder')"
            />
          </div>
        </div>

        <label class="secondary-contact__checkbox secondary-contact__checkbox--sub">
          <input type="checkbox" v-model="checkoutStore.secondaryContact.notifyOriginal" />
          <span>{{ $t("checkout.notifyOriginal") }}</span>
        </label>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useCheckoutStore } from "@/stores/checkoutStore";

const checkoutStore = useCheckoutStore();
</script>

<style scoped>
.secondary-contact {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  overflow: hidden;
}

.secondary-contact__checkbox-row {
  align-items: center;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: 600;
  gap: 8px;
  padding: 16px 20px;
  color: #18181b;
}

.secondary-contact__checkbox-row input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #d70018;
}

.secondary-contact__checkbox-row i {
  color: #d70018;
}

.secondary-contact__body {
  border-top: 1px solid #f0f0f2;
  padding: 14px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.secondary-contact__checkbox--sub {
  align-items: center;
  cursor: pointer;
  display: flex;
  font-size: 12px;
  gap: 8px;
  color: #71717a;
}

.secondary-contact__checkbox--sub input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.secondary-contact__fields {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.secondary-contact__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.secondary-contact__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.secondary-contact__label {
  font-size: 14px;
}

.secondary-contact__input {
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  font-size: 14px;
  min-height: 40px;
  padding: 6px 10px;
  transition: border-color 0.15s ease;
  width: 100%;
}

.secondary-contact__input:focus {
  border-color: #d70018;
  outline: none;
}

@media (max-width: 575.98px) {
  .secondary-contact__row {
    grid-template-columns: 1fr;
  }
}
</style>
