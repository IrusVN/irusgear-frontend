// stores/authStore.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useCookie, useRuntimeConfig } from "#imports";
import { resetAllStores } from "@/utils/storeRegistry";

const sanitize = (v) =>
  v === undefined || v === null || v === "undefined" || v === "null"
    ? null
    : v;

export const useAuthStore = defineStore("auth", () => {
  const config = useRuntimeConfig();

  const tokenCookie = useCookie("access_token");
  const refreshTokenCookie = useCookie("refresh_token");

  const token = ref(sanitize(tokenCookie.value));
  const refreshToken = ref(sanitize(refreshTokenCookie.value));

  const user = ref(null);
  const permissions = ref([]);

  const isAuthenticated = computed(() => Boolean(token.value));

  const setAuth = (payload) => {
    token.value = payload.access_token;
    refreshToken.value = payload.refresh_token;
    user.value = payload.user;
    permissions.value = payload.permissions || [];
  };

  const logout = () => {
    token.value = null;
    refreshToken.value = null;
    user.value = null;
    permissions.value = [];

    tokenCookie.value = null;
    refreshTokenCookie.value = null;

    resetAllStores();
    navigateTo("/auth/login");
  };

  return {
    token,
    refreshToken,
    user,
    permissions,
    isAuthenticated,
    setAuth,
    logout,
  };
});

