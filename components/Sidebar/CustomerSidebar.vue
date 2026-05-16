<template>
  <div class="position-relative">
    <div ref="customerSidebarWrapRef" class="fixed-top w-100 px-2 px-lg-3 pt-1 pt-lg-1 customer-sidebar-wrap">
      <nav class="customer-shell container-xxl w-100 px-0">
        <div class="d-flex flex-column">
          <div
            class="d-flex align-items-center gap-2 gap-lg-3 px-3 px-lg-4 py-3 flex-nowrap border-bottom border-light-subtle">
            <NuxtLink :to="localePath('/')" class="d-flex align-items-center flex-shrink-0 text-decoration-none">
              <img src="@/public/image/logo-irusgear-black.png" alt="IrusGear" class="img-fluid navbar-logo">
            </NuxtLink>

            <form ref="desktopSearchRef" class="header-search d-none d-md-flex align-items-center gap-2 px-3"
              :title="$t('sidebar.searchPlaceholder')" role="search" @submit.prevent="submitHeaderSearch">
              <i class="bi bi-search fs-5 header-search-icon" aria-hidden="true"></i>
              <input v-model="headerSearchKeyword" type="search" class="header-search-input"
                :placeholder="$t('home.searchProducts')" autocomplete="off" aria-haspopup="dialog"
                :aria-expanded="isSearchDropdownOpen ? 'true' : 'false'" @focus="openSearchDropdown"
                @click="openSearchDropdown" @input="onSearchInput"
                @keydown.esc.prevent="isSearchDropdownOpen = false; searchQuery = ''; headerSearchKeyword = ''">
            </form>

            <div class="d-flex align-items-center gap-1 gap-xl-2 flex-shrink-0 flex-nowrap">


              <button type="button" class="btn header-icon-btn d-md-none" :aria-label="$t('sidebar.searchPlaceholder')"
                aria-haspopup="dialog" :aria-expanded="isSearchDropdownOpen ? 'true' : 'false'"
                @click="openSearchDropdown">
                <i class="bi bi-search"></i>
              </button>

              <!-- Cart Dropdown -->
              <div ref="cartDropdownRef" class="header-icon-dropdown-wrapper position-relative"
                @mouseenter="isCartDropdownOpen = true" @mouseleave="isCartDropdownOpen = false">
                <NuxtLink :to="localePath('/cart')" class="btn header-icon-btn position-relative"
                  :aria-label="$t('cart.cart')">
                  <i class="bi bi-cart3"></i>
                  <span v-if="itemCount > 0"
                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white"
                    style="min-width:1.1rem;height:1.1rem;padding:0;font-size:0.65rem;display:inline-flex;align-items:center;justify-content:center;">
                    {{ itemCount }}
                  </span>
                </NuxtLink>

                <Transition name="dropdown-fade">
                  <div v-if="isCartDropdownOpen" class="header-dropdown header-dropdown--cart">
                    <div class="header-dropdown__header">
                      <span class="header-dropdown__title">Giỏ hàng</span>
                      <span v-if="itemCount > 0" class="header-dropdown__count">{{ itemCount }} sản phẩm</span>
                    </div>

                    <div v-if="cartStore.items.length === 0" class="header-dropdown__empty">
                      <i class="bi bi-cart3"></i>
                      <p>Giỏ hàng trống</p>
                      <NuxtLink :to="localePath('/products')" class="header-dropdown__empty-link">
                        Khám phá sản phẩm
                      </NuxtLink>
                    </div>

                    <div v-else class="header-dropdown__body">
                      <div class="header-dropdown__scroll">
                        <div v-for="item in cartStore.items.slice(0, 3)" :key="item.id" class="cart-item">
                          <NuxtLink :to="item.productUrl || localePath('/cart')" class="cart-item__image">
                            <img :src="item.thumbnail || 'https://placehold.co/80x80/f5f5f5/999?text=IMG'"
                              :alt="item.productName || 'Sản phẩm'" loading="lazy">
                          </NuxtLink>
                          <div class="cart-item__info">
                            <NuxtLink :to="item.productUrl || localePath('/cart')" class="cart-item__name">
                              {{ item.productName || 'Sản phẩm' }}
                            </NuxtLink>
                            <div class="cart-item__meta">
                              <span v-if="item.selectedOptions && Object.keys(item.selectedOptions).length"
                                class="cart-item__variant">
                                {{ formatCartVariant(item.selectedOptions) }}
                              </span>
                              <span class="cart-item__qty">x{{ item.quantity }}</span>
                            </div>
                            <span class="cart-item__price">{{ item.currentLineTotal?.formatted ||
                              item.lineTotal?.formatted || '0đ' }}</span>
                          </div>
                          <button type="button" class="cart-item__remove" :aria-label="$t('common.remove')"
                            @click="confirmRemoveCartItem(item)">
                            <i class="bi bi-x"></i>
                          </button>
                        </div>
                      </div>

                      <div v-if="cartStore.items.length > 3" class="header-dropdown__more">
                        <NuxtLink :to="localePath('/cart')" class="header-dropdown__more-link">
                          +{{ cartStore.items.length - 3 }} sản phẩm khác
                        </NuxtLink>
                      </div>

                      <div class="header-dropdown__footer">
                        <div class="header-dropdown__subtotal">
                          <span>Tạm tính</span>
                          <strong>{{ cartStore.subtotal?.formatted || '0đ' }}</strong>
                        </div>
                        <NuxtLink :to="localePath('/cart')" class="header-dropdown__checkout-btn">
                          Xem giỏ hàng
                          <i class="bi bi-arrow-right"></i>
                        </NuxtLink>
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>

              <!-- Notification Dropdown -->
              <div class="header-icon-dropdown-wrapper position-relative d-none d-xl-inline-flex"
                @mouseenter="handleNotiDropdownEnter" @mouseleave="isNotiDropdownOpen = false">
                <button type="button" class="btn header-icon-btn" :aria-label="$t('common.notification')">
                  <i class="bi bi-bell"></i>
                  <span v-if="notificationStore.unreadCount > 0"
                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white"
                    style="min-width:1.1rem;height:1.1rem;padding:0;font-size:0.65rem;display:inline-flex;align-items:center;justify-content:center;">
                    {{ notificationStore.unreadCount > 9 ? '9+' : notificationStore.unreadCount }}
                  </span>
                </button>

                <Transition name="dropdown-fade">
                  <div v-if="isNotiDropdownOpen" class="header-dropdown header-dropdown--noti">
                    <div class="header-dropdown__header">
                      <span class="header-dropdown__title">Thông báo</span>
                      <button v-if="notificationStore.unreadCount > 0" type="button" class="header-dropdown__mark-read"
                        @click="handleMarkAllRead">
                        Đánh dấu đã đọc
                      </button>
                    </div>

                    <!-- Loading spinner -->
                    <div v-if="notificationStore.isLoading" class="header-dropdown__loading">
                      <div class="noti-spinner"></div>
                      <p>Đang tải...</p>
                    </div>

                    <!-- Error state -->
                    <div v-else-if="notiLoadError" class="header-dropdown__empty">
                      <i class="bi bi-exclamation-triangle"></i>
                      <p>Không thể tải thông báo</p>
                    </div>

                    <!-- Empty state -->
                    <div v-else-if="!notificationStore.isLoading && notificationStore.notifications.length === 0"
                      class="header-dropdown__empty">
                      <i class="bi bi-bell-slash"></i>
                      <p>Không có thông báo</p>
                    </div>

                    <!-- Notifications list -->
                    <div v-else class="header-dropdown__body">
                      <div class="header-dropdown__scroll">
                        <div v-for="noti in notificationStore.notifications" :key="noti.id" class="noti-item"
                          :class="{ 'noti-item--unread': !noti.isRead }" @click="handleNotiClick(noti)">
                          <div class="noti-item__icon" :class="`noti-item__icon--${noti.type || 'system'}`">
                            <i :class="noti.icon || 'bi bi-bell'"></i>
                          </div>
                          <div class="noti-item__content">
                            <p class="noti-item__text">{{ noti.text }}</p>
                            <span class="noti-item__time">{{ noti.time }}</span>
                          </div>
                          <div class="noti-item__actions">
                            <span v-if="!noti.isRead" class="noti-item__dot"></span>
                            <button type="button" class="noti-item__close" aria-label="Xoá thông báo"
                              @click.stop="handleRemoveNotification(noti.id)">
                              <i class="bi bi-x"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>

              <LanguageSwitcher />

              <div class="vr d-none d-lg-block mx-1 opacity-25"></div>

              <div v-if="auth.sessionLoading" class="d-flex align-items-center gap-2 flex-nowrap">
                <div class="spinner-border spinner-border-sm text-secondary" role="status"></div>
                <div class="d-none d-xl-block"
                  style="width: 80px; height: 16px; background-color: #e9ecef; border-radius: 4px;"></div>
              </div>

              <div v-else-if="!user" class="d-flex align-items-center gap-2 flex-nowrap">
                <NuxtLink :to="localePath('/auth/login')"
                  class="btn header-text-btn d-inline-flex align-items-center gap-2 px-2 px-lg-3 py-2 border-0">
                  <i class="bi bi-box-arrow-in-right"></i>
                  <span class="d-none d-sm-inline">{{ $t('common.login') }}</span>
                </NuxtLink>

                <NuxtLink :to="localePath('/auth/register')"
                  class="btn btn-dark rounded-pill px-3 py-2 fw-semibold d-none d-sm-inline-flex">
                  {{ $t('common.register') }}
                </NuxtLink>
              </div>

              <div v-else class="dropdown">
                <button type="button"
                  class="btn customer-user-trigger d-flex align-items-center gap-2 rounded-pill border-0 ps-2 pe-3 py-1"
                  data-bs-toggle="dropdown" aria-expanded="false">
                  <img class="rounded-circle border" width="36" height="36" alt="Avatar" :src="avatarUrl">

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
                  <li>
                    <hr class="dropdown-divider opacity-10 my-1">
                  </li>
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
            class="d-none d-md-flex align-items-center justify-content-between gap-2 gap-lg-3 px-2 px-md-3 px-xl-4 py-2 header-secondary-nav"
            :class="{ 'is-hidden': isSecondaryNavHidden }">
            <div class="d-flex align-items-center gap-1 gap-xl-2 flex-nowrap flex-shrink-0">
              <NuxtLink v-for="(item, idx) in primaryNavItems" :key="item.label" :to="item.to"
                class="btn header-nav-link d-inline-flex align-items-center gap-1 gap-lg-2 px-2 px-lg-3 py-2 border-0"
                :class="getPrimaryNavItemClass(idx)">
                <i :class="item.icon"></i>
                <span>{{ item.label }}</span>
              </NuxtLink>

              <div class="header-products">
                <button ref="productsButtonRef" type="button"
                  class="btn header-nav-link d-inline-flex align-items-center gap-1 gap-lg-2 px-2 px-lg-3 py-2 border-0"
                  :class="{ 'is-open': isProductsMenuOpen }" :aria-expanded="isProductsMenuOpen ? 'true' : 'false'"
                  aria-haspopup="true" @click="handleProductsClick">
                  <i class="bi bi-grid"></i>
                  <span>{{ $t('sidebar.menu.products') }}</span>
                  <i class="bi bi-chevron-down small header-nav-link-chevron"></i>
                </button>
              </div>
            </div>

            <div class="d-flex align-items-center gap-2 flex-nowrap">
              <div class="vr opacity-25 mx-1 d-none d-lg-block"></div>

              <div class="d-flex align-items-center gap-1 px-1 px-lg-2 py-1 rounded-pill featured-nav">
                <span v-if="false" class="featured-nav-label d-none d-xl-inline px-2">{{ $t('home.category') }}</span>

                <NuxtLink v-for="item in featuredNavItems" :key="item.label" :to="item.to" :class="[
                  'btn featured-nav-link d-inline-flex align-items-center gap-1 rounded-pill border-0 px-2 px-lg-3 py-2',
                  { 'featured-nav-link--active': isFeaturedNavItemActive(item) },
                ]" :aria-current="isFeaturedNavItemActive(item) ? 'page' : undefined">
                  <i :class="item.icon"></i>
                  <span>{{ item.label }}</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <DropdownSearch v-model:open="isSearchDropdownOpen" :anchor-rect="searchAnchorRect" :mode="searchDropdownMode"
          :search-query="searchQuery" />

        <div v-if="!isHomeRoute && isHeaderCategoryMenuOpen" ref="productsDropdownRef" class="header-mega-menu">
          <CategoryMegaMenu />
        </div>

      </nav>
    </div>

    <!-- Mobile Top Navigation -->
    <header ref="mobileTopNavRef" class="mobile-top-nav d-md-none" :class="{ 'is-scrolled': isMobileTopNavScrolled }">
      <button type="button" class="mobile-top-nav__menu-btn" :aria-label="$t('sidebar.mobileCategory.open')"
        :aria-expanded="isMobileCategorySidebarOpen ? 'true' : 'false'" aria-controls="mobile-category-sidebar"
        @click="toggleMobileCategorySidebar">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <NuxtLink :to="localePath('/')" class="mobile-top-nav__brand" aria-label="IrusGear">
        <img src="@/public/image/logo-irusgear-white.png" alt="IrusGear" class="mobile-top-nav__logo">
      </NuxtLink>
    </header>

    <Transition name="mobile-category-overlay">
      <div v-if="isMobileCategorySidebarOpen" class="mobile-category-overlay d-md-none"
        @click="closeMobileCategorySidebar"></div>
    </Transition>

    <Transition name="mobile-category-drawer">
      <aside v-if="isMobileCategorySidebarOpen" id="mobile-category-sidebar" class="mobile-category-sidebar d-md-none"
        :aria-label="$t('sidebar.mobileCategory.ariaLabel')">
        <div class="mobile-category-sidebar__header">
          <div>
            <h2>{{ $t('sidebar.mobileCategory.title') }}</h2>
          </div>

          <button type="button" class="mobile-category-sidebar__close" :aria-label="$t('sidebar.mobileCategory.close')"
            @click="closeMobileCategorySidebar">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div v-if="megaMenuLoading && !mobileMegaMenuSections.length" class="mobile-category-sidebar__state">
          <span class="mobile-category-sidebar__spinner"></span>
          <span>{{ $t('sidebar.mobileCategory.loading') }}</span>
        </div>

        <div v-else-if="megaMenuError && !mobileMegaMenuSections.length" class="mobile-category-sidebar__state">
          <i class="bi bi-exclamation-circle"></i>
          <span>{{ $t('sidebar.mobileCategory.loadError') }}</span>
        </div>

        <div v-else class="mobile-category-sidebar__body">
          <nav class="mobile-category-sidebar__roots" :aria-label="$t('sidebar.mobileCategory.rootAriaLabel')">
            <button v-for="section in mobileMegaMenuSections" :key="section.key || section.title" type="button"
              class="mobile-category-root" :class="{ 'is-active': section.key === activeMobileMegaMenuKey }"
              @click="setMobileMegaMenuSection(section)">
              <span class="mobile-category-root__icon">
                <i :class="getMobileCategoryIcon(section)"></i>
              </span>
              <span>{{ section.title }}</span>
            </button>
          </nav>

          <div ref="mobileCategoryContentRef" class="mobile-category-sidebar__content">
            <NuxtLink v-if="activeMobileMegaMenuSection" :to="buildMobileSectionLink(activeMobileMegaMenuSection)"
              class="mobile-category-view-all" @click="closeMobileCategorySidebar">
              <span>{{ $t('sidebar.mobileCategory.viewAll', { title: activeMobileMegaMenuSection.title }) }}</span>
              <i class="bi bi-arrow-right"></i>
            </NuxtLink>

            <section v-for="group in activeMobileMegaMenuGroups" :key="group.key || group.title"
              class="mobile-category-group">
              <h3>{{ group.title }}</h3>

              <div class="mobile-category-items">
                <NuxtLink v-for="item in group.items" :key="item.key || item.slug || item.title"
                  :to="resolveMobileCategoryItemTo(item)" class="mobile-category-item"
                  @click="closeMobileCategorySidebar">
                  <span>{{ item.title }}</span>
                  <span v-if="item.badge" class="mobile-category-item__badge">{{ item.badge }}</span>
                </NuxtLink>
              </div>
            </section>
          </div>
        </div>
      </aside>
    </Transition>

    <!-- Mobile Bottom Navigation -->
    <div class="mobile-bottom-nav d-md-none">
      <div class="mobile-capsule-nav">
        <NuxtLink to="/" class="mobile-nav-item" :class="{ active: isMobileNavActive('/') }">
          <i class="bi" :class="isMobileNavActive('/') ? 'bi-house-door-fill' : 'bi-house-door'"></i>
          <span>{{ $t('home.home') }}</span>
        </NuxtLink>

        <button type="button" class="mobile-nav-item" :aria-label="$t('sidebar.searchPlaceholder')"
          aria-haspopup="dialog" :aria-expanded="isSearchDropdownOpen ? 'true' : 'false'" @click="openSearchDropdown">
          <i class="bi bi-search"></i>
          <span>{{ $t('sidebar.search') }}</span>
        </button>

        <NuxtLink to="/profile" class="mobile-nav-item position-relative"
          :class="{ active: isMobileNavActive('/profile') }" :aria-label="$t('common.wishlist')">
          <i class="bi" :class="isMobileNavActive('/profile') ? 'bi-heart-fill' : 'bi-heart'"></i>
          <span>{{ $t('common.wishlist') }}</span>
          <span v-if="wishlistCount > 0" class="mobile-nav-badge">{{ wishlistCount }}</span>
        </NuxtLink>

        <NuxtLink v-if="user" to="/profile" class="mobile-nav-item" :class="{ active: isMobileNavActive('/profile') }"
          :aria-label="$t('common.profile')">
          <img class="mobile-nav-avatar" :src="avatarUrl" :alt="fullName">
          <span>{{ $t('common.profile') }}</span>
        </NuxtLink>

        <NuxtLink v-else to="/auth/login" class="mobile-nav-item" :class="{ active: isMobileNavActive('/auth/login') }"
          :aria-label="$t('common.login')">
          <i class="bi bi-person"></i>
          <span>{{ $t('common.login') }}</span>
        </NuxtLink>
      </div>

      <!-- FAB + nút mở capsule dọc -->
      <div class="mobile-fab-wrapper">
        <!-- Capsule dọc chứa Cart + Language -->
        <Transition name="capsule-up">
          <div v-if="isMobileFabOpen" class="mobile-vertical-capsule mb-1">
            <NuxtLink to="/cart" class="mobile-fab-item" :aria-label="$t('cart.cart')" @click="isMobileFabOpen = false">
              <i class="bi bi-cart3"></i>
              <span class="mobile-fab-tooltip">{{ $t('cart.cart') }}</span>
              <span v-if="itemCount > 0" class="mobile-fab-badge">{{ itemCount }}</span>
            </NuxtLink>

            <button type="button" class="mobile-fab-item" :aria-label="$t('common.language')"
              @click="toggleLanguage(); isMobileFabOpen = false">
              <i class="bi bi-globe-americas"></i>
              <span class="mobile-fab-tooltip">{{ currentLangLabel }}</span>
            </button>

            <button type="button" class="mobile-fab-item" aria-label="Chat với AI"
              @click="chatbotStore.toggleChat(); isMobileFabOpen = false">
              <i class="bi bi-chat-dots-fill"></i>
              <span v-if="chatbotStore.hasNewMessage" class="mobile-fab-badge">!</span>
              <span class="mobile-fab-tooltip">Trợ lý AI</span>
            </button>
          </div>
        </Transition>

        <!-- Nút FAB + -->
        <button type="button" class="mobile-fab-btn" :class="{ 'is-open': isMobileFabOpen }" aria-label="Mở menu"
          :aria-expanded="isMobileFabOpen ? 'true' : 'false'" @click="isMobileFabOpen = !isMobileFabOpen">
          <i class="bi" :class="isMobileFabOpen ? 'bi-x' : 'bi-plus'"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useLocalePath, useRoute, useI18n, navigateTo } from '#imports'
import { toast } from 'vue-sonner'
import DropdownSearch from '@/components/Common/DropdownSearch.vue'
import CategoryMegaMenu from '@/components/Home/CategoryMegaMenu.vue'
import LanguageSwitcher from '@/components/Sidebar/LanguageSwitcher.vue'
import { useHomeStore } from '@/stores/homeStore'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useSearchStore } from '@/stores/searchStore'
import { getUserRoleKey } from '@/utils/roleHelper'
import { useChatbotStore } from '@/stores/chatbotStore'
import { useNotificationStore } from '@/stores/notificationStore'

const auth = useAuthStore()
const cartStore = useCartStore()
const homeStore = useHomeStore()
const wishlistStore = useWishlistStore()
const chatbotStore = useChatbotStore()
const searchStore = useSearchStore()
const notificationStore = useNotificationStore()
const { user } = storeToRefs(auth)
const { itemCount } = storeToRefs(cartStore)
const { itemCount: wishlistCount } = storeToRefs(wishlistStore)
const {
  heroMegaMenuOpen,
  megaMenuSections,
  activeMegaMenuKey,
  megaMenuLoading,
  megaMenuError,
} = storeToRefs(homeStore)
const localePath = useLocalePath()
const route = useRoute()
const { t, locale } = useI18n()
const customerSidebarWrapRef = ref(null)
const mobileTopNavRef = ref(null)
const mobileCategoryContentRef = ref(null)
const desktopSearchRef = ref(null)
const productsButtonRef = ref(null)
const productsDropdownRef = ref(null)
const isHeaderCategoryMenuOpen = ref(false)
const isSecondaryNavHidden = ref(false)
const isMobileTopNavScrolled = ref(false)
const isMobileFabOpen = ref(false)
const isMobileCategorySidebarOpen = ref(false)
const isSearchDropdownOpen = ref(false)
const searchDropdownMode = ref('desktop')
const headerSearchKeyword = ref('')
const searchAnchorRect = ref(null)
const isCartDropdownOpen = ref(false)
const isNotiDropdownOpen = ref(false)
const notiLoadError = ref(false)
const searchQuery = ref('')
let customerSidebarResizeObserver = null
let customerSidebarOffsetFrame = null
let _searchDebounceTimer = null

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

const mobileMegaMenuSections = computed(() =>
  Array.isArray(megaMenuSections.value) ? megaMenuSections.value.filter(Boolean) : []
)

const activeMobileMegaMenuKey = computed(() =>
  activeMegaMenuKey.value || mobileMegaMenuSections.value[0]?.key || ''
)

const activeMobileMegaMenuSection = computed(() =>
  mobileMegaMenuSections.value.find((section) => section?.key === activeMobileMegaMenuKey.value)
  || mobileMegaMenuSections.value[0]
  || null
)

const activeMobileMegaMenuGroups = computed(() => {
  const section = activeMobileMegaMenuSection.value
  if (!section) return []

  if (Array.isArray(section.children) && section.children.length) {
    return section.children
      .map((group) => ({
        key: group?.key || group?.title,
        title: group?.title || t('sidebar.mobileCategory.fallbackTitle'),
        items: Array.isArray(group?.items) ? group.items.filter(Boolean) : [],
      }))
      .filter((group) => group.items.length)
  }

  if (Array.isArray(section.items) && section.items.length) {
    return [{
      key: section.key || section.title,
      title: section.title || t('sidebar.mobileCategory.fallbackTitle'),
      items: section.items.filter(Boolean),
    }]
  }

  return []
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

const closeMobileCategorySidebar = () => {
  isMobileCategorySidebarOpen.value = false
}

const openMobileCategorySidebar = async () => {
  isSearchDropdownOpen.value = false
  isMobileFabOpen.value = false
  closeHeaderCategoryMenu()
  homeStore.closeHeroMegaMenu()
  isMobileCategorySidebarOpen.value = true

  await homeStore.fetchMegaMenuLeaves().catch(() => { })
}

const toggleMobileCategorySidebar = () => {
  if (isMobileCategorySidebarOpen.value) {
    closeMobileCategorySidebar()
    return
  }

  openMobileCategorySidebar()
}

const closeHeaderCategoryMenu = () => {
  isHeaderCategoryMenuOpen.value = false
}

const syncCustomerSidebarOffset = () => {
  if (typeof document === 'undefined') return

  const getVisibleElementOffset = (element) => {
    if (!(element instanceof HTMLElement)) return 0

    const styles = typeof window !== 'undefined'
      ? window.getComputedStyle(element)
      : null

    if (styles?.display === 'none' || styles?.visibility === 'hidden') {
      return 0
    }

    const rect = element.getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0) return 0

    return Math.ceil(rect.bottom + 2)
  }

  const nextOffset = getVisibleElementOffset(mobileTopNavRef.value)
    || getVisibleElementOffset(customerSidebarWrapRef.value)

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

const syncSearchAnchorRect = () => {
  if (typeof window === 'undefined') return

  const searchEl = desktopSearchRef.value
  if (!(searchEl instanceof HTMLElement)) {
    searchAnchorRect.value = null
    return
  }

  const rect = searchEl.getBoundingClientRect()
  searchAnchorRect.value = {
    top: Math.round(rect.top),
    right: Math.round(rect.right),
    bottom: Math.round(rect.bottom),
    left: Math.round(rect.left),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  }
}

const openSearchDropdown = () => {
  closeMobileCategorySidebar()
  closeHeaderCategoryMenu()
  homeStore.closeHeroMegaMenu()
  isMobileFabOpen.value = false

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  searchDropdownMode.value = isMobile ? 'mobile' : 'desktop'

  if (isMobile) {
    searchAnchorRect.value = null
  } else {
    // Ensure anchorRect is set before opening so panel positions correctly
    const el = desktopSearchRef.value
    if (el instanceof HTMLElement) {
      const rect = el.getBoundingClientRect()
      searchAnchorRect.value = {
        top: Math.round(rect.top),
        right: Math.round(rect.right),
        bottom: Math.round(rect.bottom),
        left: Math.round(rect.left),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      }
    }
  }

  isSearchDropdownOpen.value = true
}

const onSearchInput = (e) => {
  const query = e.target.value
  searchQuery.value = query

  clearTimeout(_searchDebounceTimer)
  _searchDebounceTimer = setTimeout(() => {
    if (query.length >= 1) {
      if (!isSearchDropdownOpen.value) {
        isSearchDropdownOpen.value = true
        searchDropdownMode.value = 'desktop'
      }
      searchStore.fetchSuggestions(query)
    } else {
      searchStore.clearSuggestions()
    }
  }, 300)
}

const submitHeaderSearch = async () => {
  const keyword = headerSearchKeyword.value.trim()

  if (!keyword) {
    openSearchDropdown()
    return
  }

  await searchStore.saveKeyword(keyword)

  isSearchDropdownOpen.value = false
  searchQuery.value = ''
  headerSearchKeyword.value = ''

  await navigateTo({
    path: localePath('/products'),
    query: {
      search: keyword,
      sort: 'newest',
      limit: '20',
    },
  })
}

const handleProductsClick = async () => {
  await homeStore.fetchMegaMenuLeaves().catch(() => { })

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

  if (isSearchDropdownOpen.value) {
    const clickedSearch = desktopSearchRef.value?.contains(target)
    const clickedSearchPanel = target instanceof Element
      ? Boolean(
        target.closest('.dropdown-search-desktop-layer')
        || target.closest('.dropdown-search-desktop-panel')
        || target.closest('.dropdown-search-mobile-sheet')
        || target.closest('.sheet-panel'),
      )
      : false

    if (!clickedSearch && !clickedSearchPanel) {
      isSearchDropdownOpen.value = false
      searchQuery.value = ''
      headerSearchKeyword.value = ''
    }
  }

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

const handleDocumentKeydown = (event) => {
  if (event.key !== 'Escape') return

  closeMobileCategorySidebar()
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

const syncMobileTopNavState = () => {
  if (typeof window === 'undefined') return
  isMobileTopNavScrolled.value = window.scrollY > 8
}

const syncOpenSearchDropdownPosition = () => {
  if (!isSearchDropdownOpen.value || searchDropdownMode.value !== 'desktop') return
  syncSearchAnchorRect()
}

watch(
  () => user.value,
  (newUser) => {
    if (newUser) {
      notificationStore.fetchUnreadCount().catch(() => {})
    }
  },
  { immediate: true }
)

watch(
  () => route.fullPath,
  async () => {
    closeMobileCategorySidebar()
    isMobileFabOpen.value = false
    isSearchDropdownOpen.value = false
    searchDropdownMode.value = 'desktop'
    closeHeaderCategoryMenu()
    setSecondaryNavHidden(false)
    await nextTick()
    syncSecondaryNavVisibility()
    syncMobileTopNavState()
    scheduleCustomerSidebarOffsetSync()
  }
)

watch(isMobileCategorySidebarOpen, (isOpen) => {
  if (typeof document === 'undefined') return

  document.body.classList.toggle('mobile-category-sidebar-open', isOpen)
})

onMounted(() => {
  if (!homeStore.megaMenuLeaves || homeStore.megaMenuLeaves.length === 0) {
    homeStore.fetchMegaMenuLeaves().catch(() => { })
  }

  if (typeof document === 'undefined' || typeof window === 'undefined') return
  document.addEventListener('pointerdown', handleDocumentPointerDown)
  document.addEventListener('keydown', handleDocumentKeydown)
  window.addEventListener('scroll', syncSecondaryNavVisibility, { passive: true })
  window.addEventListener('scroll', syncMobileTopNavState, { passive: true })
  window.addEventListener('scroll', syncOpenSearchDropdownPosition, { passive: true })
  window.addEventListener('resize', syncSecondaryNavVisibility, { passive: true })
  window.addEventListener('resize', syncMobileTopNavState, { passive: true })
  window.addEventListener('resize', syncOpenSearchDropdownPosition, { passive: true })
  window.addEventListener('resize', scheduleCustomerSidebarOffsetSync, { passive: true })

  if (typeof ResizeObserver !== 'undefined' && customerSidebarWrapRef.value instanceof HTMLElement) {
    customerSidebarResizeObserver = new ResizeObserver(() => {
      scheduleCustomerSidebarOffsetSync()
    })
    customerSidebarResizeObserver.observe(customerSidebarWrapRef.value)

    if (mobileTopNavRef.value instanceof HTMLElement) {
      customerSidebarResizeObserver.observe(mobileTopNavRef.value)
    }
  }

  nextTick(() => {
    syncSecondaryNavVisibility()
    syncMobileTopNavState()
    syncCustomerSidebarOffset()
  })
})

onBeforeUnmount(() => {
  if (typeof document === 'undefined' || typeof window === 'undefined') return
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
  document.removeEventListener('keydown', handleDocumentKeydown)
  document.body.classList.remove('mobile-category-sidebar-open')
  window.removeEventListener('scroll', syncSecondaryNavVisibility)
  window.removeEventListener('scroll', syncMobileTopNavState)
  window.removeEventListener('scroll', syncOpenSearchDropdownPosition)
  window.removeEventListener('resize', syncSecondaryNavVisibility)
  window.removeEventListener('resize', syncMobileTopNavState)
  window.removeEventListener('resize', syncOpenSearchDropdownPosition)
  window.removeEventListener('resize', scheduleCustomerSidebarOffsetSync)

  if (customerSidebarResizeObserver) {
    customerSidebarResizeObserver.disconnect()
    customerSidebarResizeObserver = null
  }

  if (customerSidebarOffsetFrame !== null) {
    window.cancelAnimationFrame(customerSidebarOffsetFrame)
    customerSidebarOffsetFrame = null
  }

  clearTimeout(_searchDebounceTimer)
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
    to: localePath('/coming-soon'),
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

// Progressive hiding: Tin tức (lg-), Khuyến mãi (md-), Liên hệ (sm-)
// idx 0=Trang chủ và idx 4=Sản phẩm luôn hiển thị
const getPrimaryNavItemClass = (index) => {
  if (index === 0 || index === 4) return ''
  if (index === 1) return 'd-none d-lg-flex'   // Tin tức: ẩn < 992px
  if (index === 2) return 'd-none d-md-flex'   // Khuyến mãi: ẩn < 768px
  if (index === 3) return 'd-none d-sm-flex'   // Liên hệ: ẩn < 576px
  return ''
}

const buildProductsCategoryLink = (category) => {
  const query = new URLSearchParams({
    category,
    sort: 'newest',
    limit: '20',
  })

  return `${localePath('/products')}?${query.toString()}`
}

const normalizeMobileCategoryText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()

const getMobileCategoryIcon = (section) => {
  const key = normalizeMobileCategoryText(section?.key)
  const title = normalizeMobileCategoryText(section?.title)
  const value = `${key} ${title}`
  const iconRules = [
    { tokens: ['dien-thoai', 'phone'], icon: 'bi bi-phone' },
    { tokens: ['tablet', 'may-tinh-bang'], icon: 'bi bi-tablet' },
    { tokens: ['laptop'], icon: 'bi bi-laptop' },
    { tokens: ['am-thanh', 'audio', 'tai-nghe', 'loa'], icon: 'bi bi-headphones' },
    { tokens: ['mic', 'thu-am', 'micro'], icon: 'bi bi-mic' },
    { tokens: ['dong-ho', 'watch'], icon: 'bi bi-smartwatch' },
    { tokens: ['camera'], icon: 'bi bi-camera' },
    { tokens: ['do-gia-dung', 'gia-dung', 'home-appliance'], icon: 'bi bi-house-gear' },
    { tokens: ['lam-dep', 'suc-khoe', 'beauty', 'health'], icon: 'bi bi-heart-pulse' },
    { tokens: ['phu-kien', 'accessory'], icon: 'bi bi-plug' },
    { tokens: ['pc'], icon: 'bi bi-pc-display' },
    { tokens: ['man-hinh', 'monitor'], icon: 'bi bi-display' },
    { tokens: ['may-in', 'printer'], icon: 'bi bi-printer' },
    { tokens: ['tivi', 'tv'], icon: 'bi bi-tv' },
    { tokens: ['dien-may'], icon: 'bi bi-lightning-charge' },
    { tokens: ['thu-cu', 'doi-moi', 'hang-cu'], icon: 'bi bi-arrow-repeat' },
    { tokens: ['apple'], icon: 'bi bi-apple' },
    { tokens: ['gaming', 'game'], icon: 'bi bi-controller' },
    { tokens: ['sim'], icon: 'bi bi-sim' },
    { tokens: ['mang', 'wifi', 'router'], icon: 'bi bi-router' },
    { tokens: ['pin', 'sac'], icon: 'bi bi-battery-charging' },
  ]

  return iconRules.find((rule) => rule.tokens.some((token) => value.includes(token)))?.icon || 'bi bi-box'
}

const scrollMobileCategoryContentToTop = async () => {
  await nextTick()

  const contentEl = mobileCategoryContentRef.value
  if (!(contentEl instanceof HTMLElement)) return

  contentEl.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

const setMobileMegaMenuSection = async (section) => {
  if (!section?.key) return
  homeStore.setActiveMegaMenuKey(section.key)
  await scrollMobileCategoryContentToTop()
}

const localizeInternalTo = (to) => {
  if (!to) return localePath('/products')

  if (typeof to === 'string') {
    return to.startsWith('/') ? localePath(to) : to
  }

  if (typeof to === 'object' && to.path) {
    return {
      ...to,
      path: localePath(to.path),
    }
  }

  return to
}

const buildMobileSectionLink = (section) => {
  const category = section?.slug || section?.key
  return category ? buildProductsCategoryLink(category) : localePath('/products')
}

const resolveMobileCategoryItemTo = (item) =>
  localizeInternalTo(item?.to || item?.url || localePath('/products'))

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

// Cart dropdown helpers
const formatCartVariant = (options) => {
  if (!options || typeof options !== 'object') return ''
  return Object.values(options).filter(Boolean).join(' · ')
}

// Notification helpers
let _notiFetched = false

const handleNotiDropdownEnter = () => {
  isNotiDropdownOpen.value = true
  if (!user.value) return
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

const confirmRemoveCartItem = (item) => {
  toast(t('cart.confirmRemoveItem', { name: item.productName }), {
    cancel: {
      label: t('common.confirmNo'),
      onClick: () => { },
    },
    action: {
      label: t('common.confirmYes'),
      onClick: () => cartStore.removeItem(item.id),
    },
  })
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
  flex: 1 1 0;
  margin: 0;
  min-width: 0;
  width: 100%;
  min-height: 40px;
  border: 1px solid rgba(17, 17, 17, 0.2);
  border-radius: 8px;
  background: #ffffff;
  cursor: text;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}

.header-search-icon {
  color: #111111;
  line-height: 1;
}

.header-search-input {
  min-width: 0;
  flex: 1 1 auto;
  border: 0;
  outline: 0;
  background: transparent;
  color: #111827;
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.2;
}

.header-search-input::placeholder {
  color: #b8bec8;
  opacity: 1;
}

.header-search:hover {
  border-color: rgba(17, 17, 17, 0.38);
  background: #ffffff;
}

.header-search:focus-within {
  border-color: rgba(17, 17, 17, 0.72);
  box-shadow: 0 0 0 0.16rem rgba(17, 17, 17, 0.1);
}

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

.header-text-btn,
.header-nav-link,
.featured-nav-link {
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
}

@media (min-width: 1200px) {

  .header-nav-link,
  .featured-nav-link {
    font-size: 0.95rem;
  }
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

.header-icon-btn>i {
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
  white-space: nowrap;
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

/* Mobile Top Navigation */
.mobile-top-nav {
  display: none;
}

@media (max-width: 767.98px) {
  .mobile-top-nav {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1052;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: var(--irus-mobile-top-nav-total-height, calc(64px + env(safe-area-inset-top, 0px)));
    padding: calc(env(safe-area-inset-top, 0px) + 11px) 20px 12px;
    background: var(--irus-mobile-top-nav-bg, #000000);
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    box-shadow: 0 0 0 rgba(0, 0, 0, 0);
    transition: border-color 0.22s ease, box-shadow 0.22s ease;
  }

  :global(body.mobile-category-sidebar-open) {
    overflow: hidden;
    touch-action: none;
  }

  .mobile-top-nav.is-scrolled {
    border-bottom-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
  }

  .mobile-top-nav__menu-btn {
    position: absolute;
    left: 16px;
    bottom: 12px;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    width: 40px;
    height: 40px;
    padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.06);
    color: #ffffff;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  }

  .mobile-top-nav__menu-btn:active {
    transform: scale(0.94);
  }

  .mobile-top-nav__menu-btn span {
    display: block;
    width: 17px;
    height: 2px;
    margin: 0 auto;
    border-radius: 999px;
    background: currentColor;
  }

  .mobile-top-nav__brand {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
  }

  .mobile-top-nav__logo {
    display: block;
    width: auto;
    height: 28px;
    object-fit: contain;
    filter: drop-shadow(0 1px 4px rgba(255, 255, 255, 0.08));
  }

  .mobile-category-overlay {
    position: fixed;
    inset: 0;
    z-index: 1060;
    background: rgba(0, 0, 0, 0.52);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
  }

  .mobile-category-sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1061;
    display: flex;
    flex-direction: column;
    width: min(88vw, 380px);
    padding-top: env(safe-area-inset-top, 0px);
    background: #ffffff;
    color: #111111;
    box-shadow: 22px 0 60px rgba(0, 0, 0, 0.24);
  }

  .mobile-category-sidebar__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 22px 18px 16px;
    color: #ffffff;
    background: #000000;
  }

  .mobile-category-sidebar__eyebrow {
    display: block;
    margin-bottom: 4px;
    color: rgba(255, 255, 255, 0.64);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .mobile-category-sidebar__header h2 {
    margin: 0;
    font-size: 1.28rem;
    font-weight: 800;
    letter-spacing: 0;
  }

  .mobile-category-sidebar__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
  }

  .mobile-category-sidebar__state {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 22px 18px;
    color: #555555;
    font-size: 0.92rem;
    font-weight: 600;
  }

  .mobile-category-sidebar__spinner {
    width: 18px;
    height: 18px;
    border: 2px solid #dddddd;
    border-top-color: #111111;
    border-radius: 50%;
    animation: mobile-category-spin 0.8s linear infinite;
  }

  .mobile-category-sidebar__body {
    display: grid;
    grid-template-columns: 112px minmax(0, 1fr);
    min-height: 0;
    flex: 1;
    background: #f5f5f5;
  }

  .mobile-category-sidebar__roots {
    overflow-y: auto;
    padding: 10px 8px 18px;
    background: #0b0b0b;
  }

  .mobile-category-root {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    width: 100%;
    min-height: 76px;
    margin-bottom: 6px;
    padding: 10px 6px;
    border: 0;
    border-radius: 14px;
    background: transparent;
    color: rgba(255, 255, 255, 0.62);
    font-size: 0.72rem;
    font-weight: 700;
    line-height: 1.2;
    text-align: center;
    transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
  }

  .mobile-category-root:active {
    transform: scale(0.96);
  }

  .mobile-category-root.is-active {
    background: #ffffff;
    color: #000000;
  }

  .mobile-category-root__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.1);
    font-size: 1rem;
    transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
  }

  .mobile-category-root.is-active .mobile-category-root__icon {
    background: #000000;
    color: #ffffff;
    transform: scale(1.04);
  }

  .mobile-category-sidebar__content {
    overflow-y: auto;
    min-width: 0;
    padding: 14px 12px 22px;
    scroll-behavior: smooth;
  }

  .mobile-category-view-all {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 14px;
    padding: 13px 14px;
    border-radius: 14px;
    background: #111111;
    color: #ffffff;
    font-size: 0.88rem;
    font-weight: 800;
    text-decoration: none;
  }

  .mobile-category-group {
    margin-bottom: 18px;
  }

  .mobile-category-group h3 {
    margin: 0 0 9px;
    color: #111111;
    font-size: 0.82rem;
    font-weight: 800;
    letter-spacing: 0;
  }

  .mobile-category-items {
    display: grid;
    gap: 7px;
  }

  .mobile-category-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-height: 42px;
    padding: 10px 11px;
    border: 1px solid #eeeeee;
    border-radius: 8px;
    background: #ffffff;
    color: #191919;
    font-size: 0.86rem;
    font-weight: 650;
    line-height: 1.25;
    text-decoration: none;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.035);
  }

  .mobile-category-item__badge {
    flex: 0 0 auto;
    padding: 3px 7px;
    border-radius: 999px;
    background: #000000;
    color: #ffffff;
    font-size: 0.68rem;
    font-weight: 800;
  }

  .mobile-category-overlay-enter-active,
  .mobile-category-overlay-leave-active {
    transition: opacity 0.24s ease;
  }

  .mobile-category-overlay-enter-from,
  .mobile-category-overlay-leave-to {
    opacity: 0;
  }

  .mobile-category-drawer-enter-active,
  .mobile-category-drawer-leave-active {
    transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.22s ease;
  }

  .mobile-category-drawer-enter-from,
  .mobile-category-drawer-leave-to {
    opacity: 0;
    transform: translateX(-100%);
  }

  @keyframes mobile-category-spin {
    to {
      transform: rotate(360deg);
    }
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
  background: var(--irus-color-accent);
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
  background: var(--irus-color-accent);
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
  background: var(--irus-color-accent);
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

/* ── Icon Dropdown Wrappers ── */
.header-icon-dropdown-wrapper {
  position: relative;
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

.header-dropdown--noti {
  min-width: 340px;
}

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

.header-dropdown__count {
  font-size: 0.78rem;
  color: #8e8e93;
  font-weight: 500;
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

.header-dropdown__mark-read:hover {
  opacity: 1;
}

.header-dropdown__body {
  display: flex;
  flex-direction: column;
}

.header-dropdown__scroll {
  max-height: 360px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(15, 23, 42, 0.12) transparent;
}

.header-dropdown__scroll::-webkit-scrollbar {
  width: 4px;
}

.header-dropdown__scroll::-webkit-scrollbar-thumb {
  background: rgba(15, 23, 42, 0.12);
  border-radius: 4px;
}

.header-dropdown__more {
  padding: 10px 16px;
  border-top: 1px solid rgba(15, 23, 42, 0.06);
  text-align: center;
}

.header-dropdown__more-link {
  font-size: 0.8rem;
  font-weight: 600;
  color: #111827;
  text-decoration: none;
  opacity: 0.7;
  transition: opacity 0.15s ease;
}

.header-dropdown__more-link:hover {
  opacity: 1;
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* Empty state */
.header-dropdown__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px 20px;
  color: #8e8e93;
}

.header-dropdown__empty i {
  font-size: 2.2rem;
  opacity: 0.35;
  line-height: 1;
}

.header-dropdown__empty p {
  font-size: 0.85rem;
  font-weight: 500;
  margin: 0;
  color: #6b7280;
}

.header-dropdown__empty-link {
  font-size: 0.8rem;
  font-weight: 600;
  color: #111827;
  text-decoration: none;
  border-bottom: 1px solid rgba(15, 23, 42, 0.3);
  padding-bottom: 1px;
  transition: border-color 0.15s ease;
}

.header-dropdown__empty-link:hover {
  border-color: #111827;
}

/* ── Cart Item ── */
.cart-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.05);
  transition: background-color 0.15s ease;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item:hover {
  background: rgba(15, 23, 42, 0.02);
}

.cart-item__image {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.07);
  background: #f8f9fa;
  display: block;
}

.cart-item__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.cart-item__name {
  font-size: 0.83rem;
  font-weight: 600;
  color: #111827;
  text-decoration: none;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.15s ease;
}

.cart-item__name:hover {
  color: #111;
}

.cart-item__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #8e8e93;
}

.cart-item__variant {
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cart-item__qty {
  font-weight: 600;
  color: #6b7280;
}

.cart-item__price {
  font-size: 0.85rem;
  font-weight: 700;
  color: #111827;
  margin-top: 2px;
}

.cart-item__remove {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  background: transparent;
  border-radius: 6px;
  color: #8e8e93;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
  padding: 0;
  font-size: 0.85rem;
}

.cart-item__remove:hover {
  background: rgba(220, 38, 38, 0.08);
  color: #dc2626;
}

/* Cart Footer */
.header-dropdown__footer {
  padding: 14px 16px;
  border-top: 1px solid rgba(15, 23, 42, 0.06);
  background: rgba(15, 23, 42, 0.015);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.header-dropdown__subtotal {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #374151;
}

.header-dropdown__subtotal strong {
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.02em;
}

.header-dropdown__checkout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 16px;
  background: #111827;
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  border-radius: 10px;
  border: none;
  transition: background-color 0.18s ease, transform 0.15s ease;
  letter-spacing: 0.01em;
}

.header-dropdown__checkout-btn:hover {
  background: #000000;
  color: #ffffff;
  transform: translateY(-1px);
}

.header-dropdown__checkout-btn:active {
  transform: translateY(0);
}

/* ── Notification Item ── */
.noti-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.05);
  transition: background-color 0.15s ease;
  cursor: default;
}

.noti-item:last-child {
  border-bottom: none;
}

.noti-item:hover {
  background: rgba(15, 23, 42, 0.02);
}

.noti-item--unread {
  background: rgba(15, 23, 42, 0.02);
}

.noti-item--unread:hover {
  background: rgba(15, 23, 42, 0.035);
}

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

.noti-item__icon i {
  line-height: 1;
}

.noti-item__icon--order {
  background: rgba(15, 23, 42, 0.06);
  color: #111827;
}

.noti-item__icon--promo {
  background: rgba(220, 38, 38, 0.08);
  color: #dc2626;
}

.noti-item__icon--review {
  background: rgba(234, 179, 8, 0.1);
  color: #ca8a04;
}

.noti-item__icon--system {
  background: rgba(59, 130, 246, 0.08);
  color: #2563eb;
}

.noti-item__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

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

.noti-item__time {
  font-size: 0.72rem;
  color: #9ca3af;
  font-weight: 500;
}

.noti-item__dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #111827;
  border: none;
  padding: 0;
  cursor: default;
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

.noti-item:hover .noti-item__close {
  opacity: 1;
}

.noti-item__close:hover {
  background: rgba(220, 38, 38, 0.08);
  color: #dc2626;
}

/* Dropdown transition */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.22, 1, 0.36, 1);
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}

.dropdown-fade-enter-to,
.dropdown-fade-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Notification loading spinner */
.header-dropdown__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 20px;
  color: #8e8e93;
}

.header-dropdown__loading p {
  font-size: 0.85rem;
  font-weight: 500;
  margin: 0;
  color: #6b7280;
}

.noti-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid rgba(15, 23, 42, 0.1);
  border-top-color: #111827;
  border-radius: 50%;
  animation: notiSpin 0.7s linear infinite;
}

@keyframes notiSpin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
