<template>
    <div class="auth-layout-wrapper">
        <main class="w-100 min-vh-100 m-0 p-0">
            <slot />
        </main>
    </div>
</template>

<script setup></script>

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
</style>
