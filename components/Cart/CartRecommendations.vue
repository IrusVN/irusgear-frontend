<template>
  <section v-if="loading || hasRecommendations" class="cart-recommendations">
    <div class="cart-recommendations__head">
      <div>
        <p class="cart-recommendations__eyebrow">Gợi ý cho bạn</p>
        <h2 class="cart-recommendations__title">Mua thêm cho trọn bộ</h2>
      </div>

      <p class="cart-recommendations__description">
        Mình đang ưu tiên các combo và phụ kiện phù hợp với sản phẩm đang có trong giỏ.
      </p>
    </div>

    <article v-if="loading" class="cart-recommendations__loading">
      Đang tải gợi ý phù hợp cho giỏ hàng...
    </article>

    <div v-if="comboDeals.length" class="cart-recommendations__section">
      <div class="cart-recommendations__section-head">
        <h3>Mua kèm giá tốt</h3>
        <span>{{ comboDeals.length }} gợi ý</span>
      </div>

      <div class="cart-recommendations__grid">
        <article
          v-for="product in comboDeals"
          :key="`combo-${product.id}`"
          class="cart-recommendations__card"
        >
          <NuxtLink :to="productLink(product)" class="cart-recommendations__card-main">
            <img
              :src="product.image || fallbackImage"
              :alt="product.title"
              class="cart-recommendations__image"
            >

            <div class="cart-recommendations__card-content">
              <span class="cart-recommendations__badge cart-recommendations__badge--combo">
                {{ product.badge || "Ưu đãi mua kèm" }}
              </span>
              <h4 class="cart-recommendations__name">{{ product.title }}</h4>

              <div class="cart-recommendations__price">
                <strong>{{ product.price?.formatted || "Liên hệ" }}</strong>
                <span v-if="product.oldPrice?.value > product.price?.value">
                  {{ product.oldPrice?.formatted }}
                </span>
              </div>
            </div>
          </NuxtLink>

          <button
            type="button"
            class="cart-recommendations__cta"
            :disabled="cartBusy || isAdding(product.id)"
            @click="handleAdd(product)"
          >
            Thêm ngay
          </button>
        </article>
      </div>
    </div>

    <div v-if="accessoryDeals.length" class="cart-recommendations__section">
      <div class="cart-recommendations__section-head">
        <h3>Phụ kiện phù hợp</h3>
        <span>{{ accessoryDeals.length }} gợi ý</span>
      </div>

      <div class="cart-recommendations__grid">
        <article
          v-for="product in accessoryDeals"
          :key="`accessory-${product.id}`"
          class="cart-recommendations__card"
        >
          <NuxtLink :to="productLink(product)" class="cart-recommendations__card-main">
            <img
              :src="product.image || fallbackImage"
              :alt="product.title"
              class="cart-recommendations__image"
            >

            <div class="cart-recommendations__card-content">
              <span class="cart-recommendations__badge cart-recommendations__badge--accessory">
                Phụ kiện gợi ý
              </span>
              <h4 class="cart-recommendations__name">{{ product.title }}</h4>

              <div class="cart-recommendations__price">
                <strong>{{ product.price?.formatted || "Liên hệ" }}</strong>
                <span v-if="product.oldPrice?.value > product.price?.value">
                  {{ product.oldPrice?.formatted }}
                </span>
              </div>

              <p v-if="product.memberDiscount?.value > 0" class="cart-recommendations__member">
                Smember giảm thêm đến {{ product.memberDiscount.formatted }}
              </p>
            </div>
          </NuxtLink>

          <button
            type="button"
            class="cart-recommendations__cta"
            :disabled="cartBusy || isAdding(product.id)"
            @click="handleAdd(product)"
          >
            Thêm vào giỏ
          </button>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useLocalePath, useRuntimeConfig } from "#imports";
import { useCartActions } from "@/composables/useCartActions";

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

const fallbackImage = "https://placehold.co/120x120/f4f4f5/d4d4d8?text=%20";
const config = useRuntimeConfig();
const localePath = useLocalePath();
const { cartBusy, addProductToCart } = useCartActions();

const loading = ref(false);
const comboDeals = ref([]);
const accessoryDeals = ref([]);
const addingIds = ref([]);

const cartProductIds = computed(() =>
  new Set(props.items.map((item) => String(item?.productId || ""))),
);

const sourceProductIds = computed(() =>
  props.items
    .map((item) => Number(item?.productId || 0))
    .filter((value) => Number.isFinite(value) && value > 0)
    .slice(0, 3),
);

const hasRecommendations = computed(() => comboDeals.value.length > 0 || accessoryDeals.value.length > 0);

const recommendationKey = computed(() => sourceProductIds.value.join(","));

const productLink = (product) => localePath(product?.link || "/products");

const isAdding = (productId) => addingIds.value.includes(String(productId));

const addAddingId = (productId) => {
  const nextId = String(productId);

  if (addingIds.value.includes(nextId)) {
    return;
  }

  addingIds.value = [...addingIds.value, nextId];
};

const removeAddingId = (productId) => {
  const nextId = String(productId);
  addingIds.value = addingIds.value.filter((id) => id !== nextId);
};

const normalizeDeal = (deal = {}) => ({
  ...deal,
  id: String(deal.id || ""),
  image: String(deal.image || ""),
  link: String(deal.link || ""),
  title: String(deal.title || ""),
  badge: String(deal.badge || ""),
  price: deal.price || {
    value: 0,
    formatted: "0đ",
  },
  oldPrice: deal.oldPrice || {
    value: 0,
    formatted: "0đ",
  },
  memberDiscount: deal.memberDiscount || {
    value: 0,
    formatted: "0đ",
  },
});

const fetchRecommendations = async () => {
  if (!sourceProductIds.value.length) {
    comboDeals.value = [];
    accessoryDeals.value = [];
    return;
  }

  loading.value = true;

  try {
    const responses = await Promise.allSettled(
      sourceProductIds.value.map((productId) =>
        $fetch(`${config.public.apiBaseUrl}/products/${productId}/suggestions`),
      ),
    );

    const nextComboDeals = [];
    const nextAccessoryDeals = [];
    const seenComboIds = new Set();
    const seenAccessoryIds = new Set();

    responses.forEach((result) => {
      if (result.status !== "fulfilled" || !result.value) {
        return;
      }

      const response = result.value;

      (Array.isArray(response.comboDeals) ? response.comboDeals : []).forEach((deal) => {
        const normalizedDeal = normalizeDeal(deal);

        if (
          !normalizedDeal.id ||
          cartProductIds.value.has(normalizedDeal.id) ||
          seenComboIds.has(normalizedDeal.id) ||
          nextComboDeals.length >= 4
        ) {
          return;
        }

        seenComboIds.add(normalizedDeal.id);
        nextComboDeals.push(normalizedDeal);
      });

      (Array.isArray(response.accessoryDeals) ? response.accessoryDeals : []).forEach((deal) => {
        const normalizedDeal = normalizeDeal(deal);

        if (
          !normalizedDeal.id ||
          cartProductIds.value.has(normalizedDeal.id) ||
          seenAccessoryIds.has(normalizedDeal.id) ||
          nextAccessoryDeals.length >= 4
        ) {
          return;
        }

        seenAccessoryIds.add(normalizedDeal.id);
        nextAccessoryDeals.push(normalizedDeal);
      });
    });

    comboDeals.value = nextComboDeals;
    accessoryDeals.value = nextAccessoryDeals;
  } catch (error) {
    comboDeals.value = [];
    accessoryDeals.value = [];
  } finally {
    loading.value = false;
  }
};

const handleAdd = async (product) => {
  if (!product?.id || isAdding(product.id)) {
    return;
  }

  addAddingId(product.id);

  try {
    await addProductToCart(product, {
      openSheet: false,
      successMessage: "Đã thêm gợi ý vào giỏ hàng.",
    });
  } finally {
    removeAddingId(product.id);
  }
};

watch(
  recommendationKey,
  async () => {
    await fetchRecommendations();
  },
  { immediate: true },
);
</script>

<style scoped>
.cart-recommendations {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 8px;
  padding: 22px;
}

.cart-recommendations__head {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  justify-content: space-between;
}

.cart-recommendations__eyebrow {
  color: #d70018;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin: 0 0 4px;
  text-transform: uppercase;
}

.cart-recommendations__title {
  color: #18181b;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.cart-recommendations__description {
  color: #71717a;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  max-width: 420px;
}

.cart-recommendations__loading {
  background: #f8fafc;
  border: 1px dashed #dbe3f0;
  border-radius: 18px;
  color: #64748b;
  font-size: 14px;
  padding: 14px 16px;
}

.cart-recommendations__section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.cart-recommendations__section-head {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.cart-recommendations__section-head h3 {
  color: #18181b;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.cart-recommendations__section-head span {
  background: #fff7ed;
  border-radius: 999px;
  color: #c2410c;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 10px;
}

.cart-recommendations__grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.cart-recommendations__card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
}

.cart-recommendations__card-main {
  color: inherit;
  display: flex;
  gap: 12px;
  min-width: 0;
  text-decoration: none;
}

.cart-recommendations__image {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  flex-shrink: 0;
  height: 92px;
  object-fit: cover;
  width: 92px;
}

.cart-recommendations__card-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.cart-recommendations__badge {
  align-self: flex-start;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.2;
  padding: 6px 10px;
}

.cart-recommendations__badge--combo {
  background: #fff7ed;
  color: #c2410c;
}

.cart-recommendations__badge--accessory {
  background: #eff6ff;
  color: #2563eb;
}

.cart-recommendations__name {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #18181b;
  display: -webkit-box;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.45;
  margin: 0;
  overflow: hidden;
}

.cart-recommendations__price {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cart-recommendations__price strong {
  color: #d70018;
  font-size: 16px;
  font-weight: 800;
}

.cart-recommendations__price span {
  color: #a1a1aa;
  font-size: 12px;
  text-decoration: line-through;
}

.cart-recommendations__member {
  color: #64748b;
  font-size: 12px;
  line-height: 1.5;
  margin: 0;
}

.cart-recommendations__cta {
  align-items: center;
  align-self: flex-start;
  background: #fff;
  border: 1px solid #fecaca;
  border-radius: 999px;
  color: #d70018;
  display: inline-flex;
  font-size: 13px;
  font-weight: 700;
  justify-content: center;
  min-height: 40px;
  padding: 0 14px;
}

.cart-recommendations__cta:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

@media (max-width: 767.98px) {
  .cart-recommendations {
    padding: 18px;
  }

  .cart-recommendations__title {
    font-size: 22px;
  }

  .cart-recommendations__grid {
    grid-template-columns: 1fr;
  }

  .cart-recommendations__image {
    height: 84px;
    width: 84px;
  }
}
</style>
