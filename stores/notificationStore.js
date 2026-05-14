import { ref } from "vue";
import { defineStore } from "pinia";
import { useFeGlobalStore } from "@/stores/feGlobalStore";
import { registerStore } from "@/utils/storeRegistry";

export const useNotificationStore = defineStore("notification", () => {
  const feGlobalStore = useFeGlobalStore();

  const notifications = ref([]);
  const pagination = ref({ current_page: 1, total: 0, per_page: 20, last_page: 1 });
  const unreadCount = ref(0);
  const isLoading = ref(false);
  const hydrated = ref(false);

  const normalizeNotification = (raw) => ({
    id: raw.id,
    type: raw.type,
    icon: raw.icon,
    title: raw.title,
    text: raw.text,
    actionUrl: raw.actionUrl,
    isRead: raw.isRead,
    readAt: raw.readAt,
    createdAt: raw.createdAt,
    time: raw.time,
  });

  const fetchNotifications = async ({ page = 1, limit = 20 } = {}) => {
    isLoading.value = true;
    try {
      feGlobalStore.setApiUrl("notifications");
      const params = { page, limit };
      const res = await feGlobalStore.fetchItem(params);
      if (res?.success !== false) {
        notifications.value = (res?.data || []).map(normalizeNotification);
        if (res?.pagination) {
          pagination.value = {
            current_page: res.pagination.current_page,
            total: res.pagination.total_items,
            per_page: res.pagination.items_per_page,
            last_page: res.pagination.total_pages,
          };
        }
        hydrated.value = true;
      }
      return notifications.value;
    } catch (e) {
      notifications.value = [];
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  const fetchUnreadCount = async () => {
    try {
      feGlobalStore.setApiUrl("notifications/unread-count");
      const res = await feGlobalStore.fetchItem({});
      if (res?.success !== false) {
        unreadCount.value = res?.data?.count ?? 0;
      }
    } catch (e) {
      unreadCount.value = 0;
    }
  };

  const markAsRead = async (id) => {
    try {
      feGlobalStore.setApiUrl("notifications");
      const res = await feGlobalStore.patchItem(`${id}/read`, {});
      if (res?.success !== false) {
        const idx = notifications.value.findIndex((n) => n.id === id);
        if (idx !== -1) {
          notifications.value[idx] = normalizeNotification(res.data);
        }
        if (unreadCount.value > 0) {
          unreadCount.value--;
        }
      }
      return true;
    } catch (e) {
      return false;
    }
  };

  const markAllAsRead = async () => {
    try {
      feGlobalStore.setApiUrl("notifications");
      const res = await feGlobalStore.patchItem("read-all", {});
      if (res?.success !== false) {
        notifications.value = notifications.value.map((n) => ({
          ...n,
          isRead: true,
          readAt: new Date().toISOString(),
        }));
        unreadCount.value = 0;
      }
      return true;
    } catch (e) {
      return false;
    }
  };

  const removeNotification = async (id) => {
    try {
      feGlobalStore.setApiUrl("notifications");
      const res = await feGlobalStore.deleteItem(id);
      if (res?.success !== false) {
        const wasUnread = notifications.value.find((n) => n.id === id && !n.isRead);
        notifications.value = notifications.value.filter((n) => n.id !== id);
        if (wasUnread && unreadCount.value > 0) {
          unreadCount.value--;
        }
      }
      return true;
    } catch (e) {
      return false;
    }
  };

  const reset = () => {
    notifications.value = [];
    pagination.value = { current_page: 1, total: 0, per_page: 20, last_page: 1 };
    unreadCount.value = 0;
    isLoading.value = false;
    hydrated.value = false;
  };

  registerStore({ reset });

  return {
    notifications,
    pagination,
    unreadCount,
    isLoading,
    hydrated,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    reset,
  };
});
