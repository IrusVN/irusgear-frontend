<template>
  <div class="position-relative">
    <div class="fixed-top w-100 px-2 px-lg-3 pt-1 pt-lg-1 customer-sidebar-wrap">
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
              title="Tim kiem san pham"
            >
              <i class="bi bi-search fs-6 text-secondary"></i>
              <span class="search-text small text-secondary-emphasis text-truncate">
                Tìm kiếm sản phẩm, danh mục...
              </span>
              <span class="search-shortcut d-none d-xl-inline-flex align-items-center justify-content-center">
                Ctrl K
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

              <button type="button" class="btn header-icon-btn d-md-none" aria-label="Tim kiem">
                <i class="bi bi-search"></i>
              </button>

              <NuxtLink
                :to="localePath('/cart')"
                class="btn header-icon-btn position-relative"
                aria-label="Gio hang"
              >
                <i class="bi bi-cart3"></i>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white">
                  2
                </span>
              </NuxtLink>

              <button type="button" class="btn header-icon-btn d-none d-xl-inline-flex" aria-label="Thong bao">
                <i class="bi bi-bell"></i>
              </button>

              <button type="button" class="btn header-icon-btn d-none d-xxl-inline-flex" aria-label="Ngon ngu">
                <i class="bi bi-globe2"></i>
              </button>

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
                      <i class="bi bi-person me-2"></i>Hồ sơ cá nhân
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink :to="localePath('/orders')" class="dropdown-item rounded-3 py-2">
                      <i class="bi bi-box-seam me-2"></i>Đơn mua
                    </NuxtLink>
                  </li>
                  <li><hr class="dropdown-divider opacity-10 my-1"></li>
                  <li>
                    <button class="dropdown-item rounded-3 py-2 text-danger" @click="auth.logout">
                      <i class="bi bi-box-arrow-right me-2"></i>Đăng xuất
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="d-none d-lg-flex align-items-center justify-content-between gap-3 px-3 px-xl-4 py-2">
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

              <div class="dropdown position-static header-products">
                <button
                  type="button"
                  class="btn header-nav-link d-inline-flex align-items-center gap-2 px-3 py-2 border-0"
                >
                  <i class="bi bi-grid"></i>
                  <span>{{ $t('sidebar.menu.products') }}</span>
                  <i class="bi bi-chevron-down small"></i>
                </button>

                <div class="dropdown-menu border-0 bg-transparent shadow-none p-0 mt-3 header-mega-menu">
                  <CategoryMegaMenu />
                </div>
              </div>
            </div>

            <div class="d-flex align-items-center gap-2 flex-nowrap">
              <div class="vr opacity-25 mx-1"></div>

              <div class="d-flex align-items-center gap-1 px-2 py-1 rounded-pill featured-nav">
                <span class="featured-nav-label d-none d-xl-inline px-2">Danh mục</span>

                <NuxtLink
                  v-for="item in featuredNavItems"
                  :key="item.label"
                  :to="item.to"
                  class="btn featured-nav-link d-inline-flex align-items-center gap-2 rounded-pill border-0 px-3 py-2"
                >
                  <i :class="item.icon"></i>
                  <span>{{ item.label }}</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useLocalePath } from '#imports'
import CategoryMegaMenu from '@/components/Home/CategoryMegaMenu.vue'
import { useAuthStore } from '@/stores/authStore'
import { getUserRoleKey } from '@/utils/roleHelper'

const auth = useAuthStore()
const { user } = storeToRefs(auth)
const localePath = useLocalePath()

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

const utilityLinks = computed(() => [
  {
    label: 'Khuyến mãi',
    to: localePath('/khuyen-mai'),
    icon: 'bi bi-tags',
  },
])

const ctaLink = computed(() => ({
  label: 'Deal Hot',
  to: localePath('/khuyen-mai'),
  icon: 'bi bi-stars',
}))

const primaryNavItems = computed(() => [
  {
    label: 'Trang chủ',
    to: localePath('/'),
    icon: 'bi bi-house-door',
  },
  {
    label: 'Tin tức',
    to: localePath('/tin-tuc'),
    icon: 'bi bi-newspaper',
  },
  {
    label: 'Khuyến mãi',
    to: localePath('/khuyen-mai'),
    icon: 'bi bi-megaphone',
  },
  {
    label: 'Liên hệ',
    to: localePath('/lien-he'),
    icon: 'bi bi-headset',
  },
])

const featuredNavItems = computed(() => [
  {
    label: 'Laptop',
    to: '/category/laptop?sort=newest&limit=20',
    icon: 'bi bi-laptop',
  },
  {
    label: 'Âm thanh',
    to: '/category/am-thanh?sort=newest&limit=20',
    icon: 'bi bi-headphones',
  },
  {
    label: 'Đồng hồ',
    to: '/category/dong-ho?sort=newest&limit=20',
    icon: 'bi bi-smartwatch',
  },
  {
    label: 'Phụ kiện',
    to: '/category/phu-kien?sort=newest&limit=20',
    icon: 'bi bi-mouse2',
  },
])
</script>

<style scoped>
.customer-sidebar-wrap {
  z-index: 1040;
}

.customer-shell {
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

.header-mega-menu {
  left: 50%;
  width: min(1180px, calc(100vw - 64px));
  transform: translateX(-50%);
}

.dropdown-item:active,
.dropdown-item.active,
.dropdown-item.router-link-active {
  color: #fff !important;
  background-color: #111 !important;
}

@media (min-width: 992px) {
  .header-products:hover .dropdown-menu {
    display: block;
  }
}

@media (max-width: 1399.98px) {
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
</style>
