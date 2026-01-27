import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRuntimeConfig, navigateTo, useRequestHeaders } from "#imports";
import { resetAllStores } from "@/utils/storeRegistry";

export const useAuthStore = defineStore("auth", () => {
  const config = useRuntimeConfig();
  const user = ref(null);
  const permissions = ref([]);
  const loading = ref(false);

  const isAuthenticated = computed(() => !!user.value);

  const apiFetch = async (endpoint, options = {}) => {
    return await $fetch(`${config.public.apiBaseUrl}${endpoint}`, {
      ...options,
      credentials: "include", 
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  };

  const fetchUser = async () => {
    try {
      const headers = useRequestHeaders(['cookie']); 
      const data = await apiFetch("/me", {
        headers: headers 
      });
      user.value = data.user ?? data;
      permissions.value = data.permissions || [];
    } catch (error) {
      user.value = null;
      permissions.value = [];
    }
  };

  const login = async (credentials) => {
    loading.value = true;
    try {
      const data = await apiFetch("/login", {
        method: "POST",
        body: credentials,
      });
      if (data.user) {
        user.value = data.user;
        permissions.value = data.permissions || [];
      } else {
        await fetchUser();
      }
      return data;
    } catch (error) {
      user.value = null;
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      await apiFetch("/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      user.value = null;
      permissions.value = [];
      resetAllStores();
      navigateTo("/auth/login");
    }
  };

  const register = async (userData) => {
    loading.value = true;
    try {
      const data = await apiFetch("/register", {
        method: "POST",
        body: userData,
      });
      return data;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };
 
  return {
    user,
    permissions,
    loading,
    isAuthenticated,
    login,
    fetchUser,
    logout,
    register,
  };
});
