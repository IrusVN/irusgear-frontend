import { useAuthStore } from "@/stores/authStore";

export default defineNuxtRouteMiddleware(async (to) => {
    const authStore = useAuthStore();
    const publicRoutes = ['/auth/login', '/auth/register', '/'];
    const isPublic = publicRoutes.includes(to.path);

    if (!authStore.user) {
        await authStore.fetchUser();
    }

    if (!authStore.isAuthenticated && !isPublic) {
        if (to.path.startsWith('/admin')) {
             return navigateTo('/auth/login');
        }
    }
});
