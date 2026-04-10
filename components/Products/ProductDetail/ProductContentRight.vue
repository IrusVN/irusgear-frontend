<template>
  <div class="block-sforum-v2">
    <div class="sforum__title">
      <p>Tin tức sản phẩm</p>
      <a
        target="_blank"
        href="https://cellphones.com.vn/sforum/tag/apple-iphone-14"
        class="btn-show-more button__link text-decoration-none"
      >
        Xem tất cả
        <div>
          <svg
            height="15"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
          >
            <path
              d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z"
            ></path>
          </svg></div
      ></a>
    </div>
    <div class="sforum__content">
      <a
        target="_blank"
        href="https://cellphones.com.vn/sforum/cares-trung-tam-bao-hanh-uy-quyen-apple-chinh-hang-tai-viet-nam"
        class="sforum__content-item button__link is-flex text-decoration-none"
        ><img
          src="https://cdn.sforum.vn/sforum/wp-content/uploads/2024/01/CareS-8-2-e1704785259475.jpg"
          alt="CareS - Trung tâm bảo hành ủy quyền Apple chính hãng tại Việt Nam"
          loading="lazy"
          class="content-item__img"
        />
        <div class="content-item__text">
          CareS - Trung tâm bảo hành ủy quyền Apple chính hãng tại Việt Nam
        </div> </a
      ><a
        target="_blank"
        href="https://cellphones.com.vn/sforum/cach-khoi-dong-lai-iphone-14"
        class="sforum__content-item button__link is-flex text-decoration-none"
        ><img
          src="https://cdn-media.sforum.vn/storage/app/media/nguyenhang/cach-khoi-dong-lai-iphone-14/cach-khoi-dong-lai-iphone-14-12.jpg"
          alt="Cách khởi động lại iPhone 14 khi bị giật, lag máy"
          loading="lazy"
          class="content-item__img"
        />
        <div class="content-item__text">
          Cách khởi động lại iPhone 14 khi bị giật, lag máy
        </div> </a
      ><a
        target="_blank"
        href="https://cellphones.com.vn/sforum/cach-tat-hdr-tren-iphone-14"
        class="sforum__content-item button__link is-flex text-decoration-none"
        ><img
          src="https://cdn-media.sforum.vn/storage/app/media/nhuy/Nhu-Y-1/cach-tat-hdr-tren-iphone-14.jpg"
          alt="Cách tắt HDR trên iPhone 14 nhanh chóng, đơn giản nhất"
          loading="lazy"
          class="content-item__img"
        />
        <div class="content-item__text">
          Cách tắt HDR trên iPhone 14 nhanh chóng, đơn giản nhất
        </div> </a
      ><a
        target="_blank"
        href="https://cellphones.com.vn/sforum/so-sanh-iphone-17-vs-14"
        class="sforum__content-item button__link is-flex text-decoration-none"
        ><img
          src="https://cdn-media.sforum.vn/storage/app/media/trannghia/trannghia2/so-sanh-iphone-17-vs-14-cover.jpg"
          alt="So sánh iPhone 17 vs 14: Đã đến lúc người dùng nâng cấp!!!"
          loading="lazy"
          class="content-item__img"
        />
        <div class="content-item__text">
          So sánh iPhone 17 vs 14: Đã đến lúc người dùng nâng cấp!!!
        </div> </a
      ><a
        target="_blank"
        href="https://cellphones.com.vn/sforum/so-sanh-honor-400-vs-iphone-14"
        class="sforum__content-item button__link is-flex text-decoration-none"
        ><img
          src="https://cdn-media.sforum.vn/storage/app/media/maithuong/honor-400-vs-iphone-14-cover.jpg"
          alt="So sánh Honor 400 vs iPhone 14: Lựa chọn nào đáng tin cậy hơn trong phân khúc hơn 12 triệu đồng?"
          loading="lazy"
          class="content-item__img"
        />
        <div class="content-item__text">
          So sánh Honor 400 vs iPhone 14: Lựa chọn nào đáng tin cậy hơn trong
          phân khúc hơn 12 triệu đồng?
        </div>
      </a>
    </div>
  </div>
</template>
<script setup></script>
<style scoped>
.block-sforum-v2 {
  background-color: #f7f7f8;
  border-radius: 16px;
  margin-bottom: 16px;
  padding: 16px;
  position: relative;
  right: 2px;
}

.block-sforum-v2 .sforum__title {
  align-items: center;
  color: #18181b;
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.block-sforum-v2 .sforum__title p {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  text-align: left;
}

.block-sforum-v2 .sforum__title .btn-show-more {
  align-items: center;
  color: #3b82f6;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: 500;
  gap: 4px;
  justify-content: center;
  padding: 4px;
}

.block-sforum-v2 .sforum__title .btn-show-more svg {
  fill: #3b82f6;
  height: 12px;
  margin-top: 6px;
}

.block-sforum-v2 .sforum__title .btn-show-more:hover {
  opacity: 0.8;
}

.block-sforum-v2 .sforum__content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.block-sforum-v2 .sforum__content .sforum__content-item {
  align-items: center;
  background-color: #fff;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  gap: 10px;
  padding: 12px;
}

.block-sforum-v2 .sforum__content .sforum__content-item .content-item__img {
  border-radius: 10px;
  height: 60px;
  max-width: 100px;
  min-width: 100px;
}

.block-sforum-v2 .sforum__content .sforum__content-item .content-item__text {
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  color: #444;
  display: -webkit-box;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  overflow: hidden;
}

.block-sforum-v2 .sforum__content .sforum__content-item:hover {
  -webkit-text-decoration: underline;
  text-decoration: underline;
}

.cps-block-boxProductTvc {
  background-color: #f7f7f8;
  border-radius: 16px;
  margin-bottom: 16px;
  padding: 16px;
  position: relative;
  right: 2px;
  width: 100%;
}

.cps-block-boxProductTvc .boxProductTvc-title {
  align-items: center;
  color: #18181b;
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.cps-block-boxProductTvc .boxProductTvc-title p {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  text-align: left;
}

.cps-block-boxProductTvc .boxProductTvc-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cps-block-boxProductTvc .boxProductTvc-content-item {
  align-items: center;
  background-color: #fff;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  gap: 10px;
  padding: 12px;
}

.cps-block-boxProductTvc .boxProductTvc-content-item img {
  border-radius: 10px;
  height: 60px;
  max-width: 100px;
  min-width: 100px;
}

.cps-block-boxProductTvc .boxProductTvc-content-item p {
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  color: #444;
  display: -webkit-box;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  overflow: hidden;
}

.cps-block-boxProductTvc .boxProductTvc-content-item:hover {
  -webkit-text-decoration: underline;
  text-decoration: underline;
}

.is-flex {
  display: flex !important;
}

@media only screen and (min-width: 541px) and (max-width: 768px) {
  .cps-block-boxProductTvc {
    margin: 0 0 12px !important;
    max-width: 768px;
  }

  .cps-block-boxProductTvc .boxProductTvc-content-item p {
    -webkit-line-clamp: 3;
    font-size: 13px;
  }
}

@media only screen and (max-width: 540px) {
  .block-sforum-v2 {
    background-color: #fff;
    padding: 16px 0;
  }

  .block-sforum-v2 .sforum__title {
    margin-bottom: 12px;
  }

  .block-sforum-v2 .sforum__title p {
    font-size: 16px;
  }

  .block-sforum-v2 .sforum__title .btn-show-more {
    font-size: 12px;
  }

  .block-sforum-v2 .sforum__content {
    grid-gap: 10px;
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(2, 1fr);
  }

  .block-sforum-v2 .sforum__content .sforum__content-item {
    border-radius: 16px;
    box-shadow:
      0 1px 2px 0 rgba(60, 64, 67, 0.1),
      0 2px 6px 2px rgba(60, 64, 67, 0.15);
    flex-direction: column;
    gap: 0;
    padding: 0;
  }

  .block-sforum-v2 .sforum__content .sforum__content-item .content-item__img {
    border-radius: 16px 16px 0 0;
    height: auto;
    max-height: 92px;
    max-width: none;
    min-width: 100px;
    width: 100%;
  }

  .block-sforum-v2 .sforum__content .sforum__content-item .content-item__text {
    -webkit-line-clamp: 2;
    font-size: 14px;
    font-weight: 700;
    margin: 8px;
  }

  .cps-block-boxProductTvc {
    background-color: #fff;
    padding: 16px 0;
  }

  .cps-block-boxProductTvc .boxProductTvc-title {
    margin-bottom: 12px;
  }

  .cps-block-boxProductTvc .boxProductTvc-title p {
    font-size: 16px;
  }

  .cps-block-boxProductTvc .boxProductTvc-content {
    grid-gap: 10px;
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(2, 1fr);
  }

  .cps-block-boxProductTvc .boxProductTvc-content-item {
    border-radius: 16px;
    box-shadow:
      0 1px 2px 0 rgba(60, 64, 67, 0.1),
      0 2px 6px 2px rgba(60, 64, 67, 0.15);
    flex-direction: column;
    gap: 0;
    padding: 0;
  }

  .cps-block-boxProductTvc .boxProductTvc-content-item img {
    border-radius: 16px 16px 0 0;
    height: auto;
    max-height: 92px;
    max-width: none;
    min-width: 100px;
    width: 100%;
  }

  .cps-block-boxProductTvc .boxProductTvc-content-item p {
    -webkit-line-clamp: 2;
    font-size: 14px;
    font-weight: 700;
    margin: 8px;
  }
}
</style>
