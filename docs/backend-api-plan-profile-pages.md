# Kế Hoạch API Backend — Profile Layout Pages

> **Ngày tạo:** 2026-05-08
> **Cập nhật lần cuối:** 2026-05-08 (v2 — loại bỏ endpoints đã có sẵn)
> **Người thực hiện:** Senior Frontend — IrusGear Frontend Review
> **Mục đích:** Backend triển khai API endpoints còn thiếu cho 8 trang sử dụng layout `profile`
> **Cơ sở:** Phân tích chi tiết code từng page tại `pages/*/index.vue` + kiểm tra stores hiện có

---

## Mục Lục

1. [Tổng Quan — Đã Có vs Cần Triển Khai](#1-tổng-quan--đã-có-vs-cần-triển-khai)
2. [API-01 — Profile Dashboard](#api-01--profile-dashboard)
3. [API-02 — Orders List](#api-02--orders-list)
4. [API-03 — Warranty Lookup](#api-03--warranty-lookup)
5. [API-04 — Trade-in History](#api-04--trade-in-history)
6. [API-05 — Member Ranks / Promotions](#api-05--member-ranks--promotions)
7. [API-06 — Policy Pages](#api-06--policy-pages)
8. [API-07 — Terms of Service Pages](#api-07--terms-of-service-pages)
9. [Common Response Format & Pagination](#9-common-response-format--pagination)
10. [Error Handling](#10-error-handling)

---

## 1. Tổng Quan — Đã Có vs Cần Triển Khai

### 1.1 Base URL

```
Base: {API_BASE_URL}/api/v1
Auth: Bearer token hoặc cookie session (credentials: include)
Format: application/json
```

### 1.2 Endpoints ĐÃ CÓ (không cần triển khai)

Dựa trên `stores/authStore.js`, `stores/checkoutStore.js`, `stores/wishlistStore.js`, và `pages/account/vouchers.vue`:

| Method | Endpoint | Được dùng tại | Mục đích |
|---|---|---|---|
| GET | `/me` | `authStore.fetchUser()` | Lấy thông tin user hiện tại |
| GET | `/addresses` | `checkoutStore.fetchAddresses()` | Danh sách địa chỉ giao hàng |
| POST | `/addresses` | `checkoutStore.addAddress()` | Tạo địa chỉ mới |
| PUT | `/addresses/{id}` | `checkoutStore.updateAddress()` | Cập nhật địa chỉ |
| DELETE | `/addresses/{id}` | `checkoutStore.deleteAddress()` | Xóa địa chỉ |
| GET | `/orders` | `checkoutStore` (payment polling) | Chi tiết đơn hàng |
| POST | `/orders` | `checkoutStore.createOrder()` | Tạo đơn hàng |
| GET | `/checkout/vouchers` | `checkoutStore.fetchAvailableVouchers()` | Voucher khả dụng |
| POST | `/checkout/vouchers/validate` | `checkoutStore.applyVoucher()` | Validate voucher |
| GET | `/checkout/vouchers/history` | `pages/account/vouchers.vue` | Lịch sử sử dụng voucher |
| GET | `/checkout/delivery-options` | `checkoutStore.fetchDeliveryOptions()` | Phương thức giao hàng |
| POST | `/checkout/prepare` | `checkoutStore.prepareCheckout()` | Chuẩn bị checkout |
| POST | `/payment/{method}/create` | `checkoutStore.initPayment()` | Tạo payment |
| GET | `/payment/verify` | `checkoutStore.verifyPayment()` | Xác thực thanh toán |
| GET | `/products/{slug}` | `productStore.fetchProduct()` | Chi tiết sản phẩm |
| GET | `/products/{id}/suggestions` | `productStore.fetchSuggestions()` | Gợi ý sản phẩm |
| GET | `/wishlist` | `wishlistStore` | Sản phẩm yêu thích |

### 1.3 Endpoints CẦN TRIỂN KHAI (chỉ phần còn thiếu)

| # | Method | Endpoint | Page | Mục đích |
|---|---|---|---|---|
| 1 | GET | `/profile/dashboard` | `pages/profile/index.vue` | Dashboard: orders, favorites, offers (KHÔNG có banner) |
| 2 | GET | `/orders` (upgrade) | `pages/orders/index.vue` | Danh sách đơn hàng có filter (status, date) + pagination |
| 3 | GET | `/warranties` | `pages/warranty/index.vue` | Danh sách bảo hành có filter (status, search) + pagination |
| 4 | GET | `/tradeins` | `pages/tradein/index.vue` | Lịch sử thu cũ có filter date + pagination |
| 5 | GET | `/member-rank` | `pages/promotion/index.vue` | Thông tin hạng thành viên + toàn bộ ranks |
| 6 | GET | `/member-rank/benefits` | `pages/promotion/index.vue` | Quyền lợi của hạng hiện tại |
| 7 | GET | `/social-links` | `pages/user-info/index.vue` | Trạng thái liên kết tài khoản mạng xã hội |
| 8 | POST | `/profile` (update) | `pages/user-info/index.vue` | Cập nhật thông tin cá nhân (full_name, gender, birthday) |
| 9 | POST | `/password/change` | `pages/user-info/index.vue` | Đổi mật khẩu |
| 10 | GET | `/content/policies` | `pages/policy/index.vue` | Nội dung chính sách bảo hành (6 sections) |
| 11 | GET | `/content/terms` | `pages/tos/index.vue` | Nội dung điều khoản sử dụng (7 sections) |

---

## 2. API-01 — Profile Dashboard

**Page:** [pages/profile/index.vue](pages/profile/index.vue)
**Endpoint:** `GET /api/v1/profile/dashboard`
**Auth:** ✅ (cookie session)

### 2.1 Request

```
GET /api/v1/profile/dashboard
Query params:
  recent_orders_limit: int (default: 4)
  favorites_limit: int (default: 6)
```

### 2.2 Response — Success (200)

```json
{
  "success": true,
  "data": {
    "recent_orders": {
      "total": 3,
      "see_all_url": "/orders",
      "orders": [
        {
          "id": "100001",
          "date": "2026-05-05T10:30:00+07:00",
          "status": {
            "key": "pending",
            "label": "Chờ xác nhận",
            "icon": "bi bi-clock"
          },
          "total_formatted": "14.990.000đ",
          "item_count": 1,
          "items": [
            {
              "id": 1,
              "name": "iPhone 16 Pro Max 256GB - Titan Tự Nhiên",
              "image_url": "https://cdn2.cellphones.com.vn/358x358,webp,q100/...",
              "qty": 1,
              "price_formatted": "14.990.000đ",
              "original_price_formatted": "16.990.000đ"
            }
          ]
        }
      ]
    },

    "offers": {
      "total": 0,
      "see_all_url": "/promotion",
      "items": []
    },

    "favorites": {
      "total": 1,
      "see_all_url": "/wishlist",
      "items": [
        {
          "id": 1,
          "product_id": "iphone-17-pro-max-256gb",
          "name": "iPhone 17 Pro Max 256GB | Chính hãng",
          "slug": "iphone-17-pro-max-256gb",
          "image_url": "https://cdn2.cellphones.com.vn/356x356/...",
          "current_price_formatted": "37.590.000đ",
          "original_price_formatted": "37.990.000đ",
          "discount_percent": 1,
          "url": "/products/iphone-17-pro-max-256gb"
        }
      ]
    }
  }
}
```

### 2.3 Ghi chú

- **Không trả `notices` banner** — đã bỏ theo yêu cầu
- **`recent_orders`**: chỉ trả `limit` đơn hàng gần nhất, không cần pagination
- **`favorites`**: FE dùng endpoint `/wishlist` đã có → dashboard chỉ trả summary (total + vài items preview)
- **`offers`**: FE dùng endpoint `/member-rank/benefits` + `/checkout/vouchers` đã có → dashboard chỉ trả summary

---

## 3. API-02 — Orders List

**Page:** [pages/orders/index.vue](pages/orders/index.vue)
**Endpoint:** `GET /api/v1/orders`
**Auth:** ✅

### 3.1 Request

```
GET /api/v1/orders
Query params:
  status: string (optional) — pending|processing|shipping|delivered|cancelled|all (default: all)
  date_from: string (optional) — ISO date: 2026-05-01
  date_to: string (optional) — ISO date: 2026-05-08
  page: int (default: 1)
  limit: int (default: 10)
```

> **Lưu ý:** Endpoint `/orders` đã có — backend chỉ cần thêm filter `status` và `date_from`/`date_to`.

### 3.2 Response — Success (200)

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "100001",
        "date": "2026-05-05T10:30:00+07:00",
        "status": {
          "key": "pending",
          "label": "Chờ xác nhận",
          "icon": "bi bi-clock"
        },
        "total_formatted": "14.990.000đ",
        "items": [
          {
            "id": 1,
            "name": "iPhone 16 Pro Max 256GB - Titan Tự Nhiên",
            "image_url": "https://cdn2.cellphones.com.vn/358x358,webp,q100/...",
            "qty": 1,
            "price_formatted": "14.990.000đ",
            "original_price_formatted": "16.990.000đ"
          }
        ]
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_items": 24,
      "items_per_page": 10
    }
  }
}
```

### 3.3 Ghi chú

- **`status.key`** mapping: `pending` → "Chờ xác nhận", `processing` → "Đang xử lý", `shipping` → "Đang vận chuyển", `delivered` → "Đã nhận hàng", `cancelled` → "Đã huỷ"
- **Date format**: trả về ISO 8601 với timezone `+07:00`
- **`total_formatted`**: string đã format tiền VND (VD: "14.990.000đ")

---

## 4. API-03 — Warranty Lookup

**Page:** [pages/warranty/index.vue](pages/warranty/index.vue)
**Endpoint:** `GET /api/v1/warranties`
**Auth:** ✅

### 4.1 Request

```
GET /api/v1/warranties
Query params:
  status: string (optional) — received|coordinating|repairing|done|returned|all (default: all)
  q: string (optional) — search query (warranty_id, product_name, serial, imei)
  page: int (default: 1)
  limit: int (default: 10)
```

### 4.2 Response — Success (200)

```json
{
  "success": true,
  "data": {
    "warranties": [
      {
        "id": "WBH001234",
        "date": "2026-05-02T10:30:00+07:00",
        "status": {
          "key": "received",
          "label": "Đã tiếp nhận",
          "icon": "bi bi-check-circle"
        },
        "product": {
          "name": "iPhone 16 Pro Max 256GB - Titan Tự Nhiên",
          "image_url": "https://cdn2.cellphones.com.vn/358x358,webp,q100/...",
          "serial": "DGH7X1234",
          "imei": "352345678901234"
        },
        "purchase_date": "2026-03-15",
        "warranty_end": "2027-03-15",
        "service_center": "CellphoneS Nguyễn Trãi",
        "timeline": [
          {
            "title": "Tiếp nhận yêu cầu bảo hành",
            "time": "2026-05-02T10:30:00+07:00",
            "done": true,
            "current": false
          },
          {
            "title": "Đang điều phối kỹ thuật viên",
            "time": null,
            "done": false,
            "current": true
          },
          {
            "title": "Tiến hành kiểm tra và sửa chữa",
            "time": null,
            "done": false,
            "current": false
          },
          {
            "title": "Hoàn tất bảo hành - Trả máy",
            "time": null,
            "done": false,
            "current": false
          }
        ]
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 1,
      "total_items": 2,
      "items_per_page": 10
    }
  }
}
```

### 4.3 Ghi chú

- **`status.key`** mapping: `received` → "Đã tiếp nhận", `coordinating` → "Đang điều phối", `repairing` → "Đang sửa", `done` → "Đã sửa xong", `returned` → "Đã trả máy"
- **`timeline`**: mảng bước tiến trình. `done=true` = hoàn thành, `current=true` = bước hiện tại (FE có animation pulse). `time` = null nếu chưa đến bước đó.
- Search `q`: backend tìm trên `warranty_id`, `product.name`, `product.serial`, `product.imei`
- `serial`/`imei`: có thể là `null` hoặc "N/A" (VD: MacBook không có IMEI)

---

## 5. API-04 — Trade-in History

**Page:** [pages/tradein/index.vue](pages/tradein/index.vue)
**Endpoint:** `GET /api/v1/tradeins`
**Auth:** ✅

### 5.1 Request

```
GET /api/v1/tradeins
Query params:
  date_from: string (optional) — ISO date
  date_to: string (optional) — ISO date
  page: int (default: 1)
  limit: int (default: 10)
```

### 5.2 Response — Success (200)

```json
{
  "success": true,
  "data": {
    "tradeins": [
      {
        "id": "TC001234",
        "date": "2026-04-28T14:00:00+07:00",
        "status": {
          "key": "done",
          "label": "Hoàn tất",
          "icon": "bi bi-check-circle"
        },
        "old_device": {
          "name": "iPhone 14 Pro 128GB - Deep Purple",
          "image_url": "https://cdn2.cellphones.com.vn/358x358,webp,q100/...",
          "capacity": "128GB"
        },
        "new_device": {
          "name": "iPhone 16 Pro Max 256GB - Titan Tự Nhiên",
          "image_url": "https://cdn2.cellphones.com.vn/358x358,webp,q100/...",
          "capacity": "256GB"
        },
        "old_value_formatted": "10.500.000đ",
        "new_price_formatted": "27.990.000đ",
        "top_up_formatted": "17.490.000đ"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 1,
      "total_items": 2,
      "items_per_page": 10
    }
  }
}
```

### 5.3 Ghi chú

- **`status.key`** mapping: `pending` → "Đang xử lý", `done` → "Hoàn tất", `cancelled` → "Đã huỷ"
- **`top_up`** = `new_price` - `old_value`
- Tất cả giá trị tiền trả về dạng `*_formatted` đã format đầy đủ

---

## 6. API-05 — Member Ranks / Promotions

**Page:** [pages/promotion/index.vue](pages/promotion/index.vue)
**Auth:** ✅

### 6.1 GET /api/v1/member-rank

**Mục đích:** Thông tin hạng thành viên + toàn bộ danh sách ranks.

```json
{
  "success": true,
  "data": {
    "current_user": {
      "name": "MAI LÊ HUY HOÀNG",
      "rank_key": "snull",
      "total_spent": 0,
      "total_spent_formatted": "0đ",
      "spent_threshold": 3000000,
      "spent_threshold_formatted": "3.000.000đ",
      "progress_percent": 0,
      "next_rank_key": "snew",
      "next_rank_name": "S-NEW",
      "next_rank_threshold": 10000000,
      "next_rank_threshold_formatted": "10.000.000đ",
      "amount_to_next_rank_formatted": "3.000.000đ",
      "renewal_date": "2027-01-01",
      "is_student": true,
      "student_tag": "S-Student"
    },
    "ranks": [
      {
        "key": "snull",
        "name": "S-NULL",
        "threshold_display": "0đ - 3.000.000đ",
        "status": "current",
        "icon": "bi bi-star",
        "bg_image_url": "https://cdn-static.smember.com.vn/_next/static/media/snull-bg-card.7284811e.png",
        "is_active": true
      },
      {
        "key": "snew",
        "name": "S-NEW",
        "threshold_display": "3.000.000đ - 10.000.000đ",
        "status": "locked",
        "icon": "bi bi-star-fill",
        "bg_image_url": "https://cdn-static.smember.com.vn/_next/static/media/snew-bg-card.f753cfbc.png",
        "is_active": false
      },
      {
        "key": "smem",
        "name": "S-MEM",
        "threshold_display": "10.000.000đ - 30.000.000đ",
        "status": "locked",
        "icon": "bi bi-star-fill",
        "bg_image_url": "https://cdn-static.smember.com.vn/_next/static/media/smem-bg-card.1fa74fdc.png",
        "is_active": false
      },
      {
        "key": "svip",
        "name": "S-VIP",
        "threshold_display": "30.000.000đ+",
        "status": "locked",
        "icon": "bi bi-gem",
        "bg_image_url": "https://cdn-static.smember.com.vn/_next/static/media/svip-bg-card.59d559cc.png",
        "is_active": false
      }
    ]
  }
}
```

### 6.2 GET /api/v1/member-rank/benefits

**Mục đích:** Quyền lợi của hạng hiện tại.

```json
{
  "success": true,
  "data": {
    "shopping_benefits": [
      {
        "id": "benefit_001",
        "type": "discount",
        "title": "Ưu đãi mua hàng",
        "description": "Hiện chưa có ưu đãi mua hàng đặc biệt cho hạng thành viên S-NULL",
        "is_locked": true,
        "icon": "bi bi-cart"
      }
    ],
    "service_policies": [
      {
        "id": "policy_001",
        "title": "Chính sách phục vụ",
        "description": "Hiện chưa có chính sách ưu đãi phục vụ đặc biệt cho hạng thành viên S-NULL",
        "is_locked": true,
        "icon": "bi bi-shield-lock"
      }
    ]
  }
}
```

### 6.3 Ghi chú

- **Luôn trả đầy đủ 4 ranks** để FE render carousel stepper
- **`progress_percent`**: số 0-100, FE fill progress bar
- **`is_student`**: boolean — nếu true hiện tag "S-Student"
- **`ranks[].status`**: "current" | "locked" | "done"
- `bg_image_url` + `icon` có thể hard-code phía FE nếu backend trả null

---

## 7. API-06 — User Info Cần Triển Khai

**Page:** [pages/user-info/index.vue](pages/user-info/index.vue)
**Auth:** ✅

### 7.1 PUT /api/v1/profile

> **Lưu ý:** `GET /me` đã có — chỉ cần thêm PUT để cập nhật.

**Mục đích:** Cập nhật thông tin cá nhân (full_name, gender, birthday).

**Request body:**
```json
{
  "full_name": "Mai Le Huy Hoang",
  "gender": "male|female|other|null",
  "birthday": "2003-06-02"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "full_name": "Mai Le Huy Hoang",
    "phone": "0971172603",
    "email": "hoangmai020603@gmail.com",
    "birthday": "2003-06-02",
    "gender": "male",
    "password_updated_at": "2026-02-02T15:28:00+07:00"
  }
}
```

### 7.2 GET /api/v1/social-links

**Mục đích:** Trạng thái liên kết tài khoản Google / Zalo.

```json
{
  "success": true,
  "data": {
    "links": [
      {
        "provider": "google",
        "provider_name": "Google",
        "provider_icon_url": "https://cdn-static.smember.com.vn/_next/static/media/logo-google.b6f9570f.svg",
        "is_linked": false,
        "linked_at": null,
        "link_url": "/auth/google/redirect",
        "unlink_url": null
      },
      {
        "provider": "zalo",
        "provider_name": "Zalo",
        "provider_icon_url": "https://cdn-static.smember.com.vn/_next/static/media/logo-zalo.120d889f.svg",
        "is_linked": false,
        "linked_at": null,
        "link_url": "/auth/zalo/redirect",
        "unlink_url": null
      }
    ]
  }
}
```

### 7.3 POST /api/v1/password/change

**Mục đích:** Thay đổi mật khẩu.

**Request body:**
```json
{
  "current_password": "oldPassword123",
  "new_password": "newPassword456",
  "new_password_confirmation": "newPassword456"
}
```

---

## 8. API-07 — Policy Pages

**Page:** [pages/policy/index.vue](pages/policy/index.vue)
**Endpoint:** `GET /api/v1/content/policies`
**Auth:** ❌ (public)

### 8.1 Request

```
GET /api/v1/content/policies
Query params:
  section: string (optional) — return|standard|components|vip|accidental|s24plus (default: all)
  locale: string (default: vi)
```

### 8.2 Response — Success (200)

```json
{
  "success": true,
  "data": {
    "sections": [
      {
        "key": "return",
        "label": "I. Đổi mới 30 ngày miễn phí",
        "title": "I. Đổi mới 30 ngày miễn phí",
        "description": "Áp dụng khi máy có lỗi phần cứng từ phía nhà sản xuất.",
        "tables": [
          {
            "id": "return_table_1",
            "headers": ["Sản phẩm", "Đổi mới miễn phí", "Quy định nhập lại, trả lại (thu cũ)"],
            "rows": [
              ["Điện thoại, Máy tính bảng, Macbook, Apple Watch", "30 ngày", "Trong 30 ngày đầu: trừ phí <strong>20%</strong> trên giá hiện tại.<br>Sau 30 ngày: Nhập lại theo giá thỏa thuận."],
              ["Samsung Watch", "30 ngày", "Trong 30 ngày đầu: trừ phí <strong>30%</strong> trên giá hiện tại.<br>Sau 30 ngày: Nhập lại theo giá thỏa thuận."]
            ]
          }
        ],
        "lists": [
          {
            "id": "return_conditions",
            "title": "Điều kiện đổi trả",
            "items": [
              "<strong>Máy mới:</strong> Như mới, không trầy xước, không dán decal, hình trang trí.",
              "<strong>Máy cũ:</strong> Có tình trạng sản phẩm như lúc mới mua."
            ]
          }
        ],
        "notices": [
          {
            "id": "return_notice_1",
            "content": "<strong>Lưu ý về dữ liệu:</strong> Khách hàng vui lòng tự sao lưu dữ liệu. Cửa hàng không chịu trách nhiệm về việc mất dữ liệu trong mọi trường hợp."
          }
        ]
      },
      {
        "key": "standard",
        "label": "II. Bảo hành tiêu chuẩn",
        "title": "II. Bảo hành tiêu chuẩn",
        "description": null,
        "tables": [...],
        "lists": [...],
        "notices": [...]
      },
      {
        "key": "components",
        "label": "III. Linh kiện máy tính",
        "title": "III. Bảo hành linh kiện máy tính",
        "tables": [...],
        "lists": [...],
        "notices": [...]
      },
      {
        "key": "vip",
        "label": "IV. Bảo hành 1 đổi 1 VIP",
        "title": "IV. Bảo hành 1 đổi 1 VIP",
        "tables": [...],
        "lists": [...],
        "notices": [...]
      },
      {
        "key": "accidental",
        "label": "V. Bảo hành rơi vỡ, ngấm nước",
        "title": "V. Bảo hành rơi vỡ, ngấm nước",
        "tables": [...],
        "lists": [...],
        "notices": [...],
        "highlights": [
          {
            "id": "accidental_highlight_1",
            "content": "Khách hàng sử dụng dịch vụ này có đặc quyền <strong>+3% tổng giá trị máy thu cũ</strong> khi lên đời trong thời gian bảo hành của thiết bị."
          }
        ]
      },
      {
        "key": "s24plus",
        "label": "VI. Bảo hành mở rộng S24+",
        "title": "VI. Bảo hành mở rộng S24+",
        "tables": [...],
        "lists": [...],
        "notices": [...],
        "highlights": [...]
      }
    ]
  }
}
```

### 8.3 Ghi chú

- **Cacheable**: nên cache CDN/Redis 1-24h
- **Rich text**: tables và lists chứa HTML (`<strong>`, `<br>`) → FE dùng `v-html`, cần sanitize
- **`highlights`**: container đặc biệt (background #fef2f2), dùng cho formula/trích dẫn quan trọng
- Backend có thể trả JSON static file từ CDN

---

## 9. API-08 — Terms of Service Pages

**Page:** [pages/tos/index.vue](pages/tos/index.vue)
**Endpoint:** `GET /api/v1/content/terms`
**Auth:** ❌ (public)

### 9.1 Request

```
GET /api/v1/content/terms
Query params:
  section: string (optional) — general|transaction|warranty|cancellation|privacy-cellphones|privacy-sforum|sforum (default: all)
  locale: string (default: vi)
```

### 9.2 Response — Success (200)

```json
{
  "success": true,
  "data": {
    "sections": [
      {
        "key": "general",
        "label": "I. Quy định chung",
        "title": "I. Quy định chung",
        "lists": [
          {
            "id": "general_1",
            "title": "1. Nguyên tắc chung",
            "items": [
              "Website thương mại điện tử <strong>cellphones.com.vn</strong> là sở hữu của Công ty TNHH...",
              "Sản phẩm được kinh doanh tại Cellphones.com.vn..."
            ]
          },
          {
            "id": "general_2",
            "title": "2. Định nghĩa",
            "items": [
              "<strong>Người bán</strong>: là Công ty TNHH Thương mại và Dịch vụ Kỹ thuật Diệu Phúc."
            ]
          }
        ],
        "notices": []
      },
      {
        "key": "transaction",
        "label": "II. Quy trình giao dịch",
        "title": "II. Quy trình giao dịch",
        "lists": [...],
        "tables": [...],
        "notices": [
          {
            "id": "transaction_notice_1",
            "content": "<strong>Lưu ý quan trọng:</strong> Với giao dịch có giá trị từ <strong>10 triệu đồng trở lên</strong>..."
          }
        ]
      },
      {
        "key": "warranty",
        "label": "III. Chính sách bảo hành sản phẩm",
        "title": "III. Chính sách bảo hành sản phẩm",
        "lists": [...],
        "tables": [...]
      },
      {
        "key": "cancellation",
        "label": "IV. Chính sách hủy đơn, đổi trả",
        "title": "IV. Chính sách hủy giao dịch, đổi trả hàng",
        "lists": [...],
        "tables": [...]
      },
      {
        "key": "privacy-cellphones",
        "label": "V. Bảo mật thông tin Cellphones",
        "title": "V. Chính sách bảo mật thông tin khách hàng Cellphones",
        "lists": [...],
        "notices": []
      },
      {
        "key": "privacy-sforum",
        "label": "VI. Bảo mật thông tin Sforum",
        "title": "VI. Chính sách bảo mật thông tin khách hàng Sforum",
        "lists": [...],
        "notices": []
      },
      {
        "key": "sforum",
        "label": "VII. Thỏa thuận Sforum",
        "title": "VII. Thỏa thuận cung cấp và sử dụng dịch vụ trên Sforum",
        "lists": [...],
        "hotlines": [
          { "label": "Gọi mua hàng", "value": "1800.2097 (8h00 – 22h00)" },
          { "label": "Gọi khiếu nại", "value": "1800.2063 (8h00 – 21h30)" },
          { "label": "Gọi bảo hành", "value": "1800.2064 (8h00 – 21h00)" }
        ]
      }
    ]
  }
}
```

### 9.3 Ghi chú

- **Cacheable**: cache 24-48h
- **`hotlines`**: chỉ có trong section `sforum`
- **`title`** = tiêu đề `<h1>`, **`label`** = text sidebar navigation
- Rich text chứa HTML → FE dùng `v-html`, cần sanitize

---

## 10. Common Response Format & Pagination

### 10.1 Success Response Wrapper

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "request_id": "req_abc123",
    "timestamp": "2026-05-08T12:00:00+07:00"
  }
}
```

### 10.2 Pagination Object

```json
{
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 47,
    "items_per_page": 10,
    "has_next_page": true,
    "has_prev_page": false
  }
}
```

---

## 11. Error Handling

### 11.1 Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu không hợp lệ",
    "details": [
      { "field": "phone", "message": "Số điện thoại không hợp lệ" }
    ]
  },
  "meta": { "request_id": "req_abc123" }
}
```

### 11.2 HTTP Status Codes

| Status | Ý nghĩa |
|---|---|
| 200 | Success |
| 400 | Bad Request |
| 401 | Unauthorized — chưa đăng nhập |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation error |
| 500 | Internal Server Error |

---

## 12. Tổng Hợp Endpoints CẦN Triển Khai

| Method | Endpoint | Mục đích | Auth |
|---|---|---|---|
| GET | `/profile/dashboard` | Dashboard summary (no banner) | ✅ |
| PUT | `/profile` | Cập nhật thông tin cá nhân | ✅ |
| GET | `/social-links` | Tài khoản liên kết mạng xã hội | ✅ |
| POST | `/password/change` | Đổi mật khẩu | ✅ |
| GET | `/orders` (upgrade) | Danh sách đơn hàng có filter + pagination | ✅ |
| GET | `/warranties` | Danh sách bảo hành có filter + pagination | ✅ |
| GET | `/tradeins` | Lịch sử thu cũ có filter + pagination | ✅ |
| GET | `/member-rank` | Thông tin hạng thành viên + ranks | ✅ |
| GET | `/member-rank/benefits` | Quyền lợi hạng thành viên | ✅ |
| GET | `/content/policies` | Nội dung chính sách bảo hành | ❌ |
| GET | `/content/terms` | Nội dung điều khoản sử dụng | ❌ |

---

## 13. Ghi Chú Triển Khai

### 13.1 Caching Strategy

| Endpoint | Cache TTL | Cache Key |
|---|---|---|
| `/profile/dashboard` | 5 phút | `profile:dashboard:{user_id}` |
| `/orders` (filtered) | 1 phút | `profile:orders:{user_id}:{status}:{page}` |
| `/warranties` | 1 phút | `profile:warranties:{user_id}:{status}:{q}:{page}` |
| `/tradeins` | 1 phút | `profile:tradeins:{user_id}:{page}` |
| `/member-rank` | 15 phút | `profile:rank:{user_id}` |
| `/content/policies` | 24 giờ | `content:policies:{locale}` |
| `/content/terms` | 24 giờ | `content:terms:{locale}` |

### 13.2 Rate Limiting

- Authenticated endpoints: **60 req/min/user**
- Content endpoints (Policy/TOS): **100 req/min/user**
- Password change: **5 req/hour/user**

### 13.3 DB Indexes

```sql
-- Orders
CREATE INDEX idx_orders_user_status_created ON orders(user_id, status, created_at DESC);

-- Warranties
CREATE INDEX idx_warranties_user_status ON warranties(user_id, status);
CREATE INDEX idx_warranties_user_search ON warranties(user_id, warranty_id, product_name);

-- Trade-ins
CREATE INDEX idx_tradeins_user_created ON tradeins(user_id, created_at DESC);
```

### 13.4 Integration Notes

- **Price formatting**: backend trả string đã format (VD: `"14.990.000đ"`) — FE không format lại
- **Date formatting**: backend trả ISO 8601, FE format sang `DD/MM/YYYY`
- **HTML in content**: Policy/TOS dùng `v-html`, cần sanitize
- **Images**: backend trả `image_url` đầy đủ (CDN + transforms)
- **Pagination**: backend trả đầy đủ metadata cho FE pagination/infinite scroll
- **401 handling**: FE redirect login + lưu URL để quay lại
