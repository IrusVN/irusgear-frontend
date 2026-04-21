<template>
  <div class="product-detail-page container-shell mx-auto position-relative">
    <section ref="pageSectionEl" class="pt-2 position-relative">
      <div class="d-flex flex-wrap align-items-start detail-top-layout m-0">
        <ProductDetailLeft />
        <ProductDetailRight />
      </div>
      <ProductSameProduct />
      <div class="d-flex justify-content-between content-layout position-relative">
        <ProductContentLeft class="block-content-product-left" />
        <ProductContentRight class="block-content-product-right" />
      </div>
      <ProductBoxReview />
    </section>
    <ProductBlockOrder :visible="showFloatingOrder" />
  </div>
</template>
<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import ProductDetailLeft from "@/components/Products/ProductDetail/ProductDetailLeft.vue";
import ProductDetailRight from "@/components/Products/ProductDetail/ProductDetailRight.vue";
import ProductSameProduct from "@/components/Products/ProductDetail/ProductSameProduct.vue";
import ProductContentLeft from "@/components/Products/ProductDetail/ProductContentLeft.vue";
import ProductContentRight from "@/components/Products/ProductDetail/ProductContentRight.vue";
import ProductBoxReview from "@/components/Products/ProductDetail/ProductBoxReview.vue";
import ProductBlockOrder from "@/components/Products/ProductDetail/ProductBlockOrder.vue";
import { useRoute } from "vue-router";
import { useProductStore } from "@/stores/productStore";

const route = useRoute();
const productStore = useProductStore();
const pageSectionEl = ref(null);
const scrollY = ref(0);

const showFloatingOrder = computed(() => {
  if (!process.client || !productStore.productDetail || window.innerWidth <= 990) {
    return false;
  }

  const threshold = 420;
  const currentScroll = scrollY.value;

  if (currentScroll < threshold) {
    return false;
  }

  const pageRect = pageSectionEl.value?.getBoundingClientRect();

  if (!pageRect) {
    return true;
  }

  return pageRect.bottom > 220;
});

const handleScroll = () => {
  scrollY.value = window.scrollY || window.pageYOffset || 0;
};

watch(
  () => [route.params.slug, route.query.product_id],
  async ([slug, productId]) => {
    if (!slug) return;

    const normalizedProductId = productId ? String(productId) : null;
    const sameSlugLoaded = productStore.currentSlug === slug && productStore.productDetail;

    if (sameSlugLoaded) {
      const applied = productStore.selectColorVariant(normalizedProductId);
      if (applied) {
        return;
      }
    }

    const detail = await productStore.fetchProductDetail(slug, normalizedProductId ? { product_id: normalizedProductId } : {});
    if (detail && detail.id) {
      productStore.fetchProductSuggest(detail.id);
      productStore.fetchProductSameProducts(detail.id);
      productStore.fetchProductReviewSummary(detail.id);
      productStore.fetchProductReviewFilters(detail.id);
      productStore.fetchProductReviews(detail.id, { page: 1, per_page: 5, sort: "latest" });
    }
  },
  { immediate: true },
);

watch(
  () => route.params.slug,
  () => {
    if (process.client) {
      scrollY.value = window.scrollY || 0;
    }
  },
);

onMounted(() => {
  if (!process.client) return;

  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleScroll, { passive: true });
});

onBeforeUnmount(() => {
  if (!process.client) return;

  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleScroll);
});
</script>
<style>
.product-detail-page {
  box-sizing: border-box;
  height: 100%;
  width: 1200px;
}

.detail-top-layout {
  gap: 16px;
  margin-bottom: 10px !important;
  margin-top: 10px !important;
}

.detail-top-layout>[class*="box-detail-product__box-"] {
  overflow-x: hidden;
  padding: 0;
}

.detail-top-layout>.box-detail-product__box-left {
  height: max-content;
  position: sticky;
  top: 88px;
}

.detail-top-layout>.box-detail-product__box-center {
  height: max-content;
  position: sticky;
  top: 88px;
  width: 50%;
  z-index: 10;
}

.content-layout {
  gap: 24px;
  margin: 10px auto;
}

.content-layout>.block-content-product-left {
  flex: 2;
}

.content-layout>.block-content-product-right {
  flex: 1;
  height: fit-content;
  overflow-y: auto;
  position: sticky;
  top: 88px;
}

@media only screen and (min-width: 991px) and (max-width: 1199px) {
  .product-detail-page {
    max-width: 1200px !important;
    padding: 0 10px;
    width: 100% !important;
  }

  .detail-top-layout {
    gap: 20px;
  }

  .content-layout {
    max-width: 100%;
  }

  .content-layout>.block-content-product-left,
  .content-layout>.block-content-product-right {
    width: 50%;
  }
}

@media only screen and (min-width: 769px) and (max-width: 990px) {
  .product-detail-page {
    max-width: 1200px !important;
    padding: 0 10px;
    width: 100% !important;
  }

  .detail-top-layout {
    flex-wrap: wrap;
    gap: 20px;
  }

  .detail-top-layout>.box-detail-product__box-left,
  .detail-top-layout>.box-detail-product__box-center {
    width: 50%;
  }

  .content-layout {
    margin: auto;
    max-width: 991px;
  }

  .content-layout>.block-content-product-left {
    width: 66.6666666667%;
  }

  .content-layout>.block-content-product-right {
    width: 33.3333333333%;
  }
}

@media only screen and (max-width: 768px) {
  .product-detail-page {
    max-width: 1200px !important;
    padding: 0 10px;
    width: 100% !important;
  }

  .detail-top-layout {
    gap: 0;
  }

  .detail-top-layout>.box-detail-product__box-left,
  .detail-top-layout>.box-detail-product__box-center {
    position: relative;
    top: 10px !important;
    width: 100%;
  }

  .content-layout>.block-content-product-left {
    width: 100%;
  }

  .content-layout>.block-content-product-right {
    display: none;
  }
}
</style>
