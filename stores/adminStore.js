// stores/adminStore.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useFeGlobalStore } from "@/stores/feGlobalStore";
import { usePaginationStore } from "@/stores/paginationStore";
import { useUiStore } from "@/stores/uiStore";
import { useRuntimeConfig, useRequestHeaders } from "#imports";
import { useAuthStore } from "@/stores/authStore";

export const useAdminStore = defineStore("admin/globals", () => {
  const config = useRuntimeConfig();
  const auth = useAuthStore();
  const pagination = usePaginationStore();
  const ui = useUiStore();

  /* ── State ── */
  const adminUser = ref(null);
  const adminPermissions = ref([]);
  const adminReady = ref(false);

  /* ── Computed ── */
  const isAdmin = computed(
    () => !!adminUser.value && ["admin", "manager"].includes(adminUser.value.role ?? ""),
  );

  /* ── Internal Helpers ── */

  const buildAdminUrl = (adminPath) =>
    `${config.public.apiBaseUrl}/admin/${adminPath}`;

  const buildHeaders = (extra = {}) => {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...extra,
    };
    if (import.meta.server) {
      const reqHeaders = useRequestHeaders(["cookie"]);
      if (reqHeaders.cookie) {
        headers.cookie = reqHeaders.cookie;
      }
    }
    return headers;
  };

  /**
   * Parse API error from response.
   */
  const parseError = async (res) => {
    let errorBody = {};
    try {
      errorBody = await res.json();
    } catch (_) {}
    const errMsg =
      errorBody?.message ||
      errorBody?.error?.message ||
      errorBody?.error?.code ||
      `HTTP ${res.status}`;
    const err = new Error(errMsg);
    err.data = errorBody;
    return err;
  };

  /* ── CRUD Methods ── */

  /**
   * GET paginated list.
   * Handles admin API `meta` pagination format.
   * @param {string} adminPath – endpoint after "admin/", e.g. "products"
   * @param {object} params   – query params (search, status, per_page, ...)
   */
  const fetchList = async (adminPath, params = {}) => {
    ui.isLoading = true;
    try {
      const query = new URLSearchParams(
        Object.fromEntries(
          Object.entries({
            page: pagination.page,
            per_page: pagination.limit,
            ...params,
          }).filter(([, v]) => v !== undefined && v !== null && v !== ""),
        ),
      ).toString();

      const res = await fetch(`${buildAdminUrl(adminPath)}?${query}`, {
        credentials: "include",
        headers: buildHeaders(),
      });

      if (res.status === 401) {
        auth.logout();
        return null;
      }

      if (!res.ok) throw await parseError(res);

      const json = await res.json();

      // Admin API returns { success, data, meta }
      if (json.meta) {
        pagination.setPagination({
          total: json.meta.total,
          pages: json.meta.last_page,
        });
      }

      return json;
    } catch (e) {
      console.error(`[adminStore] fetchList(${adminPath}):`, e.message);
      return null;
    } finally {
      ui.isLoading = false;
    }
  };

  /**
   * GET single item or endpoint returning an object.
   * @param {string} adminPath – e.g. "products/5" or "dashboard"
   * @param {object} params
   */
  const fetchOne = async (adminPath, params = {}) => {
    ui.isLoading = true;
    try {
      const query = new URLSearchParams(
        Object.fromEntries(
          Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""),
        ),
      ).toString();
      const url = query ? `${buildAdminUrl(adminPath)}?${query}` : buildAdminUrl(adminPath);

      const res = await fetch(url, {
        credentials: "include",
        headers: buildHeaders(),
      });

      if (res.status === 401) {
        auth.logout();
        return null;
      }

      if (!res.ok) throw await parseError(res);

      return await res.json();
    } catch (e) {
      console.error(`[adminStore] fetchOne(${adminPath}):`, e.message);
      return null;
    } finally {
      ui.isLoading = false;
    }
  };

  /**
   * POST create.
   */
  const create = async (adminPath, payload) => {
    ui.isCreating = true;
    try {
      const res = await fetch(buildAdminUrl(adminPath), {
        method: "POST",
        credentials: "include",
        headers: buildHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw await parseError(res);

      return await res.json();
    } catch (e) {
      console.error(`[adminStore] create(${adminPath}):`, e.message);
      throw e;
    } finally {
      ui.isCreating = false;
    }
  };

  /**
   * PUT update.
   */
  const update = async (adminPath, id, payload) => {
    ui.isUpdating = true;
    try {
      const res = await fetch(`${buildAdminUrl(adminPath)}/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: buildHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw await parseError(res);

      return await res.json();
    } catch (e) {
      console.error(`[adminStore] update(${adminPath}/${id}):`, e.message);
      throw e;
    } finally {
      ui.isUpdating = false;
    }
  };

  /**
   * PATCH partial update.
   */
  const patch = async (adminPath, id, payload) => {
    ui.isUpdating = true;
    try {
      const url = id != null
        ? `${buildAdminUrl(adminPath)}/${id}`
        : buildAdminUrl(adminPath);

      const res = await fetch(url, {
        method: "PATCH",
        credentials: "include",
        headers: buildHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw await parseError(res);

      return await res.json();
    } catch (e) {
      console.error(`[adminStore] patch(${adminPath}):`, e.message);
      throw e;
    } finally {
      ui.isUpdating = false;
    }
  };

  /**
   * DELETE remove.
   */
  const remove = async (adminPath, id) => {
    ui.isDeleting = true;
    try {
      const url = id != null
        ? `${buildAdminUrl(adminPath)}/${id}`
        : buildAdminUrl(adminPath);

      const res = await fetch(url, {
        method: "DELETE",
        credentials: "include",
        headers: buildHeaders(),
      });

      if (!res.ok) throw await parseError(res);

      return await res.json();
    } catch (e) {
      console.error(`[adminStore] remove(${adminPath}):`, e.message);
      throw e;
    } finally {
      ui.isDeleting = false;
    }
  };

  /* ── Admin Auth ── */

  /**
   * GET /api/v1/admin/me – verify admin session.
   */
  const fetchAdminMe = async () => {
    try {
      const res = await fetch(buildAdminUrl("me"), {
        credentials: "include",
        headers: buildHeaders(),
      });

      if (!res.ok) {
        adminReady.value = true;
        return null;
      }

      const json = await res.json();
      if (json?.data) {
        adminUser.value = json.data;
        adminPermissions.value = json.data.permissions || [];
      }
      adminReady.value = true;
      return json;
    } catch (e) {
      adminReady.value = true;
      return null;
    }
  };

  /**
   * Check admin permission.
   * @param {string} permission – e.g. "update_product"
   */
  const hasPermission = (permission) => {
    return adminPermissions.value.includes(permission);
  };

  /**
   * Reset state on logout.
   */
  const reset = () => {
    adminUser.value = null;
    adminPermissions.value = [];
    adminReady.value = false;
  };

  return {
    // State
    adminUser,
    adminPermissions,
    adminReady,

    // Computed
    isAdmin,

    // CRUD
    fetchList,
    fetchOne,
    create,
    update,
    patch,
    remove,

    // Auth
    fetchAdminMe,
    hasPermission,
    reset,
  };
});
