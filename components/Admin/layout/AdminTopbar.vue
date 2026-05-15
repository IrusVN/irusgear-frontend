<template>
  <header class="admin-topbar admin-card-shell">
    <div class="topbar-left">
      <button class="admin-icon-button d-lg-none" type="button" aria-label="Open menu" @click="$emit('toggle-mobile')">
        <i class="bi bi-list fs-4"></i>
      </button>

      <label class="topbar-search">
        <i class="bi bi-search"></i>
        <input v-model="searchQuery" type="search" placeholder="Search" />
        <kbd>Ctrl K</kbd>
      </label>
    </div>

    <div class="topbar-actions">
      <button class="admin-icon-button" type="button" aria-label="Language">
        <i class="bi bi-translate"></i>
      </button>
      <button class="admin-icon-button" type="button" aria-label="Toggle theme">
        <i class="bi bi-sun"></i>
      </button>
      <button class="admin-icon-button" type="button" aria-label="Apps">
        <i class="bi bi-grid-3x3-gap"></i>
      </button>
      <button class="admin-icon-button notification-button" type="button" aria-label="Notifications">
        <i class="bi bi-bell"></i>
        <span></span>
      </button>
      <AdminProfileMenu />
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import AdminProfileMenu from './AdminProfileMenu.vue'

defineEmits(['toggle-mobile'])

const searchQuery = ref('')
</script>

<style scoped>
.admin-topbar {
  min-height: var(--admin-topbar-height);
  padding: 0 12px 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.topbar-left {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
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

@media (max-width: 575.98px) {
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

  .topbar-actions .admin-icon-button:not(.notification-button) {
    display: none;
  }
}
</style>
