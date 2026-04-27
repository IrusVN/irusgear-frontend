<template>
  <div class="lang-switcher dropdown">
    <button
      type="button"
      class="btn header-icon-btn lang-trigger d-none d-xxl-inline-flex"
      :aria-label="$t('common.language')"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <i class="bi bi-globe2"></i>
      <span class="lang-badge">{{ currentLocaleCode }}</span>
    </button>

    <ul class="dropdown-menu dropdown-menu-end glass-dropdown lang-dropdown border-0 shadow-sm rounded-4 p-2">
      <li v-for="loc in localeItems" :key="loc.code">
        <button
          class="dropdown-item lang-item rounded-3 py-2 px-3"
          :class="{ 'lang-item--active': loc.code === currentLocale }"
          type="button"
          @click="switchToLocale(loc.code)"
        >
          <img
            :src="`https://flagcdn.com/w20/${loc.flagCode}.png`"
            :srcset="`https://flagcdn.com/w40/${loc.flagCode}.png 2x`"
            :alt="loc.name"
            class="lang-flag"
            width="20"
            height="14"
            loading="lazy"
          >
          <span class="lang-name">{{ loc.name }}</span>
          <i v-if="loc.code === currentLocale" class="bi bi-check-lg ms-auto"></i>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n, navigateTo } from '#imports'

const { locale } = useI18n()

const LOCALE_META = {
  vi: { name: 'Tiếng Việt', flagCode: 'vn' },
  en: { name: 'English', flagCode: 'gb' },
}

const currentLocale = computed(() => locale.value)

const currentLocaleCode = computed(() => currentLocale.value === 'vi' ? 'VI' : 'EN')

const localeItems = computed(() =>
  Object.entries(LOCALE_META).map(([code, meta]) => ({ code, ...meta }))
)

const switchToLocale = async (targetLocale) => {
  const currentPath = window.location.pathname
  const pathWithoutLocale = currentPath.replace(/^\/(vi|en)/, '') || '/'
  const targetPath = targetLocale === 'en'
    ? pathWithoutLocale
    : `/${targetLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`
  await navigateTo(targetPath)
}
</script>

<style scoped>
.lang-switcher {
  position: relative;
}

.lang-trigger {
  gap: 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.lang-badge {
  font-size: 0.65rem;
  font-weight: 700;
  line-height: 1;
  padding: 0.15rem 0.35rem;
  border-radius: 0.4rem;
  background: rgba(15, 23, 42, 0.08);
  color: #5f6472;
  letter-spacing: 0.02em;
  min-width: 1.4rem;
  text-align: center;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.lang-trigger:hover .lang-badge {
  background: rgba(15, 23, 42, 0.14);
  color: #16181d;
}

.lang-dropdown {
  min-width: 168px;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.18s ease, visibility 0.18s ease;
  top: calc(100% + 6px);
}

.glass-dropdown.lang-dropdown.show,
.lang-dropdown.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.lang-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
  transition: background-color 0.15s ease, color 0.15s ease;
  cursor: pointer;
  border: 0;
  background: transparent;
  width: 100%;
  text-align: left;
}

.lang-item:hover {
  background: rgba(15, 23, 42, 0.05);
  color: #16181d;
}

.lang-item--active {
  font-weight: 600;
  color: #111827;
}

.lang-item--active .bi-check-lg {
  font-size: 0.9rem;
  color: #111827;
}

.lang-flag {
  width: 20px;
  height: 14px;
  object-fit: cover;
  border-radius: 2px;
  flex-shrink: 0;
  vertical-align: middle;
}

.lang-name {
  flex: 1;
}
</style>
