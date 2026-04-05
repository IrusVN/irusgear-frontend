import type { ChatMessage } from '~/types/chatbot'

/**
 * Chatbot Service
 * 
 * Integrated with Admin Bot API
 * Endpoint: POST /api/v1/ai-admin
 */

export const chatbotService = {
  /**
   * Send message to chatbot and get response
   * 
   * API: POST /api/v1/ai-admin
   * Body: {
   *   "question": "user message",
   *   "chat_history": [
   *     { "role": "user", "content": "..." },
   *     { "role": "assistant", "content": "..." }
   *   ]
   * }
   */
  async sendMessage(message: string, conversationHistory?: ChatMessage[]): Promise<string> {
    try {
      const token = useCookie('auth_token').value
      
      // Format chat history for API
      const chatHistory = conversationHistory?.map(msg => ({
        role: msg.role,
        content: msg.content
      })) || []
      
      const response = await $fetch<any>(
        '/api/v1/ai-admin',
        {
          baseURL: 'https://ai-user-6f5c.onrender.com',
          method: 'POST',
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          },
          body: {
            question: message,
            chat_history: chatHistory
          }
        }
      )
      
      // Try different possible response keys
      return response.response || response.answer || response.reply || response.message || 'Xin lỗi, tôi không thể trả lời câu hỏi này.'
    } catch (error: any) {
      console.error('Chatbot API error:', error)
      
      // Handle specific error cases
      if (error.statusCode === 401) {
        throw new Error('Bạn cần đăng nhập để sử dụng chatbot')
      }
      
      if (error.statusCode === 403) {
        throw new Error('Bạn không có quyền truy cập chatbot')
      }
      
      throw new Error('Có lỗi xảy ra khi kết nối với chatbot. Vui lòng thử lại.')
    }
  }
}
