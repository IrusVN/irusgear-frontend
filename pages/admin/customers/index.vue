<template>
  <div class="customers-page">
    <!-- Customer Table (Desktop) -->
    <AdminDataTable
      v-if="!isMobile"
      :columns="columns"
      :items="paginatedCustomers"
      :selectable="true"
      :selected-keys="selectedIds"
      @update:selected-keys="selectedIds = $event"
      @row-click="viewCustomer"
    >
      <template #toolbar>
        <AdminTableToolbar
          :search="search"
          :page-size="pageSize"
          :search-placeholder="$t('admin.customers.searchCustomer')"
          @update:search="handleSearch"
          @update:page-size="changePageSize"
          @export="handleExport"
        >
          <template #actions>
            <button class="admin-primary-button" type="button" @click="handleAdd">
              <i class="bi bi-plus-lg"></i>
              <span>{{ $t('admin.customers.addCustomer') }}</span>
            </button>
          </template>
        </AdminTableToolbar>
      </template>

      <template #cell-name="{ item }">
        <div class="customer-cell">
          <img :src="item.avatar" :alt="item.name" class="customer-avatar" />
          <div class="customer-info">
            <strong>{{ item.name }}</strong>
            <small>{{ item.email }}</small>
          </div>
        </div>
      </template>

      <template #cell-customerCode="{ item }">
        <code class="code-chip">{{ item.customerCode }}</code>
      </template>

      <template #cell-country="{ item }">
        <span class="country-cell">
          <img :src="`https://flagcdn.com/20x15/${item.countryCode.toLowerCase()}.png`" :alt="item.country" class="country-flag" />
          {{ item.country }}
        </span>
      </template>

      <template #cell-orders="{ item }">
        <strong>{{ item.orders.toLocaleString() }}</strong>
      </template>

      <template #cell-totalSpent="{ item }">
        <strong>{{ formatCurrency(item.totalSpent) }}</strong>
      </template>

      <template #cell-status="{ item }">
        <div class="status-stack">
          <AdminStatusBadge
            :label="statusBadge(item.status).label"
            :variant="statusBadge(item.status).variant"
            dot
          />
          <span v-if="!item.email_verified" class="unverified-chip" :title="$t('admin.customers.emailVerifyNo')">
            <i class="bi bi-envelope-exclamation"></i>
            {{ $t('admin.customers.emailVerifyNo') }}
          </span>
        </div>
      </template>

      <template #actions="{ item }">
        <AdminActionMenu
          :items="[
            { key: 'view', label: $t('admin.customers.viewDetails'), icon: 'bi-eye' },
            { key: 'edit', label: $t('admin.customers.edit'), icon: 'bi-pencil' },
            { key: 'delete', label: $t('admin.customers.delete'), icon: 'bi-trash', variant: 'danger' },
          ]"
          @select="handleAction($event, item)"
        />
      </template>

      <template #pagination>
        <AdminPagination
          :page="page"
          :page-size="pageSize"
          :total="totalCustomers"
          @update:page="changePage"
        />
      </template>
    </AdminDataTable>

    <!-- Mobile Card List -->
    <div v-if="isMobile" class="admin-card-shell" style="padding:14px">
      <label style="display:block;position:relative;margin-bottom:12px">
        <i class="bi bi-search" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--admin-muted)"></i>
        <input class="admin-control" :value="search" :placeholder="$t('admin.customers.searchCustomer')" style="padding-left:36px;width:100%" @input="handleSearch($event.target.value)">
      </label>
      <AdminMobileCard
        v-for="item in paginatedCustomers"
        :key="item.id"
        :title="item.name"
        :subtitle="item.email"
        :avatar="item.avatar"
        :meta="[
          { label: $t('admin.customers.statusLabel').replace(':', ''), value: statusBadge(item.status).label },
          { label: $t('admin.customers.orders'), value: item.orders.toLocaleString() },
          { label: $t('admin.customers.spent'), value: formatCurrency(item.totalSpent) },
          { label: $t('admin.customers.idLabel'), value: item.customerCode },
        ]"
        @click="viewCustomer(item)"
      >
        <template #actions>
          <AdminActionMenu
            :items="[
              { key: 'view', label: $t('admin.customers.viewDetails'), icon: 'bi-eye' },
              { key: 'edit', label: $t('admin.customers.edit'), icon: 'bi-pencil' },
              { key: 'delete', label: $t('admin.customers.delete'), icon: 'bi-trash', variant: 'danger' },
            ]"
            @select="handleAction($event, item)"
          />
        </template>
      </AdminMobileCard>
      <div v-if="totalCustomers > customers.length" style="text-align:center;padding:8px">
        <button v-if="page * pageSize < totalCustomers" class="admin-secondary-button" @click="changePage(page + 1)">{{ $t('admin.customers.loadMore') }}</button>
      </div>
    </div>

    <!-- Quick Edit Customer Modal -->
    <QuickEditCustomer
      v-model="showQuickEdit"
      :customer="quickEditCustomer"
      @updated="onQuickEditUpdated"
    />

    <!-- Add Customer Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showAddModal" class="customer-modal-overlay" @click.self="closeAddModal">
          <div class="customer-modal">
            <div class="customer-modal__header">
              <h3>{{ $t('admin.customers.addCustomer') }}</h3>
              <button type="button" class="customer-modal__close" @click="closeAddModal">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
            <form class="customer-modal__body" @submit.prevent="submitAddCustomer">
              <div class="field-grid">
                <label class="field">
                  <span>{{ $t('common.firstName') }} <em>*</em></span>
                  <input v-model="addForm.first_name" class="admin-control" required maxlength="50">
                </label>
                <label class="field">
                  <span>{{ $t('common.lastName') }} <em>*</em></span>
                  <input v-model="addForm.last_name" class="admin-control" required maxlength="50">
                </label>
              </div>
              <label class="field">
                <span>Email <em>*</em></span>
                <input v-model="addForm.email" type="email" class="admin-control" required>
              </label>
              <label class="field">
                <span>{{ $t('common.phoneNumber') }}</span>
                <input v-model="addForm.phone_number" class="admin-control" maxlength="20">
              </label>
              <label class="field">
                <span>{{ $t('common.password') }} <em>*</em></span>
                <input v-model="addForm.password" type="password" class="admin-control" required minlength="8" autocomplete="new-password">
                <small class="field-hint">{{ $t('admin.customers.passwordHint') }}</small>
              </label>
              <div class="customer-modal__footer">
                <button type="button" class="admin-secondary-button" @click="closeAddModal" :disabled="submittingAdd">
                  {{ $t('common.cancel') }}
                </button>
                <button type="submit" class="admin-primary-button" :disabled="submittingAdd">
                  <span v-if="submittingAdd" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <i v-else class="bi bi-plus-lg"></i>
                  {{ submittingAdd ? $t('common.loading') : $t('admin.customers.addCustomer') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHead, useRouter, useI18n } from '#imports'
import { useAdminStore } from '@/stores/adminStore'
import { usePaginationStore } from '@/stores/paginationStore'
import AdminDataTable from '@/components/Admin/ui/AdminDataTable.vue'
import AdminTableToolbar from '@/components/Admin/ui/AdminTableToolbar.vue'
import AdminPagination from '@/components/Admin/ui/AdminPagination.vue'
import AdminActionMenu from '@/components/Admin/ui/AdminActionMenu.vue'
import AdminMobileCard from '@/components/Admin/ui/AdminMobileCard.vue'
import AdminStatusBadge from '@/components/Admin/ui/AdminStatusBadge.vue'
import QuickEditCustomer from '@/components/Admin/customers/QuickEditCustomer.vue'
import { useMediaQuery } from '@/composables/useMediaQuery'
import { toast } from 'vue-sonner'
import { useConfirm } from '@/composables/useConfirm'
import { exportToCsv } from '@/utils/exportCsv'

const { t } = useI18n()
const isMobile = useMediaQuery('(max-width: 767px)')

definePageMeta({ layout: 'admin' })
useHead({ title: () => t('admin.customers.pageTitle') })

const router = useRouter()
const admin = useAdminStore()
const pagination = usePaginationStore()

const search = ref('')
const searchTimeout = ref(null)
const page = computed(() => pagination.page)
const pageSize = computed(() => pagination.limit)
const totalCustomers = computed(() => pagination.total)

const selectedIds = ref([])
const customers = ref([])

/* ── Add Customer Modal ── */
const showAddModal = ref(false)
const submittingAdd = ref(false)
const addForm = ref({ first_name: '', last_name: '', email: '', phone_number: '', password: '' })
const resetAddForm = () => {
  addForm.value = { first_name: '', last_name: '', email: '', phone_number: '', password: '' }
}
const closeAddModal = () => {
  showAddModal.value = false
  resetAddForm()
}
const submitAddCustomer = async () => {
  submittingAdd.value = true
  try {
    const payload = {
      first_name: addForm.value.first_name.trim(),
      last_name: addForm.value.last_name.trim(),
      name: `${addForm.value.first_name} ${addForm.value.last_name}`.trim(),
      email: addForm.value.email.trim().toLowerCase(),
      phone_number: addForm.value.phone_number.trim() || null,
      password: addForm.value.password,
      role_id: 3, // CUSTOMER role
    }
    await admin.create('users', payload)
    toast.success(t('admin.customers.addSuccess'))
    closeAddModal()
    fetchCustomers()
  } catch (e) {
    const msg = e?.data?.message || e?.message || t('admin.customers.addFailed')
    toast.error(msg)
  } finally {
    submittingAdd.value = false
  }
}

const handleSearch = (val) => {
  search.value = val
  if (searchTimeout.value) clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => {
    pagination.page = 1
    fetchCustomers()
  }, 300)
}

const changePage = (p) => {
  pagination.page = p
  fetchCustomers()
}

const changePageSize = (size) => {
  pagination.limit = size
  pagination.page = 1
  fetchCustomers()
}

const columns = computed(() => [
  { key: 'name', label: t('admin.customers.title').replace(/s$/i, ''), width: '24%' },
  { key: 'customerCode', label: t('admin.customers.customerId') },
  { key: 'country', label: t('admin.customers.country') },
  { key: 'status', label: t('admin.customers.statusLabel').replace(':', '') },
  { key: 'orders', label: t('admin.customers.totalOrders'), align: 'center' },
  { key: 'totalSpent', label: t('admin.customers.totalSpent') },
])

const paginatedCustomers = computed(() => customers.value)

// Map status code/text → badge label + variant.
// BE có thể trả '0'/'1' (code), 'active'/'inactive' (text) hoặc enum object.
const statusBadge = (status) => {
  const v = status?.value ?? status
  const key = String(v ?? '').toLowerCase()
  // Code-based mapping (UserStatus enum: 0=INACTIVE, 1=ACTIVE, 2=PENDING, 3=BANNED)
  if (key === '1' || key === 'active') return { label: t('admin.customers.statusActive'), variant: 'success' }
  if (key === '0' || key === 'inactive') return { label: t('admin.customers.statusInactive'), variant: 'neutral' }
  if (key === '2' || key === 'pending') return { label: t('admin.customers.statusPending'), variant: 'warning' }
  if (key === '3' || key === 'banned') return { label: t('admin.customers.statusBanned'), variant: 'danger' }
  return { label: '—', variant: 'neutral' }
}

const formatCurrency = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)

const viewCustomer = (item) => router.push(`/admin/customers/${item.id}`)

const handleExport = () => {
  if (!customers.value.length) {
    toast.warning(t('admin.customers.noDataToExport'))
    return
  }
  exportToCsv({
    filename: 'customers',
    items: customers.value,
    columns: [
      { key: 'customerCode', label: t('admin.customers.customerId') },
      { key: 'name', label: t('admin.customers.title').replace(/s$/i, '') },
      { key: 'email', label: 'Email' },
      { key: 'country', label: t('admin.customers.country') },
      { key: 'orders', label: t('admin.customers.totalOrders') },
      { key: 'totalSpent', label: t('admin.customers.totalSpent'), format: (v) => v ?? 0 },
    ],
  })
  toast.success(t('admin.customers.exportSuccess', { count: customers.value.length }))
}

const handleAdd = () => {
  showAddModal.value = true
}

const { confirm } = useConfirm()
const deletingIds = ref(new Set())

/* ── Quick Edit drawer state ── */
const showQuickEdit = ref(false)
const quickEditCustomer = ref(null)

const openQuickEdit = (item) => {
  quickEditCustomer.value = item
  showQuickEdit.value = true
}

const onQuickEditUpdated = (updated) => {
  // Merge updated fields vào row hiện tại để UI cập nhật ngay (status badge,
  // tên hiển thị, ...) — tránh phải fetch lại toàn bộ list. Quan trọng: phải
  // merge ĐỦ field đã edit (không chỉ name/email) để lần edit kế tiếp hydrate
  // từ row cũng thấy giá trị mới, không bị "stale".
  if (!updated || !quickEditCustomer.value) {
    // Backend không trả data → fetch lại cho chắc
    fetchCustomers()
    return
  }

  const idx = customers.value.findIndex(c => c.id === quickEditCustomer.value.id)
  if (idx === -1) return

  const fullName = updated.full_name || updated.name || customers.value[idx].name

  // Tạo object mới (không Object.assign trực tiếp) để Vue reactivity tracking
  // detect được thay đổi ở row.
  customers.value[idx] = {
    ...customers.value[idx],
    name: fullName,
    first_name: updated.first_name ?? customers.value[idx].first_name,
    last_name: updated.last_name ?? customers.value[idx].last_name,
    email: updated.email || customers.value[idx].email,
    phone_number: updated.phone_number ?? customers.value[idx].phone_number,
    status: updated.status ?? customers.value[idx].status,
    email_verified: typeof updated.email_verified === 'boolean'
      ? updated.email_verified
      : Boolean(updated.email_verified_at),
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
  }

  // Đồng bộ quickEditCustomer ref để nếu user re-open ngay drawer cho cùng row
  // (mặc dù hiện ta đóng sau save) thì cũng thấy dữ liệu mới.
  quickEditCustomer.value = customers.value[idx]
}

const handleAction = async (action, item) => {
  if (action.key === 'view') {
    router.push(`/admin/customers/${item.id}`)
    return
  }

  if (action.key === 'edit') {
    openQuickEdit(item)
    return
  }

  if (action.key === 'delete') {
    if (deletingIds.value.has(item.id)) return
    const ok = await confirm({
      message: t('admin.customers.confirmDelete', { code: item.customerCode }),
      variant: 'danger',
    })
    if (!ok) return
    deletingIds.value.add(item.id)
    try {
      await admin.remove('customers', item.id)
      toast.success(t('admin.customers.deleteSuccess'))
      fetchCustomers()
    } catch (e) {
      toast.error(t('admin.customers.deleteFailed', { error: e.message }))
    } finally {
      deletingIds.value.delete(item.id)
    }
  }
}

const mapCustomer = (c) => {
  // Build single-line text từ default_address để QuickEdit drawer hiển thị
  // section "Địa chỉ mặc định" (read-only). Ưu tiên full_address nếu BE đã build,
  // fallback nối line1/city/country.
  const addr = c.default_address || null
  const addressText = addr?.full_address
    || (addr ? [addr.line1, addr.city, addr.country].filter(Boolean).join(', ') : null)

  return {
    id: c.id,
    name: c.full_name || c.name,
    first_name: c.first_name,
    last_name: c.last_name,
    email: c.email,
    phone_number: c.phone || c.phone_number,
    status: c.status,
    email_verified: c.email_verified,
    customerCode: `#CUS${c.id}`,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(c.full_name || c.name)}&background=random`,
    country: c.country || t('admin.customers.defaultCountry'),
    countryCode: 'vn',
    orders: c.orders || 0,
    totalSpent: c.total_spent || 0,
    defaultAddressText: addressText,
  }
}

const fetchCustomers = async () => {
  const res = await admin.fetchList('customers', {
    search: search.value,
    per_page: pageSize.value,
    page: page.value,
  })
  if (res?.data) {
    customers.value = res.data.map(mapCustomer)
  }
}

onMounted(() => {
  pagination.page = 1
  fetchCustomers()
})
</script>

<style scoped>
.customers-page { max-width: 1560px; }

.customer-cell { display: flex; align-items: center; gap: 12px; }
.customer-avatar { width: 36px; height: 36px; border-radius: 999px; object-fit: cover; flex: 0 0 auto; }
.customer-info { min-width: 0; }
.customer-info strong { display: block; font-size: 0.9rem; color: var(--admin-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }
.customer-info small { color: var(--admin-muted); font-size: 0.8rem; }

.code-chip { padding: 3px 8px; background: var(--admin-surface-soft); border-radius: 5px; font-size: 0.84rem; color: var(--admin-text); }

.country-cell { display: inline-flex; align-items: center; gap: 8px; font-size: 0.88rem; color: var(--admin-text); white-space: nowrap; }
.country-flag { width: 20px; height: 15px; border-radius: 2px; object-fit: cover; }

/* Status cell: badge phía trên, "Chưa verify" chip phụ phía dưới nếu user chưa xác thực email */
.status-stack { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }
.unverified-chip {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 2px 7px; border-radius: 4px;
  background: rgba(245, 158, 11, 0.12); color: #b45309;
  font-size: 0.72rem; font-weight: 600; line-height: 1.2;
  white-space: nowrap;
}
.unverified-chip i { font-size: 0.8rem; }

/* Add Customer Modal */
.customer-modal-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(17, 17, 22, 0.55); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.customer-modal {
  background: var(--admin-surface); border-radius: var(--admin-radius);
  width: 100%; max-width: 480px; max-height: calc(100vh - 40px); overflow: auto;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.18);
}
.customer-modal__header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px; border-bottom: 1px solid var(--admin-border);
}
.customer-modal__header h3 { margin: 0; font-size: 1.1rem; font-weight: 700; color: var(--admin-text); }
.customer-modal__close {
  width: 36px; height: 36px; border: 0; border-radius: 8px;
  background: var(--admin-surface-soft); color: var(--admin-text);
  display: flex; align-items: center; justify-content: center; cursor: pointer;
}
.customer-modal__close:hover { background: var(--admin-border); }
.customer-modal__body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field span { font-size: 0.82rem; font-weight: 600; color: var(--admin-text); }
.field span em { color: var(--admin-danger); font-style: normal; }
.field-hint { font-size: 0.75rem; color: var(--admin-muted); margin-top: 2px; }
.customer-modal__footer {
  display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px;
  padding-top: 16px; border-top: 1px solid var(--admin-border);
}
.customer-modal__footer button[disabled] { opacity: 0.6; cursor: not-allowed; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.18s ease; }
.modal-enter-active .customer-modal, .modal-leave-active .customer-modal { transition: transform 0.22s ease, opacity 0.18s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .customer-modal, .modal-leave-to .customer-modal { transform: translateY(20px); opacity: 0; }

@media (max-width: 575px) {
  .field-grid { grid-template-columns: 1fr; }
}
</style>
