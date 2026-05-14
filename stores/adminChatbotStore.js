import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRuntimeConfig } from "#imports";
import { useAuthStore } from "~/stores/authStore";

export const useAdminChatbotStore = defineStore("adminChatbot", () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  // --- State ---
  const messages = ref([]);
  const isOpen = ref(false);
  const isLoading = ref(false);
  const hasNewMessage = ref(false);

  // --- Getters ---
  const chatHistory = computed(() =>
    messages.value
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role, content: m.content }))
  );

  // --- Actions ---
  const initChat = () => {
    if (messages.value.length === 0) {
      messages.value.push({
        role: "assistant",
        content: "Xin chào Admin! 👋 Tôi là trợ lý AI quản trị của **IRUS GEAR**. Tôi có thể giúp bạn tra cứu doanh thu, đơn hàng, sản phẩm và các thống kê hệ thống. Bạn cần hỗ trợ gì?",
        timestamp: new Date(),
      });
    }
  };

  const toggleChat = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
      hasNewMessage.value = false;
      initChat();
    }
  };

  const openChat = () => {
    isOpen.value = true;
    hasNewMessage.value = false;
    initChat();
  };

  const closeChat = () => {
    isOpen.value = false;
  };

  const sendMessage = async (question) => {
    if (!question.trim() || isLoading.value) return;

    const trimmedQuestion = question.trim();

    // Snapshot history BEFORE adding user message
    const historySnapshot = chatHistory.value.slice();

    messages.value.push({
      role: "user",
      content: trimmedQuestion,
      timestamp: new Date(),
    });

    isLoading.value = true;

    const aiApiUrl = config.public.aiApiUrl || "https://ai-user-6f5c.onrender.com/api/v1";
    const token = useCookie("auth_token").value;

    const body = {
      question: trimmedQuestion,
      chat_history: historySnapshot,
    };

    if (authStore.isAuthenticated && authStore.user?.id) {
      body.user_id = authStore.user.id;
    }

    const callApi = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);
      try {
        const response = await $fetch(`${aiApiUrl}/ai-admin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body,
          signal: controller.signal,
        });
        return response;
      } finally {
        clearTimeout(timeoutId);
      }
    };

    try {
      let response;
      try {
        response = await callApi();
      } catch (firstError) {
        const status = firstError?.response?.status || firstError?.status || firstError?.statusCode;
        if (status === 500 || status === 502 || status === 503) {
          console.warn("Admin Chatbot API: Retrying...");
          response = await callApi();
        } else {
          throw firstError;
        }
      }

      // Admin bot trả về field "recommendation" hoặc "response"
      let botContent =
        response.recommendation ||
        response.response ||
        response.answer ||
        "Xin lỗi, tôi chưa có câu trả lời phù hợp. Bạn thử hỏi lại nhé!";

      if (!isOpen.value) {
        hasNewMessage.value = true;
      }

      messages.value.push({
        role: "assistant",
        content: botContent,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Admin Chatbot API error:", error);

      let errorMsg = "Xin lỗi, mình đang gặp sự cố kết nối. Bạn vui lòng thử lại sau nhé! 🙏";
      if (error.name === "AbortError") {
        errorMsg = "Yêu cầu mất quá lâu để xử lý. Server AI có thể đang khởi động lại, bạn thử gửi lại sau 30 giây nhé! ⏳";
      }

      messages.value.push({
        role: "assistant",
        content: errorMsg,
        isError: true,
        timestamp: new Date(),
      });
    } finally {
      isLoading.value = false;
    }
  };

  const clearChat = () => {
    messages.value = [];
    initChat();
  };

  return {
    messages,
    isOpen,
    isLoading,
    hasNewMessage,
    chatHistory,
    toggleChat,
    openChat,
    closeChat,
    sendMessage,
    clearChat,
    initChat,
  };
});
