<template>
    <div class="d-flex flex-column min-vh-100">
        <CustomerNavbar />
        <main class="flex-grow-1 py-4">
            <slot />
        </main>
        <Footer />
    </div>
</template>

<script setup>
import CustomerNavbar from '~/components/Navbar/CustomerNavbar.vue'
import Footer from '~/components/Footer/Footer.vue'
</script>

<style scoped></style>
