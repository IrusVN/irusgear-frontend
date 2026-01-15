<template>
  <div class="mb-4">
    <h1 class="h3 fw-bold text-dark mb-2">{{ title }}</h1>
    <p v-if="subtitle" class="text-muted mb-0">
      {{ subtitle }}
      <NuxtLink v-if="linkText && linkTo" :to="linkTo" class="text-dark fw-semibold text-decoration-none">
        {{ linkText }}
      </NuxtLink>
    </p>
    <p v-if="description" class="text-muted small">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  linkText: { type: String, default: '' },
  linkTo: { type: String, default: '' }
})
</script>
