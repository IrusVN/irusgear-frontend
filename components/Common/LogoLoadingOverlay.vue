<template>
  <Teleport to="body">
    <Transition name="logo-loading-fade">
      <div
        v-if="isDisplayed"
        class="logo-loading-overlay"
        :class="themeClass"
        :style="overlayStyle"
        role="status"
        aria-live="polite"
        :aria-label="ariaLabel"
      >
        <span class="logo-loading-overlay__sr">{{ ariaLabel }}</span>

        <div class="logo-loading-overlay__scene">
          <div class="logo-loading-overlay__fx" aria-hidden="true">
            <div ref="raysRoot" class="logo-loading-overlay__rays">
              <div
                v-for="(spec, index) in raySpecs"
                :key="`logo-loading-ray-${index}`"
                :ref="(element) => setRayWrapRef(element, index)"
                class="logo-loading-overlay__ray-wrap"
              >
                <div
                  :ref="(element) => setRayRef(element, index)"
                  class="logo-loading-overlay__ray"
                  :style="{
                    width: `${spec.len}px`,
                    height: `${spec.thick}px`,
                  }"
                />
              </div>
            </div>
          </div>

          <div class="logo-loading-overlay__logo-wrap" aria-hidden="true">
            <div ref="logoElement" class="logo-loading-overlay__logo">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                width="100%"
                viewBox="0 0 640 640"
                enable-background="new 0 0 640 640"
                xml:space="preserve"
              >
                <path
                  fill="#000000"
                  opacity="1.000000"
                  stroke="none"
                  d="
M213.719894,444.235748
  C176.709839,392.259521 139.891144,340.585571 102.747200,288.455170
  C112.082443,281.759186 120.966209,275.353973 129.884491,268.997223
  C146.438293,257.198059 163.088242,245.531494 179.518356,233.562866
  C183.119568,230.939529 184.858932,231.338989 187.387589,234.909729
  C218.296921,278.557404 249.355072,322.099701 280.383606,365.662933
  C281.436462,367.141113 282.582977,368.552612 284.223175,370.698059
  C310.950592,351.744629 337.498108,332.918793 364.607758,313.694305
  C381.518921,337.435699 398.184692,360.832642 415.213715,384.739532
  C410.851837,387.940674 406.904724,390.912323 402.882202,393.778076
  C354.722931,428.088043 306.522675,462.340668 258.442749,496.761322
  C254.682465,499.453308 252.877472,499.215820 250.208893,495.394745
  C238.284515,478.320435 226.040100,461.469604 213.719894,444.235748
z"
                />
                <path
                  fill="#000000"
                  opacity="1.000000"
                  stroke="none"
                  d="
M245.906281,269.874817
  C297.084717,233.450089 347.995392,197.269333 398.788239,160.923859
  C402.601868,158.194977 404.527466,158.157944 407.379303,162.174896
  C455.202423,229.536179 503.172455,296.793121 551.094543,364.084137
  C552.046936,365.421448 553.287903,366.632507 553.526672,368.989502
  C549.088501,372.212708 544.427429,375.637970 539.725159,379.005829
  C519.285889,393.644867 498.840179,408.274963 478.383728,422.889954
  C473.151093,426.628418 473.138885,426.590607 469.263458,421.149261
  C438.926422,378.553864 408.585327,335.961395 378.245209,293.368195
  C378.148590,293.232544 378.047729,293.099884 377.949677,292.965179
  C373.169434,286.396057 373.155609,286.376587 366.563110,291.058868
  C343.618896,307.354797 320.636536,323.597961 297.797119,340.039581
  C294.165161,342.654175 292.216949,342.590759 289.516907,338.737183
  C274.800781,317.733795 259.839111,296.902100 244.883667,276.067474
  C243.137726,273.635193 242.435440,271.725189 245.906281,269.874817
z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const ANIMATION_DURATION = 2300;
const BODY_LOCK_COUNT_KEY = "logoLoadingOverlayLocks";
const BODY_LOCK_OVERFLOW_KEY = "logoLoadingOverlayOverflow";

const logoKeys = Object.freeze([
  { t: 0.0, scale: 0.93, rotate: 0 },
  { t: 0.42, scale: 1.14, rotate: 360 },
  { t: 0.7, scale: 1.14, rotate: 360 },
  { t: 0.86, scale: 1.0, rotate: 360 },
  { t: 1.0, scale: 1.0, rotate: 360 },
]);

const raySpecs = Object.freeze([
  { angle: -71, len: 44, thick: 2.0, start: 0.01, peak: 0.085, end: 0.24, travel: 92, offset: 10 },
  { angle: -50, len: 102, thick: 2.6, start: 0.02, peak: 0.11, end: 0.3, travel: 150, offset: 12 },
  { angle: -30, len: 126, thick: 2.4, start: 0.028, peak: 0.125, end: 0.315, travel: 176, offset: 8 },
  { angle: -17, len: 110, thick: 2.2, start: 0.04, peak: 0.145, end: 0.345, travel: 158, offset: 6 },
  { angle: -4, len: 90, thick: 2.0, start: 0.055, peak: 0.165, end: 0.36, travel: 136, offset: 4 },
  { angle: 8, len: 58, thick: 1.9, start: 0.06, peak: 0.175, end: 0.37, travel: 92, offset: 2 },
  { angle: 164, len: 88, thick: 2.1, start: 0.018, peak: 0.105, end: 0.285, travel: 126, offset: 0 },
  { angle: 188, len: 72, thick: 2.0, start: 0.034, peak: 0.122, end: 0.305, travel: 106, offset: 0 },
  { angle: 129, len: 112, thick: 2.4, start: 0.024, peak: 0.116, end: 0.308, travel: 170, offset: 0 },
  { angle: 110, len: 48, thick: 2.0, start: 0.082, peak: 0.192, end: 0.385, travel: 88, offset: 0 },
]);

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: String,
    default: "dark",
    validator: (value) => ["dark", "light"].includes(value),
  },
  delay: {
    type: Number,
    default: 120,
  },
  minVisible: {
    type: Number,
    default: 500,
  },
  lockScroll: {
    type: Boolean,
    default: true,
  },
  zIndex: {
    type: [Number, String],
    default: 2000,
  },
  ariaLabel: {
    type: String,
    default: "Dang tai noi dung",
  },
});

const isDisplayed = ref(false);
const prefersReducedMotion = ref(false);
const hasMounted = ref(false);
const shownAt = ref(0);
const logoElement = ref(null);
const raysRoot = ref(null);
const rayWrapRefs = [];
const rayRefs = [];

const themeClass = computed(() => `logo-loading-overlay--${props.theme}`);
const overlayStyle = computed(() => ({
  zIndex: String(props.zIndex),
}));

let animationFrameId = 0;
let animationStart = 0;
let showTimerId = 0;
let hideTimerId = 0;
let mediaQueryList = null;
let bodyIsLockedByInstance = false;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const smoothstep = (value) => value * value * (3 - 2 * value);
const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);
const easeOutQuart = (value) => 1 - Math.pow(1 - value, 4);
const rangeProgress = (progress, start, end) => clamp((progress - start) / (end - start || 1), 0, 1);

const interpolate = (progress, property) => {
  if (progress <= logoKeys[0].t) {
    return logoKeys[0][property];
  }

  for (let index = 0; index < logoKeys.length - 1; index += 1) {
    const startKey = logoKeys[index];
    const endKey = logoKeys[index + 1];

    if (progress <= endKey.t) {
      const rawProgress = (progress - startKey.t) / (endKey.t - startKey.t || 1);
      const normalizedProgress = clamp(rawProgress, 0, 1);
      const easedProgress = index === 0 ? easeOutCubic(normalizedProgress) : smoothstep(normalizedProgress);

      return startKey[property] + (endKey[property] - startKey[property]) * easedProgress;
    }
  }

  return logoKeys[logoKeys.length - 1][property];
};

const getRayState = (progress, spec) => {
  if (progress < spec.start || progress > spec.end) {
    return { opacity: 0, distance: spec.offset, stretch: 0.15 };
  }

  const enterProgress = rangeProgress(progress, spec.start, spec.peak);
  const exitProgress = rangeProgress(progress, spec.peak, spec.end);
  const travelProgress = rangeProgress(progress, spec.start, spec.end);
  const distance = spec.offset + spec.travel * easeOutQuart(travelProgress);

  let opacity;
  if (progress <= spec.peak) {
    opacity = 0.9 * easeOutCubic(enterProgress);
  } else {
    opacity = 0.9 * (1 - smoothstep(exitProgress));
  }

  let stretch;
  if (progress <= spec.peak) {
    stretch = 0.24 + 0.92 * easeOutCubic(enterProgress);
  } else {
    stretch = 1.16 - 0.18 * smoothstep(exitProgress);
  }

  const shortenFar = 1.0 - 0.58 * easeOutCubic(travelProgress);
  stretch *= Math.max(0.34, shortenFar);

  return { opacity, distance, stretch };
};

const setRayWrapRef = (element, index) => {
  rayWrapRefs[index] = element || null;
};

const setRayRef = (element, index) => {
  rayRefs[index] = element || null;
};

const clearVisibilityTimers = () => {
  if (!import.meta.client) {
    return;
  }

  if (showTimerId) {
    window.clearTimeout(showTimerId);
    showTimerId = 0;
  }

  if (hideTimerId) {
    window.clearTimeout(hideTimerId);
    hideTimerId = 0;
  }
};

const stopAnimation = () => {
  if (!import.meta.client || !animationFrameId) {
    return;
  }

  window.cancelAnimationFrame(animationFrameId);
  animationFrameId = 0;
};

const lockBodyScroll = () => {
  if (!import.meta.client || !props.lockScroll || bodyIsLockedByInstance) {
    return;
  }

  const body = document.body;
  const lockCount = Number(body.dataset[BODY_LOCK_COUNT_KEY] || "0");

  if (lockCount === 0) {
    body.dataset[BODY_LOCK_OVERFLOW_KEY] = body.style.overflow || "";
    body.style.overflow = "hidden";
  }

  body.dataset[BODY_LOCK_COUNT_KEY] = String(lockCount + 1);
  bodyIsLockedByInstance = true;
};

const unlockBodyScroll = () => {
  if (!import.meta.client || !bodyIsLockedByInstance) {
    return;
  }

  const body = document.body;
  const lockCount = Number(body.dataset[BODY_LOCK_COUNT_KEY] || "0");

  if (lockCount <= 1) {
    body.style.overflow = body.dataset[BODY_LOCK_OVERFLOW_KEY] || "";
    delete body.dataset[BODY_LOCK_COUNT_KEY];
    delete body.dataset[BODY_LOCK_OVERFLOW_KEY];
  } else {
    body.dataset[BODY_LOCK_COUNT_KEY] = String(lockCount - 1);
  }

  bodyIsLockedByInstance = false;
};

const applyReducedMotionState = () => {
  if (logoElement.value) {
    logoElement.value.style.transform = "scale(1) rotate(0deg)";
  }

  if (raysRoot.value) {
    raysRoot.value.style.opacity = "0";
  }

  raySpecs.forEach((spec, index) => {
    const wrap = rayWrapRefs[index];
    const ray = rayRefs[index];

    if (wrap) {
      wrap.style.transform = `translate(-50%, -50%) rotate(${spec.angle}deg)`;
    }

    if (ray) {
      ray.style.transform = `translateX(${spec.offset.toFixed(2)}px) translateY(-50%) scaleX(0.15)`;
      ray.style.opacity = "0";
    }
  });
};

const renderFrame = (elapsedMs = 0) => {
  if (!logoElement.value || !raysRoot.value) {
    return;
  }

  const progress = (elapsedMs % ANIMATION_DURATION) / ANIMATION_DURATION;
  const scale = interpolate(progress, "scale");
  const rotate = interpolate(progress, "rotate");
  const globalFade =
    progress < 0.46 ? 1 : 1 - smoothstep(rangeProgress(progress, 0.46, 0.62));

  logoElement.value.style.transform = `scale(${scale.toFixed(5)}) rotate(${rotate.toFixed(3)}deg)`;
  raysRoot.value.style.opacity = globalFade.toFixed(4);

  raySpecs.forEach((spec, index) => {
    const wrap = rayWrapRefs[index];
    const ray = rayRefs[index];

    if (!wrap || !ray) {
      return;
    }

    const state = getRayState(progress, spec);
    wrap.style.transform = `translate(-50%, -50%) rotate(${spec.angle}deg)`;
    ray.style.transform = `translateX(${state.distance.toFixed(2)}px) translateY(-50%) scaleX(${state.stretch.toFixed(4)})`;
    ray.style.opacity = (state.opacity * globalFade).toFixed(4);
  });
};

const tick = (frameTime) => {
  renderFrame(frameTime - animationStart);
  animationFrameId = window.requestAnimationFrame(tick);
};

const startAnimation = () => {
  if (!import.meta.client || !hasMounted.value || !isDisplayed.value) {
    return;
  }

  stopAnimation();

  if (prefersReducedMotion.value) {
    applyReducedMotionState();
    return;
  }

  animationStart = performance.now();
  renderFrame(0);
  animationFrameId = window.requestAnimationFrame(tick);
};

const showImmediately = () => {
  if (isDisplayed.value) {
    return;
  }

  isDisplayed.value = true;
  shownAt.value = Date.now();
  lockBodyScroll();

  if (hasMounted.value) {
    nextTick(() => {
      startAnimation();
    });
  }
};

const hideImmediately = () => {
  if (!isDisplayed.value) {
    return;
  }

  stopAnimation();
  unlockBodyScroll();
  isDisplayed.value = false;
  shownAt.value = 0;
};

const syncVisibility = (nextVisible) => {
  if (!import.meta.client) {
    isDisplayed.value = nextVisible;
    return;
  }

  if (hideTimerId) {
    window.clearTimeout(hideTimerId);
    hideTimerId = 0;
  }

  if (nextVisible) {
    if (showTimerId) {
      window.clearTimeout(showTimerId);
      showTimerId = 0;
    }

    if (isDisplayed.value) {
      startAnimation();
      return;
    }

    const showDelay = Math.max(0, Number(props.delay) || 0);

    if (showDelay === 0) {
      showImmediately();
      return;
    }

    showTimerId = window.setTimeout(() => {
      showTimerId = 0;
      showImmediately();
    }, showDelay);
    return;
  }

  if (showTimerId) {
    window.clearTimeout(showTimerId);
    showTimerId = 0;
  }

  if (!isDisplayed.value) {
    return;
  }

  const visibleFor = Date.now() - shownAt.value;
  const remainingVisibleTime = Math.max(0, (Number(props.minVisible) || 0) - visibleFor);

  if (remainingVisibleTime === 0) {
    hideImmediately();
    return;
  }

  hideTimerId = window.setTimeout(() => {
    hideTimerId = 0;
    hideImmediately();
  }, remainingVisibleTime);
};

const handleReducedMotionChange = (event) => {
  prefersReducedMotion.value = event.matches;

  if (!isDisplayed.value) {
    return;
  }

  if (prefersReducedMotion.value) {
    stopAnimation();
    applyReducedMotionState();
    return;
  }

  startAnimation();
};

watch(
  () => props.visible,
  (nextVisible) => {
    syncVisibility(nextVisible);
  },
  { immediate: true },
);

watch(
  () => props.lockScroll,
  (nextLockScroll) => {
    if (!import.meta.client || !isDisplayed.value) {
      return;
    }

    if (nextLockScroll) {
      lockBodyScroll();
      return;
    }

    unlockBodyScroll();
  },
);

onMounted(() => {
  hasMounted.value = true;

  mediaQueryList = window.matchMedia("(prefers-reduced-motion: reduce)");
  prefersReducedMotion.value = mediaQueryList.matches;

  if (typeof mediaQueryList.addEventListener === "function") {
    mediaQueryList.addEventListener("change", handleReducedMotionChange);
  } else if (typeof mediaQueryList.addListener === "function") {
    mediaQueryList.addListener(handleReducedMotionChange);
  }

  if (isDisplayed.value) {
    lockBodyScroll();
    nextTick(() => {
      startAnimation();
    });
  }
});

onBeforeUnmount(() => {
  clearVisibilityTimers();
  stopAnimation();
  unlockBodyScroll();

  if (!mediaQueryList) {
    return;
  }

  if (typeof mediaQueryList.removeEventListener === "function") {
    mediaQueryList.removeEventListener("change", handleReducedMotionChange);
  } else if (typeof mediaQueryList.removeListener === "function") {
    mediaQueryList.removeListener(handleReducedMotionChange);
  }
});
</script>

<style scoped>
.logo-loading-overlay {
  --logo-size: min(72vmin, 200px);
  --ray-box: min(90vmin, 920px);
  --logo-color: #111111;
  --logo-shadow-primary: rgba(255, 255, 255, 0.3);
  --logo-shadow-secondary: rgba(15, 23, 42, 0.18);
  --ray-start: rgba(58, 58, 58, 0.92);
  --ray-mid: rgba(96, 96, 96, 0.78);
  --ray-soft: rgba(132, 132, 132, 0.44);
  --ray-end: rgba(180, 180, 180, 0);
  --ray-shadow: rgba(70, 70, 70, 0.2);
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: transparent;
  user-select: none;
}

.logo-loading-overlay--light {
  --logo-color: #f8fafc;
  --logo-shadow-primary: rgba(15, 23, 42, 0.46);
  --logo-shadow-secondary: rgba(255, 255, 255, 0.18);
  --ray-start: rgba(255, 255, 255, 0.94);
  --ray-mid: rgba(245, 248, 255, 0.8);
  --ray-soft: rgba(225, 231, 242, 0.48);
  --ray-end: rgba(255, 255, 255, 0);
  --ray-shadow: rgba(15, 23, 42, 0.34);
}

.logo-loading-overlay__scene {
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}

.logo-loading-overlay__fx {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
}

.logo-loading-overlay__rays {
  position: relative;
  width: var(--ray-box);
  height: var(--ray-box);
  pointer-events: none;
  will-change: opacity;
  z-index: 1;
}

.logo-loading-overlay__ray-wrap {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0;
  height: 0;
  transform-origin: 0 0;
  will-change: transform;
}

.logo-loading-overlay__ray {
  position: absolute;
  left: 0;
  top: 50%;
  transform-origin: 0 50%;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    var(--ray-start) 0%,
    var(--ray-mid) 30%,
    var(--ray-soft) 72%,
    var(--ray-end) 100%
  );
  filter: blur(0.35px);
  box-shadow: 0 0 1.8px var(--ray-shadow);
  will-change: transform, opacity;
}

.logo-loading-overlay__logo-wrap {
  position: relative;
  width: var(--logo-size);
  height: var(--logo-size);
  display: grid;
  place-items: center;
  z-index: 2;
  pointer-events: none;
}

.logo-loading-overlay__logo {
  width: 100%;
  height: 100%;
  transform-origin: center center;
  will-change: transform;
  filter:
    drop-shadow(0 20px 44px var(--logo-shadow-primary))
    drop-shadow(0 10px 18px var(--logo-shadow-secondary));
}

.logo-loading-overlay__logo svg {
  display: block;
  width: 100%;
  height: 100%;
}

.logo-loading-overlay__logo :deep(path) {
  fill: var(--logo-color);
}

.logo-loading-overlay__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.logo-loading-fade-enter-active,
.logo-loading-fade-leave-active {
  transition: opacity 0.22s ease;
}

.logo-loading-fade-enter-from,
.logo-loading-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .logo-loading-overlay__logo,
  .logo-loading-overlay__rays,
  .logo-loading-overlay__ray-wrap,
  .logo-loading-overlay__ray {
    animation: none !important;
    transition: none !important;
  }
}

@media (max-width: 767.98px) {
  .logo-loading-overlay {
    --logo-size: min(78vmin, 420px);
    --ray-box: min(100vmin, 620px);
  }
}
</style>
