<template>
  <section class="detail-card p-3 p-lg-4">
    <div class="section-head mb-3">
      <h2>Thông số kỹ thuật</h2>
      <button type="button" class="ghost-button">Xem tất cả</button>
    </div>

    <div class="spec-table">
      <div v-for="item in specs" :key="item.label" class="spec-row">
        <div class="spec-label">{{ item.label }}</div>
        <div class="spec-value">{{ item.value }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  specs: {
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

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.section-head h2 {
  font-size: 1.05rem;
  font-weight: 800;
  margin: 0;
  color: #111827;
}

.ghost-button {
  border: 1px solid #dbe6f4;
  background: #f8fbff;
  color: #2563eb;
  border-radius: 999px;
  padding: 0.55rem 0.9rem;
  font-weight: 700;
}

.spec-table {
  border: 1px solid #e2ebf6;
  border-radius: 12px;
  overflow: hidden;
}

.spec-row {
  display: grid;
  grid-template-columns: 240px 1fr;
}

.spec-row:nth-child(odd) .spec-label,
.spec-row:nth-child(odd) .spec-value {
  background: #f8fbff;
}

.spec-label,
.spec-value {
  padding: 0.95rem 1rem;
  border-bottom: 1px solid #e2ebf6;
}

.spec-row:last-child .spec-label,
.spec-row:last-child .spec-value {
  border-bottom: 0;
}

.spec-label {
  font-weight: 700;
  color: #334155;
}

.spec-value {
  color: #111827;
}

@media (max-width: 767.98px) {
  .spec-row {
    grid-template-columns: 1fr;
  }

  .spec-label {
    padding-bottom: 0.35rem;
  }

  .spec-value {
    padding-top: 0;
  }
}
</style>
