<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal modal-review is-active" @keydown.esc="closeModal">
      <div class="modal-background" @click="closeModal"></div>
      <div class="modal-content">
        <div class="review-container">
          <button type="button" class="content__close-btn-desk modal__button" :aria-label="$t('common.close')" @click="closeModal">
            <div class="close-icon">
              <svg height="20" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M376.6 427.5c11.31 13.58 9.484 33.75-4.094 45.06c-5.984 4.984-13.25 7.422-20.47 7.422c-9.172 0-18.27-3.922-24.59-11.52L192 305.1l-135.4 162.5c-6.328 7.594-15.42 11.52-24.59 11.52c-7.219 0-14.48-2.438-20.47-7.422c-13.58-11.31-15.41-31.48-4.094-45.06l142.9-171.5L7.422 84.5C-3.891 70.92-2.063 50.75 11.52 39.44c13.56-11.34 33.73-9.516 45.06 4.094L192 206l135.4-162.5c11.3-13.58 31.48-15.42 45.06-4.094c13.58 11.31 15.41 31.48 4.094 45.06l-142.9 171.5L376.6 427.5z"
                />
              </svg>
            </div>
          </button>

          <div class="title is-6 mb-0 px-4">{{ $t('modalReview.title') }}</div>

          <div class="modal-review-title is-flex is-align-items-center">
            <img
              src="https://cdn2.cellphones.com.vn/insecure/rs:fill:100:100/q:90/plain/https://cellphones.com.vn/media/wysiwyg/cps-ant.png"
              width="100"
              height="100"
              alt="Review mascot"
            />
            <p class="title-logged">{{ productName }}</p>
          </div>

          <form class="modal-review-content p-4" @submit.prevent="submitReview">
            <div class="title-review-star-items">{{ $t('modalReview.overallRating') }}</div>

            <div class="modal-review-star review-all">
              <button
                v-for="option in overallOptions"
                :key="option.value"
                type="button"
                class="overall-rating-item modal__button"
                :class="{ active: reviewForm.rating === option.value }"
                @click="reviewForm.rating = option.value"
              >
                <div class="icon is-active">
                  <svg height="30" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"
                    />
                  </svg>
                </div>
                <p>{{ option.label }}</p>
              </button>
            </div>

            <div class="title-review-star-items">{{ $t('modalReview.byExperience') }}</div>

            <div
              v-for="experience in experienceRows"
              :key="experience.key"
              class="modal-review-star modal-review-star--experience"
            >
              <p class="label-review">{{ experience.label }}</p>
              <div class="star">
                <button
                  v-for="star in 5"
                  :key="`${experience.key}-${star}`"
                  type="button"
                  class="star-button modal__button"
                  :class="{ active: (reviewForm.experienceRatings[experience.key] || 0) >= star }"
                  @click="reviewForm.experienceRatings[experience.key] = star"
                >
                  <svg height="22" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"
                    />
                  </svg>
                </button>
              </div>
              <div class="modal-review-star-status">
                {{ experienceStatus(experience.key) }}
              </div>
            </div>

            <textarea
              v-model="reviewForm.content"
              :placeholder="$t('modalReview.reviewPlaceholder')"
              class="textarea"
            />

            <div class="group-input is-flex pb-3">
                <input
                  id="review-image"
                  accept="image/x-png,image/gif,image/jpeg"
                multiple
                type="file"
                  class="is-hidden"
                  @change="handleFileChange"
                />
                <div
                  v-for="item in selectedFiles"
                  :key="item.id"
                  class="selected-file-card"
                >
                  <img :src="item.preview" :alt="item.file.name" class="selected-file-card__image" />
                  <button
                    type="button"
                    class="selected-file-card__remove"
                    :aria-label="$t('modalReview.deleteImage')"
                    @click="removeSelectedFile(item.id)"
                  >
                    ×
                  </button>
                </div>
                <label for="review-image" class="btn-add modal__button my-2 is-flex is-flex-direction-column is-align-items-center">
                  <div class="input-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M3 8C3 8.55 3.45 9 4 9C4.55 9 5 8.55 5 8V6H7C7.55 6 8 5.55 8 5C8 4.45 7.55 4 7 4H5V2C5 1.45 4.55 1 4 1C3.45 1 3 1.45 3 2V4H1C0.45 4 0 4.45 0 5C0 5.55 0.45 6 1 6H3V8Z"
                      fill="#637381"
                    />
                    <circle cx="13" cy="14" r="3" fill="#637381" />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M17.83 6H21C22.1 6 23 6.9 23 8V20C23 21.1 22.1 22 21 22H5C3.9 22 3 21.1 3 20V9.72C3.3 9.89 3.63 10 4 10C5.1 10 6 9.1 6 8V7H7C8.1 7 9 6.1 9 5C9 4.63 8.89 4.3 8.72 4H15.12C15.68 4 16.22 4.24 16.59 4.65L17.83 6ZM8 14C8 16.76 10.24 19 13 19C15.76 19 18 16.76 18 14C18 11.24 15.76 9 13 9C10.24 9 8 11.24 8 14Z"
                      fill="#637381"
                    />
                  </svg>
                  </div>
                  <span>{{ $t('modalReview.addImages') }}</span>
                </label>
              </div>

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
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const productStore = useProductStore();
const { productDetail, productReviewFilters } = storeToRefs(productStore);

const isOpen = ref(false);
const isSubmitting = ref(false);
const submitError = ref("");
const submitSuccess = ref("");
const selectedFiles = ref([]);

const overallOptions = [
  { value: 1, label: "Rất Tệ" },
  { value: 2, label: "Tệ" },
  { value: 3, label: "Bình thường" },
  { value: 4, label: "Tốt" },
  { value: 5, label: "Tuyệt vời" },
];

const experienceLabelMap = {
  performance: "Hiệu năng",
  battery: "Thời lượng pin",
  camera: "Chất lượng camera",
  design: "Thiết kế",
  screen: "Màn hình",
};

const experienceStatusMap = {
  performance: ["Yếu", "Ổn", "Khá", "Mạnh", "Siêu mạnh mẽ"],
  battery: ["Nhanh hết", "Tạm ổn", "Ổn", "Trâu", "Cực khủng"],
  camera: ["Mờ", "Ổn", "Khá", "Đẹp", "Chụp đẹp, chuyên nghiệp"],
  design: ["Thô", "Ổn", "Hài hòa", "Đẹp", "Rất cao cấp"],
  screen: ["Tạm", "Ổn", "Sáng", "Đẹp", "Rất sắc nét"],
};

const reviewForm = reactive({
  rating: 5,
  content: "",
  experienceRatings: {},
});

const fallbackExperienceKeys = [
  { key: "performance" },
  { key: "battery" },
  { key: "camera" },
];

const experienceRows = computed(() => {
  const keys = productReviewFilters.value?.experienceKeys?.length
    ? productReviewFilters.value.experienceKeys
    : fallbackExperienceKeys;

  return keys.slice(0, 3).map((item) => ({
    key: item.key,
    label: experienceLabelMap[item.key] || item.key,
  }));
});

const productName = computed(() => productDetail.value?.name || "Sản phẩm");

const resetForm = () => {
  cleanupSelectedFiles();
  reviewForm.rating = 5;
  reviewForm.content = "";
  reviewForm.experienceRatings = Object.fromEntries(
    experienceRows.value.map((item) => [item.key, 5]),
  );
  submitError.value = "";
  submitSuccess.value = "";
};

const openModal = () => {
  resetForm();
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
};

const experienceStatus = (key) => {
  const score = Number(reviewForm.experienceRatings[key] || 5);
  const labels = experienceStatusMap[key] || ["Rất tệ", "Tệ", "Bình thường", "Tốt", "Tuyệt vời"];

  return labels[Math.max(0, Math.min(score - 1, labels.length - 1))];
};

const handleFileChange = (event) => {
  cleanupSelectedFiles();
  selectedFiles.value = Array.from(event.target.files || []).map((file, index) => ({
    id: `${file.name}-${file.size}-${index}`,
    file,
    preview: URL.createObjectURL(file),
  }));
};

const removeSelectedFile = (id) => {
  const target = selectedFiles.value.find((item) => item.id === id);
  if (target?.preview) {
    URL.revokeObjectURL(target.preview);
  }

  selectedFiles.value = selectedFiles.value.filter((item) => item.id !== id);
};

const cleanupSelectedFiles = () => {
  selectedFiles.value.forEach((item) => {
    if (item?.preview) {
      URL.revokeObjectURL(item.preview);
    }
  });

  selectedFiles.value = [];
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

  isSubmitting.value = true;

  try {
    await productStore.submitProductReview(productDetail.value.id, {
      rating: reviewForm.rating,
      content: reviewForm.content.trim(),
      verifiedPurchase: false,
      experienceRatings: reviewForm.experienceRatings,
      attributes: [],
      images: [],
      author: {
        name: t('modalReview.authorName'),
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
  cleanupSelectedFiles();

  if (typeof window !== "undefined") {
    window.removeEventListener("open-review-modal", openHandler);
  }
});
</script>

<style scoped>
.modal-review {
  align-items: center;
  animation: modalOverlayFadeIn 0.22s ease;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  left: 0;
  padding: 16px;
  position: fixed;
  scrollbar-gutter: stable;
  top: 0;
  width: 100%;
  z-index: 1200;
}

.modal-review .modal-background {
  background: rgba(15, 23, 42, 0.6);
  inset: 0;
  position: fixed;
}

.modal-review .modal-content {
  animation: modalSlideUpIn 0.42s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: calc(100vh - 32px);
  max-width: 640px;
  position: relative;
  will-change: transform, opacity;
  width: min(640px, 100%);
  z-index: 1;
}

.review-container {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 18px 60px rgba(15, 23, 42, 0.18);
  max-height: calc(100vh - 32px);
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
}

.review-container::-webkit-scrollbar {
  display: none;
}

.review-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.content__close-btn-desk {
  align-items: center;
  background: transparent;
  border: 0;
  cursor: pointer;
  display: inline-flex;
  float: right;
  height: 28px;
  justify-content: center;
  margin: 14px 14px -42px 0;
  position: sticky;
  top: 14px;
  width: 28px;
  z-index: 4;
}

.close-icon {
  fill: #292d32;
  opacity: 0.9;
}

.title.is-6 {
  background-color: #f4f6f8;
  color: #1d1d20;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  padding: 18px 22px;
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 3;
}

.modal-review-title {
  align-items: center !important;
  background-color: #fff;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 14px;
}

.modal-review-title img {
  flex-shrink: 0;
  height: 86px;
  object-fit: contain;
  width: 56px;
}

.modal-review-title .title-logged {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #434657;
  display: -webkit-box;
  flex: 1 1 auto;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.35;
  margin: 0;
  min-width: 0;
  overflow: hidden;
}

.modal-review-content {
  background-color: #fff;
  padding: 0 22px 84px;
  position: relative;
}

.title-review-star-items {
  color: #111;
  font-size: 16px;
  font-weight: 700;
  margin: 14px 0 0;
}

.modal-review-star {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
}

.review-all {
  border-bottom: 1px solid rgba(145, 158, 171, 0.239);
  gap: 12px;
  justify-content: space-between;
}

.overall-rating-item {
  align-items: center;
  background: transparent;
  border: 0;
  color: #4b5563;
  cursor: pointer;
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  padding: 8px 4px;
  text-align: center;
}

.overall-rating-item .icon,
.star-button {
  fill: #d7dbe0;
  transition: transform 0.2s ease, fill 0.2s ease;
}

.overall-rating-item.active .icon,
.star-button.active {
  fill: #ffbf00;
}

.overall-rating-item.active p {
  color: #1f2937;
  font-weight: 600;
}

.overall-rating-item p {
  font-size: 12px;
  margin: 0;
}

.modal-review-star--experience {
  gap: 12px;
}

.label-review {
  color: #4b5563;
  flex: 0 0 140px;
  font-size: 14px;
  margin: 0;
}

.star {
  align-items: center;
  display: flex;
  gap: 4px;
  margin-left: auto;
}

.star-button {
  background: transparent;
  border: 0;
  cursor: pointer;
  display: inline-flex;
  padding: 0;
}

.star-button:hover,
.overall-rating-item:hover .icon {
  transform: translateY(-1px);
}

.modal-review-star-status {
  color: #4b5563;
  flex: 0 0 112px;
  font-size: 14px;
  line-height: 1.35;
  text-align: left;
}

.textarea {
  border: 1px solid #d8dde5;
  border-radius: 10px;
  font-family: inherit;
  font-size: 14px;
  height: 126px;
  margin-top: 10px;
  outline: none;
  padding: 14px 12px;
  resize: none;
  width: 100%;
}

.textarea::placeholder {
  color: #9ca3af;
}

.group-input {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 12px;
  margin: 16px 0 10px;
  overflow-x: auto;
  overflow-y: visible;
  padding: 8px 10px 8px 0;
  white-space: nowrap;
}

.group-input::-webkit-scrollbar {
  display: none;
}

.group-input {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.selected-file-card {
  background: #fff;
  border: 1px solid #d8dde5;
  border-radius: 10px;
  display: inline-block;
  flex: 0 0 118px;
  height: 72px;
  overflow: visible;
  position: relative;
  vertical-align: top;
  width: 118px;
}

.selected-file-card__image {
  border-radius: 10px;
  display: block;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.selected-file-card__remove {
  align-items: center;
  background: #fff;
  border: 1px solid #94a3b8;
  border-radius: 999px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.12);
  color: #475569;
  cursor: pointer;
  display: inline-flex;
  font-size: 18px;
  height: 22px;
  justify-content: center;
  line-height: 1;
  padding: 0;
  position: absolute;
  right: -8px;
  top: -8px;
  width: 22px;
}

.is-hidden {
  display: none !important;
}

.btn-add {
  align-items: center;
  background: #fff;
  border: 1px dashed rgba(145, 158, 171, 0.35);
  border-radius: 10px;
  color: #637381;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 700;
  gap: 8px;
  justify-content: center;
  min-height: 72px;
  min-width: 118px;
  padding: 10px 12px;
  text-align: center;
  vertical-align: top;
}

.input-icon {
  align-items: center;
  display: flex;
  justify-content: center;
}

.feedback-text {
  font-size: 13px;
  margin: 8px 0 0;
}

.feedback-text.error {
  color: #d70018;
}

.feedback-text.success {
  color: #0f9f5a;
}

.button-container {
  background: #fff;
  bottom: 0;
  border-top: 1px solid #eef2f6;
  padding: 10px 16px 12px;
  position: sticky;
  width: 100%;
  z-index: 3;
}

.button-container .button {
  background: #d70018;
  border: 0;
  border-radius: 9px;
  color: #fff;
  cursor: pointer;
  display: flex;
  font-size: 17px;
  font-weight: 700;
  height: 40px;
  justify-content: center;
  align-items: center;
  letter-spacing: 0;
  line-height: 1;
  text-transform: uppercase;
  width: 100%;
}

.button-container .button:disabled {
  cursor: not-allowed;
  opacity: 0.75;
}

@keyframes modalOverlayFadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes modalSlideUpIn {
  0% {
    opacity: 0;
    transform: translate3d(0, 100vh, 0);
  }

  72% {
    opacity: 1;
    transform: translate3d(0, 14px, 0);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@media screen and (max-width: 768px) {
  .modal-review {
    padding: 8px;
  }

  .modal-review .modal-content {
    max-height: calc(100vh - 16px);
    width: 100%;
  }

  .title.is-6 {
    font-size: 18px;
    padding: 16px 18px;
  }

  .content__close-btn-desk {
    margin: 10px 12px -40px 0;
    top: 12px;
  }

  .modal-review-title {
    gap: 10px;
    padding: 14px 18px 8px;
  }

  .modal-review-title .title-logged {
    font-size: 16px;
  }

  .modal-review-content {
    padding: 0 18px 82px;
  }

  .button-container {
    padding: 10px 12px 12px;
  }

  .review-all {
    gap: 6px;
  }

  .overall-rating-item p {
    font-size: 11px;
  }

  .label-review {
    flex-basis: 112px;
    font-size: 13px;
  }

  .modal-review-star-status {
    flex-basis: 96px;
    font-size: 12px;
  }
}
</style>
