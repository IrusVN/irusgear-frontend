<template>
  <div class="home-page pb-4 bg-light">
    <HomeHero />

    <div class="container-xl px-3 py-4">
      <HomeProdSection
        :title="phoneSectionTitle"
        :secondary-title="tabletSectionTitle"
        :active-main-tab="activeDeviceTab === 'phone' ? 'primary' : 'secondary'"
        @tab-change="handleDeviceTabChange"
        :tabs="phoneTabs"
        :disable-tabs-fallback="true"
        :need-items="activeDeviceCollection.needItems"
        :brand-items="activeDeviceCollection.brandItems"
        :view-all-url="activeDeviceCollection.viewAllUrl"
        :desktop-banners="activeDeviceTab === 'phone' ? phoneDesktopBanners : []"
        :mobile-banners="activeDeviceTab === 'phone' ? phoneMobileBanners : []"
        :products="activeDeviceProducts"
        :loading="activeDeviceLoading"
      />

      <HomeAccessoryGrid />

      <HomeProdSection
        :title="activeLaptopCollection.rootTitle || 'LAPTOP'"
        :header-tabs="laptopHeaderTabs"
        :active-header-tab-index="activeLaptopHeaderTab"
        @header-tab-change="handleLaptopHeaderTabChange"
        :disable-tabs-fallback="true"
        :need-items="activeLaptopCollection.needItems"
        :brand-items="activeLaptopCollection.brandItems"
        :view-all-url="activeLaptopCollection.viewAllUrl"
        :products="activeLaptopProducts"
        :loading="activeLaptopLoading"
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
const { phoneCollection, phoneProducts, phoneDesktopBanners, phoneMobileBanners, tabletCollection, tabletProducts, homeLoading, tabletLoading, laptopCollection, laptopProducts, laptopLoading, monitorCollection, monitorProducts, monitorLoading, pcCollection, pcProducts, pcLoading, computerAccessoryCollection, computerAccessoryProducts, computerAccessoryLoading } = storeToRefs(homeStore);
const { fetchHomeData, fetchTabletCollection, fetchMonitorCollection, fetchPcCollection, fetchComputerAccessoryCollection } = homeStore;

const phoneTabs = ["Tất cả", "iPhone", "Samsung", "Xiaomi", "OPPO", "TECNO", "HONOR"];
const laptopHeaderTabs = ["Laptop", "Màn hình máy tính", "PC", "Phụ kiện máy tính"];
const audioTabs = ["Tất cả", "Tai nghe", "Loa", "AirPods", "Sony", "JBL", "Bose"];
const watchTabs = ["Tất cả", "Apple Watch", "Samsung", "Garmin", "Casio", "Xiaomi"];
const activeDeviceTab = ref("phone");
const activeLaptopHeaderTab = ref(0);

const phoneSectionTitle = computed(() => phoneCollection.value.rootTitle || "ĐIỆN THOẠI");
const tabletSectionTitle = computed(() => tabletCollection.value.rootTitle || "MÁY TÍNH BẢNG");
const activeDeviceCollection = computed(() => (activeDeviceTab.value === "phone" ? phoneCollection.value : tabletCollection.value));
const activeDeviceProducts = computed(() => (activeDeviceTab.value === "phone" ? phoneProducts.value : tabletProducts.value));
const activeDeviceLoading = computed(() => (activeDeviceTab.value === "phone" ? homeLoading.value : tabletLoading.value));
const activeLaptopCollection = computed(() => {
  if (activeLaptopHeaderTab.value === 1) return monitorCollection.value;
  if (activeLaptopHeaderTab.value === 2) return pcCollection.value;
  if (activeLaptopHeaderTab.value === 3) return computerAccessoryCollection.value;
  return laptopCollection.value;
});
const activeLaptopProducts = computed(() => {
  if (activeLaptopHeaderTab.value === 1) return monitorProducts.value;
  if (activeLaptopHeaderTab.value === 2) return pcProducts.value;
  if (activeLaptopHeaderTab.value === 3) return computerAccessoryProducts.value;
  return laptopProducts.value;
});
const activeLaptopLoading = computed(() => {
  if (activeLaptopHeaderTab.value === 1) return monitorLoading.value;
  if (activeLaptopHeaderTab.value === 2) return pcLoading.value;
  if (activeLaptopHeaderTab.value === 3) return computerAccessoryLoading.value;
  return laptopLoading.value;
});

const handleDeviceTabChange = async (tabType) => {
  const nextTab = tabType === "secondary" ? "tablet" : "phone";
  activeDeviceTab.value = nextTab;

  if (nextTab === "tablet") {
    try {
      await fetchTabletCollection();
    } catch {
      // Keep current UI and avoid throwing in interaction handler.
    }
  }
};

const handleLaptopHeaderTabChange = async (tabIndex) => {
  activeLaptopHeaderTab.value = tabIndex;

  if (tabIndex === 1) {
    try {
      await fetchMonitorCollection();
    } catch {
      // Keep current UI and avoid throwing in interaction handler.
    }
  }

  if (tabIndex === 2) {
    try {
      await fetchPcCollection();
    } catch {
      // Keep current UI and avoid throwing in interaction handler.
    }
  }

  if (tabIndex === 3) {
    try {
      await fetchComputerAccessoryCollection();
    } catch {
      // Keep current UI and avoid throwing in interaction handler.
    }
  }
};

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

</script>

<style scoped>
</style>
