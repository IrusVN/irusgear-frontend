@ -0,0 +1,306 @@
# Kế Hoạch Triển Khai Chuẩn Hóa UI Trắng Đen Và Gỡ Dấu Vết CellphoneS

> Ngày tạo: 2026-05-12  
> Người lập kế hoạch: Senior Frontend Review  
> Phạm vi: Nuxt 3 frontend, Bootstrap 5, Pinia, i18n `vi/en`, CSS global trong `public/assets/css`, scoped CSS trong Vue components.

---

## 1. Mục Tiêu

Chuẩn hóa toàn bộ UI về tông chủ đạo trắng đen của IrusGear, loại bỏ các màu đỏ mang dấu ấn CellphoneS hoặc không còn phù hợp với brand hiện tại, đồng thời gỡ/thay thế nội dung liên quan đến CellphoneS trong text, logo, icon, watermark và link không còn phù hợp. Riêng badge sản phẩm và các CDN đang phục vụ hình ảnh sản phẩm được giữ lại có kiểm soát.

Kết quả mong muốn:

- UI chính dùng trắng, đen, xám trung tính; không còn đỏ `#d70018`, `#D70018`, `#ff3b30`, `#ff4757`, `#ef4444` cho accent/CTA/active state.
- Chỉ giữ màu đỏ cho ngữ nghĩa lỗi thực sự nếu team xác nhận cần giữ semantic danger. Nếu muốn tuyệt đối trắng đen, cả error state cũng đổi sang token đen/xám có icon/copy rõ ràng.
- Không còn text, URL điều hướng/CTA, logo, icon thương hiệu, QR hoặc watermark từ `CellphoneS`, `Cellphones.com.vn`, `Sforum`, `Smember`, `cps-*`.
- Giữ lại badge sản phẩm và URL/CDN, banner liên quan đến hình ảnh sản phẩm như `cdn2.cellphones.com.vn`, `media-asset.cellphones.com.vn` nếu chúng chỉ phục vụ ảnh sản phẩm hoặc nhãn thông tin sản phẩm, không chứa logo/text/watermark thương hiệu khác trên UI.
- Các trang policy/tos/warranty/promotion/profile không còn nội dung pháp lý hoặc khuyến mãi của thương hiệu khác.

---

## 2. Ghi Nhận Từ `CLAUDE.md`

Dự án dùng:

- Nuxt route-based pages trong `pages/`.
- Components theo feature trong `components/`.
- Pinia stores trong `stores/`.
- i18n trong `i18n/locales/vi.js` và `i18n/locales/en.js`.
- Bootstrap 5 và Bootstrap Icons.
- CSS global chính ở `public/assets/css/custom.css` và `public/assets/css/responsive.css`.
- Component-specific CSS nằm trong `<style scoped>` của từng Vue file.

Nguyên tắc triển khai nên theo kiến trúc hiện tại: thêm design tokens global trước, sau đó refactor scoped CSS/component theo từng domain để giảm rủi ro.

---

## 3. Audit Baseline Hiện Tại

Kết quả quét nhanh ngày 2026-05-12:

- 437 dòng match màu đỏ / danger / red-tint trong `pages`, `components`, `public/assets/css`, `layouts`.
- 70 file có dấu vết màu đỏ hoặc Bootstrap danger.
- 323 dòng match dấu vết CellphoneS/Sforum/CDN/CPS trong `components`, `pages`, `stores`, `i18n`.

Nhóm file có dấu vết CellphoneS rõ nhất:

| Nhóm | File chính | Vấn đề |
|---|---|---|
| i18n/legal | `i18n/locales/vi.js`, `i18n/locales/en.js` | Text CellphoneS, Cellphones.com.vn, Sforum, email `cellphones.com.vn`, hotline, điều khoản pháp lý không thuộc IrusGear |
| TOS | `pages/tos/index.vue` | Section/nav keys `privacy-cellphones`, `privacy-sforum`, `sforum` |
| Profile | `pages/profile/index.vue`, `components/Common/ProfileLayout.vue` | QR/app badges từ CDN CellphoneS, empty state từ `smember`, copy "S-Business"/app |
| Promotion | `pages/promotion/index.vue` | Copy khuyến mãi nhắc CellphoneS/Smember |
| Product detail | `components/Products/ProductDetail/ProductDetailRight.vue`, `ProductBlockComment.vue`, `ProductSuggest.vue`, `ProductContentRight.vue`, `ModalReview.vue` | Icon/link/banner từ CDN CellphoneS, text CellphoneS, links sang CellphoneS/Sforum; badge sản phẩm cần phân loại để giữ nếu không mang brand CellphoneS |
| Home data | `stores/homeStore.js`, `stores/homeSectionsStore.js`, `components/Home/HomeAccessoryGrid.vue`, `HomeUsedGoodsGrid.vue`, `HomeProdSection.vue`, `HomeProdCard.vue` | Image CDN CellphoneS dùng cho ảnh sản phẩm cần giữ có kiểm soát; badge UI cần phân loại giữ nếu là nhãn sản phẩm, gỡ nếu mang brand CellphoneS |

Nhóm file dùng đỏ nhiều nhất cần xử lý theo domain:

| Domain | File chính |
|---|---|
| Product detail/list | `components/Products/ProductDetail/*`, `components/Products/ProductList/ProductList.vue` |
| Checkout | `components/Checkout/*` |
| Cart | `components/Cart/*`, `pages/cart/payment.vue`, `pages/cart/success.vue` |
| Profile/account | `components/Common/ProfileLayout.vue`, `components/Profile/*`, `pages/profile/index.vue`, `pages/user-info/index.vue`, `pages/account/vouchers.vue` |
| Legal/static pages | `pages/policy/index.vue`, `pages/tos/index.vue`, `pages/warranty/index.vue`, `pages/tradein/index.vue`, `pages/promotion/index.vue`, `pages/khuyen-mai/index.vue`, `pages/tin-tuc/index.vue`, `pages/lien-he/index.vue` |
| Navigation/common | `components/Sidebar/CustomerSidebar.vue`, `components/Sidebar/AdminSidebar.vue`, `components/Footer/Footer.vue`, `public/assets/css/responsive.css` |

---

## 4. Quy Ước Brand Token Đề Xuất

Thêm token global vào `public/assets/css/custom.css` để mọi scoped CSS dùng `var(...)` thay vì hard-code màu:

```css
:root {
  --irus-color-bg: #ffffff;
  --irus-color-surface: #ffffff;
  --irus-color-surface-muted: #f7f7f7;
  --irus-color-surface-strong: #111111;
  --irus-color-text: #111111;
  --irus-color-text-muted: #666666;
  --irus-color-text-subtle: #8a8a8a;
  --irus-color-border: #e5e5e5;
  --irus-color-border-strong: #111111;
  --irus-color-accent: #111111;
  --irus-color-accent-hover: #2a2a2a;
  --irus-color-accent-soft: #f1f1f1;
  --irus-color-focus-ring: rgba(17, 17, 17, 0.16);
  --irus-color-danger: #b42318;
  --irus-color-danger-soft: #fff1f0;
}
```

Mapping chuyển đổi:

| Hiện tại | Dùng cho | Thay bằng |
|---|---|---|
| `#d70018`, `#D70018` | CTA, giá, active, border selected, icon accent | `var(--irus-color-accent)` hoặc `var(--irus-color-text)` |
| `#ff3b30`, `#ff4757`, `#ef4444` | badge, hover, gradient, warning chip | `var(--irus-color-accent)` hoặc `var(--irus-color-border-strong)` |
| `#fff5f5`, `#fee2e2` | selected soft bg / red tint | `var(--irus-color-accent-soft)` |
| `rgba(215, 0, 24, 0.1)` | focus shadow | `var(--irus-color-focus-ring)` |
| `text-danger`, `bg-danger`, `border-danger`, `alert-danger` | Bootstrap danger | Giữ nếu lỗi thật; đổi sang class brand-neutral nếu là accent/giá/logout |

Lưu ý: `danger` cho lỗi form, đơn bị hủy, xóa địa chỉ, logout có thể giữ theo semantic UX. Các trường hợp dùng đỏ để nhấn brand, giá, active, CTA phải đổi.

---

## 5. Phase Triển Khai

### Phase 1: Chốt Token Và Guardrail

Mục tiêu: tạo nền tảng để refactor nhất quán.

- Thêm design tokens vào `public/assets/css/custom.css`.
- Bổ sung utility nhỏ nếu cần: `.irus-text-accent`, `.irus-bg-accent`, `.irus-border-accent`, `.irus-focus-ring`.
- Tạo checklist grep trước/sau, đồng thời duy trì danh sách ngoại lệ cho badge sản phẩm và CDN ảnh sản phẩm được phép giữ:
  - `rg -n "#d70018|#D70018|#ef4444|#ff3b30|#ff4757|#fff5f5|#fee2e2" pages components public`
  - `rg -n -i "cellphone|cellphones\\.com\\.vn|cdn2\\.cellphones|media-asset\\.cellphones|sforum|smember|cps-" pages components stores i18n`
- Quyết định chính sách final cho `danger`: giữ semantic red hay chuyển toàn bộ sang đen/xám.

### Phase 2: Gỡ CellphoneS Ở Data Và i18n

Mục tiêu: loại bỏ nội dung brand sai trước khi xử lý UI chi tiết.

- `i18n/locales/vi.js`, `i18n/locales/en.js`:
  - Thay `CellphoneS`, `Cellphones`, `Cellphones.com.vn`, `Sforum`, `Smember` bằng `IrusGear` hoặc copy trung tính phù hợp.
  - Thay email/hotline/domain cũ bằng thông tin chính thức của IrusGear. Nếu chưa có thông tin thật, dùng placeholder rõ ràng như `support@irusgear.com` và đánh dấu cần xác nhận.
  - Review riêng các section legal trong `profile.tos`: không chỉ replace tên thương hiệu máy móc; cần sửa nội dung pháp nhân, điều khoản vận hành, chính sách bảo mật cho đúng IrusGear.
- `pages/tos/index.vue`:
  - Đổi key/nav `privacy-cellphones` thành `privacy-irusgear`.
  - Gỡ hoặc đổi toàn bộ section `privacy-sforum` và `sforum` nếu IrusGear không có cộng đồng Sforum tương đương.
- `pages/promotion/index.vue`:
  - Thay copy `CellphoneS`, `Smember` bằng chương trình IrusGear.
  - Kiểm tra HTML string đang render bằng `v-html` để tránh bỏ sót.

### Phase 3: Thay Asset, Logo, Icon, Watermark CellphoneS

Mục tiêu: không còn tải asset nhận diện từ hạ tầng thương hiệu khác, nhưng vẫn giữ badge sản phẩm và CDN ảnh sản phẩm nếu chúng là dữ liệu hiển thị sản phẩm đang dùng hợp lệ.

- Tạo danh sách asset cần thay trong `public/image/brand-cleanup/` hoặc dùng asset IrusGear hiện có:
  - `public/image/logo-irusgear-black.png`
  - `public/image/logo-irusgear-white.png`
  - `public/image/icon-irusgear-black.png`
  - `public/image/icon-irusgear-white.png`
- Thay QR/app badges ở:
  - `pages/profile/index.vue`
  - `components/Common/ProfileLayout.vue`
- Thay empty-state ảnh `cdn-static.smember.com.vn` trong `pages/profile/index.vue` bằng icon Bootstrap hoặc asset nội bộ.
- Phân loại badge trong product detail:
  - `components/Products/ProductDetail/ProductDetailRight.vue`
  - `components/Products/ProductDetail/ProductBlockComment.vue`
  - `components/Products/ProductDetail/ProductSuggest.vue`
  - `components/Models/ModalReview.vue`
- Giữ badge sản phẩm nếu là nhãn bán hàng/thông tin sản phẩm như trả góp, giảm giá, bảo hành, tình trạng hàng và không chứa nhận diện CellphoneS/Sforum/Smember.
- Thay icon/badge nếu có logo, text hoặc dấu hiệu nhận diện CellphoneS/Sforum/Smember.
- Giữ ảnh homepage/home sections đang lấy từ CDN CellphoneS khi URL đó phục vụ hình ảnh sản phẩm:
  - `stores/homeStore.js`
  - `stores/homeSectionsStore.js`
  - `components/Home/HomeAccessoryGrid.vue`
  - `components/Home/HomeUsedGoodsGrid.vue`
  - `components/Home/HomeProdSection.vue`
  - `components/Home/HomeProdCard.vue`
- Chỉ thay CDN ảnh trong các file trên nếu ảnh chứa watermark/logo/text CellphoneS, không phải ảnh sản phẩm, hoặc có asset IrusGear/nội bộ tương đương đã sẵn sàng.
- Các link external `https://cellphones.com.vn/...` chuyển thành route nội bộ hoặc link đối tác hợp lệ. Không để link chết `#` nếu là CTA thật.

### Phase 4: Refactor Màu Theo Domain Cao Rủi Ro

Mục tiêu: xử lý các flow kiếm tiền trước.

1. Product listing/detail:
   - `components/Products/ProductList/ProductList.vue`
   - `components/Products/ProductDetail/ProductDetailRight.vue`
   - `ProductBlockOrder.vue`
   - `ProductBoxWarranty.vue`
   - `ProductBlockComment.vue`
   - `ProductSuggest.vue`
   - `ProductSameProduct.vue`
   - `MobileProductInfoSheet.vue`
   - Chuyển giá, active variant, CTA mua hàng, selected warranty, promotion header sang token đen/xám.
   - Inline SVG `stroke="#D70018"` / `fill="#D70018"` đổi sang `currentColor` hoặc `var(--irus-color-accent)`.

2. Checkout/cart:
   - `components/Checkout/*`
   - `components/Cart/*`
   - `pages/cart/payment.vue`
   - `pages/cart/success.vue`
   - CTA chính dùng nền đen chữ trắng.
   - Selected card dùng border đen + background xám nhạt.
   - Giá/tổng tiền dùng text đen đậm, không dùng `text-danger`.
   - Các lỗi validation vẫn theo quyết định Phase 1.

3. Profile/account:
   - `components/Common/ProfileLayout.vue`
   - `components/Profile/UpdateProfile.vue`
   - `components/Profile/UpdatePassword.vue`
   - `components/Profile/UpdateAddress.vue`
   - `pages/profile/index.vue`
   - `pages/user-info/index.vue`
   - `pages/account/vouchers.vue`
   - Voucher, rank/progress, active tab, add button, selected address chuyển sang token brand.

### Phase 5: Refactor Trang Static Và Navigation

Mục tiêu: hoàn thiện các page ít logic nhưng dễ lộ brand lệch.

- `pages/policy/index.vue`, `pages/tos/index.vue`, `pages/warranty/index.vue`:
  - Heading/subtitle/accent border đổi sang đen/xám.
  - Legal copy đã xử lý ở i18n cần đối chiếu visual.
- `pages/tradein/index.vue`, `pages/promotion/index.vue`, `pages/khuyen-mai/index.vue`, `pages/tin-tuc/index.vue`, `pages/lien-he/index.vue`, `pages/orders/index.vue`:
  - CTA, highlight, price, badge, timeline đổi sang token.
- `components/Sidebar/CustomerSidebar.vue`, `components/Sidebar/AdminSidebar.vue`, `components/Footer/Footer.vue`:
  - Notification badge/cart badge nếu là brand accent đổi sang đen; nếu là count alert có thể giữ semantic theo Phase 1.
  - Logout `text-danger` chỉ giữ nếu team chấp nhận semantic danger.
  - Footer link `text-danger` đổi sang neutral link.
- `public/assets/css/responsive.css`:
  - `.sheet-list-item--selected` đổi từ red tint sang token.

### Phase 6: QA Visual Và Regression

Kiểm tra bắt buộc:

- Desktop: 1440px, 1200px, 992px.
- Tablet: 834px, 768px.
- Mobile: 430px, 390px, 375px.
- Routes trọng điểm:
  - `/`
  - `/products`
  - `/products/[slug]`
  - `/cart`
  - `/cart/checkout`
  - `/cart/payment`
  - `/cart/success`
  - `/profile`
  - `/user-info`
  - `/orders`
  - `/warranty`
  - `/policy`
  - `/tos`
  - `/promotion`
  - `/khuyen-mai`
  - `/tin-tuc`
  - `/lien-he`

Lệnh xác minh:

```bash
npm run build
rg -n "#d70018|#D70018|#ef4444|#ff3b30|#ff4757|#fff5f5|#fee2e2" pages components public
rg -n -i "cellphone|cellphones\\.com\\.vn|cdn2\\.cellphones|media-asset\\.cellphones|dashboard\\.cellphones|sforum|smember|cps-" pages components stores i18n public
```

Acceptance criteria:

- `npm run build` pass.
- Không còn hard-code red brand tokens trong UI accent.
- Không còn asset nhận diện/link/text CellphoneS trong codebase, trừ trường hợp được ghi chú rõ là dữ liệu test, tài liệu migration, badge sản phẩm hoặc CDN ảnh sản phẩm được phép giữ.
- Không có text tràn/overlap do đổi CTA hoặc badge.
- Các state active/selected/focus vẫn rõ ràng khi mất màu đỏ.
- Contrast đạt mức dễ đọc trên nền trắng/đen/xám.

---

## 6. Thứ Tự Ưu Tiên Đề Xuất

| Ưu tiên | Phase | Lý do |
|---|---|---|
| P0 | Phase 1 | Không có token thì refactor dễ lệch mỗi nơi một kiểu |
| P0 | Phase 2 | Text/legal brand sai là lỗi nhận diện nghiêm trọng nhất |
| P0 | Phase 3 | CDN nhận diện/logo/icon/watermark thương hiệu khác dễ lộ ngay trên UI |
| P1 | Phase 4 | Product/checkout/cart ảnh hưởng chuyển đổi và giao dịch |
| P1 | Phase 5 | Hoàn thiện toàn hệ thống và navigation |
| P1 | Phase 6 | Chặn regression visual/responsive |

---

## 7. Rủi Ro Và Cách Giảm

| Rủi ro | Tác động | Cách xử lý |
|---|---|---|
| Replace text pháp lý máy móc | Sai pháp nhân/chính sách | Review legal copy riêng, không chỉ search/replace |
| Đổi toàn bộ `danger` sang đen | User khó nhận biết lỗi/xóa/hủy | Chốt semantic danger ở Phase 1; dùng icon/copy nếu bỏ đỏ |
| Thay nhầm CDN ảnh sản phẩm hoặc badge sản phẩm hợp lệ | Mất hình/nhãn thông tin trên homepage/product/detail | Giữ danh sách ngoại lệ cho badge sản phẩm và CDN ảnh sản phẩm; chỉ thay khi asset có watermark/logo/text CellphoneS hoặc không phải dữ liệu sản phẩm |
| Scoped CSS hard-code nhiều | Bỏ sót màu đỏ | Dùng grep sau mỗi phase, ưu tiên file có nhiều match |
| Inline SVG dùng `stroke/fill` trực tiếp | Token CSS không áp dụng | Đổi sang `currentColor` và set `color` ở wrapper |
| i18n key rename làm vỡ route/section | TOS/policy không render | Rename đồng bộ `vi/en` và component nav/render |

---

## 8. Checklist Theo Dõi

- [ ] Thêm global brand tokens vào `custom.css`.
- [ ] Chốt chính sách semantic `danger`.
- [ ] Sửa `i18n/locales/vi.js`.
- [ ] Sửa `i18n/locales/en.js`.
- [ ] Rename/gỡ TOS sections liên quan `privacy-cellphones`, `privacy-sforum`, `sforum`.
- [ ] Gỡ QR/app badges/CDN CellphoneS trong profile layout.
- [ ] Phân loại và giữ CDN ảnh sản phẩm hợp lệ trong homepage stores/components; gỡ link/asset nhận diện CellphoneS không hợp lệ.
- [ ] Phân loại và giữ badge sản phẩm hợp lệ trong product detail; gỡ icon/badge/link mang nhận diện CellphoneS.
- [ ] Refactor màu product listing/detail.
- [ ] Refactor màu checkout/cart.
- [ ] Refactor màu profile/account.
- [ ] Refactor màu static pages/navigation/footer.
- [ ] Chạy `npm run build`.
- [ ] Chạy grep kiểm tra không còn token đỏ/CellphoneS ngoài danh sách ngoại lệ.
- [ ] QA responsive các routes trọng điểm.
