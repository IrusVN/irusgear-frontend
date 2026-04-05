# API Integration Guide

## Overview
Dự án đã được cấu trúc sẵn để dễ dàng tích hợp API. Tất cả mock data đều nằm trong `services/` và có thể thay thế bằng API calls thực tế.

## Cấu trúc

```
services/
  └── dashboardService.ts    # Dashboard API calls
types/
  └── dashboard.ts           # TypeScript types
composables/
  └── useDashboard.ts        # State management & logic
```

## Cách tích hợp API

### 1. Cấu hình Base URL

Thêm vào `.env`:
```env
NUXT_PUBLIC_API_BASE=https://api.yourdomain.com
```

Hoặc trong `nuxt.config.ts`:
```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001'
    }
  }
})
```

### 2. Thay thế Mock Data

Mở file `services/dashboardService.ts` và thay thế mock data bằng API calls:

#### Ví dụ: Get Dashboard Stats

**Trước (Mock):**
```typescript
async getStats(): Promise<DashboardStats> {
  return {
    totalRevenue: 2500000000,
    totalOrders: 1234,
    // ...
  }
}
```

**Sau (API):**
```typescript
async getStats(): Promise<DashboardStats> {
  const config = useRuntimeConfig()
  const token = useCookie('auth_token').value
  
  const data = await $fetch<DashboardStats>('/api/dashboard/stats', {
    baseURL: config.public.apiBase,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  
  return data
}
```

### 3. API Endpoints cần implement

#### Dashboard Stats
- **Endpoint:** `GET /api/dashboard/stats`
- **Response:**
```json
{
  "totalRevenue": 2500000000,
  "totalOrders": 1234,
  "totalCustomers": 8456,
  "totalProducts": 567,
  "revenueChange": 12.5,
  "ordersChange": 8.2,
  "customersChange": 5.7,
  "productsChange": -2.1
}
```

#### Recent Orders
- **Endpoint:** `GET /api/dashboard/orders/recent?limit=5`
- **Response:**
```json
[
  {
    "id": "10234",
    "customer": "Nguyễn Văn A",
    "date": "05/04/2026",
    "amount": 15000000,
    "status": "delivered"
  }
]
```

#### Top Products
- **Endpoint:** `GET /api/dashboard/products/top?limit=5`
- **Response:**
```json
[
  {
    "id": 1,
    "name": "iPhone 17 Pro Max",
    "sold": 245,
    "revenue": 735000000,
    "percentage": 95,
    "image": "/path/to/image.png"
  }
]
```

#### Sales Data
- **Endpoint:** `GET /api/dashboard/sales?period=12m`
- **Query params:** `period` = `7d` | `30d` | `12m`
- **Response:**
```json
{
  "7d": {
    "labels": ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
    "data": [12, 19, 15, 25, 22, 30, 28]
  },
  "30d": { ... },
  "12m": { ... }
}
```

## Error Handling

Service đã có sẵn error handling trong composable. Khi API trả về lỗi:

```typescript
try {
  const data = await dashboardService.getStats()
} catch (err) {
  // Error sẽ được catch và hiển thị trong UI
  console.error('API Error:', err)
}
```

## Authentication

Để thêm authentication token vào mọi request, có thể tạo một wrapper function:

```typescript
// utils/api.ts
export const apiCall = async (url: string, options = {}) => {
  const config = useRuntimeConfig()
  const token = useCookie('auth_token').value
  
  return $fetch(url, {
    baseURL: config.public.apiBase,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  })
}
```

Sau đó sử dụng:
```typescript
const data = await apiCall<DashboardStats>('/api/dashboard/stats')
```

## Testing

Để test API integration:

1. Cập nhật `.env` với API URL thật
2. Thay thế mock data trong service
3. Reload trang dashboard
4. Kiểm tra Network tab trong DevTools

## Notes

- Tất cả types đã được định nghĩa trong `types/dashboard.ts`
- Components không cần thay đổi, chỉ cần update service
- Loading states và error handling đã được implement sẵn
- Có thể thêm interceptors cho retry logic, refresh token, etc.
