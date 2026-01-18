<template>
    <div class="d-flex flex-column min-vh-100">
        <CustomerSidebar />
        <main class="flex-grow-1">
            <slot />
        </main>
        <Footer />
    </div>
</template>

<script setup>
import CustomerSidebar from '~/components/Sidebar/CustomerSidebar.vue'
import Footer from '~/components/Footer/Footer.vue'
</script>

<style scoped></style>
