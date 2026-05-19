<template>
  <div v-if="isVisible" class="approval-panel admin-card-shell">
    <div class="approval-header">
      <div>
        <h3 class="card-title">{{ $t('admin.orders.approval.title') }}</h3>
        <p class="approval-subtitle">{{ $t('admin.orders.approval.subtitle') }}</p>
      </div>
      <i class="bi bi-shield-check approval-icon" aria-hidden="true"></i>
    </div>

    <div class="approval-checklist" aria-label="approval-checklist">
      <span><i class="bi bi-check2-circle"></i>{{ $t('admin.orders.approval.checkPayment') }}</span>
      <span><i class="bi bi-check2-circle"></i>{{ $t('admin.orders.approval.checkStock') }}</span>
      <span><i class="bi bi-check2-circle"></i>{{ $t('admin.orders.approval.checkFraud') }}</span>
    </div>

    <div v-if="showRejectForm" class="reject-form">
      <textarea
        v-model="reason"
        class="admin-control reject-reason"
        :maxlength="MAX_REASON_LENGTH"
        :placeholder="$t('admin.orders.approval.reasonPlaceholder')"
        rows="4"
      ></textarea>
      <div class="reason-footer">
        <span>{{ reason.length }}/{{ MAX_REASON_LENGTH }}</span>
        <span v-if="reasonError" class="reason-error">{{ reasonError }}</span>
      </div>
    </div>

    <div class="approval-actions">
      <button class="admin-primary-button" type="button" :disabled="isSubmitting" @click="approve">
        <span v-if="isSubmitting && activeAction === 'approve'" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <i v-else class="bi bi-check2"></i>
        {{ $t('admin.orders.approval.approve') }}
      </button>
      <button
        class="admin-danger-button"
        type="button"
        :disabled="isSubmitting"
        @click="showRejectForm ? reject() : openRejectForm()"
      >
        <span v-if="isSubmitting && activeAction === 'reject'" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <i v-else class="bi bi-x-lg"></i>
        {{ showRejectForm ? $t('admin.orders.approval.confirmReject') : $t('admin.orders.approval.reject') }}
      </button>
      <button v-if="showRejectForm" class="admin-secondary-button" type="button" :disabled="isSubmitting" @click="cancelReject">
        {{ $t('common.cancel') }}
      </button>
    </div>

    <div v-if="showRefundConfirm" class="approval-modal-backdrop" @click.self="showRefundConfirm = false">
      <div class="approval-modal" role="dialog" aria-modal="true">
        <i class="bi bi-exclamation-triangle modal-icon" aria-hidden="true"></i>
        <h4>{{ $t('admin.orders.approval.refundTitle') }}</h4>
        <p>{{ $t('admin.orders.approval.refundWarning') }}</p>
        <div class="modal-actions">
          <button class="admin-secondary-button" type="button" :disabled="isSubmitting" @click="showRefundConfirm = false">
            {{ $t('common.cancel') }}
          </button>
          <button class="admin-danger-button" type="button" :disabled="isSubmitting" @click="confirmRefundReject">
            {{ $t('admin.orders.approval.confirmReject') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from '#imports'
import { toast } from 'vue-sonner'
import { useAdminStore } from '@/stores/adminStore'

const MAX_REASON_LENGTH = 500

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['updated'])
const { t } = useI18n()
const admin = useAdminStore()

const reason = ref('')
const reasonError = ref('')
const showRejectForm = ref(false)
const showRefundConfirm = ref(false)
const isSubmitting = ref(false)
const activeAction = ref('')

const orderStatus = computed(() => props.order?.status || props.order?.fulfillmentStatus)
const paymentStatus = computed(() => props.order?.payment?.status || props.order?.paymentStatus)
const isVisible = computed(() => orderStatus.value === 'confirmed')
const needsRefundConfirm = computed(() => paymentStatus.value === 'completed')

const approve = async () => {
  if (isSubmitting.value) return

  isSubmitting.value = true
  activeAction.value = 'approve'
  try {
    const res = await admin.approveOrder(props.order.id)
    toast.success(t('admin.orders.approval.approved'))
    emit('updated', res?.data)
  } catch (e) {
    toast.error(t('admin.orders.approval.actionFailed', { msg: e.message }))
  } finally {
    isSubmitting.value = false
    activeAction.value = ''
  }
}

const openRejectForm = () => {
  showRejectForm.value = true
  reasonError.value = ''
}

const cancelReject = () => {
  showRejectForm.value = false
  showRefundConfirm.value = false
  reason.value = ''
  reasonError.value = ''
}

const reject = async () => {
  if (isSubmitting.value) return

  reasonError.value = ''
  const trimmedReason = reason.value.trim()
  if (!trimmedReason) {
    reasonError.value = t('admin.orders.approval.reasonRequired')
    return
  }

  if (needsRefundConfirm.value) {
    showRefundConfirm.value = true
    return
  }

  await submitReject(trimmedReason)
}

const confirmRefundReject = async () => {
  const trimmedReason = reason.value.trim()
  if (!trimmedReason) {
    reasonError.value = t('admin.orders.approval.reasonRequired')
    showRefundConfirm.value = false
    return
  }

  await submitReject(trimmedReason)
}

const submitReject = async (trimmedReason) => {
  isSubmitting.value = true
  activeAction.value = 'reject'
  try {
    const res = await admin.rejectOrder(props.order.id, trimmedReason)
    toast.success(t('admin.orders.approval.rejected'))
    showRefundConfirm.value = false
    cancelReject()
    emit('updated', res?.data)
  } catch (e) {
    toast.error(t('admin.orders.approval.actionFailed', { msg: e.message }))
  } finally {
    isSubmitting.value = false
    activeAction.value = ''
  }
}
</script>

<style scoped>
.approval-panel {
  padding: 20px;
}

.approval-header {
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

.approval-subtitle {
  margin: 0;
  color: var(--admin-muted);
  font-size: 0.84rem;
  line-height: 1.45;
}

.approval-icon {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: rgba(40, 199, 111, 0.12);
  color: var(--admin-success);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  flex: 0 0 auto;
}

.approval-checklist {
  display: grid;
  gap: 8px;
  margin-bottom: 16px;
}

.approval-checklist span {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--admin-text);
  font-size: 0.86rem;
}

.approval-checklist i {
  color: var(--admin-success);
}

.reject-form {
  margin-bottom: 14px;
}

.reject-reason {
  width: 100%;
  min-height: 112px;
  resize: vertical;
  line-height: 1.5;
}

.reason-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 6px;
  color: var(--admin-subtle);
  font-size: 0.76rem;
}

.reason-error {
  color: var(--admin-danger);
  font-weight: 700;
}

.approval-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.approval-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1050;
  background: rgba(15, 18, 32, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.approval-modal {
  width: min(420px, 100%);
  border-radius: 8px;
  background: var(--admin-surface);
  border: 1px solid var(--admin-border);
  box-shadow: 0 18px 42px rgba(15, 18, 32, 0.18);
  padding: 22px;
}

.modal-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(255, 159, 67, 0.14);
  color: var(--admin-warning);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-bottom: 12px;
}

.approval-modal h4 {
  margin: 0 0 8px;
  color: var(--admin-text);
  font-size: 1rem;
}

.approval-modal p {
  margin: 0;
  color: var(--admin-muted);
  font-size: 0.88rem;
  line-height: 1.55;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}

@media screen and (max-width: 767.98px) {
  .approval-panel {
    padding: 16px;
  }

  .approval-actions,
  .approval-actions button,
  .modal-actions,
  .modal-actions button {
    width: 100%;
  }

  .approval-actions button,
  .modal-actions button {
    justify-content: center;
  }
}
</style>
