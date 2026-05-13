// Chatbot Types
export type MessageRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
}

export interface ChatbotConfig {
  apiEndpoint: string
  welcomeMessage?: string
  placeholder?: string
}
