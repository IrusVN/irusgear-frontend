<template>
  <div class="my-3 my-md-4">
    <section class="accessory-section text-neutral-800">
      <div class="d-flex align-items-center gap-3 accessory-header">
        <h2 class="mb-0 accessory-title">{{ $t('home.accessoryTitle') }}</h2>

        <a :href="viewAllUrl" class="view-all-link text-decoration-none">
          {{ $t('common.seeAll') }}
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
                <i :class="item.iconClass || 'bi bi-phone'" class="accessory-image bi" role="img" :aria-label="t(item.titleKey)"></i>
              </span>
              <p class="mb-0 accessory-name">{{ t(item.titleKey) }}</p>
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
const { t } = useI18n()
const viewAllUrl = "/phu-kien.html";

const accessoryItems = [
  {
    titleKey: "home.accessoryApple",
    href: "/phu-kien/apple.html",
    iconClass: "bi bi-apple",
  },
  {
    titleKey: "home.accessoryCable",
    href: "/phu-kien/sac-dien-thoai.html",
    iconClass: "bi bi-usb-symbol",
  },
  {
    titleKey: "home.accessoryBattery",
    href: "/phu-kien/pin-du-phong.html",
    iconClass: "bi bi-battery-charging",
  },
  {
    titleKey: "home.accessoryCase",
    href: "/phu-kien/bao-da-op-lung.html",
    iconClass: "bi bi-phone",
  },
  {
    titleKey: "home.accessoryScreen",
    href: "/phu-kien/dan-man-hinh.html",
    iconClass: "bi bi-display",
  },
  {
    titleKey: "home.accessoryStorage",
    href: "/phu-kien/the-nho-usb-otg.html",
    iconClass: "bi bi-sd-card",
  },
  {
    titleKey: "home.gamingGear",
    href: "/phu-kien/gaming-gear.html",
    iconClass: "bi bi-controller",
  },
  {
    titleKey: "home.sim4g5g",
    href: "/sim-3g-4g-nghe-goi.html",
    iconClass: "bi bi-sim",
  },
  {
    titleKey: "home.accessoryNetwork",
    href: "/phu-kien/thiet-bi-mang.html",
    iconClass: "bi bi-router",
  },
  {
    titleKey: "home.camera",
    href: "/phu-kien/camera.html",
    iconClass: "bi bi-camera",
  },
  {
    titleKey: "home.gimbal",
    href: "/phu-kien/camera/gimbal.html",
    iconClass: "bi bi-camera-video",
  },
  {
    titleKey: "home.flycam",
    href: "/flycam.html",
    iconClass: "bi bi-airplane",
  },
  {
    titleKey: "home.camera",
    href: "/may-anh.html",
    iconClass: "bi bi-camera2",
  },
  {
    titleKey: "home.accessoryKeyboard",
    href: "/phu-kien/chuot-ban-phim-may-tinh.html",
    iconClass: "bi bi-keyboard",
  },
  {
    titleKey: "home.accessoryBag",
    href: "/phu-kien/balo-tui-chong-soc-laptop.html",
    iconClass: "bi bi-bag",
  },
  {
    titleKey: "home.accessoryHub",
    href: "/phu-kien/sac-dien-thoai/cap-chuyen-doi-dau-chuyen-doi-macbook.html",
    iconClass: "bi bi-hdd",
  },
  {
    titleKey: "home.accessoryPhone",
    href: "/phu-kien/phu-kien-tien-ich.html",
    iconClass: "bi bi-phone-flip",
  },
  {
    titleKey: "home.accessoryLaptop",
    href: "/phu-kien/may-tinh-laptop.html",
    iconClass: "bi bi-laptop",
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
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  color: var(--irus-color-accent);
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
