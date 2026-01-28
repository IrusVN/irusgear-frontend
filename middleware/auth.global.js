import { useAuthStore } from "@/stores/authStore";
import { useCookie } from "#imports";

export default defineNuxtRouteMiddleware(async (to) => {
    const authStore = useAuthStore();
    const token = useCookie('access_token');

    // Check if path is public (works for both /auth/ and /vi/auth/, /en/auth/, etc.)
    const isPublic = to.path.includes('/auth/');

    if (!authStore.user && token.value) {
        if (isPublic) {
            authStore.fetchUser().catch(() => { });
        } else {
            await authStore.fetchUser();
        }
    }
    if (!authStore.isAuthenticated && !isPublic) {
        // Use to.path to avoid query string accumulation in redirect loop
        return navigateTo(`/auth/login?redirect=${to.path}`);
    }
});
