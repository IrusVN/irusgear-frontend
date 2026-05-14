<template>
  <div class="chatbot-widget">
    <Transition name="slide-up">
      <div v-if="store.isOpen" class="chat-window bg-white rounded-4 shadow-lg">
        <!-- Header -->
        <div class="chat-header bg-dark text-white p-3 rounded-top-4 d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center gap-2">
            <div class="avatar-bot bg-white text-dark rounded-circle d-flex align-items-center justify-content-center" style="width:36px;height:36px;">
              <i class="bi bi-robot fs-5"></i>
            </div>
            <div>
              <div class="fw-semibold">IrusGear Admin AI</div>
              <small class="opacity-75">Trợ lý quản trị</small>
            </div>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-link text-white p-1" @click="store.clearChat" title="Xóa lịch sử">
              <i class="bi bi-trash"></i>
            </button>
            <button class="btn btn-sm btn-link text-white p-1" @click="store.closeChat">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div class="chat-messages p-3" ref="messagesContainer">
          <div
            v-for="(message, index) in store.messages"
            :key="index"
            class="message-wrapper mb-3"
            :class="message.role === 'user' ? 'text-end' : ''"
          >
            <div class="message" :class="message.role === 'user' ? 'message-user' : 'message-bot'">
              <div class="message-content" v-html="renderMarkdown(message.content)"></div>
              <small class="message-time text-muted">{{ formatTime(message.timestamp) }}</small>
            </div>
          </div>

          <div v-if="store.isLoading" class="message-wrapper mb-3">
            <div class="message message-bot">
              <div class="typing-indicator">
                <span></span><span></span><span></span>
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
              placeholder="Hỏi về doanh thu, đơn hàng..."
              v-model="inputMessage"
              :disabled="store.isLoading"
            />
            <button type="submit" class="btn btn-dark" :disabled="store.isLoading || !inputMessage.trim()">
              <i class="bi bi-send-fill"></i>
            </button>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Floating Button -->
    <button
      class="chat-button btn rounded-circle shadow-lg d-flex align-items-center justify-content-center"
      @click="store.toggleChat"
      :class="{ 'rotate': store.isOpen }"
    >
      <span v-if="store.hasNewMessage && !store.isOpen" class="badge-dot"></span>
      <i class="bi fs-4" :class="store.isOpen ? 'bi-x-lg' : 'bi-chat-dots-fill'"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { useAdminChatbotStore } from '~/stores/adminChatbotStore'

const store = useAdminChatbotStore()
const inputMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

const handleSend = async () => {
  if (!inputMessage.value.trim() || store.isLoading) return
  const message = inputMessage.value
  inputMessage.value = ''
  await store.sendMessage(message)
  scrollToBottom()
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = (date: Date | string) =>
  new Date(date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })

const renderMarkdown = (text: string) => {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}

watch(() => store.messages.length, () => scrollToBottom())
</script>

<style scoped>
.chatbot-widget { position: fixed; bottom: 24px; right: 24px; z-index: 1050; }
.chat-window { position: absolute; bottom: 80px; right: 0; width: 380px; max-width: calc(100vw - 48px); height: 560px; max-height: calc(100vh - 120px); display: flex; flex-direction: column; overflow: hidden; }
.chat-header { flex-shrink: 0; }
.chat-messages { flex: 1; overflow-y: auto; background: #f8f9fa; }
.chat-messages::-webkit-scrollbar { width: 6px; }
.chat-messages::-webkit-scrollbar-thumb { background: #dee2e6; border-radius: 3px; }
.chat-input { flex-shrink: 0; background: white; }
.message { display: inline-block; max-width: 80%; padding: 12px 16px; border-radius: 16px; word-wrap: break-word; }
.message-user { background: #1a1a1a; color: white; border-bottom-right-radius: 4px; }
.message-bot { background: white; color: #1a1a1a; border: 1px solid #dee2e6; border-bottom-left-radius: 4px; }
.message-content { margin-bottom: 4px; line-height: 1.5; }
.message-time { font-size: 0.75rem; opacity: 0.7; }
.message-user .message-time { color: rgba(255,255,255,0.8); }
.chat-button { width: 60px; height: 60px; transition: all 0.3s ease; background: #1a1a1a !important; color: white; position: relative; }
.chat-button:hover { transform: scale(1.1); background: #2d2d2d !important; }
.chat-button.rotate { transform: rotate(90deg); }
.badge-dot { position: absolute; top: 8px; right: 8px; width: 12px; height: 12px; background: #dc3545; border-radius: 50%; border: 2px solid white; }
.typing-indicator { display: flex; gap: 4px; padding: 8px 0; }
.typing-indicator span { width: 8px; height: 8px; background: #6c757d; border-radius: 50%; animation: typing 1.4s infinite; }
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing { 0%,60%,100% { transform: translateY(0); opacity: 0.7; } 30% { transform: translateY(-10px); opacity: 1; } }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(20px); }
</style>
