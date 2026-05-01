<template>
  <label
    :class="['delivery-option', { 'delivery-option--selected': selected }]"
    :for="`delivery-${option.id}`"
  >
    <input
      :id="`delivery-${option.id}`"
      type="radio"
      :value="option.id"
      :checked="selected"
      class="delivery-option__input"
      @change="$emit('select')"
    />

    <div class="delivery-option__radio">
      <span class="delivery-option__check">
        <i class="bi bi-check"></i>
      </span>
    </div>

    <div class="delivery-option__content">
      <div class="delivery-option__header">
        <div class="delivery-option__info">
          <span class="delivery-option__name">{{ option.name }}</span>
          <span class="delivery-option__time">{{ option.estimatedDays || option.estimatedHours || option.estimatedText || option.time }}</span>
        </div>
        <span class="delivery-option__price">
          <template v-if="option.fee > 0">
            {{ formatMoney(option.fee) }}
          </template>
          <template v-else>
            <span class="delivery-option__free">{{ $t("checkout.free") }}</span>
          </template>
        </span>
      </div>
      <p class="delivery-option__desc">{{ option.description }}</p>
    </div>
  </label>
</template>

<script setup>
defineProps({
  option: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["select"]);

const formatMoney = (value) => {
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
};
</script>

<style scoped>
.delivery-option {
  align-items: flex-start;
  border: 1.5px solid #e4e4e7;
  border-radius: 14px;
  cursor: pointer;
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  transition: border-color 0.2s ease, box-shadow 0.15s ease, background 0.15s ease;
  min-width: 320px;
  max-width: 320px;
  flex-shrink: 0;
  flex-grow: 0;
  scroll-snap-align: start;
  box-sizing: border-box;
}

.delivery-option:hover {
  border-color: #d4d4d8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.delivery-option--selected {
  border-color: #d70018;
  background: #fff7f7;
}

.delivery-option__input {
  display: none;
}

.delivery-option__radio {
  align-items: center;
  display: flex;
  flex-shrink: 0;
  padding-top: 2px;
}

.delivery-option__check {
  align-items: center;
  border: 2px solid #d4d4d8;
  border-radius: 999px;
  color: transparent;
  display: inline-flex;
  font-size: 10px;
  height: 20px;
  justify-content: center;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.15s ease;
  width: 20px;
}

.delivery-option--selected .delivery-option__check {
  background: #d70018;
  border-color: #d70018;
  color: #fff;
}

.delivery-option__content {
  flex: 1;
  min-width: 0;
}

.delivery-option__header {
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.delivery-option__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.delivery-option__name {
  color: #18181b;
  font-size: 15px;
  font-weight: 700;
}

.delivery-option__time {
  color: #71717a;
  font-size: 12px;
}

.delivery-option__price {
  color: #18181b;
  font-size: 15px;
  font-weight: 700;
  flex-shrink: 0;
}

.delivery-option__free {
  color: #15803d;
}

.delivery-option__desc {
  color: #71717a;
  font-size: 13px;
  margin: 4px 0 0;
}

@media (max-width: 575.98px) {
  .delivery-option {
    min-width: calc(100vw - 28px);
    max-width: calc(100vw - 28px);
  }
}
</style>
