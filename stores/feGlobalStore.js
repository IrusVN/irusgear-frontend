// stores/feGlobalStore.js
import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { usePaginationStore } from "@/stores/paginationStore";
import { useUiStore } from "@/stores/uiStore";
import { useRuntimeConfig } from "#imports";

export const useFeGlobalStore = defineStore("frontend/globals", () => {
    const config = useRuntimeConfig();
    const auth = useAuthStore();
    const pagination = usePaginationStore();
    const ui = useUiStore();

    const items = ref([]);
    const error = ref(null);
    const apiEndpoint = ref(`${config.public.apiBaseUrl}/not-ok`);
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
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        if (res.status === 401) auth.logout();
        if (!res.ok) throw new Error("Fetch failed");

        const json = await res.json();
        items.value = json.data;
        pagination.setPagination(json.pagination);
      } catch (e) {
        error.value = e.message;
      } finally {
        ui.isLoading = false;
      }
    };

    const createItem = async (payload) => {
      ui.isCreating = true;
      try {
        const res = await fetch(apiEndpoint.value, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
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
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
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
