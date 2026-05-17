<template>
  <div class="categories-page">
    <!-- Category Table -->
    <AdminDataTable
      :columns="columns"
      :items="categories"
      :selectable="true"
      :selected-keys="selectedIds"
      @update:selected-keys="selectedIds = $event"
    >
      <template #toolbar>
        <AdminTableToolbar
          :search="search"
          :page-size="pageSize"
          :search-placeholder="$t('admin.categories.searchCategory')"
          :show-export="false"
          @update:search="search = $event; resetPage()"
          @update:page-size="pageSize = $event; resetPage()"
        >
          <template #actions>
            <button class="admin-primary-button" type="button" @click="openAddModal">
              <i class="bi bi-plus-lg"></i>
              <span>{{ $t('admin.categories.addCategory') }}</span>
            </button>
          </template>
        </AdminTableToolbar>
      </template>

      <!-- Category cell -->
      <template #cell-name="{ item }">
        <div class="category-cell">
          <img :src="item.image" :alt="item.name" class="cat-thumb" />
          <div class="cat-info">
            <strong>{{ item.name }}</strong>
            <small>{{ item.description }}</small>
          </div>
        </div>
      </template>

      <!-- Product count -->
      <template #cell-productCount="{ item }">
        <strong class="count-value">{{ item.productCount.toLocaleString() }}</strong>
      </template>

      <!-- Total earning -->
      <template #cell-totalEarning="{ item }">
        <strong>{{ formatCurrency(item.totalEarning) }}</strong>
      </template>

      <!-- Status -->
      <template #cell-status="{ item }">
        <AdminStatusBadge
          :label="item.status === 'active' ? $t('admin.categories.active') : $t('admin.categories.inactive')"
          :variant="item.status === 'active' ? 'success' : 'danger'"
        />
      </template>

      <!-- Actions -->
      <template #actions="{ item }">
        <div class="action-buttons">
          <button class="admin-icon-button" :title="$t('admin.categories.edit')" @click.stop="openEditModal(item)">
            <i class="bi bi-pencil"></i>
          </button>
          <AdminActionMenu
            :items="[
              { key: 'view', label: t('admin.categories.viewProducts'), icon: 'bi-box-seam' },
              { key: 'delete', label: t('admin.categories.delete'), icon: 'bi-trash', variant: 'danger' },
            ]"
            @select="handleAction($event, item)"
          />
        </div>
      </template>

      <template #pagination>
        <AdminPagination
          :page="page"
          :page-size="pageSize"
          :total="totalCategories"
          @update:page="changePage"
        />
      </template>
    </AdminDataTable>

    <!-- Add/Edit Category Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="modalOpen" class="modal-backdrop" @click.self="closeModal">
          <div class="category-modal admin-card-shell">
            <div class="modal-header">
              <h3>{{ editingCategory ? $t('admin.categories.editCategory') : $t('admin.categories.addCategory') }}</h3>
              <button class="admin-icon-button" type="button" @click="closeModal">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <div class="modal-body">
              <label class="form-field">
                <span class="field-label">{{ $t('admin.categories.name') }}</span>
                <input v-model="form.name" type="text" class="admin-control field-input" :placeholder="$t('admin.categories.categoryNamePlaceholder')" />
              </label>
              <label class="form-field">
                <span class="field-label">{{ $t('admin.categories.slug') }}</span>
                <input v-model="form.slug" type="text" class="admin-control field-input" :placeholder="$t('admin.categories.slugPlaceholder')" />
              </label>
              <label class="form-field">
                <span class="field-label">{{ $t('admin.categories.description') }}</span>
                <textarea v-model="form.description" class="admin-control field-textarea" rows="3" :placeholder="$t('admin.categories.descriptionPlaceholder')"></textarea>
              </label>
              <div class="form-row-2">
                <label class="form-field">
                  <span class="field-label">{{ $t('admin.categories.iconLabel') }}</span>
                  <input v-model="form.icon" type="text" class="admin-control field-input" :placeholder="$t('admin.categories.iconPlaceholder')" />
                </label>
                <label class="form-field">
                  <span class="field-label">{{ $t('admin.categories.status') }}</span>
                  <select v-model="form.status" class="admin-control field-input">
                    <option value="active">{{ $t('admin.categories.active') }}</option>
                    <option value="inactive">{{ $t('admin.categories.inactive') }}</option>
                  </select>
                </label>
              </div>
            </div>

            <div class="modal-footer">
              <button class="admin-secondary-button" type="button" :disabled="isSavingCategory" @click="closeModal">{{ $t('admin.categories.cancel') }}</button>
              <button class="admin-primary-button" type="button" :disabled="isSavingCategory" @click="saveCategory">
                <span v-if="isSavingCategory" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {{ isSavingCategory ? $t('common.loading') : (editingCategory ? $t('admin.categories.saveChanges') : $t('admin.categories.createCategory')) }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useHead, useI18n } from '#imports'
import { useAdminStore } from '@/stores/adminStore'
import { useUiStore } from '@/stores/uiStore'
import AdminDataTable from '@/components/Admin/ui/AdminDataTable.vue'
import AdminTableToolbar from '@/components/Admin/ui/AdminTableToolbar.vue'
import AdminPagination from '@/components/Admin/ui/AdminPagination.vue'
import AdminStatusBadge from '@/components/Admin/ui/AdminStatusBadge.vue'
import { toast } from 'vue-sonner'
import { useConfirm } from '@/composables/useConfirm'
import AdminActionMenu from '@/components/Admin/ui/AdminActionMenu.vue'

definePageMeta({ layout: 'admin' })
const { t } = useI18n()
useHead({ title: () => t('admin.categories.pageTitle') })

const admin = useAdminStore()
const ui = useUiStore()

/* ── Reactive data ── */
const categories = ref([])
const totalCategories = ref(0)

/* ── state ── */
const search = ref('')
const page = ref(1)
const pageSize = ref(10)
const selectedIds = ref([])

/* ── API→UI Mapping ── */
const mapCategory = (c) => ({
  id: c.id,
  name: c.name,
  slug: c.slug,
  description: c.description || '',
  image: c.image || '/images/placeholder-category.png',
  icon: 'bi-tag',
  productCount: c.products_count ?? 0,
  totalEarning: c.total_earning ?? 0,
  status: c.is_active !== undefined ? (c.is_active ? 'active' : 'inactive') : 'active',
})

/* ── Data Loading ── */
const loadCategories = async () => {
  const params = {
    per_page: pageSize.value,
    page: page.value,
  }
  if (search.value) params.search = search.value

  const res = await admin.fetchList('categories', params)
  if (res?.data) {
    categories.value = res.data.map(mapCategory)
    totalCategories.value = res.meta?.total ?? res.data.length
  }
}

/* ── Lifecycle ── */
onMounted(() => {
  loadCategories()
})

const resetPage = () => {
  page.value = 1
  loadCategories()
}

const changePage = (newPage) => {
  page.value = newPage
  loadCategories()
}

/* ── Debounced search ── */
let searchTimer = null
watch(search, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    page.value = 1
    loadCategories()
  }, 300)
})

/* ── modal ── */
const modalOpen = ref(false)
const editingCategory = ref(null)
const form = ref({ name: '', slug: '', description: '', icon: 'bi-tag', status: 'active' })

const openAddModal = () => {
  editingCategory.value = null
  form.value = { name: '', slug: '', description: '', icon: 'bi-tag', status: 'active' }
  modalOpen.value = true
}

const openEditModal = (cat) => {
  editingCategory.value = cat
  form.value = { name: cat.name, slug: cat.slug, description: cat.description, icon: cat.icon, status: cat.status }
  modalOpen.value = true
}

const closeModal = () => { modalOpen.value = false }

const isSavingCategory = ref(false)
const { confirm } = useConfirm()

const saveCategory = async () => {
  if (isSavingCategory.value) return
  const payload = {
    name: form.value.name,
    slug: form.value.slug || undefined,
    description: form.value.description || undefined,
  }

  isSavingCategory.value = true
  try {
    if (editingCategory.value) {
      await admin.update('categories', editingCategory.value.id, payload)
    } else {
      await admin.create('categories', payload)
    }
    closeModal()
    loadCategories()
  } catch (e) {
    toast.error(t('admin.categories.saveFailed', { message: e.message }))
  } finally {
    isSavingCategory.value = false
  }
}

/* ── columns ── */
const columns = computed(() => [
  { key: 'name', label: t('admin.categories.category'), width: '38%' },
  { key: 'productCount', label: t('admin.categories.totalProducts'), align: 'center' },
  { key: 'totalEarning', label: t('admin.categories.totalEarning') },
  { key: 'status', label: t('admin.categories.status') },
])

/* ── helpers ── */
const formatCurrency = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)

const handleAction = async (action, item) => {
  if (action.key === 'delete') {
    const ok = await confirm({
      message: t('admin.categories.deleteConfirm', { name: item.name }),
      variant: 'danger',
    })
    if (!ok) return
    try {
      await admin.remove('categories', item.id)
      loadCategories()
    } catch (e) {
      toast.error(t('admin.categories.deleteFailed', { message: e.message }))
    }
  } else {
    toast.info(t('admin.categories.viewProductsAlert', { name: item.name }))
  }
}
</script>

<style scoped>
.categories-page { max-width: 1560px; }

/* Category cell */
.category-cell { display: flex; align-items: center; gap: 14px; }
.cat-thumb { width: 44px; height: 44px; border-radius: 8px; object-fit: cover; flex: 0 0 auto; background: var(--admin-surface-soft); }
.cat-info { min-width: 0; }
.cat-info strong { display: block; font-size: 0.92rem; color: var(--admin-text); }
.cat-info small { color: var(--admin-muted); font-size: 0.8rem; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; max-width: 320px; }

.count-value { font-size: 0.94rem; color: var(--admin-text); }

/* Actions */
.action-buttons { display: flex; align-items: center; justify-content: center; gap: 4px; }

/* ── Modal ── */
.modal-backdrop {
  position: fixed; inset: 0; z-index: 1050;
  background: rgba(17, 17, 22, 0.52);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}

.category-modal {
  width: 100%; max-width: 520px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.18);
}

.modal-header {
  padding: 20px 22px;
  border-bottom: 1px solid var(--admin-border);
  display: flex; align-items: center; justify-content: space-between;
}
.modal-header h3 { margin: 0; font-size: 1.08rem; font-weight: 700; color: var(--admin-text); }

.modal-body { padding: 22px; display: flex; flex-direction: column; gap: 16px; }

.form-field { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 0.82rem; font-weight: 600; color: var(--admin-muted); text-transform: uppercase; letter-spacing: 0.03em; }
.field-input { width: 100%; }
.field-textarea { width: 100%; min-height: 72px; padding: 10px 12px; resize: vertical; border: 1px solid var(--admin-border); border-radius: 7px; background: #fff; color: var(--admin-text); outline: 0; }
.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.modal-footer {
  padding: 16px 22px;
  border-top: 1px solid var(--admin-border);
  display: flex; align-items: center; justify-content: flex-end; gap: 10px;
}

/* Modal transitions */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.22s ease; }
.modal-fade-enter-active .category-modal, .modal-fade-leave-active .category-modal { transition: transform 0.22s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from .category-modal { transform: translateY(12px) scale(0.97); }
.modal-fade-leave-to .category-modal { transform: translateY(8px) scale(0.98); }
</style>
