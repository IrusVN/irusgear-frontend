<template>
  <div class="review-content">
    <!-- Address -->
    <section class="review-section">
      <div class="review-section__header">
        <span class="review-section__label">{{ $t("checkout.deliveryAddress") }}</span>
        <button type="button" class="review-section__edit" @click="$emit('edit')">
          {{ $t("checkout.change") }}
        </button>
      </div>
      <div v-if="address" class="review-section__content">
        <p class="review-section__name">
          {{ address.name }}
          <span class="review-section__phone">{{ address.phone }}</span>
        </p>
        <p class="review-section__address">{{ fullAddress }}</p>
      </div>
    </section>

    <!-- Delivery -->
    <section class="review-section">
      <div class="review-section__header">
        <span class="review-section__label">{{ $t("checkout.deliveryMethod") }}</span>
        <button type="button" class="review-section__edit" @click="$emit('edit')">
          {{ $t("checkout.change") }}
        </button>
      </div>
      <div v-if="delivery" class="review-section__content">
        <p>
          {{ delivery.name }}
          <span v-if="deliveryTime" class="review-section__muted">({{ deliveryTime }})</span>
        </p>
        <p class="review-section__fee">
          {{ deliveryFee > 0 ? formatMoney(deliveryFee) : $t("checkout.free") }}
        </p>
      </div>
    </section>

    <div class="review-divider"></div>

    <!-- Items -->
    <section class="review-items">
      <article
        v-for="item in items"
        :key="item.id"
        class="review-item"
      >
        <img
          :src="item.thumbnail || fallbackImage"
          :alt="item.productName"
          class="review-item__image"
          loading="lazy"
        >
        <div class="review-item__info">
          <p class="review-item__name">{{ item.productName }}</p>
          <p v-if="getOptionsText(item)" class="review-item__options">
            {{ getOptionsText(item) }}
          </p>
          <p class="review-item__meta">
            <span>{{ item.quantity }} × {{ item.unitPrice?.formatted || "0đ" }}</span>
          </p>
        </div>
        <span class="review-item__price">
          {{ item.currentLineTotal?.formatted || "0đ" }}
        </span>
      </article>
    </section>

    <div class="review-divider"></div>

    <!-- Pricing -->
    <dl class="review-pricing">
      <div class="review-pricing__row">
        <dt>{{ $t("checkout.subtotal") }}</dt>
        <dd>{{ pricing.subtotal?.formatted || "0đ" }}</dd>
      </div>
      <div v-if="(pricing.savings?.value || 0) > 0" class="review-pricing__row">
        <dt>{{ $t("checkout.discount") }}</dt>
        <dd class="review-pricing__discount">-{{ pricing.savings?.formatted }}</dd>
      </div>
      <div v-if="(pricing.voucherDiscount?.value || 0) > 0" class="review-pricing__row">
        <dt>{{ $t("checkout.voucher") }}</dt>
        <dd class="review-pricing__discount">-{{ pricing.voucherDiscount?.formatted }}</dd>
      </div>
      <div class="review-pricing__row">
        <dt>{{ $t("checkout.deliveryFee") }}</dt>
        <dd>
          {{ pricing.deliveryFee > 0 ? '+' + formatMoney(pricing.deliveryFee) : $t("checkout.free") }}
        </dd>
      </div>
      <div v-if="(pricing.insuranceFee?.value || 0) > 0" class="review-pricing__row">
        <dt>{{ $t("checkout.insurance") }}</dt>
        <dd>+{{ pricing.insuranceFee?.formatted }}</dd>
      </div>
      <div class="review-pricing__total">
        <strong>{{ $t("checkout.total") }}</strong>
        <strong class="review-pricing__total-value">
          {{ pricing.finalTotal?.formatted || "0đ" }}
        </strong>
      </div>
    </dl>

    <!-- Terms -->
    <label class="review-terms">
      <input
        type="checkbox"
        :checked="agreed"
        @change="$emit('update:agreed', $event.target.checked)"
      >
      <span>
        {{ $t("checkout.agreeTerms") }}
        <a href="#" target="_blank">{{ $t("checkout.terms") }}</a>
        {{ $t("checkout.and") }}
        <a href="#" target="_blank">{{ $t("checkout.shippingPolicy") }}</a>
      </span>
    </label>
  </div>
</template>

<script setup>
defineEmits(["edit", "update:agreed"]);

defineProps({
  address: { type: Object, default: null },
  delivery: { type: Object, default: null },
  deliveryFee: { type: Number, default: 0 },
  deliveryTime: { type: String, default: "" },
  fullAddress: { type: String, default: "" },
  items: { type: Array, default: () => [] },
  pricing: {
    type: Object,
    default: () => ({}),
  },
  agreed: { type: Boolean, default: false },
});

const fallbackImage = "https://placehold.co/56x56/f4f4f5/d4d4d8?text=%20";

const formatMoney = (value) => `${new Intl.NumberFormat("vi-VN").format(value)}đ`;

const getOptionsText = (item) => {
  if (!item?.selectedOptions) return null;
  return Object.values(item.selectedOptions).join(", ");
};
</script>

<style scoped>
.review-content {
  display: flex;
  flex-direction: column;
}

.review-section {
  border-bottom: 1px solid #f0f0f2;
  padding: 14px 0;
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
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.review-section__edit {
  background: none;
  border: 0;
  color: var(--irus-color-accent);
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

.review-divider {
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
  flex-shrink: 0;
  height: 56px;
  object-fit: cover;
  width: 56px;
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
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 700;
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
  color: var(--irus-color-accent) !important;
  font-size: 22px;
}

.review-terms {
  align-items: flex-start;
  color: #52525b;
  cursor: pointer;
  display: flex;
  font-size: 12px;
  gap: 8px;
  line-height: 1.55;
  padding-bottom: 16px;
}

.review-terms input {
  flex-shrink: 0;
  margin-top: 2px;
}

.review-terms a {
  color: var(--irus-color-accent);
}

@media (max-width: 575.98px) {
  .review-section {
    padding: 12px 0;
  }

  .review-item__image {
    height: 48px;
    width: 48px;
  }

  .review-item__name {
    font-size: 13px;
  }

  .review-pricing__total-value {
    font-size: 20px;
  }
}
</style>
