import { defineStore } from "pinia";
import { ref } from "vue";
import { useRuntimeConfig } from "#imports";
import { createCollection, createProductMapper } from "./collectionFactory";

export const useHomeStore = defineStore("home", () => {
  const config = useRuntimeConfig();
  const getApiBaseUrl = () => config.public.apiBaseUrl;

  // ─── Mega Menu ──────────────────────────────────────────────
  const megaMenuSections = ref([]);
  const megaMenuLeafByKey = ref({});
  const activeMegaMenuKey = ref("");
  const megaMenuLoading = ref(false);
  const megaMenuLoaded = ref(false);
  const megaMenuError = ref(null);
  let megaMenuPromise = null;

  // ─── Home-level loading ─────────────────────────────────────
  const homeLoading = ref(false);
  const homeLoaded = ref(false);
  const homeError = ref(null);
  let homePromise = null;

  // ─── Phone-specific state (special: brand selection filter) ─
  const selectedPhoneBrand = ref(null);

  // ─── Category Configs ───────────────────────────────────────
  // Each entry defines everything needed to create a category collection.
  const CATEGORY_CONFIGS = {
    phone: {
      slug: "dien-thoai",
      defaultTitle: "ĐIỆN THOẠI",
      viewAllUrl: "/category/dien-thoai?sort=newest&limit=20",
      iconClass: "bi bi-phone",
      discounts: [5, 1, 1, 0, 4, 12],
      gifts: ["Smember giảm đến 500.000đ", "S-Student giảm thêm 300.000đ"],
      needIconMap: {
        "dien-thoai-choi-game": "bi bi-controller",
        "dien-thoai-pin-trau": "bi bi-battery-charging",
        "dien-thoai-5g": "bi bi-badge-5g",
        "dien-thoai-chup-anh-dep": "bi bi-camera",
        "dien-thoai-gap": "bi bi-phone-flip",
        "dien-thoai-ai": "bi bi-cpu",
        "dien-thoai-pho-thong": "bi bi-phone",
      },
    },
    tablet: {
      slug: "may-tinh-bang",
      defaultTitle: "MÁY TÍNH BẢNG",
      viewAllUrl: "/category/may-tinh-bang?sort=newest&limit=20",
      iconClass: "bi bi-tablet",
      discounts: [12, 8, 6, 5, 10, 7],
      gifts: ["Smember giảm đến 230.000đ", "S-Student giảm thêm 500.000đ", "Không phí chuyển đổi khi trả góp 0% qua thẻ tín dụng kỳ hạn 3-6 tháng"],
    },
    laptop: {
      slug: "laptop",
      defaultTitle: "LAPTOP",
      viewAllUrl: "/category/laptop?sort=newest&limit=20",
      iconClass: "bi bi-laptop",
      discounts: [9, 7, 6, 10, 8, 5],
      gifts: ["Smember giảm đến 500.000đ", "S-Student giảm thêm 300.000đ", "Trả góp 0% lãi suất qua thẻ tín dụng"],
    },
    monitor: {
      slug: "man-hinh-may-tinh",
      defaultTitle: "MÀN HÌNH MÁY TÍNH",
      viewAllUrl: "/category/man-hinh-may-tinh?sort=newest&limit=20",
      iconClass: "bi bi-display",
      discounts: [6, 5, 9, 7, 8, 4],
      gifts: ["Smember giảm đến 300.000đ", "S-Student giảm thêm 200.000đ", "Trả góp 0% lãi suất qua thẻ tín dụng"],
    },
    pc: {
      slug: "pc",
      defaultTitle: "PC",
      viewAllUrl: "/category/pc?sort=newest&limit=20",
      iconClass: "bi bi-pc-display",
      discounts: [7, 10, 8, 6, 9, 5],
      gifts: ["Smember giảm đến 400.000đ", "S-Student giảm thêm 300.000đ", "Ưu đãi lắp đặt và giao hàng nhanh"],
    },
    computerAccessory: {
      slug: "phu-kien-may-tinh",
      defaultTitle: "PHỤ KIỆN MÁY TÍNH",
      viewAllUrl: "/category/phu-kien-may-tinh?sort=newest&limit=20",
      iconClass: "bi bi-mouse2",
      discounts: [6, 8, 5, 7, 9, 4],
      gifts: ["Smember giảm đến 200.000đ", "S-Student giảm thêm 150.000đ", "Giao hàng nhanh toàn quốc"],
    },
    watch: {
      slug: "dong-ho",
      defaultTitle: "ĐỒNG HỒ",
      viewAllUrl: "/category/dong-ho?sort=newest&limit=20",
      iconClass: "bi bi-smartwatch",
      discounts: [8, 6, 5, 9, 7, 4],
      gifts: ["Smember giảm đến 300.000đ", "S-Student giảm thêm 200.000đ", "Bảo hành chính hãng toàn quốc"],
    },
    audio: {
      slug: "am-thanh",
      defaultTitle: "ÂM THANH",
      viewAllUrl: "/category/am-thanh?sort=newest&limit=20",
      iconClass: "bi bi-headphones",
      discounts: [10, 8, 12, 7, 9, 6],
      gifts: ["Smember giảm đến 200.000đ", "S-Student giảm thêm 150.000đ", "Giao hàng nhanh toàn quốc"],
    },
    tv: {
      slug: "tivi",
      defaultTitle: "TIVI",
      viewAllUrl: "/category/tivi?sort=newest&limit=20",
      iconClass: "bi bi-tv",
      discounts: [11, 9, 8, 10, 7, 6],
      gifts: ["Smember giảm đến 600.000đ", "S-Student giảm thêm 300.000đ", "Giao hàng lắp đặt nhanh toàn quốc"],
    },
    homeAppliance: {
      slug: "do-gia-dung",
      defaultTitle: "ĐỒ GIA DỤNG",
      viewAllUrl: "/category/do-gia-dung?sort=newest&limit=20",
      iconClass: "bi bi-house",
      discounts: [12, 10, 8, 11, 9, 7],
      gifts: ["Smember giảm đến 300.000đ", "S-Student giảm thêm 200.000đ", "Giao nhanh toàn quốc"],
    },
    beautyHealth: {
      slug: "suc-khoe-lam-dep",
      defaultTitle: "SỨC KHỎE - LÀM ĐẸP",
      viewAllUrl: "/category/suc-khoe-lam-dep?sort=newest&limit=20",
      iconClass: "bi bi-heart-pulse",
      discounts: [9, 7, 8, 10, 6, 11],
      gifts: ["Smember giảm đến 250.000đ", "S-Student giảm thêm 150.000đ", "Sản phẩm chính hãng"],
    },
    fridgeFreezer: {
      slug: "tu-lanh-tu-dong",
      defaultTitle: "TỦ LẠNH - TỦ ĐÔNG",
      viewAllUrl: "/category/tu-lanh-tu-dong?sort=newest&limit=20",
      iconClass: "bi bi-snow",
      discounts: [9, 7, 8, 10, 6, 11],
      gifts: ["Smember giảm đến 500.000đ", "S-Student giảm thêm 300.000đ", "Hỗ trợ giao lắp nhanh"],
    },
    washingMachine: {
      slug: "may-giat",
      defaultTitle: "MÁY GIẶT",
      viewAllUrl: "/category/may-giat?sort=newest&limit=20",
      iconClass: "bi bi-badge-wc",
      discounts: [8, 10, 7, 9, 6, 11],
      gifts: ["Smember giảm đến 500.000đ", "S-Student giảm thêm 300.000đ", "Giao lắp nhanh toàn quốc"],
    },
    dryer: {
      slug: "may-say-quan-ao",
      defaultTitle: "MÁY SẤY QUẦN ÁO",
      viewAllUrl: "/category/may-say-quan-ao?sort=newest&limit=20",
      iconClass: "bi bi-wind",
      discounts: [7, 9, 8, 10, 6, 11],
      gifts: ["Smember giảm đến 400.000đ", "S-Student giảm thêm 250.000đ", "Hỗ trợ giao lắp nhanh"],
    },
    airConditioner: {
      slug: "dieu-hoa-may-lanh",
      defaultTitle: "ĐIỀU HOÀ - MÁY LẠNH",
      viewAllUrl: "/category/dieu-hoa-may-lanh?sort=newest&limit=20",
      iconClass: "bi bi-snow2",
      discounts: [10, 8, 7, 9, 6, 11],
      gifts: ["Smember giảm đến 600.000đ", "S-Student giảm thêm 300.000đ", "Lắp đặt nhanh toàn quốc"],
    },
  };

  // ─── Create all category stores via factory ─────────────────
  const categories = {};
  for (const [key, cfg] of Object.entries(CATEGORY_CONFIGS)) {
    const mapper = createProductMapper({
      discounts: cfg.discounts,
      gifts: cfg.gifts,
    });

    categories[key] = createCollection({
      slug: cfg.slug,
      defaultTitle: cfg.defaultTitle,
      viewAllUrl: cfg.viewAllUrl,
      iconClass: cfg.iconClass,
      mapProduct: mapper,
      getApiBaseUrl,
      needIconMap: cfg.needIconMap || null,
    });
  }

  // ─── Convenience aliases (preserve original API for consumers) ──
  const phoneCollection = categories.phone.collection;
  const phoneProducts = categories.phone.products;

  const tabletCollection = categories.tablet.collection;
  const tabletProducts = categories.tablet.products;
  const tabletLoading = categories.tablet.loading;
  const tabletLoaded = categories.tablet.loaded;
  const tabletError = categories.tablet.error;

  const laptopCollection = categories.laptop.collection;
  const laptopProducts = categories.laptop.products;
  const laptopLoading = categories.laptop.loading;
  const laptopLoaded = categories.laptop.loaded;
  const laptopError = categories.laptop.error;

  const monitorCollection = categories.monitor.collection;
  const monitorProducts = categories.monitor.products;
  const monitorLoading = categories.monitor.loading;
  const monitorLoaded = categories.monitor.loaded;
  const monitorError = categories.monitor.error;

  const pcCollection = categories.pc.collection;
  const pcProducts = categories.pc.products;
  const pcLoading = categories.pc.loading;
  const pcLoaded = categories.pc.loaded;
  const pcError = categories.pc.error;

  const computerAccessoryCollection = categories.computerAccessory.collection;
  const computerAccessoryProducts = categories.computerAccessory.products;
  const computerAccessoryLoading = categories.computerAccessory.loading;
  const computerAccessoryLoaded = categories.computerAccessory.loaded;
  const computerAccessoryError = categories.computerAccessory.error;

  const watchCollection = categories.watch.collection;
  const watchProducts = categories.watch.products;
  const watchLoading = categories.watch.loading;
  const watchLoaded = categories.watch.loaded;
  const watchError = categories.watch.error;

  const audioCollection = categories.audio.collection;
  const audioProducts = categories.audio.products;
  const audioLoading = categories.audio.loading;
  const audioLoaded = categories.audio.loaded;
  const audioError = categories.audio.error;

  const tvCollection = categories.tv.collection;
  const tvProducts = categories.tv.products;
  const tvLoading = categories.tv.loading;
  const tvLoaded = categories.tv.loaded;
  const tvError = categories.tv.error;

  const homeApplianceCollection = categories.homeAppliance.collection;
  const homeApplianceProducts = categories.homeAppliance.products;
  const homeApplianceLoading = categories.homeAppliance.loading;
  const homeApplianceLoaded = categories.homeAppliance.loaded;
  const homeApplianceError = categories.homeAppliance.error;

  const beautyHealthCollection = categories.beautyHealth.collection;
  const beautyHealthProducts = categories.beautyHealth.products;
  const beautyHealthLoading = categories.beautyHealth.loading;
  const beautyHealthLoaded = categories.beautyHealth.loaded;
  const beautyHealthError = categories.beautyHealth.error;

  const fridgeFreezerCollection = categories.fridgeFreezer.collection;
  const fridgeFreezerProducts = categories.fridgeFreezer.products;
  const fridgeFreezerLoading = categories.fridgeFreezer.loading;
  const fridgeFreezerLoaded = categories.fridgeFreezer.loaded;
  const fridgeFreezerError = categories.fridgeFreezer.error;

  const washingMachineCollection = categories.washingMachine.collection;
  const washingMachineProducts = categories.washingMachine.products;
  const washingMachineLoading = categories.washingMachine.loading;
  const washingMachineLoaded = categories.washingMachine.loaded;
  const washingMachineError = categories.washingMachine.error;

  const dryerCollection = categories.dryer.collection;
  const dryerProducts = categories.dryer.products;
  const dryerLoading = categories.dryer.loading;
  const dryerLoaded = categories.dryer.loaded;
  const dryerError = categories.dryer.error;

  const airConditionerCollection = categories.airConditioner.collection;
  const airConditionerProducts = categories.airConditioner.products;
  const airConditionerLoading = categories.airConditioner.loading;
  const airConditionerLoaded = categories.airConditioner.loaded;
  const airConditionerError = categories.airConditioner.error;

  // ─── Phone banners (static data) ───────────────────────────
  const phoneDesktopBanners = [
    {
      image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:321:795/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01KKXFP9PENJJF7Y55WM80DSAD.jpg",
      alt: "Điện thoại Banner 1",
      href: "/category/dien-thoai?sort=newest&limit=20",
    },
    {
      image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:321:795/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01KK8E4NQYFFSS1BRHNV4WXZZP.png",
      alt: "Điện thoại Banner 2",
      href: "/category/dien-thoai?sort=newest&limit=20",
    },
  ];

  const phoneMobileBanners = [
    ...phoneDesktopBanners,
    {
      image: "https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone_17e_pink_1.png",
      alt: "Điện thoại Banner Mobile",
      href: "/category/dien-thoai?sort=newest&limit=20",
    },
  ];

  // ─── Mega Menu ──────────────────────────────────────────────

  const setActiveMegaMenuKey = (key) => {
    if (!key) return;
    activeMegaMenuKey.value = key;
  };

  const toLeafMapFromSections = (sections) => {
    const next = {};
    (Array.isArray(sections) ? sections : []).forEach((section) => {
      if (!section?.key) return;
      next[section.key] = {
        key: section.key,
        title: section.title,
        children: Array.isArray(section.children) ? section.children : [],
      };
    });
    return next;
  };

  const toLeafMapFromItems = (items) => {
    const rootMap = {};
    (Array.isArray(items) ? items : []).forEach((item) => {
      const rootKey = item?.root_key;
      if (!rootKey) return;

      if (!rootMap[rootKey]) {
        rootMap[rootKey] = {
          key: rootKey,
          title: item.root_title || rootKey,
          children: [],
        };
      }

      const rootNode = rootMap[rootKey];
      const groupKey = item?.group_key || "others";
      const groupTitle = item?.group_title || "Khac";

      let groupNode = rootNode.children.find((group) => group.key === groupKey);
      if (!groupNode) {
        groupNode = { key: groupKey, title: groupTitle, items: [] };
        rootNode.children.push(groupNode);
      }

      groupNode.items.push({
        type: item.type || "link",
        title: item.title || "",
        slug: item.slug || "",
        url: item.url || (item.slug ? `/${item.slug}` : ""),
        image: item.image || "",
        badge: item.badge || "",
      });
    });
    return rootMap;
  };

  const leafMapToSections = (leafMap) =>
    Object.values(leafMap || {}).map((root) => ({
      key: root.key,
      title: root.title,
      children: Array.isArray(root.children) ? root.children : [],
    }));

  const fetchMegaMenu = async ({ force = false } = {}) => {
    if (megaMenuLoading.value && megaMenuPromise) return megaMenuPromise;
    if (megaMenuLoaded.value && !force) return megaMenuSections.value;

    megaMenuLoading.value = true;
    megaMenuError.value = null;

    megaMenuPromise = (async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/collections/mega-menu`);
        if (!res.ok) throw new Error("Fetch mega menu failed");

        const json = await res.json();
        const sections = json?.data?.sections || json?.sections || [];
        const items = json?.data?.items || json?.items || [];

        if (Array.isArray(items) && items.length) {
          megaMenuLeafByKey.value = toLeafMapFromItems(items);
          megaMenuSections.value = leafMapToSections(megaMenuLeafByKey.value);
        } else {
          megaMenuSections.value = Array.isArray(sections) ? sections : [];
          megaMenuLeafByKey.value = toLeafMapFromSections(megaMenuSections.value);
        }

        if (!activeMegaMenuKey.value || !megaMenuSections.value.some((s) => s.key === activeMegaMenuKey.value)) {
          activeMegaMenuKey.value = megaMenuSections.value[0]?.key || "";
        }

        megaMenuLoaded.value = true;
        return megaMenuSections.value;
      } catch (error) {
        megaMenuError.value = error instanceof Error ? error.message : "Fetch mega menu failed";
        throw error;
      } finally {
        megaMenuLoading.value = false;
        megaMenuPromise = null;
      }
    })();

    return megaMenuPromise;
  };

  const fetchMegaMenuLeaves = async ({ force = false } = {}) => {
    await fetchMegaMenu({ force });
    if (!megaMenuLeafByKey.value || !Object.keys(megaMenuLeafByKey.value).length) {
      megaMenuLeafByKey.value = toLeafMapFromSections(megaMenuSections.value);
    }
    return megaMenuLeafByKey.value;
  };

  const resetMegaMenu = () => {
    megaMenuSections.value = [];
    megaMenuLeafByKey.value = {};
    activeMegaMenuKey.value = "";
    megaMenuLoading.value = false;
    megaMenuLoaded.value = false;
    megaMenuError.value = null;
    megaMenuPromise = null;
  };

  // ─── Phone Brand Filter ─────────────────────────────────────

  const normalizeText = (value) =>
    String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .toLowerCase();

  const filterProductsByBrand = (products, brand) => {
    if (!brand || !brand.slug) return products;
    const slugKey = normalizeText(brand.slug);
    const titleKey = normalizeText(brand.title);
    const filtered = products.filter((item) => {
      const name = normalizeText(item.name);
      return name.includes(slugKey) || name.includes(titleKey);
    });
    return filtered.length ? filtered : products;
  };

  const selectPhoneBrand = (brand) => {
    selectedPhoneBrand.value = brand;
    phoneProducts.value = filterProductsByBrand(
      phoneCollection.value.allProducts || [],
      brand
    );
  };

  // ─── Phone fetch (special: brand selection) ─────────────────
  const fetchPhoneCollection = async ({ selectedBrand = null } = {}) => {
    // Use the factory fetch under the hood
    await categories.phone.fetchCollection();

    // Apply brand filter if needed
    selectedPhoneBrand.value = selectedBrand;
    phoneProducts.value = filterProductsByBrand(
      phoneCollection.value.allProducts || [],
      selectedBrand
    );

    return phoneCollection.value;
  };

  // ─── Delegate fetch functions ───────────────────────────────
  const fetchTabletCollection = (opts) => categories.tablet.fetchCollection(opts);
  const fetchLaptopCollection = (opts) => categories.laptop.fetchCollection(opts);
  const fetchMonitorCollection = (opts) => categories.monitor.fetchCollection(opts);
  const fetchPcCollection = (opts) => categories.pc.fetchCollection(opts);
  const fetchComputerAccessoryCollection = (opts) => categories.computerAccessory.fetchCollection(opts);
  const fetchWatchCollection = (opts) => categories.watch.fetchCollection(opts);
  const fetchAudioCollection = (opts) => categories.audio.fetchCollection(opts);
  const fetchTvCollection = (opts) => categories.tv.fetchCollection(opts);
  const fetchHomeApplianceCollection = (opts) => categories.homeAppliance.fetchCollection(opts);
  const fetchBeautyHealthCollection = (opts) => categories.beautyHealth.fetchCollection(opts);
  const fetchFridgeFreezerCollection = (opts) => categories.fridgeFreezer.fetchCollection(opts);
  const fetchWashingMachineCollection = (opts) => categories.washingMachine.fetchCollection(opts);
  const fetchDryerCollection = (opts) => categories.dryer.fetchCollection(opts);
  const fetchAirConditionerCollection = (opts) => categories.airConditioner.fetchCollection(opts);

  // ─── Home Data (aggregated) ─────────────────────────────────
  const fetchHomeData = async ({ force = false, selectedBrand = null } = {}) => {
    if (homeLoading.value && homePromise) return homePromise;
    if (homeLoaded.value && !force) {
      if (selectedBrand) selectPhoneBrand(selectedBrand);
      return;
    }

    homeLoading.value = true;
    homeError.value = null;

    homePromise = (async () => {
      try {
        await Promise.all([
          fetchMegaMenu({ force }),
          fetchPhoneCollection({ selectedBrand }),
          fetchLaptopCollection({ force }),
          fetchWatchCollection({ force }),
          fetchTvCollection({ force }),
          fetchHomeApplianceCollection({ force }),
          fetchFridgeFreezerCollection({ force }),
        ]);
        homeLoaded.value = true;
      } catch (error) {
        homeError.value = error instanceof Error ? error.message : "Fetch home data failed";
        throw error;
      } finally {
        homeLoading.value = false;
        homePromise = null;
      }
    })();

    return homePromise;
  };

  // ─── Public API ─────────────────────────────────────────────
  return {
    // Mega menu
    megaMenuSections,
    megaMenuLeafByKey,
    activeMegaMenuKey,
    megaMenuLoading,
    megaMenuLoaded,
    megaMenuError,

    // Phone
    phoneCollection,
    phoneProducts,
    selectedPhoneBrand,
    phoneDesktopBanners,
    phoneMobileBanners,

    // Tablet
    tabletCollection,
    tabletProducts,
    tabletLoading,
    tabletLoaded,
    tabletError,

    // Laptop
    laptopCollection,
    laptopProducts,
    laptopLoading,
    laptopLoaded,
    laptopError,

    // Monitor
    monitorCollection,
    monitorProducts,
    monitorLoading,
    monitorLoaded,
    monitorError,

    // PC
    pcCollection,
    pcProducts,
    pcLoading,
    pcLoaded,
    pcError,

    // Computer Accessory
    computerAccessoryCollection,
    computerAccessoryProducts,
    computerAccessoryLoading,
    computerAccessoryLoaded,
    computerAccessoryError,

    // Watch
    watchCollection,
    watchProducts,
    watchLoading,
    watchLoaded,
    watchError,

    // Audio
    audioCollection,
    audioProducts,
    audioLoading,
    audioLoaded,
    audioError,

    // TV
    tvCollection,
    tvProducts,
    tvLoading,
    tvLoaded,
    tvError,

    // Home Appliance
    homeApplianceCollection,
    homeApplianceProducts,
    homeApplianceLoading,
    homeApplianceLoaded,
    homeApplianceError,

    // Beauty & Health
    beautyHealthCollection,
    beautyHealthProducts,
    beautyHealthLoading,
    beautyHealthLoaded,
    beautyHealthError,

    // Fridge & Freezer
    fridgeFreezerCollection,
    fridgeFreezerProducts,
    fridgeFreezerLoading,
    fridgeFreezerLoaded,
    fridgeFreezerError,

    // Washing Machine
    washingMachineCollection,
    washingMachineProducts,
    washingMachineLoading,
    washingMachineLoaded,
    washingMachineError,

    // Dryer
    dryerCollection,
    dryerProducts,
    dryerLoading,
    dryerLoaded,
    dryerError,

    // Air Conditioner
    airConditionerCollection,
    airConditionerProducts,
    airConditionerLoading,
    airConditionerLoaded,
    airConditionerError,

    // Home-level loading
    homeLoading,
    homeLoaded,
    homeError,

    // Actions
    setActiveMegaMenuKey,
    fetchMegaMenu,
    fetchMegaMenuLeaves,
    fetchPhoneCollection,
    fetchTabletCollection,
    fetchLaptopCollection,
    fetchMonitorCollection,
    fetchPcCollection,
    fetchComputerAccessoryCollection,
    fetchWatchCollection,
    fetchAudioCollection,
    fetchTvCollection,
    fetchHomeApplianceCollection,
    fetchBeautyHealthCollection,
    fetchFridgeFreezerCollection,
    fetchWashingMachineCollection,
    fetchDryerCollection,
    fetchAirConditionerCollection,
    selectPhoneBrand,
    fetchHomeData,
    resetMegaMenu,
  };
});
