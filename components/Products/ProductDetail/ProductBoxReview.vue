<template>
  <div>
  <section id="review" class="boxReview" v-if="productDetail">
    <div class="boxReview-head is-flex is-justify-content-space-between is-align-items-center">
      <h2 class="title">Đánh giá {{ productDetail.name }}</h2>
    </div>

    <div class="boxReview-review">
      <div class="boxReview-overview">
        <div class="boxReview-score has-product">
          <div class="rating">
            <span class="average-rating">{{ averageRatingDisplay }}</span>
            <span class="rating-total">/5</span>
          </div>
          <div class="summary-stars">
            <span v-for="star in 5" :key="`summary-${star}`" class="mini-star active">★</span>
          </div>
          <p class="boxReview-score__count">{{ totalReviews }} lượt đánh giá</p>
        </div>
        <button type="button" class="button button__review" @click="openReviewModal">
          Viết đánh giá
        </button>
      </div>

      <div class="boxReview-star has-product">
        <div
          v-for="star in ratingRows"
          :key="star.value"
          class="rating-level is-flex is-align-items-center"
        >
          <div class="star-count is-flex is-align-items-center">
            <span>{{ star.value }}</span>
            <span class="mini-star active small">★</span>
          </div>
          <progress
            :max="Math.max(totalReviews, 1)"
            class="progress is-small m-0"
            :value="star.count"
          />
          <span class="rating-count-text">{{ star.count }} đánh giá</span>
        </div>
      </div>

      <div class="box-experience-review">
        <div class="title">Đánh giá theo trải nghiệm</div>
        <div
          v-for="experience in experienceRows"
          :key="experience.key"
          class="experience-review__item"
        >
          <div class="item-title">{{ experience.label }}</div>
          <div class="item-review-result is-flex">
            <div class="experience-stars">
              <span v-for="star in 5" :key="`${experience.key}-${star}`" class="mini-star active small">★</span>
            </div>
            <div class="experience-average">{{ Number(experience.average || 0).toFixed(1) }}/5</div>
            <div class="item-count">({{ experience.total }} đánh giá)</div>
          </div>
        </div>
      </div>
    </div>

    <div class="box-review-filter">
      <div class="title">Lọc đánh giá</div>
      <div class="filter-container">
        <button
          v-for="option in ratingFilterOptions"
          :key="option.value ?? 'all'"
          type="button"
          class="filter-chip"
          :class="{ active: selectedRating === option.value }"
          @click="applyRatingFilter(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
      <div class="filter-container">
        <button
          v-for="option in sortOptions"
          :key="option.key"
          type="button"
          class="filter-chip"
          :class="{ active: selectedSort === option.key }"
          @click="applySort(option.key)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <div class="boxReview-comment">
      <div v-for="review in reviews" :key="review.id" class="boxReview-comment-item">
        <div class="boxReview-comment-item-avatar">{{ review.author?.initial || "A" }}</div>
        <div class="boxReview-comment-item-review">
          <div class="review-head">
            <p class="name">{{ review.author?.name }}</p>
            <div class="date-time">
              <span>{{ review.createdAtHuman }}</span>
            </div>
          </div>
          <div class="item-review-rating">
            <div class="item-review-rating__star has-attribute">
              <div class="star-row">
                <span
                  v-for="star in 5"
                  :key="`${review.id}-${star}`"
                  class="mini-star"
                  :class="{ active: review.rating >= star }"
                >
                  ★
                </span>
              </div>
              <div class="rating-label">{{ reviewRatingLabel(review.rating) }}</div>
            </div>
            <div v-if="review.attributes?.length" class="item-review-rating__list-attribute">
              <div
                v-for="attribute in review.attributes"
                :key="`${review.id}-${attribute.key}-${attribute.value}`"
                class="item-review-rating__item-attribute"
              >
                {{ attribute.value }}
              </div>
            </div>
          </div>
          <div class="review-content">{{ review.content }}</div>
          <div v-if="review.images?.length" class="review-images">
            <img
              v-for="image in review.images"
              :key="image.id || image.image"
              :src="image.image"
              alt="review"
            />
          </div>
        </div>
      </div>
      <button
        v-if="hasMoreReviews"
        type="button"
        class="load-more"
        :disabled="isLoadingMoreReviews"
        @click="loadMoreReviews"
      >
        {{ isLoadingMoreReviews ? "Đang tải..." : "Xem thêm đánh giá" }}
      </button>
    </div>
  </section>
  <ModalReview />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useProductStore } from "@/stores/productStore";
import ModalReview from "@/components/Models/ModalReview.vue";

const productStore = useProductStore();
const {
  productDetail,
  productReviewSummary,
  productReviewFilters,
  productReviewList,
} = storeToRefs(productStore);

const isLoadingMoreReviews = ref(false);

const experienceLabelMap = {
  performance: "Hiệu năng",
  camera: "Chất lượng camera",
  battery: "Thời lượng pin",
  design: "Thiết kế",
  screen: "Màn hình",
};

const averageRatingDisplay = computed(() =>
  Number(productReviewSummary.value?.summary?.averageRating || 0).toFixed(1),
);
const totalReviews = computed(() => Number(productReviewSummary.value?.summary?.totalReviews || 0));
const reviews = computed(() => productReviewList.value?.items || []);
const selectedRating = computed(() => productReviewList.value?.filters?.rating ?? null);
const selectedSort = computed(() => productReviewList.value?.filters?.sort || "latest");
const sortOptions = computed(() => {
  const defaults = {
    latest: "Mới nhất",
    highest: "Đánh giá cao",
    lowest: "Đánh giá thấp",
    helpful: "Hữu ích",
  };

  return (productReviewFilters.value?.sortOptions || []).map((item) => ({
    key: item.key,
    label: defaults[item.key] || item.key,
  }));
});
const ratingFilterOptions = computed(() => ([
  { value: null, label: "Tất cả" },
  { value: 5, label: "5 sao" },
  { value: 4, label: "4 sao" },
  { value: 3, label: "3 sao" },
  { value: 2, label: "2 sao" },
  { value: 1, label: "1 sao" },
]));
const ratingRows = computed(() => {
  const breakdown = productReviewSummary.value?.summary?.ratingBreakdown || {};

  return [5, 4, 3, 2, 1].map((value) => ({
    value,
    count: Number(breakdown[String(value)] || 0),
  }));
});
const experienceRows = computed(() => {
  const rows = productReviewSummary.value?.summary?.experienceBreakdown || [];

  return rows.map((item) => ({
    ...item,
    label: experienceLabelMap[item.key] || item.key,
  }));
});
const hasMoreReviews = computed(() => Boolean(productReviewList.value?.pagination?.hasMore));

const openReviewModal = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-review-modal"));
  }
};

const applyRatingFilter = async (rating) => {
  if (!productDetail.value?.id) return;

  await productStore.fetchProductReviews(productDetail.value.id, {
    page: 1,
    per_page: 5,
    sort: selectedSort.value,
    ...(rating ? { rating } : {}),
  });
};

const applySort = async (sort) => {
  if (!productDetail.value?.id) return;

  await productStore.fetchProductReviews(productDetail.value.id, {
    page: 1,
    per_page: 5,
    sort,
    ...(selectedRating.value ? { rating: selectedRating.value } : {}),
  });
};

const loadMoreReviews = async () => {
  if (!productDetail.value?.id || !productReviewList.value?.pagination?.hasMore) return;

  isLoadingMoreReviews.value = true;

  try {
    await productStore.fetchProductReviews(
      productDetail.value.id,
      {
        page: (productReviewList.value.pagination?.page || 1) + 1,
        per_page: 5,
        sort: selectedSort.value,
        ...(selectedRating.value ? { rating: selectedRating.value } : {}),
      },
      { append: true },
    );
  } finally {
    isLoadingMoreReviews.value = false;
  }
};

const reviewRatingLabel = (rating) => {
  if (rating >= 5) return "Tuyệt vời";
  if (rating >= 4) return "Rất tốt";
  if (rating >= 3) return "Tốt";
  if (rating >= 2) return "Tạm được";
  return "Chưa tốt";
};
</script>

<style scoped>
.boxReview {
  background: #f5f5f7;
  border-radius: 24px;
  margin: 24px 0;
  padding: 16px;
}

.boxReview-head .title {
  color: #1f2937;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.boxReview-review, .box-review-filter {
  align-items: stretch;
  background: #fff;
  border-radius: 20px;
  display: grid;
  gap: 0;
  grid-template-columns: 190px minmax(0, 1fr) minmax(320px, 360px);
  margin: 16px 0;
  padding: 28px;
}

.boxReview-overview,
.boxReview-star,
.box-experience-review {
  min-width: 0;
}

.boxReview-overview {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.boxReview-score {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating {
  align-items: flex-end;
  color: #111827;
  display: flex;
  font-weight: 600;
  line-height: 1;
}

.average-rating {
  color: #111827;
  font-size: 64px;
  font-weight: 700;
}

.rating-total {
  color: #9ca3af;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  margin-left: 6px;
}

.summary-stars {
  display: flex;
  gap: 6px;
}

.boxReview-score__count {
  color: #374151;
  font-size: 16px;
  margin: 0;
}

.button {
  background: #d70018;
  border: none;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
  padding: 10px 16px;
}

.button__review {
  align-self: flex-start;
  margin-top: 16px;
  padding: 12px 18px;
}

.button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.boxReview-star {
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: center;
  padding: 6px 24px;
}

.rating-level {
  align-items: center;
  display: flex;
  flex-wrap: nowrap;
  gap: 10px;
  margin-bottom: 0;
  width: 100%;
}

.rating-level progress {
  flex: 1 1 auto;
  display: block;
  max-width: 100%;
  min-width: 220px;
  width: auto;
}

.star-count {
  flex: 0 0 34px;
  gap: 4px;
  justify-content: flex-start;
  min-width: 34px;
}

.rating-count-text {
  align-self: center;
  display: inline-block;
  white-space: nowrap;
  color: #9ca3af;
  font-size: 14px;
  flex: 0 0 96px;
  min-width: 96px;
  text-align: left;
}

.box-experience-review {
  padding-left: 24px;
}

.box-experience-review .title,
.box-review-filter .title {
  color: #111827;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 14px;
}

.experience-review__item {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
}

.item-title {
  color: #111827;
  font-size: 16px;
  min-width: 128px;
}

.item-review-result {
  align-items: center;
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.experience-stars,
.star-row {
  display: flex;
  gap: 2px;
}

.mini-star {
  color: #d1d5db;
  font-size: 16px;
}

.mini-star.small {
  font-size: 14px;
}

.mini-star.active {
  color: #fbbf24;
}

.experience-average {
  color: #111827;
  font-size: 16px;
  font-weight: 500;
}

.item-count {
  color: #9ca3af;
  font-size: 14px;
}

.box-review-filter {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px 0;
}

.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-chip {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  color: #374151;
  cursor: pointer;
  font-size: 13px;
  padding: 8px 14px;
}

.filter-chip.active {
  background: #fff1f2;
  border-color: #fda4af;
  color: #d70018;
}

.boxReview-comment {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.boxReview-comment-item {
  display: flex;
  gap: 12px;
}

.boxReview-comment-item-avatar {
  align-items: center;
  background: #fee2e2;
  border-radius: 999px;
  color: #d70018;
  display: flex;
  font-weight: 700;
  height: 36px;
  justify-content: center;
  width: 36px;
}

.boxReview-comment-item-review {
  background: #fafafa;
  border: 1px solid #ececec;
  border-radius: 14px;
  flex: 1;
  padding: 14px 16px;
}

.review-head {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.review-head .name {
  color: #111827;
  font-weight: 700;
  margin: 0;
}

.date-time {
  color: #6b7280;
  font-size: 13px;
}

.item-review-rating {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 10px 0;
}

.item-review-rating__star {
  align-items: center;
  display: flex;
  gap: 10px;
}

.rating-label {
  color: #d70018;
  font-size: 13px;
  font-weight: 600;
}

.item-review-rating__list-attribute {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.item-review-rating__item-attribute {
  background: #eff6ff;
  border-radius: 999px;
  color: #1d4ed8;
  font-size: 12px;
  padding: 6px 10px;
}

.review-content {
  color: #374151;
  font-size: 14px;
  line-height: 1.6;
}

.review-images {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.review-images img {
  border-radius: 10px;
  height: 72px;
  object-fit: cover;
  width: 72px;
}

.load-more {
  align-self: center;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  color: #111827;
  cursor: pointer;
  font-weight: 600;
  padding: 10px 18px;
}

@media only screen and (max-width: 768px) {
  .boxReview {
    border-radius: 18px;
    padding: 12px;
  }

  .boxReview-head .title {
    font-size: 20px;
  }

  .boxReview-review {
    grid-template-columns: 1fr;
    padding: 18px 16px;
  }

  .boxReview-star {
    border-right: none;
    border-top: 1px solid #e5e7eb;
    margin-top: 16px;
    padding: 16px 0;
  }

  .rating-level progress {
    min-width: 0;
  }

  .box-experience-review {
    border-top: 1px solid #e5e7eb;
    padding-left: 0;
    padding-top: 16px;
  }

  .average-rating {
    font-size: 48px;
  }

  .experience-review__item,
  .review-head,
  .boxReview-comment-item {
    flex-direction: column;
  }

  .item-review-result {
    margin-left: 0;
  }
}
</style>
