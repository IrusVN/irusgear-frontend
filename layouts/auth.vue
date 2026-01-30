<template>
    <div class="irus-main-layout">
        <div class="d-flex flex-column min-vh-100">
            <main>
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup></script>
<style scoped>
.irus-main-layout {
  background-image: url('@/public/image/background-image.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-color: #f8f9fa;
}
</style>
