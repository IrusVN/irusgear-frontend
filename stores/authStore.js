import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRuntimeConfig, navigateTo, useRequestHeaders } from "#imports";
import { resetAllStores } from "@/utils/storeRegistry";
import { useGlobalToast } from "@/composables/useGlobalToast"; // Import Toast

export const useAuthStore = defineStore("auth", () => {
  const config = useRuntimeConfig();
  const user = ref(null);
  const permissions = ref([]);
  const loading = ref(false);

  const verifyEmail = ref("");
  const otpCode = ref("");
  const error = ref(null);

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
      const headers = useRequestHeaders(["cookie"]);
      const data = await apiFetch("/me", {
        headers: headers,
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

  const setVerifyEmail = (email) => {
    verifyEmail.value = email;
    otpCode.value = "";
    error.value = null;
  };

  const verifyOtp = async () => {
    loading.value = true;
    error.value = null;

    try {
      const data = await apiFetch("/verify-email", {
        method: "POST",
        body: {
          email: verifyEmail.value,
          otp: otpCode.value,
        },
      });
      return { status: true, data };

    } catch (err) {
      const msg = err.message;
      error.value = msg;
      return { status: false, error: msg };
    } finally {
      loading.value = false;
    }
  };

  const resendOtp = async () => {
    const toast = useGlobalToast();
    try {
      await apiFetch("/resend-otp", {
        method: "POST",
        body: { email: verifyEmail.value },
      });
      
      toast.success("Đã gửi lại mã xác thực!");
      return true;
    } catch (err) {
      const msg = error.message;
      return false;
    }
  };

  return {
    user,
    permissions,
    loading,
    isAuthenticated,

    verifyEmail,
    otpCode,
    error,

    login,
    fetchUser,
    logout,
    register,

    setVerifyEmail,
    verifyOtp,
    resendOtp,
  };
});