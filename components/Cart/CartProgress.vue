<template>
  <nav class="cart-progress" :aria-label="$t('cart.cartProgress')">
    <div
      :class="['cart-progress-sticky', { 'cart-progress-sticky--visible': isStickyVisible }]"
      :style="stickyBarStyle"
    >
      <div class="container-xl pt-1 cart-progress-sticky__inner">
        <div class="cart-progress__shell cart-progress__shell--sticky">
          <ol class="cart-progress__list">
            <li
              v-for="step in steps"
              :key="`sticky-${step.id}`"
              :class="[
                'cart-progress__item',
                {
                  'cart-progress__item--active': step.id === currentStep,
                  'cart-progress__item--completed': step.id < currentStep,
                },
              ]"
            >
              <span class="cart-progress__marker" aria-hidden="true">
                <i :class="step.id < currentStep ? 'bi bi-check2' : step.icon"></i>
              </span>

              <span class="cart-progress__label">
                {{ step.label }}
              </span>
            </li>
          </ol>
        </div>
      </div>
    </div>

    <div ref="progressBlockEl" class="cart-progress__shell">
      <ol class="cart-progress__list">
        <li
          v-for="step in steps"
          :key="step.id"
          :class="[
            'cart-progress__item',
            {
              'cart-progress__item--active': step.id === currentStep,
              'cart-progress__item--completed': step.id < currentStep,
            },
          ]"
        >
          <span class="cart-progress__marker" aria-hidden="true">
            <i :class="step.id < currentStep ? 'bi bi-check2' : step.icon"></i>
          </span>

          <span class="cart-progress__label">
            {{ step.label }}
          </span>
        </li>
      </ol>
    </div>
  </nav>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "#imports";

const { t } = useI18n();

const steps = computed(() => [
  {
    id: 1,
    label: t('cart.cart'),
    icon: "bi bi-bag-check",
  },
  {
    id: 2,
    label: t('cart.orderInfo'),
    icon: "bi bi-postcard",
  },
  {
    id: 3,
    label: t('cart.checkout'),
    icon: "bi bi-credit-card-2-front",
  },
  {
    id: 4,
    label: t('cart.complete'),
    icon: "bi bi-check-circle",
  },
]);

defineProps({
  currentStep: {
    type: Number,
    default: 1,
  },
});

const progressBlockEl = ref(null);
const isStickyVisible = ref(false);
const stickyTopOffset = ref(0);
let mounted = false;
let progressResizeObserver = null;

const stickyBarStyle = computed(() => ({
  top: `var(--customer-sidebar-offset, ${stickyTopOffset.value}px)`,
}));

const dispatchStickyChangeEvent = () => {
  if (typeof window === "undefined") return;
  const height = progressBlockEl.value?.offsetHeight ?? 0;
  window.dispatchEvent(
    new CustomEvent("cart-progress:sticky-change", {
      detail: { isSticky: isStickyVisible.value, height },
    })
  );
};

const getCustomerSidebarOffset = () => {
  if (typeof document === "undefined") {
    return null;
  }

  const rawOffset = getComputedStyle(document.documentElement)
    .getPropertyValue("--customer-sidebar-offset")
    .trim();
  const parsedOffset = Number.parseFloat(rawOffset);

  return Number.isFinite(parsedOffset) ? Math.ceil(parsedOffset) : null;
};

const updateStickyOffset = () => {
  const customerSidebarOffset = getCustomerSidebarOffset();

  if (Number.isFinite(customerSidebarOffset)) {
    stickyTopOffset.value = customerSidebarOffset;
    return;
  }

  if (typeof document === "undefined") {
    return;
  }

  const navbarWrapper = document.querySelector(".fixed-top");
  const navbar = document.querySelector(".glass-navbar");

  if (navbarWrapper instanceof HTMLElement) {
    stickyTopOffset.value = Math.ceil(navbarWrapper.getBoundingClientRect().bottom + 2);
    return;
  }

  if (navbar instanceof HTMLElement) {
    stickyTopOffset.value = Math.ceil(navbar.getBoundingClientRect().bottom + 2);
    return;
  }

  stickyTopOffset.value = 0;
};

const syncStickyState = () => {
  if (!progressBlockEl.value) {
    return;
  }

  updateStickyOffset();
  const wasSticky = isStickyVisible.value;
  isStickyVisible.value = progressBlockEl.value.getBoundingClientRect().top <= stickyTopOffset.value;

  if (wasSticky !== isStickyVisible.value) {
    dispatchStickyChangeEvent();
  }
};

const handleWindowScroll = () => {
  syncStickyState();
};

const handleWindowResize = () => {
  syncStickyState();
};

const handleCustomerSidebarOffsetChange = () => {
  syncStickyState();
};

onMounted(() => {
  syncStickyState();

  if (!mounted && typeof window !== "undefined") {
    window.addEventListener("scroll", handleWindowScroll, { passive: true });
    window.addEventListener("resize", handleWindowResize);
    window.addEventListener("customer-sidebar:offset-change", handleCustomerSidebarOffsetChange);
    mounted = true;

    if (typeof ResizeObserver !== "undefined" && progressBlockEl.value instanceof HTMLElement) {
      progressResizeObserver = new ResizeObserver(() => {
        dispatchStickyChangeEvent();
      });
      progressResizeObserver.observe(progressBlockEl.value);
    }
  }
});

onBeforeUnmount(() => {
  if (mounted && typeof window !== "undefined") {
    window.removeEventListener("scroll", handleWindowScroll);
    window.removeEventListener("resize", handleWindowResize);
    window.removeEventListener("customer-sidebar:offset-change", handleCustomerSidebarOffsetChange);
    mounted = false;
  }

  if (progressResizeObserver) {
    progressResizeObserver.disconnect();
    progressResizeObserver = null;
  }
});
</script>

<style scoped>
.cart-progress {
  margin-bottom: 20px;
}

.cart-progress-sticky {
  left: 0;
  opacity: 0;
  pointer-events: none;
  position: fixed;
  right: 0;
  top: 0;
  transform: translateY(-100%);
  transition:
    top 0.32s ease,
    opacity 0.25s ease,
    transform 0.3s ease;
  z-index: 60;
}

.cart-progress-sticky--visible {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.cart-progress-sticky__inner {
  position: relative;
}

.cart-progress__shell {
  background: #f8f8f8;
  border-radius: 18px;
  padding: 18px 20px 14px;
}

.cart-progress__shell--sticky {
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.12);
}

.cart-progress__list {
  display: grid;
  gap: 0;
  grid-template-columns: repeat(4, 1fr);
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
}

.cart-progress__list::before {
  border-top: 1px dashed #b0b0b0;
  content: "";
  left: 40px;
  position: absolute;
  right: 40px;
  top: 16px;
}

.cart-progress__item {
  align-items: center;
  color: #534c54;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  position: relative;
  text-align: center;
  z-index: 1;
}

.cart-progress__marker {
  align-items: center;
  background: #fff;
  border: 2px solid #c0c0c0;
  border-radius: 999px;
  color: #888;
  display: inline-flex;
  font-size: 14px;
  height: 32px;
  justify-content: center;
  line-height: 1;
  width: 32px;
}

.cart-progress__label {
  color: #888;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.35;
  text-align: center;
  word-break: break-word;
}

.cart-progress__item--active .cart-progress__marker {
  background: #111;
  border-color: #111;
  color: #fff;
}

.cart-progress__item--active .cart-progress__label {
  color: #111;
  font-weight: 700;
}

.cart-progress__item--completed .cart-progress__marker {
  background: #111;
  border-color: #111;
  color: #fff;
}

.cart-progress__item--completed .cart-progress__label {
  color: #111;
}

@media (max-width: 767.98px) {
  .cart-progress {
    margin-bottom: 16px;
  }

  .cart-progress__shell {
    border-radius: 16px;
    padding: 14px 8px 10px;
  }

  .cart-progress__list::before {
    left: 8px;
    right: 8px;
    top: 14px;
  }

  .cart-progress__marker {
    font-size: 12px;
    height: 28px;
    width: 28px;
  }

  .cart-progress__label {
    font-size: 12px;
    max-width: 100%;
    line-height: 1.2;
    text-align: center;
  }

  .cart-progress__item {
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .cart-progress__shell {
    padding: 12px 6px 8px;
  }

  .cart-progress__list::before {
    left: 6px;
    right: 6px;
    top: 12px;
  }

  .cart-progress__marker {
    font-size: 11px;
    height: 24px;
    width: 24px;
  }

  .cart-progress__label {
    font-size: 11px;
  }

  .cart-progress__item {
    gap: 6px;
  }
}

@media (max-width: 375px) {
  .cart-progress__shell {
    padding: 10px 4px 8px;
  }

  .cart-progress__list::before {
    left: 4px;
    right: 4px;
    top: 10px;
  }

  .cart-progress__marker {
    font-size: 10px;
    height: 20px;
    width: 20px;
  }

  .cart-progress__label {
    font-size: 10px;
  }

  .cart-progress__item {
    gap: 4px;
  }
}
</style>
