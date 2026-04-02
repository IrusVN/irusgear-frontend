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
        :desktop-banners="laptopDesktopBanners"
        :mobile-banners="laptopMobileBanners"
        :products="activeLaptopProducts"
        :loading="activeLaptopLoading"
      />

      <HomeProdSection
        :title="watchSectionTitle"
        secondary-title="ÂM THANH"
        :active-main-tab="activeWatchAudioTab === 'watch' ? 'primary' : 'secondary'"
        @tab-change="handleWatchAudioTabChange"
        :tabs="audioTabs"
        :disable-tabs-fallback="activeWatchAudioTab === 'watch'"
        :desktop-product-rows="1"
        :need-items="activeWatchAudioCollection.needItems"
        :brand-items="activeWatchAudioCollection.brandItems"
        :view-all-url="activeWatchAudioCollection.viewAllUrl"
        :desktop-banners="watchAudioDesktopBanners"
        :mobile-banners="watchAudioMobileBanners"
        :products="activeWatchAudioProducts"
        :loading="activeWatchAudioLoading"
      />

      <HomeProdSection
        :title="tvSectionTitle"
        :header-tabs="tvHeaderTabs"
        :active-header-tab-index="0"
        :disable-tabs-fallback="true"
        :desktop-product-rows="1"
        :need-items="tvCollection.needItems"
        :brand-items="tvCollection.brandItems"
        :view-all-url="tvCollection.viewAllUrl"
        :desktop-banners="tvDesktopBanners"
        :mobile-banners="tvMobileBanners"
        :products="tvProducts"
        :loading="tvLoading"
      />

      <HomeProdSection
        :title="homeApplianceSectionTitle"
        secondary-title="SỨC KHOẺ - LÀM ĐẸP"
        :active-main-tab="activeHomeLifeTab === 'home-appliance' ? 'primary' : 'secondary'"
        @tab-change="handleHomeLifeTabChange"
        :disable-tabs-fallback="true"
        :desktop-product-rows="1"
        :need-items="activeHomeLifeCollection.needItems"
        :brand-items="activeHomeLifeCollection.brandItems"
        :view-all-url="activeHomeLifeCollection.viewAllUrl"
        :desktop-banners="homeLifeDesktopBanners"
        :mobile-banners="homeLifeMobileBanners"
        :products="activeHomeLifeProducts"
        :loading="activeHomeLifeLoading"
      />

      <HomeProdSection
        :title="activeCoolingCollection.rootTitle || 'TỦ LẠNH - TỦ ĐÔNG'"
        :header-tabs="coolingHeaderTabs"
        :active-header-tab-index="activeCoolingTab"
        @header-tab-change="handleCoolingTabChange"
        :disable-tabs-fallback="true"
        :desktop-product-rows="1"
        :need-items="activeCoolingCollection.needItems"
        :brand-items="activeCoolingCollection.brandItems"
        :view-all-url="activeCoolingCollection.viewAllUrl"
        :desktop-banners="coolingDesktopBanners"
        :mobile-banners="coolingMobileBanners"
        :products="activeCoolingProducts"
        :loading="activeCoolingLoading"
      />

      <HomeUsedGoodsGrid />

      <!-- <HomeNews /> -->
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
const { phoneCollection, phoneProducts, phoneDesktopBanners, phoneMobileBanners, tabletCollection, tabletProducts, homeLoading, tabletLoading, laptopCollection, laptopProducts, laptopLoading, monitorCollection, monitorProducts, monitorLoading, pcCollection, pcProducts, pcLoading, computerAccessoryCollection, computerAccessoryProducts, computerAccessoryLoading, watchCollection, watchProducts, watchLoading, audioCollection, audioProducts, audioLoading, tvCollection, tvProducts, tvLoading, homeApplianceCollection, homeApplianceProducts, homeApplianceLoading, beautyHealthCollection, beautyHealthProducts, beautyHealthLoading, fridgeFreezerCollection, fridgeFreezerProducts, fridgeFreezerLoading, washingMachineCollection, washingMachineProducts, washingMachineLoading, dryerCollection, dryerProducts, dryerLoading, airConditionerCollection, airConditionerProducts, airConditionerLoading } = storeToRefs(homeStore);
const { fetchHomeData, fetchTabletCollection, fetchMonitorCollection, fetchPcCollection, fetchComputerAccessoryCollection, fetchAudioCollection, fetchBeautyHealthCollection, fetchWashingMachineCollection, fetchDryerCollection, fetchAirConditionerCollection } = homeStore;

const phoneTabs = ["Tất cả", "iPhone", "Samsung", "Xiaomi", "OPPO", "TECNO", "HONOR"];
const laptopHeaderTabs = ["Laptop", "Màn hình máy tính", "PC", "Phụ kiện máy tính"];
const tvHeaderTabs = ["Tivi"];
const coolingHeaderTabs = ["Tủ lạnh - Tủ đông", "Máy giặt", "Máy sấy quần áo", "Điều hoà - Máy lạnh"];
const audioTabs = ["Tất cả", "Tai nghe", "Loa", "Mic", "Loa Bluetooth", "Soundbar"];
const laptopDesktopBanners = [
  {
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:321:795/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01KK84Q078JE7HEGK1SF3GGZGZ.png",
    alt: "Laptop Banner 1",
    href: "/category/laptop?sort=newest&limit=20",
  },
  {
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:321:795/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01KK0FDJSHZGMZVASGGYTM8BH7.png",
    alt: "Laptop Banner 2",
    href: "/category/laptop?sort=newest&limit=20",
  },
];
const laptopMobileBanners = [...laptopDesktopBanners];
const watchAudioDesktopBanners = [
  {
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:321:960/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01KG6K3S7WG02MXRFGD9N1WQQE.png",
    alt: "Đồng hồ - Âm thanh Banner",
    href: "/category/dong-ho?sort=newest&limit=20",
  },
];
const watchAudioMobileBanners = [...watchAudioDesktopBanners];
const tvDesktopBanners = [
  {
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:321:960/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01K9XZX2K0Q0BX8QSVAGM40QYM.png",
    alt: "Tivi Banner",
    href: "/category/tivi?sort=newest&limit=20",
  },
];
const tvMobileBanners = [...tvDesktopBanners];
const homeLifeDesktopBanners = [
  {
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:321:960/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01KM2R7N6H6P7ADRGPP371BBRF.jpg",
    alt: "Đồ gia dụng - Sức khoẻ làm đẹp Banner",
    href: "/category/do-gia-dung?sort=newest&limit=20",
  },
];
const homeLifeMobileBanners = [...homeLifeDesktopBanners];
const coolingDesktopBanners = [
  {
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:321:960/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01KDCX8RAFJ8FJT35SAYRW6X0M.jpg",
    alt: "Tủ lạnh - Máy giặt - Máy sấy - Điều hoà Banner",
    href: "/category/tu-lanh-tu-dong?sort=newest&limit=20",
  },
];
const coolingMobileBanners = [...coolingDesktopBanners];
const activeDeviceTab = ref("phone");
const activeLaptopHeaderTab = ref(0);
const activeWatchAudioTab = ref("watch");
const activeHomeLifeTab = ref("home-appliance");
const activeCoolingTab = ref(0);

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
const watchSectionTitle = computed(() => watchCollection.value.rootTitle || "ĐỒNG HỒ");
const tvSectionTitle = computed(() => tvCollection.value.rootTitle || "TIVI");
const homeApplianceSectionTitle = computed(() => homeApplianceCollection.value.rootTitle || "ĐỒ GIA DỤNG");
const activeWatchAudioCollection = computed(() => {
  if (activeWatchAudioTab.value === "watch") return watchCollection.value;
  return audioCollection.value;
});
const activeWatchAudioProducts = computed(() =>
  activeWatchAudioTab.value === "watch" ? watchProducts.value : audioProducts.value
);
const activeWatchAudioLoading = computed(() =>
  activeWatchAudioTab.value === "watch" ? watchLoading.value : audioLoading.value
);
const activeHomeLifeCollection = computed(() =>
  activeHomeLifeTab.value === "home-appliance" ? homeApplianceCollection.value : beautyHealthCollection.value
);
const activeHomeLifeProducts = computed(() =>
  activeHomeLifeTab.value === "home-appliance" ? homeApplianceProducts.value : beautyHealthProducts.value
);
const activeHomeLifeLoading = computed(() =>
  activeHomeLifeTab.value === "home-appliance" ? homeApplianceLoading.value : beautyHealthLoading.value
);
const activeCoolingCollection = computed(() => {
  if (activeCoolingTab.value === 1) return washingMachineCollection.value;
  if (activeCoolingTab.value === 2) return dryerCollection.value;
  if (activeCoolingTab.value === 3) return airConditionerCollection.value;
  return fridgeFreezerCollection.value;
});
const activeCoolingProducts = computed(() => {
  if (activeCoolingTab.value === 0) return fridgeFreezerProducts.value;
  if (activeCoolingTab.value === 1) return washingMachineProducts.value;
  if (activeCoolingTab.value === 2) return dryerProducts.value;
  if (activeCoolingTab.value === 3) return airConditionerProducts.value;
  return [];
});
const activeCoolingLoading = computed(() => {
  if (activeCoolingTab.value === 0) return fridgeFreezerLoading.value;
  if (activeCoolingTab.value === 1) return washingMachineLoading.value;
  if (activeCoolingTab.value === 2) return dryerLoading.value;
  if (activeCoolingTab.value === 3) return airConditionerLoading.value;
  return false;
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

const handleWatchAudioTabChange = async (tabType) => {
  const nextTab = tabType === "secondary" ? "audio" : "watch";
  activeWatchAudioTab.value = nextTab;

  if (nextTab === "audio") {
    try {
      await fetchAudioCollection();
    } catch {
      // Keep current UI and avoid throwing in interaction handler.
    }
  }
};

const handleHomeLifeTabChange = async (tabType) => {
  const nextTab = tabType === "secondary" ? "beauty-health" : "home-appliance";
  activeHomeLifeTab.value = nextTab;

  if (nextTab === "beauty-health") {
    try {
      await fetchBeautyHealthCollection();
    } catch {
      // Keep current UI and avoid throwing in interaction handler.
    }
  }
};

const handleCoolingTabChange = async (tabIndex) => {
  activeCoolingTab.value = tabIndex;

  if (tabIndex === 1) {
    try {
      await fetchWashingMachineCollection();
    } catch {
      // Keep current UI and avoid throwing in interaction handler.
    }
  }

  if (tabIndex === 2) {
    try {
      await fetchDryerCollection();
    } catch {
      // Keep current UI and avoid throwing in interaction handler.
    }
  }

  if (tabIndex === 3) {
    try {
      await fetchAirConditionerCollection();
    } catch {
      // Keep current UI and avoid throwing in interaction handler.
    }
  }
};

onMounted(() => {
  fetchHomeData();
});

</script>

<style scoped>
</style>
