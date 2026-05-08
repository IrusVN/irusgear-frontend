import { useAuthStore } from "@/stores/authStore";
import { useLocalePath } from "#imports";

export default defineNuxtRouteMiddleware(async (to) => {
    const authStore = useAuthStore();
    const localePath = useLocalePath();

    // Always re-validate auth state for protected routes
    if (!authStore.isAuthenticated) {
        if (!authStore.sessionResolved) {
            await authStore.fetchUser();
        }
        if (!authStore.isAuthenticated) {
            return navigateTo({
                path: localePath('/auth/login'),
                query: { redirect: to.fullPath },
            });
        }
    }
});
