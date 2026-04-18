<template>
  <header class="mobile-header">
    <div class="mobile-header-row1">
      <NuxtLink to="/" class="mobile-logo-link">
        <img src="/image/logo-irusgear-black.png" alt="IrusGear" class="mobile-logo" />
      </NuxtLink>

      <div class="mobile-header-actions">
        <NuxtLink to="/products" class="mobile-header-icon-btn" aria-label="Tìm kiếm">
          <i class="bi bi-search"></i>
        </NuxtLink>
        <NuxtLink to="/cart" class="mobile-header-icon-btn mobile-cart-btn" aria-label="Giỏ hàng">
          <i class="bi bi-cart3"></i>
          <span class="mobile-cart-badge">0</span>
        </NuxtLink>
      </div>
    </div>

    <div class="mobile-header-marquee">
      <div class="mobile-marquee-track">
        <span class="mobile-marquee-text">
          🎉 Giảm đến 50% toàn bộ sản phẩm &nbsp;•&nbsp;
          📱 Trả góp 0% lãi suất &nbsp;•&nbsp;
          🚚 Giao hàng miễn phí &nbsp;•&nbsp;
          🔥 Flash Sale mỗi ngày &nbsp;•&nbsp;
          🎉 Giảm đến 50% toàn bộ sản phẩm &nbsp;•&nbsp;
          📱 Trả góp 0% lãi suất &nbsp;•&nbsp;
          🚚 Giao hàng miễn phí &nbsp;•&nbsp;
          🔥 Flash Sale mỗi ngày &nbsp;•&nbsp;
        </span>
      </div>
    </div>
  </header>
</template>

<script setup>
</script>

<style scoped>
.mobile-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.mobile-header-row1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 12px;
}

.mobile-logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.mobile-logo {
  height: 28px;
  width: auto;
}

.mobile-header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.mobile-header-icon-btn {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: transparent;
  color: #1f2937;
  text-decoration: none;
  font-size: 1.25rem;
  transition: background 0.15s;
}

.mobile-header-icon-btn:hover {
  background: #f3f4f6;
}

.mobile-cart-btn {
  position: relative;
}

.mobile-cart-badge {
  position: absolute;
  top: 4px;
  right: 2px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: #111827;
  color: #fff;
  font-size: 0.62rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border: 2px solid #fff;
}

/* ─── Marquee Row ─────────────────────────────── */
.mobile-header-marquee {
  background: #111827;
  overflow: hidden;
  height: 28px;
  display: flex;
  align-items: center;
}

.mobile-marquee-track {
  display: flex;
  white-space: nowrap;
  animation: mobile-marquee-scroll 25s linear infinite;
}

.mobile-marquee-text {
  color: #fff;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.01em;
}

@keyframes mobile-marquee-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
