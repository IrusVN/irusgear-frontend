<template>
  <div class="card-shell h-100 px-1 py-1 position-relative">
    <span v-if="product.badge" class="pos-badge">
      <span class="badge-discount">
        <span class="badge-discount__text">{{ $t('common.discount') }} {{ product.discount }}%</span>
      </span>
    </span>
    <span v-if="product.installmentText" class="pos-installment">
      <span class="badge-installment pb-1">
        <span class="badge-installment__text">{{ $t('common.installment') }} 0%</span>
      </span>
    </span>

    <div class="prod-card h-100 position-relative">
      <NuxtLink :to="productLink" class="prod-main group d-flex flex-column flex-grow-1 text-decoration-none">
        <div class="img-box d-flex align-items-center justify-content-center px-2">
          <img :src="product.img" :alt="product.name" class="prod-img">
        </div>

        <div class="px-2 pb-1 body-box">
          <p class="prod-name">{{ product.name }}</p>

          <div class="d-flex align-items-baseline gap-1 mb-1 flex-wrap price-row">
            <span class="price-new">{{ fmt(product.price) }}</span>
            <span v-if="product.originalPrice" class="price-old">{{ fmt(product.originalPrice) }}</span>
          </div>

          <div v-if="Array.isArray(product.gifts) && product.gifts.length" class="gift-list">
            <div v-for="(g, i) in product.gifts.slice(0,2)" :key="i" :class="['gift-chip', i === 0 ? 'gift-chip-blue' : 'gift-chip-violet']">
              {{ g }}
            </div>
            <div v-if="product.gifts[2]" class="promo-row">{{ product.gifts[2] }}</div>
          </div>
        </div>
      </NuxtLink>

      <div class="bottom-row">
        <span class="rating"><i class="bi bi-star-fill"></i> {{ normalizedRating }}</span>
        <button type="button" class="wishListBtn" :aria-label="$t('product.favorite')" @click.prevent.stop="toggleWishlist">
          <div class="btn__effect button__add-wishlist" :class="{ inactive: !isInWishlist, active: isInWishlist }">
            <svg viewBox="20 18 29 28" aria-hidden="true" focusable="false"
              class="heart-border icon-svg icon-svg--color-cps">
              <path
                d="M28.3 21.1a4.3 4.3 0 0 1 4.1 2.6 2.5 2.5 0 0 0 2.3 1.7c1 0 1.7-.6 2.2-1.7a3.7 3.7 0 0 1 3.7-2.6c2.7 0 5.2 2.7 5.3 5.8.2 4-5.4 11.2-9.3 15a2.8 2.8 0 0 1-2 1 3.4 3.4 0 0 1-2.2-1c-9.6-10-9.4-13.2-9.3-15 0-1 .6-5.8 5.2-5.8m0-3c-5.3 0-7.9 4.3-8.2 8.5-.2 3.2.4 7.2 10.2 17.4a6.3 6.3 0 0 0 4.3 1.9 5.7 5.7 0 0 0 4.1-1.9c1.1-1 10.6-10.7 10.3-17.3-.2-4.6-4-8.6-8.4-8.6a7.6 7.6 0 0 0-6 2.7 8.1 8.1 0 0 0-6.2-2.7z">
              </path>
            </svg>
            <svg viewBox="0 0 19.2 18.5" aria-hidden="true" focusable="false"
              class="heart-stroke icon-svg icon-svg--color-silver">
              <path
                d="M9.66 18.48a4.23 4.23 0 0 1-2.89-1.22C.29 10.44-.12 7.79.02 5.67.21 2.87 1.95.03 5.42.01c1.61-.07 3.16.57 4.25 1.76A5.07 5.07 0 0 1 13.6 0c2.88 0 5.43 2.66 5.59 5.74.2 4.37-6.09 10.79-6.8 11.5-.71.77-1.7 1.21-2.74 1.23z">
              </path>
            </svg>
            <svg viewBox="0 0 19.2 18.5" aria-hidden="true" focusable="false"
              class="heart-full icon-svg icon-svg--color-cps">
              <path
                d="M9.66 18.48a4.23 4.23 0 0 1-2.89-1.22C.29 10.44-.12 7.79.02 5.67.21 2.87 1.95.03 5.42.01c1.61-.07 3.16.57 4.25 1.76A5.07 5.07 0 0 1 13.6 0c2.88 0 5.43 2.66 5.59 5.74.2 4.37-6.09 10.79-6.8 11.5-.71.77-1.7 1.21-2.74 1.23z">
              </path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="5.707 17 48 20"
              class="broken-heart">
              <g fill="#3b82f6">
                <path
                  d="M29.865 32.735V18.703a4.562 4.562 0 0 0-3.567-1.476c-2.916.017-4.378 2.403-4.538 4.756-.118 1.781.227 4.006 5.672 9.737a3.544 3.544 0 0 0 2.428 1.025l-.008-.008.013-.002z"
                  class="broken-heart--left"></path>
                <path
                  d="M37.868 22.045c-.135-2.588-2.277-4.823-4.697-4.823a4.258 4.258 0 0 0-3.302 1.487l-.004-.003v14.035a3.215 3.215 0 0 0 2.289-1.033c.598-.596 5.882-5.99 5.714-9.663z"
                  class="broken-heart--right"></path>
              </g>
              <path fill="none" stroke="#FFF" stroke-miterlimit="10" d="M29.865 18.205v14.573"
                class="broken-heart--crack"></path>
            </svg>
            <span class="effect-group">
              <span class="effect"></span>
              <span class="effect"></span>
              <span class="effect"></span>
              <span class="effect"></span>
              <span class="effect"></span>
            </span>
          </div>
          <span class="text-wishlist d-none d-sm-inline ms-1">{{ $t('product.favorite') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { toast } from 'vue-sonner';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useAuthStore } from '@/stores/authStore';
import { useI18n } from "#imports";
import { useRouter } from "#imports";

const { t } = useI18n();
const wishlistStore = useWishlistStore();
const authStore = useAuthStore();
const router = useRouter();

const props = defineProps({ product: { type: Object, required: true } });

// Source of truth duy nhất: wishlistStore (đã được fetch từ /wishlist khi user login
// — xem layouts/default.vue). Không phụ thuộc field is_wishlist từ API products.
const isInWishlist = computed(() => {
  const productId = props.product?.id;
  if (!productId) return false;
  return wishlistStore.items.some(
    (i) => String(i.product_id) === String(productId)
  );
});

const toggleWishlist = async () => {
  if (!authStore.isLoggedIn) {
    router.push("auth/login");
    return;
  }

  const productId = props.product?.id;
  if (!productId) return;

  const item = wishlistStore.items.find(
    (i) => String(i.product_id) === String(productId)
  );

  try {
    if (item) {
      toast(t("product.confirmRemoveFromWishlist", { name: props.product?.name }), {
        cancel: { label: t("common.confirmNo"), onClick: () => {} },
        action: { label: t("common.confirmYes"), onClick: () => wishlistStore.removeItem(item.id) },
      });
    } else {
      await wishlistStore.addItem({
        product_id: Number(productId),
        variant_id: null,
        quantity: 1,
      });
      toast.success(t("product.addedToWishlist"));
    }
  } catch (e) {
    toast.error(e?.message || t("product.wishlistError"));
  }
};

const fmt = (v) => {
  const value = Number(v) || 0;
  return `${new Intl.NumberFormat('vi-VN').format(value)} đ`;
};

const normalizedRating = computed(() => {
  const value = Number(props.product?.rating);
  if (Number.isFinite(value) && value > 0) return value.toFixed(1);
  return '5.0';
});

const productLink = computed(() => {
  if (props.product?.slug) {
    return `/products/${props.product.slug}`;
  }

  if (typeof props.product?.url === 'string' && props.product.url.trim()) {
    return props.product.url;
  }

  return '/';
});
</script>

<style scoped>
.card-shell {
  min-height: 100%;
  padding-top: 8px !important;
}

.prod-card {
  background: #fff;
  border: 1px solid #e4e8ee;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  display: flex;
  flex-direction: column;
}

.prod-card:hover {
  border-color: #d4d9e2;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
}

.prod-main {
  flex: 1 1 auto;
  padding: 10px 10px 0;
}

.pos-badge {
  position: absolute;
  top: 4px;
  left: 12px;
  z-index: 4;
}

.badge-discount {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 22px;
}

.badge-discount::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url('https://cdn2.cellphones.com.vn/x/media/wysiwyg/discount-badge-ui-2025.png') center / 100% 100% no-repeat;
  filter: hue-rotate(160deg) saturate(0.4) brightness(0.35);
}

.badge-discount__text {
  position: relative;
  z-index: 1;
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  font-family: system-ui, sans-serif;
  letter-spacing: 0.01em;
  line-height: 1;
}

.pos-installment {
  position: absolute;
  top: 19px;
  right: 0px;
  z-index: 4;
}

.badge-installment {
  background: url('https://cdn2.cellphones.com.vn/x/media/wysiwyg/zero-ins-badge-ui-2025.png') center / 100% 100% no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 76px;
  height: 28px;
}

.badge-installment__text {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  font-size: 10px;
  font-weight: 600;
  color: #1d4ed8;
  font-family: system-ui, sans-serif;
  letter-spacing: 0.01em;
  line-height: 1;
}

.img-box {
  height: 176px;
  background: #fff;
  margin-bottom: 6px;
}

.prod-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transform: scale(0.9);
  transition: transform 0.25s ease;
}

.group:hover .prod-img {
  transform: scale(0.95);
}

.prod-name {
  font-size: 0.94rem;
  font-weight: 700;
  line-height: 1.28;
  line-clamp: 2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.5em;
  margin-bottom: 6px;
  color: #1f2937;
  text-align: left;
}

.price-new {
  font-size: 1.12rem;
  font-weight: 700;
  color: var(--irus-color-accent);
}

.price-old {
  font-size: 0.82rem;
  color: #c0c7d2;
  text-decoration: line-through;
  line-height: 1;
}

.gift-list {
  margin-bottom: 6px;
}

.gift-chip {
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.68rem;
  padding: 3px 6px;
  margin-bottom: 4px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gift-chip-blue {
  background: #dbeafe;
  color: #1d4ed8;
}

.gift-chip-violet {
  background: #ede9fe;
  color: #6d28d9;
}

.promo-row {
  border-radius: 4px;
  background: #f3f4f6;
  color: #111827;
  font-size: 0.68rem;
  line-height: 1.25;
  padding: 4px 6px;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bottom-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  padding: 6px 10px 10px;
  margin-top: auto;
}

.body-box {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex: 1 1 auto;
  min-height: 0;
}

.rating {
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 3px;
}

.rating .bi {
  color: #f4b400;
  font-size: 0.98rem;
}

.wishListBtn {
  align-items: center;
  background-color: transparent;
  border: none;
  display: flex;
  justify-content: center;
  padding: 4px;
}

.wishListBtn .text-wishlist {
  color: #3b82f6;
  font-size: 14px;
  font-weight: 500;
}

.wishListBtn:hover .btn__effect:not(.active) .heart-stroke {
  animation: pulseCps 1s ease-out infinite;
}

.wishListBtn .icon-svg--color-silver {
  color: #fff;
  fill: #fff;
}

.wishListBtn .icon-svg--color-cps {
  color: #3b82f6;
  fill: #3b82f6;
}

.wishListBtn .icon-svg {
  display: inline-block;
  height: 20px;
  vertical-align: middle;
  width: 20px;
}

.wishListBtn .heart-full {
  opacity: 0;
}

.wishListBtn .heart-border,
.wishListBtn .heart-full {
  left: 50%;
  position: absolute;
  top: 0;
  transform: translateX(-50%);
}

.wishListBtn .heart-border {
  height: 22px;
  width: 20px;
}

.wishListBtn .btn__effect {
  align-items: center;
  background-color: transparent;
  border: 0;
  display: flex;
  height: 20px;
  justify-content: center;
  padding: 0;
  position: relative;
  width: 20px;
}

.wishListBtn .btn__effect:hover {
  cursor: pointer;
}

.wishListBtn .effect-group {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  transform: rotate(25deg);
  width: 100%;
}

.wishListBtn .effect-group .effect {
  display: block;
  left: 50%;
  position: absolute;
  top: 38%;
  transform-origin: 0 2px;
  width: 20px;
}

.wishListBtn .effect-group .effect:nth-child(2) {
  transform: rotate(72deg);
}

.wishListBtn .effect-group .effect:nth-child(3) {
  transform: rotate(144deg);
}

.wishListBtn .effect-group .effect:nth-child(4) {
  transform: rotate(216deg);
}

.wishListBtn .effect-group .effect:nth-child(5) {
  transform: rotate(288deg);
}

.wishListBtn .effect-group .effect:before {
  background: #3b82f6;
  border-radius: 1.5px;
  content: "";
  display: block;
  height: 3px;
  position: absolute;
  right: 0;
}

.wishListBtn .effect-group .effect:after {
  background: #f60;
  border-radius: 50%;
  content: "";
  display: block;
  height: 3px;
  position: absolute;
  right: 10%;
  top: 10px;
  transform: scale(0);
  width: 3px;
}

.wishListBtn .active .heart-stroke {
  opacity: 0;
}

.wishListBtn .active .heart-full {
  opacity: 1;
}

.wishListBtn .active .heart-border {
  color: #fff;
  fill: #fff;
}

.wishListBtn .active .icon-svg {
  animation: bounceIn 0.5s linear;
}

.wishListBtn .active .effect:before {
  animation: fireworkLine 0.5s linear 0.1s;
}

.wishListBtn .active .effect:after {
  animation: fireworkPoint 0.5s linear 0.1s;
}

.wishListBtn .broken-heart {
  left: 4px;
  opacity: 0;
  position: absolute;
  top: 5px;
  transform: scale(1.3);
}

.wishListBtn .broken-heart--left {
  transform: rotate(0deg);
  transform-origin: 60% 200%;
}

.wishListBtn .broken-heart--right {
  transform: rotate(0deg);
  transform-origin: 63% 200%;
}

.wishListBtn .broken-heart--crack {
  stroke-dasharray: 15;
  stroke-dashoffset: 15;
}

.wishListBtn .deactivate .broken-heart {
  opacity: 1;
}

.wishListBtn .deactivate .broken-heart--left {
  animation: crackLeft 0.35s cubic-bezier(0.68, -0.55, 0.265, 2.85) 0.15s forwards, hide 0.25s ease-in 0.55s forwards;
}

.wishListBtn .deactivate .broken-heart--right {
  animation: crackRight 0.35s cubic-bezier(0.68, -0.55, 0.265, 2.85) 0.15s forwards, hide 0.25s ease-in 0.55s forwards;
}

.wishListBtn .deactivate .broken-heart--crack {
  animation: crack 0.2s ease-in forwards;
}

@keyframes pulseCps {
  0% { fill: #fff; transform: scale(0.8); transform-origin: center center; }
  50% { fill: #3b82f6; transform: scale(1.1); }
  to { fill: #fff; transform: scale(0.8); }
}

@keyframes fireworkLine {
  0% { right: 20%; transform: scale(0); }
  25% { right: 20%; transform: scale(1); width: 6px; }
  35% { right: 0; width: 35%; }
  70% { right: 0; transform: scale(1); width: 4px; }
  to { right: 0; transform: scale(0); }
}

@keyframes fireworkPoint {
  30% { transform: scale(0); }
  60% { transform: scale(1); }
  to { transform: scale(0); }
}

@keyframes bounceIn {
  0% { transform: scale(0); }
  30% { transform: scale(1.25); }
  50% { transform: scale(0.9); }
  70% { transform: scale(1.1); }
  80% { transform: scale(1); }
}

@keyframes crackLeft {
  0% { transform: rotate(0deg); }
  to { transform: rotate(-45deg); }
}

@keyframes crackRight {
  0% { transform: rotate(0deg); }
  to { transform: rotate(45deg); }
}

@keyframes crack {
  0% { stroke-dasharray: 15; stroke-dashoffset: 15; }
  80% { opacity: 1; stroke-dasharray: 15; stroke-dashoffset: 0; }
  to { opacity: 0; }
}

@keyframes hide {
  0% { opacity: 1; }
  to { opacity: 0; }
}

.price-row {
  align-items: baseline;
}

@media (max-width: 359.98px) {
  .bottom-row {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .prod-name {
    font-size: 12px;
    -webkit-line-clamp: 2;
  }

  .price-new {
    font-size: 13px;
  }

  .bottom-row {
    align-items: flex-start;
  }
}
</style>
