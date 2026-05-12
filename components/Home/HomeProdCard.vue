<template>
  <div class="card-shell h-100 px-1 py-1 position-relative">
    <span v-if="product.badge" class="pos-badge">
      {{ $t('common.discount') }} <span class="badge-strong">{{ product.discount }}%</span>
    </span>
    <span v-if="product.installmentText" class="pos-installment">
      {{ $t('common.installment') }} <span class="badge-strong">0%</span>
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
        <button type="button" class="fav-btn" :aria-label="$t('product.favorite')" @click="toggleWishlist">
          <i :class="isInWishlist ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
          <span class="d-none d-sm-inline">{{ $t('product.favorite') }}</span>
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
      await wishlistStore.removeItem(item.id);
      toast.success(t("product.removedFromWishlist"));
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
  top: 14px;
  left: 12px;
  z-index: 4;
  min-width: 80px;
  height: 22px;
  padding: 0 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: url('https://cdn2.cellphones.com.vn/x/media/wysiwyg/discount-badge-ui-2025.png') center/100% 100% no-repeat;
  color: #fff;
  font-size: 0.6rem;
  font-weight: 500;
  transform: translateY(-48%);
}

.pos-installment {
  position: absolute;
  top: 19px;
  right: 4px;
  z-index: 4;
  min-width: 76px;
  height: 28px;
  padding: 0 8px 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  background: url('https://cdn2.cellphones.com.vn/x/media/wysiwyg/zero-ins-badge-ui-2025.png') center/100% 100% no-repeat;
  color: #3b82f6;
  font-size: 0.6rem;
  font-weight: 400;
  transform: translate(6%, -40%);
}

.badge-strong {
  margin-left: 2px;
  font-size: 0.72rem;
  font-weight: 600;
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
  color: #d70018;
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

.fav-btn {
  border: 1px solid #fff;
  border-radius: 6px;
  background: #fff;
  color: #3b82f6;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 28px;
  padding: 2px 6px;
  font-size: 1rem;
}

.fav-btn:hover {
  border-color: #f3f4f6;
  background: #f9fafb;
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
