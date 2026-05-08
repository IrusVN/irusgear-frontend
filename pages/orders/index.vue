<template>
  <div class="orders-page">
  <!-- Tab Bar -->
  <div class="orders-tabs">
    <div
      v-for="tab in tabs"
      :key="tab.key"
      class="orders-tabs__item"
      :class="{ 'orders-tabs__item--active': activeTab === tab.key }"
      @click="activeTab = tab.key"
    >
      {{ tab.label }}
    </div>
  </div>

  <!-- Filter Bar -->
  <div class="orders-filter">
    <div class="orders-filter__date-range">
      <i class="bi bi-calendar3"></i>
      <input type="date" v-model="dateFrom" class="orders-filter__date-input" />
      <span class="orders-filter__date-sep">
        <i class="bi bi-arrow-right-short"></i>
      </span>
      <input type="date" v-model="dateTo" class="orders-filter__date-input" />
    </div>
  </div>

  <!-- Order List -->
  <div class="orders-list">
    <!-- Empty State -->
    <div v-if="filteredOrders.length === 0" class="orders-empty">
      <img
        src="https://cdn-static.smember.com.vn/_next/static/media/empty.f8088c4d.png"
        alt="empty"
        class="orders-empty__img"
      />
      <p class="orders-empty__text">Bạn chưa có đơn hàng nào</p>
      <NuxtLink :to="localePath('/')" class="btn btn-dark rounded-pill px-4 py-2">
        <i class="bi bi-house-door me-2"></i>Trang chủ
      </NuxtLink>
    </div>

    <!-- Order Cards -->
    <div
      v-for="order in filteredOrders"
      :key="order.id"
      class="orders-card"
    >
      <!-- Order Header -->
      <div class="orders-card__header">
        <div class="orders-card__meta">
          <span class="orders-card__id">Mã đơn #{{ order.id }}</span>
          <span class="orders-card__date">{{ order.date }}</span>
        </div>
        <span class="orders-card__status" :class="`orders-card__status--${order.statusKey}`">
          <i :class="order.statusIcon"></i>
          {{ order.status }}
        </span>
      </div>

      <!-- Order Items -->
      <div class="orders-card__items">
        <div
          v-for="item in order.items"
          :key="item.id"
          class="orders-card__item"
        >
          <img :src="item.image" :alt="item.name" class="orders-card__item-img" />
          <div class="orders-card__item-info">
            <p class="orders-card__item-name">{{ item.name }}</p>
            <p class="orders-card__item-qty">x{{ item.qty }}</p>
          </div>
          <div class="orders-card__item-price">
            <span class="orders-card__item-price-current">{{ item.price }}</span>
            <span v-if="item.originalPrice" class="orders-card__item-price-original">{{ item.originalPrice }}</span>
          </div>
        </div>
      </div>

      <!-- Order Footer -->
      <div class="orders-card__footer">
        <div class="orders-card__total">
          <span class="orders-card__total-label">Tổng cộng:</span>
          <span class="orders-card__total-value">{{ order.total }}</span>
        </div>
        <div class="orders-card__actions">
          <button type="button" class="btn btn-outline-dark btn-sm rounded-pill px-3">
            <i class="bi bi-chat-left-text me-1"></i>Nhắn tin
          </button>
          <button type="button" class="btn btn-dark btn-sm rounded-pill px-3">
            <i class="bi bi-eye me-1"></i>Chi tiết
          </button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLocalePath } from '#imports'

definePageMeta({ layout: 'profile', middleware: ['auth-guard'] })

useHead({ title: 'Lịch sử mua hàng - IrusGear' })

const localePath = useLocalePath()

const tabs = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ xác nhận' },
  { key: 'processing', label: 'Đang xử lý' },
  { key: 'shipping', label: 'Đang vận chuyển' },
  { key: 'delivered', label: 'Đã nhận hàng' },
  { key: 'cancelled', label: 'Đã huỷ' },
]

const activeTab = ref('all')
const dateFrom = ref('')
const dateTo = ref('')

const mockOrders = [
  {
    id: '100001',
    date: '05/05/2026',
    status: 'Chờ xác nhận',
    statusKey: 'pending',
    statusIcon: 'bi bi-clock',
    total: '14.990.000đ',
    items: [
      {
        id: 1,
        name: 'iPhone 16 Pro Max 256GB - Titan Tự Nhiên',
        image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/i/p/iphone-16-pro-max_2_.png',
        qty: 1,
        price: '14.990.000đ',
        originalPrice: '16.990.000đ',
      },
    ],
  },
  {
    id: '100002',
    date: '02/05/2026',
    status: 'Đang vận chuyển',
    statusKey: 'shipping',
    statusIcon: 'bi bi-truck',
    total: '8.490.000đ',
    items: [
      {
        id: 2,
        name: 'Samsung Galaxy S25 Ultra 256GB',
        image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/s/2/s25-ultra_1.png',
        qty: 1,
        price: '8.490.000đ',
        originalPrice: '',
      },
    ],
  },
  {
    id: '100003',
    date: '28/04/2026',
    status: 'Đã nhận hàng',
    statusKey: 'delivered',
    statusIcon: 'bi bi-check-circle',
    total: '2.990.000đ',
    items: [
      {
        id: 3,
        name: 'Tai nghe Bluetooth AirPods Pro 2',
        image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/a/r/airpods-pro-2-1.png',
        qty: 2,
        price: '2.990.000đ',
        originalPrice: '',
      },
    ],
  },
  {
    id: '100004',
    date: '20/04/2026',
    status: 'Đã huỷ',
    statusKey: 'cancelled',
    statusIcon: 'bi bi-x-circle',
    total: '5.990.000đ',
    items: [
      {
        id: 4,
        name: 'iPad Air M3 11 inch WiFi 256GB',
        image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/i/p/ipad-air-11-inch-m3-1.png',
        qty: 1,
        price: '5.990.000đ',
        originalPrice: '6.990.000đ',
      },
    ],
  },
]

const filteredOrders = computed(() => {
  if (activeTab.value !== 'all') {
    return mockOrders.filter((o) => o.statusKey === activeTab.value)
  }
  return mockOrders
})
</script>

<style scoped>
/* ── Tabs ─── */
.orders-tabs {
  display: flex;
  overflow-x: auto;
  gap: 0;
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  padding: 4px;
  gap: 2px;
  scrollbar-width: none;
}
.orders-tabs::-webkit-scrollbar {
  display: none;
}

.orders-tabs__item {
  flex-shrink: 0;
  min-width: 90px;
  padding: 8px 12px;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  color: #71717a;
  cursor: pointer;
  border-radius: 14px;
  transition: background 0.15s, color 0.15s;
  user-select: none;
  white-space: nowrap;
}
.orders-tabs__item:hover {
  background: #f4f4f5;
  color: #333;
}
.orders-tabs__item--active {
  background: #d70018;
  color: #fff;
  font-weight: 600;
}
.orders-tabs__item--active:hover {
  background: #b80015;
  color: #fff;
}

/* ── Filter Bar ─── */
.orders-filter {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.orders-filter__date-range {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  padding: 8px 14px;
  min-height: 40px;
  flex: 1;
  max-width: 360px;
}

.orders-filter__date-range > i {
  color: #71717a;
  font-size: 15px;
  flex-shrink: 0;
}

.orders-filter__date-input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  color: #333;
  flex: 1;
  min-width: 0;
  cursor: pointer;
}

.orders-filter__date-sep {
  display: flex;
  align-items: center;
  color: #a1a1aa;
  flex-shrink: 0;
}

/* ── Order List ─── */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ── Empty State ─── */
.orders-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  text-align: center;
  gap: 14px;
}

.orders-empty__img {
  width: 88px;
  height: auto;
  object-fit: contain;
}

.orders-empty__text {
  font-size: 14px;
  color: #a1a1aa;
  margin: 0;
}

/* ── Order Card ─── */
.orders-card {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}
.orders-card:hover {
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
}

.orders-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #f4f4f5;
  gap: 12px;
  flex-wrap: wrap;
}

.orders-card__meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.orders-card__id {
  font-size: 14px;
  font-weight: 700;
  color: #18181b;
}

.orders-card__date {
  font-size: 13px;
  color: #71717a;
}

.orders-card__status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
}
.orders-card__status i { font-size: 12px; }
.orders-card__status--pending { color: #d97706; background: #fffbeb; }
.orders-card__status--processing { color: #3b82f6; background: #eff6ff; }
.orders-card__status--shipping { color: #7c3aed; background: #f5f3ff; }
.orders-card__status--delivered { color: #16a34a; background: #f0fdf4; }
.orders-card__status--cancelled { color: #dc2626; background: #fef2f2; }

.orders-card__items {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.orders-card__item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.orders-card__item-img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.orders-card__item-info {
  flex: 1;
  min-width: 0;
}

.orders-card__item-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0 0 4px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.orders-card__item-qty {
  font-size: 12px;
  color: #71717a;
  margin: 0;
}

.orders-card__item-price {
  text-align: right;
  flex-shrink: 0;
}

.orders-card__item-price-current {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #18181b;
}

.orders-card__item-price-original {
  display: block;
  font-size: 11px;
  color: #a1a1aa;
  text-decoration: line-through;
}

.orders-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid #f4f4f5;
  gap: 12px;
  flex-wrap: wrap;
}

.orders-card__total {
  display: flex;
  align-items: center;
  gap: 6px;
}

.orders-card__total-label {
  font-size: 13px;
  color: #71717a;
}

.orders-card__total-value {
  font-size: 15px;
  font-weight: 700;
  color: #d70018;
}

.orders-card__actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* ── Responsive: Tablet (iPad Mini 767px) ─── */
@media (max-width: 991.98px) {
  .orders-tabs {
    border-radius: 14px;
  }

  .orders-tabs__item {
    min-width: 85px;
    padding: 7px 10px;
    font-size: 12px;
  }

  .orders-filter {
    margin-bottom: 10px;
  }

  .orders-filter__date-range {
    max-width: 320px;
  }

  .orders-card {
    border-radius: 14px;
  }

  .orders-card__header {
    padding: 12px 14px;
  }

  .orders-card__id {
    font-size: 13px;
  }

  .orders-card__date {
    font-size: 12px;
  }

  .orders-card__status {
    font-size: 12px;
    padding: 3px 10px;
  }

  .orders-card__items {
    padding: 10px 14px;
    gap: 10px;
  }

  .orders-card__item-img {
    width: 56px;
    height: 56px;
  }

  .orders-card__item-name {
    font-size: 13px;
  }

  .orders-card__item-price-current {
    font-size: 13px;
  }

  .orders-card__footer {
    padding: 10px 14px;
    gap: 10px;
  }

  .orders-card__total-label {
    font-size: 12px;
  }

  .orders-card__total-value {
    font-size: 14px;
  }

  .orders-empty {
    padding: 32px 16px;
    border-radius: 14px;
  }

  .orders-empty__img {
    width: 80px;
  }

  .orders-empty__text {
    font-size: 13px;
  }
}

/* ── Responsive: Large Phone (iPhone Pro 575px) ─── */
@media (max-width: 767.98px) {
  .orders-tabs {
    border-radius: 14px;
    margin-bottom: 10px;
  }

  .orders-tabs__item {
    min-width: 78px;
    padding: 6px 10px;
    font-size: 12px;
    border-radius: 12px;
  }

  .orders-filter {
    margin-bottom: 10px;
  }

  .orders-filter__date-range {
    max-width: 100%;
    padding: 7px 12px;
  }

  .orders-list {
    gap: 10px;
  }

  .orders-card {
    border-radius: 12px;
  }

  .orders-card__header {
    padding: 12px;
    flex-direction: column;
    align-items: flex-start;
  }

  .orders-card__meta {
    width: 100%;
  }

  .orders-card__id {
    font-size: 13px;
  }

  .orders-card__date {
    font-size: 11px;
  }

  .orders-card__status {
    font-size: 11px;
    padding: 3px 8px;
    align-self: flex-start;
  }

  .orders-card__items {
    padding: 10px 12px;
    gap: 10px;
  }

  .orders-card__item-img {
    width: 52px;
    height: 52px;
  }

  .orders-card__item-name {
    font-size: 13px;
  }

  .orders-card__item-qty {
    font-size: 11px;
  }

  .orders-card__item-price-current {
    font-size: 13px;
  }

  .orders-card__item-price-original {
    font-size: 10px;
  }

  .orders-card__footer {
    padding: 10px 12px;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .orders-card__total {
    justify-content: space-between;
  }

  .orders-card__total-label {
    font-size: 13px;
  }

  .orders-card__total-value {
    font-size: 15px;
  }

  .orders-card__actions {
    justify-content: flex-end;
  }

  .orders-card__actions .btn {
    flex: 1;
  }

  .orders-empty {
    padding: 28px 16px;
    border-radius: 12px;
    gap: 12px;
  }

  .orders-empty__img {
    width: 72px;
  }

  .orders-empty__text {
    font-size: 13px;
  }

  .orders-empty .btn {
    font-size: 13px;
  }
}

/* ── Responsive: Small Phone (iPhone SE 375px) ─── */
@media (max-width: 575.98px) {
  .orders-tabs {
    border-radius: 12px;
    padding: 3px;
  }

  .orders-tabs__item {
    min-width: 70px;
    padding: 6px 8px;
    font-size: 12px;
    border-radius: 10px;
  }

  .orders-filter {
    margin-bottom: 10px;
  }

  .orders-filter__date-range {
    padding: 6px 10px;
    min-height: 36px;
    gap: 6px;
  }

  .orders-filter__date-range > i {
    font-size: 14px;
  }

  .orders-filter__date-input {
    font-size: 12px;
  }

  .orders-list {
    gap: 10px;
  }

  .orders-card__header {
    padding: 10px 12px;
  }

  .orders-card__id {
    font-size: 12px;
  }

  .orders-card__status {
    font-size: 11px;
    padding: 2px 7px;
  }

  .orders-card__items {
    padding: 8px 12px;
  }

  .orders-card__item {
    gap: 10px;
  }

  .orders-card__item-img {
    width: 48px;
    height: 48px;
    border-radius: 6px;
  }

  .orders-card__item-name {
    font-size: 12px;
  }

  .orders-card__item-price-current {
    font-size: 12px;
  }

  .orders-card__footer {
    padding: 8px 12px;
    gap: 8px;
  }

  .orders-card__total-label {
    font-size: 12px;
  }

  .orders-card__total-value {
    font-size: 14px;
  }

  .orders-card__actions .btn {
    padding: 6px 10px;
    font-size: 12px;
  }

  .orders-empty {
    padding: 24px 12px;
    border-radius: 12px;
  }

  .orders-empty__img {
    width: 68px;
  }

  .orders-empty__text {
    font-size: 12px;
  }
}

/* ── Responsive: iPhone SE Extra Small ─── */
@media (max-width: 480px) {
  .orders-tabs__item {
    min-width: 64px;
    padding: 5px 7px;
    font-size: 11px;
    border-radius: 10px;
  }

  .orders-filter__date-range {
    padding: 6px 8px;
    gap: 5px;
  }

  .orders-filter__date-input {
    font-size: 11px;
  }

  .orders-card__header {
    padding: 10px;
  }

  .orders-card__items {
    padding: 8px 10px;
  }

  .orders-card__item-img {
    width: 44px;
    height: 44px;
  }

  .orders-card__item-name {
    font-size: 12px;
  }

  .orders-card__footer {
    padding: 8px 10px;
  }

  .orders-card__actions .btn {
    padding: 5px 8px;
    font-size: 12px;
  }

  .orders-card__total-value {
    font-size: 13px;
  }
}

/* ── Bottom Clearance: Mobile Bottom Nav ─── */
@media (max-width: 991.98px) {
  .orders-page {
    padding-bottom: 110px;
  }
}

@media (max-width: 767.98px) {
  .orders-page {
    padding-bottom: 100px;
  }
}

@media (max-width: 575.98px) {
  .orders-page {
    padding-bottom: 90px;
  }
}

@media (max-width: 480px) {
  .orders-page {
    padding-bottom: 80px;
  }
}
</style>
