<template>
  <div class="products-page">
    <!-- Sales Metric Strip -->
    <div class="metric-strip">
      <AdminMetricCard
        v-for="ch in salesChannels"
        :key="ch.label"
        :label="ch.label"
        :value="formatCompact(ch.value)"
        :meta="ch.orders.toLocaleString() + ' ' + t('admin.products.ordersLabel')"
        :trend="ch.change !== 0 ? (ch.change > 0 ? '+' : '') + ch.change + '%' : ''"
        :trend-direction="ch.change > 0 ? 'up' : ch.change < 0 ? 'down' : 'neutral'"
        :icon="ch.icon"
        :variant="ch.variant"
      />
    </div>

    <!-- Filters Card (Desktop only) -->
    <div v-if="!isMobile" class="admin-card-shell filters-card">
      <div class="filters-grid">
        <label class="filter-group">
          <span class="filter-label">{{ $t('admin.products.filterStatusLabel') }}</span>
          <select v-model="statusFilter" class="admin-control filter-select" @change="resetPage">
            <option value="all">{{ $t('admin.products.allStatus') }}</option>
            <option value="publish">{{ $t('admin.products.published') }}</option>
            <option value="scheduled">{{ $t('admin.products.scheduled') }}</option>
            <option value="inactive">{{ $t('admin.products.inactive') }}</option>
            <option value="draft">{{ $t('admin.products.draft') }}</option>
          </select>
        </label>
        <label class="filter-group">
          <span class="filter-label">{{ $t('admin.products.filterCategoryLabel') }}</span>
          <select v-model="categoryFilter" class="admin-control filter-select" @change="resetPage">
            <option value="all">{{ $t('admin.products.allCategories') }}</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
          </select>
        </label>
        <label class="filter-group">
          <span class="filter-label">{{ $t('admin.products.filterStockLabel') }}</span>
          <select v-model="stockFilter" class="admin-control filter-select" @change="resetPage">
            <option value="all">{{ $t('admin.products.allStock') }}</option>
            <option value="in_stock">{{ $t('admin.products.inStock') }}</option>
            <option value="low_stock">{{ $t('admin.products.lowStock') }}</option>
            <option value="out_of_stock">{{ $t('admin.products.outOfStock') }}</option>
          </select>
        </label>
      </div>
    </div>

    <!-- Product Table (Desktop) -->
    <AdminDataTable
      v-if="!isMobile"
      :columns="columns"
      :items="products"
      :selectable="true"
      :selected-keys="selectedIds"
      @update:selected-keys="selectedIds = $event"
      @row-click="navigateToEdit"
    >
      <template #toolbar>
        <AdminTableToolbar
          :search="search"
          :page-size="pageSize"
          :search-placeholder="$t('admin.products.searchProduct')"
          @update:search="search = $event; resetPage()"
          @update:page-size="pageSize = $event; resetPage()"
          @export="handleExport"
        >
          <template #actions>
            <nuxt-link to="/admin/products/create" class="admin-primary-button">
              <i class="bi bi-plus-lg"></i>
              <span>{{ $t('admin.products.addProduct') }}</span>
            </nuxt-link>
          </template>
        </AdminTableToolbar>
      </template>

      <template #cell-name="{ item }">
        <div class="product-cell">
          <img :src="item.image" :alt="item.name" class="product-thumb" />
          <div class="product-info">
            <strong>{{ item.name }}</strong>
            <small>{{ item.vendor }}</small>
          </div>
        </div>
      </template>

      <template #cell-categoryName="{ item }">
        <span class="category-pill">
          <i class="bi" :class="item.categoryIcon"></i>
          {{ item.categoryName }}
        </span>
      </template>

      <template #cell-stockEnabled="{ item }">
        <label class="stock-toggle" @click.stop>
          <input type="checkbox" :checked="item.stockEnabled" @change="toggleStock(item)" />
          <span class="toggle-track"></span>
        </label>
      </template>

      <template #cell-sku="{ item }">
        <code class="sku-code">{{ item.sku }}</code>
      </template>

      <template #cell-price="{ item }">
        <div>
          <strong>{{ formatCurrency(item.price) }}</strong>
          <small v-if="item.compareAtPrice" class="compare-price">{{ formatCurrency(item.compareAtPrice) }}</small>
        </div>
      </template>

      <template #cell-quantity="{ item }">
        <span :class="qtyClass(item)">{{ item.quantity }}</span>
      </template>

      <template #cell-status="{ item }">
        <AdminStatusBadge :label="statusLabel(item.status)" :variant="statusVariant(item.status)" />
      </template>

      <template #actions="{ item }">
        <div class="action-buttons">
          <nuxt-link :to="`/admin/products/${item.id}/edit`" class="admin-icon-button" :title="$t('admin.products.edit')" @click.stop>
            <i class="bi bi-pencil"></i>
          </nuxt-link>
          <AdminActionMenu
            :items="[
              { key: 'view', label: t('admin.products.view'), icon: 'bi-eye' },
              { key: 'duplicate', label: t('admin.products.duplicate'), icon: 'bi-copy' },
              { key: 'delete', label: t('admin.products.delete'), icon: 'bi-trash', variant: 'danger' },
            ]"
            @select="handleAction($event, item)"
          />
        </div>
      </template>

      <template #pagination>
        <AdminPagination
          :page="page"
          :page-size="pageSize"
          :total="totalProducts"
          @update:page="changePage"
        />
      </template>
    </AdminDataTable>

    <!-- Mobile Card List -->
    <div v-if="isMobile" class="admin-card-shell" style="padding:14px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <label style="flex:1;position:relative">
          <i class="bi bi-search" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--admin-muted)"></i>
          <input class="admin-control" v-model="search" :placeholder="$t('admin.products.searchProduct')" style="padding-left:36px;width:100%" @input="resetPage">
        </label>
        <AdminMobileFilterSheet
          :filters="mobileFilters"
          @change="handleFilterChange"
          @reset="handleFilterReset"
        />
        <nuxt-link to="/admin/products/create" class="admin-primary-button" style="height:40px;white-space:nowrap"><i class="bi bi-plus-lg"></i></nuxt-link>
      </div>
      <AdminMobileCard
        v-for="item in products"
        :key="item.id"
        :title="item.name"
        :subtitle="item.vendor"
        :avatar="item.image"
        :meta="[
          { label: t('admin.products.price'), value: formatCurrency(item.price) },
          { label: t('admin.products.qty'), value: String(item.quantity), class: qtyClass(item) },
          { label: t('admin.products.sku'), value: item.sku },
        ]"
        @click="navigateToEdit(item)"
      >
        <template #badge>
          <AdminStatusBadge :label="statusLabel(item.status)" :variant="statusVariant(item.status)" />
        </template>
        <template #actions>
          <AdminActionMenu
            :items="[
              { key: 'view', label: t('admin.products.view'), icon: 'bi-eye' },
              { key: 'duplicate', label: t('admin.products.duplicate'), icon: 'bi-copy' },
              { key: 'delete', label: t('admin.products.delete'), icon: 'bi-trash', variant: 'danger' },
            ]"
            @select="handleAction($event, item)"
          />
        </template>
      </AdminMobileCard>
      <div v-if="totalProducts > pageSize" style="text-align:center;padding:8px">
        <button v-if="page * pageSize < totalProducts" class="admin-secondary-button" @click="page++; loadProducts()">{{ $t('admin.products.loadMore') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useHead, useRouter, useI18n } from '#imports'
import { useAdminStore } from '@/stores/adminStore'
import { usePaginationStore } from '@/stores/paginationStore'
import { useUiStore } from '@/stores/uiStore'
import AdminDataTable from '@/components/Admin/ui/AdminDataTable.vue'
import AdminTableToolbar from '@/components/Admin/ui/AdminTableToolbar.vue'
import AdminPagination from '@/components/Admin/ui/AdminPagination.vue'
import AdminMetricCard from '@/components/Admin/ui/AdminMetricCard.vue'
import AdminStatusBadge from '@/components/Admin/ui/AdminStatusBadge.vue'
import AdminActionMenu from '@/components/Admin/ui/AdminActionMenu.vue'
import AdminMobileCard from '@/components/Admin/ui/AdminMobileCard.vue'
import AdminMobileFilterSheet from '@/components/Admin/ui/AdminMobileFilterSheet.vue'
import { useMediaQuery } from '@/composables/useMediaQuery'

const { t } = useI18n()
const isMobile = useMediaQuery('(max-width: 767px)')

definePageMeta({ layout: 'admin' })
useHead({ title: () => t('admin.products.headTitle') })

const router = useRouter()
const admin = useAdminStore()
const paginationStore = usePaginationStore()
const ui = useUiStore()

/* ── Reactive data ── */
const products = ref([])
const categories = ref([])
const salesChannels = ref([])
const totalProducts = ref(0)

/* ── state ── */
const search = ref('')
const statusFilter = ref('all')
const categoryFilter = ref('all')
const stockFilter = ref('all')
const page = ref(1)
const pageSize = ref(10)
const selectedIds = ref([])

/* ── API→UI Mapping ── */
const mapProduct = (p) => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  sku: p.sku || '—',
  image: p.thumbnail || '/images/placeholder-product.png',
  vendor: p.vendor?.shop_name || '—',
  price: p.price,
  compareAtPrice: p.compare_at_price || null,
  quantity: p.stock ?? 0,
  sales: p.sales_count ?? 0,
  revenue: p.revenue ?? 0,
  status: p.is_active ? 'publish' : 'inactive',
  stockState: p.stock_status,
  stockEnabled: p.stock_status !== 'out_of_stock',
  categoryName: p.category?.name || '—',
  categoryId: p.category_id,
  categoryIcon: 'bi-tag',
})

/* ── Data Loading ── */
const loadProducts = async () => {
  const params = {
    per_page: pageSize.value,
    page: page.value,
  }
  if (search.value) params.search = search.value
  if (statusFilter.value !== 'all') {
    params.is_active = statusFilter.value === 'publish' ? 1 : 0
  }
  if (categoryFilter.value !== 'all') {
    const cat = categories.value.find(c => c.name === categoryFilter.value)
    if (cat) params.category_id = cat.id
  }
  if (stockFilter.value !== 'all') params.stock_status = stockFilter.value

  const res = await admin.fetchList('products', params)
  if (res?.data) {
    products.value = res.data.map(mapProduct)
    totalProducts.value = res.meta?.total ?? res.data.length
  }
}

const loadCategories = async () => {
  const res = await admin.fetchList('categories', { per_page: 100 })
  if (res?.data) {
    categories.value = res.data.map(c => ({ id: c.id, name: c.name }))
  }
}

const loadSalesStats = async () => {
  const res = await admin.fetchOne('products/stats')
  if (res?.data) {
    salesChannels.value = [
      { label: t('admin.products.totalProducts'), value: res.data.total_products ?? 0, orders: res.data.active_products ?? 0, change: 0, icon: 'bi-box-seam', variant: 'primary' },
      { label: t('admin.products.active'), value: res.data.active_products ?? 0, orders: 0, change: 0, icon: 'bi-check-circle', variant: 'success' },
      { label: t('admin.products.lowStock'), value: res.data.low_stock ?? 0, orders: 0, change: 0, icon: 'bi-exclamation-triangle', variant: 'warning' },
      { label: t('admin.products.outOfStock'), value: res.data.out_of_stock ?? 0, orders: 0, change: 0, icon: 'bi-x-circle', variant: 'danger' },
    ]
  }
}

/* ── Lifecycle ── */
onMounted(async () => {
  await Promise.all([loadProducts(), loadCategories(), loadSalesStats()])
})

/* ── Page / filter changes ── */
const resetPage = () => {
  page.value = 1
  loadProducts()
}

const changePage = (newPage) => {
  page.value = newPage
  loadProducts()
}

/* ── Debounced search ── */
let searchTimer = null
watch(search, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    page.value = 1
    loadProducts()
  }, 300)
})

/* ── mobile filters ── */
const mobileFilters = computed(() => [
  {
    key: 'status', label: t('admin.products.filterStatusLabel'), value: statusFilter.value, defaultValue: 'all',
    options: [
      { value: 'all', label: t('admin.products.allStatus') },
      { value: 'publish', label: t('admin.products.published') },
      { value: 'inactive', label: t('admin.products.inactive') },
    ],
  },
  {
    key: 'category', label: t('admin.products.filterCategoryLabel'), value: categoryFilter.value, defaultValue: 'all',
    options: [
      { value: 'all', label: t('admin.products.allCategories') },
      ...categories.value.map(c => ({ value: c.name, label: c.name })),
    ],
  },
  {
    key: 'stock', label: t('admin.products.filterStockLabel'), value: stockFilter.value, defaultValue: 'all',
    options: [
      { value: 'all', label: t('admin.products.allStock') },
      { value: 'in_stock', label: t('admin.products.inStock') },
      { value: 'low_stock', label: t('admin.products.lowStock') },
      { value: 'out_of_stock', label: t('admin.products.outOfStock') },
    ],
  },
])

const handleFilterChange = ({ key, value }) => {
  if (key === 'status') statusFilter.value = value
  else if (key === 'category') categoryFilter.value = value
  else if (key === 'stock') stockFilter.value = value
  resetPage()
}

const handleFilterReset = () => {
  statusFilter.value = 'all'
  categoryFilter.value = 'all'
  stockFilter.value = 'all'
  resetPage()
}

/* ── columns ── */
const columns = computed(() => [
  { key: 'name', label: t('admin.products.product'), width: '28%' },
  { key: 'categoryName', label: t('admin.products.category') },
  { key: 'stockEnabled', label: t('admin.products.stock'), width: '80px', align: 'center' },
  { key: 'sku', label: t('admin.products.sku') },
  { key: 'price', label: t('admin.products.price') },
  { key: 'quantity', label: t('admin.products.qty'), width: '70px', align: 'center' },
  { key: 'status', label: t('admin.products.status') },
])

/* ── helpers ── */
const formatCompact = (n) => {
  if (n >= 1_000_000_000) return '₫' + (n / 1_000_000_000).toFixed(1) + 'B'
  if (n >= 1_000_000) return '₫' + (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return '₫' + (n / 1_000).toFixed(1) + 'K'
  return '₫' + String(n)
}

const formatCurrency = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)

const statusLabel = (s) => ({
  publish: t('admin.products.published'),
  scheduled: t('admin.products.scheduled'),
  inactive: t('admin.products.inactive'),
  draft: t('admin.products.draft'),
}[s] || s)
const statusVariant = (s) => ({ publish: 'success', scheduled: 'warning', inactive: 'danger', draft: 'neutral' }[s] || 'neutral')

const qtyClass = (item) => {
  if (item.quantity === 0) return 'qty-danger'
  if (item.quantity < 50) return 'qty-warning'
  return 'qty-ok'
}

const toggleStock = async (item) => {
  try {
    await admin.patch('products', item.id, { is_active: !item.stockEnabled })
    item.stockEnabled = !item.stockEnabled
  } catch (e) {
    console.error('Toggle stock failed:', e.message)
  }
}

const navigateToEdit = (item) => router.push(`/admin/products/${item.id}/edit`)
const handleExport = () => alert(t('admin.products.exportTriggered'))
const handleAction = async (action, item) => {
  if (action.key === 'delete') {
    if (!confirm(t('admin.products.deleteConfirm', { name: item.name }))) return
    try {
      await admin.remove('products', item.id)
      loadProducts()
    } catch (e) {
      alert(t('admin.products.deleteFailed', { message: e.message }))
    }
  } else if (action.key === 'duplicate') {
    alert(t('admin.products.duplicateAction', { id: item.id }))
  } else {
    router.push(`/admin/products/${item.id}/edit`)
  }
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
@media screen and (max-width: 1199.98px) {
  .metric-strip { grid-template-columns: repeat(2, 1fr); }
}
@media screen and (max-width: 767.98px) {
  .metric-strip { grid-template-columns: 1fr; }
  .filters-grid { grid-template-columns: 1fr; }
}
</style>
