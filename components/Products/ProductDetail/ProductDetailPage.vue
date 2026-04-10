<template>
  <div class="product-detail-page container-shell mx-auto position-relative">
    <section class="pt-2 position-relative">
      <div class="d-flex flex-wrap align-items-start detail-top-layout m-0">
        <ProductDetailLeft />
        <ProductDetailRight />
      </div>
      <ProductSameProduct />
      <div class="d-flex justify-content-between content-layout position-relative">
        <ProductContentLeft />
        <ProductContentRight />
      </div>
      <ProductBoxReview />
      <ProductBlockComment />
    </section>
  </div>
</template>
<script setup>
import ProductDetailLeft from "@/components/Products/ProductDetail/ProductDetailLeft.vue";
import ProductDetailRight from "@/components/Products/ProductDetail/ProductDetailRight.vue";
import ProductSameProduct from "@/components/Products/ProductDetail/ProductSameProduct.vue";
import ProductContentLeft from "@/components/Products/ProductDetail/ProductContentLeft.vue";
import ProductContentRight from "@/components/Products/ProductDetail/ProductContentRight.vue";
import ProductBoxReview from "@/components/Products/ProductDetail/ProductBoxReview.vue";
import ProductBlockComment from "@/components/Products/ProductDetail/ProductBlockComment.vue";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useProductStore } from "@/stores/productStore";

const route = useRoute();
const productStore = useProductStore();

onMounted(async () => {
  if (route.params.slug) {
    const detail = await productStore.fetchProductDetail(route.params.slug);
    if (detail && detail.id) {
      productStore.fetchProductSuggest(detail.id);
    }
  }
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
  max-height: calc(100vh - 200px);
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
