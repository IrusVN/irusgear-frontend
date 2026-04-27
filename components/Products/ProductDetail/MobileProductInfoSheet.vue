<template>
  <BottomSheet ref="sheetRef" @close="handleClose">
    <div class="mobile-info-sheet">
      <div class="sheet-header">
        <div class="product-summary">
          <img
            :src="productImage"
            width="56"
            height="56"
            :alt="productName"
            class="product-thumb"
            loading="lazy"
          />
          <div class="product-meta">
            <p class="product-name">{{ productName }}</p>
            <p class="product-price">
              <strong class="sale-price">{{ salePrice }}</strong>
              <del v-if="showBasePrice" class="base-price ms-2">{{ basePrice }}</del>
            </p>
          </div>
        </div>
      </div>

      <div v-if="storageOptions.length" class="sheet-section">
        <p class="section-label">Phiên bản</p>
        <div class="option-buttons">
          <button
            v-for="storage in storageOptions"
            :key="storage.id"
            type="button"
            class="option-btn"
            :class="{ active: storage.active }"
            @click="handleChangeStorage(storage)"
          >
            {{ storage.label }}
          </button>
        </div>
      </div>

      <div v-if="colorOptions.length" class="sheet-section">
        <p class="section-label">Màu sắc</p>
        <div class="color-buttons">
          <button
            v-for="color in colorOptions"
            :key="color.id"
            type="button"
            class="color-btn"
            :class="{ active: color.active, disabled: color.disabled }"
            :title="color.name"
            :disabled="color.disabled"
            @click="handleChangeColor(color)"
          >
            <img :src="color.thumbnail" :alt="color.name" width="32" height="32" />
            <span class="color-name">{{ color.name }}</span>
          </button>
        </div>
      </div>

      <div class="sheet-actions">
        <button
          type="button"
          class="action-btn action-btn--outline"
          :disabled="cartBusy"
          @click="addCurrentProductToCart"
        >
          Thêm vào giỏ
        </button>
        <button
          type="button"
          class="action-btn action-btn--primary"
          :disabled="cartBusy"
          @click="buyCurrentProductNow"
        >
          Mua ngay
        </button>
      </div>
    </div>
  </BottomSheet>
</template>

<script setup>
import { computed, ref } from "vue"
import { storeToRefs } from "pinia"
import BottomSheet from "@/components/Common/BottomSheet.vue"
import { useProductStore } from "@/stores/productStore"
import { useCartActions } from "@/composables/useCartActions"

const productStore = useProductStore()
const { cartBusy, addCurrentProductToCart, buyCurrentProductNow } = useCartActions()
const { productDetail } = storeToRefs(productStore)

const sheetRef = ref(null)

const productName = computed(() => productDetail.value?.name || "")
const productImage = computed(
  () =>
    productDetail.value?.activeColor?.thumbnail ||
    productDetail.value?.gallery?.[0]?.thumbnail ||
    "",
)
const salePrice = computed(
  () => productDetail.value?.pricing?.salePrice?.formatted || "",
)
const basePrice = computed(
  () => productDetail.value?.pricing?.basePrice?.formatted || "",
)
const showBasePrice = computed(() => {
  const sale = Number(productDetail.value?.pricing?.salePrice?.value || 0)
  const base = Number(productDetail.value?.pricing?.basePrice?.value || 0)
  return base > sale && Boolean(basePrice.value)
})
const storageOptions = computed(() => productDetail.value?.storageOptions || [])
const colorOptions = computed(() => productDetail.value?.colorOptions || [])

const handleChangeStorage = (storage) => {
  if (!storage?.url) return
  const url = new URL(storage.url, window.location.origin)
  const slug = url.pathname.replace("/products/", "")
  const productId = url.searchParams.get("product_id")
  navigateTo(`/products/${slug}${productId ? `?product_id=${productId}` : ""}`)
}

const handleChangeColor = (color) => {
  if (color.disabled) return
  productStore.selectColorVariant(
    color.productId || color.id
      ? String(color.productId || color.id)
      : null,
  )
}

const handleClose = () => {
  sheetRef.value?.close()
}

defineExpose({
  open: () => sheetRef.value?.open(),
  close: () => sheetRef.value?.close(),
})
</script>

<style scoped>
.mobile-info-sheet {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sheet-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.product-summary {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.product-thumb {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  flex-shrink: 0;
}

.product-meta {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  margin: 0;
}

.sale-price {
  color: #d70018;
  font-size: 16px;
  font-weight: 700;
}

.base-price {
  color: #a1a1aa;
  font-size: 12px;
  text-decoration: line-through;
}

.sheet-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.option-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.option-btn {
  padding: 6px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}

.option-btn.active {
  border-color: #d70018;
  color: #d70018;
  background: #fff5f5;
}

.option-btn:hover:not(.active) {
  border-color: #3b82f6;
  color: #3b82f6;
}

.color-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.color-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px 6px 6px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.2s;
}

.color-btn img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 4px;
}

.color-btn .color-name {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.color-btn.active {
  border-color: #d70018;
}

.color-btn.active .color-name {
  color: #d70018;
}

.color-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.sheet-actions {
  display: flex;
  gap: 8px;
  padding-top: 4px;
}

.action-btn {
  flex: 1;
  height: 44px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
  border: none;
}

.action-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-btn--outline {
  background: #fff;
  border: 1px solid #d70018;
  color: #d70018;
}

.action-btn--primary {
  background: #d70018;
  color: #fff;
}
</style>
