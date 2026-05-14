<template>
  <nav v-if="canShow" class="cps-breadcrumb" aria-label="breadcrumb">
    <div class="container-xl px-3">
      <ul class="crumb-list">
        <li v-for="(item, index) in uiTrail" :key="`${item.label}-${index}`" class="crumb-item">
          <template v-if="index === 0">
            <i class="bi bi-house-door crumb-home" aria-hidden="true"></i>
          </template>

          <template v-if="item.to && !isLast(index)">
            <NuxtLink :to="item.to" class="crumb-link">{{ item.label }}</NuxtLink>
          </template>
          <template v-else>
            <span class="crumb-current">{{ item.label }}</span>
          </template>

          <span v-if="!isLast(index)" class="crumb-sep" aria-hidden="true">/</span>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useHead } from "#imports";
import { useBreadcrumbStore } from "@/stores/breadcrumbStore";

const route = useRoute();
const breadcrumbStore = useBreadcrumbStore();
const { fullTrail, config } = storeToRefs(breadcrumbStore);

const isHomeRoute = computed(() => route.path === "/" || route.path === "");

const canShow = computed(() => {
  if (!fullTrail.value?.length) return false;
  if (config.value.showOnHome) return true;
  return !isHomeRoute.value;
});

const uiTrail = computed(() => {
  const trail = Array.isArray(fullTrail.value) ? fullTrail.value : [];
  if (!trail.length) return [];
  if (!config.value.compactUi || trail.length <= 2) return trail;
  return [trail[0], trail[trail.length - 1]];
});

const jsonLd = computed(() => {
  const trail = Array.isArray(fullTrail.value) ? fullTrail.value : [];
  if (!trail.length) return null;

  const itemListElement = trail.map((item, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    item: {
      "@id": item.to || route.fullPath,
      name: item.label,
    },
  }));

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
});

const isLast = (index) => index === uiTrail.value.length - 1;

useHead(() => {
  if (!jsonLd.value) {
    return { script: [] };
  }

  return {
    script: [
      {
        key: "breadcrumb-jsonld",
        type: "application/ld+json",
        children: JSON.stringify(jsonLd.value),
      },
    ],
  };
});
</script>

<style scoped>
.cps-breadcrumb {
  background: #fff;
  border-bottom: 1px solid #eceff3;
}

.crumb-list {
  list-style: none;
  margin: 0;
  padding: 10px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  white-space: nowrap;
}

.crumb-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 0.86rem;
}

.crumb-home {
  color: #111827;
  font-size: 0.88rem;
}

.crumb-link {
  color: #4b5563;
  text-decoration: none;
}

.crumb-link:hover {
  color: #111827;
}

.crumb-current {
  color: #111827;
  font-weight: 500;
}

.crumb-sep {
  color: #9ca3af;
}
</style>
