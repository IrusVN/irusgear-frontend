<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="open" class="modal-backdrop" @click.self="handleClose">
        <div class="modal-card admin-card-shell" role="dialog" :aria-label="t('shipper.orderDetail.title')">
          <header class="modal-header">
            <div>
              <strong class="modal-title">{{ t('shipper.orderDetail.title') }}</strong>
              <span class="order-code">{{ order?.orderCode }}</span>
            </div>
            <button class="icon-btn" type="button" :aria-label="t('shipper.orderDetail.close')"
              @click="handleClose">
              <i class="bi bi-x-lg"></i>
            </button>
          </header>

          <div class="modal-body">
            <!-- Status badge + COD note -->
            <section v-if="order?.status" class="section status-section">
              <span class="status-pill" :class="`is-${statusVariant(order.status)}`">
                <i class="bi bi-truck"></i>
                {{ t(`shipper.status.${order.status}`) }}
              </span>
              <span v-if="isCodOrder" class="cod-pill">
                <i class="bi bi-cash-coin"></i>
                {{ t('shipper.orderDetail.codDue', { amount: formatMoney(order?.codAmount || order?.total) }) }}
              </span>
            </section>

            <!-- Customer -->
            <section class="section">
              <span class="section-label">{{ t('shipper.orderDetail.customer') }}</span>
              <div class="customer-block">
                <span class="customer-avatar">{{ initials(order?.customer?.name) }}</span>
                <div class="customer-info">
                  <strong>{{ order?.customer?.name }}</strong>
                  <small><i class="bi bi-telephone"></i> {{ order?.customer?.phone }}</small>
                  <small><i class="bi bi-geo-alt"></i> {{ order?.address }}</small>
                </div>
              </div>
            </section>

            <!-- Items -->
            <section class="section">
              <span class="section-label">{{ t('shipper.orderDetail.items') }}</span>
              <div class="items-list">
                <div v-for="item in order?.items || []" :key="item.id" class="item-row">
                  <img :src="item.image" :alt="item.name" class="item-img" loading="lazy" />
                  <div class="item-info">
                    <strong>{{ item.name }}</strong>
                    <small>{{ t('shipper.orderDetail.quantity', { qty: item.quantity }) }}</small>
                  </div>
                  <strong class="item-price">{{ formatMoney(item.price * item.quantity) }}</strong>
                </div>
              </div>
            </section>

            <!-- Payment summary -->
            <section class="section payment-summary">
              <div class="summary-row">
                <span>{{ t('shipper.orderDetail.subtotal') }}</span>
                <strong>{{ formatMoney(subtotal) }}</strong>
              </div>
              <div class="summary-row">
                <span>{{ t('shipper.orderDetail.shippingFee') }}</span>
                <strong>{{ formatMoney(order?.shippingFee || 0) }}</strong>
              </div>
              <div class="summary-row total">
                <span>{{ t('shipper.orderDetail.total') }}</span>
                <strong>{{ formatMoney(totalAmount) }}</strong>
              </div>
              <div class="summary-row method">
                <span>{{ t('shipper.orderDetail.paymentMethod') }}</span>
                <strong>
                  <i class="bi" :class="paymentIcon"></i>
                  {{ paymentLabel }}
                </strong>
              </div>
            </section>

            <!-- Pickup / Start delivery quick actions (visible only when applicable) -->
            <section v-if="canPickup || canStartDelivery" class="section quick-actions">
              <button v-if="canPickup" type="button" class="admin-primary-button big-btn"
                :disabled="submitting" @click="onPickup">
                <i class="bi bi-box-seam"></i>
                {{ submitting ? t('shipper.orderDetail.submitting') : t('shipper.actions.pickup') }}
              </button>
              <button v-if="canStartDelivery" type="button" class="admin-primary-button big-btn"
                :disabled="submitting" @click="onStartDelivery">
                <i class="bi bi-truck"></i>
                {{ submitting ? t('shipper.orderDetail.submitting') : t('shipper.actions.startDelivery') }}
              </button>
            </section>

            <!-- Capture flow (only when delivering) -->
            <template v-if="canComplete">
              <section class="section">
                <span class="section-label">
                  {{ t('shipper.orderDetail.proofPhoto') }}
                  <span class="hint">{{ t('shipper.orderDetail.proofHint', { min: 1, max: 5 }) }}</span>
                </span>

                <div v-if="photos.length === 0" class="upload-empty">
                  <i class="bi bi-camera"></i>
                  <p>{{ t('shipper.orderDetail.proofRequired') }}</p>
                </div>

                <div v-else class="photo-grid">
                  <div v-for="(p, idx) in photos" :key="p.id" class="photo-tile">
                    <img :src="p.previewUrl" :alt="`POD ${idx + 1}`" />
                    <button type="button" class="remove-photo"
                      :aria-label="t('shipper.orderDetail.removePhoto')"
                      @click="removePhoto(idx)">
                      <i class="bi bi-x"></i>
                    </button>
                  </div>
                </div>

                <input ref="cameraInputRef" type="file" accept="image/*" capture="environment" hidden
                  @change="onFilePicked" />
                <input ref="galleryInputRef" type="file" accept="image/*" multiple hidden
                  @change="onFilePicked" />

                <div v-if="photos.length < 5" class="upload-actions">
                  <button type="button" class="upload-trigger" @click="openCamera" :disabled="submitting">
                    <i class="bi bi-camera-fill"></i>
                    {{ t('shipper.orderDetail.openCamera') }}
                  </button>
                  <button type="button" class="upload-trigger" @click="openGallery" :disabled="submitting">
                    <i class="bi bi-images"></i>
                    {{ t('shipper.orderDetail.fromGallery') }}
                  </button>
                </div>
              </section>

              <!-- Recipient + COD form -->
              <section class="section form-section">
                <label class="field">
                  <span class="field-label">{{ t('shipper.orderDetail.recipientName') }} *</span>
                  <input v-model="recipientName" type="text" maxlength="100" required
                    class="admin-control" :placeholder="t('shipper.orderDetail.recipientPlaceholder')" />
                </label>

                <label v-if="isCodOrder" class="field">
                  <span class="field-label">{{ t('shipper.orderDetail.codCollected') }} *</span>
                  <input v-model.number="codCollectedAmount" type="number" min="0" inputmode="numeric"
                    class="admin-control" />
                  <small class="field-help">{{ t('shipper.orderDetail.codHelp', { amount: formatMoney(order?.codAmount || order?.total) }) }}</small>
                </label>
              </section>

              <!-- Action toggle: Complete / Fail -->
              <section class="section action-toggle">
                <button type="button" class="toggle-btn" :class="{ active: mode === 'complete' }"
                  :disabled="submitting" @click="mode = 'complete'">
                  <i class="bi bi-check2-circle"></i> {{ t('shipper.orderDetail.tabComplete') }}
                </button>
                <button type="button" class="toggle-btn fail" :class="{ active: mode === 'fail' }"
                  :disabled="submitting" @click="mode = 'fail'">
                  <i class="bi bi-exclamation-triangle"></i> {{ t('shipper.orderDetail.tabFail') }}
                </button>
              </section>

              <!-- Fail-specific reason picker -->
              <section v-if="mode === 'fail'" class="section form-section">
                <label class="field">
                  <span class="field-label">{{ t('shipper.orderDetail.failReason') }} *</span>
                  <select v-model="failReason" class="admin-control">
                    <option v-for="code in failReasons" :key="code" :value="code">
                      {{ t(`shipper.orderDetail.failReasons.${code}`) }}
                    </option>
                  </select>
                </label>
                <label class="field">
                  <span class="field-label">{{ t('shipper.orderDetail.failNote') }}</span>
                  <textarea v-model="failNote" maxlength="500" class="admin-control" rows="3"
                    :placeholder="t('shipper.orderDetail.failNotePlaceholder')"></textarea>
                </label>
              </section>
            </template>

            <!-- Inline error from server -->
            <div v-if="serverError" class="server-error">
              <i class="bi bi-exclamation-circle"></i>
              <span>{{ serverError }}</span>
              <button v-if="canRetrySubmit" type="button" class="retry-btn" @click="retrySubmit">
                <i class="bi bi-arrow-clockwise"></i>
                {{ t('shipper.orderDetail.retry') }}
              </button>
            </div>
          </div>

          <footer class="modal-footer">
            <button type="button" class="admin-secondary-button" :disabled="submitting" @click="handleClose">
              {{ t('shipper.orderDetail.cancel') }}
            </button>
            <button v-if="canComplete" type="button" class="admin-primary-button complete-btn"
              :disabled="!canSubmit || submitting" @click="onSubmit">
              <i class="bi" :class="mode === 'complete' ? 'bi-check2-circle' : 'bi-exclamation-triangle'"></i>
              {{ submitButtonLabel }}
            </button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from '#imports'
import { toast } from 'vue-sonner'
import { useShipperStore } from '@/stores/shipperStore'
import { useIdempotencyKey } from '@/composables/useIdempotency'

const { t } = useI18n()
const shipper = useShipperStore()

const props = defineProps({
  open: { type: Boolean, default: false },
  order: { type: Object, default: null },
})

const emit = defineEmits(['close', 'complete', 'failed', 'pickup', 'started'])

const failReasons = ['not_home', 'refused', 'wrong_address', 'damaged', 'other']

const mode = ref('complete')
const photos = ref([])
const recipientName = ref('')
const codCollectedAmount = ref(0)
const failReason = ref('not_home')
const failNote = ref('')
const submitting = ref(false)
const serverError = ref(null)
const canRetrySubmit = ref(false)

const cameraInputRef = ref(null)
const galleryInputRef = ref(null)

const completeIdemKey = useIdempotencyKey()
const failIdemKey = useIdempotencyKey()
const pickupIdemKey = useIdempotencyKey()
const startIdemKey = useIdempotencyKey()

let lastSubmitFn = null

watch(
  () => props.open,
  (val) => {
    if (val) initFromOrder()
    else cleanupBlobs()
  },
)

watch(
  () => props.order?.id,
  (id, oldId) => {
    if (id && id !== oldId && props.open) {
      initFromOrder()
    }
  },
)

watch(mode, () => {
  serverError.value = null
})

function initFromOrder() {
  mode.value = 'complete'
  cleanupBlobs()
  photos.value = []
  recipientName.value = props.order?.customer?.name || ''
  codCollectedAmount.value = isCodOrder.value
    ? Number(props.order?.codAmount || props.order?.total || 0)
    : 0
  failReason.value = 'not_home'
  failNote.value = ''
  serverError.value = null
  canRetrySubmit.value = false
  completeIdemKey.reset()
  failIdemKey.reset()
  pickupIdemKey.reset()
  startIdemKey.reset()
}

function cleanupBlobs() {
  photos.value.forEach((p) => {
    if (p.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(p.previewUrl)
  })
}

const isCodOrder = computed(() => props.order?.paymentMethod === 'cod')

const canPickup = computed(() => props.order?.status === 'pending_pickup')
const canStartDelivery = computed(() => props.order?.status === 'picked_up')
const canComplete = computed(() => props.order?.status === 'delivering')

const subtotal = computed(() => {
  const items = props.order?.items || []
  return items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 0), 0)
})

const totalAmount = computed(() => subtotal.value + (props.order?.shippingFee || 0))

const paymentLabel = computed(() => {
  const m = props.order?.paymentMethod
  return t(`shipper.orderDetail.paymentMethods.${m || 'cod'}`)
})

const paymentIcon = computed(() => {
  const m = props.order?.paymentMethod
  return ({
    cod: 'bi-cash-coin',
    vnpay: 'bi-credit-card',
    momo: 'bi-wallet2',
    bank: 'bi-bank',
  }[m] || 'bi-cash-coin')
})

const canSubmit = computed(() => {
  if (mode.value === 'complete') {
    if (photos.value.length < 1) return false
    if (!recipientName.value.trim()) return false
    if (isCodOrder.value && Number(codCollectedAmount.value) !== Number(props.order?.codAmount || props.order?.total || 0)) {
      return false
    }
    return true
  }
  if (mode.value === 'fail') {
    if (photos.value.length < 1) return false
    if (!failReason.value) return false
    return true
  }
  return false
})

const submitButtonLabel = computed(() => {
  if (submitting.value) return t('shipper.orderDetail.submitting')
  return mode.value === 'complete'
    ? t('shipper.orderDetail.complete')
    : t('shipper.orderDetail.fail')
})

const formatMoney = (n) => `${new Intl.NumberFormat('vi-VN').format(n || 0)}đ`

const initials = (name) =>
  (name || '?').split(' ').filter(Boolean).slice(-2).map((p) => p.charAt(0).toUpperCase()).join('')

const statusVariant = (s) => ({
  delivering: 'info',
  pending_pickup: 'warning',
  picked_up: 'info',
  failed: 'danger',
  delivered: 'success',
  cancelled: 'danger',
}[s] || 'neutral')

const openCamera = () => cameraInputRef.value?.click()
const openGallery = () => galleryInputRef.value?.click()

function onFilePicked(e) {
  const files = Array.from(e.target?.files || [])
  for (const file of files) {
    if (photos.value.length >= 5) break
    photos.value.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      file,
      previewUrl: URL.createObjectURL(file),
    })
  }
  // Reset input so picking the same file twice still triggers change.
  e.target.value = ''
}

function removePhoto(idx) {
  const [removed] = photos.value.splice(idx, 1)
  if (removed?.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(removed.previewUrl)
}

const handleClose = () => {
  if (submitting.value) return
  emit('close')
}

async function onPickup() {
  await runMutation(
    () => shipper.pickup(props.order.id, { idempotencyKey: pickupIdemKey.ensure() }),
    {
      success: () => {
        pickupIdemKey.reset()
        toast.success(t('shipper.orderDetail.pickedUpToast', { code: props.order?.orderCode || '' }))
        emit('pickup', { orderId: props.order?.id })
      },
    },
  )
}

async function onStartDelivery() {
  await runMutation(
    () => shipper.startDelivery(props.order.id, { idempotencyKey: startIdemKey.ensure() }),
    {
      success: () => {
        startIdemKey.reset()
        toast.success(t('shipper.orderDetail.startedToast', { code: props.order?.orderCode || '' }))
        emit('started', { orderId: props.order?.id })
      },
    },
  )
}

async function onSubmit() {
  if (!canSubmit.value) return

  if (mode.value === 'complete') {
    await onComplete()
  } else {
    await onFail()
  }
}

async function onComplete() {
  const formData = buildBaseFormData()
  formData.append('recipient_name', recipientName.value.trim())
  formData.append('cod_collected_amount', String(isCodOrder.value ? Number(codCollectedAmount.value) : 0))

  await runMutation(
    () =>
      shipper.complete(props.order.id, formData, {
        idempotencyKey: completeIdemKey.ensure(),
      }),
    {
      success: () => {
        completeIdemKey.reset()
        toast.success(t('shipper.orderDetail.completedToast', {
          code: props.order?.orderCode || '',
        }))
        emit('complete', { orderId: props.order?.id })
      },
    },
  )
}

async function onFail() {
  const formData = buildBaseFormData()
  formData.append('reason_code', failReason.value)
  if (failNote.value.trim()) formData.append('note', failNote.value.trim())
  if (recipientName.value.trim()) formData.append('recipient_name', recipientName.value.trim())

  await runMutation(
    () =>
      shipper.fail(props.order.id, formData, {
        idempotencyKey: failIdemKey.ensure(),
      }),
    {
      success: () => {
        failIdemKey.reset()
        toast.success(t('shipper.orderDetail.failedToast', { code: props.order?.orderCode || '' }))
        emit('failed', { orderId: props.order?.id, reason: failReason.value })
      },
    },
  )
}

function buildBaseFormData() {
  const fd = new FormData()
  photos.value.forEach((p) => fd.append('photos[]', p.file))
  return fd
}

async function runMutation(fn, { success }) {
  submitting.value = true
  serverError.value = null
  canRetrySubmit.value = false
  lastSubmitFn = fn

  try {
    await fn()
    nextTick(() => success?.())
  } catch (e) {
    const code = e?.code
    serverError.value = formatErrorMessage(e)
    canRetrySubmit.value = isRetryableError(e)

    // Surface validation specifics if the server returned a `errors.photos.0` etc map
    if (e?.errors) {
      const firstField = Object.keys(e.errors)[0]
      if (firstField) {
        const firstMessage = Array.isArray(e.errors[firstField])
          ? e.errors[firstField][0]
          : String(e.errors[firstField])
        serverError.value = `${firstField}: ${firstMessage}`
      }
    }

    if (code !== 'IDEMPOTENCY_KEY_REQUIRED' && code !== 'IDEMPOTENCY_KEY_INVALID') {
      toast.error(serverError.value)
    }
  } finally {
    submitting.value = false
  }
}

function retrySubmit() {
  if (!lastSubmitFn) return
  runMutation(lastSubmitFn, { success: () => emit('retry-success', { orderId: props.order?.id }) })
}

function formatErrorMessage(e) {
  if (!e) return t('shipper.orderDetail.genericError')
  if (e.code === 'COD_AMOUNT_MISMATCH') return t('shipper.orderDetail.codMismatch')
  if (e.code === 'COD_AMOUNT_NOT_APPLICABLE') return t('shipper.orderDetail.codNotApplicable')
  if (e.code === 'POD_PHOTO_REQUIRED') return t('shipper.orderDetail.proofRequired')
  if (e.code === 'INVALID_STATE_TRANSITION') return t('shipper.orderDetail.invalidStateTransition')
  if (e.code === 'FORBIDDEN') return t('shipper.orderDetail.forbidden')
  return e.message || t('shipper.orderDetail.genericError')
}

function isRetryableError(e) {
  const status = e?.status
  return status === undefined || (status >= 500 && status < 600)
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1100;
  background: rgba(15, 15, 20, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-card {
  width: 100%;
  max-width: 600px;
  max-height: calc(100vh - 40px);
  background: var(--admin-surface);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}

.modal-header {
  flex: 0 0 auto;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border-bottom: 1px solid var(--admin-border);
}

.modal-title {
  display: block;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--admin-text);
}

.order-code {
  margin-left: 6px;
  color: var(--admin-muted);
  font-size: 0.86rem;
  font-weight: 600;
}

.icon-btn {
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--admin-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background: var(--admin-surface-soft);
  color: var(--admin-text);
}

.modal-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px 18px 12px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.section {
  display: grid;
  gap: 8px;
}

.section-label {
  color: var(--admin-muted);
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.section-label .hint {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0;
  color: var(--admin-muted);
}

.status-section {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding-bottom: 4px;
}

.status-pill,
.cod-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.84rem;
  font-weight: 600;
  background: var(--admin-surface-soft);
  color: var(--admin-text);
}

.status-pill.is-warning { background: #fff4e0; color: #b45309; }
.status-pill.is-info { background: #e0ecff; color: #1e3a8a; }
.status-pill.is-success { background: #d8f5d0; color: #166534; }
.status-pill.is-danger { background: #ffe2e2; color: #991b1b; }

.cod-pill { background: #fff4d6; color: #92400e; }

.customer-block {
  display: flex;
  gap: 12px;
  padding: 12px 14px;
  background: var(--admin-surface-soft);
  border-radius: 10px;
}

.customer-avatar {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: linear-gradient(135deg, #050505, #2b2b2b);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.92rem;
  flex: 0 0 auto;
}

.customer-info { display: grid; gap: 3px; min-width: 0; }
.customer-info strong { color: var(--admin-text); font-size: 0.96rem; }
.customer-info small { color: var(--admin-muted); font-size: 0.82rem; display: inline-flex; align-items: center; gap: 6px; }
.customer-info small i { width: 14px; }

.items-list { display: grid; gap: 10px; }

.item-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid var(--admin-border);
}

.item-img {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
  background: var(--admin-surface-soft);
  flex: 0 0 auto;
}

.item-info { flex: 1; min-width: 0; display: grid; gap: 2px; }
.item-info strong {
  color: var(--admin-text);
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-info small { color: var(--admin-muted); font-size: 0.8rem; }

.item-price { color: var(--admin-text); font-weight: 700; white-space: nowrap; }

.payment-summary {
  background: var(--admin-surface-soft);
  border-radius: 10px;
  padding: 14px;
  gap: 8px;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.88rem;
  color: var(--admin-muted);
}

.summary-row strong { color: var(--admin-text); font-weight: 600; }

.summary-row.total {
  padding-top: 10px;
  border-top: 1px dashed var(--admin-border);
  font-size: 0.96rem;
}

.summary-row.total strong { color: var(--admin-success); font-size: 1.05rem; font-weight: 700; }

.summary-row.method strong {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.upload-empty {
  border: 1.5px dashed var(--admin-border);
  border-radius: 10px;
  padding: 22px 16px;
  text-align: center;
  color: var(--admin-muted);
}

.upload-empty i { font-size: 1.6rem; opacity: 0.6; display: block; }
.upload-empty p { margin: 6px 0 0; font-size: 0.86rem; }

.photo-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
}

.photo-tile {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 10px;
  overflow: hidden;
  background: var(--admin-surface-soft);
  border: 1px solid var(--admin-border);
}

.photo-tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.remove-photo {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 26px;
  height: 26px;
  border: 0;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.upload-actions { display: flex; gap: 10px; }

.upload-trigger {
  flex: 1;
  height: 44px;
  border-radius: 10px;
  border: 1.5px solid var(--admin-border);
  background: var(--admin-surface);
  color: var(--admin-text);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.92rem;
  transition: background 0.18s ease, border-color 0.18s ease;
}

.upload-trigger:hover:not(:disabled) {
  background: var(--admin-surface-soft);
  border-color: var(--admin-text);
}

.upload-trigger:disabled { opacity: 0.5; cursor: not-allowed; }

.quick-actions {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.big-btn {
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.96rem;
  font-weight: 600;
}

.form-section { gap: 12px; }

.field { display: grid; gap: 6px; }

.field-label {
  color: var(--admin-text);
  font-size: 0.86rem;
  font-weight: 600;
}

.field-help {
  color: var(--admin-muted);
  font-size: 0.78rem;
}

.action-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.toggle-btn {
  height: 44px;
  border-radius: 10px;
  border: 1.5px solid var(--admin-border);
  background: var(--admin-surface);
  color: var(--admin-text);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.9rem;
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}

.toggle-btn:hover:not(:disabled) {
  background: var(--admin-surface-soft);
  border-color: var(--admin-text);
}

.toggle-btn.active {
  background: var(--admin-text);
  color: var(--admin-surface);
  border-color: var(--admin-text);
}

.toggle-btn.fail.active {
  background: #c0392b;
  border-color: #c0392b;
  color: #fff;
}

.toggle-btn:disabled { opacity: 0.45; cursor: not-allowed; }

.server-error {
  border: 1px solid #f5b8b8;
  background: #fff5f5;
  color: #c0392b;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 0.86rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.server-error i { font-size: 1rem; }
.server-error span { flex: 1; }

.retry-btn {
  border: 0;
  background: transparent;
  color: #c0392b;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.modal-footer {
  flex: 0 0 auto;
  padding: 14px 18px;
  display: flex;
  gap: 10px;
  border-top: 1px solid var(--admin-border);
  background: var(--admin-surface);
}

.modal-footer button { flex: 1; }

.complete-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.complete-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  background: var(--admin-text);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-active .modal-card,
.modal-fade-leave-active .modal-card {
  transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from .modal-card,
.modal-fade-leave-to .modal-card { transform: translateY(20px) scale(0.98); }

@media screen and (max-width: 575.98px) {
  .modal-backdrop {
    padding: 0;
    align-items: flex-end;
  }
  .modal-card {
    max-width: 100%;
    height: 95vh;
    max-height: 95vh;
    border-radius: 18px 18px 0 0;
  }
  .modal-header { padding: 14px 16px; }
  .modal-body { padding: 14px 16px 12px; gap: 14px; }
  .modal-footer { padding: 12px 14px env(safe-area-inset-bottom, 14px); }
  .upload-actions { flex-direction: column; }
  .upload-trigger { width: 100%; }
  .photo-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .item-row { padding: 8px; }
  .item-img { width: 44px; height: 44px; }
  .customer-block { padding: 10px 12px; }
  .customer-avatar { width: 40px; height: 40px; }
  .modal-title { font-size: 0.98rem; }
}
</style>
