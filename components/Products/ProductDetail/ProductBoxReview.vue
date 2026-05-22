<template>
  <div>
  <section id="review" class="boxReview" v-if="productDetail">
    <div class="boxReview-head is-flex is-justify-content-space-between is-align-items-center">
      <h2 class="title">{{ $t('product.reviewTitle', { name: productDetail.name }) }}</h2>
    </div>

    <div class="boxReview-review">
      <div class="boxReview-overview">
        <div class="boxReview-score has-product">
          <div class="rating">
            <span class="average-rating">{{ averageRatingDisplay }}</span>
            <span class="rating-total">/5</span>
          </div>
          <div class="summary-stars">
            <span
              v-for="star in 5"
              :key="`summary-${star}`"
              class="mini-star"
              :class="{ active: averageRatingValue >= star }"
            >
              &#9733;
            </span>
          </div>
          <p class="boxReview-score__count">{{ totalReviews }} {{ $t('product.reviewCount') }}</p>
        </div>
        <button type="button" class="button button__review" @click="openReviewModal">
          {{ $t('product.writeReview') }}
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
            <span class="mini-star active small">&#9733;</span>
          </div>
          <progress
            :max="Math.max(totalReviews, 1)"
            class="progress is-small m-0 rating-progress"
            :class="{ 'has-count': star.count > 0 }"
            :value="star.count"
          />
          <span class="rating-count-text">{{ star.count }} {{ $t('product.reviews') }}</span>
        </div>
      </div>

    </div>

    <div class="box-review-filter">
      <div class="title">{{ $t('product.filterReviews') }}</div>
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
      <div v-if="!reviews.length" class="review-empty">
        <div class="review-empty__icon">&#9733;</div>
        <div>
          <p class="review-empty__title">{{ emptyReviewTitle }}</p>
          <p class="review-empty__text">{{ emptyReviewText }}</p>
        </div>
        <button type="button" class="button review-empty__button" @click="openReviewModal">
          {{ $t('product.writeReview') }}
        </button>
      </div>
      <div v-for="review in reviews" :key="review.id" class="boxReview-comment-item">
        <div class="boxReview-comment-item-avatar">{{ review.author?.initial || "A" }}</div>
        <div class="boxReview-comment-item-review">
          <div class="review-head">
            <div class="review-author">
              <p class="name">{{ review.author?.name }}</p>
              <span v-if="review.verifiedPurchase" class="verified-purchase-badge">
                {{ $t('product.verifiedPurchaseBadge') }}
              </span>
            </div>
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
                  &#9733;
                </span>
              </div>
              <div class="rating-label">{{ reviewRatingLabel(review.rating) }}</div>
            </div>
          </div>
          <div class="review-content">{{ review.content }}</div>
          <div class="review-actions">
            <button
              type="button"
              class="review-action"
              :disabled="isHelpfulPending(review.id)"
              @click="markHelpful(review)"
            >
              {{ isHelpfulPending(review.id) ? $t('common.loading') : $t('product.helpful') }}
              <span v-if="review.helpfulCount">({{ review.helpfulCount }})</span>
            </button>
            <button
              type="button"
              class="review-action"
              @click="openReportForm(review.id)"
            >
              {{ $t('product.reportReview') }}
            </button>
          </div>
          <form
            v-if="reportingReviewId === review.id"
            class="review-report"
            @submit.prevent="submitReport(review)"
          >
            <select v-model="reportReason" class="review-report__select">
              <option
                v-for="reason in reportReasons"
                :key="reason.value"
                :value="reason.value"
              >
                {{ reason.label }}
              </option>
            </select>
            <textarea
              v-model="reportContent"
              class="review-report__textarea"
              rows="3"
              :placeholder="$t('product.reportContentPlaceholder')"
            />
            <div class="review-report__actions">
              <button
                type="button"
                class="review-report__button is-secondary"
                @click="cancelReport"
              >
                {{ $t('product.cancelReport') }}
              </button>
              <button
                type="submit"
                class="review-report__button"
                :disabled="isSubmittingReport"
              >
                {{ isSubmittingReport ? $t('common.loading') : $t('product.submitReport') }}
              </button>
            </div>
          </form>
        </div>
      </div>
      <button
        v-if="hasMoreReviews"
        type="button"
        class="load-more"
        :disabled="isLoadingMoreReviews"
        @click="loadMoreReviews"
      >
        {{ isLoadingMoreReviews ? $t('common.loading') : $t('product.seeMoreReviews') }}
      </button>
    </div>
  </section>
  <ModalReview />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "#imports";
import { toast } from "vue-sonner";
import { useProductStore } from "@/stores/productStore";
import ModalReview from "@/components/Models/ModalReview.vue";

const { t } = useI18n();
const productStore = useProductStore();
const {
  productDetail,
  productReviewSummary,
  productReviewFilters,
  productReviewList,
} = storeToRefs(productStore);

const isLoadingMoreReviews = ref(false);
const pendingHelpfulIds = ref(new Set());
const reportingReviewId = ref(null);
const reportReason = ref("spam");
const reportContent = ref("");
const isSubmittingReport = ref(false);

const averageRatingValue = computed(() => Number(productReviewSummary.value?.summary?.averageRating || 0));
const averageRatingDisplay = computed(() => averageRatingValue.value.toFixed(1));
const totalReviews = computed(() => Number(productReviewSummary.value?.summary?.totalReviews || 0));
const reviews = computed(() => productReviewList.value?.items || []);
const selectedRating = computed(() => {
  const rating = productReviewList.value?.filters?.rating;

  if (rating === null || rating === undefined || rating === "") {
    return null;
  }

  const normalizedRating = Number(rating);
  return Number.isFinite(normalizedRating) ? normalizedRating : null;
});
const selectedSort = computed(() => productReviewList.value?.filters?.sort || "latest");
const hasAnyReviews = computed(() => totalReviews.value > 0);
const emptyReviewTitle = computed(() =>
  hasAnyReviews.value ? t('product.noMatchingReviewsTitle') : t('product.noReviewsTitle'),
);
const emptyReviewText = computed(() =>
  hasAnyReviews.value ? t('product.noMatchingReviewsText') : t('product.noReviewsText'),
);
const sortOptions = computed(() => {
  const defaults = {
    latest: t('product.sortLatest'),
    highest: t('product.highReviews'),
    lowest: t('product.lowReviews'),
    helpful: t('product.helpful'),
  };

  return (productReviewFilters.value?.sortOptions || []).map((item) => ({
    key: item.key,
    label: defaults[item.key] || item.key,
  }));
});
const ratingFilterOptions = computed(() => ([
  { value: null, label: t('product.all') },
  { value: 5, label: "5 " + t('product.star') },
  { value: 4, label: "4 " + t('product.star') },
  { value: 3, label: "3 " + t('product.star') },
  { value: 2, label: "2 " + t('product.star') },
  { value: 1, label: "1 " + t('product.star') },
]));
const ratingRows = computed(() => {
  const breakdown = productReviewSummary.value?.summary?.ratingBreakdown || {};
  const starValues = [5, 4, 3, 2, 1];

  return starValues.map((value, index) => ({
    value,
    count: Number(Array.isArray(breakdown) ? breakdown[index] || 0 : breakdown[String(value)] || 0),
  }));
});
const hasMoreReviews = computed(() => Boolean(productReviewList.value?.pagination?.hasMore));
const reportReasons = computed(() => ([
  { value: "spam", label: t('product.reportSpam') },
  { value: "irrelevant", label: t('product.reportIrrelevant') },
  { value: "offensive", label: t('product.reportOffensive') },
  { value: "personal_info", label: t('product.reportPersonalInfo') },
  { value: "other", label: t('product.reportOther') },
]));

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

const isHelpfulPending = (reviewId) => pendingHelpfulIds.value.has(reviewId);

const markHelpful = async (review) => {
  if (!productDetail.value?.id || !review?.id || isHelpfulPending(review.id)) return;

  pendingHelpfulIds.value = new Set([...pendingHelpfulIds.value, review.id]);

  try {
    await productStore.markProductReviewHelpful(productDetail.value.id, review.id);
    toast.success(t('product.reviewHelpfulSuccess'));
  } catch (error) {
    toast.error(error?.message || t('product.reviewActionFailed'));
  } finally {
    const nextPendingIds = new Set(pendingHelpfulIds.value);
    nextPendingIds.delete(review.id);
    pendingHelpfulIds.value = nextPendingIds;
  }
};

const openReportForm = (reviewId) => {
  reportingReviewId.value = reviewId;
  reportReason.value = "spam";
  reportContent.value = "";
};

const cancelReport = () => {
  reportingReviewId.value = null;
  reportReason.value = "spam";
  reportContent.value = "";
};

const submitReport = async (review) => {
  if (!productDetail.value?.id || !review?.id || isSubmittingReport.value) return;

  isSubmittingReport.value = true;

  try {
    await productStore.reportProductReview(productDetail.value.id, review.id, {
      reason: reportReason.value,
      content: reportContent.value.trim() || null,
    });
    toast.success(t('product.reviewReportSuccess'));
    cancelReport();
  } catch (error) {
    toast.error(error?.message || t('product.reviewActionFailed'));
  } finally {
    isSubmittingReport.value = false;
  }
};

const reviewRatingLabel = (rating) => {
  if (rating >= 5) return t('product.ratingExcellent');
  if (rating >= 4) return t('product.ratingVeryGood');
  if (rating >= 3) return t('product.ratingGood');
  if (rating >= 2) return t('product.ratingOkay');
  return t('product.ratingBad');
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

.boxReview-review,
.box-review-filter {
  align-items: stretch;
  background: #fff;
  border-radius: 20px;
  display: grid;
  gap: 0;
  grid-template-columns: 190px minmax(0, 1fr);
  margin: 16px 0;
  padding: 28px;
}

.boxReview-overview,
.boxReview-star {
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
  background: var(--irus-color-accent);
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
  border-left: 1px solid #e5e7eb;
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
  min-width: 0;
  width: auto;
}

.rating-progress {
  accent-color: #d1d5db;
  appearance: none;
  background: #d1d5db;
  border: 0;
  border-radius: 999px;
  height: 16px;
  overflow: hidden;
}

.rating-progress::-webkit-progress-bar {
  background: #d1d5db;
  border-radius: 999px;
}

.rating-progress::-webkit-progress-value {
  background: #d1d5db;
  border-radius: 999px;
}

.rating-progress::-moz-progress-bar {
  background: #d1d5db;
  border-radius: 999px;
}

.rating-progress.has-count {
  accent-color: #fbbf24;
}

.rating-progress.has-count::-webkit-progress-value {
  background: #fbbf24;
}

.rating-progress.has-count::-moz-progress-bar {
  background: #fbbf24;
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

.box-review-filter .title {
  color: #111827;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 14px;
}

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
  background: var(--irus-color-accent-soft);
  border-color: var(--irus-color-accent);
  color: var(--irus-color-accent);
}

.boxReview-comment {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-empty {
  align-items: center;
  background: #fff;
  border: 1px dashed #d1d5db;
  border-radius: 14px;
  display: flex;
  gap: 14px;
  padding: 18px;
}

.review-empty__icon {
  align-items: center;
  background: #fff7ed;
  border-radius: 999px;
  color: #f59e0b;
  display: flex;
  flex: 0 0 42px;
  font-size: 20px;
  height: 42px;
  justify-content: center;
  width: 42px;
}

.review-empty__title {
  color: #111827;
  font-weight: 700;
  margin: 0 0 4px;
}

.review-empty__text {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.review-empty__button {
  flex: 0 0 auto;
  margin-left: auto;
}

.boxReview-comment-item {
  display: flex;
  gap: 12px;
}

.boxReview-comment-item-avatar {
  align-items: center;
  background: var(--irus-color-accent-soft);
  border-radius: 999px;
  color: var(--irus-color-accent);
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

.review-author {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.verified-purchase-badge {
  background: #ecfdf5;
  border: 1px solid #bbf7d0;
  border-radius: 999px;
  color: #047857;
  font-size: 12px;
  font-weight: 700;
  padding: 3px 8px;
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
  color: var(--irus-color-accent);
  font-size: 13px;
  font-weight: 600;
}

.review-content {
  color: #374151;
  font-size: 14px;
  line-height: 1.6;
}

.review-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.review-action {
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  color: #4b5563;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  padding: 7px 12px;
}

.review-action:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.review-report {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
  padding: 12px;
}

.review-report__select,
.review-report__textarea {
  border: 1px solid #d1d5db;
  border-radius: 10px;
  color: #111827;
  font-size: 14px;
  outline: none;
  padding: 10px 12px;
  width: 100%;
}

.review-report__textarea {
  resize: vertical;
}

.review-report__actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.review-report__button {
  background: var(--irus-color-accent);
  border: none;
  border-radius: 999px;
  color: #fff;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  padding: 8px 14px;
}

.review-report__button.is-secondary {
  background: #f3f4f6;
  color: #374151;
}

.review-report__button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
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

@media only screen and (max-width: 990px) {
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

  .boxReview-overview {
    align-items: flex-start;
  }

  .boxReview-star {
    border-left: none;
    border-top: 1px solid #e5e7eb;
    margin-top: 16px;
    padding: 16px 0;
  }

  .average-rating {
    font-size: 48px;
  }

  .review-head,
  .boxReview-comment-item,
  .review-empty {
    flex-direction: column;
  }

  .review-empty {
    align-items: flex-start;
  }

  .review-empty__button {
    margin-left: 0;
    width: 100%;
  }

  .review-report__actions {
    flex-direction: column;
  }
}

@media only screen and (max-width: 540px) {
  .boxReview-review {
    padding: 16px 12px;
  }

  .button__review {
    width: 100%;
  }

  .rating-level {
    display: grid;
    gap: 8px;
    grid-template-columns: 34px minmax(0, 1fr);
  }

  .rating-count-text {
    grid-column: 2;
    min-width: 0;
  }

}
</style>
