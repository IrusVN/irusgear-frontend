<template>
  <div class="mobile-used-section">
    <div class="mobile-used-header">
      <h2 class="mobile-used-title">HÀNG CŨ</h2>
      <NuxtLink to="/products?condition=used" class="mobile-used-view-all">
        Xem tất cả <i class="bi bi-chevron-right"></i>
      </NuxtLink>
    </div>

    <div class="mobile-used-grid">
      <NuxtLink
        v-for="item in usedItems"
        :key="item.href"
        :to="item.href"
        class="mobile-used-item"
      >
        <div class="mobile-used-img-box">
          <img :src="item.image" :alt="item.title" class="mobile-used-img" loading="lazy" />
        </div>
        <span class="mobile-used-name">{{ item.title }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const usedItems = [
  {
    title: 'Điện thoại cũ',
    href: '/hang-cu/dien-thoai.html',
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6FCHN1CX574BKJDSX3XTV0Z.png',
  },
  {
    title: 'Máy tính bảng cũ',
    href: '/hang-cu/may-tinh-bang.html',
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6FCHNEN2HYY96910SE6P5CX.png',
  },
  {
    title: 'MacBook cũ',
    href: '/hang-cu/mac.html',
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6FCHNKVTJ1GTEQVKXBVPHVK.png',
  },
  {
    title: 'Laptop cũ',
    href: '/hang-cu/laptop.html',
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6FCHNPGC65TPCJ4WCMBMWFQ.png',
  },
  {
    title: 'Tai nghe cũ',
    href: '/hang-cu/tai-nghe.html',
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6FCHNSHME314PFV4CS149PF.png',
  },
  {
    title: 'Loa cũ',
    href: '/hang-cu/loa.html',
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6FCHNWWHR58EFPQMW478WE8.png',
  },
  {
    title: 'Đồng hồ cũ',
    href: '/hang-cu/dong-ho-thong-minh.html',
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6FCHP0S6KFMG1WQC3ATY7W9.png',
  },
  {
    title: 'Đồ gia dụng cũ',
    href: '/hang-cu/do-gia-dung.html',
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6F9S2R1MRJKN8S46YXGE197.png',
  },
  {
    title: 'Phụ kiện cũ',
    href: '/hang-cu/phu-kien.html',
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6FCHP4WXYP5MVQ0RN85RND2.png',
  },
  {
    title: 'Màn hình cũ',
    href: '/hang-cu/man-hinh.html',
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6FCHP91VN84H4GS1KNY86KA.png',
  },
  {
    title: 'Tivi cũ',
    href: '/hang-cu/tivi.html',
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6F9S3JQH0CMJDFZAR5C1589.png',
  },
  {
    title: 'Cáp sạc cũ',
    href: '/hang-cu/phu-kien/cap-sac.html',
    image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6FCHPE4CGXKHP6ZD2MBVYZ4.png',
  },
]
</script>

<style scoped>
.mobile-used-section {
  margin: 12px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.mobile-used-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 14px 0;
}

.mobile-used-title {
  font-size: 1rem;
  font-weight: 800;
  color: #1f2937;
  margin: 0;
  letter-spacing: 0.01em;
}

.mobile-used-view-all {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  color: #2563eb;
  font-size: 0.78rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
}

.mobile-used-view-all:hover {
  color: #1d4ed8;
}

.mobile-used-view-all i {
  font-size: 0.68rem;
}

/* ─── 3-column grid ─── */
.mobile-used-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 10px 8px 6px;
  gap: 2px;
}

.mobile-used-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 4px;
  text-decoration: none;
  color: #1f2937;
  border-radius: 8px;
  transition: background 0.12s;
}

.mobile-used-item:active {
  background: #f9fafb;
}

.mobile-used-img-box {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border-radius: 10px;
  border: 1px solid #f0f0f0;
  overflow: hidden;
}

.mobile-used-img {
  width: 52px;
  height: 52px;
  object-fit: contain;
}

.mobile-used-name {
  font-size: 0.65rem;
  font-weight: 600;
  text-align: center;
  line-height: 1.25;
  color: #374151;
  max-width: 80px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
