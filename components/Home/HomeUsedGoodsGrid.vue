<template>
  <div class="my-3 my-md-4">
    <section class="used-section text-neutral-800">
      <div class="d-flex align-items-center gap-3 used-header">
        <h2 class="mb-0 used-title">{{ $t('home.usedGoodsTitle') }}</h2>

        <div class="d-none d-md-block used-divider"></div>

        <div class="d-none d-md-flex gap-2"></div>

        <a :href="viewAllUrl" class="view-all-link text-decoration-none">
          Xem tất cả
          <i class="bi bi-chevron-right ms-1"></i>
        </a>
      </div>

      <div class="mt-2">
        <div class="used-surface animate-fade-in">
          <div class="used-grid-wrap position-relative bg-white">
            <a
              v-for="item in usedItems"
              :key="item.href"
              :href="item.href"
              class="used-item text-decoration-none text-dark"
            >
              <span class="used-image-wrap">
                <i :class="item.iconClass || 'bi bi-phone'" class="used-image bi" role="img" :aria-label="item.title"></i>
              </span>
              <p class="mb-0 used-name">{{ item.title }}</p>
            </a>

            <div class="grid-edge-right"></div>
            <div class="grid-edge-bottom"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const viewAllUrl = "/hang-cu.html";

const usedItems = [
  {
    title: "Điện thoại cũ",
    href: "/hang-cu/dien-thoai.html",
    iconClass: "bi bi-phone",
  },
  {
    title: "Máy tính bảng cũ",
    href: "/hang-cu/may-tinh-bang.html",
    iconClass: "bi bi-tablet",
  },
  {
    title: "MacBook cũ",
    href: "/hang-cu/mac.html",
    iconClass: "bi bi-laptop",
  },
  {
    title: "Laptop cũ",
    href: "/hang-cu/laptop.html",
    iconClass: "bi bi-pc-display",
  },
  {
    title: "Tai nghe cũ",
    href: "/hang-cu/tai-nghe.html",
    iconClass: "bi bi-headphones",
  },
  {
    title: "Loa cũ",
    href: "/hang-cu/loa.html",
    iconClass: "bi bi-speaker",
  },
  {
    title: "Đồng hồ thông minh cũ",
    href: "/hang-cu/dong-ho-thong-minh.html",
    iconClass: "bi bi-smartwatch",
  },
  {
    title: "Đồ gia dụng cũ",
    href: "/hang-cu/do-gia-dung.html",
    iconClass: "bi bi-house-gear",
  },
  {
    title: "Phụ kiện cũ",
    href: "/hang-cu/phu-kien.html",
    iconClass: "bi bi-mouse2",
  },
  {
    title: "Màn hình cũ",
    href: "/hang-cu/man-hinh.html",
    iconClass: "bi bi-display",
  },
  {
    title: "Tivi cũ",
    href: "/hang-cu/tivi.html",
    iconClass: "bi bi-tv",
  },
  {
    title: "Cáp sạc cũ",
    href: "/hang-cu/phu-kien/cap-sac.html",
    iconClass: "bi bi-usb-symbol",
  },
];
</script>

<style scoped>
.used-title {
  font-size: 1.02rem;
  line-height: 1.5;
  font-weight: 700;
  color: #1f2937;
}

.used-divider {
  height: 24px;
  border-left: 1px solid #d1d5db;
}

.view-all-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  border: 1px solid #fff;
  border-radius: 999px;
  padding: 0.35rem 0.55rem;
  color: #3b82f6;
  background: #fff;
  font-size: 0.82rem;
  font-weight: 500;
  white-space: nowrap;
}

.view-all-link:hover {
  border-color: #f3f4f6;
  background: #f9fafb;
  color: #2563eb;
}

.used-surface {
  padding: 0;
}

.used-grid-wrap {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.used-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-right: 1px solid #f3f4f6;
  border-bottom: 1px solid #f3f4f6;
  background: #fff;
  min-height: 84px;
}

.used-item:hover .used-name {
  text-decoration: underline;
}

.used-image-wrap {
  width: 72px;
  height: 72px;
  flex-shrink: 0;
}

.used-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  color: var(--irus-color-accent);
}

.used-name {
  flex: 1 1 auto;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.25;
}

.grid-edge-right {
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background: #fff;
}

.grid-edge-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: #fff;
}

@media (min-width: 576px) {
  .used-grid-wrap {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .used-title {
    font-size: 1.25rem;
    line-height: 1.25;
    text-transform: uppercase;
  }

  .used-surface {
    border-radius: 12px;
  }

  .used-grid-wrap {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}
</style>
