<template>
  <div class="order-detail-page">
    <!-- Not found -->
    <div v-if="!order" class="admin-card-shell" style="text-align:center;padding:48px">
      <i class="bi bi-exclamation-triangle" style="font-size:2.4rem;color:var(--admin-warning)"></i>
      <h3 style="margin:12px 0 4px">{{ $t('admin.orders.orderNotFound') }}</h3>
      <p style="color:var(--admin-muted)">{{ $t('admin.orders.orderNotFoundDesc') }}</p>
      <nuxt-link to="/admin/orders" class="admin-primary-button" style="margin-top:12px">{{ $t('admin.orders.backToOrders') }}</nuxt-link>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="detail-header">
        <div class="header-left">
          <nuxt-link to="/admin/orders" class="back-link">
            <i class="bi bi-arrow-left"></i>
          </nuxt-link>
          <div>
            <div class="header-title-row">
              <h2 class="page-title">{{ $t('admin.orders.orderPrefix') }} {{ order.orderCode }}</h2>
              <AdminStatusBadge :label="paymentLabel(order.paymentStatus)"
                :variant="paymentVariant(order.paymentStatus)" />
              <AdminStatusBadge :label="fulfillmentLabel(order.fulfillmentStatus)"
                :variant="fulfillmentVariant(order.fulfillmentStatus)" dot />
            </div>
            <p class="page-sub">{{ formatDateFull(order.date) }}</p>
          </div>
        </div>
        <div class="header-actions">
          <button v-if="order.fulfillmentStatus !== 'cancelled'" class="admin-danger-button" type="button" @click="handleCancel">
            <i class="bi bi-x-circle"></i> {{ $t('admin.orders.cancelOrder') }}
          </button>
        </div>
      </div>

      <!-- Two-column layout -->
      <div class="detail-grid">
        <!-- LEFT COLUMN -->
        <div class="detail-col-left">
          <!-- Order Items Table -->
          <div class="admin-card-shell detail-card">
            <h3 class="card-title">{{ $t('admin.orders.orderDetails') }}</h3>
            <div class="items-table-scroll">
              <table class="items-table">
                <thead>
                  <tr>
                    <th>{{ $t('admin.orders.product') }}</th>
                    <th style="text-align:right">{{ $t('admin.orders.price') }}</th>
                    <th style="text-align:center">{{ $t('admin.orders.qty') }}</th>
                    <th style="text-align:right">{{ $t('admin.orders.total') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in order.items" :key="item.id">
                    <td>
                      <div class="item-product-cell">
                        <img :src="item.image" :alt="item.name" class="item-thumb" />
                        <div class="item-info">
                          <strong>{{ item.name }}</strong>
                          <small>{{ item.variant }}</small>
                        </div>
                      </div>
                    </td>
                    <td style="text-align:right">{{ formatCurrency(item.price) }}</td>
                    <td style="text-align:center">{{ item.quantity }}</td>
                    <td style="text-align:right"><strong>{{ formatCurrency(item.total) }}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Totals Summary -->
            <div class="totals-summary">
              <div class="total-row">
                <span>{{ $t('admin.orders.subtotal') }}</span>
                <span>{{ formatCurrency(order.subtotal) }}</span>
              </div>
              <div v-if="order.discount" class="total-row discount-row">
                <span>{{ $t('admin.orders.discount') }}</span>
                <span>-{{ formatCurrency(order.discount) }}</span>
              </div>
              <div class="total-row">
                <span>{{ $t('admin.orders.shipping') }}</span>
                <span>{{ order.shipping === 0 ? $t('admin.orders.free') : formatCurrency(order.shipping) }}</span>
              </div>
              <div class="total-row">
                <span>{{ $t('admin.orders.tax') }}</span>
                <span>{{ formatCurrency(order.tax) }}</span>
              </div>
              <div class="total-row grand-total">
                <span>{{ $t('admin.orders.total') }}</span>
                <span>{{ formatCurrency(order.total) }}</span>
              </div>
            </div>
          </div>

          <!-- Shipping Activity Timeline -->
          <div class="admin-card-shell detail-card">
            <h3 class="card-title">{{ $t('admin.orders.shippingActivity') }}</h3>
            <div class="timeline">
              <div v-for="(step, idx) in order.activity" :key="step.id" class="timeline-item"
                :class="{ completed: step.completed, 'is-last': idx === order.activity.length - 1 }">
                <div class="timeline-indicator">
                  <span class="timeline-dot">
                    <i v-if="step.completed" class="bi bi-check"></i>
                  </span>
                  <span v-if="idx < order.activity.length - 1" class="timeline-line"></span>
                </div>
                <div class="timeline-content">
                  <strong>{{ step.title }}</strong>
                  <small>{{ step.description }}</small>
                  <span class="timeline-time">{{ formatTimestamp(step.timestamp) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN -->
        <div class="detail-col-right">
          <!-- Customer Details -->
          <div class="admin-card-shell detail-card">
            <h3 class="card-title">{{ $t('admin.orders.customerDetails') }}</h3>
            <div class="customer-detail-cell">
              <img :src="order.customer.avatar" :alt="order.customer.name" class="customer-avatar-lg" />
              <div>
                <strong>{{ order.customer.name }}</strong>
                <small>{{ $t('admin.orders.customerIdLabel', { code: order.customer.customerCode }) }}</small>
              </div>
            </div>
            <div class="detail-info-list">
              <div class="info-item">
                <i class="bi bi-envelope"></i>
                <span>{{ order.customer.email }}</span>
              </div>
              <div class="info-item">
                <i class="bi bi-telephone"></i>
                <span>{{ order.customer.phone }}</span>
              </div>
            </div>
          </div>

          <!-- Shipping Address -->
          <div class="admin-card-shell detail-card">
            <div class="card-header-row">
              <h3 class="card-title">{{ $t('admin.orders.shippingAddress') }}</h3>
              <button class="admin-secondary-button btn-sm" type="button"><i class="bi bi-pencil"></i> {{ $t('admin.orders.edit') }}</button>
            </div>
            <div class="address-block">
              <p>{{ order.shippingAddress.street }}</p>
              <p>{{ order.shippingAddress.ward }}, {{ order.shippingAddress.district }}</p>
              <p>{{ order.shippingAddress.city }}, {{ order.shippingAddress.country }}</p>
              <p v-if="order.shippingAddress.zip">{{ order.shippingAddress.zip }}</p>
            </div>
          </div>

          <!-- Billing & Payment -->
          <div class="admin-card-shell detail-card">
            <h3 class="card-title">{{ $t('admin.orders.billingAddress') }}</h3>
            <div class="address-block">
              <p>{{ order.billingAddress.street }}</p>
              <p>{{ order.billingAddress.ward }}, {{ order.billingAddress.district }}</p>
              <p>{{ order.billingAddress.city }}, {{ order.billingAddress.country }}</p>
            </div>

            <div class="payment-section">
              <h4 class="section-subtitle">{{ $t('admin.orders.paymentMethod') }}</h4>
              <div class="payment-card-info">
                <i class="bi" :class="paymentIcon(order.paymentMethod)"></i>
                <span>{{ order.paymentLabel }}</span>
              </div>
            </div>
          </div>

          <!-- Order Note -->
          <div v-if="order.note" class="admin-card-shell detail-card">
            <h3 class="card-title">{{ $t('admin.orders.note') }}</h3>
            <p class="note-text">{{ order.note }}</p>
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

const orderId = computed(() => Number(route.params.id))
const order = ref(null)

useHead({ title: () => order.value ? t('admin.orders.orderPageTitle', { code: order.value.orderCode }) : t('admin.orders.loadingOrder') })

const mapOrderDetail = (o) => ({
  id: o.id,
  orderCode: o.order_number,
  date: o.created_at,
  paymentStatus: o.payment?.status || 'pending',
  fulfillmentStatus: o.status,
  paymentMethod: o.payment?.method || 'cod',
  paymentLabel: o.payment ? (o.payment.method === 'cod' ? t('admin.orders.cashOnDelivery') : o.payment.method) : t('admin.orders.notAvailable'),
  customer: {
    id: o.customer?.id,
    customerCode: o.customer?.id ? `#CUS${o.customer.id}` : t('admin.orders.guest'),
    name: o.customer?.name || o.guest_email || t('admin.orders.guest'),
    email: o.customer?.email || o.guest_email,
    phone: o.customer?.phone || o.address?.phone,
    avatar: '',
  },
  items: o.items?.map(i => ({
    id: i.id,
    name: i.product_name,
    variant: i.variant_name,
    image: i.thumbnail,
    price: i.unit_price,
    quantity: i.quantity,
    total: i.line_total,
  })) || [],
  subtotal: o.pricing?.subtotal || 0,
  shipping: o.pricing?.delivery_fee || 0,
  tax: o.pricing?.tax || 0,
  discount: o.pricing?.discount_amount || 0,
  total: o.pricing?.total || 0,
  shippingAddress: {
    street: o.address?.line1 || '',
    ward: o.address?.ward_code || '',
    district: o.address?.district_code || '',
    city: o.address?.city || '',
    country: o.address?.country || t('admin.customers.defaultCountry'),
    zip: o.address?.postal_code || '',
  },
  billingAddress: {
    street: o.address?.line1 || '',
    ward: o.address?.ward_code || '',
    district: o.address?.district_code || '',
    city: o.address?.city || '',
    country: o.address?.country || t('admin.customers.defaultCountry'),
  },
  activity: o.timeline?.map(tl => ({
    id: tl.id,
    title: tl.label,
    description: tl.note || '',
    timestamp: tl.created_at,
    completed: true,
  })) || [],
  note: o.order_note,
})

const fetchOrder = async () => {
  const res = await admin.fetchOne(`orders/${orderId.value}`)
  if (res?.data) {
    order.value = mapOrderDetail(res.data)
  }
}

onMounted(() => {
  fetchOrder()
})

/* ── helpers ── */
const formatCurrency = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
const formatDateFull = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
const formatTimestamp = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })

const paymentLabel = (s) => ({
  pending: t('admin.status.pending'),
  paid: t('admin.status.paid'),
  failed: t('admin.status.failed'),
  cancelled: t('admin.status.cancelled'),
  refunded: t('admin.status.refunded'),
}[s] || s)
const paymentVariant = (s) => ({ pending: 'warning', paid: 'success', failed: 'danger', cancelled: 'neutral', refunded: 'info' }[s] || 'neutral')
const fulfillmentLabel = (s) => ({
  ready_to_pickup: t('admin.status.ready_to_pickup'),
  out_for_delivery: t('admin.status.out_for_delivery'),
  delivered: t('admin.status.delivered'),
  dispatched: t('admin.status.dispatched'),
  processing: t('admin.status.processing'),
}[s] || s)
const fulfillmentVariant = (s) => ({
  ready_to_pickup: 'info', out_for_delivery: 'warning',
  delivered: 'success', dispatched: 'neutral', processing: 'neutral',
}[s] || 'neutral')

const paymentIcon = (m) => ({
  visa: 'bi-credit-card', mastercard: 'bi-credit-card-2-front',
  paypal: 'bi-paypal', cod: 'bi-cash', bank_transfer: 'bi-bank',
}[m] || 'bi-credit-card')

const handleCancel = async () => {
  if (confirm(t('admin.orders.confirmCancel', { code: order.value?.orderCode }))) {
    try {
      await admin.create(`orders/${orderId.value}/cancel`, { reason: t('admin.orders.cancelReason') })
      toast.success(t('admin.orders.cancelSuccess'))
      fetchOrder()
    } catch (e) {
      toast.error(t('admin.orders.cancelFailed', { msg: e.message }))
    }
  }
}
</script>

<style scoped>
.order-detail-page {
  max-width: 1560px;
}

/* Header */
.detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.back-link {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--admin-surface);
  border: 1px solid var(--admin-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--admin-text);
  text-decoration: none;
  font-size: 1.1rem;
  transition: background 0.15s;
  flex: 0 0 auto;
}

.back-link:hover {
  background: var(--admin-surface-soft);
}

.header-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.page-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--admin-text);
}

.page-sub {
  margin: 4px 0 0;
  color: var(--admin-muted);
  font-size: 0.86rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Grid */
.detail-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 20px;
}

.detail-col-left,
.detail-col-right {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Card */
.detail-card {
  padding: 22px;
}

.card-title {
  margin: 0 0 16px;
  font-size: 1rem;
  font-weight: 700;
  color: var(--admin-text);
}

.card-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-header-row .card-title {
  margin: 0;
}

.btn-sm {
  height: 34px;
  font-size: 0.82rem;
  padding: 0 12px;
}

/* Items table */
.items-table-scroll {
  overflow-x: auto;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
}

.items-table th,
.items-table td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--admin-border);
  vertical-align: middle;
}

.items-table th {
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #4b4b59;
}

.items-table td {
  font-size: 0.9rem;
  color: #696977;
}

.items-table tbody tr:last-child td {
  border-bottom: 0;
}

.item-product-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-thumb {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  object-fit: cover;
  background: var(--admin-surface-soft);
  flex: 0 0 auto;
}

.item-info {
  min-width: 0;
}

.item-info strong {
  display: block;
  font-size: 0.88rem;
  color: var(--admin-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 240px;
}

.item-info small {
  color: var(--admin-muted);
  font-size: 0.78rem;
}

/* Totals */
.totals-summary {
  border-top: 1px solid var(--admin-border);
  padding-top: 16px;
  margin-top: 8px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 7px 14px;
  font-size: 0.9rem;
  color: var(--admin-muted);
}

.discount-row span:last-child {
  color: var(--admin-success);
}

.grand-total {
  font-size: 1rem;
  font-weight: 700;
  color: var(--admin-text);
  border-top: 1px solid var(--admin-border);
  margin-top: 4px;
  padding-top: 14px;
}

/* ── Timeline ── */
.timeline {
  display: flex;
  flex-direction: column;
}

.timeline-item {
  display: flex;
  gap: 14px;
}

.timeline-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-dot {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  flex: 0 0 auto;
  border: 2px solid var(--admin-border);
  background: var(--admin-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--admin-subtle);
  font-size: 0.72rem;
  transition: all 0.2s;
}

.timeline-item.completed .timeline-dot {
  background: var(--admin-success);
  border-color: var(--admin-success);
  color: #fff;
}

.timeline-line {
  width: 2px;
  flex: 1;
  min-height: 28px;
  background: var(--admin-border);
}

.timeline-item.completed .timeline-line {
  background: var(--admin-success);
}

.timeline-content {
  padding-bottom: 22px;
  min-width: 0;
}

.timeline-content strong {
  display: block;
  font-size: 0.9rem;
  color: var(--admin-text);
  margin-bottom: 2px;
}

.timeline-content small {
  display: block;
  color: var(--admin-muted);
  font-size: 0.82rem;
  margin-bottom: 4px;
}

.timeline-time {
  font-size: 0.76rem;
  color: var(--admin-subtle);
}

.timeline-item.is-last .timeline-content {
  padding-bottom: 0;
}

/* Customer */
.customer-detail-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.customer-avatar-lg {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  object-fit: cover;
}

.customer-detail-cell strong {
  display: block;
  font-size: 0.94rem;
  color: var(--admin-text);
}

.customer-detail-cell small {
  color: var(--admin-muted);
  font-size: 0.8rem;
}

.detail-info-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.88rem;
  color: var(--admin-text);
}

.info-item i {
  color: var(--admin-muted);
  font-size: 1rem;
  width: 18px;
  text-align: center;
}

/* Address */
.address-block p {
  margin: 0 0 4px;
  font-size: 0.88rem;
  color: var(--admin-muted);
  line-height: 1.6;
}

/* Payment */
.payment-section {
  border-top: 1px solid var(--admin-border);
  margin-top: 16px;
  padding-top: 16px;
}

.section-subtitle {
  margin: 0 0 10px;
  font-size: 0.86rem;
  font-weight: 700;
  color: var(--admin-text);
}

.payment-card-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.88rem;
  color: var(--admin-text);
}

.payment-card-info i {
  font-size: 1.2rem;
  color: var(--admin-muted);
}

/* Note */
.note-text {
  margin: 0;
  font-size: 0.88rem;
  color: var(--admin-muted);
  line-height: 1.6;
  font-style: italic;
}

/* Responsive */
@media screen and (max-width: 991.98px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media screen and (max-width: 767.98px) {
  .detail-card { padding: 16px; }
  .card-title { font-size: 0.92rem; margin-bottom: 12px; }
  .page-title { font-size: 1.1rem; }
  .back-link { width: 44px; height: 44px; }

  /* Full-width delete button */
  .header-actions { width: 100%; }
  .header-actions .admin-danger-button { width: 100%; justify-content: center; min-height: 44px; }

  /* Items table: hide price column on small */
  .items-table th:nth-child(2),
  .items-table td:nth-child(2) { display: none; }
  .items-table th, .items-table td { padding: 10px 10px; font-size: 0.84rem; }
  .item-thumb { width: 36px; height: 36px; }
  .item-info strong { max-width: 140px; font-size: 0.82rem; }

  /* Totals compact */
  .total-row { padding: 6px 10px; font-size: 0.84rem; }
  .grand-total { font-size: 0.92rem; }

  /* Timeline compact */
  .timeline-content { padding-bottom: 16px; }
  .timeline-dot { width: 24px; height: 24px; font-size: 0.65rem; }

  /* Customer card compact */
  .customer-avatar-lg { width: 40px; height: 40px; }
  .info-item { font-size: 0.82rem; }

  /* Address compact */
  .address-block p { font-size: 0.84rem; }
  .btn-sm { min-height: 40px; }
}
</style>
