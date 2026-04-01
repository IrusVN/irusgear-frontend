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

  const homeLoading = ref(false);
  const homeLoaded = ref(false);
  const homeError = ref(null);

  let megaMenuPromise = null;
  let homePromise = null;

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
    phoneDesktopBanners,
    phoneMobileBanners,
    homeLoading,
    homeLoaded,
    homeError,
    setActiveMegaMenuKey,
    fetchMegaMenu,
    fetchMegaMenuLeaves,
    fetchPhoneCollection,
    selectPhoneBrand,
    fetchHomeData,
    resetMegaMenu,
  };
});
