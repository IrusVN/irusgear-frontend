import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { storeToRefs } from "pinia";
import { useFeGlobalStore } from "@/stores/feGlobalStore";

export const useProductStore = defineStore("product", () => {
  const feGlobalStore = useFeGlobalStore();
  const { items, error } = storeToRefs(feGlobalStore);

  const productDetail = ref(null);
  const productSuggestions = ref([]);
  const currentSlug = ref("");

  const productError = computed(() => error.value);

  const fetchProductDetail = async (slug, params = {}) => {
    try {
      if (!slug) {
        return navigateTo("/products");
      }

      currentSlug.value = slug;
      feGlobalStore.setApiUrl(`products/${slug}`);

      const res = await feGlobalStore.fetchItem(params);

      if (res?.status === true && res.data) {
        productDetail.value = res.data;
      } else {
        productDetail.value = null;
        return navigateTo("/products");
      }
    } catch (e) {
      productDetail.value = null;
      return navigateTo("/products");
    }

    return productDetail.value;
  };

  const resetProductDetail = () => {
    productDetail.value = null;
    currentSlug.value = "";
    productSuggestions.value = [];
  };

  const fetchProductSuggest = async (id, params = {}) => {
    try {
      if (!id) return [];

      feGlobalStore.setApiUrl(`products/${id}/suggestions`);
      const res = await feGlobalStore.fetchItem(params);

      if (res?.status === true && res.data) {
        productSuggestions.value = res.data;
      } else {
        productSuggestions.value = [];
      }
    } catch (e) {
      productSuggestions.value = [];
    }

    return productSuggestions.value;
  };

  const selectColorVariant = (url) => {
    if (!productDetail.value || !productDetail.value.colorOptions) return;

    const targetColor = productDetail.value.colorOptions.find(c => c.url === url);
    if (!targetColor) return;

    const newDetail = JSON.parse(JSON.stringify(productDetail.value));

    newDetail.colorOptions.forEach(c => {
      c.active = c.url === url;
    });

    if (targetColor.price && newDetail.pricing) {
      newDetail.pricing.salePrice = targetColor.price;
    }

    productDetail.value = newDetail;

    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('color-variant-selected', { detail: { thumbnail: targetColor.thumbnail } }));
      }, 50);
    }
  };

  return {
    productDetail,
    productSuggestions,
    currentSlug,
    productError,
    fetchProductDetail,
    fetchProductSuggest,
    resetProductDetail,
    selectColorVariant,
  };
});
