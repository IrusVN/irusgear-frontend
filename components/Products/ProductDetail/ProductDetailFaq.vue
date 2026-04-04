<template>
  <section class="detail-card p-3 p-lg-4">
    <div class="section-head mb-3">
      <h2>Câu hỏi thường gặp</h2>
    </div>

    <div class="faq-list">
      <article v-for="(item, index) in faqs" :key="item.question" class="faq-item">
        <button type="button" class="faq-trigger" @click="toggle(index)">
          <span>{{ item.question }}</span>
          <i class="bi" :class="opened.has(index) ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
        </button>
        <div v-if="opened.has(index)" class="faq-body">
          {{ item.answer }}
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  faqs: {
    type: Array,
    required: true,
  },
});

const opened = ref(new Set([0]));

const toggle = (index) => {
  const next = new Set(opened.value);
  if (next.has(index)) next.delete(index);
  else next.add(index);
  opened.value = next;
};
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

.faq-list {
  display: grid;
  gap: 0.85rem;
}

.faq-item {
  border: 1px solid #e2ebf6;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}

.faq-trigger {
  width: 100%;
  border: 0;
  background: #fff;
  padding: 1rem 1.1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  text-align: left;
  color: #111827;
  font-weight: 700;
}

.faq-body {
  padding: 0 1.1rem 1rem;
  color: #475569;
  line-height: 1.65;
}
</style>
