import { ref } from 'vue'
import { chatbotService } from '~/services/chatbotService'
import type { ChatMessage } from '~/types/chatbot'

/**
 * Chatbot Composable
 * 
 * Manages chatbot state and conversation
 */
export const useChatbot = () => {
  const messages = ref<ChatMessage[]>([])
  const isOpen = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Initialize chatbot with welcome message
   */
  const initialize = () => {
    if (messages.value.length === 0) {
      messages.value.push({
        id: generateId(),
        role: 'assistant',
        content: 'Xin chào! Tôi là trợ lý ảo của IrusGear. Tôi có thể giúp bạn với các thông tin về đơn hàng, doanh thu, sản phẩm. Bạn cần hỗ trợ gì?',
        timestamp: new Date()
      })
    }
  }

  /**
   * Send user message and get bot response
   */
  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }
    messages.value.push(userMessage)

    try {
      loading.value = true
      error.value = null

      // Get bot response
      const response = await chatbotService.sendMessage(content, messages.value)

      // Add bot message
      const botMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }
      messages.value.push(botMessage)
    } catch (err: any) {
      error.value = err.message || 'Có lỗi xảy ra khi gửi tin nhắn'
      console.error('Error sending message:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Toggle chatbot window
   */
  const toggle = () => {
    isOpen.value = !isOpen.value
    if (isOpen.value) {
      initialize()
    }
  }

  /**
   * Close chatbot window
   */
  const close = () => {
    isOpen.value = false
  }

  /**
   * Clear conversation
   */
  const clearConversation = () => {
    messages.value = []
    initialize()
  }

  /**
   * Generate unique ID
   */
  const generateId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  return {
    // State
    messages,
    isOpen,
    loading,
    error,

    // Methods
    sendMessage,
    toggle,
    close,
    clearConversation,
    initialize
  }
}
