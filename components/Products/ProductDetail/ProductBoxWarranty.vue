<template>
  <div id="extendedWarranty" ref="rootEl" class="box-warranty-info">
    <div class="box-head">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M11.998 2 12.116 2.007 12.175 2.015 12.236 2.028 12.347 2.062a1.66 1.66 0 0 1 .217.112l.104.082.255.218c2.017 1.676 4.567 2.575 7.189 2.537l.342-.01a1.08 1.08 0 0 1 1.005.717 17.496 17.496 0 0 1 .442 10.076 17.53 17.53 0 0 1-3.396 3.904 17.521 17.521 0 0 1-4.65 2.23 1 1 0 0 1-.502 0 17.519 17.519 0 0 1-4.651-2.23 17.533 17.533 0 0 1-3.395-3.904A17.496 17.496 0 0 1 2.54 5.718a1.08 1.08 0 0 1 1.005-.717c2.737.125 5.423-.776 7.531-2.527l.263-.225.096-.075a1.675 1.675 0 0 1 .328-.146l.112-.034a1.24 1.24 0 0 1 .119-.02L11.998 2Zm3.71 7.293a1 1 0 0 0-1.415 0L11 12.585l-1.293-1.292-.094-.083a1 1 0 0 0-1.361 1.497l2 2 .094.083a1 1 0 0 0 1.32-.083l4-4 .083-.094a1 1 0 0 0-.042-1.32Z"
          fill="#171A26"
        />
        <path
          d="M11.998 2 12.116 2.007 12.175 2.015 12.236 2.028 12.347 2.062a1.66 1.66 0 0 1 .217.112l.104.082.255.218c2.017 1.676 4.567 2.575 7.189 2.537l.342-.01a1.08 1.08 0 0 1 1.005.717 17.496 17.496 0 0 1 .442 10.076 17.53 17.53 0 0 1-3.396 3.904 17.521 17.521 0 0 1-4.65 2.23 1 1 0 0 1-.502 0 17.519 17.519 0 0 1-4.651-2.23 17.533 17.533 0 0 1-3.395-3.904A17.496 17.496 0 0 1 2.54 5.718a1.08 1.08 0 0 1 1.005-.717c2.737.125 5.423-.776 7.531-2.527l.263-.225.096-.075a1.675 1.675 0 0 1 .328-.146l.112-.034a1.24 1.24 0 0 1 .119-.02L11.998 2Zm3.71 7.293a1 1 0 0 0-1.415 0L11 12.585l-1.293-1.292-.094-.083a1 1 0 0 0-1.361 1.497l2 2 .094.083a1 1 0 0 0 1.32-.083l4-4 .083-.094a1 1 0 0 0-.042-1.32Z"
          fill="url(#warrantyGradient)"
        />
        <defs>
          <linearGradient
            id="warrantyGradient"
            x1="16.993"
            y1="-9.667"
            x2="-2.952"
            y2="4.118"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#ED8A95" />
            <stop offset="0.816" stop-color="#C40016" />
          </linearGradient>
        </defs>
      </svg>

      <div class="box-title">
        <p>{{ title }}</p>
      </div>

      <div class="tooltip-wrapper tooltip-wrapper--head">
        <button
          type="button"
          class="tooltip-trigger"
          :aria-label="tooltipText"
          :title="tooltipText"
        >
          <span class="icon icon--plain">
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M8.667 7.333a.667.667 0 0 1 .666.667v2.667a.667.667 0 0 1-1.333 0V8a.667.667 0 0 1 .667-.667Z"
                fill="#808089"
              />
              <path
                d="M8.667 6.333a.833.833 0 1 0 0-1.667.833.833 0 0 0 0 1.667Z"
                fill="#808089"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2 8a6.667 6.667 0 1 1 13.333 0A6.667 6.667 0 0 1 2 8Zm6.667-5.333a5.333 5.333 0 1 0 0 10.666A5.333 5.333 0 0 0 8.667 2.667Z"
                fill="#808089"
              />
            </svg>
          </span>
        </button>
      </div>
    </div>

    <div class="list-warranty">
      <div
        v-if="isSwiperMounted"
        :class="{ 'swiper--ready': isSwiperReady }"
        class="swiper warranty-swiper swiper-pdp"
      >
        <div class="swiper-wrapper">
          <div
            v-for="item in warrantyItems"
            :key="item.id"
            class="swiper-slide warranty-slide"
          >
            <label
              :class="[ 'radio', 'button__choose-warranty', { active: selectedId === item.id }, ]"
            >
              <input
                :checked="selectedId === item.id"
                type="radio"
                name="extendedWarranty"
                class="button__choose-warranty-input"
                @change="selectWarranty(item.id)"
              />

              <div class="pack-head">
                <p class="pack-title">{{ item.title }}</p>

                <div class="tooltip-wrapper">
                  <button
                    type="button"
                    class="tooltip-trigger"
                    :aria-label="item.description"
                    :title="item.description"
                  >
                    <span class="icon icon--plain icon--small">
                      <svg
                        width="17"
                        height="16"
                        viewBox="0 0 17 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M8.667 7.333a.667.667 0 0 1 .666.667v2.667a.667.667 0 0 1-1.333 0V8a.667.667 0 0 1 .667-.667Z"
                          fill="#808089"
                        />
                        <path
                          d="M8.667 6.333a.833.833 0 1 0 0-1.667.833.833 0 0 0 0 1.667Z"
                          fill="#808089"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M2 8a6.667 6.667 0 1 1 13.333 0A6.667 6.667 0 0 1 2 8Zm6.667-5.333a5.333 5.333 0 1 0 0 10.666A5.333 5.333 0 0 0 8.667 2.667Z"
                          fill="#808089"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>

              <span class="is-block price">{{ item.price }}</span>
            </label>
          </div>
        </div>

        <div
          class="swiper-button-prev"
          tabindex="0"
          role="button"
          aria-label="Previous slide"
        >
          <div class="icon">
            <svg
              height="15"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              aria-hidden="true"
            >
              <path
                d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z"
              />
            </svg>
          </div>
        </div>
        <div
          class="swiper-button-next"
          tabindex="0"
          role="button"
          aria-label="Next slide"
        >
          <div class="icon">
            <svg
              height="15"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              aria-hidden="true"
            >
              <path
                d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256 73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z"
              />
            </svg>
          </div>
        </div>

        <div class="swiper-pagination"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import "swiper/css/pagination";

const defaultItems = [
  {
    id: 1,
    title:
      "1 đổi 1 VIP 6 tháng: Đổi máy mới tương đương khi có lỗi từ NSX trong 6 tháng",
    description:
      "Đổi máy tương đương khi phát sinh lỗi từ nhà sản xuất trong thời gian bảo hành.",
    price: "700.000đ",
  },
  {
    id: 5,
    title:
      "S24+ 12 tháng: Đổi sản phẩm tương đương hoặc miễn phí chi phí sửa chữa nếu có lỗi của NSX khi hết hạn bảo hành",
    description:
      "Gia hạn bảo hành thêm 12 tháng với quyền đổi máy hoặc miễn phí sửa chữa tùy trường hợp.",
    price: "800.000đ",
  },
  {
    id: 2,
    title:
      "1 đổi 1 VIP 12 tháng: Đổi máy mới tương đương khi có lỗi từ NSX trong 12 tháng",
    description:
      "Bảo hành 1 đổi 1 trong 12 tháng nếu sản phẩm gặp lỗi từ nhà sản xuất.",
    price: "1.000.000đ",
  },
  {
    id: 3,
    title:
      "Rơi vỡ rớt nước 12 tháng: Đổi mới tương đương khi có lỗi NSX, hỗ trợ 90% chi phí sửa chữa nếu hư hỏng",
    description:
      "Hỗ trợ thêm cho các sự cố rơi vỡ, vào nước trong 12 tháng đầu sử dụng.",
    price: "1.300.000đ",
  },
  {
    id: 22,
    title:
      "1 đổi 1 VIP 24 tháng: Đổi máy mới tương đương khi có lỗi từ NSX trong 24 tháng",
    description:
      "Nâng thời gian bảo vệ lên 24 tháng với quyền đổi máy tương đương khi có lỗi từ NSX.",
    price: "1.800.000đ",
  },
  {
    id: 23,
    title:
      "Rơi vỡ rớt nước 24 tháng: Đổi mới tương đương khi có lỗi NSX, hỗ trợ 90% chi phí sửa chữa nếu hư hỏng",
    description:
      "Bảo vệ dài hạn cho các rủi ro rơi vỡ, vào nước trong 24 tháng.",
    price: "2.300.000đ",
  },
  {
    id: 8,
    title: "Dịch vụ bảo hành Apple Care+ cho iPhone",
    description:
      "Gói dịch vụ Apple Care+ dành cho iPhone với quyền lợi bảo hành và hỗ trợ chính hãng.",
    price: "4.199.000đ",
  },
  {
    id: 31,
    title:
      "Bảo hành mở rộng 18 tháng: Miễn phí sửa chữa các lỗi phần cứng từ NSX",
    description:
      "Mở rộng thời gian bảo hành thêm 18 tháng cho các lỗi phần cứng đủ điều kiện.",
    price: "1.550.000đ",
  },
  {
    id: 32,
    title:
      "Gói toàn diện 12 tháng: Bảo vệ lỗi NSX và hỗ trợ sự cố rơi vỡ cơ bản",
    description:
      "Kết hợp bảo hành lỗi từ nhà sản xuất và hỗ trợ một phần chi phí khi có sự cố ngoài ý muốn.",
    price: "1.650.000đ",
  },
];

const props = defineProps({
  title: {
    type: String,
    default: "Chọn gói dịch vụ bảo hành",
  },
  tooltipText: {
    type: String,
    default: "Thông tin chi tiết về các gói bảo hành mở rộng.",
  },
  items: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const rootEl = ref(null);
const isSwiperMounted = ref(false);
const isSwiperReady = ref(false);
const internalSelectedId = ref(props.modelValue ?? props.items[0]?.id ?? null);
let warrantySwiper = null;

const warrantyItems = computed(() => props.items?.length ? props.items : defaultItems);
const selectedId = computed(() =>
  props.modelValue ?? internalSelectedId.value ?? warrantyItems.value[0]?.id ?? null,
);

watch(
  () => props.modelValue,
  (value) => {
    if (value != null) {
      internalSelectedId.value = value;
    }
  },
);

watch(
  warrantyItems,
  (items) => {
    if (!items.some((item) => item.id === selectedId.value)) {
      internalSelectedId.value = items[0]?.id ?? null;
    }
  },
  { immediate: true },
);

const selectWarranty = (id) => {
  internalSelectedId.value = id;
  emit("update:modelValue", id);
  emit("change", warrantyItems.value.find((item) => item.id === id) ?? null);
};

const destroySwiper = () => {
  if (warrantySwiper && !warrantySwiper.destroyed) {
    warrantySwiper.destroy(true, true);
  }
  warrantySwiper = null;
};

const initSwiper = async () => {
  if (!import.meta.client || !rootEl.value) return;

  const warrantyEl = rootEl.value.querySelector(".warranty-swiper");
  if (!warrantyEl) return;

  destroySwiper();

  const { default: Swiper } = await import("swiper");
  const { Grid, Navigation, Pagination } = await import("swiper/modules");

  warrantySwiper = new Swiper(warrantyEl, {
    modules: [Grid, Navigation, Pagination],
    slidesPerView: 3,
    slidesPerGroup: 3,
    spaceBetween: 10,
    grid: {
      rows: 2,
      fill: "row",
    },
    navigation: {
      nextEl: warrantyEl.querySelector(".swiper-button-next"),
      prevEl: warrantyEl.querySelector(".swiper-button-prev"),
    },
    pagination: {
      el: warrantyEl.querySelector(".swiper-pagination"),
      clickable: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        grid: {
          rows: 1,
          fill: "row",
        },
      },
      769: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        grid: {
          rows: 2,
          fill: "row",
        },
      },
    },
    observer: true,
    observeParents: true,
  });
};

onMounted(async () => {
  isSwiperMounted.value = true;
  await nextTick();
  await initSwiper();
  isSwiperReady.value = true;
});

onBeforeUnmount(() => {
  isSwiperReady.value = false;
  destroySwiper();
});
</script>

<style scoped>
#extendedWarranty {
  background-color: #f7f7f8;
  border-radius: 16px;
  margin: 16px 0;
  padding: 12px;
}

.box-warranty-info {
  background: #fff;
  width: 100%;
}

.box-head {
  align-items: center;
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.box-head > svg {
  flex-shrink: 0;
  height: 24px;
  width: 24px;
}

.box-title {
  flex: 1;
  min-width: 0;
}

.box-title p {
  color: #18181b;
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}

.tooltip-wrapper {
  cursor: pointer;
  display: inline-block;
  position: relative;
  width: fit-content;
}

.tooltip-trigger {
  align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
  display: inline-flex;
  padding: 0;
}

.icon {
  align-items: center;
  display: inline-flex;
  height: 0.8rem;
  justify-content: center;
  width: 1.5rem;
}

.icon--plain {
  background: transparent;
  height: 20px;
  width: 20px;
}

.icon--small {
  flex-shrink: 0;
}

.list-warranty {
  position: relative;
}

.warranty-swiper {
  overflow: hidden;
  padding-bottom: 20px;
  position: relative;
}

.warranty-swiper:not(.swiper--ready) {
  visibility: hidden;
}

.warranty-slide {
  box-sizing: border-box;
  height: auto;
}

.button__choose-warranty {
  background: #fff;
  border: 1px solid #e4e4e7;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  min-height: 64px;
  padding: 10px 12px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.button__choose-warranty:hover {
  border-color: #f1a6af;
}

.button__choose-warranty.active {
  background: linear-gradient(180deg, #fff 0%, #fff5f6 100%);
  border-color: #d70018;
  box-shadow: 0 0 0 1px rgba(215, 0, 24, 0.06);
}

.button__choose-warranty-input {
  display: none;
}

.pack-head {
  align-items: flex-start;
  display: flex;
  gap: 6px;
  justify-content: space-between;
  min-height: 0;
}

.pack-title {
  color: #3f3f46;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.35;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.price {
  color: #d70018;
  display: block;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.2;
  margin-top: auto;
}

.swiper-pdp :deep(.swiper-button-next),
.swiper-pdp :deep(.swiper-button-prev) {
  align-items: center;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  height: 24px;
  justify-content: center;
  margin-top: 0;
  top: calc(50% - 10px);
  transform: translateY(-50%);
  width: 24px;
}

.swiper-pdp :deep(.swiper-button-prev) {
  left: -1px;
}

.swiper-pdp :deep(.swiper-button-next) {
  right: -1px;
}

.swiper-pdp :deep(.swiper-button-next:after),
.swiper-pdp :deep(.swiper-button-prev:after),
.swiper-pdp :deep(.swiper-button-disabled) {
  display: none;
}

.swiper-pdp :deep(.swiper-pagination) {
  bottom: 0;
  display: flex;
  gap: 2px;
  justify-content: center;
}

.swiper-pdp :deep(.swiper-pagination-bullet) {
  background: #e4e4e7;
  border-radius: 4px;
  height: 2px;
  margin: 0;
  opacity: 1;
  transition: all 0.3s ease-in-out;
  width: 8px;
}

.swiper-pdp :deep(.swiper-pagination-bullet-active) {
  background: #d70018;
  width: 16px;
}

.swiper-pdp
  :deep(.swiper-pagination-bullet.swiper-pagination-bullet-active:only-child) {
  display: none;
}

.swiper-pdp :deep(.icon svg) {
  fill: #707070;
}

@media screen and (max-width: 768px) {
  .button__choose-warranty {
    min-height: 60px;
  }

  .pack-head {
    min-height: auto;
  }

  .price {
    font-size: 14px;
  }
}
</style>
