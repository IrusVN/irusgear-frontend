<template>
  <div class="products-container">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold mb-1">Quản lý sản phẩm</h2>
        <p class="text-muted mb-0">Quản lý tất cả sản phẩm trong cửa hàng</p>
      </div>
      <button class="btn btn-dark">
        <i class="bi bi-plus-lg me-2"></i>
        Thêm sản phẩm
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-3 p-4 border mb-4">
      <div class="row g-3">
        <div class="col-12 col-md-4">
          <label class="form-label small fw-semibold">Tìm kiếm</label>
          <input 
            type="text" 
            class="form-control" 
            placeholder="Tìm theo tên, SKU..."
            v-model="searchQuery"
            @input="handleSearch"
          />
        </div>
        <div class="col-12 col-md-3">
          <label class="form-label small fw-semibold">Danh mục</label>
          <select class="form-select" v-model="categoryFilter" @change="handleFilterChange">
            <option :value="0">Tất cả danh mục</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }} ({{ cat.productCount }})
            </option>
          </select>
        </div>
        <div class="col-12 col-md-3">
          <label class="form-label small fw-semibold">Trạng thái</label>
          <select class="form-select" v-model="statusFilter" @change="handleFilterChange">
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang bán</option>
            <option value="inactive">Ngừng bán</option>
            <option value="out_of_stock">Hết hàng</option>
          </select>
        </div>
        <div class="col-12 col-md-2">
          <label class="form-label small fw-semibold">Nổi bật</label>
          <select class="form-select" v-model="featuredFilter" @change="handleFilterChange">
            <option value="">Tất cả</option>
            <option value="true">Có</option>
            <option value="false">Không</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="bg-white rounded-3 border p-4">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="products.length === 0" class="text-center text-muted py-5">
        <i class="bi bi-inbox fs-1 d-block mb-3"></i>
        Không tìm thấy sản phẩm nào
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th style="width: 80px"></th>
              <th>Sản phẩm</th>
              <th>SKU</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Trạng thái</th>
              <th class="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>
                <img :src="product.thumbnail" :alt="product.name" class="rounded" style="width: 60px; height: 60px; object-fit: cover;" />
              </td>
              <td>
                <div class="fw-semibold">{{ product.name }}</div>
                <small class="text-muted">{{ product.shortDescription }}</small>
                <div v-if="product.featured" class="mt-1">
                  <span class="badge bg-warning text-dark">
                    <i class="bi bi-star-fill"></i> Nổi bật
                  </span>
                </div>
              </td>
              <td>
                <code class="text-dark">{{ product.sku }}</code>
              </td>
              <td>{{ product.categoryName }}</td>
              <td>
                <div class="fw-semibold">{{ formatCurrency(product.salePrice || product.price) }}</div>
                <small v-if="product.salePrice" class="text-muted text-decoration-line-through">
                  {{ formatCurrency(product.price) }}
                </small>
              </td>
              <td>
                <span :class="product.stock > 10 ? 'text-success' : product.stock > 0 ? 'text-warning' : 'text-danger'">
                  {{ product.stock }}
                </span>
              </td>
              <td>
                <span class="badge" :class="getStatusBadgeClass(product.status)">
                  {{ getStatusText(product.status) }}
                </span>
              </td>
              <td class="text-center">
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-outline-primary" title="Sửa">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-outline-danger" title="Xóa">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
        <div class="text-muted small">
          Hiển thị {{ products.length }} / {{ total }} sản phẩm
        </div>
        <nav>
          <ul class="pagination pagination-sm mb-0">
            <li class="page-item" :class="{ disabled: page === 1 }">
              <button class="page-link" @click="changePage(page - 1)">
                <i class="bi bi-chevron-left"></i>
              </button>
            </li>
            <li 
              v-for="p in totalPages" 
              :key="p" 
              class="page-item" 
              :class="{ active: p === page }"
            >
              <button class="page-link" @click="changePage(p)">{{ p }}</button>
            </li>
            <li class="page-item" :class="{ disabled: page === totalPages }">
              <button class="page-link" @click="changePage(page + 1)">
                <i class="bi bi-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n, useHead } from '#imports'
import { productService } from '~/services/productService'
import type { Product, ProductCategory, ProductStatus } from '~/types/product'

definePageMeta({
  layout: 'admin',
})

const { t } = useI18n()
useHead({ title: 'Quản lý sản phẩm' })

const products = ref<Product[]>([])
const categories = ref<ProductCategory[]>([])
const total = ref(0)
const page = ref(1)
const totalPages = ref(0)
const loading = ref(false)

const searchQuery = ref('')
const categoryFilter = ref(0)
const statusFilter = ref<ProductStatus | 'all'>('all')
const featuredFilter = ref('')

let searchTimeout: NodeJS.Timeout

onMounted(async () => {
  await fetchCategories()
  await fetchProducts()
})

const fetchCategories = async () => {
  try {
    categories.value = await productService.getCategories()
  } catch (err) {
    console.error('Error fetching categories:', err)
  }
}

const fetchProducts = async () => {
  try {
    loading.value = true
    
    const response = await productService.getProducts({
      search: searchQuery.value,
      categoryId: categoryFilter.value || undefined,
      status: statusFilter.value,
      featured: featuredFilter.value ? featuredFilter.value === 'true' : undefined,
      page: page.value
    })
    
    products.value = response.products
    total.value = response.total
    totalPages.value = response.totalPages
  } catch (err) {
    console.error('Error fetching products:', err)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    handleFilterChange()
  }, 500)
}

const handleFilterChange = () => {
  page.value = 1
  fetchProducts()
}

const changePage = (newPage: number) => {
  if (newPage < 1 || newPage > totalPages.value) return
  page.value = newPage
  fetchProducts()
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const getStatusBadgeClass = (status: ProductStatus) => {
  const classes: Record<ProductStatus, string> = {
    active: 'bg-success',
    inactive: 'bg-secondary',
    out_of_stock: 'bg-danger'
  }
  return classes[status]
}

const getStatusText = (status: ProductStatus) => {
  const texts: Record<ProductStatus, string> = {
    active: 'Đang bán',
    inactive: 'Ngừng bán',
    out_of_stock: 'Hết hàng'
  }
  return texts[status]
}
</script>

<style scoped>
.products-container {
  max-width: 1400px;
}

.table th {
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

code {
  font-size: 0.875rem;
  padding: 2px 6px;
  background: #f8f9fa;
  border-radius: 4px;
}
</style>
