<template>
  <div class="cs-shell">
    <!-- SVG background base -->
    <div class="cs-bg" aria-hidden="true"></div>
    <!-- Purple gradient overlay để text trắng đọc được + match màu hình mẫu -->
    <div class="cs-overlay" aria-hidden="true"></div>
    <!-- Decorative blurred blobs -->
    <div class="cs-blob cs-blob--purple" aria-hidden="true"></div>
    <div class="cs-blob cs-blob--pink" aria-hidden="true"></div>

    <!-- Top-right hamburger -->
    <button
      type="button"
      class="cs-menu-btn"
      :aria-label="menuOpenLabel"
      :aria-expanded="isMenuOpen ? 'true' : 'false'"
      aria-controls="coming-soon-category-menu"
      @click="toggleMenu"
    >
      <i class="bi bi-list"></i>
    </button>

    <Transition name="cs-menu-overlay">
      <div v-if="isMenuOpen" class="cs-menu-overlay" @click="closeMenu"></div>
    </Transition>

    <Transition name="cs-menu-drawer">
      <aside v-if="isMenuOpen" id="coming-soon-category-menu" class="cs-menu-panel" :aria-label="menuTitle">
        <div class="cs-menu-panel__header">
          <div>
            <span class="cs-menu-panel__eyebrow">IrusGear</span>
            <h2>{{ menuTitle }}</h2>
          </div>

          <button type="button" class="cs-menu-panel__close" :aria-label="menuCloseLabel" @click="closeMenu">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div v-if="megaMenuLoading && !menuSections.length" class="cs-menu-state">
          <span class="cs-menu-spinner"></span>
          <span>{{ menuLoadingText }}</span>
        </div>

        <div v-else-if="megaMenuError && !menuSections.length" class="cs-menu-state">
          <i class="bi bi-exclamation-circle"></i>
          <span>{{ menuErrorText }}</span>
        </div>

        <div v-else class="cs-menu-layout">
          <nav class="cs-menu-roots" :aria-label="menuTitle">
            <button v-for="section in menuSections" :key="section.key || section.title" type="button"
              class="cs-menu-root" :class="{ 'is-active': section.key === activeMenuKey }"
              @click="setActiveMenuSection(section)">
              <span class="cs-menu-root__icon">
                <i :class="getCategoryIcon(section)"></i>
              </span>
              <span>{{ section.title }}</span>
            </button>
          </nav>

          <div ref="menuContentRef" class="cs-menu-content">
            <NuxtLink v-if="activeMenuSection" :to="buildSectionLink(activeMenuSection)" class="cs-menu-view-all"
              @click="closeMenu">
              <span>{{ viewAllText(activeMenuSection.title) }}</span>
              <i class="bi bi-arrow-right"></i>
            </NuxtLink>

            <section v-for="group in activeMenuGroups" :key="group.key || group.title" class="cs-menu-group">
              <h3>{{ group.title }}</h3>

              <div class="cs-menu-items">
                <NuxtLink v-for="item in group.items" :key="item.key || item.slug || item.title"
                  :to="resolveCategoryItemTo(item)" class="cs-menu-item" @click="closeMenu">
                  <span>{{ item.title }}</span>
                  <span v-if="item.badge" class="cs-menu-item__badge">{{ item.badge }}</span>
                </NuxtLink>
              </div>
            </section>
          </div>
        </div>
      </aside>
    </Transition>

    <!-- Right-side social icons -->
    <ul class="cs-socials" aria-label="Social links">
      <li v-for="s in socials" :key="s.name">
        <a :href="s.href" target="_blank" rel="noopener" :aria-label="s.name" class="cs-social-link">
          <i :class="s.icon"></i>
        </a>
      </li>
    </ul>

    <!-- Center content -->
    <main class="cs-center">
      <h1 class="cs-title">Launching Soon</h1>

      <div class="cs-countdown" role="timer" aria-live="polite">
        <div class="cs-count-item">
          <div class="cs-count-value">{{ currentHours }}</div>
          <div class="cs-count-label">{{ hourLabel }}</div>
        </div>
        <div class="cs-count-item">
          <div class="cs-count-value">{{ currentMinutes }}</div>
          <div class="cs-count-label">{{ minuteLabel }}</div>
        </div>
        <div class="cs-count-item">
          <div class="cs-count-value">{{ currentSeconds }}</div>
          <div class="cs-count-label">{{ secondLabel }}</div>
        </div>
      </div>

      <p class="cs-timezone">{{ timezoneLabel }}</p>

      <p class="cs-subtitle">{{ subtitleText }}</p>

      <NuxtLink :to="localePath('/')" class="cs-back-btn">
        <span class="cs-back-btn__icon" aria-hidden="true">
          <i class="bi bi-arrow-left"></i>
        </span>
        <span>{{ backToHomeLabel }}</span>
      </NuxtLink>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount, watch } from "vue";
import { storeToRefs } from "pinia";
import { useHomeStore } from "@/stores/homeStore";

definePageMeta({
  layout: false,
});

useHead({
  title: "Launching Soon — IrusGear",
  link: [
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&display=swap",
    },
  ],
});

// Target = 20 ngày kể từ hôm nay (2026-05-16) → 2026-06-05.
// Có thể đổi sang ngày khác mà không break logic countdown.
const { locale } = useI18n();
const localePath = useLocalePath();
const homeStore = useHomeStore();
const {
  megaMenuSections,
  activeMegaMenuKey,
  megaMenuLoading,
  megaMenuError,
} = storeToRefs(homeStore);

const now = ref(new Date());
const isMenuOpen = ref(false);
const menuContentRef = ref(null);
let intervalId = null;

const pad = (n) => String(n).padStart(2, "0");
const isEnglishLocale = computed(() => String(locale.value || "").startsWith("en"));
const activeTimeZone = computed(() => (isEnglishLocale.value ? "America/New_York" : "Asia/Ho_Chi_Minh"));
const activeTimeLocale = computed(() => (isEnglishLocale.value ? "en-US" : "vi-VN"));
const timeParts = computed(() => {
  const parts = new Intl.DateTimeFormat(activeTimeLocale.value, {
    timeZone: activeTimeZone.value,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now.value);

  return parts.reduce((accumulator, part) => {
    if (["hour", "minute", "second"].includes(part.type)) {
      accumulator[part.type] = part.value;
    }
    return accumulator;
  }, {});
});
const currentHours = computed(() => pad(timeParts.value.hour || "00"));
const currentMinutes = computed(() => pad(timeParts.value.minute || "00"));
const currentSeconds = computed(() => pad(timeParts.value.second || "00"));
const hourLabel = computed(() => (isEnglishLocale.value ? "HOURS" : "GIỜ"));
const minuteLabel = computed(() => (isEnglishLocale.value ? "MINUTES" : "PHÚT"));
const secondLabel = computed(() => (isEnglishLocale.value ? "SECONDS" : "GIÂY"));
const timezoneLabel = computed(() => (isEnglishLocale.value ? "US Eastern Time" : "Giờ Việt Nam"));
const subtitleText = computed(() =>
  isEnglishLocale.value
    ? "We're putting the finishing touches. Explore the homepage while you wait."
    : "Chúng tôi đang hoàn thiện những bước cuối. Bạn có thể quay lại trang chủ trong khi chờ."
);
const backToHomeLabel = computed(() => (isEnglishLocale.value ? "Back to Home" : "Về trang chủ"));
const menuOpenLabel = computed(() => (isEnglishLocale.value ? "Open categories" : "Mở danh mục"));
const menuCloseLabel = computed(() => (isEnglishLocale.value ? "Close categories" : "Đóng danh mục"));
const menuTitle = computed(() => (isEnglishLocale.value ? "Categories" : "Danh mục"));
const menuLoadingText = computed(() => (isEnglishLocale.value ? "Loading categories..." : "Đang tải danh mục..."));
const menuErrorText = computed(() => (isEnglishLocale.value ? "Could not load categories" : "Không thể tải danh mục"));
const fallbackGroupTitle = computed(() => (isEnglishLocale.value ? "Categories" : "Danh mục"));
const menuSections = computed(() =>
  Array.isArray(megaMenuSections.value) ? megaMenuSections.value.filter(Boolean) : []
);
const activeMenuKey = computed(() => activeMegaMenuKey.value || menuSections.value[0]?.key || "");
const activeMenuSection = computed(() =>
  menuSections.value.find((section) => section?.key === activeMenuKey.value) || menuSections.value[0] || null
);
const activeMenuGroups = computed(() => {
  const section = activeMenuSection.value;
  if (!section) return [];

  if (Array.isArray(section.children) && section.children.length) {
    return section.children
      .map((group) => ({
        key: group?.key || group?.title,
        title: group?.title || fallbackGroupTitle.value,
        items: Array.isArray(group?.items) ? group.items.filter(Boolean) : [],
      }))
      .filter((group) => group.items.length);
  }

  if (Array.isArray(section.items) && section.items.length) {
    return [{
      key: section.key || section.title,
      title: section.title || fallbackGroupTitle.value,
      items: section.items.filter(Boolean),
    }];
  }

  return [];
});

onMounted(() => {
  homeStore.fetchMegaMenuLeaves().catch(() => {});

  intervalId = window.setInterval(() => {
    now.value = new Date();
  }, 1000);
});

onBeforeUnmount(() => {
  if (intervalId !== null) {
    window.clearInterval(intervalId);
    intervalId = null;
  }

  if (typeof document !== "undefined") {
    document.body.classList.remove("cs-menu-open");
  }
});

watch(isMenuOpen, (open) => {
  if (typeof document === "undefined") return;
  document.body.classList.toggle("cs-menu-open", open);
});

const openMenu = async () => {
  isMenuOpen.value = true;
  await homeStore.fetchMegaMenuLeaves().catch(() => {});
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const toggleMenu = () => {
  if (isMenuOpen.value) {
    closeMenu();
    return;
  }

  openMenu();
};

const normalizeCategoryText = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();

const getCategoryIcon = (section) => {
  const value = `${normalizeCategoryText(section?.key)} ${normalizeCategoryText(section?.title)}`;
  const rules = [
    { tokens: ["dien-thoai", "phone"], icon: "bi bi-phone" },
    { tokens: ["tablet", "may-tinh-bang"], icon: "bi bi-tablet" },
    { tokens: ["laptop"], icon: "bi bi-laptop" },
    { tokens: ["am-thanh", "audio", "tai-nghe", "loa"], icon: "bi bi-headphones" },
    { tokens: ["mic", "thu-am", "micro"], icon: "bi bi-mic" },
    { tokens: ["dong-ho", "watch"], icon: "bi bi-smartwatch" },
    { tokens: ["camera"], icon: "bi bi-camera" },
    { tokens: ["do-gia-dung", "gia-dung"], icon: "bi bi-house-gear" },
    { tokens: ["lam-dep", "suc-khoe"], icon: "bi bi-heart-pulse" },
    { tokens: ["phu-kien", "accessory"], icon: "bi bi-plug" },
    { tokens: ["pc"], icon: "bi bi-pc-display" },
    { tokens: ["man-hinh", "monitor"], icon: "bi bi-display" },
    { tokens: ["may-in", "printer"], icon: "bi bi-printer" },
    { tokens: ["tivi", "tv"], icon: "bi bi-tv" },
    { tokens: ["dien-may"], icon: "bi bi-lightning-charge" },
    { tokens: ["thu-cu", "doi-moi", "hang-cu"], icon: "bi bi-arrow-repeat" },
  ];

  return rules.find((rule) => rule.tokens.some((token) => value.includes(token)))?.icon || "bi bi-box";
};

const scrollMenuContentToTop = async () => {
  await nextTick();
  const contentEl = menuContentRef.value;
  if (!(contentEl instanceof HTMLElement)) return;
  contentEl.scrollTo({ top: 0, behavior: "smooth" });
};

const setActiveMenuSection = async (section) => {
  if (!section?.key) return;
  homeStore.setActiveMegaMenuKey(section.key);
  await scrollMenuContentToTop();
};

const buildProductsCategoryLink = (category) => {
  const query = new URLSearchParams({
    category,
    sort: "newest",
    limit: "20",
  });

  return `${localePath("/products")}?${query.toString()}`;
};

const buildSectionLink = (section) => {
  const category = section?.slug || section?.key;
  return category ? buildProductsCategoryLink(category) : localePath("/products");
};

const localizeInternalTo = (to) => {
  if (!to) return localePath("/products");
  if (typeof to === "string") return to.startsWith("/") ? localePath(to) : to;
  if (typeof to === "object" && to.path) return { ...to, path: localePath(to.path) };
  return to;
};

const resolveCategoryItemTo = (item) =>
  localizeInternalTo(item?.to || item?.url || localePath("/products"));

const viewAllText = (title) => (isEnglishLocale.value ? `View all ${title}` : `Xem tất cả ${title}`);

const socials = [
  { name: "Facebook", icon: "bi bi-facebook", href: "https://facebook.com" },
  { name: "Twitter", icon: "bi bi-twitter", href: "https://twitter.com" },
  { name: "LinkedIn", icon: "bi bi-linkedin", href: "https://linkedin.com" },
  { name: "Instagram", icon: "bi bi-instagram", href: "https://instagram.com" },
  { name: "Dribbble", icon: "bi bi-dribbble", href: "https://dribbble.com" },
];

</script>

<style scoped>
.cs-shell {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #fff;
  overflow: hidden;
  isolation: isolate;
}

/* Lớp 1: SVG background gốc */
.cs-bg {
  position: absolute;
  inset: 0;
  background-image: url("/image/background-image.svg");
  background-size: cover;
  background-position: center;
  z-index: -3;
}

/* Lớp 2: Black & white gradient overlay (đen → xám đậm) */
.cs-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    #0a0a0a 0%,
    #1c1c1c 35%,
    #2a2a2a 70%,
    #3d3d3d 100%
  );
  opacity: 0.94;
  z-index: -2;
}

/* Lớp 3: 2 blob blur tông trắng/xám tạo chiều sâu */
.cs-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.35;
  z-index: -1;
  pointer-events: none;
}

.cs-blob--purple {
  width: 520px;
  height: 520px;
  background: radial-gradient(circle, #ffffff 0%, transparent 70%);
  top: -120px;
  left: -120px;
}

.cs-blob--pink {
  width: 620px;
  height: 620px;
  background: radial-gradient(circle, #d4d4d4 0%, transparent 70%);
  bottom: -180px;
  right: -180px;
}

/* Hamburger top-left */
.cs-menu-btn {
  position: absolute;
  top: 24px;
  left: 24px;
  width: 42px;
  height: 42px;
  background: rgba(255, 255, 255, 0.18);
  border: 0;
  border-radius: 10px;
  color: #fff;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: background 0.2s ease, transform 0.2s ease;
  z-index: 10;
}

.cs-menu-btn:hover {
  background: rgba(255, 255, 255, 0.28);
  transform: translateY(-1px);
}

:global(body.cs-menu-open) {
  overflow: hidden;
}

.cs-menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 20;
  background: rgba(0, 0, 0, 0.56);
  backdrop-filter: blur(4px);
}

.cs-menu-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 21;
  display: flex;
  flex-direction: column;
  width: min(92vw, 420px);
  background: #fff;
  color: #111;
  box-shadow: -24px 0 70px rgba(0, 0, 0, 0.34);
}

.cs-menu-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 28px 22px 18px;
  background: #000;
  color: #fff;
}

.cs-menu-panel__eyebrow {
  display: block;
  margin-bottom: 5px;
  color: rgba(255, 255, 255, 0.62);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.cs-menu-panel__header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: 0;
}

.cs-menu-panel__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.cs-menu-state {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 22px;
  color: #555;
  font-weight: 650;
}

.cs-menu-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-top-color: #111;
  border-radius: 50%;
  animation: cs-menu-spin 0.8s linear infinite;
}

.cs-menu-layout {
  display: grid;
  grid-template-columns: 124px minmax(0, 1fr);
  min-height: 0;
  flex: 1;
  background: #f5f5f5;
}

.cs-menu-roots {
  overflow-y: auto;
  padding: 12px 9px 18px;
  background: #080808;
}

.cs-menu-root {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  width: 100%;
  min-height: 78px;
  margin-bottom: 7px;
  padding: 10px 6px;
  border: 0;
  border-radius: 15px;
  background: transparent;
  color: rgba(255, 255, 255, 0.62);
  font-size: 12px;
  font-weight: 750;
  line-height: 1.18;
  text-align: center;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.cs-menu-root:active {
  transform: scale(0.96);
}

.cs-menu-root.is-active {
  background: #fff;
  color: #000;
}

.cs-menu-root__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  font-size: 16px;
}

.cs-menu-root.is-active .cs-menu-root__icon {
  background: #000;
  color: #fff;
}

.cs-menu-content {
  overflow-y: auto;
  min-width: 0;
  padding: 16px 14px 24px;
  scroll-behavior: smooth;
}

.cs-menu-view-all {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 16px;
  padding: 13px 14px;
  border-radius: 14px;
  background: #111;
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  text-decoration: none;
}

.cs-menu-group {
  margin-bottom: 18px;
}

.cs-menu-group h3 {
  margin: 0 0 9px;
  color: #111;
  font-size: 13px;
  font-weight: 850;
  letter-spacing: 0;
}

.cs-menu-items {
  display: grid;
  gap: 7px;
}

.cs-menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 42px;
  padding: 10px 11px;
  border: 1px solid #eee;
  border-radius: 12px;
  background: #fff;
  color: #191919;
  font-size: 13px;
  font-weight: 650;
  line-height: 1.25;
  text-decoration: none;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.035);
}

.cs-menu-item__badge {
  flex: 0 0 auto;
  padding: 3px 7px;
  border-radius: 999px;
  background: #000;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
}

.cs-menu-overlay-enter-active,
.cs-menu-overlay-leave-active {
  transition: opacity 0.24s ease;
}

.cs-menu-overlay-enter-from,
.cs-menu-overlay-leave-to {
  opacity: 0;
}

.cs-menu-drawer-enter-active,
.cs-menu-drawer-leave-active {
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.22s ease;
}

.cs-menu-drawer-enter-from,
.cs-menu-drawer-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@keyframes cs-menu-spin {
  to {
    transform: rotate(360deg);
  }
}

/* Vertical social icons (right side) */
.cs-socials {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
  z-index: 10;
}

.cs-social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  backdrop-filter: blur(6px);
  transition: background 0.2s ease, transform 0.2s ease;
}

.cs-social-link:hover {
  background: rgba(255, 255, 255, 0.32);
  transform: scale(1.08);
  color: #fff;
}

/* Center content */
.cs-center {
  position: relative;
  z-index: 5;
  text-align: center;
  width: 100%;
  max-width: 620px;
}

.cs-title {
  margin: 0 0 36px;
  font-size: 60px;
  font-weight: 400;
  letter-spacing: 0.01em;
  color: #fff;
  line-height: 1.1;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.18);
}

/* Countdown */
.cs-countdown {
  display: flex;
  justify-content: center;
  gap: 22px;
  margin-bottom: 36px;
}

.cs-count-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cs-count-value {
  font-family: "Orbitron", "Courier New", monospace;
  font-weight: 700;
  font-size: 54px;
  letter-spacing: 6px;
  color: #fff;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.22),
    rgba(255, 255, 255, 0.06)
  );
  padding: 14px 22px;
  border-radius: 10px;
  min-width: 140px;
  text-align: center;
  text-shadow: 0 0 14px rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.cs-count-label {
  margin-top: 14px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 4px;
  color: rgba(255, 255, 255, 0.92);
}

.cs-subtitle {
  margin: 0 0 18px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.92);
}

.cs-timezone {
  margin: -20px 0 26px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

/* Back to Home button */
.cs-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 26px 12px 14px;
  background: #fff;
  color: #111;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-decoration: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.28);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.cs-back-btn:hover {
  background: #f4f4f5;
  transform: translateY(-2px);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.34);
  color: #000;
}

.cs-back-btn:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.85);
  outline-offset: 4px;
}

.cs-back-btn__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: linear-gradient(135deg, #1a1a1a, #3d3d3d);
  color: #fff;
  font-size: 14px;
  transition: transform 0.2s ease;
}

.cs-back-btn:hover .cs-back-btn__icon {
  transform: translateX(-3px);
}

/* Responsive */
@media (max-width: 767.98px) {
  .cs-menu-panel {
    width: min(94vw, 390px);
  }

  .cs-menu-layout {
    grid-template-columns: 108px minmax(0, 1fr);
  }

  .cs-menu-root {
    min-height: 74px;
    font-size: 11px;
  }

  .cs-title {
    font-size: 44px;
    margin-bottom: 28px;
  }

  .cs-countdown {
    gap: 14px;
  }

  .cs-count-value {
    font-size: 38px;
    padding: 10px 14px;
    min-width: 96px;
    letter-spacing: 4px;
  }

  .cs-count-label {
    font-size: 11px;
    letter-spacing: 3px;
    margin-top: 10px;
  }

  .cs-socials {
    right: 12px;
    gap: 10px;
  }

  .cs-social-link {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .cs-shell {
    padding: 32px 16px;
  }

  .cs-title {
    font-size: 32px;
    margin-bottom: 24px;
  }

  .cs-count-value {
    font-size: 28px;
    padding: 8px 10px;
    min-width: 72px;
    letter-spacing: 3px;
  }

  .cs-back-btn {
    padding: 10px 22px 10px 12px;
    font-size: 13px;
  }

  .cs-back-btn__icon {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }

  .cs-menu-btn {
    width: 36px;
    height: 36px;
    top: 16px;
    right: 16px;
    font-size: 16px;
  }
}
</style>
