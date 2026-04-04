<template>
  <section class="price-panel">
    <div class="price-panel__top">
      <div class="price-col">
        <div class="headline-price">{{ formatPrice(product.price) }}</div>
        <del class="sub-price">{{ formatPrice(product.originalPrice) }}</del>
      </div>

      <div class="price-divider-copy">Hoặc</div>

      <div class="price-col">
        <div class="trade-title">Thu cũ lên đời chỉ từ</div>
        <div class="headline-price trade">{{ formatPrice(product.tradeInPrice) }}</div>
        <div class="trade-copy">
          Trợ giá đến <strong>{{ product.tradeInBonus }}</strong>
          <a href="#">Định giá ngay</a>
        </div>
      </div>
    </div>

    <div class="price-panel__bottom">
      <span class="price-panel__icon">🎉</span>
      <span>
        Tiết kiệm lên đến <strong>{{ formatPrice(product.memberSaving) }}</strong> cho Smember
        <a href="#">Kiểm tra ngay</a>
      </span>
    </div>
  </section>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const formatPrice = (value) => {
  const amount = Number(value) || 0;
  return `${new Intl.NumberFormat("vi-VN").format(amount)}đ`;
};
</script>

<style scoped>
.price-panel {
  border: 1.5px solid #8cb5ff;
  border-radius: 16px;
  background: linear-gradient(180deg, #f7fbff 0%, #ffffff 100%);
  overflow: hidden;
  margin-bottom: 0.95rem;
}

.price-panel__top {
  display: grid;
  grid-template-columns: 1fr 46px 1fr;
  align-items: center;
  padding: 0.85rem 1rem 0.7rem;
}

.price-col {
  text-align: center;
}

.headline-price {
  font-size: 1.05rem;
  font-weight: 800;
  color: #111827;
  line-height: 1.1;
}

.sub-price {
  display: block;
  margin-top: 0.15rem;
  color: #9ca3af;
  font-size: 0.78rem;
}

.price-divider-copy {
  text-align: center;
  color: #9ca3af;
  font-size: 0.8rem;
}

.trade-title {
  color: #3b82f6;
  font-size: 0.82rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.trade-copy {
  margin-top: 0.22rem;
  font-size: 0.76rem;
  color: #475569;
}

.trade-copy strong {
  color: #ef4444;
}

.trade-copy a,
.price-panel__bottom a {
  color: #ef4444;
  text-decoration: none;
  font-weight: 600;
}

.price-panel__bottom {
  border-top: 1px dashed #bfd6ff;
  padding: 0.65rem 1rem 0.72rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  color: #475569;
  font-size: 0.82rem;
  flex-wrap: wrap;
}

.price-panel__icon {
  font-size: 0.95rem;
}

@media (max-width: 991.98px) {
  .price-panel__top {
    grid-template-columns: 1fr;
    gap: 0.7rem;
  }

  .price-divider-copy {
    display: none;
  }
}
</style>
