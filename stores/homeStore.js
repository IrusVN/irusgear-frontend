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

  const watchCollection = ref({
    rootTitle: "ĐỒNG HỒ",
    needItems: [],
    brandItems: [],
    allProducts: [],
    viewAllUrl: "/category/dong-ho?sort=newest&limit=20",
  });
  const watchProducts = ref([]);
  const watchLoading = ref(false);
  const watchLoaded = ref(false);
  const watchError = ref(null);

  const audioCollection = ref({
    rootTitle: "ÂM THANH",
    needItems: [],
    brandItems: [],
    allProducts: [],
    viewAllUrl: "/category/am-thanh?sort=newest&limit=20",
  });
  const audioProducts = ref([]);
  const audioLoading = ref(false);
  const audioLoaded = ref(false);
  const audioError = ref(null);

  const tvCollection = ref({
    rootTitle: "TIVI",
    needItems: [],
    brandItems: [],
    allProducts: [],
    viewAllUrl: "/category/tivi?sort=newest&limit=20",
  });
  const tvProducts = ref([]);
  const tvLoading = ref(false);
  const tvLoaded = ref(false);
  const tvError = ref(null);

  const homeApplianceCollection = ref({
    rootTitle: "ĐỒ GIA DỤNG",
    needItems: [],
    brandItems: [],
    allProducts: [],
    viewAllUrl: "/category/do-gia-dung?sort=newest&limit=20",
  });
  const homeApplianceProducts = ref([]);
  const homeApplianceLoading = ref(false);
  const homeApplianceLoaded = ref(false);
  const homeApplianceError = ref(null);

  const beautyHealthCollection = ref({
    rootTitle: "SỨC KHỎE - LÀM ĐẸP",
    needItems: [],
    brandItems: [],
    allProducts: [],
    viewAllUrl: "/category/suc-khoe-lam-dep?sort=newest&limit=20",
  });
  const beautyHealthProducts = ref([]);
  const beautyHealthLoading = ref(false);
  const beautyHealthLoaded = ref(false);
  const beautyHealthError = ref(null);

  const fridgeFreezerCollection = ref({
    rootTitle: "TỦ LẠNH - TỦ ĐÔNG",
    needItems: [],
    brandItems: [],
    allProducts: [],
    viewAllUrl: "/category/tu-lanh-tu-dong?sort=newest&limit=20",
  });
  const fridgeFreezerProducts = ref([]);
  const fridgeFreezerLoading = ref(false);
  const fridgeFreezerLoaded = ref(false);
  const fridgeFreezerError = ref(null);

  const washingMachineCollection = ref({
    rootTitle: "MÁY GIẶT",
    needItems: [],
    brandItems: [],
    allProducts: [],
    viewAllUrl: "/category/may-giat?sort=newest&limit=20",
  });
  const washingMachineProducts = ref([]);
  const washingMachineLoading = ref(false);
  const washingMachineLoaded = ref(false);
  const washingMachineError = ref(null);

  const dryerCollection = ref({
    rootTitle: "MÁY SẤY QUẦN ÁO",
    needItems: [],
    brandItems: [],
    allProducts: [],
    viewAllUrl: "/category/may-say-quan-ao?sort=newest&limit=20",
  });
  const dryerProducts = ref([]);
  const dryerLoading = ref(false);
  const dryerLoaded = ref(false);
  const dryerError = ref(null);

  const airConditionerCollection = ref({
    rootTitle: "ĐIỀU HOÀ - MÁY LẠNH",
    needItems: [],
    brandItems: [],
    allProducts: [],
    viewAllUrl: "/category/dieu-hoa-may-lanh?sort=newest&limit=20",
  });
  const airConditionerProducts = ref([]);
  const airConditionerLoading = ref(false);
  const airConditionerLoaded = ref(false);
  const airConditionerError = ref(null);

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
  let watchPromise = null;
  let audioPromise = null;
  let tvPromise = null;
  let homeAppliancePromise = null;
  let beautyHealthPromise = null;
  let fridgeFreezerPromise = null;
  let washingMachinePromise = null;
  let dryerPromise = null;
  let airConditionerPromise = null;

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

  const mapWatchProduct = (product, index) => {
    const rawPrice = Number(product?.price) || 0;
    const discount = [8, 6, 5, 9, 7, 4][index % 6];
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
      gifts: ["Smember giảm đến 300.000đ", "S-Student giảm thêm 200.000đ", "Bảo hành chính hãng toàn quốc"],
      url: product.slug ? `/category/${product.slug}` : "#",
    };
  };

  const mapAudioProduct = (product, index) => {
    const rawPrice = Number(product?.price) || 0;
    const discount = [10, 8, 12, 7, 9, 6][index % 6];
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

  const mapTvProduct = (product, index) => {
    const rawPrice = Number(product?.price) || 0;
    const discount = [11, 9, 8, 10, 7, 6][index % 6];
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
      gifts: ["Smember giảm đến 600.000đ", "S-Student giảm thêm 300.000đ", "Giao hàng lắp đặt nhanh toàn quốc"],
      url: product.slug ? `/category/${product.slug}` : "#",
    };
  };

  const mapHomeApplianceProduct = (product, index) => {
    const rawPrice = Number(product?.price) || 0;
    const discount = [12, 10, 8, 11, 9, 7][index % 6];
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
      gifts: ["Smember giảm đến 300.000đ", "S-Student giảm thêm 200.000đ", "Giao nhanh toàn quốc"],
      url: product.slug ? `/category/${product.slug}` : "#",
    };
  };

  const mapBeautyHealthProduct = (product, index) => {
    const rawPrice = Number(product?.price) || 0;
    const discount = [9, 7, 8, 10, 6, 11][index % 6];
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
      gifts: ["Smember giảm đến 250.000đ", "S-Student giảm thêm 150.000đ", "Sản phẩm chính hãng"],
      url: product.slug ? `/category/${product.slug}` : "#",
    };
  };

  const mapFridgeFreezerProduct = (product, index) => {
    const rawPrice = Number(product?.price) || 0;
    const discount = [9, 7, 8, 10, 6, 11][index % 6];
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
      gifts: ["Smember giảm đến 500.000đ", "S-Student giảm thêm 300.000đ", "Hỗ trợ giao lắp nhanh"],
      url: product.slug ? `/category/${product.slug}` : "#",
    };
  };

  const mapWashingMachineProduct = (product, index) => {
    const rawPrice = Number(product?.price) || 0;
    const discount = [8, 10, 7, 9, 6, 11][index % 6];
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
      gifts: ["Smember giảm đến 500.000đ", "S-Student giảm thêm 300.000đ", "Giao lắp nhanh toàn quốc"],
      url: product.slug ? `/category/${product.slug}` : "#",
    };
  };

  const mapDryerProduct = (product, index) => {
    const rawPrice = Number(product?.price) || 0;
    const discount = [7, 9, 8, 10, 6, 11][index % 6];
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
      gifts: ["Smember giảm đến 400.000đ", "S-Student giảm thêm 250.000đ", "Hỗ trợ giao lắp nhanh"],
      url: product.slug ? `/category/${product.slug}` : "#",
    };
  };

  const mapAirConditionerProduct = (product, index) => {
    const rawPrice = Number(product?.price) || 0;
    const discount = [10, 8, 7, 9, 6, 11][index % 6];
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
      gifts: ["Smember giảm đến 600.000đ", "S-Student giảm thêm 300.000đ", "Lắp đặt nhanh toàn quốc"],
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

  const fetchWatchCollection = async ({ force = false } = {}) => {
    if (watchLoading.value && watchPromise) return watchPromise;
    if (watchLoaded.value && !force) return watchCollection.value;

    watchLoading.value = true;
    watchError.value = null;

    watchPromise = (async () => {
      const res = await fetch(`${config.public.apiBaseUrl}/collections/dong-ho`);
      if (!res.ok) throw new Error("Fetch watch collection failed");

      const json = await res.json();
      const payload = json?.data || {};

      const mappedNeedItems = Array.isArray(payload.need_items)
        ? payload.need_items.map((item) => ({
            title: item.title,
            slug: item.slug,
            image: item.image || "",
            url: item.url || (item.slug ? `/category/${item.slug}` : "#"),
            iconClass: "bi bi-smartwatch",
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
        ? payload.products.map(mapWatchProduct)
        : [];

      watchCollection.value = {
        rootTitle: payload?.root?.title?.toUpperCase() || "ĐỒNG HỒ",
        needItems: mappedNeedItems,
        brandItems: mappedBrandItems,
        allProducts: mappedProducts,
        viewAllUrl: "/category/dong-ho?sort=newest&limit=20",
      };

      watchProducts.value = mappedProducts;
      watchLoaded.value = true;
      return watchCollection.value;
    })();

    try {
      return await watchPromise;
    } catch (error) {
      watchError.value = error instanceof Error ? error.message : "Fetch watch collection failed";
      throw error;
    } finally {
      watchLoading.value = false;
      watchPromise = null;
    }
  };

  const fetchAudioCollection = async ({ force = false } = {}) => {
    if (audioLoading.value && audioPromise) return audioPromise;
    if (audioLoaded.value && !force) return audioCollection.value;

    audioLoading.value = true;
    audioError.value = null;

    audioPromise = (async () => {
      const res = await fetch(`${config.public.apiBaseUrl}/collections/am-thanh`);
      if (!res.ok) throw new Error("Fetch audio collection failed");

      const json = await res.json();
      const payload = json?.data || {};

      const mappedNeedItems = Array.isArray(payload.need_items)
        ? payload.need_items.map((item) => ({
            title: item.title,
            slug: item.slug,
            image: item.image || "",
            url: item.url || (item.slug ? `/category/${item.slug}` : "#"),
            iconClass: "bi bi-headphones",
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
        ? payload.products.map(mapAudioProduct)
        : [];

      audioCollection.value = {
        rootTitle: payload?.root?.title?.toUpperCase() || "ÂM THANH",
        needItems: mappedNeedItems,
        brandItems: mappedBrandItems,
        allProducts: mappedProducts,
        viewAllUrl: "/category/am-thanh?sort=newest&limit=20",
      };

      audioProducts.value = mappedProducts;
      audioLoaded.value = true;
      return audioCollection.value;
    })();

    try {
      return await audioPromise;
    } catch (error) {
      audioError.value = error instanceof Error ? error.message : "Fetch audio collection failed";
      throw error;
    } finally {
      audioLoading.value = false;
      audioPromise = null;
    }
  };

  const fetchTvCollection = async ({ force = false } = {}) => {
    if (tvLoading.value && tvPromise) return tvPromise;
    if (tvLoaded.value && !force) return tvCollection.value;

    tvLoading.value = true;
    tvError.value = null;

    tvPromise = (async () => {
      const res = await fetch(`${config.public.apiBaseUrl}/collections/tivi`);
      if (!res.ok) throw new Error("Fetch TV collection failed");

      const json = await res.json();
      const payload = json?.data || {};

      const mappedNeedItems = Array.isArray(payload.need_items)
        ? payload.need_items.map((item) => ({
            title: item.title,
            slug: item.slug,
            image: item.image || "",
            url: item.url || (item.slug ? `/category/${item.slug}` : "#"),
            iconClass: "bi bi-tv",
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
        ? payload.products.map(mapTvProduct)
        : [];

      tvCollection.value = {
        rootTitle: payload?.root?.title?.toUpperCase() || "TIVI",
        needItems: mappedNeedItems,
        brandItems: mappedBrandItems,
        allProducts: mappedProducts,
        viewAllUrl: "/category/tivi?sort=newest&limit=20",
      };

      tvProducts.value = mappedProducts;
      tvLoaded.value = true;
      return tvCollection.value;
    })();

    try {
      return await tvPromise;
    } catch (error) {
      tvError.value = error instanceof Error ? error.message : "Fetch TV collection failed";
      throw error;
    } finally {
      tvLoading.value = false;
      tvPromise = null;
    }
  };

  const fetchHomeApplianceCollection = async ({ force = false } = {}) => {
    if (homeApplianceLoading.value && homeAppliancePromise) return homeAppliancePromise;
    if (homeApplianceLoaded.value && !force) return homeApplianceCollection.value;

    homeApplianceLoading.value = true;
    homeApplianceError.value = null;

    homeAppliancePromise = (async () => {
      const res = await fetch(`${config.public.apiBaseUrl}/collections/do-gia-dung`);
      if (!res.ok) throw new Error("Fetch home appliance collection failed");

      const json = await res.json();
      const payload = json?.data || {};

      const mappedNeedItems = Array.isArray(payload.need_items)
        ? payload.need_items.map((item) => ({
            title: item.title,
            slug: item.slug,
            image: item.image || "",
            url: item.url || (item.slug ? `/category/${item.slug}` : "#"),
            iconClass: "bi bi-house",
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
        ? payload.products.map(mapHomeApplianceProduct)
        : [];

      homeApplianceCollection.value = {
        rootTitle: payload?.root?.title?.toUpperCase() || "ĐỒ GIA DỤNG",
        needItems: mappedNeedItems,
        brandItems: mappedBrandItems,
        allProducts: mappedProducts,
        viewAllUrl: "/category/do-gia-dung?sort=newest&limit=20",
      };

      homeApplianceProducts.value = mappedProducts;
      homeApplianceLoaded.value = true;
      return homeApplianceCollection.value;
    })();

    try {
      return await homeAppliancePromise;
    } catch (error) {
      homeApplianceError.value = error instanceof Error ? error.message : "Fetch home appliance collection failed";
      throw error;
    } finally {
      homeApplianceLoading.value = false;
      homeAppliancePromise = null;
    }
  };

  const fetchBeautyHealthCollection = async ({ force = false } = {}) => {
    if (beautyHealthLoading.value && beautyHealthPromise) return beautyHealthPromise;
    if (beautyHealthLoaded.value && !force) return beautyHealthCollection.value;

    beautyHealthLoading.value = true;
    beautyHealthError.value = null;

    beautyHealthPromise = (async () => {
      const res = await fetch(`${config.public.apiBaseUrl}/collections/suc-khoe-lam-dep`);
      if (!res.ok) throw new Error("Fetch beauty health collection failed");

      const json = await res.json();
      const payload = json?.data || {};

      const mappedNeedItems = Array.isArray(payload.need_items)
        ? payload.need_items.map((item) => ({
            title: item.title,
            slug: item.slug,
            image: item.image || "",
            url: item.url || (item.slug ? `/category/${item.slug}` : "#"),
            iconClass: "bi bi-heart-pulse",
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
        ? payload.products.map(mapBeautyHealthProduct)
        : [];

      beautyHealthCollection.value = {
        rootTitle: payload?.root?.title?.toUpperCase() || "SỨC KHỎE - LÀM ĐẸP",
        needItems: mappedNeedItems,
        brandItems: mappedBrandItems,
        allProducts: mappedProducts,
        viewAllUrl: "/category/suc-khoe-lam-dep?sort=newest&limit=20",
      };

      beautyHealthProducts.value = mappedProducts;
      beautyHealthLoaded.value = true;
      return beautyHealthCollection.value;
    })();

    try {
      return await beautyHealthPromise;
    } catch (error) {
      beautyHealthError.value = error instanceof Error ? error.message : "Fetch beauty health collection failed";
      throw error;
    } finally {
      beautyHealthLoading.value = false;
      beautyHealthPromise = null;
    }
  };

  const fetchFridgeFreezerCollection = async ({ force = false } = {}) => {
    if (fridgeFreezerLoading.value && fridgeFreezerPromise) return fridgeFreezerPromise;
    if (fridgeFreezerLoaded.value && !force) return fridgeFreezerCollection.value;

    fridgeFreezerLoading.value = true;
    fridgeFreezerError.value = null;

    fridgeFreezerPromise = (async () => {
      const res = await fetch(`${config.public.apiBaseUrl}/collections/tu-lanh-tu-dong`);
      if (!res.ok) throw new Error("Fetch fridge freezer collection failed");

      const json = await res.json();
      const payload = json?.data || {};

      const mappedNeedItems = Array.isArray(payload.need_items)
        ? payload.need_items.map((item) => ({
            title: item.title,
            slug: item.slug,
            image: item.image || "",
            url: item.url || (item.slug ? `/category/${item.slug}` : "#"),
            iconClass: "bi bi-snow",
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
        ? payload.products.map(mapFridgeFreezerProduct)
        : [];

      fridgeFreezerCollection.value = {
        rootTitle: payload?.root?.title?.toUpperCase() || "TỦ LẠNH - TỦ ĐÔNG",
        needItems: mappedNeedItems,
        brandItems: mappedBrandItems,
        allProducts: mappedProducts,
        viewAllUrl: "/category/tu-lanh-tu-dong?sort=newest&limit=20",
      };

      fridgeFreezerProducts.value = mappedProducts;
      fridgeFreezerLoaded.value = true;
      return fridgeFreezerCollection.value;
    })();

    try {
      return await fridgeFreezerPromise;
    } catch (error) {
      fridgeFreezerError.value =
        error instanceof Error ? error.message : "Fetch fridge freezer collection failed";
      throw error;
    } finally {
      fridgeFreezerLoading.value = false;
      fridgeFreezerPromise = null;
    }
  };

  const fetchWashingMachineCollection = async ({ force = false } = {}) => {
    if (washingMachineLoading.value && washingMachinePromise) return washingMachinePromise;
    if (washingMachineLoaded.value && !force) return washingMachineCollection.value;

    washingMachineLoading.value = true;
    washingMachineError.value = null;

    washingMachinePromise = (async () => {
      const res = await fetch(`${config.public.apiBaseUrl}/collections/may-giat`);
      if (!res.ok) throw new Error("Fetch washing machine collection failed");

      const json = await res.json();
      const payload = json?.data || {};

      const mappedNeedItems = Array.isArray(payload.need_items)
        ? payload.need_items.map((item) => ({
            title: item.title,
            slug: item.slug,
            image: item.image || "",
            url: item.url || (item.slug ? `/category/${item.slug}` : "#"),
            iconClass: "bi bi-badge-wc",
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
        ? payload.products.map(mapWashingMachineProduct)
        : [];

      washingMachineCollection.value = {
        rootTitle: payload?.root?.title?.toUpperCase() || "MÁY GIẶT",
        needItems: mappedNeedItems,
        brandItems: mappedBrandItems,
        allProducts: mappedProducts,
        viewAllUrl: "/category/may-giat?sort=newest&limit=20",
      };

      washingMachineProducts.value = mappedProducts;
      washingMachineLoaded.value = true;
      return washingMachineCollection.value;
    })();

    try {
      return await washingMachinePromise;
    } catch (error) {
      washingMachineError.value =
        error instanceof Error ? error.message : "Fetch washing machine collection failed";
      throw error;
    } finally {
      washingMachineLoading.value = false;
      washingMachinePromise = null;
    }
  };

  const fetchDryerCollection = async ({ force = false } = {}) => {
    if (dryerLoading.value && dryerPromise) return dryerPromise;
    if (dryerLoaded.value && !force) return dryerCollection.value;

    dryerLoading.value = true;
    dryerError.value = null;

    dryerPromise = (async () => {
      const res = await fetch(`${config.public.apiBaseUrl}/collections/may-say-quan-ao`);
      if (!res.ok) throw new Error("Fetch dryer collection failed");

      const json = await res.json();
      const payload = json?.data || {};

      const mappedNeedItems = Array.isArray(payload.need_items)
        ? payload.need_items.map((item) => ({
            title: item.title,
            slug: item.slug,
            image: item.image || "",
            url: item.url || (item.slug ? `/category/${item.slug}` : "#"),
            iconClass: "bi bi-wind",
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
        ? payload.products.map(mapDryerProduct)
        : [];

      dryerCollection.value = {
        rootTitle: payload?.root?.title?.toUpperCase() || "MÁY SẤY QUẦN ÁO",
        needItems: mappedNeedItems,
        brandItems: mappedBrandItems,
        allProducts: mappedProducts,
        viewAllUrl: "/category/may-say-quan-ao?sort=newest&limit=20",
      };

      dryerProducts.value = mappedProducts;
      dryerLoaded.value = true;
      return dryerCollection.value;
    })();

    try {
      return await dryerPromise;
    } catch (error) {
      dryerError.value = error instanceof Error ? error.message : "Fetch dryer collection failed";
      throw error;
    } finally {
      dryerLoading.value = false;
      dryerPromise = null;
    }
  };

  const fetchAirConditionerCollection = async ({ force = false } = {}) => {
    if (airConditionerLoading.value && airConditionerPromise) return airConditionerPromise;
    if (airConditionerLoaded.value && !force) return airConditionerCollection.value;

    airConditionerLoading.value = true;
    airConditionerError.value = null;

    airConditionerPromise = (async () => {
      const res = await fetch(`${config.public.apiBaseUrl}/collections/dieu-hoa-may-lanh`);
      if (!res.ok) throw new Error("Fetch air conditioner collection failed");

      const json = await res.json();
      const payload = json?.data || {};

      const mappedNeedItems = Array.isArray(payload.need_items)
        ? payload.need_items.map((item) => ({
            title: item.title,
            slug: item.slug,
            image: item.image || "",
            url: item.url || (item.slug ? `/category/${item.slug}` : "#"),
            iconClass: "bi bi-snow2",
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
        ? payload.products.map(mapAirConditionerProduct)
        : [];

      airConditionerCollection.value = {
        rootTitle: payload?.root?.title?.toUpperCase() || "ĐIỀU HOÀ - MÁY LẠNH",
        needItems: mappedNeedItems,
        brandItems: mappedBrandItems,
        allProducts: mappedProducts,
        viewAllUrl: "/category/dieu-hoa-may-lanh?sort=newest&limit=20",
      };

      airConditionerProducts.value = mappedProducts;
      airConditionerLoaded.value = true;
      return airConditionerCollection.value;
    })();

    try {
      return await airConditionerPromise;
    } catch (error) {
      airConditionerError.value =
        error instanceof Error ? error.message : "Fetch air conditioner collection failed";
      throw error;
    } finally {
      airConditionerLoading.value = false;
      airConditionerPromise = null;
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
    watchCollection,
    watchProducts,
    watchLoading,
    watchLoaded,
    watchError,
    audioCollection,
    audioProducts,
    audioLoading,
    audioLoaded,
    audioError,
    tvCollection,
    tvProducts,
    tvLoading,
    tvLoaded,
    tvError,
    homeApplianceCollection,
    homeApplianceProducts,
    homeApplianceLoading,
    homeApplianceLoaded,
    homeApplianceError,
    beautyHealthCollection,
    beautyHealthProducts,
    beautyHealthLoading,
    beautyHealthLoaded,
    beautyHealthError,
    fridgeFreezerCollection,
    fridgeFreezerProducts,
    fridgeFreezerLoading,
    fridgeFreezerLoaded,
    fridgeFreezerError,
    washingMachineCollection,
    washingMachineProducts,
    washingMachineLoading,
    washingMachineLoaded,
    washingMachineError,
    dryerCollection,
    dryerProducts,
    dryerLoading,
    dryerLoaded,
    dryerError,
    airConditionerCollection,
    airConditionerProducts,
    airConditionerLoading,
    airConditionerLoaded,
    airConditionerError,
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
