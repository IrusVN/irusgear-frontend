<template>
  <section class="detail-card p-3">
    <div class="title-row">
      <div class="title-copy">
        <h1 class="product-title">{{ product.name }}</h1>
        <div class="meta-row">
          <div class="rating-chip">
            <i class="bi bi-star-fill"></i>
            <span>{{ product.rating.toFixed(1) }}</span>
            <span class="muted">({{ product.reviewsCount }} đánh giá)</span>
          </div>
        </div>
      </div>

      <div class="action-grid">
        <button
          v-for="item in product.actionItems"
          :key="item.label"
          type="button"
          class="action-item"
        >
          <i :class="item.icon"></i>
          <span>{{ item.label }}</span>
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
</script>

<style scoped>
.detail-card {
  background: #fff;
  border: 1px solid #e5edf7;
  border-radius: 16px;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
}

.title-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.title-copy {
  min-width: 0;
}

.product-title {
  margin: 0 0 0.35rem;
  font-size: clamp(1rem, 1.8vw, 1.35rem);
  font-weight: 800;
  color: #111827;
  line-height: 1.3;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.rating-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #334155;
  font-size: 0.85rem;
  font-weight: 600;
}

.rating-chip i {
  color: #f59e0b;
  font-size: 0.82rem;
}

.muted {
  color: #64748b;
  font-weight: 500;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.65rem;
  min-width: 360px;
}

.action-item {
  border: 0;
  background: transparent;
  display: grid;
  justify-items: center;
  gap: 0.3rem;
  color: #2563eb;
  font-size: 0.78rem;
  font-weight: 600;
}

.action-item i {
  font-size: 1.05rem;
}

@media (max-width: 767.98px) {
  .title-row {
    flex-direction: column;
  }

  .action-grid {
    min-width: 100%;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
