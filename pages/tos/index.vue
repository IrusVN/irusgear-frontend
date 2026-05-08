<template>
  <ProfileLayout>
  <div class="tos-layout">
    <!-- Sidebar -->
    <aside class="tos-sidebar">
      <div class="tos-sidebar__section">
        <div class="tos-sidebar__title">Quy chế</div>
        <button
          v-for="item in sidebarItems"
          :key="item.key"
          type="button"
          class="tos-sidebar__item"
          :class="{ 'tos-sidebar__item--active': activeSection === item.key }"
          @click="activeSection = item.key"
        >
          {{ item.label }}
        </button>
      </div>
    </aside>

    <!-- Content -->
    <main class="tos-content">
      <div v-if="isLoadingTerms" class="tos-loading">
        <p>{{ $t('profile.content.loading') }}</p>
      </div>
      <div v-else-if="!activeTerm" class="tos-loading">
        <p>{{ $t('profile.content.noContent') }}</p>
      </div>
      <section v-else class="tos-section">
        <h1 class="tos-section__title">{{ activeTerm.title }}</h1>
        <div v-if="activeTerm.description" class="tos-section__desc" v-html="activeTerm.description"></div>
        <div v-if="activeTerm.content" v-html="activeTerm.content"></div>
      </section>
    </main>
  </div>
</ProfileLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useContentStore } from '@/stores/contentStore'
import ProfileLayout from '@/components/Common/ProfileLayout.vue'

definePageMeta({ layout: 'default' })

useHead({ title: 'Quy chế hoạt động - IrusGear' })

const contentStore = useContentStore()
const { terms, isLoadingTerms } = storeToRefs(contentStore)

const activeSection = ref('general')

const sidebarItems = computed(() =>
  terms.value.map((s) => ({ key: s.key, label: s.label || s.title }))
)

const activeTerm = computed(() =>
  terms.value.find((s) => s.key === activeSection.value)
)

contentStore.fetchTerms()
</script>

<style scoped>
/* ── Layout ──────────────────────────────── */
.tos-layout {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

/* ── Sidebar ─────────────────────────────── */
.tos-sidebar {
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 24px;
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  border-radius: 18px;
  background: #fff;
  border: 1px solid #ececf1;
  scrollbar-width: thin;
  scrollbar-color: #e4e4e7 transparent;
}

.tos-sidebar::-webkit-scrollbar { width: 4px; }
.tos-sidebar::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 999px; }

.tos-sidebar__section {
  padding: 8px 0;
}

.tos-sidebar__title {
  padding: 12px 20px 6px;
  font-size: 11px;
  font-weight: 700;
  color: #a1a1aa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tos-sidebar__item {
  display: block;
  width: 100%;
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 500;
  color: #52525b;
  background: none;
  border: none;
  border-left: 4px solid transparent;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  line-height: 1.4;
}

.tos-sidebar__item:hover {
  background: #f4f4f5;
  color: #18181b;
}

.tos-sidebar__item--active {
  background: #fef2f2;
  color: #d70018;
  font-weight: 600;
  border-left-color: #d70018;
}

.tos-sidebar__item--active:hover {
  background: #fef2f2;
  color: #d70018;
}

/* ── Content ──────────────────────────────── */
.tos-content {
  flex: 1;
  min-width: 0;
}

/* ── Loading / Empty ─────────────────── */
.tos-loading {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  padding: 48px 24px;
  text-align: center;
}

.tos-loading p {
  font-size: 14px;
  color: #a1a1aa;
  margin: 0;
}

/* ── Section ─────────────────────────────── */
.tos-section {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  padding: 28px 28px 32px;
}

.tos-section__title {
  font-size: 20px;
  font-weight: 700;
  color: #18181b;
  margin: 0 0 20px;
  line-height: 1.3;
}

.tos-section__desc {
  font-size: 14px;
  color: #3f3f46;
  margin: 0 0 20px;
  line-height: 1.7;
}

/* ── Responsive ─────────────────────────── */
@media (max-width: 991.98px) {
  .tos-layout {
    flex-direction: column;
  }

  .tos-sidebar {
    width: 100%;
    position: static;
    max-height: none;
    overflow: visible;
  }

  .tos-sidebar__section {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 4px;
    padding: 8px;
    scrollbar-width: none;
  }

  .tos-sidebar__section::-webkit-scrollbar {
    display: none;
  }

  .tos-sidebar__title {
    width: 100%;
    padding: 4px 8px;
    font-size: 10px;
  }

  .tos-sidebar__item {
    padding: 8px 12px;
    font-size: 12px;
    border-left: none;
    border-radius: 8px;
    border: 1px solid #e4e4e7;
    background: #fff;
    white-space: nowrap;
  }

  .tos-sidebar__item--active {
    background: #d70018;
    color: #fff;
    border-color: #d70018;
  }

  .tos-sidebar__item--active:hover {
    background: #b80015;
    color: #fff;
  }

  .tos-section {
    padding: 20px 16px 24px;
    border-radius: 14px;
  }

  .tos-section__title {
    font-size: 18px;
  }
}

@media (max-width: 767.98px) {
  .tos-sidebar__item {
    font-size: 12px;
    padding: 7px 10px;
  }

  .tos-section {
    padding: 16px 14px 20px;
  }

  .tos-section__title {
    font-size: 17px;
  }
}

@media (max-width: 575.98px) {
  .tos-sidebar__item {
    font-size: 11px;
    padding: 6px 10px;
  }

  .tos-section {
    padding: 14px 12px 18px;
  }

  .tos-section__title {
    font-size: 16px;
    margin-bottom: 16px;
  }
}

@media (max-width: 480px) {
  .tos-sidebar__item {
    font-size: 11px;
    padding: 5px 8px;
    border-radius: 6px;
  }

  .tos-section {
    padding: 12px 10px 16px;
    border-radius: 12px;
  }

  .tos-section__title {
    font-size: 15px;
    margin-bottom: 14px;
  }
}

@media (min-width: 1200px) {
  .tos-sidebar {
    width: 300px;
  }

  .tos-section {
    padding: 32px 36px 36px;
  }

  .tos-section__title {
    font-size: 22px;
  }
}

/* ── Bottom Clearance: Mobile Bottom Nav ─── */
@media (max-width: 991.98px) {
  .tos-layout {
    padding-bottom: 110px;
  }
}

@media (max-width: 767.98px) {
  .tos-layout {
    padding-bottom: 100px;
  }
}

@media (max-width: 575.98px) {
  .tos-layout {
    padding-bottom: 90px;
  }
}

@media (max-width: 480px) {
  .tos-layout {
    padding-bottom: 80px;
  }
}
</style>
