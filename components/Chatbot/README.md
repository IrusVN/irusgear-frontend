# Chatbot Integration Guide

## Overview
Chatbot widget đã được tích hợp vào trang admin. Hiện tại đang sử dụng mock responses, bạn cần thay thế bằng API chatbot thực tế.

## Cấu trúc

```
components/Chatbot/
  └── ChatbotWidget.vue       # UI component
composables/
  └── useChatbot.ts           # State management
services/
  └── chatbotService.ts       # API calls (cần update)
types/
  └── chatbot.ts              # TypeScript types
```

## Tích hợp API Chatbot

### 1. Cấu hình API Endpoint

Thêm vào `.env`:
```env
NUXT_PUBLIC_CHATBOT_API_URL=https://your-chatbot-api.com/chat
```

Hoặc trong `nuxt.config.ts`:
```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      chatbotApiUrl: process.env.NUXT_PUBLIC_CHATBOT_API_URL || 'http://localhost:3001/api/chat'
    }
  }
})
```

### 2. Update Service

Mở file `services/chatbotService.ts` và thay thế mock implementation:

#### Ví dụ API Call đơn giản:

```typescript
async sendMessage(message: string, conversationHistory?: ChatMessage[]): Promise<string> {
  const config = useRuntimeConfig()
  const token = useCookie('auth_token').value
  
  const response = await $fetch<{ reply: string }>(config.public.chatbotApiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: {
      message,
      history: conversationHistory?.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    }
  })
  
  return response.reply
}
```

#### Ví dụ với Streaming Response (nếu API hỗ trợ):

```typescript
async sendMessage(message: string): Promise<string> {
  const config = useRuntimeConfig()
  
  const response = await fetch(config.public.chatbotApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
  })
  
  const reader = response.body?.getReader()
  const decoder = new TextDecoder()
  let result = ''
  
  while (true) {
    const { done, value } = await reader!.read()
    if (done) break
    result += decoder.decode(value)
  }
  
  return result
}
```

### 3. API Request Format

Chatbot service gửi request với format:

```json
{
  "message": "Tôi muốn xem đơn hàng",
  "history": [
    {
      "role": "user",
      "content": "Xin chào"
    },
    {
      "role": "assistant", 
      "content": "Xin chào! Tôi có thể giúp gì cho bạn?"
    }
  ]
}
```

### 4. API Response Format

API của bạn cần trả về:

```json
{
  "reply": "Hiện tại bạn có 5 đơn hàng đang chờ xử lý..."
}
```

Hoặc nếu có thêm metadata:

```json
{
  "reply": "Hiện tại bạn có 5 đơn hàng...",
  "conversationId": "conv_123",
  "suggestions": ["Xem chi tiết", "Cập nhật trạng thái"]
}
```

## Tùy chỉnh

### Thay đổi Welcome Message

Trong `composables/useChatbot.ts`, function `initialize()`:

```typescript
const initialize = () => {
  if (messages.value.length === 0) {
    messages.value.push({
      id: generateId(),
      role: 'assistant',
      content: 'Tin nhắn chào mừng của bạn ở đây',
      timestamp: new Date()
    })
  }
}
```

### Thêm Context cho Chatbot

Nếu muốn gửi thêm context (user info, current page, etc.):

```typescript
// services/chatbotService.ts
async sendMessage(message: string, conversationHistory?: ChatMessage[]): Promise<string> {
  const user = useAuthStore().user // example
  const currentRoute = useRoute()
  
  const response = await $fetch(config.public.chatbotApiUrl, {
    method: 'POST',
    body: {
      message,
      history: conversationHistory,
      context: {
        userId: user?.id,
        userRole: user?.role,
        currentPage: currentRoute.path
      }
    }
  })
  
  return response.reply
}
```

### Styling

Chatbot sử dụng Bootstrap classes và custom CSS. Để thay đổi màu sắc:

```css
/* components/Chatbot/ChatbotWidget.vue */
.chat-header {
  background: #your-color !important;
}

.message-user {
  background: #your-color !important;
}

.chat-button {
  background: #your-color !important;
}
```

## Features

✅ Floating button ở góc phải màn hình
✅ Popup chat window với animation
✅ Hiển thị lịch sử chat
✅ Typing indicator khi bot đang trả lời
✅ Auto scroll to bottom
✅ Clear conversation
✅ Responsive design
✅ Loading states
✅ Error handling

## Testing

1. Vào trang admin bất kỳ
2. Click vào nút chat ở góc phải dưới
3. Gửi tin nhắn test
4. Kiểm tra Network tab để xem API calls

## Error Handling

Service đã có error handling sẵn. Khi API lỗi:

```typescript
try {
  const response = await chatbotService.sendMessage(message)
} catch (err) {
  // Error sẽ được catch và hiển thị trong UI
  console.error('Chatbot error:', err)
}
```

## Notes

- Chatbot chỉ hiển thị trong admin layout
- Conversation history được lưu trong memory (mất khi refresh)
- Nếu cần persist history, có thể lưu vào localStorage hoặc backend
- Mock responses hiện tại có delay 1s để simulate API call
