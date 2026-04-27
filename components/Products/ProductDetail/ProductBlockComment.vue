<template>
  <div v-if="productDetail" id="block-comment-cps" class="comment-container pt-3">
    <div class="comment-form">
      <p id="total_comment" class="comment-form-title">Hỏi và đáp</p>
      <div class="comment-form-content">
        <img
          src="https://cdn2.cellphones.com.vn/insecure/rs:fill:160:0/q:90/plain/https://cellphones.com.vn/media/wysiwyg/ant-hello-2025.png"
          width="160"
          alt="cps ant icon"
          quantity="auto"
          class="cps-ant-cmt"
        />
        <div class="question">
          <div class="d-flex align-items-center">
            <p class="question-title">Hãy đặt câu hỏi cho chúng tôi</p>
          </div>
          <p class="question-content">
            CellphoneS sẽ phản hồi trong vòng 1 giờ. Nếu Quý khách gửi câu hỏi sau 22h, chúng tôi sẽ trả lời vào sáng hôm sau.<br />
            Thông tin có thể thay đổi theo thời gian, vui lòng đặt câu hỏi để nhận được cập nhật mới nhất!
          </p>
          <div class="textarea-wrapper">
            <div class="textarea-comment">
              <textarea
                v-model="questionForm.content"
                placeholder="Viết câu hỏi của bạn tại đây"
                class="textarea"
              />
              <button class="button button__cmt-send" :disabled="isSubmittingQuestion" @click="submitQuestion">
                {{ isSubmittingQuestion ? "Đang gửi" : "Gửi câu hỏi" }}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-paper-plane">
                  <path d="M10 14L21 3" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path
                    d="M21.0001 3L14.5001 21C14.4562 21.0957 14.3858 21.1769 14.2971 21.2338C14.2085 21.2906 14.1054 21.3209 14.0001 21.3209C13.8948 21.3209 13.7917 21.2906 13.703 21.2338C13.6144 21.1769 13.5439 21.0957 13.5001 21L10.0001 14L3.00007 10.5C2.90433 10.4561 2.8232 10.3857 2.76632 10.2971C2.70944 10.2084 2.6792 10.1053 2.6792 10C2.6792 9.89468 2.70944 9.79158 2.76632 9.70295C2.8232 9.61431 2.90433 9.54387 3.00007 9.5L21.0001 3Z"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <p v-if="questionError" class="feedback-text error">{{ questionError }}</p>
          <p v-if="questionSuccess" class="feedback-text success">{{ questionSuccess }}</p>
        </div>
      </div>
    </div>

    <div v-if="questions.length" class="block-comment__box-list-comment">
      <div id="page_comment_list" class="list-comment">
        <div v-for="item in questions" :key="item.id" class="item-comment">
          <div class="item-comment__box-cmt">
            <div class="box-cmt__box-info">
              <div class="box-info">
                <div class="box-info__avatar">
                  <span>{{ item.author?.initial || "A" }}</span>
                </div>
                <p class="box-info__name">{{ item.author?.name }}</p>
              </div>
              <div class="box-time-cmt">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
                    <path
                      d="M7.72,8.78,5.25,6.31V3h1.5v2.69L8.78,7.72ZM6,0a6,6,0,1,0,6,6A6,6,0,0,0,6,0ZM6,10.5A4.5,4.5,0,1,1,10.5,6,4.5,4.5,0,0,1,6,10.5Z"
                      fill="#707070"
                    ></path>
                  </svg>
                </div>
                &nbsp;{{ item.createdAtHuman }}
              </div>
            </div>
            <div class="box-cmt__box-question" :class="{ 'show-all-reply': item.replies?.length }">
              <div class="content">
                <p>{{ item.content }}</p>
              </div>
              <button class="btn-rep-cmt respondent button__cmt-rep" @click="toggleReplyForm(item.id)">
                <div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.3335 6H10.6668" stroke="#D70018" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M5.3335 8.6665H9.3335" stroke="#D70018" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path
                      d="M6 11.9998H4C3.46957 11.9998 2.96086 11.7891 2.58579 11.4141C2.21071 11.039 2 10.5303 2 9.99984V4.6665C2 4.13607 2.21071 3.62736 2.58579 3.25229C2.96086 2.87722 3.46957 2.6665 4 2.6665H12C12.5304 2.6665 13.0391 2.87722 13.4142 3.25229C13.7893 3.62736 14 4.13607 14 4.6665V9.99984C14 10.5303 13.7893 11.039 13.4142 11.4141C13.0391 11.7891 12.5304 11.9998 12 11.9998H10L8 13.9998L6 11.9998Z"
                      stroke="#D70018"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </div>
                &nbsp;Phản hồi
              </button>

              <div v-if="activeReplyQuestionId === item.id" class="reply-form">
                <textarea
                  v-model="replyForms[item.id].content"
                  class="textarea"
                  placeholder="Viết phản hồi của bạn"
                />
                <input
                  v-model="replyForms[item.id].author.name"
                  type="text"
                  class="meta-input"
                  placeholder="Họ tên"
                />
                <button class="button button__cmt-send" :disabled="isSubmittingReply" @click="submitReply(item.id)">
                  {{ isSubmittingReply ? "Đang gửi" : "Gửi phản hồi" }}
                </button>
              </div>

              <div v-if="item.replies?.length" class="fieldset-bottom">
                <div class="btn-toggle-list-comment" :class="{ hide: expandedQuestions[item.id] }" @click="toggleReplies(item.id)">
                  {{ expandedQuestions[item.id] ? "Thu gọn phản hồi" : `Xem ${item.replyCount || item.replies.length} phản hồi` }}
                  <div>
                    <svg height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                      <path
                        d="M416 352c-8.188 0-16.38-3.125-22.62-9.375L224 173.3l-169.4 169.4c-12.5 12.5-32.75 12.5-45.25 0s-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25C432.4 348.9 424.2 352 416 352z"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="item.replies?.length && expandedQuestions[item.id]" class="item-comment__box-rep-comment">
              <div class="list-rep-comment">
                <div v-for="reply in item.replies" :key="reply.id" class="item-rep-comment">
                  <div class="box-cmt__box-info">
                    <div class="box-info">
                      <div class="box-info__avatar">
                        <span v-if="reply.author?.tag" class="icon-cps">QTV</span>
                        <span v-else>{{ reply.author?.initial || "A" }}</span>
                      </div>
                      <p class="box-info__name">{{ reply.author?.name }}</p>
                      <span v-if="reply.author?.tag" class="box-info__tag">{{ reply.author.tag }}</span>
                    </div>
                    <div class="box-time-cmt">
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
                          <path
                            d="M7.72,8.78,5.25,6.31V3h1.5v2.69L8.78,7.72ZM6,0a6,6,0,1,0,6,6A6,6,0,0,0,6,0ZM6,10.5A4.5,4.5,0,1,1,10.5,6,4.5,4.5,0,0,1,6,10.5Z"
                            fill="#707070"
                          ></path>
                        </svg>
                      </div>
                      &nbsp;{{ reply.createdAtHuman }}
                    </div>
                  </div>
                  <div class="box-cmt__box-question">
                    <div class="content">
                      <div>{{ reply.content }}</div>
                    </div>
                    <button class="btn-rep-cmt respondent button__cmt-rep" @click="toggleReplyForm(item.id)">
                      <div>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.3335 6H10.6668" stroke="#D70018" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                          <path d="M5.3335 8.6665H9.3335" stroke="#D70018" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                          <path
                            d="M6 11.9998H4C3.46957 11.9998 2.96086 11.7891 2.58579 11.4141C2.21071 11.039 2 10.5303 2 9.99984V4.6665C2 4.13607 2.21071 3.62736 2.58579 3.25229C2.96086 2.87722 3.46957 2.6665 4 2.6665H12C12.5304 2.6665 13.0391 2.87722 13.4142 3.25229C13.7893 3.62736 14 4.13607 14 4.6665V9.99984C14 10.5303 13.7893 11.039 13.4142 11.4141C13.0391 11.7891 12.5304 11.9998 12 11.9998H10L8 13.9998L6 11.9998Z"
                            stroke="#D70018"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></path>
                        </svg>
                      </div>
                      &nbsp;Phản hồi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        v-if="hasMoreQuestions"
        class="btn-show-more"
        :disabled="isLoadingMoreQuestions"
        @click="loadMoreQuestions"
      >
        {{ isLoadingMoreQuestions ? "Đang tải..." : "Xem thêm câu hỏi" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { useProductStore } from "@/stores/productStore";

const productStore = useProductStore();
const { productDetail, productQuestions } = storeToRefs(productStore);

const isSubmittingQuestion = ref(false);
const isSubmittingReply = ref(false);
const isLoadingMoreQuestions = ref(false);
const questionError = ref("");
const questionSuccess = ref("");
const activeReplyQuestionId = ref(null);
const expandedQuestions = reactive({});
const replyForms = reactive({});

const questionForm = reactive({
  content: "",
  author: {
    name: "",
    phone: "",
  },
});

const questions = computed(() => productQuestions.value?.items || []);
const hasMoreQuestions = computed(() => Boolean(productQuestions.value?.pagination?.hasMore));

const ensureReplyForm = (questionId) => {
  if (!replyForms[questionId]) {
    replyForms[questionId] = {
      content: "",
      author: {
        name: "",
      },
    };
  }
};

const toggleReplyForm = (questionId) => {
  ensureReplyForm(questionId);
  activeReplyQuestionId.value = activeReplyQuestionId.value === questionId ? null : questionId;
};

const toggleReplies = (questionId) => {
  expandedQuestions[questionId] = !expandedQuestions[questionId];
};

const refreshQuestions = async () => {
  if (!productDetail.value?.id) return;
  await productStore.fetchProductQuestions(productDetail.value.id, { page: 1, per_page: 5 });
};

const submitQuestion = async () => {
  if (!productDetail.value?.id) return;

  questionError.value = "";
  questionSuccess.value = "";

  if (!questionForm.content || questionForm.content.trim().length < 10) {
    questionError.value = "Vui lòng nhập ít nhất 10 ký tự cho câu hỏi.";
    return;
  }

  isSubmittingQuestion.value = true;

  try {
    const response = await productStore.submitProductQuestion(productDetail.value.id, {
      content: questionForm.content.trim(),
      author: {
        name: questionForm.author.name,
        phone: questionForm.author.phone,
      },
    });

    if (!response?.status) {
      questionError.value = response?.message || "Không thể gửi câu hỏi.";
      return;
    }

    questionSuccess.value = response?.message || "Gửi câu hỏi thành công.";
    questionForm.content = "";
    questionForm.author.name = "";
    questionForm.author.phone = "";
    await refreshQuestions();
  } finally {
    isSubmittingQuestion.value = false;
  }
};

const submitReply = async (questionId) => {
  if (!productDetail.value?.id) return;

  ensureReplyForm(questionId);
  const form = replyForms[questionId];

  if (!form.content || form.content.trim().length < 2) {
    questionError.value = "Vui lòng nhập nội dung phản hồi.";
    return;
  }

  isSubmittingReply.value = true;

  try {
    const response = await productStore.submitProductQuestionReply(productDetail.value.id, questionId, {
      content: form.content.trim(),
      author: {
        name: form.author.name,
      },
    });

    if (!response?.status) {
      questionError.value = response?.message || "Không thể gửi phản hồi.";
      return;
    }

    form.content = "";
    form.author.name = "";
    activeReplyQuestionId.value = null;
    expandedQuestions[questionId] = true;
    await refreshQuestions();
  } finally {
    isSubmittingReply.value = false;
  }
};

const loadMoreQuestions = async () => {
  if (!productDetail.value?.id || !productQuestions.value?.pagination?.hasMore) return;

  isLoadingMoreQuestions.value = true;

  try {
    await productStore.fetchProductQuestions(
      productDetail.value.id,
      {
        page: (productQuestions.value.pagination?.page || 1) + 1,
        per_page: 5,
      },
      { append: true },
    );
  } finally {
    isLoadingMoreQuestions.value = false;
  }
};
</script>

<style scoped>
.comment-container {
  margin: 24px 0;
}

.comment-form-title {
  color: #111827;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 12px;
}

.comment-form-content {
  align-items: center;
  background: #fff7f7;
  border: 1px solid #fecaca;
  border-radius: 16px;
  display: flex;
  gap: 20px;
  padding: 16px;
}

.cps-ant-cmt {
  flex-shrink: 0;
}

.question {
  flex: 1;
}

.question-title {
  color: #111827;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.question-content {
  color: #4b5563;
  font-size: 14px;
  line-height: 1.6;
  margin: 8px 0 12px;
}

.textarea-wrapper .textarea-comment {
  display: flex;
  gap: 12px;
}

.textarea-wrapper .textarea-comment .textarea,
.reply-form .textarea,
.meta-input {
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 10px 12px;
  width: 100%;
}

.textarea-wrapper .textarea-comment .textarea,
.reply-form .textarea {
  max-height: 50px;
  min-height: 45px;
  overflow-y: auto;
  resize: none;
}

.button__cmt-send {
  align-items: center;
  background: #d70018;
  border: none;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  flex-wrap: nowrap;
  gap: 8px;
  height: fit-content;
  justify-content: center;
  white-space: nowrap;
  padding: 12px 14px;
}

.button__cmt-send:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.feedback-text {
  font-size: 14px;
  margin: 8px 0 0;
}

.feedback-text.error {
  color: #d70018;
}

.feedback-text.success {
  color: #15803d;
}

.block-comment__box-list-comment .list-comment {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  margin-top: 16px;
  padding: 16px;
}

.item-comment__box-cmt,
.item-rep-comment {
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 0;
}

.item-comment__box-cmt:last-child,
.item-rep-comment:last-child {
  border-bottom: none;
}

.box-cmt__box-info {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.box-info {
  align-items: center;
  display: flex;
  gap: 8px;
}

.box-info__avatar span {
  align-items: center;
  background: #fee2e2;
  border-radius: 999px;
  color: #d70018;
  display: flex;
  font-size: 14px;
  font-weight: 700;
  height: 32px;
  justify-content: center;
  width: 32px;
}

.box-info__avatar .icon-cps {
  background: #d70018;
  color: #fff;
  font-size: 11px;
}

.box-info__name {
  color: #111827;
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}

.box-info__tag {
  background: #d70018;
  border-radius: 999px;
  color: #fff;
  font-size: 11px;
  padding: 2px 8px;
}

.box-time-cmt {
  align-items: center;
  color: #6b7280;
  display: flex;
  font-size: 12px;
}

.box-cmt__box-question {
  border-left: 1.5px solid #e4e4e7;
  margin-left: 16px;
  margin-top: 10px;
  padding: 8px 0 8px 18px;
  position: relative;
}

.box-cmt__box-question .content {
  font-size: 14px;
  margin: 0 0 6px;
}

.btn-rep-cmt {
  align-items: center;
  background: transparent;
  border: 0;
  color: #d70018;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  gap: 4px;
  margin-top: 8px;
  padding: 0;
}

.reply-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
}

.fieldset-bottom {
  background: #fff;
  bottom: -10px;
  left: 8px;
  padding-left: 10px;
  position: absolute;
}

.btn-toggle-list-comment {
  align-items: center;
  color: #111827;
  cursor: pointer;
  display: flex;
  font-size: 12px;
  font-weight: 600;
  gap: 4px;
}

.btn-toggle-list-comment.hide svg {
  transform: rotate(180deg);
}

.item-comment__box-rep-comment {
  margin-left: auto;
  margin-top: 14px;
  width: calc(100% - 40px);
}

.btn-show-more {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  color: #111827;
  cursor: pointer;
  display: block;
  font-size: 14px;
  height: 40px;
  margin: 16px auto 0;
  max-width: 260px;
  width: 100%;
}

@media screen and (max-width: 768px) {
  .comment-form-content,
  .textarea-wrapper .textarea-comment
  {
    flex-direction: column;
    grid-template-columns: 1fr;
  }

  .cps-ant-cmt {
    display: none;
  }

  .box-cmt__box-info {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }

  .item-comment__box-rep-comment {
    width: calc(100% - 20px);
  }
}
</style>
