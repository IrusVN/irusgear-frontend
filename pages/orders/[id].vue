<template>
  <ProfileLayout>
    <div class="order-detail-page">
      <!-- Loading -->
      <div v-if="loading && !order" class="order-detail__skeleton">
        <div class="order-detail__skeleton-header"></div>
        <div class="order-detail__skeleton-card"></div>
        <div class="order-detail__skeleton-card"></div>
        <div class="order-detail__skeleton-card"></div>
      </div>

      <!-- Not found -->
      <div v-else-if="!loading && !order" class="order-detail__empty">
        <i class="bi bi-exclamation-triangle order-detail__empty-icon"></i>
        <h3>{{ $t('profile.orderDetail.notFound') }}</h3>
        <p>{{ $t('profile.orderDetail.notFoundDesc') }}</p>
        <NuxtLink :to="localePath('/orders')" class="btn btn-dark rounded-pill px-4 py-2">
          <i class="bi bi-arrow-left me-2"></i>{{ $t('profile.orderDetail.backToList') }}
        </NuxtLink>
      </div>

      <!-- Order content -->
      <template v-else-if="order">
        <!-- Header card -->
        <div class="order-detail__header">
          <div class="order-detail__header-left">
            <button type="button" class="order-detail__back" @click="goBack">
              <i class="bi bi-arrow-left"></i>
            </button>
            <div>
              <h1 class="order-detail__title">
                {{ $t('profile.orderDetail.orderNumber') }} {{ order.orderNumber }}
              </h1>
              <p class="order-detail__date">
                <i class="bi bi-clock"></i>
                {{ formatDateTime(order.createdAt) }}
              </p>
            </div>
          </div>
          <div class="order-detail__header-right">
            <span class="order-detail__status" :class="statusClass">
              <i :class="statusIcon"></i>
              {{ order.statusLabel || order.status }}
            </span>
          </div>
        </div>

        <!-- Timeline -->
        <div v-if="order.timeline?.length" class="order-detail__card">
          <h2 class="order-detail__section-title">
            <i class="bi bi-clock-history"></i>
            {{ $t('profile.orderDetail.timeline') }}
          </h2>
          <ol class="order-detail__timeline">
            <li
              v-for="(step, idx) in order.timeline"
              :key="idx"
              class="order-detail__timeline-item"
              :class="{ 'order-detail__timeline-item--latest': idx === order.timeline.length - 1 }"
            >
              <span class="order-detail__timeline-dot"></span>
              <div class="order-detail__timeline-content">
                <p class="order-detail__timeline-label">{{ displayTimelineLabel(step) }}</p>
                <p class="order-detail__timeline-meta">
                  {{ formatDateTime(step.timestamp) }}
                  <span v-if="step.note" class="order-detail__timeline-note">— {{ step.note }}</span>
                </p>
              </div>
            </li>
          </ol>
        </div>

        <!-- Proof of delivery (visible once order is delivered + payload includes signed URLs) -->
        <div
          v-if="proofPhotos.length"
          class="order-detail__card order-detail__pod"
        >
          <h2 class="order-detail__section-title">
            <i class="bi bi-check2-square"></i>
            {{ $t('profile.orderDetail.proofOfDelivery.title') }}
          </h2>
          <div class="order-detail__pod-meta">
            <span v-if="proofOfDelivery.deliveredAt">
              <i class="bi bi-clock-history"></i>
              {{ $t('profile.orderDetail.proofOfDelivery.deliveredAt') }}:
              {{ formatDateTime(proofOfDelivery.deliveredAt) }}
            </span>
            <span v-if="proofOfDelivery.recipientName">
              <i class="bi bi-person-badge"></i>
              {{ $t('profile.orderDetail.proofOfDelivery.recipient') }}:
              {{ proofOfDelivery.recipientName }}
            </span>
          </div>
          <div class="order-detail__pod-grid">
            <a
              v-for="(photo, idx) in proofPhotos"
              :key="photo.id || photo.url"
              :href="photo.url"
              target="_blank"
              rel="noopener"
              class="order-detail__pod-tile"
              :title="$t('profile.orderDetail.proofOfDelivery.viewLarger')"
            >
              <img :src="photo.thumbUrl || photo.url" :alt="`POD ${idx + 1}`" loading="lazy" />
            </a>
          </div>
        </div>

        <!-- Items -->
        <div v-if="order.items?.length" class="order-detail__card">
          <h2 class="order-detail__section-title">
            <i class="bi bi-box-seam"></i>
            {{ $t('profile.orderDetail.items') }}
            <span class="order-detail__section-count">({{ order.items.length }})</span>
          </h2>
          <div class="order-detail__items">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="order-detail__item"
            >
              <img
                :src="item.thumbnail || fallbackImage"
                :alt="item.name"
                class="order-detail__item-img"
                loading="lazy"
              >
              <div class="order-detail__item-info">
                <p class="order-detail__item-name">{{ item.name }}</p>
                <p v-if="getOptionsText(item)" class="order-detail__item-options">
                  {{ getOptionsText(item) }}
                </p>
                <p class="order-detail__item-price">
                  <span>{{ formatMoney(item.unitPrice) }}</span>
                  <span class="order-detail__item-qty">× {{ item.quantity }}</span>
                </p>
              </div>
              <div class="order-detail__item-total">
                {{ formatMoney(item.lineTotal) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Pricing -->
        <div class="order-detail__card">
          <h2 class="order-detail__section-title">
            <i class="bi bi-receipt"></i>
            {{ $t('profile.orderDetail.summary') }}
          </h2>
          <dl class="order-detail__pricing">
            <div class="order-detail__pricing-row">
              <dt>{{ $t('checkout.subtotal') }}</dt>
              <dd>{{ formatMoney(order.pricing?.subtotal) }}</dd>
            </div>
            <div v-if="order.pricing?.deliveryFee > 0" class="order-detail__pricing-row">
              <dt>{{ $t('checkout.deliveryFee') }}</dt>
              <dd>{{ formatMoney(order.pricing.deliveryFee) }}</dd>
            </div>
            <div v-if="order.pricing?.voucherDiscount > 0" class="order-detail__pricing-row order-detail__pricing-row--discount">
              <dt>{{ $t('checkout.voucher') }}</dt>
              <dd>-{{ formatMoney(order.pricing.voucherDiscount) }}</dd>
            </div>
            <div v-if="order.pricing?.freeshipDiscount > 0" class="order-detail__pricing-row order-detail__pricing-row--discount">
              <dt>{{ $t('checkout.freeship') }}</dt>
              <dd>-{{ formatMoney(order.pricing.freeshipDiscount) }}</dd>
            </div>
            <div v-if="order.pricing?.insuranceFee > 0" class="order-detail__pricing-row">
              <dt>{{ $t('checkout.insurance') }}</dt>
              <dd>+{{ formatMoney(order.pricing.insuranceFee) }}</dd>
            </div>
            <div class="order-detail__pricing-total">
              <dt>{{ $t('checkout.total') }}</dt>
              <dd>{{ formatMoney(order.pricing?.total) }}</dd>
            </div>
          </dl>
        </div>

        <!-- Two column: address + payment -->
        <div class="order-detail__grid">
          <!-- Shipping address -->
          <div v-if="order.address" class="order-detail__card">
            <h2 class="order-detail__section-title">
              <i class="bi bi-geo-alt"></i>
              {{ $t('profile.orderDetail.shipping') }}
            </h2>
            <div class="order-detail__address">
              <p class="order-detail__address-name">
                <strong>{{ order.address.name }}</strong>
                <span class="order-detail__address-phone">{{ order.address.phone }}</span>
              </p>
              <p class="order-detail__address-line">{{ buildAddress(order.address) }}</p>
            </div>
            <div v-if="order.delivery" class="order-detail__delivery">
              <div class="order-detail__pricing-row">
                <dt>{{ $t('profile.orderDetail.deliveryMethod') }}</dt>
                <dd>{{ formatDeliveryMethod(order.delivery.method) }}</dd>
              </div>
              <div v-if="order.delivery.trackingNumber" class="order-detail__pricing-row">
                <dt>{{ $t('profile.orderDetail.tracking') }}</dt>
                <dd>{{ order.delivery.trackingNumber }}</dd>
              </div>
              <div v-if="order.delivery.estimatedDelivery" class="order-detail__pricing-row">
                <dt>{{ $t('profile.orderDetail.estimatedDelivery') }}</dt>
                <dd>{{ formatDateTime(order.delivery.estimatedDelivery) }}</dd>
              </div>
            </div>
          </div>

          <!-- Payment info -->
          <div v-if="order.payment" class="order-detail__card">
            <h2 class="order-detail__section-title">
              <i class="bi bi-credit-card"></i>
              {{ $t('profile.orderDetail.payment') }}
            </h2>
            <div class="order-detail__payment-badge">
              <i :class="paymentIcon"></i>
              <span class="order-detail__payment-method">{{ paymentMethodLabel }}</span>
              <span class="order-detail__payment-status" :class="paymentStatusClass">
                {{ order.payment.statusLabel || order.payment.status }}
              </span>
            </div>
            <dl class="order-detail__pricing">
              <div class="order-detail__pricing-row">
                <dt>{{ $t('orderSuccess.amount') }}</dt>
                <dd class="order-detail__pricing-amount">{{ formatMoney(order.payment.amount) }}</dd>
              </div>
              <div v-if="order.payment.paidAt" class="order-detail__pricing-row">
                <dt>{{ $t('orderSuccess.transactionDate') }}</dt>
                <dd>{{ formatDateTime(order.payment.paidAt) }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Note -->
        <div v-if="order.orderNote" class="order-detail__card">
          <h2 class="order-detail__section-title">
            <i class="bi bi-pencil"></i>
            {{ $t('profile.orderDetail.note') }}
          </h2>
          <p class="order-detail__note">{{ order.orderNote }}</p>
        </div>

        <!-- Actions -->
        <div class="order-detail__actions">
          <NuxtLink :to="localePath('/orders')" class="order-detail__btn order-detail__btn--ghost">
            <i class="bi bi-arrow-left"></i>
            {{ $t('profile.orderDetail.backToList') }}
          </NuxtLink>
          <button
            v-if="canCancel"
            type="button"
            class="order-detail__btn order-detail__btn--danger"
            :disabled="cancelling"
            @click="handleCancel"
          >
            <span v-if="cancelling" class="spinner-border spinner-border-sm"></span>
            <i v-else class="bi bi-x-circle"></i>
            {{ $t('profile.orderDetail.cancelOrder') }}
          </button>
          <NuxtLink
            v-if="order.status === 'delivered'"
            :to="localePath('/orders')"
            class="order-detail__btn order-detail__btn--primary"
          >
            <i class="bi bi-arrow-clockwise"></i>
            {{ $t('profile.orderDetail.reorder') }}
          </NuxtLink>
        </div>
      </template>
    </div>
  </ProfileLayout>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter, useI18n, useLocalePath } from "#imports";
import { toast } from "vue-sonner";
import ProfileLayout from "@/components/Common/ProfileLayout.vue";
import { useCheckoutStore } from "@/stores/checkoutStore";

definePageMeta({ layout: "default", middleware: ["auth-guard"] });

const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();
const { t, locale } = useI18n();
const checkoutStore = useCheckoutStore();

const order = ref(null);
const loading = ref(true);
const cancelling = ref(false);

const fallbackImage = "https://placehold.co/64x64/f4f4f5/d4d4d8?text=%20";

useHead({
  title: computed(() =>
    order.value
      ? `${order.value.orderNumber} - IrusGear`
      : `${t("profile.orderDetail.title")} - IrusGear`,
  ),
});

const normalizeProofPhoto = (photo) => {
  if (!photo || typeof photo !== "object") return null;

  const url = photo.url || photo.cdn_url || null;
  if (!url) return null;

  return {
    id: photo.id || null,
    url,
    thumbUrl: photo.thumbUrl || photo.thumb_url || url,
    capturedAt: photo.capturedAt || photo.captured_at || null,
    mimeType: photo.mimeType || photo.mime_type || null,
  };
};

const proofOfDelivery = computed(() => {
  const pod = order.value?.proofOfDelivery || order.value?.proof_of_delivery || null;
  if (!pod) {
    return {
      deliveredAt: null,
      recipientName: null,
      photos: [],
    };
  }

  return {
    deliveredAt: pod.deliveredAt || pod.delivered_at || null,
    recipientName: pod.recipientName || pod.recipient_name || null,
    photos: Array.isArray(pod.photos)
      ? pod.photos.map(normalizeProofPhoto).filter(Boolean)
      : [],
  };
});

const proofPhotos = computed(() => proofOfDelivery.value.photos);

const fetchOrder = async () => {
  const orderId = route.params.id;
  if (!orderId) {
    loading.value = false;
    return;
  }

  loading.value = true;
  try {
    const data = await checkoutStore.fetchOrderById(orderId);
    order.value = data || null;
  } catch (e) {
    order.value = null;
    toast.error(e?.data?.message || t("profile.orderDetail.fetchError"));
  } finally {
    loading.value = false;
  }
};

// ─── Status mapping ─────────────────────────
const statusClass = computed(() => {
  const status = String(order.value?.status || "").toLowerCase();
  if (["pending", "awaiting_payment"].includes(status)) {
    return "order-detail__status--pending";
  }
  if (["confirmed", "processing", "ready_to_ship"].includes(status)) {
    return "order-detail__status--processing";
  }
  if (["shipped", "delivering"].includes(status)) {
    return "order-detail__status--shipping";
  }
  if (status === "delivered") {
    return "order-detail__status--delivered";
  }
  if (["cancelled", "delivery_failed", "returned"].includes(status)) {
    return "order-detail__status--cancelled";
  }
  return "";
});

const statusIcon = computed(() => {
  const status = String(order.value?.status || "").toLowerCase();
  if (["pending", "awaiting_payment"].includes(status)) return "bi bi-clock";
  if (["confirmed", "processing", "ready_to_ship"].includes(status)) return "bi bi-gear-fill";
  if (["shipped", "delivering"].includes(status)) return "bi bi-truck";
  if (status === "delivered") return "bi bi-check-circle-fill";
  if (["cancelled", "delivery_failed", "returned"].includes(status)) return "bi bi-x-circle-fill";
  return "bi bi-circle";
});

// ─── Payment ─────────────────────────────────
const paymentMethodLabel = computed(() => {
  const method = String(order.value?.payment?.method || order.value?.paymentMethod || "cod").toLowerCase();
  if (method === "vnpay") return "VNPay";
  if (method === "momo") return "MoMo";
  if (method === "paypal") return "PayPal";
  if (method === "zalopay") return "ZaloPay";
  return "COD";
});

const paymentIcon = computed(() => {
  const method = String(order.value?.payment?.method || order.value?.paymentMethod || "cod").toLowerCase();
  if (method === "vnpay") return "bi bi-credit-card-2-front-fill";
  if (method === "momo") return "bi bi-wallet2";
  if (method === "paypal") return "bi bi-paypal";
  return "bi bi-cash-coin";
});

const paymentStatusClass = computed(() => {
  const status = String(order.value?.payment?.status || "").toLowerCase();
  if (status === "completed" || status === "paid") return "order-detail__payment-status--success";
  if (status === "failed" || status === "cancelled") return "order-detail__payment-status--failed";
  return "order-detail__payment-status--pending";
});

const canCancel = computed(() => {
  const status = String(order.value?.status || "").toLowerCase();
  return ["pending", "awaiting_payment", "confirmed"].includes(status);
});

// ─── Helpers ─────────────────────────────────
const formatMoney = (value = 0) =>
  `${new Intl.NumberFormat("vi-VN").format(Number(value || 0))}đ`;

const VIETNAM_TIME_ZONE = "Asia/Ho_Chi_Minh";

const parseTimestamp = (value) => {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;

  const raw = String(value).trim();
  const hasTimezone = /(?:z|[+-]\d{2}:?\d{2})$/i.test(raw);
  const looksLikeSqlDatetime = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/.test(raw);
  const normalized = !hasTimezone && looksLikeSqlDatetime
    ? `${raw.replace(" ", "T")}Z`
    : raw;
  const date = new Date(normalized);

  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDateTime = (iso) => {
  if (!iso) return "";
  const date = parseTimestamp(iso);
  if (!date) return iso;

  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: VIETNAM_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const CUSTOMER_TIMELINE_LABELS = {
  vi: {
    pending: "Đơn hàng đã được tạo",
    awaiting_payment: "Chờ thanh toán",
    confirmed: "Đơn hàng đã được xác nhận",
    processing: "Đơn hàng đang được xử lý",
    ready_to_ship: "Đơn hàng sẵn sàng giao",
    shipped: "Đơn vị giao hàng đã lấy hàng",
    delivering: "Đơn hàng đang được giao",
    delivered: "Đã giao hàng thành công",
    delivery_failed: "Giao hàng chưa thành công",
    cancelled: "Đơn hàng đã bị hủy",
    refunding: "Đang hoàn tiền",
    refunded: "Đã hoàn tiền",
    returned: "Đơn hàng đã được trả lại",
  },
  en: {
    pending: "Order placed",
    awaiting_payment: "Awaiting payment",
    confirmed: "Order confirmed",
    processing: "Order is being processed",
    ready_to_ship: "Order is ready to ship",
    shipped: "Carrier picked up the order",
    delivering: "Order is out for delivery",
    delivered: "Order delivered",
    delivery_failed: "Delivery was unsuccessful",
    cancelled: "Order cancelled",
    refunding: "Refund in progress",
    refunded: "Refunded",
    returned: "Order returned",
  },
};

const CUSTOMER_TIMELINE_LABEL_ALIASES = {
  "admin approved": "processing",
  "auto approved": "processing",
  "shipment assigned": "ready_to_ship",
  "shipment reassigned": "ready_to_ship",
  "shipper đã lấy hàng": "shipped",
  "shipper da lay hang": "shipped",
};

const displayTimelineLabel = (step) => {
  const language = String(locale.value || "vi").startsWith("en") ? "en" : "vi";
  const labels = CUSTOMER_TIMELINE_LABELS[language];
  const status = String(step?.status || "").toLowerCase();

  if (labels[status]) return labels[status];

  const rawLabel = String(step?.label || "").trim();
  const aliasStatus = CUSTOMER_TIMELINE_LABEL_ALIASES[rawLabel.toLowerCase()];

  return aliasStatus && labels[aliasStatus]
    ? labels[aliasStatus]
    : rawLabel;
};

const formatDeliveryMethod = (method) => {
  switch (method) {
    case "express":
      return t("profile.orderDetail.deliveryExpress");
    case "same_day":
      return t("profile.orderDetail.deliverySameDay");
    case "pickup":
      return t("profile.orderDetail.deliveryPickup");
    case "standard":
    default:
      return t("profile.orderDetail.deliveryStandard");
  }
};

const buildAddress = (addr) => {
  if (!addr) return "";
  return [addr.line1, addr.line2, addr.city, addr.state, addr.country]
    .filter(Boolean)
    .join(", ");
};

const getOptionsText = (item) => {
  if (!item?.selectedOptions) return null;
  if (Array.isArray(item.selectedOptions)) {
    if (!item.selectedOptions.length) return null;
    return item.selectedOptions.join(", ");
  }
  const values = Object.values(item.selectedOptions).filter(Boolean);
  return values.length ? values.join(", ") : null;
};

// ─── Actions ─────────────────────────────────
const goBack = () => {
  const referrer = document.referrer ? new URL(document.referrer) : null;
  const canGoBackInsideApp = referrer?.origin === window.location.origin && window.history.length > 1;

  if (canGoBackInsideApp) {
    router.back();
  } else {
    navigateTo(localePath("/orders"));
  }
};

const handleCancel = () => {
  toast(t("profile.orderDetail.confirmCancel"), {
    cancel: { label: t("common.confirmNo"), onClick: () => {} },
    action: {
      label: t("common.confirmYes"),
      onClick: async () => {
        cancelling.value = true;
        try {
          // TODO: tích hợp API cancel order khi BE sẵn sàng.
          // Hiện tại chỉ refetch để cập nhật trạng thái.
          await fetchOrder();
          toast.success(t("profile.orderDetail.cancelSuccess"));
        } catch (e) {
          toast.error(e?.data?.message || t("profile.orderDetail.cancelError"));
        } finally {
          cancelling.value = false;
        }
      },
    },
  });
};

onMounted(() => {
  fetchOrder();
});
</script>

<style scoped>
.order-detail-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ── Header ─── */
.order-detail__header {
  align-items: center;
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
  padding: 16px 20px;
}

.order-detail__header-left {
  align-items: center;
  display: flex;
  gap: 12px;
  min-width: 0;
}

.order-detail__back {
  align-items: center;
  background: #f4f4f5;
  border: 0;
  border-radius: 50%;
  color: #18181b;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  height: 38px;
  justify-content: center;
  width: 38px;
  transition: background 0.15s ease;
}

.order-detail__back:hover {
  background: #e4e4e7;
}

.order-detail__title {
  color: #18181b;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  margin: 0;
}

.order-detail__date {
  align-items: center;
  color: #71717a;
  display: flex;
  font-size: 13px;
  gap: 6px;
  margin: 4px 0 0;
}

.order-detail__date i {
  font-size: 12px;
}

.order-detail__status {
  align-items: center;
  border-radius: 999px;
  display: inline-flex;
  font-size: 13px;
  font-weight: 600;
  gap: 6px;
  padding: 6px 14px;
}

.order-detail__status i {
  font-size: 12px;
}

.order-detail__status--pending {
  background: #fffbeb;
  color: #d97706;
}

.order-detail__status--processing {
  background: #eff6ff;
  color: #3b82f6;
}

.order-detail__status--shipping {
  background: #f5f3ff;
  color: #7c3aed;
}

.order-detail__status--delivered {
  background: #f0fdf4;
  color: #16a34a;
}

.order-detail__status--cancelled {
  background: #fef2f2;
  color: #dc2626;
}

/* ── Card ─── */
.order-detail__card {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  padding: 18px 20px;
}

.order-detail__section-title {
  align-items: center;
  color: #18181b;
  display: flex;
  font-size: 15px;
  font-weight: 700;
  gap: 8px;
  margin: 0 0 14px;
}

.order-detail__section-title i {
  color: var(--irus-color-accent);
  font-size: 18px;
}

.order-detail__section-count {
  color: #71717a;
  font-size: 13px;
  font-weight: 500;
  margin-left: 4px;
}

/* ── Timeline ─── */
.order-detail__timeline {
  display: flex;
  flex-direction: column;
  gap: 14px;
  list-style: none;
  margin: 0;
  padding: 0 0 0 8px;
  position: relative;
}

.order-detail__timeline::before {
  background: #ececf1;
  content: "";
  height: calc(100% - 14px);
  left: 13px;
  position: absolute;
  top: 7px;
  width: 2px;
}

.order-detail__timeline-item {
  align-items: flex-start;
  display: flex;
  gap: 14px;
  position: relative;
}

.order-detail__timeline-dot {
  background: #d4d4d8;
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #ececf1;
  flex-shrink: 0;
  height: 12px;
  margin-top: 4px;
  position: relative;
  width: 12px;
  z-index: 1;
}

.order-detail__timeline-item--latest .order-detail__timeline-dot {
  background: var(--irus-color-accent);
  box-shadow: 0 0 0 3px var(--irus-color-accent-soft);
}

.order-detail__timeline-content {
  flex: 1;
  min-width: 0;
}

.order-detail__timeline-label {
  color: #18181b;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 2px;
}

.order-detail__timeline-meta {
  color: #71717a;
  font-size: 12px;
  margin: 0;
}

.order-detail__timeline-note {
  color: #52525b;
}

/* ── Proof of Delivery ── */
.order-detail__pod-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 0.86rem;
  color: #4b5563;
  margin-bottom: 12px;
}

.order-detail__pod-meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.order-detail__pod-meta i {
  color: #16a34a;
}

.order-detail__pod-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;
}

.order-detail__pod-tile {
  display: block;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 10px;
  background: #f4f4f5;
  border: 1px solid #e4e4e7;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.order-detail__pod-tile:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.order-detail__pod-tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ── Items ─── */
.order-detail__items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-detail__item {
  align-items: center;
  border-bottom: 1px solid #f4f4f5;
  display: flex;
  gap: 12px;
  padding-bottom: 12px;
}

.order-detail__item:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.order-detail__item-img {
  border: 1px solid #f0f0f2;
  border-radius: 10px;
  flex-shrink: 0;
  height: 64px;
  object-fit: cover;
  width: 64px;
}

.order-detail__item-info {
  flex: 1;
  min-width: 0;
}

.order-detail__item-name {
  color: #18181b;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  margin: 0 0 4px;
}

.order-detail__item-options {
  color: #71717a;
  font-size: 12px;
  margin: 0 0 4px;
}

.order-detail__item-price {
  align-items: baseline;
  color: #71717a;
  display: flex;
  font-size: 12px;
  gap: 8px;
  margin: 0;
}

.order-detail__item-qty {
  color: #a1a1aa;
}

.order-detail__item-total {
  color: #18181b;
  flex-shrink: 0;
  font-size: 15px;
  font-weight: 700;
  text-align: right;
}

/* ── Pricing ─── */
.order-detail__pricing {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
}

.order-detail__pricing-row {
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
}

.order-detail__pricing-row dt {
  color: #71717a;
  margin: 0;
}

.order-detail__pricing-row dd {
  color: #18181b;
  font-weight: 600;
  margin: 0;
}

.order-detail__pricing-row--discount dt,
.order-detail__pricing-row--discount dd {
  color: #16a34a;
}

.order-detail__pricing-amount {
  color: var(--irus-color-accent) !important;
  font-size: 16px !important;
}

.order-detail__pricing-total {
  align-items: center;
  border-top: 2px solid #18181b;
  display: flex;
  font-size: 15px;
  font-weight: 700;
  justify-content: space-between;
  margin-top: 6px;
  padding-top: 12px;
}

.order-detail__pricing-total dt {
  color: #18181b;
  margin: 0;
}

.order-detail__pricing-total dd {
  color: var(--irus-color-accent);
  font-size: 18px;
  margin: 0;
}

/* ── Grid 2 col ─── */
.order-detail__grid {
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .order-detail__grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* ── Address ─── */
.order-detail__address {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}

.order-detail__address-name {
  align-items: baseline;
  color: #18181b;
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;
  gap: 8px;
  margin: 0;
}

.order-detail__address-name strong {
  font-weight: 700;
}

.order-detail__address-phone {
  color: #71717a;
  font-size: 13px;
  font-weight: 500;
}

.order-detail__address-line {
  color: #52525b;
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
}

.order-detail__delivery {
  border-top: 1px solid #f4f4f5;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
}

/* ── Payment ─── */
.order-detail__payment-badge {
  align-items: center;
  background: #f9f9fb;
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
  padding: 10px 14px;
}

.order-detail__payment-badge i {
  color: var(--irus-color-accent);
  font-size: 18px;
}

.order-detail__payment-method {
  color: #18181b;
  font-size: 14px;
  font-weight: 700;
  flex: 1;
}

.order-detail__payment-status {
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
}

.order-detail__payment-status--success {
  background: #f0fdf4;
  color: #16a34a;
}

.order-detail__payment-status--failed {
  background: #fef2f2;
  color: #dc2626;
}

.order-detail__payment-status--pending {
  background: #fffbeb;
  color: #d97706;
}

/* ── Note ─── */
.order-detail__note {
  background: #f9f9fb;
  border-radius: 10px;
  color: #52525b;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  padding: 12px 14px;
}

/* ── Actions ─── */
.order-detail__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 4px;
}

.order-detail__btn {
  align-items: center;
  border: 0;
  border-radius: 10px;
  cursor: pointer;
  display: inline-flex;
  font-size: 14px;
  font-weight: 600;
  gap: 6px;
  justify-content: center;
  min-height: 42px;
  padding: 10px 18px;
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease;
}

.order-detail__btn--ghost {
  background: #f4f4f5;
  color: #52525b;
}

.order-detail__btn--ghost:hover {
  background: #e4e4e7;
  color: #18181b;
}

.order-detail__btn--primary {
  background: var(--irus-color-accent);
  color: #fff;
}

.order-detail__btn--primary:hover {
  background: var(--irus-color-accent-hover);
  color: #fff;
}

.order-detail__btn--danger {
  background: #fef2f2;
  color: #dc2626;
}

.order-detail__btn--danger:hover:not(:disabled) {
  background: #fee2e2;
}

.order-detail__btn--danger:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* ── Skeleton ─── */
.order-detail__skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-detail__skeleton-header {
  background: linear-gradient(90deg, #f4f4f5 25%, #e4e4e7 50%, #f4f4f5 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 18px;
  height: 80px;
}

.order-detail__skeleton-card {
  background: linear-gradient(90deg, #f4f4f5 25%, #e4e4e7 50%, #f4f4f5 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 18px;
  height: 140px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* ── Empty ─── */
.order-detail__empty {
  align-items: center;
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 48px 24px;
  text-align: center;
}

.order-detail__empty-icon {
  color: #d97706;
  font-size: 56px;
}

.order-detail__empty h3 {
  color: #18181b;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.order-detail__empty p {
  color: #71717a;
  font-size: 14px;
  margin: 0 0 8px;
  max-width: 360px;
}

/* ── Responsive ─── */
@media (max-width: 767.98px) {
  .order-detail__header {
    border-radius: 14px;
    padding: 14px 16px;
  }

  .order-detail__title {
    font-size: 16px;
  }

  .order-detail__back {
    height: 36px;
    width: 36px;
  }

  .order-detail__card {
    border-radius: 14px;
    padding: 16px;
  }

  .order-detail__section-title {
    font-size: 14px;
  }

  .order-detail__item-img {
    height: 56px;
    width: 56px;
  }

  .order-detail__item-name {
    font-size: 13px;
  }

  .order-detail__item-total {
    font-size: 14px;
  }

  .order-detail__pricing-total dd {
    font-size: 17px;
  }

  .order-detail__btn {
    flex: 1;
    min-width: 140px;
  }
}

@media (max-width: 575.98px) {
  .order-detail__header {
    border-radius: 12px;
    padding: 12px 14px;
  }

  .order-detail__title {
    font-size: 15px;
  }

  .order-detail__date {
    font-size: 12px;
  }

  .order-detail__status {
    font-size: 12px;
    padding: 4px 10px;
  }

  .order-detail__card {
    border-radius: 12px;
    padding: 14px;
  }

  .order-detail__item {
    gap: 10px;
  }

  .order-detail__item-img {
    height: 48px;
    width: 48px;
  }

  .order-detail__item-name {
    font-size: 13px;
  }

  .order-detail__item-total {
    font-size: 13px;
  }

  .order-detail__pricing-row {
    font-size: 13px;
  }

  .order-detail__pricing-total {
    font-size: 14px;
  }

  .order-detail__pricing-total dd {
    font-size: 16px;
  }

  .order-detail__btn {
    font-size: 13px;
    min-height: 40px;
    padding: 8px 14px;
  }
}

/* ── Bottom clearance for mobile bottom nav ─── */
@media (max-width: 991.98px) {
  .order-detail-page {
    padding-bottom: 110px;
  }
}

@media (max-width: 767.98px) {
  .order-detail-page {
    padding-bottom: 100px;
  }
}

@media (max-width: 575.98px) {
  .order-detail-page {
    padding-bottom: 90px;
  }
}

@media (max-width: 480px) {
  .order-detail-page {
    padding-bottom: 80px;
  }
}
</style>
