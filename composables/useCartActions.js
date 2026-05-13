import { computed } from "vue";
import { navigateTo, useLocalePath } from "#imports";
import { toast } from "vue-sonner";
import { useCartStore } from "@/stores/cartStore";
import { useProductStore } from "@/stores/productStore";

export const useCartActions = () => {
  const cartStore = useCartStore();
  const productStore = useProductStore();
  const localePath = useLocalePath();

  const cartBusy = computed(() => cartStore.isMutating);

  const buildCurrentProductPayload = (quantity = 1) => {
    const detail = productStore.productDetail;

    if (!detail) {
      return null;
    }

    const selectedProductId = Number(
      detail.selectedProductId ||
        detail.activeColor?.productId ||
        detail.activeColor?.id ||
        detail.defaultColorProductId ||
        detail.id ||
        0,
    );

    if (!selectedProductId) {
      return null;
    }

    const selectedOptions = {};
    const activeStorage = detail.storageOptions?.find((item) => item.active)?.label;
    const activeColor = detail.activeColor?.name || detail.colorOptions?.find((item) => item.active)?.name;

    if (activeStorage) {
      selectedOptions.storage = activeStorage;
    }

    if (activeColor) {
      selectedOptions.color = activeColor;
    }

    return {
      product_id: selectedProductId,
      product_variant_id: null,
      quantity,
      selected_options: selectedOptions,
    };
  };

  const addCurrentProductToCart = async ({ quantity = 1, openSheet = true } = {}) => {
    const detail = productStore.productDetail;

    if (!detail) {
      toast.warning("Không tìm thấy sản phẩm để thêm vào giỏ.");
      return null;
    }

    if (!detail.purchase?.addToCartEnabled) {
      toast.warning("Sản phẩm hiện chưa thể thêm vào giỏ hàng.");
      return null;
    }

    const payload = buildCurrentProductPayload(quantity);

    if (!payload) {
      toast.warning("Không thể xác định phiên bản sản phẩm đang chọn.");
      return null;
    }

    try {
      const response = await cartStore.addItem(payload, { showSheet: openSheet });
      toast.success(response?.message || "Đã thêm vào giỏ hàng.");
      return response;
    } catch (error) {
      toast.error(error?.data?.message || "Không thể thêm vào giỏ hàng.");
      throw error;
    }
  };

  const buyCurrentProductNow = async () => {
    const response = await addCurrentProductToCart({ openSheet: false });

    if (!response) {
      return null;
    }

    return navigateTo(localePath("/cart"));
  };

  const addProductToCart = async (
    product,
    {
      quantity = 1,
      productVariantId = null,
      selectedOptions = {},
      openSheet = true,
      successMessage = "Đã thêm vào giỏ hàng.",
    } = {},
  ) => {
    if (!product?.id) {
      toast.warning("Sản phẩm chưa sẵn sàng để thêm vào giỏ.");
      return null;
    }

    try {
      const response = await cartStore.addItem(
        {
          product_id: Number(product.id),
          product_variant_id: productVariantId,
          quantity,
          selected_options: selectedOptions,
        },
        { showSheet: openSheet },
      );
      toast.success(response?.message || successMessage);
      return response;
    } catch (error) {
      toast.error(error?.data?.message || "Không thể thêm vào giỏ hàng.");
      throw error;
    }
  };

  return {
    cartBusy,
    addCurrentProductToCart,
    buyCurrentProductNow,
    addProductToCart,
  };
};
