<template>
  <Transition name="back-to-top">
    <button
      v-show="isVisible"
      type="button"
      class="back-to-top"
      :style="progressStyle"
      aria-label="Back to top"
      @click="scrollToTop"
    >
      <span class="back-to-top__inner">
        <i class="bi bi-arrow-up-short" aria-hidden="true"></i>
      </span>
    </button>
  </Transition>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const isVisible = ref(false);
const scrollProgress = ref(0);
let ticking = false;

const VISIBILITY_OFFSET = 420;

const updateScrollState = () => {
  ticking = false;

  const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

  isVisible.value = scrollTop > VISIBILITY_OFFSET;
  scrollProgress.value = scrollHeight > 0
    ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100))
    : 0;
};

const requestScrollUpdate = () => {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(updateScrollState);
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const progressStyle = computed(() => ({
  "--scroll-progress": `${scrollProgress.value}%`,
}));

onMounted(() => {
  updateScrollState();
  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", requestScrollUpdate);
  window.removeEventListener("resize", requestScrollUpdate);
});
</script>

<style scoped>
.back-to-top {
  --scroll-progress: 0%;
  align-items: center;
  background:
    conic-gradient(#111827 var(--scroll-progress), rgba(17, 24, 39, 0.12) 0),
    #fff;
  border: 0;
  border-radius: 999px;
  bottom: 100px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.16);
  cursor: pointer;
  display: inline-flex;
  height: 54px;
  justify-content: center;
  padding: 3px;
  position: fixed;
  right: 28px;
  transition:
    box-shadow 0.18s ease,
    transform 0.18s ease;
  width: 54px;
  z-index: 104;
}

.back-to-top__inner {
  align-items: center;
  background: #fff;
  border-radius: inherit;
  color: #111827;
  display: inline-flex;
  height: 100%;
  justify-content: center;
  width: 100%;
}

.back-to-top__inner i {
  font-size: 26px;
  line-height: 1;
}

.back-to-top:hover {
  box-shadow: 0 14px 36px rgba(15, 23, 42, 0.22);
  transform: translateY(-2px);
}

.back-to-top:active {
  transform: translateY(0);
}

.back-to-top:focus-visible {
  outline: 3px solid rgba(17, 24, 39, 0.24);
  outline-offset: 3px;
}

.back-to-top-enter-active,
.back-to-top-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.back-to-top-enter-from,
.back-to-top-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.94);
}

@media (max-width: 767.98px) {
  .back-to-top {
    bottom: 90px;
    height: 54px;
    right: 28px;
    width: 54px;
  }

  .back-to-top__inner i {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .back-to-top {
    bottom: 92px;
  }
}
</style>
