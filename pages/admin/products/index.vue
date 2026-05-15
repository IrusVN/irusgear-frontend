<template>
  <div class="products-page">
    <!-- Sales Metric Strip -->
    <div class="metric-strip">
      <AdminMetricCard
        v-for="ch in salesChannels"
        :key="ch.label"
        :label="ch.label"
        :value="formatCompact(ch.value)"
        :meta="ch.orders.toLocaleString() + ' orders'"
        :trend="ch.change !== 0 ? (ch.change > 0 ? '+' : '') + ch.change + '%' : ''"
        :trend-direction="ch.change > 0 ? 'up' : ch.change < 0 ? 'down' : 'neutral'"
        :icon="ch.icon"
        :variant="ch.variant"
      />
    </div>

    <!-- Filters Card -->
    <div class="admin-card-shell filters-card">
      <div class="filters-grid">
        <label class="filter-group">
          <span class="filter-label">Status</span>
          <select v-model="statusFilter" class="admin-control filter-select" @change="resetPage">
            <option value="all">All Status</option>
            <option value="publish">Published</option>
            <option value="scheduled">Scheduled</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>
        </label>
        <label class="filter-group">
          <span class="filter-label">Category</span>
          <select v-model="categoryFilter" class="admin-control filter-select" @change="resetPage">
            <option value="all">All Categories</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
          </select>
        </label>
        <label class="filter-group">
          <span class="filter-label">Stock</span>
          <select v-model="stockFilter" class="admin-control filter-select" @change="resetPage">
            <option value="all">All Stock</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </label>
      </div>
    </div>

    <!-- Product Table -->
    <AdminDataTable
      :columns="columns"
      :items="paginatedProducts"
      :selectable="true"
      :selected-keys="selectedIds"
      @update:selected-keys="selectedIds = $event"
      @row-click="navigateToEdit"
    >
      <template #toolbar>
        <AdminTableToolbar
          :search="search"
          :page-size="pageSize"
          search-placeholder="Search Product"
          @update:search="search = $event; resetPage()"
          @update:page-size="pageSize = $event; resetPage()"
          @export="handleExport"
        >
          <template #actions>
            <nuxt-link to="/admin/products/create" class="admin-primary-button">
              <i class="bi bi-plus-lg"></i>
              <span>Add Product</span>
            </nuxt-link>
          </template>
        </AdminTableToolbar>
      </template>

      <!-- Product cell -->
      <template #cell-name="{ item }">
        <div class="product-cell">
          <img :src="item.image" :alt="item.name" class="product-thumb" />
          <div class="product-info">
            <strong>{{ item.name }}</strong>
            <small>{{ item.vendor }}</small>
          </div>
        </div>
      </template>

      <!-- Category cell -->
      <template #cell-categoryName="{ item }">
        <span class="category-pill">
          <i class="bi" :class="item.categoryIcon"></i>
          {{ item.categoryName }}
        </span>
      </template>

      <!-- Stock toggle -->
      <template #cell-stockEnabled="{ item }">
        <label class="stock-toggle" @click.stop>
          <input type="checkbox" :checked="item.stockEnabled" @change="toggleStock(item)" />
          <span class="toggle-track"></span>
        </label>
      </template>

      <!-- SKU -->
      <template #cell-sku="{ item }">
        <code class="sku-code">{{ item.sku }}</code>
      </template>

      <!-- Price -->
      <template #cell-price="{ item }">
        <div>
          <strong>{{ formatCurrency(item.price) }}</strong>
          <small v-if="item.compareAtPrice" class="compare-price">{{ formatCurrency(item.compareAtPrice) }}</small>
        </div>
      </template>

      <!-- Qty -->
      <template #cell-quantity="{ item }">
        <span :class="qtyClass(item)">{{ item.quantity }}</span>
      </template>

      <!-- Status -->
      <template #cell-status="{ item }">
        <AdminStatusBadge :label="statusLabel(item.status)" :variant="statusVariant(item.status)" />
      </template>

      <!-- Actions -->
      <template #actions="{ item }">
        <div class="action-buttons">
          <nuxt-link :to="`/admin/products/${item.id}/edit`" class="admin-icon-button" title="Edit" @click.stop>
            <i class="bi bi-pencil"></i>
          </nuxt-link>
          <AdminActionMenu
            :items="[
              { key: 'view', label: 'View', icon: 'bi-eye' },
              { key: 'duplicate', label: 'Duplicate', icon: 'bi-copy' },
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
          :total="filteredProducts.length"
          @update:page="page = $event"
        />
      </template>
    </AdminDataTable>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useHead, useRouter } from '#imports'
import { adminProductsMock } from '~/mocks/admin/products.mock'
import { adminCategoriesMock } from '~/mocks/admin/categories.mock'
import { adminDashboardMock } from '~/mocks/admin/dashboard.mock'
import AdminDataTable from '@/components/Admin/ui/AdminDataTable.vue'
import AdminTableToolbar from '@/components/Admin/ui/AdminTableToolbar.vue'
import AdminPagination from '@/components/Admin/ui/AdminPagination.vue'
import AdminMetricCard from '@/components/Admin/ui/AdminMetricCard.vue'
import AdminStatusBadge from '@/components/Admin/ui/AdminStatusBadge.vue'
import AdminActionMenu from '@/components/Admin/ui/AdminActionMenu.vue'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Products – IrusGear Admin' })

const router = useRouter()
const salesChannels = adminDashboardMock.salesChannels
const categories = adminCategoriesMock

/* ── state ── */
const search = ref('')
const statusFilter = ref('all')
const categoryFilter = ref('all')
const stockFilter = ref('all')
const page = ref(1)
const pageSize = ref(10)
const selectedIds = ref([])

const resetPage = () => { page.value = 1 }

/* ── columns ── */
const columns = [
  { key: 'name', label: 'Product', width: '28%' },
  { key: 'categoryName', label: 'Category' },
  { key: 'stockEnabled', label: 'Stock', width: '80px', align: 'center' },
  { key: 'sku', label: 'SKU' },
  { key: 'price', label: 'Price' },
  { key: 'quantity', label: 'Qty', width: '70px', align: 'center' },
  { key: 'status', label: 'Status' },
]

/* ── filtering ── */
const filteredProducts = computed(() => {
  let list = [...adminProductsMock]
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
  }
  if (statusFilter.value !== 'all') list = list.filter(p => p.status === statusFilter.value)
  if (categoryFilter.value !== 'all') list = list.filter(p => p.categoryName === categoryFilter.value)
  if (stockFilter.value !== 'all') list = list.filter(p => p.stockState === stockFilter.value)
  return list
})

const paginatedProducts = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredProducts.value.slice(start, start + pageSize.value)
})

/* ── helpers ── */
const formatCompact = (n) => {
  if (n >= 1_000_000_000) return '₫' + (n / 1_000_000_000).toFixed(1) + 'B'
  if (n >= 1_000_000) return '₫' + (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return '₫' + (n / 1_000).toFixed(1) + 'K'
  return '₫' + String(n)
}

const formatCurrency = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)

const statusLabel = (s) => ({ publish: 'Published', scheduled: 'Scheduled', inactive: 'Inactive', draft: 'Draft' }[s] || s)
const statusVariant = (s) => ({ publish: 'success', scheduled: 'warning', inactive: 'danger', draft: 'neutral' }[s] || 'neutral')

const qtyClass = (item) => {
  if (item.quantity === 0) return 'qty-danger'
  if (item.quantity < 50) return 'qty-warning'
  return 'qty-ok'
}

const toggleStock = (item) => { item.stockEnabled = !item.stockEnabled }

const navigateToEdit = (item) => router.push(`/admin/products/${item.id}/edit`)
const handleExport = () => alert('Export triggered (mock)')
const handleAction = (action, item) => {
  if (action.key === 'delete') alert(`Delete product #${item.id} (mock)`)
  else if (action.key === 'duplicate') alert(`Duplicate product #${item.id} (mock)`)
  else router.push(`/admin/products/${item.id}/edit`)
}
</script>

<style scoped>
.products-page { max-width: 1560px; }

/* Metric strip */
.metric-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 20px;
}

/* Filters */
.filters-card { padding: 20px; margin-bottom: 20px; }
.filters-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.filter-group { display: flex; flex-direction: column; gap: 6px; }
.filter-label { font-size: 0.82rem; font-weight: 600; color: var(--admin-muted); text-transform: uppercase; letter-spacing: 0.03em; }
.filter-select { width: 100%; }

/* Product cell */
.product-cell { display: flex; align-items: center; gap: 12px; }
.product-thumb { width: 42px; height: 42px; border-radius: 8px; object-fit: cover; flex: 0 0 auto; background: var(--admin-surface-soft); }
.product-info { min-width: 0; }
.product-info strong { display: block; font-size: 0.9rem; color: var(--admin-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 260px; }
.product-info small { color: var(--admin-muted); font-size: 0.8rem; }

/* Category pill */
.category-pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 10px; border-radius: 6px;
  background: var(--admin-surface-soft); color: var(--admin-text);
  font-size: 0.84rem; font-weight: 500; white-space: nowrap;
}

/* Stock toggle */
.stock-toggle { position: relative; display: inline-flex; align-items: center; cursor: pointer; }
.stock-toggle input { position: absolute; opacity: 0; width: 0; height: 0; }
.toggle-track {
  width: 38px; height: 22px; border-radius: 999px;
  background: #d5d5da; transition: background 0.2s ease; position: relative;
}
.toggle-track::after {
  content: ''; position: absolute; top: 3px; left: 3px;
  width: 16px; height: 16px; border-radius: 999px;
  background: #fff; transition: transform 0.2s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}
.stock-toggle input:checked + .toggle-track { background: var(--admin-success); }
.stock-toggle input:checked + .toggle-track::after { transform: translateX(16px); }

/* SKU */
.sku-code { font-size: 0.84rem; padding: 3px 8px; background: var(--admin-surface-soft); border-radius: 5px; color: var(--admin-text); }

/* Price */
.compare-price { display: block; color: var(--admin-muted); text-decoration: line-through; font-size: 0.78rem; }

/* Qty */
.qty-ok { color: var(--admin-success); font-weight: 600; }
.qty-warning { color: var(--admin-warning); font-weight: 600; }
.qty-danger { color: var(--admin-danger); font-weight: 600; }

/* Actions */
.action-buttons { display: flex; align-items: center; justify-content: center; gap: 4px; }

/* Responsive */
@media (max-width: 1199.98px) {
  .metric-strip { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 767.98px) {
  .metric-strip { grid-template-columns: 1fr; }
  .filters-grid { grid-template-columns: 1fr; }
}
</style>
