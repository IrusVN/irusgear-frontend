// stores/authStore.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRuntimeConfig } from "#imports";
import { navigateTo } from "#app";
import { resetAllStores } from "@/utils/storeRegistry";

export const useAuthStore = defineStore("auth", () => {
  const config = useRuntimeConfig();

  const user = ref(null);
  const permissions = ref([]);
  const loading = ref(false);

  const isAuthenticated = computed(() => !!user.value);

  const login = async (credentials) => {
    loading.value = true;

    try {
      const response = await fetch(`${config.public.apiBaseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      user.value = null;
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const fetchUser = async () => {
    try {
      const data = await fetch(`${config.public.apiBaseUrl}/me`, {
        credentials: "include",
      }).then((r) => {
        if (!r.ok) throw new Error("Unauthenticated");
        return r.json();
      });

      user.value = data.user ?? data;
      permissions.value = data.permissions || [];
    } catch {
      user.value = null;
      permissions.value = [];
    }
  };

  const logout = async () => {
    try {
      await fetch(`${config.public.apiBaseUrl}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      user.value = null;
      permissions.value = [];
      resetAllStores();
      navigateTo("/auth/login");
    }
  };

  return {
    // state
    user,
    permissions,
    loading,

    // getters
    isAuthenticated,

    // actions
    login,
    fetchUser,
    logout,
  };
});
