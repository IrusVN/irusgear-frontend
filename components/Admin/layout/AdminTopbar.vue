<template>
  <header class="admin-topbar admin-card-shell">
    <div class="topbar-left">
      <button class="admin-icon-button hamburger-btn" type="button" :aria-label="$t('admin.layout.openMenu')" @click="$emit('toggle-mobile')">
        <i class="bi bi-list fs-4"></i>
      </button>

      <label class="topbar-search">
        <i class="bi bi-search"></i>
        <input v-model="searchQuery" type="search" :placeholder="$t('admin.layout.searchPlaceholder')" />
        <kbd>{{ $t('admin.layout.searchShortcut') }}</kbd>
      </label>
    </div>

    <div class="topbar-actions">
      <LanguageSwitcher class="admin-lang-switcher hide-mobile" />
      <!-- <button class="admin-icon-button hide-mobile" type="button" aria-label="Toggle theme">
        <i class="bi bi-sun"></i>
      </button> -->
      <button class="admin-icon-button hide-mobile" type="button" :aria-label="$t('admin.layout.apps')">
        <i class="bi bi-grid-3x3-gap"></i>
      </button>

      <!-- Notification bell — port từ CustomerSidebar -->
      <div
        class="header-icon-dropdown-wrapper position-relative"
        @mouseenter="handleNotiDropdownEnter"
        @mouseleave="isNotiDropdownOpen = false"
      >
        <button type="button" class="admin-icon-button notification-button" :aria-label="$t('admin.layout.notifications')">
          <i class="bi bi-bell"></i>
          <span
            v-if="notificationStore.unreadCount > 0"
            class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white"
            style="min-width:1.1rem;height:1.1rem;padding:0;font-size:0.65rem;display:inline-flex;align-items:center;justify-content:center;"
          >
            {{ notificationStore.unreadCount > 9 ? '9+' : notificationStore.unreadCount }}
          </span>
        </button>

        <Transition name="dropdown-fade">
          <div v-if="isNotiDropdownOpen" class="header-dropdown header-dropdown--noti">
            <div class="header-dropdown__header">
              <span class="header-dropdown__title">{{ $t('admin.notifications.title') }}</span>
              <button
                v-if="notificationStore.unreadCount > 0"
                type="button"
                class="header-dropdown__mark-read"
                @click="handleMarkAllRead"
              >
                {{ $t('admin.notifications.markAllRead') }}
              </button>
            </div>

            <div v-if="notificationStore.isLoading" class="header-dropdown__loading">
              <div class="noti-spinner"></div>
              <p>{{ $t('admin.notifications.loading') }}</p>
            </div>

            <div v-else-if="notiLoadError" class="header-dropdown__empty">
              <i class="bi bi-exclamation-triangle"></i>
              <p>{{ $t('admin.notifications.loadError') }}</p>
            </div>

            <div
              v-else-if="!notificationStore.isLoading && notificationStore.notifications.length === 0"
              class="header-dropdown__empty"
            >
              <i class="bi bi-bell-slash"></i>
              <p>{{ $t('admin.notifications.empty') }}</p>
            </div>

            <div v-else class="header-dropdown__body">
              <div class="header-dropdown__scroll">
                <div
                  v-for="noti in notificationStore.notifications"
                  :key="noti.id"
                  class="noti-item"
                  :class="{ 'noti-item--unread': !noti.isRead }"
                  @click="handleNotiClick(noti)"
                >
                  <div class="noti-item__icon" :class="`noti-item__icon--${noti.type || 'system'}`">
                    <i :class="noti.icon || 'bi bi-bell'"></i>
                  </div>
                  <div class="noti-item__content">
                    <p class="noti-item__text">{{ noti.text }}</p>
                    <span class="noti-item__time">{{ noti.time }}</span>
                  </div>
                  <div class="noti-item__actions">
                    <span v-if="!noti.isRead" class="noti-item__dot"></span>
                    <button
                      type="button"
                      class="noti-item__close"
                      :aria-label="$t('admin.notifications.removeAria')"
                      @click.stop="handleRemoveNotification(noti.id)"
                    >
                      <i class="bi bi-x"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <NuxtLink to="/admin/settings" class="admin-icon-button settings-button hide-mobile" :aria-label="$t('admin.layout.settings')">
        <i class="bi bi-gear"></i>
      </NuxtLink>
      <AdminProfileMenu />
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminProfileMenu from './AdminProfileMenu.vue'
import LanguageSwitcher from '@/components/Sidebar/LanguageSwitcher.vue'
import { useNotificationStore } from '@/stores/notificationStore'

defineEmits(['toggle-mobile'])

const searchQuery = ref('')
const notificationStore = useNotificationStore()
const isNotiDropdownOpen = ref(false)
const notiLoadError = ref(false)
let _notiFetched = false

// Lazy fetch notifications khi hover lần đầu (tránh fetch ngay onMounted)
const handleNotiDropdownEnter = () => {
  isNotiDropdownOpen.value = true
  if (notificationStore.isLoading) return

  if (!notificationStore.hydrated || !_notiFetched) {
    notiLoadError.value = false
    notificationStore.fetchNotifications().catch(() => {
      notiLoadError.value = true
    })
    _notiFetched = true
  }
}

const handleNotiClick = (noti) => {
  if (!noti.isRead) {
    notificationStore.markAsRead(noti.id)
  }
}

const handleMarkAllRead = () => {
  notificationStore.markAllAsRead()
}

const handleRemoveNotification = async (id) => {
  await notificationStore.removeNotification(id)
}

onMounted(() => {
  if (import.meta.client) {
    // Fetch unread count ngay để badge số hiển thị chính xác (notifications dropdown lazy load)
    notificationStore.fetchUnreadCount?.().catch(() => {})
  }
})
</script>

<style scoped>
.admin-topbar {
  min-height: var(--admin-topbar-height);
  padding: 0 12px 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.topbar-left {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Hamburger: hidden on desktop (≥992px), shown on mobile */
.hamburger-btn {
  display: none;
}

.topbar-search {
  flex: 1;
  min-width: 180px;
  max-width: 620px;
  height: 42px;
  margin: 0;
  color: var(--admin-subtle);
  display: flex;
  align-items: center;
  gap: 12px;
}

.topbar-search i {
  color: var(--admin-text);
  font-size: 1.1rem;
}

.topbar-search input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--admin-text);
}

.topbar-search input::placeholder {
  color: var(--admin-subtle);
}

.topbar-search kbd {
  border: 1px solid var(--admin-border);
  border-radius: 6px;
  background: #fff;
  color: var(--admin-subtle);
  box-shadow: none;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 6px;
  white-space: nowrap;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 3px;
}

.notification-button {
  position: relative;
}

.notification-button span {
  position: absolute;
  top: 7px;
  right: 8px;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  border: 2px solid #fff;
  background: var(--admin-danger);
}

.settings-button {
  text-decoration: none;
  color: var(--admin-muted);
}

.settings-button:hover {
  color: var(--admin-text);
}

/* Mobile: show hamburger, hide desktop-only buttons */
@media screen and (max-width: 991.98px) {
  .hamburger-btn {
    display: inline-flex;
  }
}

@media screen and (max-width: 767.98px) {
  .admin-topbar {
    gap: 8px;
    padding: 0 8px;
  }

  .topbar-search {
    min-width: 0;
  }

  .topbar-search kbd {
    display: none;
  }

  .hide-mobile {
    display: none;
  }
}

/* ── LanguageSwitcher override: admin show từ md+ thay vì xxl+ ── */
.admin-lang-switcher :deep(.lang-trigger) {
  display: inline-flex !important;
}

/* ── Notification dropdown — port từ CustomerSidebar ── */
.header-icon-dropdown-wrapper {
  display: inline-flex;
}

.header-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 1070;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(15, 23, 42, 0.1), 0 2px 8px rgba(15, 23, 42, 0.05);
  overflow: hidden;
  min-width: 360px;
}

.header-dropdown--noti { min-width: 340px; }

.header-dropdown__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
}

.header-dropdown__title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.01em;
}

.header-dropdown__mark-read {
  font-size: 0.75rem;
  font-weight: 600;
  color: #111827;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
  opacity: 0.6;
  transition: opacity 0.15s ease;
}

.header-dropdown__mark-read:hover { opacity: 1; }

.header-dropdown__body { display: flex; flex-direction: column; }

.header-dropdown__scroll {
  max-height: 360px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(15, 23, 42, 0.12) transparent;
}

.header-dropdown__scroll::-webkit-scrollbar { width: 4px; }
.header-dropdown__scroll::-webkit-scrollbar-thumb {
  background: rgba(15, 23, 42, 0.12);
  border-radius: 4px;
}

.header-dropdown__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px 20px;
  color: #8e8e93;
}

.header-dropdown__empty i { font-size: 2.2rem; opacity: 0.35; line-height: 1; }
.header-dropdown__empty p { font-size: 0.85rem; font-weight: 500; margin: 0; color: #6b7280; }

.header-dropdown__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 20px;
  color: #8e8e93;
}

.header-dropdown__loading p { font-size: 0.85rem; font-weight: 500; margin: 0; color: #6b7280; }

.noti-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid rgba(15, 23, 42, 0.1);
  border-top-color: #111827;
  border-radius: 50%;
  animation: notiSpin 0.7s linear infinite;
}

@keyframes notiSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.noti-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.05);
  transition: background-color 0.15s ease;
  cursor: default;
}

.noti-item:last-child { border-bottom: none; }
.noti-item:hover { background: rgba(15, 23, 42, 0.02); }
.noti-item--unread { background: rgba(15, 23, 42, 0.02); }
.noti-item--unread:hover { background: rgba(15, 23, 42, 0.035); }

.noti-item__icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  line-height: 1;
}

.noti-item__icon i { line-height: 1; }
.noti-item__icon--order  { background: rgba(15, 23, 42, 0.06); color: #111827; }
.noti-item__icon--promo  { background: rgba(220, 38, 38, 0.08); color: #dc2626; }
.noti-item__icon--review { background: rgba(234, 179, 8, 0.1); color: #ca8a04; }
.noti-item__icon--system { background: rgba(59, 130, 246, 0.08); color: #2563eb; }

.noti-item__content { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }

.noti-item__text {
  font-size: 0.82rem;
  font-weight: 500;
  color: #374151;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.noti-item__time { font-size: 0.72rem; color: #9ca3af; font-weight: 500; }

.noti-item__dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #111827;
  border: none;
  padding: 0;
  align-self: center;
}

.noti-item__actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  align-self: flex-start;
  padding-top: 2px;
}

.noti-item__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: none;
  background: transparent;
  border-radius: 6px;
  color: #9ca3af;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
  padding: 0;
  font-size: 0.8rem;
  opacity: 0;
}

.noti-item:hover .noti-item__close { opacity: 1; }
.noti-item__close:hover { background: rgba(220, 38, 38, 0.08); color: #dc2626; }

/* Dropdown enter/leave fade */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.22, 1, 0.36, 1);
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to { opacity: 0; transform: translateY(-8px) scale(0.97); }
.dropdown-fade-enter-to,
.dropdown-fade-leave-from { opacity: 1; transform: translateY(0) scale(1); }
</style>
