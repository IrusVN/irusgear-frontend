<template>
  <ProfileLayout>
  <div class="policy-layout">
    <!-- Sidebar -->
    <aside class="policy-sidebar">
      <div class="policy-sidebar__section">
        <div class="policy-sidebar__title">Bảo hành</div>
        <button
          v-for="item in sidebarItems"
          :key="item.key"
          type="button"
          class="policy-sidebar__item"
          :class="{ 'policy-sidebar__item--active': activeSection === item.key }"
          @click="activeSection = item.key"
        >
          {{ item.label }}
        </button>
      </div>
    </aside>

    <!-- Content -->
    <main class="policy-content">
      <div v-if="isLoadingPolicies" class="policy-loading">
        <p>{{ $t('profile.content.loading') }}</p>
      </div>
      <div v-else-if="!activePolicy" class="policy-loading">
        <p>{{ $t('profile.content.noContent') }}</p>
      </div>
      <section v-else class="policy-section">
        <h1 class="policy-section__title">{{ activePolicy.title }}</h1>
        <div v-if="activePolicy.description" class="policy-section__desc" v-html="activePolicy.description"></div>
        <div v-if="activePolicy.content" v-html="activePolicy.content"></div>
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

useHead({ title: 'Chính sách bảo hành - IrusGear' })

const contentStore = useContentStore()
const { policies, isLoadingPolicies } = storeToRefs(contentStore)

const activeSection = ref('return')

const sidebarItems = computed(() =>
  policies.value.map((s) => ({ key: s.key, label: s.label || s.title }))
)

const activePolicy = computed(() =>
  policies.value.find((s) => s.key === activeSection.value)
)

contentStore.fetchPolicies()
</script>

<style scoped>
/* ── Layout ──────────────────────────────── */
.policy-layout {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

/* ── Sidebar ─────────────────────────────── */
.policy-sidebar {
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

.policy-sidebar::-webkit-scrollbar { width: 4px; }
.policy-sidebar::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 999px; }

.policy-sidebar__section {
  padding: 8px 0;
}

.policy-sidebar__title {
  padding: 12px 20px 6px;
  font-size: 11px;
  font-weight: 700;
  color: #a1a1aa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.policy-sidebar__item {
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

.policy-sidebar__item:hover {
  background: #f4f4f5;
  color: #18181b;
}

.policy-sidebar__item--active {
  background: #fef2f2;
  color: #d70018;
  font-weight: 600;
  border-left-color: #d70018;
}

.policy-sidebar__item--active:hover {
  background: #fef2f2;
  color: #d70018;
}

/* ── Content ──────────────────────────────── */
.policy-content {
  flex: 1;
  min-width: 0;
}

/* ── Loading / Empty ─────────────────── */
.policy-loading {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  padding: 48px 24px;
  text-align: center;
}

.policy-loading p {
  font-size: 14px;
  color: #a1a1aa;
  margin: 0;
}

/* ── Section ─────────────────────────────── */
.policy-section {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  padding: 28px 28px 32px;
}

.policy-section__title {
  font-size: 20px;
  font-weight: 700;
  color: #18181b;
  margin: 0 0 8px;
  line-height: 1.3;
}

.policy-section__desc {
  font-size: 14px;
  color: #52525b;
  margin: 0 0 24px;
  line-height: 1.6;
}

.policy-section__subtitle {
  font-size: 15px;
  font-weight: 700;
  color: #18181b;
  margin: 28px 0 12px;
}

.policy-section__sub-subtitle {
  font-size: 14px;
  font-weight: 600;
  color: #52525b;
  margin: 20px 0 10px;
}

.policy-section__note {
  font-size: 13px;
  color: #71717a;
  margin: 8px 0;
  font-style: italic;
}

/* ── Lists ───────────────────────────────── */
.policy-list {
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.policy-list li {
  font-size: 14px;
  color: #3f3f46;
  line-height: 1.6;
}

.policy-list li strong {
  color: #18181b;
}

/* ── Table ───────────────────────────────── */
.policy-table-wrap {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e4e4e7;
  margin-bottom: 8px;
}

.policy-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.policy-table thead tr {
  background: #f4f4f5;
}

.policy-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 700;
  color: #18181b;
  font-size: 13px;
  border-bottom: 1px solid #e4e4e7;
  white-space: nowrap;
}

.policy-table td {
  padding: 12px 16px;
  color: #3f3f46;
  line-height: 1.5;
  border-bottom: 1px solid #f4f4f5;
  vertical-align: top;
}

.policy-table tbody tr:last-child td {
  border-bottom: none;
}

.policy-table tbody tr:hover td {
  background: #fafafa;
}

.policy-table td strong {
  color: #18181b;
}

/* ── Notice ──────────────────────────────── */
.policy-notice {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 16px;
  background: #f9fafb;
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  margin-top: 24px;
}

.policy-notice svg {
  color: #71717a;
  flex-shrink: 0;
  margin-top: 2px;
}

.policy-notice div {
  font-size: 13px;
  color: #52525b;
  line-height: 1.6;
}

.policy-notice strong {
  color: #18181b;
}

/* ── Highlight ───────────────────────────── */
.policy-highlight {
  padding: 14px 18px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  font-size: 14px;
  color: #18181b;
  line-height: 1.6;
  margin: 12px 0;
}

.policy-highlight strong {
  color: #d70018;
}

/* ── Example Box ─────────────────────────── */
.policy-example {
  padding: 16px 18px;
  background: #f9fafb;
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  margin-top: 12px;
}

.policy-example p {
  font-size: 14px;
  color: #3f3f46;
  margin: 0;
  line-height: 1.6;
}

/* ── Responsive ─────────────────────────── */
@media (max-width: 991.98px) {
  .policy-layout {
    flex-direction: column;
  }

  .policy-sidebar {
    width: 100%;
    position: static;
    max-height: none;
    overflow: visible;
  }

  .policy-sidebar__section {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 4px;
    padding: 8px;
    scrollbar-width: none;
  }

  .policy-sidebar__section::-webkit-scrollbar {
    display: none;
  }

  .policy-sidebar__title {
    width: 100%;
    padding: 4px 8px;
    font-size: 10px;
  }

  .policy-sidebar__item {
    padding: 8px 12px;
    font-size: 12px;
    border-left: none;
    border-radius: 8px;
    border: 1px solid #e4e4e7;
    background: #fff;
    white-space: nowrap;
  }

  .policy-sidebar__item--active {
    background: #d70018;
    color: #fff;
    border-color: #d70018;
  }

  .policy-sidebar__item--active:hover {
    background: #b80015;
    color: #fff;
  }

  .policy-section {
    padding: 20px 16px 24px;
    border-radius: 14px;
  }

  .policy-section__title {
    font-size: 18px;
  }

  .policy-section__subtitle {
    font-size: 14px;
  }

  .policy-table th,
  .policy-table td {
    padding: 10px 12px;
    font-size: 12px;
  }
}

@media (max-width: 767.98px) {
  .policy-sidebar__item {
    font-size: 12px;
    padding: 7px 10px;
  }

  .policy-section {
    padding: 16px 14px 20px;
  }

  .policy-section__title {
    font-size: 17px;
  }

  .policy-section__subtitle {
    font-size: 14px;
  }

  .policy-notice {
    padding: 12px 14px;
  }

  .policy-highlight {
    padding: 12px 14px;
  }

  .policy-example {
    padding: 14px;
  }

  .policy-table th,
  .policy-table td {
    padding: 8px 10px;
    font-size: 12px;
  }
}

@media (max-width: 575.98px) {
  .policy-sidebar__item {
    font-size: 11px;
    padding: 6px 10px;
  }

  .policy-section {
    padding: 14px 12px 18px;
  }

  .policy-section__title {
    font-size: 16px;
  }

  .policy-section__subtitle {
    font-size: 13px;
    margin: 20px 0 10px;
  }

  .policy-section__desc {
    font-size: 13px;
    margin-bottom: 20px;
  }

  .policy-list {
    padding-left: 18px;
    gap: 6px;
  }

  .policy-list li {
    font-size: 13px;
  }

  .policy-table-wrap {
    border-radius: 8px;
  }

  .policy-table th,
  .policy-table td {
    padding: 8px 10px;
    font-size: 11px;
  }

  .policy-notice {
    padding: 10px 12px;
    margin-top: 20px;
    gap: 8px;
  }

  .policy-notice div {
    font-size: 12px;
  }

  .policy-highlight {
    padding: 10px 12px;
    font-size: 13px;
    margin: 10px 0;
  }

  .policy-example {
    padding: 12px;
    margin-top: 10px;
  }

  .policy-example p {
    font-size: 13px;
  }

  .policy-section__note {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .policy-sidebar__item {
    font-size: 11px;
    padding: 5px 8px;
    border-radius: 6px;
  }

  .policy-section {
    padding: 12px 10px 16px;
    border-radius: 12px;
  }

  .policy-section__title {
    font-size: 15px;
  }

  .policy-section__subtitle {
    font-size: 13px;
    margin: 16px 0 8px;
  }

  .policy-section__desc {
    font-size: 12px;
    margin-bottom: 16px;
  }

  .policy-list {
    padding-left: 16px;
    gap: 5px;
  }

  .policy-list li {
    font-size: 12px;
    line-height: 1.5;
  }

  .policy-table th,
  .policy-table td {
    padding: 7px 8px;
    font-size: 11px;
  }

  .policy-notice {
    padding: 8px 10px;
    margin-top: 16px;
  }

  .policy-notice svg {
    width: 14px;
    height: 14px;
  }

  .policy-highlight {
    padding: 8px 10px;
    font-size: 12px;
  }

  .policy-example {
    padding: 10px;
  }
}

@media (min-width: 1200px) {
  .policy-sidebar {
    width: 300px;
  }

  .policy-section {
    padding: 32px 36px 36px;
  }

  .policy-section__title {
    font-size: 22px;
  }
}

/* ── Bottom Clearance: Mobile Bottom Nav ─── */
@media (max-width: 991.98px) {
  .policy-layout {
    padding-bottom: 110px;
  }
}

@media (max-width: 767.98px) {
  .policy-layout {
    padding-bottom: 100px;
  }
}

@media (max-width: 575.98px) {
  .policy-layout {
    padding-bottom: 90px;
  }
}

@media (max-width: 480px) {
  .policy-layout {
    padding-bottom: 80px;
  }
}
</style>
