<template>
  <div class="mega-menu">
    <div class="mega-menu-sidebar bg-white rounded-3 shadow-sm border overflow-hidden">
      <button v-for="section in normalizedSections" :key="section.key || section.title" type="button"
        class="mega-menu-sidebar-item" :class="{ active: activeSectionKey === section.key }"
        @mouseenter="activate(section.key)" @focus="activate(section.key)">
        <span class="mega-menu-sidebar-icon">
          <img v-if="section.icon" :src="section.icon" :alt="section.title" loading="lazy" />
          <i v-else class="bi bi-grid"></i>
        </span>
        <span class="mega-menu-sidebar-label">{{ section.title }}</span>
        <i class="bi bi-chevron-right mega-menu-sidebar-chevron"></i>
      </button>
    </div>

    <div v-if="activeSection" class="mega-menu-panel bg-white rounded-3 shadow-sm border">
      <div class="mega-menu-columns">
        <section v-for="group in activeGroups" :key="group.key || group.title" class="mega-menu-group">
          <h3 class="mega-menu-group-title">{{ group.title }}</h3>

          <div class="mega-menu-group-items">
            <NuxtLink v-for="item in group.items || []" :key="`${group.key || group.title}-${item.slug || item.title}`"
              :to="`/products/?category=${item.slug || item.title}`" class="mega-menu-chip"
              :class="{ 'has-badge': !!item.badge, 'has-image': !!item.image }">
              <img v-if="item.image" :src="item.image" :alt="item.title" class="mega-menu-chip-image" loading="lazy" />
              <span class="mega-menu-chip-title">{{ item.title }}</span>
              <span v-if="item.badge" class="mega-menu-chip-badge">{{ item.badge }}</span>
            </NuxtLink>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useHomeStore } from "@/stores/homeStore";

const homeStore = useHomeStore();
const { megaMenuSections, activeMegaMenuKey } = storeToRefs(homeStore);

const normalizedSections = computed(() =>
  Array.isArray(megaMenuSections.value) ? megaMenuSections.value.filter(Boolean) : []
);

const activeSectionKey = computed(() => {
  if (!normalizedSections.value.length) return "";

  const matched = normalizedSections.value.find((section) => section.key === activeMegaMenuKey.value);
  return matched?.key || normalizedSections.value[0]?.key || "";
});

const activeSection = computed(
  () => normalizedSections.value.find((section) => section.key === activeSectionKey.value) || null
);

const activeGroups = computed(() => activeSection.value?.children || []);

const activate = (key) => {
  if (!key || key === activeSectionKey.value) return;
  homeStore.setActiveMegaMenuKey(key);
};

const resolveHref = (item) => {
  if (!item) return "";
  if (item.url) return item.url;
  return "";
};

watch(
  normalizedSections,
  (sections) => {
    if (!sections.length) return;

    if (!activeMegaMenuKey.value || !sections.some((section) => section.key === activeMegaMenuKey.value)) {
      homeStore.setActiveMegaMenuKey(sections[0]?.key || "");
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (!normalizedSections.value.length) {
    homeStore.fetchMegaMenu().catch(() => { });
  }
});
</script>

<style scoped>
.mega-menu {
  position: relative;
  z-index: 15;
}

.mega-menu-sidebar {
  width: 258px;
  padding: 4px 0;
}

.mega-menu-sidebar-item {
  width: 100%;
  min-height: 40px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: 0;
  border-bottom: 1px solid #f1f3f5;
  background: #fff;
  color: #212529;
  text-align: left;
  transition: background-color 0.16s ease, color 0.16s ease;
}

.mega-menu-sidebar-item:last-child {
  border-bottom: none;
}

.mega-menu-sidebar-item:hover,
.mega-menu-sidebar-item.active {
  background: #f8f9fa;
}

.mega-menu-sidebar-item.active .mega-menu-sidebar-label {
  color: #d70018;
}

.mega-menu-sidebar-item.active .mega-menu-sidebar-icon,
.mega-menu-sidebar-item.active .mega-menu-sidebar-chevron {
  color: #d70018;
}

.mega-menu-sidebar-icon {
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #d70018;
  flex-shrink: 0;
}

.mega-menu-sidebar-icon img {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

.mega-menu-sidebar-label {
  flex: 1 1 auto;
  min-width: 0;
  font-size: 0.92rem;
  font-weight: 600;
  line-height: 1.25;
}

.mega-menu-sidebar-chevron {
  color: #adb5bd;
  font-size: 0.85rem;
}

.mega-menu-panel {
  position: absolute;
  top: 0;
  left: calc(100% + 12px);
  width: clamp(720px, calc(100vw - 420px), 980px);
  min-height: 100%;
  max-height: 465px;
  padding: 16px;
  overflow-y: auto;
}

.mega-menu-columns {
  column-count: 3;
  column-gap: 28px;
}

.mega-menu-group {
  break-inside: avoid;
  margin-bottom: 18px;
}

.mega-menu-group-title {
  margin: 0 0 10px;
  color: #111827;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.3;
}

.mega-menu-group-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.mega-menu-chip {
  position: relative;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 10px;
  background: #fff;
  color: #111827;
  font-size: 0.92rem;
  line-height: 1.2;
  text-decoration: none;
}

.mega-menu-chip:hover {
  border-color: #cfd4da;
  color: #d70018;
}

.mega-menu-chip.has-badge {
  padding-top: 12px;
}

.mega-menu-chip-image {
  width: auto;
  max-width: 92px;
  height: 18px;
  object-fit: contain;
  flex-shrink: 0;
}

.mega-menu-chip-title {
  white-space: nowrap;
}

.mega-menu-chip-badge {
  position: absolute;
  top: -1px;
  right: 10px;
  padding: 2px 6px;
  border-radius: 0 0 8px 8px;
  background: #d70018;
  color: #fff;
  font-size: 0.62rem;
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
}

@media (max-width: 1399.98px) {
  .mega-menu-panel {
    width: clamp(650px, calc(100vw - 360px), 900px);
    max-height: 430px;
  }

  .mega-menu-columns {
    column-gap: 20px;
  }
}
</style>
