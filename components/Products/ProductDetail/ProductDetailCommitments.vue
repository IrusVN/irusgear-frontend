<template>
  <section class="detail-card p-3 p-lg-4">
    <div class="section-head mb-3">
      <h2>Cam kết sản phẩm</h2>
    </div>

    <div class="commit-grid">
      <article v-for="item in items" :key="item.title" class="commit-item">
        <div class="commit-icon">
          <i :class="item.icon"></i>
        </div>
        <div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
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

.section-head h2 {
  font-size: 1.05rem;
  font-weight: 800;
  margin: 0;
  color: #111827;
}

.commit-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.commit-item {
  display: flex;
  gap: 0.9rem;
  padding: 0.95rem;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e5edf7;
}

.commit-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, #ffebe6 0%, #ffe0db 100%);
  border: 1px solid #ffd1c8;
  color: #d70018;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.commit-item h3 {
  font-size: 0.95rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 0.35rem;
}

.commit-item p {
  margin: 0;
  color: #475569;
  line-height: 1.55;
  font-size: 0.9rem;
}

@media (max-width: 767.98px) {
  .commit-grid {
    grid-template-columns: 1fr;
  }
}
</style>
