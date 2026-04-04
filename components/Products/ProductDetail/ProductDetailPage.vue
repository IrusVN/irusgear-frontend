<template>
  <section class="product-detail-page">
    <div class="container-xl px-2 px-lg-3 py-3 py-lg-4">
      <div class="row g-3 align-items-start">
        <div class="col-12 col-xl-7">
          <div class="content-stack">
            <ProductDetailHeader :product="product" />
            <ProductDetailGallery :product="product" />
            <ProductDetailCommitments :items="product.commitments" />
            <ProductDetailSpecs :specs="product.specs" />
            <ProductDetailFaq :faqs="product.faqs" />
          </div>
        </div>

        <div class="col-12 col-xl-5">
          <ProductDetailSidebar :product="product" />
        </div>
      </div>

      <div class="mt-3">
        <ProductDetailRelated :products="product.relatedProducts" />
      </div>

      <ProductDetailContent
        :article="product.articleSummary"
        :news="product.productNews"
        :video="product.reviewVideo"
      />

      <div class="content-stack mt-3">
        <ProductDetailReviews
          :summary="product.reviewSummary"
          :reviews="product.reviews"
        />
        <ProductDetailQA :questions="product.questions" />
      </div>
    </div>

    <ProductDetailStickyBar :product="product" />
  </section>
</template>

<script setup>
import ProductDetailCommitments from "@/components/Products/ProductDetail/ProductDetailCommitments.vue";
import ProductDetailContent from "@/components/Products/ProductDetail/ProductDetailContent.vue";
import ProductDetailFaq from "@/components/Products/ProductDetail/ProductDetailFaq.vue";
import ProductDetailGallery from "@/components/Products/ProductDetail/ProductDetailGallery.vue";
import ProductDetailHeader from "@/components/Products/ProductDetail/ProductDetailHeader.vue";
import ProductDetailQA from "@/components/Products/ProductDetail/ProductDetailQA.vue";
import ProductDetailRelated from "@/components/Products/ProductDetail/ProductDetailRelated.vue";
import ProductDetailReviews from "@/components/Products/ProductDetail/ProductDetailReviews.vue";
import ProductDetailSidebar from "@/components/Products/ProductDetail/ProductDetailSidebar.vue";
import ProductDetailSpecs from "@/components/Products/ProductDetail/ProductDetailSpecs.vue";
import ProductDetailStickyBar from "@/components/Products/ProductDetail/ProductDetailStickyBar.vue";

defineProps({
  product: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.product-detail-page {
  min-height: 100%;
  background: #f3f4f6;
}

.content-stack {
  display: grid;
  gap: 0.75rem;
}
</style>
