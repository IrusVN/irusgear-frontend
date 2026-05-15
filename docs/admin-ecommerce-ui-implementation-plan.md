# Kế Hoạch Triển Khai UI Admin Ecommerce

> Ngày tạo: 2026-05-15  
> Phạm vi: `pages/admin`, `layouts/admin.vue`, `components/Sidebar/AdminSidebar.vue`, dashboard components, mock data, Chart.js, animation.  
> Reference chính: các ảnh UI admin kiểu Vuexy/ecommerce mà user cung cấp. Không sao chép brand/logo/template; chỉ lấy layout pattern, nhịp spacing, table density, card structure và interaction pattern để chuyển thành UI IrusGear.

---

## 1. Mục Tiêu

Xây lại khu vực admin theo hướng ecommerce dashboard hiện đại, tối giản, thao tác nhanh:

- Sidebar phân cấp rõ cho Ecommerce: Dashboard, Products, Categories, Orders, Customers, Reviews, Settings.
- Topbar cố định trong content: global search, quick actions, notification, language/theme icons, profile dropdown.
- Dashboard có metric cards, Chart.js reports, top products, recent orders, transaction/order activity.
- Product, Category, Order, Customer pages có list table giống admin ecommerce chuyên nghiệp: filter, search, export, pagination, action menu, status badges.
- Detail pages có bố cục 2 cột: nội dung chính bên trái, customer/payment/address/summary bên phải.
- Mock data tập trung, có cấu trúc giống API thật để sau này thay backend dễ.
- Animation nhẹ bằng CSS/GSAP có sẵn trong `package.json`; không làm hiệu ứng nặng gây chậm thao tác admin.

---

## 2. Audit Nhanh Hiện Trạng

Các file user yêu cầu đã đọc:

- `pages/admin/dashboard/index.vue`
- `pages/admin/orders/index.vue`
- `pages/admin/products/index.vue`
- `components/Sidebar/AdminSidebar.vue`

Các file liên quan đã đọc thêm:

- `layouts/admin.vue`
- `components/Dashboard/StatCard.vue`
- `components/Dashboard/SalesChart.vue`
- `components/Dashboard/RecentOrders.vue`
- `components/Dashboard/TopProducts.vue`
- `composables/useDashboard.ts`
- `services/dashboardService.ts`
- `services/productService.ts`
- `types/dashboard.ts`
- `types/product.ts`

Vấn đề hiện tại:

- UI dùng Bootstrap cơ bản, chưa có ngôn ngữ visual thống nhất cho admin.
- Sidebar có nhiều item `#`, chưa phản ánh ecommerce admin thật.
- Một số text tiếng Việt đang bị lỗi encoding.
- Mock data nằm rải rác trong service/composable, nhiều giá trị random.
- Dashboard chart đơn giản, chưa có report card, tab, breakdown, timeline.
- Orders/products chưa có detail/create/edit flow hoàn chỉnh.
- Logout trong sidebar đang chỉ xóa cookie `auth_token`, không gọi đúng `authStore.logout()`.

---

## 3. Visual Direction Từ Ảnh Reference

Áp dụng các pattern sau:

- **Layout tổng thể:** sidebar trái rộng khoảng 260px, content max-width lớn, topbar nằm trong content, nền trắng/xám rất nhạt.
- **Sidebar:** menu có group title nhỏ, active item nền đen, chữ trắng, shadow nhẹ; submenu thụt vào, icon trái, chevron phải.
- **Topbar:** search input dài với shortcut hint `Ctrl K`, nhóm icon nhỏ bên phải, avatar có online dot, dropdown profile.
- **Card:** nền trắng, border `#e6e6e8`, radius 8-10px, không dùng card lồng card.
- **Metric strip:** card ngang chia 4 cột, mỗi metric có icon square pastel, value lớn, label nhỏ, growth badge.
- **Table:** hàng thấp, border mảnh, checkbox đầu dòng, action icon cuối dòng, pagination dạng pill, search/export/page-size ở toolbar.
- **Badge:** trạng thái dùng pastel rõ nghĩa: green publish/paid/delivered, cyan pickup, orange pending/scheduled, red failed/inactive, gray cancelled.
- **Detail pages:** header có mã đơn/customer ID, badges trạng thái, CTA danger bên phải; body 2 cột, timeline activity dọc.
- **Settings:** tab ngang có icon, form 2 cột, upload avatar, save/cancel, danger zone riêng.
- **CTA chính:** nút đen cho action chính (`Add Product`, `Save Changes`, `Create Invoice`), danger chỉ dùng cho delete/deactivate.

Brand IrusGear nên dùng trắng/đen/xám làm nền chính, cộng accent xanh cyan hoặc xanh lá chỉ cho semantic trạng thái. Không dùng màu tím Vuexy làm màu brand chính.

---

## 4. Route Map Đề Xuất

Giữ các route hiện có và bổ sung route còn thiếu:

| Route | Mục đích | Trạng thái |
|---|---|---|
| `/admin/dashboard` | Overview ecommerce, reports, chart, recent activity | Làm lại |
| `/admin/products` | Product list table/grid, filters, bulk action | Làm lại |
| `/admin/products/create` | Add product form | Thêm mới |
| `/admin/products/[id]/edit` | Edit product form | Thêm mới |
| `/admin/categories` | Category list, total products, total earning | Thêm mới |
| `/admin/orders` | Order list, payment/fulfillment status | Làm lại |
| `/admin/orders/[id]` | Order detail, shipping activity, customer/payment info | Thêm mới |
| `/admin/customers` | Customer list, spend/orders/country | Thêm mới |
| `/admin/customers/[id]` | Customer profile, tabs, order history | Thêm mới |
| `/admin/reviews` | Review management | Thêm mới, ưu tiên sau |
| `/admin/settings` | Account/settings form | Thêm mới |
| `/admin/analytics` | Advanced reports | Thêm mới, ưu tiên sau dashboard |

---

## 4.1 Vuexy Parity Target

Reference URL:

- `https://demos.pixinvent.com/vuexy-vuejs-admin-template/demo-2/dashboards/ecommerce`

Mục tiêu visual:

- Bám sát gần như 1:1 về layout, spacing, density, table structure, card composition, status badge, topbar/sidebar behavior và animation timing.
- Không copy logo Vuexy, text template, mascot/illustration có bản quyền, avatar/template asset hoặc footer/license của Pixinvent.
- Thay toàn bộ brand bằng IrusGear, nhưng giữ cùng nhịp UI:
  - Sidebar width, active state, submenu indentation.
  - Topbar search size, icon spacing, avatar dropdown placement.
  - Dashboard grid: hero card + statistics strip + report cards + table cards.
  - Product/order/customer table density và pagination.
  - Detail page two-column composition.
  - Settings tabs và form grid.

Mốc so sánh visual khi implement:

- Desktop viewport chính: `1920x1080` và `1440x900`.
- Tablet: `1024x768`.
- Mobile: `390x844`.
- Screenshot sau mỗi phase phải so với reference về:
  - Khoảng cách sidebar/content.
  - Border/radius/shadow.
  - Font size/weight.
  - Button height.
  - Table row height.
  - Badge color and padding.
  - Chart/card proportions.

---

## 5. Component Architecture

Tạo nhóm component admin riêng để không làm ảnh hưởng UI customer:

```text
components/Admin/
  layout/
    AdminTopbar.vue
    AdminProfileMenu.vue
    AdminPageShell.vue
  ui/
    AdminCard.vue
    AdminMetricCard.vue
    AdminStatusBadge.vue
    AdminDataTable.vue
    AdminTableToolbar.vue
    AdminPagination.vue
    AdminActionMenu.vue
    AdminEmptyState.vue
    AdminSkeleton.vue
    AdminTabs.vue
  charts/
    AdminLineChart.vue
    AdminBarChart.vue
    AdminDoughnutChart.vue
    AdminSparkline.vue
  ecommerce/
    OrderTimeline.vue
    OrderSummary.vue
    CustomerSummaryCard.vue
    ProductMediaCell.vue
    InventoryToggle.vue
```

Quy tắc:

- Các table/list page dùng chung `AdminDataTable` + `AdminTableToolbar`.
- Badge/status dùng chung `AdminStatusBadge`, không hard-code màu trong từng page.
- Chart.js chỉ import ở client side trong component chart.
- Page chỉ quản lý state/filter/mock action, không chứa quá nhiều CSS riêng.

---

## 6. Mock Data Và Types

Tạo mock tập trung:

```text
mocks/admin/
  dashboard.mock.ts
  products.mock.ts
  categories.mock.ts
  orders.mock.ts
  customers.mock.ts
  reviews.mock.ts
```

Tạo hoặc mở rộng types:

```text
types/admin.ts
types/order.ts
types/customer.ts
types/category.ts
```

Mock cần deterministic:

- Không random khi render.
- Có đủ trạng thái để test badge/filter.
- Có ảnh sản phẩm ổn định.
- Có dates/totals phù hợp `vi-VN`.
- Có quan hệ cơ bản: customer có orders, order có items, product có category.

---

## 7. Kế Hoạch UI Từng Trang

### 7.1 Admin Layout + Sidebar + Topbar

File chính:

- `layouts/admin.vue`
- `components/Sidebar/AdminSidebar.vue`
- `components/Admin/layout/AdminTopbar.vue`
- `components/Admin/layout/AdminProfileMenu.vue`

UI:

- Sidebar IrusGear logo, collapse button, menu group `ECOMMERCE`.
- Active route nền đen, shadow nhẹ giống ảnh.
- Submenu:
  - Dashboard
  - Product: List, Add, Category
  - Order: List, Details
  - Customer: List, Details
  - Manage Review
  - Settings
- Topbar có:
  - Search `Search...` + shortcut hint.
  - Icons: language, theme, app grid, notification.
  - Avatar dropdown: Profile, Settings, Billing Plan, Pricing, FAQ, Logout.
- Mobile:
  - Sidebar drawer.
  - Topbar search co lại thành icon/search overlay.

Behavior:

- Logout gọi `authStore.logout()`.
- Search global ở phase 1 có thể chỉ mở mock command palette.
- Notification/profile dropdown đóng khi click outside.

### 7.2 Dashboard

File chính:

- `pages/admin/dashboard/index.vue`
- `components/Admin/charts/*`
- `mocks/admin/dashboard.mock.ts`

UI sections theo ảnh 1:

- Row 1:
  - Hero card: "Welcome back, Admin", best seller/revenue highlight, CTA `View Sales`, product/admin illustration hoặc avatar card.
  - Statistics strip: Sales, Customers, Products, Revenue.
- Row 2:
  - Profit mini line chart.
  - Expenses radial/doughnut chart.
  - Revenue Report large bar chart with earning/expense.
  - Budget summary mini sparkline.
- Row 3:
  - Generated leads / conversion card.
  - Earning reports weekly overview.
  - Popular products list.
  - Orders by region/status timeline.
- Row 4:
  - Transactions list.
  - Recent invoices/orders table.

Chart.js:

- `line`: revenue trend, profit sparkline.
- `bar`: earning vs expense.
- `doughnut`: expense/completion/conversion.
- `sparkline`: budget mini trend.

Animation:

- Cards stagger fade-up khi mount.
- Chart canvas fade-in sau khi render.
- Metric hover lift nhẹ, không quá 2px.

### 7.3 Product List

File chính:

- `pages/admin/products/index.vue`
- `mocks/admin/products.mock.ts`

UI theo ảnh 2:

- Top metric strip:
  - In-store sales
  - Website sales
  - Discount
  - Affiliate
- Filter card:
  - Status select
  - Category select
  - Stock select
- Table toolbar:
  - Search product
  - Page size
  - Export
  - `Add Product`
- Table columns:
  - Checkbox
  - Product image + name + vendor/short meta
  - Category with pastel icon
  - Stock toggle
  - SKU
  - Price
  - Qty
  - Status badge
  - Actions: edit, menu

Interactions:

- Search/filter client-side mock.
- Stock toggle updates mock state locally.
- `Add Product` route tới `/admin/products/create`.
- Edit route tới `/admin/products/[id]/edit`.

### 7.4 Product Create/Edit

File chính:

- `pages/admin/products/create.vue`
- `pages/admin/products/[id]/edit.vue`

UI:

- Header: `Add Product` / `Edit Product`, status dropdown, Save/Cancel.
- Main 2-column layout:
  - Left: Basic information, description, media uploader mock, variants.
  - Right: Pricing, inventory, category, publish status, SEO preview.
- Form controls:
  - Product name
  - Slug
  - SKU
  - Category
  - Price/sale price
  - Stock qty
  - Status
  - Featured switch
  - Thumbnail/images mock upload.

Validation:

- Dùng UI-only validation ở phase 1.
- Sau này nối `vee-validate` nếu cần.

### 7.5 Category List

File chính:

- `pages/admin/categories/index.vue`
- `mocks/admin/categories.mock.ts`

UI theo ảnh 3:

- Toolbar:
  - Search category.
  - Page size.
  - `Add Category`.
- Table columns:
  - Checkbox
  - Category image/icon + name + description
  - Total products
  - Total earning
  - Actions: edit, menu
- Add/Edit category:
  - Phase 1 dùng modal/drawer mock.
  - Fields: name, slug, description, icon/image, parent category, status.

### 7.6 Order List

File chính:

- `pages/admin/orders/index.vue`
- `mocks/admin/orders.mock.ts`

UI theo ảnh 4:

- Top metric strip:
  - Pending payment
  - Completed
  - Refunded
  - Failed
- Toolbar:
  - Search order.
  - Page size.
  - Export.
  - Optional date range/status filters.
- Table columns:
  - Checkbox
  - Order ID
  - Date
  - Customer avatar/name/email
  - Payment status
  - Fulfillment/shipping status
  - Method
  - Action menu
- Status examples:
  - Payment: Pending, Paid, Failed, Cancelled.
  - Fulfillment: Ready to Pickup, Out for Delivery, Delivered, Dispatched.

Interactions:

- Row click hoặc action view tới `/admin/orders/[id]`.
- Bulk action mock: update status, export selected.

### 7.7 Order Detail

File chính:

- `pages/admin/orders/[id].vue`
- `components/Admin/ecommerce/OrderTimeline.vue`
- `components/Admin/ecommerce/OrderSummary.vue`

UI theo ảnh 5:

- Header:
  - `Order #9042`
  - Payment badge
  - Fulfillment badge
  - Created date
  - `Delete Order` danger button.
- Left column:
  - Order details table: product, price, quantity, total.
  - Totals summary: subtotal, shipping, tax, total.
  - Shipping activity timeline.
- Right column:
  - Customer details card.
  - Shipping address card.
  - Billing address/payment card.

Interactions:

- Edit order details mock.
- Delete confirmation modal.
- Timeline status update mock.

### 7.8 Customer List

File chính:

- `pages/admin/customers/index.vue`
- `mocks/admin/customers.mock.ts`

UI theo ảnh 6:

- Toolbar:
  - Search name/email.
  - Page size.
  - Export.
  - `Add Customer`.
- Table columns:
  - Checkbox
  - Customer avatar/name/email
  - Customer ID
  - Country
  - Orders
  - Total spent
  - Actions

Interactions:

- Row click tới `/admin/customers/[id]`.
- Export mock.

### 7.9 Customer Detail

File chính:

- `pages/admin/customers/[id].vue`

UI theo ảnh 7:

- Header:
  - `Customer ID #478426`
  - created date
  - `Delete Customer` danger button.
- Left column:
  - Profile card: avatar, name, customer ID, orders, total spent.
  - Details list: username, billing email, status, contact, country.
  - `Edit Details` button.
  - Optional membership/premium card đổi thành IrusGear loyalty.
- Right column:
  - Tabs: Overview, Security, Address & Billing, Notifications.
  - Overview cards:
    - Account balance
    - Loyalty program
    - Wishlist
    - Coupons
  - Orders placed table with search/pagination.

Interactions:

- Tab state client-side.
- Edit detail modal/drawer.
- Delete confirmation.

### 7.10 Settings

File chính:

- `pages/admin/settings/index.vue`

UI theo ảnh 9:

- Tabs:
  - Account
  - Security
  - Billing & Plans
  - Notifications
  - Connections
- Account tab:
  - Avatar upload mock.
  - Form 2 cột: first/last name, email, organization, phone, address, state, zip, country, language, timezone, currency.
  - Save Changes / Cancel.
  - Delete account danger zone.
- Security tab:
  - Change password.
  - 2FA toggle mock.
  - Active sessions mock.
- Notifications tab:
  - Email/order/product alert toggles.

---

## 8. Styling Plan

Tạo CSS admin riêng:

```text
assets/css/admin.css
```

Import trong `nuxt.config.ts` hoặc `layouts/admin.vue`.

Token đề xuất:

```css
:root {
  --admin-bg: #f7f7f8;
  --admin-surface: #ffffff;
  --admin-border: #e6e6e8;
  --admin-text: #2f2f3d;
  --admin-muted: #7b7b88;
  --admin-soft: #f3f3f5;
  --admin-primary: #050505;
  --admin-success: #22c55e;
  --admin-info: #06b6d4;
  --admin-warning: #f59e0b;
  --admin-danger: #ff4c51;
  --admin-radius: 8px;
  --admin-shadow: 0 4px 14px rgba(15, 15, 20, 0.08);
}
```

Responsive:

- Desktop: sidebar fixed 260px, content `margin-left: 260px`.
- Collapsed: sidebar 84px, content `margin-left: 84px`.
- Mobile: sidebar off-canvas, content full-width.
- Tables: keep horizontal scroll, avoid card layout unless viewport very small.

---

## 9. Animation Plan

Dùng CSS transition mặc định; GSAP chỉ dùng cho dashboard/page entrance nếu cần.

Animation cần có:

- Sidebar submenu expand/collapse: height/opacity transition.
- Dropdown profile: scale/fade.
- Page cards: stagger fade-up.
- Table rows: hover background.
- Modal/drawer: slide/fade.
- Chart: fade-in sau render.

Không dùng:

- Parallax.
- Animated background.
- Nhiều gradient/orb decoration.
- Hover làm thay đổi kích thước table row.

---

## 10. i18n Plan

Bổ sung namespace:

```text
admin.layout.*
admin.sidebar.*
admin.dashboard.*
admin.products.*
admin.categories.*
admin.orders.*
admin.customers.*
admin.settings.*
admin.status.*
admin.actions.*
```

Nguyên tắc:

- Không hard-code tiếng Việt trong page/component.
- Status key dùng chung để tránh thiếu translation.
- Fix toàn bộ text bị mojibake trong admin hiện tại.

---

## 11. Thứ Tự Triển Khai Theo Phase

### Phase 0: Visual Baseline Và Reference Lock

Mục tiêu: khóa tiêu chuẩn UI trước khi code nhiều.

- Chụp/lưu reference từ ảnh user và URL Vuexy demo.
- Lập checklist pixel parity cho desktop/tablet/mobile.
- Xác định token chính: background, surface, border, muted text, active black, success/info/warning/danger.
- Quyết định asset thay thế:
  - IrusGear logo thay Vuexy logo.
  - Product/admin illustration nội bộ thay mascot Vuexy.
  - Avatar placeholder nội bộ thay avatar template.
- Không chỉnh page lớn trong phase này.

Kết quả bàn giao:

- Plan này được cập nhật.
- Visual checklist sẵn để so sánh từng phase.

### Phase 1: Admin Shell 1:1

Mục tiêu: dựng khung giống reference trước, chưa cần đủ page data.

- Tạo `assets/css/admin.css`.
- Refactor `layouts/admin.vue`.
- Refactor `components/Sidebar/AdminSidebar.vue`.
- Tạo `components/Admin/layout/AdminTopbar.vue`.
- Tạo `components/Admin/layout/AdminProfileMenu.vue`.
- Tạo sidebar menu ecommerce phân cấp:
  - Dashboard
  - Product: List, Add, Category
  - Order: List, Details
  - Customer: List, Details
  - Manage Review
  - Referrals
  - Settings
- Tạo topbar:
  - Search input + shortcut hint.
  - Language/theme/app-grid/notification icons.
  - Avatar online dot.
  - Profile dropdown giống ảnh.
- Fix logout gọi `authStore.logout()`.
- Add animation:
  - Sidebar submenu expand.
  - Profile dropdown fade/scale.
  - Mobile drawer slide.

Acceptance:

- Sidebar/topbar giống reference ở `1920x1080`.
- Active route nền đen, shadow nhẹ.
- Mobile không overlap content.

### Phase 2: Admin UI Kit

Mục tiêu: tạo component nền để các page giống nhau.

- Tạo:
  - `AdminCard`
  - `AdminMetricCard`
  - `AdminStatusBadge`
  - `AdminDataTable`
  - `AdminTableToolbar`
  - `AdminPagination`
  - `AdminActionMenu`
  - `AdminTabs`
  - `AdminSkeleton`
  - `AdminEmptyState`
- Tạo chart wrappers:
  - `AdminLineChart`
  - `AdminBarChart`
  - `AdminDoughnutChart`
  - `AdminSparkline`
- Chuẩn hóa:
  - Button black primary.
  - Danger pastel button.
  - Checkbox size.
  - Table row height.
  - Badge variants.

Acceptance:

- UI kit có thể dựng được table/product/order card giống reference mà không viết CSS lặp lại.
- Chart components không lỗi SSR.

### Phase 3: Mock Data + Types

Mục tiêu: dữ liệu mock đủ đẹp để UI giống reference.

- Tạo `mocks/admin/*`.
- Chuẩn hóa:
  - `types/admin.ts`
  - `types/order.ts`
  - `types/customer.ts`
  - `types/category.ts`
- Mock data cần có:
  - 50 products.
  - 12 categories.
  - 100 orders.
  - 100 customers.
  - Dashboard reports theo 7d/30d/12m.
  - Product images, category icons, avatar placeholders.
- Tạo helper format:
  - currency VND/USD mock.
  - date.
  - compact number.
  - status label map.

Acceptance:

- Search/filter/pagination có data đủ để test.
- Mock không random khi refresh.

### Phase 4: Ecommerce Dashboard 1:1

Mục tiêu: `/admin/dashboard` giống dashboard ecommerce reference.

- Làm lại `pages/admin/dashboard/index.vue`.
- Dựng grid:
  - Welcome/Best seller card.
  - Statistics strip.
  - Profit mini chart.
  - Expenses radial chart.
  - Revenue report large card.
  - Budget mini summary.
  - Generated leads card.
  - Earning reports card.
  - Popular products card.
  - Orders by countries/status card.
  - Transactions card.
  - Recent invoices/orders table.
- Dùng Chart.js:
  - Bar chart earning/expense.
  - Line/sparkline chart.
  - Doughnut/radial equivalent.
- Add animation:
  - Staggered card entrance.
  - Chart fade after mount.
  - Metric hover lift.

Acceptance:

- Dashboard nhìn cùng bố cục với ảnh 1 và URL demo.
- Không có chart blank.
- Desktop/tablet/mobile không vỡ grid.

### Phase 5: Product List + Category 1:1

Mục tiêu: product/category pages giống ảnh 2 và ảnh 3.

- Làm lại `pages/admin/products/index.vue`.
- Thêm:
  - Top sales metric strip.
  - Filters card.
  - Product table toolbar.
  - Product table.
  - Stock toggle.
  - Status badges.
  - Action menu.
- Thêm `pages/admin/categories/index.vue`.
- Category page:
  - Search category.
  - Add category.
  - Category table with image/description/total products/earning/actions.
  - Pagination.
- Add category modal/drawer mock.

Acceptance:

- Product list giống ảnh 2.
- Category list giống ảnh 3.
- Filter/search/page-size/pagination chạy bằng mock data.

### Phase 6: Product Create/Edit

Mục tiêu: hoàn thiện flow sản phẩm để admin dùng được, theo style Vuexy settings/form.

- Thêm `pages/admin/products/create.vue`.
- Thêm `pages/admin/products/[id]/edit.vue`.
- Form sections:
  - Basic information.
  - Description.
  - Media mock uploader.
  - Pricing.
  - Inventory.
  - Category.
  - SEO preview.
  - Publish controls.
- Action:
  - Save draft.
  - Publish.
  - Cancel.

Acceptance:

- Form dùng cùng card/input/button style với reference.
- Mobile form chuyển 1 cột.

### Phase 7: Order List + Order Detail 1:1

Mục tiêu: order pages giống ảnh 4 và ảnh 5.

- Làm lại `pages/admin/orders/index.vue`.
- Order list:
  - Payment metrics strip.
  - Search order.
  - Export.
  - Order table with customer avatar/name/email.
  - Payment/fulfillment badges.
  - Method column.
  - Action menu.
- Thêm `pages/admin/orders/[id].vue`.
- Order detail:
  - Header order ID + badges + delete.
  - Product table.
  - Total summary.
  - Shipping activity timeline.
  - Customer details.
  - Shipping address.
  - Billing/payment card.

Acceptance:

- Order list giống ảnh 4.
- Order detail giống ảnh 5.
- Timeline spacing/line/dot giống reference.

### Phase 8: Customer List + Customer Detail 1:1

Mục tiêu: customer pages giống ảnh 6 và ảnh 7.

- Thêm `pages/admin/customers/index.vue`.
- Customer list:
  - Search customer.
  - Export.
  - Add customer.
  - Customer table with avatar/email/id/country/orders/spent.
- Thêm `pages/admin/customers/[id].vue`.
- Customer detail:
  - Header customer ID + delete.
  - Profile summary card.
  - Details list.
  - IrusGear loyalty card.
  - Tabs: Overview, Security, Address & Billing, Notifications.
  - Overview cards.
  - Orders placed table.

Acceptance:

- Customer list giống ảnh 6.
- Customer detail giống ảnh 7.
- Tabs hoạt động client-side.

### Phase 9: Settings 1:1

Mục tiêu: settings page giống ảnh 9.

- Thêm `pages/admin/settings/index.vue`.
- Tabs:
  - Account
  - Security
  - Billing & Plans
  - Notifications
  - Connections
- Account form:
  - Avatar upload mock.
  - Two-column form.
  - Save/Cancel buttons.
  - Delete account danger zone.
- Security/notifications tabs dựng UI mock đủ đẹp.

Acceptance:

- Settings account tab giống ảnh 9.
- Form controls cùng height/radius/border với reference.

### Phase 10: Reviews, Referrals, Analytics

Mục tiêu: hoàn thiện menu ecommerce còn lại theo cùng UI kit.

- Thêm `/admin/reviews`.
- Thêm `/admin/referrals`.
- Thêm `/admin/analytics`.
- Reuse table/chart/card components.
- Analytics mở rộng từ dashboard:
  - Revenue trend.
  - Category split.
  - Conversion funnel.
  - Returning customer rate.

Acceptance:

- Không còn menu `#`.
- Mỗi route sidebar đều mở được.

### Phase 11: i18n, Responsive, QA, Pixel Polish

Mục tiêu: polish đến mức giống reference nhất có thể trong giới hạn brand riêng.

- Bổ sung toàn bộ i18n admin keys.
- Fix mojibake trong admin files.
- Kiểm tra:
  - `npm run build`.
  - Desktop `1920x1080`, `1440x900`.
  - Tablet `1024x768`.
  - Mobile `390x844`.
- Visual polish:
  - Table row height.
  - Pagination spacing.
  - Badge padding.
  - Topbar/avatar dropdown alignment.
  - Sidebar scroll/active/submenu.
  - Chart proportions.
- Chụp screenshot từng page chính để đối chiếu reference.

Acceptance:

- Build pass.
- Không i18n warning.
- Không overlap.
- Visual đạt parity cao với ảnh và URL demo.

---

## 12. Acceptance Criteria

Hoàn thành khi:

- Tất cả route trong route map mở được.
- Không còn warning i18n missing key trong admin.
- Dashboard render Chart.js không lỗi SSR.
- Tables có search/filter/page-size/pagination hoạt động với mock data.
- Product/order/customer detail page có layout giống pattern trong ảnh.
- Sidebar active/submenu đúng theo route.
- Profile dropdown logout hoạt động qua auth store.
- UI responsive không overlap ở desktop/mobile.
- `npm run build` pass.

---

## 13. Ghi Chú Kỹ Thuật

- `chart.js` và `gsap` đã có trong `package.json`, không cần thêm dependency nếu không có yêu cầu mới.
- Bootstrap Icons đang được dùng; có thể tiếp tục dùng để giảm thay đổi dependency. Nếu muốn icon hiện đại hơn, cân nhắc thêm `lucide-vue-next` ở phase riêng.
- Vì backend API admin có thể chưa đầy đủ, phase đầu dùng mock data nhưng đặt shape giống API để dễ thay service sau.
- Các file auth đang có thay đổi liên quan refresh/login; khi sửa sidebar logout cần đọc lại `stores/authStore.js` để không phá luồng auth hiện tại.
