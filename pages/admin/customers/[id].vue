<template>
  <div class="customer-detail-page">
    <!-- Not found -->
    <div v-if="!customer" class="admin-card-shell" style="text-align:center;padding:48px">
      <i class="bi bi-exclamation-triangle" style="font-size:2.4rem;color:var(--admin-warning)"></i>
      <h3 style="margin:12px 0 4px">{{ $t('admin.customers.customerNotFound') }}</h3>
      <nuxt-link to="/admin/customers" class="admin-primary-button" style="margin-top:12px">{{ $t('admin.customers.backToCustomers') }}</nuxt-link>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="detail-header">
        <div class="header-left">
          <nuxt-link to="/admin/customers" class="back-link"><i class="bi bi-arrow-left"></i></nuxt-link>
          <div>
            <h2 class="page-title">{{ $t('admin.customers.customerIdHeader', { code: customer.customerCode }) }}</h2>
            <p class="page-sub">{{ $t('admin.customers.memberSince') }} {{ formatDateShort(customer.createdAt) }}</p>
          </div>
        </div>
        <button class="admin-danger-button" type="button" @click="handleDelete">
          <i class="bi bi-trash"></i> {{ $t('admin.customers.deleteCustomer') }}
        </button>
      </div>

      <!-- Two-column layout -->
      <div class="detail-grid">
        <!-- LEFT COLUMN -->
        <div class="detail-col-left">
          <!-- Profile Summary Card -->
          <div class="admin-card-shell profile-card">
            <div class="profile-top">
              <img :src="customer.avatar" :alt="customer.name" class="profile-avatar" />
              <h3 class="profile-name">{{ customer.name }}</h3>
              <p class="profile-code">{{ customer.customerCode }}</p>
              <div class="profile-stats">
                <div class="stat">
                  <strong>{{ customer.orders.toLocaleString() }}</strong>
                  <small>{{ $t('admin.customers.orders') }}</small>
                </div>
                <div class="stat-divider"></div>
                <div class="stat">
                  <strong>{{ formatCompact(customer.totalSpent) }}</strong>
                  <small>{{ $t('admin.customers.spent') }}</small>
                </div>
              </div>
            </div>

            <!-- Details list -->
            <div class="details-list">
              <h4 class="section-title">{{ $t('admin.customers.details') }}</h4>
              <div class="detail-row">
                <span class="detail-label">{{ $t('admin.customers.username') }}</span>
                <span class="detail-value">{{ customer.name.toLowerCase().replace(' ', '.') }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">{{ $t('admin.customers.email') }}</span>
                <span class="detail-value">{{ customer.email }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">{{ $t('admin.customers.statusLabel') }}</span>
                <AdminStatusBadge :label="statusLabel(customer.status)" :variant="statusVariant(customer.status)" />
              </div>
              <div class="detail-row">
                <span class="detail-label">{{ $t('admin.customers.contact') }}</span>
                <span class="detail-value">{{ customer.phone }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">{{ $t('admin.customers.countryLabel') }}</span>
                <span class="detail-value country-val">
                  <img :src="`https://flagcdn.com/20x15/${customer.countryCode.toLowerCase()}.png`" :alt="customer.country" class="flag-sm" />
                  {{ customer.country }}
                </span>
              </div>
              <button class="admin-primary-button edit-details-btn" type="button" @click="handleEditDetails">
                <i class="bi bi-pencil"></i> {{ $t('admin.customers.editDetails') }}
              </button>
            </div>
          </div>

          <!-- IrusGear Loyalty Card -->
          <div class="loyalty-card" :class="`tier-${customer.loyaltyTier}`">
            <div class="loyalty-header">
              <span class="loyalty-badge">{{ loyaltyTierLabel.toUpperCase() }}</span>
              <i class="bi bi-gem loyalty-icon"></i>
            </div>
            <div class="loyalty-body">
              <p class="loyalty-brand">IrusGear</p>
              <h3 class="loyalty-title">{{ $t('admin.customers.loyaltyProgram') }}</h3>
              <div class="loyalty-points">
                <strong>{{ customer.loyaltyPoints.toLocaleString() }}</strong>
                <small>{{ $t('admin.customers.pointsEarned') }}</small>
              </div>
              <div class="loyalty-progress-track">
                <div class="loyalty-progress-bar" :style="{ width: loyaltyProgress + '%' }"></div>
              </div>
              <p class="loyalty-next">{{ loyaltyNextTier }}</p>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN -->
        <div class="detail-col-right">
          <!-- Tabs -->
          <div class="admin-card-shell tabs-card">
            <div class="tabs-nav">
              <button
                v-for="tab in tabs"
                :key="tab.key"
                class="tab-btn"
                :class="{ active: activeTab === tab.key }"
                @click="activeTab = tab.key"
              >
                <i class="bi" :class="tab.icon"></i>
                {{ tab.label }}
              </button>
            </div>

            <!-- Overview Tab -->
            <div v-if="activeTab === 'overview'" class="tab-content">
              <div class="overview-cards">
                <div class="overview-item">
                  <div class="ov-icon ov-blue"><i class="bi bi-wallet2"></i></div>
                  <div>
                    <small>{{ $t('admin.customers.accountBalance') }}</small>
                    <strong>{{ formatCurrency(customer.accountBalance) }}</strong>
                  </div>
                </div>
                <div class="overview-item">
                  <div class="ov-icon ov-purple"><i class="bi bi-award"></i></div>
                  <div>
                    <small>{{ $t('admin.customers.loyaltyProgram') }}</small>
                    <strong>{{ loyaltyTierLabel }} · {{ customer.loyaltyPoints.toLocaleString() }} {{ $t('admin.customers.pts') }}</strong>
                  </div>
                </div>
                <div class="overview-item">
                  <div class="ov-icon ov-pink"><i class="bi bi-heart"></i></div>
                  <div>
                    <small>{{ $t('admin.customers.wishlist') }}</small>
                    <strong>{{ customer.wishlistCount }} {{ $t('admin.customers.items') }}</strong>
                  </div>
                </div>
                <div class="overview-item">
                  <div class="ov-icon ov-green"><i class="bi bi-ticket-perforated"></i></div>
                  <div>
                    <small>{{ $t('admin.customers.coupons') }}</small>
                    <strong>{{ customer.couponCount }} {{ $t('admin.customers.available') }}</strong>
                  </div>
                </div>
              </div>

              <!-- Orders placed -->
              <div class="orders-section">
                <h4 class="section-title">{{ $t('admin.customers.ordersPlaced') }}</h4>
                <div class="mini-table-scroll">
                  <table class="mini-table">
                    <thead>
                      <tr>
                        <th>{{ $t('admin.customers.order') }}</th>
                        <th>{{ $t('admin.customers.date') }}</th>
                        <th>{{ $t('admin.customers.status') }}</th>
                        <th style="text-align:right">{{ $t('admin.customers.total') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="o in customerOrders" :key="o.id">
                        <td><nuxt-link :to="`/admin/orders/${o.id}`" class="order-link">{{ o.orderCode }}</nuxt-link></td>
                        <td class="muted-text">{{ formatDateShort(o.date) }}</td>
                        <td><AdminStatusBadge :label="paymentLabel(o.paymentStatus)" :variant="paymentVariant(o.paymentStatus)" /></td>
                        <td style="text-align:right"><strong>{{ formatCurrency(o.total) }}</strong></td>
                      </tr>
                      <tr v-if="customerOrders.length === 0">
                        <td colspan="4" style="text-align:center;color:var(--admin-muted);padding:24px">{{ $t('admin.customers.noOrdersFound') }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Security Tab -->
            <div v-if="activeTab === 'security'" class="tab-content">
              <div class="security-section">
                <h4 class="section-title">{{ $t('admin.customers.changePassword') }}</h4>
                <div class="field-row-2">
                  <div class="field"><label class="field-label">{{ $t('admin.customers.newPassword') }}</label><input type="password" class="admin-control field-input" placeholder="••••••••" /></div>
                  <div class="field"><label class="field-label">{{ $t('admin.customers.confirmPassword') }}</label><input type="password" class="admin-control field-input" placeholder="••••••••" /></div>
                </div>
                <button class="admin-primary-button btn-sm" type="button" style="margin-top:12px">{{ $t('admin.customers.updatePassword') }}</button>
              </div>
              <div class="security-section">
                <h4 class="section-title">{{ $t('admin.customers.twoFactor') }}</h4>
                <div class="toggle-field">
                  <div class="toggle-info">
                    <strong>{{ $t('admin.customers.enable2fa') }}</strong>
                    <small>{{ $t('admin.customers.enable2faDesc') }}</small>
                  </div>
                  <label class="stock-toggle"><input type="checkbox" /><span class="toggle-track"></span></label>
                </div>
              </div>
            </div>

            <!-- Address & Billing Tab -->
            <div v-if="activeTab === 'address'" class="tab-content">
              <div class="address-grid">
                <div class="address-box">
                  <h4 class="section-title">{{ $t('admin.orders.shippingAddress') }}</h4>
                  <p>{{ customer.shippingAddress.line1 }}</p>
                  <p>{{ customer.shippingAddress.city }}, {{ customer.shippingAddress.country }}</p>
                  <p v-if="customer.shippingAddress.postalCode">{{ customer.shippingAddress.postalCode }}</p>
                  <button class="admin-secondary-button btn-sm" type="button" style="margin-top:10px"><i class="bi bi-pencil"></i> {{ $t('admin.customers.edit') }}</button>
                </div>
                <div class="address-box">
                  <h4 class="section-title">{{ $t('admin.orders.billingAddress') }}</h4>
                  <p>{{ customer.billingAddress.line1 }}</p>
                  <p>{{ customer.billingAddress.city }}, {{ customer.billingAddress.country }}</p>
                  <p v-if="customer.billingAddress.postalCode">{{ customer.billingAddress.postalCode }}</p>
                  <button class="admin-secondary-button btn-sm" type="button" style="margin-top:10px"><i class="bi bi-pencil"></i> {{ $t('admin.customers.edit') }}</button>
                </div>
              </div>
            </div>

            <!-- Notifications Tab -->
            <div v-if="activeTab === 'notifications'" class="tab-content">
              <div v-for="n in notificationSettings" :key="n.key" class="toggle-field">
                <div class="toggle-info">
                  <strong>{{ n.label }}</strong>
                  <small>{{ n.description }}</small>
                </div>
                <label class="stock-toggle"><input type="checkbox" :checked="n.default" /><span class="toggle-track"></span></label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHead, useRoute, useRouter, useI18n } from '#imports'
import { useAdminStore } from '@/stores/adminStore'
import AdminStatusBadge from '@/components/Admin/ui/AdminStatusBadge.vue'
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'admin' })
const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const admin = useAdminStore()

const customerId = computed(() => Number(route.params.id))
const customer = ref(null)

useHead({ title: () => customer.value ? t('admin.customers.customerPageTitle', { code: customer.value.customerCode }) : t('admin.customers.loadingCustomer') })

const activeTab = ref('overview')

const tabs = computed(() => [
  { key: 'overview', label: t('admin.customers.tabOverview'), icon: 'bi-grid' },
  { key: 'security', label: t('admin.customers.tabSecurity'), icon: 'bi-shield-lock' },
  { key: 'address', label: t('admin.customers.tabAddress'), icon: 'bi-geo-alt' },
  { key: 'notifications', label: t('admin.customers.tabNotifications'), icon: 'bi-bell' },
])

const notificationSettings = computed(() => [
  { key: 'email_order', label: t('admin.customers.notifEmailOrder'), description: t('admin.customers.notifEmailOrderDesc'), default: true },
  { key: 'email_promo', label: t('admin.customers.notifEmailPromo'), description: t('admin.customers.notifEmailPromoDesc'), default: true },
  { key: 'email_account', label: t('admin.customers.notifEmailAccount'), description: t('admin.customers.notifEmailAccountDesc'), default: false },
  { key: 'sms_order', label: t('admin.customers.notifSmsOrder'), description: t('admin.customers.notifSmsOrderDesc'), default: false },
])

/* ── customer orders ── */
const customerOrders = ref([])
const fetchCustomerOrders = async () => {
  const res = await admin.fetchList(`customers/${customerId.value}/orders`, { per_page: 5 })
  if (res?.data) {
    customerOrders.value = res.data.map(o => ({
      id: o.id,
      orderCode: o.order_number,
      date: o.created_at,
      paymentStatus: o.payment?.status || 'pending',
      total: o.pricing?.total || 0,
    }))
  }
}

/* ── loyalty ── */
const loyaltyTierLabel = computed(() => {
  if (!customer.value) return ''
  const tier = customer.value.loyaltyTier
  if (tier === 'platinum') return t('admin.customers.platinumTier')
  if (tier === 'gold') return t('admin.customers.goldTier')
  return t('admin.customers.standardTier')
})
const loyaltyProgress = computed(() => {
  if (!customer.value) return 0
  const max = customer.value.loyaltyTier === 'platinum' ? 10000 : customer.value.loyaltyTier === 'gold' ? 5000 : 2000
  return Math.min(100, (customer.value.loyaltyPoints / max) * 100)
})
const loyaltyNextTier = computed(() => {
  if (!customer.value) return ''
  if (customer.value.loyaltyTier === 'platinum') return t('admin.customers.highestTier')
  const nextKey = customer.value.loyaltyTier === 'gold' ? 'platinumTier' : 'goldTier'
  const next = t(`admin.customers.${nextKey}`)
  const max = customer.value.loyaltyTier === 'gold' ? 10000 : 2000
  const remaining = Math.max(0, max - customer.value.loyaltyPoints)
  return t('admin.customers.ptsToNext', { pts: remaining.toLocaleString(), tier: next })
})

/* ── helpers ── */
const formatCurrency = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
const formatCompact = (n) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M ₫'
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K ₫'
  return n.toLocaleString() + ' ₫'
}
const formatDateShort = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

const statusLabel = (s) => ({
  active: t('admin.status.active'),
  inactive: t('admin.status.inactive'),
  blocked: t('admin.status.blocked'),
}[s] || s)
const statusVariant = (s) => ({ active: 'success', inactive: 'neutral', blocked: 'danger' }[s] || 'neutral')
const paymentLabel = (s) => ({
  pending: t('admin.status.pending'),
  paid: t('admin.status.paid'),
  failed: t('admin.status.failed'),
  cancelled: t('admin.status.cancelled'),
  refunded: t('admin.status.refunded'),
}[s] || s)
const paymentVariant = (s) => ({ pending: 'warning', paid: 'success', failed: 'danger', cancelled: 'neutral', refunded: 'info' }[s] || 'neutral')

const handleDelete = async () => {
  if (confirm(t('admin.customers.confirmDelete', { code: customer.value?.customerCode }))) {
    try {
      await admin.remove('customers', customerId.value)
      toast.success(t('admin.customers.deleteSuccess'))
      router.push('/admin/customers')
    } catch (e) {
      toast.error(t('admin.customers.deleteFailed', { msg: e.message }))
    }
  }
}
const handleEditDetails = () => toast.info(t('admin.customers.editDetailsMock'))

const mapCustomerDetail = (c) => {
  const loyalty = c.member_rank || { name_en: 'Standard', threshold: 0 }
  return {
    id: c.id,
    customerCode: `#CUS${c.id}`,
    createdAt: c.member_since || c.created_at,
    name: c.full_name || c.name,
    email: c.email,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(c.full_name || c.name)}&background=random`,
    orders: c.orders || 0,
    totalSpent: c.total_spent || 0,
    status: c.status || 'active',
    phone: c.phone || t('admin.orders.notAvailable'),
    country: c.country || t('admin.customers.defaultCountry'),
    countryCode: 'vn',
    loyaltyTier: loyalty.name_en?.toLowerCase() || 'standard',
    loyaltyPoints: c.total_spent || 0,
    accountBalance: c.account_balance || 0,
    wishlistCount: c.wishlist_count || 0,
    couponCount: c.coupons_count || 0,
    shippingAddress: c.default_address || {},
    billingAddress: c.default_address || {},
  }
}

const fetchCustomerDetail = async () => {
  const res = await admin.fetchOne(`customers/${customerId.value}`)
  if (res?.data) {
    customer.value = mapCustomerDetail(res.data)
  }
}

onMounted(() => {
  fetchCustomerDetail()
  fetchCustomerOrders()
})
</script>

<style scoped>
.customer-detail-page { max-width: 1560px; }

/* Header */
.detail-header {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  margin-bottom: 24px; flex-wrap: wrap;
}
.header-left { display: flex; align-items: center; gap: 14px; }
.back-link {
  width: 40px; height: 40px; border-radius: 8px; background: var(--admin-surface);
  border: 1px solid var(--admin-border); display: flex; align-items: center; justify-content: center;
  color: var(--admin-text); text-decoration: none; font-size: 1.1rem; flex: 0 0 auto;
}
.back-link:hover { background: var(--admin-surface-soft); }
.page-title { margin: 0; font-size: 1.25rem; font-weight: 700; color: var(--admin-text); }
.page-sub { margin: 2px 0 0; color: var(--admin-muted); font-size: 0.86rem; }

/* Grid */
.detail-grid { display: grid; grid-template-columns: 340px 1fr; gap: 20px; }
.detail-col-left, .detail-col-right { display: flex; flex-direction: column; gap: 20px; }

/* Profile Card */
.profile-card { overflow: hidden; }
.profile-top { padding: 28px 22px; text-align: center; border-bottom: 1px solid var(--admin-border); }
.profile-avatar { width: 80px; height: 80px; border-radius: 999px; object-fit: cover; margin-bottom: 12px; border: 3px solid var(--admin-border); }
.profile-name { margin: 0; font-size: 1.12rem; font-weight: 700; color: var(--admin-text); }
.profile-code { margin: 4px 0 16px; color: var(--admin-muted); font-size: 0.84rem; }
.profile-stats { display: flex; align-items: center; justify-content: center; gap: 18px; }
.stat { text-align: center; }
.stat strong { display: block; font-size: 1.05rem; color: var(--admin-text); }
.stat small { color: var(--admin-muted); font-size: 0.78rem; }
.stat-divider { width: 1px; height: 32px; background: var(--admin-border); }

/* Details list */
.details-list { padding: 20px 22px; }
.section-title { margin: 0 0 14px; font-size: 0.92rem; font-weight: 700; color: var(--admin-text); }
.detail-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 0; border-bottom: 1px solid var(--admin-surface-soft); }
.detail-row:last-of-type { border-bottom: 0; }
.detail-label { font-size: 0.84rem; font-weight: 600; color: var(--admin-muted); white-space: nowrap; }
.detail-value { font-size: 0.88rem; color: var(--admin-text); text-align: right; word-break: break-all; }
.country-val { display: inline-flex; align-items: center; gap: 6px; }
.flag-sm { width: 18px; height: 13px; border-radius: 2px; }
.edit-details-btn { width: 100%; justify-content: center; margin-top: 16px; }

/* Loyalty Card */
.loyalty-card {
  border-radius: var(--admin-radius); padding: 22px; color: #fff; position: relative; overflow: hidden;
}
.tier-standard { background: linear-gradient(135deg, #4b4b59, #2f2f3d); }
.tier-gold { background: linear-gradient(135deg, #c79826, #a07b1a); }
.tier-platinum { background: linear-gradient(135deg, #6c63ff, #4834d4); }

.loyalty-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.loyalty-badge { padding: 3px 10px; border-radius: 5px; background: rgba(255,255,255,0.2); font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; }
.loyalty-icon { font-size: 1.4rem; opacity: 0.7; }
.loyalty-body {}
.loyalty-brand { margin: 0 0 2px; font-size: 0.76rem; opacity: 0.7; font-weight: 600; letter-spacing: 0.05em; }
.loyalty-title { margin: 0 0 12px; font-size: 1.06rem; font-weight: 700; }
.loyalty-points { margin-bottom: 10px; }
.loyalty-points strong { font-size: 1.5rem; }
.loyalty-points small { margin-left: 6px; font-size: 0.8rem; opacity: 0.7; }
.loyalty-progress-track { width: 100%; height: 6px; border-radius: 999px; background: rgba(255,255,255,0.2); overflow: hidden; }
.loyalty-progress-bar { height: 100%; border-radius: 999px; background: #fff; transition: width 0.6s ease; }
.loyalty-next { margin: 8px 0 0; font-size: 0.78rem; opacity: 0.7; }

/* Tabs */
.tabs-card { overflow: visible; }
.tabs-nav {
  display: flex; border-bottom: 1px solid var(--admin-border); padding: 0 22px; gap: 0; overflow-x: auto;
}
.tab-btn {
  padding: 14px 16px; border: 0; border-bottom: 2px solid transparent; background: none;
  color: var(--admin-muted); font-weight: 600; font-size: 0.88rem; display: inline-flex;
  align-items: center; gap: 7px; white-space: nowrap; transition: all 0.15s;
}
.tab-btn:hover { color: var(--admin-text); }
.tab-btn.active { color: var(--admin-text); border-bottom-color: var(--admin-primary); }

.tab-content { padding: 22px; }

/* Overview cards */
.overview-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 24px; }
.overview-item {
  display: flex; align-items: center; gap: 14px; padding: 16px;
  border: 1px solid var(--admin-border); border-radius: 8px;
}
.ov-icon { width: 42px; height: 42px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex: 0 0 auto; }
.ov-blue { background: rgba(0,207,232,0.14); color: #00a9c0; }
.ov-purple { background: rgba(108,99,255,0.14); color: #6c63ff; }
.ov-pink { background: rgba(255,76,81,0.14); color: var(--admin-danger); }
.ov-green { background: rgba(40,199,111,0.14); color: var(--admin-success); }
.overview-item small { display: block; color: var(--admin-muted); font-size: 0.78rem; margin-bottom: 2px; }
.overview-item strong { font-size: 0.92rem; color: var(--admin-text); }

/* Mini table */
.orders-section { margin-top: 4px; }
.mini-table-scroll { overflow-x: auto; }
.mini-table { width: 100%; border-collapse: collapse; }
.mini-table th, .mini-table td { padding: 10px 12px; border-bottom: 1px solid var(--admin-border); vertical-align: middle; }
.mini-table th { font-size: 0.76rem; font-weight: 800; text-transform: uppercase; color: #4b4b59; }
.mini-table td { font-size: 0.88rem; color: #696977; }
.mini-table tbody tr:last-child td { border-bottom: 0; }
.order-link { color: var(--admin-primary); font-weight: 700; text-decoration: none; }
.order-link:hover { text-decoration: underline; }
.muted-text { color: var(--admin-muted); }

/* Security */
.security-section { margin-bottom: 24px; }
.security-section:last-child { margin-bottom: 0; }
.field-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 0.82rem; font-weight: 600; color: var(--admin-muted); text-transform: uppercase; letter-spacing: 0.03em; }
.field-input { width: 100%; }

/* Toggle */
.toggle-field {
  display: flex; align-items: center; justify-content: space-between; gap: 14px;
  padding: 14px 0; border-bottom: 1px solid var(--admin-surface-soft);
}
.toggle-field:last-child { border-bottom: 0; }
.toggle-info strong { display: block; font-size: 0.9rem; color: var(--admin-text); }
.toggle-info small { color: var(--admin-muted); font-size: 0.8rem; }
.stock-toggle { position: relative; display: inline-flex; align-items: center; cursor: pointer; }
.stock-toggle input { position: absolute; opacity: 0; width: 0; height: 0; }
.toggle-track {
  width: 38px; height: 22px; border-radius: 999px; background: #d5d5da;
  transition: background 0.2s; position: relative;
}
.toggle-track::after {
  content: ''; position: absolute; top: 3px; left: 3px;
  width: 16px; height: 16px; border-radius: 999px; background: #fff;
  transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}
.stock-toggle input:checked + .toggle-track { background: var(--admin-success); }
.stock-toggle input:checked + .toggle-track::after { transform: translateX(16px); }

/* Address */
.address-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.address-box { padding: 16px; border: 1px solid var(--admin-border); border-radius: 8px; }
.address-box p { margin: 0 0 4px; font-size: 0.88rem; color: var(--admin-muted); line-height: 1.6; }

.btn-sm { height: 34px; font-size: 0.82rem; padding: 0 12px; }

/* Responsive */
@media screen and (max-width: 991.98px) {
  .detail-grid { grid-template-columns: 1fr; }
  .detail-header { flex-direction: column; align-items: flex-start; }
  .overview-cards { grid-template-columns: 1fr; }
  .field-row-2 { grid-template-columns: 1fr; }
  .address-grid { grid-template-columns: 1fr; }
}

@media screen and (max-width: 767.98px) {
  .page-title { font-size: 1.1rem; }
  .back-link { width: 44px; height: 44px; }

  /* Profile compact */
  .profile-top { padding: 20px 16px; }
  .profile-avatar { width: 64px; height: 64px; }
  .profile-name { font-size: 1rem; }
  .details-list { padding: 16px; }

  /* Tabs scrollable + compact */
  .tabs-nav { padding: 0 14px; }
  .tab-btn { padding: 12px 12px; font-size: 0.82rem; }
  .tab-content { padding: 16px; }

  /* Overview cards */
  .overview-cards { gap: 10px; }
  .overview-item { padding: 12px; }
  .ov-icon { width: 38px; height: 38px; font-size: 1rem; }

  /* Orders table compact */
  .mini-table th:nth-child(2),
  .mini-table td:nth-child(2) { display: none; }
  .mini-table th, .mini-table td { padding: 8px 8px; font-size: 0.82rem; }

  /* Touch-friendly inputs & toggles */
  .field-input, .admin-control { min-height: 44px; font-size: 16px; }
  .toggle-track { width: 44px; height: 26px; }
  .toggle-track::after { width: 20px; height: 20px; }
  .stock-toggle input:checked + .toggle-track::after { transform: translateX(18px); }

  /* Full-width buttons */
  .edit-details-btn { min-height: 44px; }
  .btn-sm { min-height: 40px; }
  .admin-danger-button { width: 100%; justify-content: center; min-height: 44px; }

  /* Loyalty card compact */
  .loyalty-card { padding: 18px; }
  .loyalty-points strong { font-size: 1.3rem; }
}
</style>
