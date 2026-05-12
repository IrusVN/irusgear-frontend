import { ref } from "vue";
import { toast } from "vue-sonner";
import { defineStore } from "pinia";
import { useRuntimeConfig, useRequestHeaders } from "#imports";
import { useAuthStore } from "@/stores/authStore";
import { registerStore } from "@/utils/storeRegistry";

export const useUserInfoStore = defineStore("userInfo", () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const socialLinks = ref([]);
  const isLoadingLinks = ref(false);

  const apiFetch = async (endpoint, options = {}) => {
    const headers = import.meta.server ? useRequestHeaders(["cookie"]) : {};
    return await $fetch(`${config.public.apiBaseUrl}/${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...headers,
        ...(options.headers || {}),
      },
    });
  };

  const updateProfile = async (payload) => {
    try {
      const res = await apiFetch("profile", {
        method: "PUT",
        body: payload,
      });
      if (res?.success !== false) {
        // Update authStore user
        if (authStore.user && res?.data) {
          Object.assign(authStore.user, res.data);
        }
        toast.success(res?.message || "Cập nhật thông tin thành công");
        return { success: true, data: res?.data };
      }
      throw new Error(res?.message || "Cập nhật thất bại");
    } catch (e) {
      toast.error(e?.data?.message || e.message || "Cập nhật thất bại");
      return { success: false, error: e };
    }
  };

  const changePassword = async (payload) => {
    try {
      const res = await apiFetch("password/change", {
        method: "POST",
        body: payload,
      });
      if (res?.success !== false) {
        toast.success(res?.message || "Đổi mật khẩu thành công");
        return { success: true };
      }
      throw new Error(res?.message || "Đổi mật khẩu thất bại");
    } catch (e) {
      toast.error(e?.data?.message || e.message || "Đổi mật khẩu thất bại");
      return { success: false, error: e };
    }
  };

  const fetchSocialLinks = async () => {
    if (socialLinks.value.length > 0) return socialLinks.value;
    isLoadingLinks.value = true;
    try {
      const res = await apiFetch("social-links");
      socialLinks.value = (res?.data?.links || []).map((link) => ({
        provider: link.provider,
        providerName: link.provider_name,
        providerIconUrl: link.provider_icon_url,
        isLinked: link.is_linked,
        linkedAt: link.linked_at,
        linkUrl: link.link_url,
        unlinkUrl: link.unlink_url,
      }));
      return socialLinks.value;
    } catch (e) {
      socialLinks.value = [];
      return [];
    } finally {
      isLoadingLinks.value = false;
    }
  };

  const reset = () => {
    socialLinks.value = [];
    isLoadingLinks.value = false;
  };

  registerStore({ reset });

  return {
    socialLinks,
    isLoadingLinks,
    updateProfile,
    changePassword,
    fetchSocialLinks,
    reset,
  };
});
