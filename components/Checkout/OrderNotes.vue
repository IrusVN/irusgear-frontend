<template>
  <section class="order-notes" aria-labelledby="notes-heading">
    <div class="order-notes__header">
      <h2 id="notes-heading" class="order-notes__title">
        <i class="bi bi-card-text"></i>
        {{ $t("checkout.orderNote") }}
      </h2>
      <span class="order-notes__optional">({{ $t("checkout.optional") }})</span>
    </div>

    <div class="order-notes__body">
      <textarea
        v-model="checkoutStore.orderNote"
        class="order-notes__textarea"
        :placeholder="$t('checkout.orderNotePlaceholder')"
        maxlength="500"
        rows="3"
      ></textarea>
      <div class="order-notes__counter">
        <span>{{ checkoutStore.orderNote.length }}/500</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useCheckoutStore } from "@/stores/checkoutStore";

const checkoutStore = useCheckoutStore();
</script>

<style scoped>
.order-notes {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  overflow: hidden;
}

.order-notes__header {
  border-bottom: 1px solid #f0f0f2;
  padding: 18px 20px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.order-notes__title {
  align-items: center;
  color: #18181b;
  display: flex;
  font-size: 17px;
  font-weight: 700;
  gap: 8px;
  margin: 0;
}

.order-notes__title i {
  color: #d70018;
}

.order-notes__optional {
  color: #a1a1aa;
  font-size: 13px;
}

.order-notes__body {
  padding: 14px 20px 16px;
}

.order-notes__textarea {
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.6;
  min-height: 80px;
  padding: 10px 12px;
  resize: vertical;
  transition: border-color 0.15s ease;
  width: 100%;
}

.order-notes__textarea:focus {
  border-color: #d70018;
  box-shadow: 0 0 0 3px rgba(215, 0, 24, 0.1);
  outline: none;
}

.order-notes__counter {
  color: #a1a1aa;
  font-size: 12px;
  text-align: right;
  margin-top: 4px;
}
</style>
