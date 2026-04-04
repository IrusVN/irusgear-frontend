<template>
  <div class="sticky-buy-bar d-none d-lg-flex">
    <div class="product-mini">
      <img :src="product.featureImage" :alt="product.name" />
      <div>
        <strong>{{ product.name }}</strong>
      </div>
    </div>
    <div class="price-mini">
      <strong>{{ formatPrice(product.price) }}</strong>
      <del>{{ formatPrice(product.originalPrice) }}</del>
    </div>
    <button type="button" class="ghost-btn">Trả góp 0%</button>
    <button type="button" class="buy-btn">Mua Ngay</button>
    <button type="button" class="icon-btn"><i class="bi bi-cart-plus"></i></button>
  </div>
</template>

<script setup>
defineProps({
  product: { type: Object, required: true },
});

const formatPrice = (value) => `${new Intl.NumberFormat("vi-VN").format(Number(value) || 0)}đ`;
</script>

<style scoped>
.sticky-buy-bar {
  position: fixed;
  left: 50%;
  bottom: 12px;
  transform: translateX(-50%);
  width: min(980px, calc(100vw - 48px));
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  box-shadow: 0 12px 36px rgba(15, 23, 42, 0.18);
  z-index: 40;
  display: grid;
  grid-template-columns: 1.8fr auto auto auto auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.8rem 1rem;
}

.product-mini {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 0;
}

.product-mini img {
  width: 42px;
  height: 42px;
  object-fit: contain;
}

.product-mini strong {
  font-size: 0.95rem;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.price-mini strong {
  color: #ef4444;
  display: block;
}

.price-mini del {
  color: #9ca3af;
  font-size: 0.78rem;
}

.ghost-btn,
.buy-btn,
.icon-btn {
  border-radius: 12px;
  font-weight: 700;
  padding: 0.7rem 1rem;
}

.ghost-btn {
  border: 1px solid #93c5fd;
  background: #fff;
  color: #2563eb;
}

.buy-btn {
  border: 0;
  background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
  color: #fff;
}

.icon-btn {
  border: 1px solid #fda4af;
  background: #fff;
  color: #ef4444;
}
</style>
