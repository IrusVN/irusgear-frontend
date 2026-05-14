import { computed, ref } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { useHomeStore } from "~/stores/homeStore";

export const useHomeSectionsStore = defineStore("home-sections", () => {
  const homeStore = useHomeStore();
  const {
    phoneCollection,
    phoneProducts,
    tabletCollection,
    tabletProducts,
    homeLoading,
    tabletLoading,
    laptopCollection,
    laptopProducts,
    laptopLoading,
    monitorCollection,
    monitorProducts,
    monitorLoading,
    pcCollection,
    pcProducts,
    pcLoading,
    computerAccessoryCollection,
    computerAccessoryProducts,
    computerAccessoryLoading,
    watchCollection,
    watchProducts,
    watchLoading,
    audioCollection,
    audioProducts,
    audioLoading,
    tvCollection,
    tvProducts,
    tvLoading,
    homeApplianceCollection,
    homeApplianceProducts,
    homeApplianceLoading,
    beautyHealthCollection,
    beautyHealthProducts,
    beautyHealthLoading,
    fridgeFreezerCollection,
    fridgeFreezerProducts,
    fridgeFreezerLoading,
    washingMachineCollection,
    washingMachineProducts,
    washingMachineLoading,
    dryerCollection,
    dryerProducts,
    dryerLoading,
    airConditionerCollection,
    airConditionerProducts,
    airConditionerLoading,
  } = storeToRefs(homeStore);

  const {
    phoneDesktopBanners,
    phoneMobileBanners,
    fetchHomeData,
    fetchTabletCollection,
    fetchMonitorCollection,
    fetchPcCollection,
    fetchComputerAccessoryCollection,
    fetchAudioCollection,
    fetchBeautyHealthCollection,
    fetchWashingMachineCollection,
    fetchDryerCollection,
    fetchAirConditionerCollection,
  } = homeStore;

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

  const sectionMap = computed(() => {
    const activeDeviceCollection = activeDeviceTab.value === "phone" ? phoneCollection.value : tabletCollection.value;
    const activeDeviceProducts = activeDeviceTab.value === "phone" ? phoneProducts.value : tabletProducts.value;
    const activeDeviceLoading = activeDeviceTab.value === "phone" ? homeLoading.value : tabletLoading.value;

    let activeLaptopCollection = laptopCollection.value;
    let activeLaptopProducts = laptopProducts.value;
    let activeLaptopLoading = laptopLoading.value;

    if (activeLaptopHeaderTab.value === 1) {
      activeLaptopCollection = monitorCollection.value;
      activeLaptopProducts = monitorProducts.value;
      activeLaptopLoading = monitorLoading.value;
    }
    if (activeLaptopHeaderTab.value === 2) {
      activeLaptopCollection = pcCollection.value;
      activeLaptopProducts = pcProducts.value;
      activeLaptopLoading = pcLoading.value;
    }
    if (activeLaptopHeaderTab.value === 3) {
      activeLaptopCollection = computerAccessoryCollection.value;
      activeLaptopProducts = computerAccessoryProducts.value;
      activeLaptopLoading = computerAccessoryLoading.value;
    }

    const activeWatchAudioCollection =
      activeWatchAudioTab.value === "watch" ? watchCollection.value : audioCollection.value;
    const activeWatchAudioProducts = activeWatchAudioTab.value === "watch" ? watchProducts.value : audioProducts.value;
    const activeWatchAudioLoading = activeWatchAudioTab.value === "watch" ? watchLoading.value : audioLoading.value;

    const activeHomeLifeCollection =
      activeHomeLifeTab.value === "home-appliance" ? homeApplianceCollection.value : beautyHealthCollection.value;
    const activeHomeLifeProducts =
      activeHomeLifeTab.value === "home-appliance" ? homeApplianceProducts.value : beautyHealthProducts.value;
    const activeHomeLifeLoading =
      activeHomeLifeTab.value === "home-appliance" ? homeApplianceLoading.value : beautyHealthLoading.value;

    let activeCoolingCollection = fridgeFreezerCollection.value;
    let activeCoolingProducts = fridgeFreezerProducts.value;
    let activeCoolingLoading = fridgeFreezerLoading.value;

    if (activeCoolingTab.value === 1) {
      activeCoolingCollection = washingMachineCollection.value;
      activeCoolingProducts = washingMachineProducts.value;
      activeCoolingLoading = washingMachineLoading.value;
    }
    if (activeCoolingTab.value === 2) {
      activeCoolingCollection = dryerCollection.value;
      activeCoolingProducts = dryerProducts.value;
      activeCoolingLoading = dryerLoading.value;
    }
    if (activeCoolingTab.value === 3) {
      activeCoolingCollection = airConditionerCollection.value;
      activeCoolingProducts = airConditionerProducts.value;
      activeCoolingLoading = airConditionerLoading.value;
    }

    return {
      device: {
        title: phoneCollection.value.rootTitle || "ĐIỆN THOẠI",
        secondaryTitle: tabletCollection.value.rootTitle || "MÁY TÍNH BẢNG",
        activeMainTab: activeDeviceTab.value === "phone" ? "primary" : "secondary",
        tabs: phoneTabs,
        disableTabsFallback: true,
        needItems: activeDeviceCollection.needItems,
        brandItems: activeDeviceCollection.brandItems,
        viewAllUrl: activeDeviceCollection.viewAllUrl,
        desktopBanners: activeDeviceTab.value === "phone" ? phoneDesktopBanners : [],
        mobileBanners: activeDeviceTab.value === "phone" ? phoneMobileBanners : [],
        products: activeDeviceProducts,
        loading: activeDeviceLoading,
      },
      laptop: {
        title: activeLaptopCollection.rootTitle || "LAPTOP",
        headerTabs: laptopHeaderTabs,
        activeHeaderTabIndex: activeLaptopHeaderTab.value,
        disableTabsFallback: true,
        needItems: activeLaptopCollection.needItems,
        brandItems: activeLaptopCollection.brandItems,
        viewAllUrl: activeLaptopCollection.viewAllUrl,
        desktopBanners: laptopDesktopBanners,
        mobileBanners: laptopMobileBanners,
        products: activeLaptopProducts,
        loading: activeLaptopLoading,
      },
      watchAudio: {
        title: watchCollection.value.rootTitle || "ĐỒNG HỒ",
        secondaryTitle: "ÂM THANH",
        activeMainTab: activeWatchAudioTab.value === "watch" ? "primary" : "secondary",
        tabs: audioTabs,
        disableTabsFallback: activeWatchAudioTab.value === "watch",
        needItems: activeWatchAudioCollection.needItems,
        brandItems: activeWatchAudioCollection.brandItems,
        viewAllUrl: activeWatchAudioCollection.viewAllUrl,
        desktopBanners: watchAudioDesktopBanners,
        mobileBanners: watchAudioMobileBanners,
        products: activeWatchAudioProducts,
        loading: activeWatchAudioLoading,
      },
      tv: {
        title: tvCollection.value.rootTitle || "TIVI",
        headerTabs: tvHeaderTabs,
        activeHeaderTabIndex: 0,
        disableTabsFallback: true,
        needItems: tvCollection.value.needItems,
        brandItems: tvCollection.value.brandItems,
        viewAllUrl: tvCollection.value.viewAllUrl,
        desktopBanners: tvDesktopBanners,
        mobileBanners: tvMobileBanners,
        products: tvProducts.value,
        loading: tvLoading.value,
      },
      homeLife: {
        title: homeApplianceCollection.value.rootTitle || "ĐỒ GIA DỤNG",
        secondaryTitle: "SỨC KHOẺ - LÀM ĐẸP",
        activeMainTab: activeHomeLifeTab.value === "home-appliance" ? "primary" : "secondary",
        disableTabsFallback: true,
        needItems: activeHomeLifeCollection.needItems,
        brandItems: activeHomeLifeCollection.brandItems,
        viewAllUrl: activeHomeLifeCollection.viewAllUrl,
        desktopBanners: homeLifeDesktopBanners,
        mobileBanners: homeLifeMobileBanners,
        products: activeHomeLifeProducts,
        loading: activeHomeLifeLoading,
      },
      cooling: {
        title: activeCoolingCollection.rootTitle || "TỦ LẠNH - TỦ ĐÔNG",
        headerTabs: coolingHeaderTabs,
        activeHeaderTabIndex: activeCoolingTab.value,
        disableTabsFallback: true,
        needItems: activeCoolingCollection.needItems,
        brandItems: activeCoolingCollection.brandItems,
        viewAllUrl: activeCoolingCollection.viewAllUrl,
        desktopBanners: coolingDesktopBanners,
        mobileBanners: coolingMobileBanners,
        products: activeCoolingProducts,
        loading: activeCoolingLoading,
      },
    };
  });

  const getSection = (sectionKey) => sectionMap.value[sectionKey] || null;

  const handleMainTabChange = async (sectionKey, tabType) => {
    if (sectionKey === "device") {
      const nextTab = tabType === "secondary" ? "tablet" : "phone";
      activeDeviceTab.value = nextTab;
      if (nextTab === "tablet") {
        try {
          await fetchTabletCollection();
        } catch {
          // Keep current UI and avoid throwing in interaction handler.
        }
      }
      return;
    }

    if (sectionKey === "watchAudio") {
      const nextTab = tabType === "secondary" ? "audio" : "watch";
      activeWatchAudioTab.value = nextTab;
      if (nextTab === "audio") {
        try {
          await fetchAudioCollection();
        } catch {
          // Keep current UI and avoid throwing in interaction handler.
        }
      }
      return;
    }

    if (sectionKey === "homeLife") {
      const nextTab = tabType === "secondary" ? "beauty-health" : "home-appliance";
      activeHomeLifeTab.value = nextTab;
      if (nextTab === "beauty-health") {
        try {
          await fetchBeautyHealthCollection();
        } catch {
          // Keep current UI and avoid throwing in interaction handler.
        }
      }
    }
  };

  const handleHeaderTabChange = async (sectionKey, tabIndex) => {
    if (sectionKey === "laptop") {
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
      return;
    }

    if (sectionKey === "cooling") {
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
    }
  };

  const initHomeSections = async () => {
    await fetchHomeData();
  };

  return {
    getSection,
    handleMainTabChange,
    handleHeaderTabChange,
    initHomeSections,
  };
});
