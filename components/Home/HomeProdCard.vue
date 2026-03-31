<template>
  <div class="prod-card h-100 position-relative">

    <span v-if="product.badge" class="pos-badge">{{ product.badge }}</span>

    <!-- Image -->
    <div class="img-box d-flex align-items-center justify-content-center">
      <img :src="product.img" :alt="product.name" class="prod-img">
    </div>

    <!-- Body -->
    <div class="p-2">
      <p class="prod-name">{{ product.name }}</p>

      <div class="d-flex align-items-center gap-1 mb-1 flex-wrap">
        <span class="price-new">{{ fmt(product.price) }}</span>
        <span class="disc-badge">-{{ product.discount }}%</span>
      </div>
      <div class="price-old">{{ fmt(product.originalPrice) }}</div>

      <div class="gift-list">
        <div v-for="(g, i) in product.gifts.slice(0,2)" :key="i" class="gift-row">
          <i class="bi bi-gift"></i> {{ g }}
        </div>
      </div>

      <div class="bottom-row">
        <span class="rating"><i class="bi bi-star-fill"></i> {{ product.rating }}</span>
        <span class="sold">{{ product.sold }} đã bán</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ product: { type: Object, required: true } });
const fmt = (v) => new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(v);
</script>

<style scoped>
.prod-card {
  background: #fff;
  border: 1px solid #ebebeb;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}
.prod-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  transform: translateY(-3px);
  border-color: #ccc;
}

.pos-badge {
  position: absolute;
  top: 6px; left: 6px;
  z-index: 1;
  background: #e53935;
  color: #fff;
  font-size: 0.62rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}

.img-box { height: 155px; background: #fafafa; }
.prod-img { max-width: 100%; max-height: 100%; object-fit: contain; padding: 8px; }

.prod-name {
  font-size: 0.82rem;
  font-weight: 600;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.3em;
  margin-bottom: 6px;
  color: #111;
}

.price-new { font-size: 0.95rem; font-weight: 700; color: #e53935; }
.disc-badge { background: #e53935; color: #fff; font-size: 0.62rem; font-weight: 700; padding: 2px 5px; border-radius: 4px; }
.price-old { font-size: 0.72rem; color: #999; text-decoration: line-through; margin-bottom: 6px; }

.gift-list { border-top: 1px solid #f0f0f0; padding-top: 5px; margin-bottom: 6px; min-height: 2.8em; }
.gift-row { font-size: 0.68rem; color: #555; display: flex; align-items: center; gap: 4px; margin-bottom: 2px; }
.gift-row .bi { color: #e53935; font-size: 0.62rem; flex-shrink: 0; }

.bottom-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; border-top: 1px solid #f0f0f0; padding-top: 5px; }
.rating { font-size: 0.72rem; font-weight: 600; color: #111; display: flex; align-items: center; gap: 3px; }
.rating .bi { color: #f5a623; font-size: 0.65rem; }
.sold { font-size: 0.68rem; color: #999; }

@media (max-width: 359.98px) {
  .bottom-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
