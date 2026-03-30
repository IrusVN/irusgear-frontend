<template>
  <section class="mb-3">
    <div class="bg-white rounded p-3">
      <div class="d-flex align-items-center justify-content-between mb-3" style="border-left: 4px solid #111; padding-left: 12px;">
        <span class="fw-bold m-0" style="font-size: 1rem; letter-spacing: 0.3px;">TIN TỨC</span>
        <a href="#" class="text-dark small text-decoration-none fw-semibold">Xem tất cả ›</a>
      </div>
      <div class="d-flex flex-wrap news-list">
        <div v-for="n in newsList" :key="n.id" class="news-item">
          <a href="#" class="text-decoration-none text-dark d-block">
            <img :src="n.img" :alt="n.title" class="w-100 rounded-3 mb-2" style="height:130px;object-fit:cover">
            <p class="small fw-semibold news-clamp mb-0">{{ n.title }}</p>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const newsList = [
  { id:1, title:'iPhone 16 Pro Max: Đánh giá chi tiết sau 1 tháng sử dụng thực tế', img:'https://placehold.co/300x180/eee/999?text=News+1' },
  { id:2, title:'Top 5 laptop gaming tốt nhất 2025 đáng mua nhất hiện nay', img:'https://placehold.co/300x180/eee/999?text=News+2' },
  { id:3, title:'Samsung Galaxy S25 Ultra ra mắt với AI mạnh mẽ chưa từng có', img:'https://placehold.co/300x180/eee/999?text=News+3' },
  { id:4, title:'AirPods Pro 3 lộ diện thiết kế hoàn toàn mới, pin cải tiến', img:'https://placehold.co/300x180/eee/999?text=News+4' },
  { id:5, title:'MacBook Air M4: Hiệu năng vượt trội, giá hợp lý hơn bao giờ hết', img:'https://placehold.co/300x180/eee/999?text=News+5' },
];
</script>

<style scoped>
.news-list {
  gap: 1rem;
}

.news-item {
  flex: 0 0 calc(50% - 0.5rem);
  min-width: 0;
}

.news-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

@media (min-width: 768px) and (max-width: 991.98px) {
  .news-item {
    flex-basis: calc((100% - 2rem) / 3);
  }
}

@media (min-width: 992px) {
  .news-item {
    flex-basis: calc((100% - 4rem) / 5);
  }
}
</style>
