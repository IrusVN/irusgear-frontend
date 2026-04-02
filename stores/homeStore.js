import { defineStore } from "pinia";
import { ref } from "vue";
import { useRuntimeConfig } from "#imports";

export const useHomeStore = defineStore("home", () => {
  const config = useRuntimeConfig();

  const megaMenuSections = ref([]);
  const megaMenuLeafByKey = ref({});
  const activeMegaMenuKey = ref("");
  const megaMenuLoading = ref(false);
  const megaMenuLoaded = ref(false);
  const megaMenuError = ref(null);

  const phoneCollection = ref({
    rootTitle: "ĐIỆN THOẠI",
    needItems: [],
    brandItems: [],
    allProducts: [],
    viewAllUrl: "/category/dien-thoai?sort=newest&limit=20",
  });
  const phoneProducts = ref([]);
  const selectedPhoneBrand = ref(null);

  const tabletCollection = ref({
    rootTitle: "MÁY TÍNH BẢNG",
    needItems: [],
    brandItems: [],
    allProducts: [],
    viewAllUrl: "/category/may-tinh-bang?sort=newest&limit=20",
  });
  const tabletProducts = ref([]);
  const tabletLoading = ref(false);
  const tabletLoaded = ref(false);
  const tabletError = ref(null);

  const laptopCollection = ref({
    rootTitle: "LAPTOP",
    needItems: [],
    brandItems: [],
    allProducts: [],
    viewAllUrl: "/category/laptop?sort=newest&limit=20",
  });
  const laptopProducts = ref([]);
  const laptopLoading = ref(false);
  const laptopLoaded = ref(false);
  const laptopError = ref(null);

  const monitorCollection = ref({
    rootTitle: "MÀN HÌNH MÁY TÍNH",
    needItems: [],
    brandItems: [],
    allProducts: [],
    viewAllUrl: "/category/man-hinh-may-tinh?sort=newest&limit=20",
  });
  const monitorProducts = ref([]);
  const monitorLoading = ref(false);
  const monitorLoaded = ref(false);
  const monitorError = ref(null);

  const pcCollection = ref({
    rootTitle: "PC",
    needItems: [],
    brandItems: [],
    allProducts: [],
    viewAllUrl: "/category/pc?sort=newest&limit=20",
  });
  const pcProducts = ref([]);
  const pcLoading = ref(false);
  const pcLoaded = ref(false);
  const pcError = ref(null);

  const computerAccessoryCollection = ref({
    rootTitle: "PHỤ KIỆN MÁY TÍNH",
    needItems: [],
    brandItems: [],
    allProducts: [],
    viewAllUrl: "/category/phu-kien-may-tinh?sort=newest&limit=20",
  });
  const computerAccessoryProducts = ref([]);
  const computerAccessoryLoading = ref(false);
  const computerAccessoryLoaded = ref(false);
  const computerAccessoryError = ref(null);

  const homeLoading = ref(false);
  const homeLoaded = ref(false);
  const homeError = ref(null);

  let megaMenuPromise = null;
  let homePromise = null;
  let tabletPromise = null;
  let laptopPromise = null;
  let monitorPromise = null;
  let pcPromise = null;
  let computerAccessoryPromise = null;

  const phoneDesktopBanners = [
    {
      image:
        "https://cdn2.cellphones.com.vn/insecure/rs:fill:321:795/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01KKXFP9PENJJF7Y55WM80DSAD.jpg",
      alt: "Điện thoại Banner 1",
      href: "/category/dien-thoai?sort=newest&limit=20",
    },
    {
      image:
        "https://cdn2.cellphones.com.vn/insecure/rs:fill:321:795/q:100/plain/https://media-asset.cellphones.com.vn/page_configs/01KK8E4NQYFFSS1BRHNV4WXZZP.png",
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

  const phoneNeedIconMap = {
    "dien-thoai-choi-game": "bi bi-controller",
    "dien-thoai-pin-trau": "bi bi-battery-charging",
    "dien-thoai-5g": "bi bi-badge-5g",
    "dien-thoai-chup-anh-dep": "bi bi-camera",
    "dien-thoai-gap": "bi bi-phone-flip",
    "dien-thoai-ai": "bi bi-cpu",
    "dien-thoai-pho-thong": "bi bi-phone",
  };

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
        groupNode = {
          key: groupKey,
          title: groupTitle,
          items: [],
        };
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

  const normalizeText = (value) =>
    String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .toLowerCase();

  const mapPhoneProduct = (product, index) => {
    const rawPrice = Number(product?.price) || 0;
    const discount = [5, 1, 1, 0, 4, 12][index % 6];
    const originalPrice = discount > 0 ? Math.round(rawPrice / (1 - discount / 100)) : null;

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      img: product.image,
      price: rawPrice,
      originalPrice,
      discount: discount > 0 ? discount : null,
      rating: product.rating ?? 5,
      reviewsCount: product.reviews_count ?? 0,
      badge: discount > 0 ? `Giảm ${discount}%` : null,
      installmentText: "Trả góp 0%",
      gifts: ["Smember giảm đến 500.000đ", "S-Student giảm thêm 300.000đ"],
    };
  };

  const mapTabletProduct = (product, index) => {
    const rawPrice = Number(product?.price) || 0;
    const discount = [12, 8, 6, 5, 10, 7][index % 6];
    const originalPrice = rawPrice > 0 ? Math.round(rawPrice / (1 - discount / 100)) : null;

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      img: product.image,
      price: rawPrice,
      originalPrice,
      discount,
      rating: product.rating ?? 5,
      reviewsCount: product.reviews_count ?? 0,
      badge: `Giảm ${discount}%`,
      installmentText: "Trả góp 0%",
      gifts: ["Smember giảm đến 230.000đ", "S-Student giảm thêm 500.000đ", "Không phí chuyển đổi khi trả góp 0% qua thẻ tín dụng kỳ hạn 3-6 tháng"],
      url: product.slug ? `/category/${product.slug}` : "#",
    };
  };

  const mapLaptopProduct = (product, index) => {
    const rawPrice = Number(product?.price) || 0;
    const discount = [9, 7, 6, 10, 8, 5][index % 6];
    const originalPrice = rawPrice > 0 ? Math.round(rawPrice / (1 - discount / 100)) : null;

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      img: product.image,
      price: rawPrice,
      originalPrice,
      discount,
      rating: product.rating ?? 5,
      reviewsCount: product.reviews_count ?? 0,
      badge: `Giảm ${discount}%`,
      installmentText: "Trả góp 0%",
      gifts: ["Smember giảm đến 500.000đ", "S-Student giảm thêm 300.000đ", "Trả góp 0% lãi suất qua thẻ tín dụng"],
      url: product.slug ? `/category/${product.slug}` : "#",
    };
  };

  const mapMonitorProduct = (product, index) => {
    const rawPrice = Number(product?.price) || 0;
    const discount = [6, 5, 9, 7, 8, 4][index % 6];
    const originalPrice = rawPrice > 0 ? Math.round(rawPrice / (1 - discount / 100)) : null;

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      img: product.image,
      price: rawPrice,
      originalPrice,
      discount,
      rating: product.rating ?? 5,
      reviewsCount: product.reviews_count ?? 0,
      badge: `Giảm ${discount}%`,
      installmentText: "Trả góp 0%",
      gifts: ["Smember giảm đến 300.000đ", "S-Student giảm thêm 200.000đ", "Trả góp 0% lãi suất qua thẻ tín dụng"],
      url: product.slug ? `/category/${product.slug}` : "#",
    };
  };

  const mapPcProduct = (product, index) => {
    const rawPrice = Number(product?.price) || 0;
    const discount = [7, 10, 8, 6, 9, 5][index % 6];
    const originalPrice = rawPrice > 0 ? Math.round(rawPrice / (1 - discount / 100)) : null;

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      img: product.image,
      price: rawPrice,
      originalPrice,
      discount,
      rating: product.rating ?? 5,
      reviewsCount: product.reviews_count ?? 0,
      badge: `Giảm ${discount}%`,
      installmentText: "Trả góp 0%",
      gifts: ["Smember giảm đến 400.000đ", "S-Student giảm thêm 300.000đ", "Ưu đãi lắp đặt và giao hàng nhanh"],
      url: product.slug ? `/category/${product.slug}` : "#",
    };
  };

  const mapComputerAccessoryProduct = (product, index) => {
    const rawPrice = Number(product?.price) || 0;
    const discount = [6, 8, 5, 7, 9, 4][index % 6];
    const originalPrice = rawPrice > 0 ? Math.round(rawPrice / (1 - discount / 100)) : null;

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      img: product.image,
      price: rawPrice,
      originalPrice,
      discount,
      rating: product.rating ?? 5,
      reviewsCount: product.reviews_count ?? 0,
      badge: `Giảm ${discount}%`,
      installmentText: "Trả góp 0%",
      gifts: ["Smember giảm đến 200.000đ", "S-Student giảm thêm 150.000đ", "Giao hàng nhanh toàn quốc"],
      url: product.slug ? `/category/${product.slug}` : "#",
    };
  };

  const filterProductsByBrand = (products, selectedBrand) => {
    if (!selectedBrand || !selectedBrand.slug) return products;

    const slugKey = normalizeText(selectedBrand.slug);
    const titleKey = normalizeText(selectedBrand.title);

    const filtered = products.filter((item) => {
      const productName = normalizeText(item.name);
      return productName.includes(slugKey) || productName.includes(titleKey);
    });

    return filtered.length ? filtered : products;
  };

  const fetchMegaMenu = async ({ force = false } = {}) => {
    if (megaMenuLoading.value && megaMenuPromise) return megaMenuPromise;
    if (megaMenuLoaded.value && !force) return megaMenuSections.value;

    megaMenuLoading.value = true;
    megaMenuError.value = null;

    megaMenuPromise = (async () => {
      try {
        const res = await fetch(`${config.public.apiBaseUrl}/collections/mega-menu`);
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

        if (!activeMegaMenuKey.value || !megaMenuSections.value.some((section) => section.key === activeMegaMenuKey.value)) {
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

  const fetchPhoneCollection = async ({ selectedBrand = null } = {}) => {
    const res = await fetch(`${config.public.apiBaseUrl}/collections/dien-thoai`);
    if (!res.ok) throw new Error("Fetch phone collection failed");

    const json = await res.json();
    const payload = json?.data || {};

    const mappedNeedItems = Array.isArray(payload.need_items)
      ? payload.need_items.map((item) => ({
          title: item.title,
          slug: item.slug,
          image: item.image || "",
          url: item.url,
          iconClass: phoneNeedIconMap[item.slug] || "bi bi-phone",
        }))
      : [];

    const mappedBrandItems = Array.isArray(payload.brand_items)
      ? payload.brand_items.map((item) => ({
          title: item.title,
          slug: item.slug,
          image: item.image,
          url: item.slug ? `/category/${item.slug}` : "#",
        }))
      : [];

    const mappedProducts = Array.isArray(payload.products) ? payload.products.map(mapPhoneProduct) : [];

    phoneCollection.value = {
      rootTitle: payload?.root?.title?.toUpperCase() || "ĐIỆN THOẠI",
      needItems: mappedNeedItems,
      brandItems: mappedBrandItems,
      allProducts: mappedProducts,
      viewAllUrl: "/category/dien-thoai?sort=newest&limit=20",
    };

    selectedPhoneBrand.value = selectedBrand;
    phoneProducts.value = filterProductsByBrand(mappedProducts, selectedBrand);

    return phoneCollection.value;
  };

  const fetchTabletCollection = async () => {
    if (tabletLoading.value && tabletPromise) return tabletPromise;
    if (tabletLoaded.value) return tabletCollection.value;

    tabletLoading.value = true;
    tabletError.value = null;

    tabletPromise = (async () => {
      const res = await fetch(`${config.public.apiBaseUrl}/collections/may-tinh-bang`);
      if (!res.ok) throw new Error("Fetch tablet collection failed");

      const json = await res.json();
      const payload = json?.data || {};

      const mappedBrandItems = Array.isArray(payload.brand_items)
        ? payload.brand_items.map((item) => ({
            title: item.title,
            slug: item.slug,
            image: item.image || "",
            url: item.url || (item.slug ? `/category/${item.slug}` : "#"),
          }))
        : [];

      const mappedProducts = Array.isArray(payload.products) ? payload.products.map(mapTabletProduct) : [];

      tabletCollection.value = {
        rootTitle: payload?.root?.title?.toUpperCase() || "MÁY TÍNH BẢNG",
        needItems: Array.isArray(payload.need_items) ? payload.need_items : [],
        brandItems: mappedBrandItems,
        allProducts: mappedProducts,
        viewAllUrl: "/category/may-tinh-bang?sort=newest&limit=20",
      };

      tabletProducts.value = mappedProducts;
      tabletLoaded.value = true;
      return tabletCollection.value;
    })();

    try {
      return await tabletPromise;
    } catch (error) {
      tabletError.value = error instanceof Error ? error.message : "Fetch tablet collection failed";
      throw error;
    } finally {
      tabletLoading.value = false;
      tabletPromise = null;
    }
  };

  const fetchLaptopCollection = async ({ force = false } = {}) => {
    if (laptopLoading.value && laptopPromise) return laptopPromise;
    if (laptopLoaded.value && !force) return laptopCollection.value;

    laptopLoading.value = true;
    laptopError.value = null;

    laptopPromise = (async () => {
      const res = await fetch(`${config.public.apiBaseUrl}/collections/laptop`);
      if (!res.ok) throw new Error("Fetch laptop collection failed");

      const json = await res.json();
      const payload = json?.data || {};

      const mappedNeedItems = Array.isArray(payload.need_items)
        ? payload.need_items.map((item) => ({
            title: item.title,
            slug: item.slug,
            image: item.image || "",
            url: item.slug ? `/category/${item.slug}` : "#",
            iconClass: "bi bi-laptop",
          }))
        : [];

      const mappedBrandItems = Array.isArray(payload.brand_items)
        ? payload.brand_items.map((item) => ({
            title: item.title,
            slug: item.slug,
            image: item.image || "",
            url: item.slug ? `/category/${item.slug}` : "#",
          }))
        : [];

      const mappedProducts = Array.isArray(payload.products) ? payload.products.map(mapLaptopProduct) : [];

      laptopCollection.value = {
        rootTitle: payload?.root?.title?.toUpperCase() || "LAPTOP",
        needItems: mappedNeedItems,
        brandItems: mappedBrandItems,
        allProducts: mappedProducts,
        viewAllUrl: "/category/laptop?sort=newest&limit=20",
      };

      laptopProducts.value = mappedProducts;
      laptopLoaded.value = true;
      return laptopCollection.value;
    })();

    try {
      return await laptopPromise;
    } catch (error) {
      laptopError.value = error instanceof Error ? error.message : "Fetch laptop collection failed";
      throw error;
    } finally {
      laptopLoading.value = false;
      laptopPromise = null;
    }
  };

  const fetchMonitorCollection = async ({ force = false } = {}) => {
    if (monitorLoading.value && monitorPromise) return monitorPromise;
    if (monitorLoaded.value && !force) return monitorCollection.value;

    monitorLoading.value = true;
    monitorError.value = null;

    monitorPromise = (async () => {
      const res = await fetch(`${config.public.apiBaseUrl}/collections/man-hinh-may-tinh`);
      if (!res.ok) throw new Error("Fetch monitor collection failed");

      const json = await res.json();
      const payload = json?.data || {};

      const mappedNeedItems = Array.isArray(payload.need_items)
        ? payload.need_items.map((item) => ({
            title: item.title,
            slug: item.slug,
            image: item.image || "",
            url: item.slug ? `/category/${item.slug}` : "#",
            iconClass: "bi bi-display",
          }))
        : [];

      const mappedBrandItems = Array.isArray(payload.brand_items)
        ? payload.brand_items.map((item) => ({
            title: item.title,
            slug: item.slug,
            image: item.image || "",
            url: item.slug ? `/category/${item.slug}` : "#",
          }))
        : [];

      const mappedProducts = Array.isArray(payload.products) ? payload.products.map(mapMonitorProduct) : [];

      monitorCollection.value = {
        rootTitle: payload?.root?.title?.toUpperCase() || "MÀN HÌNH MÁY TÍNH",
        needItems: mappedNeedItems,
        brandItems: mappedBrandItems,
        allProducts: mappedProducts,
        viewAllUrl: "/category/man-hinh-may-tinh?sort=newest&limit=20",
      };

      monitorProducts.value = mappedProducts;
      monitorLoaded.value = true;
      return monitorCollection.value;
    })();

    try {
      return await monitorPromise;
    } catch (error) {
      monitorError.value = error instanceof Error ? error.message : "Fetch monitor collection failed";
      throw error;
    } finally {
      monitorLoading.value = false;
      monitorPromise = null;
    }
  };

  const fetchPcCollection = async ({ force = false } = {}) => {
    if (pcLoading.value && pcPromise) return pcPromise;
    if (pcLoaded.value && !force) return pcCollection.value;

    pcLoading.value = true;
    pcError.value = null;

    pcPromise = (async () => {
      const res = await fetch(`${config.public.apiBaseUrl}/collections/pc`);
      if (!res.ok) throw new Error("Fetch PC collection failed");

      const json = await res.json();
      const payload = json?.data || {};

      const mappedNeedItems = Array.isArray(payload.need_items)
        ? payload.need_items.map((item) => ({
            title: item.title,
            slug: item.slug,
            image: item.image || "",
            url: item.url || (item.slug ? `/category/${item.slug}` : "#"),
            iconClass: "bi bi-pc-display",
          }))
        : [];

      const mappedBrandItems = Array.isArray(payload.brand_items)
        ? payload.brand_items.map((item) => ({
            title: item.title,
            slug: item.slug,
            image: item.image || "",
            url: item.url || (item.slug ? `/category/${item.slug}` : "#"),
          }))
        : [];

      const mappedProducts = Array.isArray(payload.products) ? payload.products.map(mapPcProduct) : [];

      pcCollection.value = {
        rootTitle: payload?.root?.title?.toUpperCase() || "PC",
        needItems: mappedNeedItems,
        brandItems: mappedBrandItems,
        allProducts: mappedProducts,
        viewAllUrl: "/category/pc?sort=newest&limit=20",
      };

      pcProducts.value = mappedProducts;
      pcLoaded.value = true;
      return pcCollection.value;
    })();

    try {
      return await pcPromise;
    } catch (error) {
      pcError.value = error instanceof Error ? error.message : "Fetch PC collection failed";
      throw error;
    } finally {
      pcLoading.value = false;
      pcPromise = null;
    }
  };

  const fetchComputerAccessoryCollection = async ({ force = false } = {}) => {
    if (computerAccessoryLoading.value && computerAccessoryPromise) return computerAccessoryPromise;
    if (computerAccessoryLoaded.value && !force) return computerAccessoryCollection.value;

    computerAccessoryLoading.value = true;
    computerAccessoryError.value = null;

    computerAccessoryPromise = (async () => {
      const res = await fetch(`${config.public.apiBaseUrl}/collections/phu-kien-may-tinh`);
      if (!res.ok) throw new Error("Fetch computer accessory collection failed");

      const json = await res.json();
      const payload = json?.data || {};

      const mappedNeedItems = Array.isArray(payload.need_items)
        ? payload.need_items.map((item) => ({
            title: item.title,
            slug: item.slug,
            image: item.image || "",
            url: item.url || (item.slug ? `/category/${item.slug}` : "#"),
            iconClass: "bi bi-mouse2",
          }))
        : [];

      const mappedBrandItems = Array.isArray(payload.brand_items)
        ? payload.brand_items.map((item) => ({
            title: item.title,
            slug: item.slug,
            image: item.image || "",
            url: item.url || (item.slug ? `/category/${item.slug}` : "#"),
          }))
        : [];

      const mappedProducts = Array.isArray(payload.products)
        ? payload.products.map(mapComputerAccessoryProduct)
        : [];

      computerAccessoryCollection.value = {
        rootTitle: payload?.root?.title?.toUpperCase() || "PHỤ KIỆN MÁY TÍNH",
        needItems: mappedNeedItems,
        brandItems: mappedBrandItems,
        allProducts: mappedProducts,
        viewAllUrl: "/category/phu-kien-may-tinh?sort=newest&limit=20",
      };

      computerAccessoryProducts.value = mappedProducts;
      computerAccessoryLoaded.value = true;
      return computerAccessoryCollection.value;
    })();

    try {
      return await computerAccessoryPromise;
    } catch (error) {
      computerAccessoryError.value =
        error instanceof Error ? error.message : "Fetch computer accessory collection failed";
      throw error;
    } finally {
      computerAccessoryLoading.value = false;
      computerAccessoryPromise = null;
    }
  };

  const selectPhoneBrand = (selectedBrand) => {
    selectedPhoneBrand.value = selectedBrand;
    phoneProducts.value = filterProductsByBrand(phoneCollection.value.allProducts || [], selectedBrand);
  };

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

  const fetchMegaMenuLeaves = async ({ force = false } = {}) => {
    await fetchMegaMenu({ force });

    // fetchMegaMenu already populates megaMenuLeafByKey from items when available.
    // Avoid remapping from sections here because section payload shape can differ.
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

  return {
    megaMenuSections,
    megaMenuLeafByKey,
    activeMegaMenuKey,
    megaMenuLoading,
    megaMenuLoaded,
    megaMenuError,
    phoneCollection,
    phoneProducts,
    selectedPhoneBrand,
    tabletCollection,
    tabletProducts,
    tabletLoading,
    tabletLoaded,
    tabletError,
    laptopCollection,
    laptopProducts,
    laptopLoading,
    laptopLoaded,
    laptopError,
    monitorCollection,
    monitorProducts,
    monitorLoading,
    monitorLoaded,
    monitorError,
    pcCollection,
    pcProducts,
    pcLoading,
    pcLoaded,
    pcError,
    computerAccessoryCollection,
    computerAccessoryProducts,
    computerAccessoryLoading,
    computerAccessoryLoaded,
    computerAccessoryError,
    phoneDesktopBanners,
    phoneMobileBanners,
    homeLoading,
    homeLoaded,
    homeError,
    setActiveMegaMenuKey,
    fetchMegaMenu,
    fetchMegaMenuLeaves,
    fetchPhoneCollection,
    fetchTabletCollection,
    fetchLaptopCollection,
    fetchMonitorCollection,
    fetchPcCollection,
    fetchComputerAccessoryCollection,
    selectPhoneBrand,
    fetchHomeData,
    resetMegaMenu,
  };
});
