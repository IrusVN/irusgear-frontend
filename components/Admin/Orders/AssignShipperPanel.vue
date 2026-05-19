<template>
  <div v-if="visible" class="admin-card-shell assign-panel">
    <div class="assign-header">
      <div>
        <h3 class="assign-title">{{ t('admin.orders.assign.title') }}</h3>
        <p class="assign-subtitle">{{ t('admin.orders.assign.subtitle') }}</p>
      </div>
      <span v-if="currentShipper" class="assigned-chip">
        <i class="bi bi-person-check"></i>
        {{ currentShipper.name }}
      </span>
    </div>

    <div class="assign-controls">
      <div class="field-group">
        <label class="field-label" for="shipper-search">{{ t('admin.orders.assign.searchLabel') }}</label>
        <div class="search-control">
          <i class="bi bi-search"></i>
          <input id="shipper-search" v-model.trim="search" class="admin-control" type="search"
            :placeholder="t('admin.orders.assign.searchPlaceholder')" />
        </div>
      </div>

      <div class="field-group">
        <label class="field-label" for="shipper-select">{{ t('admin.orders.assign.shipperLabel') }}</label>
        <select id="shipper-select" v-model="selectedShipperId" class="admin-control">
          <option value="">{{ t('admin.orders.assign.selectPlaceholder') }}</option>
          <option v-for="shipper in shippers" :key="shipper.id" :value="shipper.id">
            {{ shipper.name }} - {{ shipper.phone_number || shipper.email || t('admin.orders.notAvailable') }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="selectedShipper" class="shipper-preview">
      <div>
        <strong>{{ selectedShipper.name }}</strong>
        <small>{{ t('admin.orders.assign.activeCount', { count: selectedShipper.active_shipments_count || 0 }) }}</small>
      </div>
      <span>{{ zoneLabel(selectedShipper.pickup_zones) }}</span>
    </div>

    <div class="assign-actions">
      <button class="admin-secondary-button" type="button" :disabled="isLoading" @click="fetchShippers">
        <i class="bi bi-arrow-clockwise"></i>
        {{ t('admin.orders.assign.refresh') }}
      </button>
      <button class="admin-primary-button" type="button" :disabled="!selectedShipperId || isSubmitting"
        @click="submit">
        <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <i v-else class="bi bi-truck"></i>
        {{ currentShipper ? t('admin.orders.assign.reassign') : t('admin.orders.assign.assign') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from '#imports'
import { toast } from 'vue-sonner'
import { useAdminStore } from '@/stores/adminStore'

const props = defineProps({
  order: { type: Object, required: true },
})

const emit = defineEmits(['updated'])

const { t } = useI18n()
const admin = useAdminStore()

const search = ref('')
const shippers = ref([])
const selectedShipperId = ref('')
const isLoading = ref(false)
const isSubmitting = ref(false)
let searchTimer = null

const visible = computed(() => props.order?.status === 'ready_to_ship')
const currentShipper = computed(() => props.order?.shipment?.shipper || null)
const selectedShipper = computed(() =>
  shippers.value.find((shipper) => String(shipper.id) === String(selectedShipperId.value)) || null,
)

const fetchShippers = async () => {
  if (!visible.value) return

  isLoading.value = true
  try {
    const response = await admin.fetchOne('shippers/active', {
      search: search.value,
      per_page: 50,
    })
    shippers.value = response?.data || []
  } finally {
    isLoading.value = false
  }
}

const submit = async () => {
  if (!selectedShipperId.value || isSubmitting.value) return

  isSubmitting.value = true
  try {
    const action = currentShipper.value ? admin.reassignOrder : admin.assignOrder
    const response = await action(props.order.id, Number(selectedShipperId.value))
    toast.success(currentShipper.value ? t('admin.orders.assign.reassigned') : t('admin.orders.assign.assigned'))
    emit('updated', response?.data)
  } catch (e) {
    toast.error(t('admin.orders.assign.failed', { msg: e.message }))
  } finally {
    isSubmitting.value = false
  }
}

const zoneLabel = (zones = []) => {
  if (!zones.length) {
    return t('admin.orders.assign.noZones')
  }

  return zones.join(', ')
}

watch(currentShipper, (shipper) => {
  selectedShipperId.value = shipper?.id ? String(shipper.id) : ''
}, { immediate: true })

watch(search, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(fetchShippers, 250)
})

onMounted(fetchShippers)
onBeforeUnmount(() => clearTimeout(searchTimer))
</script>

<style scoped>
.assign-panel {
  padding: 20px;
}

.assign-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.assign-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--admin-text);
}

.assign-subtitle {
  margin: 4px 0 0;
  color: var(--admin-muted);
  font-size: 0.84rem;
}

.assigned-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  background: var(--admin-primary-soft);
  color: var(--admin-text);
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
}

.assign-controls {
  display: grid;
  gap: 12px;
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

.search-control {
  position: relative;
}

.search-control i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--admin-muted);
}

.search-control .admin-control {
  padding-left: 36px;
}

.shipper-preview {
  margin-top: 12px;
  padding: 12px;
  border: 1px solid var(--admin-border);
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  color: var(--admin-text);
}

.shipper-preview strong,
.shipper-preview small {
  display: block;
}

.shipper-preview small,
.shipper-preview span {
  color: var(--admin-muted);
  font-size: 0.8rem;
}

.assign-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 14px;
}

.assign-actions button {
  justify-content: center;
}

@media screen and (max-width: 575.98px) {
  .assign-header,
  .shipper-preview {
    flex-direction: column;
  }

  .assign-actions {
    grid-template-columns: 1fr;
  }
}
</style>
