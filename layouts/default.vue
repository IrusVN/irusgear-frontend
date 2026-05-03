<template>
    <div>
        <div class="d-flex flex-column min-vh-100">
            <ClientOnly>
              <CustomerSidebar />
              <template #fallback>
                <div class="customer-sidebar-ssr-placeholder"></div>
              </template>
            </ClientOnly>
            <main class="flex-grow-1 main-with-customer-sidebar">
                <Breadcrumb />
                <slot />
            </main>
            <Footer />
            <AddToCartSheet />
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import CustomerSidebar from '@/components/Sidebar/CustomerSidebar.vue'
import Footer from '@/components/Footer/Footer.vue'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import AddToCartSheet from '@/components/Cart/AddToCartSheet.vue'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'

const cartStore = useCartStore()
const authStore = useAuthStore()

onMounted(() => {
    if (!authStore.sessionResolved && !authStore.sessionLoading) {
        authStore.fetchUser().catch(() => {})
    }

    // fetchCart có guard hydrated/isFetchingCart bên trong — gọi nhiều lần vẫn an toàn.
    cartStore.fetchCart({ silent: true }).catch(() => {})
})
</script>

<style scoped>
.main-with-customer-sidebar {
    padding-top: 9.5rem;
    padding-bottom: 3rem;
}

.customer-sidebar-ssr-placeholder {
    height: 80px;
    width: 100%;
}

@media (max-width: 991.98px) {
    .main-with-customer-sidebar {
        padding-top: 6.5rem;
    }
}

@media (min-width: 992px) {
    .customer-sidebar-ssr-placeholder {
        height: 72px;
    }
}
</style>
