import { useAuthStore } from "@/stores/authStore";
import { useLocalePath } from "#imports";

export default defineNuxtRouteMiddleware(async (to) => {
    const authStore = useAuthStore();
    const localePath = useLocalePath();
    const routeName = to.name?.toString() || '';
    const routePath = to.path || '';
    const isPublicProductPath = /^\/(?:[a-z]{2}\/)?products(?:\/|$)/i.test(routePath);
    const isPublicCartPath = /^\/(?:[a-z]{2}\/)?cart(?:\/|$)/i.test(routePath);
    const isPublic = routeName.startsWith('auth-') || routeName.startsWith('index') || isPublicProductPath || isPublicCartPath;

    if (!authStore.sessionResolved && !isPublic) {
        await authStore.fetchUser();
    }

    if (!authStore.sessionResolved && isPublic && import.meta.client && !authStore.sessionLoading) {
        authStore.fetchUser().catch(() => {});
    }

    if (!authStore.isAuthenticated && !isPublic) {
        return navigateTo({
            path: localePath('/auth/login'),
            query: { redirect: to.fullPath }
        });
    }
});
