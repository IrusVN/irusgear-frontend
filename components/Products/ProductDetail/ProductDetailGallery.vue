<template>
  <section class="detail-card p-2 p-lg-3">
    <div class="gallery-shell">
      <div class="main-view">
        <div v-if="activePanel === 'video'" class="hero-panel video-panel">
          <img :src="product.videoThumbnail" alt="Video thumbnail" class="hero-image" />
          <button type="button" class="play-badge">
            <i class="bi bi-play-fill"></i>
          </button>
        </div>

        <div v-else-if="activePanel === 'feature'" class="hero-panel feature-panel">
          <img :src="product.featureImage" :alt="product.featureTitle" class="feature-image" />
          <div class="feature-copy">
            <p class="feature-title">{{ product.featureTitle }}</p>
            <ul class="feature-list">
              <li v-for="bullet in product.featureBullets" :key="bullet">{{ bullet }}</li>
            </ul>
          </div>
        </div>

        <div v-else class="hero-panel image-panel">
          <img
            :src="activeImage?.src"
            :alt="activeImage?.alt || product.name"
            class="hero-image contain"
          />
        </div>
      </div>

      <div class="thumb-strip">
        <button
          type="button"
          class="thumb-card"
          :class="{ active: activePanel === 'video' }"
          @click="activePanel = 'video'"
        >
          <i class="bi bi-play-btn"></i>
          <span>Video</span>
        </button>
        <button
          type="button"
          class="thumb-card"
          :class="{ active: activePanel === 'feature' }"
          @click="activePanel = 'feature'"
        >
          <i class="bi bi-stars"></i>
          <span>Nổi bật</span>
        </button>
        <button
          v-for="(item, index) in product.gallery"
          :key="item.src"
          type="button"
          class="thumb-image"
          :class="{ active: activePanel === index }"
          @click="activePanel = index"
        >
          <img :src="item.thumb" :alt="item.alt" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const activePanel = ref("video");

const activeImage = computed(() => {
  if (typeof activePanel.value === "number") {
    return props.product.gallery[activePanel.value] || props.product.gallery[0];
  }
  return props.product.gallery[0];
});
</script>

<style scoped>
.detail-card {
  background: #fff;
  border: 1px solid #e5edf7;
  border-radius: 16px;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
}

.gallery-shell {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.main-view {
  min-height: 308px;
}

.hero-panel {
  height: 100%;
  min-height: 308px;
  border-radius: 12px;
  border: 1px solid #e2ebf6;
  background: #fff;
  overflow: hidden;
  position: relative;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.contain {
  object-fit: contain;
  padding: 1rem;
}

.play-badge {
  position: absolute;
  inset: auto auto 1.25rem 1.25rem;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: none;
  background: rgba(220, 38, 38, 0.95);
  color: #fff;
  font-size: 1.45rem;
  box-shadow: 0 16px 36px rgba(220, 38, 38, 0.32);
}

.feature-panel {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(180deg, #fff 0%, #fff 60%, #fff5f6 100%);
}

.feature-image {
  width: 100%;
  max-height: 320px;
  object-fit: contain;
}

.feature-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 0.8rem;
}

.feature-list {
  margin: 0;
  padding-left: 1rem;
  color: #334155;
  display: grid;
  gap: 0.65rem;
}

.thumb-strip {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
}

.thumb-card,
.thumb-image {
  flex: 0 0 auto;
  border: 1px solid #d8e5f5;
  border-radius: 10px;
  background: #fff;
  padding: 0.4rem;
  min-width: 58px;
  min-height: 58px;
}

.thumb-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.2rem;
  color: #111827;
  font-weight: 600;
  font-size: 0.66rem;
}

.thumb-card i {
  color: #2563eb;
  font-size: 0.9rem;
}

.thumb-image img {
  width: 46px;
  height: 46px;
  object-fit: contain;
}

.thumb-card.active,
.thumb-image.active {
  border-color: #d70018;
  box-shadow: 0 0 0 2px rgba(215, 0, 24, 0.08);
}

@media (max-width: 991.98px) {
  .hero-panel,
  .main-view {
    min-height: 280px;
  }

  .feature-panel {
    grid-template-columns: 1fr;
  }
}
</style>
