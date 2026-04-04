<template>
  <section class="row g-3 mt-1">
    <div class="col-12 col-xl-8">
      <div class="detail-card p-3 p-lg-4">
        <h2 class="block-title mb-3">{{ article.title }}</h2>
        <div class="article-intro">
          <p>{{ article.intro }}</p>
        </div>
        <div class="article-body">
          <div class="body-head">
            <span>Nội dung chính</span>
            <i class="bi bi-chevron-up"></i>
          </div>
          <ol>
            <li v-for="item in article.sections" :key="item">{{ item }}</li>
          </ol>
          <button type="button" class="expand-link">Xem thêm <i class="bi bi-chevron-down"></i></button>
        </div>
      </div>
    </div>

    <div class="col-12 col-xl-4">
      <div class="side-stack">
        <div class="detail-card p-3 p-lg-4">
          <div class="block-head">
            <h2 class="block-title">Tin tức sản phẩm</h2>
            <a href="#">Xem tất cả</a>
          </div>
          <div class="news-list">
            <article v-for="item in news" :key="item.title" class="news-item">
              <img :src="item.image" :alt="item.title" />
              <h3>{{ item.title }}</h3>
            </article>
          </div>
        </div>

        <div class="detail-card p-3 p-lg-4">
          <h2 class="block-title mb-3">Video đánh giá</h2>
          <article class="news-item">
            <img :src="video.image" :alt="video.title" />
            <h3>{{ video.title }}</h3>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  article: { type: Object, required: true },
  news: { type: Array, required: true },
  video: { type: Object, required: true },
});
</script>

<style scoped>
.detail-card {
  background: #fff;
  border: 1px solid #e5edf7;
  border-radius: 16px;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
}

.block-title {
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
}

.article-intro {
  background: #fff5f6;
  border-radius: 12px;
  padding: 0.9rem 1rem;
  color: #374151;
  line-height: 1.65;
}

.article-body {
  margin-top: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  padding: 0.85rem 1rem;
}

.body-head,
.block-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.body-head {
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.article-body ol {
  margin: 0;
  padding-left: 1.2rem;
  color: #4b5563;
  line-height: 1.7;
}

.expand-link,
.block-head a {
  color: #3b82f6;
  text-decoration: none;
  border: 0;
  background: transparent;
  font-weight: 600;
}

.expand-link {
  display: block;
  margin: 0.85rem auto 0;
}

.side-stack {
  display: grid;
  gap: 0.75rem;
}

.news-list {
  display: grid;
  gap: 0.75rem;
}

.news-item {
  display: grid;
  grid-template-columns: 112px 1fr;
  gap: 0.75rem;
  align-items: center;
  border: 1px solid #e5edf7;
  border-radius: 12px;
  padding: 0.6rem;
}

.news-item img {
  width: 100%;
  height: 72px;
  object-fit: cover;
  border-radius: 12px;
}

.news-item h3 {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.5;
  color: #374151;
}
</style>
