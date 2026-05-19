<template>
  <div class="cart-empty">
    <div class="cart-empty__icon">
      <i class="bi bi-cart-x"></i>
    </div>
    <h2 class="cart-empty__title">{{ $t('cart.emptyTitle') }}</h2>
    <p class="cart-empty__description">
      {{ $t('cart.emptyDescription') }}
    </p>

    <NuxtLink :to="localePath('/products')" class="cart-empty__cta">
      {{ $t('cart.exploreProducts') }}
    </NuxtLink>

    <div class="cart-empty__chips">
      <NuxtLink
        v-for="link in quickLinks"
        :key="link.label"
        :to="localePath(link.to)"
        class="cart-empty__chip"
      >
        {{ link.label }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useLocalePath, useI18n } from "#imports";

const localePath = useLocalePath();
const { t } = useI18n();

const quickLinks = computed(() => [
  {
    label: t('cart.laptop'),
    to: {
      path: "/products",
      query: {
        category: "laptop",
        sort: "newest",
        limit: "20",
      },
    },
  },
  {
    label: t('cart.audio'),
    to: {
      path: "/products",
      query: {
        category: "am-thanh",
        sort: "newest",
        limit: "20",
      },
    },
  },
  {
    label: t('cart.watch'),
    to: {
      path: "/products",
      query: {
        category: "dong-ho",
        sort: "newest",
        limit: "20",
      },
    },
  },
  {
    label: t('cart.accessory'),
    to: {
      path: "/products",
      query: {
        category: "phu-kien",
        sort: "newest",
        limit: "20",
      },
    },
  },
]);
</script>

<style scoped>
.cart-empty {
  align-items: center;
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 0 auto;
  padding: clamp(32px, 5vw, 56px) clamp(20px, 4vw, 40px);
  text-align: center;
  width: 100%;
}

.cart-empty__icon {
  align-items: center;
  background: var(--irus-color-accent-soft);
  border-radius: 50%;
  color: var(--irus-color-accent);
  display: flex;
  font-size: 32px;
  height: 84px;
  justify-content: center;
  width: 84px;
}

.cart-empty__title {
  color: #18181b;
  font-size: 28px;
  font-weight: 700;
  margin: 0;
}

.cart-empty__description {
  color: #71717a;
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
  max-width: 420px;
}

.cart-empty__cta {
  align-items: center;
  background: var(--irus-color-surface-strong);
  border-radius: 999px;
  color: #fff;
  display: inline-flex;
  font-weight: 700;
  justify-content: center;
  min-height: 46px;
  padding: 0 22px;
  text-decoration: none;
}

.cart-empty__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 6px;
}

.cart-empty__chip {
  align-items: center;
  background: #f7f7f8;
  border: 1px solid #ececf1;
  border-radius: 999px;
  color: #18181b;
  display: inline-flex;
  font-size: 13px;
  font-weight: 700;
  justify-content: center;
  min-height: 38px;
  padding: 0 14px;
  text-decoration: none;
}

@media (max-width: 767.98px) {
  .cart-empty {
    border-radius: 24px;
    padding: 28px 18px 32px;
  }

  .cart-empty__title {
    font-size: 24px;
  }

  .cart-empty__description {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .cart-empty {
    border-radius: 18px;
    gap: 12px;
    padding: 22px 14px 26px;
  }

  .cart-empty__icon {
    font-size: 26px;
    height: 68px;
    width: 68px;
  }

  .cart-empty__title {
    font-size: 20px;
  }

  .cart-empty__description {
    font-size: 13px;
  }

  .cart-empty__cta {
    font-size: 14px;
    min-height: 42px;
    padding: 0 18px;
  }

  .cart-empty__chip {
    font-size: 12px;
    min-height: 34px;
    padding: 0 12px;
  }
}
</style>
