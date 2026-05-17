<template>
  <div class="shipper-profile">
    <div class="page-header">
      <h1 class="page-title">{{ t('shipper.profile.title') }}</h1>
      <p class="page-sub">{{ t('shipper.profile.subtitle') }}</p>
    </div>

    <div class="profile-grid">
      <AdminCard :title="t('shipper.profile.personalInfo')" :subtitle="t('shipper.profile.personalInfoSub')">
        <div class="profile-card">
          <span class="profile-avatar">{{ initials }}</span>
          <div class="profile-meta">
            <strong>{{ displayName }}</strong>
            <small>{{ user?.email || '—' }}</small>
            <small>{{ user?.phone || t('shipper.profile.noPhone') }}</small>
          </div>
        </div>

        <div class="profile-fields">
          <div class="field">
            <label>{{ t('shipper.profile.role') }}</label>
            <span>{{ t('shipper.profile.roleCourier') }}</span>
          </div>
          <div class="field">
            <label>{{ t('shipper.profile.status') }}</label>
            <span class="status-pill">
              <span class="dot online"></span>
              {{ t('shipper.dashboard.statusOnline') }}
            </span>
          </div>
        </div>
      </AdminCard>

      <AdminCard :title="t('shipper.profile.performance')" :subtitle="t('shipper.profile.performanceSub')">
        <div class="perf-grid">
          <div class="perf-item">
            <span>{{ t('shipper.profile.totalDelivered') }}</span>
            <strong>187</strong>
          </div>
          <div class="perf-item">
            <span>{{ t('shipper.profile.successRate') }}</span>
            <strong>98.4%</strong>
          </div>
          <div class="perf-item">
            <span>{{ t('shipper.profile.avgRating') }}</span>
            <strong>4.9 / 5</strong>
          </div>
          <div class="perf-item">
            <span>{{ t('shipper.profile.activeDays') }}</span>
            <strong>42</strong>
          </div>
        </div>
      </AdminCard>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n, useHead } from '#imports'
import AdminCard from '@/components/Admin/ui/AdminCard.vue'
import { useAuthStore } from '@/stores/authStore'

definePageMeta({ layout: 'shipper' })
const { t } = useI18n()
useHead({ title: () => `${t('shipper.profile.title')} – IrusGear Shipper` })

const auth = useAuthStore()
const user = computed(() => auth.user)

const displayName = computed(() => {
  const u = user.value || {}
  return u.name || u.full_name || u.email || t('shipper.profile.defaultName')
})

const initials = computed(() => {
  const source = displayName.value || 'Shipper'
  return source.split(' ').filter(Boolean).slice(0, 2).map((p) => p.charAt(0).toUpperCase()).join('') || 'S'
})
</script>

<style scoped>
.shipper-profile {
  width: 100%;
  max-width: 1540px;
  margin: 0 auto;
}

.page-header { margin-bottom: 22px; }
.page-title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--admin-text);
}
.page-sub {
  margin: 4px 0 0;
  color: var(--admin-muted);
  font-size: 0.9rem;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--admin-dashboard-gap);
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--admin-border);
  margin-bottom: 18px;
}

.profile-avatar {
  width: 64px;
  height: 64px;
  border-radius: 999px;
  background: linear-gradient(135deg, #050505, #2b2b2b);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
}

.profile-meta { display: grid; gap: 2px; min-width: 0; }
.profile-meta strong { color: var(--admin-text); font-size: 1.05rem; }
.profile-meta small { color: var(--admin-muted); font-size: 0.84rem; }

.profile-fields { display: grid; gap: 12px; }
.field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 0.9rem;
}
.field label { color: var(--admin-muted); }
.field span { color: var(--admin-text); font-weight: 600; }

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--admin-muted);
}

.dot.online { background: var(--admin-success); }

.perf-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.perf-item {
  background: var(--admin-surface-soft);
  border-radius: 8px;
  padding: 14px;
  display: grid;
  gap: 4px;
}

.perf-item span {
  color: var(--admin-muted);
  font-size: 0.82rem;
}

.perf-item strong {
  color: var(--admin-text);
  font-size: 1.2rem;
  font-weight: 700;
}

@media screen and (max-width: 991.98px) {
  .profile-grid { grid-template-columns: 1fr; }
}

@media screen and (max-width: 767.98px) {
  .shipper-profile { padding-bottom: 80px; }
  .perf-grid { grid-template-columns: 1fr; }
}
</style>
