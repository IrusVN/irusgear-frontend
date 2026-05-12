<template>
  <ProfileLayout>
  <div class="profile-page">
  <!-- Notice Banner: S-Business -->
  <div v-if="false" class="profile-notice">
    <div class="profile-notice__icon">
      <i class="bi bi-info-circle-fill"></i>
    </div>
    <p class="profile-notice__text">Đăng ký S-Business để nhận ưu đãi đặc quyền!</p>
    <a href="#" class="profile-notice__btn">Đăng ký ngay</a>
    <button type="button" class="profile-notice__close" aria-label="Đóng">
      <i class="bi bi-x-lg"></i>
    </button>
  </div>

  <!-- Notice Banner: Address -->
  <!-- <div v-if="showAddressNotice" class="profile-notice">
    <div class="profile-notice__icon">
      <i class="bi bi-info-circle-fill"></i>
    </div>
    <p class="profile-notice__text">{{ $t('profile.dashboard.noticeAddress') }}</p>
    <button type="button" class="profile-notice__btn">{{ $t('profile.dashboard.addAddress') }}</button>
    <button type="button" class="profile-notice__close" :aria-label="$t('profile.dashboard.closeNotice')" @click="showAddressNotice = false">
      <i class="bi bi-x-lg"></i>
    </button>
  </div> -->

  <!-- Address Card -->
  <div class="profile-card profile-card--address">
    <div class="profile-card__header">
      <h3 class="profile-card__title">
        <i class="bi bi-geo-alt"></i>
        {{ $t('profile.dashboard.addressesTitle') }}
      </h3>
      <button
        v-if="checkoutStore.savedAddresses.length > 0"
        type="button"
        class="profile-card__add-btn"
        @click="checkoutStore.openAddressForm()"
      >
        <i class="bi bi-plus-lg"></i>
        {{ $t('profile.dashboard.addAddress') }}
      </button>
    </div>

    <!-- Loading skeleton -->
    <div v-if="checkoutStore.addressesLoading" class="profile-card__body profile-card__body--addresses">
      <div v-for="n in 2" :key="n" class="profile-address-skeleton"></div>
    </div>

    <!-- Address form -->
    <AddressForm
      v-else-if="checkoutStore.isEditingAddress"
      :saving="checkoutStore.addressSaving"
      @save="handleSaveAddress"
      @cancel="checkoutStore.closeAddressForm()"
    />

    <!-- Empty state -->
    <div v-else-if="checkoutStore.savedAddresses.length === 0" class="profile-card__body profile-card__body--empty">
      <div class="profile-empty">
        <i class="bi bi-map"></i>
        <p>{{ $t('profile.dashboard.noAddresses') }}</p>
        <button
          type="button"
          class="profile-card__add-btn profile-card__add-btn--empty"
          @click="checkoutStore.openAddressForm()"
        >
          {{ $t('profile.dashboard.addAddress') }}
        </button>
      </div>
    </div>

    <!-- Address list -->
    <div v-else class="profile-card__body profile-card__body--addresses">
      <div class="profile-address-list pt-1">
        <AddressCard
          v-for="addr in checkoutStore.savedAddresses"
          :key="addr.id"
          :address="addr"
          @edit="checkoutStore.openAddressForm(addr)"
          @delete="handleDeleteAddress(addr.id)"
          @set-default="checkoutStore.setDefaultAddress(addr.id)"
        />
      </div>

      <!-- Add more button -->
      <button
        v-if="checkoutStore.savedAddresses.length > 0"
        type="button"
        class="profile-address-add-more"
        @click="checkoutStore.openAddressForm()"
      >
        <i class="bi bi-plus-lg"></i>
        {{ $t('profile.dashboard.addAddress') }}
      </button>
    </div>
  </div>

  <!-- Content Grid -->
  <div class="profile-grid">
    <!-- Recent Orders -->
    <div class="profile-card">
      <div class="profile-card__header">
        <h3 class="profile-card__title">{{ $t('profile.dashboard.recentOrdersTitle') }}</h3>
        <a :href="localePath('/orders')" class="profile-card__link">{{ $t('profile.common.seeAll') }} <i class="bi bi-chevron-right"></i></a>
      </div>
      <div v-if="recentOrders.orders.length === 0" class="profile-card__body profile-card__body--empty">
        <div class="profile-empty">
          <i class="bi bi-inbox"></i>
          <p>{{ $t('profile.dashboard.noOrders') }} <a :href="localePath('/')">{{ $t('profile.dashboard.shopNow') }}</a></p>
        </div>
      </div>
      <div v-else class="profile-card__body">
        <div v-for="order in recentOrders.orders" :key="order.id" class="profile-order-item">
          <div class="profile-order-item__header">
            <span class="profile-order-item__id">{{ $t('profile.orders.orderId') }}{{ order.id }}</span>
            <span class="profile-order-item__status" :class="`profile-order-item__status--${order.status.key}`">
              {{ order.status.label }}
            </span>
          </div>
          <div v-for="item in order.items" :key="item.id" class="profile-order-item__product">
            <img :src="item.image_url" :alt="item.name" class="profile-order-item__img" />
            <div class="profile-order-item__info">
              <p class="profile-order-item__name">{{ item.name }}</p>
              <p class="profile-order-item__price">{{ item.price_formatted }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Your Offers -->
    <div class="profile-card">
      <div class="profile-card__header">
        <h3 class="profile-card__title">{{ $t('profile.dashboard.yourOffersTitle') }}</h3>
        <a href="#" class="profile-card__link">{{ $t('profile.common.seeAll') }} <i class="bi bi-chevron-right"></i></a>
      </div>

      <!-- Loading skeleton -->
      <div v-if="offersLoading" class="profile-card__body">
        <div v-for="n in 3" :key="n" class="profile-offer-skeleton">
          <div class="profile-offer-skeleton__icon"></div>
          <div class="profile-offer-skeleton__content">
            <div class="profile-offer-skeleton__line profile-offer-skeleton__line--title"></div>
            <div class="profile-offer-skeleton__line"></div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="offers.items.length === 0" class="profile-card__body profile-card__body--empty">
        <div class="profile-empty">
          <i class="bi bi-inbox"></i>
          <p>{{ $t('profile.dashboard.noOffers') }} <a :href="localePath('/')">{{ $t('profile.dashboard.seeProducts') }}</a></p>
        </div>
      </div>

      <!-- Offer items -->
      <div v-else class="profile-card__body profile-card__body--offers">
        <!-- Voucher items -->
        <div
          v-for="item in offers.items.filter(i => i.itemType === 'voucher')"
          :key="item.id"
          class="profile-offer-voucher"
          :class="{ 'profile-offer-voucher--used': item.isUsed }"
        >
          <div class="profile-offer-voucher__value">
            <span class="profile-offer-voucher__value-text">{{ item.formattedValue }}</span>
            <span v-if="item.type === 'percentage'" class="profile-offer-voucher__value-label">GIẢM</span>
            <span v-else class="profile-offer-voucher__value-label">VOUCHER</span>
          </div>
          <div class="profile-offer-voucher__info">
            <div class="profile-offer-voucher__code-row">
              <span class="profile-offer-voucher__code">{{ item.code }}</span>
              <button
                v-if="item.code && !item.isUsed"
                type="button"
                class="profile-offer-voucher__copy"
                @click="copyVoucherCode(item.code)"
                :title="$t('profile.dashboard.copyCode')"
              >
                <i class="bi bi-copy"></i>
              </button>
            </div>
            <p v-if="item.description" class="profile-offer-voucher__desc">{{ item.description }}</p>
            <p v-if="item.expiredAt" class="profile-offer-voucher__expiry">
              <i class="bi bi-clock"></i>
              {{ $t('profile.dashboard.expires') }}: {{ formatExpiry(item.expiredAt) }}
            </p>
            <span v-if="item.isUsed" class="profile-offer-voucher__used-badge">{{ $t('profile.dashboard.used') }}</span>
          </div>
        </div>

        <!-- Benefit items -->
        <div
          v-for="item in offers.items.filter(i => i.itemType === 'benefit')"
          :key="item.id"
          class="profile-offer-benefit"
          :class="{ 'profile-offer-benefit--locked': item.isLocked }"
        >
          <div class="profile-offer-benefit__icon">
            <i :class="item.icon || 'bi bi-gift'"></i>
          </div>
          <div class="profile-offer-benefit__info">
            <p class="profile-offer-benefit__title">{{ item.title }}</p>
            <p v-if="item.description" class="profile-offer-benefit__desc">{{ item.description }}</p>
          </div>
          <div v-if="item.isLocked" class="profile-offer-benefit__lock">
            <i class="bi bi-lock-fill"></i>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Favorite Products -->
  <div class="profile-card">
    <div class="profile-card__header">
      <h3 class="profile-card__title">{{ $t('profile.dashboard.favoritesTitle') }}</h3>
      <button v-if="false" type="button" class="profile-card__link">{{ $t('profile.common.seeAll') }} <i class="bi bi-chevron-right"></i></button>
    </div>
    <div class="profile-card__body">
      <div v-if="favorites.items.length === 0" class="profile-card__body--empty" style="display:flex;justify-content:center;padding:24px 16px;">
        <div class="profile-empty">
          <i class="bi bi-inbox"></i>
          <p>{{ $t('profile.dashboard.noFavorites') }}</p>
        </div>
      </div>
      <div v-else class="profile-favorites">
        <article
          v-for="item in favorites.items"
          :key="item.id"
          class="profile-favorite-item"
        >
          <NuxtLink
            :to="getFavoriteProductUrl(item)"
            class="profile-favorite-link"
          >
            <img :src="item.image_url" :alt="item.name" loading="lazy" />
            <div class="profile-favorite-info">
              <div class="profile-favorite-name">{{ item.name }}</div>
              <div class="profile-favorite-price">
                <span class="profile-favorite-price-current">{{ item.current_price_formatted }}</span>
                <span v-if="item.original_price_formatted" class="profile-favorite-price-old">{{ item.original_price_formatted }}</span>
              </div>
            </div>
          </NuxtLink>
          <button
            type="button"
            class="profile-favorite-heart"
            :class="{ 'profile-favorite-heart--removing': isRemovingFavorite(item) }"
            :disabled="isRemovingFavorite(item)"
            :aria-label="$t('wishlist.remove')"
            @click="handleRemoveFavorite(item)"
          >
            <i class="bi bi-heart-fill"></i>
          </button>
        </article>
      </div>
    </div>
  </div>

  <!-- Featured Banners -->
  <div v-if="false" class="profile-card">
    <div class="profile-card__header">
      <h3 class="profile-card__title">Chương trình nổi bật</h3>
    </div>
    <div class="profile-card__body profile-card__body--banners">
      <div class="profile-banner-carousel">
        <a href="#" class="profile-banner-item">
          <img
            src="https://cdn2.cellphones.com.vn/690x300/https://dashboard.cellphones.com.vn/storage/edu-uu-dai-sinh-vien.jpg"
            alt="S-Student & S-Teacher"
            loading="lazy"
          />
        </a>
        <div class="profile-carousel-dots">
          <button type="button" class="profile-carousel-dot profile-carousel-dot--active"></button>
          <button type="button" class="profile-carousel-dot"></button>
          <button type="button" class="profile-carousel-dot"></button>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile App Download -->
  <div class="profile-card profile-card--mobile-app d-md-none">
    <p class="profile-mobile-app-text">Mua sắm dễ dàng - Ưu đãi ngập tràn cùng IrusGear</p>
    <div class="profile-mobile-app-content">
      <div class="profile-qr-wrap">
        <i class="bi bi-qr-code" style="font-size:36px;color:#a1a1aa;display:flex;align-items:center;justify-content:center;width:100%;height:100%"></i>
      </div>
      <div class="profile-store-links" style="flex-direction:row;gap:8px;">
        <a href="#" target="_blank" rel="nofollow" style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:#111;color:#fff;border-radius:8px;font-size:12px;font-weight:600;text-decoration:none;">
          <i class="bi bi-google-play"></i> Google Play
        </a>
        <a href="#" target="_blank" rel="nofollow" style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:#111;color:#fff;border-radius:8px;font-size:12px;font-weight:600;text-decoration:none;">
          <i class="bi bi-apple"></i> App Store
        </a>
      </div>
    </div>
  </div>
  </div>
</ProfileLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useLocalePath, useI18n } from '#imports'
import { storeToRefs } from 'pinia'
import { toast } from 'vue-sonner'
import { useProfileDashboardStore } from '@/stores/profileDashboardStore'
import { useCheckoutStore } from '@/stores/checkoutStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import ProfileLayout from '@/components/Common/ProfileLayout.vue'
import AddressCard from '@/components/Checkout/AddressCard.vue'
import AddressForm from '@/components/Checkout/AddressForm.vue'

const localePath = useLocalePath()
const { t } = useI18n()
const dashboardStore = useProfileDashboardStore()
const checkoutStore = useCheckoutStore()
const wishlistStore = useWishlistStore()
const { recentOrders, offers, favorites, isLoading, offersLoading } = storeToRefs(dashboardStore)

definePageMeta({
  layout: 'default',
  middleware: ['auth-guard'],
})

useHead({
  title: 'Tài khoản - IrusGear',
})

dashboardStore.fetchDashboard()
checkoutStore.fetchAddresses()

const handleDeleteAddress = async (id) => {
  try {
    await checkoutStore.deleteAddress(id)
    toast.success(t('checkout.addressDeleted'))
  } catch (e) {
    toast.error(e?.data?.message || t('checkout.deleteError'))
  }
}

const handleSaveAddress = async (addressData) => {
  try {
    if (checkoutStore.editingAddressId) {
      await checkoutStore.updateAddress(checkoutStore.editingAddressId, addressData)
      toast.success(t('checkout.addressUpdated'))
    } else {
      await checkoutStore.saveAddress(addressData)
      toast.success(t('checkout.addressAdded'))
    }
  } catch (e) {
    // Backend trả { code, message } ở root level, không phải trong data
    const message = e?.message || e?.data?.message || t('checkout.addressError')
    toast.error(message)
  }
}

const showAddressNotice = ref(true)
const removingFavoriteIds = ref(new Set())

const getFavoriteProductUrl = (item) => {
  if (item?.url) return item.url
  if (item?.slug) return localePath(`/products/${item.slug}`)
  return localePath("/")
}

const getFavoriteId = (item) => {
  if (item?.id == null || item.id === "") return null
  return String(item.id)
}

const isRemovingFavorite = (item) => {
  const favoriteId = typeof item === "object" ? getFavoriteId(item) : String(item || "")
  return favoriteId ? removingFavoriteIds.value.has(favoriteId) : false
}

const handleRemoveFavorite = async (item) => {
  const favoriteId = getFavoriteId(item)
  if (!favoriteId || isRemovingFavorite(item)) return

  removingFavoriteIds.value = new Set([...removingFavoriteIds.value, favoriteId])

  try {
    await wishlistStore.removeItem(favoriteId)
    dashboardStore.removeFavoriteItem(favoriteId)
    toast.success(t("wishlist.removed"))
  } catch (e) {
    toast.error(e?.data?.message || e?.message || t("wishlist.removeError"))
  } finally {
    const nextIds = new Set(removingFavoriteIds.value)
    nextIds.delete(favoriteId)
    removingFavoriteIds.value = nextIds
  }
}

const copyVoucherCode = (code) => {
  if (!code) return
  navigator.clipboard.writeText(code).then(() => {
    // Could show a toast here
  }).catch(() => {
    // Fallback
    const el = document.createElement("textarea")
    el.value = code
    document.body.appendChild(el)
    el.select()
    document.execCommand("copy")
    document.body.removeChild(el)
  })
}

const formatExpiry = (isoDate) => {
  if (!isoDate) return ""
  try {
    const date = new Date(isoDate)
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  } catch {
    return isoDate
  }
}
</script>

<style scoped>
/* ── Page wrapper ─────────────────────── */
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ── Notice Banner ─────────────────────── */
.profile-notice {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 10px;
}

.profile-notice__icon {
  color: #3b82f6;
  font-size: 18px;
  flex-shrink: 0;
  display: flex;
}

.profile-notice__text {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  margin: 0;
}

.profile-notice__btn {
  flex-shrink: 0;
  padding: 6px 14px;
  border: 1px solid #fff;
  border-radius: 8px;
  background: #fff;
  font-size: 13px;
  font-weight: 500;
  color: #3b82f6;
  cursor: pointer;
  transition: background 0.15s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.profile-notice__btn:hover {
  background: #f1f5f9;
}

.profile-notice__close {
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  font-size: 14px;
  padding: 4px;
  display: flex;
  align-items: center;
  transition: color 0.15s ease;
}

.profile-notice__close:hover {
  color: #18181b;
}

/* ── Content Grid ─────────────────────── */
.profile-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  padding: 0;
}

/* ── Card ─────────────────────────────── */
.profile-card {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  padding: 16px;
}

.profile-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.profile-card__title {
  font-size: 15px;
  font-weight: 700;
  color: #18181b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.profile-card__title i {
  color: var(--irus-color-accent);
  font-size: 18px;
}

.profile-card__add-btn {
  align-items: center;
  background: var(--irus-color-accent);
  border: none;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  font-size: 12px;
  font-weight: 600;
  gap: 4px;
  padding: 6px 12px;
  transition: background 0.15s ease;
  white-space: nowrap;
}
.profile-card__add-btn:hover {
  background: var(--irus-color-accent-hover);
}

.profile-card__add-btn i {
  font-size: 12px;
  line-height: 1;
}

.profile-card__add-btn--empty {
  background: #fff;
  border: 1px solid var(--irus-color-border);
  border-radius: 10px;
  color: var(--irus-color-accent);
  min-height: 36px;
  padding: 0 14px;
}

.profile-card__add-btn--empty:hover {
  background: var(--irus-color-accent-soft);
  border-color: var(--irus-color-border-strong);
  color: var(--irus-color-accent-hover);
}

.profile-card__add-btn--empty i {
  font-size: 13px;
}

.profile-card__link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease;
}

.profile-card__link:hover {
  color: #1d4ed8;
}

.profile-card__link i {
  font-size: 12px;
}

.profile-card__body--empty {
  display: flex;
  justify-content: center;
  padding: 24px 16px;
}

.profile-card__body--banners {
  padding: 0;
}

/* ── Empty State ─────────────────────── */
.profile-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.profile-empty img {
  width: 88px;
  height: auto;
  object-fit: contain;
}

.profile-empty i {
  font-size: 48px;
  color: #d4d4d8;
}

.profile-empty p {
  font-size: 13px;
  color: #a1a1aa;
  margin: 0;
  line-height: 1.6;
}

.profile-empty p a {
  color: var(--irus-color-accent);
  text-decoration: none;
  font-weight: 500;
}

.profile-empty p a:hover {
  text-decoration: underline;
}

/* ── Recent Order Item ───────────────── */
.profile-order-item {
  padding: 12px 0;
  border-bottom: 1px solid #f4f4f5;
}
.profile-order-item:last-child {
  border-bottom: none;
}
.profile-order-item__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.profile-order-item__id {
  font-size: 13px;
  font-weight: 700;
  color: #18181b;
}
.profile-order-item__status {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
}
.profile-order-item__status--pending { color: #d97706; background: #fffbeb; }
.profile-order-item__status--processing { color: #3b82f6; background: #eff6ff; }
.profile-order-item__status--shipped, .profile-order-item__status--delivering { color: #7c3aed; background: #f5f3ff; }
.profile-order-item__status--delivered { color: #16a34a; background: #f0fdf4; }
.profile-order-item__status--cancelled { color: #dc2626; background: #fef2f2; }
.profile-order-item__product {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}
.profile-order-item__img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
  flex-shrink: 0;
}
.profile-order-item__info {
  flex: 1;
  min-width: 0;
}
.profile-order-item__name {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  margin: 0 0 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.profile-order-item__price {
  font-size: 12px;
  color: var(--irus-color-accent);
  font-weight: 600;
  margin: 0;
}

/* ── Favorites ───────────────────────── */
.profile-favorites {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.profile-favorites::-webkit-scrollbar {
  height: 4px;
}

.profile-favorites::-webkit-scrollbar-thumb {
  background: #e4e4e7;
  border-radius: 999px;
}

.profile-favorite-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  flex-shrink: 0;
  min-width: 240px;
  position: relative;
  transition: border-color 0.15s ease;
}

.profile-favorite-item:hover {
  border-color: var(--irus-color-border-strong);
}

.profile-favorite-item img {
  width: 48px;
  height: 48px;
  object-fit: contain;
  flex-shrink: 0;
}

.profile-favorite-link {
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  gap: 10px;
  min-width: 0;
  padding-right: 24px;
  text-decoration: none;
}

.profile-favorite-info {
  flex: 1;
  min-width: 0;
}

.profile-favorite-name {
  font-size: 13px;
  font-weight: 700;
  color: #18181b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.4;
}

.profile-favorite-price {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.profile-favorite-price-current {
  font-size: 13px;
  font-weight: 700;
  color: var(--irus-color-accent);
}

.profile-favorite-price-old {
  font-size: 11px;
  color: #a1a1aa;
  text-decoration: line-through;
}

.profile-favorite-heart {
  align-items: center;
  background: none;
  border: none;
  position: absolute;
  bottom: 8px;
  right: 8px;
  color: #3b82f6;
  cursor: pointer;
  display: inline-flex;
  font-size: 14px;
  height: auto;
  justify-content: center;
  padding: 0;
  transition: color 0.15s ease;
  width: auto;
}

.profile-favorite-heart:hover:not(:disabled) {
  color: #1d4ed8;
}

.profile-favorite-heart:disabled {
  cursor: wait;
  opacity: 1;
}

.profile-favorite-heart--removing {
  color: #a1a1aa;
}

.profile-favorite-heart i {
  color: inherit;
  line-height: 1;
}

/* ── Offers ─────────────────────────── */
.profile-card__body--offers {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Voucher */
.profile-offer-voucher {
  display: flex;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.15s ease;
}
.profile-offer-voucher:hover {
  border-color: var(--irus-color-border-strong);
}
.profile-offer-voucher--used {
  opacity: 0.5;
  pointer-events: none;
}
.profile-offer-voucher__value {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 72px;
  background: var(--irus-color-surface-strong);
  border-radius: 8px;
  padding: 8px 6px;
  gap: 2px;
}
.profile-offer-voucher__value-text {
  font-size: 16px;
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
}
.profile-offer-voucher__value-label {
  font-size: 9px;
  font-weight: 700;
  color: rgba(255,255,255,0.85);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.profile-offer-voucher__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.profile-offer-voucher__code-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.profile-offer-voucher__code {
  font-size: 13px;
  font-weight: 700;
  color: #18181b;
  letter-spacing: 0.5px;
}
.profile-offer-voucher__copy {
  background: none;
  border: none;
  cursor: pointer;
  color: #3b82f6;
  padding: 2px 4px;
  font-size: 14px;
  display: flex;
  align-items: center;
  transition: color 0.15s ease;
}
.profile-offer-voucher__copy:hover {
  color: #1d4ed8;
}
.profile-offer-voucher__desc {
  font-size: 12px;
  color: #71717a;
  margin: 0;
  line-height: 1.5;
}
.profile-offer-voucher__expiry {
  font-size: 11px;
  color: #a1a1aa;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}
.profile-offer-voucher__expiry i {
  font-size: 11px;
}
.profile-offer-voucher__used-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 600;
  color: #a1a1aa;
  background: #f4f4f5;
  border-radius: 6px;
  padding: 1px 6px;
  width: fit-content;
}

/* Benefit */
.profile-offer-benefit {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  transition: border-color 0.15s ease;
  position: relative;
}
.profile-offer-benefit:hover {
  border-color: var(--irus-color-border-strong);
}
.profile-offer-benefit--locked {
  opacity: 0.6;
}
.profile-offer-benefit__icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--irus-color-accent-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 16px;
  color: var(--irus-color-accent);
}
.profile-offer-benefit__info {
  flex: 1;
  min-width: 0;
}
.profile-offer-benefit__title {
  font-size: 13px;
  font-weight: 600;
  color: #18181b;
  margin: 0 0 2px;
}
.profile-offer-benefit__desc {
  font-size: 12px;
  color: #71717a;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.profile-offer-benefit__lock {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #a1a1aa;
  font-size: 12px;
}

/* Loading skeleton */
.profile-offer-skeleton {
  display: flex;
  gap: 12px;
  padding: 12px;
  border: 1px solid #f4f4f5;
  border-radius: 12px;
}
.profile-offer-skeleton__icon {
  width: 72px;
  min-width: 72px;
  height: 56px;
  border-radius: 8px;
  background: #f4f4f5;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}
.profile-offer-skeleton__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
}
.profile-offer-skeleton__line {
  height: 10px;
  border-radius: 4px;
  background: #f4f4f5;
  width: 70%;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}
.profile-offer-skeleton__line--title {
  height: 13px;
  width: 50%;
}
.profile-offer-skeleton__line:last-child {
  width: 85%;
}
@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Banner Carousel ──────────────────── */
.profile-banner-carousel {
  position: relative;
}

.profile-banner-item {
  display: block;
  border-radius: 12px;
  overflow: hidden;
}

.profile-banner-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
}

.profile-carousel-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 10px;
}

.profile-carousel-dot {
  width: 20px;
  height: 4px;
  border-radius: 999px;
  background: var(--irus-color-accent);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: width 0.2s ease;
}

.profile-carousel-dot:not(.profile-carousel-dot--active) {
  width: 8px;
  background: #e4e4e7;
}

/* ── Mobile App ──────────────────────── */
.profile-card--mobile-app {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.profile-mobile-app-text {
  font-size: 13px;
  color: #71717a;
  margin: 0;
}

.profile-mobile-app-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-qr-wrap {
  width: 88px;
  height: 88px;
  background: #f4f4f5;
  border-radius: 10px;
  padding: 6px;
  flex-shrink: 0;
}

.profile-qr-wrap img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.profile-store-links {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.profile-store-links a img {
  height: 36px;
  width: auto;
}

/* ── Addresses ───────────────────────── */
.profile-card__body--addresses {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* AddressCard inside profile — full width instead of fixed 300px */
.profile-card__body--addresses :deep(.address-card) {
  min-width: 100%;
  max-width: 100%;
  flex-shrink: 1;
  flex-grow: 1;
}

.profile-address-list {
  max-height: 360px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.profile-address-add-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 10px;
  border: 1px dashed #d4d4d8;
  border-radius: 10px;
  background: none;
  font-size: 13px;
  font-weight: 500;
  color: #71717a;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;
}
.profile-address-add-more:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}
.profile-address-add-more i {
  font-size: 12px;
}

/* Address skeleton — matches AddressSection shimmer */
.profile-address-skeleton {
  background: linear-gradient(90deg, #f4f4f5 25%, #e4e4e7 50%, #f4f4f5 75%);
  background-size: 200% 100%;
  border-radius: 12px;
  height: 90px;
  animation: shimmer 1.5s infinite;
}

/* ── Responsive ──────────────────────── */
@media (max-width: 575.98px) {
  .profile-page {
    gap: 8px;
  }

  .profile-notice {
    flex-wrap: wrap;
    gap: 8px;
  }

  .profile-notice__text {
    font-size: 13px;
    width: 100%;
    order: 2;
  }

  .profile-notice__btn {
    order: 3;
  }

  .profile-notice__close {
    order: 1;
    margin-left: auto;
  }

  .profile-card {
    padding: 14px;
    border-radius: 14px;
  }

  .profile-card__body--empty {
    padding: 16px 12px;
  }

  .profile-empty img {
    width: 80px;
  }

  .profile-banner-item img {
    height: 100px;
    border-radius: 10px;
  }

  .profile-favorite-item {
    min-width: 200px;
  }

  .profile-favorite-item img {
    width: 40px;
    height: 40px;
  }

  .profile-favorite-name {
    font-size: 12px;
  }

  .profile-favorite-price-current {
    font-size: 12px;
  }
}

@media (min-width: 992px) {
  .profile-page {
    gap: 16px;
  }

  .profile-grid {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .profile-banner-item img {
    height: 140px;
  }
}

@media (min-width: 1200px) {
  .profile-banner-item img {
    height: 160px;
  }
}

/* ── Bottom Clearance: Mobile Bottom Nav ─── */
@media (max-width: 991.98px) {
  .profile-page {
    padding-bottom: 110px;
  }
}

@media (max-width: 767.98px) {
  .profile-page {
    padding-bottom: 100px;
  }
}

@media (max-width: 575.98px) {
  .profile-page {
    padding-bottom: 90px;
  }
}

@media (max-width: 480px) {
  .profile-page {
    padding-bottom: 80px;
  }
}
</style>
