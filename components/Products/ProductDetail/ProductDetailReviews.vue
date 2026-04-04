<template>
  <section class="detail-card p-3 p-lg-4">
    <div class="section-head mb-3">
      <h2>Đánh giá & nhận xét</h2>
    </div>

    <div class="review-overview">
      <div class="score-card">
        <div class="score">{{ summary.average.toFixed(1) }}</div>
        <div class="stars">
          <i v-for="star in 5" :key="star" class="bi bi-star-fill"></i>
        </div>
        <p>{{ summary.total }} đánh giá</p>
      </div>

      <div class="breakdown-list">
        <div v-for="item in summary.breakdown" :key="item.star" class="breakdown-row">
          <span>{{ item.star }} sao</span>
          <div class="bar-track">
            <div class="bar-fill" :style="{ width: `${barWidth(item.count)}%` }"></div>
          </div>
          <strong>{{ item.count }}</strong>
        </div>
      </div>
    </div>

    <div class="experience-grid">
      <article v-for="item in summary.experience" :key="item.label" class="experience-item">
        <p class="experience-title">{{ item.label }}</p>
        <div class="experience-score">
          <span>{{ item.score }}/5</span>
          <small>({{ item.reviews }} đánh giá)</small>
        </div>
      </article>
    </div>

    <div class="review-list">
      <article v-for="item in reviews" :key="`${item.author}-${item.time}`" class="review-item">
        <div class="review-head">
          <div class="avatar">{{ item.author.charAt(0) }}</div>
          <div>
            <h3>{{ item.author }}</h3>
            <div class="review-meta">
              <span class="stars-inline">
                <i v-for="star in item.rating" :key="star" class="bi bi-star-fill"></i>
              </span>
              <span>{{ item.label }}</span>
              <span v-if="item.verified" class="verified">Đã mua hàng</span>
            </div>
          </div>
        </div>

        <div class="tag-row">
          <span v-for="tag in item.tags" :key="tag" class="tag-chip">{{ tag }}</span>
        </div>

        <p class="review-content">{{ item.content }}</p>
        <p class="review-time">Đăng {{ item.time }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  summary: {
    type: Object,
    required: true,
  },
  reviews: {
    type: Array,
    required: true,
  },
});

const barWidth = (count) => {
  const total = Number(props.summary?.total) || 1;
  return Math.max(0, Math.min(100, (count / total) * 100));
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

.review-overview {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

.score-card,
.breakdown-list,
.experience-item,
.review-item {
  border: 1px solid #e2ebf6;
  border-radius: 12px;
  background: #fff;
}

.score-card {
  padding: 1.25rem;
  text-align: center;
}

.score {
  font-size: 3rem;
  font-weight: 900;
  color: #111827;
  line-height: 1;
}

.stars {
  display: flex;
  justify-content: center;
  gap: 0.35rem;
  color: #f59e0b;
  margin: 0.75rem 0;
}

.score-card p {
  margin: 0;
  color: #64748b;
}

.breakdown-list {
  padding: 1.1rem 1rem;
  display: grid;
  gap: 0.8rem;
}

.breakdown-row {
  display: grid;
  grid-template-columns: 56px 1fr 36px;
  gap: 0.75rem;
  align-items: center;
  color: #334155;
}

.bar-track {
  height: 8px;
  border-radius: 999px;
  background: #e2ebf6;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #f59e0b 0%, #f97316 100%);
}

.experience-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.experience-item {
  padding: 1rem;
}

.experience-title {
  margin: 0 0 0.35rem;
  color: #334155;
  font-weight: 700;
}

.experience-score {
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
  color: #111827;
}

.experience-score span {
  font-size: 1.2rem;
  font-weight: 800;
}

.experience-score small {
  color: #64748b;
}

.review-list {
  display: grid;
  gap: 1rem;
}

.review-item {
  padding: 1.1rem;
}

.review-head {
  display: flex;
  gap: 0.85rem;
  align-items: flex-start;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #dbeafe;
  color: #1d4ed8;
  display: grid;
  place-items: center;
  font-weight: 800;
}

.review-head h3 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
}

.review-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  color: #64748b;
  font-size: 0.92rem;
}

.stars-inline {
  color: #f59e0b;
}

.verified {
  color: #dc2626;
  font-weight: 700;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.85rem 0;
}

.tag-chip {
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  background: #f8fbff;
  border: 1px solid #dce9f9;
  color: #2563eb;
  font-size: 0.85rem;
  font-weight: 700;
}

.review-content {
  margin: 0 0 0.6rem;
  color: #334155;
  line-height: 1.65;
}

.review-time {
  margin: 0;
  color: #94a3b8;
  font-size: 0.92rem;
}

@media (max-width: 991.98px) {
  .review-overview,
  .experience-grid {
    grid-template-columns: 1fr;
  }
}
</style>
