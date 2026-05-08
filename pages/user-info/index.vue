<template>
  <ProfileLayout>
  <div class="user-info-page">
  <!-- Gender Update Alert -->
  <div v-if="showGenderAlert" class="user-info-alert">
    <div class="user-info-alert__icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </div>
    <p class="user-info-alert__text">{{ $t('profile.userInfo.alertGender') }}</p>
    <button type="button" class="user-info-alert__btn" @click="handleUpdateGender">{{ $t('profile.userInfo.updateGender') }}</button>
  </div>

  <!-- Personal Information -->
  <div class="user-info-card">
    <div class="user-info-card__header">
      <h2 class="user-info-card__title">Thông tin cá nhân</h2>
      <button type="button" class="user-info-card__edit-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        <span>Cập nhật</span>
      </button>
    </div>

    <div class="user-info-card__body">
      <div class="user-info-card__col">
        <div class="user-info-card__row">
          <span class="user-info-card__label">{{ $t('profile.userInfo.fullName') }}</span>
          <span class="user-info-card__value">{{ user?.full_name || '—' }}</span>
        </div>
        <div class="user-info-card__row">
          <span class="user-info-card__label">{{ $t('profile.userInfo.gender') }}</span>
          <span class="user-info-card__value">{{ user?.gender ? $t(`profile.userInfo.genderOptions.${user.gender}`) : '—' }}</span>
        </div>
        <div class="user-info-card__row user-info-card__row--last">
          <span class="user-info-card__label">{{ $t('profile.userInfo.birthday') }}</span>
          <span class="user-info-card__value">{{ user?.birthday || '—' }}</span>
        </div>
      </div>
      <div class="user-info-card__col">
        <div class="user-info-card__row">
          <span class="user-info-card__label">{{ $t('profile.userInfo.phone') }}</span>
          <span class="user-info-card__value">{{ user?.phone || '—' }}</span>
        </div>
        <div class="user-info-card__row">
          <span class="user-info-card__label">{{ $t('profile.userInfo.email') }}</span>
          <span class="user-info-card__value">{{ user?.email || '—' }}</span>
        </div>
        <div class="user-info-card__row user-info-card__row--last">
          <span class="user-info-card__label">{{ $t('profile.userInfo.address') }}</span>
          <span class="user-info-card__value">{{ user?.default_address || '—' }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Address Book -->
  <div class="user-info-card">
    <div class="user-info-card__header">
      <h2 class="user-info-card__title">{{ $t('profile.userInfo.addressBook') }}</h2>
      <button type="button" class="user-info-card__edit-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        <span>{{ $t('profile.userInfo.addAddress') }}</span>
      </button>
    </div>

    <div class="user-info-address-empty">
      <img
        src="https://cdn-static.smember.com.vn/_next/static/media/empty.f8088c4d.png"
        alt="empty"
        class="user-info-address-empty__img"
      />
      <p class="user-info-address-empty__text">{{ $t('profile.userInfo.noAddress') }}</p>
    </div>
  </div>

  <!-- Password & Linked Accounts Row -->
  <div class="user-info-row">
    <!-- Password -->
    <div class="user-info-card">
      <div class="user-info-card__header">
        <h2 class="user-info-card__title">{{ $t('profile.userInfo.password') }}</h2>
        <button type="button" class="user-info-card__edit-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span>{{ $t('profile.userInfo.changePassword') }}</span>
        </button>
      </div>

      <div class="user-info-card__body">
        <div class="user-info-card__row user-info-card__row--plain">
          <span class="user-info-card__label">{{ $t('profile.userInfo.lastUpdated') }}</span>
          <span class="user-info-card__value">{{ user?.password_updated_at || '—' }}</span>
        </div>
      </div>
    </div>

    <!-- Linked Accounts -->
    <div class="user-info-card">
      <div class="user-info-card__header">
        <h2 class="user-info-card__title">{{ $t('profile.userInfo.linkedAccounts') }}</h2>
      </div>

      <div class="user-info-linked">
        <div v-if="!isLoadingLinks && socialLinks.length === 0" class="user-info-linked__empty">
          <p>{{ $t('profile.common.noData') }}</p>
        </div>
        <div
          v-for="(link, idx) in socialLinks"
          :key="link.provider"
          class="user-info-linked__item"
          :class="{ 'user-info-linked__item--last': idx === socialLinks.length - 1 }"
        >
          <div class="user-info-linked__brand">
            <img
              :src="link.providerIconUrl"
              :alt="link.providerName"
              class="user-info-linked__brand-icon"
            />
            <span class="user-info-linked__brand-name">{{ link.providerName }}</span>
          </div>
          <button type="button" class="user-info-linked__action">
            <template v-if="link.isLinked">
              <i class="bi bi-check-circle"></i>
              <span>{{ $t('profile.userInfo.linked') }}</span>
            </template>
            <template v-else>
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              <span>{{ $t('profile.userInfo.link') }}</span>
            </template>
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
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { useUserInfoStore } from '@/stores/userInfoStore'
import ProfileLayout from '@/components/Common/ProfileLayout.vue'

definePageMeta({ layout: 'default', middleware: ['auth-guard'] })

useHead({ title: 'Thông tin tài khoản - IrusGear' })

const authStore = useAuthStore()
const userInfoStore = useUserInfoStore()
const { user } = storeToRefs(authStore)
const { socialLinks, isLoadingLinks } = storeToRefs(userInfoStore)

const showGenderAlert = computed(() => !user.value?.gender)

// Fetch social links on mount
userInfoStore.fetchSocialLinks()

const handleUpdateGender = () => {
  // TODO: open gender update modal
}
</script>

<style scoped>
/* ── Alert Banner ───────────────────────── */
.user-info-alert {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #e4e4e7;
  border-radius: 14px;
  flex-wrap: wrap;
}

.user-info-alert__icon {
  color: #71717a;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.user-info-alert__text {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #18181b;
  margin: 0;
  min-width: 0;
}

.user-info-alert__btn {
  flex-shrink: 0;
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid #e4e4e7;
  background: #fff;
  font-size: 14px;
  font-weight: 500;
  color: #18181b;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  white-space: nowrap;
}

.user-info-alert__btn:hover {
  background: #f4f4f5;
  border-color: #d4d4d8;
}

/* ── Card ───────────────────────────────── */
.user-info-card {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  overflow: hidden;
}

.user-info-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f4f4f5;
  gap: 12px;
  flex-wrap: wrap;
}

.user-info-card__title {
  font-size: 15px;
  font-weight: 700;
  color: #18181b;
  margin: 0;
}

.user-info-card__edit-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  color: #d70018;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.15s;
  white-space: nowrap;
}

.user-info-card__edit-btn:hover {
  background: #fef2f2;
}

/* ── Personal Info Body ──────────────────── */
.user-info-card__body {
  padding: 4px 0;
}

.user-info-card__col {
  display: flex;
  flex-direction: column;
}

.user-info-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 20px;
  border-bottom: 1px solid #f4f4f5;
}

.user-info-card__row--last {
  border-bottom: none;
}

.user-info-card__row--plain {
  border-bottom: none;
}

.user-info-card__label {
  font-size: 14px;
  color: #71717a;
  flex-shrink: 0;
}

.user-info-card__value {
  font-size: 14px;
  font-weight: 600;
  color: #18181b;
  text-align: right;
  word-break: break-all;
}

/* ── Address Empty ──────────────────────── */
.user-info-address-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  gap: 12px;
}

.user-info-address-empty__img {
  width: 88px;
  height: auto;
  object-fit: contain;
}

.user-info-address-empty__text {
  font-size: 14px;
  color: #a1a1aa;
  margin: 0;
  text-align: center;
}

/* ── Two-column bottom row ──────────────── */
.user-info-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

/* ── Linked Accounts ─────────────────────── */
.user-info-linked {
  padding: 0;
}

.user-info-linked__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 20px;
  border-bottom: 1px solid #f4f4f5;
}

.user-info-linked__item--last {
  border-bottom: none;
}

.user-info-linked__brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-info-linked__brand-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  flex-shrink: 0;
}

.user-info-linked__brand-name {
  font-size: 14px;
  font-weight: 600;
  color: #18181b;
}

.user-info-linked__action {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border: none;
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  color: #d70018;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.15s;
  white-space: nowrap;
}

.user-info-linked__action:hover {
  background: #fef2f2;
}

/* ── Responsive ─────────────────────────── */
@media (max-width: 575.98px) {
  .user-info-alert {
    padding: 10px 12px;
    gap: 8px;
  }

  .user-info-alert__text {
    font-size: 13px;
  }

  .user-info-alert__btn {
    padding: 5px 10px;
    font-size: 12px;
    border-radius: 8px;
  }

  .user-info-card__header {
    padding: 12px 14px;
  }

  .user-info-card__title {
    font-size: 14px;
  }

  .user-info-card__edit-btn {
    padding: 4px 8px;
    font-size: 12px;
    gap: 4px;
  }

  .user-info-card__edit-btn span {
    display: none;
  }

  .user-info-card__row {
    padding: 10px 14px;
    gap: 12px;
  }

  .user-info-card__label,
  .user-info-card__value {
    font-size: 13px;
  }

  .user-info-linked__item {
    padding: 10px 14px;
    gap: 8px;
  }

  .user-info-linked__brand-name {
    font-size: 13px;
  }

  .user-info-linked__action {
    padding: 4px 8px;
    font-size: 12px;
  }

  .user-info-linked__action span {
    display: none;
  }

  .user-info-address-empty {
    padding: 24px 14px;
  }

  .user-info-address-empty__img {
    width: 72px;
  }

  .user-info-address-empty__text {
    font-size: 13px;
  }
}

@media (max-width: 767.98px) {
  .user-info-alert {
    padding: 12px;
  }

  .user-info-alert__text {
    font-size: 13px;
  }

  .user-info-alert__btn {
    padding: 6px 12px;
    font-size: 13px;
  }

  .user-info-card__header {
    padding: 14px 16px;
  }

  .user-info-card__title {
    font-size: 14px;
  }

  .user-info-card__edit-btn {
    padding: 5px 10px;
    font-size: 12px;
  }

  .user-info-card__row {
    padding: 12px 16px;
  }

  .user-info-card__label,
  .user-info-card__value {
    font-size: 13px;
  }

  .user-info-linked__item {
    padding: 12px 16px;
  }

  .user-info-linked__brand-name {
    font-size: 13px;
  }
}

@media (min-width: 768px) {
  .user-info-row {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .user-info-card {
    border-radius: 18px;
  }

  .user-info-card__header {
    padding: 18px 20px;
  }

  .user-info-card__title {
    font-size: 15px;
  }

  .user-info-card__row {
    padding: 16px 20px;
  }

  .user-info-card__label,
  .user-info-card__value {
    font-size: 14px;
  }

  .user-info-address-empty {
    padding: 40px 20px;
    gap: 14px;
  }

  .user-info-address-empty__img {
    width: 110px;
  }

  .user-info-address-empty__text {
    font-size: 14px;
  }

  .user-info-linked__item {
    padding: 16px 20px;
  }
}

@media (min-width: 992px) {
  .user-info-row {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .user-info-card__header {
    padding: 18px 22px;
  }

  .user-info-card__row {
    padding: 16px 22px;
  }

  .user-info-linked__item {
    padding: 16px 22px;
  }
}

@media (min-width: 1024px) {
  .user-info-row {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .user-info-card__row {
    padding: 18px 24px;
  }

  .user-info-linked__item {
    padding: 18px 24px;
  }
}

/* ── Bottom Clearance: Mobile Bottom Nav ─── */
@media (max-width: 991.98px) {
  .user-info-page {
    padding-bottom: 110px;
  }
}

@media (max-width: 767.98px) {
  .user-info-page {
    padding-bottom: 100px;
  }
}

@media (max-width: 575.98px) {
  .user-info-page {
    padding-bottom: 90px;
  }
}

@media (max-width: 480px) {
  .user-info-page {
    padding-bottom: 80px;
  }
}
</style>
