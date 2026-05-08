<template>
  <ProfileLayout>
  <div class="warranty-page">
    <!-- Search Bar -->
    <div class="warranty-search">
    <div class="warranty-search__input-wrap">
      <i class="bi bi-search"></i>
      <input
        v-model="searchQuery"
        type="text"
        class="warranty-search__input"
        placeholder="Tìm kiếm theo mã đơn, tên sản phẩm..."
      />
      <button v-if="searchQuery" type="button" class="warranty-search__clear" @click="searchQuery = ''">
        <i class="bi bi-x"></i>
      </button>
    </div>
    <button type="button" class="warranty-search__btn">
      <i class="bi bi-sliders"></i>
    </button>
  </div>
</div>

  <!-- Tab Bar -->
  <div class="warranty-tabs">
    <div
      v-for="tab in tabs"
      :key="tab.key"
      class="warranty-tabs__item"
      :class="{ 'warranty-tabs__item--active': activeTab === tab.key }"
      @click="activeTab = tab.key"
    >
      {{ tab.label }}
    </div>
  </div>

  <!-- Warranty List -->
  <div class="warranty-list">
    <!-- Empty State -->
    <div v-if="filteredWarranties.length === 0" class="warranty-empty">
      <img
        src="https://cdn-static.smember.com.vn/_next/static/media/empty.f8088c4d.png"
        alt="empty"
        class="warranty-empty__img"
      />
      <p class="warranty-empty__text">Bạn chưa có đơn bảo hành nào</p>
      <NuxtLink :to="localePath('/')" class="btn btn-dark rounded-pill px-4 py-2">
        <i class="bi bi-house-door me-2"></i>Trang chủ
      </NuxtLink>
    </div>

    <!-- Warranty Cards -->
    <div
      v-for="w in filteredWarranties"
      :key="w.id"
      class="warranty-card"
    >
      <!-- Card Header -->
      <div class="warranty-card__header">
        <div class="warranty-card__meta">
          <span class="warranty-card__id">Mã bảo hành #{{ w.id }}</span>
          <span class="warranty-card__date">{{ w.date }}</span>
        </div>
        <span class="warranty-card__status" :class="`warranty-card__status--${w.statusKey}`">
          <i :class="w.statusIcon"></i>
          {{ w.status }}
        </span>
      </div>

      <!-- Card Body -->
      <div class="warranty-card__body">
        <div class="warranty-card__product">
          <img :src="w.product.image" :alt="w.product.name" class="warranty-card__product-img" />
          <div class="warranty-card__product-info">
            <p class="warranty-card__product-name">{{ w.product.name }}</p>
            <p class="warranty-card__product-serial">
              <span class="warranty-card__label">Số serial:</span> {{ w.product.serial }}
            </p>
            <p class="warranty-card__product-imei">
              <span class="warranty-card__label">IMEI:</span> {{ w.product.imei }}
            </p>
          </div>
        </div>

        <div class="warranty-card__details">
          <div class="warranty-card__detail-row">
            <span class="warranty-card__label">Ngày mua:</span>
            <span class="warranty-card__value">{{ w.purchaseDate }}</span>
          </div>
          <div class="warranty-card__detail-row">
            <span class="warranty-card__label">Hạn bảo hành:</span>
            <span class="warranty-card__value">{{ w.warrantyEnd }}</span>
          </div>
          <div class="warranty-card__detail-row">
            <span class="warranty-card__label">Trung tâm bảo hành:</span>
            <span class="warranty-card__value">{{ w.serviceCenter }}</span>
          </div>
        </div>

        <!-- Timeline -->
        <div v-if="w.timeline && w.timeline.length > 0" class="warranty-card__timeline">
          <div
            v-for="(step, idx) in w.timeline"
            :key="idx"
            class="warranty-timeline__step"
            :class="{ 'warranty-timeline__step--done': step.done, 'warranty-timeline__step--current': step.current }"
          >
            <div class="warranty-timeline__dot">
              <i v-if="step.done" class="bi bi-check"></i>
              <i v-else-if="step.current" class="bi bi-circle-fill"></i>
            </div>
            <div class="warranty-timeline__content">
              <p class="warranty-timeline__title">{{ step.title }}</p>
              <p class="warranty-timeline__time">{{ step.time }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Card Footer -->
      <div class="warranty-card__footer">
        <button type="button" class="btn btn-outline-dark btn-sm rounded-pill px-3">
          <i class="bi bi-chat-left-text me-1"></i>Nhắn tin
        </button>
        <button type="button" class="btn btn-dark btn-sm rounded-pill px-3">
          <i class="bi bi-eye me-1"></i>Chi tiết
        </button>
      </div>
    </div>
  </div>
</ProfileLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLocalePath } from '#imports'
import ProfileLayout from '@/components/Common/ProfileLayout.vue'

definePageMeta({ layout: 'default' })
useHead({ title: 'Tra cứu bảo hành - IrusGear' })

const localePath = useLocalePath()

const tabs = [
  { key: 'all', label: 'Tất cả' },
  { key: 'received', label: 'Đã tiếp nhận' },
  { key: 'coordinating', label: 'Đang điều phối' },
  { key: 'repairing', label: 'Đang sửa' },
  { key: 'done', label: 'Đã sửa xong' },
  { key: 'returned', label: 'Đã trả máy' },
]

const activeTab = ref('all')
const searchQuery = ref('')

const mockWarranties = [
  {
    id: 'WBH001234',
    date: '02/05/2026',
    status: 'Đã tiếp nhận',
    statusKey: 'received',
    statusIcon: 'bi bi-check-circle',
    product: {
      name: 'iPhone 16 Pro Max 256GB - Titan Tự Nhiên',
      image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/i/p/iphone-16-pro-max_2_.png',
      serial: 'DGH7X1234',
      imei: '352345678901234',
    },
    purchaseDate: '15/03/2026',
    warrantyEnd: '15/03/2027',
    serviceCenter: 'CellphoneS Nguyễn Trãi',
    timeline: [
      { title: 'Tiếp nhận yêu cầu bảo hành', time: '02/05/2026 - 10:30', done: true, current: false },
      { title: 'Đang điều phối kỹ thuật viên', time: '', done: false, current: true },
      { title: 'Tiến hành kiểm tra và sửa chữa', time: '', done: false, current: false },
      { title: 'Hoàn tất bảo hành - Trả máy', time: '', done: false, current: false },
    ],
  },
  {
    id: 'WBH001235',
    date: '28/04/2026',
    status: 'Đang sửa',
    statusKey: 'repairing',
    statusIcon: 'bi bi-wrench',
    product: {
      name: 'MacBook Air M3 13 inch 256GB',
      image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/m/a/macbook-air-m3-1.png',
      serial: 'C02X1234ABCD',
      imei: 'N/A',
    },
    purchaseDate: '10/02/2026',
    warrantyEnd: '10/02/2027',
    serviceCenter: 'CellphoneS Lý Thường Kiệt',
    timeline: [
      { title: 'Tiếp nhận yêu cầu bảo hành', time: '28/04/2026 - 09:00', done: true, current: false },
      { title: 'Đang điều phối kỹ thuật viên', time: '28/04/2026 - 09:30', done: true, current: false },
      { title: 'Tiến hành kiểm tra và sửa chữa', time: '', done: false, current: true },
      { title: 'Hoàn tất bảo hành - Trả máy', time: '', done: false, current: false },
    ],
  },
]

const filteredWarranties = computed(() => {
  let result = mockWarranties

  if (activeTab.value !== 'all') {
    const tabMap = {
      received: 'received',
      coordinating: 'coordinating',
      repairing: 'repairing',
      done: 'done',
      returned: 'returned',
    }
    const statusKey = tabMap[activeTab.value]
    result = result.filter((w) => w.statusKey === statusKey)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (w) =>
        w.id.toLowerCase().includes(q) ||
        w.product.name.toLowerCase().includes(q) ||
        w.product.serial.toLowerCase().includes(q)
    )
  }

  return result
})
</script>

<style scoped>
/* ── Search Bar ─── */
.warranty-search {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.warranty-search__input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  padding: 8px 14px;
  min-height: 40px;
}

.warranty-search__input-wrap > i {
  color: #71717a;
  font-size: 15px;
  flex-shrink: 0;
}

.warranty-search__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #333;
  min-width: 0;
}
.warranty-search__input::placeholder {
  color: #a1a1aa;
}

.warranty-search__clear {
  background: none;
  border: none;
  cursor: pointer;
  color: #71717a;
  padding: 2px;
  display: flex;
  font-size: 14px;
}

.warranty-search__btn {
  background: #fff;
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  padding: 8px 14px;
  cursor: pointer;
  color: #52525b;
  font-size: 16px;
  display: flex;
  align-items: center;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}
.warranty-search__btn:hover {
  background: #f4f4f5;
  color: #18181b;
}

/* ── Tabs ─── */
.warranty-tabs {
  display: flex;
  overflow-x: auto;
  gap: 0;
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  padding: 4px;
  gap: 2px;
  scrollbar-width: none;
  margin-bottom: 12px;
}
.warranty-tabs::-webkit-scrollbar {
  display: none;
}

.warranty-tabs__item {
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
.warranty-tabs__item:hover {
  background: #f4f4f5;
  color: #333;
}
.warranty-tabs__item--active {
  background: #d70018;
  color: #fff;
  font-weight: 600;
}
.warranty-tabs__item--active:hover {
  background: #b80015;
  color: #fff;
}

/* ── Warranty List ─── */
.warranty-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ── Empty State ─── */
.warranty-empty {
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

.warranty-empty__img {
  width: 88px;
  height: auto;
  object-fit: contain;
}

.warranty-empty__text {
  font-size: 14px;
  color: #a1a1aa;
  margin: 0;
}

/* ── Warranty Card ─── */
.warranty-card {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}
.warranty-card:hover {
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
}

.warranty-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #f4f4f5;
  gap: 12px;
  flex-wrap: wrap;
}

.warranty-card__meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.warranty-card__id {
  font-size: 14px;
  font-weight: 700;
  color: #18181b;
}

.warranty-card__date {
  font-size: 13px;
  color: #71717a;
}

.warranty-card__status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
}
.warranty-card__status i { font-size: 12px; }
.warranty-card__status--received { color: #d97706; background: #fffbeb; }
.warranty-card__status--coordinating { color: #7c3aed; background: #f5f3ff; }
.warranty-card__status--repairing { color: #3b82f6; background: #eff6ff; }
.warranty-card__status--done { color: #16a34a; background: #f0fdf4; }
.warranty-card__status--returned { color: #6b7280; background: #f9fafb; }

.warranty-card__body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.warranty-card__product {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.warranty-card__product-img {
  width: 64px;
  height: 64px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.warranty-card__product-info {
  flex: 1;
  min-width: 0;
}

.warranty-card__product-name {
  font-size: 14px;
  font-weight: 600;
  color: #18181b;
  margin: 0 0 6px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.warranty-card__product-serial,
.warranty-card__product-imei {
  font-size: 12px;
  color: #71717a;
  margin: 0 0 2px;
  font-family: monospace;
}

.warranty-card__label {
  color: #71717a;
  font-weight: 400;
}

.warranty-card__value {
  color: #333;
  font-weight: 500;
}

.warranty-card__details {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
}

.warranty-card__detail-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  flex-wrap: wrap;
}

.warranty-card__detail-row .warranty-card__label {
  min-width: 130px;
}

.warranty-card__detail-row .warranty-card__value {
  flex: 1;
}

/* ── Timeline ─── */
.warranty-card__timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-left: 8px;
}

.warranty-timeline__step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  position: relative;
  padding-bottom: 16px;
}
.warranty-timeline__step:last-child {
  padding-bottom: 0;
}

.warranty-timeline__step::before {
  content: '';
  position: absolute;
  left: 11px;
  top: 20px;
  bottom: 0;
  width: 2px;
  background: #e4e4e7;
}
.warranty-timeline__step:last-child::before {
  display: none;
}

.warranty-timeline__step--done::before {
  background: #d70018;
}

.warranty-timeline__dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #e4e4e7;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 10px;
  z-index: 1;
}

.warranty-timeline__step--done .warranty-timeline__dot {
  background: #d70018;
  border-color: #d70018;
  color: #fff;
}

.warranty-timeline__step--current .warranty-timeline__dot {
  background: #d70018;
  border-color: #d70018;
  color: #fff;
  animation: pulse-dot 1.5s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.warranty-timeline__content {
  flex: 1;
  padding-top: 2px;
}

.warranty-timeline__title {
  font-size: 13px;
  font-weight: 500;
  color: #52525b;
  margin: 0 0 2px;
}

.warranty-timeline__step--done .warranty-timeline__title {
  color: #a1a1aa;
}

.warranty-timeline__step--current .warranty-timeline__title {
  color: #d70018;
  font-weight: 600;
}

.warranty-timeline__time {
  font-size: 12px;
  color: #a1a1aa;
  margin: 0;
}

/* ── Card Footer ─── */
.warranty-card__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 12px 16px;
  border-top: 1px solid #f4f4f5;
  gap: 8px;
  flex-wrap: wrap;
}

/* ── Responsive: Tablet (iPad Mini 767px) ─── */
@media (max-width: 991.98px) {
  .warranty-card {
    border-radius: 14px;
  }

  .warranty-card__header {
    padding: 12px 14px;
  }

  .warranty-card__body {
    padding: 14px;
    gap: 14px;
  }

  .warranty-card__product-img {
    width: 56px;
    height: 56px;
  }

  .warranty-card__product-name {
    font-size: 13px;
  }

  .warranty-card__details {
    padding: 10px;
  }

  .warranty-card__detail-row .warranty-card__label {
    min-width: 120px;
    font-size: 12px;
  }

  .warranty-card__detail-row {
    font-size: 12px;
  }

  .warranty-card__footer {
    padding: 10px 14px;
  }
}

/* ── Responsive: Large Phone (iPhone Pro 575px) ─── */
@media (max-width: 767.98px) {
  .warranty-card {
    border-radius: 12px;
  }

  .warranty-card__header {
    padding: 12px;
  }

  .warranty-card__id {
    font-size: 13px;
  }

  .warranty-card__date {
    font-size: 12px;
  }

  .warranty-card__status {
    font-size: 12px;
    padding: 3px 10px;
  }

  .warranty-card__body {
    padding: 12px;
    gap: 12px;
  }

  .warranty-card__product {
    gap: 10px;
  }

  .warranty-card__product-img {
    width: 52px;
    height: 52px;
  }

  .warranty-card__product-name {
    font-size: 13px;
  }

  .warranty-card__product-serial,
  .warranty-card__product-imei {
    font-size: 11px;
  }

  .warranty-card__details {
    padding: 10px;
  }

  .warranty-card__detail-row .warranty-card__label {
    min-width: 110px;
    font-size: 12px;
  }

  .warranty-card__detail-row {
    font-size: 12px;
  }

  .warranty-card__detail-row .warranty-card__value {
    font-size: 12px;
  }

  .warranty-card__footer {
    padding: 10px 12px;
    justify-content: center;
  }

  .warranty-card__footer .btn {
    flex: 1;
  }

  .warranty-empty {
    padding: 32px 16px;
    border-radius: 14px;
  }

  .warranty-empty__img {
    width: 76px;
  }

  .warranty-empty__text {
    font-size: 13px;
  }
}

/* ── Responsive: Small Phone (iPhone SE 375px) ─── */
@media (max-width: 575.98px) {
  .warranty-tabs {
    border-radius: 14px;
    margin-bottom: 10px;
  }

  .warranty-tabs__item {
    min-width: 80px;
    padding: 7px 10px;
    font-size: 12px;
    border-radius: 12px;
  }

  .warranty-search {
    margin-bottom: 10px;
  }

  .warranty-search__input-wrap {
    padding: 7px 12px;
    border-radius: 8px;
  }

  .warranty-search__btn {
    padding: 7px 12px;
    border-radius: 8px;
  }

  .warranty-list {
    gap: 10px;
  }

  .warranty-card__header {
    padding: 10px 12px;
    flex-direction: column;
    align-items: flex-start;
  }

  .warranty-card__meta {
    width: 100%;
  }

  .warranty-card__id {
    font-size: 13px;
  }

  .warranty-card__date {
    font-size: 11px;
  }

  .warranty-card__body {
    padding: 12px;
    gap: 10px;
  }

  .warranty-card__product {
    gap: 8px;
  }

  .warranty-card__product-img {
    width: 48px;
    height: 48px;
    border-radius: 6px;
  }

  .warranty-card__product-name {
    font-size: 12px;
    -webkit-line-clamp: 2;
  }

  .warranty-card__product-serial,
  .warranty-card__product-imei {
    font-size: 11px;
  }

  .warranty-card__details {
    padding: 8px 10px;
    gap: 4px;
  }

  .warranty-card__detail-row {
    font-size: 12px;
    gap: 6px;
  }

  .warranty-card__detail-row .warranty-card__label {
    min-width: 100px;
    font-size: 12px;
  }

  .warranty-card__detail-row .warranty-card__value {
    font-size: 12px;
  }

  .warranty-card__footer {
    padding: 8px 12px;
    justify-content: center;
  }

  .warranty-card__footer .btn {
    flex: 1;
    font-size: 12px;
  }

  .warranty-empty {
    padding: 28px 16px;
    border-radius: 12px;
    gap: 12px;
  }

  .warranty-empty__img {
    width: 72px;
  }

  .warranty-empty__text {
    font-size: 13px;
  }

  .warranty-empty .btn {
    font-size: 13px;
  }

  .warranty-timeline__step {
    gap: 10px;
    padding-bottom: 14px;
  }

  .warranty-timeline__dot {
    width: 22px;
    height: 22px;
  }

  .warranty-timeline__title {
    font-size: 12px;
  }

  .warranty-timeline__time {
    font-size: 11px;
  }
}

/* ── Responsive: iPhone SE Extra Small ─── */
@media (max-width: 480px) {
  .warranty-tabs {
    border-radius: 12px;
    padding: 3px;
  }

  .warranty-tabs__item {
    min-width: 72px;
    padding: 6px 8px;
    font-size: 12px;
    border-radius: 10px;
  }

  .warranty-search__input-wrap {
    padding: 6px 10px;
    border-radius: 8px;
    min-height: 36px;
    gap: 8px;
  }

  .warranty-search__input {
    font-size: 13px;
  }

  .warranty-search__btn {
    padding: 6px 10px;
    border-radius: 8px;
    font-size: 14px;
  }

  .warranty-card__header {
    padding: 10px;
  }

  .warranty-card__id {
    font-size: 12px;
  }

  .warranty-card__status {
    font-size: 11px;
    padding: 3px 8px;
  }

  .warranty-card__body {
    padding: 10px;
  }

  .warranty-card__product-img {
    width: 44px;
    height: 44px;
  }

  .warranty-card__product-name {
    font-size: 12px;
  }

  .warranty-card__details {
    padding: 8px;
  }

  .warranty-card__detail-row .warranty-card__label {
    min-width: 90px;
    font-size: 11px;
  }

  .warranty-card__detail-row {
    font-size: 11px;
  }

  .warranty-card__detail-row .warranty-card__value {
    font-size: 11px;
  }

  .warranty-card__footer {
    padding: 8px 10px;
    gap: 6px;
  }

  .warranty-card__footer .btn {
    padding: 6px 10px;
    font-size: 12px;
  }

  .warranty-empty {
    padding: 24px 12px;
    border-radius: 12px;
  }

  .warranty-empty__img {
    width: 68px;
  }

  .warranty-empty__text {
    font-size: 12px;
  }
}

/* ── Bottom Clearance: Mobile Bottom Nav ─── */
@media (max-width: 991.98px) {
  .warranty-page {
    padding-bottom: 110px;
  }
}

@media (max-width: 767.98px) {
  .warranty-page {
    padding-bottom: 100px;
  }
}

@media (max-width: 575.98px) {
  .warranty-page {
    padding-bottom: 90px;
  }
}

@media (max-width: 480px) {
  .warranty-page {
    padding-bottom: 80px;
  }
}
</style>
