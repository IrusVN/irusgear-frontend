<template>
  <header>
    <!-- Main Navbar -->
    <nav class="navbar navbar-expand navbar-dark bg-dark py-2">
      <div class="container">
        <div class="d-flex align-items-center gap-3 w-100">
          <!-- Category Button -->
          <button class="btn border-0 bg-transparent text-white d-flex align-items-center justify-content-center p-2" @click="toggleCategoryMenu" style="width: 40px; height: 40px;">
            <i class="bi bi-list fs-5"></i>
          </button>

          <!-- Logo -->
          <div class="navbar-brand fw-bold text-uppercase fs-5 text-white text-decoration-none ms-2" style="cursor: default;">
            {{ $t('sidebar.brandName') }}
          </div>

          <!-- Search Bar -->
          <div class="flex-grow-1 d-none d-md-block" style="max-width: 480px;">
            <div class="input-group">
              <input 
                type="text" 
                class="form-control" 
                :placeholder="$t('navbar.searchPlaceholder')"
                v-model="searchQuery"
                @keyup.enter="handleSearch"
              />
              <button class="btn btn-light" type="button" @click="handleSearch">
                <i class="bi bi-search"></i>
              </button>
            </div>
          </div>

          <!-- Right Menu Icons -->
          <div class="d-flex align-items-center gap-3 ms-auto">
            <!-- Hotline -->
            <a href="tel:" class="text-white text-decoration-none d-flex align-items-center gap-2">
              <i class="bi bi-telephone-fill fs-5"></i>
              <div class="d-none d-lg-flex flex-column lh-sm">
                <small class="opacity-75">Hotline</small>
                <span class="fw-semibold small">696969</span>
              </div>
            </a>

            <!-- Showroom -->
            <NuxtLink to="/showroom" class="text-white text-decoration-none d-flex align-items-center gap-2">
              <i class="bi bi-geo-alt-fill fs-5"></i>
              <div class="d-none d-lg-flex flex-column lh-sm">
                <small class="opacity-75">{{ $t('navbar.system') }}</small>
                <span class="fw-semibold small">Showroom</span>
              </div>
            </NuxtLink>

            <!-- Order Tracking -->
            <NuxtLink to="/orders" class="text-white text-decoration-none d-flex align-items-center gap-2">
              <i class="bi bi-truck fs-5"></i>
              <div class="d-none d-lg-flex flex-column lh-sm">
                <small class="opacity-75">{{ $t('navbar.trackOrder') }}</small>
                <span class="fw-semibold small">{{ $t('navbar.order') }}</span>
              </div>
            </NuxtLink>

            <!-- Cart -->
            <NuxtLink to="/cart" class="text-white text-decoration-none position-relative">
              <i class="bi bi-cart3 fs-5"></i>
              <span v-if="cartCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-light text-dark">
                {{ cartCount }}
              </span>
            </NuxtLink>

            <!-- Account -->
            <NuxtLink to="/auth/login" class="text-white text-decoration-none d-flex align-items-center gap-2">
              <i class="bi bi-person-fill fs-5"></i>
              <div class="d-none d-lg-flex flex-column lh-sm">
                <small class="opacity-75">{{ $t('navbar.signIn') }}</small>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>



    <!-- Mobile Category Dropdown -->
    <div class="collapse bg-white shadow" :class="{ show: isCategoryOpen }">
      <div class="container py-3">
        <ul class="list-unstyled mb-0">
          <li v-for="(item, index) in categoryMenuItems" :key="index">
            <NuxtLink :to="item.to" class="d-flex align-items-center gap-3 py-2 px-3 text-dark text-decoration-none rounded" @click="closeCategoryMenu">
              <i :class="item.icon"></i>
              <span>{{ item.label }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const searchQuery = ref('')
const isCategoryOpen = ref(false)
const cartCount = ref(0)

const categoryMenuItems = computed(() => [
  { label: t('navbar.menu.pcGaming'), to: '/category/pc-gaming', icon: 'bi bi-pc-display' },
  { label: t('navbar.menu.hotDeal'), to: '/category/hot-deal', icon: 'bi bi-lightning-fill' },
  { label: t('navbar.menu.news'), to: '/news', icon: 'bi bi-newspaper' },
  { label: t('navbar.menu.techService'), to: '/services', icon: 'bi bi-tools' },
  { label: t('navbar.menu.tradeIn'), to: '/trade-in', icon: 'bi bi-arrow-repeat' },
  { label: t('navbar.menu.warranty'), to: '/warranty', icon: 'bi bi-shield-check' },
])

const toggleCategoryMenu = () => {
  isCategoryOpen.value = !isCategoryOpen.value
}

const closeCategoryMenu = () => {
  isCategoryOpen.value = false
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}
</script>

<style scoped>
/* Minimal custom styles - only what Bootstrap can't do */
.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.collapse.show {
  display: block;
}

/* Dropdown hover effect */
.list-unstyled a:hover {
  background: #f8f9fa;
}
</style>
