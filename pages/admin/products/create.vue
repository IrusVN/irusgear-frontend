<template>
  <div class="product-form-page">
    <!-- Header -->
    <div class="form-page-header">
      <div class="header-left">
        <nuxt-link to="/admin/products" class="back-link">
          <i class="bi bi-arrow-left"></i>
        </nuxt-link>
        <div>
          <h2 class="page-title">Add Product</h2>
          <p class="page-sub">Create a new product for your store</p>
        </div>
      </div>
      <div class="header-actions">
        <button class="admin-secondary-button" type="button" @click="handleDiscard">Discard</button>
        <button class="admin-secondary-button" type="button" @click="handleSaveDraft">Save Draft</button>
        <button class="admin-primary-button" type="button" @click="handlePublish">
          <i class="bi bi-check-lg"></i> Publish Product
        </button>
      </div>
    </div>

    <!-- Two-column layout -->
    <div class="form-grid">
      <!-- LEFT COLUMN -->
      <div class="form-col-left">
        <!-- Basic Information -->
        <div class="admin-card-shell form-card">
          <h3 class="card-title">Basic Information</h3>
          <div class="field">
            <label class="field-label">Product Name <span class="req">*</span></label>
            <input v-model="form.name" type="text" class="admin-control field-input" placeholder="e.g. iPhone 15 Pro Max" @input="autoSlug" />
            <p v-if="errors.name" class="field-error">{{ errors.name }}</p>
          </div>
          <div class="field">
            <label class="field-label">Slug</label>
            <input v-model="form.slug" type="text" class="admin-control field-input" placeholder="iphone-15-pro-max" />
          </div>
          <div class="field-row">
            <div class="field">
              <label class="field-label">SKU <span class="req">*</span></label>
              <input v-model="form.sku" type="text" class="admin-control field-input" placeholder="IRG-00001" />
              <p v-if="errors.sku" class="field-error">{{ errors.sku }}</p>
            </div>
            <div class="field">
              <label class="field-label">Vendor</label>
              <input v-model="form.vendor" type="text" class="admin-control field-input" placeholder="IrusGear" />
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="admin-card-shell form-card">
          <h3 class="card-title">Description</h3>
          <div class="field">
            <label class="field-label">Product Description</label>
            <textarea v-model="form.description" class="admin-control field-textarea" rows="5" placeholder="Write a detailed description..."></textarea>
          </div>
        </div>

        <!-- Media -->
        <div class="admin-card-shell form-card">
          <h3 class="card-title">Media</h3>
          <div class="media-upload-zone" @click="triggerUpload" @dragover.prevent @drop.prevent="handleDrop">
            <i class="bi bi-cloud-arrow-up upload-icon"></i>
            <p class="upload-text">Drag and drop or <span class="upload-link">browse</span> to upload</p>
            <small class="upload-hint">PNG, JPG, WEBP up to 5MB</small>
            <input ref="fileInput" type="file" accept="image/*" multiple hidden @change="handleFileSelect" />
          </div>
          <div v-if="form.images.length" class="media-preview-grid">
            <div v-for="(img, idx) in form.images" :key="idx" class="media-preview-item">
              <img :src="img" alt="Product image" />
              <button class="media-remove" type="button" @click="removeImage(idx)">
                <i class="bi bi-x"></i>
              </button>
              <span v-if="idx === 0" class="media-primary-badge">Primary</span>
            </div>
          </div>
        </div>

        <!-- Variants (placeholder) -->
        <div class="admin-card-shell form-card">
          <div class="card-header-row">
            <h3 class="card-title">Variants</h3>
            <button class="admin-secondary-button btn-sm" type="button">
              <i class="bi bi-plus-lg"></i> Add Variant
            </button>
          </div>
          <div class="empty-variants">
            <i class="bi bi-diagram-3"></i>
            <p>No variants added yet</p>
            <small>Add variants like size, color, or material</small>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="form-col-right">
        <!-- Pricing -->
        <div class="admin-card-shell form-card">
          <h3 class="card-title">Pricing</h3>
          <div class="field">
            <label class="field-label">Price <span class="req">*</span></label>
            <div class="input-with-prefix">
              <span class="input-prefix">₫</span>
              <input v-model.number="form.price" type="number" class="admin-control field-input has-prefix" placeholder="0" />
            </div>
            <p v-if="errors.price" class="field-error">{{ errors.price }}</p>
          </div>
          <div class="field">
            <label class="field-label">Compare at Price</label>
            <div class="input-with-prefix">
              <span class="input-prefix">₫</span>
              <input v-model.number="form.compareAtPrice" type="number" class="admin-control field-input has-prefix" placeholder="0" />
            </div>
          </div>
        </div>

        <!-- Inventory -->
        <div class="admin-card-shell form-card">
          <h3 class="card-title">Inventory</h3>
          <div class="field">
            <label class="field-label">Quantity</label>
            <input v-model.number="form.quantity" type="number" class="admin-control field-input" placeholder="0" min="0" />
          </div>
          <div class="toggle-field">
            <div class="toggle-info">
              <strong>Track inventory</strong>
              <small>Enable stock management for this product</small>
            </div>
            <label class="stock-toggle">
              <input v-model="form.stockEnabled" type="checkbox" />
              <span class="toggle-track"></span>
            </label>
          </div>
        </div>

        <!-- Category -->
        <div class="admin-card-shell form-card">
          <h3 class="card-title">Category</h3>
          <div class="field">
            <label class="field-label">Product Category</label>
            <select v-model.number="form.categoryId" class="admin-control field-input">
              <option :value="0" disabled>Select a category</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div class="toggle-field">
            <div class="toggle-info">
              <strong>Featured product</strong>
              <small>Show in featured sections</small>
            </div>
            <label class="stock-toggle">
              <input v-model="form.featured" type="checkbox" />
              <span class="toggle-track"></span>
            </label>
          </div>
        </div>

        <!-- Publish Status -->
        <div class="admin-card-shell form-card">
          <h3 class="card-title">Status</h3>
          <div class="field">
            <label class="field-label">Product Status</label>
            <select v-model="form.status" class="admin-control field-input">
              <option value="draft">Draft</option>
              <option value="publish">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div class="status-indicator">
            <AdminStatusBadge :label="statusLabel(form.status)" :variant="statusVariant(form.status)" />
          </div>
        </div>

        <!-- SEO Preview -->
        <div class="admin-card-shell form-card">
          <h3 class="card-title">SEO Preview</h3>
          <div class="seo-preview">
            <p class="seo-title">{{ form.name || 'Product Name' }} – IrusGear</p>
            <p class="seo-url">irusgear.com/products/{{ form.slug || 'product-slug' }}</p>
            <p class="seo-desc">{{ form.description ? form.description.substring(0, 160) : 'Product description will appear here...' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useHead, useRouter } from '#imports'
import { useAdminStore } from '@/stores/adminStore'
import { useUiStore } from '@/stores/uiStore'
import AdminStatusBadge from '@/components/Admin/ui/AdminStatusBadge.vue'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Add Product – IrusGear Admin' })

const router = useRouter()
const admin = useAdminStore()
const ui = useUiStore()

const categories = ref([])
const fileInput = ref(null)

const form = reactive({
  name: '',
  slug: '',
  sku: '',
  vendor: 'IrusGear',
  description: '',
  price: null,
  compareAtPrice: null,
  quantity: 0,
  stockEnabled: true,
  categoryId: 0,
  featured: false,
  status: 'draft',
  images: [],
})

const errors = reactive({ name: '', sku: '', price: '' })

/* ── Load categories from API ── */
onMounted(async () => {
  const res = await admin.fetchList('categories', { per_page: 100 })
  if (res?.data) {
    categories.value = res.data.map(c => ({ id: c.id, name: c.name }))
  }
})

const autoSlug = () => {
  form.slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const validate = () => {
  let valid = true
  errors.name = ''; errors.sku = ''; errors.price = ''
  if (!form.name.trim()) { errors.name = 'Product name is required'; valid = false }
  if (!form.sku.trim()) { errors.sku = 'SKU is required'; valid = false }
  if (!form.price || form.price <= 0) { errors.price = 'Price must be greater than 0'; valid = false }
  return valid
}

const statusLabel = (s) => ({ publish: 'Published', scheduled: 'Scheduled', inactive: 'Inactive', draft: 'Draft' }[s] || s)
const statusVariant = (s) => ({ publish: 'success', scheduled: 'warning', inactive: 'danger', draft: 'neutral' }[s] || 'neutral')

const triggerUpload = () => fileInput.value?.click()
const handleFileSelect = (e) => {
  for (const file of e.target.files) {
    form.images.push(URL.createObjectURL(file))
  }
}
const handleDrop = (e) => {
  for (const file of e.dataTransfer.files) {
    if (file.type.startsWith('image/')) form.images.push(URL.createObjectURL(file))
  }
}
const removeImage = (idx) => form.images.splice(idx, 1)

/**
 * Build payload to match backend API expectations.
 */
const buildPayload = (publishStatus) => ({
  name: form.name,
  slug: form.slug || undefined,
  description: form.description || undefined,
  price: form.price,
  stock: form.quantity,
  category_id: form.categoryId || undefined,
  is_active: publishStatus === 'publish',
})

const handlePublish = async () => {
  if (!validate()) return
  try {
    await admin.create('products', buildPayload('publish'))
    router.push('/admin/products')
  } catch (e) {
    alert(`Failed to publish: ${e.message}`)
  }
}
const handleSaveDraft = async () => {
  if (!validate()) return
  try {
    await admin.create('products', buildPayload('draft'))
    router.push('/admin/products')
  } catch (e) {
    alert(`Failed to save draft: ${e.message}`)
  }
}
const handleDiscard = () => router.push('/admin/products')
</script>

<style scoped>
.product-form-page { max-width: 1560px; }

/* Header */
.form-page-header {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  margin-bottom: 24px; flex-wrap: wrap;
}
.header-left { display: flex; align-items: center; gap: 14px; }
.back-link {
  width: 40px; height: 40px; border-radius: 8px; background: var(--admin-surface);
  border: 1px solid var(--admin-border); display: flex; align-items: center; justify-content: center;
  color: var(--admin-text); text-decoration: none; font-size: 1.1rem; transition: background 0.15s;
}
.back-link:hover { background: var(--admin-surface-soft); }
.page-title { margin: 0; font-size: 1.25rem; font-weight: 700; color: var(--admin-text); }
.page-sub { margin: 2px 0 0; color: var(--admin-muted); font-size: 0.88rem; }
.header-actions { display: flex; align-items: center; gap: 10px; }

/* Grid */
.form-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 20px; }
.form-col-left, .form-col-right { display: flex; flex-direction: column; gap: 20px; }

/* Card */
.form-card { padding: 22px; }
.card-title { margin: 0 0 18px; font-size: 1rem; font-weight: 700; color: var(--admin-text); }
.card-header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.card-header-row .card-title { margin: 0; }

/* Fields */
.field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.field:last-child { margin-bottom: 0; }
.field-label { font-size: 0.82rem; font-weight: 600; color: var(--admin-muted); text-transform: uppercase; letter-spacing: 0.03em; }
.req { color: var(--admin-danger); }
.field-input { width: 100%; }
.field-textarea {
  width: 100%; min-height: 100px; padding: 10px 12px; resize: vertical;
  border: 1px solid var(--admin-border); border-radius: 7px; background: #fff;
  color: var(--admin-text); outline: 0; font-family: inherit; font-size: 0.92rem;
}
.field-textarea:focus { border-color: var(--admin-primary); }
.field-error { margin: 0; color: var(--admin-danger); font-size: 0.8rem; font-weight: 500; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

/* Input with prefix */
.input-with-prefix { position: relative; }
.input-prefix {
  position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
  color: var(--admin-muted); font-weight: 600; font-size: 0.9rem; pointer-events: none;
}
.has-prefix { padding-left: 30px !important; }

/* Toggle */
.toggle-field {
  display: flex; align-items: center; justify-content: space-between; gap: 14px;
  padding: 14px 0; border-top: 1px solid var(--admin-border);
}
.toggle-info strong { display: block; font-size: 0.9rem; color: var(--admin-text); }
.toggle-info small { color: var(--admin-muted); font-size: 0.8rem; }
.stock-toggle { position: relative; display: inline-flex; align-items: center; cursor: pointer; }
.stock-toggle input { position: absolute; opacity: 0; width: 0; height: 0; }
.toggle-track {
  width: 38px; height: 22px; border-radius: 999px; background: #d5d5da;
  transition: background 0.2s ease; position: relative;
}
.toggle-track::after {
  content: ''; position: absolute; top: 3px; left: 3px;
  width: 16px; height: 16px; border-radius: 999px; background: #fff;
  transition: transform 0.2s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}
.stock-toggle input:checked + .toggle-track { background: var(--admin-success); }
.stock-toggle input:checked + .toggle-track::after { transform: translateX(16px); }

/* Status */
.status-indicator { padding-top: 10px; }

/* Media upload */
.media-upload-zone {
  border: 2px dashed var(--admin-border); border-radius: 10px; padding: 32px 20px;
  display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.media-upload-zone:hover { border-color: var(--admin-muted); background: var(--admin-surface-soft); }
.upload-icon { font-size: 2.2rem; color: var(--admin-muted); }
.upload-text { margin: 0; color: var(--admin-text); font-size: 0.9rem; }
.upload-link { color: var(--admin-primary); font-weight: 600; text-decoration: underline; }
.upload-hint { color: var(--admin-subtle); font-size: 0.8rem; }

.media-preview-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); gap: 10px; margin-top: 14px; }
.media-preview-item {
  position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden;
  border: 1px solid var(--admin-border);
}
.media-preview-item img { width: 100%; height: 100%; object-fit: cover; }
.media-remove {
  position: absolute; top: 4px; right: 4px; width: 22px; height: 22px; border-radius: 999px;
  background: rgba(0,0,0,0.6); color: #fff; border: 0; display: flex; align-items: center;
  justify-content: center; font-size: 0.75rem; cursor: pointer; opacity: 0; transition: opacity 0.15s;
}
.media-preview-item:hover .media-remove { opacity: 1; }
.media-primary-badge {
  position: absolute; bottom: 4px; left: 4px; padding: 2px 7px; border-radius: 4px;
  background: rgba(0,0,0,0.65); color: #fff; font-size: 0.68rem; font-weight: 700;
}

/* Empty variants */
.empty-variants {
  text-align: center; padding: 28px 16px; color: var(--admin-muted);
}
.empty-variants i { font-size: 2rem; margin-bottom: 8px; display: block; }
.empty-variants p { margin: 0; font-weight: 600; color: var(--admin-text); font-size: 0.92rem; }
.empty-variants small { font-size: 0.82rem; }

/* SEO Preview */
.seo-preview {
  border: 1px solid var(--admin-border); border-radius: 8px; padding: 16px; background: var(--admin-surface-soft);
}
.seo-title { margin: 0 0 2px; color: #1a0dab; font-size: 1rem; font-weight: 500; }
.seo-url { margin: 0 0 4px; color: #006621; font-size: 0.82rem; }
.seo-desc { margin: 0; color: #545454; font-size: 0.84rem; line-height: 1.5; }

/* Button sm */
.btn-sm { height: 34px; font-size: 0.82rem; padding: 0 12px; }

/* Responsive */
@media screen and (max-width: 991.98px) {
  .form-grid { grid-template-columns: 1fr; }
  .form-page-header { flex-direction: column; align-items: flex-start; }
  .header-actions { width: 100%; flex-wrap: wrap; }
  .field-row { grid-template-columns: 1fr; }
}

@media screen and (max-width: 767.98px) {
  .form-card { padding: 16px; }
  .card-title { font-size: 0.92rem; margin-bottom: 14px; }
  .page-title { font-size: 1.1rem; }
  .page-sub { font-size: 0.82rem; }

  /* Touch-friendly inputs */
  .field-input,
  .field-textarea,
  .admin-control {
    min-height: 44px;
    font-size: 16px; /* prevents iOS zoom */
  }

  /* Full-width action buttons */
  .header-actions {
    flex-direction: column;
  }
  .header-actions .admin-primary-button,
  .header-actions .admin-secondary-button {
    width: 100%;
    justify-content: center;
    min-height: 44px;
  }

  /* Media upload compact */
  .media-upload-zone { padding: 22px 14px; }
  .upload-icon { font-size: 1.8rem; }
  .media-preview-grid { grid-template-columns: repeat(3, 1fr); }
  .media-remove { opacity: 1; } /* always visible on touch */

  /* Toggle touch-friendly */
  .toggle-track { width: 44px; height: 26px; }
  .toggle-track::after { width: 20px; height: 20px; }
  .stock-toggle input:checked + .toggle-track::after { transform: translateX(18px); }

  /* Compact empty state */
  .empty-variants { padding: 20px 14px; }
  .empty-variants i { font-size: 1.6rem; }

  /* Back link touch target */
  .back-link { width: 44px; height: 44px; }
}
</style>
