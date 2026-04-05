<template>
    <section class="block-detail-product">
        <div class="box-detail-product columns m-0">
            <div class="box-detail-product__box-left column">
                <ProductDetailLeft />
            </div>
            <div class="box-detail-product__box-center column">
                <ProductDetailRight />
            </div>
        </div>
        <div>
            <ProductSuggest />
        </div>
        <div class="block-content-product">
            <ProductContentLeft />
            <ProductContentRight />
        </div>
        <div class="boxReview">
            <ProductBoxReview />
        </div>
        <div id="block-comment-cps" class="comment-container">
            <ProductBlockComment />
        </div>
    </section>
</template>
<script setup>
import ProductDetailLeft from '@/components/Products/ProductDetail/ProductDetailLeft.vue';
import ProductDetailRight from '@/components/Products/ProductDetail/ProductDetailRight.vue';
import ProductSuggest from '@/components/Products/ProductDetail/ProductSuggest.vue';
import ProductContentLeft from '@/components/Products/ProductDetail/ProductContentLeft.vue';
import ProductContentRight from '@/components/Products/ProductDetail/ProductContentRight.vue';
import ProductBoxReview from '@/components/Products/ProductDetail/ProductBoxReview.vue';
import ProductBlockComment from '@/components/Products/ProductDetail/ProductBlockComment.vue';
</script>
<style scoped>
.block-detail-product {
    padding-top: 10px;
    position: relative;
}

.block-detail-product .box-detail-product {
    gap: 16px;
    margin-bottom: 10px;
    margin-top: 10px;
}

.block-detail-product .box-detail-product [class*=box-detail-product__box-] {
    overflow-x: hidden;
    padding: 0;
}

.block-detail-product .box-detail-product .box-detail-product__box-left {
    height: -moz-max-content;
    height: max-content;
    position: sticky;
    top: 88px;
}

.column {
    display: block;
    flex-basis: 0;
    flex-grow: 1;
    flex-shrink: 1;
    padding: .75rem;
}

.block-detail-product .box-detail-product .box-detail-product__box-center {
    height: -moz-max-content;
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

.boxReview {
    background-color: #f7f7f8;
    border-radius: 16px;
    overflow: hidden;
    padding: 16px;
    width: 100%;
}

.comment-container {
    max-width: 100%;
    overflow: hidden;
}

@media only screen and (min-width: 991px) and (max-width: 1199px) {
    .block-detail-product .box-detail-product {
        gap: 20px;
        padding-top: 0;
    }

    .block-detail-product .block-content-product {
        max-width: 100%;
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

    .block-detail-product .box-detail-product .box-detail-product__box-left {
        width: 50%;
    }

    .block-detail-product .box-detail-product .box-detail-product__box-center {
        width: 50%;
    }

    .block-detail-product .block-content-product {
        margin: auto;
        max-width: 991px;
    }
}
</style>