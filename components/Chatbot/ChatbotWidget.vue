<template>
  <!-- Floating Action Button -->
  <button
    id="chatbot-fab"
    class="chatbot-fab"
    :class="{ 'is-open': chatbotStore.isOpen }"
    @click="chatbotStore.toggleChat"
    :aria-label="chatbotStore.isOpen ? 'Đóng chatbot' : 'Mở chatbot tư vấn'"
  >
    <!-- Chat Icon -->
    <svg class="fab-icon fab-icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
    <!-- Close Icon -->
    <svg class="fab-icon fab-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
    <!-- Badge -->
    <span v-if="chatbotStore.hasNewMessage && !chatbotStore.isOpen" class="chatbot-fab-badge"></span>
  </button>

  <!-- Chat Window -->
  <Transition name="chatbot-slide">
    <div v-if="chatbotStore.isOpen" id="chatbot-window" class="chatbot-window">
      <!-- Header -->
      <div class="chatbot-header">
        <div class="chatbot-header-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a4 4 0 014 4v2a4 4 0 01-8 0V6a4 4 0 014-4z" />
            <path d="M18 10c0 6-6 10-6 10s-6-4-6-10" />
            <circle cx="12" cy="18" r="3" />
          </svg>
        </div>
        <div class="chatbot-header-info">
          <h3 class="chatbot-header-title">IRUS AI Trợ Lý</h3>
          <div class="chatbot-header-status">
            <span class="chatbot-status-dot"></span>
            Luôn sẵn sàng hỗ trợ
          </div>
        </div>
        <div class="chatbot-header-actions">
          <button class="chatbot-header-btn" @click="chatbotStore.clearChat" title="Xóa cuộc trò chuyện">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 105.64-11.36L1 10" />
            </svg>
          </button>
          <button class="chatbot-header-btn" @click="chatbotStore.closeChat" title="Đóng">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="4 14 10 14 10 20" />
              <line x1="3" y1="21" x2="10" y2="14" />
              <polyline points="20 10 14 10 14 4" />
              <line x1="21" y1="3" x2="14" y2="10" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Messages -->
      <div ref="messagesContainer" class="chatbot-messages">
        <div
          v-for="(msg, index) in chatbotStore.messages"
          :key="index"
          class="chatbot-msg"
          :class="{
            'is-user': msg.role === 'user',
            'is-bot': msg.role === 'assistant',
          }"
        >
          <!-- Bot Avatar -->
          <div v-if="msg.role === 'assistant'" class="chatbot-msg-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a4 4 0 014 4v2a4 4 0 01-8 0V6a4 4 0 014-4z" />
              <circle cx="12" cy="18" r="3" />
            </svg>
          </div>

          <!-- Bubble -->
          <div class="chatbot-msg-content">
            <div
              class="chatbot-msg-bubble"
              :class="{ 'is-error': msg.isError }"
              v-html="formatMessage(msg.content)"
            ></div>

            <!-- Product Cards -->
            <div v-if="msg.productsLoading" class="chatbot-products-loading">
              <div class="chatbot-products-skeleton">
                <div class="skeleton-card" v-for="n in 2" :key="n">
                  <div class="skeleton-img"></div>
                  <div class="skeleton-text"></div>
                  <div class="skeleton-text short"></div>
                </div>
              </div>
            </div>
            <div v-else-if="msg.products && msg.products.length" class="chatbot-products">
              <div class="chatbot-products-scroll">
                <a
                  v-for="product in msg.products"
                  :key="product.id"
                  :href="`/product/${product.slug}`"
                  class="chatbot-product-card"
                  target="_blank"
                >
                  <div class="chatbot-product-img">
                    <img
                      :src="product.main_image?.image || product.image || '/placeholder.png'"
                      :alt="product.name"
                      loading="lazy"
                    />
                  </div>
                  <div class="chatbot-product-info">
                    <div class="chatbot-product-name">{{ product.name }}</div>
                    <div class="chatbot-product-price">{{ formatPrice(product.price) }}</div>
                  </div>
                </a>
              </div>
            </div>

            <div class="chatbot-msg-time">{{ formatTime(msg.timestamp) }}</div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="chatbotStore.isLoading" class="chatbot-typing">
          <div class="chatbot-typing-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a4 4 0 014 4v2a4 4 0 01-8 0V6a4 4 0 014-4z" />
              <circle cx="12" cy="18" r="3" />
            </svg>
          </div>
          <div class="chatbot-typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="chatbot-input-area">
        <div class="chatbot-input-wrapper">
          <textarea
            ref="inputField"
            v-model="userInput"
            class="chatbot-input"
            placeholder="Nhập câu hỏi của bạn..."
            rows="1"
            @keydown.enter.exact="onEnterKey"
            @compositionstart="isComposing = true"
            @compositionend="onCompositionEnd"
            @input="autoResize"
          ></textarea>
          <button
            class="chatbot-send-btn"
            :disabled="!userInput.trim() || chatbotStore.isLoading"
            @click="handleSend"
            aria-label="Gửi tin nhắn"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="chatbot-footer">Powered by IRUS GEAR AI ✨</div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import { useChatbotStore } from "~/stores/chatbotStore";

const chatbotStore = useChatbotStore();
const userInput = ref("");
const messagesContainer = ref(null);
const inputField = ref(null);
const isComposing = ref(false);

const onEnterKey = (e) => {
  // Don't send while IME is composing (Vietnamese Telex/VNI, etc.)
  if (isComposing.value || e.isComposing) {
    return;
  }
  e.preventDefault();
  handleSend();
};

const onCompositionEnd = () => {
  isComposing.value = false;
};

const handleSend = async () => {
  // Wait a tick to ensure v-model has synced after composition
  await nextTick();

  const question = userInput.value.trim();
  if (!question || chatbotStore.isLoading) return;

  userInput.value = "";
  // Reset textarea height
  await nextTick();
  if (inputField.value) {
    inputField.value.style.height = "22px";
  }

  await chatbotStore.sendMessage(question);
};

const autoResize = () => {
  if (!inputField.value) return;
  inputField.value.style.height = "22px";
  inputField.value.style.height = Math.min(inputField.value.scrollHeight, 100) + "px";
};

const formatPrice = (price) => {
  if (!price) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// Simple markdown-like formatting
const formatMessage = (content) => {
  if (!content) return "";
  let html = content
    // Escape HTML first
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Bold **text**
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // Italic *text*
    .replace(/(?<!\*)\*(?!\*)(.*?)\*(?!\*)/g, "<em>$1</em>")
    // Line breaks
    .replace(/\n/g, "<br>");
  return html;
};

const formatTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
};

// Auto-scroll when messages change
watch(
  () => chatbotStore.messages.length,
  () => {
    nextTick(scrollToBottom);
  }
);

watch(
  () => chatbotStore.isLoading,
  () => {
    nextTick(scrollToBottom);
  }
);

// Focus input when chat opens
watch(
  () => chatbotStore.isOpen,
  (val) => {
    if (val) {
      nextTick(() => {
        inputField.value?.focus();
        scrollToBottom();
      });
    }
  }
);
</script>
