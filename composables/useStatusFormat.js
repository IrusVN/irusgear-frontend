import { useI18n } from "#imports";

/**
 * useStatusFormat — chuẩn hoá việc hiển thị status trên admin pages.
 *
 * Vì:
 *   - BE trả `status` ở nhiều shape khác nhau giữa các bảng:
 *     * users: `'0' | '1' | '2' | '3'` (UserStatus enum, ví dụ ACTIVE = '1')
 *     * orders: `'pending' | 'paid' | 'cancelled' | ...` (PaymentStatus / OrderStatus)
 *     * products: `'publish' | 'draft' | 'inactive' | 'scheduled'`
 *     * reviews: `'pending' | 'approved' | 'rejected'` (đôi khi 'published')
 *   - i18n keys nằm rải `admin.status.*` cho cái chung + `admin.products.*` cho riêng.
 *
 * Composable này chuẩn hoá:
 *   1. Map raw value → key chuẩn (vd '1' → 'active', 'approved' → 'published').
 *   2. Resolve label từ i18n theo namespace ưu tiên.
 *   3. Trả thêm variant cho `<AdminStatusBadge>` (success/warning/danger/info/neutral).
 *
 * Usage:
 *   const { formatUserStatus, formatPaymentStatus, formatProductStatus } = useStatusFormat();
 *   const { label, variant } = formatUserStatus(customer.status);
 *   <AdminStatusBadge :label="label" :variant="variant" />
 */

// ── Mapping: raw BE value → canonical key (FE-friendly) ──────────────────────

/** UserStatus enum của BE dùng code '0'..'3' — map sang key text cho dễ đọc. */
const USER_CODE_TO_KEY = {
  0: "inactive",
  1: "active",
  2: "pending",
  3: "banned",
  // Hỗ trợ dạng string nếu BE đã decode trước:
  inactive: "inactive",
  active: "active",
  pending: "pending",
  banned: "banned",
  // Legacy alias (1 vài chỗ FE cũ dùng 'blocked')
  blocked: "banned",
};

/** ProductStatus FE — match BE ProductController returns. */
const PRODUCT_KEYS = new Set(["publish", "draft", "inactive", "scheduled"]);

/** ReviewStatus — BE trả 'approved' nhưng UI prefers 'published'. */
const REVIEW_ALIAS = { approved: "published" };

/** OrderStatus + PaymentStatus — sử dụng key trực tiếp từ BE enum. */
const ORDER_PAYMENT_KEYS = new Set([
  // Order
  "pending",
  "awaiting_payment",
  "confirmed",
  "processing",
  "ready_to_ship",
  "shipped",
  "delivering",
  "delivered",
  "delivery_failed",
  "cancelled",
  "refunding",
  "refunded",
  "returned",
  // Payment
  "paid",
  "completed",
  "failed",
]);

// ── Variant maps cho <AdminStatusBadge> ───────────────────────────────────────

const USER_VARIANTS = {
  active: "success",
  inactive: "neutral",
  pending: "warning",
  banned: "danger",
};

const PRODUCT_VARIANTS = {
  publish: "success",
  scheduled: "warning",
  inactive: "danger",
  draft: "neutral",
};

const REVIEW_VARIANTS = {
  published: "success",
  approved: "success",
  pending: "warning",
  rejected: "danger",
};

const ORDER_PAYMENT_VARIANTS = {
  pending: "warning",
  awaiting_payment: "warning",
  confirmed: "info",
  processing: "info",
  ready_to_ship: "info",
  shipped: "info",
  delivering: "info",
  delivered: "success",
  delivery_failed: "danger",
  paid: "success",
  completed: "success",
  failed: "danger",
  cancelled: "neutral",
  refunding: "warning",
  refunded: "neutral",
  returned: "danger",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Try resolving i18n key qua nhiều namespace; fallback raw value. */
const resolveLabel = (t, key, namespaces, raw) => {
  if (!key) return String(raw ?? "");
  for (const ns of namespaces) {
    const fullKey = `${ns}.${key}`;
    const out = t(fullKey);
    // vue-i18n trả lại key nếu không tìm thấy → coi như miss
    if (out !== fullKey) return out;
  }
  // Fallback: capitalize raw key
  return key.charAt(0).toUpperCase() + key.slice(1);
};

// ── Composable ───────────────────────────────────────────────────────────────

export const useStatusFormat = () => {
  const { t } = useI18n();

  /**
   * User/Customer status.
   * Accept: '0'..'3', 0..3, 'active'/'inactive'/'pending'/'banned'/'blocked'.
   */
  const formatUserStatus = (raw) => {
    const key = USER_CODE_TO_KEY[raw] ?? null;
    return {
      label: resolveLabel(t, key, ["admin.status", "admin.customers"], raw),
      variant: USER_VARIANTS[key] || "neutral",
      key,
    };
  };

  /**
   * Order / Payment status.
   * Accept: 'pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded', ...
   */
  const formatPaymentStatus = (raw) => {
    const key = ORDER_PAYMENT_KEYS.has(raw) ? raw : null;
    return {
      label: resolveLabel(t, key, ["admin.status", "admin.orders"], raw),
      variant: ORDER_PAYMENT_VARIANTS[key] || "neutral",
      key,
    };
  };

  /**
   * Product status.
   * Accept: 'publish', 'draft', 'inactive', 'scheduled'.
   */
  const formatProductStatus = (raw) => {
    const key = PRODUCT_KEYS.has(raw) ? raw : null;
    return {
      label: resolveLabel(t, key, ["admin.products", "admin.status"], raw),
      variant: PRODUCT_VARIANTS[key] || "neutral",
      key,
    };
  };

  /**
   * Review status.
   * Accept: 'pending', 'approved'/'published', 'rejected'.
   */
  const formatReviewStatus = (raw) => {
    const normalized = REVIEW_ALIAS[raw] || raw;
    return {
      label: resolveLabel(t, normalized, ["admin.reviews", "admin.status"], raw),
      variant: REVIEW_VARIANTS[normalized] || "neutral",
      key: normalized,
    };
  };

  return {
    formatUserStatus,
    formatPaymentStatus,
    formatProductStatus,
    formatReviewStatus,
  };
};
