/**
 * collectionFactory.js
 * ---
 * Generic factory for category collection state, fetching, and product mapping.
 * Replaces 16 nearly-identical copy-pasted blocks in homeStore.js.
 */
import { ref } from "vue";

/* ─── Product Mapper Factory ─────────────────────────────────── */

/**
 * Create a product mapper for a specific category.
 *
 * @param {object} cfg
 * @param {number[]} cfg.discounts  - Discount percentages cycled by index
 * @param {string[]} cfg.gifts     - Promotion text lines
 * @param {string}   [cfg.urlPrefix] - URL prefix for product links (e.g. "/category/")
 * @returns {(product: object, index: number) => object}
 */
export const createProductMapper = ({
  discounts = [5, 5, 5, 5, 5, 5],
  gifts = [],
  urlPrefix = "/category/",
} = {}) => {
  return (product, index) => {
    const rawPrice = Number(product?.price) || 0;
    const discount = discounts[index % discounts.length];
    const originalPrice =
      rawPrice > 0 && discount > 0
        ? Math.round(rawPrice / (1 - discount / 100))
        : null;

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
      gifts,
      url: product.slug ? `${urlPrefix}${product.slug}` : "#",
    };
  };
};

/* ─── Collection State Factory ───────────────────────────────── */

/**
 * Create a full set of reactive state + fetch logic for one product category.
 *
 * @param {object}   cfg
 * @param {string}   cfg.slug           - API slug, e.g. "dien-thoai"
 * @param {string}   cfg.defaultTitle   - Fallback title, e.g. "ĐIỆN THOẠI"
 * @param {string}   cfg.viewAllUrl     - "View all" link
 * @param {string}   cfg.iconClass      - Default icon class for need_items
 * @param {Function} cfg.mapProduct     - Product mapper created via createProductMapper
 * @param {Function} cfg.getApiBaseUrl  - Getter for runtime API base URL
 * @param {object}   [cfg.needIconMap]  - Optional slug→icon override map for need_items
 * @returns {object}
 */
export const createCollection = ({
  slug,
  defaultTitle,
  viewAllUrl,
  iconClass = "bi bi-box",
  mapProduct,
  getApiBaseUrl,
  needIconMap = null,
}) => {
  const collection = ref({
    rootTitle: defaultTitle,
    needItems: [],
    brandItems: [],
    allProducts: [],
    viewAllUrl,
  });
  const products = ref([]);
  const loading = ref(false);
  const loaded = ref(false);
  const error = ref(null);
  let promise = null;

  /**
   * Map need_items from the API payload.
   */
  const mapNeedItems = (items) => {
    if (!Array.isArray(items)) return [];
    return items.map((item) => ({
      title: item.title,
      slug: item.slug,
      image: item.image || "",
      url: item.url || (item.slug ? `/category/${item.slug}` : "#"),
      iconClass: needIconMap?.[item.slug] || iconClass,
    }));
  };

  /**
   * Map brand_items from the API payload.
   */
  const mapBrandItems = (items) => {
    if (!Array.isArray(items)) return [];
    return items.map((item) => ({
      title: item.title,
      slug: item.slug,
      image: item.image || "",
      url: item.url || (item.slug ? `/category/${item.slug}` : "#"),
    }));
  };

  /**
   * Fetch and store collection data. Deduplicates concurrent calls and
   * caches the result unless `force` is set.
   */
  const fetchCollection = async ({ force = false } = {}) => {
    if (loading.value && promise) return promise;
    if (loaded.value && !force) return collection.value;

    loading.value = true;
    error.value = null;

    promise = (async () => {
      const res = await fetch(
        `${getApiBaseUrl()}/collections/${slug}`
      );
      if (!res.ok) throw new Error(`Fetch ${slug} collection failed`);

      const json = await res.json();
      const payload = json?.data || {};

      const mappedProducts = Array.isArray(payload.products)
        ? payload.products.map(mapProduct)
        : [];

      collection.value = {
        rootTitle: payload?.root?.title?.toUpperCase() || defaultTitle,
        needItems: mapNeedItems(payload.need_items),
        brandItems: mapBrandItems(payload.brand_items),
        allProducts: mappedProducts,
        viewAllUrl,
      };

      products.value = mappedProducts;
      loaded.value = true;
      return collection.value;
    })();

    try {
      return await promise;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : `Fetch ${slug} collection failed`;
      throw err;
    } finally {
      loading.value = false;
      promise = null;
    }
  };

  return {
    collection,
    products,
    loading,
    loaded,
    error,
    fetchCollection,
  };
};
