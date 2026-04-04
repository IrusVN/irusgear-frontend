<template>
  <ProductDetailPage :product="product" />
</template>

<script setup>
import { computed } from "vue";
import { useHead, useRoute } from "#imports";
import { useBreadcrumb } from "@/composables/useBreadcrumb";
import ProductDetailPage from "@/components/Products/ProductDetail/ProductDetailPage.vue";
import { getProductDetailBySlug } from "@/components/Products/ProductDetail/productDetail.mock";

definePageMeta({ layout: "default" });

const route = useRoute();
const slug = computed(() => String(route.params.slug || ""));
const product = computed(() => getProductDetailBySlug(slug.value));

const breadcrumbItems = computed(() => [
  { label: "Sản phẩm", to: "/products" },
  { label: product.value?.shortName || product.value?.name || "Chi tiết sản phẩm", to: null },
]);

useBreadcrumb(breadcrumbItems, {
  compactUi: false,
});

useHead({
  title: computed(() => product.value.name),
  meta: [
    {
      name: "description",
      content: computed(
        () =>
          `${product.value.name} với giao diện chi tiết sản phẩm, thông số kỹ thuật, ưu đãi, đánh giá và hỏi đáp.`
      ),
    },
  ],
});
</script>
