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

        if (!res.ok) {
          let errorBody = { message: "Lỗi không xác định" };
          try {
            errorBody = await res.json();
          } catch (_) {}
          const err = new Error(errorBody?.message || `HTTP ${res.status}`);
          err.data = errorBody;
          throw err;
        }

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

    const fetchItem = async (params = {}, { signal } = {}) => {
      ui.isLoading = true;
      try {
        const query = new URLSearchParams(params).toString();
        const url = query ? `${apiEndpoint.value}?${query}` : apiEndpoint.value;

        const res = await fetch(url, {
          credentials: "include",
          headers: buildHeaders(),
          signal,
        });

        if (res.status === 401) {
          auth.logout();
          return null;
        }

        if (!res.ok) {
          let errorBody = { message: "Lỗi không xác định" };
          try {
            errorBody = await res.json();
          } catch (_) {}
          const err = new Error(errorBody?.message || `HTTP ${res.status}`);
          err.data = errorBody;
          throw err;
        }

        return await res.json();
      } catch (e) {
        if (e.name === "AbortError") {
          return null;
        }
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

        if (!res.ok) {
          let errorBody = { message: "Lỗi không xác định" };
          try {
            errorBody = await res.json();
          } catch (_) {}
          const err = new Error(errorBody?.message || `HTTP ${res.status}`);
          err.data = errorBody;
          throw err;
        }
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

        if (!res.ok) {
          let errorBody = { message: "Lỗi không xác định" };
          try {
            errorBody = await res.json();
          } catch (_) {}
          const err = new Error(errorBody?.message || `HTTP ${res.status}`);
          err.data = errorBody;
          throw err;
        }
        return await res.json();
      } finally {
        ui.isUpdating = false;
      }
    };

    const putItem = async (subPath, payload = null) => {
      ui.isUpdating = true;
      try {
        const url = payload === null
          ? `${config.public.apiBaseUrl}/${subPath}`
          : `${config.public.apiBaseUrl}/${subPath}`;
        const res = await fetch(url, {
          method: "PUT",
          credentials: "include",
          headers: buildHeaders(),
          body: payload !== null ? JSON.stringify(payload) : undefined,
        });

        if (!res.ok) {
          let errorBody = { message: "Lỗi không xác định" };
          try {
            errorBody = await res.json();
          } catch (_) {}
          const err = new Error(errorBody?.message || `HTTP ${res.status}`);
          err.data = errorBody;
          throw err;
        }
        return await res.json();
      } finally {
        ui.isUpdating = false;
      }
    };

    const patchItem = async (idOrPayload, payload) => {
      ui.isUpdating = true;
      try {
        const hasId = payload !== undefined;
        const id = hasId ? idOrPayload : null;
        const requestPayload = hasId ? payload : idOrPayload;
        const url = id == null ? apiEndpoint.value : `${apiEndpoint.value}/${id}`;

        const res = await fetch(url, {
          method: "PATCH",
          credentials: "include",
          headers: buildHeaders(),
          body: JSON.stringify(requestPayload),
        });

        if (!res.ok) {
          let errorBody = { message: "Lỗi không xác định" };
          try {
            errorBody = await res.json();
          } catch (_) {}
          const err = new Error(errorBody?.message || `HTTP ${res.status}`);
          err.data = errorBody;
          throw err;
        }
        return await res.json();
      } finally {
        ui.isUpdating = false;
      }
    };

    const deleteItem = async (id = null) => {
      ui.isDeleting = true;
      try {
        const url = id == null ? apiEndpoint.value : `${apiEndpoint.value}/${id}`;

        const res = await fetch(url, {
          method: "DELETE",
          credentials: "include",
          headers: buildHeaders(),
        });

        if (!res.ok) {
          let errorBody = { message: "Lỗi không xác định" };
          try {
            errorBody = await res.json();
          } catch (_) {}
          const err = new Error(errorBody?.message || `HTTP ${res.status}`);
          err.data = errorBody;
          throw err;
        }
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
      fetchItem,
      createItem,
      updateItem,
      putItem,
      patchItem,
      deleteItem,
      reset,
    };
});
