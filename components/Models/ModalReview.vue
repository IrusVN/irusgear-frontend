<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal modal-review is-active" @keydown.esc="closeModal">
      <div class="modal-background" @click="closeModal"></div>
      <div class="modal-content" :style="sheetDragStyle">
        <div class="review-container">
          <div
            class="review-sheet-handle"
            aria-hidden="true"
            @touchstart.prevent="startSheetDrag"
            @touchmove.prevent="onSheetDrag"
            @touchend="endSheetDrag"
          >
            <span></span>
          </div>
          <div class="review-header">
            <div>
              <p class="review-eyebrow">{{ $t('modalReview.productDefault') }}</p>
              <h2 class="review-title">{{ $t('modalReview.title') }}</h2>
            </div>
            <button type="button" class="review-close modal__button" :aria-label="$t('common.close')" @click="closeModal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="review-product">
            <div class="review-product__mark">
              <span>&#9733;</span>
            </div>
            <p class="review-product__name">{{ productName }}</p>
          </div>

          <form class="modal-review-content" @submit.prevent="submitReview">
            <div class="rating-section">
              <div class="rating-section__head">
                <span>{{ $t('modalReview.overallRating') }}</span>
                <strong>{{ reviewForm.rating }}/5</strong>
              </div>

              <div class="modal-review-star review-all">
                <button
                  v-for="option in overallOptions"
                  :key="option.value"
                  type="button"
                  class="overall-rating-item modal__button"
                  :class="{ active: reviewForm.rating === option.value }"
                  :aria-pressed="reviewForm.rating === option.value"
                  @click="reviewForm.rating = option.value"
                >
                  <span class="rating-star" aria-hidden="true">&#9733;</span>
                  <span class="rating-label">{{ option.label }}</span>
                </button>
              </div>
            </div>

            <label class="field-block">
              <span>{{ $t('modalReview.reviewLabel') }}</span>
              <textarea
                v-model="reviewForm.content"
                :placeholder="$t('modalReview.reviewPlaceholder')"
                class="textarea"
              />
            </label>

            <label class="field-block">
              <span>{{ $t('modalReview.authorName') }}</span>
              <input
                v-model.trim="reviewForm.authorName"
                class="review-author-input"
                maxlength="255"
                type="text"
                :placeholder="$t('modalReview.authorPlaceholder')"
              />
            </label>

            <p v-if="submitError" class="feedback-text error">{{ submitError }}</p>
            <p v-if="submitSuccess" class="feedback-text success">{{ submitSuccess }}</p>

            <div class="button-container">
              <button type="submit" class="button modal__button has-text-white" :disabled="isSubmitting">
                {{ isSubmitting ? $t('modalReview.sending') : $t('modalReview.sendReview') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { useProductStore } from "@/stores/productStore";
import { useAuthStore } from "@/stores/authStore";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const productStore = useProductStore();
const authStore = useAuthStore();
const { productDetail } = storeToRefs(productStore);

const isOpen = ref(false);
const isSubmitting = ref(false);
const submitError = ref("");
const submitSuccess = ref("");
const dragStartY = ref(0);
const dragCurrentY = ref(0);
const isSheetDragging = ref(false);

const overallOptions = [
  { value: 1, label: t('modalReview.ratingVeryBad') },
  { value: 2, label: t('modalReview.ratingBad') },
  { value: 3, label: t('modalReview.ratingNormal') },
  { value: 4, label: t('modalReview.ratingGood') },
  { value: 5, label: t('modalReview.ratingExcellent') },
];

const reviewForm = reactive({
  rating: 5,
  content: "",
  authorName: "",
});

const productName = computed(() => productDetail.value?.name || t('modalReview.productDefault'));
const sheetDragStyle = computed(() => {
  if (!isSheetDragging.value && dragCurrentY.value === 0) {
    return {};
  }

  return {
    transform: `translateY(${dragCurrentY.value}px)`,
    transition: "none",
  };
});

const resetForm = () => {
  reviewForm.rating = 5;
  reviewForm.content = "";
  reviewForm.authorName = authStore.user?.name || t('modalReview.authorName');
  submitError.value = "";
  submitSuccess.value = "";
};

const openModal = () => {
  resetForm();
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
  dragCurrentY.value = 0;
  isSheetDragging.value = false;
};

const startSheetDrag = (event) => {
  const touch = event.touches?.[0];

  if (!touch) {
    return;
  }

  dragStartY.value = touch.clientY;
  isSheetDragging.value = true;
};

const onSheetDrag = (event) => {
  if (!isSheetDragging.value) {
    return;
  }

  const touch = event.touches?.[0];

  if (!touch) {
    return;
  }

  const distance = touch.clientY - dragStartY.value;
  dragCurrentY.value = distance > 0 ? distance : 0;
};

const endSheetDrag = () => {
  isSheetDragging.value = false;

  if (dragCurrentY.value > 100) {
    closeModal();
    return;
  }

  dragCurrentY.value = 0;
};

const submitReview = async () => {
  submitError.value = "";
  submitSuccess.value = "";

  if (!productDetail.value?.id) {
    submitError.value = t('modalReview.errNoProduct');
    return;
  }

  if (!reviewForm.rating) {
    submitError.value = t('modalReview.errNoRating');
    return;
  }

  if ((reviewForm.content || "").trim().length < 15) {
    submitError.value = t('modalReview.errMinChars');
    return;
  }

  if (!reviewForm.authorName.trim()) {
    submitError.value = t('modalReview.errNoAuthorName');
    return;
  }

  isSubmitting.value = true;

  try {
    await productStore.submitProductReview(productDetail.value.id, {
      rating: reviewForm.rating,
      content: reviewForm.content.trim(),
      author: {
        name: reviewForm.authorName.trim(),
        phone: "",
      },
    });

    submitSuccess.value = t('modalReview.success');
    await Promise.all([
      productStore.fetchProductReviewSummary(productDetail.value.id),
      productStore.fetchProductReviews(productDetail.value.id, { page: 1, per_page: 5, sort: "latest" }),
    ]);

    setTimeout(() => {
      closeModal();
    }, 600);
  } catch (error) {
    submitError.value = error?.data?.message || t('modalReview.errSubmitFailed');
  } finally {
    isSubmitting.value = false;
  }
};

const openHandler = () => openModal();

onMounted(() => {
  resetForm();

  if (typeof window !== "undefined") {
    window.addEventListener("open-review-modal", openHandler);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("open-review-modal", openHandler);
  }
});
</script>

<style scoped>
.modal-review {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  left: 0;
  padding: 20px;
  position: fixed;
  scrollbar-gutter: stable;
  top: 0;
  width: 100%;
  z-index: 1200;
}

.modal-review .modal-background {
  animation: modalOverlayFadeIn 0.18s ease;
  background: rgba(0, 0, 0, 0.52);
  backdrop-filter: blur(4px);
  inset: 0;
  position: fixed;
}

.modal-review .modal-content {
  animation: modalScaleIn 0.22s ease;
  background: transparent;
  border: 0;
  border-radius: 0;
  box-shadow: none;
  max-height: calc(100vh - 40px);
  max-width: 620px;
  position: relative;
  will-change: transform, opacity;
  width: min(620px, 100%);
  z-index: 1;
}

.review-container {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.24);
  color: #111;
  max-height: calc(100vh - 40px);
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
}

.review-sheet-handle {
  display: none;
}

.review-sheet-handle span {
  display: block;
}

.review-container::-webkit-scrollbar {
  display: none;
}

.review-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.review-header {
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 24px 18px;
  position: sticky;
  top: 0;
  z-index: 4;
}

.review-eyebrow {
  color: #6b7280;
  font-size: 12px;
  letter-spacing: 0.08em;
  line-height: 1;
  margin: 0 0 7px;
  text-transform: uppercase;
}

.review-title {
  color: #111;
  font-size: 22px;
  letter-spacing: 0;
  line-height: 1.2;
  margin: 0;
}

.review-close {
  align-items: center;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  color: #111;
  cursor: pointer;
  display: flex;
  flex: 0 0 auto;
  font-size: 28px;
  height: 40px;
  justify-content: center;
  line-height: 1;
  transition: background 0.16s ease, border-color 0.16s ease, transform 0.16s ease;
  width: 40px;
}

.review-close:hover {
  background: #111;
  border-color: #111;
  color: #fff;
}

.review-close:active {
  transform: scale(0.96);
}

.review-product {
  align-items: center;
  display: grid;
  gap: 14px;
  grid-template-columns: 52px minmax(0, 1fr);
  padding: 22px 24px 6px;
}

.review-product__mark {
  align-items: center;
  background: #111;
  border-radius: 14px;
  color: #fff;
  display: flex;
  font-size: 25px;
  height: 52px;
  justify-content: center;
  width: 52px;
}

.review-product__name {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  color: #1f2937;
  font-size: 18px;
  line-height: 1.35;
  margin: 0;
  min-width: 0;
  overflow: hidden;
}

.modal-review-content {
  background: #fff;
  display: grid;
  gap: 16px;
  padding: 20px 24px 24px;
  position: relative;
}

.rating-section {
  border: 1px solid #eceff3;
  border-radius: 16px;
  padding: 16px;
}

.rating-section__head {
  align-items: center;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.rating-section__head span {
  color: #111;
  font-size: 15px;
}

.rating-section__head strong {
  background: #111;
  border-radius: 999px;
  color: #fff;
  font-size: 13px;
  line-height: 1;
  padding: 7px 10px;
}

.modal-review-star {
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.overall-rating-item {
  align-items: center;
  background: #fff;
  border: 1px solid #eceff3;
  border-radius: 14px;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 7px;
  justify-content: center;
  min-height: 86px;
  padding: 12px 6px;
  text-align: center;
  transition: border-color 0.16s ease, box-shadow 0.16s ease, color 0.16s ease, transform 0.16s ease;
}

.overall-rating-item:hover {
  border-color: #111;
  transform: translateY(-1px);
}

.overall-rating-item.active {
  border-color: #111;
  box-shadow: inset 0 0 0 1px #111;
  color: #111;
}

.rating-star {
  color: #d1d5db;
  font-size: 28px;
  line-height: 1;
  transition: color 0.16s ease, transform 0.16s ease;
}

.overall-rating-item.active .rating-star {
  color: #111;
  transform: scale(1.08);
}

.rating-label {
  font-size: 12px;
  line-height: 1.25;
  margin: 0;
}

.field-block {
  display: grid;
  gap: 8px;
  margin: 0;
}

.field-block > span {
  color: #111;
  font-size: 13px;
}

.textarea {
  background: #fff;
  border: 1px solid #d9dee7;
  border-radius: 14px;
  color: #111827;
  font-family: inherit;
  font-size: 14px;
  height: 132px;
  line-height: 1.55;
  outline: none;
  padding: 15px 16px;
  resize: none;
  transition: border-color 0.16s ease, box-shadow 0.16s ease;
  width: 100%;
}

.textarea::placeholder {
  color: #a1a8b3;
}

.textarea:focus,
.review-author-input:focus {
  border-color: #111;
  box-shadow: 0 0 0 4px rgba(17, 17, 17, 0.08);
}

.review-author-input {
  background: #fff;
  border: 1px solid #d9dee7;
  border-radius: 14px;
  color: #111827;
  font-family: inherit;
  font-size: 14px;
  outline: none;
  padding: 13px 16px;
  transition: border-color 0.16s ease, box-shadow 0.16s ease;
  width: 100%;
}

.review-author-input::placeholder {
  color: #a1a8b3;
}

.feedback-text {
  border-radius: 12px;
  font-size: 13px;
  margin: 0;
  padding: 10px 12px;
}

.feedback-text.error {
  background: #fef2f2;
  color: #b91c1c;
}

.feedback-text.success {
  background: #f0fdf4;
  color: #15803d;
}

.button-container {
  align-items: stretch;
  background: #fff;
  box-sizing: border-box;
  display: flex;
  width: 100%;
}

.button-container .button {
  align-items: center;
  background: #111;
  border: 0;
  border-radius: 14px;
  color: #fff;
  cursor: pointer;
  display: flex;
  flex: 1 1 auto;
  font-size: 15px;
  height: 52px;
  justify-content: center;
  letter-spacing: 0;
  line-height: 1;
  min-width: 0;
  text-transform: uppercase;
  transition: background 0.16s ease, transform 0.16s ease;
  width: 100%;
}

.button-container .button:hover:not(:disabled) {
  background: #000;
  transform: translateY(-1px);
}

.button-container .button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

@keyframes modalOverlayFadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes modalScaleIn {
  0% {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes reviewSheetSlideUp {
  from {
    opacity: 0;
    transform: translateY(100%);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media screen and (max-width: 768px) {
  .modal-review {
    align-items: flex-end;
    padding: 0;
  }

  .modal-review .modal-content {
    animation: reviewSheetSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1);
    max-height: min(92dvh, 760px);
    max-width: 100%;
    width: 100%;
  }

  .review-container {
    border-bottom: 0;
    border-left: 0;
    border-radius: 24px 24px 0 0;
    border-right: 0;
    box-shadow: 0 -18px 60px rgba(0, 0, 0, 0.24);
    display: flex;
    flex-direction: column;
    max-height: min(92dvh, 760px);
    min-height: min(620px, 86dvh);
    overflow: hidden;
  }

  .review-sheet-handle {
    align-items: center;
    align-self: center;
    cursor: grab;
    display: flex;
    flex: 0 0 auto;
    justify-content: center;
    margin: 0;
    padding: 10px 0 8px;
    touch-action: none;
    width: 100%;
  }

  .review-sheet-handle:active {
    cursor: grabbing;
  }

  .review-sheet-handle span {
    background: #d1d5db;
    border-radius: 999px;
    height: 5px;
    width: 44px;
  }

  .review-header {
    border-bottom: 0;
    flex: 0 0 auto;
    padding: 8px 18px 14px;
    position: relative;
  }

  .review-title {
    font-size: 20px;
  }

  .review-eyebrow {
    font-size: 11px;
    margin-bottom: 6px;
  }

  .review-close {
    height: 38px;
    width: 38px;
  }

  .review-product {
    flex: 0 0 auto;
    grid-template-columns: 44px minmax(0, 1fr);
    padding: 0 18px 12px;
  }

  .review-product__mark {
    border-radius: 12px;
    font-size: 21px;
    height: 44px;
    width: 44px;
  }

  .review-product__name {
    font-size: 16px;
  }

  .modal-review-content {
    flex: 1 1 auto;
    gap: 14px;
    overflow-y: auto;
    padding: 14px 18px calc(18px + env(safe-area-inset-bottom));
  }

  .rating-section {
    padding: 14px;
  }

  .modal-review-star {
    gap: 7px;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    overflow-x: visible;
  }

  .overall-rating-item {
    border-radius: 12px;
    min-height: 74px;
    padding: 9px 3px;
  }

  .rating-star {
    font-size: 23px;
  }

  .rating-label {
    font-size: 10px;
    max-width: 100%;
    overflow-wrap: anywhere;
  }

  .textarea {
    height: 120px;
  }

  .button-container {
    align-items: stretch;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0), #fff 18%);
    bottom: 0;
    box-sizing: border-box;
    display: flex;
    margin: 0;
    padding: 14px 0 env(safe-area-inset-bottom);
    position: sticky;
    width: 100%;
    z-index: 2;
  }

  .button-container .button {
    flex: 1 1 auto;
    height: 50px;
    width: 100%;
  }

}

@media screen and (max-width: 380px) {
  .modal-review-star {
    grid-template-columns: repeat(5, minmax(50px, 1fr));
    overflow-x: auto;
    padding-bottom: 2px;
  }
}
</style>
