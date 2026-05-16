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
          search-placeholder="Search Category"
          :show-export="false"
          @update:search="search = $event; resetPage()"
          @update:page-size="pageSize = $event; resetPage()"
        >
          <template #actions>
            <button class="admin-primary-button" type="button" @click="openAddModal">
              <i class="bi bi-plus-lg"></i>
              <span>Add Category</span>
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
          :label="item.status === 'active' ? 'Active' : 'Inactive'"
          :variant="item.status === 'active' ? 'success' : 'danger'"
        />
      </template>

      <!-- Actions -->
      <template #actions="{ item }">
        <div class="action-buttons">
          <button class="admin-icon-button" title="Edit" @click.stop="openEditModal(item)">
            <i class="bi bi-pencil"></i>
          </button>
          <AdminActionMenu
            :items="[
              { key: 'view', label: 'View Products', icon: 'bi-box-seam' },
              { key: 'delete', label: 'Delete', icon: 'bi-trash', variant: 'danger' },
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
              <h3>{{ editingCategory ? 'Edit Category' : 'Add Category' }}</h3>
              <button class="admin-icon-button" type="button" @click="closeModal">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <div class="modal-body">
              <label class="form-field">
                <span class="field-label">Name</span>
                <input v-model="form.name" type="text" class="admin-control field-input" placeholder="Category name" />
              </label>
              <label class="form-field">
                <span class="field-label">Slug</span>
                <input v-model="form.slug" type="text" class="admin-control field-input" placeholder="category-slug" />
              </label>
              <label class="form-field">
                <span class="field-label">Description</span>
                <textarea v-model="form.description" class="admin-control field-textarea" rows="3" placeholder="Short description"></textarea>
              </label>
              <div class="form-row-2">
                <label class="form-field">
                  <span class="field-label">Icon (BI class)</span>
                  <input v-model="form.icon" type="text" class="admin-control field-input" placeholder="bi-phone" />
                </label>
                <label class="form-field">
                  <span class="field-label">Status</span>
                  <select v-model="form.status" class="admin-control field-input">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>
              </div>
            </div>

            <div class="modal-footer">
              <button class="admin-secondary-button" type="button" @click="closeModal">Cancel</button>
              <button class="admin-primary-button" type="button" @click="saveCategory">
                {{ editingCategory ? 'Save Changes' : 'Create Category' }}
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
import { useHead } from '#imports'
import { useAdminStore } from '@/stores/adminStore'
import { useUiStore } from '@/stores/uiStore'
import AdminDataTable from '@/components/Admin/ui/AdminDataTable.vue'
import AdminTableToolbar from '@/components/Admin/ui/AdminTableToolbar.vue'
import AdminPagination from '@/components/Admin/ui/AdminPagination.vue'
import AdminStatusBadge from '@/components/Admin/ui/AdminStatusBadge.vue'
import AdminActionMenu from '@/components/Admin/ui/AdminActionMenu.vue'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Categories – IrusGear Admin' })

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

const saveCategory = async () => {
  const payload = {
    name: form.value.name,
    slug: form.value.slug || undefined,
    description: form.value.description || undefined,
  }

  try {
    if (editingCategory.value) {
      await admin.update('categories', editingCategory.value.id, payload)
    } else {
      await admin.create('categories', payload)
    }
    closeModal()
    loadCategories()
  } catch (e) {
    alert(`Save failed: ${e.message}`)
  }
}

/* ── columns ── */
const columns = [
  { key: 'name', label: 'Category', width: '38%' },
  { key: 'productCount', label: 'Total Products', align: 'center' },
  { key: 'totalEarning', label: 'Total Earning' },
  { key: 'status', label: 'Status' },
]

/* ── helpers ── */
const formatCurrency = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)

const handleAction = async (action, item) => {
  if (action.key === 'delete') {
    if (!confirm(`Delete category "${item.name}"?`)) return
    try {
      await admin.remove('categories', item.id)
      loadCategories()
    } catch (e) {
      alert(`Delete failed: ${e.message}`)
    }
  } else {
    alert(`View products in "${item.name}"`)
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
