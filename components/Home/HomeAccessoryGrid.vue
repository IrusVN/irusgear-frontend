<template>
  <div class="my-3 my-md-4">
    <section class="accessory-section text-neutral-800">
      <div class="d-flex align-items-center justify-content-between gap-3 accessory-header">
        <h2 class="mb-0 accessory-title">Sắm thêm phụ kiện chất lượng</h2>

        <div class="d-none d-md-block accessory-divider"></div>

        <div class="d-none d-md-flex gap-2"></div>

        <a :href="viewAllUrl" class="view-all-link text-decoration-none">
          Xem tất cả
          <i class="bi bi-chevron-right ms-1"></i>
        </a>
      </div>

      <div class="mt-2">
        <div class="accessory-surface animate-fade-in">
          <div class="accessory-grid-wrap position-relative bg-white">
            <a
              v-for="item in accessoryItems"
              :key="item.href"
              :href="item.href"
              class="accessory-item text-decoration-none text-dark"
            >
              <span class="accessory-image-wrap">
                <img :src="item.image" :alt="item.title" class="accessory-image" loading="lazy" />
              </span>
              <p class="mb-0 accessory-name">{{ item.title }}</p>
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
const viewAllUrl = "/phu-kien.html";

const accessoryItems = [
  {
    title: "Phụ kiện Apple",
    href: "/phu-kien/apple.html",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6FA9G05VYEFVX2VCHYZY1R7.png",
  },
  {
    title: "Cáp, sạc",
    href: "/phu-kien/sac-dien-thoai.html",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6FA9GEB6TV510FK9GJPJK4N.png",
  },
  {
    title: "Pin sạc dự phòng",
    href: "/phu-kien/pin-du-phong.html",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6FA9GHJ4RRYBDS2Y2WEKRZV.png",
  },
  {
    title: "Ốp lưng - Bao da",
    href: "/phu-kien/bao-da-op-lung.html",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6FA9GMV76QGJDAPAAJ9M26V.png",
  },
  {
    title: "Dán màn hình",
    href: "/phu-kien/dan-man-hinh.html",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6FA9GSARTJ2C2XKJSJZB85Z.png",
  },
  {
    title: "Thẻ nhớ, USB",
    href: "/phu-kien/the-nho-usb-otg.html",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6FA9GX3JKD0AHHSWBBK44TP.png",
  },
  {
    title: "Gaming Gear, Playstation",
    href: "/phu-kien/gaming-gear.html",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6FA9H0DYE4E1791SFPXEMY7.png",
  },
  {
    title: "Sim 4G - 5G",
    href: "/sim-3g-4g-nghe-goi.html",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6FA9H3ZX03AZB1CNX48DG80.png",
  },
  {
    title: "Thiết bị mạng",
    href: "/phu-kien/thiet-bi-mang.html",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6FA9H7Y53763DEK7J2A2TKP.png",
  },
  {
    title: "Camera",
    href: "/phu-kien/camera.html",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6FA9HBE3PQPJEBJNS1ZZDZQ.png",
  },
  {
    title: "Gimbal",
    href: "/phu-kien/camera/gimbal.html",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6FAG655JQDK9DBG3DW9ARDT.png",
  },
  {
    title: "Flycam",
    href: "/flycam.html",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6FAG6G9DFQVSS6CYZA2YAFQ.png",
  },
  {
    title: "Máy ảnh",
    href: "/may-anh.html",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6FAG6KJ98DW8KHNXKFWARYF.png",
  },
  {
    title: "Chuột, bàn phím",
    href: "/phu-kien/chuot-ban-phim-may-tinh.html",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6FAG6Q4JA1NNV2BFRPWFDGY.png",
  },
  {
    title: "Balo, túi xách",
    href: "/phu-kien/balo-tui-chong-soc-laptop.html",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6FAG6T4966NR0Z7ZSFXW5WD.png",
  },
  {
    title: "Hub chuyển đổi",
    href: "/phu-kien/sac-dien-thoai/cap-chuyen-doi-dau-chuyen-doi-macbook.html",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6FAG6WZJ9RRA8H9VTQP9CHS.png",
  },
  {
    title: "Phụ kiện điện thoại",
    href: "/phu-kien/phu-kien-tien-ich.html",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6FAG6ZTGEC28FWZRJX0TBWS.png",
  },
  {
    title: "Phụ kiện Laptop",
    href: "/phu-kien/may-tinh-laptop.html",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K6FAG72ZEC79BAJY70V3ESD0.png",
  },
];
</script>

<style scoped>
.accessory-title {
  font-size: 1.02rem;
  line-height: 1.5;
  font-weight: 700;
  color: #1f2937;
}

.accessory-divider {
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

.accessory-surface {
  padding: 0;
}

.accessory-grid-wrap {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.accessory-item {
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

.accessory-item:hover .accessory-name {
  text-decoration: underline;
}

.accessory-image-wrap {
  width: 72px;
  height: 72px;
  flex-shrink: 0;
}

.accessory-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.accessory-name {
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
  .accessory-grid-wrap {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .accessory-title {
    font-size: 1.25rem;
    line-height: 1.25;
    text-transform: uppercase;
  }

  .accessory-surface {
    border-radius: 12px;
  }

  .accessory-grid-wrap {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}
</style>
