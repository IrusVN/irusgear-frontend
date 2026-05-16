<template>
    <div>
        <div class="d-flex flex-column min-vh-100">
            <CustomerSidebar />
            <main class="flex-grow-1 main-with-customer-sidebar">
                <Breadcrumb />
                <slot />
            </main>
            <Footer />
            <ChatbotWidget />
            <AddToCartSheet />
            <ClientOnly>
              <BackToTop />
            </ClientOnly>
        </div>
    </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import CustomerSidebar from '@/components/Sidebar/CustomerSidebar.vue'
import Footer from '@/components/Footer/Footer.vue'
import ChatbotWidget from '@/components/Chatbot/ChatbotWidget.vue'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import AddToCartSheet from '@/components/Cart/AddToCartSheet.vue'
import BackToTop from '@/components/Common/BackToTop.vue'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { useSearchStore } from '@/stores/searchStore'
import { useWishlistStore } from '@/stores/wishlistStore'

const cartStore = useCartStore()
const authStore = useAuthStore()
const searchStore = useSearchStore()
const wishlistStore = useWishlistStore()

// Hydrate wishlist khi user đã login — là source of truth duy nhất cho UI icon heart
// trên mọi product card (Home, ProductList, SameProduct, ...). Fetch 1 lần khi
// isLoggedIn=true, các lần navigate sau tận dụng hydrated guard trong store.
const hydrateWishlistIfNeeded = () => {
    if (authStore.isLoggedIn && !wishlistStore.hydrated) {
        wishlistStore.fetchWishlist({ silent: true }).catch(() => {})
    }
}

onMounted(() => {
    if (!authStore.sessionResolved && !authStore.sessionLoading) {
        authStore.fetchUser().catch(() => {})
    }

    // fetchCart có guard hydrated/isFetchingCart bên trong — gọi nhiều lần vẫn an toàn.
    cartStore.fetchCart({ silent: true }).catch(() => {})

    // Fetch search history + trending once on app load (like /me and /cart)
    searchStore.fetchHistory()
    searchStore.fetchTrending()

    // Nếu session đã resolved sẵn (vd page reload với session cookie hợp lệ) → fetch ngay
    hydrateWishlistIfNeeded()
})

// Khi user vừa login xong (isLoggedIn chuyển false → true) → fetch wishlist.
// Khi logout (true → false) → reset store để không leak wishlist cũ.
watch(
    () => authStore.isLoggedIn,
    (loggedIn) => {
        if (loggedIn) {
            hydrateWishlistIfNeeded()
        } else {
            wishlistStore.reset?.()
        }
    },
)
</script>

<style scoped>
.main-with-customer-sidebar {
    padding-top: 9.5rem;
    padding-bottom: 3rem;
}

@media (max-width: 991.98px) {
    .main-with-customer-sidebar {
        padding-top: 6.5rem;
        padding-bottom: 110px;
    }
}

@media (max-width: 767.98px) {
    .main-with-customer-sidebar {
        padding-top: var(--irus-mobile-top-nav-total-height, calc(64px + env(safe-area-inset-top, 0px)));
        padding-bottom: 100px;
    }
}

@media (max-width: 575.98px) {
    .main-with-customer-sidebar {
        padding-bottom: 90px;
    }
}

@media (max-width: 480px) {
    .main-with-customer-sidebar {
        padding-bottom: 80px;
    }
}
</style>
