import { useAuthStore } from "@/stores/authStore";
import { ADMIN_ROLES } from "@/constants/userConstants";

export default defineNuxtRouteMiddleware(async (to) => {
    const authStore = useAuthStore();
    const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password'];

    // Strip locale prefix (vd: /en/admin/dashboard → /admin/dashboard) trước khi check route.
    // Cần thiết vì @nuxtjs/i18n strategy 'prefix_except_default' thêm /en/... cho non-default locale.
    // Nếu check trực tiếp to.path.startsWith('/admin') thì /en/admin/* không match → admin bị redirect sai.
    const stripLocale = (p) => p.replace(/^\/[a-z]{2}(?=\/|$)/i, '') || '/';
    const normalizedPath = stripLocale(to.path);

    // Cho phép admin truy cập trang coming-soon (cả locale prefix lẫn không)
    const isComingSoon = /^\/coming-soon\/?$/i.test(normalizedPath);

    if (!authStore.isAuthenticated || !authStore.user) {
        if (!authStore.sessionResolved) {
            await authStore.fetchUser();
        }
        if (!authStore.isAuthenticated || !authStore.user) {
            return;
        }
    }

    const userRoleId = String(authStore.user.role_id);

    const isAdmin = ADMIN_ROLES.includes(userRoleId);

    const targetIsAdminRoute = normalizedPath.startsWith('/admin');
    const isPublic = publicRoutes.includes(normalizedPath);

    if (isAdmin) {
        if (!targetIsAdminRoute && !isPublic && !isComingSoon) {
            return navigateTo('/admin/dashboard');
        }
    } else {
        if (targetIsAdminRoute) {
            return abortNavigation(createError({
                statusCode: 403,
                statusMessage: 'Access Denied',
                fatal: true
            }));
        }
    }
});
