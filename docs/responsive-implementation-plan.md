# Kế Hoạch Triển Khai Responsive Mobile UI — IrusGear Frontend

> **Ngày tạo:** 2026-05-08
> **Người thực hiện:** Senior Frontend Review
> **Phiên bản:** 1.0

---

## Mục Lục

1. [Tổng Quan Breakpoints](#1-tổng-quan-breakpoints)
2. [Nhóm A — Pages Có Responsive Đầy Đủ](#2-nhóm-a--pages-có-responsive-đầy-đủ)
3. [Nhóm B — Profile Account Pages](#3-nhóm-b--profile-account-pages)
4. [Nhóm C — Checkout Flow Pages](#4-nhóm-c--checkout-flow-pages)
5. [Nhóm D — Standalone Pages](#5-nhóm-d--standalone-pages)
6. [Nhóm E — Pages Delegate Sang Component](#6-nhóm-e--pages-delegate-sang-component)
7. [Global CSS Variables & Pattern Chuẩn](#7-global-css-variables--pattern-chuẩn)
8. [Thứ Tự Triển Khai](#8-thứ-tự-triển-khai)

---

## 1. Tổng Quan Breakpoints

### 1.1 Chiều Rộng Thiết Bị (Theo Hình Reference)

| Thiết bị | Chiều rộng | Breakpoint CSS | Ghi chú |
|---|---|---|---|
| iPhone SE | 375px | `max-width: 480px` | Nhỏ nhất |
| iPhone 12/13/14/15 Pro | 390px | `max-width: 575.98px` | Mobile nhỏ |
| iPhone 14 Pro Max / 15 Plus | 430px | `max-width: 575.98px` | Mobile lớn |
| iPad Mini | 768px | `max-width: 767.98px` | Tablet nhỏ |
| iPad Air / iPad Pro 11" | 834px | `max-width: 991.98px` | Tablet |
| iPad Pro 12.9" | 1024px | `max-width: 1023.98px` | Tablet lớn |
| Desktop | ≥992px | `min-width: 992px` | Desktop default |
| Wide Desktop | ≥1200px | `min-width: 1200px` | Wide |

### 1.2 Các Breakpoint CSS Cần Sử Dụng

```css
/* Bootstrap 5 default breakpoints */
@media (max-width: 575.98px)    /* Mobile nhỏ — iPhone SE, Pro 390px */
@media (max-width: 767.98px)    /* Mobile lớn — iPad Mini 768px */
@media (max-width: 991.98px)    /* Tablet / Mobile lớn — iPad Air 834px */
@media (max-width: 1023.98px)   /* Tablet lớn — iPad Pro 12.9" */
@media (max-width: 1199.98px)   /* Desktop nhỏ */
@media (min-width: 992px)       /* Desktop ≥ */
@media (min-width: 1200px)      /* Wide Desktop ≥ */
```

### 1.3 Màu Sắc & Spacing System

```css
/* Colors */
--color-primary:     #d70018   /* IrusGear red */
--color-primary-dark: #b80015   /* Hover state */
--color-text:         #18181b   /* Primary text */
--color-text-sec:     #52525b   /* Secondary text */
--color-text-muted:   #71717a   /* Muted text */
--color-border:       #ececf1   /* Card border */
--color-border-lt:    #e4e4e7   /* Input border */
--color-border-dk:    #f4f4f5   /* Section divider */

/* Border Radius */
--radius-card:   18px   /* Card desktop */
--radius-card-md: 14px   /* Card tablet */
--radius-card-sm: 12px  /* Card mobile */
--radius-btn:    10px   /* Buttons */
--radius-chip:   8px    /* Chips/badges */

/* Spacing */
--space-section: 28px   /* Section padding desktop */
--space-section-md: 20px
--space-section-sm: 16px
```

---

## 2. Nhóm A — Pages Có Responsive Đầy Đủ

### 2.1 `pages/cart/success.vue` — ✅ Tốt Nhất

**File:** [cart/success.vue](pages/cart/success.vue)

**Trạng thái hiện tại:** Có 7 breakpoints chi tiết — gần như hoàn hảo.

**Breakpoints hiện tại:**

| Breakpoint | Chiều rộng | Đã có |
|---|---|---|
| `1199.98px` | iPad Pro 12.9" landscape | ✅ |
| `1023.98px` | iPad Pro 12.9" | ✅ |
| `991.98px` | iPad Air / iPad Pro 11" | ✅ |
| `767.98px` | iPad Mini | ✅ |
| `575.98px` | iPhone Pro Max | ✅ |
| `480px` | iPhone SE lớn | ✅ |
| `460px` | Ultra narrow | ✅ |

**Công việc cần làm:** Chỉ tinh chỉnh nhỏ.

**Tinh chỉnh chi tiết:**

```css
/* Tại 480px — thêm font-size line-height cho text */
@media (max-width: 480px) {
  .order-success-page__desktop-header-left .order-success-page__icon {
    height: 48px;
    width: 48px;
    font-size: 28px;
  }
}

/* Tại 460px — kiểm tra lại order-success-page__actions flex-wrap */
@media (max-width: 460px) {
  .order-success-page__actions {
    flex-direction: column; /* Đảm bảo 2 nút xếp dọc trên mobile */
    gap: 6px;
  }

  .order-success-page__btn {
    width: 100%;           /* Full width trên mobile */
    min-height: 40px;
    padding: 8px 12px;
    border-radius: 8px;
  }
}
```

**Đánh giá:** ⭐⭐⭐⭐⭐ — Không cần refactor lớn. File này làm mẫu cho tất cả các page khác.

---

### 2.2 `pages/policy/index.vue` — ✅ Tốt

**File:** [policy/index.vue](pages/policy/index.vue)

**Trạng thái hiện tại:** Pattern sticky-sidebar → horizontal-chips rất chuẩn.

**Breakpoints hiện tại:**

| Breakpoint | Chiều rộng | Đã có |
|---|---|---|
| `991.98px` | iPad Air | ✅ |
| `575.98px` | iPhone Pro Max | ✅ |
| `1200px` | Wide Desktop | ✅ |

**Công việc cần làm:** Thêm `767.98px` và `480px` để mượt hơn.

**Refactor chi tiết:**

```css
/* Hiện tại: chỉ có max-width: 991.98px
   Cần thêm: 767.98px, 480px */

/* === Thêm vào cuối @media (max-width: 991.98px) === */
@media (max-width: 991.98px) {
  .policy-layout {
    flex-direction: column;
  }

  .policy-sidebar {
    width: 100%;
    position: static;
    max-height: none;
    overflow: visible;
  }

  .policy-sidebar__section {
    display: flex;
    flex-wrap: nowrap;      /* Thay đổi: scroll ngang thay vì wrap */
    overflow-x: auto;      /* Scroll ngang trên tablet */
    gap: 4px;
    padding: 8px;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }

  .policy-sidebar__section::-webkit-scrollbar { display: none; }

  .policy-sidebar__title {
    width: auto;
    flex-shrink: 0;
    padding: 4px 8px;
    font-size: 10px;
    align-self: center;
  }

  .policy-sidebar__item {
    flex-shrink: 0;
    padding: 8px 12px;
    font-size: 12px;
    border-left: none;
    border-radius: 8px;
    border: 1px solid #e4e4e7;
    background: #fff;
    white-space: nowrap;
  }

  .policy-sidebar__item--active {
    background: #d70018;
    color: #fff;
    border-color: #d70018;
  }

  .policy-sidebar__item--active:hover {
    background: #b80015;
    color: #fff;
  }

  .policy-section {
    padding: 20px 16px 24px;
    border-radius: 14px;
  }

  .policy-section__title {
    font-size: 18px;
  }

  .policy-section__subtitle {
    font-size: 14px;
  }

  .policy-table th,
  .policy-table td {
    padding: 10px 12px;
    font-size: 12px;
  }
}

/* === Thêm mới: max-width: 767.98px === */
@media (max-width: 767.98px) {
  .policy-sidebar__item {
    font-size: 11px;
    padding: 7px 10px;
    border-radius: 6px;
  }

  .policy-section {
    padding: 16px 12px 20px;
  }

  .policy-section__title {
    font-size: 16px;
  }

  .policy-section__subtitle {
    font-size: 13px;
    margin: 20px 0 10px;
  }

  .policy-table th,
  .policy-table td {
    padding: 8px 10px;
    font-size: 11px;
  }
}

/* === Thêm mới: max-width: 480px === */
@media (max-width: 480px) {
  .policy-sidebar__section {
    gap: 4px;
    padding: 6px;
  }

  .policy-sidebar__title {
    font-size: 9px;
    padding: 4px 6px;
  }

  .policy-sidebar__item {
    font-size: 11px;
    padding: 6px 10px;
  }

  .policy-section {
    padding: 14px 10px 18px;
    border-radius: 12px;
  }

  .policy-section__title {
    font-size: 15px;
    margin-bottom: 6px;
  }

  .policy-section__subtitle {
    font-size: 13px;
    margin: 18px 0 8px;
  }

  .policy-table-wrap {
    font-size: 11px;
    border-radius: 8px;
  }

  .policy-table th,
  .policy-table td {
    padding: 8px;
    font-size: 10px;
  }

  .policy-notice {
    padding: 10px 12px;
    border-radius: 8px;
  }
}
```

---

### 2.3 `pages/tos/index.vue` — ✅ Tốt

**File:** [tos/index.vue](pages/tos/index.vue)

**Trạng thái hiện tại:** Giống pattern như policy — có `991.98px`, `575.98px`, `1200px`.

**Công việc cần làm:** Áp dụng **chính xác cùng refactor** như policy (scroll ngang sidebar trên tablet, thêm `767.98px` và `480px`).

```css
/* === Cùng pattern như policy/index.vue ===

Thay đổi từ:
  .policy-sidebar__section { flex-wrap: wrap; }

Thành:
  .policy-sidebar__section {
    flex-wrap: nowrap;
    overflow-x: auto;
  }

Và thêm:
  @media (max-width: 767.98px) { ... }
  @media (max-width: 480px) { ... }
*/
```

**Đánh giá:** ⭐⭐⭐⭐⭐ — Pattern chuẩn, cần copy từ policy.

---

## 3. Nhóm B — Profile Account Pages

> **Layout:** `profile` — CustomerSidebar + Breadcrumb + Footer + AddToCartSheet
> **Container:** `container-xl` (max-width: 1140px)

### 3.1 `pages/warranty/index.vue` — ⚠️ Cần Refactor Lớn

**File:** [warranty/index.vue](pages/warranty/index.vue)

**Trạng thái hiện tại:** Chỉ có scoped CSS cơ bản, không có responsive breakpoints trong scoped style. Toàn bộ responsive phụ thuộc vào Bootstrap.

**Breakpoints hiện tại:** Không có.

**Các component cần responsive:**

1. **Search bar** (`.warranty-search`)
2. **Tabs** (`.warranty-tabs`) — horizontal scroll
3. **Warranty card** (`.warranty-card`)
4. **Product section** trong card
5. **Details box** trong card
6. **Timeline** trong card
7. **Card footer** (buttons)

**Refactor chi tiết:**

```css
/* === pages/warranty/index.vue — THÊM VÀO CUỐI <style scoped> === */

/* ── Search Bar ────────────────────────── */
@media (max-width: 991.98px) {
  .warranty-search {
    flex-direction: column;
    gap: 8px;
  }

  .warranty-search__input-wrap {
    max-width: 100%;
  }

  .warranty-search__btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 575.98px) {
  .warranty-search__input-wrap {
    padding: 6px 12px;
    min-height: 38px;
  }

  .warranty-search__input {
    font-size: 13px;
  }

  .warranty-search__btn {
    padding: 6px 12px;
    min-height: 38px;
  }
}

/* ── Tabs ─────────────────────────────── */
@media (max-width: 991.98px) {
  .warranty-tabs {
    border-radius: 14px;
    padding: 4px;
    gap: 2px;
  }

  .warranty-tabs__item {
    min-width: 80px;
    padding: 7px 10px;
    font-size: 12px;
    border-radius: 12px;
  }
}

@media (max-width: 767.98px) {
  .warranty-tabs {
    border-radius: 12px;
  }

  .warranty-tabs__item {
    min-width: 70px;
    padding: 6px 8px;
    font-size: 12px;
    border-radius: 10px;
  }
}

@media (max-width: 575.98px) {
  .warranty-tabs {
    border-radius: 10px;
    padding: 3px;
    gap: 2px;
  }

  .warranty-tabs__item {
    min-width: 60px;
    padding: 6px 8px;
    font-size: 11px;
    border-radius: 8px;
  }
}

@media (max-width: 480px) {
  .warranty-tabs__item {
    min-width: 55px;
    padding: 5px 6px;
    font-size: 11px;
  }
}

/* ── Warranty Card ─────────────────────── */
@media (max-width: 991.98px) {
  .warranty-card {
    border-radius: 14px;
  }

  .warranty-card__header {
    padding: 12px 14px;
    gap: 10px;
  }

  .warranty-card__id {
    font-size: 13px;
  }

  .warranty-card__date {
    font-size: 12px;
  }

  .warranty-card__status {
    font-size: 12px;
    padding: 3px 10px;
  }

  .warranty-card__body {
    padding: 14px;
    gap: 14px;
  }

  .warranty-card__product {
    gap: 10px;
  }

  .warranty-card__product-img {
    width: 56px;
    height: 56px;
  }

  .warranty-card__product-name {
    font-size: 13px;
  }

  .warranty-card__details {
    padding: 10px;
    gap: 5px;
  }

  .warranty-card__detail-row {
    font-size: 12px;
  }

  .warranty-card__detail-row .warranty-card__label {
    min-width: 110px;
  }

  .warranty-card__footer {
    padding: 10px 14px;
    gap: 6px;
  }
}

@media (max-width: 767.98px) {
  .warranty-card__product {
    flex-direction: row;
    gap: 10px;
  }

  .warranty-card__product-img {
    width: 52px;
    height: 52px;
  }

  .warranty-card__product-name {
    font-size: 13px;
    -webkit-line-clamp: 2;
  }
}

@media (max-width: 575.98px) {
  .warranty-card {
    border-radius: 12px;
  }

  .warranty-card__header {
    flex-direction: column;
    align-items: flex-start;
    padding: 12px;
  }

  .warranty-card__status {
    align-self: flex-start;
  }

  .warranty-card__body {
    padding: 12px;
    gap: 12px;
  }

  .warranty-card__product-img {
    width: 48px;
    height: 48px;
  }

  .warranty-card__product-name {
    font-size: 12px;
  }

  .warranty-card__product-serial,
  .warranty-card__product-imei {
    font-size: 11px;
  }

  .warranty-card__details {
    padding: 8px;
  }

  .warranty-card__detail-row {
    font-size: 11px;
  }

  .warranty-card__detail-row .warranty-card__label {
    min-width: 100px;
  }

  .warranty-card__footer {
    padding: 10px 12px;
    justify-content: flex-end;
  }
}

@media (max-width: 480px) {
  .warranty-card__header {
    padding: 10px;
  }

  .warranty-card__body {
    padding: 10px;
  }

  .warranty-card__product-img {
    width: 44px;
    height: 44px;
  }

  .warranty-card__product-name {
    font-size: 12px;
    -webkit-line-clamp: 1;
  }
}

/* ── Timeline ─────────────────────────── */
@media (max-width: 991.98px) {
  .warranty-card__timeline {
    padding-left: 4px;
  }

  .warranty-timeline__step {
    padding-bottom: 14px;
  }

  .warranty-timeline__dot {
    width: 22px;
    height: 22px;
  }

  .warranty-timeline__title {
    font-size: 12px;
  }

  .warranty-timeline__time {
    font-size: 11px;
  }
}

@media (max-width: 575.98px) {
  .warranty-timeline__step {
    gap: 10px;
    padding-bottom: 12px;
  }

  .warranty-timeline__step::before {
    left: 10px;
    top: 18px;
  }

  .warranty-timeline__dot {
    width: 20px;
    height: 20px;
    font-size: 9px;
  }

  .warranty-timeline__title {
    font-size: 11px;
  }
}
```

---

### 3.2 `pages/tradein/index.vue` — ⚠️ Cần Refactor Lớn

**File:** [tradein/index.vue](pages/tradein/index.vue)

**Trạng thái hiện tại:** Không có responsive breakpoints trong scoped style.

**Các component cần responsive:**

1. **Tradein title** (`.tradein-title`) — mobile-only, hiện có `d-md-none`
2. **Filter bar** (`.tradein-filter`) — date range
3. **Tradein card** (`.tradein-card`)
4. **Device section** (old/new device trong card)
5. **Pricing box** trong card
6. **Card footer** (actions)

**Refactor chi tiết:**

```css
/* === pages/tradein/index.vue — THÊM VÀO CUỐI <style scoped> === */

/* ── Tradein Title (mobile only) ──────── */
@media (max-width: 991.98px) {
  .tradein-title {
    border-radius: 14px;
    padding: 12px 14px;
    margin-bottom: 10px;
  }

  .tradein-title__text {
    font-size: 15px;
  }
}

@media (max-width: 575.98px) {
  .tradein-title {
    border-radius: 12px;
    padding: 10px 12px;
  }

  .tradein-title__text {
    font-size: 14px;
  }
}

/* ── Filter Bar ───────────────────────── */
@media (max-width: 991.98px) {
  .tradein-filter {
    margin-bottom: 10px;
  }

  .tradein-filter__label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #18181b;
  }

  .tradein-filter__date-range {
    max-width: 100%;
    padding: 6px 12px;
    min-height: 38px;
  }
}

@media (max-width: 575.98px) {
  .tradein-filter {
    gap: 8px;
  }

  .tradein-filter__date-range {
    padding: 6px 10px;
    gap: 6px;
  }

  .tradein-filter__date-input {
    font-size: 12px;
  }
}

/* ── Tradein Card ──────────────────────── */
@media (max-width: 991.98px) {
  .tradein-card {
    border-radius: 14px;
  }

  .tradein-card__header {
    padding: 12px 14px;
  }

  .tradein-card__id {
    font-size: 13px;
  }

  .tradein-card__date {
    font-size: 12px;
  }

  .tradein-card__status {
    font-size: 12px;
    padding: 3px 10px;
  }

  .tradein-card__device {
    padding: 14px;
  }

  .tradein-card__device-img {
    width: 52px;
    height: 52px;
  }

  .tradein-card__device-name {
    font-size: 13px;
  }

  .tradein-card__device-capacity {
    font-size: 11px;
  }

  .tradein-card__device-label {
    font-size: 11px;
  }

  .tradein-card__footer {
    padding: 12px 14px;
    gap: 12px;
  }

  .tradein-card__pricing {
    padding: 10px;
    gap: 5px;
  }

  .tradein-card__price-row {
    font-size: 12px;
  }
}

@media (max-width: 767.98px) {
  .tradein-card__device-img {
    width: 48px;
    height: 48px;
  }
}

@media (max-width: 575.98px) {
  .tradein-card {
    border-radius: 12px;
  }

  .tradein-card__header {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 12px;
    gap: 8px;
  }

  .tradein-card__device {
    padding: 10px 12px;
  }

  .tradein-card__device-body {
    gap: 10px;
  }

  .tradein-card__device-img {
    width: 44px;
    height: 44px;
  }

  .tradein-card__device-name {
    font-size: 12px;
  }

  .tradein-card__device-capacity {
    font-size: 11px;
  }

  .tradein-card__arrow {
    padding: 2px 12px;
    font-size: 14px;
  }

  .tradein-card__footer {
    padding: 10px 12px;
    gap: 10px;
  }

  .tradein-card__pricing {
    padding: 8px;
  }

  .tradein-card__price-row {
    font-size: 12px;
  }

  .tradein-card__actions {
    width: 100%;
    justify-content: flex-end;
  }
}

@media (max-width: 480px) {
  .tradein-card__header {
    padding: 10px;
  }

  .tradein-card__device {
    padding: 10px;
  }

  .tradein-card__device-img {
    width: 40px;
    height: 40px;
  }

  .tradein-card__footer {
    padding: 10px;
  }
}
```

---

### 3.3 `pages/orders/index.vue` — ⚠️ Cần Refactor Lớn

**File:** [orders/index.vue](pages/orders/index.vue)

**Trạng thái hiện tại:** Có scoped CSS cơ bản nhưng không có responsive breakpoints.

**Các component cần responsive:**

1. **Tabs** (`.orders-tabs`) — horizontal scroll với rounded pills
2. **Filter bar** (`.orders-filter`) — date range
3. **Order card** (`.orders-card`)
4. **Order items** trong card
5. **Card footer** (total + actions)

**Refactor chi tiết:**

```css
/* === pages/orders/index.vue — THÊM VÀO CUỐI <style scoped> === */

/* ── Tabs ─────────────────────────────── */
@media (max-width: 991.98px) {
  .orders-tabs {
    border-radius: 14px;
    padding: 4px;
    gap: 2px;
  }

  .orders-tabs__item {
    min-width: 80px;
    padding: 7px 10px;
    font-size: 12px;
    border-radius: 12px;
  }
}

@media (max-width: 767.98px) {
  .orders-tabs {
    border-radius: 12px;
  }

  .orders-tabs__item {
    min-width: 70px;
    padding: 6px 8px;
    font-size: 12px;
    border-radius: 10px;
  }
}

@media (max-width: 575.98px) {
  .orders-tabs {
    border-radius: 10px;
    padding: 3px;
  }

  .orders-tabs__item {
    min-width: 60px;
    padding: 6px 8px;
    font-size: 11px;
    border-radius: 8px;
  }
}

@media (max-width: 480px) {
  .orders-tabs__item {
    min-width: 55px;
    padding: 5px 6px;
    font-size: 11px;
  }
}

/* ── Filter Bar ───────────────────────── */
@media (max-width: 991.98px) {
  .orders-filter {
    margin-bottom: 10px;
  }

  .orders-filter__date-range {
    max-width: 100%;
    padding: 6px 12px;
    min-height: 38px;
  }
}

@media (max-width: 575.98px) {
  .orders-filter__date-range {
    padding: 6px 10px;
    gap: 6px;
  }

  .orders-filter__date-input {
    font-size: 12px;
  }
}

/* ── Order Card ────────────────────────── */
@media (max-width: 991.98px) {
  .orders-card {
    border-radius: 14px;
  }

  .orders-card__header {
    padding: 12px 14px;
    gap: 10px;
  }

  .orders-card__id {
    font-size: 13px;
  }

  .orders-card__date {
    font-size: 12px;
  }

  .orders-card__status {
    font-size: 12px;
    padding: 3px 10px;
  }

  .orders-card__items {
    padding: 10px 14px;
    gap: 10px;
  }

  .orders-card__item {
    gap: 10px;
  }

  .orders-card__item-img {
    width: 56px;
    height: 56px;
  }

  .orders-card__item-name {
    font-size: 13px;
  }

  .orders-card__item-qty {
    font-size: 11px;
  }

  .orders-card__item-price-current {
    font-size: 13px;
  }

  .orders-card__footer {
    padding: 10px 14px;
    gap: 10px;
  }

  .orders-card__total-label {
    font-size: 12px;
  }

  .orders-card__total-value {
    font-size: 14px;
  }
}

@media (max-width: 767.98px) {
  .orders-card__item-img {
    width: 52px;
    height: 52px;
  }
}

@media (max-width: 575.98px) {
  .orders-card {
    border-radius: 12px;
  }

  .orders-card__header {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 12px;
  }

  .orders-card__status {
    align-self: flex-start;
  }

  .orders-card__items {
    padding: 10px 12px;
  }

  .orders-card__item-img {
    width: 48px;
    height: 48px;
  }

  .orders-card__item-name {
    font-size: 12px;
    -webkit-line-clamp: 2;
  }

  .orders-card__footer {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 12px;
    gap: 10px;
  }

  .orders-card__actions {
    width: 100%;
    justify-content: flex-end;
  }
}

@media (max-width: 480px) {
  .orders-card__header {
    padding: 10px;
  }

  .orders-card__items {
    padding: 10px;
  }

  .orders-card__item {
    gap: 8px;
  }

  .orders-card__item-img {
    width: 44px;
    height: 44px;
  }

  .orders-card__footer {
    padding: 10px;
  }
}
```

---

### 3.4 `pages/user-info/index.vue` — ⚠️ Cần Refactor Lớn

**File:** [user-info/index.vue](pages/user-info/index.vue)

**Trạng thái hiện tại:** Có `991.98px` nhưng thiếu `767.98px`, `575.98px`, `480px`.

**Cấu trúc hiện tại:**

```
.user-info-alert              → Alert banner (flex, wrap)
.user-info-card               → Card với header + body
  .user-info-card__body       → 2-column flex (col + col)
  .user-info-card__row        → label + value
.user-info-address-empty      → Empty state
.user-info-row               → Grid 1fr (mobile) → 1fr 1fr (desktop ≥992px)
  .user-info-card            → Password card
  .user-info-card            → Linked accounts card
```

**Refactor chi tiết:**

```css
/* === pages/user-info/index.vue — CẦN THAY THẾ @media (max-width: 767.98px) === */

/* Hiện tại: KHÔNG CÓ @media (max-width: 767.98px)
   Cần thêm: 767.98px, 575.98px, 480px */

/* ── Alert Banner ─────────────────────── */
@media (max-width: 991.98px) {
  .user-info-alert {
    padding: 12px;
  }

  .user-info-alert__text {
    font-size: 13px;
  }
}

@media (max-width: 767.98px) {
  .user-info-alert {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 12px;
  }

  .user-info-alert__btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 575.98px) {
  .user-info-alert {
    padding: 10px;
    gap: 8px;
  }

  .user-info-alert__text {
    font-size: 12px;
  }

  .user-info-alert__btn {
    padding: 8px 12px;
    font-size: 13px;
  }
}

/* ── Card ─────────────────────────────── */
@media (max-width: 991.98px) {
  .user-info-card {
    border-radius: 14px;
  }

  .user-info-card__header {
    padding: 14px 16px;
  }

  .user-info-card__title {
    font-size: 14px;
  }

  .user-info-card__edit-btn {
    padding: 5px 10px;
    font-size: 12px;
  }

  .user-info-card__row {
    padding: 12px 16px;
  }

  .user-info-card__label,
  .user-info-card__value {
    font-size: 13px;
  }

  .user-info-linked__item {
    padding: 12px 16px;
  }

  .user-info-linked__brand-name {
    font-size: 13px;
  }
}

@media (max-width: 767.98px) {
  /* 2-column body → 1 column trên tablet nhỏ */
  .user-info-card__body {
    flex-direction: column;
  }

  .user-info-card__col {
    width: 100%;
  }

  .user-info-card__row {
    padding: 12px 14px;
  }

  .user-info-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 575.98px) {
  .user-info-card {
    border-radius: 12px;
  }

  .user-info-card__header {
    padding: 12px 14px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .user-info-card__title {
    font-size: 14px;
  }

  .user-info-card__edit-btn {
    align-self: flex-end;
  }

  .user-info-card__row {
    padding: 10px 14px;
  }

  .user-info-card__label,
  .user-info-card__value {
    font-size: 12px;
  }

  .user-info-address-empty {
    padding: 24px 12px;
    gap: 10px;
  }

  .user-info-address-empty__img {
    width: 72px;
  }

  .user-info-address-empty__text {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .user-info-alert {
    padding: 10px;
  }

  .user-info-alert__text {
    font-size: 12px;
  }

  .user-info-alert__btn {
    font-size: 12px;
  }

  .user-info-card__header {
    padding: 10px 12px;
  }

  .user-info-card__row {
    padding: 10px 12px;
  }

  .user-info-card__label {
    font-size: 12px;
    min-width: 100px;
  }

  .user-info-card__value {
    font-size: 12px;
  }

  .user-info-linked__item {
    padding: 10px 12px;
  }
}

/* ── Linked Accounts ──────────────────── */
@media (max-width: 991.98px) {
  .user-info-linked__item {
    padding: 12px 16px;
  }
}

@media (max-width: 575.98px) {
  .user-info-linked__item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .user-info-linked__action {
    align-self: flex-start;
  }
}
```

---

## 4. Nhóm C — Checkout Flow Pages

### 4.1 `pages/cart/checkout.vue` — ⚠️ Cần Sticky Bar Mobile

**File:** [cart/checkout.vue](pages/cart/checkout.vue)

**Trạng thái hiện tại:** Có `991.98px`, sticky bar không hiển thị trên mobile.

**Cấu trúc hiện tại:**

```
.checkout-page
  .container-xl
    CheckoutProgress
    Skeleton / 2-col (form + summary)
  CheckoutStickyBar   ← Hiện tại luôn hiển thị, cần ẩn trên desktop
  OrderReviewDialog
```

**Vấn đề:** `<CheckoutStickyBar>` luôn render nhưng cần `position: fixed` trên mobile.

**Refactor chi tiết:**

```css
/* === pages/cart/checkout.vue — THÊM VÀO CUỐI <style scoped> === */

@media (max-width: 991.98px) {
  .checkout-page {
    padding-bottom: 160px; /* Tăng từ 120px → 160px để tránh bị che bởi sticky bar */
  }

  /* Summary column ẩn trên mobile */
  .checkout-page__summary-col {
    display: none;
  }
}

@media (max-width: 575.98px) {
  .checkout-page {
    padding: 14px 0 150px;
  }

  .checkout-page__summary-col {
    display: none;
  }
}

/* Sticky bar — component này render từ CheckoutStickyBar.vue
   Nếu muốn override styles, cần thêm class vào component */

/* Trong CheckoutStickyBar component — thêm props 'mobile-only'
   Hoặc CSS override từ parent: */
@media (min-width: 992px) {
  /* Ẩn sticky bar trên desktop — form đã có summary column */
  /* Cần thêm class .checkout-sticky-bar vào CheckoutStickyBar.vue */
  .checkout-sticky-bar {
    display: none;
  }
}

@media (max-width: 991.98px) {
  /* Hiện sticky bar với position: fixed */
  .checkout-sticky-bar {
    display: block;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    border-top: 1px solid #ececf1;
    padding: 12px 16px;
    z-index: 100;
    box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
  }

  .checkout-sticky-bar__content {
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
}
```

> **Lưu ý:** `<CheckoutStickyBar>` là component riêng trong `components/Checkout/`. Cần kiểm tra xem component đó đã có responsive chưa. Nếu chưa, cần thêm class `.checkout-sticky-bar` vào component đó.

---

### 4.2 `pages/cart/payment.vue` — ⚠️ Cần Sticky Bar Mobile

**File:** [cart/payment.vue](pages/cart/payment.vue)

**Trạng thái hiện tại:** Có `991.98px` cơ bản, sticky bar mobile cần tinh chỉnh.

**Refactor chi tiết:**

```css
/* === pages/cart/payment.vue — THÊM VÀO CUỐI <style scoped> === */

@media (max-width: 991.98px) {
  .payment-page {
    padding-bottom: 160px;
  }

  .payment-page__summary-col {
    width: 100%;
    display: block;
  }

  /* Summary panel không sticky nữa trên mobile */
  .payment-page__summary {
    position: static;
    border-radius: 14px;
    padding: 16px;
    margin-bottom: 0;
  }

  .payment-page__section {
    padding: 16px;
    border-radius: 14px;
  }

  .payment-page__title {
    font-size: 16px;
  }
}

@media (max-width: 575.98px) {
  .payment-page {
    padding: 12px 0 150px;
  }

  .payment-page__section {
    padding: 14px;
    border-radius: 12px;
  }

  .payment-page__title {
    font-size: 15px;
  }

  .payment-page__summary {
    padding: 14px;
    border-radius: 12px;
  }

  .payment-page__sticky-bar {
    padding: 10px 14px;
  }

  .payment-page__submit-btn {
    border-radius: 10px;
    font-size: 14px;
    min-height: 48px;
  }
}

/* Sticky bar — đã có position: fixed trong component gốc
   Chỉ cần tinh chỉnh padding và button */
@media (max-width: 991.98px) {
  .payment-page__sticky-bar {
    padding: 12px 16px;
  }

  .payment-page__submit-btn {
    border-radius: 12px;
  }
}

@media (max-width: 575.98px) {
  .payment-page__sticky-bar {
    padding: 10px 14px;
  }

  .payment-page__submit-btn {
    border-radius: 10px;
    font-size: 14px;
    min-height: 48px;
  }
}
```

---

## 5. Nhóm D — Standalone Pages

### 5.1 `pages/profile/index.vue` — ⚠️ Cần Bổ Sung Breakpoints

**File:** [profile/index.vue](pages/profile/index.vue)

**Trạng thái hiện tại:** Có `575.98px`, `992px`, `1200px`. Thiếu `991.98px` (tablet) và `767.98px`.

**Refactor chi tiết:**

```css
/* === pages/profile/index.vue — CẦN THÊM TRƯỚC @media (min-width: 992px) === */

/* ── Tablet 991.98px ──────────────────── */
@media (max-width: 991.98px) {
  .profile-layout {
    padding: 100px 0 40px;
  }

  .profile-grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .profile-card {
    padding: 14px;
    border-radius: 14px;
  }

  .profile-card__header {
    margin-bottom: 10px;
  }

  .profile-card__title {
    font-size: 14px;
  }

  .profile-notice {
    padding: 8px 10px;
  }

  .profile-favorite-item {
    min-width: 220px;
    padding: 8px;
  }
}

/* ── Mobile 767.98px ─────────────────── */
@media (max-width: 767.98px) {
  .profile-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .profile-card {
    padding: 12px;
    border-radius: 12px;
  }

  .profile-favorite-item {
    min-width: 200px;
  }
}

/* ── Mobile 575.98px (hiện có — giữ nguyên) ── */
@media (max-width: 575.98px) {
  /* Đã có — không thay đổi */
}

/* ── Desktop ≥992px (hiện có — giữ nguyên) ── */
@media (min-width: 992px) {
  /* Đã có — không thay đổi */
}
```

---

### 5.2 `pages/account/vouchers.vue` — ⚠️ Cần Thêm Tablet Breakpoints

**File:** [account/vouchers.vue](pages/account/vouchers.vue)

**Trạng thái hiện tại:** Chỉ có `575.98px`.

**Refactor chi tiết:**

```css
/* === pages/account/vouchers.vue — THÊM VÀO CUỐI <style scoped> === */

@media (max-width: 991.98px) {
  .voucher-history-page {
    padding: 20px 0 60px;
  }

  .voucher-history-page__header {
    margin-bottom: 20px;
  }

  .voucher-history-page__title {
    font-size: 22px;
  }

  .voucher-history-card {
    padding: 14px 16px;
    border-radius: 12px;
    gap: 12px;
  }

  .voucher-history-card__icon {
    font-size: 24px;
  }

  .voucher-history-card__code {
    font-size: 14px;
  }

  .voucher-history-card__desc {
    font-size: 12px;
  }

  .voucher-history-card__savings-amount {
    font-size: 15px;
  }
}

@media (max-width: 767.98px) {
  .voucher-history-page {
    padding: 16px 0 60px;
  }

  .voucher-history-page__title {
    font-size: 20px;
  }

  .voucher-history-card {
    flex-wrap: wrap;
    gap: 10px;
  }

  .voucher-history-card__icon {
    font-size: 22px;
  }

  .voucher-history-card__content {
    flex: 1 1 60%;
  }

  .voucher-history-card__savings {
    flex: 0 0 auto;
    text-align: right;
  }
}

@media (max-width: 575.98px) {
  /* Hiện có — chỉ tinh chỉnh nhỏ */
  .voucher-history-card {
    padding: 12px 14px;
    border-radius: 12px;
  }

  .voucher-history-card__savings {
    width: 100%;
    text-align: left;
    padding-top: 8px;
    border-top: 1px solid #f0f0f2;
  }
}
```

---

### 5.3 `pages/khuyen-mai/index.vue` — ⚠️ Cần Thêm Tablet Breakpoints

**File:** [khuyen-mai/index.vue](pages/khuyen-mai/index.vue)

**Trạng thái hiện tại:** Chỉ có `575.98px`.

**Refactor chi tiết:**

```css
/* === pages/khuyen-mai/index.vue — THÊM VÀO CUỐI <style scoped> === */

@media (max-width: 991.98px) {
  .promotion-page {
    padding: 30px 0 60px;
  }

  .promotion-page__header {
    margin-bottom: 24px;
  }

  .promotion-page__title {
    font-size: 24px;
  }

  .promotion-page__coming-soon {
    min-height: 300px;
  }

  .promotion-page__placeholder {
    padding: 48px 20px;
    border-radius: 16px;
    max-width: 420px;
  }

  .promotion-page__placeholder i {
    font-size: 56px;
  }

  .promotion-page__placeholder h2 {
    font-size: 20px;
  }
}

@media (max-width: 767.98px) {
  .promotion-page {
    padding: 24px 0 60px;
  }

  .promotion-page__title {
    font-size: 22px;
  }

  .promotion-page__placeholder {
    padding: 40px 16px;
    border-radius: 14px;
    max-width: 380px;
  }

  .promotion-page__placeholder i {
    font-size: 48px;
  }

  .promotion-page__placeholder h2 {
    font-size: 18px;
  }

  .promotion-page__placeholder p {
    font-size: 14px;
  }
}
```

---

### 5.4 `pages/tin-tuc/index.vue` — ⚠️ Cần Thêm Tablet Breakpoints

**File:** [tin-tuc/index.vue](pages/tin-tuc/index.vue)

**Trạng thái hiện tại:** Chỉ có `575.98px`. Áp dụng **cùng pattern** như khuyen-mai.

**Refactor chi tiết:**

```css
/* === pages/tin-tuc/index.vue — THÊM VÀO CUỐI <style scoped> === */
/* Pattern giống hệt khuyen-mai/index.vue */

@media (max-width: 991.98px) {
  .news-page {
    padding: 30px 0 60px;
  }

  .news-page__header {
    margin-bottom: 24px;
  }

  .news-page__title {
    font-size: 24px;
  }

  .news-page__coming-soon {
    min-height: 300px;
  }

  .news-page__placeholder {
    padding: 48px 20px;
    border-radius: 16px;
    max-width: 420px;
  }

  .news-page__placeholder i {
    font-size: 56px;
  }

  .news-page__placeholder h2 {
    font-size: 20px;
  }
}

@media (max-width: 767.98px) {
  .news-page {
    padding: 24px 0 60px;
  }

  .news-page__title {
    font-size: 22px;
  }

  .news-page__placeholder {
    padding: 40px 16px;
    border-radius: 14px;
    max-width: 380px;
  }

  .news-page__placeholder i {
    font-size: 48px;
  }

  .news-page__placeholder h2 {
    font-size: 18px;
  }

  .news-page__placeholder p {
    font-size: 14px;
  }
}
```

---

### 5.5 `pages/lien-he/index.vue` — ⚠️ Cần Thêm Tablet Breakpoints

**File:** [lien-he/index.vue](pages/lien-he/index.vue)

**Trạng thái hiện tại:** Chỉ có `575.98px`.

**Refactor chi tiết:**

```css
/* === pages/lien-he/index.vue — THÊM VÀO CUỐI <style scoped> === */

@media (max-width: 991.98px) {
  .contact-page {
    padding: 30px 0 60px;
  }

  .contact-page__header {
    margin-bottom: 24px;
  }

  .contact-page__title {
    font-size: 24px;
  }

  .contact-page__info-card {
    padding: 24px;
    border-radius: 16px;
    max-width: 560px;
  }

  .contact-page__info-card h2 {
    font-size: 18px;
  }

  .contact-page__contact-item > i {
    font-size: 18px;
  }
}

@media (max-width: 767.98px) {
  .contact-page {
    padding: 24px 0 60px;
  }

  .contact-page__title {
    font-size: 22px;
  }

  .contact-page__info-card {
    padding: 20px;
    border-radius: 14px;
  }

  .contact-page__info-card h2 {
    font-size: 17px;
  }

  .contact-page__contact-list {
    gap: 14px;
  }

  .contact-page__contact-item > i {
    font-size: 18px;
  }

  .contact-page__contact-item strong {
    font-size: 13px;
  }

  .contact-page__contact-item span {
    font-size: 13px;
  }
}
```

---

## 6. Nhóm E — Pages Delegate Sang Component

### 6.1 `pages/cart/index.vue`

```vue
<template>
  <CartPage />
</template>
```

**Hành động:** Kiểm tra `components/Cart/CartPage.vue` có responsive chưa. Nếu chưa, thêm responsive vào component đó.

### 6.2 `pages/products/[slug].vue`

```vue
<template>
  <ProductDetailPage />
</template>
```

**Hành động:** Kiểm tra `components/Products/ProductDetail/ProductDetailPage.vue`. Component này cần responsive đầy đủ vì đây là trang quan trọng nhất của e-commerce.

### 6.3 `pages/products/index.vue`

```vue
<template>
  <ProductList />
</template>
```

**Hành động:** Kiểm tra `components/Products/ProductList/ProductList.vue`.

### 6.4 `pages/index.vue`

**Hành động:** Sử dụng Bootstrap 5 grid + các Home* components. Kiểm tra từng component:

| Component | File | Responsive cần kiểm tra |
|---|---|---|
| HomeHero | `components/Home/` | Banner carousel, image scaling |
| HomeProdSection | `components/Home/` | Product grid (4-col → 2-col → 1-col) |
| HomeAccessoryGrid | `components/Home/` | Grid layout |
| HomeUsedGoodsGrid | `components/Home/` | Grid layout |

---

## 7. Global CSS Variables & Pattern Chuẩn

### 7.1 Tạo File Global Responsive Variables

**File:** `public/assets/css/responsive.css`

```css
/* ============================================
   responsive.css — Global Responsive Variables
   IrusGear Frontend
   ============================================ */

/* ── Breakpoint Custom Properties ─────────── */
:root {
  /* Aliases for consistent usage */
  --bp-mobile-xs:   480px;
  --bp-mobile-sm:    576px;
  --bp-mobile-md:    768px;
  --bp-tablet:       992px;
  --bp-desktop-sm:  1024px;
  --bp-desktop:     1200px;
  --bp-desktop-lg:  1400px;

  /* Border Radius */
  --radius-card-xs: 10px;
  --radius-card-sm: 12px;
  --radius-card-md: 14px;
  --radius-card:    18px;
  --radius-card-lg: 20px;
  --radius-chip:     8px;
  --radius-btn:     10px;
  --radius-pill:    20px;
  --radius-full:    9999px;

  /* Card Spacing */
  --card-pad-xs:  10px;
  --card-pad-sm:  12px;
  --card-pad-md:  14px;
  --card-pad:     16px;
  --card-pad-lg:  20px;
  --card-pad-xl:  24px;
  --card-pad-2xl: 28px;
  --card-pad-3xl: 32px;

  /* Section Spacing */
  --section-pad-xs:  12px;
  --section-pad-sm:  16px;
  --section-pad-md:  20px;
  --section-pad:     28px;
  --section-pad-lg:  32px;
  --section-pad-xl:  40px;

  /* Scrollbar */
  --scrollbar-width: 4px;
  --scrollbar-radius: 999px;
}

/* ── Global Scrollbar Reset ────────────────── */
* {
  scrollbar-width: thin;
  scrollbar-color: #e4e4e7 transparent;
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-thumb {
  background: #e4e4e7;
  border-radius: 999px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

/* Hide scrollbar on horizontal scroll areas */
.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* ── Responsive Text Truncation ───────────── */
.text-truncate-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Card Base ─────────────────────────────── */
.card-base {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: var(--radius-card);
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.card-base:hover {
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
}

/* ── Empty State Base ─────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: var(--radius-card);
  text-align: center;
  gap: 14px;
}

.empty-state__img {
  width: 88px;
  height: auto;
  object-fit: contain;
}

.empty-state__text {
  font-size: 14px;
  color: #a1a1aa;
  margin: 0;
}

/* ── Responsive Visibility ────────────────── */
@media (max-width: 575.98px) {
  .hide-mobile      { display: none !important; }
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
```

### 7.2 Import Trong nuxt.config.ts

```typescript
// nuxt.config.ts
css: [
  'bootstrap/dist/css/bootstrap.min.css',
  '@/public/assets/css/toast.css',
  '@/public/assets/css/responsive.css',  // ← Thêm dòng này
],
```

---

## 8. Thứ Tự Triển Khai

### Phase 1: Profile Account Pages (Ngày 1-2)

| STT | File | Ưu tiên | Ghi chú |
|---|---|---|---|
| 1 | `pages/warranty/index.vue` | 🔴 Cao | Nhiều component, nhiều breakpoints nhất |
| 2 | `pages/orders/index.vue` | 🔴 Cao | Tabs + card layout |
| 3 | `pages/tradein/index.vue` | 🔴 Cao | Card với nhiều sections |
| 4 | `pages/user-info/index.vue` | 🟡 Trung | 2-col → 1-col, alert banner |

### Phase 2: Checkout Flow (Ngày 2-3)

| STT | File | Ưu tiên | Ghi chú |
|---|---|---|---|
| 5 | `components/Checkout/CheckoutStickyBar.vue` | 🔴 Cao | Sticky bar mobile — ảnh hưởng conversion |
| 6 | `pages/cart/checkout.vue` | 🔴 Cao | Sticky bar, summary column |
| 7 | `pages/cart/payment.vue` | 🟡 Trung | Sticky bar, full-width form |

### Phase 3: Sidebar → Chips Pattern (Ngày 3)

| STT | File | Ưu tiên | Ghi chú |
|---|---|---|---|
| 8 | `pages/policy/index.vue` | 🟡 Trung | Thêm scroll ngang, 767.98px, 480px |
| 9 | `pages/tos/index.vue` | 🟡 Trung | Copy pattern từ policy |

### Phase 4: Standalone Pages (Ngày 3-4)

| STT | File | Ưu tiên | Ghi chú |
|---|---|---|---|
| 10 | `pages/profile/index.vue` | 🟢 Thấp | Bổ sung 991.98px |
| 11 | `pages/account/vouchers.vue` | 🟢 Thấp | Tablet card layout |
| 12 | `pages/khuyen-mai/index.vue` | 🟢 Thấp | Container padding |
| 13 | `pages/tin-tuc/index.vue` | 🟢 Thấp | Container padding |
| 14 | `pages/lien-he/index.vue` | 🟢 Thấp | Contact layout |

### Phase 5: Component Pages (Ngày 4-5)

| STT | Component | Ưu tiên | Ghi chú |
|---|---|---|---|
| 15 | `CartPage.vue` | 🔴 Cao | Cart chính |
| 16 | `ProductDetailPage.vue` | 🔴 Cao | Trang sản phẩm |
| 17 | `ProductList.vue` | 🟡 Trung | Trang danh sách |
| 18 | Home* components | 🟡 Trung | Homepage sections |

### Phase 6: Global CSS (Ngày 5)

| STT | Task | Ghi chú |
|---|---|---|
| 19 | Tạo `public/assets/css/responsive.css` | CSS variables + scrollbar + card-base |
| 20 | Import trong `nuxt.config.ts` | |
| 21 | Cleanup duplicate styles | Đảm bảo không trùng lặp |

### Phase 7: QA & Polish (Ngày 5-6)

| STT | Task |
|---|
| 22 | Test trên tất cả 17 device sizes |
| 23 | Kiểm tra scroll-x overflow trên mobile |
| 24 | Kiểm tra font-size readability trên từng breakpoint |
| 25 | Kiểm tra tap-target size (min 44px) cho buttons |

---

## Checklist Responsive Từng Breakpoint

Với mỗi page/page-group, đảm bảo:

- [ ] **375px (iPhone SE)**: Font sizes, spacing, tap targets ≥44px
- [ ] **390px (iPhone Pro)**: Tương tự SE
- [ ] **430px (iPhone Plus)**: Line breaks hợp lý
- [ ] **768px (iPad Mini)**: Grid 2-col vẫn hiển thị đúng
- [ ] **834px (iPad Air)**: Sidebar sticky vẫn hoạt động
- [ ] **992px (Desktop threshold)**: 2-col grid, sidebar visible
- [ ] **1200px (Wide)**: Max-width không stretch quá rộng
- [ ] **Scroll areas**: Horizontal scrollbar hidden, `-webkit-overflow-scrolling: touch`
- [ ] **Images**: `max-width: 100%`, `height: auto`
- [ ] **No horizontal overflow**: `overflow-x: hidden` trên root elements
