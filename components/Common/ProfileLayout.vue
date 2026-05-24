<template>
  <div class="profile-layout">
    <div class="container-xl">
      <!-- Member Info Card -->
      <div class="profile-layout__member-card">
        <div class="profile-layout__member-left">
          <div class="profile-layout__avatar-wrap">
            <div class="profile-layout__avatar">
              <img
                :src="avatarUrl"
                alt="Avatar"
                class="profile-layout__avatar-img"
                loading="lazy"
                @error="handleAvatarImageError"
              />
              <button
                type="button"
                class="profile-layout__avatar-action"
                :disabled="avatarUploading"
                :aria-label="$t('profile.layout.avatar.update')"
                :title="$t('profile.layout.avatar.update')"
                @click="openAvatarPicker"
              >
                <span v-if="avatarUploading" class="spinner-border spinner-border-sm"></span>
                <i v-else class="bi bi-camera"></i>
              </button>
              <span
                v-if="avatarUploading"
                class="profile-layout__avatar-progress"
                :style="{ '--avatar-progress': `${avatarProgress}%` }"
              ></span>
            </div>
            <input
              ref="avatarInput"
              type="file"
              class="profile-layout__avatar-input"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              :disabled="avatarUploading"
              @change="handleAvatarChange"
            />
          </div>
          <div class="profile-layout__member-info">
            <h2 class="profile-layout__member-name">{{ fullName }}</h2>

            <!-- No phone → show add button -->
            <button
              v-if="!user?.phone && !phoneEditing"
              type="button"
              class="profile-layout__add-phone-btn"
              @click="startPhoneEdit"
            >
              <i class="bi bi-phone"></i>
              {{ $t('profile.layout.addPhone') }}
            </button>

            <!-- Phone edit mode -->
            <div v-if="phoneEditing" class="profile-layout__phone-edit">
              <input
                v-model="phoneInput"
                type="tel"
                class="profile-layout__phone-input"
                :placeholder="$t('profile.layout.phonePlaceholder')"
                maxlength="15"
                @input="phoneError = ''"
                @keyup.enter="handlePhoneSave"
                @keyup.esc="handlePhoneCancel"
              />
              <div class="profile-layout__phone-actions">
                <button
                  type="button"
                  class="profile-layout__phone-save"
                  :disabled="phoneSaving || !phoneInput.trim() || !!phoneError"
                  @click="handlePhoneSave"
                >
                  <span v-if="phoneSaving" class="spinner-border spinner-border-sm"></span>
                  <span v-else>{{ $t('common.save') }}</span>
                </button>
                <button
                  type="button"
                  class="profile-layout__phone-cancel"
                  :disabled="phoneSaving"
                  @click="handlePhoneCancel"
                >
                  {{ $t('common.cancel') }}
                </button>
              </div>
              <p v-if="phoneError" class="profile-layout__phone-error">
                <i class="bi bi-exclamation-circle"></i>
                {{ phoneError }}
              </p>
            </div>

            <!-- Has phone → show display -->
            <p v-else-if="user?.phone" class="profile-layout__member-phone">
              {{ displayPhone }}
              <button type="button" class="profile-layout__toggle-phone" @click="phoneVisible = !phoneVisible">
                <i :class="phoneVisible ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
              </button>
            </p>
            <div v-if="currentUser?.rankKey" class="profile-layout__rank-badges">
              <span class="profile-layout__rank-badge" :class="`profile-layout__rank-badge--${currentUser.rankKey}`">
                {{ $t(`profile.promotion.ranks.${currentUser.rankKey}`) }}
              </span>
            </div>
            <div v-if="currentUser?.renewalDate" class="profile-layout__renew-hint">
              <i class="bi bi-clock"></i>
              {{ $t('profile.layout.memberCard.renewHint', { date: currentUser.renewalDate }) }}
            </div>
          </div>
        </div>
        <div class="profile-layout__member-stats">
          <div class="profile-layout__stat-group">
            <div class="profile-layout__stat-divider"></div>
            <div class="profile-layout__stat-item">
              <div class="profile-layout__stat-icon">
                <i class="bi bi-cart3"></i>
              </div>
              <div class="profile-layout__stat-content">
                <div class="profile-layout__stat-value">{{ totalOrders }}</div>
                <div class="profile-layout__stat-label">{{ $t('profile.layout.memberCard.totalOrders') }}{{ isDesktop ? $t('profile.layout.memberCard.totalOrdersSuffix') : '' }}</div>
              </div>
            </div>
            <div class="profile-layout__stat-divider"></div>
            <div class="profile-layout__stat-item">
              <div class="profile-layout__stat-icon">
                <i class="bi bi-wallet2"></i>
              </div>
              <div class="profile-layout__stat-content">
                <div class="profile-layout__stat-value">{{ currentUser?.totalSpentFormatted || '0đ' }}</div>
                <div class="profile-layout__stat-label">
                  {{ $t('profile.layout.memberCard.totalSpent') }}
                  <span class="profile-layout__stat-dot"></span>
                  {{ $t('profile.layout.memberCard.fromDate') }}
                </div>
                <div v-if="isDesktop && currentUser?.amountToNextRankFormatted" class="profile-layout__rank-progress">
                  {{ $t('profile.layout.memberCard.progressHint', { amount: currentUser.amountToNextRankFormatted, rank: currentUser.nextRankName }) }}
                </div>
              </div>
            </div>
          </div>
          <div v-if="!isDesktop && currentUser?.amountToNextRankFormatted" class="profile-layout__rank-progress profile-layout__rank-progress--mobile">
            {{ $t('profile.layout.memberCard.progressHintMobile', { amount: currentUser.amountToNextRankFormatted, rank: currentUser.nextRankName }) }}
          </div>
          <div v-if="isDesktop" class="profile-layout__channel-note">
            <i class="bi bi-info-circle"></i>
            {{ $t('profile.layout.memberCard.channelNote') }}
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="profile-layout__quick-actions">
        <NuxtLink :to="localePath('/promotion')" class="profile-layout__quick-action">
          <div class="profile-layout__quick-action-icon">
            <i class="bi bi-star"></i>
          </div>
          <span>{{ $t('profile.layout.quickActions.memberRank') }}</span>
        </NuxtLink>
        <a href="#" class="profile-layout__quick-action">
          <div class="profile-layout__quick-action-icon">
            <i class="bi bi-ticket-perforated"></i>
          </div>
          <span>{{ $t('profile.layout.quickActions.discountCode') }}</span>
        </a>
        <NuxtLink :to="localePath('/orders')" class="profile-layout__quick-action">
          <div class="profile-layout__quick-action-icon">
            <i class="bi bi-clock-history"></i>
          </div>
          <span>{{ $t('profile.layout.quickActions.orderHistory') }}</span>
        </NuxtLink>
        <NuxtLink :to="localePath('/user-info')" class="profile-layout__quick-action">
          <div class="profile-layout__quick-action-icon">
            <i class="bi bi-geo-alt"></i>
          </div>
          <span>{{ $t('profile.layout.quickActions.addressBook') }}</span>
        </NuxtLink>
        <a href="#" class="profile-layout__quick-action">
          <div class="profile-layout__quick-action-icon">
            <i class="bi bi-mortarboard"></i>
          </div>
          <span>{{ $t('profile.promotion.student') }}</span>
        </a>
        <NuxtLink :to="localePath('/user-info')" class="profile-layout__quick-action">
          <div class="profile-layout__quick-action-icon">
            <i class="bi bi-link-45deg"></i>
          </div>
          <span>{{ $t('profile.layout.quickActions.linkedAccounts') }}</span>
        </NuxtLink>
      </div>

      <!-- Body: Sidebar + Main -->
      <div class="profile-layout__body">
        <!-- Left Sidebar -->
        <aside class="profile-layout__sidebar d-none d-md-block">
          <nav class="profile-layout__sidebar-nav">
            <NuxtLink :to="localePath('/profile')" class="profile-layout__sidebar-item" :class="{ 'profile-layout__sidebar-item--active': activeSidebarItem === 'overview' }">
              <i class="bi bi-person"></i>
              <span>{{ $t('profile.layout.sidebar.overview') }}</span>
            </NuxtLink>
            <NuxtLink :to="localePath('/orders')" class="profile-layout__sidebar-item" :class="{ 'profile-layout__sidebar-item--active': activeSidebarItem === 'orders' }">
              <i class="bi bi-bag-check"></i>
              <span>{{ $t('profile.layout.sidebar.orders') }}</span>
            </NuxtLink>
            <NuxtLink :to="localePath('/warranty')" class="profile-layout__sidebar-item" :class="{ 'profile-layout__sidebar-item--active': activeSidebarItem === 'warranty' }">
              <i class="bi bi-shield-check"></i>
              <span>{{ $t('profile.layout.sidebar.warranty') }}</span>
            </NuxtLink>
            <NuxtLink :to="localePath('/tradein')" class="profile-layout__sidebar-item" :class="{ 'profile-layout__sidebar-item--active': activeSidebarItem === 'tradein' }">
              <i class="bi bi-arrow-left-right"></i>
              <span>{{ $t('profile.layout.sidebar.tradein') }}</span>
            </NuxtLink>

            <div class="profile-layout__sidebar-divider"></div>

            <NuxtLink :to="localePath('/promotion')" class="profile-layout__sidebar-item" :class="{ 'profile-layout__sidebar-item--active': activeSidebarItem === 'rank' }">
              <i class="bi bi-star"></i>
              <span>{{ $t('profile.layout.sidebar.promotion') }}</span>
            </NuxtLink>

            <div class="profile-layout__sidebar-divider"></div>

            <NuxtLink :to="localePath('/user-info')" class="profile-layout__sidebar-item" :class="{ 'profile-layout__sidebar-item--active': activeSidebarItem === 'user-info' }">
              <i class="bi bi-gear"></i>
              <span>{{ $t('profile.layout.sidebar.userInfo') }}</span>
            </NuxtLink>
            <NuxtLink :to="localePath('/policy')" class="profile-layout__sidebar-item" :class="{ 'profile-layout__sidebar-item--active': activeSidebarItem === 'policy' }">
              <i class="bi bi-journal-text"></i>
              <span>{{ $t('profile.layout.sidebar.policy') }}</span>
            </NuxtLink>
            <NuxtLink :to="localePath('/tos')" class="profile-layout__sidebar-item" :class="{ 'profile-layout__sidebar-item--active': activeSidebarItem === 'tos' }">
              <i class="bi bi-file-earmark-text"></i>
              <span>{{ $t('profile.layout.sidebar.terms') }}</span>
            </NuxtLink>

            <div class="profile-layout__sidebar-divider"></div>

            <button type="button" class="profile-layout__sidebar-item profile-layout__sidebar-item--logout" @click="handleLogout">
              <i class="bi bi-box-arrow-right"></i>
              <span>{{ $t('profile.layout.sidebar.logout') }}</span>
            </button>
          </nav>

          <div class="profile-layout__app-cta">
            <p class="profile-layout__app-cta-text">{{ $t('profile.layout.appCta.title') }}</p>
            <div class="profile-layout__app-cta-content">
              <div class="profile-layout__qr-wrap">
                <i class="bi bi-qr-code" style="font-size:48px;color:#d4d4d8;display:flex;align-items:center;justify-content:center;width:100%;height:100%"></i>
              </div>
              <div class="profile-layout__store-links">
                <a href="#" target="_blank" rel="nofollow" class="profile-layout__store-btn">
                  <i class="bi bi-google-play"></i> Google Play
                </a>
                <a href="#" target="_blank" rel="nofollow" class="profile-layout__store-btn">
                  <i class="bi bi-apple"></i> App Store
                </a>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content Slot -->
        <div class="profile-layout__main">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { toast } from 'vue-sonner'
import { useLocalePath, useRoute } from '#imports'
import { useAuthStore } from '@/stores/authStore'
import { useMemberRankStore } from '@/stores/memberRankStore'
import { useAvatarUpload } from '@/composables/useAvatarUpload'
import { getUserAvatarFallbackUrl, resolveUserAvatarUrl } from '@/utils/avatar'

const localePath = useLocalePath()
const route = useRoute()
const { t } = useI18n()
const authStore = useAuthStore()
const memberRankStore = useMemberRankStore()
const avatarUploader = useAvatarUpload()
const { user } = storeToRefs(authStore)
const { currentUser } = storeToRefs(memberRankStore)

const isDesktop = ref(false)
const phoneVisible = ref(false)
const phoneEditing = ref(false)
const phoneInput = ref('')
const phoneSaving = ref(false)
const phoneError = ref('')
const avatarInput = ref(null)

const PHONE_REGEX = /^(\+84|0)(3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$|^(\+84|0)(2[0-9])[0-9]{8}$/

const activeSidebarItem = computed(() => {
  const path = route.path
  if (path.includes('/orders')) return 'orders'
  if (path.includes('/warranty')) return 'warranty'
  if (path.includes('/tradein')) return 'tradein'
  if (path.includes('/profile') && !path.includes('/promotion')) return 'overview'
  if (path.includes('/promotion')) return 'rank'
  if (path.includes('/user-info')) return 'user-info'
  if (path.includes('/policy')) return 'policy'
  if (path.includes('/tos')) return 'tos'
  return 'overview'
})

const fullName = computed(() => {
  if (!user.value) return 'Khách'
  return user.value.full_name || `${user.value.first_name || ''} ${user.value.last_name || ''}`.trim() || 'Khách'
})

const displayPhone = computed(() => {
  if (!user.value?.phone) return '097*****03'
  if (phoneVisible.value) return user.value.phone
  const phone = String(user.value.phone)
  return phone.slice(0, 3) + '*****' + phone.slice(-2)
})

const avatarUrl = computed(() => {
  if (!user.value) {
    return 'https://ui-avatars.com/api/?name=KH&background=f4f4f5&color=71717a&size=88'
  }

  return resolveUserAvatarUrl(user.value, {
    name: fullName.value,
    size: 88,
  })
})

const fallbackAvatarUrl = computed(() => getUserAvatarFallbackUrl(user.value, {
  name: fullName.value,
  background: user.value ? '1a1a1a' : 'f4f4f5',
  color: user.value ? 'fff' : '71717a',
  size: 88,
}))

const totalOrders = ref(0)
const avatarUploading = computed(() => avatarUploader.isUploading.value)
const avatarProgress = computed(() => avatarUploader.progress.value)

const handleLogout = () => {
  authStore.logout()
  navigateTo('/auth/login')
}

const openAvatarPicker = () => {
  if (avatarUploading.value || !user.value) return
  avatarInput.value?.click()
}

const handleAvatarImageError = (event) => {
  const image = event.currentTarget
  if (!image || image.src === fallbackAvatarUrl.value) return

  image.src = fallbackAvatarUrl.value
}

const handleAvatarChange = async (event) => {
  const file = event.target.files?.[0]
  event.target.value = ''

  if (!file) return

  try {
    const response = await avatarUploader.uploadAvatar(file)
    const updatedUser = response?.data

    if (updatedUser && typeof updatedUser === 'object') {
      authStore.mergeUser(updatedUser)
    }

    toast.success(response?.message || t('profile.layout.avatar.updateSuccess'))
  } catch (error) {
    toast.error(error?.message || t('profile.layout.avatar.updateFailed'))
  } finally {
    avatarUploader.reset()
  }
}

const startPhoneEdit = () => {
  phoneInput.value = user.value?.phone || ''
  phoneEditing.value = true
}

const handlePhoneCancel = () => {
  phoneEditing.value = false
  phoneInput.value = ''
  phoneError.value = ''
}

const handlePhoneSave = async () => {
  const phone = phoneInput.value.trim()
  if (!phone) return

  phoneError.value = ''

  if (!PHONE_REGEX.test(phone)) {
    phoneError.value = 'Số điện thoại không hợp lệ'
    return
  }

  phoneSaving.value = true
  try {
    const result = await authStore.updateProfile({ phone })
    if (result.status) {
      phoneEditing.value = false
      phoneInput.value = ''
      phoneError.value = ''
    } else {
      phoneError.value = result.message || 'Cập nhật thất bại'
    }
  } finally {
    phoneSaving.value = false
  }
}

const handleResize = () => {
  isDesktop.value = window.innerWidth >= 992
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)

  if (!authStore.sessionResolved && !authStore.sessionLoading) {
    authStore.fetchUser().catch(() => {})
  }
  memberRankStore.fetchMemberRank().catch(() => {})
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* ── Member Card ───────────────────────── */
.profile-layout__member-card {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 16px;
}

.profile-layout__member-left {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.profile-layout__avatar-wrap {
  flex-shrink: 0;
}

.profile-layout__avatar {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  overflow: hidden;
  background: #f4f4f5;
  position: relative;
}

.profile-layout__avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-layout__avatar-action {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 26px;
  height: 26px;
  border: 2px solid #fff;
  border-radius: 50%;
  background: #111;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -50%) scale(0.92);
  transition: background 0.15s ease, transform 0.15s ease, opacity 0.15s ease;
}

.profile-layout__avatar:hover .profile-layout__avatar-action,
.profile-layout__avatar:focus-within .profile-layout__avatar-action,
.profile-layout__avatar-action:disabled {
  opacity: 1;
  pointer-events: auto;
  transform: translate(-50%, -50%);
}

.profile-layout__avatar-action:hover:not(:disabled) {
  background: #27272a;
  transform: translate(-50%, -50%) scale(1.05);
}

.profile-layout__avatar-action:disabled {
  cursor: wait;
  opacity: 0.85;
}

.profile-layout__avatar-action i {
  font-size: 13px;
  line-height: 1;
}

.profile-layout__avatar-action .spinner-border-sm {
  width: 13px;
  height: 13px;
  border-width: 2px;
}

.profile-layout__avatar-progress {
  position: absolute;
  left: 0;
  bottom: 0;
  width: var(--avatar-progress);
  height: 3px;
  background: #111;
  transition: width 0.15s ease;
}

.profile-layout__avatar-input {
  display: none;
}

.profile-layout__member-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.profile-layout__member-name {
  font-size: 16px;
  font-weight: 700;
  color: #18181b;
  margin: 0;
  line-height: 1.3;
}

.profile-layout__member-phone {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #71717a;
  margin: 0;
}

.profile-layout__toggle-phone {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #71717a;
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 1;
}

.profile-layout__add-phone-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: var(--irus-color-accent-soft);
  border: 1px dashed var(--irus-color-accent);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--irus-color-accent);
  cursor: pointer;
  transition: background 0.15s ease;
  margin-top: 2px;
  width: fit-content;
}

.profile-layout__add-phone-btn:hover {
  background: var(--irus-color-danger-soft);
}

.profile-layout__add-phone-btn i {
  font-size: 14px;
}

.profile-layout__phone-edit {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 6px;
  flex-wrap: wrap;
}

.profile-layout__phone-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.profile-layout__phone-input {
  flex: 1;
  min-width: 140px;
  padding: 5px 10px;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  font-size: 13px;
  color: #18181b;
  outline: none;
  transition: border-color 0.15s ease;
}

.profile-layout__phone-input:focus {
  border-color: var(--irus-color-accent);
}

.profile-layout__phone-save {
  padding: 5px 12px;
  background: var(--irus-color-accent);
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: background 0.15s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
}

.profile-layout__phone-save:hover:not(:disabled) {
  background: var(--irus-color-accent-hover);
}

.profile-layout__phone-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.profile-layout__phone-cancel {
  padding: 5px 12px;
  background: #f4f4f5;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #71717a;
  cursor: pointer;
  transition: background 0.15s ease;
}

.profile-layout__phone-cancel:hover:not(:disabled) {
  background: #e4e4e7;
}

.profile-layout__phone-cancel:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.profile-layout__phone-error {
  width: 100%;
  margin: 4px 0 0;
  padding: 4px 8px;
  background: #fff5f5;
  border: 1px solid #fee2e2;
  border-radius: 6px;
  font-size: 12px;
  color: #dc2626;
  display: flex;
  align-items: center;
  gap: 4px;
}

.profile-layout__rank-badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.profile-layout__rank-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.profile-layout__rank-badge--null {
  background: #f4f4f5;
  color: #18181b;
}

.profile-layout__rank-badge--student {
  background: var(--irus-color-accent);
  color: #fff;
}

.profile-layout__rank-badge--snew {
  background: #3b82f6;
  color: #fff;
}

.profile-layout__rank-badge--smem {
  background: #d97706;
  color: #fff;
}

.profile-layout__rank-badge--svip {
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  color: #fff;
}

.profile-layout__rank-badge--snull {
  background: #f4f4f5;
  color: #18181b;
}

.profile-layout__renew-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: linear-gradient(90deg, #f7f7f8, #fff);
  border-radius: 8px;
  font-size: 12px;
  color: #71717a;
  margin-top: 2px;
}

.profile-layout__renew-hint i {
  font-size: 12px;
  color: #71717a;
}

/* ── Stats ─────────────────────────────── */
.profile-layout__member-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.profile-layout__stat-group {
  display: flex;
  align-items: stretch;
  gap: 16px;
}

.profile-layout__stat-item {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.profile-layout__stat-divider {
  width: 1px;
  background: var(--irus-color-border-strong);
  flex-shrink: 0;
  margin: 4px 0;
}

.profile-layout__stat-icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #f4f4f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.profile-layout__stat-icon img {
  width: 20px;
  height: 19px;
  object-fit: contain;
}

.profile-layout__stat-icon i {
  font-size: 18px;
  color: #18181b;
}

.profile-layout__stat-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.profile-layout__stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #18181b;
  line-height: 1.2;
}

.profile-layout__stat-label {
  font-size: 12px;
  color: #71717a;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.profile-layout__stat-dot {
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #e4e4e7;
}

.profile-layout__rank-progress {
  margin-top: 4px;
  padding: 4px 10px;
  background: linear-gradient(90deg, #f7f7f8, #fff);
  border-radius: 8px;
  font-size: 12px;
  color: #71717a;
}

.profile-layout__rank-progress strong {
  color: #18181b;
}

.profile-layout__rank-progress--mobile {
  display: block;
}

.profile-layout__channel-note {
  display: none;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: linear-gradient(90deg, #f7f7f8, #fff);
  border-radius: 8px;
  font-size: 12px;
  color: #71717a;
}

/* ── Quick Actions ─────────────────────── */
.profile-layout__quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.profile-layout__quick-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 14px;
  text-decoration: none;
  transition: background 0.15s ease;
}

.profile-layout__quick-action:hover {
  background: #fafafa;
}

.profile-layout__quick-action-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f4f4f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-layout__quick-action-icon img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.profile-layout__quick-action-icon i {
  font-size: 22px;
  color: #18181b;
}

.profile-layout__quick-action span {
  font-size: 11px;
  font-weight: 500;
  color: #18181b;
  text-align: center;
  line-height: 1.3;
}

/* ── Body: Sidebar + Main ─────────────── */
.profile-layout__body {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

/* ── Sidebar ───────────────────────────── */
.profile-layout__sidebar {
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 24px;
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  border-radius: 18px;
  background: #fff;
  border: 1px solid #ececf1;
  display: flex;
  flex-direction: column;
}

.profile-layout__sidebar::-webkit-scrollbar {
  width: 4px;
}

.profile-layout__sidebar::-webkit-scrollbar-thumb {
  background: #e4e4e7;
  border-radius: 999px;
}

.profile-layout__sidebar-nav {
  padding: 8px 0;
  flex: 1;
}

.profile-layout__sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #52525b;
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease;
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  position: relative;
}

.profile-layout__sidebar-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  border-radius: 0 4px 4px 0;
  background: transparent;
  transition: background 0.15s ease;
}

.profile-layout__sidebar-item:hover {
  background: #f4f4f5;
  color: #18181b;
}

.profile-layout__sidebar-item:hover::before {
  background: var(--irus-color-accent);
}

.profile-layout__sidebar-item i {
  font-size: 20px;
  flex-shrink: 0;
}

.profile-layout__sidebar-item span {
  flex: 1;
}

.profile-layout__sidebar-item--active {
  background: #f4f4f5;
  color: var(--irus-color-accent);
  font-weight: 600;
}

.profile-layout__sidebar-item--active::before {
  background: var(--irus-color-accent);
}

.profile-layout__sidebar-item--active:hover {
  color: var(--irus-color-accent-hover);
}

.profile-layout__sidebar-divider {
  height: 1px;
  background: #f0f0f2;
  margin: 4px 16px;
}

.profile-layout__sidebar-item--logout {
  color: #71717a;
}

.profile-layout__sidebar-item--logout:hover {
  color: var(--irus-color-accent);
}

.profile-layout__sidebar-item--logout::before {
  background: transparent;
}

.profile-layout__sidebar-item--logout:hover::before {
  background: var(--irus-color-accent);
}

/* ── App CTA ───────────────────────────── */
.profile-layout__app-cta {
  padding: 16px 20px;
  border-top: 1px solid #f0f0f2;
}

.profile-layout__app-cta-text {
  font-size: 12px;
  color: #71717a;
  margin: 0 0 12px;
  line-height: 1.5;
}

.profile-layout__app-cta-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-layout__qr-wrap {
  width: 88px;
  height: 88px;
  background: #f4f4f5;
  border-radius: 10px;
  padding: 6px;
  flex-shrink: 0;
}

.profile-layout__qr-wrap img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.profile-layout__store-links {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.profile-layout__store-links a img {
  height: 36px;
  width: auto;
}

.profile-layout__store-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--irus-color-surface-strong);
  color: #fff;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s ease;
}
.profile-layout__store-btn:hover {
  background: var(--irus-color-accent-hover);
  color: #fff;
}

/* ── Main Content ──────────────────────── */
.profile-layout__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ── Responsive ───────────────────────── */
@media (max-width: 991.98px) {
  .profile-layout__member-card {
    padding: 16px;
    border-radius: 14px;
  }

  .profile-layout__avatar {
    width: 56px;
    height: 56px;
  }

  .profile-layout__member-name {
    font-size: 15px;
  }

  .profile-layout__stat-value {
    font-size: 16px;
  }

  .profile-layout__stat-icon {
    width: 32px;
    height: 32px;
  }

  .profile-layout__stat-icon img {
    width: 18px;
    height: 17px;
  }

  .profile-layout__stat-divider {
    display: none;
  }

  .profile-layout__stat-group {
    flex-direction: column;
    gap: 12px;
  }

  .profile-layout__quick-actions {
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }

  .profile-layout__quick-action {
    padding: 10px 6px;
    border-radius: 12px;
  }

  .profile-layout__quick-action-icon {
    width: 36px;
    height: 36px;
  }

  .profile-layout__quick-action-icon img {
    width: 20px;
    height: 20px;
  }

  .profile-layout__quick-action span {
    font-size: 10px;
  }
}

@media (max-width: 575.98px) {
  .profile-layout__quick-actions {
    gap: 4px;
  }

  .profile-layout__quick-action {
    padding: 8px 4px;
    border-radius: 10px;
  }

  .profile-layout__quick-action-icon {
    width: 32px;
    height: 32px;
  }

  .profile-layout__quick-action-icon img {
    width: 18px;
    height: 18px;
  }

  .profile-layout__quick-action span {
    font-size: 9px;
  }
}

/* Desktop ≥992px */
@media (min-width: 992px) {
  .profile-layout__member-card {
    flex-direction: row;
    align-items: center;
    padding: 24px;
    gap: 32px;
  }

  .profile-layout__member-left {
    flex-shrink: 0;
  }

  .profile-layout__avatar {
    width: 72px;
    height: 72px;
  }

  .profile-layout__member-name {
    font-size: 18px;
  }

  .profile-layout__member-stats {
    flex: 1;
  }

  .profile-layout__stat-group {
    gap: 24px;
  }

  .profile-layout__stat-icon {
    width: 48px;
    height: 48px;
  }

  .profile-layout__stat-icon img {
    width: 26px;
    height: 28px;
  }

  .profile-layout__stat-value {
    font-size: 22px;
  }

  .profile-layout__stat-label {
    font-size: 13px;
  }

  .profile-layout__stat-dot {
    width: 5px;
    height: 5px;
  }

  .profile-layout__stat-divider {
    width: 2px;
  }

  .profile-layout__rank-progress {
    font-size: 12px;
  }

  .profile-layout__channel-note {
    display: flex;
  }

  .profile-layout__quick-actions {
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
  }

  .profile-layout__quick-action {
    padding: 14px 10px;
  }

  .profile-layout__quick-action span {
    font-size: 13px;
  }

  .profile-layout__sidebar {
    width: 280px;
  }

  .profile-layout__main {
    min-width: 0;
  }
}

@media (min-width: 1200px) {
  .profile-layout__sidebar {
    width: 300px;
  }
}
</style>
