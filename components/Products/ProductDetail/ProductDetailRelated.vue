<template>
  <section class="detail-card p-3 p-lg-4">
    <div class="section-head">
      <div class="tab-row">
        <button type="button" class="tab active">Sản phẩm tương tự</button>
        <button type="button" class="tab">Tham khảo hàng cũ</button>
      </div>
    </div>

    <div class="related-grid">
      <article v-for="item in products" :key="item.name" class="related-card">
        <div class="badge-row">
          <span class="sale-badge">Giảm</span>
          <span class="installment-badge">Trả góp 0%</span>
        </div>
        <img :src="item.image" :alt="item.name" class="related-image" />
        <h3>{{ item.name }}</h3>
        <div class="price-row">
          <strong>{{ formatPrice(item.price) }}</strong>
          <del>{{ formatPrice(Math.round(item.price * 1.1)) }}</del>
        </div>
        <p class="gift-line">Tặng gói ưu đãi hoặc trợ giá lên đời tùy sản phẩm</p>
        <div class="meta-row">
          <span><i class="bi bi-star-fill"></i> 5</span>
          <span class="fav-link"><i class="bi bi-heart"></i> Yêu thích</span>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
defineProps({
  products: {
    type: Array,
    required: true,
  },
});

const formatPrice = (value) => `${new Intl.NumberFormat("vi-VN").format(Number(value) || 0)}đ`;
</script>

<style scoped>
.detail-card {
  background: #fff;
  border: 1px solid #e5edf7;
  border-radius: 16px;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
}

.tab-row {
  display: flex;
  gap: 1.25rem;
  border-bottom: 1px solid #edf1f7;
  margin-bottom: 1rem;
}

.tab {
  border: 0;
  background: transparent;
  padding: 0 0 0.7rem;
  color: #64748b;
  font-weight: 600;
}

.tab.active {
  color: #ef4444;
  border-bottom: 2px solid #ef4444;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.75rem;
}

.related-card {
  border: 1px solid #eceff3;
  border-radius: 12px;
  padding: 0.7rem;
  background: #fff;
}

.badge-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.sale-badge,
.installment-badge {
  font-size: 0.72rem;
  border-radius: 8px;
  padding: 0.18rem 0.45rem;
  font-weight: 700;
}

.sale-badge {
  background: #dc2626;
  color: #fff;
}

.installment-badge {
  background: #e8f0ff;
  color: #3b82f6;
}

.related-image {
  width: 100%;
  height: 168px;
  object-fit: contain;
  margin-bottom: 0.6rem;
}

.related-card h3 {
  font-size: 0.92rem;
  line-height: 1.45;
  min-height: 3rem;
  margin: 0 0 0.5rem;
  color: #1f2937;
  font-weight: 700;
}

.price-row strong {
  color: #ef4444;
  font-size: 0.95rem;
}

.price-row del {
  color: #9ca3af;
  font-size: 0.8rem;
  margin-left: 0.35rem;
}

.gift-line {
  background: #f3f4f6;
  border-radius: 10px;
  padding: 0.45rem;
  min-height: 3rem;
  color: #4b5563;
  font-size: 0.78rem;
  margin: 0.55rem 0;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  color: #2563eb;
  font-size: 0.88rem;
}

.meta-row i.bi-star-fill {
  color: #fbbf24;
}

@media (max-width: 1399.98px) {
  .related-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 991.98px) {
  .related-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
