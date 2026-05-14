<template>
  <section class="product-list-page">
    <div
      :class="['sticky-filter-bar', { 'sticky-filter-bar--visible': isStickyFilterVisible }]"
      :style="stickyFilterBarStyle"
    >
      <div ref="stickyFilterInnerEl" class="container-xxl w-100 px-0 sticky-filter-bar__inner">
        <div class="product-filter-list product-filter-list--sticky px-4">
          <button v-for="filter in productFilters" :key="`sticky-${filter.key}`"
            :ref="(el) => setFilterChipRef(filter.key, el, 'sticky')" type="button" :class="[
              'product-filter-chip',
              {
                'product-filter-chip--primary': filter.primary && activeDropdownKey !== filter.key,
                'product-filter-chip--active': activeDropdownKey === filter.key || isFilterSelected(filter.key),
              },
            ]" @click="handleFilterClick(filter)">
            <span v-if="filter.leadingIcon === 'filter'" class="product-filter-chip__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M4 5H20L13.5 12.4375V18.25L10.5 19.75V12.4375L4 5Z" stroke="currentColor" stroke-width="1.7"
                  stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>

            <span v-else-if="filter.leadingIcon === 'truck'" class="product-filter-chip__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M3 6.5H13V14.5H3V6.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
                <path d="M13 9H17L20 12V14.5H13V9Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
                <circle cx="7" cy="17.5" r="1.75" stroke="currentColor" stroke-width="1.7" />
                <circle cx="17" cy="17.5" r="1.75" stroke="currentColor" stroke-width="1.7" />
                <path d="M5 9.5H9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                <path d="M3 12H6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
              </svg>
            </span>

            <span v-else-if="filter.leadingIcon === 'new'" class="product-filter-chip__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 5.5V18.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                <path d="M5 7H14.75L13.25 10.5L14.75 14H5" stroke="currentColor" stroke-width="1.7"
                  stroke-linecap="round" stroke-linejoin="round" />
                <path d="M16 13.5V18.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                <circle cx="16" cy="10" r="1.75" stroke="currentColor" stroke-width="1.7" />
                <path d="M18.5 18.5H13.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
              </svg>
            </span>

            <span v-else-if="filter.leadingIcon === 'price'" class="product-filter-chip__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.7" />
                <path d="M12 8.5V12H15" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </span>

            <span>{{ filter.label }}</span>

            <span v-if="filter.trailingIcon === 'chevron'" class="product-filter-chip__meta" aria-hidden="true">
              <svg :class="{ 'is-rotated': activeDropdownKey === filter.key }" viewBox="0 0 20 20" fill="none">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </span>

            <span v-else-if="filter.trailingIcon === 'chevron-info'"
              class="product-filter-chip__meta product-filter-chip__meta-group" aria-hidden="true">
              <svg :class="{ 'is-rotated': activeDropdownKey === filter.key }" viewBox="0 0 20 20" fill="none">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                  stroke-linejoin="round" />
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
          <div v-if="activeDropdown && isStickyFilterVisible" :key="`sticky-${activeDropdown.key}`" ref="dropdownEl"
            class="product-filter-dropdown"
            :class="{ 'product-filter-dropdown--mega': activeDropdown.key === 'filter' }" :style="dropdownStyle">
            <div v-if="activeDropdown.key === 'filter'" class="product-filter-mega-scroll">
              <div class="product-filter-mega-grid">
                <div v-for="section in megaFilterSections" :key="`sticky-mega-${section.key}`"
                  class="product-filter-group">
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
                    <button v-for="option in section.options" :key="`sticky-${section.key}-${option}`" type="button"
                      :class="[
                        'product-filter-option',
                        {
                          'product-filter-option--selected': selectedOptionsByFilter[section.key]?.includes(option),
                        },
                      ]" @click="toggleFilterOption(section.key, option)">
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
              <button v-for="option in activeDropdown.options" :key="`sticky-${activeDropdown.key}-${option}`"
                type="button" :class="[
                  'product-filter-option',
                  {
                    'product-filter-option--selected': selectedOptionsByFilter[activeDropdown.key]?.includes(option),
                  },
                ]" @click="toggleFilterOption(activeDropdown.key, option)">
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
              <button type="button" class="product-filter-dropdown__button product-filter-dropdown__button--ghost"
                @click="closeDropdown">
                Đóng
              </button>
              <button type="button" class="product-filter-dropdown__button product-filter-dropdown__button--primary"
                @click="applyFilterOptions">
                Xem kết quả
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <div class="container-xl px-3 py-4">
      <div v-if="bannerGroups.some(group => group.items && group.items.length > 0)" ref="rootEl"
        data-fetch-key="TopSlidingBanner:0" class="block-top-sliding-banner is-flex">
        <div v-for="(group, index) in bannerGroups" :key="group.id"
          :class="['block-sliding', { reverseBanner: index === 1 }]">
          <div v-if="group.items && group.items.length > 0" class="swiper banner-slide swiper-container">
            <div class="swiper-wrapper">
              <div v-for="banner in group.items" :key="`${group.id}-${banner.href}`" class="swiper-slide">
                <a :href="banner.href" class="banner-img button__link-banner">
                  <img :src="banner.src" :alt="banner.alt" width="595" height="100" loading="lazy" />
                </a>
              </div>
            </div>

            <div class="swiper-pagination" />

            <div class="swiper-button-prev button__view-banner-prev" tabindex="0" role="button"
              aria-label="Previous slide">
              <div class="icon">
                <ArrowIcon direction="left" />
              </div>
            </div>

            <div class="swiper-button-next button__view-banner-next" tabindex="0" role="button" aria-label="Next slide">
              <div class="icon">
                <ArrowIcon direction="right" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="product-series-block">
        <h2 v-if="pageTitle" class="product-series-title">{{ pageTitle }}</h2>

        <div class="product-series-list">
          <button v-for="item in productSeries" :key="item.key || item.label" type="button"
            :class="['product-series-chip', { 'product-series-chip--active': item.active }]"
            @click="handleSeriesClick(item)">
            {{ item.label }}
          </button>
        </div>
      </div>

      <div ref="filterBlockEl" class="product-filter-block">
        <h2 class="product-filter-title">
          <span class="product-filter-title__desktop">{{ $t('common.productFilter') }}</span>
          <span class="product-filter-title__mobile">Chọn theo tiêu chí</span>
        </h2>

        <div class="product-filter-list product-filter-list--desktop">
          <button v-for="filter in productFilters" :key="filter.key" :ref="(el) => setFilterChipRef(filter.key, el)"
            type="button" :class="[
              'product-filter-chip',
              {
                'product-filter-chip--primary': filter.primary && activeDropdownKey !== filter.key,
                'product-filter-chip--active': activeDropdownKey === filter.key || isFilterSelected(filter.key),
              },
            ]" @click="handleFilterClick(filter)">
            <span v-if="filter.leadingIcon === 'filter'" class="product-filter-chip__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M4 5H20L13.5 12.4375V18.25L10.5 19.75V12.4375L4 5Z" stroke="currentColor" stroke-width="1.7"
                  stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>

            <span v-else-if="filter.leadingIcon === 'truck'" class="product-filter-chip__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M3 6.5H13V14.5H3V6.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
                <path d="M13 9H17L20 12V14.5H13V9Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
                <circle cx="7" cy="17.5" r="1.75" stroke="currentColor" stroke-width="1.7" />
                <circle cx="17" cy="17.5" r="1.75" stroke="currentColor" stroke-width="1.7" />
                <path d="M5 9.5H9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                <path d="M3 12H6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
              </svg>
            </span>

            <span v-else-if="filter.leadingIcon === 'new'" class="product-filter-chip__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 5.5V18.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                <path d="M5 7H14.75L13.25 10.5L14.75 14H5" stroke="currentColor" stroke-width="1.7"
                  stroke-linecap="round" stroke-linejoin="round" />
                <path d="M16 13.5V18.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                <circle cx="16" cy="10" r="1.75" stroke="currentColor" stroke-width="1.7" />
                <path d="M18.5 18.5H13.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
              </svg>
            </span>

            <span v-else-if="filter.leadingIcon === 'price'" class="product-filter-chip__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.7" />
                <path d="M12 8.5V12H15" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </span>

            <span>{{ filter.label }}</span>

            <span v-if="filter.trailingIcon === 'chevron'" class="product-filter-chip__meta" aria-hidden="true">
              <svg :class="{ 'is-rotated': activeDropdownKey === filter.key }" viewBox="0 0 20 20" fill="none">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </span>

            <span v-else-if="filter.trailingIcon === 'chevron-info'"
              class="product-filter-chip__meta product-filter-chip__meta-group" aria-hidden="true">
              <svg :class="{ 'is-rotated': activeDropdownKey === filter.key }" viewBox="0 0 20 20" fill="none">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
              <svg viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5" />
                <path d="M10 8.4V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                <circle cx="10" cy="6.1" r="0.75" fill="currentColor" />
              </svg>
            </span>
          </button>
        </div>

        <div class="product-filter-list product-filter-list--mobile">
          <button v-for="filter in mobileCriteriaFilters" :key="`mobile-criteria-${filter.key}`" type="button" :class="[
            'product-filter-chip',
            { 'product-filter-chip--active': isFilterSelected(filter.key) },
          ]" @click="handleMobileCriteriaClick(filter)">
            <span v-if="filter.leadingIcon === 'truck'" class="product-filter-chip__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M3 6.5H13V14.5H3V6.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
                <path d="M13 9H17L20 12V14.5H13V9Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
                <circle cx="7" cy="17.5" r="1.75" stroke="currentColor" stroke-width="1.7" />
                <circle cx="17" cy="17.5" r="1.75" stroke="currentColor" stroke-width="1.7" />
              </svg>
            </span>
            <span v-else-if="filter.leadingIcon === 'price'" class="product-filter-chip__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.7" />
                <path d="M12 8.5V12H15" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </span>
            <span v-else-if="filter.leadingIcon === 'new'" class="product-filter-chip__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 5.5V18.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                <path d="M5 7H14.75L13.25 10.5L14.75 14H5" stroke="currentColor" stroke-width="1.7"
                  stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <span>{{ filter.label }}</span>
          </button>
        </div>

        <transition name="filter-dropdown" mode="out-in">
          <div v-if="activeDropdown && !isStickyFilterVisible" :key="activeDropdown.key" ref="dropdownEl"
            class="product-filter-dropdown"
            :class="{ 'product-filter-dropdown--mega': activeDropdown.key === 'filter' }" :style="dropdownStyle">
            <div v-if="activeDropdown.key === 'filter'" class="product-filter-mega-scroll">
              <div class="product-filter-mega-grid">
                <div v-for="section in megaFilterSections" :key="`mega-${section.key}`" class="product-filter-group">
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
                    <button v-for="option in section.options" :key="`${section.key}-${option}`" type="button" :class="[
                      'product-filter-option',
                      {
                        'product-filter-option--selected': selectedOptionsByFilter[section.key]?.includes(option),
                      },
                    ]" @click="toggleFilterOption(section.key, option)">
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
              <button v-for="option in activeDropdown.options" :key="`${activeDropdown.key}-${option}`" type="button"
                :class="[
                  'product-filter-option',
                  {
                    'product-filter-option--selected': selectedOptionsByFilter[activeDropdown.key]?.includes(option),
                  },
                ]" @click="toggleFilterOption(activeDropdown.key, option)">
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
              <button type="button" class="product-filter-dropdown__button product-filter-dropdown__button--ghost"
                @click="closeDropdown">
                Đóng
              </button>
              <button type="button" class="product-filter-dropdown__button product-filter-dropdown__button--primary"
                @click="applyFilterOptions">
                Xem kết quả
              </button>
            </div>
          </div>
        </transition>
      </div>

      <div class="product-sort-block">
        <h2 class="product-sort-title">{{ $t('common.sortBy') }}</h2>

        <div class="product-sort-list product-sort-list--desktop">
          <button v-for="sort in sortOptions" :key="sort.key" type="button" :class="[
            'product-sort-chip',
            { 'product-sort-chip--active': activeSortKey === sort.key },
          ]" @click="handleSortClick(sort.key)">
            <span class="product-sort-chip__icon" aria-hidden="true" v-html="sort.icon" />
            <span>{{ sort.label }}</span>
          </button>
        </div>

        <div class="product-mobile-sort-tabs">
          <button type="button" :class="[
            'product-mobile-sort-tab',
            { 'product-mobile-sort-tab--active': activeSortKey === 'popular' },
          ]" @click="handleSortClick('popular')">
            Phổ biến
          </button>
          <button type="button" :class="[
            'product-mobile-sort-tab',
            { 'product-mobile-sort-tab--active': activeSortKey === 'promo' },
          ]" @click="handleSortClick('promo')">
            Khuyến mãi
          </button>
          <button type="button" :class="[
            'product-mobile-sort-tab',
            { 'product-mobile-sort-tab--active': activeSortKey === 'price_asc' || activeSortKey === 'price_desc' },
          ]" @click="handleMobilePriceSort">
            <span>Giá</span>
            <span class="product-mobile-sort-tab__arrows" aria-hidden="true">
              <svg viewBox="0 0 12 16" fill="none">
                <path d="M6 3L3.5 5.5H8.5L6 3Z" fill="currentColor" />
                <path d="M6 13L8.5 10.5H3.5L6 13Z" fill="currentColor" />
              </svg>
            </span>
          </button>
          <button type="button" :class="[
            'product-mobile-sort-tab',
            { 'product-mobile-sort-tab--active': isMobileFilterActive },
          ]" @click="openMobileFilterSheet">
            <span>Bộ lọc</span>
            <span class="product-mobile-sort-tab__filter" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none">
                <path d="M3 4H17L11.5 10.2V15.5L8.5 17V10.2L3 4Z" fill="currentColor" />
              </svg>
              <span v-if="selectedFilterCount" class="product-mobile-sort-tab__badge">{{ selectedFilterCount }}</span>
            </span>
          </button>
        </div>
      </div>

      <div class="product-card-grid">
        <HomeProdCard v-for="product in visibleProductListItems" :key="product.id" :product="product" />
      </div>

      <div v-if="hasMoreProducts" class="product-load-more">
        <button type="button" class="product-load-more__button" @click="handleLoadMoreProducts">
          <span>{{ $t('common.viewMoreProducts', { count: remainingProductCount }) }}</span>
          <span class="product-load-more__icon" aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </span>
        </button>
      </div>
    </div>

    <BottomSheet :open="isMobileFilterSheetOpen" @close="closeMobileFilterSheet">
      <div class="mobile-filter-sheet">
        <div class="mobile-filter-sheet__header">
          <h3>Bộ lọc</h3>
          <button type="button" class="mobile-filter-sheet__close" aria-label="Đóng bộ lọc"
            @click="closeMobileFilterSheet">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <div class="mobile-filter-sheet__body">
          <div class="mobile-filter-section">
            <h4>Trạng thái hàng</h4>
            <div class="mobile-filter-options">
              <button v-for="filter in mobileStatusFilters" :key="`mobile-status-${filter.key}`" type="button" :class="[
                'mobile-filter-option',
                { 'mobile-filter-option--selected': isFilterSelected(filter.key) },
              ]" @click="toggleMobileBooleanFilter(filter)">
                {{ filter.label }}
              </button>
            </div>
          </div>

          <div v-for="filter in mobileSheetFilters" :key="`mobile-sheet-${filter.key}`" class="mobile-filter-section">
            <h4>{{ filter.label }}</h4>
            <div class="mobile-filter-options">
              <button v-for="option in filter.options" :key="`mobile-sheet-${filter.key}-${option}`" type="button"
                :class="[
                  'mobile-filter-option',
                  { 'mobile-filter-option--selected': selectedOptionsByFilter[filter.key]?.includes(option) },
                ]" @click="toggleFilterOption(filter.key, option)">
                {{ option }}
              </button>
            </div>
          </div>
        </div>

        <div class="mobile-filter-sheet__footer">
          <button type="button" class="mobile-filter-sheet__reset" @click="resetMobileFilters">
            Thiết lập lại
          </button>
          <button type="button" class="mobile-filter-sheet__apply" @click="applyMobileFilterOptions">
            Xem kết quả
          </button>
        </div>
      </div>
    </BottomSheet>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import HomeProdCard from "@/components/Home/HomeProdCard.vue";
import ArrowIcon from "@/components/Icons/ArrowIcon.vue";
import BottomSheet from "@/components/Common/BottomSheet.vue";
import { useProductListingStore } from "@/stores/productListingStore";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const productListingStore = useProductListingStore();
const {
  pageTitle,
  loadError,
  isPageLoading,
  isLoadingMore,
  selectedSeriesKey,
  bannerGroups,
  productSeries,
  sortOptions,
  productFilters,
  visibleProductListItems,
  remainingProductCount,
  hasMoreProducts,
  paginationState,
  activeSortKey,
  selectedOptionsByFilter,
} = storeToRefs(productListingStore);

const rootEl = ref(null);
const filterBlockEl = ref(null);
const stickyFilterInnerEl = ref(null);
const dropdownEl = ref(null);
const dropdownStyle = ref({});
const primaryFilterChipRefs = new Map();
const stickyFilterChipRefs = new Map();
const isStickyFilterVisible = ref(false);
const stickyTopOffset = ref(0);
const activeDropdownKey = ref(null);
const isMobileFilterSheetOpen = ref(false);
let requestRefreshTimer = null;

const stickyFilterBarStyle = computed(() => ({
  top: `var(--customer-sidebar-offset, ${stickyTopOffset.value}px)`,
}));

const mobileCriteriaFilters = computed(() => {
  const order = ["stock", "price", "new"];
  return order
    .map((key) => productFilters.value.find((filter) => filter.key === key))
    .filter(Boolean);
});

const mobileStatusFilters = computed(() =>
  ["stock", "new"]
    .map((key) => productFilters.value.find((filter) => filter.key === key))
    .filter(Boolean),
);

const activeDropdown = computed(() =>
  productFilters.value.find((filter) => filter.key === activeDropdownKey.value && (filter.options?.length || filter.key === "filter")),
);

const megaFilterSections = computed(() =>
  productFilters.value.filter((filter) => filter.key !== "filter" && filter.options?.length),
);

const mobileSheetFilters = computed(() =>
  productFilters.value.filter((filter) => !["filter", "stock", "new"].includes(filter.key) && filter.options?.length),
);

const selectedFilterCount = computed(() =>
  Object.values(selectedOptionsByFilter.value).reduce((total, values) => total + (Array.isArray(values) ? values.length : 0), 0),
);

const isMobileFilterActive = computed(() => selectedFilterCount.value > 0);

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

const isFilterSelected = (filterKey) => {
  const selected = selectedOptionsByFilter.value[filterKey];
  return Array.isArray(selected) && selected.length > 0;
};

const scheduleProductListingRefresh = () => {
  if (requestRefreshTimer) {
    clearTimeout(requestRefreshTimer);
  }

  requestRefreshTimer = setTimeout(async () => {
    requestRefreshTimer = null;
    await productListingStore.loadProductListingPage({ page: 1 });
    await nextTick();
    await updateDropdownPosition();
  }, 150);
};

const handleFilterClick = (filter) => {
  if (!filter) return;

  if (filter.key === "stock" || filter.key === "new") {
    productListingStore.toggleBooleanFilter(filter.key, filter.label);
    closeDropdown();
    scheduleProductListingRefresh();
    return;
  }

  if (!filter.options?.length && filter.key !== "filter") return;

  activeDropdownKey.value = activeDropdownKey.value === filter.key ? null : filter.key;
};

const handleMobileCriteriaClick = (filter) => {
  if (!filter) return;

  if (filter.key === "price") {
    openMobileFilterSheet();
    return;
  }

  handleFilterClick(filter);
};

const toggleFilterOption = (filterKey, option) => {
  productListingStore.toggleFilterOption(filterKey, option);
};

const closeDropdown = () => {
  activeDropdownKey.value = null;
};

const openMobileFilterSheet = () => {
  closeDropdown();
  isMobileFilterSheetOpen.value = true;
};

const closeMobileFilterSheet = () => {
  isMobileFilterSheetOpen.value = false;
};

const applyFilterOptions = async () => {
  if (requestRefreshTimer) {
    clearTimeout(requestRefreshTimer);
    requestRefreshTimer = null;
  }

  await productListingStore.loadProductListingPage({ page: 1 });
  closeDropdown();
  await nextTick();
  await updateDropdownPosition();
};

const applyMobileFilterOptions = async () => {
  closeMobileFilterSheet();
  await applyFilterOptions();
};

const resetMobileFilters = () => {
  selectedOptionsByFilter.value = {};
};

const toggleMobileBooleanFilter = (filter) => {
  if (!filter) return;
  productListingStore.toggleBooleanFilter(filter.key, filter.label);
};

const handleMobilePriceSort = () => {
  const nextSortKey = activeSortKey.value === "price_asc" ? "price_desc" : "price_asc";
  handleSortClick(nextSortKey);
};

const handleSortClick = async (sortKey) => {
  await productListingStore.setSortKey(sortKey);
  await nextTick();
  await updateDropdownPosition();
};

const handleSeriesClick = async (series) => {
  await productListingStore.toggleSeries(series.key);
  await nextTick();
  await updateDropdownPosition();
};

const handleLoadMoreProducts = async () => {
  if (!paginationState.value.nextPage || isLoadingMore.value) return;
  await productListingStore.loadProductListingPage({ page: paginationState.value.nextPage, append: true });
  await nextTick();
  await updateDropdownPosition();
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
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
  const dropdownViewportTop = containerRect.top + top;
  const availableHeight = viewportHeight ? viewportHeight - dropdownViewportTop - 16 : 420;
  const dropdownMaxHeight = Math.max(220, Math.min(520, availableHeight));
  const dropdownBaseStyle = {
    top: `${top}px`,
    "--filter-dropdown-max-height": `${dropdownMaxHeight}px`,
    "--filter-dropdown-options-max-height": `${Math.max(140, dropdownMaxHeight - 94)}px`,
  };

  if (dropdownNode) {
    const dropdownWidth = dropdownNode.offsetWidth;
    const fitsRightFromLeftAnchor = triggerLeft + dropdownWidth <= containerRect.width;
    const fitsLeftFromRightAnchor = triggerRight + dropdownWidth <= containerRect.width;

    if (!fitsRightFromLeftAnchor && fitsLeftFromRightAnchor) {
      dropdownStyle.value = {
        ...dropdownBaseStyle,
        right: `${Math.max(0, triggerRight)}px`,
        left: "auto",
      };
      return;
    }

    const maxLeft = Math.max(0, containerRect.width - dropdownWidth);
    const left = Math.min(Math.max(0, triggerLeft), maxLeft);

    dropdownStyle.value = {
      ...dropdownBaseStyle,
      left: `${left}px`,
      right: "auto",
    };
    return;
  }

  dropdownStyle.value = {
    ...dropdownBaseStyle,
    left: `${triggerLeft}px`,
    right: "auto",
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
  syncStickyState();
  updateDropdownPosition();
};

const handleWindowScroll = () => {
  syncStickyState();
};

const getCustomerSidebarOffset = () => {
  if (typeof document === "undefined") return;

  const rawOffset = getComputedStyle(document.documentElement)
    .getPropertyValue("--customer-sidebar-offset")
    .trim();
  const parsedOffset = Number.parseFloat(rawOffset);

  if (Number.isFinite(parsedOffset)) {
    return Math.ceil(parsedOffset);
  }
};

const updateStickyOffset = () => {
  const customerSidebarOffset = getCustomerSidebarOffset();

  if (Number.isFinite(customerSidebarOffset)) {
    stickyTopOffset.value = customerSidebarOffset;
    return;
  }

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

const syncStickyState = () => {
  if (!filterBlockEl.value) return;

  updateStickyOffset();
  isStickyFilterVisible.value = filterBlockEl.value.getBoundingClientRect().top <= stickyTopOffset.value;
};

const handleCustomerSidebarOffsetChange = () => {
  syncStickyState();
  updateDropdownPosition();
};

const initSwipers = async () => {
  if (!import.meta.client || !rootEl.value) return;

  const [{ default: Swiper }, modules] = await Promise.all([
    import("swiper"),
    import("swiper/modules"),
  ]);

  const { Navigation, Pagination } = modules;
  const sliderEls = rootEl.value.querySelectorAll(".banner-slide");

  swiperInstances = Array.from(sliderEls).map((sliderEl, index) =>
    new Swiper(sliderEl, {
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
    }),
  );
};

const destroySwipers = () => {
  swiperInstances.forEach((instance) => {
    if (instance && !instance.destroyed) {
      instance.destroy(true, true);
    }
  });

  swiperInstances = [];
};

import { useRoute } from 'vue-router';

const route = useRoute();
const normalizeRouteValue = (value) => {
  if (Array.isArray(value)) return String(value[0] || "").trim();
  return String(value || "").trim();
};

const buildRouteListingContext = () => {
  const context = Object.entries(route.query || {}).reduce((accumulator, [key, value]) => {
    const normalizedKey = String(key || "").trim();
    const normalizedValue = normalizeRouteValue(value);

    if (normalizedKey && normalizedValue) {
      accumulator[normalizedKey] = normalizedValue;
    }

    return accumulator;
  }, {});

  const fallbackCategory =
    normalizeRouteValue(route.params.slug) ||
    (route.name?.toString().includes('category') ? normalizeRouteValue(route.params.slug) : "");

  if (!context.category && fallbackCategory) {
    context.category = fallbackCategory;
  }

  return context;
};

const routeListingContext = computed(() => {
  return buildRouteListingContext();
});

const syncListingFromRoute = async ({ force = false, refreshSwipers = false } = {}) => {
  await productListingStore.initializeListing({ context: routeListingContext.value, force }).catch((error) => {
    console.error("Failed to initialize product listing store", error);
  });

  if (!refreshSwipers) return;

  await nextTick();
  destroySwipers();
  await initSwipers();
};

onMounted(async () => {
  await syncListingFromRoute();
  await nextTick();
  await initSwipers();
  syncStickyState();
  await updateDropdownPosition();

  if (!mounted && typeof window !== "undefined") {
    window.addEventListener("click", handleClickOutside);
    window.addEventListener("resize", handleWindowResize);
    window.addEventListener("scroll", handleWindowScroll, { passive: true });
    window.addEventListener("customer-sidebar:offset-change", handleCustomerSidebarOffsetChange);
    mounted = true;
  }
});

watch(activeDropdownKey, async () => {
  await updateDropdownPosition();
});

watch(routeListingContext, async (nextContext, previousContext) => {
  if (JSON.stringify(nextContext) === JSON.stringify(previousContext)) {
    return;
  }

  closeDropdown();
  await syncListingFromRoute({ force: true, refreshSwipers: true });
  await updateDropdownPosition();
}, { deep: true });

watch(isStickyFilterVisible, async () => {
  await updateDropdownPosition();
});

onBeforeUnmount(() => {
  destroySwipers();

  if (requestRefreshTimer) {
    clearTimeout(requestRefreshTimer);
  }

  if (mounted && typeof window !== "undefined") {
    window.removeEventListener("click", handleClickOutside);
    window.removeEventListener("resize", handleWindowResize);
    window.removeEventListener("scroll", handleWindowScroll);
    window.removeEventListener("customer-sidebar:offset-change", handleCustomerSidebarOffsetChange);
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
  padding: 0 0.5rem;
  pointer-events: none;
  position: fixed;
  right: 0;
  top: 0;
  transform: translateY(-100%);
  transition:
    top 0.32s ease,
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
  padding: 1rem;
}

@media (min-width: 992px) {
  .sticky-filter-bar {
    padding-left: 1rem;
    padding-right: 1rem;
  }
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

.swiper-container-horizontal>.swiper-pagination-bullets,
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

.swiper-container-horizontal>.swiper-pagination-bullets .swiper-pagination-bullet {
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
  background-color: #111827;
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

.product-series-chip--active {
  background: #fff;
  border-color: #111827;
  box-shadow: 0 8px 18px rgba(17, 24, 39, 0.12);
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

.product-filter-title__mobile,
.product-filter-list.product-filter-list--mobile,
.product-mobile-sort-tabs {
  display: none;
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
  background: #111827;
  border: 0;
  border-radius: 12px;
  color: #fff;
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
  background: #000;
  color: #fff;
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
  background: #111827;
  border-color: #111827;
  box-shadow: 0 8px 18px rgba(17, 24, 39, 0.14);
  color: #fff;
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

.product-mobile-sort-tabs {
  align-items: stretch;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  border-top: 1px solid #e5e7eb;
  display: none;
  width: 100%;
}

.product-mobile-sort-tab {
  align-items: center;
  background: #fff;
  border: 0;
  border-right: 1px solid #d1d5db;
  color: #6b7280;
  display: inline-flex;
  flex: 1 1 0;
  font-size: 14px;
  font-weight: 500;
  gap: 4px;
  justify-content: center;
  min-height: 44px;
  padding: 10px 6px;
  position: relative;
}

.product-mobile-sort-tab:last-child {
  border-right: 0;
}

.product-mobile-sort-tab--active {
  color: #111827;
  font-weight: 700;
}

.product-mobile-sort-tab--active::after {
  background: #111827;
  bottom: -1px;
  content: "";
  height: 1px;
  left: 0;
  position: absolute;
  right: 0;
}

.product-mobile-sort-tab__arrows,
.product-mobile-sort-tab__filter {
  align-items: center;
  color: #9ca3af;
  display: inline-flex;
  flex-shrink: 0;
  justify-content: center;
  position: relative;
}

.product-mobile-sort-tab__arrows svg {
  height: 16px;
  width: 12px;
}

.product-mobile-sort-tab__filter svg {
  height: 20px;
  width: 20px;
}

.product-mobile-sort-tab__badge {
  align-items: center;
  background: #111827;
  border-radius: 999px;
  color: #fff;
  display: inline-flex;
  font-size: 10px;
  font-weight: 700;
  height: 16px;
  justify-content: center;
  min-width: 16px;
  padding: 0 4px;
  position: absolute;
  right: -8px;
  top: -7px;
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
  background: #fff;
  border-color: #111827;
  color: #111827;
}

.product-filter-chip--active {
  background: #fff;
  border-color: #111827;
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.08);
  color: #111827;
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
  color: #111827;
}

.product-filter-chip__meta-group {
  gap: 4px;
}

.product-filter-chip:hover {
  background: #eceef2;
}

.product-filter-chip--primary:hover {
  background: #f3f4f6;
}

.product-filter-chip__meta .is-rotated {
  transform: rotate(180deg);
}

.product-filter-dropdown {
  position: absolute;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 22px 44px rgba(15, 23, 42, 0.16);
  display: flex;
  flex-direction: column;
  max-height: var(--filter-dropdown-max-height, min(62vh, 520px));
  max-width: min(100%, 600px);
  min-width: min(100%, 420px);
  overflow: hidden;
  padding: 16px;
  width: fit-content;
  z-index: 20;
}

.product-filter-dropdown--mega {
  max-width: min(100%, 1000px);
  min-width: min(100%, 920px);
}

.product-filter-dropdown__options {
  align-content: flex-start;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
  max-height: var(--filter-dropdown-options-max-height, min(44vh, 420px));
  overflow-x: hidden;
  overflow-y: auto;
  padding-right: 6px;
  scrollbar-color: #d1d5db transparent;
  scrollbar-width: thin;
}

.product-filter-mega-scroll {
  max-height: var(--filter-dropdown-options-max-height, min(52vh, 520px));
  overflow-x: hidden;
  overflow-y: auto;
  padding-right: 6px;
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}

.product-filter-mega-scroll::-webkit-scrollbar {
  width: 8px;
}

.product-filter-dropdown__options::-webkit-scrollbar {
  width: 8px;
}

.product-filter-mega-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.product-filter-dropdown__options::-webkit-scrollbar-track {
  background: transparent;
}

.product-filter-mega-scroll::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 999px;
}

.product-filter-dropdown__options::-webkit-scrollbar-thumb {
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
  background: #fff;
  border-color: #111827;
  color: #111827;
}

.product-filter-option--selected {
  background: #111827;
  border-color: #111827;
  color: #fff;
}

.product-filter-option--selected .product-filter-chip__meta--info {
  color: #fff;
}

.product-filter-dropdown__footer {
  display: grid;
  flex-shrink: 0;
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
  background: #111827;
  border: 1px solid transparent;
  color: #fff;
}

.product-filter-dropdown__button--primary:hover {
  background: #000;
}

.mobile-filter-sheet {
  background: #fff;
  color: #111827;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.mobile-filter-sheet__header {
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  min-height: 68px;
  padding: 16px 56px;
  position: relative;
}

.mobile-filter-sheet__header h3 {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  margin: 0;
}

.mobile-filter-sheet__close {
  align-items: center;
  background: transparent;
  border: 0;
  color: #111827;
  display: inline-flex;
  height: 40px;
  justify-content: center;
  padding: 0;
  position: absolute;
  right: 16px;
  top: 14px;
  width: 40px;
}

.mobile-filter-sheet__close svg {
  height: 24px;
  width: 24px;
}

.mobile-filter-sheet__body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: 18px 16px 96px;
}

.mobile-filter-section {
  margin-bottom: 18px;
}

.mobile-filter-section h4 {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.35;
  margin: 0 0 10px;
}

.mobile-filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.mobile-filter-option {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  color: #111827;
  font-size: 14px;
  min-height: 32px;
  padding: 6px 10px;
}

.mobile-filter-option--selected {
  background: #111827;
  border-color: #111827;
  color: #fff;
}

.mobile-filter-sheet__footer {
  background: #fff;
  border-top: 1px solid #e5e7eb;
  bottom: 0;
  display: grid;
  flex-shrink: 0;
  gap: 10px;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  left: 0;
  padding: 16px;
  position: sticky;
  right: 0;
}

.mobile-filter-sheet__reset,
.mobile-filter-sheet__apply {
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  min-height: 46px;
  padding: 10px 14px;
}

.mobile-filter-sheet__reset {
  background: #fff;
  border: 1px solid #d1d5db;
  color: #111827;
}

.mobile-filter-sheet__apply {
  background: #111827;
  border: 1px solid #111827;
  color: #fff;
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

@media screen and (max-width: 991.98px) {
  .sticky-filter-bar {
    top: 0;
    z-index: 120;
  }
}

@media screen and (max-width: 768px) {
  .sticky-filter-bar {
    display: none;
  }

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

  .product-filter-block {
    margin-top: 20px;
  }

  .product-filter-title {
    font-size: 15px;
  }

  .product-filter-title__desktop,
  .product-filter-list--desktop,
  .product-sort-title,
  .product-sort-list--desktop {
    display: none;
  }

  .product-filter-title__mobile {
    display: inline;
  }

  .product-filter-list.product-filter-list--mobile {
    display: flex;
  }

  .product-sort-block {
    align-items: stretch;
    flex-direction: column;
    gap: 0;
    margin-left: -16px;
    margin-right: -16px;
    margin-top: 14px;
  }

  .product-mobile-sort-tabs {
    display: flex;
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
