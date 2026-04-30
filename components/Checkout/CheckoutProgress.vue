<template>
  <nav class="checkout-progress" :aria-label="$t('checkout.progressAria')">
    <div
      ref="stickyBlockEl"
      :class="['checkout-progress-sticky', { 'checkout-progress-sticky--visible': isStickyVisible }]"
      :style="stickyBarStyle"
    >
      <div class="container-xl pt-1 checkout-progress-sticky__inner">
        <div class="checkout-progress__shell checkout-progress__shell--sticky">
          <ol class="checkout-progress__list">
            <li
              v-for="step in steps"
              :key="`sticky-${step.id}`"
              :class="[
                'checkout-progress__item',
                {
                  'checkout-progress__item--active': step.id === currentStep,
                  'checkout-progress__item--completed': step.id < currentStep,
                },
              ]"
            >
              <span class="checkout-progress__marker" aria-hidden="true">
                <i :class="step.id < currentStep ? 'bi bi-check2' : step.icon"></i>
              </span>
              <span class="checkout-progress__label">{{ step.label }}</span>
            </li>
          </ol>
        </div>
      </div>
    </div>

    <div ref="progressBlockEl" class="checkout-progress__shell">
      <div class="checkout-progress__header">
        <NuxtLink :to="localePath('/cart')" class="checkout-progress__back">
          <i class="bi bi-arrow-left"></i>
          {{ $t('checkout.backToCart') }}
        </NuxtLink>
        <ol class="checkout-progress__list">
          <li
            v-for="step in steps"
            :key="step.id"
            :class="[
              'checkout-progress__item',
              {
                'checkout-progress__item--active': step.id === currentStep,
                'checkout-progress__item--completed': step.id < currentStep,
              },
            ]"
          >
            <span class="checkout-progress__marker" aria-hidden="true">
              <i :class="step.id < currentStep ? 'bi bi-check2' : step.icon"></i>
            </span>
            <span class="checkout-progress__label">{{ step.label }}</span>
          </li>
        </ol>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useLocalePath, useI18n } from "#imports";

const localePath = useLocalePath();
const { t } = useI18n();

const steps = computed(() => [
  { id: 1, label: t("cart.cart"), icon: "bi bi-bag-check" },
  { id: 2, label: t("checkout.stepInfo"), icon: "bi bi-postcard" },
  { id: 3, label: t("cart.checkout"), icon: "bi bi-credit-card-2-front" },
  { id: 4, label: t("cart.complete"), icon: "bi bi-check-circle" },
]);

defineProps({
  currentStep: {
    type: Number,
    default: 2,
  },
});

const progressBlockEl = ref(null);
const stickyBlockEl = ref(null);
const isStickyVisible = ref(false);
const stickyTopOffset = ref(0);
let mounted = false;
let progressResizeObserver = null;

const stickyBarStyle = computed(() => ({
  top: `var(--customer-sidebar-offset, ${stickyTopOffset.value}px)`,
}));

const dispatchStickyChangeEvent = () => {
  if (typeof window === "undefined") return;
  const normalHeight = progressBlockEl.value?.offsetHeight ?? 0;
  const stickyHeight = stickyBlockEl.value?.offsetHeight ?? 0;
  window.dispatchEvent(
    new CustomEvent("checkout-progress:sticky-change", {
      detail: {
        isSticky: isStickyVisible.value,
        normalHeight,
        stickyHeight,
      },
    })
  );
};

const getCustomerSidebarOffset = () => {
  if (typeof document === "undefined") return null;
  const rawOffset = getComputedStyle(document.documentElement)
    .getPropertyValue("--customer-sidebar-offset")
    .trim();
  const parsed = Number.parseFloat(rawOffset);
  return Number.isFinite(parsed) ? Math.ceil(parsed) : null;
};

const updateStickyOffset = () => {
  const sidebarOffset = getCustomerSidebarOffset();
  if (Number.isFinite(sidebarOffset)) {
    stickyTopOffset.value = sidebarOffset;
    return;
  }
  if (typeof document === "undefined") return;
  const navbarWrapper = document.querySelector(".fixed-top");
  const navbar = document.querySelector(".glass-navbar");
  if (navbarWrapper instanceof HTMLElement) {
    stickyTopOffset.value = Math.ceil(navbarWrapper.getBoundingClientRect().bottom + 2);
  } else if (navbar instanceof HTMLElement) {
    stickyTopOffset.value = Math.ceil(navbar.getBoundingClientRect().bottom + 2);
  } else {
    stickyTopOffset.value = 0;
  }
};

const syncStickyState = () => {
  if (!progressBlockEl.value) return;
  updateStickyOffset();
  const wasSticky = isStickyVisible.value;
  isStickyVisible.value = progressBlockEl.value.getBoundingClientRect().top <= stickyTopOffset.value;

  if (wasSticky !== isStickyVisible.value) {
    dispatchStickyChangeEvent();
  }
};

const handleScroll = () => syncStickyState();
const handleResize = () => syncStickyState();
const handleSidebarOffsetChange = () => syncStickyState();

onMounted(() => {
  syncStickyState();
  if (!mounted && typeof window !== "undefined") {
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    window.addEventListener("customer-sidebar:offset-change", handleSidebarOffsetChange);
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
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("customer-sidebar:offset-change", handleSidebarOffsetChange);
    mounted = false;
  }

  if (progressResizeObserver) {
    progressResizeObserver.disconnect();
    progressResizeObserver = null;
  }
});
</script>

<style scoped>
.checkout-progress {
  margin-bottom: 20px;
}

.checkout-progress-sticky {
  left: 0;
  opacity: 0;
  pointer-events: none;
  position: fixed;
  right: 0;
  top: 0;
  transform: translateY(-100%);
  transition: top 0.32s ease, opacity 0.25s ease, transform 0.3s ease;
  z-index: 60;
}

.checkout-progress-sticky--visible {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.checkout-progress-sticky__inner {
  position: relative;
}

.checkout-progress__shell {
  background: linear-gradient(180deg, #fff1f2, #fff7f7);
  border-radius: 18px;
  overflow-x: auto;
  padding: 18px 20px 14px;
}

.checkout-progress__shell--sticky {
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.12);
}

.checkout-progress__shell::-webkit-scrollbar {
  height: 6px;
}

.checkout-progress__shell::-webkit-scrollbar-thumb {
  background: rgba(113, 113, 122, 0.28);
  border-radius: 999px;
}

.checkout-progress__header {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.checkout-progress__back {
  align-items: center;
  color: #71717a;
  display: inline-flex;
  font-size: 14px;
  font-weight: 500;
  gap: 6px;
  text-decoration: none;
  transition: color 0.15s ease;
}

.checkout-progress__back:hover {
  color: #d70018;
}

.checkout-progress__list {
  display: grid;
  gap: 0;
  grid-template-columns: repeat(4, minmax(120px, 1fr));
  list-style: none;
  margin: 0;
  min-width: 640px;
  padding: 0;
  position: relative;
}

.checkout-progress__list::before {
  border-top: 1px dashed #8f878d;
  content: "";
  left: 40px;
  position: absolute;
  right: 40px;
  top: 16px;
}

.checkout-progress__item {
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

.checkout-progress__marker {
  align-items: center;
  background: #fff1f2;
  border: 2px solid #66606a;
  border-radius: 999px;
  color: #4b4650;
  display: inline-flex;
  font-size: 14px;
  height: 32px;
  justify-content: center;
  line-height: 1;
  width: 32px;
}

.checkout-progress__label {
  color: #534c54;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.35;
  max-width: 140px;
  text-wrap: balance;
}

.checkout-progress__item--active .checkout-progress__marker {
  background: #ed0017;
  border-color: #ed0017;
  color: #fff;
}

.checkout-progress__item--active .checkout-progress__label {
  color: #ed0017;
}

.checkout-progress__item--completed .checkout-progress__marker {
  background: #ed0017;
  border-color: #ed0017;
  color: #fff;
}

@media (max-width: 767.98px) {
  .checkout-progress {
    margin-bottom: 16px;
  }

  .checkout-progress__shell {
    border-radius: 16px;
    padding: 16px 14px 12px;
  }

  .checkout-progress__list {
    min-width: 600px;
  }

  .checkout-progress__label {
    font-size: 15px;
    max-width: 124px;
  }
}
</style>
