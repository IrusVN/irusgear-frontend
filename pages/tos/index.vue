<template>
  <ProfileLayout>
    <div class="tos-layout">
      <aside class="tos-sidebar">
        <div class="tos-sidebar__section">
          <div class="tos-sidebar__title">{{ $t('profile.tos.sidebarTitle') }}</div>
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

      <main class="tos-content">

        <!-- I. General -->
        <section v-if="activeSection === 'general'" class="tos-section">
          <h1 class="tos-section__title">{{ $t('profile.tos.general.title') }}</h1>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.general.principlesTitle') }}</h3>
          <ul class="tos-list">
            <li v-for="(item, i) in $tm('profile.tos.general.principles')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.general.definitionsTitle') }}</h3>
          <ul class="tos-list">
            <li v-for="(item, i) in $tm('profile.tos.general.definitions')" :key="i">{{ $rt(item.text) }}</li>
          </ul>
        </section>

        <!-- II. Transaction -->
        <section v-if="activeSection === 'transaction'" class="tos-section">
          <h1 class="tos-section__title">{{ $t('profile.tos.transaction.title') }}</h1>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.transaction.purchaseTitle') }}</h3>
          <ul class="tos-list">
            <li v-for="(item, i) in $tm('profile.tos.transaction.purchase')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.transaction.deliveryTitle') }}</h3>
          <p class="tos-section__text">{{ $t('profile.tos.transaction.deliveryDesc') }}</p>

          <div class="tos-notice">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div>{{ $t('profile.tos.transaction.noticeImportant') }}</div>
          </div>
        </section>

        <!-- III. Warranty -->
        <section v-if="activeSection === 'warranty'" class="tos-section">
          <h1 class="tos-section__title">{{ $t('profile.tos.warranty.title') }}</h1>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.warranty.return30Title') }}</h3>
          <p class="tos-section__text">{{ $t('profile.tos.warranty.return30Desc') }}</p>

          <div class="tos-table-wrap">
            <table class="tos-table">
              <thead>
                <tr>
                  <th>{{ $t('profile.tos.warranty.returnTableHeaders.productGroup') }}</th>
                  <th>{{ $t('profile.tos.warranty.returnTableHeaders.exchangeTime') }}</th>
                  <th>{{ $t('profile.tos.warranty.returnTableHeaders.returnPolicy') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in $tm('profile.tos.warranty.returnRows')" :key="i">
                  <td>{{ $rt(row.productGroup) }}</td>
                  <td>{{ $rt(row.exchangeTime) }}</td>
                  <td>{{ $rt(row.returnPolicy) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.warranty.conditionsTitle') }}</h3>
          <ul class="tos-list">
            <li v-for="(item, i) in $tm('profile.tos.warranty.conditions')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.warranty.standardTitle') }}</h3>
          <div class="tos-table-wrap">
            <table class="tos-table">
              <thead>
                <tr>
                  <th>{{ $t('profile.tos.warranty.standardTableHeaders.product') }}</th>
                  <th>{{ $t('profile.tos.warranty.standardTableHeaders.warrantyTime') }}</th>
                  <th>{{ $t('profile.tos.warranty.standardTableHeaders.warrantyAddress') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in $tm('profile.tos.warranty.standardRows')" :key="i">
                  <td>{{ $rt(row.product) }}</td>
                  <td>{{ $rt(row.warrantyTime) }}</td>
                  <td>{{ $rt(row.warrantyAddress) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="tos-section__text">{{ $t('profile.tos.warranty.standardNote') }}</p>
        </section>

        <!-- IV. Cancellation -->
        <section v-if="activeSection === 'cancellation'" class="tos-section">
          <h1 class="tos-section__title">{{ $t('profile.tos.cancellation.title') }}</h1>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.cancellation.cancelOrderTitle') }}</h3>
          <p class="tos-section__text">{{ $t('profile.tos.cancellation.cancelOrderDesc') }}</p>
          <ul class="tos-list">
            <li v-for="(item, i) in $tm('profile.tos.cancellation.cancelWays')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.cancellation.returnPolicyTitle') }}</h3>
          <div class="tos-table-wrap">
            <table class="tos-table">
              <thead>
                <tr>
                  <th>{{ $t('profile.tos.cancellation.returnTableHeaders.productGroup') }}</th>
                  <th>{{ $t('profile.tos.cancellation.returnTableHeaders.returnTime') }}</th>
                  <th>{{ $t('profile.tos.cancellation.returnTableHeaders.returnFee') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in $tm('profile.tos.cancellation.returnRows')" :key="i">
                  <td>{{ $rt(row.productGroup) }}</td>
                  <td>{{ $rt(row.returnTime) }}</td>
                  <td>{{ $rt(row.returnFee) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="tos-section__text"><em>{{ $t('profile.tos.cancellation.returnNote1') }}</em></p>
          <p class="tos-section__text"><em>{{ $t('profile.tos.cancellation.returnNote2') }}</em></p>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.cancellation.conditionsTitle') }}</h3>
          <ul class="tos-list">
            <li v-for="(item, i) in $tm('profile.tos.cancellation.conditions')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.cancellation.refundTitle') }}</h3>
          <div class="tos-table-wrap">
            <table class="tos-table">
              <thead>
                <tr>
                  <th>{{ $t('profile.tos.cancellation.refundTableHeaders.paymentMethod') }}</th>
                  <th>{{ $t('profile.tos.cancellation.refundTableHeaders.processingTime') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in $tm('profile.tos.cancellation.refundRows')" :key="i">
                  <td>{{ $rt(row.paymentMethod) }}</td>
                  <td>{{ $rt(row.processingTime) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="tos-section__text"><em>{{ $t('profile.tos.cancellation.refundNote') }}</em></p>
        </section>

        <!-- V. Privacy Cellphones -->
        <section v-if="activeSection === 'privacy-cellphones'" class="tos-section">
          <h1 class="tos-section__title">{{ $t('profile.tos.privacyCellphones.title') }}</h1>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.privacyCellphones.collectPurposeTitle') }}</h3>
          <ul class="tos-list">
            <li v-for="(item, i) in $tm('profile.tos.privacyCellphones.collectPurpose')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.privacyCellphones.scopeTitle') }}</h3>
          <ul class="tos-list">
            <li v-for="(item, i) in $tm('profile.tos.privacyCellphones.scope')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.privacyCellphones.storageTitle') }}</h3>
          <p class="tos-section__text">{{ $t('profile.tos.privacyCellphones.storageDesc') }}</p>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.privacyCellphones.rightsTitle') }}</h3>
          <ul class="tos-list">
            <li v-for="(item, i) in $tm('profile.tos.privacyCellphones.rights')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.privacyCellphones.contactTitle') }}</h3>
          <ul class="tos-list">
            <li v-for="(item, i) in $tm('profile.tos.privacyCellphones.contact')" :key="i">{{ $rt(item.text) }}</li>
          </ul>
        </section>

        <!-- VI. Privacy Sforum -->
        <section v-if="activeSection === 'privacy-sforum'" class="tos-section">
          <h1 class="tos-section__title">{{ $t('profile.tos.privacySforum.title') }}</h1>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.privacySforum.infoTypesTitle') }}</h3>
          <ul class="tos-list">
            <li v-for="(item, i) in $tm('profile.tos.privacySforum.infoTypes')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.privacySforum.usagePurposeTitle') }}</h3>
          <ul class="tos-list">
            <li v-for="(item, i) in $tm('profile.tos.privacySforum.usagePurpose')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.privacySforum.storageTitle') }}</h3>
          <p class="tos-section__text">{{ $t('profile.tos.privacySforum.storageDesc') }}</p>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.privacySforum.managerTitle') }}</h3>
          <ul class="tos-list">
            <li v-for="(item, i) in $tm('profile.tos.privacySforum.manager')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.privacySforum.rightsObligationsTitle') }}</h3>
          <ul class="tos-list">
            <li v-for="(item, i) in $tm('profile.tos.privacySforum.rightsObligations')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.privacySforum.securityTitle') }}</h3>
          <ul class="tos-list">
            <li v-for="(item, i) in $tm('profile.tos.privacySforum.security')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.privacySforum.complaintTitle') }}</h3>
          <ul class="tos-list">
            <li v-for="(item, i) in $tm('profile.tos.privacySforum.complaint')" :key="i">{{ $rt(item.text) }}</li>
          </ul>
        </section>

        <!-- VII. Sforum -->
        <section v-if="activeSection === 'sforum'" class="tos-section">
          <h1 class="tos-section__title">{{ $t('profile.tos.sforum.title') }}</h1>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.sforum.article1Title') }}</h3>
          <ul class="tos-list">
            <li v-for="(item, i) in $tm('profile.tos.sforum.article1')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.sforum.article2Title') }}</h3>
          <ul class="tos-list">
            <li v-for="(item, i) in $tm('profile.tos.sforum.article2')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.sforum.article3Title') }}</h3>
          <ul class="tos-list">
            <li v-for="(item, i) in $tm('profile.tos.sforum.article3')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.sforum.article4Title') }}</h3>
          <ul class="tos-list">
            <li v-for="(item, i) in $tm('profile.tos.sforum.article4')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.sforum.article5Title') }}</h3>
          <ul class="tos-list">
            <li v-for="(item, i) in $tm('profile.tos.sforum.article5')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.sforum.article6Title') }}</h3>
          <ul class="tos-list">
            <li v-for="(item, i) in $tm('profile.tos.sforum.article6')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.sforum.article7Title') }}</h3>
          <p class="tos-section__text">{{ $t('profile.tos.sforum.article7') }}</p>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.sforum.article8Title') }}</h3>
          <ul class="tos-list">
            <li v-for="(item, i) in $tm('profile.tos.sforum.article8')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.sforum.article9Title') }}</h3>
          <ul class="tos-list">
            <li v-for="(item, i) in $tm('profile.tos.sforum.article9')" :key="i">{{ $rt(item.text) }}</li>
          </ul>

          <h3 class="tos-section__subtitle">{{ $t('profile.tos.sforum.article10Title') }}</h3>
          <p class="tos-section__text">{{ $t('profile.tos.sforum.article10') }}</p>

          <div class="tos-hotline">
            <div class="tos-hotline__item">
              <span class="tos-hotline__label">{{ $t('profile.tos.sforum.hotline.purchaseLabel') }}</span>
              <span class="tos-hotline__value">{{ $t('profile.tos.sforum.hotline.purchaseValue') }}</span>
            </div>
            <div class="tos-hotline__item">
              <span class="tos-hotline__label">{{ $t('profile.tos.sforum.hotline.complaintLabel') }}</span>
              <span class="tos-hotline__value">{{ $t('profile.tos.sforum.hotline.complaintValue') }}</span>
            </div>
            <div class="tos-hotline__item tos-hotline__item--last">
              <span class="tos-hotline__label">{{ $t('profile.tos.sforum.hotline.warrantyLabel') }}</span>
              <span class="tos-hotline__value">{{ $t('profile.tos.sforum.hotline.warrantyValue') }}</span>
            </div>
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

const { t } = useI18n()

useHead({ title: computed(() => t('profile.tos.pageTitle')) })

const activeSection = ref('general')

const sidebarItems = computed(() => [
  { key: 'general', label: t('profile.tos.nav.general') },
  { key: 'transaction', label: t('profile.tos.nav.transaction') },
  { key: 'warranty', label: t('profile.tos.nav.warranty') },
  { key: 'cancellation', label: t('profile.tos.nav.cancellation') },
  { key: 'privacy-cellphones', label: t('profile.tos.nav.privacyCellphones') },
  { key: 'privacy-sforum', label: t('profile.tos.nav.privacySforum') },
  { key: 'sforum', label: t('profile.tos.nav.sforum') },
])
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

.tos-section__subtitle {
  font-size: 15px;
  font-weight: 700;
  color: #18181b;
  margin: 24px 0 12px;
}

.tos-section__subtitle:first-of-type {
  margin-top: 0;
}

.tos-section__text {
  font-size: 14px;
  color: #3f3f46;
  margin: 0;
  line-height: 1.7;
}

/* ── Lists ───────────────────────────────── */
.tos-list {
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tos-list li {
  font-size: 14px;
  color: #3f3f46;
  line-height: 1.7;
}

.tos-list li strong {
  color: #18181b;
}

/* ── Table ───────────────────────────────── */
.tos-table-wrap {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e4e4e7;
  margin-top: 4px;
}

.tos-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.tos-table thead tr {
  background: #f4f4f5;
}

.tos-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 700;
  color: #18181b;
  font-size: 13px;
  border-bottom: 1px solid #e4e4e7;
  white-space: nowrap;
}

.tos-table td {
  padding: 12px 16px;
  color: #3f3f46;
  line-height: 1.5;
  border-bottom: 1px solid #f4f4f5;
  vertical-align: top;
}

.tos-table tbody tr:last-child td {
  border-bottom: none;
}

.tos-table tbody tr:hover td {
  background: #fafafa;
}

.tos-table td strong {
  color: #18181b;
}

/* ── Notice ──────────────────────────────── */
.tos-notice {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 16px;
  background: #f9fafb;
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  margin-top: 20px;
}

.tos-notice svg {
  color: #71717a;
  flex-shrink: 0;
  margin-top: 2px;
}

.tos-notice div {
  font-size: 13px;
  color: #52525b;
  line-height: 1.6;
}

.tos-notice strong {
  color: #18181b;
}

/* ── Hotline ─────────────────────────────── */
.tos-hotline {
  margin-top: 28px;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  overflow: hidden;
}

.tos-hotline__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #f4f4f5;
  gap: 16px;
}

.tos-hotline__item--last {
  border-bottom: none;
}

.tos-hotline__label {
  font-size: 13px;
  font-weight: 600;
  color: #18181b;
  flex-shrink: 0;
}

.tos-hotline__value {
  font-size: 13px;
  color: #52525b;
  text-align: right;
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

  .tos-section__subtitle {
    font-size: 14px;
  }

  .tos-table th,
  .tos-table td {
    padding: 10px 12px;
    font-size: 12px;
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

  .tos-section__subtitle {
    font-size: 14px;
    margin: 20px 0 10px;
  }

  .tos-section__text {
    font-size: 13px;
  }

  .tos-list li {
    font-size: 13px;
  }

  .tos-notice {
    padding: 12px 14px;
  }

  .tos-hotline__item {
    padding: 10px 14px;
  }

  .tos-table th,
  .tos-table td {
    padding: 8px 10px;
    font-size: 12px;
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

  .tos-section__subtitle {
    font-size: 13px;
    margin: 16px 0 10px;
  }

  .tos-section__text {
    font-size: 13px;
    line-height: 1.6;
  }

  .tos-list {
    padding-left: 18px;
    gap: 6px;
  }

  .tos-list li {
    font-size: 13px;
    line-height: 1.6;
  }

  .tos-table-wrap {
    border-radius: 8px;
  }

  .tos-table th,
  .tos-table td {
    padding: 7px 10px;
    font-size: 11px;
  }

  .tos-notice {
    padding: 10px 12px;
    margin-top: 16px;
    gap: 8px;
  }

  .tos-notice div {
    font-size: 12px;
  }

  .tos-hotline {
    border-radius: 10px;
    margin-top: 20px;
  }

  .tos-hotline__item {
    padding: 10px 12px;
    gap: 12px;
  }

  .tos-hotline__label,
  .tos-hotline__value {
    font-size: 12px;
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

  .tos-section__subtitle {
    font-size: 13px;
    margin: 14px 0 8px;
  }

  .tos-section__text {
    font-size: 12px;
  }

  .tos-list {
    padding-left: 16px;
    gap: 5px;
  }

  .tos-list li {
    font-size: 12px;
    line-height: 1.5;
  }

  .tos-table th,
  .tos-table td {
    padding: 6px 8px;
    font-size: 11px;
  }

  .tos-notice {
    padding: 8px 10px;
    margin-top: 14px;
  }

  .tos-notice svg {
    width: 14px;
    height: 14px;
  }

  .tos-hotline__item {
    padding: 8px 10px;
  }

  .tos-hotline__label,
  .tos-hotline__value {
    font-size: 12px;
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
