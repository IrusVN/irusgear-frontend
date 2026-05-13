<template>
  <section class="trust-badges">
    <div class="trust-badges__header">
      <i class="bi bi-shield-check"></i>
      <span>{{ $t("checkout.secureInfo") }}</span>
    </div>
    <ul class="trust-badges__list">
      <li>
        <i class="bi bi-check-circle-fill"></i>
        {{ $t("checkout.trust1") }}
      </li>
      <li>
        <i class="bi bi-check-circle-fill"></i>
        {{ $t("checkout.trust2") }}
      </li>
      <li>
        <i class="bi bi-check-circle-fill"></i>
        {{ $t("checkout.trust3") }}
      </li>
      <li>
        <i class="bi bi-check-circle-fill"></i>
        {{ $t("checkout.trust4") }}
      </li>
    </ul>
  </section>
</template>

<script setup>
</script>

<style scoped>
.trust-badges {
  background: linear-gradient(135deg, #f0fdf4, #f7f7f8);
  border: 1px solid #dcfce7;
  border-radius: 18px;
  overflow: hidden;
}

.trust-badges__header {
  align-items: center;
  background: #dcfce7;
  color: #166534;
  display: flex;
  font-size: 14px;
  font-weight: 700;
  gap: 8px;
  padding: 12px 18px;
}

.trust-badges__header i {
  color: #15803d;
}

.trust-badges__list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  list-style: none;
  margin: 0;
  padding: 0;
}

.trust-badges__list li {
  align-items: center;
  color: #166534;
  display: flex;
  font-size: 12px;
  font-weight: 500;
  gap: 6px;
  padding: 10px 18px;
}

.trust-badges__list li i {
  color: #15803d;
  flex-shrink: 0;
}

@media (max-width: 575.98px) {
  .trust-badges__list {
    grid-template-columns: 1fr;
  }
}
</style>
