<template>
  <section class="product-list-page">
    <div class="container-xl px-3 py-4">
      <h1 class="fw-bold mb-3">Danh sach san pham</h1>
      <p class="text-muted mb-4">
        Danh sach hien tai dang dung du lieu mau. Ban co the thay bang du lieu API sau.
      </p>

      <div class="row g-3 g-md-4">
        <div v-for="item in products" :key="item.id" class="col-6 col-md-4 col-lg-3">
          <HomeProdCard :product="item" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n, useLocalePath } from "#imports";
import HomeProdCard from "@/components/Home/HomeProdCard.vue";
import { useBreadcrumb } from "@/composables/useBreadcrumb";

const { t } = useI18n();
const localePath = useLocalePath();

const breadcrumbTrail = computed(() => [
  {
    label: t("sidebar.menu.home"),
    to: localePath("/"),
  },
  {
    label: t("sidebar.menu.products"),
    to: localePath("/products"),
  },
]);

useBreadcrumb(breadcrumbTrail, {
  compactUi: true,
  prependHome: false,
});

const products = ref([
  {
    id: 1,
    name: "Samsung Galaxy S25 Ultra 12GB 256GB",
    img: "https://cdn2.cellphones.com.vn/x/media/catalog/product/s/2/s25-ultra-grey_1.png",
    price: 26490000,
    originalPrice: 33380000,
    discount: 21,
    badge: true,
    installmentText: "0%",
    rating: 4.7,
    gifts: ["Smember giam den 265.000d", "S-Student giam them 500.000d"],
    url: "/dien-thoai-samsung-galaxy-s25-ultra.html"
  },
  {
    id: 2,
    name: "iPhone 17 Pro 256GB | Chinh hang",
    img: "https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone_17_pro_black_1.png",
    price: 34890000,
    originalPrice: 34990000,
    discount: 1,
    badge: true,
    installmentText: "0%",
    rating: 5,
    gifts: ["Smember giam den 349.000d", "Tra gop 0%"],
    url: "/iphone-17-pro.html"
  },
  {
    id: 3,
    name: "Xiaomi Redmi Note 14 Pro Plus 5G 8GB 256GB",
    img: "https://cdn2.cellphones.com.vn/x/media/catalog/product/r/e/redmi-note-14-pro-plus-purple_1.png",
    price: 7990000,
    originalPrice: 10800000,
    discount: 26,
    badge: true,
    installmentText: "0%",
    rating: 5,
    gifts: ["Smember giam den 80.000d", "S-Student giam them 300.000d"],
    url: "/dien-thoai-xiaomi-redmi-note-14-pro-plus.html"
  },
  {
    id: 4,
    name: "OPPO Reno15 5G 12GB 256GB",
    img: "https://cdn2.cellphones.com.vn/x/media/catalog/product/o/p/oppo-reno15-5g-green_1.png",
    price: 16490000,
    originalPrice: 16990000,
    discount: 3,
    badge: true,
    installmentText: "0%",
    rating: 5,
    gifts: ["Smember giam den 165.000d", "S-Student giam them 300.000d"],
    url: "/dien-thoai-oppo-reno15.html"
  }
]);
</script>

<style scoped>
.product-list-page {
  background: #f8fafc;
  min-height: 100%;
}
</style>
