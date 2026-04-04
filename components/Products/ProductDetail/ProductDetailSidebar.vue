<template>
  <div class="sidebar-stack">
    <section class="sticky-panel">
      <ProductDetailPricingPanel :product="product" />
      <ProductDetailVariantPanel :product="product" />
    </section>

    <section class="promo-card">
      <div class="section-head">
        <h2><span class="gift-icon">🎁</span> Khuyến mãi đi kèm</h2>
      </div>
      <div class="promo-list">
        <div v-for="(item, index) in product.promotions" :key="item" class="promo-item">
          <span class="promo-index">{{ index + 1 }}</span>
          <p>
            {{ item }}
            <a href="#">Xem chi tiết</a>
          </p>
        </div>
      </div>
    </section>

    <section class="finance-banner">
      <div class="finance-banner__copy">
        <strong>CHỌN TRẢ GÓP 0%</strong>
        <span>Trả Trước 0₫ | Phụ phí 0₫</span>
      </div>
      <div class="finance-banner__brands">
        <span>VISA</span>
        <span>mastercard</span>
        <span>JCB</span>
      </div>
    </section>

    <section class="cta-block">
      <button type="button" class="cta-installment">
        <strong>Trả góp 0%</strong>
      </button>
      <button type="button" class="cta-order">
        <strong>ĐẶT TRƯỚC NGAY</strong>
        <span>(Đặt trước 12.293 - thanh toán online)</span>
      </button>
    </section>

    <section class="detail-card p-3 p-lg-4">
      <div class="section-head">
        <h2>Ưu đãi thanh toán</h2>
      </div>
      <div class="payment-grid">
        <article v-for="item in product.paymentOffers" :key="item.brand" class="payment-item">
          <strong>{{ item.brand }}</strong>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </section>

    <section class="detail-card p-3 p-lg-4">
      <div class="section-head">
        <h2>Xem chi nhánh có hàng</h2>
      </div>
      <p class="store-meta">
        Có <strong>{{ product.stores.count }}</strong> cửa hàng tại {{ product.stores.city }}
      </p>
      <div class="filter-row">
        <button type="button" class="filter-chip">{{ product.stores.city }}</button>
        <button type="button" class="filter-chip">{{ product.stores.districts[1] }}</button>
      </div>
      <div class="store-list">
        <article v-for="item in product.stores.list" :key="item.name" class="store-item">
          <p>{{ item.name }}</p>
          <a :href="`tel:${item.phone}`">{{ item.phone }}</a>
        </article>
      </div>
    </section>

    <section class="detail-card p-3 p-lg-4">
      <div class="section-head">
        <h2>Thông tin tiện ích</h2>
      </div>
      <div class="benefit-list">
        <div v-for="item in product.serviceBenefits" :key="item" class="benefit-item">
          <i class="bi bi-check-circle-fill"></i>
          <span>{{ item }}</span>
        </div>
      </div>
    </section>

    <ProductDetailMiniProducts title="Mua kèm deal sốc" :items="product.comboProducts" />

    <ProductDetailMiniProducts title="Phụ kiện mua cùng" :items="product.relatedProducts" />

    <section class="detail-card p-3 p-lg-4">
      <div class="section-head">
        <h2>Gói bảo hành đề xuất</h2>
      </div>
      <div class="plan-grid">
        <article
          v-for="item in product.installmentPlans"
          :key="item.label"
          class="plan-item"
        >
          <strong>{{ item.label }}</strong>
          <span>{{ formatPrice(item.price) }}</span>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import ProductDetailMiniProducts from "@/components/Products/ProductDetail/ProductDetailMiniProducts.vue";
import ProductDetailPricingPanel from "@/components/Products/ProductDetail/ProductDetailPricingPanel.vue";
import ProductDetailVariantPanel from "@/components/Products/ProductDetail/ProductDetailVariantPanel.vue";

defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const formatPrice = (value) => {
  const amount = Number(value) || 0;
  return `${new Intl.NumberFormat("vi-VN").format(amount)}đ`;
};
</script>

<style scoped>
.sidebar-stack {
  display: grid;
  gap: 1rem;
}

.sticky-panel {
  position: sticky;
  top: 1rem;
}

.detail-card,
.promo-card {
  background: #fff;
  border: 1px solid #e5edf7;
  border-radius: 16px;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
}

.promo-item a {
  color: #ef4444;
  text-decoration: none;
  font-weight: 600;
}
.section-head h2 {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
}


.promo-card {
  border-color: #8cb5ff;
  padding: 0.9rem 0.95rem;
}

.gift-icon {
  margin-right: 0.35rem;
}

.promo-list {
  display: grid;
  gap: 0.55rem;
}

.promo-item {
  display: grid;
  grid-template-columns: 20px 1fr;
  gap: 0.55rem;
  align-items: start;
}

.promo-index {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #60a5fa;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
}

.promo-item p {
  margin: 0;
  color: #334155;
  font-size: 0.82rem;
  line-height: 1.45;
}

.finance-banner {
  min-height: 86px;
  border-radius: 4px;
  background: linear-gradient(90deg, #f21d3a 0%, #c70024 100%);
  padding: 0.95rem 1rem;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.finance-banner__copy {
  display: grid;
  gap: 0.15rem;
}

.finance-banner__copy strong {
  font-size: 1.15rem;
  font-weight: 900;
  line-height: 1;
}

.finance-banner__copy span {
  font-size: 0.84rem;
  font-weight: 700;
}

.finance-banner__brands {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  font-weight: 800;
}

.cta-block {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 0.5rem;
}

.cta-installment,
.cta-order {
  border: 0;
  border-radius: 12px;
  padding: 0.95rem 0.8rem;
  min-height: 68px;
}

.cta-installment {
  background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%);
  color: #fff;
}

.cta-order {
  background: linear-gradient(180deg, #ef4444 0%, #d70018 100%);
  color: #fff;
  display: grid;
  text-align: center;
}

.cta-order strong,
.cta-installment strong {
  font-size: 1rem;
  font-weight: 800;
}

.cta-order span {
  font-size: 0.75rem;
  opacity: 0.95;
}

.payment-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.payment-item,
.store-item {
  border: 1px solid #e2ebf6;
  border-radius: 12px;
  padding: 0.9rem;
  background: #fff;
}

.payment-item strong {
  display: block;
  color: #111827;
  font-size: 0.95rem;
}

.payment-item p,
.store-meta,
.store-item p {
  color: #64748b;
  font-size: 0.82rem;
}

.store-meta {
  margin-bottom: 0.75rem;
}

.filter-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.filter-chip {
  border: 1px solid #dce9f9;
  background: #fff;
  border-radius: 10px;
  padding: 0.55rem 0.7rem;
  text-align: left;
  color: #334155;
  font-size: 0.8rem;
}

.store-list,
.benefit-list {
  display: grid;
  gap: 0.75rem;
}

.store-item p {
  margin: 0;
  line-height: 1.55;
}

.store-item a {
  color: #d70018;
  text-decoration: none;
  font-weight: 700;
  display: inline-block;
  margin-top: 0.35rem;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  color: #475569;
  font-size: 0.88rem;
}

.benefit-item i {
  color: #2563eb;
}

.plan-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
}

.plan-item {
  border: 1px solid #e2ebf6;
  border-radius: 12px;
  padding: 0.7rem;
  background: #fff;
}

.plan-item strong {
  display: block;
  font-size: 0.8rem;
  color: #334155;
  min-height: 2rem;
}

.plan-item span {
  color: #ef4444;
  font-weight: 800;
  font-size: 0.82rem;
}

@media (max-width: 991.98px) {
  .sticky-panel {
    position: static;
  }

  .payment-grid,
  .plan-grid,
  .filter-row,
  .cta-block {
    grid-template-columns: 1fr;
  }

  .finance-banner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
