<template>
  <div class="home-page pb-4 bg-light">
    <HomeHero />

    <div class="container-xl px-3 py-4">
      <HomeProdSection
        :title="phoneSectionTitle"
        secondary-title="MÁY TÍNH BẢNG"
        :tabs="phoneTabs"
        :disable-tabs-fallback="true"
        :need-items="phoneCollection.needItems"
        :brand-items="phoneCollection.brandItems"
        :view-all-url="phoneCollection.viewAllUrl"
        :desktop-banners="phoneDesktopBanners"
        :mobile-banners="phoneMobileBanners"
        :products="phoneProducts"
        :loading="homeLoading"
      />

      <HomeProdSection
        title="LAPTOP"
        :tabs="laptopTabs"
        :products="laptopState.data"
        :loading="laptopState.loading"
      />

      <HomeProdSection
        title="ÂM THANH"
        :tabs="audioTabs"
        :products="audioState.data"
        :loading="audioState.loading"
      />

      <HomeProdSection
        title="ĐỒNG HỒ"
        :tabs="watchTabs"
        :products="watchState.data"
        :loading="watchState.loading"
      />

      <HomeProdSection
        title="MÁY TÍNH BẢNG"
        :tabs="tabletTabs"
        :products="tabletState.data"
        :loading="tabletState.loading"
      />

      <HomeNews />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useHead, useI18n } from "#imports";
import { useHomeStore } from "~/stores/homeStore";

definePageMeta({ layout: "default" });

const { t } = useI18n();
useHead({ title: computed(() => t("page_titles.home")) });

const homeStore = useHomeStore();
const { phoneCollection, phoneProducts, phoneDesktopBanners, phoneMobileBanners, homeLoading } = storeToRefs(homeStore);
const { fetchHomeData, selectPhoneBrand } = homeStore;

const phoneTabs = ["Tất cả", "iPhone", "Samsung", "Xiaomi", "OPPO", "TECNO", "HONOR"];
const laptopTabs = ["Tất cả", "MacBook", "Dell", "HP", "Asus", "Lenovo", "Acer"];
const audioTabs = ["Tất cả", "Tai nghe", "Loa", "AirPods", "Sony", "JBL", "Bose"];
const watchTabs = ["Tất cả", "Apple Watch", "Samsung", "Garmin", "Casio", "Xiaomi"];
const tabletTabs = ["Tất cả", "iPad", "Samsung", "Xiaomi", "Lenovo", "Huawei"];

const phoneSectionTitle = computed(() => phoneCollection.value.rootTitle || "ĐIỆN THOẠI");

const hashString = (value) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 2147483647;
  }
  return hash;
};

const mkProducts = (names) => {
  const storageOptions = ["Pro Max 256GB", "Ultra 512GB", "Plus 128GB", "Standard 256GB"];

  return Array.from({ length: 10 }, (_, i) => {
    const baseName = names[i % names.length];
    const seed = hashString(`${baseName}-${i}-${names.length}`);
    const price = ((seed % 18) + 5) * 1000000;
    const discount = (seed % 15) + 5;

    return {
      id: `${baseName.replace(/\s+/g, "-")}-${i}`,
      name: `${baseName} ${storageOptions[i % storageOptions.length]} Chính hãng VN/A`,
      price,
      originalPrice: Math.round(price / (1 - discount / 100)),
      discount,
      rating: (((seed % 9) / 10) + 4.1).toFixed(1),
      badge: `Giảm ${discount}%`,
      installmentText: "Trả góp 0%",
      gifts: ["Smember giảm thêm 300.000đ", "S-Student giảm thêm 500.000đ"],
      img: `https://placehold.co/240x240/f5f5f5/999?text=${encodeURIComponent(baseName)}`,
    };
  });
};

onMounted(() => {
  fetchHomeData();
});

const laptopState = ref({ data: mkProducts(["MacBook Air", "Dell XPS", "HP Spectre", "Asus ZenBook", "Lenovo ThinkPad"]), loading: false });
const fetchLaptops = async (tabName) => {
  laptopState.value.loading = true;
  setTimeout(() => {
    laptopState.value.data = mkProducts([tabName?.title || tabName || "Laptop Mới"]);
    laptopState.value.loading = false;
  }, 350);
};

const audioState = ref({ data: mkProducts(["AirPods Pro", "Sony WH-1000", "JBL Tune", "Samsung Buds", "Bose QC45"]), loading: false });
const fetchAudio = async (tabName) => {
  audioState.value.loading = true;
  setTimeout(() => {
    audioState.value.data = mkProducts([tabName?.title || tabName || "Tai nghe Mẫu"]);
    audioState.value.loading = false;
  }, 350);
};

const watchState = ref({ data: mkProducts(["Apple Watch", "Samsung Watch", "Garmin Fenix", "Casio G-Shock", "Xiaomi Watch"]), loading: false });
const fetchWatches = async (tabName) => {
  watchState.value.loading = true;
  setTimeout(() => {
    watchState.value.data = mkProducts([tabName?.title || tabName || "Đồng hồ Mẫu"]);
    watchState.value.loading = false;
  }, 350);
};

const tabletState = ref({ data: mkProducts(["iPad Pro", "Samsung Tab", "Xiaomi Pad", "Lenovo Tab", "Huawei MatePad"]), loading: false });
const fetchTablets = async (tabName) => {
  tabletState.value.loading = true;
  setTimeout(() => {
    tabletState.value.data = mkProducts([tabName?.title || tabName || "Tablet Mới"]);
    tabletState.value.loading = false;
  }, 350);
};
</script>

<style scoped>
</style>
