<template>
  <Teleport to="body">
    <div class="modal-backdrop" @click.self="$emit('close')">
      <div class="order-review-dialog" role="dialog" aria-modal="true" :aria-labelledby="'dialog-title'">
        <div class="order-review-dialog__header">
          <h3 id="dialog-title" class="order-review-dialog__title">
            <i class="bi bi-clipboard-check"></i>
            {{ $t("checkout.reviewOrder") }}
          </h3>
          <button type="button" class="order-review-dialog__close" @click="$emit('close')">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="order-review-dialog__body">
          <!-- Address -->
          <div class="review-section">
            <div class="review-section__header">
              <span class="review-section__label">{{ $t("checkout.deliveryAddress") }}</span>
              <button type="button" class="review-section__edit" @click="$emit('close')">
                {{ $t("checkout.change") }}
              </button>
            </div>
            <div v-if="checkoutStore.selectedAddress" class="review-section__content">
              <p class="review-section__name">
                {{ checkoutStore.selectedAddress.name }}
                <span class="review-section__phone">{{ checkoutStore.selectedAddress.phone }}</span>
              </p>
              <p class="review-section__address">{{ fullAddress }}</p>
            </div>
          </div>

          <!-- Delivery -->
          <div class="review-section">
            <div class="review-section__header">
              <span class="review-section__label">{{ $t("checkout.deliveryMethod") }}</span>
              <button type="button" class="review-section__edit" @click="$emit('close')">
                {{ $t("checkout.change") }}
              </button>
            </div>
            <div v-if="checkoutStore.selectedDelivery" class="review-section__content">
              <p>
                {{ checkoutStore.selectedDelivery.name }}
                <span class="review-section__muted">({{ deliveryTime }})</span>
              </p>
              <p class="review-section__fee">
                {{ checkoutStore.finalDeliveryFee > 0 ? formatMoney(checkoutStore.finalDeliveryFee) : $t("checkout.free") }}
              </p>
            </div>
          </div>

          <div class="order-review-dialog__divider"></div>

          <!-- Items -->
          <div class="review-items">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="review-item"
            >
              <img
                :src="item.image || fallbackImage"
                :alt="item.productName"
                class="review-item__image"
                loading="lazy"
              />
              <div class="review-item__info">
                <p class="review-item__name">{{ item.productName }}</p>
                <p v-if="item.selectedOptionsText" class="review-item__options">
                  {{ item.selectedOptionsText }}
                </p>
                <p class="review-item__meta">
                  <span>{{ item.quantity }} × {{ item.price?.formatted || "0đ" }}</span>
                </p>
              </div>
              <span class="review-item__price">
                {{ item.subtotal?.formatted || "0đ" }}
              </span>
            </div>
          </div>

          <div class="order-review-dialog__divider"></div>

          <!-- Pricing summary -->
          <dl class="review-pricing">
            <div class="review-pricing__row">
              <dt>{{ $t("checkout.subtotal") }}</dt>
              <dd>{{ checkoutStore.subtotal?.formatted || "0đ" }}</dd>
            </div>
            <div v-if="checkoutStore.savings?.value > 0" class="review-pricing__row">
              <dt>{{ $t("checkout.discount") }}</dt>
              <dd class="review-pricing__discount">-{{ checkoutStore.savings?.formatted }}</dd>
            </div>
            <div v-if="checkoutStore.voucherDiscount?.value > 0" class="review-pricing__row">
              <dt>{{ $t("checkout.voucher") }}</dt>
              <dd class="review-pricing__discount">-{{ checkoutStore.voucherDiscount?.formatted }}</dd>
            </div>
            <div class="review-pricing__row">
              <dt>{{ $t("checkout.deliveryFee") }}</dt>
              <dd>{{ checkoutStore.finalDeliveryFee > 0 ? '+' + formatMoney(checkoutStore.finalDeliveryFee) : $t("checkout.free") }}</dd>
            </div>
            <div v-if="checkoutStore.insuranceFee?.value > 0" class="review-pricing__row">
              <dt>{{ $t("checkout.insurance") }}</dt>
              <dd>+{{ checkoutStore.insuranceFee?.formatted }}</dd>
            </div>
            <div class="review-pricing__total">
              <strong>{{ $t("checkout.total") }}</strong>
              <strong class="review-pricing__total-value">
                {{ checkoutStore.finalTotal?.formatted || "0đ" }}
              </strong>
            </div>
          </dl>

          <label class="order-review-dialog__terms">
            <input type="checkbox" v-model="checkoutStore.agreedToTerms" />
            <span>
              {{ $t("checkout.agreeTerms") }}
              <a href="#" target="_blank">{{ $t("checkout.terms") }}</a>
              {{ $t("checkout.and") }}
              <a href="#" target="_blank">{{ $t("checkout.shippingPolicy") }}</a>
            </span>
          </label>
        </div>

        <div class="order-review-dialog__footer">
          <button type="button" class="order-review-dialog__btn order-review-dialog__btn--back" @click="$emit('close')">
            <i class="bi bi-arrow-left"></i>
            {{ $t("checkout.back") }}
          </button>
          <button
            type="button"
            class="order-review-dialog__btn order-review-dialog__btn--confirm"
            :disabled="!checkoutStore.agreedToTerms || checkoutStore.isSubmitting"
            @click="$emit('confirm')"
          >
            <span v-if="checkoutStore.isSubmitting">
              <i class="bi bi-arrow-repeat spin"></i>
              {{ $t("checkout.processing") }}
            </span>
            <span v-else>
              <i class="bi bi-check-circle"></i>
              {{ $t("checkout.confirmOrder") }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useCartStore } from "@/stores/cartStore";

defineEmits(["close", "confirm"]);

const checkoutStore = useCheckoutStore();
const cartStore = useCartStore();

const fallbackImage = "https://placehold.co/56x56/f4f4f5/d4d4d8?text=%20";

const fullAddress = computed(() => {
  const addr = checkoutStore.selectedAddress;
  if (!addr) return "";
  // Backend trả province/district/ward là object {code, name}
  const ward = addr.ward?.name || addr.ward;
  const district = addr.district?.name || addr.district;
  const province = addr.province?.name || addr.province;
  const parts = [addr.detail, ward, district, province].filter(Boolean);
  return parts.join(", ");
});

const deliveryTime = computed(() => {
  const d = checkoutStore.selectedDelivery;
  if (!d) return "";
  return d.estimatedDays || d.estimatedHours || d.estimatedText || d.time || "";
});

const formatMoney = (value) => {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
};
</script>

<style scoped>
.modal-backdrop {
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 130;
  padding: 20px;
}

.order-review-dialog {
  background: #fff;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  max-width: 560px;
  overflow: hidden;
  width: 100%;
  animation: slideUp 0.25s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.order-review-dialog__header {
  align-items: center;
  background: #fff7f7;
  border-bottom: 1px solid #f0e0e0;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  padding: 18px 20px;
}

.order-review-dialog__title {
  align-items: center;
  color: #d70018;
  display: flex;
  font-size: 17px;
  font-weight: 700;
  gap: 8px;
  margin: 0;
}

.order-review-dialog__close {
  background: none;
  border: none;
  color: #71717a;
  cursor: pointer;
  padding: 0;
}

.order-review-dialog__body {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px;
}

.review-section {
  padding: 14px 0;
  border-bottom: 1px solid #f0f0f2;
}

.review-section__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.review-section__label {
  color: #71717a;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.review-section__edit {
  background: none;
  border: none;
  color: #d70018;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  padding: 0;
}

.review-section__name {
  color: #18181b;
  font-size: 15px;
  font-weight: 700;
  margin: 0;
}

.review-section__phone {
  color: #71717a;
  font-weight: 400;
  margin-left: 8px;
}

.review-section__address {
  color: #52525b;
  font-size: 13px;
  margin: 4px 0 0;
}

.review-section__muted {
  color: #71717a;
  font-weight: 400;
}

.review-section__fee {
  color: #18181b;
  font-size: 14px;
  font-weight: 600;
  margin: 2px 0 0;
}

.order-review-dialog__divider {
  border-top: 1px solid #ececf1;
}

.review-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px 0;
}

.review-item {
  align-items: flex-start;
  display: flex;
  gap: 12px;
}

.review-item__image {
  border-radius: 8px;
  height: 56px;
  object-fit: cover;
  width: 56px;
  flex-shrink: 0;
}

.review-item__info {
  flex: 1;
  min-width: 0;
}

.review-item__name {
  color: #18181b;
  font-size: 13px;
  font-weight: 500;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.review-item__options {
  color: #71717a;
  font-size: 12px;
  margin: 2px 0 0;
}

.review-item__meta {
  color: #71717a;
  font-size: 12px;
  margin: 4px 0 0;
}

.review-item__price {
  color: #18181b;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.review-pricing {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 14px 0;
}

.review-pricing__row {
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
}

.review-pricing__row dt {
  color: #71717a;
  margin: 0;
}

.review-pricing__row dd {
  color: #18181b;
  font-weight: 600;
  margin: 0;
}

.review-pricing__discount {
  color: #15803d !important;
}

.review-pricing__total {
  align-items: center;
  border-top: 2px solid #18181b;
  display: flex;
  font-size: 16px;
  justify-content: space-between;
  margin-top: 4px;
  padding-top: 10px;
}

.review-pricing__total-value {
  color: #d70018 !important;
  font-size: 22px;
}

.order-review-dialog__terms {
  align-items: flex-start;
  cursor: pointer;
  display: flex;
  font-size: 12px;
  gap: 8px;
  line-height: 1.55;
  color: #52525b;
  padding-bottom: 16px;
}

.order-review-dialog__terms input {
  margin-top: 2px;
  flex-shrink: 0;
}

.order-review-dialog__terms a {
  color: #d70018;
}

.order-review-dialog__footer {
  border-top: 1px solid #ececf1;
  display: flex;
  gap: 10px;
  padding: 14px 20px;
}

.order-review-dialog__btn {
  align-items: center;
  border-radius: 12px;
  cursor: pointer;
  display: inline-flex;
  font-size: 15px;
  font-weight: 700;
  gap: 6px;
  justify-content: center;
  min-height: 48px;
  padding: 10px 20px;
  transition: background 0.15s ease;
}

.order-review-dialog__btn--back {
  background: #f4f4f5;
  border: none;
  color: #52525b;
  flex: 1;
}

.order-review-dialog__btn--back:hover {
  background: #e4e4e7;
}

.order-review-dialog__btn--confirm {
  background: #d70018;
  border: none;
  color: #fff;
  flex: 2;
}

.order-review-dialog__btn--confirm:hover:not(:disabled) {
  background: #b80015;
}

.order-review-dialog__btn--confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spin {
  animation: spin 0.8s linear infinite;
}
</style>
