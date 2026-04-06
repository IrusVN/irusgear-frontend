<template>
  <div class="cps-container">
    <section class="block-detail-product">
      <div class="box-detail-product columns m-0">
        <ProductDetailLeft />
        <ProductDetailRight />
      </div>
      <div class="block-content-product">
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
import ProductContentLeft from "@/components/Products/ProductDetail/ProductContentLeft.vue";
import ProductContentRight from "@/components/Products/ProductDetail/ProductContentRight.vue";
import ProductBoxReview from "@/components/Products/ProductDetail/ProductBoxReview.vue";
import ProductBlockComment from "@/components/Products/ProductDetail/ProductBlockComment.vue";
</script>
<style>
.cps-container {
  box-sizing: border-box;
  display: block;
  height: 100%;
  margin: 0 auto;
  position: relative;
  width: 1200px;
}

@media only screen and (max-width: 1199px) {
  .cps-container {
    max-width: 1200px !important;
    padding: 0 10px;
    width: 100% !important;
  }
}

.columns {
  margin-left: -0.75rem;
  margin-right: -0.75rem;
  margin-top: -0.75rem;
}

.columns:last-child {
  margin-bottom: -0.75rem;
}

.columns:not(:last-child) {
  margin-bottom: 0.75rem;
}

@media print, screen and (min-width: 769px) {
  .columns:not(.is-desktop) {
    display: flex;
  }
}

.column {
  display: block;
  flex-basis: 0;
  flex-grow: 1;
  flex-shrink: 1;
  padding: 0.75rem;
}

.is-flex {
  display: flex !important;
}

.is-flex-direction-column {
  flex-direction: column !important;
}

.is-flex-direction-row {
  flex-direction: row !important;
}

.is-align-items-center {
  align-items: center !important;
}

.is-align-content-center {
  align-content: center !important;
}

.is-justify-content-center {
  justify-content: center !important;
}

.is-justify-content-space-between {
  justify-content: space-between !important;
}

.m-0 {
  margin: 0 !important;
}

.mb-0 {
  margin-bottom: 0 !important;
}

.mb-1 {
  margin-bottom: 0.25rem !important;
}

.mt-2 {
  margin-top: 0.5rem !important;
}

.mr-2 {
  margin-right: 0.5rem !important;
}

.mb-2 {
  margin-bottom: 0.5rem !important;
}

.my-2 {
  margin-bottom: 0.5rem !important;
  margin-top: 0.5rem !important;
}

.mb-3 {
  margin-bottom: 0.75rem !important;
}

.my-3 {
  margin-bottom: 0.75rem !important;
  margin-top: 0.75rem !important;
}

.mt-5 {
  margin-top: 1.5rem !important;
}

.mx-auto {
  margin-left: auto !important;
  margin-right: auto !important;
}

.has-text-black {
  color: #0a0a0a !important;
}

.has-text-white {
  color: #fff !important;
}

.has-text-primary-light {
  color: #ebfffc !important;
}

.has-text-centered {
  text-align: center !important;
}

.has-text-weight-semibold {
  font-weight: 600 !important;
}

.is-hidden {
  display: none !important;
}

.block-detail-product {
  padding-top: 10px;
  position: relative;
}

.block-detail-product .mobile {
  display: none;
}

.block-detail-product .box-detail-product {
  gap: 16px;
  margin-bottom: 10px;
  margin-top: 10px;
}

.block-detail-product .box-detail-product [class*="box-detail-product__box-"] {
  overflow-x: hidden;
  padding: 0;
}

.block-detail-product .box-detail-product .box-detail-product__box-left {
  height: max-content;
  position: sticky;
  top: 88px;
}

.block-detail-product .box-detail-product .box-detail-product__box-center {
  height: max-content;
  position: sticky;
  top: 88px;
  width: 50%;
  z-index: 10;
}

.block-detail-product .block-content-product {
  display: flex;
  gap: 24px;
  justify-content: space-between;
  margin: 10px auto;
  position: relative;
}

.block-detail-product .block-content-product .block-content-product-left {
  flex: 2;
}

.block-detail-product .block-content-product .block-content-product-right {
  flex: 1;
  height: fit-content;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  position: sticky;
  top: 88px;
}

@media only screen and (min-width: 991px) and (max-width: 1199px) {
  .block-detail-product .box-detail-product {
    gap: 20px;
    padding-top: 0;
  }

  .block-detail-product .block-content-product {
    max-width: 100%;
  }

  .block-detail-product .block-content-product .block-content-product-left,
  .block-detail-product .block-content-product .block-content-product-right {
    width: 50%;
  }
}

@media only screen and (min-width: 769px) and (max-width: 990px) {
  .block-detail-product {
    padding-top: 0;
  }

  .block-detail-product .box-detail-product {
    flex-wrap: wrap;
    gap: 20px;
    padding-top: 0;
  }

  .block-detail-product .box-detail-product .box-detail-product__box-left,
  .block-detail-product .box-detail-product .box-detail-product__box-center {
    width: 50%;
  }

  .block-detail-product .block-content-product {
    margin: auto;
    max-width: 991px;
  }

  .block-detail-product .block-content-product .block-content-product-left {
    width: 66.6666666667%;
  }

  .block-detail-product .block-content-product .block-content-product-right {
    width: 33.3333333333%;
  }
}

@media only screen and (max-width: 768px) {
  .block-detail-product {
    padding-top: 0;
  }

  .block-detail-product .mobile {
    display: block;
  }

  .block-detail-product .box-detail-product {
    gap: 0;
  }

  .block-detail-product .box-detail-product .box-detail-product__box-left,
  .block-detail-product .box-detail-product .box-detail-product__box-center {
    position: relative;
    top: 10px !important;
    width: 100%;
  }

  .block-detail-product .block-content-product .block-content-product-left {
    width: 100%;
  }

  .block-detail-product .block-content-product .block-content-product-right {
    display: none;
  }
}
</style>
