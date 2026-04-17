import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { storeToRefs } from "pinia";
import { useFeGlobalStore } from "@/stores/feGlobalStore";

export const useProductStore = defineStore("product", () => {
  const feGlobalStore = useFeGlobalStore();
  const { items, error } = storeToRefs(feGlobalStore);

  const productDetail = ref(null);
  const productSuggestions = ref([]);
  const productSameProducts = ref({ tabs: [] });
  const productReviewSummary = ref(null);
  const productReviewFilters = ref({ experienceKeys: [], attributeOptions: [], sortOptions: [] });
  const productReviewList = ref({ items: [], pagination: null, filters: { rating: null, sort: "latest" } });
  const productQuestions = ref({ items: [], pagination: null });
  const currentSlug = ref("");
  const currentParams = ref({});
  const detailRequestToken = ref(0);
  const suggestRequestToken = ref(0);
  const sameProductsRequestToken = ref(0);
  const reviewSummaryRequestToken = ref(0);
  const reviewListRequestToken = ref(0);
  const questionListRequestToken = ref(0);

  const productError = computed(() => error.value);

  const normalizeGalleryItem = (item, fallbackName = "") => {
    if (!item || typeof item !== "object") return null;

    const image = item.image || item.thumbnail || "";
    const thumbnail = item.thumbnail || item.image || image;

    if (!image && !thumbnail) return null;

    return {
      id: item.id || image || thumbnail,
      type: item.type || "image",
      image,
      thumbnail,
      alt: item.alt || fallbackName,
      title: item.title || fallbackName,
    };
  };

  const buildMergedGallery = (sharedGallery = [], activeColor = null, fallbackName = "") => {
    const activeColorGallery = activeColor
      ? (activeColor.gallery?.length
          ? activeColor.gallery
          : [normalizeGalleryItem({
              id: activeColor.id || activeColor.productId || activeColor.thumbnail,
              image: activeColor.thumbnail,
              thumbnail: activeColor.thumbnail,
              alt: activeColor.name || fallbackName,
              title: activeColor.name || fallbackName,
            }, activeColor.name || fallbackName)]
        ).filter(Boolean)
      : [];

    const mergedGallery = [];
    const seenImages = new Set();

    [...activeColorGallery, ...sharedGallery].forEach((item) => {
      if (!item?.image || seenImages.has(item.image)) return;
      seenImages.add(item.image);
      mergedGallery.push(item);
    });

    return mergedGallery;
  };

  const normalizeProductDetail = (detail) => {
    if (!detail || typeof detail !== "object") return detail;

    const normalized = {
      ...detail,
      pricing: { ...(detail.pricing || {}) },
      ratingSummary: { ...(detail.ratingSummary || {}) },
      storageOptions: Array.isArray(detail.storageOptions) ? [...detail.storageOptions] : [],
      colorOptions: Array.isArray(detail.colorOptions) ? [...detail.colorOptions] : [],
      gallery: Array.isArray(detail.gallery) ? [...detail.gallery] : [],
    };

    normalized.colorOptions = normalized.colorOptions.map((color) => {
      const gallery = Array.isArray(color?.gallery)
        ? color.gallery
            .map((item) => normalizeGalleryItem(item, color?.name || detail?.name || ""))
            .filter(Boolean)
        : [];

      const thumbnail = color?.thumbnail || gallery[0]?.thumbnail || gallery[0]?.image || "";

      return {
        ...color,
        url: color?.url || `/products/${detail.slug}`,
        gallery,
        thumbnail,
      };
    });

    const sharedGallery = normalized.gallery
      .map((item) => normalizeGalleryItem(item, detail?.name || ""))
      .filter(Boolean);

    const activeColor =
      normalized.colorOptions.find((color) => color?.active) || normalized.colorOptions[0] || null;
    normalized.sharedGallery = sharedGallery;
    normalized.defaultColorProductId = activeColor?.productId || activeColor?.id || null;
    normalized.gallery = buildMergedGallery(sharedGallery, activeColor, detail?.name || "");
    normalized.activeColor = activeColor;

    return normalized;
  };

  const fetchProductDetail = async (slug, params = {}) => {
    let requestToken = detailRequestToken.value;

    try {
      if (!slug) {
        return navigateTo("/products");
      }

      const nextParams = { ...params };
      const isNewSlug = currentSlug.value !== slug;
      requestToken = detailRequestToken.value + 1;

      detailRequestToken.value = requestToken;

      if (isNewSlug) {
        productDetail.value = null;
        productSuggestions.value = [];
        productSameProducts.value = { tabs: [] };
        productReviewSummary.value = null;
        productReviewFilters.value = { experienceKeys: [], attributeOptions: [], sortOptions: [] };
        productReviewList.value = { items: [], pagination: null, filters: { rating: null, sort: "latest" } };
        productQuestions.value = { items: [], pagination: null };
      }

      currentSlug.value = slug;
      currentParams.value = nextParams;
      feGlobalStore.setApiUrl(`products/${slug}`);

      const res = await feGlobalStore.fetchItem(nextParams);

      if (detailRequestToken.value !== requestToken || currentSlug.value !== slug) {
        return productDetail.value;
      }

      if (res?.status === true && res.data) {
        productDetail.value = normalizeProductDetail(res.data);
      } else {
        productDetail.value = null;
        return navigateTo("/products");
      }
    } catch (e) {
      if (detailRequestToken.value !== requestToken) {
        return productDetail.value;
      }

      productDetail.value = null;
      return navigateTo("/products");
    }

    return productDetail.value;
  };

  const resetProductDetail = () => {
    detailRequestToken.value += 1;
    suggestRequestToken.value += 1;
    sameProductsRequestToken.value += 1;
    reviewSummaryRequestToken.value += 1;
    reviewListRequestToken.value += 1;
    questionListRequestToken.value += 1;
    productDetail.value = null;
    currentSlug.value = "";
    currentParams.value = {};
    productSuggestions.value = [];
    productSameProducts.value = { tabs: [] };
    productReviewSummary.value = null;
    productReviewFilters.value = { experienceKeys: [], attributeOptions: [], sortOptions: [] };
    productReviewList.value = { items: [], pagination: null, filters: { rating: null, sort: "latest" } };
    productQuestions.value = { items: [], pagination: null };
  };

  const fetchProductSuggest = async (id, params = {}) => {
    try {
      if (!id) return [];

      const requestToken = suggestRequestToken.value + 1;
      suggestRequestToken.value = requestToken;
      feGlobalStore.setApiUrl(`products/${id}/suggestions`);
      const res = await feGlobalStore.fetchItem(params);

      if (suggestRequestToken.value !== requestToken) {
        return productSuggestions.value;
      }

      if (res?.comboDeals || res?.accessoryDeals) {
        productSuggestions.value = res;
      } else if (res?.status === true && res.data) {
        productSuggestions.value = res.data;
      } else {
        productSuggestions.value = [];
      }
    } catch (e) {
      productSuggestions.value = [];
    }

    return productSuggestions.value;
  };

  const fetchProductSameProducts = async (id, params = {}) => {
    try {
      if (!id) {
        productSameProducts.value = { tabs: [] };
        return productSameProducts.value;
      }

      const requestToken = sameProductsRequestToken.value + 1;
      sameProductsRequestToken.value = requestToken;
      feGlobalStore.setApiUrl(`products/${id}/same-products`);
      const res = await feGlobalStore.fetchItem(params);

      if (sameProductsRequestToken.value !== requestToken) {
        return productSameProducts.value;
      }

      if (Array.isArray(res?.tabs)) {
        productSameProducts.value = { tabs: res.tabs };
      } else if (res?.status === true && Array.isArray(res?.data?.tabs)) {
        productSameProducts.value = { tabs: res.data.tabs };
      } else {
        productSameProducts.value = { tabs: [] };
      }
    } catch (e) {
      productSameProducts.value = { tabs: [] };
    }

    return productSameProducts.value;
  };

  const selectColorVariant = (productId) => {
    if (!productDetail.value || !Array.isArray(productDetail.value.colorOptions)) {
      return null;
    }

    const fallbackId = productDetail.value.defaultColorProductId;
    const resolvedProductId = productId || fallbackId;
    const targetColor = productDetail.value.colorOptions.find(
      (color) => String(color.productId || color.id) === String(resolvedProductId),
    );

    if (!targetColor) {
      return null;
    }

    productDetail.value.colorOptions = productDetail.value.colorOptions.map((color) => ({
      ...color,
      active: String(color.productId || color.id) === String(targetColor.productId || targetColor.id),
    }));

    productDetail.value.activeColor = {
      ...targetColor,
      active: true,
    };
    productDetail.value.gallery = buildMergedGallery(
      productDetail.value.sharedGallery || [],
      productDetail.value.activeColor,
      productDetail.value.name || "",
    );

    if (targetColor.price && productDetail.value.pricing) {
      productDetail.value.pricing = {
        ...productDetail.value.pricing,
        salePrice: { ...targetColor.price },
      };
    }

    currentParams.value = resolvedProductId
      ? { ...currentParams.value, product_id: resolvedProductId }
      : Object.fromEntries(
          Object.entries(currentParams.value).filter(([key]) => key !== "product_id"),
        );

    if (productDetail.value.activeColor?.thumbnail && typeof window !== "undefined") {
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("color-variant-selected", {
            detail: { thumbnail: productDetail.value.activeColor.thumbnail },
          }),
        );
      }, 50);
    }

    return productDetail.value;
  };

  const fetchProductReviewSummary = async (id) => {
    try {
      if (!id) {
        productReviewSummary.value = null;
        return null;
      }

      const requestToken = reviewSummaryRequestToken.value + 1;
      reviewSummaryRequestToken.value = requestToken;
      feGlobalStore.setApiUrl(`products/${id}/reviews/summary`);
      const res = await feGlobalStore.fetchItem();

      if (reviewSummaryRequestToken.value !== requestToken) {
        return productReviewSummary.value;
      }

      productReviewSummary.value = res?.summary ? res : res?.data || null;
    } catch (e) {
      productReviewSummary.value = null;
    }

    return productReviewSummary.value;
  };

  const fetchProductReviewFilters = async (id) => {
    try {
      if (!id) {
        productReviewFilters.value = { experienceKeys: [], attributeOptions: [], sortOptions: [] };
        return productReviewFilters.value;
      }

      feGlobalStore.setApiUrl(`products/${id}/review-filters`);
      const res = await feGlobalStore.fetchItem();
      productReviewFilters.value = res?.experienceKeys ? res : res?.data || { experienceKeys: [], attributeOptions: [], sortOptions: [] };
    } catch (e) {
      productReviewFilters.value = { experienceKeys: [], attributeOptions: [], sortOptions: [] };
    }

    return productReviewFilters.value;
  };

  const fetchProductReviews = async (id, params = {}, options = {}) => {
    try {
      if (!id) {
        productReviewList.value = { items: [], pagination: null, filters: { rating: null, sort: "latest" } };
        return productReviewList.value;
      }

      const requestToken = reviewListRequestToken.value + 1;
      reviewListRequestToken.value = requestToken;
      feGlobalStore.setApiUrl(`products/${id}/reviews`);
      const res = await feGlobalStore.fetchItem(params);

      if (reviewListRequestToken.value !== requestToken) {
        return productReviewList.value;
      }

      const payload = res?.items ? res : res?.data || { items: [], pagination: null, filters: { rating: null, sort: "latest" } };

      productReviewList.value = {
        items: options.append ? [...(productReviewList.value.items || []), ...(payload.items || [])] : (payload.items || []),
        pagination: payload.pagination || null,
        filters: payload.filters || { rating: null, sort: "latest" },
      };
    } catch (e) {
      productReviewList.value = { items: [], pagination: null, filters: { rating: null, sort: "latest" } };
    }

    return productReviewList.value;
  };

  const submitProductReview = async (id, payload) => {
    if (!id) return null;

    feGlobalStore.setApiUrl(`products/${id}/reviews`);
    return feGlobalStore.createItem(payload);
  };

  const fetchProductQuestions = async (id, params = {}, options = {}) => {
    try {
      if (!id) {
        productQuestions.value = { items: [], pagination: null };
        return productQuestions.value;
      }

      const requestToken = questionListRequestToken.value + 1;
      questionListRequestToken.value = requestToken;
      feGlobalStore.setApiUrl(`products/${id}/questions`);
      const res = await feGlobalStore.fetchItem(params);

      if (questionListRequestToken.value !== requestToken) {
        return productQuestions.value;
      }

      const payload = res?.items ? res : res?.data || { items: [], pagination: null };
      productQuestions.value = {
        items: options.append ? [...(productQuestions.value.items || []), ...(payload.items || [])] : (payload.items || []),
        pagination: payload.pagination || null,
      };
    } catch (e) {
      productQuestions.value = { items: [], pagination: null };
    }

    return productQuestions.value;
  };

  const submitProductQuestion = async (id, payload) => {
    if (!id) return null;

    feGlobalStore.setApiUrl(`products/${id}/questions`);
    return feGlobalStore.createItem(payload);
  };

  const submitProductQuestionReply = async (productId, questionId, payload) => {
    if (!productId || !questionId) return null;

    feGlobalStore.setApiUrl(`products/${productId}/questions/${questionId}/replies`);
    return feGlobalStore.createItem(payload);
  };

  return {
    productDetail,
    productSuggestions,
    productSameProducts,
    productReviewSummary,
    productReviewFilters,
    productReviewList,
    productQuestions,
    currentSlug,
    currentParams,
    productError,
    fetchProductDetail,
    fetchProductSuggest,
    fetchProductSameProducts,
    fetchProductReviewSummary,
    fetchProductReviewFilters,
    fetchProductReviews,
    submitProductReview,
    fetchProductQuestions,
    submitProductQuestion,
    submitProductQuestionReply,
    resetProductDetail,
    selectColorVariant,
  };
});
