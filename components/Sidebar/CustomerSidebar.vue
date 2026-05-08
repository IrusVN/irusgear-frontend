<template>
  <div class="position-relative">
    <div ref="customerSidebarWrapRef" class="fixed-top w-100 px-2 px-lg-3 pt-1 pt-lg-1 customer-sidebar-wrap">
      <nav class="customer-shell container-xxl w-100 px-0">
        <div class="d-flex flex-column">
          <div class="d-flex align-items-center gap-2 gap-lg-3 px-3 px-lg-4 py-3 flex-nowrap border-bottom border-light-subtle">
            <NuxtLink
              :to="localePath('/')"
              class="d-flex align-items-center flex-shrink-0 text-decoration-none"
            >
              <img
                src="@/public/image/logo-irusgear-black.png"
                alt="IrusGear"
                class="img-fluid navbar-logo"
              >
            </NuxtLink>

            <button
              type="button"
              class="btn header-search d-none d-md-flex align-items-center gap-2 gap-lg-3 flex-grow-1 text-start px-3 px-lg-4 py-2"
              :title="$t('sidebar.searchPlaceholder')"
            >
              <i class="bi bi-search fs-6 text-secondary"></i>
              <span class="search-text small text-secondary-emphasis text-truncate">
                {{ $t('home.searchProducts') }}
              </span>
              <span class="search-shortcut d-none d-xl-inline-flex align-items-center justify-content-center">
                {{ $t('home.searchShortcut') }}
              </span>
            </button>

            <div class="d-flex align-items-center gap-1 gap-xl-2 ms-auto flex-shrink-0 flex-nowrap">
              <NuxtLink
                v-for="link in utilityLinks"
                :key="link.label"
                :to="link.to"
                class="btn header-text-btn d-none d-xxl-inline-flex align-items-center gap-2 px-3 py-2 border-0"
              >
                <i :class="link.icon"></i>
                <span>{{ link.label }}</span>
              </NuxtLink>

              <NuxtLink
                :to="ctaLink.to"
                class="btn btn-dark rounded-pill px-3 px-xl-4 py-2 fw-semibold d-none d-lg-inline-flex align-items-center gap-2 shadow-sm"
              >
                <i :class="ctaLink.icon"></i>
                <span>{{ ctaLink.label }}</span>
              </NuxtLink>

              <button type="button" class="btn header-icon-btn d-md-none" :aria-label="$t('sidebar.searchPlaceholder')">
                <i class="bi bi-search"></i>
              </button>

              <NuxtLink
                :to="localePath('/cart')"
                class="btn header-icon-btn position-relative"
                :aria-label="$t('cart.cart')"
              >
                <i class="bi bi-cart3"></i>
                <span
                  v-if="itemCount > 0"
                  class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white"
                >
                  {{ itemCount }}
                </span>
              </NuxtLink>

              <button type="button" class="btn header-icon-btn d-none d-xl-inline-flex" :aria-label="$t('common.notification')">
                <i class="bi bi-bell"></i>
              </button>

              <LanguageSwitcher />

              <div class="vr d-none d-lg-block mx-1 opacity-25"></div>

              <div v-if="!user" class="d-flex align-items-center gap-2 flex-nowrap">
                <NuxtLink
                  :to="localePath('/auth/login')"
                  class="btn header-text-btn d-inline-flex align-items-center gap-2 px-2 px-lg-3 py-2 border-0"
                >
                  <i class="bi bi-box-arrow-in-right"></i>
                  <span class="d-none d-sm-inline">{{ $t('common.login') }}</span>
                </NuxtLink>

                <NuxtLink
                  :to="localePath('/auth/register')"
                  class="btn btn-dark rounded-pill px-3 py-2 fw-semibold d-none d-sm-inline-flex"
                >
                  {{ $t('common.register') }}
                </NuxtLink>
              </div>

              <div v-else class="dropdown">
                <button
                  type="button"
                  class="btn customer-user-trigger d-flex align-items-center gap-2 rounded-pill border-0 ps-2 pe-3 py-1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    class="rounded-circle border"
                    width="36"
                    height="36"
                    alt="Avatar"
                    :src="avatarUrl"
                  >

                  <div class="d-none d-xl-block text-start lh-sm">
                    <div class="fw-semibold text-dark small">{{ fullName }}</div>
                    <small class="text-secondary">{{ $t(userRoleKey) }}</small>
                  </div>

                  <i class="bi bi-chevron-down small text-secondary"></i>
                </button>

                <ul class="dropdown-menu dropdown-menu-end glass-dropdown border-0 shadow-sm mt-3 rounded-4 p-2">
                  <li>
                    <NuxtLink :to="localePath('/profile')" class="dropdown-item rounded-3 py-2">
                      <i class="bi bi-person me-2"></i>{{ $t('common.profile') }}
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink :to="localePath('/orders')" class="dropdown-item rounded-3 py-2">
                      <i class="bi bi-box-seam me-2"></i>{{ $t('common.orders') }}
                    </NuxtLink>
                  </li>
                  <li><hr class="dropdown-divider opacity-10 my-1"></li>
                  <li>
                    <button class="dropdown-item rounded-3 py-2 text-danger" @click="auth.logout">
                      <i class="bi bi-box-arrow-right me-2"></i>{{ $t('common.logout') }}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div
            class="d-none d-lg-flex align-items-center justify-content-between gap-3 px-3 px-xl-4 py-2 header-secondary-nav"
            :class="{ 'is-hidden': isSecondaryNavHidden }"
          >
            <div class="d-flex align-items-center gap-1 gap-xl-2 flex-nowrap">
              <NuxtLink
                v-for="item in primaryNavItems"
                :key="item.label"
                :to="item.to"
                class="btn header-nav-link d-inline-flex align-items-center gap-2 px-3 py-2 border-0"
              >
                <i :class="item.icon"></i>
                <span>{{ item.label }}</span>
              </NuxtLink>

              <div class="header-products">
                <button
                  ref="productsButtonRef"
                  type="button"
                  class="btn header-nav-link d-inline-flex align-items-center gap-2 px-3 py-2 border-0"
                  :class="{ 'is-open': isProductsMenuOpen }"
                  :aria-expanded="isProductsMenuOpen ? 'true' : 'false'"
                  aria-haspopup="true"
                  @click="handleProductsClick"
                >
                  <i class="bi bi-grid"></i>
                  <span>{{ $t('sidebar.menu.products') }}</span>
                  <i class="bi bi-chevron-down small header-nav-link-chevron"></i>
                </button>
              </div>
            </div>

            <div class="d-flex align-items-center gap-2 flex-nowrap">
              <div class="vr opacity-25 mx-1"></div>

              <div class="d-flex align-items-center gap-1 px-2 py-1 rounded-pill featured-nav">
                <span class="featured-nav-label d-none d-xl-inline px-2">{{ $t('home.category') }}</span>

                <NuxtLink
                  v-for="item in featuredNavItems"
                  :key="item.label"
                  :to="item.to"
                  :class="[
                    'btn featured-nav-link d-inline-flex align-items-center gap-2 rounded-pill border-0 px-3 py-2',
                    { 'featured-nav-link--active': isFeaturedNavItemActive(item) },
                  ]"
                  :aria-current="isFeaturedNavItemActive(item) ? 'page' : undefined"
                >
                  <i :class="item.icon"></i>
                  <span>{{ item.label }}</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="!isHomeRoute && isHeaderCategoryMenuOpen"
          ref="productsDropdownRef"
          class="header-mega-menu"
        >
          <CategoryMegaMenu />
        </div>

      </nav>
    </div>

    <!-- Mobile Bottom Navigation -->
    <div class="mobile-bottom-nav d-md-none">
      <div class="mobile-capsule-nav">
        <NuxtLink
          to="/"
          class="mobile-nav-item"
          :class="{ active: isMobileNavActive('/') }"
        >
          <i class="bi" :class="isMobileNavActive('/') ? 'bi-house-door-fill' : 'bi-house-door'"></i>
          <span>{{ $t('home.home') }}</span>
        </NuxtLink>

        <button type="button" class="mobile-nav-item" :aria-label="$t('sidebar.searchPlaceholder')">
          <i class="bi bi-search"></i>
          <span>{{ $t('sidebar.search') }}</span>
        </button>

        <NuxtLink
          to="/wishlist"
          class="mobile-nav-item position-relative"
          :class="{ active: isMobileNavActive('/wishlist') }"
          :aria-label="$t('common.wishlist')"
        >
          <i class="bi" :class="isMobileNavActive('/wishlist') ? 'bi-heart-fill' : 'bi-heart'"></i>
          <span>{{ $t('common.wishlist') }}</span>
          <span
            v-if="wishlistCount > 0"
            class="mobile-nav-badge"
          >{{ wishlistCount }}</span>
        </NuxtLink>

        <NuxtLink
          v-if="user"
          to="/profile"
          class="mobile-nav-item"
          :class="{ active: isMobileNavActive('/profile') }"
          :aria-label="$t('common.profile')"
        >
          <img
            class="mobile-nav-avatar"
            :src="avatarUrl"
            :alt="fullName"
          >
          <span>{{ $t('common.profile') }}</span>
        </NuxtLink>

        <NuxtLink
          v-else
          to="/auth/login"
          class="mobile-nav-item"
          :class="{ active: isMobileNavActive('/auth/login') }"
          :aria-label="$t('common.login')"
        >
          <i class="bi bi-person"></i>
          <span>{{ $t('common.login') }}</span>
        </NuxtLink>
      </div>

      <!-- FAB + nút mở capsule dọc -->
      <div class="mobile-fab-wrapper">
        <!-- Capsule dọc chứa Cart + Language -->
        <Transition name="capsule-up">
          <div v-if="isMobileFabOpen" class="mobile-vertical-capsule mb-1">
            <NuxtLink
              to="/cart"
              class="mobile-fab-item"
              :aria-label="$t('cart.cart')"
              @click="isMobileFabOpen = false"
            >
              <i class="bi bi-cart3"></i>
              <span class="mobile-fab-tooltip">{{ $t('cart.cart') }}</span>
              <span
                v-if="itemCount > 0"
                class="mobile-fab-badge"
              >{{ itemCount }}</span>
            </NuxtLink>

            <button
              type="button"
              class="mobile-fab-item"
              :aria-label="$t('common.language')"
              @click="toggleLanguage(); isMobileFabOpen = false"
            >
              <i class="bi bi-globe-americas"></i>
              <span class="mobile-fab-tooltip">{{ currentLangLabel }}</span>
            </button>
          </div>
        </Transition>

        <!-- Nút FAB + -->
        <button
          type="button"
          class="mobile-fab-btn"
          :class="{ 'is-open': isMobileFabOpen }"
          aria-label="Mở menu"
          :aria-expanded="isMobileFabOpen ? 'true' : 'false'"
          @click="isMobileFabOpen = !isMobileFabOpen"
        >
          <i class="bi" :class="isMobileFabOpen ? 'bi-x' : 'bi-plus'"></i>
        </button>
      </div>
    </div>
  </div></template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useLocalePath, useRoute, useI18n, navigateTo } from '#imports'
import CategoryMegaMenu from '@/components/Home/CategoryMegaMenu.vue'
import LanguageSwitcher from '@/components/Sidebar/LanguageSwitcher.vue'
import { useHomeStore } from '@/stores/homeStore'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import { getUserRoleKey } from '@/utils/roleHelper'

const auth = useAuthStore()
const cartStore = useCartStore()
const homeStore = useHomeStore()
const wishlistStore = useWishlistStore()
const { user } = storeToRefs(auth)
const { itemCount } = storeToRefs(cartStore)
const { itemCount: wishlistCount } = storeToRefs(wishlistStore)
const { heroMegaMenuOpen } = storeToRefs(homeStore)
const localePath = useLocalePath()
const route = useRoute()
const { t, locale } = useI18n()
const customerSidebarWrapRef = ref(null)
const productsButtonRef = ref(null)
const productsDropdownRef = ref(null)
const isHeaderCategoryMenuOpen = ref(false)
const isSecondaryNavHidden = ref(false)
const isMobileFabOpen = ref(false)
let customerSidebarResizeObserver = null
let customerSidebarOffsetFrame = null

const normalizePath = (value) => String(value || '').replace(/\/+$/, '') || '/'
const homePath = computed(() => localePath('/'))
const productsPath = computed(() => localePath('/products'))
const isHomeRoute = computed(() => normalizePath(route.path) === normalizePath(homePath.value))
const isProductsRoute = computed(() => normalizePath(route.path) === normalizePath(productsPath.value))
const isProductsMenuOpen = computed(() =>
  isHomeRoute.value ? heroMegaMenuOpen.value : isHeaderCategoryMenuOpen.value
)
const activeFeaturedCategory = computed(() => {
  const value = route.query?.category
  if (Array.isArray(value)) return String(value[0] || '').trim()
  return String(value || '').trim()
})

const userRoleKey = computed(() => (user.value ? getUserRoleKey(user.value.role_id) : ''))

const fullName = computed(() => {
  if (!user.value) return ''
  return `${user.value.first_name || ''} ${user.value.last_name || ''}`.trim()
})

const avatarUrl = computed(() =>
  user.value
    ? `https://ui-avatars.com/api/?name=${user.value.first_name}+${user.value.last_name}&background=000&color=fff`
    : ''
)

const closeHeaderCategoryMenu = () => {
  isHeaderCategoryMenuOpen.value = false
}

const syncCustomerSidebarOffset = () => {
  if (typeof document === 'undefined') return

  const sidebarWrapEl = customerSidebarWrapRef.value
  const nextOffset = sidebarWrapEl instanceof HTMLElement
    ? Math.ceil(sidebarWrapEl.getBoundingClientRect().bottom + 2)
    : 0

  document.documentElement.style.setProperty('--customer-sidebar-offset', `${nextOffset}px`)

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('customer-sidebar:offset-change', {
        detail: { offset: nextOffset },
      }),
    )
  }
}

const scheduleCustomerSidebarOffsetSync = () => {
  if (typeof window === 'undefined') return
  if (customerSidebarOffsetFrame !== null) return

  customerSidebarOffsetFrame = window.requestAnimationFrame(() => {
    customerSidebarOffsetFrame = null
    syncCustomerSidebarOffset()
  })
}

const setSecondaryNavHidden = (value) => {
  const nextValue = Boolean(value)
  if (isSecondaryNavHidden.value === nextValue) return

  isSecondaryNavHidden.value = nextValue

  if (nextValue) {
    closeHeaderCategoryMenu()
    homeStore.closeHeroMegaMenu()
  }
}

const handleProductsClick = async () => {
  await homeStore.fetchMegaMenuLeaves().catch(() => {})

  if (!isHomeRoute.value) {
    if (isHeaderCategoryMenuOpen.value) {
      closeHeaderCategoryMenu()
      return
    }

    homeStore.closeHeroMegaMenu()
    isHeaderCategoryMenuOpen.value = true
    return
  }

  closeHeaderCategoryMenu()

  if (isProductsMenuOpen.value) {
    homeStore.closeHeroMegaMenu()
    return
  }

  homeStore.openHeroMegaMenu()

  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleDocumentPointerDown = (event) => {
  const target = event.target
  if (!(target instanceof Node)) return

  // Đóng FAB khi click bên ngoài
  if (isMobileFabOpen.value) {
    const fabWrapper = document.querySelector('.mobile-fab-wrapper')
    if (fabWrapper && !fabWrapper.contains(target)) {
      isMobileFabOpen.value = false
    }
  }

  if (!isHeaderCategoryMenuOpen.value) return

  const clickedButton = productsButtonRef.value?.contains(target)
  const clickedDropdown = productsDropdownRef.value?.contains(target)

  if (clickedButton || clickedDropdown) return
  closeHeaderCategoryMenu()
}

const getSecondaryNavHideThreshold = () => {
  if (typeof window === 'undefined') return 0
  return window.innerHeight * 0.25
}

const syncSecondaryNavVisibility = () => {
  if (typeof window === 'undefined') return

  const hideThreshold = getSecondaryNavHideThreshold()

  if (window.scrollY <= hideThreshold) {
    setSecondaryNavHidden(false)
    return
  }

  setSecondaryNavHidden(true)
}

watch(
  () => route.fullPath,
  async () => {
    isMobileFabOpen.value = false
    closeHeaderCategoryMenu()
    setSecondaryNavHidden(false)
    await nextTick()
    syncSecondaryNavVisibility()
    scheduleCustomerSidebarOffsetSync()
  }
)

onMounted(() => {
  if (typeof document === 'undefined' || typeof window === 'undefined') return
  document.addEventListener('pointerdown', handleDocumentPointerDown)
  window.addEventListener('scroll', syncSecondaryNavVisibility, { passive: true })
  window.addEventListener('resize', syncSecondaryNavVisibility, { passive: true })

  if (typeof ResizeObserver !== 'undefined' && customerSidebarWrapRef.value instanceof HTMLElement) {
    customerSidebarResizeObserver = new ResizeObserver(() => {
      scheduleCustomerSidebarOffsetSync()
    })
    customerSidebarResizeObserver.observe(customerSidebarWrapRef.value)
  }

  nextTick(() => {
    syncSecondaryNavVisibility()
    syncCustomerSidebarOffset()
  })
})

onBeforeUnmount(() => {
  if (typeof document === 'undefined' || typeof window === 'undefined') return
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
  window.removeEventListener('scroll', syncSecondaryNavVisibility)
  window.removeEventListener('resize', syncSecondaryNavVisibility)

  if (customerSidebarResizeObserver) {
    customerSidebarResizeObserver.disconnect()
    customerSidebarResizeObserver = null
  }

  if (customerSidebarOffsetFrame !== null) {
    window.cancelAnimationFrame(customerSidebarOffsetFrame)
    customerSidebarOffsetFrame = null
  }
})

const utilityLinks = computed(() => [
  {
    label: t('home.promotion'),
    to: localePath('/khuyen-mai'),
    icon: 'bi bi-tags',
  },
])

const ctaLink = computed(() => ({
  label: t('home.dealHot'),
  to: localePath('/khuyen-mai'),
  icon: 'bi bi-stars',
}))

const primaryNavItems = computed(() => [
  {
    label: t('home.home'),
    to: localePath('/'),
    icon: 'bi bi-house-door',
  },
  {
    label: t('home.news'),
    to: localePath('/tin-tuc'),
    icon: 'bi bi-newspaper',
  },
  {
    label: t('home.promotion'),
    to: localePath('/khuyen-mai'),
    icon: 'bi bi-megaphone',
  },
  {
    label: t('home.contact'),
    to: localePath('/lien-he'),
    icon: 'bi bi-headset',
  },
])

const buildProductsCategoryLink = (category) => {
  const query = new URLSearchParams({
    category,
    sort: 'newest',
    limit: '20',
  })

  return `${localePath('/products')}?${query.toString()}`
}

const isFeaturedNavItemActive = (item) => {
  if (!isProductsRoute.value) return false
  return item?.category === activeFeaturedCategory.value
}

const isMobileNavActive = (path) => {
  const normalizedCurrent = normalizePath(route.path)
  const normalizedTarget = localePath(path)
  return normalizedCurrent === normalizePath(normalizedTarget)
}

const currentLangLabel = computed(() => locale.value === 'vi' ? 'Tiếng Việt' : 'English')

const toggleLanguage = async () => {
  const currentPath = window.location.pathname
  const pathWithoutLocale = currentPath.replace(/^\/(vi|en)/, '') || '/'
  const targetLocale = locale.value === 'vi' ? 'en' : 'vi'
  const targetPath = targetLocale === 'en'
    ? `/en${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`
    : pathWithoutLocale
  await navigateTo(targetPath)
}

const featuredNavItems = computed(() => [
  {
    label: t('footerNav.laptopPc'),
    category: 'laptop',
    to: buildProductsCategoryLink('laptop'),
    icon: 'bi bi-laptop',
  },
  {
    label: t('footerNav.audioDevice'),
    category: 'am-thanh',
    to: buildProductsCategoryLink('am-thanh'),
    icon: 'bi bi-headphones',
  },
  {
    label: t('home.catWatchCamera'),
    category: 'dong-ho',
    to: buildProductsCategoryLink('dong-ho'),
    icon: 'bi bi-smartwatch',
  },
  {
    label: t('cart.accessory'),
    category: 'phu-kien',
    to: buildProductsCategoryLink('phu-kien'),
    icon: 'bi bi-mouse2',
  },
])
</script>

<style scoped>
.customer-sidebar-wrap {
  z-index: 1040;
}

.customer-shell {
  position: relative;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 1.75rem;
  background: rgba(255, 255, 255, 0.985);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.09);
}

.navbar-logo {
  width: auto;
  height: 32px;
}

.header-search,
.header-text-btn,
.header-icon-btn,
.header-nav-link,
.featured-nav-link,
.customer-user-trigger {
  color: #5f6472;
  white-space: nowrap;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.header-search {
  min-width: 0;
  min-height: 46px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 1rem;
  background: #f6f7f9;
}

.search-text {
  min-width: 0;
  flex: 1 1 auto;
}

.header-search:hover,
.header-text-btn:hover,
.header-icon-btn:hover,
.header-nav-link:hover,
.featured-nav-link:hover,
.customer-user-trigger:hover {
  color: #16181d;
  background: rgba(15, 23, 42, 0.05);
}

.featured-nav-link--active,
.featured-nav-link--active:hover {
  color: #111827;
  background: #ffffff;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.1);
}

.search-shortcut {
  min-width: 58px;
  padding: 0.25rem 0.55rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 0.7rem;
  background: #fff;
  color: #8a8f9c;
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1;
}

.header-text-btn,
.header-nav-link,
.featured-nav-link {
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
}

.header-nav-link-chevron {
  transition: transform 0.2s ease;
}

.header-nav-link.is-open .header-nav-link-chevron {
  transform: rotate(180deg);
}

.header-secondary-nav {
  overflow: hidden;
  transform: translateY(0);
  opacity: 1;
  max-height: 96px;
  transition:
    max-height 0.32s ease,
    opacity 0.24s ease,
    transform 0.32s ease,
    padding-top 0.32s ease,
    padding-bottom 0.32s ease;
}

.header-secondary-nav.is-hidden {
  opacity: 0;
  transform: translateY(-18px);
  max-height: 0;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  pointer-events: none;
}

.header-products {
  position: relative;
}

.header-mega-menu {
  position: absolute;
  top: calc(100% + 12px);
  left: clamp(12px, 2vw, 28px);
  z-index: 1060;
}

.header-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  padding: 0;
  border: 0;
  border-radius: 0.9rem;
  background: transparent;
  font-size: 1rem;
  line-height: 1;
  vertical-align: middle;
}

.header-icon-btn > i {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.header-icon-btn .badge {
  min-width: 1.35rem;
  height: 1.35rem;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  line-height: 1;
}

.customer-user-trigger {
  background: rgba(15, 23, 42, 0.04);
}

.glass-dropdown {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  transform-origin: top right;
}

.glass-dropdown.dropdown-menu.show {
  animation: customerDropdownSlideDown 0.22s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, translate;
}

.featured-nav {
  border: 1px solid rgba(229, 189, 46, 0.35);
  background: #fff8df;
}

.featured-nav-label {
  color: #d08a00;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.dropdown-item:active,
.dropdown-item.active,
.dropdown-item.router-link-active {
  color: #fff !important;
  background-color: #111 !important;
}

@keyframes customerDropdownSlideDown {
  from {
    opacity: 0;
    translate: 0 -12px;
  }

  to {
    opacity: 1;
    translate: 0 0;
  }
}

@media (max-width: 1399.98px) {
  .header-mega-menu {
    left: 16px;
  }

  .featured-nav-link {
    padding-right: 0.8rem !important;
    padding-left: 0.8rem !important;
  }
}

@media (max-width: 991.98px) {
  .customer-shell {
    border-radius: 1.25rem;
  }
}

/* ── Mobile Bottom Capsule Navigation ── */
.mobile-bottom-nav {
  display: none;
  position: fixed;
  bottom: 16px;
  left: 20px;
  right: 6px;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  max-width: 100%;
  box-sizing: border-box;
}

@media (max-width: 767.98px) {
  .mobile-bottom-nav {
    display: flex !important;
  }

  body {
    padding-bottom: 88px !important;
  }
}

/* Capsule nav chứa 4 icon items */
.mobile-capsule-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  overflow: hidden;
  max-width: calc(100% - 84px);
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.985);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 50px;
  box-shadow:
    8px 8px 20px rgba(15, 23, 42, 0.1),
    -4px -4px 12px rgba(255, 255, 255, 0.9),
    inset 0 1px 1px rgba(255, 255, 255, 1);
}

.mobile-nav-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 6px 4px;
  border-radius: 36px;
  background: transparent;
  color: #8e8e93;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.28s cubic-bezier(0.22, 1, 0.36, 1);
  border: none;
  -webkit-tap-highlight-color: transparent;
  flex: 1;
  min-width: 0;
}

.mobile-nav-item:active {
  transform: scale(0.94);
}

.mobile-nav-item i {
  font-size: 20px;
  line-height: 1;
  transition: color 0.28s ease;
  flex-shrink: 0;
}

.mobile-nav-item span {
  font-size: 9px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  transition: color 0.28s ease;
}

.mobile-nav-item.active {
  background: #eceef1;
  color: #16181d;
  box-shadow:
    4px 4px 10px rgba(15, 23, 42, 0.08),
    -2px -2px 6px rgba(255, 255, 255, 0.9);
}

.mobile-nav-item.active i,
.mobile-nav-item.active span {
  color: #16181d;
}

.mobile-nav-item:not(.active):hover i,
.mobile-nav-item:not(.active):hover span {
  color: #5f6472;
}

.mobile-nav-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid rgba(15, 23, 42, 0.15);
  flex-shrink: 0;
}

.mobile-nav-badge {
  position: absolute;
  top: 2px;
  right: 4px;
  min-width: 14px;
  height: 14px;
  padding: 0 3px;
  background: #ff3b30;
  color: #fff;
  font-size: 8px;
  font-weight: 700;
  line-height: 14px;
  text-align: center;
  border-radius: 10px;
  border: 1.5px solid #ffffff;
}

/* Ẩn text label trên màn hình cực nhỏ */
@media (max-width: 360px) {
  .mobile-nav-item span {
    display: none;
  }

  .mobile-capsule-nav {
    padding: 6px 8px;
  }
}

/* Nút Cart nổi bên ngoài capsule */
.mobile-cart-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.985);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  color: #16181d;
  text-decoration: none;
  cursor: pointer;
  border: none;
  flex-shrink: 0;
  box-shadow: 8px 8px 20px rgba(15, 23, 42, 0.1), -4px -4px 12px rgba(255, 255, 255, 0.9), inset 0 1px 1px rgba(255, 255, 255, 1);
  transition: all 0.28s cubic-bezier(0.22, 1, 0.36, 1);
  -webkit-tap-highlight-color: transparent;
}

.mobile-cart-btn:active {
  transform: scale(0.92);
  box-shadow: 4px 4px 10px rgba(15, 23, 42, 0.08), -2px -2px 6px rgba(255, 255, 255, 0.9), inset 0 1px 1px rgba(255, 255, 255, 1);
}

.mobile-cart-btn i {
  font-size: 22px;
  line-height: 1;
}

.mobile-cart-badge {
  position: absolute;
  top: 2px;
  right: -2px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background: #ff3b30;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  line-height: 18px;
  text-align: center;
  border-radius: 10px;
  border: 2px solid #ffffff;
}

/* ── FAB + Capsule dọc ── */
.mobile-fab-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  margin-right: 16px;
}

.mobile-vertical-capsule {
  position: absolute;
  bottom: 65px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.985);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 28px;
  box-shadow: 8px 8px 20px rgba(15, 23, 42, 0.1), -4px -4px 12px rgba(255, 255, 255, 0.9), inset 0 1px 1px rgba(255, 255, 255, 1);
}

.mobile-fab-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: transparent;
  color: #16181d;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: all 0.22s ease;
  -webkit-tap-highlight-color: transparent;
}

.mobile-fab-item:active {
  transform: scale(0.9);
  background: #eceef1;
}

.mobile-fab-item i {
  font-size: 20px;
  line-height: 1;
}

.mobile-fab-tooltip {
  position: absolute;
  right: 100%;
  margin-right: 10px;
  white-space: nowrap;
  padding: 4px 10px;
  background: #16181d;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  border-radius: 8px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.mobile-fab-tooltip::after {
  content: '';
  position: absolute;
  right: -5px;
  top: 50%;
  transform: translateY(-50%);
  border: 5px solid transparent;
  border-left-color: #16181d;
}

.mobile-fab-item:hover .mobile-fab-tooltip,
.mobile-fab-item:active .mobile-fab-tooltip {
  opacity: 1;
}

.mobile-fab-badge {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: #ff3b30;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  line-height: 16px;
  text-align: center;
  border-radius: 10px;
  border: 1.5px solid #ffffff;
}

.mobile-fab-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.985);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  color: #16181d;
  cursor: pointer;
  border: none;
  box-shadow: 8px 8px 20px rgba(15, 23, 42, 0.1), -4px -4px 12px rgba(255, 255, 255, 0.9), inset 0 1px 1px rgba(255, 255, 255, 1);
  transition: all 0.28s cubic-bezier(0.22, 1, 0.36, 1);
  -webkit-tap-highlight-color: transparent;
}

.mobile-fab-btn:active {
  box-shadow: 4px 4px 10px rgba(15, 23, 42, 0.08), -2px -2px 6px rgba(255, 255, 255, 0.9), inset 0 1px 1px rgba(255, 255, 255, 1);
}

.mobile-fab-btn i {
  font-size: 32px;
  line-height: 1;
  color: #16181d;
  transition: all 0.22s ease;
}

/* Animation capsule mở lên trên */
.capsule-up-enter-active,
.capsule-up-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.capsule-up-enter-from,
.capsule-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

/* ── Push body content up so nav doesn't cover it ── */
@media (max-width: 767.98px) {
  /* Ẩn top header trên mobile */
  .customer-sidebar-wrap {
    display: none !important;
  }

  body {
    padding-bottom: 88px !important;
  }
}
</style>
