import { useAuthStore } from "@/stores/authStore";
import { ADMIN_ROLES } from "@/constants/userConstants";

export default defineNuxtRouteMiddleware((to) => {
    const authStore = useAuthStore();

    if (!authStore.isAuthenticated || !authStore.user) {
        return;
    }

    const userRoleId = String(authStore.user.role_id);

    const isAdmin = ADMIN_ROLES.includes(userRoleId);

    const targetIsAdminRoute = to.path.startsWith('/admin');

    if (isAdmin) { debugger
        if (!targetIsAdminRoute) {
            return navigateTo('/admin/dashboard');
        }
    } else {
        if (targetIsAdminRoute) {
            return abortNavigation(createError({
                statusCode: 403,
                statusMessage: 'Access Denied',
                fatal: false
            }));
        }
    }
});
