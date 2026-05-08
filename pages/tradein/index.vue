<template>
  <ProfileLayout>
  <div class="tradein-page">
  <!-- Title (mobile only) -->
  <div class="tradein-title d-md-none">
    <h1 class="tradein-title__text">Lịch sử thu cũ</h1>
  </div>

  <!-- Filter Bar -->
  <div class="tradein-filter">
    <span class="tradein-filter__label">Lịch sử thu cũ</span>
    <div class="tradein-filter__date-range">
      <i class="bi bi-calendar3"></i>
      <input type="date" v-model="dateFrom" class="tradein-filter__date-input" />
      <span class="tradein-filter__date-sep">
        <i class="bi bi-arrow-right-short"></i>
      </span>
      <input type="date" v-model="dateTo" class="tradein-filter__date-input" />
      <button type="button" class="tradein-filter__calendar-btn" title="Chọn ngày">
        <i class="bi bi-calendar-event"></i>
      </button>
    </div>
  </div>

  <!-- Tradein List -->
  <div class="tradein-list">
    <!-- Empty State -->
    <div v-if="filteredTradeins.length === 0" class="tradein-empty">
      <img
        src="https://cdn-static.smember.com.vn/_next/static/media/empty.f8088c4d.png"
        alt="empty"
        class="tradein-empty__img"
      />
      <p class="tradein-empty__text">Bạn chưa có phiếu thu cũ nào</p>
      <NuxtLink :to="localePath('/')" class="btn btn-dark rounded-pill px-4 py-2">
        <i class="bi bi-house-door me-2"></i>Trang chủ
      </NuxtLink>
    </div>

    <!-- Tradein Cards -->
    <div
      v-for="t in filteredTradeins"
      :key="t.id"
      class="tradein-card"
    >
      <!-- Card Header -->
      <div class="tradein-card__header">
        <div class="tradein-card__meta">
          <span class="tradein-card__id">Mã phiếu #{{ t.id }}</span>
          <span class="tradein-card__date">{{ t.date }}</span>
        </div>
        <span class="tradein-card__status" :class="`tradein-card__status--${t.statusKey}`">
          <i :class="t.statusIcon"></i>
          {{ t.status }}
        </span>
      </div>

      <!-- Old Device -->
      <div class="tradein-card__device">
        <div class="tradein-card__device-label">
          <i class="bi bi-phone"></i>
          <span>Thiết bị cũ</span>
        </div>
        <div class="tradein-card__device-body">
          <img :src="t.oldDevice.image" :alt="t.oldDevice.name" class="tradein-card__device-img" />
          <div class="tradein-card__device-info">
            <p class="tradein-card__device-name">{{ t.oldDevice.name }}</p>
            <p class="tradein-card__device-capacity">{{ t.oldDevice.capacity }}</p>
          </div>
        </div>
      </div>

      <!-- Arrow -->
      <div class="tradein-card__arrow">
        <i class="bi bi-arrow-down"></i>
      </div>

      <!-- New Device -->
      <div class="tradein-card__device">
        <div class="tradein-card__device-label tradein-card__device-label--new">
          <i class="bi bi-phone-fill"></i>
          <span>Thiết bị mới</span>
        </div>
        <div class="tradein-card__device-body">
          <img :src="t.newDevice.image" :alt="t.newDevice.name" class="tradein-card__device-img" />
          <div class="tradein-card__device-info">
            <p class="tradein-card__device-name">{{ t.newDevice.name }}</p>
            <p class="tradein-card__device-capacity">{{ t.newDevice.capacity }}</p>
          </div>
        </div>
      </div>

      <!-- Card Footer -->
      <div class="tradein-card__footer">
        <div class="tradein-card__pricing">
          <div class="tradein-card__price-row">
            <span class="tradein-card__price-label">Giá trị thu cũ:</span>
            <span class="tradein-card__price-value tradein-card__price-value--old">{{ t.oldValue }}</span>
          </div>
          <div class="tradein-card__price-row">
            <span class="tradein-card__price-label">Giá máy mới:</span>
            <span class="tradein-card__price-value">{{ t.newPrice }}</span>
          </div>
          <div class="tradein-card__price-row tradein-card__price-row--total">
            <span class="tradein-card__price-label">Thanh toán thêm:</span>
            <span class="tradein-card__price-value tradein-card__price-value--total">{{ t.topUp }}</span>
          </div>
        </div>
        <div class="tradein-card__actions">
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
</ProfileLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLocalePath } from '#imports'
import ProfileLayout from '@/components/Common/ProfileLayout.vue'

definePageMeta({ layout: 'default' })
useHead({ title: 'Lịch sử thu cũ - IrusGear' })

const localePath = useLocalePath()

const dateFrom = ref('')
const dateTo = ref('')

const mockTradeins = [
  {
    id: 'TC001234',
    date: '28/04/2026',
    status: 'Hoàn tất',
    statusKey: 'done',
    statusIcon: 'bi bi-check-circle',
    oldDevice: {
      name: 'iPhone 14 Pro 128GB - Deep Purple',
      image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/i/p/iphone-14-pro-1.png',
      capacity: '128GB',
    },
    newDevice: {
      name: 'iPhone 16 Pro Max 256GB - Titan Tự Nhiên',
      image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/i/p/iphone-16-pro-max_2_.png',
      capacity: '256GB',
    },
    oldValue: '10.500.000đ',
    newPrice: '27.990.000đ',
    topUp: '17.490.000đ',
  },
  {
    id: 'TC001235',
    date: '15/03/2026',
    status: 'Hoàn tất',
    statusKey: 'done',
    statusIcon: 'bi bi-check-circle',
    oldDevice: {
      name: 'Samsung Galaxy S23 Ultra 256GB',
      image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/s/a/samsung-galaxy-s23-ultra-1.png',
      capacity: '256GB',
    },
    newDevice: {
      name: 'Samsung Galaxy S25 Ultra 256GB',
      image: 'https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/s/2/s25-ultra_1.png',
      capacity: '256GB',
    },
    oldValue: '12.000.000đ',
    newPrice: '22.990.000đ',
    topUp: '10.990.000đ',
  },
]

const filteredTradeins = computed(() => {
  return mockTradeins
})
</script>

<style scoped>
/* ── Title (mobile) ─── */
.tradein-title {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.tradein-title__text {
  font-size: 16px;
  font-weight: 700;
  color: #18181b;
  margin: 0;
}

/* ── Filter Bar ─── */
.tradein-filter {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.tradein-filter__label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  display: none;
}

/* ── Responsive: Tablet (iPad Mini 767px) ─── */
@media (min-width: 992px) {
  .tradein-filter__label {
    display: block;
  }
}

/* ── Responsive: Tablet (iPad Mini 767px) ─── */
@media (max-width: 991.98px) {
  .tradein-card {
    border-radius: 14px;
  }

  .tradein-card__header {
    padding: 12px 14px;
  }

  .tradein-card__id {
    font-size: 13px;
  }

  .tradein-card__date {
    font-size: 12px;
  }

  .tradein-card__status {
    font-size: 12px;
    padding: 3px 10px;
  }

  .tradein-card__device {
    padding: 14px;
  }

  .tradein-card__device-img {
    width: 52px;
    height: 52px;
  }

  .tradein-card__device-name {
    font-size: 13px;
  }

  .tradein-card__device-capacity {
    font-size: 11px;
  }

  .tradein-card__arrow {
    padding: 4px 14px;
  }

  .tradein-card__footer {
    padding: 12px 14px;
    gap: 12px;
  }

  .tradein-card__pricing {
    padding: 10px;
  }

  .tradein-card__price-row {
    font-size: 12px;
  }

  .tradein-card__price-value--total {
    font-size: 14px;
  }

  .tradein-card__actions .btn {
    font-size: 12px;
  }

  .tradein-empty {
    padding: 32px 16px;
    border-radius: 14px;
  }

  .tradein-empty__img {
    width: 80px;
  }

  .tradein-empty__text {
    font-size: 13px;
  }
}

/* ── Responsive: Large Phone (iPhone Pro 575px) ─── */
@media (max-width: 767.98px) {
  .tradein-title {
    border-radius: 14px;
    padding: 12px 14px;
    margin-bottom: 10px;
  }

  .tradein-title__text {
    font-size: 15px;
  }

  .tradein-filter {
    margin-bottom: 10px;
  }

  .tradein-filter__date-range {
    max-width: 100%;
    padding: 7px 12px;
  }

  .tradein-list {
    gap: 10px;
  }

  .tradein-card {
    border-radius: 12px;
  }

  .tradein-card__header {
    padding: 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .tradein-card__meta {
    width: 100%;
  }

  .tradein-card__id {
    font-size: 13px;
  }

  .tradein-card__date {
    font-size: 11px;
  }

  .tradein-card__status {
    font-size: 11px;
    padding: 3px 8px;
    align-self: flex-start;
  }

  .tradein-card__device {
    padding: 12px;
  }

  .tradein-card__device-img {
    width: 48px;
    height: 48px;
  }

  .tradein-card__device-name {
    font-size: 13px;
  }

  .tradein-card__device-capacity {
    font-size: 11px;
  }

  .tradein-card__arrow {
    padding: 2px 12px;
    font-size: 14px;
  }

  .tradein-card__footer {
    padding: 12px;
    gap: 12px;
  }

  .tradein-card__pricing {
    padding: 10px;
  }

  .tradein-card__price-row {
    font-size: 12px;
  }

  .tradein-card__price-label {
    font-size: 12px;
  }

  .tradein-card__price-value {
    font-size: 12px;
  }

  .tradein-card__price-value--total {
    font-size: 14px;
  }

  .tradein-card__actions {
    justify-content: stretch;
  }

  .tradein-card__actions .btn {
    flex: 1;
  }

  .tradein-empty {
    padding: 28px 16px;
    border-radius: 12px;
    gap: 12px;
  }

  .tradein-empty__img {
    width: 72px;
  }

  .tradein-empty__text {
    font-size: 13px;
  }

  .tradein-empty .btn {
    font-size: 13px;
  }
}

/* ── Responsive: Small Phone (iPhone SE 375px) ─── */
@media (max-width: 575.98px) {
  .tradein-title {
    border-radius: 12px;
    padding: 10px 12px;
    margin-bottom: 10px;
  }

  .tradein-title__text {
    font-size: 14px;
  }

  .tradein-filter {
    margin-bottom: 10px;
  }

  .tradein-filter__date-range {
    padding: 6px 10px;
    min-height: 36px;
    gap: 6px;
  }

  .tradein-filter__date-range > i {
    font-size: 14px;
  }

  .tradein-filter__date-input {
    font-size: 12px;
  }

  .tradein-filter__calendar-btn {
    font-size: 14px;
  }

  .tradein-list {
    gap: 10px;
  }

  .tradein-card__header {
    padding: 10px 12px;
  }

  .tradein-card__id {
    font-size: 12px;
  }

  .tradein-card__date {
    font-size: 11px;
  }

  .tradein-card__status {
    font-size: 11px;
    padding: 2px 7px;
  }

  .tradein-card__device {
    padding: 10px 12px;
  }

  .tradein-card__device-label {
    font-size: 11px;
    margin-bottom: 8px;
  }

  .tradein-card__device-img {
    width: 44px;
    height: 44px;
  }

  .tradein-card__device-name {
    font-size: 12px;
  }

  .tradein-card__device-capacity {
    font-size: 11px;
  }

  .tradein-card__arrow {
    padding: 2px 12px;
    font-size: 14px;
  }

  .tradein-card__footer {
    padding: 10px 12px;
    gap: 10px;
  }

  .tradein-card__pricing {
    padding: 8px 10px;
  }

  .tradein-card__price-row {
    font-size: 12px;
    gap: 6px;
  }

  .tradein-card__price-label {
    font-size: 12px;
  }

  .tradein-card__price-value {
    font-size: 12px;
  }

  .tradein-card__price-value--total {
    font-size: 14px;
  }

  .tradein-card__actions .btn {
    padding: 6px 10px;
    font-size: 12px;
  }

  .tradein-empty {
    padding: 24px 12px;
    border-radius: 12px;
  }

  .tradein-empty__img {
    width: 68px;
  }

  .tradein-empty__text {
    font-size: 12px;
  }
}

/* ── Responsive: iPhone SE Extra Small ─── */
@media (max-width: 480px) {
  .tradein-filter__date-range {
    padding: 6px 8px;
    gap: 5px;
  }

  .tradein-filter__date-input {
    font-size: 11px;
  }

  .tradein-card__device {
    padding: 10px;
  }

  .tradein-card__device-img {
    width: 40px;
    height: 40px;
  }

  .tradein-card__device-name {
    font-size: 12px;
  }

  .tradein-card__footer {
    padding: 8px 10px;
  }

  .tradein-card__actions .btn {
    padding: 5px 8px;
    font-size: 12px;
  }
}

.tradein-filter__date-range {
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

.tradein-filter__date-range > i {
  color: #71717a;
  font-size: 15px;
  flex-shrink: 0;
}

.tradein-filter__date-input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  color: #333;
  flex: 1;
  min-width: 0;
  cursor: pointer;
}

.tradein-filter__date-sep {
  display: flex;
  align-items: center;
  color: #a1a1aa;
  flex-shrink: 0;
}

.tradein-filter__calendar-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #52525b;
  padding: 2px;
  display: flex;
  align-items: center;
  font-size: 16px;
  border-radius: 4px;
  transition: background 0.15s, color 0.15s;
}
.tradein-filter__calendar-btn:hover {
  background: #f4f4f5;
  color: #18181b;
}

/* ── Tradein List ─── */
.tradein-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ── Empty State ─── */
.tradein-empty {
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

.tradein-empty__img {
  width: 88px;
  height: auto;
  object-fit: contain;
}

.tradein-empty__text {
  font-size: 14px;
  color: #a1a1aa;
  margin: 0;
}

/* ── Tradein Card ─── */
.tradein-card {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}
.tradein-card:hover {
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
}

.tradein-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #f4f4f5;
  gap: 12px;
  flex-wrap: wrap;
}

.tradein-card__meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tradein-card__id {
  font-size: 14px;
  font-weight: 700;
  color: #18181b;
}

.tradein-card__date {
  font-size: 13px;
  color: #71717a;
}

.tradein-card__status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
}
.tradein-card__status i { font-size: 12px; }
.tradein-card__status--done { color: #16a34a; background: #f0fdf4; }
.tradein-card__status--pending { color: #d97706; background: #fffbeb; }
.tradein-card__status--cancelled { color: #dc2626; background: #fef2f2; }

/* ── Device Section ─── */
.tradein-card__device {
  padding: 16px;
}

.tradein-card__device-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #71717a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}

.tradein-card__device-label i {
  font-size: 14px;
}

.tradein-card__device-label--new {
  color: #d70018;
}

.tradein-card__device-body {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tradein-card__device-img {
  width: 56px;
  height: 56px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.tradein-card__device-info {
  flex: 1;
  min-width: 0;
}

.tradein-card__device-name {
  font-size: 14px;
  font-weight: 600;
  color: #18181b;
  margin: 0 0 4px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tradein-card__device-capacity {
  font-size: 12px;
  color: #71717a;
  margin: 0;
}

/* ── Arrow ─── */
.tradein-card__arrow {
  display: flex;
  justify-content: center;
  padding: 4px 16px;
  color: #d70018;
  font-size: 16px;
}

/* ── Card Footer ─── */
.tradein-card__footer {
  padding: 14px 16px;
  border-top: 1px solid #f4f4f5;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.tradein-card__pricing {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
}

.tradein-card__price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
}

.tradein-card__price-label {
  color: #71717a;
}

.tradein-card__price-value {
  font-weight: 600;
  color: #18181b;
}

.tradein-card__price-value--old {
  color: #16a34a;
}

.tradein-card__price-value--total {
  color: #d70018;
  font-size: 15px;
}

.tradein-card__price-row--total {
  padding-top: 6px;
  border-top: 1px dashed #e4e4e7;
  margin-top: 2px;
}

.tradein-card__price-row--total .tradein-card__price-label {
  font-weight: 600;
  color: #333;
}

.tradein-card__actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

/* ── Bottom Clearance: Mobile Bottom Nav ─── */
@media (max-width: 991.98px) {
  .tradein-page {
    padding-bottom: 110px;
  }
}

@media (max-width: 767.98px) {
  .tradein-page {
    padding-bottom: 100px;
  }
}

@media (max-width: 575.98px) {
  .tradein-page {
    padding-bottom: 90px;
  }
}

@media (max-width: 480px) {
  .tradein-page {
    padding-bottom: 80px;
  }
}
</style>
