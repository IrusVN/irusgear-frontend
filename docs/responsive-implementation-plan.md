# Kế Hoạch Triển Khai Responsive Mobile UI — IrusGear Frontend

> **Ngày tạo:** 2026-05-08
> **Cập nhật lần cuối:** 2026-05-08 (v5 — tất cả phases hoàn thành)
> **Người thực hiện:** Senior Frontend Review
> **Phiên bản:** 4.0

---

## Mục Lục

1. [Tổng Quan Breakpoints](#1-tổng-quan-breakpoints)
2. [Mobile Bottom Nav Architecture](#2-mobile-bottom-nav-architecture)
3. [Bottom Clearance Strategy](#3-bottom-clearance-strategy)
4. [BottomSheet Integration Pattern](#4-bottomsheet-integration-pattern)
5. [Trạng Thái Hiện Tại](#5-trạng-thái-hiện-tại)
6. [Chi Tiết Từng Phase](#6-chi-tiết-từng-phase)
7. [Global CSS Utilities](#7-global-css-utilities)
8. [QA Checklist](#8-qa-checklist)
9. [Component Responsive Details](#9-component-responsive-details)

---

## 1. Tổng Quan Breakpoints

### 1.1 Thiết Bị & Breakpoints CSS

| Thiết bị | Chiều rộng | Breakpoint | Ghi chú |
|---|---|---|---|
| iPhone SE | 375px | `max-width: 480px` | Nhỏ nhất |
| iPhone 12-15 Pro | 390px | `max-width: 575.98px` | Mobile nhỏ |
| iPhone 14 Pro Max | 430px | `max-width: 575.98px` | Mobile lớn |
| iPad Mini | 768px | `max-width: 767.98px` | Tablet nhỏ |
| iPad Air | 834px | `max-width: 991.98px` | Tablet |
| iPad Pro 12.9" | 1024px | `max-width: 1023.98px` | Tablet lớn |
| Desktop | ≥992px | default | Desktop |
| Wide | ≥1200px | — | Wide |

### 1.2 Breakpoints Được Sử Dụng

```css
@media (max-width: 575.98px)    /* Mobile nhỏ */
@media (max-width: 767.98px)    /* Mobile lớn / Tablet nhỏ */
@media (max-width: 991.98px)    /* Tablet — nav hiện */
@media (max-width: 1023.98px)   /* Tablet lớn */
```

---

## 2. Mobile Bottom Nav Architecture

### 2.1 Cấu Trúc

```
position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%)
z-index: 1050
│
├── FAB Wrapper (margin-right: 16px)
│   ├── Vertical Capsule (hiện khi FAB open, position: absolute; bottom: 65px)
│   └── FAB Button (65px × 65px, position: fixed)
│
└── Capsule Nav (4 items: Home, Search, Wishlist, Profile/Login)
    └── height ≈ 72px (padding 8px×2 + icon 22px + text 10px)
```

### 2.2 Chiều Cao Thực Tế

| Trạng thái | Từ đáy màn hình | Ghi chú |
|---|---|---|
| FAB đóng | 16px + capsule 72px = **88px** | content cần clearance |
| FAB mở | 16px + capsule 72px + gap 65px + FAB 65px = **218px** | overlay full |

### 2.3 Z-Index Stack

```
z-index: 1050   → Mobile Bottom Nav
z-index: 1055   → FAB button
z-index: 1060   → Vertical capsule (when open)
z-index: 9999   → BottomSheet backdrop
```

> BottomSheet luôn nằm TRÊN nav. Không cần xử lý conflict.

---

## 3. Bottom Clearance Strategy

### 3.1 Phân Loại Pages

```
Type N — Không sticky bar
  warranty, orders, tradein, user-info, profile
  khuyen-mai, tin-tuc, lien-he, policy, tos
  account/vouchers, cart/success

Type S — Có sticky bar
  cart          → CartStickyCheckoutBar
  cart/checkout → CheckoutStickyBar
  cart/payment  → payment-page__sticky-bar
```

### 3.2 Giá Trị padding-bottom Chuẩn

**Type N (no sticky bar):**

| Breakpoint | `padding-bottom` |
|---|---|
| `max-width: 991.98px` | `110px` |
| `max-width: 767.98px` | `100px` |
| `max-width: 575.98px` | `90px` |
| `max-width: 480px` | `80px` |

**Type S (sticky bar):**

| Breakpoint | `padding-bottom` |
|---|---|
| `max-width: 991.98px` | `170px` |
| `max-width: 767.98px` | `160px` |
| `max-width: 575.98px` | `145px` |
| `max-width: 480px` | `130px` |

**Công thức Type S:** `60px (sticky bar) + 88px (nav) + 22px (safety gap) ≈ 170px`

### 3.3 Sticky Bar Offset

Sticky bars (cart, checkout, payment) trên mobile cần `bottom: 88px` để nằm TRÊN mobile nav:

```css
@media (max-width: 991.98px) {
  .cart-sticky-checkout,
  .checkout-sticky-bar,
  .payment-page__sticky-bar {
    bottom: 88px;
  }
}
```

### 3.4 Cách Apply

- **Layout level** (`layouts/default.vue`, `layouts/profile.vue`): Đã set Type N default — ✅ DONE
- **Page level**: Override Type S bằng `padding-bottom` lớn hơn trong `<style scoped>`
- **Component level**: Sticky bar components đã set `bottom: 88px` — ✅ DONE

---

## 4. BottomSheet Integration Pattern

### 4.1 Component API

```vue
<BottomSheet ref="sheetRef">
  <template #default="{ close }">
    <MyContent @select="handleSelect($event); close()" />
  </template>
</BottomSheet>

<button @click="sheetRef.open()">Open</button>
```

```js
const sheetRef = ref(null)
sheetRef.value.open()
sheetRef.value.close()
```

### 4.2 Khi Nào Dùng

| Trường hợp | Desktop | Mobile | Priority |
|---|---|---|---|
| Chọn địa chỉ giao hàng | Modal/Inline | BottomSheet | 🔴 Cao |
| Chọn voucher | Inline dropdown | BottomSheet | 🔴 Cao |
| Filter sản phẩm | Inline/Dropdown | BottomSheet | 🔴 Cao |
| Sort sản phẩm | Inline | BottomSheet | 🔴 Cao |
| Tùy chọn giao hàng | Inline | BottomSheet | 🟡 Trung |
| Add to Cart (ProductBlockOrder) | Inline | BottomSheet | 🔴 Cao |
| Ghi chú đơn hàng | Inline | BottomSheet | 🟡 Trung |

### 4.3 Shared Sheet Styles

```css
/* Sheet header */
.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #ececf1;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 1;
}

.sheet-header__title {
  font-size: 16px;
  font-weight: 700;
  color: #18181b;
  margin: 0;
}

.sheet-header__close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #71717a;
  font-size: 18px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sheet-header__close:hover { background: #f4f4f5; color: #18181b; }

/* Sheet list items */
.sheet-list { display: flex; flex-direction: column; }

.sheet-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #fff;
  border: none;
  border-bottom: 1px solid #f4f4f5;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: background 0.15s;
  min-height: 52px;
}
.sheet-list-item:last-child { border-bottom: none; }
.sheet-list-item:active { background: #f4f4f5; }
.sheet-list-item--selected { background: #fff5f5; border-color: #d70018; }

/* Sheet empty state */
.sheet-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px 16px;
  text-align: center;
}
.sheet-empty__icon { font-size: 48px; color: #a1a1aa; }
.sheet-empty__text { font-size: 14px; color: #71717a; margin: 0; }
```

---

## 5. Trạng Thái Hiện Tại

### ✅ Đã Hoàn Thành (tất cả phases)

| File | Nội dung |
|---|---|
| `layouts/default.vue` | Type N bottom clearance 4 breakpoints |
| `pages/cart/checkout.vue` | Type S bottom clearance + sticky bar awareness |
| `pages/cart/payment.vue` | Type S bottom clearance + sticky bar offset |
| `pages/cart/success.vue` | 7 breakpoints (Type N clearance) |
| `pages/policy/index.vue` | Type N bottom clearance |
| `pages/tos/index.vue` | Type N bottom clearance |
| `pages/warranty/index.vue` | Type N bottom clearance |
| `pages/orders/index.vue` | Type N bottom clearance |
| `pages/tradein/index.vue` | Type N bottom clearance |
| `pages/user-info/index.vue` | Type N bottom clearance |
| `pages/profile/index.vue` | Type N bottom clearance |
| `pages/account/vouchers.vue` | Type N bottom clearance |
| `pages/khuyen-mai/index.vue` | Type N bottom clearance |
| `pages/tin-tuc/index.vue` | Type N bottom clearance |
| `pages/lien-he/index.vue` | Type N bottom clearance |
| `pages/index.vue` | Type N bottom clearance |
| `pages/products/index.vue` | Thin wrapper - child components handle own styling |
| `pages/products/[slug].vue` | Thin wrapper - child components handle own styling |
| `components/Cart/CartPage.vue` | Type S bottom clearance |
| `components/Cart/CartStickyCheckoutBar.vue` | `bottom: 88px` on mobile |
| `components/Checkout/CheckoutStickyBar.vue` | `bottom: 88px` on mobile |
| `components/Checkout/CheckoutProgress.vue` | iPhone SE font (10px marker + label) |
| `components/Checkout/VoucherSection.vue` | Breakpoints 991.98/767.98/575.98px |
| `components/Checkout/AddressSection.vue` | Swiper padding + tap target |
| `components/Checkout/DeliveryOptions.vue` | Swiper padding + card size |
| `components/Checkout/OrderSummaryPanel.vue` | Mobile sticky order summary bar |
| `components/Cart/CartSummary.vue` | Bottom clearance + responsive mobile CSS |
| `components/Cart/CartItemRow.vue` | 575.98/480px responsive CSS |
| `components/Products/ProductDetail/ProductDetailPage.vue` | 990px gap fix |
| `components/Products/ProductDetail/ProductDetailLeft.vue` | 540px gallery max-height 220px |
| `components/Products/ProductDetail/ProductSuggest.vue` | 575.98/480px card polish CSS |
| `components/Products/ProductList/ProductList.vue` | Sticky filter z-index 120 at 991.98px |
| `components/Home/HomeHero.vue` | Hero image + promo banner responsive CSS |
| `components/Home/HomeProdSection.vue` | Swiper nav bottom:100px + strip CSS |
| `components/Home/HomeProdCard.vue` | 480px font size fix |
| `components/Home/CategoryMegaMenu.vue` | Overflow fix 991.98/575.98px |
| `components/Sidebar/CustomerSidebar.vue` | Bottom nav + FAB architecture |
| `public/assets/css/responsive.css` | Global CSS utilities |
| `nuxt.config.ts` | Import responsive.css |

---

## 6. Chi Tiết Từng Phase

### Phase 1: Profile Pages — Hoàn Thiện Bottom Clearance

> 5 pages. Thêm wrapper div + Type N CSS. Mỗi page cần wrapper `<div class="xxx-page">` bọc toàn bộ template content.

#### 1.1 `pages/warranty/index.vue`

Thêm closing tag + CSS:

```css
/* Cuối <style scoped> */
@media (max-width: 991.98px) {
  .warranty-page { padding-bottom: 110px; }
}
@media (max-width: 767.98px) {
  .warranty-page { padding-bottom: 100px; }
}
@media (max-width: 575.98px) {
  .warranty-page { padding-bottom: 90px; }
}
@media (max-width: 480px) {
  .warranty-page { padding-bottom: 80px; }
}
```

#### 1.2 `pages/orders/index.vue`

Thêm `<div class="orders-page">` wrapper + CSS Type N.

#### 1.3 `pages/tradein/index.vue`

Thêm `<div class="tradein-page">` wrapper + CSS Type N.

#### 1.4 `pages/user-info/index.vue`

Thêm `<div class="user-info-page">` wrapper + CSS Type N.

#### 1.5 `pages/profile/index.vue`

Thêm `<div class="profile-page">` wrapper + CSS Type N.

---

### Phase 2: Standalone Pages — Bottom Clearance

> 7 pages. Verify/cập nhật bottom clearance.

#### 2.1 `pages/account/vouchers.vue` — Verify Type N

```css
@media (max-width: 991.98px) {
  .voucher-history-page { padding-bottom: 110px; }
}
@media (max-width: 767.98px) {
  .voucher-history-page { padding-bottom: 100px; }
}
@media (max-width: 575.98px) {
  .voucher-history-page { padding-bottom: 90px; }
}
@media (max-width: 480px) {
  .voucher-history-page { padding-bottom: 80px; }
}
```

#### 2.2 `pages/khuyen-mai/index.vue` — Verify Type N

```css
@media (max-width: 991.98px) {
  .promotion-page { padding-bottom: 110px; }
}
@media (max-width: 767.98px) {
  .promotion-page { padding-bottom: 100px; }
}
@media (max-width: 575.98px) {
  .promotion-page { padding-bottom: 90px; }
}
@media (max-width: 480px) {
  .promotion-page { padding-bottom: 80px; }
}
```

#### 2.3 `pages/tin-tuc/index.vue` — Verify Type N

```css
@media (max-width: 991.98px) {
  .news-page { padding-bottom: 110px; }
}
@media (max-width: 767.98px) {
  .news-page { padding-bottom: 100px; }
}
@media (max-width: 575.98px) {
  .news-page { padding-bottom: 90px; }
}
@media (max-width: 480px) {
  .news-page { padding-bottom: 80px; }
}
```

#### 2.4 `pages/lien-he/index.vue` — Verify Type N

```css
@media (max-width: 991.98px) {
  .contact-page { padding-bottom: 110px; }
}
@media (max-width: 767.98px) {
  .contact-page { padding-bottom: 100px; }
}
@media (max-width: 575.98px) {
  .contact-page { padding-bottom: 90px; }
}
@media (max-width: 480px) {
  .contact-page { padding-bottom: 80px; }
}
```

#### 2.5 `pages/policy/index.vue` — Verify Type N

```css
@media (max-width: 991.98px) {
  .policy-page { padding-bottom: 110px; }
}
@media (max-width: 767.98px) {
  .policy-page { padding-bottom: 100px; }
}
@media (max-width: 575.98px) {
  .policy-page { padding-bottom: 90px; }
}
@media (max-width: 480px) {
  .policy-page { padding-bottom: 80px; }
}
```

#### 2.6 `pages/tos/index.vue` — Verify Type N

```css
@media (max-width: 991.98px) {
  .tos-page { padding-bottom: 110px; }
}
@media (max-width: 767.98px) {
  .tos-page { padding-bottom: 100px; }
}
@media (max-width: 575.98px) {
  .tos-page { padding-bottom: 90px; }
}
@media (max-width: 480px) {
  .tos-page { padding-bottom: 80px; }
}
```

#### 2.7 `pages/cart/success.vue` — Verify Type N

```css
@media (max-width: 991.98px) {
  .order-success-page { padding-bottom: 110px; }
}
@media (max-width: 767.98px) {
  .order-success-page { padding-bottom: 100px; }
}
@media (max-width: 575.98px) {
  .order-success-page { padding-bottom: 90px; }
}
@media (max-width: 480px) {
  .order-success-page { padding-bottom: 80px; }
}
```

---

### Phase 3: Products Pages — Responsive Từ Đầu

#### 3.1 `pages/products/index.vue` — ProductList Page

**Trạng thái:** Không có `<style scoped>`.

Thêm responsive cho page wrapper:

```css
/* === pages/products/index.vue — THÊM <style scoped> === */

.products-page {
  padding: 18px 0;
}

@media (max-width: 991.98px) {
  .products-page {
    padding-bottom: 110px;
  }
}

@media (max-width: 767.98px) {
  .products-page {
    padding-bottom: 100px;
  }
}

@media (max-width: 575.98px) {
  .products-page {
    padding-bottom: 90px;
  }
}

@media (max-width: 480px) {
  .products-page {
    padding-bottom: 80px;
  }
}
```

**BottomSheet cho Filter + Sort (mobile):**

```vue
<!-- Trong component ProductList -->
<BottomSheet ref="filterSheet">
  <template #default="{ close }">
    <div class="sheet-header">
      <h3 class="sheet-header__title">Bộ lọc</h3>
      <button class="sheet-header__close" @click="close"><i class="bi bi-x-lg"></i></button>
    </div>
    <!-- Filter content -->
  </template>
</BottomSheet>

<BottomSheet ref="sortSheet">
  <template #default="{ close }">
    <div class="sheet-header">
      <h3 class="sheet-header__title">Sắp xếp</h3>
      <button class="sheet-header__close" @click="close"><i class="bi bi-x-lg"></i></button>
    </div>
    <!-- Sort options -->
  </template>
</BottomSheet>

<!-- Mobile trigger buttons (hiện trên mobile) -->
<button class="filter-toggle-btn d-md-none" @click="filterSheet.open()">
  <i class="bi bi-sliders"></i> Bộ lọc
</button>
<button class="sort-toggle-btn d-md-none" @click="sortSheet.open()">
  <i class="bi bi-arrow-down-up"></i> Sắp xếp
</button>
```

```css
.filter-toggle-btn,
.sort-toggle-btn {
  display: none;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #18181b;
  cursor: pointer;
}

@media (max-width: 767.98px) {
  .filter-toggle-btn,
  .sort-toggle-btn {
    display: inline-flex;
  }
}
```

#### 3.2 `pages/products/[slug].vue` — Product Detail Page

**Trạng thái:** Không có `<style scoped>`.

```css
/* === pages/products/[slug].vue — THÊM <style scoped> === */

.product-detail-page {
  padding: 18px 0;
}

@media (max-width: 991.98px) {
  .product-detail-page {
    padding-bottom: 110px;
  }
}

@media (max-width: 767.98px) {
  .product-detail-page {
    padding-bottom: 100px;
  }
}

@media (max-width: 575.98px) {
  .product-detail-page {
    padding-bottom: 90px;
  }
}

@media (max-width: 480px) {
  .product-detail-page {
    padding-bottom: 80px;
  }
}
```

---

### Phase 4: Home Page — Responsive Từ Đầu

#### 4.1 `pages/index.vue`

**Trạng thái:** Có `<style scoped>` nhưng không có breakpoints.

Thêm responsive:

```css
/* === pages/index.vue — THÊM vào cuối <style scoped> === */

@media (max-width: 991.98px) {
  .home-page {
    padding-bottom: 110px;
  }
}

@media (max-width: 767.98px) {
  .home-page {
    padding-bottom: 100px;
  }
}

@media (max-width: 575.98px) {
  .home-page {
    padding-bottom: 90px;
  }
}

@media (max-width: 480px) {
  .home-page {
    padding-bottom: 80px;
  }
}
```

---

### Phase 5: BottomSheet Integration — Checkout Flow

#### 5.1 `components/Checkout/AddressSection.vue`

Thêm BottomSheet cho address selection trên mobile:

```vue
<!-- Trong AddressSection.vue -->
<BottomSheet ref="addressSheet">
  <template #default="{ close }">
    <div class="sheet-header">
      <h3 class="sheet-header__title">{{ $t('checkout.selectAddress') }}</h3>
      <button class="sheet-header__close" @click="close"><i class="bi bi-x-lg"></i></button>
    </div>
    <div class="sheet-list">
      <button
        v-for="address in addresses"
        :key="address.id"
        class="sheet-list-item sheet-list-item--selected"
        @click="selectAddress(address); close()"
      >
        <!-- Address item content -->
      </button>
    </div>
    <!-- Add new address button -->
  </template>
</BottomSheet>
```

#### 5.2 `components/Checkout/DeliveryOptions.vue`

BottomSheet cho delivery options trên mobile:

```vue
<BottomSheet ref="deliverySheet">
  <template #default="{ close }">
    <div class="sheet-header">
      <h3 class="sheet-header__title">Hình thức giao hàng</h3>
      <button class="sheet-header__close" @click="close"><i class="bi bi-x-lg"></i></button>
    </div>
    <div class="sheet-list">
      <button
        v-for="option in deliveryOptions"
        :key="option.id"
        class="sheet-list-item"
        :class="{ 'sheet-list-item--selected': option.id === selected }"
        @click="selectOption(option); close()"
      >
        {{ option.name }}
      </button>
    </div>
  </template>
</BottomSheet>
```

#### 5.3 `components/Checkout/VoucherSection.vue`

BottomSheet cho voucher selection trên mobile.

---

### Phase 6: BottomSheet Integration — ProductDetail

#### 6.1 `components/Products/ProductDetail/ProductBlockOrder.vue`

Add to Cart sheet — BottomSheet behavior trên mobile:

```vue
<!-- ProductBlockOrder.vue -->
<!-- Trên mobile: nút "Mua ngay" / "Thêm vào giỏ" mở BottomSheet thay vì inline form -->
<BottomSheet ref="orderSheet">
  <template #default="{ close }">
    <div class="sheet-header">
      <h3 class="sheet-header__title">Thêm vào giỏ hàng</h3>
      <button class="sheet-header__close" @click="close"><i class="bi bi-x-lg"></i></button>
    </div>
    <div class="sheet-content">
      <!-- Quantity selector + Add to cart button -->
    </div>
  </template>
</BottomSheet>
```

```css
@media (max-width: 767.98px) {
  .product-block-order__inline-form {
    display: none;
  }
  .product-block-order__mobile-trigger {
    display: flex;
  }
}

@media (min-width: 768px) {
  .product-block-order__mobile-trigger {
    display: none;
  }
  .product-block-order__inline-form {
    display: flex;
  }
}
```

---

### Phase 7: Global CSS Utilities

#### 7.1 Tạo `public/assets/css/responsive.css`

```css
/* ============================================
   responsive.css — Global Responsive Utilities
   IrusGear Frontend v3.0
   ============================================ */

/* ── Custom Properties ──────────────────────── */
:root {
  /* Bottom clearance */
  --nav-height:       88px;
  --clearance-n-tb:   110px;
  --clearance-n-mb:   100px;
  --clearance-n-ph:   90px;
  --clearance-n-sm:   80px;
  --clearance-s-tb:   170px;
  --clearance-s-mb:   160px;
  --clearance-s-ph:   145px;
  --clearance-s-sm:   130px;
  --sticky-offset:    88px;

  /* Border Radius */
  --radius-xs:  8px;
  --radius-sm:  10px;
  --radius-md:  12px;
  --radius-lg:  14px;
  --radius-xl:  18px;
  --radius-pill: 9999px;

  /* Spacing */
  --pad-sm:  10px;
  --pad-md:  14px;
  --pad-lg:  16px;
  --pad-xl:  20px;
  --pad-2xl: 28px;
}

/* ── Scrollbar Reset ────────────────────────── */
* { scrollbar-width: thin; scrollbar-color: #e4e4e7 transparent; }
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 999px; }
::-webkit-scrollbar-track { background: transparent; }

/* ── Horizontal Scroll ─────────────────────── */
.scroll-x {
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.scroll-x::-webkit-scrollbar { display: none; }

/* ── Text Truncation ───────────────────────── */
.text-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.text-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.text-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Bottom Clearance Utilities ─────────────── */
.clearance-n {
  padding-bottom: var(--clearance-n-tb);
}
@media (max-width: 767.98px) { .clearance-n { padding-bottom: var(--clearance-n-mb); } }
@media (max-width: 575.98px) { .clearance-n { padding-bottom: var(--clearance-n-ph); } }
@media (max-width: 480px)    { .clearance-n { padding-bottom: var(--clearance-n-sm); } }

.clearance-s {
  padding-bottom: var(--clearance-s-tb);
}
@media (max-width: 767.98px) { .clearance-s { padding-bottom: var(--clearance-s-mb); } }
@media (max-width: 575.98px) { .clearance-s { padding-bottom: var(--clearance-s-ph); } }
@media (max-width: 480px)    { .clearance-s { padding-bottom: var(--clearance-s-sm); } }

/* ── BottomSheet Shared Styles ─────────────── */
.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #ececf1;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 1;
}
.sheet-header__title {
  font-size: 16px;
  font-weight: 700;
  color: #18181b;
  margin: 0;
}
.sheet-header__close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #71717a;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}
.sheet-header__close:hover { background: #f4f4f5; color: #18181b; }

.sheet-list { display: flex; flex-direction: column; }
.sheet-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #fff;
  border: none;
  border-bottom: 1px solid #f4f4f5;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: background 0.15s;
  min-height: 52px;
}
.sheet-list-item:last-child { border-bottom: none; }
.sheet-list-item:active { background: #f4f4f5; }
.sheet-list-item--selected { background: #fff5f5; border-color: #d70018; }

.sheet-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px 16px;
  text-align: center;
}
.sheet-empty__icon { font-size: 48px; color: #a1a1aa; }
.sheet-empty__text { font-size: 14px; color: #71717a; margin: 0; }

/* ── Mobile Visibility ──────────────────────── */
@media (max-width: 575.98px) {
  .hide-mobile       { display: none !important; }
  .show-mobile-only  { display: block !important; }
}
@media (max-width: 767.98px) {
  .hide-mobile-sm   { display: none !important; }
}
@media (max-width: 991.98px) {
  .hide-tablet       { display: none !important; }
  .show-tablet-only  { display: block !important; }
}
@media (min-width: 992px) {
  .hide-desktop      { display: none !important; }
}

/* ── Tap Target ─────────────────────────────── */
.tap-target {
  min-height: 44px;
  min-width: 44px;
}
```

#### 7.2 Import Trong `nuxt.config.ts`

```typescript
// nuxt.config.ts
css: [
  'bootstrap/dist/css/bootstrap.min.css',
  '@/public/assets/css/toast.css',
  '@/public/assets/css/responsive.css',  // ← Thêm dòng này
],
```

---

## 7. Thứ Tự Triển Khai

### Phase 1 — Profile Pages Bottom Clearance (5 files)
| STT | Task | File |
|---|---|---|
| 1 | Hoàn thiện warranty page | `pages/warranty/index.vue` |
| 2 | orders page wrapper + clearance | `pages/orders/index.vue` |
| 3 | tradein page wrapper + clearance | `pages/tradein/index.vue` |
| 4 | user-info page wrapper + clearance | `pages/user-info/index.vue` |
| 5 | profile page wrapper + clearance | `pages/profile/index.vue` |

### Phase 2 — Standalone Pages Bottom Clearance (7 files)
| STT | Task | File |
|---|---|---|
| 6 | Verify vouchers page | `pages/account/vouchers.vue` |
| 7 | Verify khuyen-mai page | `pages/khuyen-mai/index.vue` |
| 8 | Verify tin-tuc page | `pages/tin-tuc/index.vue` |
| 9 | Verify lien-he page | `pages/lien-he/index.vue` |
| 10 | Verify policy page | `pages/policy/index.vue` |
| 11 | Verify tos page | `pages/tos/index.vue` |
| 12 | Verify cart/success page | `pages/cart/success.vue` |

### Phase 3 — Products Pages Responsive (2 files)
| STT | Task | File | Notes |
|---|---|---|---|
| 13 | ProductList page + BottomSheet filter/sort | `pages/products/index.vue` | BottomSheet integration |
| 14 | ProductDetail page responsive | `pages/products/[slug].vue` | Type N clearance |

### Phase 4 — Home Page Responsive (1 file)
| STT | Task | File |
|---|---|---|
| 15 | Home page bottom clearance | `pages/index.vue` |

### Phase 5 — BottomSheet Checkout Integration (3 components)
| STT | Component | File |
|---|---|---|
| 16 | AddressSection BottomSheet | `components/Checkout/AddressSection.vue` |
| 17 | DeliveryOptions BottomSheet | `components/Checkout/DeliveryOptions.vue` |
| 18 | VoucherSection BottomSheet | `components/Checkout/VoucherSection.vue` |

### Phase 6 — BottomSheet ProductDetail Integration (1 component)
| STT | Component | File |
|---|---|---|
| 19 | ProductBlockOrder Add-to-Cart Sheet | `components/Products/ProductDetail/ProductBlockOrder.vue` |

### Phase 7 — Global CSS (2 tasks)
| STT | Task |
|---|---|
| 20 | Tạo `public/assets/css/responsive.css` |
| 21 | Import trong `nuxt.config.ts` |

### Phase 8 — QA & Polish
| STT | Task |
|---|
| 22 | Test bottom clearance tất cả pages |
| 23 | Test sticky bars không bị che bởi nav |
| 24 | Test BottomSheet mở/đóng trên mobile |
| 25 | Test FAB open không conflict với sticky bars |
| 26 | Test scroll-x overflow trên tabs/chips |
| 27 | Test tap target ≥44px |
| 28 | Test font readability từng breakpoint |

---

## 9. Component Responsive Details

### 9.1 Tổng Quan Component

**Tổng số components:** 73

| Nhóm | Số lượng | Đã có breakpoints | Cần làm |
|---|---|---|---|
| Cart | 7 | 6 | 1 (CartSummary) |
| Checkout | 12 | 10 | 2 (VoucherSection, PaymentMethodList) |
| Products | 15 | 10 | 5 |
| Home | 14 | 8 | 6 |
| Sidebar | 2 | 2 | 0 |
| Common | 5 | 1 | 4 |
| Icons | 5 | 0 | 0 |
| Models | 4 | 0 | 0 |
| Breadcrumb | 1 | 0 | 0 |
| Skeleton | 2 | 0 | 0 |
| Footer | 1 | 0 | 0 |
| Admin | 6 | 1 | 5 |

---

### 9.2 ProductDetail — 🔴 Cao Priority

#### 9.2.1 `ProductDetailPage.vue` — Kiểm Tra Mobile Flow

**File:** [ProductDetailPage.vue](components/Products/ProductDetail/ProductDetailPage.vue)

**Trạng thái:** `<style>` global (không scoped), đã có breakpoints.

**Vấn đề tiềm ẩn:**
- Desktop sticky positioning (`top: 88px`) bị remove trên mobile — cần verify không có layout break
- `.mobile-info-trigger` hiện tại `<=768px` — mở `MobileProductInfoSheet`
- **Gap nguy hiểm:** Desktop floating bar ẩn tại `991px`, mobile button hiện tại tại `768px` → **người dùng tablet 769px–990px không có nút mua**

**Cần làm:**
```css
/* Verify trong <style> global — không có scoped nên cẩn thận */
@media (max-width: 990px) {
  .block-order-desktop {
    display: none; /* Đã có */
  }
  .mobile-info-trigger {
    display: flex !important; /* Đã có tại 768px */
  }
}

/* ⚠️ Thêm gap fix: hiện mobile trigger ở 991px thay vì 768px */
@media (max-width: 990px) {
  .mobile-info-trigger {
    display: flex !important;
  }
}
```

---

#### 9.2.2 `ProductDetailLeft.vue` — Gallery + Specs Mobile

**File:** [ProductDetailLeft.vue](components/Products/ProductDetail/ProductDetailLeft.vue)

**Trạng thái:** Có scoped style, nhiều breakpoints.

**Breakpoints hiện tại:**
- `1199px`: `.box-header__bottom` gap 20px→8px
- `990px`: left column width 50%
- `768px`: **desktop header ẩn hoàn toàn** (`display: none !important`)
- `540px`: gallery height 220px, image width 50%

**Cần làm:**
```css
/* Thêm vào cuối <style scoped> */

/* Desktop header ẩn → mobile header (nếu chưa có) */
@media (max-width: 767.98px) {
  .box-header-desktop {
    display: none !important;
  }

  .box-gallery .desktop {
    display: none !important;
  }

  /* Mobile info phải hiển thị qua MobileProductInfoSheet */
}

/* Gallery height adjustments */
@media (max-width: 575.98px) {
  .box-gallery .gallery-product-detail {
    max-height: 260px;
  }
}

@media (max-width: 480px) {
  .box-gallery .gallery-product-detail {
    max-height: 220px;
  }

  .box-header__bottom {
    font-size: 10px;
    gap: 4px;
  }
}
```

---

#### 9.2.3 `ProductBlockOrder.vue` — Desktop Bar, Cần Mobile Sheet

**File:** [ProductBlockOrder.vue](components/Products/ProductDetail/ProductBlockOrder.vue)

**Trạng thái:** Có scoped style, `.block-order-desktop` ẩn tại `990px`.

**Vấn đề:**
- Desktop bar ẩn tại `990px` — tablet 769-990px không có cách mua hàng
- Mobile sheet (`MobileProductInfoSheet`) được trigger từ `ProductDetailPage` tại `768px`
- **Lỗ hổng 769-990px** cần được fix

**Cần làm:**
```css
/* === ProductBlockOrder.vue — CẬP NHẬT === */

/* Hiện tại: .block-order-desktop hidden @ 990px
   Fix: vẫn ẩn @ 990px, nhưng ProductDetailPage.mobile-info-trigger
   phải hiện @ 991px thay vì 768px */

@media (max-width: 990px) {
  .block-order-desktop {
    display: none;
  }
}

/* Mobile trigger chỉ hiện khi desktop bar ẩn */
@media (min-width: 769px) and (max-width: 990px) {
  .block-order-desktop,
  .mobile-info-trigger {
    /* Cân nhắc: hiện compact bar cho tablet range */
    /* Hoặc giữ nguyên — ProductDetailPage tự xử lý */
  }
}
```

---

#### 9.2.4 `ProductSuggest.vue` — Combo/Upsell Swiper

**File:** [ProductSuggest.vue](components/Products/ProductDetail/ProductSuggest.vue)

**Trạng thái:** Có scoped style, có Swiper breakpoints.

**Breakpoints hiện có:**
- `540px`: padding, font, image size giảm
- Swiper JS: `0px` → 1 slide, `576px` → 2 slides

**Cần làm:**
```css
/* === ProductSuggest.vue — THÊM === */

@media (max-width: 480px) {
  .upsell-item-wrapper,
  .item-wrapper {
    padding: 8px 10px;
  }

  .upsell-item-image,
  .item-image {
    width: 52px !important;
    height: 52px !important;
  }

  .product__price--show {
    font-size: 13px;
  }
}

/* Verify tap target */
@media (max-width: 575.98px) {
  .item-action .btn {
    min-height: 36px;
    padding: 6px 12px;
    font-size: 12px;
  }
}
```

---

#### 9.2.5 `ProductContentLeft.vue` — Description Collapsible

**File:** [ProductContentLeft.vue](components/Products/ProductDetail/ProductContentLeft.vue)

**Trạng thái:** Có scoped style, đã có breakpoints.

**Breakpoints hiện có:**
- `768px`: TOC font shrink
- `899px`: content card typography shrink

**Cần làm:** Verify `.irus-btn-showmore-wrapper` (fade gradient + expand button) hoạt động tốt trên mobile. Không cần thay đổi nếu đã responsive.

---

#### 9.2.6 `ProductContentRight.vue` — News/Tips Grid

**File:** [ProductContentRight.vue](components/Products/ProductDetail/ProductContentRight.vue)

**Trạng thái:** Có scoped style, đã có breakpoints.

**Breakpoints hiện có:**
- `540px`: grid 1-col→2-col, items stacked

**Cần làm:** Verify card image + text stacking tại 540px. Nếu hình ảnh quá lớn, thêm:

```css
@media (max-width: 480px) {
  .sforum__content-item .sforum__thumb {
    height: 120px;
  }
}
```

---

### 9.3 ProductList — 🔴 Cao Priority

#### 9.3.1 `ProductList.vue` — Sticky Filter + Grid

**File:** [ProductList.vue](components/Products/ProductList/ProductList.vue)

**Trạng thái:** Có scoped style, đã có breakpoints mạnh.

**Breakpoints hiện có:**
- `768px`: 5-col→3-col grid, filter chips reflow, sort stacks
- `540px`: 3-col→2-col grid, mega dropdown 2-col→1-col

**Vấn đề:**
- `.sticky-filter-bar` (fixed, z-index 60) có thể bị che bởi mobile bottom nav
- Mega dropdown grid reflow có thể cramped tại 768px

**Cần làm:**
```css
/* === ProductList.vue — CẬP NHẬT sticky filter bar === */

@media (max-width: 991.98px) {
  .sticky-filter-bar {
    top: 0; /* Hoặc padding-top của page header */
    z-index: 120; /* Cao hơn nav 1050 khi scroll */
  }
}

/* Verify mega dropdown không bị truncate trên tablet */
@media (max-width: 767.98px) {
  .product-filter-mega-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }
}

@media (max-width: 575.98px) {
  .product-filter-mega-grid {
    grid-template-columns: 1fr;
  }

  .product-filter-mega-grid .mega-filter-item {
    min-height: 44px;
    padding: 10px 12px;
  }
}
```

---

### 9.4 Home Components — 🔴 Cao / 🟡 Trung

#### 9.4.1 `HomeHero.vue` — Banner + Category Sidebar

**File:** [HomeHero.vue](components/Home/HomeHero.vue)

**Trạng thái:** Có scoped style, đã có breakpoints.

**Breakpoints hiện có:**
- `1399.98px`: cat-item height, hero image height 414→340px
- `991.98px`: hero image height 320px

**Vấn đề:**
- Category sidebar `.hero-category-wrap` (`d-none d-lg-flex`) ẩn trên mobile — user phải dùng CustomerSidebar
- Service panel `.service-panel` (`d-none d-xl-flex`) ẩn dưới xl

**Cần làm:**
```css
/* === HomeHero.vue — THÊM === */

/* Promo banner đảm bảo responsive */
@media (max-width: 575.98px) {
  .promo-banner-list {
    gap: 8px;
  }

  .promo-banner-item {
    min-height: 60px;
  }

  .promo-banner-item img {
    border-radius: 8px;
  }
}

/* Hero image không bị crop quá nhiều */
@media (max-width: 767.98px) {
  .hero-slide-image {
    height: 280px !important;
    object-fit: cover;
  }
}

@media (max-width: 480px) {
  .hero-slide-image {
    height: 220px !important;
  }
}
```

---

#### 9.4.2 `HomeProdSection.vue` — Product Grid + Swiper

**File:** [HomeProdSection.vue](components/Home/HomeProdSection.vue)

**Trạng thái:** Có scoped style, đã có breakpoints.

**Breakpoints hiện có:**
- `768px`: grid reflow, `d-md-inline-flex` cho view-all button
- `1200px`: button sizes, feature chip widths

**Cần làm:**
```css
/* === HomeProdSection.vue — THÊM === */

/* Product grid trên mobile nhỏ */
@media (max-width: 575.98px) {
  .product-strip {
    gap: 10px;
  }

  .feature-strip {
    gap: 6px;
  }

  .feature-chip {
    font-size: 12px;
    padding: 6px 10px;
    min-height: 32px;
  }
}

@media (max-width: 480px) {
  .brand-strip-track {
    gap: 6px;
  }

  .brand-pill {
    font-size: 11px;
    padding: 4px 10px;
  }

  .view-all-btn {
    font-size: 12px;
    padding: 8px 14px;
  }
}

/* Verify swiper navigation không bị che bởi bottom nav */
@media (max-width: 991.98px) {
  .product-swiper-button-prev,
  .product-swiper-button-next {
    top: auto;
    bottom: 100px; /* Đẩy lên trên bottom nav */
  }
}
```

---

#### 9.4.3 `HomeProdCard.vue` — Product Card

**File:** [HomeProdCard.vue](components/Home/HomeProdCard.vue)

**Trạng thái:** Có scoped style, có breakpoint 359.98px.

**Breakpoint hiện có:**
- `359.98px`: `.bottom-row` flex-direction row→column

**Cần làm:**
```css
/* === HomeProdCard.vue — THÊM === */

@media (max-width: 480px) {
  .prod-name {
    font-size: 12px;
    -webkit-line-clamp: 2;
  }

  .prod-price {
    font-size: 13px;
  }

  .bottom-row {
    align-items: flex-start;
  }
}
```

---

#### 9.4.4 `HomeAccessoryGrid.vue` & `HomeUsedGoodsGrid.vue`

**Trạng thái:** Có scoped style, đã có breakpoints (576px, 768px).

**Cần làm:** Verify grid reflow 3→4→6 columns. Không cần thay đổi nếu đã hoạt động.

---

#### 9.4.5 `CategoryMegaMenu.vue`

**File:** [CategoryMegaMenu.vue](components/Home/CategoryMegaMenu.vue)

**Trạng thái:** Có scoped style, có breakpoint 1399.98px.

**Vấn đề:** Mega menu panel `clamp()` widths có thể overflow trên tablet nhỏ.

**Cần làm:**
```css
/* === CategoryMegaMenu.vue — THÊM === */

@media (max-width: 991.98px) {
  .mega-menu-panel {
    width: min(720px, calc(100vw - 40px)) !important;
    max-height: 70vh;
    overflow-y: auto;
  }

  .mega-menu-columns {
    column-gap: 16px;
  }
}

@media (max-width: 575.98px) {
  .mega-menu-panel {
    width: calc(100vw - 32px) !important;
  }

  .mega-menu-item {
    font-size: 13px;
    padding: 8px 0;
  }
}
```

---

### 9.5 Checkout Components — 🟡 Trung / 🔴 Cao

#### 9.5.1 `OrderSummaryPanel.vue` — 🔴 CRITICAL

**File:** [OrderSummaryPanel.vue](components/Checkout/OrderSummaryPanel.vue)

**Trạng thái:** Có scoped style, `.checkout-summary` ẩn tại `991.98px`.

**Vấn đề nghiêm trọng:** Panel bị `display: none` trên tablet/mobile — user không thấy tổng đơn hàng hoặc nút đặt hàng.

**Cần làm:** Tạo mobile sticky bar thay thế:

```vue
<!-- THÊM vào cuối template OrderSummaryPanel.vue -->

<!-- Mobile sticky order summary bar -->
<div class="order-summary-mobile d-lg-none">
  <div class="order-summary-mobile__toggle" @click="expanded = !expanded">
    <div class="order-summary-mobile__preview">
      <span>{{ $t("checkout.orderSummary") }}</span>
      <strong class="text-danger">{{ checkoutStore.finalTotal?.formatted }}</strong>
    </div>
    <i :class="expanded ? 'bi bi-chevron-down' : 'bi bi-chevron-up'"></i>
  </div>

  <div v-if="expanded" class="order-summary-mobile__body">
    <dl class="order-summary-mobile__pricing">
      <div class="order-summary-mobile__row">
        <dt>{{ $t("checkout.subtotal") }}</dt>
        <dd>{{ checkoutStore.subtotal?.formatted }}</dd>
      </div>
      <div v-if="checkoutStore.savings?.value > 0" class="order-summary-mobile__row">
        <dt>{{ $t("checkout.discount") }}</dt>
        <dd class="text-success">-{{ checkoutStore.savings?.formatted }}</dd>
      </div>
      <div v-if="checkoutStore.voucherDiscount?.value > 0" class="order-summary-mobile__row">
        <dt>{{ $t("checkout.voucher") }}</dt>
        <dd class="text-success">-{{ checkoutStore.voucherDiscount?.formatted }}</dd>
      </div>
      <div class="order-summary-mobile__row">
        <dt>{{ $t("checkout.deliveryFee") }}</dt>
        <dd>{{ checkoutStore.finalDeliveryFee > 0 ? formatMoney(checkoutStore.finalDeliveryFee) : $t("checkout.free") }}</dd>
      </div>
      <div class="order-summary-mobile__total">
        <strong>{{ $t("checkout.total") }}</strong>
        <strong class="text-danger">{{ checkoutStore.finalTotal?.formatted }}</strong>
      </div>
    </dl>
    <button type="button" class="order-summary-mobile__cta" :disabled="!checkoutStore.canSubmit" @click="$emit('submit')">
      {{ $t("checkout.placeOrder") }}
    </button>
  </div>
</div>
```

```css
/* === OrderSummaryPanel.vue — THÊM vào <style scoped> === */

/* Mobile sticky summary */
.order-summary-mobile {
  display: none;
  position: fixed;
  bottom: 88px; /* Trên mobile bottom nav */
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #ececf1;
  box-shadow: 0 -4px 20px rgba(15, 23, 42, 0.08);
  z-index: 110;
}

@media (max-width: 991.98px) {
  .order-summary-mobile {
    display: block;
  }
}

.order-summary-mobile__toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  background: #fafafa;
}

.order-summary-mobile__preview {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #18181b;
}

.order-summary-mobile__body {
  padding: 12px 16px 16px;
  border-top: 1px solid #ececf1;
}

.order-summary-mobile__pricing {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0 0 12px;
}

.order-summary-mobile__row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #71717a;
}

.order-summary-mobile__row dd {
  color: #18181b;
  font-weight: 600;
  margin: 0;
}

.order-summary-mobile__total {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  border-top: 1px solid #ececf1;
  padding-top: 8px;
  margin-top: 4px;
}

.order-summary-mobile__cta {
  width: 100%;
  background: #d70018;
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  min-height: 48px;
  cursor: pointer;
  transition: background 0.15s;
}

.order-summary-mobile__cta:hover:not(:disabled) {
  background: #b80015;
}

.order-summary-mobile__cta:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

#### 9.5.2 `AddressSection.vue` — Swiper Mobile

**File:** [AddressSection.vue](components/Checkout/AddressSection.vue)

**Trạng thái:** Có scoped style, swiper nav arrows ẩn tại 767.98px.

**Cần làm:** Verify fluid-width cards tại 575.98px. Thêm tap target:

```css
/* === AddressSection.vue — THÊM === */

@media (max-width: 575.98px) {
  .address-swiper {
    padding: 10px 14px;
  }

  /* Ensure address card tap target */
  .address-card {
    min-height: 80px;
  }
}
```

---

#### 9.5.3 `DeliveryOptions.vue` — Swiper Mobile

**File:** [DeliveryOptions.vue](components/Checkout/DeliveryOptions.vue)

**Trạng thái:** Tương tự AddressSection.

**Cần làm:** Thêm BottomSheet trigger cho mobile (nếu swiper không đủ UX tốt):

```css
/* === DeliveryOptions.vue — THÊM === */

@media (max-width: 575.98px) {
  .delivery-option-card {
    min-height: 72px;
    padding: 12px 14px;
  }
}
```

---

#### 9.5.4 `VoucherSection.vue` — BottomSheet

**File:** [VoucherSection.vue](components/Checkout/VoucherSection.vue)

**Trạng thái:** Có scoped style, **không có breakpoints**.

**Cần làm:**
```css
/* === VoucherSection.vue — THÊM === */

@media (max-width: 991.98px) {
  .voucher-section__list {
    max-height: 240px;
  }
}

@media (max-width: 575.98px) {
  .voucher-section__list {
    max-height: 200px;
  }

  .voucher-input-wrapper {
    flex-direction: column;
    gap: 8px;
  }

  .voucher-input-wrapper input {
    width: 100%;
  }
}
```

**BottomSheet cho mobile (nếu cần):**
```vue
<!-- Thêm trigger button hiện trên mobile -->
<button class="voucher-mobile-trigger d-lg-none" @click="voucherSheet.open()">
  <i class="bi bi-ticket-perforated"></i> Chọn voucher
</button>

<BottomSheet ref="voucherSheet">
  <template #default="{ close }">
    <!-- Voucher list content -->
  </template>
</BottomSheet>
```

---

#### 9.5.5 `TrustBadges.vue` — Grid Stacking

**File:** [TrustBadges.vue](components/Checkout/TrustBadges.vue)

**Trạng thái:** Có scoped style, grid 2-col→1-col tại 575.98px.

**Cần làm:** Verify icon + text không bị truncate. Không cần thay đổi.

---

#### 9.5.6 `SecondaryContact.vue` — Form Stacking

**File:** [SecondaryContact.vue](components/Checkout/SecondaryContact.vue)

**Trạng thái:** Có scoped style, form stacking tại 575.98px.

**Cần làm:** Verify collapsible toggle hoạt động tốt trên mobile.

---

#### 9.5.7 `CheckoutProgress.vue` — Progress Bar

**File:** [CheckoutProgress.vue](components/Checkout/CheckoutProgress.vue)

**Trạng thái:** Có scoped style, label shrink tại 767.98px.

**Cần làm:** Verify 4-step grid không bị overflow trên iPhone SE:

```css
/* === CheckoutProgress.vue — THÊM === */

@media (max-width: 480px) {
  .checkout-progress__label {
    font-size: 10px !important;
    white-space: normal;
    line-height: 1.3;
  }

  .checkout-progress__marker {
    width: 24px !important;
    height: 24px !important;
    font-size: 10px !important;
  }

  .checkout-progress__connector {
    height: 2px;
  }
}
```

---

### 9.6 Cart Components — 🟡 Trung / 🔴 Cao

#### 9.6.1 `CartItemRow.vue` — Vertical Stack

**File:** [CartItemRow.vue](components/Cart/CartItemRow.vue)

**Trạng thái:** Có scoped style, card stack vertical tại 767.98px.

**Cần làm:** Verify với long product names + warning chips:

```css
/* === CartItemRow.vue — THÊM === */

@media (max-width: 575.98px) {
  .cart-item__name {
    font-size: 13px;
  }

  .cart-item__option-chips {
    flex-wrap: wrap;
    gap: 4px;
  }

  .cart-item__option-chip {
    font-size: 10px;
    padding: 2px 6px;
  }

  .cart-item__warning {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .cart-item__qty-control {
    gap: 4px;
  }

  .qty-btn {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }

  .qty-value {
    min-width: 28px;
    font-size: 13px;
  }
}
```

---

#### 9.6.2 `CartSummary.vue` — Sticky Sidebar

**File:** [CartSummary.vue](components/Cart/CartSummary.vue)

**Trạng thái:** Có scoped style, **không có breakpoints**.

**Vấn đề:** Sticky sidebar trên mobile có thể chiếm full width. Parent `CartPage.vue` đã xử lý grid layout.

**Cần làm:**
```css
/* === CartSummary.vue — THÊM === */

@media (max-width: 575.98px) {
  .cart-summary {
    padding: 14px;
  }

  .cart-summary__total-value {
    font-size: 18px;
  }
}
```

---

### 9.7 CustomerSidebar — 🔴 Cao

#### 9.7.1 `CustomerSidebar.vue` — Bottom Nav + FAB

**File:** [CustomerSidebar.vue](components/Sidebar/CustomerSidebar.vue)

**Trạng thái:** Đã có mobile bottom nav + FAB. Phức tạp nhất trong project.

**Breakpoints hiện có:**
- `1399.98px`: mega menu positions
- `991.98px`: border-radius adjustment
- `767.98px`: desktop header ẩn, mobile nav hiện, body padding

**Cần kiểm tra:**
- [ ] FAB toggle state không bị reset khi navigate
- [ ] Active states cho bottom nav items hoạt động đúng
- [ ] Language switcher trong vertical capsule hoạt động
- [ ] `body { padding-bottom: 88px }` không gây layout shift trên desktop
- [ ] Vertical capsule không đè lên sticky bars

**Thêm tap target cho nav items:**
```css
/* === CustomerSidebar.vue — CẬP NHẬT === */

@media (max-width: 767.98px) {
  .mobile-nav-item {
    min-width: 52px;
    padding: 8px 8px; /* Đã đủ 44px tap target */
  }

  /* Đảm bảo FAB không bị sticky bar che */
  .mobile-fab-btn {
    bottom: calc(88px + 16px); /* bottom nav + gap */
  }
}
```

---

### 9.8 Common Components — 🟢 Thấp

#### 9.8.1 `BottomSheet.vue` — Foundation (✅ Done)

**File:** [BottomSheet.vue](components/Common/BottomSheet.vue)

**Trạng thái:** Mobile-first, drag-to-close, touch events. Không cần thay đổi.

**Có thể cải thiện:**
```css
/* Optional: max-width cho phần content */
@media (min-width: 576px) {
  .sheet-panel {
    max-width: 480px;
    margin: 0 auto;
  }
}
```

---

### 9.9 ProductCard/Helpers — 🟡 Trung

#### 9.9.1 `HomeProdCard.vue` (see 9.4.3)
#### 9.9.2 `SkeletonCard.vue` — Loading Placeholder

**File:** `components/Products/SkeletonCard.vue`

**Trạng thái:** Không có scoped style.

**Cần làm:**
```vue
<!-- THÊM <style scoped> -->
<style scoped>
.skeleton-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-img {
  width: 100%;
  height: 176px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

.skeleton-text {
  height: 14px;
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-text--short { width: 60%; }
.skeleton-text--price { width: 40%; height: 16px; margin-top: 4px; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
```

---

### 9.10 Summary Bảng Component

| STT | Component | File | Priority | Trạng thái | Cần làm |
|---|---|---|---|---|---|
| 1 | ProductDetailPage | `components/Products/ProductDetail/ProductDetailPage.vue` | 🔴 Cao | Có style global | Fix gap 769-990px |
| 2 | ProductDetailLeft | `components/Products/ProductDetail/ProductDetailLeft.vue` | 🔴 Cao | Có breakpoints | Verify gallery mobile |
| 3 | ProductBlockOrder | `components/Products/ProductDetail/ProductBlockOrder.vue` | 🔴 Cao | Có breakpoints | Fix tablet gap |
| 4 | ProductSuggest | `components/Products/ProductDetail/ProductSuggest.vue` | 🟡 Trung | Có breakpoints | Font/image polish |
| 5 | ProductContentLeft | `components/Products/ProductDetail/ProductContentLeft.vue` | 🟡 Trung | Có breakpoints | Verify collapsible |
| 6 | ProductContentRight | `components/Products/ProductDetail/ProductContentRight.vue` | 🟡 Trung | Có breakpoints | Image size verify |
| 7 | ProductList | `components/Products/ProductList/ProductList.vue` | 🔴 Cao | Có breakpoints | Sticky filter z-index |
| 8 | HomeHero | `components/Home/HomeHero.vue` | 🔴 Cao | Có breakpoints | Hero image + banner |
| 9 | HomeProdSection | `components/Home/HomeProdSection.vue` | 🟡 Trung | Có breakpoints | Swiper nav position |
| 10 | HomeProdCard | `components/Home/HomeProdCard.vue` | 🟡 Trung | Có breakpoints | Text clamp verify |
| 11 | HomeAccessoryGrid | `components/Home/HomeAccessoryGrid.vue` | 🟢 Thấp | Có breakpoints | OK |
| 12 | HomeUsedGoodsGrid | `components/Home/HomeUsedGoodsGrid.vue` | 🟢 Thấp | Có breakpoints | OK |
| 13 | CategoryMegaMenu | `components/Home/CategoryMegaMenu.vue` | 🟡 Trung | Có breakpoints | Overflow fix |
| 14 | OrderSummaryPanel | `components/Checkout/OrderSummaryPanel.vue` | 🔴 Cao | Có breakpoints | Tạo mobile sticky bar |
| 15 | AddressSection | `components/Checkout/AddressSection.vue` | 🟡 Trung | Có breakpoints | Tap target verify |
| 16 | AddressCard | `components/Checkout/AddressCard.vue` | 🟡 Trung | Có breakpoints | OK |
| 17 | AddressForm | `components/Checkout/AddressForm.vue` | 🟡 Trung | Có breakpoints | OK |
| 18 | DeliveryOptions | `components/Checkout/DeliveryOptions.vue` | 🟡 Trung | Có breakpoints | Card size verify |
| 19 | VoucherSection | `components/Checkout/VoucherSection.vue` | 🟡 Trung | Không có BP | Thêm breakpoints |
| 20 | TrustBadges | `components/Checkout/TrustBadges.vue` | 🟢 Thấp | Có breakpoints | OK |
| 21 | SecondaryContact | `components/Checkout/SecondaryContact.vue` | 🟢 Thấp | Có breakpoints | OK |
| 22 | CheckoutProgress | `components/Checkout/CheckoutProgress.vue` | 🟡 Trung | Có breakpoints | Font size iPhone SE |
| 23 | CartItemRow | `components/Cart/CartItemRow.vue` | 🟡 Trung | Có breakpoints | Long name verify |
| 24 | CartSummary | `components/Cart/CartSummary.vue` | 🟡 Trung | Không có BP | Thêm breakpoints |
| 25 | CustomerSidebar | `components/Sidebar/CustomerSidebar.vue` | 🔴 Cao | Có breakpoints | FAB position verify |
| 26 | BottomSheet | `components/Common/BottomSheet.vue` | 🟢 Thấp | Có style | Optional max-width |
| 27 | SkeletonCard | `components/Products/SkeletonCard.vue` | 🟡 Trung | Không có style | Thêm scoped style |

---

## 10. Thứ Tự Triển Khai Đầy Đủ (Update)

> **Cập nhật:** 2026-05-08 — Tất cả phases đã hoàn thành ✅

### Phase 9 — ProductDetail Critical ✅
| STT | Task | File | Status |
|---|---|---|---|
| 29 | Fix tablet gap (769-990px) | `ProductDetailPage.vue` | ✅ |
| 30 | Create mobile sticky order summary | `OrderSummaryPanel.vue` | ✅ |

### Phase 10 — ProductDetail Medium ✅
| STT | Task | File | Status |
|---|---|---|---|
| 31 | ProductDetailLeft gallery mobile | `ProductDetailLeft.vue` | ✅ |
| 32 | ProductSuggest card polish | `ProductSuggest.vue` | ✅ |
| 33 | ProductContentRight image size | `ProductContentRight.vue` | ✅ (verify only) |
| 34 | CategoryMegaMenu overflow fix | `CategoryMegaMenu.vue` | ✅ |

### Phase 11 — Home + ProductList ✅
| STT | Task | File | Status |
|---|---|---|---|
| 35 | HomeHero banner responsive | `HomeHero.vue` | ✅ |
| 36 | HomeProdSection swiper nav position | `HomeProdSection.vue` | ✅ |
| 37 | ProductList sticky filter z-index | `ProductList.vue` | ✅ |
| 37b | HomeProdCard 480px font | `HomeProdCard.vue` | ✅ |
| 37c | CartItemRow 575/480px CSS | `CartItemRow.vue` | ✅ |

### Phase 12 — Checkout Components ✅
| STT | Task | File | Status |
|---|---|---|---|
| 38 | VoucherSection breakpoints | `VoucherSection.vue` | ✅ |
| 39 | CartSummary breakpoints | `CartSummary.vue` | ✅ |
| 40 | CheckoutProgress iPhone SE font | `CheckoutProgress.vue` | ✅ |

### Phase 13 — Helpers + Polish ✅
| STT | Task | File | Status |
|---|---|---|---|
| 41 | SkeletonCard scoped style | `SkeletonCard.vue` | ✅ |
| 42 | CustomerSidebar FAB position verify | `CustomerSidebar.vue` | ✅ |

---

## 11. Component QA Checklist

- [x] **ProductDetailPage:** Mua hàng works ở mọi breakpoint (375px → 1920px) ✅
- [x] **OrderSummaryPanel:** Mobile sticky bar hiện đúng, không bị che, CTA hoạt động ✅
- [x] **ProductBlockOrder:** Không có gap ở 769-990px ✅
- [x] **HomeHero:** Banner images scale đúng, category sidebar ẩn on mobile ✅
- [x] **ProductList:** Sticky filter bar không bị mobile nav che, z-index đúng ✅
- [x] **CustomerSidebar:** FAB không đè lên sticky bars, active states đúng ✅
- [x] **CartItemRow:** Long names + warnings + options không overflow ✅
- [x] **BottomSheet:** Opens, drag works, backdrop closes, content scrollable ✅
- [x] **Swiper carousels:** Navigation arrows ẩn trên mobile, touch swipe hoạt động ✅
- [ ] **iOS Safari:** `position: sticky` hoạt động đúng, no layout shift
- [ ] **375px (iPhone SE):** Font sizes, spacing, tap ≥44px, bottom = 80px (N) / 130px (S)
- [ ] **390px (iPhone Pro):** Tương tự SE, bottom = 90px (N) / 145px (S)
- [ ] **430px (iPhone Plus):** Line breaks, bottom = 90px (N) / 145px (S)
- [ ] **768px (iPad Mini):** Grid 2-col, bottom = 100px (N) / 160px (S)
- [ ] **834px (iPad Air):** Bottom = 110px (N) / 170px (S)
- [ ] **≥992px:** No bottom clearance, sidebar visible
- [ ] **Scroll areas:** Horizontal scrollbar hidden, `-webkit-overflow-scrolling: touch`
- [ ] **Images:** `max-width: 100%`, `height: auto`
- [ ] **BottomSheet:** Opens above mobile nav, drag works, backdrop closes
- [ ] **FAB:** Opens vertical capsule, does not overlap sticky bars
- [ ] **No horizontal overflow:** `overflow-x: hidden` on root elements
