<template>
  <section class="express-checkout">
    <p class="express-checkout__title">
      <i class="bi bi-lightning-fill"></i>
      {{ $t("checkout.expressCheckout") }}
    </p>
    <div class="express-checkout__methods">
      <button type="button" class="express-checkout__method">
        <span class="express-checkout__method-icon" style="background: #1877f2;">ZaloPay</span>
        <span class="express-checkout__method-label">{{ $t("checkout.zaloPay") }}</span>
      </button>
      <button type="button" class="express-checkout__method">
        <span class="express-checkout__method-icon" style="background: #0068ff;">VISA</span>
        <span class="express-checkout__method-label">{{ $t("checkout.visa") }}</span>
      </button>
    </div>
    <p class="express-checkout__or">{{ $t("common.or") }}</p>
  </section>
</template>

<script setup>
</script>

<style scoped>
.express-checkout {
  background: linear-gradient(135deg, #fff7ed, #fff1f2);
  border: 1px solid #fed7aa;
  border-radius: 16px;
  padding: 16px 18px;
  text-align: center;
}

.express-checkout__title {
  align-items: center;
  color: #c2410c;
  display: flex;
  font-size: 13px;
  font-weight: 700;
  gap: 6px;
  justify-content: center;
  margin: 0 0 12px;
}

.express-checkout__methods {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.express-checkout__method {
  align-items: center;
  background: #fff;
  border: 1.5px solid #e4e4e7;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 20px;
  transition: border-color 0.15s ease;
}

.express-checkout__method:hover {
  border-color: #d70018;
}

.express-checkout__method-icon {
  align-items: center;
  border-radius: 6px;
  color: #fff;
  display: inline-flex;
  font-size: 11px;
  font-weight: 800;
  height: 28px;
  justify-content: center;
  min-width: 48px;
}

.express-checkout__method-label {
  color: #18181b;
  font-size: 11px;
  font-weight: 600;
}

.express-checkout__or {
  color: #a1a1aa;
  font-size: 12px;
  margin: 10px 0 0;
}
</style>
