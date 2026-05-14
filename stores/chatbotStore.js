import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRuntimeConfig, useRouter, useRoute } from "#imports";
import { useAuthStore } from "~/stores/authStore";
import { useCartStore } from "~/stores/cartStore";
import { useProductStore } from "~/stores/productStore";

export const useChatbotStore = defineStore("chatbot", () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  const router = useRouter();
  const route = useRoute();

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
        content:
          "Xin chào bạn! 👋 Mình là trợ lý AI của **IRUS GEAR**. Mình có thể giúp bạn tìm sản phẩm phù hợp, tư vấn cấu hình, so sánh giá cả hoặc hỗ trợ đặt hàng. Bạn cần mình giúp gì nào? 😊",
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

  // Fetch product details by IDs from backend
  const fetchProductsByIds = async (ids) => {
    if (!ids || !ids.length) return [];
    try {
      const res = await $fetch(`${config.public.apiBaseUrl}/products`, {
        params: { ids: ids.join(",") },
      });
      const data = res?.data || [];
      // Manually filter because the backend API might ignore the `ids` parameter
      const filteredProducts = data.filter(p => ids.includes(p.id));
      return filteredProducts;
    } catch (e) {
      console.error("Failed to fetch products:", e);
      return [];
    }
  };

  const sendMessage = async (question) => {
    if (!question.trim() || isLoading.value) return;

    const trimmedQuestion = question.trim();

    // Snapshot chat history BEFORE adding the new user message
    const historySnapshot = chatHistory.value.slice();

    // Add user message to UI
    messages.value.push({
      role: "user",
      content: trimmedQuestion,
      timestamp: new Date(),
    });

    isLoading.value = true;

    const aiApiUrl = config.public.aiApiUrl || "https://ai-user-6f5c.onrender.com/api/v1";

    const body = {
      question: trimmedQuestion,
      chat_history: historySnapshot, // History before this message
    };

    // If user is logged in, send user_id
    if (authStore.isAuthenticated && authStore.user?.id) {
      body.user_id = authStore.user.id;
    }

    // If user is on a product page, send the current product ID as context
    if (route.path.startsWith("/products/")) {
      const productStore = useProductStore();
      const currentProductId = productStore.productDetail?.id;
      console.log("[Chatbot] product page detected, productDetail:", productStore.productDetail?.id, "route:", route.path);
      if (currentProductId) {
        body.current_product_id = currentProductId;
        console.log("[Chatbot] sending current_product_id:", currentProductId);
      } else {
        console.warn("[Chatbot] on product page but productDetail.id is missing");
      }
    }

    // Helper: single API call with timeout
    const callApi = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

      try {
        const response = await $fetch(`${aiApiUrl}/ai-consultant`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
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
        // Retry once on server error (500/502/503) — do NOT push another user message
        const status = firstError?.response?.status || firstError?.status || firstError?.statusCode;
        if (status === 500 || status === 502 || status === 503) {
          console.warn("Chatbot API: Retrying after server error...");
          response = await callApi();
        } else {
          throw firstError;
        }
      }

      // Add bot response
      let botContent = response.recommendation || "Xin lỗi, mình chưa có câu trả lời phù hợp. Bạn thử hỏi lại nhé!";

      // Detect if backend leaked a raw JSON tool call string instead of proper recommendation
      if (typeof botContent === "string" && botContent.trim().startsWith("{") && botContent.includes('"type":') && botContent.includes("function")) {
        console.error("AI returned raw tool call:", botContent);
         botContent = "Xin lỗi, mình gặp chút khó khăn trong việc tìm kiếm dữ liệu với yêu cầu này. Bạn có thể thử thay đổi câu hỏi một chút xíu hoặc chỉ định rõ tên sản phẩm được không? 😢";
      }

      // If order was created, append order info
      if (response.order && response.order.success) {
        botContent += `\n\n🎉 **Đơn hàng đã được tạo thành công!**\n- Mã đơn: #${response.order.order_id}\n- Số sản phẩm: ${response.order.item_count}\n- Tổng tiền: ${new Intl.NumberFormat("vi-VN").format(response.order.total)}đ`;
      } else if (response.order && !response.order.success) {
        botContent += `\n\n⚠️ Không thể tạo đơn hàng: ${response.order.error || "Đã có lỗi xảy ra."}`;
      }

      const rawProductIds = response.product_ids || [];
      const rawProducts = response.products || [];
      
      // Only show product cards when AI specifically recommends (≤ 10 products)
      // If the list is too long, it's a general listing — skip cards
      const shouldShowProducts = rawProductIds.length > 0 && rawProductIds.length <= 10;
      const productIds = shouldShowProducts ? rawProductIds.slice(0, 5) : [];
      
      let displayProducts = [];
      if (shouldShowProducts && rawProducts.length > 0) {
        displayProducts = rawProducts.slice(0, 5).map(p => ({
          ...p,
          image: p.image_url || p.image // Map image_url for ChatbotWidget
        }));
      }

      const msgIndex = messages.value.length;

      messages.value.push({
        role: "assistant",
        content: botContent,
        productIds,
        products: displayProducts,
        productsLoading: displayProducts.length === 0 && productIds.length > 0,
        timestamp: new Date(),
      });

      if (!isOpen.value) {
        hasNewMessage.value = true;
      }

      // Execute UI actions from AI (REDIRECT, ADD_TO_CART, etc.)
      const uiActions = response.ui_actions || [];
      if (uiActions.length > 0) {
        executeUiActions(uiActions);
      }

      // Fetch product details asynchronously (fallback if AI didn't return hydrated products)
      if (displayProducts.length === 0 && productIds.length > 0) {
        fetchProductsByIds(productIds).then((products) => {
          const msg = messages.value[msgIndex];
          if (msg) {
            msg.products = products.slice(0, 5); // Max 5 cards
            msg.productsLoading = false;
          }
        });
      }
    } catch (error) {
      console.error("Chatbot API error:", error);

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

  // Execute UI action commands sent by the AI backend
  const executeUiActions = async (actions) => {
    const cartStore = useCartStore();

    for (const action of actions) {
      try {
        if (action.type === "REDIRECT") {
          const url = action.url || action.path;
          if (url) {
            // Internal URLs (same origin): navigate in current tab
            // External URLs: open in new tab
            const isExternal = url.startsWith("http://") || url.startsWith("https://");
            if (isExternal) {
              const a = document.createElement("a");
              a.href = url;
              a.target = "_blank";
              a.rel = "noopener noreferrer";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            } else {
              await router.push(url);
            }
          }
        } else if (action.type === "ADD_TO_CART") {
          // Add product to cart
          const payload = {
            product_id: Number(action.product_id),
            quantity: Number(action.quantity) || 1,
          };
          if (action.product_variant_id) {
            payload.product_variant_id = Number(action.product_variant_id);
          }
          await cartStore.addItem(payload, { showSheet: true });
        } else {
          console.warn("Chatbot: unknown ui_action type:", action.type);
        }
      } catch (err) {
        console.error("Chatbot: failed to execute ui_action:", action, err);
      }
    }
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
