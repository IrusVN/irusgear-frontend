import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { storeToRefs } from "pinia";
import { useFeGlobalStore } from "@/stores/feGlobalStore";

export const useProductStore = defineStore("product", () => {
  const feGlobalStore = useFeGlobalStore();
  const { items, error } = storeToRefs(feGlobalStore);

  const productDetail = ref(null);
  const currentSlug = ref("");

  const productError = computed(() => error.value);

  const fetchProductDetail = async (slug, params = {}) => { debugger
    try {
      if (!slug) {
        return navigateTo("/products");
      }

      currentSlug.value = slug;
      feGlobalStore.setApiUrl(`products/${slug}`);

      const res = await feGlobalStore.fetchItems();

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
  };

  return {
    productDetail,
    currentSlug,
    productError,
    fetchProductDetail,
    resetProductDetail,
  };
});
