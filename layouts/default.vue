<template>
    <div>
        <div class="d-flex flex-column min-vh-100">
            <CustomerSidebar />
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
import CustomerSidebar from '@/components/Sidebar/CustomerSidebar.vue'
import Footer from '@/components/Footer/Footer.vue'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import AddToCartSheet from '@/components/Cart/AddToCartSheet.vue'
import { useCartStore } from '@/stores/cartStore'

const cartStore = useCartStore()

await cartStore.fetchCart({ silent: true })
</script>

<style scoped>
.main-with-customer-sidebar {
    padding-top: 9.5rem;
    padding-bottom: 3rem;
}

@media (max-width: 991.98px) {
    .main-with-customer-sidebar {
        padding-top: 6.5rem;
    }
}
</style>
