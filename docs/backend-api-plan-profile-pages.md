# Kế Hoạch API Backend — Profile Layout Pages

> **Ngày tạo:** 2026-05-08
> **Cập nhật lần cuối:** 2026-05-08 (v3 — reflects actual implementation)
> **Người thực hiện:** Senior Backend — IrusGear Backend Implementation
> **Mục đích:** Frontend team dùng tài liệu này để consume chính xác các API đã được backend triển khai
> **Trạng thái:** ✅ **ĐÃ IMPLEMENT** — tất cả 11 endpoints + Frontend Integration đã hoàn thành

---

## Mục Lục

1. [Tổng Quan](#1-tổng-quan)
2. [API-01 — Profile Dashboard](#2-api-01--profile-dashboard)
3. [API-02 — Orders List](#3-api-02--orders-list)
4. [API-03 — Warranty Lookup](#4-api-03--warranty-lookup)
5. [API-04 — Trade-in History](#5-api-04--trade-in-history)
6. [API-05 — Member Ranks / Promotions](#6-api-05--member-ranks--promotions)
7. [API-06 — User Info (PUT Profile, Social Links, Password)](#7-api-06--user-info)
8. [API-07 — Policy Pages](#8-api-07--policy-pages)
9. [API-08 — Terms of Service Pages](#9-api-08--terms-of-service-pages)
10. [Error Handling](#10-error-handling)
11. [Tổng Hợp Endpoints](#11-tổng-hợp-endpoints)

---

## 1. Tổng Quan

### 1.1 Base URL

```
Base: {API_BASE_URL}/api/v1
Auth: Bearer token (Cookie: Sanctum)
Format: application/json
```

### 1.2 Endpoints ĐÃ TRIỂN KHAI

| # | Method | Endpoint | Auth | Trạng thái |
|---|---|---|---|---|
| 1 | GET | `/profile/dashboard` | ✅ | ✅ Xong |
| 2 | GET | `/orders` | ✅ | ✅ Xong |
| 3 | GET | `/warranties` | ✅ | ✅ Xong |
| 4 | GET | `/tradeins` | ✅ | ✅ Xong |
| 5 | GET | `/member-rank` | ✅ | ✅ Xong |
| 6 | GET | `/member-rank/benefits` | ✅ | ✅ Xong |
| 7 | GET | `/social-links` | ✅ | ✅ Xong |
| 8 | PUT | `/profile` | ✅ | ✅ Xong |
| 9 | POST | `/password/change` | ✅ | ✅ Xong |
| 10 | GET | `/content/policies` | ❌ | ✅ Xong |
| 11 | GET | `/content/terms` | ❌ | ✅ Xong |

---

## 2. API-01 — Profile Dashboard

**Route:** `GET /api/v1/profile/dashboard`
**Auth:** ✅ Required
**Cache:** 5 phút

### 2.1 Request

```
GET /api/v1/profile/dashboard
Query params:
  recent_orders_limit: int (default: 4)
  favorites_limit: int (default: 6)
```

### 2.2 Response — 200 OK

```json
{
  "success": true,
  "data": {
    "recent_orders": {
      "total": 3,
      "see_all_url": "/orders",
      "orders": [
        {
          "id": "1",
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
              "name": "iPhone 16 Pro Max 256GB",
              "image_url": "https://cdn.example.com/image.jpg",
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
          "name": "iPhone 17 Pro Max 256GB",
          "slug": "iphone-17-pro-max-256gb",
          "image_url": "https://cdn.example.com/image.jpg",
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

- **`offers.items`** luôn trả `[]` (empty array) — cần FE tự fetch từ `/member-rank/benefits` + `/checkout/vouchers`
- **`offers.see_all_url`** = `"/promotion"` — FE navigate đến trang khuyến mãi
- **`recent_orders.orders[].items`** chỉ lấy tối đa 3 sản phẩm đầu tiên
- **`favorites.items[].product_id`** = `product.slug` (dùng cho navigation)
- **`order.status.icon`** mapping:
  - `pending`, `awaiting_payment` → `bi bi-clock`
  - `confirmed`, `processing` → `bi bi-hourglass-split`
  - `ready_to_ship`, `shipped` → `bi bi-truck`
  - `delivering` → `bi bi-geo-alt`
  - `delivered` → `bi bi-check-circle`
  - `cancelled` → `bi bi-x-circle`
  - `refunding`, `refunded` → `bi bi-arrow-left-circle`
  - default → `bi bi-info-circle`

---

## 3. API-02 — Orders List

**Route:** `GET /api/v1/orders`
**Auth:** ✅ Required
**Cache:** 1 phút

### 3.1 Request

```
GET /api/v1/orders
Query params:
  status: string (optional) — pending|confirmed|processing|ready_to_ship|shipped|delivering|delivered|cancelled|refunding|refunded (default: all)
  date_from: string (optional) — ISO date: 2026-05-01
  date_to: string (optional) — ISO date: 2026-05-08
  limit: int (default: 10)
  page: int (default: 1)
```

### 3.2 Response — 200 OK

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "1",
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
            "name": "iPhone 16 Pro Max 256GB",
            "image_url": "https://cdn.example.com/image.jpg",
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
      "items_per_page": 10,
      "has_next_page": true,
      "has_prev_page": false
    }
  }
}
```

### 3.3 Ghi chú

- **`orders[].id`** là string — cast từ `$order->id` (bigint → string)
- **`date`** format: ISO 8601 with timezone `+07:00`
- **`total_formatted`**: string VND đã format (VD: `"14.990.000đ"`)
- **`pagination.has_next_page`** / **`has_prev_page`**: FE dùng để disable/enable pagination buttons
- **Status labels** được lấy từ `OrderStatus::label()` enum method — FE nên hard-code theo map ở trên

---

## 4. API-03 — Warranty Lookup

**Route:** `GET /api/v1/warranties`
**Auth:** ✅ Required
**Cache:** 1 phút

### 4.1 Request

```
GET /api/v1/warranties
Query params:
  status: string (optional) — received|coordinating|repairing|done|returned (default: all)
  q: string (optional) — search query (warranty_code, product_name, serial, imei)
  page: int (default: 1)
  limit: int (default: 10)
```

### 4.2 Response — 200 OK

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
          "name": "iPhone 16 Pro Max 256GB",
          "image_url": "https://cdn.example.com/image.jpg",
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
      "items_per_page": 10,
      "has_next_page": false,
      "has_prev_page": false
    }
  }
}
```

### 4.3 Ghi chú

- **`id`** = `warranty_code` (string unique, VD: `"WBH001234"`)
- **Timeline auto-generated**: nếu warranty không có stored timeline, backend tự generate dựa trên status position
  - `received` → bước 1 active
  - `coordinating` → bước 2 active
  - `repairing` → bước 3 active
  - `done` / `returned` → tất cả done
- **`serial`/`imei`**: trả `"N/A"` nếu null trong DB
- **Status icon mapping**:
  - `received` → `bi bi-check-circle`
  - `coordinating` → `bi bi-person-badge`
  - `repairing` → `bi bi-tools`
  - `done` → `bi bi-check2-all`
  - `returned` → `bi bi-box-seam`

---

## 5. API-04 — Trade-in History

**Route:** `GET /api/v1/tradeins`
**Auth:** ✅ Required
**Cache:** 1 phút

### 5.1 Request

```
GET /api/v1/tradeins
Query params:
  date_from: string (optional) — ISO date
  date_to: string (optional) — ISO date
  page: int (default: 1)
  limit: int (default: 10)
```

### 5.2 Response — 200 OK

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
          "name": "iPhone 14 Pro 128GB",
          "image_url": "https://cdn.example.com/image.jpg",
          "capacity": "128GB"
        },
        "new_device": {
          "name": "iPhone 16 Pro Max 256GB",
          "image_url": "https://cdn.example.com/image.jpg",
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
      "items_per_page": 10,
      "has_next_page": false,
      "has_prev_page": false
    }
  }
}
```

### 5.3 Ghi chú

- **`id`** = `tradein_code` (string, VD: `"TC001234"`)
- **Status mapping**:
  - `pending` → `bi bi-hourglass-split` / "Đang xử lý"
  - `done` → `bi bi-check-circle` / "Hoàn tất"
  - `cancelled` → `bi bi-x-circle` / "Đã hủy"

---

## 6. API-05 — Member Ranks / Promotions

### 6.1 GET /api/v1/member-rank

**Auth:** ✅ Required
**Cache:** 15 phút

```json
{
  "success": true,
  "data": {
    "current_user": {
      "name": "NGUYEN VAN A",
      "rank_key": "snull",
      "total_spent": 0,
      "total_spent_formatted": "0đ",
      "spent_threshold": 0,
      "spent_threshold_formatted": "0đ",
      "progress_percent": 0,
      "next_rank_key": "snew",
      "next_rank_name": "S-NEW",
      "next_rank_threshold": 3000000,
      "next_rank_threshold_formatted": "3.000.000đ",
      "amount_to_next_rank_formatted": "3.000.000đ",
      "renewal_date": "2027-01-01",
      "is_student": false,
      "student_tag": null
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
        "is_active": true
      },
      {
        "key": "smem",
        "name": "S-MEM",
        "threshold_display": "10.000.000đ - 30.000.000đ",
        "status": "locked",
        "icon": "bi bi-star-fill",
        "bg_image_url": "https://cdn-static.smember.com.vn/_next/static/media/smem-bg-card.1fa74fdc.png",
        "is_active": true
      },
      {
        "key": "svip",
        "name": "S-VIP",
        "threshold_display": "30.000.000đ+",
        "status": "locked",
        "icon": "bi bi-gem",
        "bg_image_url": "https://cdn-static.smember.com.vn/_next/static/media/svip-bg-card.59d559cc.png",
        "is_active": true
      }
    ]
  }
}
```

### 6.2 GET /api/v1/member-rank/benefits

**Auth:** ✅ Required
**Cache:** no-cache (dynamic per user)

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
        "type": "service",
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

- **`ranks[].status`**: `"current"` | `"locked"` | `"done"`
- **`ranks[].is_active`**: luôn `true` (4 ranks đều active trong DB)
- **`current_user.progress_percent`**: 0-100, dùng cho progress bar
- **`current_user.spent_threshold`**: threshold của rank HIỆN TẠI (not next)
- **`amount_to_next_rank_formatted`**: `max(0, next_threshold - total_spent)`, trả `"0đ"` nếu đã max rank
- **`is_student`** = `true` khi user có tag sinh viên, **`student_tag`** = string tag (VD: `"S-Student"`)
- **`benefits`** hiện tại là static arrays — nếu rank != `snull` thì `is_locked: false` và mô tả khác

### 6.4 GET /api/v1/checkout/vouchers

**Auth:** ✅ Required
**Cache:** no-cache (dynamic per user)

```json
{
  "success": true,
  "data": {
    "vouchers": [
      {
        "id": "voucher_001",
        "code": "GIAM10K",
        "type": "percentage",
        "value": 10,
        "value_formatted": "10%",
        "min_order_amount": 200000,
        "max_discount_amount": 50000,
        "expired_at": "2026-06-30T23:59:59+07:00",
        "is_used": false,
        "applicable_categories": ["Điện thoại", "Tablet"]
      }
    ]
  }
}
```

### 6.5 Ghi chú vouchers

- **`type`**: `"percentage"` | `"fixed"` | `"shipping"`
- **`is_used`**: `true` = đã dùng / hết hạn → FE hiển thị mờ + badge "Đã sử dụng"
- **`applicable_categories`**: mảng string, có thể `[]` (áp dụng toàn bộ)
- Nếu không có vouchers: `{ "success": true, "data": { "vouchers": [] } }`
- FE gộp kết quả với `member-rank/benefits` để render "Your Offers"

---

## 7. API-06 — User Info

### 7.1 PUT /api/v1/profile

**Auth:** ✅ Required

**Request body:**
```json
{
  "full_name": "Mai Le Huy Hoang",
  "gender": "male",
  "birthday": "2003-06-02"
}
```

> **Validation:**
> - `full_name`: required, string, max 255
> - `gender`: nullable, in: `male`, `female`, `other`
> - `birthday`: nullable, date format `Y-m-d`

**Response — 200 OK:**
```json
{
  "success": true,
  "message": "Cập nhật thông tin thành công",
  "data": {
    "id": 1,
    "name": "Mai Le Huy Hoang",
    "first_name": "Mai",
    "last_name": "Le Huy Hoang",
    "full_name": "Mai Le Huy Hoang",
    "email": "user@example.com",
    "email_verified_at": "2026-01-15T10:00:00+07:00",
    "birthday": "2003-06-02",
    "created_at": "2025-01-01T00:00:00+07:00",
    "updated_at": "2026-05-08T12:00:00+07:00"
  }
}
```

### 7.2 GET /api/v1/social-links

**Auth:** ✅ Required

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

**Auth:** ✅ Required
**Rate Limit:** 5 requests / 60 minutes

**Request body:**
```json
{
  "current_password": "oldPassword123",
  "new_password": "newPassword456",
  "new_password_confirmation": "newPassword456"
}
```

**Response — 200 OK:**
```json
{
  "success": true,
  "message": "Đổi mật khẩu thành công"
}
```

**Response — 422 (sai mật khẩu cũ):**
```json
{
  "success": false,
  "message": "Mật khẩu hiện tại không chính xác"
}
```

---

## 8. API-07 — Policy Pages

**Route:** `GET /api/v1/content/policies`
**Auth:** ❌ Public
**Cache:** 24 giờ

### 8.1 Request

```
GET /api/v1/content/policies
Query params:
  section: string (optional) — return|standard|components|vip|accidental|s24plus (default: all)
  locale: string (default: vi)
```

### 8.2 Response — 200 OK

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
        ],
        "highlights": [],
        "hotlines": []
      },
      {
        "key": "standard",
        "label": "II. Bảo hành tiêu chuẩn",
        "title": "II. Bảo hành tiêu chuẩn",
        "description": null,
        "tables": [],
        "lists": [],
        "notices": [],
        "highlights": [],
        "hotlines": []
      },
      {
        "key": "accidental",
        "label": "V. Bảo hành rơi vỡ, ngấm nước",
        "title": "V. Bảo hành rơi vỡ, ngấm nước",
        "tables": [],
        "lists": [],
        "notices": [],
        "highlights": [
          {
            "id": "accidental_highlight_1",
            "content": "Khách hàng sử dụng dịch vụ này có đặc quyền <strong>+3% tổng giá trị máy thu cũ</strong> khi lên đời trong thời gian bảo hành của thiết bị."
          }
        ],
        "hotlines": []
      }
    ]
  }
}
```

### 8.3 Ghi chú

- **Fallback**: nếu DB không có data, backend trả hardcoded defaults (đảm bảo FE luôn có content)
- **6 sections**: `return`, `standard`, `components`, `vip`, `accidental`, `s24plus`
- **Rich HTML**: `tables`, `lists`, `notices` chứa HTML (`<strong>`, `<br>`) → FE dùng `v-html`
- **Sanitize**: CẦN FE sử dụng `v-html` với sanitize (VD: `dompurify` hoặc Vue `v-html` + CSP)
- **`highlights`**: chỉ có ở section `accidental`
- **`hotlines`**: luôn trả empty array ở policy (có ở terms section `sforum`)

---

## 9. API-08 — Terms of Service Pages

**Route:** `GET /api/v1/content/terms`
**Auth:** ❌ Public
**Cache:** 24 giờ

### 9.1 Request

```
GET /api/v1/content/terms
Query params:
  section: string (optional) — general|transaction|warranty|cancellation|privacy-cellphones|privacy-sforum|sforum (default: all)
  locale: string (default: vi)
```

### 9.2 Response — 200 OK

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
              "Website thương mại điện tử <strong>cellphones.com.vn</strong> là sở hữu của Công ty TNHH..."
            ]
          }
        ],
        "notices": [],
        "highlights": [],
        "hotlines": []
      },
      {
        "key": "sforum",
        "label": "VII. Thỏa thuận Sforum",
        "title": "VII. Thỏa thuận cung cấp và sử dụng dịch vụ trên Sforum",
        "lists": [],
        "notices": [],
        "highlights": [],
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

- **7 sections**: `general`, `transaction`, `warranty`, `cancellation`, `privacy-cellphones`, `privacy-sforum`, `sforum`
- **`hotlines`** chỉ có ở section `sforum`, các section khác trả `[]`
- **Rich HTML**: tương tự policy — cần sanitize
- **Fallback**: nếu DB trống trả hardcoded defaults

---

## 10. Error Handling

### 10.1 Error Response Format

```json
{
  "success": false,
  "message": "Mật khẩu hiện tại không chính xác"
}
```

hoặc với validation errors (422):

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "new_password": ["Mật khẩu mới phải có ít nhất 8 ký tự."]
  }
}
```

### 10.2 HTTP Status Codes

| Status | Khi nào |
|---|---|
| 200 | Success |
| 401 | Unauthorized — chưa đăng nhập |
| 403 | Forbidden — không có quyền |
| 404 | Not Found |
| 422 | Validation error |
| 429 | Too Many Requests — rate limit exceeded |
| 500 | Internal Server Error |

### 10.3 401 Handling (Frontend)

```js
// Interceptor example
if (response.status === 401) {
  // Redirect to login, save current URL
  const currentPath = window.location.pathname
  localStorage.setItem('redirect_after_login', currentPath)
  window.location.href = '/login'
}
```

---

## 11. Tổng Hợp Endpoints

| Method | Endpoint | Auth | Cache | Rate Limit |
|---|---|---|---|---|
| GET | `/profile/dashboard` | ✅ | 5 phút | 60/min |
| GET | `/orders` | ✅ | 1 phút | 5/min |
| GET | `/warranties` | ✅ | 1 phút | 60/min |
| GET | `/tradeins` | ✅ | 1 phút | 60/min |
| GET | `/member-rank` | ✅ | 15 phút | 60/min |
| GET | `/member-rank/benefits` | ✅ | no-cache | 60/min |
| GET | `/checkout/vouchers` | ✅ | no-cache | 60/min |
| GET | `/social-links` | ✅ | no-cache | 60/min |
| PUT | `/profile` | ✅ | no-cache | no-limit |
| POST | `/password/change` | ✅ | no-cache | 5/giờ |
| GET | `/content/policies` | ❌ | 24 giờ | 100/min |
| GET | `/content/terms` | ❌ | 24 giờ | 100/min |

### 11.1 Pagination Object (Common)

Tất cả endpoints có pagination đều trả:

```json
"pagination": {
  "current_page": 1,
  "total_pages": 5,
  "total_items": 47,
  "items_per_page": 10,
  "has_next_page": true,
  "has_prev_page": false
}
```

### 11.2 Common Field Notes

| Field | Format | Ví dụ |
|---|---|---|
| Tiền VND | String đã format | `"14.990.000đ"` |
| Ngày giờ | ISO 8601 +07:00 | `"2026-05-08T10:30:00+07:00"` |
| Ngày đơn lẻ | Y-m-d | `"2026-05-08"` |
| Icons | Bootstrap Icons class | `"bi bi-clock"` |

### 11.3 File Backend Liên Quan

| File | Mục đích |
|---|---|
| `app/Http/Controllers/Api/ProfileController.php` | dashboard, socialLinks |
| `app/Http/Controllers/Api/OrderController.php` | orders list |
| `app/Http/Controllers/Api/WarrantyController.php` | warranties list |
| `app/Http/Controllers/Api/TradeInController.php` | tradeins list |
| `app/Http/Controllers/Api/MemberRankController.php` | member-rank, benefits |
| `app/Http/Controllers/Api/VoucherController.php` | checkout/vouchers |
| `app/Http/Controllers/Api/ContentController.php` | policies, terms |
| `app/Http/Controllers/User/UserController.php` | updateProfile, changePassword |
| `routes/api.php` | tất cả routes |
| `database/migrations/*_create_warranties_table.php` | warranties schema |
| `database/migrations/*_create_tradeins_table.php` | tradeins schema |
| `database/migrations/*_create_member_ranks_table.php` | member_ranks + pivot |
| `database/migrations/*_create_user_social_links_table.php` | social links schema |
| `database/migrations/*_create_static_contents_table.php` | policies/terms schema |

### 11.4 Đã Hoàn Thành

- ✅ **MemberRankSeeder** — 4 ranks (S-NULL, S-NEW, S-MEM, S-VIP) + 11 benefits
- ✅ **StaticContentSeeder** — 6 policy sections + 7 terms sections

### 11.5 Đã Hoàn Thành (Frontend)

- ✅ **profileDashboardStore.js** — `fetchOffers()` gọi song song `/checkout/vouchers` + `/member-rank/benefits`, merge vào `offers.items`
- ✅ **pages/profile/index.vue** — render voucher cards (red gradient, code, copy button, expiry) + benefit cards (icon, title, lock state) + loading skeleton
- ✅ **i18n/vi.js + en.js** — thêm keys: `copyCode`, `expires`, `used`
