<template>
  <div class="chatbot-widget">
    <!-- Chat Window -->
    <Transition name="slide-up">
      <div v-if="chatbotStore.isOpen" class="chat-window bg-white rounded-4 shadow-lg">
        <!-- Header -->
        <div class="chat-header bg-dark text-white p-3 rounded-top-4 d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center gap-2">
            <div class="avatar-bot bg-white text-dark rounded-circle d-flex align-items-center justify-content-center" style="width: 36px; height: 36px;">
              <i class="bi bi-robot fs-5"></i>
            </div>
            <div>
              <div class="fw-semibold">IrusGear Assistant</div>
              <small class="opacity-75">Trợ lý ảo</small>
            </div>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-link text-white p-1" @click="chatbotStore.clearChat" title="Xóa lịch sử">
              <i class="bi bi-trash"></i>
            </button>
            <button class="btn btn-sm btn-link text-white p-1" @click="chatbotStore.closeChat">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div class="chat-messages p-3" ref="messagesContainer">
          <div
            v-for="(message, index) in chatbotStore.messages"
            :key="index"
            class="message-wrapper mb-3"
            :class="message.role === 'user' ? 'text-end' : ''"
          >
            <div class="message" :class="message.role === 'user' ? 'message-user' : 'message-bot'">
              <div class="message-content" v-html="renderMarkdown(message.content)"></div>
              <small class="message-time text-muted">{{ formatTime(message.timestamp) }}</small>
            </div>

            <!-- Product Cards -->
            <div v-if="message.role === 'assistant' && message.productsLoading" class="mt-2 text-muted small">
              <i class="bi bi-hourglass-split me-1"></i> Đang tải sản phẩm...
            </div>
            <div v-else-if="message.role === 'assistant' && message.products && message.products.length > 0" class="product-cards mt-2 d-flex flex-wrap gap-2">
              <a
                v-for="product in message.products"
                :key="product.id"
                :href="`/products/${product.slug || product.id}`"
                class="product-card text-decoration-none"
                target="_blank"
              >
                <img
                  :src="product.image || product.image_url || '/placeholder.png'"
                  :alt="product.name"
                  class="product-card-img"
                />
                <div class="product-card-body">
                  <div class="product-card-name">{{ product.name }}</div>
                  <div class="product-card-price text-danger fw-semibold">
                    {{ formatPrice(product.price) }}
                  </div>
                </div>
              </a>
            </div>
          </div>

          <!-- Loading indicator -->
          <div v-if="chatbotStore.isLoading" class="message-wrapper mb-3">
            <div class="message message-bot">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="chat-input p-3 border-top">
          <form @submit.prevent="handleSend" class="d-flex gap-2">
            <input
              type="text"
              class="form-control"
              placeholder="Nhập tin nhắn..."
              v-model="inputMessage"
              :disabled="chatbotStore.isLoading"
            />
            <button type="submit" class="btn btn-dark" :disabled="chatbotStore.isLoading || !inputMessage.trim()">
              <i class="bi bi-send-fill"></i>
            </button>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Floating Button — hidden on mobile (integrated into mobile FAB) -->
    <button
      class="chat-button btn rounded-circle shadow-lg d-none d-md-flex align-items-center justify-content-center"
      @click="chatbotStore.toggleChat"
      :class="{ 'rotate': chatbotStore.isOpen }"
    >
      <!-- New message badge -->
      <span v-if="chatbotStore.hasNewMessage && !chatbotStore.isOpen" class="badge-dot"></span>
      <i class="bi fs-4" :class="chatbotStore.isOpen ? 'bi-x-lg' : 'bi-chat-dots-fill'"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { useChatbotStore } from '~/stores/chatbotStore'

const chatbotStore = useChatbotStore()

const inputMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

const handleSend = async () => {
  if (!inputMessage.value.trim() || chatbotStore.isLoading) return

  const message = inputMessage.value
  inputMessage.value = ''

  await chatbotStore.sendMessage(message)
  scrollToBottom()
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = (date: Date | string) => {
  return new Date(date).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price: number) => {
  if (!price) return ''
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}

// Simple markdown renderer: bold, newlines
const renderMarkdown = (text: string) => {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}

// Auto scroll when new message
watch(() => chatbotStore.messages.length, () => {
  scrollToBottom()
})
</script>

<style scoped>
.chatbot-widget {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1050;
}

.chat-window {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 380px;
  max-width: calc(100vw - 48px);
  height: 600px;
  max-height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  flex-shrink: 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  background: #f8f9fa;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 3px;
}

.chat-input {
  flex-shrink: 0;
  background: white;
}

.message {
  display: inline-block;
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 16px;
  word-wrap: break-word;
}

.message-user {
  background: #1a1a1a;
  color: white;
  border-bottom-right-radius: 4px;
}

.message-bot {
  background: white;
  color: #1a1a1a;
  border: 1px solid #dee2e6;
  border-bottom-left-radius: 4px;
}

.message-content {
  margin-bottom: 4px;
  line-height: 1.5;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
}

.message-user .message-time {
  color: rgba(255, 255, 255, 0.8);
}

/* Product cards */
.product-cards {
  max-width: 340px;
}

.product-card {
  display: flex;
  flex-direction: column;
  width: 100px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  transition: box-shadow 0.2s;
}

.product-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}

.product-card-img {
  width: 100%;
  height: 80px;
  object-fit: contain;
  background: #f8f9fa;
  padding: 4px;
}

.product-card-body {
  padding: 4px 6px 6px;
}

.product-card-name {
  font-size: 0.7rem;
  color: #333;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 2px;
}

.product-card-price {
  font-size: 0.7rem;
}

/* Floating button */
.chat-button {
  width: 60px;
  height: 60px;
  transition: all 0.3s ease;
  background: #1a1a1a !important;
  color: white;
  position: relative;
}

.chat-button:hover {
  transform: scale(1.1);
  background: #2d2d2d !important;
}

.chat-button.rotate {
  transform: rotate(90deg);
}

.chat-button.rotate:hover {
  transform: rotate(90deg) scale(1.1);
}

/* New message badge */
.badge-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 12px;
  height: 12px;
  background: #dc3545;
  border-radius: 50%;
  border: 2px solid white;
}

/* Typing indicator */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #6c757d;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 768px) {
  .chatbot-widget {
    bottom: 16px;
    right: 16px;
  }

  .chat-window {
    width: calc(100vw - 32px);
    height: calc(100vh - 100px);
    bottom: 76px;
  }

  .chat-button {
    width: 56px;
    height: 56px;
  }
}
</style>
