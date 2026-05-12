<template>
  <div class="voucher-history-page">
    <div class="container">
      <div class="voucher-history-page__header">
        <h1 class="voucher-history-page__title">
          <i class="bi bi-ticket-perforated"></i>
          {{ $t("voucherHistory.title") }}
        </h1>
        <p v-if="totalSavings > 0" class="voucher-history-page__total">
          {{ $t("voucherHistory.totalSaved") }}:
          <strong>{{ formatMoney(totalSavings) }}</strong>
        </p>
      </div>

      <div v-if="loading" class="voucher-history-page__loading">
        <div v-for="i in 3" :key="i" class="skeleton skeleton-card"></div>
      </div>

      <div v-else-if="error" class="voucher-history-page__error">
        <i class="bi bi-exclamation-triangle"></i>
        <span>{{ error }}</span>
        <button type="button" class="btn-retry" @click="fetchHistory">
          {{ $t("voucherHistory.retry") }}
        </button>
      </div>

      <div v-else-if="history.length === 0" class="voucher-history-page__empty">
        <i class="bi bi-ticket"></i>
        <p>{{ $t("voucherHistory.empty") }}</p>
      </div>

      <div v-else class="voucher-history-page__list">
        <div
          v-for="item in history"
          :key="item.code"
          class="voucher-history-card"
        >
          <div class="voucher-history-card__icon">
            <i class="bi bi-check-circle-fill"></i>
          </div>
          <div class="voucher-history-card__content">
            <div class="voucher-history-card__header">
              <strong class="voucher-history-card__code">{{ item.code }}</strong>
              <span class="voucher-history-card__badge" :class="getBadgeClass(item.discountType)">
                {{ getBadgeText(item) }}
              </span>
            </div>
            <p class="voucher-history-card__desc">{{ item.name }}</p>
            <p class="voucher-history-card__meta">
              <i class="bi bi-calendar3"></i>
              {{ $t("voucherHistory.usedOn") }}: {{ formatDate(item.lastUsedAt) }}
              <span class="voucher-history-card__times">
                · {{ $t("voucherHistory.usedCount", { count: item.timesUsed }) }}
              </span>
            </p>
          </div>
          <div class="voucher-history-card__savings">
            <span class="voucher-history-card__savings-amount">
              -{{ formatMoney(item.discountValue) }}
            </span>
            <span class="voucher-history-card__savings-label">
              {{ $t("voucherHistory.saved") }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useFeGlobalStore } from "@/stores/feGlobalStore";

definePageMeta({
  layout: "default",
  middleware: ['auth-guard'],
});

const feGlobalStore = useFeGlobalStore();

const history = ref([]);
const loading = ref(true);
const error = ref(null);

const totalSavings = computed(() => {
  return history.value.reduce((sum, item) => sum + (item.totalDiscountReceived || 0), 0);
});

const fetchHistory = async () => {
  loading.value = true;
  error.value = null;
  try {
    feGlobalStore.setApiUrl("checkout/vouchers/history");
    const response = await feGlobalStore.fetchItem();
    history.value = response?.data || [];
  } catch (e) {
    error.value = e?.data?.message || "Không thể tải lịch sử voucher.";
  } finally {
    loading.value = false;
  }
};

const formatMoney = (value) => {
  if (!value && value !== 0) return "0đ";
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
};

const getBadgeClass = (discountType) => {
  if (discountType === "freeship") return "badge--freeship";
  if (discountType === "percent") return "badge--percent";
  return "badge--fixed";
};

const getBadgeText = (item) => {
  if (item.discountType === "freeship") return "Freeship";
  if (item.discountType === "percent") return `${item.discountValue}%`;
  return formatMoney(item.discountValue);
};

onMounted(fetchHistory);
</script>

<style scoped>
.voucher-history-page {
  padding: 24px 0 60px;
}

.voucher-history-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}

.voucher-history-page__title {
  align-items: center;
  color: #18181b;
  display: flex;
  font-size: 24px;
  font-weight: 700;
  gap: 10px;
  margin: 0;
}

.voucher-history-page__title i {
  color: var(--irus-color-accent);
}

.voucher-history-page__total {
  color: #15803d;
  font-size: 15px;
  margin: 0;
}

.voucher-history-page__total strong {
  font-size: 18px;
}

.voucher-history-page__loading {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton {
  background: linear-gradient(90deg, #f4f4f5 25%, #e4e4e7 50%, #f4f4f5 75%);
  background-size: 200% 100%;
  border-radius: 12px;
  animation: shimmer 1.5s infinite;
}

.skeleton-card {
  height: 80px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.voucher-history-page__error {
  align-items: center;
  background: #fff1f2;
  border: 1px solid #fecdd3;
  border-radius: 12px;
  color: #be123c;
  display: flex;
  font-size: 14px;
  gap: 8px;
  padding: 16px;
}

.btn-retry {
  background: none;
  border: 1px solid currentColor;
  border-radius: 6px;
  color: inherit;
  cursor: pointer;
  font-size: 13px;
  padding: 4px 12px;
}

.voucher-history-page__empty {
  align-items: center;
  color: #a1a1aa;
  display: flex;
  flex-direction: column;
  font-size: 15px;
  gap: 12px;
  padding: 60px 0;
  text-align: center;
}

.voucher-history-page__empty i {
  font-size: 48px;
}

.voucher-history-page__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.voucher-history-card {
  align-items: center;
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 14px;
  display: flex;
  gap: 14px;
  padding: 16px 18px;
  transition: box-shadow 0.15s ease;
}

.voucher-history-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.voucher-history-card__icon {
  color: #15803d;
  font-size: 28px;
  flex-shrink: 0;
}

.voucher-history-card__content {
  flex: 1;
  min-width: 0;
}

.voucher-history-card__header {
  align-items: center;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.voucher-history-card__code {
  color: #18181b;
  font-size: 15px;
  font-weight: 700;
}

.voucher-history-card__badge {
  border-radius: 6px;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  background: var(--irus-color-accent);
}

.voucher-history-card__badge--percent {
  background: #b91c1c;
}

.voucher-history-card__badge--freeship {
  background: #0ea5e9;
}

.voucher-history-card__desc {
  color: #52525b;
  font-size: 13px;
  margin: 2px 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.voucher-history-card__meta {
  color: #a1a1aa;
  font-size: 12px;
  margin: 4px 0 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.voucher-history-card__times {
  color: #71717a;
}

.voucher-history-card__savings {
  flex-shrink: 0;
  text-align: right;
}

.voucher-history-card__savings-amount {
  color: #15803d;
  display: block;
  font-size: 16px;
  font-weight: 700;
}

.voucher-history-card__savings-label {
  color: #a1a1aa;
  font-size: 11px;
}

@media (max-width: 991.98px) {
  .voucher-history-page {
    padding: 20px 0 60px;
  }

  .voucher-history-page__header {
    margin-bottom: 20px;
  }

  .voucher-history-page__title {
    font-size: 22px;
    gap: 8px;
  }

  .voucher-history-page__title i {
    font-size: 20px;
  }

  .voucher-history-page__total {
    font-size: 14px;
  }

  .voucher-history-page__total strong {
    font-size: 16px;
  }

  .voucher-history-page__list {
    gap: 10px;
  }

  .voucher-history-card {
    padding: 14px 16px;
    gap: 12px;
  }

  .voucher-history-card__icon {
    font-size: 24px;
  }

  .voucher-history-card__code {
    font-size: 14px;
  }

  .voucher-history-card__desc {
    font-size: 12px;
  }

  .voucher-history-card__savings-amount {
    font-size: 15px;
  }
}

@media (max-width: 767.98px) {
  .voucher-history-page {
    padding: 16px 0 60px;
  }

  .voucher-history-page__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 16px;
  }

  .voucher-history-page__title {
    font-size: 20px;
  }

  .voucher-history-page__total {
    font-size: 14px;
  }

  .voucher-history-page__total strong {
    font-size: 15px;
  }

  .voucher-history-page__list {
    gap: 10px;
  }

  .voucher-history-card {
    padding: 12px 14px;
    gap: 10px;
    border-radius: 12px;
  }

  .voucher-history-card__icon {
    font-size: 22px;
  }

  .voucher-history-card__code {
    font-size: 13px;
  }

  .voucher-history-card__desc {
    font-size: 12px;
  }

  .voucher-history-card__meta {
    font-size: 11px;
  }

  .voucher-history-card__savings-amount {
    font-size: 14px;
  }

  .voucher-history-page__empty {
    padding: 48px 0;
  }
}

@media (max-width: 575.98px) {
  .voucher-history-card {
    flex-wrap: wrap;
  }

  .voucher-history-card__savings {
    width: 100%;
    text-align: left;
    padding-top: 8px;
    border-top: 1px solid #f0f0f2;
  }
}

/* ── Bottom Clearance: Mobile Bottom Nav ─── */
@media (max-width: 991.98px) {
  .voucher-history-page {
    padding-bottom: 110px;
  }
}

@media (max-width: 767.98px) {
  .voucher-history-page {
    padding-bottom: 100px;
  }
}

@media (max-width: 575.98px) {
  .voucher-history-page {
    padding-bottom: 90px;
  }
}

@media (max-width: 480px) {
  .voucher-history-page {
    padding-bottom: 80px;
  }
}
</style>
