import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { storeToRefs } from "pinia";
import { useFeGlobalStore } from "@/stores/feGlobalStore";

const SORT_ICONS = {
  popular:
    '<svg viewBox="0 0 20 20" fill="none"><path d="M10 2.5L12.25 7.05L17.25 7.77L13.63 11.3L14.48 16.27L10 13.92L5.52 16.27L6.37 11.3L2.75 7.77L7.75 7.05L10 2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  promo:
    '<svg viewBox="0 0 20 20" fill="none"><path d="M10 3L11.9 4.65L14.42 4.45L14.93 6.92L17 8.35L15.74 10.55L16.35 13L13.92 13.82L12.55 15.95L10 15.2L7.45 15.95L6.08 13.82L3.65 13L4.26 10.55L3 8.35L5.07 6.92L5.58 4.45L8.1 4.65L10 3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 10L9.3 11.3L12.5 8.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  price_asc:
    '<svg viewBox="0 0 20 20" fill="none"><path d="M4 5H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M4 9H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M4 13H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M14 14.5V5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M11.5 8L14 5.5L16.5 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  price_desc:
    '<svg viewBox="0 0 20 20" fill="none"><path d="M4 5H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M4 9H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M4 13H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M14 5.5V14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M11.5 12L14 14.5L16.5 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

const SORT_LABELS = {
  popular: "Phổ biến",
  promo: "Khuyến mãi HOT",
  price_asc: "Giá Thấp - Cao",
  price_desc: "Giá Cao - Thấp",
};

const FILTER_UI = {
  filter: { label: "Bộ lọc", leadingIcon: "filter", primary: true },
  stock: { label: "Sẵn hàng", leadingIcon: "truck" },
  new: { label: "Hàng mới về", leadingIcon: "new" },
  price: { label: "Xem theo giá", leadingIcon: "price" },
  major: { trailingIcon: "chevron" },
  usage: { trailingIcon: "chevron-info" },
  cpu: { trailingIcon: "chevron" },
  ram: { trailingIcon: "chevron-info" },
  storage: { trailingIcon: "chevron-info" },
  screen: { trailingIcon: "chevron" },
  resolution: { trailingIcon: "chevron" },
  feature: { trailingIcon: "chevron" },
};

const QUICK_FILTER_KEYS = ["filter", "stock", "new", "price"];

const PRICE_FILTER_KEY = "price";

const DEFAULT_BANNERS = [
  { id: "primary", items: [] },
  { id: "secondary", items: [] },
];

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 20,
  totalItems: 0,
  hasNext: false,
  nextPage: null,
  remainingItems: 0,
};

const DEFAULT_SORT_OPTIONS = Object.keys(SORT_LABELS).map((key) => ({
  key,
  label: SORT_LABELS[key],
  icon: SORT_ICONS[key],
}));

const DEFAULT_FILTERS = QUICK_FILTER_KEYS.map((key) => ({
  key,
  queryKey: key,
  label: FILTER_UI[key].label,
  leadingIcon: FILTER_UI[key].leadingIcon,
  trailingIcon: FILTER_UI[key].trailingIcon,
  primary: Boolean(FILTER_UI[key].primary),
  options: [],
  optionMeta: [],
}));

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  return [value];
};

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeSelectedValues = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || "").trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "boolean") {
    return value ? ["true"] : [];
  }

  if (value == null) {
    return [];
  }

  return [String(value).trim()].filter(Boolean);
};

const normalizeSearchText = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const isPriceFilter = (filter) => {
  const key = normalizeSearchText(filter?.key).replace(/[-\s]+/g, "_");
  const label = normalizeSearchText(filter?.label);

  return (
    key === PRICE_FILTER_KEY ||
    key.includes("price") ||
    key.includes("gia_tien") ||
    label === "gia tien" ||
    label === "xem theo gia" ||
    label === "khoang gia" ||
    label === "muc gia"
  );
};

const normalizeListingContext = (context = {}) =>
  Object.entries(context).reduce((accumulator, [key, value]) => {
    const normalizedKey = String(key || "").trim();
    const normalizedValue = Array.isArray(value)
      ? String(value[0] || "").trim()
      : String(value || "").trim();

    if (normalizedKey && normalizedValue) {
      accumulator[normalizedKey] = normalizedValue;
    }

    return accumulator;
  }, {});

const serializeListingContext = (context = {}) => {
  const normalizedContext = normalizeListingContext(context);

  return JSON.stringify(
    Object.keys(normalizedContext)
      .sort()
      .reduce((accumulator, key) => {
        accumulator[key] = normalizedContext[key];
        return accumulator;
      }, {}),
  );
};

const isSameListingContext = (left = {}, right = {}) =>
  serializeListingContext(left) === serializeListingContext(right);

const normalizePositiveInteger = (value, fallback) => {
  const parsed = Math.floor(toNumber(value, fallback));
  return parsed > 0 ? parsed : fallback;
};

const transformListingPayload = (payload = {}, previousSelection = {}) => {
  const meta = payload?.meta || {};
  const applied = payload?.applied || meta?.applied || {};
  const appliedFilters = applied?.filters || payload?.filters || {};
  const rawItems = Array.isArray(payload?.items)
    ? payload.items
    : Array.isArray(payload?.data?.items)
      ? payload.data.items
      : Array.isArray(payload?.data)
        ? payload.data
        : [];

  const primaryBanners = toArray(payload?.banners?.primary || meta?.banners?.primary).filter(Boolean);
  const secondaryBanners = toArray(payload?.banners?.secondary || meta?.banners?.secondary).filter(Boolean);
  const fallbackBanners = primaryBanners.length ? primaryBanners : secondaryBanners;

  const sortSource = toArray(payload?.sortOptions || meta?.sortOptions);
  const filterSource = toArray(payload?.filters || meta?.filters);
  const seriesSource = toArray(payload?.series || meta?.series);
  const selectedSeriesKeys = normalizeSelectedValues(applied?.series);
  const selectedSeriesKey =
    selectedSeriesKeys[0] ||
    String(seriesSource.find((item) => Boolean(item?.active))?.key || "");
  const activeSortKey = String(applied?.sort || payload?.sort || "popular");

  const apiFilters = filterSource
    .filter((filter) => filter?.key)
    .map((filter) => {
      const optionMeta = toArray(filter?.options)
        .filter(Boolean)
        .map((option) => ({
          value: String(option?.value ?? option?.key ?? option?.slug ?? option?.label ?? option),
          label: String(option?.label ?? option?.title ?? option?.name ?? option),
          count: option?.count,
        }));
      const ui = FILTER_UI[filter.key] || {};

      return {
        key: String(filter.key),
        queryKey: String(filter.key),
        label: String(filter?.label || ui.label || filter.key),
        leadingIcon: ui.leadingIcon,
        trailingIcon: ui.trailingIcon || (optionMeta.length ? "chevron" : undefined),
        primary: Boolean(ui.primary),
        options: optionMeta.map((option) => option.label),
        optionMeta,
      };
    });

  const apiPriceFilter = apiFilters.find(isPriceFilter);
  const priceFilter = apiPriceFilter
    ? {
        ...apiPriceFilter,
        key: PRICE_FILTER_KEY,
        queryKey: apiPriceFilter.queryKey || apiPriceFilter.key,
        label: FILTER_UI[PRICE_FILTER_KEY].label,
        leadingIcon: FILTER_UI[PRICE_FILTER_KEY].leadingIcon,
        trailingIcon: apiPriceFilter.trailingIcon || FILTER_UI[PRICE_FILTER_KEY].trailingIcon || "chevron",
        primary: Boolean(FILTER_UI[PRICE_FILTER_KEY].primary),
      }
    : null;

  const productFilters = [
    ...QUICK_FILTER_KEYS.map((key) => {
      if (key === PRICE_FILTER_KEY && priceFilter) return priceFilter;

      const filter = apiFilters.find((item) => item.key === key);
      if (filter) return filter;

      return {
        key,
        queryKey: key,
        label: FILTER_UI[key].label,
        leadingIcon: FILTER_UI[key].leadingIcon,
        trailingIcon: FILTER_UI[key].trailingIcon,
        primary: Boolean(FILTER_UI[key].primary),
        options: [],
        optionMeta: [],
      };
    }),
    ...apiFilters.filter((filter) => !QUICK_FILTER_KEYS.includes(filter.key) && !isPriceFilter(filter)),
  ];

  const selectedOptionsByFilter = Object.entries(appliedFilters).reduce((accumulator, [filterKey, filterValue]) => {
    const filter = productFilters.find((item) => item.key === filterKey || item.queryKey === filterKey);
    if (!filter) return accumulator;

    const selectedFilterKey = filter.key;
    const values = normalizeSelectedValues(filterValue);

    if (!values.length) return accumulator;

    if (!filter.optionMeta.length) {
      accumulator[selectedFilterKey] = [filter.label];
      return accumulator;
    }

    accumulator[selectedFilterKey] = values
      .map((value) => filter.optionMeta.find((option) => option.value === value)?.label)
      .filter(Boolean);

    return accumulator;
  }, {});

  QUICK_FILTER_KEYS
    .filter((filterKey) => filterKey !== "filter")
    .forEach((filterKey) => {
      if (selectedOptionsByFilter[filterKey]?.length) return;

      const previousValues = toArray(previousSelection?.[filterKey]).filter(Boolean);
      if (!previousValues.length) return;

      const filter = productFilters.find((item) => item.key === filterKey);
      if (!filter) return;

      selectedOptionsByFilter[filterKey] = previousValues;
    });

  const totalItems = toNumber(payload?.pagination?.totalItems ?? meta?.total, rawItems.length);
  const page = toNumber(payload?.pagination?.page ?? meta?.current_page, 1);
  const limit = toNumber(payload?.pagination?.limit ?? meta?.per_page, rawItems.length || 20);
  const hasNext =
    typeof payload?.pagination?.hasNext === "boolean"
      ? payload.pagination.hasNext
      : page * limit < totalItems;

  return {
    pageTitle: payload?.title || meta?.title ? String(payload.title || meta.title) : "",
    bannerGroups: [
      { id: "primary", items: primaryBanners.length ? primaryBanners : fallbackBanners },
      {
        id: "secondary",
        items: secondaryBanners.length ? secondaryBanners : [...fallbackBanners].reverse(),
      },
    ],
    productSeries: seriesSource
      .filter(Boolean)
      .map((item) => {
        const key = String(item?.key || item?.slug || item?.value || item?.label || "");
        return {
          key,
          label: String(item?.label || item?.title || item?.name || ""),
          href: item?.href || item?.url || "",
          active: Boolean(item?.active) || key === selectedSeriesKey,
        };
      }),
    sortOptions: DEFAULT_SORT_OPTIONS,
    productFilters,
    productListItems: rawItems.map((product) => ({
      id: product?.id ?? product?.product_id ?? product?.slug ?? product?.url ?? product?.name ?? "",
      slug: product?.slug || product?.handle || "",
      url: product?.url || product?.href || "",
      img: product?.img || product?.image || product?.thumbnail || product?.thumbnail_url || "",
      name: product?.name || product?.title || "",
      badge: typeof product?.badge === "boolean" ? product.badge : toNumber(product?.discount) > 0,
      discount: toNumber(product?.discount),
      installmentText: product?.installmentText || product?.installment_text || "",
      price: toNumber(product?.price),
      originalPrice: toNumber(product?.originalPrice ?? product?.original_price),
      gifts: toArray(product?.gifts).filter((gift) => typeof gift === "string" && gift.trim()),
      rating: toNumber(product?.rating, 5),
    })),
    paginationState: {
      page,
      limit,
      totalItems,
      hasNext,
      nextPage: hasNext ? toNumber(payload?.pagination?.nextPage, page + 1) : null,
      remainingItems: toNumber(
        payload?.pagination?.remainingItems,
        Math.max(0, totalItems - page * limit),
      ),
    },
    activeSortKey,
    selectedSeriesKey,
    selectedOptionsByFilter,
  };
};

const createDefaultListingState = () => ({
  pageTitle: "",
  bannerGroups: [...DEFAULT_BANNERS],
  productSeries: [],
  sortOptions: [...DEFAULT_SORT_OPTIONS],
  productFilters: [...DEFAULT_FILTERS],
  productListItems: [],
  paginationState: { ...DEFAULT_PAGINATION },
  activeSortKey: "popular",
  selectedSeriesKey: "",
  selectedOptionsByFilter: {},
});

export const useProductListingStore = defineStore("product-listing", () => {
  const feGlobalStore = useFeGlobalStore();
  const { error } = storeToRefs(feGlobalStore);

  const listingContext = ref(normalizeListingContext());
  const categorySlug = computed(() => String(listingContext.value.category || ""));
  const pageTitle = ref("");
  const bannerGroups = ref([...DEFAULT_BANNERS]);
  const productSeries = ref([]);
  const sortOptions = ref([...DEFAULT_SORT_OPTIONS]);
  const productFilters = ref([...DEFAULT_FILTERS]);
  const productListItems = ref([]);
  const paginationState = ref({ ...DEFAULT_PAGINATION });
  const activeSortKey = ref("popular");
  const selectedSeriesKey = ref("");
  const selectedOptionsByFilter = ref({});
  const isPageLoading = ref(false);
  const isLoadingMore = ref(false);
  const isLoaded = ref(false);
  const listingRequestToken = ref(0);

  const productListingError = computed(() => error.value);
  const visibleProductListItems = computed(() => productListItems.value);
  const remainingProductCount = computed(() => toNumber(paginationState.value?.remainingItems));
  const hasMoreProducts = computed(() => Boolean(paginationState.value?.hasNext));

  const resolveOptionValue = (filterKey, optionLabel) => {
    const filter = productFilters.value.find((item) => item.key === filterKey);
    const option = filter?.optionMeta?.find((item) => item.label === optionLabel);
    return option?.value || optionLabel;
  };

  const resolveFilterQueryKey = (filterKey) => {
    const filter = productFilters.value.find((item) => item.key === filterKey);
    return filter?.queryKey || filterKey;
  };

  const buildQueryParams = ({ page = 1 } = {}) => {
    const params = {
      ...normalizeListingContext(listingContext.value),
      page,
      limit: paginationState.value.limit || DEFAULT_PAGINATION.limit,
      sort: activeSortKey.value || "popular",
    };

    if (selectedSeriesKey.value) {
      params.series = selectedSeriesKey.value;
    }

    Object.entries(selectedOptionsByFilter.value).forEach(([filterKey, values]) => {
      const labels = toArray(values).filter(Boolean);
      if (!labels.length) return;

      if (filterKey === "stock" || filterKey === "new") {
        params[filterKey] = "true";
        return;
      }

      const queryValue = labels
        .map((label) => resolveOptionValue(filterKey, label))
        .filter(Boolean)
        .join(",");

      if (queryValue) {
        params[resolveFilterQueryKey(filterKey)] = queryValue;
      }
    });

    return params;
  };

  const applyListingState = (payload, { append = false } = {}) => {
    const nextState = transformListingPayload(payload, selectedOptionsByFilter.value);

    pageTitle.value = nextState.pageTitle;
    bannerGroups.value = nextState.bannerGroups;
    productSeries.value = nextState.productSeries;
    sortOptions.value = nextState.sortOptions;
    productFilters.value = nextState.productFilters;
    paginationState.value = nextState.paginationState;
    activeSortKey.value = nextState.activeSortKey;
    selectedSeriesKey.value = nextState.selectedSeriesKey;
    selectedOptionsByFilter.value = nextState.selectedOptionsByFilter;
    productListItems.value = append
      ? [...productListItems.value, ...nextState.productListItems]
      : nextState.productListItems;
    isLoaded.value = true;
  };

  const fetchProductListing = async ({ page = 1, append = false } = {}) => {
    let requestToken = listingRequestToken.value;

    try {
      requestToken = listingRequestToken.value + 1;
      listingRequestToken.value = requestToken;

      if (append) {
        isLoadingMore.value = true;
      } else {
        isPageLoading.value = true;
      }

      feGlobalStore.setApiUrl("products");
      const res = await feGlobalStore.fetchItem(buildQueryParams({ page }));

      if (listingRequestToken.value !== requestToken) {
        return productListItems.value;
      }

      if (res) {
        applyListingState(res.data || res, { append });
      } else if (!append) {
        productListItems.value = [];
      }
    } catch (e) {
      if (listingRequestToken.value !== requestToken) {
        return productListItems.value;
      }

      if (!append) {
        productListItems.value = [];
      }
    } finally {
      if (listingRequestToken.value === requestToken) {
        isPageLoading.value = false;
        isLoadingMore.value = false;
      }
    }

    return productListItems.value;
  };

  const initializeListing = async ({ context = {}, force = false } = {}) => {
    const nextContext = normalizeListingContext(context);
    const isNewContext = !isSameListingContext(listingContext.value, nextContext);
    const requestedPage = normalizePositiveInteger(nextContext.page, DEFAULT_PAGINATION.page);
    const requestedLimit = normalizePositiveInteger(nextContext.limit, DEFAULT_PAGINATION.limit);
    const requestedSort = String(nextContext.sort || DEFAULT_SORT_OPTIONS[0]?.key || "popular").trim() || "popular";

    if (isNewContext) {
      resetListing();
      listingContext.value = nextContext;
    }

    if (isNewContext || !isLoaded.value || force) {
      paginationState.value = {
        ...paginationState.value,
        page: requestedPage,
        limit: requestedLimit,
      };
      activeSortKey.value = requestedSort;
    }

    if (!force && isLoaded.value && !isNewContext) {
      return productListItems.value;
    }

    return fetchProductListing({ page: requestedPage });
  };

  const loadProductListingPage = async ({ page = 1, append = false } = {}) => {
    return fetchProductListing({ page, append });
  };

  const setSortKey = async (sortKey) => {
    if (!sortKey || sortKey === activeSortKey.value) {
      return productListItems.value;
    }

    activeSortKey.value = sortKey;
    return fetchProductListing({ page: 1 });
  };

  const toggleSeries = async (seriesKey) => {
    selectedSeriesKey.value = selectedSeriesKey.value === seriesKey ? "" : seriesKey;
    productSeries.value = productSeries.value.map((item) => ({
      ...item,
      active: item.key === selectedSeriesKey.value,
    }));

    return fetchProductListing({ page: 1 });
  };

  const toggleBooleanFilter = (filterKey, label) => {
    const current = selectedOptionsByFilter.value[filterKey] || [];

    selectedOptionsByFilter.value = {
      ...selectedOptionsByFilter.value,
      [filterKey]: current.length ? [] : [label],
    };
  };

  const toggleFilterOption = (filterKey, option) => {
    const current = selectedOptionsByFilter.value[filterKey] || [];

    selectedOptionsByFilter.value = {
      ...selectedOptionsByFilter.value,
      [filterKey]: current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    };
  };

  const resetListing = () => {
    const defaultState = createDefaultListingState();

    listingRequestToken.value += 1;
    listingContext.value = normalizeListingContext();
    pageTitle.value = defaultState.pageTitle;
    bannerGroups.value = defaultState.bannerGroups;
    productSeries.value = defaultState.productSeries;
    sortOptions.value = defaultState.sortOptions;
    productFilters.value = defaultState.productFilters;
    productListItems.value = defaultState.productListItems;
    paginationState.value = defaultState.paginationState;
    activeSortKey.value = defaultState.activeSortKey;
    selectedSeriesKey.value = defaultState.selectedSeriesKey;
    selectedOptionsByFilter.value = defaultState.selectedOptionsByFilter;
    isPageLoading.value = false;
    isLoadingMore.value = false;
    isLoaded.value = false;
  };

  return {
    listingContext,
    categorySlug,
    pageTitle,
    bannerGroups,
    productSeries,
    sortOptions,
    productFilters,
    productListItems,
    paginationState,
    activeSortKey,
    selectedSeriesKey,
    selectedOptionsByFilter,
    isPageLoading,
    isLoadingMore,
    isLoaded,
    productListingError,
    visibleProductListItems,
    remainingProductCount,
    hasMoreProducts,
    initializeListing,
    loadProductListingPage,
    setSortKey,
    toggleSeries,
    toggleBooleanFilter,
    toggleFilterOption,
    resetListing,
  };
});
