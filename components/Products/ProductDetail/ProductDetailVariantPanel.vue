<template>
  <section>
    <div class="selector-block">
      <p class="selector-title">Phiên bản</p>
      <div class="option-grid">
        <button
          v-for="item in product.storageOptions"
          :key="item.label"
          type="button"
          class="option-chip"
          :class="{ active: item.active }"
        >
          <span>{{ item.label }}</span>
          <span v-if="item.active" class="corner-check">
            <i class="bi bi-check-lg"></i>
          </span>
        </button>
      </div>
    </div>

    <div class="selector-block">
      <p class="selector-title">Màu sắc</p>
      <div class="color-grid">
        <button
          v-for="item in product.colors"
          :key="item.name"
          type="button"
          class="color-item"
          :class="{ active: item.active, disabled: !item.available }"
        >
          <img :src="item.image" :alt="item.name" />
          <div class="color-copy">
            <strong>{{ item.name }}</strong>
            <span>{{ formatPrice(item.price) }}</span>
          </div>
          <span v-if="item.active" class="corner-check">
            <i class="bi bi-check-lg"></i>
          </span>
        </button>
      </div>
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
.selector-block {
  margin-bottom: 0.95rem;
}

.selector-title {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
}

.option-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem;
}

.option-chip {
  position: relative;
  min-height: 42px;
  border: 1px solid #dbe4f0;
  background: #fff;
  border-radius: 10px;
  padding: 0.75rem;
  font-size: 0.92rem;
  color: #111827;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-chip.active {
  border-color: #ef4444;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.65rem;
}

.color-item {
  position: relative;
  display: grid;
  grid-template-columns: 38px 1fr;
  gap: 0.5rem;
  align-items: center;
  border: 1px solid #dbe4f0;
  background: #fff;
  border-radius: 10px;
  padding: 0.45rem 0.55rem;
  text-align: left;
}

.color-item.active {
  border-color: #ef4444;
}

.color-item.disabled {
  opacity: 0.55;
}

.color-item img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 6px;
}

.color-copy strong {
  display: block;
  color: #111827;
  font-size: 0.9rem;
  line-height: 1.1;
}

.color-copy span {
  color: #6b7280;
  font-size: 0.8rem;
}

.corner-check {
  position: absolute;
  top: -1px;
  right: -1px;
  width: 18px;
  height: 18px;
  border-radius: 0 9px 0 9px;
  background: #ef4444;
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 0.65rem;
}

@media (max-width: 991.98px) {
  .option-grid,
  .color-grid {
    grid-template-columns: 1fr;
  }
}
</style>
