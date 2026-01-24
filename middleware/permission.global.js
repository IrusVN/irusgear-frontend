import { useAuthStore } from "@/stores/authStore";
import { ADMIN_ROLES } from "@/constants/userConstants";

export default defineNuxtRouteMiddleware((to) => {
    const authStore = useAuthStore();
    const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password'];

    if (!authStore.isAuthenticated || !authStore.user) {
        return;
    }

    const userRoleId = String(authStore.user.role_id);

    const isAdmin = ADMIN_ROLES.includes(userRoleId);

    const targetIsAdminRoute = to.path.startsWith('/admin');

    if (isAdmin) {
        if (!targetIsAdminRoute && !publicRoutes.includes(to.path)) {
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
