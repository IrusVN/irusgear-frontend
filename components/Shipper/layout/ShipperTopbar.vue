<template>
  <header class="admin-topbar admin-card-shell">
    <div class="topbar-left">
      <button class="admin-icon-button hamburger-btn" type="button"
        :aria-label="$t('shipper.layout.openMenu')" @click="$emit('toggle-mobile')">
        <i class="bi bi-list fs-4"></i>
      </button>

      <label class="topbar-search">
        <i class="bi bi-search"></i>
        <input v-model="searchQuery" type="search"
          :placeholder="$t('shipper.layout.searchPlaceholder')" />
        <kbd>Ctrl K</kbd>
      </label>
    </div>

    <div class="topbar-actions">
      <LanguageSwitcher class="admin-lang-switcher hide-mobile" />

      <button class="admin-icon-button hide-mobile" type="button"
        :aria-label="$t('shipper.layout.notifications')">
        <i class="bi bi-bell"></i>
      </button>

      <div class="profile-pill">
        <span class="profile-avatar">{{ initials }}</span>
        <span class="profile-name hide-mobile">{{ displayName }}</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue'
import LanguageSwitcher from '@/components/Sidebar/LanguageSwitcher.vue'
import { useAuthStore } from '@/stores/authStore'
import { useI18n } from '#imports'

defineEmits(['toggle-mobile'])

const { t } = useI18n()
const auth = useAuthStore()
const searchQuery = ref('')

const displayName = computed(() => {
  const u = auth.user || {}
  return u.name || u.full_name || u.email || t('shipper.profile.defaultName')
})

const initials = computed(() => {
  const source = displayName.value || 'Shipper'
  return (
    source.split(' ').filter(Boolean).slice(0, 2).map((p) => p.charAt(0).toUpperCase()).join('') || 'S'
  )
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

.hamburger-btn { display: none; }

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

.topbar-search i { color: var(--admin-text); font-size: 1.1rem; }

.topbar-search input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--admin-text);
}

.topbar-search input::placeholder { color: var(--admin-subtle); }

.topbar-search kbd {
  border: 1px solid var(--admin-border);
  border-radius: 6px;
  background: #fff;
  color: var(--admin-subtle);
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 6px;
  white-space: nowrap;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.profile-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px 4px 4px;
  border-radius: 999px;
  background: var(--admin-surface-soft);
  color: var(--admin-text);
  text-decoration: none;
  font-size: 0.86rem;
  font-weight: 600;
  transition: background 0.15s ease;
}

.profile-pill:hover { background: var(--admin-primary-soft); }

.profile-avatar {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background: linear-gradient(135deg, #050505, #2b2b2b);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  font-weight: 700;
}

@media screen and (max-width: 991.98px) {
  .hamburger-btn { display: inline-flex; }
}

@media screen and (max-width: 767.98px) {
  .admin-topbar { gap: 8px; padding: 0 8px; }
  .topbar-search { min-width: 0; }
  .topbar-search kbd { display: none; }
  .hide-mobile { display: none; }
}

.admin-lang-switcher :deep(.lang-trigger) {
  display: inline-flex !important;
}
</style>
