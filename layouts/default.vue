<template>
    <div>
        <!-- Mobile layout -->
        <template v-if="isMobile">
            <div class="mobile-layout-shell">
                <MobileHeader />
                <main class="mobile-main-content">
                    <slot />
                </main>
                <MobileBottomNav />
            </div>
        </template>

        <!-- Desktop layout (unchanged) -->
        <template v-else>
            <div class="d-flex flex-column min-vh-100">
                <CustomerSidebar />
                <main class="flex-grow-1 py-5 pt-5 mt-5">
                    <Breadcrumb />
                    <slot />
                </main>
                <Footer />
            </div>
        </template>
    </div>
</template>

<script setup>
import CustomerSidebar from '@/components/Sidebar/CustomerSidebar.vue'
import Footer from '@/components/Footer/Footer.vue'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import MobileHeader from '@/components/Mobile/MobileHeader.vue'
import MobileBottomNav from '@/components/Mobile/MobileBottomNav.vue'
import { useIsMobile } from '~/composables/useIsMobile'

const { isMobile } = useIsMobile()
</script>

<style scoped>
.mobile-layout-shell {
    min-height: 100vh;
    background: #f2f3f7;
    display: flex;
    flex-direction: column;
}

.mobile-main-content {
    flex: 1 1 auto;
    padding-bottom: 60px;
}
</style>
