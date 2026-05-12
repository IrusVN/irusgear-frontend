<template>
  <ProfileLayout>
    <div class="policy-layout">
      <aside class="policy-sidebar">
        <div class="policy-sidebar__section">
          <div class="policy-sidebar__title">{{ $t('profile.policy.sidebarTitle') }}</div>
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

      <main class="policy-content">

        <!-- I. Return 30 days -->
        <section v-if="activeSection === 'return'" class="policy-section">
          <h1 class="policy-section__title">{{ $t('profile.policy.return.title') }}</h1>
          <p class="policy-section__desc">{{ $t('profile.policy.return.desc') }}</p>

          <div class="policy-table-wrap">
            <table class="policy-table">
              <thead>
                <tr>
                  <th>{{ $t('profile.policy.return.tableHeaders.product') }}</th>
                  <th>{{ $t('profile.policy.return.tableHeaders.freeExchange') }}</th>
                  <th>{{ $t('profile.policy.return.tableHeaders.returnPolicy') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in $tm('profile.policy.return.rows')" :key="i">
                  <td>{{ $rt(row.product) }}</td>
                  <td>{{ $rt(row.freeExchange) }}</td>
                  <td>{{ $rt(row.returnPolicy) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 class="policy-section__subtitle">{{ $t('profile.policy.return.conditionsTitle') }}</h3>
          <ul class="policy-list">
            <li v-for="(item, i) in $tm('profile.policy.return.conditions')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h3 class="policy-section__subtitle">{{ $t('profile.policy.return.screenDefectTitle') }}</h3>
          <ul class="policy-list">
            <li v-for="(item, i) in $tm('profile.policy.return.screenDefects')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <div class="policy-notice">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div>{{ $t('profile.policy.notice.dataLoss') }}</div>
          </div>
        </section>

        <!-- II. Standard warranty -->
        <section v-if="activeSection === 'standard'" class="policy-section">
          <h1 class="policy-section__title">{{ $t('profile.policy.standard.title') }}</h1>

          <h3 class="policy-section__subtitle">{{ $t('profile.policy.standard.phoneLaptopTitle') }}</h3>
          <div class="policy-table-wrap">
            <table class="policy-table">
              <thead>
                <tr>
                  <th>{{ $t('profile.policy.standard.phoneLaptopTableHeaders.product') }}</th>
                  <th>{{ $t('profile.policy.standard.phoneLaptopTableHeaders.warrantyTime') }}</th>
                  <th>{{ $t('profile.policy.standard.phoneLaptopTableHeaders.warrantyRights') }}</th>
                  <th>{{ $t('profile.policy.standard.phoneLaptopTableHeaders.warrantyAddress') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in $tm('profile.policy.standard.phoneLaptopRows')" :key="i">
                  <td>{{ $rt(row.product) }}</td>
                  <td>{{ $rt(row.warrantyTime) }}</td>
                  <td>{{ $rt(row.warrantyRights) }}</td>
                  <td>{{ $rt(row.warrantyAddress) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p class="policy-section__desc" style="margin-top: 0;">{{ $t('profile.policy.standard.phoneLaptopNote') }}</p>

          <h3 class="policy-section__subtitle">{{ $t('profile.policy.standard.accessoryTitle') }}</h3>
          <div class="policy-table-wrap">
            <table class="policy-table">
              <thead>
                <tr>
                  <th>{{ $t('profile.policy.standard.accessoryTableHeaders.brand') }}</th>
                  <th>{{ $t('profile.policy.standard.accessoryTableHeaders.warrantyTime') }}</th>
                  <th>{{ $t('profile.policy.standard.accessoryTableHeaders.rights') }}</th>
                  <th>{{ $t('profile.policy.standard.accessoryTableHeaders.address') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in $tm('profile.policy.standard.accessoryRows')" :key="i">
                  <td>{{ $rt(row.brand) }}</td>
                  <td>{{ $rt(row.warrantyTime) }}</td>
                  <td>{{ $rt(row.rights) }}</td>
                  <td>{{ $rt(row.address) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="policy-notice">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div>{{ $t('profile.policy.notice.dataLossAlt') }}</div>
          </div>
        </section>

        <!-- III. Components -->
        <section v-if="activeSection === 'components'" class="policy-section">
          <h1 class="policy-section__title">{{ $t('profile.policy.components.title') }}</h1>

          <div class="policy-table-wrap">
            <table class="policy-table">
              <thead>
                <tr>
                  <th>{{ $t('profile.policy.components.tableHeaders.product') }}</th>
                  <th>{{ $t('profile.policy.components.tableHeaders.warrantyTime') }}</th>
                  <th>{{ $t('profile.policy.components.tableHeaders.warrantyRights') }}</th>
                  <th>{{ $t('profile.policy.components.tableHeaders.location') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in $tm('profile.policy.components.rows')" :key="i">
                  <td>{{ $rt(row.product) }}</td>
                  <td>{{ $rt(row.warrantyTime) }}</td>
                  <td>{{ $rt(row.rights) }}</td>
                  <td>{{ $rt(row.location) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 class="policy-section__subtitle">{{ $t('profile.policy.components.conditionsTitle') }}</h3>
          <h4 class="policy-section__sub-subtitle">{{ $t('profile.policy.components.eligibleTitle') }}</h4>
          <ul class="policy-list">
            <li v-for="(item, i) in $tm('profile.policy.components.eligible')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h4 class="policy-section__sub-subtitle">{{ $t('profile.policy.components.notEligibleTitle') }}</h4>
          <ul class="policy-list">
            <li v-for="(item, i) in $tm('profile.policy.components.notEligible')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <div class="policy-notice">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div>{{ $t('profile.policy.notice.dataLossAlt') }}</div>
          </div>
        </section>

        <!-- IV. VIP 1-to-1 -->
        <section v-if="activeSection === 'vip'" class="policy-section">
          <h1 class="policy-section__title">{{ $t('profile.policy.vip.title') }}</h1>
          <p class="policy-section__desc">{{ $t('profile.policy.vip.desc') }}</p>

          <div class="policy-table-wrap">
            <table class="policy-table">
              <thead>
                <tr>
                  <th>{{ $t('profile.policy.vip.tableHeaders.scope') }}</th>
                  <th>{{ $t('profile.policy.vip.tableHeaders.standard') }}</th>
                  <th>{{ $t('profile.policy.vip.tableHeaders.vip') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in $tm('profile.policy.vip.rows')" :key="i">
                  <td>{{ $rt(row.scope) }}</td>
                  <td>{{ $rt(row.standard) }}</td>
                  <td>{{ $rt(row.vip) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p class="policy-section__note"><em>{{ $t('profile.policy.vip.batteryNote') }}</em></p>

          <h3 class="policy-section__subtitle">{{ $t('profile.policy.vip.processingTimeTitle') }}</h3>
          <ul class="policy-list">
            <li v-for="(item, i) in $tm('profile.policy.vip.processingTime')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h3 class="policy-section__subtitle">{{ $t('profile.policy.vip.upgradeTitle') }}</h3>
          <div class="policy-highlight">{{ $t('profile.policy.vip.upgradeFormula') }}</div>

          <h3 class="policy-section__subtitle">{{ $t('profile.policy.vip.outOfStockTitle') }}</h3>
          <p>{{ $t('profile.policy.vip.outOfStockDesc') }}</p>
          <div class="policy-highlight">{{ $t('profile.policy.vip.outOfStockFormula') }}</div>
          <p class="policy-section__note"><em>{{ $t('profile.policy.vip.outOfStockNote') }}</em></p>

          <h3 class="policy-section__subtitle">{{ $t('profile.policy.vip.privilegeTitle') }}</h3>
          <ul class="policy-list">
            <li v-for="(item, i) in $tm('profile.policy.vip.privileges')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <div class="policy-notice">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div>{{ $t('profile.policy.notice.dataLoss') }}</div>
          </div>
        </section>

        <!-- V. Accidental damage -->
        <section v-if="activeSection === 'accidental'" class="policy-section">
          <h1 class="policy-section__title">{{ $t('profile.policy.accidental.title') }}</h1>
          <p class="policy-section__desc">{{ $t('profile.policy.accidental.desc') }}</p>

          <h3 class="policy-section__subtitle">{{ $t('profile.policy.accidental.conditionsTitle') }}</h3>
          <ul class="policy-list">
            <li v-for="(item, i) in $tm('profile.policy.accidental.conditions')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h3 class="policy-section__subtitle">{{ $t('profile.policy.accidental.rightsTitle') }}</h3>
          <ul class="policy-list">
            <li v-for="(item, i) in $tm('profile.policy.accidental.rights')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h3 class="policy-section__subtitle">{{ $t('profile.policy.accidental.cannotRepairTitle') }}</h3>
          <ul class="policy-list">
            <li v-for="(item, i) in $tm('profile.policy.accidental.cannotRepair')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h3 class="policy-section__subtitle">{{ $t('profile.policy.accidental.extraPrivilegeTitle') }}</h3>
          <div class="policy-highlight">{{ $t('profile.policy.accidental.extraPrivilege') }}</div>

          <div class="policy-notice">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div>{{ $t('profile.policy.notice.important') }}</div>
          </div>
        </section>

        <!-- VI. S24+ -->
        <section v-if="activeSection === 's24plus'" class="policy-section">
          <h1 class="policy-section__title">{{ $t('profile.policy.s24plus.title') }}</h1>
          <p class="policy-section__desc">{{ $t('profile.policy.s24plus.desc') }}</p>

          <h3 class="policy-section__subtitle">{{ $t('profile.policy.s24plus.rightsTitle') }}</h3>
          <ul class="policy-list">
            <li v-for="(item, i) in $tm('profile.policy.s24plus.rights')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h3 class="policy-section__subtitle">{{ $t('profile.policy.s24plus.cannotRepairTitle') }}</h3>
          <p>{{ $t('profile.policy.s24plus.cannotRepairDesc') }}</p>
          <ul class="policy-list">
            <li v-for="(item, i) in $tm('profile.policy.s24plus.cannotRepairSteps')" :key="i">{{ $rt(item.text) }}</li>
          </ul>
          <div class="policy-highlight">{{ $t('profile.policy.s24plus.cannotRepairFormula') }}</div>

          <h3 class="policy-section__subtitle">{{ $t('profile.policy.s24plus.notCoveredTitle') }}</h3>
          <ul class="policy-list">
            <li v-for="(item, i) in $tm('profile.policy.s24plus.notCovered')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h3 class="policy-section__subtitle">{{ $t('profile.policy.s24plus.exampleTitle') }}</h3>
          <div class="policy-example">
            <p>{{ $t('profile.policy.s24plus.exampleContent') }}</p>
            <ul class="policy-list" style="margin-top: 8px;">
              <li v-for="(item, i) in $tm('profile.policy.s24plus.exampleBullets')" :key="i">{{ $rt(item.text) }}</li>
            </ul>
          </div>

          <div class="policy-notice">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div>{{ $t('profile.policy.notice.importantAlt') }}</div>
          </div>
        </section>

      </main>
    </div>
  </ProfileLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ProfileLayout from '@/components/Common/ProfileLayout.vue'

definePageMeta({ layout: 'default' })

const { t, tm } = useI18n()

useHead({ title: computed(() => t('profile.policy.pageTitle')) })

const activeSection = ref('return')

const sidebarItems = computed(() => [
  { key: 'return', label: t('profile.policy.nav.return30days') },
  { key: 'standard', label: t('profile.policy.nav.standard') },
  { key: 'components', label: t('profile.policy.nav.components') },
  { key: 'vip', label: t('profile.policy.nav.vip') },
  { key: 'accidental', label: t('profile.policy.nav.accidental') },
  { key: 's24plus', label: t('profile.policy.nav.s24plus') },
])
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
    margin: 20px 0 10px;
  }

  .policy-list li {
    font-size: 13px;
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
    margin: 16px 0 10px;
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
    margin-top: 16px;
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
    margin: 14px 0 8px;
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
    margin-top: 14px;
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
