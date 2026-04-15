<template>
  <section class="product-list-page">
    <div
      :class="['sticky-filter-bar', { 'sticky-filter-bar--visible': isStickyFilterVisible }]"
      :style="{ top: `${stickyTopOffset}px` }"
    >
      <div ref="stickyFilterInnerEl" class="container-xl px-3 py-3 sticky-filter-bar__inner">
        <div class="product-filter-list product-filter-list--sticky">
          <button
            v-for="filter in productFilters"
            :key="`sticky-${filter.key}`"
            :ref="(el) => setFilterChipRef(filter.key, el, 'sticky')"
            type="button"
            :class="[
              'product-filter-chip',
              {
                'product-filter-chip--primary': filter.primary && activeDropdownKey !== filter.key,
                'product-filter-chip--active': activeDropdownKey === filter.key,
              },
            ]"
            @click="handleFilterClick(filter)"
          >
            <span v-if="filter.leadingIcon === 'filter'" class="product-filter-chip__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 5H20L13.5 12.4375V18.25L10.5 19.75V12.4375L4 5Z"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>

            <span v-else-if="filter.leadingIcon === 'truck'" class="product-filter-chip__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 6.5H13V14.5H3V6.5Z"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linejoin="round"
                />
                <path
                  d="M13 9H17L20 12V14.5H13V9Z"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linejoin="round"
                />
                <circle cx="7" cy="17.5" r="1.75" stroke="currentColor" stroke-width="1.7" />
                <circle cx="17" cy="17.5" r="1.75" stroke="currentColor" stroke-width="1.7" />
                <path d="M5 9.5H9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                <path d="M3 12H6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
              </svg>
            </span>

            <span v-else-if="filter.leadingIcon === 'new'" class="product-filter-chip__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 5.5V18.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                <path
                  d="M5 7H14.75L13.25 10.5L14.75 14H5"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path d="M16 13.5V18.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                <circle cx="16" cy="10" r="1.75" stroke="currentColor" stroke-width="1.7" />
                <path d="M18.5 18.5H13.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
              </svg>
            </span>

            <span v-else-if="filter.leadingIcon === 'price'" class="product-filter-chip__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.7" />
                <path
                  d="M12 8.5V12H15"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>

            <span>{{ filter.label }}</span>

            <span v-if="filter.trailingIcon === 'chevron'" class="product-filter-chip__meta" aria-hidden="true">
              <svg :class="{ 'is-rotated': activeDropdownKey === filter.key }" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>

            <span
              v-else-if="filter.trailingIcon === 'chevron-info'"
              class="product-filter-chip__meta product-filter-chip__meta-group"
              aria-hidden="true"
            >
              <svg :class="{ 'is-rotated': activeDropdownKey === filter.key }" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <svg viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5" />
                <path d="M10 8.4V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                <circle cx="10" cy="6.1" r="0.75" fill="currentColor" />
              </svg>
            </span>
          </button>
        </div>

        <transition name="filter-dropdown" mode="out-in">
          <div
            v-if="activeDropdown && isStickyFilterVisible"
            :key="`sticky-${activeDropdown.key}`"
            ref="dropdownEl"
            class="product-filter-dropdown"
            :class="{ 'product-filter-dropdown--mega': activeDropdown.key === 'filter' }"
            :style="dropdownStyle"
          >
            <div v-if="activeDropdown.key === 'filter'" class="product-filter-mega-scroll">
              <div class="product-filter-mega-grid">
                <div
                  v-for="section in megaFilterSections"
                  :key="`sticky-mega-${section.key}`"
                  class="product-filter-group"
                >
                  <div class="product-filter-group__title">
                    <span>{{ section.label }}</span>
                    <span class="product-filter-chip__meta product-filter-chip__meta--info" aria-hidden="true">
                      <svg viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5" />
                        <path d="M10 8.4V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                        <circle cx="10" cy="6.1" r="0.75" fill="currentColor" />
                      </svg>
                    </span>
                  </div>

                  <div class="product-filter-group__options">
                    <button
                      v-for="option in section.options"
                      :key="`sticky-${section.key}-${option}`"
                      type="button"
                      :class="[
                        'product-filter-option',
                        {
                          'product-filter-option--selected': selectedOptionsByFilter[section.key]?.includes(option),
                        },
                      ]"
                      @click="toggleFilterOption(section.key, option)"
                    >
                      <span>{{ option }}</span>
                      <span class="product-filter-chip__meta product-filter-chip__meta--info" aria-hidden="true">
                        <svg viewBox="0 0 20 20" fill="none">
                          <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5" />
                          <path d="M10 8.4V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                          <circle cx="10" cy="6.1" r="0.75" fill="currentColor" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="product-filter-dropdown__options">
              <button
                v-for="option in activeDropdown.options"
                :key="`sticky-${activeDropdown.key}-${option}`"
                type="button"
                :class="[
                  'product-filter-option',
                  {
                    'product-filter-option--selected': selectedOptionsByFilter[activeDropdown.key]?.includes(option),
                  },
                ]"
                @click="toggleFilterOption(activeDropdown.key, option)"
              >
                <span>{{ option }}</span>
                <span class="product-filter-chip__meta product-filter-chip__meta--info" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5" />
                    <path d="M10 8.4V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    <circle cx="10" cy="6.1" r="0.75" fill="currentColor" />
                  </svg>
                </span>
              </button>
            </div>

            <div class="product-filter-dropdown__footer">
              <button
                type="button"
                class="product-filter-dropdown__button product-filter-dropdown__button--ghost"
                @click="closeDropdown"
              >
                Đóng
              </button>
              <button
                type="button"
                class="product-filter-dropdown__button product-filter-dropdown__button--primary"
                @click="closeDropdown"
              >
                Xem kết quả
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>

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

      <div class="product-series-block">
        <h2 class="product-series-title">Macbook</h2>

        <div class="product-series-list">
          <a
            v-for="item in productSeries"
            :key="item.label"
            :href="item.href"
            class="product-series-chip"
          >
            {{ item.label }}
          </a>
        </div>
      </div>

      <div ref="filterBlockEl" class="product-filter-block">
        <h2 class="product-filter-title">Chọn theo tiêu chí</h2>

        <div class="product-filter-list">
          <button
            v-for="filter in productFilters"
            :key="filter.key"
            :ref="(el) => setFilterChipRef(filter.key, el)"
            type="button"
            :class="[
              'product-filter-chip',
              {
                'product-filter-chip--primary': filter.primary && activeDropdownKey !== filter.key,
                'product-filter-chip--active': activeDropdownKey === filter.key,
              },
            ]"
            @click="handleFilterClick(filter)"
          >
            <span v-if="filter.leadingIcon === 'filter'" class="product-filter-chip__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 5H20L13.5 12.4375V18.25L10.5 19.75V12.4375L4 5Z"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>

            <span v-else-if="filter.leadingIcon === 'truck'" class="product-filter-chip__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 6.5H13V14.5H3V6.5Z"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linejoin="round"
                />
                <path
                  d="M13 9H17L20 12V14.5H13V9Z"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linejoin="round"
                />
                <circle cx="7" cy="17.5" r="1.75" stroke="currentColor" stroke-width="1.7" />
                <circle cx="17" cy="17.5" r="1.75" stroke="currentColor" stroke-width="1.7" />
                <path d="M5 9.5H9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                <path d="M3 12H6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
              </svg>
            </span>

            <span v-else-if="filter.leadingIcon === 'new'" class="product-filter-chip__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 5.5V18.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                <path
                  d="M5 7H14.75L13.25 10.5L14.75 14H5"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path d="M16 13.5V18.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                <circle cx="16" cy="10" r="1.75" stroke="currentColor" stroke-width="1.7" />
                <path d="M18.5 18.5H13.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
              </svg>
            </span>

            <span v-else-if="filter.leadingIcon === 'price'" class="product-filter-chip__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.7" />
                <path
                  d="M12 8.5V12H15"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>

            <span>{{ filter.label }}</span>

            <span v-if="filter.trailingIcon === 'chevron'" class="product-filter-chip__meta" aria-hidden="true">
              <svg :class="{ 'is-rotated': activeDropdownKey === filter.key }" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>

            <span
              v-else-if="filter.trailingIcon === 'chevron-info'"
              class="product-filter-chip__meta product-filter-chip__meta-group"
              aria-hidden="true"
            >
              <svg :class="{ 'is-rotated': activeDropdownKey === filter.key }" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <svg viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5" />
                <path d="M10 8.4V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                <circle cx="10" cy="6.1" r="0.75" fill="currentColor" />
              </svg>
            </span>
          </button>
        </div>

        <transition name="filter-dropdown" mode="out-in">
          <div
            v-if="activeDropdown && !isStickyFilterVisible"
            :key="activeDropdown.key"
            ref="dropdownEl"
            class="product-filter-dropdown"
            :class="{ 'product-filter-dropdown--mega': activeDropdown.key === 'filter' }"
            :style="dropdownStyle"
          >
            <div v-if="activeDropdown.key === 'filter'" class="product-filter-mega-scroll">
              <div class="product-filter-mega-grid">
                <div
                  v-for="section in megaFilterSections"
                  :key="`mega-${section.key}`"
                  class="product-filter-group"
                >
                  <div class="product-filter-group__title">
                    <span>{{ section.label }}</span>
                    <span class="product-filter-chip__meta product-filter-chip__meta--info" aria-hidden="true">
                      <svg viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5" />
                        <path d="M10 8.4V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                        <circle cx="10" cy="6.1" r="0.75" fill="currentColor" />
                      </svg>
                    </span>
                  </div>

                  <div class="product-filter-group__options">
                    <button
                      v-for="option in section.options"
                      :key="`${section.key}-${option}`"
                      type="button"
                      :class="[
                        'product-filter-option',
                        {
                          'product-filter-option--selected': selectedOptionsByFilter[section.key]?.includes(option),
                        },
                      ]"
                      @click="toggleFilterOption(section.key, option)"
                    >
                      <span>{{ option }}</span>
                      <span class="product-filter-chip__meta product-filter-chip__meta--info" aria-hidden="true">
                        <svg viewBox="0 0 20 20" fill="none">
                          <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5" />
                          <path d="M10 8.4V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                          <circle cx="10" cy="6.1" r="0.75" fill="currentColor" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="product-filter-dropdown__options">
              <button
                v-for="option in activeDropdown.options"
                :key="`${activeDropdown.key}-${option}`"
                type="button"
                :class="[
                  'product-filter-option',
                  {
                    'product-filter-option--selected': selectedOptionsByFilter[activeDropdown.key]?.includes(option),
                  },
                ]"
                @click="toggleFilterOption(activeDropdown.key, option)"
              >
                <span>{{ option }}</span>
                <span class="product-filter-chip__meta product-filter-chip__meta--info" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5" />
                    <path d="M10 8.4V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    <circle cx="10" cy="6.1" r="0.75" fill="currentColor" />
                  </svg>
                </span>
              </button>
            </div>

            <div class="product-filter-dropdown__footer">
              <button
                type="button"
                class="product-filter-dropdown__button product-filter-dropdown__button--ghost"
                @click="closeDropdown"
              >
                Đóng
              </button>
              <button
                type="button"
                class="product-filter-dropdown__button product-filter-dropdown__button--primary"
                @click="closeDropdown"
              >
                Xem kết quả
              </button>
            </div>
          </div>
        </transition>
      </div>

      <div class="product-sort-block">
        <h2 class="product-sort-title">Sắp xếp theo</h2>

        <div class="product-sort-list">
          <button
            v-for="sort in sortOptions"
            :key="sort.key"
            type="button"
            :class="[
              'product-sort-chip',
              { 'product-sort-chip--active': activeSortKey === sort.key },
            ]"
            @click="activeSortKey = sort.key"
          >
            <span class="product-sort-chip__icon" aria-hidden="true" v-html="sort.icon" />
            <span>{{ sort.label }}</span>
          </button>
        </div>
      </div>

      <div class="product-card-grid">
        <HomeProdCard
          v-for="product in visibleProductListItems"
          :key="product.id"
          :product="product"
        />
      </div>

      <div v-if="hasMoreProducts" class="product-load-more">
        <button type="button" class="product-load-more__button" @click="handleLoadMoreProducts">
          <span>Xem thêm {{ remainingProductCount }} sản phẩm</span>
          <span class="product-load-more__icon" aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="none">
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import HomeProdCard from "@/components/Home/HomeProdCard.vue";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const rootEl = ref(null);
const filterBlockEl = ref(null);
const stickyFilterInnerEl = ref(null);
const dropdownEl = ref(null);
const dropdownStyle = ref({});
const primaryFilterChipRefs = new Map();
const stickyFilterChipRefs = new Map();
const isStickyFilterVisible = ref(false);
const stickyTopOffset = ref(0);
const activeSortKey = ref("popular");
const initialVisibleProductCount = 4;
const visibleProductCount = ref(initialVisibleProductCount);

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

const productSeries = [
  { label: "MACBOOK AIR", href: "#" },
  { label: "MACBOOK PRO", href: "#" },
  { label: "MAC MINI", href: "#" },
  { label: "MACBOOK NEO", href: "#" },
  { label: "MAC STUDIO", href: "#" },
  { label: "STUDIO DISPLAY", href: "#" },
  { label: "IMAC", href: "#" },
];

const sortOptions = [
  {
    key: "popular",
    label: "Phổ biến",
    icon:
      '<svg viewBox="0 0 20 20" fill="none"><path d="M10 2.5L12.25 7.05L17.25 7.77L13.63 11.3L14.48 16.27L10 13.92L5.52 16.27L6.37 11.3L2.75 7.77L7.75 7.05L10 2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  },
  {
    key: "promo",
    label: "Khuyến mãi HOT",
    icon:
      '<svg viewBox="0 0 20 20" fill="none"><path d="M10 3L11.9 4.65L14.42 4.45L14.93 6.92L17 8.35L15.74 10.55L16.35 13L13.92 13.82L12.55 15.95L10 15.2L7.45 15.95L6.08 13.82L3.65 13L4.26 10.55L3 8.35L5.07 6.92L5.58 4.45L8.1 4.65L10 3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 10L9.3 11.3L12.5 8.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  {
    key: "price_asc",
    label: "Giá Thấp - Cao",
    icon:
      '<svg viewBox="0 0 20 20" fill="none"><path d="M4 5H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M4 9H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M4 13H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M14 14.5V5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M11.5 8L14 5.5L16.5 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  {
    key: "price_desc",
    label: "Giá Cao - Thấp",
    icon:
      '<svg viewBox="0 0 20 20" fill="none"><path d="M4 5H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M4 9H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M4 13H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M14 5.5V14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M11.5 12L14 14.5L16.5 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
];

const productListItems = [
  {
    id: 1,
    badge: true,
    discount: 3,
    installmentText: "Tráº£ gÃ³p",
    img: "https://cdn2.cellphones.com.vn/x/media/catalog/product/m/a/macbook-neo.png",
    name: "MacBook Neo 13 inch A18 Pro 2026 6CPU 5GPU 8GB 256GB",
    price: 15990000,
    originalPrice: 16490000,
    gifts: [
      "HÃ ng má»›i vá»",
      "GiÃ¡ S-Student 15.490.000Ä‘",
      "KhÃ´ng phÃ­ chuyá»ƒn Ä‘á»•i kÃ¬ tráº£ gÃ³p 0% qua tháº» tÃ­n dá»¥ng ká»³ háº¡n 3-6 thÃ¡ng",
    ],
    rating: 5,
    slug: "macbook-neo-13-inch-a18-pro-2026",
  },
  {
    id: 2,
    badge: true,
    discount: 5,
    installmentText: "Tráº£ gÃ³p",
    img: "https://cdn2.cellphones.com.vn/x/media/catalog/product/m/a/macbook_air_m4_13_2025.png",
    name: "MacBook Air M4 13 inch 2025 10CPU 8GPU 16GB 256GB",
    price: 25590000,
    originalPrice: 26990000,
    gifts: [
      "HÃ ng má»›i vá»",
      "GiÃ¡ S-Student 25.090.000Ä‘",
      "Tráº£ gÃ³p 0% - 0Ä‘ phá»¥ phÃ­ - 0Ä‘ tráº£ trÆ°á»›c - ká»³ háº¡n Ä‘áº¿n 12 thÃ¡ng",
    ],
    rating: 4.9,
    slug: "macbook-air-m4-13-2025-16gb-256gb",
  },
  {
    id: 3,
    badge: true,
    discount: 12,
    installmentText: "Tráº£ gÃ³p",
    img: "https://cdn2.cellphones.com.vn/x/media/catalog/product/m/a/macbook_air_m2.png",
    name: "Apple MacBook Air M2 2024 8CPU 8GPU 16GB 256GB",
    price: 21990000,
    originalPrice: 24990000,
    gifts: [
      "HÃ ng má»›i vá»",
      "GiÃ¡ S-Student 21.490.000Ä‘",
      "Tráº£ gÃ³p 0% - 0Ä‘ phá»¥ phÃ­ - 0Ä‘ tráº£ trÆ°á»›c - ká»³ háº¡n Ä‘áº¿n 12 thÃ¡ng",
    ],
    rating: 4.9,
    slug: "macbook-air-m2-2024-16gb-256gb",
  },
  {
    id: 4,
    badge: true,
    discount: 2,
    installmentText: "Tráº£ gÃ³p",
    img: "https://cdn2.cellphones.com.vn/x/media/catalog/product/m/a/macbook_air_m5_13_2026.png",
    name: "MacBook Air M5 13 inch 2026 10CPU 8GPU 16GB 512GB",
    price: 29490000,
    originalPrice: 29990000,
    gifts: [
      "HÃ ng má»›i vá»",
      "GiÃ¡ S-Student 28.990.000Ä‘",
      "Tráº£ gÃ³p 0% - 0Ä‘ phá»¥ phÃ­ - 0Ä‘ tráº£ trÆ°á»›c - ká»³ háº¡n Ä‘áº¿n 12 thÃ¡ng",
    ],
    rating: 5,
    slug: "macbook-air-m5-13-2026-16gb-512gb",
  },
  {
    id: 5,
    badge: true,
    discount: 1,
    installmentText: "Tráº£ gÃ³p",
    img: "https://cdn2.cellphones.com.vn/x/media/catalog/product/m/a/macbook_pro_14_m5.png",
    name: "MacBook Pro 14 M5 10CPU 10GPU 16GB 512GB",
    price: 41490000,
    originalPrice: 41990000,
    gifts: [
      "HÃ ng má»›i vá»",
      "GiÃ¡ S-Student 40.990.000Ä‘",
      "Tráº£ gÃ³p 0% - 0Ä‘ phá»¥ phÃ­ - 0Ä‘ tráº£ trÆ°á»›c - ká»³ háº¡n Ä‘áº¿n 12 thÃ¡ng",
    ],
    rating: 5,
    slug: "macbook-pro-14-m5-16gb-512gb",
  },
];

const sortedProductListItems = computed(() => {
  const items = [...productListItems];

  switch (activeSortKey.value) {
    case "promo":
      return items.sort((a, b) => (Number(b.discount) || 0) - (Number(a.discount) || 0));
    case "price_asc":
      return items.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    case "price_desc":
      return items.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    default:
      return items;
  }
});

const visibleProductListItems = computed(() => sortedProductListItems.value.slice(0, visibleProductCount.value));

const remainingProductCount = computed(() => Math.max(0, sortedProductListItems.value.length - visibleProductCount.value));

const hasMoreProducts = computed(() => remainingProductCount.value > 0);

const productFilters = [
  { key: "filter", label: "Bộ lọc", leadingIcon: "filter", primary: true },
  { key: "stock", label: "Sẵn hàng", leadingIcon: "truck" },
  { key: "new", label: "Hàng mới về", leadingIcon: "new" },
  { key: "price", label: "Xem theo giá", leadingIcon: "price" },
  {
    key: "major",
    label: "Ngành học",
    trailingIcon: "chevron",
    options: ["Công nghệ thông tin", "Kinh tế", "Thiết kế", "Marketing", "Kế toán"],
  },
  {
    key: "usage",
    label: "Nhu cầu sử dụng",
    trailingIcon: "chevron-info",
    options: [
      "Học tập - Văn phòng",
      "Đồ họa - Kỹ thuật",
      "Cao cấp - Sang trọng",
      "Laptop sáng tạo nội dung",
      "Mỏng nhẹ",
      "Gaming",
    ],
  },
  {
    key: "cpu",
    label: "CPU",
    trailingIcon: "chevron",
    options: ["Apple M1", "Apple M2", "Apple M3", "Apple M4", "Intel Core i7"],
  },
  {
    key: "ram",
    label: "Dung lượng RAM",
    trailingIcon: "chevron-info",
    options: ["8 GB", "16 GB", "18 GB", "24 GB", "32 GB"],
  },
  {
    key: "storage",
    label: "Ổ cứng",
    trailingIcon: "chevron-info",
    options: ["256 GB", "512 GB", "1 TB", "2 TB"],
  },
  {
    key: "screen",
    label: "Kích thước màn hình",
    trailingIcon: "chevron",
    options: ["13 inch", "14 inch", "15 inch", "16 inch"],
  },
  {
    key: "resolution",
    label: "Độ phân giải",
    trailingIcon: "chevron",
    options: ["Retina", "Liquid Retina", "Liquid Retina XDR", "4.5K"],
  },
  {
    key: "feature",
    label: "Tính năng đặc biệt",
    trailingIcon: "chevron",
    options: ["Touch ID", "Wi-Fi 6E", "Thunderbolt 4", "120Hz ProMotion"],
  },
];

const activeDropdownKey = ref(null);
const selectedOptionsByFilter = ref({});

const activeDropdown = computed(() =>
  productFilters.find((filter) => filter.key === activeDropdownKey.value && (filter.options?.length || filter.key === "filter")),
);

const megaFilterSections = computed(() =>
  productFilters.filter((filter) => filter.key !== "filter" && filter.options?.length),
);

let swiperInstances = [];
let mounted = false;

const setFilterChipRef = (key, el, scope = "primary") => {
  const targetMap = scope === "sticky" ? stickyFilterChipRefs : primaryFilterChipRefs;

  if (el) {
    targetMap.set(key, el);
    return;
  }

  targetMap.delete(key);
};

const handleFilterClick = (filter) => {
  if (!filter.options?.length && filter.key !== "filter") return;

  activeDropdownKey.value = activeDropdownKey.value === filter.key ? null : filter.key;
};

const toggleFilterOption = (filterKey, option) => {
  const current = selectedOptionsByFilter.value[filterKey] || [];
  const next = current.includes(option)
    ? current.filter((item) => item !== option)
    : [...current, option];

  selectedOptionsByFilter.value = {
    ...selectedOptionsByFilter.value,
    [filterKey]: next,
  };
};

const closeDropdown = () => {
  activeDropdownKey.value = null;
};

const handleLoadMoreProducts = () => {
  visibleProductCount.value = Math.min(
    sortedProductListItems.value.length,
    visibleProductCount.value + initialVisibleProductCount,
  );
};

const updateDropdownPosition = async () => {
  const containerEl = isStickyFilterVisible.value ? stickyFilterInnerEl.value : filterBlockEl.value;
  const triggerMap = isStickyFilterVisible.value ? stickyFilterChipRefs : primaryFilterChipRefs;

  if (!activeDropdownKey.value || !containerEl) {
    dropdownStyle.value = {};
    return;
  }

  const triggerEl = triggerMap.get(activeDropdownKey.value);

  if (!triggerEl) {
    dropdownStyle.value = {};
    return;
  }

  await nextTick();

  const containerRect = containerEl.getBoundingClientRect();
  const triggerRect = triggerEl.getBoundingClientRect();
  const dropdownNode = dropdownEl.value;
  const top = triggerRect.bottom - containerRect.top + 10;
  const triggerLeft = triggerRect.left - containerRect.left;
  const triggerRight = containerRect.right - triggerRect.right;

  if (dropdownNode) {
    const dropdownWidth = dropdownNode.offsetWidth;
    const fitsRightFromLeftAnchor = triggerLeft + dropdownWidth <= containerRect.width;
    const fitsLeftFromRightAnchor = triggerRight + dropdownWidth <= containerRect.width;

    if (!fitsRightFromLeftAnchor && fitsLeftFromRightAnchor) {
      dropdownStyle.value = {
        right: `${Math.max(0, triggerRight)}px`,
        left: "auto",
        top: `${top}px`,
      };
      return;
    }

    const maxLeft = Math.max(0, containerRect.width - dropdownWidth);
    const left = Math.min(Math.max(0, triggerLeft), maxLeft);

    dropdownStyle.value = {
      left: `${left}px`,
      right: "auto",
      top: `${top}px`,
    };
    return;
  }

  dropdownStyle.value = {
    left: `${triggerLeft}px`,
    right: "auto",
    top: `${top}px`,
  };
};

const handleClickOutside = (event) => {
  const clickedInsidePrimary = filterBlockEl.value?.contains(event.target);
  const clickedInsideSticky = stickyFilterInnerEl.value?.contains(event.target);

  if (!clickedInsidePrimary && !clickedInsideSticky) {
    closeDropdown();
  }
};

const handleWindowResize = () => {
  updateStickyOffset();
  updateDropdownPosition();
};

const handleWindowScroll = () => {
  if (!filterBlockEl.value) return;

  updateStickyOffset();
  isStickyFilterVisible.value = filterBlockEl.value.getBoundingClientRect().top <= stickyTopOffset.value;
};

const updateStickyOffset = () => {
  if (typeof document === "undefined") return;

  const navbarWrapper = document.querySelector(".fixed-top");
  const navbar = document.querySelector(".glass-navbar");

  if (navbarWrapper instanceof HTMLElement) {
    stickyTopOffset.value = Math.ceil(navbarWrapper.getBoundingClientRect().bottom + 2);
    return;
  }

  if (navbar instanceof HTMLElement) {
    stickyTopOffset.value = Math.ceil(navbar.getBoundingClientRect().bottom + 2);
    return;
  }

  stickyTopOffset.value = 0;
};

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
  updateStickyOffset();
  handleWindowScroll();
  await updateDropdownPosition();

  if (!mounted && typeof window !== "undefined") {
    window.addEventListener("click", handleClickOutside);
    window.addEventListener("resize", handleWindowResize);
    window.addEventListener("scroll", handleWindowScroll, { passive: true });
    mounted = true;
  }
});

watch(activeDropdownKey, async () => {
  await updateDropdownPosition();
});

watch(isStickyFilterVisible, async () => {
  await updateDropdownPosition();
});

watch(activeSortKey, () => {
  visibleProductCount.value = initialVisibleProductCount;
});

onBeforeUnmount(() => {
  destroySwipers();

  if (mounted && typeof window !== "undefined") {
    window.removeEventListener("click", handleClickOutside);
    window.removeEventListener("resize", handleWindowResize);
    window.removeEventListener("scroll", handleWindowScroll);
    mounted = false;
  }
});
</script>

<style scoped>
.product-list-page {
  background: #f8fafc;
  min-height: 100%;
}

.sticky-filter-bar {
  /* background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.12); */
  left: 0;
  opacity: 0;
  pointer-events: none;
  position: fixed;
  right: 0;
  top: 0;
  transform: translateY(-100%);
  transition:
    opacity 0.25s ease,
    transform 0.3s ease;
  z-index: 60;
}

.sticky-filter-bar--visible {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.sticky-filter-bar__inner {
  position: relative;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.12);
  border-radius: 12px;
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

.product-series-block {
  margin-top: 4px;
}

.product-series-title {
  color: #111827;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.3;
  margin: 0 0 16px;
}

.product-series-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.product-series-chip {
  align-items: center;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: #111827;
  display: inline-flex;
  font-size: 13px;
  font-weight: 700;
  justify-content: center;
  min-height: 40px;
  padding: 8px 12px;
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    color 0.2s ease;
}

.product-series-chip:hover {
  border-color: #9ca3af;
  box-shadow: 0 2px 8px rgba(17, 24, 39, 0.08);
  color: #111827;
}

.product-filter-block {
  margin-top: 28px;
  position: relative;
}

.product-filter-title {
  color: #111827;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.3;
  margin: 0 0 16px;
}

.product-filter-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.product-filter-list--sticky {
  margin: 0;
}

.product-sort-block {
  align-items: center;
  display: flex;
  gap: 16px;
  justify-content: space-between;
  margin-top: 28px;
}

.product-sort-title {
  color: #111827;
  flex-shrink: 0;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.3;
  margin: 0;
}

.product-sort-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: flex-end;
}

.product-card-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  margin-top: 16px;
}

.product-load-more {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.product-load-more__button {
  align-items: center;
  background: #dbeafe;
  border: 0;
  border-radius: 12px;
  color: #3b82f6;
  cursor: pointer;
  display: inline-flex;
  gap: 8px;
  justify-content: center;
  min-height: 50px;
  padding: 12px 28px;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.product-load-more__button:hover {
  background: #bfdbfe;
  color: #2563eb;
  transform: translateY(-1px);
}

.product-load-more__button span:first-child {
  font-size: 16px;
  font-weight: 700;
}

.product-load-more__icon {
  align-items: center;
  display: inline-flex;
  justify-content: center;
}

.product-load-more__icon svg {
  height: 18px;
  width: 18px;
}

.product-sort-chip {
  align-items: center;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  color: #111827;
  cursor: pointer;
  display: inline-flex;
  gap: 8px;
  min-height: 42px;
  padding: 10px 16px;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.product-sort-chip:hover {
  background: #f8fafc;
  border-color: #9ca3af;
}

.product-sort-chip--active {
  background: #eff6ff;
  border-color: #3b82f6;
  box-shadow: 0 8px 18px rgba(59, 130, 246, 0.12);
  color: #2563eb;
}

.product-sort-chip__icon {
  align-items: center;
  display: inline-flex;
  justify-content: center;
}

.product-sort-chip__icon :deep(svg) {
  height: 18px;
  width: 18px;
}

.product-filter-chip {
  align-items: center;
  background: #f3f4f6;
  border: 1px solid transparent;
  border-radius: 10px;
  color: #111827;
  cursor: pointer;
  display: inline-flex;
  gap: 8px;
  min-height: 40px;
  padding: 9px 14px;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    color 0.2s ease;
}

.product-filter-chip--primary {
  background: #fff5f5;
  border-color: #ef4444;
  color: #ef4444;
}

.product-filter-chip--active {
  background: #fff;
  border-color: #ef4444;
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.08);
  color: #ef4444;
}

.product-filter-chip__icon,
.product-filter-chip__meta {
  align-items: center;
  display: inline-flex;
  flex-shrink: 0;
  justify-content: center;
}

.product-filter-chip__icon svg {
  height: 18px;
  width: 18px;
}

.product-filter-chip__meta svg {
  height: 16px;
  transition: transform 0.2s ease;
  width: 16px;
}

.product-filter-chip__meta--info {
  color: #6b7280;
}

.product-filter-chip--active .product-filter-chip__meta--info {
  color: #ef4444;
}

.product-filter-chip__meta-group {
  gap: 4px;
}

.product-filter-chip:hover {
  background: #eceef2;
}

.product-filter-chip--primary:hover {
  background: #ffe8e8;
}

.product-filter-chip__meta .is-rotated {
  transform: rotate(180deg);
}

.product-filter-dropdown {
  position: absolute;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 22px 44px rgba(15, 23, 42, 0.16);
  max-width: min(100%, 600px);
  min-width: min(100%, 420px);
  padding: 16px;
  width: fit-content;
  z-index: 20;
}

.product-filter-dropdown--mega {
  max-width: min(100%, 1000px);
  min-width: min(100%, 920px);
}

.product-filter-dropdown__options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
}

.product-filter-mega-scroll {
  max-height: min(52vh, 520px);
  overflow-x: hidden;
  overflow-y: auto;
  padding-right: 6px;
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}

.product-filter-mega-scroll::-webkit-scrollbar {
  width: 8px;
}

.product-filter-mega-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.product-filter-mega-scroll::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 999px;
}

.product-filter-mega-grid {
  column-gap: 36px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  row-gap: 28px;
}

.product-filter-group {
  min-width: 0;
}

.product-filter-group__title {
  align-items: center;
  color: #374151;
  display: inline-flex;
  font-size: 15px;
  font-weight: 700;
  gap: 4px;
  margin-bottom: 14px;
}

.product-filter-group__options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 12px;
}

.product-filter-option {
  align-items: center;
  background: #f8f8f8;
  border: 1px solid #d9dde5;
  border-radius: 999px;
  color: #374151;
  cursor: pointer;
  display: inline-flex;
  gap: 6px;
  min-height: 40px;
  padding: 10px 18px;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.product-filter-option:hover {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #2563eb;
}

.product-filter-option--selected {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #2563eb;
}

.product-filter-option--selected .product-filter-chip__meta--info {
  color: #2563eb;
}

.product-filter-dropdown__footer {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 14px;
}

.product-filter-dropdown__button {
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  min-height: 42px;
  padding: 10px 18px;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.product-filter-dropdown__button--ghost {
  background: #fff;
  border: 1px solid #d1d5db;
  color: #111827;
}

.product-filter-dropdown__button--primary {
  background: #d70018;
  border: 1px solid transparent;
  color: #fff;
}

.product-filter-dropdown__button--primary:hover {
  background: #bf0015;
}

.filter-dropdown-enter-active,
.filter-dropdown-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.filter-dropdown-enter-from,
.filter-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media screen and (max-width: 768px) {
  .block-top-sliding-banner {
    flex-direction: column;
  }

  .block-sliding {
    width: 100%;
  }

  .product-series-title,
  .product-filter-title,
  .product-sort-title {
    font-size: 18px;
    margin-bottom: 12px;
  }

  .product-sort-block {
    align-items: flex-start;
    flex-direction: column;
  }

  .product-sort-list {
    justify-content: flex-start;
  }

  .product-card-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .product-filter-dropdown--mega {
    min-width: min(100%, 100%);
  }

  .product-filter-mega-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: 22px;
  }
}

@media screen and (max-width: 540px) {
  .block-sliding .banner-slide .swiper-button-next,
  .block-sliding .banner-slide .swiper-button-prev {
    font-size: 1.2rem;
    height: 50px;
    width: 25px;
  }

  .product-series-list,
  .product-filter-list {
    gap: 6px;
  }

  .product-card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .product-series-chip,
  .product-filter-chip,
  .product-sort-chip {
    font-size: 12px;
    min-height: 36px;
    padding: 8px 10px;
  }

  .product-filter-dropdown {
    padding: 14px;
  }

  .product-filter-dropdown--mega {
    min-width: 100%;
  }

  .product-filter-dropdown__footer {
    grid-template-columns: 1fr;
  }

  .product-filter-option {
    min-height: 38px;
    padding: 8px 14px;
  }

  .product-filter-mega-grid {
    grid-template-columns: 1fr;
  }
}
</style>
