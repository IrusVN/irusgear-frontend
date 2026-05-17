<template>
  <div class="shipper-orders">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ t('shipper.pending.title') }}</h1>
        <p class="page-sub">{{ t('shipper.pending.subtitle', { count: orders.length }) }}</p>
      </div>
    </div>

    <div class="metric-strip">
      <AdminMetricCard :label="t('shipper.metrics.toPickup')" :value="String(counts.ready)"
        icon="bi-box-seam" variant="warning" />
      <AdminMetricCard :label="t('shipper.metrics.delivering')" :value="String(counts.delivering)"
        icon="bi-truck" variant="info" />
      <AdminMetricCard :label="t('shipper.metrics.estimateFee')" :value="formatMoney(estimateFee)"
        icon="bi-cash-coin" variant="success" />
    </div>

    <div class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-card admin-card-shell">
        <div class="order-card-header">
          <div>
            <strong class="order-code">{{ order.orderCode }}</strong>
            <AdminStatusBadge :label="t(`shipper.status.${order.status}`)"
              :variant="statusVariant(order.status)" dot />
          </div>
          <strong class="order-fee">{{ formatMoney(order.shippingFee) }}</strong>
        </div>

        <div class="order-card-body">
          <div class="order-line">
            <i class="bi bi-person"></i>
            <div>
              <strong>{{ order.customer.name }}</strong>
              <small>{{ order.customer.phone }}</small>
            </div>
          </div>
          <div class="order-line">
            <i class="bi bi-geo-alt"></i>
            <span>{{ order.address }}</span>
          </div>
          <div class="order-line">
            <i class="bi bi-bag"></i>
            <span>{{ t('shipper.pending.itemsCount', { count: order.items.length }) }}</span>
          </div>
        </div>

        <div class="order-card-actions">
          <a class="admin-secondary-button call-btn" :href="`tel:${order.customer.phone}`">
            <i class="bi bi-telephone"></i>
            {{ t('shipper.actions.call') }}
          </a>
          <button class="admin-primary-button detail-btn" type="button" @click="openDetail(order)">
            <i class="bi bi-receipt"></i>
            {{ t('shipper.actions.viewDetail') }}
          </button>
        </div>
      </div>

      <div v-if="!orders.length" class="empty-state admin-card-shell">
        <i class="bi bi-inbox"></i>
        <p>{{ t('shipper.pending.empty') }}</p>
      </div>
    </div>

    <ShipperOrderDetailModal :open="modalOpen" :order="selectedOrder" @close="modalOpen = false"
      @complete="handleComplete" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n, useHead } from '#imports'
import { toast } from 'vue-sonner'
import AdminMetricCard from '@/components/Admin/ui/AdminMetricCard.vue'
import AdminStatusBadge from '@/components/Admin/ui/AdminStatusBadge.vue'
import ShipperOrderDetailModal from '@/components/Shipper/ShipperOrderDetailModal.vue'

definePageMeta({ layout: 'shipper' })
const { t } = useI18n()
useHead({ title: () => `${t('shipper.pending.title')} – IrusGear Shipper` })

/* ── Mock data có thêm items + paymentMethod để modal hiển thị đầy đủ ── */
const orders = ref([
  {
    id: 1,
    orderCode: '#ORD2381',
    customer: { name: 'Nguyễn Văn A', phone: '0901 234 567' },
    address: '123 Lê Lợi, Quận 1, TP HCM',
    status: 'delivering',
    shippingFee: 35000,
    paymentMethod: 'cod',
    items: [
      {
        id: 'i1',
        name: 'Tai nghe Sony WH-1000XM5',
        quantity: 1,
        price: 7990000,
        image: 'https://picsum.photos/seed/sony-wh/200',
      },
      {
        id: 'i2',
        name: 'Ốp lưng iPhone 15 Pro',
        quantity: 1,
        price: 350000,
        image: 'https://picsum.photos/seed/case15/200',
      },
    ],
  },
  {
    id: 2,
    orderCode: '#ORD2382',
    customer: { name: 'Trần Thị B', phone: '0987 654 321' },
    address: '45 Nguyễn Trãi, Quận 5, TP HCM',
    status: 'ready_to_pickup',
    shippingFee: 30000,
    paymentMethod: 'vnpay',
    items: [
      {
        id: 'i3',
        name: 'Apple Watch SE 44mm',
        quantity: 1,
        price: 6990000,
        image: 'https://picsum.photos/seed/aw-se/200',
      },
    ],
  },
  {
    id: 3,
    orderCode: '#ORD2383',
    customer: { name: 'Lê Hoàng C', phone: '0912 345 678' },
    address: '78 Pasteur, Quận 3, TP HCM',
    status: 'delivering',
    shippingFee: 40000,
    paymentMethod: 'momo',
    items: [
      {
        id: 'i4',
        name: 'Bàn phím Logitech MX Keys',
        quantity: 1,
        price: 2990000,
        image: 'https://picsum.photos/seed/mxkeys/200',
      },
      {
        id: 'i5',
        name: 'Chuột MX Master 3S',
        quantity: 1,
        price: 2590000,
        image: 'https://picsum.photos/seed/mxm3/200',
      },
      {
        id: 'i6',
        name: 'Dây sạc USB-C 1m',
        quantity: 2,
        price: 250000,
        image: 'https://picsum.photos/seed/usbc/200',
      },
    ],
  },
])

const counts = computed(() => ({
  ready: orders.value.filter((o) => o.status === 'ready_to_pickup').length,
  delivering: orders.value.filter((o) => o.status === 'delivering' || o.status === 'shipped').length,
}))

const estimateFee = computed(() =>
  orders.value.reduce((sum, o) => sum + (o.shippingFee || 0), 0)
)

const formatMoney = (n) => `${new Intl.NumberFormat('vi-VN').format(n || 0)}đ`

const statusVariant = (s) =>
  ({
    delivering: 'info',
    ready_to_pickup: 'warning',
    shipped: 'info',
    delivered: 'success',
    cancelled: 'danger',
  }[s] || 'neutral')

/* modal state */
const modalOpen = ref(false)
const selectedOrder = ref(null)

const openDetail = (order) => {
  selectedOrder.value = order
  modalOpen.value = true
}

const handleComplete = ({ orderId }) => {
  // TODO: gọi API thật để upload ảnh + đánh dấu đã giao
  const finished = orders.value.find((o) => o.id === orderId)
  orders.value = orders.value.filter((o) => o.id !== orderId)
  modalOpen.value = false
  toast.success(t('shipper.orderDetail.completedToast', {
    code: finished?.orderCode || '',
  }))
}
</script>

<style scoped>
.shipper-orders {
  width: 100%;
  max-width: 1540px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 22px;
}

.page-title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--admin-text);
}

.page-sub {
  margin: 4px 0 0;
  color: var(--admin-muted);
  font-size: 0.9rem;
}

.metric-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--admin-dashboard-gap);
  margin-bottom: var(--admin-dashboard-gap);
}

.orders-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: 1fr;
  gap: var(--admin-dashboard-gap);
  align-items: stretch;
}

/* Reset rule global ".admin-card-shell + .admin-card-shell { margin-top: 18px }"
   trong assets/css/admin.css đẩy card thứ 2 trong grid xuống lệch */
.orders-list .order-card,
.orders-list .order-card + .order-card {
  margin-top: 0 !important;
}

.order-card {
  height: 100%;
  align-self: stretch;
  padding: 18px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 14px;
}

.order-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: nowrap;
}

.order-card-header > div {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
}

.order-card-header :deep(.admin-status-badge),
.order-card-header :deep(.status-badge) {
  white-space: nowrap;
}

.order-code {
  font-size: 1rem;
  font-weight: 700;
  color: var(--admin-text);
  white-space: nowrap;
}

.order-fee {
  color: var(--admin-success);
  font-size: 1.05rem;
  font-weight: 700;
  white-space: nowrap;
  flex: 0 0 auto;
}

.order-card-body {
  display: grid;
  gap: 10px;
  align-content: start;
}

.order-line {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.88rem;
  color: var(--admin-text);
}

.order-line i {
  color: var(--admin-muted);
  font-size: 1rem;
  width: 18px;
  text-align: center;
  flex: 0 0 18px;
  padding-top: 2px;
}

.order-line strong {
  display: block;
  color: var(--admin-text);
  font-weight: 600;
}

.order-line small {
  color: var(--admin-muted);
  font-size: 0.78rem;
}

.order-card-actions {
  display: flex;
  gap: 10px;
}

.call-btn,
.detail-btn {
  flex: 1 1 0;
  width: 0;
  min-width: 0;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-decoration: none;
  white-space: nowrap;
}

.empty-state {
  grid-column: 1 / -1;
  padding: 50px 20px;
  text-align: center;
  color: var(--admin-muted);
}

.empty-state i { font-size: 2.4rem; opacity: 0.4; display: block; }
.empty-state p { margin: 8px 0 0; }

@media screen and (max-width: 991.98px) {
  .metric-strip { grid-template-columns: 1fr; }
  .orders-list { grid-template-columns: 1fr; }
}

@media screen and (max-width: 767.98px) {
  .shipper-orders { padding-bottom: 80px; }
  .page-title { font-size: 1.18rem; }
  .order-card { padding: 14px; gap: 12px; }
  .order-code { font-size: 0.94rem; }
  .order-fee { font-size: 0.96rem; }
  .order-line { font-size: 0.84rem; }
  .order-card-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .call-btn,
  .detail-btn {
    width: 100%;
    height: 38px;
    padding: 0 8px;
    font-size: 0.84rem;
  }
}
</style>
