<template>
  <div ref="menuRoot" class="admin-profile-menu">
    <button class="profile-trigger" type="button" :aria-expanded="isOpen" @click="toggleMenu">
      <span class="profile-avatar">
        <span>{{ initials }}</span>
        <span class="profile-status"></span>
      </span>
    </button>

    <Transition name="profile-menu">
      <div v-if="isOpen" class="profile-dropdown admin-card-shell">
        <div class="profile-head">
          <span class="profile-avatar profile-avatar-lg">
            <span>{{ initials }}</span>
            <span class="profile-status"></span>
          </span>
          <div class="profile-copy">
            <strong>{{ displayName }}</strong>
            <span>{{ roleLabel }}</span>
          </div>
        </div>

        <div class="profile-list">
          <NuxtLink class="profile-item" to="/profile" @click="closeMenu">
            <i class="bi bi-person"></i>
            <span>Profile</span>
          </NuxtLink>
          <NuxtLink class="profile-item" to="/admin/settings" @click="closeMenu">
            <i class="bi bi-gear"></i>
            <span>Settings</span>
          </NuxtLink>
          <button class="profile-item" type="button" @click="closeMenu">
            <i class="bi bi-receipt"></i>
            <span>Billing Plan</span>
            <span class="profile-count">4</span>
          </button>
        </div>

        <div class="profile-list profile-list-bordered">
          <button class="profile-item" type="button" @click="closeMenu">
            <i class="bi bi-currency-dollar"></i>
            <span>Pricing</span>
          </button>
          <button class="profile-item" type="button" @click="closeMenu">
            <i class="bi bi-question-lg"></i>
            <span>FAQ</span>
          </button>
        </div>

        <button class="logout-button" type="button" :disabled="auth.loading" @click="handleLogout">
          <span>{{ auth.loading ? 'Logging out...' : 'Logout' }}</span>
          <i class="bi bi-box-arrow-right"></i>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
const isOpen = ref(false)
const menuRoot = ref(null)

const displayName = computed(() => {
  const user = auth.user || {}
  return user.name || user.full_name || user.email || 'Admin User'
})

const roleLabel = computed(() => {
  const user = auth.user || {}
  return user.role?.name || user.role || 'Admin'
})

const initials = computed(() => {
  const source = displayName.value || 'Admin'
  return source
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'A'
})

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

const handleDocumentClick = (event) => {
  if (!menuRoot.value || menuRoot.value.contains(event.target)) return
  closeMenu()
}

const handleLogout = async () => {
  closeMenu()
  await auth.logout()
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>

<style scoped>
.admin-profile-menu {
  position: relative;
}

.profile-trigger {
  border: 0;
  background: transparent;
  padding: 0;
  display: inline-flex;
}

.profile-avatar {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  background: linear-gradient(135deg, #8b7cf6, #f0efff);
  color: #222233;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  position: relative;
  overflow: visible;
}

.profile-avatar-lg {
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
}

.profile-status {
  position: absolute;
  width: 10px;
  height: 10px;
  right: 0;
  bottom: 1px;
  border: 2px solid #fff;
  border-radius: 999px;
  background: var(--admin-success);
}

.profile-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 276px;
  padding: 0;
  box-shadow: var(--admin-shadow);
  z-index: 1050;
  transform-origin: top right;
  overflow: hidden;
}

.profile-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid var(--admin-border);
}

.profile-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  line-height: 1.35;
}

.profile-copy strong {
  color: var(--admin-text);
  font-size: 0.94rem;
}

.profile-copy span {
  color: var(--admin-subtle);
  font-size: 0.82rem;
}

.profile-list {
  padding: 8px;
}

.profile-list-bordered {
  border-top: 1px solid var(--admin-border);
}

.profile-item {
  width: 100%;
  border: 0;
  background: transparent;
  color: var(--admin-text);
  text-decoration: none;
  border-radius: 7px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 13px;
  font-size: 0.94rem;
  transition: background 0.18s ease, color 0.18s ease;
}

.profile-item:hover {
  background: var(--admin-surface-soft);
}

.profile-item i {
  width: 18px;
  text-align: center;
  color: var(--admin-muted);
}

.profile-count {
  margin-left: auto;
  min-width: 24px;
  height: 24px;
  border-radius: 6px;
  background: var(--admin-danger);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  font-weight: 700;
}

.logout-button {
  width: calc(100% - 16px);
  margin: 8px;
  border: 0;
  border-radius: 7px;
  background: var(--admin-danger);
  color: #fff;
  padding: 10px 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 3px 8px rgba(255, 76, 81, 0.28);
}

.logout-button:disabled {
  opacity: 0.7;
}

.profile-menu-enter-active,
.profile-menu-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.profile-menu-enter-from,
.profile-menu-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>
