import { useAuthStore } from "@/stores/authStore";
import { useCookie } from "#imports";
import { useLocalePath } from "#imports";

export default defineNuxtRouteMiddleware(async (to) => {
    const authStore = useAuthStore();
    const token = useCookie('access_token');
    const localePath = useLocalePath();
    const routeName = to.name?.toString() || '';
    const isPublic = routeName.startsWith('auth-') || routeName.startsWith('index');

    if (!authStore.user && token.value) {
        if (isPublic) {
            authStore.fetchUser().catch(() => {}); 
        } else {
            await authStore.fetchUser();
        }
    }
    if (!authStore.isAuthenticated && !isPublic) {
        return navigateTo({
            path: localePath('/auth/login'),
            query: { redirect: to.fullPath }
        });
    }
});
