# Product Reviews Implementation Plan

Muc tieu: cho phep moi nguoi gui review san pham va review duoc hien thi ngay sau khi gui. Scope review duoc gioi han ro: nguoi dung chi duoc nhap comment va chon so sao tong cho san pham. Khong cho upload anh, khong danh gia theo tung tieu chi trai nghiem trong form submit.

Pham vi lien quan:

- Frontend: `components/Products/ProductDetail/ProductBoxReview.vue`, `components/Models/ModalReview.vue`, `stores/productStore.js`, `i18n/locales/*`.
- Backend: `ProductReviewController`, `ProductReviewService`, `Review`.
- API hien co: `GET /products/{id}/reviews/summary`, `GET /products/{id}/reviews`, `GET /products/{id}/review-filters`, `POST /products/{id}/reviews`.

## Phase 1: Public Comment And Star Rating

Trang thai: da trien khai cot loi.

Muc tieu:

- Bat ky user/guest nao cung co the gui review.
- Review chi gom: ten nguoi gui, so sao 1-5, comment.
- Review duoc backend tao voi `status = approved` va `approved_at = now()`.
- Danh sach review va summary duoc refresh ngay sau khi gui thanh cong.

Frontend:

- Modal review chi hien:
  - rating tong 1-5 sao
  - textarea comment
  - input ten nguoi gui
- Khong hien input upload anh.
- Khong hien danh gia theo trai nghiem trong form submit.
- Neu user da dang nhap, tu dong dien ten tu `authStore.user.name`.
- Neu guest, cho phep nhap ten hien thi.
- Validate client:
  - rating 1-5
  - comment toi thieu 15 ky tu
  - ten nguoi gui bat buoc
- Payload submit:

```json
{
  "rating": 5,
  "content": "San pham dung tot, giao dien dep va hieu nang on.",
  "author": {
    "name": "Khach hang",
    "phone": ""
  }
}
```

Backend:

- `POST /products/{id}/reviews` chap nhan request public.
- Validate:
  - `rating`: required, integer, 1-5
  - `content`: nullable, string, min 15
  - `author.name`: required voi guest
  - `verifiedPurchase`: prohibited
  - `images`: prohibited
  - `experienceRatings`: prohibited
  - `attributes`: prohibited
- Luu review voi:
  - `user_id`: user dang nhap neu co
  - `guest_name`: author name neu guest
  - `rating`: so sao tong
  - `content` va `comment`: noi dung comment
  - `status`: `approved`
  - `approved_at`: `now()`

Acceptance criteria:

- Guest gui review khong can dang nhap.
- Neu client gui `verifiedPurchase`, backend tra validation error.
- Neu client gui `images`, backend tra validation error.
- Neu client gui `experienceRatings` hoac `attributes`, backend tra validation error.
- Review moi hien trong danh sach ngay sau khi submit.
- Average rating va rating breakdown cap nhat sau submit.

## Phase 2: Review Display Polish

Trang thai: da trien khai.

Muc tieu: khu review de doc, tap trung vao sao va comment.

Frontend:

- Hien empty state khi san pham chua co review.
- Summary gom:
  - diem trung binh
  - tong so review
  - breakdown 5, 4, 3, 2, 1 sao
- Danh sach review gom:
  - avatar chu cai dau
  - ten nguoi gui
  - thoi gian
  - so sao
  - comment
- Khong render anh review.
- Khong render block "review theo trai nghiem".
- Filter chip:
  - Tat ca
  - 5 sao
  - 4 sao
  - 3 sao
  - 2 sao
  - 1 sao
- Sort:
  - moi nhat
  - cao nhat
  - thap nhat
  - huu ich, neu Phase 3 da co vote.

Backend:

- `GET /products/{id}/reviews` giu filter `rating` va `sort`.
- Public resource co the van tra `images: []` de backward compatibility, nhung frontend khong su dung.

Acceptance criteria:

- UI khong con nut them anh.
- UI khong con hien anh trong review item.
- UI khong con hien review theo trai nghiem.
- Filter theo sao van hoat dong.
- Co empty state khi san pham chua co review.

## Phase 3: Helpful Votes And Reporting - da trien khai

Muc tieu: vi review auto-approve, can co co che cong dong va admin xu ly noi dung kem chat luong sau khi public.

Frontend:

- Da them nut `Huu ich` tren tung review, hien thi `helpfulCount` tu API.
- Da them form `Bao cao` voi cac ly do:
  - Spam/quang cao
  - Noi dung khong lien quan
  - Ngon tu khong phu hop
  - Lo thong tin ca nhan
- Sort `helpful` tiep tuc dua vao `helpful_count` that tu backend.

Backend:

- Da them bang `review_votes`:
  - `review_id`
  - `user_id` nullable
  - `device_id` nullable
  - unique theo reviewer identity va review.
- Da them bang `review_reports` de luu ly do bao cao.
- Da them API:
  - `POST /products/{product}/reviews/{review}/helpful`
  - `POST /products/{product}/reviews/{review}/report`
- `helpful_count` cap nhat idempotent: chi tang khi vote moi duoc tao.

Acceptance criteria:

- Moi user/device chi vote helpful mot lan cho mot review.
- Bao cao review khong lam review bien mat ngay, chi dua vao admin queue.

## Phase 4: Admin Visibility - da trien khai

Muc tieu: van auto-approve public, nhung admin co cong cu an review vi pham sau khi da public.

Frontend admin:

- Trang admin reviews da co `pages/admin/reviews/index.vue`; da bo sung:
  - filter `reported`
  - filter theo rating
  - action approve/reject de hien/ẩn review
  - xem noi dung report theo review

Backend:

- Admin API da ho tro:
  - list review theo report count
  - filter `reported`, `rating`, `status`, `search`
  - update status `approved`, `pending`, `rejected`
  - luu `rejected_reason`
- Khi status khong con `approved`, public API khong tra review do nua vi public list chi query `approved`.

Acceptance criteria:

- Admin an duoc review vi pham.
- Public list chi hien review approved.
- Review bi report nhieu lan noi bat trong admin queue.

## Phase 5: Verified Purchase Optional - da trien khai

Muc tieu: giu policy ai cung review duoc, nhung review tu nguoi da mua co badge rieng de tang tin cay.

Frontend:

- Neu `verifiedPurchase = true`, da hien badge `Da mua hang` tren review public.
- Khong chan guest/user chua mua review.
- Admin review detail/export co them thong tin verified purchase.

Backend:

- Khi user dang nhap gui review, backend tu kiem tra order `delivered` co `product_id`/variant lien quan.
- Tuyet doi khong tin `verifiedPurchase` tu client; field nay van bi prohibit trong request.
- Neu match order item:
  - set `verified_purchase = true`
  - luu `order_id`, `order_item_id` de trace.

Acceptance criteria:

- User da mua co badge verified.
- User chua mua van review duoc nhung khong co badge.

## Phase 6: Review Request Automation - da trien khai

Muc tieu: tang so luong review that sau khi giao hang thanh cong.

Backend:

- Khi order chuyen sang `delivered`, backend schedule notification sau 3-7 ngay.
- Gui database notification va email `REVIEW_REQUEST` voi link den product detail `?review=1`.
- Link duoc tao tu product that trong `order_items`; neu order co nhieu item, link den product dau tien con ton tai.
- Chua dung order item token rieng; neu can prefill theo tung item co the mo rong sau.

Frontend:

- Da ho tro query param `?review=1` de tu scroll den review section va mo modal.
- Neu product detail load xong va co `review=1`, dispatch `open-review-modal`.

Acceptance criteria:

- Khach hang nhan link sau mua va vao thang form danh gia.
- Khong bat buoc review tich cuc; copy phai trung lap, khuyen khich trai nghiem that.

## Operational Notes

- Khong can `storage:link` cho review vi khong upload anh.
- Cache summary review can duoc clear sau moi submit review.
- Do policy auto-approve public co rui ro spam, Phase 3 va Phase 4 nen duoc uu tien sau Phase 1.
- Neu sau nay muon mo lai anh review, can cap nhat lai ca frontend, backend validation, storage va moderation policy.
