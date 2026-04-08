// stores/feGlobalStore.js
import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { usePaginationStore } from "@/stores/paginationStore";
import { useUiStore } from "@/stores/uiStore";
import { useRuntimeConfig, useRequestHeaders } from "#imports";

export const useFeGlobalStore = defineStore("frontend/globals", () => {
    const config = useRuntimeConfig();
    const auth = useAuthStore();
    const pagination = usePaginationStore();
    const ui = useUiStore();

    const items = ref([]);
    const error = ref(null);
    const apiEndpoint = ref(`${config.public.apiBaseUrl}/not-ok`);

    /**
     * Build common headers for authenticated requests.
     * Uses cookie-based auth (credentials: 'include') matching authStore pattern.
     * On SSR, forwards the incoming cookie header so the API sees the session.
     */
    const buildHeaders = (extra = {}) => {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...extra,
      };

      // Forward cookies on server-side rendering
      if (import.meta.server) {
        const reqHeaders = useRequestHeaders(["cookie"]);
        if (reqHeaders.cookie) {
          headers.cookie = reqHeaders.cookie;
        }
      }

      return headers;
    };

    const setApiUrl = (apiPath) => {
      apiEndpoint.value = `${config.public.apiBaseUrl}/${apiPath}`;
    };

    const fetchItems = async (params = {}) => {
      ui.isLoading = true;
      try {
        const query = new URLSearchParams({
          page: pagination.page,
          limit: pagination.limit,
          ...params,
        }).toString();

        const res = await fetch(`${apiEndpoint.value}?${query}`, {
          credentials: "include",
          headers: buildHeaders(),
        });

        if (res.status === 401) {
          auth.logout();
          return null;
        }
        if (!res.ok) throw new Error("Fetch failed");

        const json = await res.json();
        items.value = json.data;
        if (json.pagination) {
          pagination.setPagination(json.pagination);
        }
        return json;
      } catch (e) {
        error.value = e.message;
        return null;
      } finally {
        ui.isLoading = false;
      }
    };

    const createItem = async (payload) => {
      ui.isCreating = true;
      try {
        const res = await fetch(apiEndpoint.value, {
          method: "POST",
          credentials: "include",
          headers: buildHeaders(),
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Create failed");
        return await res.json();
      } finally {
        ui.isCreating = false;
      }
    };

    const updateItem = async (id, payload) => {
      ui.isUpdating = true;
      try {
        const res = await fetch(`${apiEndpoint.value}/${id}`, {
          method: "PUT",
          credentials: "include",
          headers: buildHeaders(),
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Update failed");
        return await res.json();
      } finally {
        ui.isUpdating = false;
      }
    };

    const deleteItem = async (id) => {
      ui.isDeleting = true;
      try {
        const res = await fetch(`${apiEndpoint.value}/${id}`, {
          method: "DELETE",
          credentials: "include",
          headers: buildHeaders(),
        });

        if (!res.ok) throw new Error("Delete failed");
        return await res.json();
      } finally {
        ui.isDeleting = false;
      }
    };

    const reset = () => {
      items.value = [];
      error.value = null;
    };

    return {
      items,
      error,
      apiEndpoint,
      setApiUrl,
      fetchItems,
      createItem,
      updateItem,
      deleteItem,
      reset,
    };
});
