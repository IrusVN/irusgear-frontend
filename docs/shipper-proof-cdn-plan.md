# Kế hoạch tích hợp CDN cho ảnh bằng chứng giao hàng

## Mục tiêu

Hiện tại shipper chọn ảnh trong `components/Shipper/ShipperOrderDetailModal.vue`, frontend tạo preview bằng `URL.createObjectURL(file)` và gửi file gốc qua `multipart/form-data` về backend khi gọi:

- `POST /shipper/orders/{id}/complete`
- `POST /shipper/orders/{id}/fail`

Flow mục tiêu:

```txt
Shipper chọn ảnh
-> Frontend upload ảnh lên CDN/Object Storage
-> CDN/Object Storage trả về URL ảnh
-> Frontend gửi URL ảnh cho backend khi hoàn tất/thất bại giao hàng
-> Backend validate và lưu URL vào database
-> User vào /orders/[id]
-> Backend trả proofOfDelivery.photos
-> Frontend render ảnh bằng URL đã lưu
```

Mục tiêu kỹ thuật:

- Ảnh bằng chứng giao hàng không đi qua API complete/fail dưới dạng file lớn nữa.
- Backend lưu được URL ảnh để user/admin xem lại.
- Backend vẫn kiểm soát đúng quyền: ảnh thuộc đúng đơn, đúng shipper, đúng trạng thái.
- Có nền tảng để sau này thêm thumbnail, signed URL, private CDN, cleanup ảnh rác.

## Tham khảo cách các nền tảng ecommerce lớn triển khai

- Shopify dùng CDN cho ảnh/media và có staged upload: client xin upload target, upload file lên storage, sau đó backend/platform lưu media record.
- Amazon S3 presigned URL cho phép browser upload trực tiếp file lên object storage mà không lộ access key.
- Cloudflare R2 hỗ trợ presigned URL tương tự S3, phù hợp nếu muốn dùng Cloudflare CDN/custom domain.
- CloudFront signed URL/cookie dùng khi ảnh cần private, chỉ cho user có quyền xem trong thời gian ngắn.

Nguồn tham khảo:

- AWS S3 presigned URL: https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html
- Cloudflare R2 presigned URL: https://developers.cloudflare.com/r2/api/s3/presigned-urls/
- Cloudflare R2 CORS: https://developers.cloudflare.com/r2/buckets/cors/
- AWS CloudFront signed URL: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-urls.html
- Shopify CDN/images: https://help.shopify.com/en/manual/online-store/images/theme-images
- Shopify staged uploads: https://shopify.dev/docs/api/admin-graphql/2025-01/input-objects/stageduploadinput

## Kiến trúc đề xuất

Chọn hướng: frontend upload ảnh lên CDN/Object Storage trước, nhận URL, sau đó gửi URL cho backend lưu.

Có 2 cách triển khai:

### Cách A: Frontend upload trực tiếp lên dịch vụ CDN có upload API

Ví dụ: Cloudinary, ImageKit, Uploadcare.

Flow:

```txt
Frontend -> CDN upload API -> nhận secure_url
Frontend -> Backend complete/fail -> gửi photo_urls
Backend -> lưu database
```

Ưu điểm:

- Triển khai frontend nhanh.
- Dịch vụ thường có sẵn resize, thumbnail, CDN URL.

Nhược điểm:

- Nếu upload trực tiếp từ frontend cần cơ chế signed upload, không để lộ secret.
- Phụ thuộc vendor.
- Cần kiểm soát quyền upload và cleanup ảnh chưa attach vào đơn.

### Cách B: Backend cấp signed upload URL cho S3/R2, frontend upload trực tiếp

Flow:

```txt
Frontend -> Backend xin upload URL
Backend -> tạo presigned URL
Frontend -> upload file lên S3/R2
Frontend -> nhận storage key/CDN URL
Frontend -> Backend complete/fail -> gửi photo_urls hoặc photo_keys
Backend -> lưu database
```

Ưu điểm:

- An toàn hơn, backend kiểm soát object key, quyền và TTL.
- Không lộ storage credential.
- Dễ chuyển CDN/domain sau này nếu lưu thêm `storage_key`.

Nhược điểm:

- Backend cần thêm service ký URL.
- Cần cấu hình CORS cho bucket.

Khuyến nghị: dùng Cách B nếu muốn làm chắc và lâu dài. Nếu muốn ra nhanh, có thể dùng Cách A nhưng vẫn phải dùng signed upload từ backend, không hardcode secret ở frontend.

## Dữ liệu nên lưu

Backend có thể lưu URL để frontend render ngay:

```txt
url = https://cdn.irusgear.vn/proof-delivery/abc.jpg
```

Nhưng nên lưu thêm `storage_key` để tránh bị phụ thuộc CDN domain:

```txt
storage_key = proof-delivery/2026/05/order-119503/uuid.jpg
cdn_url = https://cdn.irusgear.vn/proof-delivery/2026/05/order-119503/uuid.jpg
thumb_url = https://cdn.irusgear.vn/...thumbnail...
```

Lý do:

- Nếu đổi CDN domain, có thể build lại URL từ `storage_key`.
- Nếu cần xóa ảnh, dùng `storage_key` để xóa object.
- Nếu sau này dùng signed URL/private CDN, backend có thể tạo URL mới theo request.

## Phase 1: Khảo sát backend hiện tại

Mục tiêu: biết chính xác backend đang lưu ảnh POD ở đâu.

Cần kiểm tra trong repo backend:

- Route shipper:
  - `POST /shipper/orders/{id}/complete`
  - `POST /shipper/orders/{id}/fail`
- Service xử lý complete/fail.
- Bảng/model đang lưu proof of delivery hoặc shipment attempts.
- Resource trả dữ liệu cho:
  - trang user `/orders/[id]`
  - admin shipment timeline
  - shipper order detail

Kết quả cần có:

- Xác định bảng cần thêm cột hoặc bảng mới.
- Xác định response hiện tại của `proofOfDelivery.photos`.
- Xác định có cần backward compatibility với multipart `photos[]` không.

### Kết quả khảo sát Phase 1

Backend hiện đã có module POD tương đối đầy đủ, nhưng flow hiện tại vẫn là `multipart/form-data`:

```txt
Frontend gửi photos[]
-> ShipperOrderController validate file
-> PodPhotoService lưu file vào disk pod
-> proof_of_delivery_photos lưu disk/path/thumb_path
-> Resource tạo temporary URL khi user/admin xem
```

Các route shipper hiện tại nằm trong `routes/api.php`, group:

```txt
auth:sanctum
role:courier
active_user
prefix: /api/v1/shipper
```

Route đang dùng cho POD:

```txt
POST /shipper/orders/{id}/complete
POST /shipper/orders/{id}/fail
```

Hai route này có middleware:

```txt
throttle:shipper-write
idempotency
```

Controller xử lý chính:

```txt
app/Http/Controllers/Api/ShipperOrderController.php
```

Các điểm quan trọng trong controller:

- `complete()` chỉ cho phép shipment status `delivering`.
- `fail()` cho phép shipment status `delivering` hoặc `picked_up`.
- `validateComplete()` và `validateFail()` đang bắt buộc:
  - `photos` là array.
  - số lượng theo config `shipping.pod.min_count` và `shipping.pod.max_count`.
  - `photos.*` là file image.
  - MIME: `jpeg`, `jpg`, `png`, `webp`, `heic`, `heif`.
- Sau khi tạo `DeliveryAttempt`, controller gọi:

```php
$this->persistPodPhotos($attempt, $request->file('photos', []));
```

Service lưu ảnh hiện tại:

```txt
app/Services/PodPhotoService.php
```

`PodPhotoService::persist()` hiện làm các việc:

- Validate size, MIME và dimension.
- Tính `sha256` để dedupe theo attempt.
- Tạo path dạng:

```txt
pod/{year}/{month}/{orderId}/{shipmentId}/{attemptId}/{uuid}.{extension}
```

- Lưu file gốc vào `Storage::disk(config('shipping.pod.disk', 'pod'))`.
- Tạo thumbnail `.thumb.jpg` nếu GD hỗ trợ.
- Tạo record `ProofOfDeliveryPhoto`.

Model/database hiện có:

```txt
app/Models/Shipment.php
app/Models/DeliveryAttempt.php
app/Models/ProofOfDeliveryPhoto.php
database/migrations/2026_05_19_000003_create_shipments_table.php
database/migrations/2026_05_19_000004_create_delivery_attempts_table.php
database/migrations/2026_05_19_000005_create_proof_of_delivery_photos_table.php
```

Bảng `proof_of_delivery_photos` hiện có các cột:

```txt
id
delivery_attempt_id
disk
path
thumb_path
original_size_bytes
mime_type
sha256
width
height
captured_at_exif
gps_lat_exif
gps_lng_exif
created_at
updated_at
```

Unique hiện có:

```txt
unique(delivery_attempt_id, sha256)
```

Config storage hiện tại:

```txt
config/shipping.php
config/filesystems.php
```

`shipping.pod.disk` mặc định là `pod`. Disk `pod` mặc định là local private:

```txt
storage/app/private/pod
```

Production đã được thiết kế để có thể đổi sang S3-compatible bằng env:

```txt
POD_STORAGE_DRIVER=s3
POD_S3_KEY
POD_S3_SECRET
POD_S3_REGION
POD_S3_BUCKET
POD_S3_ENDPOINT
```

Resource trả ảnh cho shipper:

```txt
app/Http/Resources/Shipper/ShipperOrderDetailResource.php
```

Response có:

```txt
attempts[].photos[].url
attempts[].photos[].thumb_url
pod_photos[].url
pod_photos[].thumb_url
```

Các URL này được tạo bằng:

```php
Storage::disk($disk)->temporaryUrl($path, now()->addHour())
```

nếu không hỗ trợ thì fallback:

```php
Storage::disk($disk)->url($path)
```

Resource trả ảnh cho user `/orders/[id]`:

```txt
app/Http/Resources/OrderResource.php
```

`OrderController::show()` đã load:

```txt
shipments.attempts.photos
```

`OrderResource` trả:

```json
{
  "proofOfDelivery": {
    "deliveredAt": "...",
    "recipientName": "...",
    "photos": [
      {
        "url": "...",
        "thumbUrl": "...",
        "capturedAt": "...",
        "mimeType": "image/jpeg"
      }
    ]
  }
}
```

Frontend user page:

```txt
pages/orders/[id].vue
```

đã render:

```vue
<img :src="photo.thumbUrl || photo.url" />
```

Resource trả ảnh cho admin timeline:

```txt
app/Http/Resources/Admin/AdminOrderResource.php
components/Admin/Orders/ShipmentTimeline.vue
```

Admin response hiện dùng snake_case:

```txt
photos[].url
photos[].thumb_url
```

Frontend admin timeline đã render:

```vue
<img :src="photo.thumb_url || photo.url" />
```

Kết luận Phase 1:

- Không cần tạo bảng hoàn toàn mới cho ảnh POD. Backend đã có bảng `proof_of_delivery_photos`.
- Phase 2 nên mở rộng bảng hiện có thay vì tạo `shipment_proof_photos`.
- Cần thêm các cột phục vụ CDN/direct upload:
  - `storage_key` hoặc tận dụng `path` làm storage key.
  - `cdn_url`.
  - `thumb_url`.
  - `upload_id` nullable.
  - `status` để quản lý ảnh pending/uploaded/attached/deleted nếu muốn hỗ trợ upload trước rồi attach sau.
- Cần giữ backward compatibility với multipart `photos[]` trong ít nhất 1 release vì frontend hiện tại vẫn gửi file trực tiếp.
- Backend hiện đã ưu tiên private POD + temporary URL. Khi đổi sang CDN public URL cần quyết định rõ bảo mật vì ảnh POD có thể chứa thông tin nhạy cảm.

## Phase 2: Thiết kế database lưu URL ảnh

Sau Phase 1 đã xác nhận backend có bảng `proof_of_delivery_photos`, vì vậy không tạo bảng mới. Phase 2 triển khai bằng migration mở rộng bảng hiện có:

```txt
irusgear-backend/database/migrations/2026_05_23_000001_extend_proof_of_delivery_photos_for_cdn_uploads.php
```

Các cột đã thêm:

```txt
cdn_url
thumb_url
upload_id
status
uploaded_at
attached_at
```

Các index/constraint đã thêm:

```txt
index(status, created_at)
unique(upload_id)
```

Các cột metadata hiện có được đổi sang nullable để hỗ trợ flow CDN/direct upload khi backend chưa có đủ metadata tại thời điểm attach:

```txt
original_size_bytes
mime_type
sha256
width
height
```

Model đã cập nhật:

```txt
irusgear-backend/app/Models/ProofOfDeliveryPhoto.php
```

Constants trạng thái:

```txt
pending
uploaded
attached
deleted
rejected
```

Service multipart legacy đã cập nhật:

```txt
irusgear-backend/app/Services/PodPhotoService.php
```

Khi flow cũ lưu `photos[]`, record mới được set:

```txt
status = attached
uploaded_at = now()
attached_at = now()
```

Quyết định Phase 2:

- `path` tiếp tục là storage key chính cho file trong bucket/disk.
- `cdn_url` là URL ảnh full-size do CDN/Object Storage trả về.
- `thumb_url` là URL thumbnail nếu CDN/service có trả sẵn.
- `upload_id` dùng để liên kết flow upload trước attach ở Phase 3-5.
- Chưa thay đổi response Resource ở Phase 2; user/admin hiện vẫn xem bằng temporary URL từ `path`.

## Phase 3: Backend tạo upload target

Mục tiêu: frontend không tự biết secret CDN/storage.

Thêm API:

```txt
POST /api/v1/shipper/orders/{order}/proof-photos/upload-targets
```

Request:

```json
{
  "action": "complete",
  "files": [
    {
      "clientId": "local-uuid-1",
      "filename": "IMG_1234.jpg",
      "contentType": "image/jpeg",
      "size": 2458123
    }
  ]
}
```

Response:

```json
{
  "success": true,
  "data": {
    "uploads": [
      {
        "clientId": "local-uuid-1",
        "uploadId": "server-upload-id",
        "method": "PUT",
        "uploadUrl": "https://storage-provider-presigned-url",
        "headers": {
          "Content-Type": "image/jpeg"
        },
        "storageKey": "proof-delivery/2026/05/order-119503/uuid.jpg",
        "cdnUrl": "https://cdn.irusgear.vn/proof-delivery/2026/05/order-119503/uuid.jpg",
        "expiresAt": "2026-05-23T10:15:00Z"
      }
    ]
  }
}
```

Backend validate:

- User là shipper/courier hợp lệ.
- Đơn thuộc shipper hoặc shipper có quyền thao tác.
- Đơn đang ở trạng thái cho phép upload ảnh, ưu tiên `delivering`.
- Số ảnh không vượt quá 5.
- MIME hợp lệ: `image/jpeg`, `image/png`, `image/webp`.
- Size không vượt quá giới hạn, đề xuất 8 MB/file.
- Object key phải do backend tạo bằng UUID/random, không tin filename client.

### Kết quả triển khai Phase 3

Backend đã thêm endpoint:

```txt
POST /api/v1/shipper/orders/{id}/proof-photos/upload-targets
```

Route nằm trong group shipper hiện có:

```txt
auth:sanctum
role:courier
active_user
throttle:shipper-write
```

Không gắn middleware `idempotency` cho endpoint này vì mỗi lần xin target cần tạo `uploadId`/signed URL mới.

Các file backend đã thêm/cập nhật:

```txt
app/Http/Requests/Shipper/CreateProofPhotoUploadTargetsRequest.php
app/Http/Controllers/Api/ShipperOrderController.php
app/Services/PodPhotoService.php
config/shipping.php
routes/api.php
composer.json
composer.lock
```

Dependency đã thêm để Laravel hỗ trợ S3/R2 signed upload URL:

```txt
league/flysystem-aws-s3-v3
aws/aws-sdk-php
```

Config mới:

```txt
shipping.pod.upload_url_ttl_seconds
shipping.pod.cdn_url
```

Env tương ứng:

```txt
SHIPPING_POD_UPLOAD_URL_TTL=300
POD_CDN_URL=https://cdn.irusgear.vn
```

Validation request:

- `action`: `complete` hoặc `fail`.
- `files`: bắt buộc, số lượng theo `shipping.pod.min_count` và `shipping.pod.max_count`.
- `files.*.clientId`: bắt buộc.
- `files.*.filename`: bắt buộc, nhưng backend không dùng để tạo object key.
- `files.*.contentType`: chỉ nhận `image/jpeg`, `image/jpg`, `image/png`, `image/webp`, `image/heic`, `image/heif`.
- `files.*.size`: không vượt quá `shipping.pod.max_size_bytes`.

State guard:

- `action=complete`: shipment phải đang `delivering`.
- `action=fail`: shipment được phép ở `delivering` hoặc `picked_up`.
- Shipment phải thuộc shipper hiện tại qua `loadOwnedShipment()`.

Object key hiện được tạo dạng:

```txt
pod/uploads/{year}/{month}/{orderId}/{shipmentId}/{uploadId}.{extension}
```

Response thực tế:

```json
{
  "success": true,
  "data": {
    "uploads": [
      {
        "clientId": "local-uuid-1",
        "uploadId": "uuid",
        "method": "PUT",
        "uploadUrl": "https://storage-provider-presigned-url",
        "headers": {
          "Content-Type": "image/jpeg"
        },
        "storageKey": "pod/uploads/2026/05/119503/10/uuid.jpg",
        "cdnUrl": "https://cdn.irusgear.vn/pod/uploads/2026/05/119503/10/uuid.jpg",
        "contentType": "image/jpeg",
        "size": 2458123,
        "action": "complete",
        "expiresAt": "2026-05-23T10:15:00+07:00"
      }
    ]
  }
}
```

Lưu ý vận hành:

- Disk `pod` local không hỗ trợ `temporaryUploadUrl`; endpoint sẽ trả lỗi nghiệp vụ nếu chưa cấu hình S3/R2.
- Production cần cấu hình `POD_STORAGE_DRIVER=s3` và các biến `POD_S3_*`.
- Endpoint Phase 3 chỉ tạo upload target, chưa confirm object và chưa lưu DB. Việc gửi URL/storageKey vào complete/fail thuộc Phase 5.

## Phase 4: Frontend upload ảnh lên CDN/Object Storage

Tạo composable frontend:

```txt
composables/useProofPhotoUpload.js
```

API đề xuất:

```js
createUploadTargets(orderId, files, action)
uploadFileToTarget(file, target, onProgress)
uploadPhotos(orderId, photos, action)
reset()
```

State mỗi ảnh:

```js
{
  clientId,
  file,
  previewUrl,
  uploadId,
  storageKey,
  cdnUrl,
  progress,
  status: 'queued' | 'uploading' | 'uploaded' | 'failed',
  error
}
```

Trong `components/Shipper/ShipperOrderDetailModal.vue`:

1. Shipper chọn ảnh.
2. Hiển thị preview local bằng `URL.createObjectURL(file)`.
3. Khi bấm hoàn tất/thất bại:
   - Xin upload targets từ backend.
   - Upload từng ảnh lên `uploadUrl`.
   - Lưu `cdnUrl`/`storageKey` trả về.
   - Chỉ khi tất cả ảnh upload thành công mới gọi complete/fail.

UI cần có:

- Progress từng ảnh.
- Trạng thái upload thất bại.
- Nút retry ảnh lỗi.
- Disable nút submit khi đang upload.
- Vẫn giới hạn 1-5 ảnh.

### Kết quả triển khai Phase 4

Frontend đã thêm upload client độc lập:

```txt
composables/useProofPhotoUpload.js
```

Runtime config đã thêm:

```txt
public.shipperProofCdnUpload
```

Env tương ứng:

```txt
NUXT_PUBLIC_SHIPPER_PROOF_CDN_UPLOAD=true
```

Composable hiện có:

```js
createUploadTargets(orderId, photos, action)
uploadFileToTarget(file, target, onProgress)
uploadPhotos(orderId, photos, action)
reset()
```

Nhiệm vụ của composable:

- Validate danh sách ảnh ở client trước khi xin target.
- Gọi endpoint Phase 3:

```txt
POST /shipper/orders/{order}/proof-photos/upload-targets
```

- Upload từng file lên `target.uploadUrl` bằng `XMLHttpRequest` để lấy progress thật.
- Track trạng thái từng ảnh:

```txt
queued
uploading
uploaded
failed
```

- Trả về danh sách ảnh đã upload:

```js
[
  {
    uploadId,
    storageKey,
    url,
    contentType,
    size,
    action
  }
]
```

Phạm vi Phase 4:

- Chưa đổi hành vi submit trong `ShipperOrderDetailModal.vue`.
- Chưa gọi CDN upload khi shipper bấm complete/fail.
- Lý do: backend Phase 5 mới nhận `photos` dạng URL/storageKey trong complete/fail. Nếu gắn ngay ở Phase 4 sẽ tạo upload kép hoặc flow nửa vời.
- Flow multipart legacy hiện vẫn hoạt động nguyên trạng.

## Phase 5: Backend nhận URL và lưu database khi complete/fail

Đổi payload complete:

```txt
POST /api/v1/shipper/orders/{order}/complete
Content-Type: application/json
Idempotency-Key: ...
```

```json
{
  "photos": [
    {
      "uploadId": "server-upload-id",
      "storageKey": "pod/uploads/2026/05/119503/88/server-upload-id.jpg",
      "url": "https://cdn.irusgear.vn/pod/uploads/2026/05/119503/88/server-upload-id.jpg"
    }
  ],
  "recipient_name": "Nguyễn Văn A",
  "cod_collected_amount": 12500000
}
```

Đổi payload fail:

```txt
POST /api/v1/shipper/orders/{order}/fail
Content-Type: application/json
Idempotency-Key: ...
```

```json
{
  "photos": [
    {
      "uploadId": "server-upload-id",
      "storageKey": "pod/uploads/2026/05/119503/88/server-upload-id.jpg",
      "url": "https://cdn.irusgear.vn/pod/uploads/2026/05/119503/88/server-upload-id.jpg"
    }
  ],
  "reason_code": "not_home",
  "note": "Khách hẹn giao lại chiều mai",
  "recipient_name": "Nguyễn Văn A"
}
```

Backend xử lý:

- Validate tối thiểu 1 ảnh, tối đa 5 ảnh.
- Validate URL thuộc domain CDN hợp lệ.
- Validate `storageKey` thuộc prefix của order hiện tại.
- Nên `HEAD object` để chắc object đã tồn tại.
- Lưu record ảnh vào database.
- Attach ảnh vào delivery attempt/proof of delivery.
- Chuyển trạng thái đơn:
  - complete -> `delivered`
  - fail -> `failed`

Lưu ý:

- Trong giai đoạn chuyển đổi, backend có thể hỗ trợ cả `photos[]` multipart cũ và payload URL mới.
- Sau khi frontend đã ổn định, nên bỏ multipart cũ để API nhẹ hơn.

Kết quả triển khai Phase 5:

- `complete` và `fail` hỗ trợ cả multipart `photos[]` cũ và JSON `photos[]` mới chứa `uploadId`, `storageKey`, `url`.
- Payload URL mới được validate theo số lượng ảnh, dung lượng byte, MIME, URL CDN, `storageKey` thuộc đúng order/shipment và `uploadId`.
- Backend kiểm tra object tồn tại trên storage trước khi attach vào `delivery_attempt`.
- Database lưu `cdn_url`, `thumb_url`, `upload_id`, `status=attached`, `uploaded_at`, `attached_at`.
- Order detail, shipper detail và admin order resource ưu tiên trả `cdn_url/thumb_url`; ảnh legacy vẫn fallback sang signed/local storage URL.

## Phase 6: User xem lại ảnh ở `/orders/[id]`

Backend cần trả dữ liệu trong order detail:

```json
{
  "proofOfDelivery": {
    "deliveredAt": "2026-05-23T10:00:00Z",
    "recipientName": "Nguyễn Văn A",
    "photos": [
      {
        "id": 123,
        "url": "https://cdn.irusgear.vn/proof-delivery/2026/05/order-119503/uuid.jpg",
        "thumbUrl": "https://cdn.irusgear.vn/proof-delivery/2026/05/order-119503/uuid-thumb.jpg"
      }
    ]
  }
}
```

Frontend `pages/orders/[id].vue` hiện đã có block đọc:

```txt
order.proofOfDelivery.photos
```

Cần đảm bảo mỗi photo có:

- `url`
- `thumbUrl` nếu có

Render:

```vue
<img :src="photo.thumbUrl || photo.url" />
```

Khi user click xem lớn:

```vue
window.open(photo.url)
```

hoặc mở modal preview ảnh.

Kết quả triển khai Phase 6:

- `OrderResource` trả `proofOfDelivery.photos` có `id`, `url`, `thumbUrl`, `thumb_url`, `capturedAt`, `mimeType`.
- Resource ưu tiên URL CDN đã lưu và bỏ qua ảnh không tạo được URL, tránh frontend render ảnh hỏng.
- Frontend `/orders/[id]` normalize `proofOfDelivery` từ response thật, hỗ trợ cả camelCase và snake_case trong giai đoạn chuyển đổi.
- UI chỉ hiển thị block bằng chứng giao hàng khi backend trả ít nhất một ảnh có URL hợp lệ.
- Click ảnh vẫn mở URL ảnh gốc từ backend trong tab mới.

## Phase 7: Admin xem lại ảnh trong shipment timeline

Frontend `components/Admin/Orders/ShipmentTimeline.vue` đang đọc ảnh attempt qua:

```txt
photo.thumb_url || photo.url
```

Backend cần trả đúng shape:

```json
{
  "photos": [
    {
      "url": "https://cdn.irusgear.vn/...",
      "thumb_url": "https://cdn.irusgear.vn/..."
    }
  ]
}
```

Nếu backend dùng camelCase ở user resource và snake_case ở admin resource thì frontend cần map thống nhất hoặc backend Resource nên trả cả hai trong giai đoạn chuyển đổi.

Kết quả triển khai Phase 7:

- `AdminOrderResource` trả ảnh attempt bằng URL thật, ưu tiên `cdn_url/thumb_url`, fallback signed/local URL cho ảnh legacy.
- Resource admin bỏ qua ảnh không tạo được URL để timeline không render thumbnail hỏng.
- Payload admin hỗ trợ cả `thumb_url` và `thumbUrl` trong giai đoạn chuyển đổi.
- `components/Admin/Orders/ShipmentTimeline.vue` normalize ảnh từ response thật, chỉ render ảnh có `url` hợp lệ.
- Thumbnail dùng `thumbUrl`, lightbox mở URL ảnh gốc từ backend.

## Phase 8: Cleanup, bảo mật và vận hành

Ảnh POD có thể chứa thông tin nhạy cảm: mặt khách hàng, nhà riêng, địa chỉ, số điện thoại, mã đơn hàng.

Yêu cầu bảo mật:

- Không lưu secret CDN/storage ở frontend.
- Upload URL TTL ngắn, đề xuất 5 phút.
- Object key random UUID.
- Không đưa số điện thoại, tên khách, địa chỉ vào filename.
- Chỉ user sở hữu đơn, shipper liên quan, admin/manager mới được xem.
- Nếu ảnh private, backend tạo signed read URL ngắn hạn thay vì trả URL public vĩnh viễn.
- Validate domain URL trước khi lưu, tránh user gửi URL ngoài hệ thống.
- Job cleanup ảnh upload nhưng chưa attach sau 24 giờ.

Job cleanup:

```txt
proof-photos:cleanup-orphans
```

Xử lý:

- Tìm ảnh `pending/uploaded` quá hạn chưa attach.
- Xóa object khỏi storage.
- Chuyển DB status sang `deleted` hoặc xóa mềm.

Kết quả triển khai Phase 8:

- Thêm command backend `proof-photos:cleanup-orphans`.
- Command quét đúng prefix upload trực tiếp `pod/uploads`, chỉ xóa object quá hạn và không được DB tham chiếu bởi ảnh `attached`.
- Có `--dry-run`, `--hours`, `--limit` để kiểm tra an toàn trước khi xóa thật.
- Thêm config vận hành:
  - `SHIPPING_POD_CLEANUP_ORPHAN_HOURS`, mặc định 24 giờ.
  - `SHIPPING_POD_CLEANUP_ORPHAN_LIMIT`, mặc định 500 object mỗi lượt.
- Command cũng đánh dấu các DB row `pending/uploaded` quá hạn sang `deleted` để sẵn sàng cho flow mở rộng sau này.
- Command backward-compatible với DB chưa migrate cột `status`: vẫn kiểm tra path tham chiếu theo schema cũ và bỏ qua phần mark DB row.
- Schedule chạy hàng giờ bằng Laravel scheduler với `withoutOverlapping()`.

## Phase 9: Feature flag và migration strategy

Thêm feature flag frontend:

```txt
public.shipperProofCdnUpload=true
```

Lộ trình rollout:

1. Backend hỗ trợ endpoint upload target.
2. Backend complete/fail nhận cả multipart cũ và URL mới.
3. Frontend bật upload CDN cho môi trường dev/staging.
4. Test shipper thực tế trên mobile.
5. Bật production theo feature flag.
6. Sau khi ổn định, bỏ multipart legacy.

Kết quả triển khai Phase 9:

- Frontend đã có feature flag `public.shipperProofCdnUpload`, đọc từ `NUXT_PUBLIC_SHIPPER_PROOF_CDN_UPLOAD=true`.
- `ShipperOrderDetailModal.vue` dùng flag để chọn flow:
  - Flag tắt: giữ nguyên multipart `photos[]` legacy.
  - Flag bật: xin upload target, upload ảnh lên CDN/object storage, rồi gọi `complete/fail` bằng JSON URL.
- Nếu bước upload CDN lỗi hoặc thiếu `cdnUrl`, frontend fallback sang multipart legacy để shipper không bị kẹt tại bước giao hàng.
- Modal hiển thị progress upload thật từ `useProofPhotoUpload`, không dùng dữ liệu giả.
- `useProofPhotoUpload` chặn flow CDN nếu backend chưa trả `cdnUrl`, giúp tránh gửi payload URL rỗng vào `complete/fail`.

## Checklist test

Backend:

- Tạo upload target thành công cho order `delivering`.
- Từ chối order không thuộc shipper.
- Từ chối file quá size.
- Từ chối MIME không hợp lệ.
- Từ chối nhiều hơn 5 ảnh.
- Complete fail nếu không có ảnh.
- Complete fail nếu URL không thuộc CDN hợp lệ.
- Complete fail nếu `storageKey` không thuộc order hiện tại.
- Complete COD fail nếu số tiền thu hộ không khớp.
- Fail delivery lưu đúng reason và ảnh.
- User `/orders/{id}` chỉ xem được ảnh đơn của mình.
- Admin shipment timeline xem được ảnh.
- Cleanup xóa ảnh orphan.

Frontend:

- Chọn ảnh từ camera mobile.
- Chọn ảnh từ thư viện.
- Preview ảnh trước upload.
- Upload progress đúng.
- Retry ảnh upload lỗi.
- Không cho submit khi upload chưa xong.
- Complete gửi URL ảnh cho backend.
- Fail gửi URL ảnh cho backend.
- User vào `/orders/[id]` thấy ảnh bằng chứng.
- Admin timeline thấy ảnh bằng chứng.

## Kết quả mong đợi

Sau khi hoàn thành:

- Shipper upload ảnh lên CDN trước.
- Backend chỉ nhận URL/storage key và lưu database.
- User xem lại ảnh ở `/orders/[id]` bằng URL từ backend.
- Admin xem được ảnh trong timeline đơn hàng.
- API complete/fail nhẹ hơn, ít rủi ro timeout khi ảnh lớn.
- Hệ thống có nền để nâng cấp private CDN, thumbnail, cleanup và audit sau này.
