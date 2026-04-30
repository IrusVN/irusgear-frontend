<template>
  <article
    :class="['address-card', { 'address-card--selected': selected }]"
    :aria-selected="selected"
    role="button"
    tabindex="0"
    @click="$emit('select')"
    @keydown.enter="$emit('select')"
    @keydown.space.prevent="$emit('select')"
  >
    <div class="address-card__check" aria-hidden="true">
      <i class="bi bi-check-lg"></i>
    </div>

    <div class="address-card__body">
      <div class="address-card__label-row">
        <i :class="address.label === 'office' ? 'bi bi-building' : 'bi bi-house'"></i>
        <span class="address-card__label">
          {{ address.label === "office" ? $t("checkout.office") : $t("checkout.home") }}
        </span>
        <span v-if="isDefault" class="address-card__badge">
          {{ $t("checkout.default") }}
        </span>
      </div>

      <div class="address-card__contact">
        <span class="address-card__name">{{ address.name }}</span>
        <span class="address-card__separator">•</span>
        <span class="address-card__phone">{{ formatPhone(address.phone) }}</span>
      </div>

      <p class="address-card__address">{{ fullAddress }}</p>

      <div class="address-card__actions">
        <button
          v-if="showSetDefault"
          type="button"
          class="address-card__action address-card__action--muted"
          :disabled="checkoutStore.setDefaultLoading"
          @click.stop="$emit('set-default')"
        >
          {{ checkoutStore.setDefaultLoading ? $t("checkout.settingDefault") : $t("checkout.setDefault") }}
        </button>
        <button
          type="button"
          class="address-card__action address-card__action--primary"
          @click.stop="$emit('edit')"
        >
          {{ $t("checkout.edit") }}
        </button>
        <button
          type="button"
          class="address-card__action address-card__action--danger"
          @click.stop="handleDelete"
        >
          {{ $t("checkout.delete") }}
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "#imports";
import { useCheckoutStore } from "@/stores/checkoutStore";

const props = defineProps({
  address: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["select", "edit", "delete", "set-default"]);

const checkoutStore = useCheckoutStore();

const isDefault = computed(() => !!props.address.is_default);
const showSetDefault = computed(() => !props.address.is_default);

const fullAddress = computed(() => {
  // Backend trả province/district/ward là object {code, name}
  const ward = props.address.ward?.name || props.address.ward;
  const district = props.address.district?.name || props.address.district;
  const province = props.address.province?.name || props.address.province;
  const parts = [
    props.address.detail,
    ward,
    district,
    province,
  ].filter(Boolean);
  return parts.join(", ");
});

const formatPhone = (phone) => {
  if (!phone) return "";
  return phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
};

const handleDelete = () => {
  if (confirm("Xóa địa chỉ này?")) {
    emit("delete");
  }
};
</script>

<style scoped>
.address-card {
  background: #fff;
  border: 1.5px solid #ececf1;
  border-radius: 12px;
  cursor: pointer;
  padding: 12px 14px;
  position: relative;
  transition: border-color 0.2s ease, box-shadow 0.15s ease, transform 0.15s ease;
  min-width: 300px;
  max-width: 300px;
  flex-shrink: 0;
  flex-grow: 0;
  scroll-snap-align: start;
  box-sizing: border-box;
}

.address-card:hover {
  border-color: #d4d4d8;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

.address-card--selected {
  border-color: #d70018;
  border-width: 2px;
  background: #fff7f7;
}

.address-card__check {
  align-items: center;
  background: #d70018;
  border-radius: 999px;
  color: #fff;
  display: inline-flex;
  font-size: 11px;
  height: 20px;
  justify-content: center;
  position: absolute;
  right: 10px;
  top: 10px;
  width: 20px;
  opacity: 0;
  transform: scale(0.5);
  transition: opacity 0.2s ease, transform 0.15s ease;
}

.address-card--selected .address-card__check {
  opacity: 1;
  transform: scale(1);
}

.address-card__badge {
  background: #d70018;
  border-radius: 999px;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 8px;
}

.address-card__body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.address-card__label-row {
  align-items: center;
  color: #71717a;
  display: flex;
  font-size: 13px;
  gap: 4px;
  margin-bottom: 4px;
  position: relative;
  padding-right: 32px;
}

.address-card__contact {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.address-card__name {
  color: #18181b;
  font-size: 15px;
  font-weight: 700;
  margin: 0;
}

.address-card__separator {
  color: #d4d4d8;
  font-size: 14px;
}

.address-card__phone {
  color: #52525b;
  font-size: 13px;
  margin: 0;
}

.address-card__address {
  color: #71717a;
  font-size: 13px;
  line-height: 1.5;
  margin: 4px 0 0;
  /* Giới hạn 2 dòng cho address */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.address-card__actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.address-card__action {
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 10px;
  transition: background 0.15s ease;
}

.address-card__action--muted {
  background: #f4f4f5;
  color: #52525b;
}

.address-card__action--muted:hover {
  background: #e4e4e7;
}

.address-card__action--primary {
  background: #f7f7f8;
  color: #d70018;
}

.address-card__action--primary:hover {
  background: #fff7f7;
}

.address-card__action--danger {
  background: #fff;
  color: #be123c;
}

.address-card__action--danger:hover {
  background: #fff1f2;
}

@media (max-width: 575.98px) {
  .address-card {
    padding: 10px 12px;
    min-width: calc(100vw - 48px);
    max-width: calc(100vw - 48px);
  }

  .address-card__name {
    font-size: 14px;
  }

  .address-card__phone {
    font-size: 12px;
  }

  .address-card__actions {
    gap: 6px;
  }

  .address-card__action {
    padding: 4px 8px;
    font-size: 11px;
  }
}
</style>
