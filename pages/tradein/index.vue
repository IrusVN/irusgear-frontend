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
    <div class="tradein-filter__date-range" role="group" aria-label="Lọc theo khoảng ngày">
      <div class="tradein-filter__date-field">
        <span class="tradein-filter__date-label">Từ</span>
        <input
          type="date"
          v-model="dateFrom"
          class="tradein-filter__date-input"
          aria-label="Từ ngày"
        />
      </div>
      <span class="tradein-filter__date-sep" aria-hidden="true">
        <i class="bi bi-arrow-right-short"></i>
      </span>
      <div class="tradein-filter__date-field">
        <span class="tradein-filter__date-label">Đến</span>
        <input
          type="date"
          v-model="dateTo"
          class="tradein-filter__date-input"
          aria-label="Đến ngày"
        />
      </div>
    </div>
  </div>

  <!-- Tradein List -->
  <div class="tradein-list">
    <!-- Empty State -->
    <div v-if="!isLoading && tradeins.length === 0" class="tradein-empty">
      <img
        src="https://cdn-static.smember.com.vn/_next/static/media/empty.f8088c4d.png"
        alt="empty"
        class="tradein-empty__img"
      />
      <p class="tradein-empty__text">{{ $t('profile.tradein.empty') }}</p>
      <NuxtLink :to="localePath('/')" class="btn btn-dark rounded-pill px-4 py-2">
        <i class="bi bi-house-door me-2"></i>{{ $t('profile.common.home') }}
      </NuxtLink>
    </div>

    <!-- Tradein Cards -->
    <div
      v-for="t in tradeins"
      :key="t.id"
      class="tradein-card"
    >
      <!-- Card Header -->
      <div class="tradein-card__header">
        <div class="tradein-card__meta">
          <span class="tradein-card__id">#{{ t.id }}</span>
          <span class="tradein-card__date">{{ formatDate(t.date) }}</span>
        </div>
        <span class="tradein-card__status" :class="`tradein-card__status--${t.status.key}`">
          <i :class="t.status.icon"></i>
          {{ t.status.label }}
        </span>
      </div>

      <!-- Old Device -->
      <div class="tradein-card__device">
        <div class="tradein-card__device-label">
          <i class="bi bi-phone"></i>
          <span>{{ $t('profile.tradein.oldDevice') }}</span>
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
          <span>{{ $t('profile.tradein.newDevice') }}</span>
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
            <span class="tradein-card__price-label">{{ $t('profile.tradein.oldValue') }}</span>
            <span class="tradein-card__price-value tradein-card__price-value--old">{{ t.oldValue }}</span>
          </div>
          <div class="tradein-card__price-row">
            <span class="tradein-card__price-label">{{ $t('profile.tradein.newPrice') }}</span>
            <span class="tradein-card__price-value">{{ t.newPrice }}</span>
          </div>
          <div class="tradein-card__price-row tradein-card__price-row--total">
            <span class="tradein-card__price-label">{{ $t('profile.tradein.topUp') }}</span>
            <span class="tradein-card__price-value tradein-card__price-value--total">{{ t.topUp }}</span>
          </div>
        </div>
        <div class="tradein-card__actions">
          <button type="button" class="btn btn-outline-dark btn-sm rounded-pill px-3">
            <i class="bi bi-chat-left-text me-1"></i>{{ $t('profile.common.message') }}
          </button>
          <button type="button" class="btn btn-dark btn-sm rounded-pill px-3">
            <i class="bi bi-eye me-1"></i>{{ $t('profile.common.detail') }}
          </button>
        </div>
      </div>
    </div>
  </div>
  </div>
</ProfileLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useLocalePath, useI18n } from '#imports'
import { storeToRefs } from 'pinia'
import { useTradeinStore } from '@/stores/tradeinStore'
import ProfileLayout from '@/components/Common/ProfileLayout.vue'
import { formatDate } from '@/utils/dateFormat'

definePageMeta({ layout: 'default' })
useHead({ title: 'Lịch sử thu cũ - IrusGear' })

const localePath = useLocalePath()
const { t } = useI18n()
const tradeinStore = useTradeinStore()
const { tradeins, isLoading } = storeToRefs(tradeinStore)

const dateFrom = ref('')
const dateTo = ref('')

const loadTradeins = async () => {
  await tradeinStore.fetchTradeins({
    date_from: dateFrom.value || undefined,
    date_to: dateTo.value || undefined,
  })
}

watch([dateFrom, dateTo], loadTradeins)

loadTradeins()
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
  align-items: center;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  display: grid;
  flex: 1;
  gap: 4px;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  max-width: 420px;
  min-height: 48px;
  padding: 4px;
}

.tradein-filter__date-field {
  align-items: center;
  border-radius: 10px;
  display: grid;
  gap: 1px;
  min-width: 0;
  padding: 6px 10px;
  transition: background 0.15s ease, box-shadow 0.15s ease;
}

.tradein-filter__date-field:focus-within {
  background: #fafafa;
  box-shadow: inset 0 0 0 1px #ef9aa5;
}

.tradein-filter__date-label {
  color: #71717a;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.2;
}

.tradein-filter__date-input {
  background: transparent;
  border: none;
  color: #18181b;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  min-width: 0;
  outline: none;
  width: 100%;
}

.tradein-filter__date-input::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.55;
}

.tradein-filter__date-input:focus::-webkit-calendar-picker-indicator,
.tradein-filter__date-input:hover::-webkit-calendar-picker-indicator {
  opacity: 0.9;
}

.tradein-filter__date-sep {
  display: flex;
  align-items: center;
  color: #a1a1aa;
  font-size: 18px;
  justify-content: center;
  width: 24px;
}

@media (max-width: 767.98px) {
  .tradein-filter__date-range {
    max-width: none;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .tradein-filter__date-range {
    min-height: 44px;
  }

  .tradein-filter__date-field {
    padding: 6px 8px;
  }

  .tradein-filter__date-label {
    font-size: 10px;
  }

  .tradein-filter__date-input {
    font-size: 12px;
  }

  .tradein-filter__date-sep {
    width: 18px;
  }
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
