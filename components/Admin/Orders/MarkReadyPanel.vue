<template>
  <div v-if="visible" class="admin-card-shell mark-ready-panel">
    <div class="mark-ready-header">
      <div>
        <h3 class="card-title">{{ t('admin.orders.markReady.title') }}</h3>
        <p class="mark-ready-subtitle">{{ t('admin.orders.markReady.subtitle') }}</p>
      </div>
      <i class="bi bi-box-seam mark-ready-icon" aria-hidden="true"></i>
    </div>

    <div class="mark-ready-checklist" aria-label="mark-ready-checklist">
      <span><i class="bi bi-check2-circle"></i>{{ t('admin.orders.markReady.checkPacked') }}</span>
      <span><i class="bi bi-check2-circle"></i>{{ t('admin.orders.markReady.checkLabel') }}</span>
      <span><i class="bi bi-check2-circle"></i>{{ t('admin.orders.markReady.checkPickup') }}</span>
    </div>

    <div class="mark-ready-fields">
      <div class="field-group">
        <label class="field-label" for="ship-partner">{{ t('admin.orders.markReady.partnerLabel') }}</label>
        <select id="ship-partner" v-model="partner" class="admin-control">
          <option v-for="p in PARTNER_OPTIONS" :key="p" :value="p">{{ p }}</option>
        </select>
      </div>

      <div class="field-group">
        <label class="field-label" for="ship-tracking">{{ t('admin.orders.markReady.trackingLabel') }}</label>
        <input
          id="ship-tracking"
          v-model.trim="trackingNumber"
          type="text"
          class="admin-control"
          maxlength="100"
          :placeholder="t('admin.orders.markReady.trackingPlaceholder')"
        />
      </div>

      <div class="field-group">
        <label class="field-label" for="ship-eta">{{ t('admin.orders.markReady.etaLabel') }}</label>
        <input id="ship-eta" v-model="estimatedDeliveryDate" type="date" class="admin-control" :min="todayStr" />
      </div>

      <div class="field-group">
        <label class="field-label" for="ship-note">{{ t('admin.orders.markReady.noteLabel') }}</label>
        <textarea
          id="ship-note"
          v-model.trim="note"
          class="admin-control mark-ready-note"
          maxlength="500"
          rows="2"
          :placeholder="t('admin.orders.markReady.notePlaceholder')"
        ></textarea>
      </div>
    </div>

    <div class="mark-ready-actions">
      <button class="admin-primary-button" type="button" :disabled="isSubmitting" @click="submit">
        <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <i v-else class="bi bi-truck"></i>
        {{ t('admin.orders.markReady.submit') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from '#imports'
import { toast } from 'vue-sonner'
import { useAdminStore } from '@/stores/adminStore'

const PARTNER_OPTIONS = ['GHTK', 'GHN', 'VNPost', 'GiaoHangNhanh', 'GiaoHangTietKiem']

const props = defineProps({
  order: { type: Object, required: true },
})

const emit = defineEmits(['updated'])

const { t } = useI18n()
const admin = useAdminStore()

const partner = ref(PARTNER_OPTIONS[0])
const trackingNumber = ref('')
const estimatedDeliveryDate = ref('')
const note = ref('')
const isSubmitting = ref(false)

const visible = computed(() => props.order?.status === 'processing')

const todayStr = computed(() => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
})

const submit = async () => {
  if (isSubmitting.value) return

  isSubmitting.value = true
  try {
    const payload = { partner: partner.value }
    if (trackingNumber.value) payload.tracking_number = trackingNumber.value
    if (estimatedDeliveryDate.value) payload.estimated_delivery_date = estimatedDeliveryDate.value
    if (note.value) payload.note = note.value

    const res = await admin.markOrderReadyToShip(props.order.id, payload)
    toast.success(t('admin.orders.markReady.success'))
    emit('updated', res?.data)
  } catch (e) {
    toast.error(t('admin.orders.markReady.failed', { msg: e.message }))
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.mark-ready-panel {
  padding: 20px;
}

.mark-ready-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
}

.card-title {
  margin: 0 0 4px;
  font-size: 1rem;
  font-weight: 700;
  color: var(--admin-text);
}

.mark-ready-subtitle {
  margin: 0;
  color: var(--admin-muted);
  font-size: 0.84rem;
  line-height: 1.45;
}

.mark-ready-icon {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: rgba(56, 132, 255, 0.12);
  color: var(--admin-primary, #3884ff);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  flex: 0 0 auto;
}

.mark-ready-checklist {
  display: grid;
  gap: 8px;
  margin-bottom: 16px;
}

.mark-ready-checklist span {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--admin-text);
  font-size: 0.86rem;
}

.mark-ready-checklist i {
  color: var(--admin-success);
}

.mark-ready-fields {
  display: grid;
  gap: 12px;
  margin-bottom: 14px;
}

.field-group {
  display: grid;
  gap: 6px;
}

.field-label {
  color: var(--admin-muted);
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: uppercase;
}

.mark-ready-note {
  resize: vertical;
  min-height: 60px;
}

.mark-ready-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.mark-ready-actions button {
  flex: 1;
  justify-content: center;
}

@media screen and (max-width: 767.98px) {
  .mark-ready-panel {
    padding: 16px;
  }

  .mark-ready-actions button {
    width: 100%;
    min-height: 44px;
  }
}
</style>
