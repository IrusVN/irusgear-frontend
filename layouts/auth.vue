<template>
    <div>
        <!-- Mobile auth layout -->
        <template v-if="isMobile">
            <div class="mobile-auth-shell">
                <header class="mobile-auth-header">
                    <button type="button" class="mobile-auth-back" @click="goBack" aria-label="Quay lại">
                        <i class="bi bi-arrow-left"></i>
                    </button>
                    <NuxtLink to="/" class="mobile-auth-logo-link">
                        <img src="/image/logo-irusgear-black.png" alt="IrusGear" class="mobile-auth-logo" />
                    </NuxtLink>
                    <div class="mobile-auth-spacer"></div>
                </header>
                <main class="mobile-auth-content">
                    <slot />
                </main>
                <MobileBottomNav />
            </div>
        </template>

        <!-- Desktop auth layout (unchanged) -->
        <template v-else>
            <div class="auth-layout-wrapper">
                <main class="w-100 min-vh-100 m-0 p-0">
                    <slot />
                </main>
            </div>
        </template>
    </div>
</template>

<script setup>
import MobileBottomNav from '@/components/Mobile/MobileBottomNav.vue'
import { useIsMobile } from '~/composables/useIsMobile'
import { useRouter } from 'vue-router'

const { isMobile } = useIsMobile()
const router = useRouter()

const goBack = () => {
    if (window.history.length > 1) {
        router.back()
    } else {
        router.push('/')
    }
}
</script>

<style scoped>
.auth-layout-wrapper {
    width: 100%;
    min-height: 100vh;
    overflow-x: hidden;
    background-image: url('@/public/image/background-image.svg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-color: #f8f9fa;
}

/* ─── Mobile Auth ─── */
.mobile-auth-shell {
    min-height: 100vh;
    background: #f2f3f7;
    display: flex;
    flex-direction: column;
}

.mobile-auth-header {
    position: sticky;
    top: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    padding: 0 12px;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.mobile-auth-back {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 50%;
    background: #f3f4f6;
    color: #1f2937;
    font-size: 1.1rem;
    transition: background 0.15s;
    -webkit-tap-highlight-color: transparent;
}

.mobile-auth-back:active {
    background: #e5e7eb;
}

.mobile-auth-logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
}

.mobile-auth-logo {
    height: 24px;
    width: auto;
}

.mobile-auth-spacer {
    width: 36px;
}

.mobile-auth-content {
    flex: 1 1 auto;
    padding-bottom: 60px;
}
</style>

