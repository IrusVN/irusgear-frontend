<template>
  <section class="mb-4">
    <div class="bg-white rounded-3 shadow-sm border overflow-hidden">
      <div class="d-flex">

        <!-- LEFT: Promo banner dọc -->
        <div class="side-banner flex-shrink-0 d-none d-lg-block p-2">
          <div class="rounded-3 overflow-hidden h-100 d-flex flex-column align-items-center justify-content-center text-white p-3 text-center"
            :style="{ background: sideColor }">
            <div class="fw-bold mb-1" style="font-size:0.75rem;opacity:0.8;letter-spacing:1px">{{ title }}</div>
            <div class="fw-bold" style="font-size:1.1rem;line-height:1.2">Giảm đến</div>
            <div class="fw-bold" style="font-size:2rem;line-height:1">5 triệu</div>
            <div style="font-size:0.7rem;opacity:0.8" class="mb-3">Trả góp 0%</div>
            <a href="#" class="btn btn-light btn-sm rounded-pill px-3 fw-semibold" style="font-size:0.75rem">Mua ngay</a>
          </div>
        </div>

        <!-- RIGHT: Tabs + Products -->
        <div class="flex-grow-1 min-w-0 py-3">
          <!-- Header -->
          <div class="d-flex align-items-center justify-content-between px-3 pb-2 mb-2" style="border-left: 4px solid #111;">
            <span class="fw-bold m-0" style="font-size: 1rem; letter-spacing: 0.3px;">{{ title }}</span>
            <a href="#" class="text-dark small text-decoration-none fw-semibold">Xem tất cả ›</a>
          </div>

          <!-- Tabs -->
          <div class="px-3 pb-3">
            <div class="d-flex gap-2 overflow-auto no-scrollbar pb-1">
              <button v-for="(tab, i) in tabs" :key="i"
                @click="onTabClick(i, tab)"
                :class="['btn btn-sm rounded-pill border px-3 fw-medium text-nowrap flex-shrink-0 tab-btn', { 'btn-dark': active === i, 'btn-light': active !== i }]"
                style="font-size: 0.8rem; transition: all 0.2s;">
                {{ tab }}
              </button>
            </div>
          </div>

          <!-- Loading state -->
          <div v-if="loading" class="px-3 pb-2 d-flex justify-content-center py-5">
            <div class="spinner-border text-secondary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <!-- Product grid -->
          <div v-else class="px-3 pb-1">
            <div v-if="products.length > 0" class="row g-2">
              <div v-for="p in products.slice(0, 10)" :key="p.id" class="col-6 col-md-4 col-lg-prod">
                <HomeProdCard :product="p" />
              </div>
            </div>
            <div v-else class="text-center py-5 text-muted small">
              Không có sản phẩm nào
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  title:    { type: String, required: true },
  tabs:     { type: Array, default: () => [] },
  products: { type: Array, default: () => [] },
  color:    { type: String, default: '#111' },
  loading:  { type: Boolean, default: false }
});

const emit = defineEmits(['change-tab']);

const active = ref(0);

const onTabClick = (index, tabValue) => {
  if (active.value === index) return;
  active.value = index;
  emit('change-tab', tabValue);
};

const sideColor = computed(() =>
  `linear-gradient(160deg, ${props.color} 0%, #000 100%)`
);
</script>

<style scoped>
.side-banner { width: 170px; }

.no-scrollbar { scrollbar-width: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }

.tab-btn:not(.btn-dark):hover {
  border-color: #111 !important;
}

@media (min-width: 992px) {
  .col-lg-prod { flex: 0 0 auto; width: 20%; }
}
</style>
