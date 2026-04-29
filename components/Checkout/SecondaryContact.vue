<template>
  <section class="secondary-contact" aria-labelledby="secondary-heading">
    <button
      type="button"
      class="secondary-contact__toggle"
      @click="expanded = !expanded"
    >
      <div class="secondary-contact__toggle-left">
        <i class="bi bi-person-plus"></i>
        <span>{{ $t("checkout.deliverToOther") }}</span>
      </div>
      <i :class="expanded ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
    </button>

    <div v-if="expanded" class="secondary-contact__body">
      <label class="secondary-contact__checkbox">
        <input type="checkbox" v-model="checkoutStore.secondaryContact.enabled" />
        <span>{{ $t("checkout.enableSecondary") }}</span>
      </label>

      <div v-if="checkoutStore.secondaryContact.enabled" class="secondary-contact__fields">
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
import { ref } from "vue";
import { useCheckoutStore } from "@/stores/checkoutStore";

const checkoutStore = useCheckoutStore();
const expanded = ref(false);
</script>

<style scoped>
.secondary-contact {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  overflow: hidden;
}

.secondary-contact__toggle {
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: 600;
  gap: 8px;
  justify-content: space-between;
  padding: 16px 20px;
  width: 100%;
  color: #18181b;
}

.secondary-contact__toggle-left {
  align-items: center;
  display: flex;
  gap: 8px;
  color: #d70018;
}

.secondary-contact__toggle i:last-child {
  color: #71717a;
}

.secondary-contact__body {
  border-top: 1px solid #f0f0f2;
  padding: 14px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.secondary-contact__checkbox {
  align-items: center;
  cursor: pointer;
  display: flex;
  font-size: 13px;
  gap: 8px;
  color: #18181b;
}

.secondary-contact__checkbox input {
  width: 16px;
  height: 16px;
}

.secondary-contact__checkbox--sub {
  color: #71717a;
  font-size: 12px;
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
  font-size: 12px;
  font-weight: 600;
  color: #52525b;
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
