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
                  <img :src="item.image" :alt="item.name" class="item-img" />
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

            <!-- Photo upload -->
            <section class="section">
              <span class="section-label">{{ t('shipper.orderDetail.proofPhoto') }}</span>

              <div v-if="!photoUrl" class="upload-empty">
                <i class="bi bi-camera"></i>
                <p>{{ t('shipper.orderDetail.proofRequired') }}</p>
              </div>
              <div v-else class="upload-preview">
                <img :src="photoUrl" :alt="t('shipper.orderDetail.proofPhoto')" />
                <button type="button" class="remove-photo" :aria-label="t('shipper.orderDetail.removePhoto')"
                  @click="clearPhoto">
                  <i class="bi bi-x"></i>
                </button>
              </div>

              <!-- Hidden inputs để mở camera vs gallery — accept image/* + capture cho camera (mobile) -->
              <input ref="cameraInputRef" type="file" accept="image/*" capture="environment" hidden
                @change="onFilePicked" />
              <input ref="galleryInputRef" type="file" accept="image/*" hidden
                @change="onFilePicked" />

              <div class="upload-actions">
                <button type="button" class="upload-trigger" @click="openCamera">
                  <i class="bi bi-camera-fill"></i>
                  {{ photoUrl ? t('shipper.orderDetail.retakeCamera') : t('shipper.orderDetail.openCamera') }}
                </button>
                <button type="button" class="upload-trigger" @click="openGallery">
                  <i class="bi bi-images"></i>
                  {{ photoUrl ? t('shipper.orderDetail.replaceFromGallery') : t('shipper.orderDetail.fromGallery') }}
                </button>
              </div>
            </section>
          </div>

          <footer class="modal-footer">
            <button type="button" class="admin-secondary-button" @click="handleClose">
              {{ t('shipper.orderDetail.cancel') }}
            </button>
            <button type="button" class="admin-primary-button complete-btn" :disabled="!photoUrl"
              @click="handleComplete">
              <i class="bi bi-check2-circle"></i>
              {{ t('shipper.orderDetail.complete') }}
            </button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from '#imports'

const { t } = useI18n()

const props = defineProps({
  open: { type: Boolean, default: false },
  order: { type: Object, default: null },
})

const emit = defineEmits(['close', 'complete'])

const photoUrl = ref('')
const photoFile = ref(null)

const cameraInputRef = ref(null)
const galleryInputRef = ref(null)

/* reset state khi đóng/mở modal */
watch(
  () => props.open,
  (val) => {
    if (!val) {
      photoUrl.value = ''
      photoFile.value = null
    }
  },
)

const formatMoney = (n) => `${new Intl.NumberFormat('vi-VN').format(n || 0)}đ`

const initials = (name) =>
  (name || '?').split(' ').filter(Boolean).slice(-2).map((p) => p.charAt(0).toUpperCase()).join('')

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
  return (
    {
      cod: 'bi-cash-coin',
      vnpay: 'bi-credit-card',
      momo: 'bi-wallet2',
      bank: 'bi-bank',
    }[m] || 'bi-cash-coin'
  )
})

const openCamera = () => {
  cameraInputRef.value?.click()
}

const openGallery = () => {
  galleryInputRef.value?.click()
}

const onFilePicked = (e) => {
  const file = e.target?.files?.[0]
  if (!file) return
  photoFile.value = file
  // Tạo URL preview tạm. URL.createObjectURL hoạt động với mọi blob
  // và được tự huỷ khi photoUrl đổi (chấp nhận leak nhẹ trong demo).
  if (photoUrl.value && photoUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(photoUrl.value)
  }
  photoUrl.value = URL.createObjectURL(file)
  // Reset value để chọn lại cùng file vẫn trigger change
  e.target.value = ''
}

const clearPhoto = () => {
  if (photoUrl.value && photoUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(photoUrl.value)
  }
  photoUrl.value = ''
  photoFile.value = null
}

const handleClose = () => {
  emit('close')
}

const handleComplete = () => {
  if (!photoUrl.value) return
  emit('complete', {
    orderId: props.order?.id,
    photoFile: photoFile.value,
    photoUrl: photoUrl.value,
  })
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
  max-width: 560px;
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

.section { display: grid; gap: 8px; }

.section-label {
  color: var(--admin-muted);
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

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

/* items */
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

/* summary */
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

/* upload */
.upload-empty {
  border: 1.5px dashed var(--admin-border);
  border-radius: 10px;
  padding: 22px 16px;
  text-align: center;
  color: var(--admin-muted);
}

.upload-empty i { font-size: 1.6rem; opacity: 0.6; display: block; }
.upload-empty p { margin: 6px 0 0; font-size: 0.86rem; }

.upload-preview {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: var(--admin-surface-soft);
}

.upload-preview img {
  width: 100%;
  max-height: 280px;
  object-fit: cover;
  display: block;
}

.remove-photo {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.6);
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

.upload-trigger:hover {
  background: var(--admin-surface-soft);
  border-color: var(--admin-text);
}

.upload-trigger.is-open {
  border-color: var(--admin-text);
  background: var(--admin-surface-soft);
}

.upload-sheet {
  margin-top: 10px;
  background: var(--admin-surface);
  border: 1px solid var(--admin-border);
  border-radius: 12px;
  overflow: hidden;
}

.sheet-option {
  width: 100%;
  border: 0;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease;
}

.sheet-option + .sheet-option { border-top: 1px solid var(--admin-border); }

.sheet-option:hover { background: var(--admin-surface-soft); }

.sheet-option > i:first-child {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--admin-primary-soft);
  color: var(--admin-text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  flex: 0 0 auto;
}

.sheet-option > div { flex: 1; min-width: 0; display: grid; gap: 2px; }
.sheet-option strong { color: var(--admin-text); font-size: 0.94rem; font-weight: 600; }
.sheet-option small { color: var(--admin-muted); font-size: 0.8rem; }
.sheet-option .chev { color: var(--admin-muted); }

/* footer */
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

/* transitions */
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

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
  overflow: hidden;
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media screen and (max-width: 575.98px) {
  .modal-backdrop {
    padding: 0;
    align-items: flex-end;
  }
  .modal-card {
    max-width: 100%;
    height: 92vh;
    max-height: 92vh;
    border-radius: 18px 18px 0 0;
  }
  .modal-header { padding: 14px 16px; }
  .modal-body { padding: 14px 16px 12px; gap: 14px; }
  .modal-footer { padding: 12px 14px env(safe-area-inset-bottom, 14px); }
  .upload-actions { flex-direction: column; }
  .upload-trigger { width: 100%; }
  .item-row { padding: 8px; }
  .item-img { width: 44px; height: 44px; }
  .customer-block { padding: 10px 12px; }
  .customer-avatar { width: 40px; height: 40px; }
  .modal-title { font-size: 0.98rem; }
}
</style>
