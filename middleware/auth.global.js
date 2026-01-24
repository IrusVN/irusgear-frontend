import { useAuthStore } from "@/stores/authStore";
import { useCookie } from "#imports";

export default defineNuxtRouteMiddleware(async (to) => {
    const authStore = useAuthStore();
    const token = useCookie('access_token');
    const isPublic = to.path.startsWith('/auth/');

    if (!authStore.user && token.value) {
        if (isPublic) {
            authStore.fetchUser().catch(() => {}); 
        } else {
            await authStore.fetchUser();
        }
    }
    if (!authStore.isAuthenticated && !isPublic) {
        return navigateTo(`/auth/login?redirect=${to.fullPath}`);
    }
});
