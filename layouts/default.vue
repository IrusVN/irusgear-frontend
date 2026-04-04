<template>
    <div>
        <div class="d-flex flex-column min-vh-100">
            <CustomerSidebar />
            <main class="flex-grow-1 py-5 pt-5 mt-5">
                <slot />
            </main>
            <Footer />
            <ChatbotWidget />
        </div>
    </div>
</template>

<script setup>
import CustomerSidebar from '@/components/Sidebar/CustomerSidebar.vue'
import Footer from '@/components/Footer/Footer.vue'
import ChatbotWidget from '@/components/Chatbot/ChatbotWidget.vue'
</script>

<style scoped></style>

