<template>
  <div class="mobile-category-bar">
    <div class="mobile-category-grid">
      <NuxtLink
        v-for="cat in categories"
        :key="cat.key"
        :to="`/products?category=${cat.key}`"
        class="mobile-category-item"
      >
        <span class="mobile-category-icon-wrap">
          <i :class="['bi', cat.icon]"></i>
        </span>
        <span class="mobile-category-label">{{ cat.name }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const categories = [
  { key: 'dien-thoai', name: 'Điện thoại', icon: 'bi-phone' },
  { key: 'may-tinh-bang', name: 'Tablet', icon: 'bi-tablet' },
  { key: 'laptop', name: 'Laptop', icon: 'bi-laptop' },
  { key: 'dong-ho', name: 'Đồng hồ', icon: 'bi-smartwatch' },
  { key: 'am-thanh', name: 'Âm thanh', icon: 'bi-headphones' },
  { key: 'phu-kien', name: 'Phụ kiện', icon: 'bi-earbuds' },
  { key: 'pc', name: 'PC', icon: 'bi-pc-display' },
  { key: 'tivi', name: 'Tivi', icon: 'bi-display' },
  { key: 'thu-cu', name: 'Thu cũ', icon: 'bi-repeat' },
  { key: 'hang-cu', name: 'Hàng cũ', icon: 'bi-box-seam' },
  { key: 'khuyen-mai', name: 'Khuyến mãi', icon: 'bi-patch-check' },
  { key: 'do-gia-dung', name: 'Gia dụng', icon: 'bi-house' },
]
</script>

<style scoped>
.mobile-category-bar {
  background: #fff;
  border-radius: 12px;
  padding: 12px 8px;
  margin: 0 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.mobile-category-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(2, auto);
  gap: 6px 0;
}

.mobile-category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px 2px;
  text-decoration: none;
  color: #1f2937;
  border-radius: 10px;
  transition: background 0.15s;
}

.mobile-category-item:hover,
.mobile-category-item:active {
  background: #f3f4f6;
}

.mobile-category-icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #374151;
  transition: transform 0.15s, box-shadow 0.15s;
}

.mobile-category-item:active .mobile-category-icon-wrap {
  transform: scale(0.92);
}

.mobile-category-label {
  font-size: 0.65rem;
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
  color: #374151;
  max-width: 56px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
