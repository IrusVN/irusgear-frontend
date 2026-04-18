<template>
  <div class="mobile-hero-banner">
    <div
      class="mobile-hero-track"
      ref="trackRef"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend="onTouchEnd"
    >
      <div
        v-for="(banner, i) in banners"
        :key="i"
        class="mobile-hero-slide"
        :class="{ active: i === activeIndex }"
      >
        <img :src="banner.image" :alt="banner.alt" class="mobile-hero-img" />
      </div>
    </div>

    <div class="mobile-hero-dots">
      <button
        v-for="(_, i) in banners"
        :key="i"
        type="button"
        class="mobile-hero-dot"
        :class="{ active: i === activeIndex }"
        :aria-label="`Slide ${i + 1}`"
        @click="goTo(i)"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const banners = [
  { image: '/image/dashboard/homehero/swiperslide/Home(3).png', alt: 'Galaxy S26 Series' },
  { image: '/image/dashboard/homehero/swiperslide/690x300_ROI_MacBookNeo.png', alt: 'MacBook Neo' },
  { image: '/image/dashboard/homehero/swiperslide/oppofingn6.png', alt: 'OPPO Find N6' },
  { image: '/image/dashboard/homehero/swiperslide/690x300_open_iPhone 17e.png', alt: 'iPhone 17e' },
  { image: '/image/dashboard/homehero/swiperslide/Home_WF-1000XM6-final.png', alt: 'Sony WF-1000XM6' },
  { image: '/image/dashboard/homehero/swiperslide/a37-new-home.png', alt: 'Galaxy A37 | A57 5G' },
  { image: '/image/dashboard/homehero/swiperslide/690x300_PRE_AiPodsMax2.png', alt: 'AirPods Max 2' },
  { image: '/image/dashboard/homehero/swiperslide/mbam5homepae.png', alt: 'MacBook Air M5' },
]

const activeIndex = ref(0)
const trackRef = ref(null)
let autoTimer = null
let touchStartX = 0
let touchDeltaX = 0

const goTo = (i) => {
  activeIndex.value = i
  resetAutoSlide()
}

const next = () => {
  activeIndex.value = (activeIndex.value + 1) % banners.length
}

const prev = () => {
  activeIndex.value = (activeIndex.value - 1 + banners.length) % banners.length
}

const startAutoSlide = () => {
  autoTimer = setInterval(next, 3000)
}

const resetAutoSlide = () => {
  if (autoTimer) clearInterval(autoTimer)
  startAutoSlide()
}

const onTouchStart = (e) => {
  touchStartX = e.touches[0].clientX
  touchDeltaX = 0
  if (autoTimer) clearInterval(autoTimer)
}

const onTouchMove = (e) => {
  touchDeltaX = e.touches[0].clientX - touchStartX
}

const onTouchEnd = () => {
  if (Math.abs(touchDeltaX) > 50) {
    if (touchDeltaX < 0) next()
    else prev()
  }
  startAutoSlide()
}

onMounted(() => {
  startAutoSlide()
})

onUnmounted(() => {
  if (autoTimer) clearInterval(autoTimer)
})
</script>

<style scoped>
.mobile-hero-banner {
  position: relative;
  margin: 10px 12px 0;
  border-radius: 12px;
  overflow: hidden;
  background: #f3f4f6;
  aspect-ratio: 2 / 1;
}

.mobile-hero-track {
  position: relative;
  width: 100%;
  height: 100%;
}

.mobile-hero-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.45s ease;
  pointer-events: none;
}

.mobile-hero-slide.active {
  opacity: 1;
  pointer-events: auto;
}

.mobile-hero-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mobile-hero-dots {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 5px;
  z-index: 2;
}

.mobile-hero-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  border: none;
  padding: 0;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.2s;
}

.mobile-hero-dot.active {
  background: #fff;
  width: 18px;
}
</style>
