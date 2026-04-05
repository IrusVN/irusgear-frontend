<template>
  <div class="chatbot-widget">
    <!-- Chat Window -->
    <Transition name="slide-up">
      <div v-if="isOpen" class="chat-window bg-white rounded-4 shadow-lg">
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
            <button class="btn btn-sm btn-link text-white p-1" @click="clearConversation" title="Xóa lịch sử">
              <i class="bi bi-trash"></i>
            </button>
            <button class="btn btn-sm btn-link text-white p-1" @click="close">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div class="chat-messages p-3" ref="messagesContainer">
          <div v-for="message in messages" :key="message.id" class="message-wrapper mb-3" :class="message.role === 'user' ? 'text-end' : ''">
            <div class="message" :class="message.role === 'user' ? 'message-user' : 'message-bot'">
              <div class="message-content">{{ message.content }}</div>
              <small class="message-time text-muted">{{ formatTime(message.timestamp) }}</small>
            </div>
          </div>

          <!-- Loading indicator -->
          <div v-if="loading" class="message-wrapper mb-3">
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
              :disabled="loading"
            />
            <button type="submit" class="btn btn-dark" :disabled="loading || !inputMessage.trim()">
              <i class="bi bi-send-fill"></i>
            </button>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Floating Button -->
    <button 
      class="chat-button btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center"
      @click="toggle"
      :class="{ 'rotate': isOpen }"
    >
      <i class="bi fs-4" :class="isOpen ? 'bi-x-lg' : 'bi-chat-dots-fill'"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { useChatbot } from '~/composables/useChatbot'

const { messages, isOpen, loading, sendMessage, toggle, close, clearConversation } = useChatbot()

const inputMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

const handleSend = async () => {
  if (!inputMessage.value.trim() || loading.value) return
  
  const message = inputMessage.value
  inputMessage.value = ''
  
  await sendMessage(message)
  scrollToBottom()
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Auto scroll when new message
watch(() => messages.value.length, () => {
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

.chat-button {
  width: 60px;
  height: 60px;
  transition: all 0.3s ease;
  background: #1a1a1a !important;
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
