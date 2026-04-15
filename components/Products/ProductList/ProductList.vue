<template>
  <section class="product-list-page">
    <div class="container-xl px-3 py-4">
      <div ref="rootEl" data-fetch-key="TopSlidingBanner:0" class="block-top-sliding-banner is-flex">
        <div
          v-for="(group, index) in bannerGroups"
          :key="group.id"
          :class="['block-sliding', { reverseBanner: index === 1 }]"
        >
          <div class="swiper banner-slide swiper-container">
            <div class="swiper-wrapper">
              <div
                v-for="banner in group.items"
                :key="`${group.id}-${banner.href}`"
                class="swiper-slide"
              >
                <a :href="banner.href" class="banner-img button__link-banner">
                  <img
                    :src="banner.src"
                    :alt="banner.alt"
                    width="595"
                    height="100"
                    loading="lazy"
                  />
                </a>
              </div>
            </div>

            <div class="swiper-pagination" />

            <div class="swiper-button-prev button__view-banner-prev" tabindex="0" role="button" aria-label="Previous slide">
              <div class="icon">
                <svg height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path
                    d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z"
                  />
                </svg>
              </div>
            </div>

            <div class="swiper-button-next button__view-banner-next" tabindex="0" role="button" aria-label="Next slide">
              <div class="icon">
                <svg height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path
                    d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const rootEl = ref(null);

const banners = [
  {
    href: "https://cellphones.com.vn/laptop/mac/macbook-neo.html#2dproductviewer",
    src: "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:100/plain/https://dashboard.cellphones.com.vn/storage/Cate-tinhnang2-mac.png",
    alt: "MacBook Neo feature",
  },
  {
    href: "https://cellphones.com.vn/laptop/mac/macbook-neo.html",
    src: "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:100/plain/https://dashboard.cellphones.com.vn/storage/bannercatemobanmacneo.png",
    alt: "MacBook Neo",
  },
  {
    href: "https://cellphones.com.vn/bo-loc/mac-mini-m4-series",
    src: "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:100/plain/https://dashboard.cellphones.com.vn/storage/s%C4%91fsfsssf.png",
    alt: "Mac mini M4",
  },
  {
    href: "https://cellphones.com.vn/laptop/mac/macbook-air/m5.html",
    src: "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:100/plain/https://dashboard.cellphones.com.vn/storage/catemacbookairm5mowban.png",
    alt: "MacBook Air M5",
  },
  {
    href: "https://cellphones.com.vn/laptop/mac/macbook-pro.html?laptop_cpu=apple-m5-pro,apple-m5-max",
    src: "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:100/plain/https://dashboard.cellphones.com.vn/storage/mbpm5mobannnn.png",
    alt: "MacBook Pro M5",
  },
  {
    href: "https://cellphones.com.vn/bo-loc/macbook-air-m4",
    src: "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:100/plain/https://dashboard.cellphones.com.vn/storage/svss.png",
    alt: "MacBook Air M4",
  },
  {
    href: "https://cellphones.com.vn/khuyen-mai-macbook-air-m4-512gb",
    src: "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:100/plain/https://dashboard.cellphones.com.vn/storage/sfhghsdhsb.png",
    alt: "MacBook Air M4 512GB promotion",
  },
  {
    href: "https://cellphones.com.vn/laptop/mac/macbook-pro/macbook-pro-2025.html",
    src: "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:100/plain/https://dashboard.cellphones.com.vn/storage/prom55555.png",
    alt: "MacBook Pro 2025",
  },
  {
    href: "https://cellphones.com.vn/bo-loc/imac-m4",
    src: "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:100/plain/https://dashboard.cellphones.com.vn/storage/cate-m4-12-06.jpg",
    alt: "iMac M4 2024",
  },
];

const bannerGroups = computed(() => [
  {
    id: "primary",
    items: banners,
  },
  {
    id: "secondary",
    items: [...banners].reverse(),
  },
]);

let swiperInstances = [];

const initSwipers = async () => {
  if (!import.meta.client || !rootEl.value) return;

  const [{ default: Swiper }, modules] = await Promise.all([
    import("swiper"),
    import("swiper/modules"),
  ]);

  const { Navigation, Pagination } = modules;
  const sliderEls = rootEl.value.querySelectorAll(".banner-slide");

  swiperInstances = Array.from(sliderEls).map((sliderEl, index) => {
    return new Swiper(sliderEl, {
      modules: [Navigation, Pagination],
      slidesPerView: 1,
      spaceBetween: 10,
      loop: true,
      speed: 500,
      navigation: {
        nextEl: sliderEl.querySelector(".swiper-button-next"),
        prevEl: sliderEl.querySelector(".swiper-button-prev"),
      },
      pagination: {
        el: sliderEl.querySelector(".swiper-pagination"),
        clickable: true,
      },
      initialSlide: index === 0 ? 2 : 5,
      observer: true,
      observeParents: true,
    });
  });
};

const destroySwipers = () => {
  swiperInstances.forEach((instance) => {
    if (instance && !instance.destroyed) {
      instance.destroy(true, true);
    }
  });

  swiperInstances = [];
};

onMounted(async () => {
  await nextTick();
  await initSwipers();
});

onBeforeUnmount(() => {
  destroySwipers();
});
</script>

<style scoped>
.product-list-page {
  background: #f8fafc;
  min-height: 100%;
}
.block-top-sliding-banner {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
}

.is-flex {
  display: flex !important;
}

.block-sliding {
  min-width: 0;
  width: calc(50% - 5px);
}

.block-sliding .banner-slide {
  border-radius: 5px;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.1), 0 2px 6px 2px rgba(60, 64, 67, 0.15);
  overflow: hidden;
  position: relative;
}

.swiper-container {
  list-style: none;
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
  padding: 0;
  position: relative;
  z-index: 1;
}

.swiper-wrapper {
  box-sizing: initial;
  display: flex;
  height: 100%;
  position: relative;
  transition-property: transform;
  width: 100%;
  z-index: 1;
}

.swiper-slide {
  flex-shrink: 0;
  height: 100%;
  position: relative;
  transition-property: transform;
  width: 100%;
}

.block-sliding .banner-slide .swiper-slide {
  border-radius: 5px;
  display: flex;
}

.banner-img {
  display: block;
  width: 100%;
}

.banner-img img {
  display: block;
  height: auto;
  width: 100%;
}

.block-sliding .banner-slide .swiper-pagination {
  bottom: 0;
}

.swiper-pagination {
  left: 0;
  position: absolute;
  text-align: center;
  transform: translateZ(0);
  transition: opacity 0.3s;
  width: 100%;
  z-index: 10;
}

.swiper-container-horizontal > .swiper-pagination-bullets,
.swiper-pagination-custom,
.swiper-pagination-fraction {
  bottom: 10px;
  left: 0;
  width: 100%;
}

.block-sliding .banner-slide .swiper-pagination .swiper-pagination-bullet {
  background-color: #e4e4e7;
  opacity: 0;
  transition: 0.3s;
}

.swiper-container-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet {
  margin: 0 4px;
}

.swiper-pagination-clickable .swiper-pagination-bullet {
  cursor: pointer;
}

.swiper-pagination-bullet {
  background: #000;
  border-radius: 100%;
  display: inline-block;
  height: 8px;
  opacity: 0.2;
  width: 8px;
}

.block-sliding:hover .swiper-pagination .swiper-pagination-bullet,
.block-sliding:focus-within .swiper-pagination .swiper-pagination-bullet,
.block-sliding .banner-slide .swiper-pagination .swiper-pagination-bullet-active {
  opacity: 1;
}

.block-sliding .banner-slide .swiper-pagination .swiper-pagination-bullet-active {
  background-color: #d70018;
  border-radius: 50px;
  width: 20px;
}

.block-sliding .banner-slide .swiper-button-prev {
  border-radius: 0 100px 100px 0;
  left: 0;
  padding-left: 0;
}

.block-sliding .banner-slide .swiper-button-next {
  border-radius: 100px 0 0 100px;
  padding-right: 0;
  right: 0;
}

.block-sliding .banner-slide .swiper-button-next,
.block-sliding .banner-slide .swiper-button-prev {
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
  color: inherit;
  display: flex;
  font-size: 1.8rem;
  height: 60px;
  justify-content: center;
  margin-top: 0;
  opacity: 0;
  outline: none;
  top: 50%;
  transform: translateY(-50%);
  transition: 0.3s;
  width: 30px;
  z-index: 10;
}

.block-sliding .banner-slide .swiper-button-next .icon,
.block-sliding .banner-slide .swiper-button-prev .icon {
  align-items: center;
  color: #fff;
  display: flex;
  justify-content: center;
  line-height: 1;
  transform: translateY(-1px);
}

.block-sliding .banner-slide .swiper-button-next.swiper-button-disabled,
.block-sliding .banner-slide .swiper-button-next::after,
.block-sliding .banner-slide .swiper-button-prev.swiper-button-disabled,
.block-sliding .banner-slide .swiper-button-prev::after {
  display: none;
}

.block-sliding .banner-slide:hover .swiper-button-next,
.block-sliding .banner-slide:hover .swiper-button-prev,
.block-sliding .banner-slide:focus-within .swiper-button-next,
.block-sliding .banner-slide:focus-within .swiper-button-prev {
  opacity: 1;
}

@media screen and (max-width: 768px) {
  .block-top-sliding-banner {
    flex-direction: column;
  }

  .block-sliding {
    width: 100%;
  }
}

@media screen and (max-width: 540px) {
  .block-sliding .banner-slide .swiper-button-next,
  .block-sliding .banner-slide .swiper-button-prev {
    font-size: 1.2rem;
    height: 50px;
    width: 25px;
  }
}
</style>
