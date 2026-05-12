<template>
  <div class="content-left-shell">
    <div class="content-card position-relative overflow-hidden" :style="{ maxHeight: isExpanded ? 'none' : '567px' }">
      <div v-if="cleanedDescription" class="content-description" v-html="cleanedDescription"></div>
      <div v-else class="text-center py-4">{{ $t('product.descriptionUpdating') }}</div>

      <div v-if="!isExpanded && cleanedDescription" class="irus-btn-showmore-wrapper">
        <a class="btn-show-more button__content-show-more" @click.prevent="isExpanded = true">
          {{ $t('common.seeMore') }} &emsp;
          <ArrowIcon direction="down" :size="10" />
        </a>
      </div>
      <div v-else-if="isExpanded" class="text-center mt-3 mb-2">
        <a class="btn-show-more button__content-show-more" @click.prevent="isExpanded = false"
          style="background:#fff; color:#3b82f6; border-radius:10px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; padding: 6px 12px; font-size:14px; box-shadow: 0 0 10px rgba(0,0,0,0.1); text-decoration:none;">
          {{ $t('common.collapseExpand') }} &emsp;
          <ArrowIcon direction="up" :size="10" />
        </a>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useProductStore } from '~/stores/productStore'
import ArrowIcon from '@/components/Icons/ArrowIcon.vue'

const productStore = useProductStore()
const product = computed(() => productStore.productDetail)
const isExpanded = ref(false)

const cleanedDescription = computed(() => {
  if (!product.value?.description) return ''
  let html = product.value.description
  // Prevent duplicate ID for cpsContent and avoid display:none conflicts from cellphoneS payload
  html = html.replace(/id="cpsContent"/g, 'class="injected-cpsContent"')
  return html
})
</script>
<style scoped>
.content-left-shell {
  flex: 2;
}

.content-card {
  background: #f7f7f8;
  border-radius: 16px;
  display: block;
  margin-bottom: 10px;
  margin-right: auto;
  min-height: 0;
  overflow: hidden;
  padding: 16px;
  position: relative;
}

:deep(.content-card) h1 {
  font-size: 25px;
}

:deep(.content-card) p {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  margin: 0 0 10px;
}

:deep(.content-card) h2 {
  font-size: 21px;
}

:deep(.content-card) h3 {
  font-size: 16px;
  font-weight: 700;
  padding: 8px 0;
}

:deep(.content-card) span {
  color: #000;
  font-family: arial, helvetica, sans-serif;
}

:deep(.content-card) .large-span {
  font-size: large;
}

.content-title {
  color: #18181b;
  font-size: 20px;
}

:deep(.content-highlight) {
  background-color: #fff;
  font-size: 14px;
  margin: 8px auto 16px;
  width: 100%;
}

:deep(.content-highlight:empty) {
  display: none;
}

:deep(.content-highlight) ul {
  -ms-overflow-style: none;
  overflow-y: auto;
  scrollbar-width: none;
}

:deep(.content-highlight) ul::-webkit-scrollbar {
  display: none;
  scrollbar-width: 5px;
}

:deep(.content-highlight) ul li {
  display: flex;
  font-size: 14px;
  line-height: 1.45;
  text-align: left;
}

:deep(.content-highlight) ul li:before {
  align-items: center;
  color: #000;
  content: "\2022";
  display: flex;
  font-size: 20px;
  height: 22px;
  margin-right: 5px;
  width: auto;
}

:deep(.content-highlight) ul li:not(:last-child) {
  margin-bottom: 5px;
}

:deep(.content-card) .btn-default {
  background-color: #fff;
  background-image: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #333;
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.42857143;
  margin-bottom: 0;
  padding: 6px 12px;
  text-align: center;
  touch-action: manipulation;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
}

:deep(.content-card) a {
  color: var(--irus-color-accent);
  -webkit-text-decoration: none;
  text-decoration: none;
}

:deep(.content-card) table {
  border-collapse: collapse;
  display: block;
  overflow-x: auto;
  width: 100% !important;
}

:deep(.content-card) .table {
  background-color: #fff;
  color: #363636;
}

:deep(.content-card) .table td,
:deep(.content-card) .table th {
  border: solid #dbdbdb;
  border-width: 0 0 1px;
  padding: 0.5em 0.75em;
  vertical-align: top;
}

:deep(.content-card) table p {
  margin-top: 10px;
  text-align: center;
}

:deep(.content-card) table tbody {
  display: table;
  width: 100%;
}

:deep(.content-card) table td {
  border-bottom: 1px solid #d9d9dd;
  border-left: 1px solid #d3d3d3;
  border-right: 1px solid #d3d3d3;
  border-top: 1px solid #d9d9dd;
  padding-left: 5px;
  vertical-align: inherit;
}

:deep(.content-card) img {
  border-radius: 8px;
  max-width: 100%;
  height: auto;
}

:deep(.content-card) table .success {
  background-color: #dff0d8;
  color: #3d6611;
  font-size: 12px;
}

:deep(.content-card) table.seo-table {
  border: 1px;
  width: 100% !important;
}

:deep(.content-card) table.seo-table thead,
:deep(.content-card) table.seo-table tbody {
  width: 100% !important;
}

:deep(.content-card) table.seo-table thead {
  display: table;
}

:deep(.content-card) table.seo-table tbody tr:first-child td {
  border-top: none !important;
}

:deep(.content-card) table.seo-table a {
  color: #485fc7;
}

:deep(.content-card) table.seo-table p {
  margin: 10px 0;
}

:deep(.content-card) blockquote {
  color: #646464;
  padding-left: 20px;
  position: relative;
}

:deep(.content-card) blockquote p,
:deep(.content-card) blockquote span {
  color: inherit;
}

:deep(.content-card) blockquote:after {
  background: #e5e7eb;
  content: "";
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 5px;
}

:deep(.content-card) #cpsContentSEO {
  background-color: #fff;
  border-radius: 8px;
  padding: 8px;
}

:deep(.content-card) #cpsContentSEO ul {
  list-style: inherit;
  padding-left: 40px;
}

:deep(.content-card) #cpsContentSEO ul li {
  display: list-item;
}

:deep(.injected-cpsContent) {
  max-height: none !important;
  display: block !important;
}

:deep(.cps-block-content_btn-showmore) {
  display: none !important;
}

.irus-btn-showmore-wrapper {
  background: linear-gradient(180deg,
      hsla(0, 0%, 100%, 0),
      hsla(0, 0%, 100%, 0.91) 50%,
      #fff 55%);
  border-radius: 10px;
  bottom: 0;
  display: block;
  left: 0;
  margin-bottom: 0;
  padding-top: 50px;
  position: absolute;
  right: 0;
  text-align: center;
  width: 100%;
}

.irus-btn-showmore-wrapper .btn-show-more {
  align-items: center;
  background: #fff;
  border-radius: 0 0 10px 10px;
  color: #3b82f6;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  height: 34px;
  justify-content: center;
  margin-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
  max-width: 335px;
  -webkit-text-decoration: none;
  text-decoration: none;
  width: 100%;
}

.irus-btn-showmore-wrapper .btn-show-more:hover {
  opacity: 0.8;
}

.irus-btn-showmore-wrapper .btn-show-more :deep(svg) {
  fill: #3b82f6;
  height: 10px;
}

.toc-title {
  background: #e4e4e7;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.toc-title p {
  font-size: 14px;
  margin-bottom: 0;
}

.toc-title svg {
  stroke: #1d1d20;
  height: 20px;
  transform: rotate(0deg);
  transition: all 0.3s ease;
  width: 20px;
}

.toc-title svg.rotate {
  transform: rotate(180deg);
}

.toc-title:hover {
  opacity: 0.8;
}

.toc-wrapper {
  overflow: hidden;
  transition: all 0.3s ease;
}

.toc-list {
  background: #e4e4e7;
}

.table-content__item,
.toc-list .table-content__item {
  color: #4a4a4a;
  cursor: pointer;
  display: block;
  font-size: 14px;
  font-weight: 400;
}

.table-content__item.level-2,
.toc-list .table-content__item.level-2 {
  margin-top: 5px;
}

.table-content__item.level-3,
.toc-list .table-content__item.level-3 {
  padding-left: 20px;
}

.table-content__item:hover,
.toc-list .table-content__item:hover {
  -webkit-text-decoration: underline;
  text-decoration: underline;
}

@media only screen and (min-width: 991px) and (max-width: 1199px) {
  .content-left-shell {
    width: 50%;
  }
}

@media only screen and (min-width: 769px) and (max-width: 990px) {
  .content-left-shell {
    width: 66.6666666667%;
  }
}

@media screen and (max-width: 768px) {

  .toc-title,
  .toc-title p,
  .table-content__item,
  .toc-list .table-content__item {
    font-size: 12px;
  }
}

@media only screen and (max-width: 899px) {
  :deep(.content-card) div h2 {
    font-size: 16px;
  }

  :deep(.content-card) div h3 {
    font-size: 14px;
  }

  :deep(.content-card) div p {
    font-size: 12px;
  }

  :deep(.content-card) img {
    width: 100%;
  }

  .content-title {
    font-size: 16px;
  }
}
</style>
