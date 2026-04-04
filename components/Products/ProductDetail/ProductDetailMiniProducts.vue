<template>
  <section class="detail-card p-3 p-lg-4">
    <div class="section-head">
      <h2>{{ title }}</h2>
    </div>

    <div class="mini-grid">
      <article v-for="item in items" :key="item.name" class="mini-card">
        <img :src="item.image" :alt="item.name" />
        <strong>{{ item.name }}</strong>
        <p>{{ formatPrice(item.price) }}</p>
        <span class="mini-link">Thêm vào giỏ</span>
      </article>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  items: {
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

.section-head h2 {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
}

.mini-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.mini-card {
  border: 1px solid #e2ebf6;
  border-radius: 12px;
  padding: 0.7rem;
  background: #fff;
}

.mini-card img {
  width: 100%;
  height: 88px;
  object-fit: contain;
  margin-bottom: 0.45rem;
}

.mini-card strong {
  display: block;
  font-size: 0.82rem;
  color: #0f172a;
  line-height: 1.4;
  min-height: 2.3rem;
}

.mini-card p {
  margin: 0.35rem 0;
  color: #d70018;
  font-weight: 700;
  font-size: 0.84rem;
}

.mini-link {
  color: #ef4444;
  font-size: 0.76rem;
  font-weight: 700;
}

@media (max-width: 991.98px) {
  .mini-grid {
    grid-template-columns: 1fr;
  }
}
</style>
