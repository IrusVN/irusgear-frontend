<template>
  <article
    :class="[
      'cart-item',
      {
        'cart-item--warning': item.warnings?.length,
        'cart-item--pending': busy,
      },
    ]"
  >
    <img :src="item.thumbnail || fallbackImage" :alt="item.productName" class="cart-item__image">

    <div class="cart-item__content">
      <div class="cart-item__top">
        <div class="cart-item__info">
          <NuxtLink
            v-if="productLink"
            :to="productLink"
            class="cart-item__name cart-item__name--link"
          >
            {{ item.productName }}
          </NuxtLink>
          <p v-else class="cart-item__name">{{ item.productName }}</p>

          <div v-if="optionEntries.length" class="cart-item__options">
            <span
              v-for="[key, value] in optionEntries"
              :key="`${item.id}-${key}-${value}`"
              class="cart-item__option"
            >
              {{ key }}: {{ value }}
            </span>
          </div>

          <div v-if="statusChips.length" class="cart-item__chips">
            <span
              v-for="chip in statusChips"
              :key="chip.label"
              :class="['cart-item__chip', `cart-item__chip--${chip.tone}`]"
            >
              {{ chip.label }}
            </span>
          </div>

          <ul v-if="item.warnings?.length" class="cart-item__warnings">
            <li v-for="warning in item.warnings" :key="warning">{{ warning }}</li>
          </ul>
        </div>

        <button
          type="button"
          class="cart-item__remove"
          :disabled="busy"
          :aria-label="$t('cart.removeFromCart')"
          @click="emit('remove', item.id)"
        >
          <i class="bi bi-trash3"></i>
        </button>
      </div>

      <div class="cart-item__bottom">
        <div class="cart-item__price">
          <strong>{{ item.currentUnitPrice?.formatted || item.unitPrice?.formatted }}</strong>
          <span v-if="item.priceChanged" class="cart-item__old-price">
            {{ item.unitPrice?.formatted }}
          </span>
        </div>

        <div class="cart-item__quantity-wrap">
          <span class="cart-item__quantity-label">{{ $t('cart.quantity') }}</span>

          <div class="cart-item__quantity">
            <button
              type="button"
              class="cart-item__quantity-btn"
              :disabled="busy || item.quantity <= 1"
              :aria-label="$t('cart.decreaseQuantity')"
              @click="decrement"
            >
              <i class="bi bi-dash"></i>
            </button>

            <span class="cart-item__quantity-value">{{ item.quantity }}</span>

            <button
              type="button"
              class="cart-item__quantity-btn"
              :disabled="busy || item.availability?.inStock === false"
              :aria-label="$t('cart.increaseQuantity')"
              @click="increment"
            >
              <i class="bi bi-plus"></i>
            </button>
          </div>
        </div>

        <div class="cart-item__line-total">
          <span class="cart-item__line-total-label">{{ $t('cart.total') }}</span>
          <strong>{{ item.currentLineTotal?.formatted || item.lineTotal?.formatted }}</strong>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";
import { useLocalePath, useI18n } from "#imports";

const { t } = useI18n();

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  busy: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update-quantity", "remove"]);

const fallbackImage = "https://placehold.co/96x96/f4f4f5/d4d4d8?text=%20";
const localePath = useLocalePath();

const optionEntries = computed(() => {
  const options = props.item?.selectedOptions || {};

  return Object.entries(options).filter(([, value]) => Boolean(value));
});

const productLink = computed(() => {
  if (!props.item?.productUrl) {
    return null;
  }

  return localePath(props.item.productUrl);
});

const statusChips = computed(() => {
  const chips = [];

  if (props.item?.availability?.isActive === false) {
    chips.push({
      label: t('cart.stoppedSelling'),
      tone: "danger",
    });
  } else if (props.item?.availability?.inStock === false) {
    chips.push({
      label: t('cart.outOfStock'),
      tone: "warning",
    });
  }

  if (props.item?.priceChanged) {
    chips.push({
      label: t('cart.newPrice'),
      tone: "info",
    });
  }

  return chips;
});

const decrement = () => {
  emit("update-quantity", {
    itemId: props.item.id,
    quantity: props.item.quantity - 1,
  });
};

const increment = () => {
  emit("update-quantity", {
    itemId: props.item.id,
    quantity: props.item.quantity + 1,
  });
};
</script>

<style scoped>
.cart-item {
  align-items: flex-start;
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 24px;
  display: flex;
  gap: 16px;
  padding: 18px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.cart-item--warning {
  border-color: #fed7aa;
  box-shadow: 0 10px 24px rgba(194, 65, 12, 0.05);
}

.cart-item--pending {
  opacity: 0.75;
}

.cart-item__image {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  flex-shrink: 0;
  height: 96px;
  object-fit: cover;
  width: 96px;
}

.cart-item__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
}

.cart-item__top,
.cart-item__bottom {
  display: flex;
  gap: 16px;
  justify-content: space-between;
}

.cart-item__info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.cart-item__name {
  color: #18181b;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.45;
  margin: 0;
}

.cart-item__name--link {
  text-decoration: none;
}

.cart-item__options,
.cart-item__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cart-item__option,
.cart-item__chip {
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 10px;
}

.cart-item__option {
  background: #f7f7f8;
  color: #52525b;
}

.cart-item__chip--info {
  background: #eff6ff;
  color: #2563eb;
}

.cart-item__chip--warning {
  background: #fff7ed;
  color: #c2410c;
}

.cart-item__chip--danger {
  background: #fff1f2;
  color: #be123c;
}

.cart-item__warnings {
  color: #c2410c;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding-left: 18px;
}

.cart-item__warnings li {
  font-size: 13px;
  line-height: 1.5;
}

.cart-item__remove {
  align-items: center;
  background: #fff1f2;
  border: 0;
  border-radius: 14px;
  color: #d70018;
  display: inline-flex;
  flex-shrink: 0;
  height: 42px;
  justify-content: center;
  width: 42px;
}

.cart-item__remove:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.cart-item__price {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cart-item__price strong,
.cart-item__line-total strong {
  color: #d70018;
  font-size: 18px;
  font-weight: 800;
}

.cart-item__old-price {
  color: #a1a1aa;
  font-size: 12px;
  text-decoration: line-through;
}

.cart-item__quantity-wrap,
.cart-item__line-total {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cart-item__quantity-label,
.cart-item__line-total-label {
  color: #71717a;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3;
}

.cart-item__quantity {
  align-items: center;
  background: #f7f7f8;
  border-radius: 999px;
  display: inline-flex;
  gap: 4px;
  padding: 4px;
}

.cart-item__quantity-btn {
  align-items: center;
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 999px;
  color: #18181b;
  display: inline-flex;
  height: 34px;
  justify-content: center;
  width: 34px;
}

.cart-item__quantity-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.cart-item__quantity-value {
  color: #18181b;
  font-weight: 700;
  min-width: 34px;
  text-align: center;
}

.cart-item__line-total {
  align-items: flex-end;
  min-width: 110px;
}

@media (max-width: 767.98px) {
  .cart-item {
    flex-direction: column;
  }

  .cart-item__image {
    height: 88px;
    width: 88px;
  }

  .cart-item__top,
  .cart-item__bottom {
    flex-direction: column;
  }

  .cart-item__line-total {
    align-items: flex-start;
    min-width: 0;
  }
}

@media (max-width: 575.98px) {
  .cart-item__name {
    font-size: 13px;
  }

  .cart-item__options,
  .cart-item__chips {
    gap: 4px;
  }

  .cart-item__option,
  .cart-item__chip {
    font-size: 10px;
    padding: 2px 6px;
  }

  .cart-item__warnings li {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .cart-item__quantity {
    gap: 4px;
  }

  .cart-item__quantity-btn {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }

  .cart-item__quantity-value {
    min-width: 28px;
    font-size: 13px;
  }
}
</style>
