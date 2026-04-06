<template>
  <div ref="rootEl" class="box-detail-product__box-left column">
    <div class="box-header box-header-desktop">
      <div class="box-product-name">
        <h1>iPhone 14 128GB | Chính hãng VN/A</h1>
      </div>
      <div class="is-flex is-align-items-center mt-2">
        <div class="box-rating">
          <svg height="15" viewBox="0 0 576 512">
            <path
              d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"
            ></path>
          </svg>
          <span>4.9</span> <span class="total-rating">(56 đánh giá)</span>
        </div>
      </div>
      <div class="box-header__bottom">
        <div class="box-bottom-item">
          <button id="wishListBtn" type="button" @click="toggleWishlist">
            <div class="btn__effect button__add-wishlist inactive">
              <svg
                viewBox="20 18 29 28"
                aria-hidden="true"
                focusable="false"
                class="heart-border icon-svg icon-svg--color-cps"
              >
                <path
                  d="M28.3 21.1a4.3 4.3 0 0 1 4.1 2.6 2.5 2.5 0 0 0 2.3 1.7c1 0 1.7-.6 2.2-1.7a3.7 3.7 0 0 1 3.7-2.6c2.7 0 5.2 2.7 5.3 5.8.2 4-5.4 11.2-9.3 15a2.8 2.8 0 0 1-2 1 3.4 3.4 0 0 1-2.2-1c-9.6-10-9.4-13.2-9.3-15 0-1 .6-5.8 5.2-5.8m0-3c-5.3 0-7.9 4.3-8.2 8.5-.2 3.2.4 7.2 10.2 17.4a6.3 6.3 0 0 0 4.3 1.9 5.7 5.7 0 0 0 4.1-1.9c1.1-1 10.6-10.7 10.3-17.3-.2-4.6-4-8.6-8.4-8.6a7.6 7.6 0 0 0-6 2.7 8.1 8.1 0 0 0-6.2-2.7z"
                ></path>
              </svg>
              <svg
                viewBox="0 0 19.2 18.5"
                aria-hidden="true"
                focusable="false"
                class="heart-stroke icon-svg icon-svg--color-silver"
              >
                <path
                  d="M9.66 18.48a4.23 4.23 0 0 1-2.89-1.22C.29 10.44-.12 7.79.02 5.67.21 2.87 1.95.03 5.42.01c1.61-.07 3.16.57 4.25 1.76A5.07 5.07 0 0 1 13.6 0c2.88 0 5.43 2.66 5.59 5.74.2 4.37-6.09 10.79-6.8 11.5-.71.77-1.7 1.21-2.74 1.23z"
                ></path>
              </svg>
              <svg
                viewBox="0 0 19.2 18.5"
                aria-hidden="true"
                focusable="false"
                class="heart-full icon-svg icon-svg--color-cps"
              >
                <path
                  d="M9.66 18.48a4.23 4.23 0 0 1-2.89-1.22C.29 10.44-.12 7.79.02 5.67.21 2.87 1.95.03 5.42.01c1.61-.07 3.16.57 4.25 1.76A5.07 5.07 0 0 1 13.6 0c2.88 0 5.43 2.66 5.59 5.74.2 4.37-6.09 10.79-6.8 11.5-.71.77-1.7 1.21-2.74 1.23z"
                ></path>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="5.707 17 48 20"
                class="broken-heart"
              >
                <g fill="#3b82f6">
                  <path
                    d="M29.865 32.735V18.703a4.562 4.562 0 0 0-3.567-1.476c-2.916.017-4.378 2.403-4.538 4.756-.118 1.781.227 4.006 5.672 9.737a3.544 3.544 0 0 0 2.428 1.025l-.008-.008.013-.002z"
                    class="broken-heart--left"
                  ></path>
                  <path
                    d="M37.868 22.045c-.135-2.588-2.277-4.823-4.697-4.823a4.258 4.258 0 0 0-3.302 1.487l-.004-.003v14.035a3.215 3.215 0 0 0 2.289-1.033c.598-.596 5.882-5.99 5.714-9.663z"
                    class="broken-heart--right"
                  ></path>
                </g>
                <path
                  fill="none"
                  stroke="#FFF"
                  stroke-miterlimit="10"
                  d="M29.865 18.205v14.573"
                  class="broken-heart--crack"
                ></path>
              </svg>
              <span class="effect-group"
                ><span class="effect"></span> <span class="effect"></span>
                <span class="effect"></span> <span class="effect"></span>
                <span class="effect"></span
              ></span>
            </div>
            <span class="text-wishlist" style="display: none"
              >&nbsp;Yêu thích</span
            >
          </button>
          <span class="label">Yêu thích</span>
        </div>
        <div class="box-bottom-item">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 9H16"
              stroke="#3B82F6"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M8 13H14"
              stroke="#3B82F6"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M9 18H6C5.20435 18 4.44129 17.6839 3.87868 17.1213C3.31607 16.5587 3 15.7956 3 15V7C3 6.20435 3.31607 5.44129 3.87868 4.87868C4.44129 4.31607 5.20435 4 6 4H18C18.7956 4 19.5587 4.31607 20.1213 4.87868C20.6839 5.44129 21 6.20435 21 7V15C21 15.7956 20.6839 16.5587 20.1213 17.1213C19.5587 17.6839 18.7956 18 18 18H15L12 21L9 18Z"
              stroke="#3B82F6"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
          <span class="label">Hỏi đáp</span>
        </div>
        <div class="box-bottom-item">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="5"
              y="5"
              width="14"
              height="14"
              rx="2"
              stroke="#3B82F6"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></rect>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M9 10C9 9.44772 9.44772 9 10 9H14C14.5523 9 15 9.44772 15 10V14C15 14.5523 14.5523 15 14 15H10C9.44772 15 9 14.5523 9 14V10Z"
              stroke="#3B82F6"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M3 10H5"
              stroke="#3B82F6"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M3 14H5"
              stroke="#3B82F6"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M10 3V5"
              stroke="#3B82F6"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M14 3V5"
              stroke="#3B82F6"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M21 10H19"
              stroke="#3B82F6"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M21 14H19"
              stroke="#3B82F6"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M14 21V19"
              stroke="#3B82F6"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M10 21V19"
              stroke="#3B82F6"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
          <span class="label"> Thông số </span>
        </div>
        <div class="pdp-compare-button-box is-flex is-align-items-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 9.61305 20.0518 7.32387 18.364 5.63604C16.6761 3.94821 14.3869 3 12 3C9.61305 3 7.32387 3.94821 5.63604 5.63604C3.94821 7.32387 3 9.61305 3 12Z"
              stroke="#3B82F6"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M9 12H15"
              stroke="#3B82F6"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M12 9V15"
              stroke="#3B82F6"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
          <a class="label"> So sánh</a>
        </div>
      </div>
    </div>
    <div class="box-gallery">
      <div class="gallery-product-detail mb-2">
        <div
          class="gallery-slide gallery-top swiper swiper-container swiper-container-initialized swiper-container-horizontal"
        >
          <div
            class="swiper-wrapper"
            style="transform: translate3d(0px, 0px, 0px)"
          >
            <div
              class="swiper-slide ksp-gallery swiper-slide-active"
              style="width: 589px; margin-right: 20px"
            >
              <div class="box-ksp ksp-video">
                <div class="video-thumbnail-wrapper" @click="playVideo">
                  <template v-if="!isVideoPlaying">
                    <img
                      src="https://img.youtube.com/vi/8LwmuPL-YZU/maxresdefault.jpg"
                      alt="Video thumbnail"
                      class="video-thumbnail"
                    />
                    <div class="youtube-play-button">
                      <svg width="68" height="48" viewBox="0 0 68 48">
                        <path
                          d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.63-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
                          fill="#f00"
                        ></path>
                        <path d="M 45,24 27,14 27,34" fill="#fff"></path>
                      </svg>
                    </div>
                  </template>
                  <iframe
                    v-else
                    src="https://www.youtube.com/embed/8LwmuPL-YZU?autoplay=1&rel=0"
                    title="iPhone 14 video"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
              </div>
            </div>
            <div
              id="v2Gallery"
              class="swiper-slide ksp-gallery swiper-slide-next"
              style="width: 589px; margin-right: 20px"
            >
              <div class="box-ksp is-flex is-flex-direction-row">
                <img
                  src="https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14_2_1.jpg"
                  width="358"
                  height="358"
                  alt="iPhone 14 128GB  | Chính hãng VN/A"
                  loading="lazy"
                  title="iPhone 14 128GB  | Chính hãng VN/A"
                  class="mb-1 mr-2"
                />
                <div>
                  <p class="title desktop">Tính năng nổi bật</p>
                  <div class="desktop">
                    <ul>
                      <li>
                        iPhone 14 trang bị màn hình Super Retina XDR 6,1 inch
                        cho trải nghiệm hình ảnh sắc nét và sống động.
                      </li>
                      <li>
                        Thời lượng pin cả ngày cho phép bạn xem video lên đến 20
                        giờ, luôn sẵn sàng cho những ngày làm việc dài.
                      </li>
                      <li>
                        Với các tính năng độ bền như Ceramic Shield và khả năng
                        chống nước, iPhone 14 đảm bảo an toàn trong mọi tình
                        huống.
                      </li>
                      <li>
                        Chip A15 Bionic với GPU 5 lõi mang lại hiệu suất siêu
                        nhanh, cùng mạng di động 5G cho khả năng làm việc từ xa
                        và họp trực tuyến chất lượng cao.
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="mobile">
                  <p class="title">Tính năng nổi bật</p>
                  <div>
                    <ul>
                      <li>
                        iPhone 14 trang bị màn hình Super Retina XDR 6,1 inch
                        cho trải nghiệm hình ảnh sắc nét và sống động.
                      </li>
                      <li>
                        Thời lượng pin cả ngày cho phép bạn xem video lên đến 20
                        giờ, luôn sẵn sàng cho những ngày làm việc dài.
                      </li>
                      <li>
                        Với các tính năng độ bền như Ceramic Shield và khả năng
                        chống nước, iPhone 14 đảm bảo an toàn trong mọi tình
                        huống.
                      </li>
                      <li>
                        Chip A15 Bionic với GPU 5 lõi mang lại hiệu suất siêu
                        nhanh, cùng mạng di động 5G cho khả năng làm việc từ xa
                        và họp trực tuyến chất lượng cao.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="width: 589px; margin-right: 20px">
              <a
                href="https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone-14_2_1.jpg"
                class="spotlight"
                ><img
                  src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14_2_1.jpg"
                  height="358"
                  alt="iPhone 14 128GB  | Chính hãng VN/A - 1"
                  loading="lazy"
                  title="iPhone 14 128GB  | Chính hãng VN/A"
                  rel="preload"
              /></a>
            </div>
            <div class="swiper-slide" style="width: 589px; margin-right: 20px">
              <a
                href="https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone_14_blue_pdp_image_position-1b_blue_color_vn.png"
                class="spotlight"
                ><img
                  src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_14_blue_pdp_image_position-1b_blue_color_vn.png"
                  height="358"
                  alt="iPhone 14 128GB  | Chính hãng VN/A - 2"
                  loading="lazy"
                  title="iPhone 14 128GB  | Chính hãng VN/A"
                  rel="preload"
              /></a>
            </div>
            <div class="swiper-slide" style="width: 589px; margin-right: 20px">
              <a
                href="https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone_14_blue_pdp_image_position-2_design_vn.png"
                class="spotlight"
                ><img
                  src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_14_blue_pdp_image_position-2_design_vn.png"
                  height="358"
                  alt="iPhone 14 128GB  | Chính hãng VN/A - 3"
                  loading="lazy"
                  title="iPhone 14 128GB  | Chính hãng VN/A"
                  rel="preload"
              /></a>
            </div>
            <div class="swiper-slide" style="width: 589px; margin-right: 20px">
              <a
                href="https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone_14_blue_pdp_image_position-3_camera_vn.png"
                class="spotlight"
                ><img
                  src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_14_blue_pdp_image_position-3_camera_vn.png"
                  height="358"
                  alt="iPhone 14 128GB  | Chính hãng VN/A - 4"
                  loading="lazy"
                  title="iPhone 14 128GB  | Chính hãng VN/A"
                  rel="preload"
              /></a>
            </div>
            <div class="swiper-slide" style="width: 589px; margin-right: 20px">
              <a
                href="https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone_14_blue_pdp_image_position-4_lineup_vn.png"
                class="spotlight"
                ><img
                  src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_14_blue_pdp_image_position-4_lineup_vn.png"
                  height="358"
                  alt="iPhone 14 128GB  | Chính hãng VN/A - 5"
                  loading="lazy"
                  title="iPhone 14 128GB  | Chính hãng VN/A"
                  rel="preload"
              /></a>
            </div>
            <div class="swiper-slide" style="width: 589px; margin-right: 20px">
              <a
                href="https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone_14_blue_pdp_image_position-5_colors__vn.png"
                class="spotlight"
                ><img
                  src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_14_blue_pdp_image_position-5_colors__vn.png"
                  height="358"
                  alt="iPhone 14 128GB  | Chính hãng VN/A - 6"
                  loading="lazy"
                  title="iPhone 14 128GB  | Chính hãng VN/A"
                  rel="preload"
              /></a>
            </div>
            <div class="swiper-slide" style="width: 589px; margin-right: 20px">
              <a
                href="https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone_14_blue_pdp_image_position-6_size_comparison__vn.png"
                class="spotlight"
                ><img
                  src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_14_blue_pdp_image_position-6_size_comparison__vn.png"
                  height="358"
                  alt="iPhone 14 128GB  | Chính hãng VN/A - 7"
                  loading="lazy"
                  title="iPhone 14 128GB  | Chính hãng VN/A"
                  rel="preload"
              /></a>
            </div>
            <div class="swiper-slide" style="width: 589px; margin-right: 20px">
              <a
                href="https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone_14_blue_pdp_image_position-7_features_specs__vn.png"
                class="spotlight"
                ><img
                  src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_14_blue_pdp_image_position-7_features_specs__vn.png"
                  height="358"
                  alt="iPhone 14 128GB  | Chính hãng VN/A - 8"
                  loading="lazy"
                  title="iPhone 14 128GB  | Chính hãng VN/A"
                  rel="preload"
              /></a>
            </div>
            <div class="swiper-slide" style="width: 589px; margin-right: 20px">
              <a
                href="https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone_14_blue_pdp_image_position-8_accessory_vn.png"
                class="spotlight"
                ><img
                  src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_14_blue_pdp_image_position-8_accessory_vn.png"
                  height="358"
                  alt="iPhone 14 128GB  | Chính hãng VN/A - 9"
                  loading="lazy"
                  title="iPhone 14 128GB  | Chính hãng VN/A"
                  rel="preload"
              /></a>
            </div>
            <div class="swiper-slide" style="width: 589px; margin-right: 20px">
              <a
                href="https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone_14_blue_pdp_image_position-9_typec_lightning_cable_vn.png"
                class="spotlight"
                ><img
                  src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_14_blue_pdp_image_position-9_typec_lightning_cable_vn.png"
                  height="358"
                  alt="iPhone 14 128GB  | Chính hãng VN/A - 10"
                  loading="lazy"
                  title="iPhone 14 128GB  | Chính hãng VN/A"
                  rel="preload"
              /></a>
            </div>
          </div>
          <div
            class="swiper-button-next button__view-gallery-next"
            tabindex="0"
            role="button"
            aria-label="Next slide"
            aria-disabled="false"
          >
            <div class="icon">
              <svg
                height="15"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path
                  d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z"
                ></path>
              </svg>
            </div>
          </div>
          <div
            class="swiper-button-prev button__view-gallery-prev"
            tabindex="0"
            role="button"
            aria-label="Previous slide"
            aria-disabled="false"
          >
            <div class="icon">
              <svg
                height="15"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path
                  d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z"
                ></path>
              </svg>
            </div>
          </div>
          <span
            class="swiper-notification"
            aria-live="assertive"
            aria-atomic="true"
          ></span>
        </div>
        <div
          class="thumbnail-slide swiper swiper-container gallery-thumbs swiper-container-initialized swiper-container-horizontal swiper-container-free-mode swiper-container-thumbs"
        >
          <div
            class="swiper-wrapper"
            style="transform: translate3d(0px, 0px, 0px)"
          >
            <div
              class="swiper-slide ksp-thumbs button__view-gallery-vid swiper-slide-visible swiper-slide-active swiper-slide-thumb-active"
              style="margin-right: 10px"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                  stroke="#292D32"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M9.09998 12V10.52C9.09998 8.60999 10.45 7.83999 12.1 8.78999L13.38 9.52999L14.66 10.27C16.31 11.22 16.31 12.78 14.66 13.73L13.38 14.47L12.1 15.21C10.45 16.16 9.09998 15.38 9.09998 13.48V12Z"
                  stroke="#292D32"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
              <p>Video</p>
            </div>
            <div
              class="swiper-slide ksp-thumbs button__view-gallery-thumb swiper-slide-visible swiper-slide-next"
              style="margin-right: 10px"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.73 3.50989L15.49 7.02989C15.73 7.51989 16.37 7.98989 16.91 8.07989L20.1 8.60989C22.14 8.94989 22.62 10.4299 21.15 11.8899L18.67 14.3699C18.25 14.7899 18.02 15.5999 18.15 16.1799L18.86 19.2499C19.42 21.6799 18.13 22.6199 15.98 21.3499L12.99 19.5799C12.45 19.2599 11.56 19.2599 11.01 19.5799L8.02003 21.3499C5.88003 22.6199 4.58003 21.6699 5.14003 19.2499L5.85003 16.1799C5.98003 15.5999 5.75003 14.7899 5.33003 14.3699L2.85003 11.8899C1.39003 10.4299 1.86003 8.94989 3.90003 8.60989L7.09003 8.07989C7.62003 7.98989 8.26003 7.51989 8.50003 7.02989L10.26 3.50989C11.22 1.59989 12.78 1.59989 13.73 3.50989Z"
                  stroke="#292D32"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
              <p>Tính năng nổi bật</p>
            </div>
            <div
              class="swiper-slide button__view-gallery swiper-slide-visible"
              style="margin-right: 10px"
            >
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14_2_1.jpg"
                width="58"
                height="58"
                alt="iPhone 14 128GB  | Chính hãng VN/A - 1"
                loading="lazy"
                title="iPhone 14 128GB  | Chính hãng VN/A"
              />
            </div>
            <div
              class="swiper-slide button__view-gallery swiper-slide-visible"
              style="margin-right: 10px"
            >
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_14_blue_pdp_image_position-1b_blue_color_vn.png"
                width="58"
                height="58"
                alt="iPhone 14 128GB  | Chính hãng VN/A - 2"
                loading="lazy"
                title="iPhone 14 128GB  | Chính hãng VN/A"
              />
            </div>
            <div
              class="swiper-slide button__view-gallery swiper-slide-visible"
              style="margin-right: 10px"
            >
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_14_blue_pdp_image_position-2_design_vn.png"
                width="58"
                height="58"
                alt="iPhone 14 128GB  | Chính hãng VN/A - 3"
                loading="lazy"
                title="iPhone 14 128GB  | Chính hãng VN/A"
              />
            </div>
            <div
              class="swiper-slide button__view-gallery swiper-slide-visible"
              style="margin-right: 10px"
            >
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_14_blue_pdp_image_position-3_camera_vn.png"
                width="58"
                height="58"
                alt="iPhone 14 128GB  | Chính hãng VN/A - 4"
                loading="lazy"
                title="iPhone 14 128GB  | Chính hãng VN/A"
              />
            </div>
            <div
              class="swiper-slide button__view-gallery swiper-slide-visible"
              style="margin-right: 10px"
            >
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_14_blue_pdp_image_position-4_lineup_vn.png"
                width="58"
                height="58"
                alt="iPhone 14 128GB  | Chính hãng VN/A - 5"
                loading="lazy"
                title="iPhone 14 128GB  | Chính hãng VN/A"
              />
            </div>
            <div
              class="swiper-slide button__view-gallery swiper-slide-visible"
              style="margin-right: 10px"
            >
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_14_blue_pdp_image_position-5_colors__vn.png"
                width="58"
                height="58"
                alt="iPhone 14 128GB  | Chính hãng VN/A - 6"
                loading="lazy"
                title="iPhone 14 128GB  | Chính hãng VN/A"
              />
            </div>
            <div
              class="swiper-slide button__view-gallery"
              style="margin-right: 10px"
            >
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_14_blue_pdp_image_position-6_size_comparison__vn.png"
                width="58"
                height="58"
                alt="iPhone 14 128GB  | Chính hãng VN/A - 7"
                loading="lazy"
                title="iPhone 14 128GB  | Chính hãng VN/A"
              />
            </div>
            <div
              class="swiper-slide button__view-gallery"
              style="margin-right: 10px"
            >
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_14_blue_pdp_image_position-7_features_specs__vn.png"
                width="58"
                height="58"
                alt="iPhone 14 128GB  | Chính hãng VN/A - 8"
                loading="lazy"
                title="iPhone 14 128GB  | Chính hãng VN/A"
              />
            </div>
            <div
              class="swiper-slide button__view-gallery"
              style="margin-right: 10px"
            >
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_14_blue_pdp_image_position-8_accessory_vn.png"
                width="58"
                height="58"
                alt="iPhone 14 128GB  | Chính hãng VN/A - 9"
                loading="lazy"
                title="iPhone 14 128GB  | Chính hãng VN/A"
              />
            </div>
            <div
              class="swiper-slide button__view-gallery"
              style="margin-right: 10px"
            >
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_14_blue_pdp_image_position-9_typec_lightning_cable_vn.png"
                width="58"
                height="58"
                alt="iPhone 14 128GB  | Chính hãng VN/A - 10"
                loading="lazy"
                title="iPhone 14 128GB  | Chính hãng VN/A"
              />
            </div>
          </div>
          <div
            class="swiper-button-next button-navigate-thumbnail__next"
            tabindex="0"
            role="button"
            aria-label="Next slide"
            aria-disabled="false"
          >
            <div class="icon">
              <svg
                height="15"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path
                  d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z"
                ></path>
              </svg>
            </div>
          </div>
          <div
            class="swiper-button-prev button-navigate-thumbnail__prev swiper-button-disabled"
            tabindex="0"
            role="button"
            aria-label="Previous slide"
            aria-disabled="false"
          >
            <div class="icon">
              <svg
                height="15"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path
                  d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z"
                ></path>
              </svg>
            </div>
          </div>
          <span
            class="swiper-notification"
            aria-live="assertive"
            aria-atomic="true"
          ></span>
        </div>
      </div>
    </div>
    <div class="mt-5">
      <div class="box-warranty-info">
        <div class="box-title">
          <p>Cam kết sản phẩm</p>
        </div>
        <div class="box-content warranty-info">
          <div
            class="swiper swiper-container swiper-pdp swiper-container-initialized swiper-container-horizontal swiper-container-multirow"
          >
            <div
              class="swiper-wrapper"
              style="width: 602px; transform: translate3d(0px, 0px, 0px)"
            >
              <div
                class="swiper-slide swiper-slide-active"
                style="
                  order: 0;
                  width: 291px;
                  height: 148px;
                  margin-right: 10px;
                "
              >
                <div class="item-warranty-info">
                  <div class="icon">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_2841_934)">
                        <path
                          d="M8.625 15.75H6C5.60218 15.75 5.22064 15.592 4.93934 15.3107C4.65804 15.0294 4.5 14.6478 4.5 14.25V3.75C4.5 3.35218 4.65804 2.97064 4.93934 2.68934C5.22064 2.40804 5.60218 2.25 6 2.25H12C12.3978 2.25 12.7794 2.40804 13.0607 2.68934C13.342 2.97064 13.5 3.35218 13.5 3.75V10.875M8.25 3H9.75M9 12.75V12.7575M11.25 14.25L12.75 15.75L15.75 12.75"
                          stroke="url(#paint0_linear_2841_934)"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </g>
                      <defs>
                        <linearGradient
                          id="paint0_linear_2841_934"
                          x1="10.125"
                          y1="2.25"
                          x2="10.125"
                          y2="15.75"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#FFF5F0"></stop>
                          <stop offset="0.67" stop-color="#F4C8D0"></stop>
                        </linearGradient>
                        <clipPath id="clip0_2841_934">
                          <rect width="18" height="18" fill="white"></rect>
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div class="box-wrapper">
                    <div class="description">
                      Máy mới 100% , chính hãng Apple Việt Nam.<br />CellphoneS
                      hiện là đại lý bán lẻ uỷ quyền iPhone chính hãng VN/A của
                      Apple Việt Nam
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="swiper-slide swiper-slide-next"
                style="
                  -webkit-box-ordinal-group: 1;
                  order: 1;
                  width: 291px;
                  height: 148px;
                  margin-right: 10px;
                "
              >
                <div class="item-warranty-info">
                  <div class="icon">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_2841_940)">
                        <path
                          d="M8.59506 15.6345C6.33703 14.9346 4.44505 13.3743 3.32797 11.2908C2.21089 9.20739 1.9584 6.76808 2.62506 4.5C4.96171 4.60692 7.24819 3.79993 9.00006 2.25C10.7519 3.79993 13.0384 4.60692 15.3751 4.5C15.8841 6.23183 15.8605 8.07671 15.3076 9.795M11.2501 14.25L12.7501 15.75L15.7501 12.75"
                          stroke="url(#paint0_linear_2841_940)"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </g>
                      <defs>
                        <linearGradient
                          id="paint0_linear_2841_940"
                          x1="9.00491"
                          y1="2.25"
                          x2="9.00491"
                          y2="15.75"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#FFF5F0"></stop>
                          <stop offset="0.67" stop-color="#F4C8D0"></stop>
                        </linearGradient>
                        <clipPath id="clip0_2841_940">
                          <rect width="18" height="18" fill="white"></rect>
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div class="box-wrapper">
                    <div class="description">
                      1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất.
                      Bảo hành 12 tháng tại trung tâm bảo hành chính hãng Apple:
                      CareS.vn<a
                        href="https://cellphones.com.vn/chinh-sach-bao-hanh"
                        target="_blank"
                      >
                        Xem chi tiết</a
                      >
                    </div>
                    <div class="description">
                      Xem thông tin kích hoạt bảo hành các sản phẩm Apple
                      <a
                        target="_blank"
                        href="https://cellphones.com.vn/kich-hoat-bao-hanh-sam-pham-apple"
                        >Chi tiết tại đây
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="swiper-slide"
                style="
                  -webkit-box-ordinal-group: 2;
                  order: 2;
                  margin-top: 10px;
                  width: 291px;
                  height: 148px;
                  margin-right: 10px;
                "
              >
                <div class="item-warranty-info">
                  <div class="icon">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.25 7.5H3.75M2.25 10.5H3.75M7.5 2.25V3.75M10.5 2.25V3.75M15.75 7.5H14.25M15.75 10.5H14.25M10.5 15.75V14.25M7.5 15.75V14.25M5.75 14.25H12.25C13.3546 14.25 14.25 13.3546 14.25 12.25V5.75C14.25 4.64543 13.3546 3.75 12.25 3.75H5.75C4.64543 3.75 3.75 4.64543 3.75 5.75V12.25C3.75 13.3546 4.64543 14.25 5.75 14.25ZM7.75 11.25H10.25C10.8023 11.25 11.25 10.8023 11.25 10.25V7.75C11.25 7.19772 10.8023 6.75 10.25 6.75H7.75C7.19772 6.75 6.75 7.19772 6.75 7.75V10.25C6.75 10.8023 7.19772 11.25 7.75 11.25Z"
                        stroke="url(#paint0_linear_2841_949)"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <defs>
                        <linearGradient
                          id="paint0_linear_2841_949"
                          x1="9"
                          y1="2.25"
                          x2="9"
                          y2="15.75"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#FFF5F0"></stop>
                          <stop offset="0.67" stop-color="#F4C8D0"></stop>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div class="description">
                    Hộp, Sách hướng dẫn, Cây lấy sim, Cáp Lightning - Type C
                  </div>
                </div>
              </div>
              <div
                class="swiper-slide"
                style="
                  -webkit-box-ordinal-group: 3;
                  order: 3;
                  margin-top: 10px;
                  width: 291px;
                  height: 148px;
                  margin-right: 10px;
                "
              >
                <div class="item-warranty-info">
                  <div class="icon">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_2841_954)">
                        <path
                          d="M13.5 14.25L14.694 13.056C15.3718 12.3781 15.7526 11.4587 15.7526 10.5C15.7526 9.54134 15.3718 8.62193 14.694 7.944L11.25 4.5M5.25 7.5H5.2425M2.25 6V9.129C2.25008 9.52679 2.40818 9.90826 2.6895 10.1895L6.972 14.472C7.31096 14.8109 7.77067 15.0013 8.25 15.0013C8.72933 15.0013 9.18904 14.8109 9.528 14.472L12.222 11.778C12.5609 11.439 12.7513 10.9793 12.7513 10.5C12.7513 10.0207 12.5609 9.56096 12.222 9.222L7.9395 4.9395C7.65826 4.65818 7.27679 4.50008 6.879 4.5H3.75C3.35218 4.5 2.97064 4.65804 2.68934 4.93934C2.40804 5.22064 2.25 5.60218 2.25 6Z"
                          stroke="url(#paint0_linear_2841_954)"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </g>
                      <defs>
                        <linearGradient
                          id="paint0_linear_2841_954"
                          x1="9.00131"
                          y1="4.5"
                          x2="9.00131"
                          y2="15.0013"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#FFF5F0"></stop>
                          <stop offset="0.67" stop-color="#F4C8D0"></stop>
                        </linearGradient>
                        <clipPath id="clip0_2841_954">
                          <rect width="18" height="18" fill="white"></rect>
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div class="description">
                    Giá sản phẩm <b>đã bao gồm thuế VAT</b>, có hỗ trợ
                    <a
                      href="https://cellphones.com.vn/vat-refund"
                      target="_blank"
                      >hoàn thuế VAT - Tax Refund</a
                    >
                    cho khách du lịch.
                  </div>
                </div>
              </div>
            </div>
            <div
              class="swiper-pagination swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-lock"
            >
              <span
                class="swiper-pagination-bullet swiper-pagination-bullet-active"
                tabindex="0"
                role="button"
                aria-label="Go to slide 1"
              ></span>
            </div>
            <div
              class="swiper-button-prev swiper-button-disabled swiper-button-lock"
              tabindex="0"
              role="button"
              aria-label="Previous slide"
              aria-disabled="false"
            >
              <div>
                <svg
                  height="15"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path
                    d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z"
                  ></path>
                </svg>
              </div>
            </div>
            <div
              class="swiper-button-next swiper-button-disabled swiper-button-lock"
              tabindex="0"
              role="button"
              aria-label="Next slide"
              aria-disabled="false"
            >
              <div>
                <svg
                  height="15"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path
                    d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z"
                  ></path>
                </svg>
              </div>
            </div>
            <span
              class="swiper-notification"
              aria-live="assertive"
              aria-atomic="true"
            ></span>
          </div>
          <div
            class="swiper swiper-container is-hidden swiper-container-initialized swiper-container-horizontal swiper-container-multirow"
          >
            <div class="swiper-wrapper" style="transition-duration: 0ms">
              <div class="swiper-slide" style="height: 148px"></div>
            </div>
            <div
              class="swiper-pagination swiper-pagination-clickable swiper-pagination-bullets"
            ></div>
            <span
              class="swiper-notification"
              aria-live="assertive"
              aria-atomic="true"
            ></span>
          </div>
        </div>
      </div>
    </div>
    <div
      id="thong-so-ky-thuat"
      promotion-pack="[object Object]"
      show-button-print="true"
      class="cps-block-technicalInfo"
    >
      <div
        class="box-title is-flex is-justify-content-space-between is-align-items-center"
      >
        <h2 class="title">Thông số kỹ thuật</h2>
        <button
          class="button button__show-modal-technical is-flex is-justify-content-center"
        >
          Xem tất cả
          <div class="icon-svg">
            <svg
              height="15"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path
                d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z"
              ></path>
            </svg>
          </div>
        </button>
      </div>
      <table class="technical-content">
        <tbody>
          <tr class="technical-content-item">
            <td>Kích thước màn hình</td>
            <td>
              <p>6.1 inches</p>
            </td>
          </tr>
          <tr class="technical-content-item">
            <td>Công nghệ màn hình</td>
            <td>
              <p>
                <a
                  href="https://cellphones.com.vn/sforum/man-hinh-oled"
                  target="_blank"
                  rel="nofollow"
                  >OLED</a
                >
              </p>
            </td>
          </tr>
          <tr class="technical-content-item">
            <td>Camera sau</td>
            <td>
              <p>
                Camera góc rộng: 12MP, ƒ/1.5<br />Camera góc siêu rộng: 12MP,
                ƒ/2.4
              </p>
            </td>
          </tr>
          <tr class="technical-content-item">
            <td>Camera trước</td>
            <td>
              <p>12MP, ƒ/1.9</p>
            </td>
          </tr>
          <tr class="technical-content-item">
            <td>Chipset</td>
            <td>
              <p>Apple A15 Bionic 6 nhân</p>
            </td>
          </tr>
          <tr class="technical-content-item">
            <td>Công nghệ NFC</td>
            <td>
              <p>Có</p>
            </td>
          </tr>
          <tr class="technical-content-item">
            <td>Dung lượng RAM</td>
            <td>
              <p>6 GB</p>
            </td>
          </tr>
          <tr class="technical-content-item">
            <td>Bộ nhớ trong</td>
            <td>
              <p>128 GB</p>
            </td>
          </tr>
          <tr class="technical-content-item">
            <td>Pin</td>
            <td>
              <p>3,279mAh</p>
            </td>
          </tr>
          <tr class="technical-content-item">
            <td>Thẻ SIM</td>
            <td>
              <p>2 SIM (nano‑SIM và eSIM)</p>
            </td>
          </tr>
          <tr class="technical-content-item">
            <td>Hệ điều hành</td>
            <td>
              <p>iOS 16</p>
            </td>
          </tr>
          <tr class="technical-content-item">
            <td>Độ phân giải màn hình</td>
            <td>
              <p>2532 x 1170 pixels</p>
            </td>
          </tr>
          <tr class="technical-content-item">
            <td>Tính năng màn hình</td>
            <td>
              <p>
                Tần số quét 60Hz, 1200 nits, Kính cường lực Ceramic Shield,
                Super Retina XDR
              </p>
            </td>
          </tr>
          <tr class="technical-content-item">
            <td>Loại CPU</td>
            <td>
              <p>3.22 GHz</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div id="boxFAQ">
      <h2 class="title">Câu hỏi thường gặp</h2>
      <div role="tablist" class="accordion">
        <div class="accordion-item">
          <div class="accordion-label button__show-faq" @click="toggleFaq(0)">
            <h6>
              Pin iPhone 14 có dung lượng bao nhiêu, dùng được trong bao lâu? Có
              hỗ trợ sạc nhanh không?
            </h6>
            <div class="icon" :class="{ active: openFaqIndex === 0 }">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                width="10"
                height="10"
              >
                <path
                  d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"
                ></path>
              </svg>
            </div>
          </div>
          <div
            class="accordion-content"
            :style="{ maxHeight: openFaqIndex === 0 ? '480px' : '0px' }"
          >
            <div>
              iPhone 14 có dung lượng 3.279 mAh với thời gian phát video tối đa
              20 giờ, đồng thời tích hợp công suất sạc nhanh 20W trở lên hỗ trợ
              rút ngắn thời gian sạc pin xuống còn 1 tiếng rưỡi.
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <div class="accordion-label button__show-faq" @click="toggleFaq(1)">
            <h6>iPhone 14 có mấy SIM? Bản eSim có dùng được ở Việt Nam?</h6>
            <div class="icon" :class="{ active: openFaqIndex === 1 }">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                width="10"
                height="10"
              >
                <path
                  d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"
                ></path>
              </svg>
            </div>
          </div>
          <div
            class="accordion-content"
            :style="{ maxHeight: openFaqIndex === 1 ? '480px' : '0px' }"
          >
            <div>
              iPhone 14 có 2 loại SIM cho người dùng lựa chọn bao gồm: SIM kép
              (1 SIM vật lý và 1 eSIM) và eSIM. Tuy nhiên, chỉ có mẫu máy iPhone
              14 tại Mỹ sẽ bị loại bỏ khe cắm SIM vật lý và chỉ sử dụng eSIM. Do
              đó iPhone 14 chính hãng tại Việt Nam vẫn còn khay sim vật lý và hỗ
              trợ eSIM.
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <div class="accordion-label button__show-faq" @click="toggleFaq(2)">
            <h6>
              Camera của iPhone 14 có cải tiến nổi bật nào so với iPhone 13?
            </h6>
            <div class="icon" :class="{ active: openFaqIndex === 2 }">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                width="10"
                height="10"
              >
                <path
                  d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"
                ></path>
              </svg>
            </div>
          </div>
          <div
            class="accordion-content"
            :style="{ maxHeight: openFaqIndex === 2 ? '480px' : '0px' }"
          >
            <div>
              Cả 2 model đều sở hữu 2 cảm biến 12MP, bao gồm 1 cảm biến góc rộng
              tiêu chuẩn và 1 cảm biến góc siêu rộng. Tuy nhiên, điểm nâng cấp
              tạo nên sự khác biệt ở camera của iPhone 14 là cảm biến camera
              chính có khẩu độ f/1.5 tăng khả năng chụp thiếu sáng thêm 49% so
              với iPhone 1, do đó đem lại khả năng chụp thiếu sáng tốt hơn.
              Ngoài ra, camera góc rộng cũng được tối ưu để phơi sáng nhanh và
              bắt nét hiệu quả hơn.
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <div class="accordion-label button__show-faq" @click="toggleFaq(3)">
            <h6>
              iPhone 14 có mấy màu? Màu đặc trưng của iPhone 14 2023 là màu nào?
            </h6>
            <div class="icon" :class="{ active: openFaqIndex === 3 }">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                width="10"
                height="10"
              >
                <path
                  d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"
                ></path>
              </svg>
            </div>
          </div>
          <div
            class="accordion-content"
            :style="{ maxHeight: openFaqIndex === 3 ? '480px' : '0px' }"
          >
            <div>
              iPhone 14 bao gồm 5 màu sắc trẻ trung và năng động phù hợp với
              nhiều lứa tuổi và đối tượng, cụ thể là Blue (xanh), Purple (tím),
              Midnight (đen), Starlight (trắng), Product (đỏ). Trong đó, hai màu
              hoàn toàn mới so với iPhone 13 là màu xanh và tím.&nbsp;
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="compare-apple-devices">
      <a
        href="/so-sanh-iphone"
        class="compare-apple-devices-btn text-decoration-none"
        target="_blank"
        rel="nofollow"
      >
        So sánh các phiên bản iPhone
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 4L10 8L6 12"
            stroke="#3B82F6"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path></svg
      ></a>
    </div>
    <div></div>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/grid";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

const rootEl = ref(null);
const openFaqIndex = ref(null);
const isVideoPlaying = ref(false);

let galleryTopSwiper = null;
let galleryThumbsSwiper = null;
let warrantySwiper = null;
let resetWishlistTimer = null;

const toggleFaq = (index) => {
  openFaqIndex.value = openFaqIndex.value === index ? null : index;
};

const playVideo = () => {
  isVideoPlaying.value = true;
};

const toggleWishlist = () => {
  const effectEl = rootEl.value?.querySelector("#wishListBtn .btn__effect");

  if (!effectEl) return;

  const isActive = effectEl.classList.contains("active");

  if (resetWishlistTimer) {
    clearTimeout(resetWishlistTimer);
    resetWishlistTimer = null;
  }

  effectEl.classList.remove("active", "inactive", "deactivate");

  if (!isActive) {
    effectEl.classList.add("active");
    return;
  }

  effectEl.classList.add("deactivate");

  resetWishlistTimer = window.setTimeout(() => {
    effectEl.classList.remove("deactivate");
    effectEl.classList.add("inactive");
    resetWishlistTimer = null;
  }, 700);
};

const initSwipers = async () => {
  if (!import.meta.client || !rootEl.value) return;

  const [{ default: Swiper }, modules] = await Promise.all([
    import("swiper"),
    import("swiper/modules"),
  ]);

  const { FreeMode, Grid, Navigation, Pagination, Thumbs } = modules;

  const galleryTopEl = rootEl.value.querySelector(".gallery-top");
  const galleryThumbsEl = rootEl.value.querySelector(".gallery-thumbs");

  if (galleryThumbsEl && galleryTopEl) {
    galleryThumbsSwiper = new Swiper(galleryThumbsEl, {
      modules: [FreeMode, Navigation],
      slidesPerView: "auto",
      spaceBetween: 10,
      freeMode: true,
      watchSlidesProgress: true,
      navigation: {
        nextEl: rootEl.value.querySelector(".button-navigate-thumbnail__next"),
        prevEl: rootEl.value.querySelector(".button-navigate-thumbnail__prev"),
      },
      observer: true,
      observeParents: true,
    });

    galleryTopSwiper = new Swiper(galleryTopEl, {
      modules: [Navigation, Thumbs],
      spaceBetween: 20,
      navigation: {
        nextEl: rootEl.value.querySelector(".button__view-gallery-next"),
        prevEl: rootEl.value.querySelector(".button__view-gallery-prev"),
      },
      thumbs: { swiper: galleryThumbsSwiper },
      observer: true,
      observeParents: true,
    });
  }

  const warrantyEl = rootEl.value.querySelector(".swiper-pdp");

  if (warrantyEl) {
    warrantySwiper = new Swiper(warrantyEl, {
      modules: [Grid, Navigation, Pagination],
      slidesPerView: 2,
      spaceBetween: 10,
      grid: {
        rows: 2,
        fill: "row",
      },
      navigation: {
        nextEl: warrantyEl.querySelector(".swiper-button-next"),
        prevEl: warrantyEl.querySelector(".swiper-button-prev"),
      },
      pagination: {
        el: warrantyEl.querySelector(".swiper-pagination"),
        clickable: true,
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
          grid: {
            rows: 1,
            fill: "row",
          },
        },
        769: {
          slidesPerView: 2,
          grid: {
            rows: 2,
            fill: "row",
          },
        },
      },
      observer: true,
      observeParents: true,
    });
  }
};

const destroySwipers = () => {
  [galleryTopSwiper, galleryThumbsSwiper, warrantySwiper].forEach(
    (instance) => {
      if (instance && !instance.destroyed) {
        instance.destroy(true, true);
      }
    },
  );

  galleryTopSwiper = null;
  galleryThumbsSwiper = null;
  warrantySwiper = null;
};

onMounted(async () => {
  await nextTick();
  await initSwipers();
});

onBeforeUnmount(() => {
  destroySwipers();

  if (resetWishlistTimer) {
    clearTimeout(resetWishlistTimer);
  }
});
</script>

<style scoped>
.column {
  display: block;
  flex-basis: 0;
  flex-grow: 1;
  flex-shrink: 1;
  padding: 0.75rem;
}

.is-flex {
  display: flex !important;
}

.is-hidden {
  display: none !important;
}

.is-flex-direction-row {
  flex-direction: row !important;
}

.is-justify-content-center {
  justify-content: center !important;
}

.is-justify-content-space-between {
  justify-content: space-between !important;
}

.is-align-items-center {
  align-items: center !important;
}

.mb-1 {
  margin-bottom: 0.25rem !important;
}

.mt-2 {
  margin-top: 0.5rem !important;
}

.mr-2 {
  margin-right: 0.5rem !important;
}

.mb-2 {
  margin-bottom: 0.5rem !important;
}

.mt-5 {
  margin-top: 1.5rem !important;
}

.box-detail-product__box-left {
  height: max-content;
  overflow-x: hidden;
  padding: 0;
  position: sticky;
  top: 88px;
}

.box-header {
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.box-header .box-product-name h1,
.box-header .box-product-name p {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #18181b;
  display: -webkit-box;
  font-size: 20px;
  font-weight: 700;
  line-clamp: 2;
  margin: 0 10px 0 0;
  overflow: hidden;
}

.box-header .box-rating {
  align-items: center;
  color: #18181b;
  cursor: pointer;
  display: inline-flex;
  font-size: 16px;
  font-weight: 600;
  gap: 3px;
}

.box-header .box-rating svg {
  fill: #ffd530;
  height: 18px;
  margin-bottom: 2px;
  width: 18px;
}

.box-header .box-rating .total-rating {
  color: #71717a;
  font-weight: 400;
}

.box-header__bottom {
  align-items: center;
  display: flex;
  gap: 20px;
  margin-top: 10px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-left: 2px;
}

.box-header__bottom .box-bottom-item,
.box-header__bottom .pdp-compare-button-box {
  fill: #3b82f6;
  align-items: center;
  cursor: pointer;
  display: flex;
  gap: 5px;
}

.box-header__bottom .box-bottom-item svg,
.box-header__bottom .pdp-compare-button-box svg {
  height: 24px;
  width: 24px;
}

.box-header__bottom .box-bottom-item a,
.box-header__bottom .pdp-compare-button-box a {
  color: #3b82f6;
}

.box-header__bottom .box-bottom-item .label,
.box-header__bottom .pdp-compare-button-box .label {
  color: #3b82f6;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.box-header__bottom .box-bottom-item:not(:last-child):after,
.box-header__bottom .pdp-compare-button-box:not(:last-child):after {
  color: #cfcfd3;
  content: "|";
  display: block;
  font-size: 10px;
  font-weight: 400;
  margin-left: 10px;
  margin-top: 2px;
  width: 1px;
}

.box-gallery {
  position: relative;
}

.swiper-container {
  overflow: hidden;
  position: relative;
}

.swiper-container .swiper-wrapper {
  display: flex;
}

.swiper-container .swiper-slide {
  flex-shrink: 0;
}

.mobile {
  display: none;
}

.compare-apple-devices {
  margin: 24px auto;
  text-align: center;
}

.compare-apple-devices-btn {
  align-items: center;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  color: #3b82f6;
  display: inline-flex;
  font-size: 14px;
  font-weight: 700;
  gap: 4px;
  justify-content: center;
  margin: auto;
  padding: 8px 16px;
}

.compare-apple-devices-btn svg {
  height: 24px;
  width: 24px;
}

.compare-apple-devices-btn:hover {
  background-color: #eff5ff;
}

.gallery-product-detail .gallery-slide {
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 15px;
  display: flex;
  height: 325px;
  justify-content: center;
  margin-bottom: 16px;
  width: 100%;
}

.gallery-product-detail .gallery-slide.swiper-container .swiper-wrapper {
  height: 100%;
}

.gallery-product-detail .gallery-slide.swiper-container .swiper-slide {
  align-items: center;
  background: #fff;
  display: flex;
  justify-content: center;
  overflow: hidden;
  text-align: center;
}

.gallery-product-detail
  .gallery-slide.swiper-container
  .swiper-slide.ksp-gallery {
  align-items: center;
  background: linear-gradient(90deg, #dd5e89, #f7bb97);
  border: 0;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  overflow: hidden;
  text-align: center;
  user-select: none;
}

.gallery-product-detail
  .gallery-slide.swiper-container
  .swiper-slide.ksp-gallery
  .ksp-video {
  display: block;
  height: 100%;
  position: relative;
  width: 100%;
}

.gallery-product-detail
  .gallery-slide.swiper-container
  .swiper-slide.ksp-gallery
  .ksp-video
  .icon {
  height: 60px;
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 70px;
}

.gallery-product-detail
  .gallery-slide.swiper-container
  .swiper-slide.ksp-gallery
  .ksp-video
  .icon
  svg {
  height: 100%;
}

.gallery-product-detail
  .gallery-slide.swiper-container
  .swiper-slide.ksp-gallery
  .ksp-video
  .video-thumbnail-wrapper {
  align-items: center;
  cursor: pointer;
  display: flex;
  height: 100%;
  justify-content: center;
  position: relative;
  width: 100%;
}

.gallery-product-detail
  .gallery-slide.swiper-container
  .swiper-slide.ksp-gallery
  .ksp-video
  .video-thumbnail-wrapper
  .video-thumbnail {
  display: block;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.gallery-product-detail
  .gallery-slide.swiper-container
  .swiper-slide.ksp-gallery
  .ksp-video
  .video-thumbnail-wrapper
  .youtube-play-button {
  left: 50%;
  pointer-events: none;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: transform 0.2s ease;
  z-index: 1;
}

.gallery-product-detail
  .gallery-slide.swiper-container
  .swiper-slide.ksp-gallery
  .ksp-video
  .video-thumbnail-wrapper
  .youtube-play-button:hover {
  transform: translate(-50%, -50%) scale(1.1);
}

.gallery-product-detail
  .gallery-slide.swiper-container
  .swiper-slide.ksp-gallery
  .ksp-video
  .video-thumbnail-wrapper
  .youtube-play-button
  svg {
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
  height: auto;
}

.gallery-product-detail
  .gallery-slide.swiper-container
  .swiper-slide.ksp-gallery
  .ksp-video
  .video-thumbnail-wrapper:hover
  .youtube-play-button {
  transform: translate(-50%, -50%) scale(1.1);
}

.gallery-product-detail
  .gallery-slide.swiper-container
  .swiper-slide.ksp-gallery
  .ksp-video
  iframe {
  height: 100%;
  width: 100%;
}

.gallery-product-detail
  .gallery-slide.swiper-container
  .swiper-slide.ksp-gallery
  .box-ksp {
  align-items: center;
  color: #fff;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  justify-content: flex-start;
  line-height: 1.45;
  overflow: hidden;
  padding: 10px;
  position: relative;
}

.gallery-product-detail
  .gallery-slide.swiper-container
  .swiper-slide.ksp-gallery
  .box-ksp
  .mobile {
  display: none;
}

.gallery-product-detail
  .gallery-slide.swiper-container
  .swiper-slide.ksp-gallery
  .box-ksp
  .title {
  bottom: 5px;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 5px;
  position: relative;
  text-transform: uppercase;
}

.gallery-product-detail
  .gallery-slide.swiper-container
  .swiper-slide.ksp-gallery
  .box-ksp
  > img {
  background: #fff;
  border-radius: 10px;
  height: 180px;
  padding: 10px;
  text-align: left;
  width: 180px;
}

.gallery-product-detail
  .gallery-slide.swiper-container
  .swiper-slide.ksp-gallery
  .box-ksp
  ul {
  -ms-overflow-style: none;
  max-height: 160px;
  overflow-y: auto;
  scrollbar-width: none;
}

.gallery-product-detail
  .gallery-slide.swiper-container
  .swiper-slide.ksp-gallery
  .box-ksp
  ul::-webkit-scrollbar {
  display: none;
  scrollbar-width: 5px;
}

.gallery-product-detail
  .gallery-slide.swiper-container
  .swiper-slide.ksp-gallery
  .box-ksp
  ul
  li {
  color: #fff;
  display: flex;
  font-size: 14px;
  line-height: 1.45;
  text-align: left;
}

.gallery-product-detail
  .gallery-slide.swiper-container
  .swiper-slide.ksp-gallery
  .box-ksp
  ul
  li:before {
  align-items: center;
  color: pink;
  content: "•";
  display: flex;
  font-size: 20px;
  height: 22px;
  margin-right: 5px;
  width: auto;
}

.gallery-product-detail
  .gallery-slide.swiper-container
  .swiper-slide.ksp-gallery
  .box-ksp
  ul
  li:not(:last-child) {
  margin-bottom: 5px;
}

.gallery-product-detail
  .gallery-slide.swiper-container
  .swiper-slide.ksp-gallery
  .box-ksp
  ul:last-child {
  list-style: inherit;
}

.gallery-product-detail
  .gallery-slide.swiper-container
  .swiper-slide.ksp-gallery
  .box-ksp
  ul:last-child
  img {
  display: none !important;
}

.gallery-product-detail .gallery-slide.swiper-container .swiper-button-prev {
  border-radius: 0 100px 100px 0;
  left: 0;
  padding-left: 0;
}

.gallery-product-detail .gallery-slide.swiper-container .swiper-button-next {
  border-radius: 100px 0 0 100px;
  padding-right: 0;
  right: 0;
}

.gallery-product-detail .gallery-slide.swiper-container .swiper-button-next,
.gallery-product-detail .gallery-slide.swiper-container .swiper-button-prev {
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  font-size: 1.8rem;
  height: 60px;
  justify-content: center;
  opacity: 0;
  outline: none;
  top: 50%;
  transition: 0.3s;
  width: 30px;
}

.gallery-product-detail
  .gallery-slide.swiper-container
  .swiper-button-next
  .icon,
.gallery-product-detail
  .gallery-slide.swiper-container
  .swiper-button-prev
  .icon {
  color: #fff;
}

.gallery-product-detail
  .gallery-slide.swiper-container
  .swiper-button-next.swiper-button-disabled,
.gallery-product-detail
  .gallery-slide.swiper-container
  .swiper-button-next:after,
.gallery-product-detail
  .gallery-slide.swiper-container
  .swiper-button-prev.swiper-button-disabled,
.gallery-product-detail
  .gallery-slide.swiper-container
  .swiper-button-prev:after {
  display: none;
}

.gallery-product-detail .gallery-slide:hover .swiper-button-next,
.gallery-product-detail .gallery-slide:hover .swiper-button-prev {
  opacity: 1;
}

.gallery-product-detail .thumbnail-slide.swiper-container {
  width: 100%;
}

.gallery-product-detail .thumbnail-slide.swiper-container .swiper-wrapper {
  padding: 1px;
}

.gallery-product-detail .thumbnail-slide.swiper-container .swiper-wrapper img {
  height: 100%;
  width: 100%;
}

.gallery-product-detail
  .thumbnail-slide.swiper-container
  .swiper-wrapper
  .swiper-slide {
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 0 0 1px #d1d5db;
  cursor: pointer;
  height: 64px;
  overflow: hidden;
  width: 64px;
}

.gallery-product-detail
  .thumbnail-slide.swiper-container
  .swiper-wrapper
  .swiper-slide.ksp-thumbs {
  align-items: center;
  display: flex;
  flex-flow: column;
  justify-content: center;
}

.gallery-product-detail
  .thumbnail-slide.swiper-container
  .swiper-wrapper
  .swiper-slide.ksp-thumbs
  svg {
  height: 25px;
  margin-top: 3px;
}

.gallery-product-detail
  .thumbnail-slide.swiper-container
  .swiper-wrapper
  .swiper-slide.ksp-thumbs
  p {
  color: #666;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  margin: 0;
  text-align: center;
}

.gallery-product-detail
  .thumbnail-slide.swiper-container
  .swiper-wrapper
  .swiper-slide.swiper-slide-thumb-active {
  box-shadow: 0 0 0 1px #d70018;
}

.gallery-product-detail .thumbnail-slide.swiper-container .swiper-button-next {
  background: linear-gradient(270deg, #fff, hsla(0, 0%, 100%, 0));
  right: 0;
}

.gallery-product-detail .thumbnail-slide.swiper-container .swiper-button-prev {
  background: linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0));
  left: 0;
}

.gallery-product-detail .thumbnail-slide.swiper-container .swiper-button-next,
.gallery-product-detail .thumbnail-slide.swiper-container .swiper-button-prev {
  backdrop-filter: blur(1px);
  height: calc(100% - 2px);
  margin-top: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 52px;
}

.gallery-product-detail
  .thumbnail-slide.swiper-container
  .swiper-button-next
  .icon,
.gallery-product-detail
  .thumbnail-slide.swiper-container
  .swiper-button-prev
  .icon {
  backdrop-filter: blur(0);
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
  height: 24px;
  padding: 5px;
  width: 24px;
}

.gallery-product-detail
  .thumbnail-slide.swiper-container
  .swiper-button-next.swiper-button-disabled,
.gallery-product-detail
  .thumbnail-slide.swiper-container
  .swiper-button-next:after,
.gallery-product-detail
  .thumbnail-slide.swiper-container
  .swiper-button-prev.swiper-button-disabled,
.gallery-product-detail
  .thumbnail-slide.swiper-container
  .swiper-button-prev:after {
  display: none;
}

.gallery-product-detail
  .thumbnail-slide.swiper-container
  .swiper-button-next:hover
  .icon,
.gallery-product-detail
  .thumbnail-slide.swiper-container
  .swiper-button-prev:hover
  .icon {
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.6);
}

.box-warranty-info {
  background: #fff;
  width: 100%;
}

.box-warranty-info .box-title p {
  color: #18181b;
  font-size: 16px;
  font-weight: 700;
  margin: 10px 0;
}

.box-warranty-info .box-content.warranty-info {
  font-size: 12px;
}

.box-warranty-info .box-content.warranty-info .icon {
  background: linear-gradient(231deg, #ed8a95 -68.73%, #c40016 91.14%);
  border-radius: 4px;
  height: 24px;
  margin-bottom: 10px;
  width: 24px;
}

.box-warranty-info .box-content.warranty-info .icon svg {
  height: 18px;
  width: 18px;
}

.box-warranty-info .box-content.warranty-info .description a {
  color: #3b82f6;
  font-weight: 700;
}

.box-warranty-info .box-content.warranty-info .item-warranty-info {
  background: #f7f7f8;
  border-radius: 16px;
  gap: 8px;
  height: calc(100% - 24px);
  padding: 12px;
}

.swiper-container.swiper-pdp:has(.swiper-pagination):has(
    .swiper-pagination > .swiper-pagination-bullet:nth-child(n + 2)
  ) {
  padding-bottom: 20px;
}

.swiper-container.swiper-pdp:has(.swiper-pagination):has(
    .swiper-pagination > .swiper-pagination-bullet:nth-child(n + 2)
  )
  .swiper-button-next,
.swiper-container.swiper-pdp:has(.swiper-pagination):has(
    .swiper-pagination > .swiper-pagination-bullet:nth-child(n + 2)
  )
  .swiper-button-prev {
  transform: translateY(calc(-50% - 10px));
}

.swiper-container.swiper-pdp .swiper-button-prev {
  left: -1px;
}

.swiper-container.swiper-pdp .swiper-button-next {
  right: -1px;
}

.swiper-container.swiper-pdp .swiper-button-next,
.swiper-container.swiper-pdp .swiper-button-prev {
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  height: 24px;
  margin-top: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
}

.swiper-container.swiper-pdp .swiper-button-next.swiper-button-disabled,
.swiper-container.swiper-pdp .swiper-button-next:after,
.swiper-container.swiper-pdp .swiper-button-prev.swiper-button-disabled,
.swiper-container.swiper-pdp .swiper-button-prev:after {
  display: none;
}

.swiper-container.swiper-pdp .swiper-pagination {
  bottom: 10px;
  display: flex;
  gap: 2px;
  justify-content: center;
}

.swiper-container.swiper-pdp
  .swiper-pagination
  .swiper-pagination-bullet.swiper-pagination-bullet-active:only-child {
  display: none;
}

.swiper-container.swiper-pdp .swiper-pagination .swiper-pagination-bullet {
  background: #e4e4e7;
  border-radius: 4px;
  height: 2px;
  margin: 0;
  opacity: 1;
  transition: all 0.3s ease-in-out;
  width: 8px;
}

.swiper-container.swiper-pdp
  .swiper-pagination
  .swiper-pagination-bullet.swiper-pagination-bullet-active {
  background: #d70018;
  width: 16px;
}

.cps-block-technicalInfo {
  border-radius: 10px;
}

.cps-block-technicalInfo .box-title {
  margin: 16px auto;
}

.cps-block-technicalInfo .box-title .title {
  font-size: 20px;
  margin-bottom: 0;
}

.cps-block-technicalInfo .technical-content {
  border: 1px solid #e5e7eb;
  border-collapse: separate;
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
}

.cps-block-technicalInfo .technical-content .technical-content-item {
  border-bottom: 1px solid #e4e4e7;
  font-size: 14px;
  width: 100%;
}

.cps-block-technicalInfo
  .technical-content
  .technical-content-item:not(:last-child)
  td {
  border-bottom: 1px solid #e4e4e7;
}

.cps-block-technicalInfo .technical-content .technical-content-item td {
  height: 100%;
  padding: 8px 16px;
  vertical-align: middle;
}

.cps-block-technicalInfo
  .technical-content
  .technical-content-item
  td:first-child {
  background-color: #f2f2f2;
  border-right: 1px solid #e4e4e7;
  width: 30%;
}

.cps-block-technicalInfo
  .technical-content
  .technical-content-item
  td:nth-child(2) {
  width: 70%;
}

.cps-block-technicalInfo .technical-content .technical-content-item a {
  color: #3b82f6;
}

.cps-block-technicalInfo .technical-content .technical-content-item a:hover {
  opacity: 0.8;
}

.cps-block-technicalInfo .button {
  border-radius: 10px;
  font-size: 14px;
  gap: 5px;
  height: 35px;
}

.cps-block-technicalInfo .button__show-modal-technical {
  align-items: center;
  border: none;
  box-shadow: none !important;
  color: #3b82f6;
  display: flex;
  font-size: 12px;
  font-weight: 500;
}

.cps-block-technicalInfo .button__show-modal-technical .icon-svg {
  align-items: center;
  display: flex;
}

.cps-block-technicalInfo .button__show-modal-technical .icon-svg svg {
  fill: #3b82f6;
}

#boxFAQ {
  margin: 24px auto;
}

#boxFAQ .title {
  color: #1d1d20;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
}

#boxFAQ .accordion {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

#boxFAQ .accordion .accordion-item {
  background-color: #f7f7f8;
  border-radius: 8px;
  cursor: pointer;
  padding: 8px 16px;
  transition: 0.3s;
}

#boxFAQ .accordion .accordion-item:hover {
  background-color: #eaeaea;
}

#boxFAQ .accordion .accordion-item .accordion-label {
  align-items: center;
  color: #1d1d20;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  padding: 10px 0;
}

#boxFAQ .accordion .accordion-item .accordion-label h3,
#boxFAQ .accordion .accordion-item .accordion-label p {
  font-weight: 600;
  margin: 0;
}

#boxFAQ .accordion .accordion-item .accordion-label .icon {
  transition: transform 0.2s ease;
}

#boxFAQ .accordion .accordion-item .accordion-label .icon.active {
  transform: rotate(180deg);
}

#boxFAQ .accordion .accordion-item .accordion-content {
  font-size: 12px;
  overflow: hidden;
  text-align: justify;
  transition: all 0.2s ease;
}

#boxFAQ .accordion .accordion-item .accordion-content p {
  margin-bottom: 10px;
}

#boxFAQ .accordion .accordion-item .accordion-content ul {
  margin-bottom: 10px;
  padding-left: 40px;
}

#boxFAQ .accordion .accordion-item .accordion-content ul li {
  list-style: disc;
}

#wishListBtn {
  align-items: center;
  background-color: transparent;
  border: none;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  padding: 0;
}

#wishListBtn:hover .btn__effect:not(.active) .heart-stroke {
  animation: pulseCps 1s ease-out infinite;
}

#wishListBtn .icon-svg--color-silver {
  color: #fff;
  fill: #fff;
}

#wishListBtn .icon-svg--color-cps {
  color: #3b82f6;
  fill: #3b82f6;
}

#wishListBtn .icon-svg {
  display: inline-block;
  height: 20px;
  vertical-align: middle;
  width: 20px;
}

#wishListBtn .heart-full {
  opacity: 0;
}

#wishListBtn .heart-border,
#wishListBtn .heart-full {
  left: 50%;
  position: absolute;
  top: 0;
  transform: translateX(-50%);
}

#wishListBtn .heart-border {
  height: 22px;
  width: 20px;
}

#wishListBtn .btn__effect {
  align-items: center;
  background-color: transparent;
  border: 0;
  display: flex;
  height: 20px;
  justify-content: center;
  padding: 0;
  position: relative;
  width: 20px;
}

#wishListBtn .btn__effect:hover {
  cursor: pointer;
}

#wishListBtn .effect-group {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  transform: rotate(25deg);
  width: 100%;
}

#wishListBtn .effect-group .effect {
  display: block;
  left: 50%;
  position: absolute;
  top: 38%;
  transform-origin: 0 2px;
  width: 20px;
}

#wishListBtn .effect-group .effect:nth-child(2) {
  transform: rotate(72deg);
}

#wishListBtn .effect-group .effect:nth-child(3) {
  transform: rotate(144deg);
}

#wishListBtn .effect-group .effect:nth-child(4) {
  transform: rotate(216deg);
}

#wishListBtn .effect-group .effect:nth-child(5) {
  transform: rotate(288deg);
}

#wishListBtn .effect-group .effect:before {
  background: #3b82f6;
  border-radius: 1.5px;
  content: "";
  display: block;
  height: 3px;
  position: absolute;
  right: 0;
}

#wishListBtn .effect-group .effect:after {
  background: #f60;
  border-radius: 50%;
  content: "";
  display: block;
  height: 3px;
  position: absolute;
  right: 10%;
  top: 10px;
  transform: scale(0);
  width: 3px;
}

#wishListBtn .active .heart-stroke {
  opacity: 0;
}

#wishListBtn .active .heart-full {
  opacity: 1;
}

#wishListBtn .active .heart-border {
  color: #fff;
  fill: #fff;
}

#wishListBtn .active .icon-svg {
  animation: bounceIn 0.5s linear;
}

#wishListBtn .active .effect:before {
  animation: fireworkLine 0.5s linear 0.1s;
}

#wishListBtn .active .effect:after {
  animation: fireworkPoint 0.5s linear 0.1s;
}

#wishListBtn .broken-heart {
  left: 4px;
  opacity: 0;
  position: absolute;
  top: 5px;
  transform: scale(1.3);
}

#wishListBtn .broken-heart--left {
  transform: rotate(0deg);
  transform-origin: 60% 200%;
}

#wishListBtn .broken-heart--right {
  transform: rotate(0deg);
  transform-origin: 63% 200%;
}

#wishListBtn .broken-heart--crack {
  stroke-dasharray: 15;
  stroke-dashoffset: 15;
}

#wishListBtn .deactivate .broken-heart {
  opacity: 1;
}

#wishListBtn .deactivate .broken-heart--left {
  animation:
    crackLeft 0.35s cubic-bezier(0.68, -0.55, 0.265, 2.85) 0.15s forwards,
    hide 0.25s ease-in 0.55s forwards;
}

#wishListBtn .deactivate .broken-heart--right {
  animation:
    crackRight 0.35s cubic-bezier(0.68, -0.55, 0.265, 2.85) 0.15s forwards,
    hide 0.25s ease-in 0.55s forwards;
}

#wishListBtn .deactivate .broken-heart--crack {
  animation: crack 0.2s ease-in forwards;
}

.box-header__bottom #wishListBtn .icon-svg--color-cps {
  color: inherit;
  fill: inherit;
}

.box-header__bottom #wishListBtn .broken-heart {
  left: 4px;
}

@keyframes pulseCps {
  0% {
    fill: #fff;
    transform: scale(0.8);
    transform-origin: center center;
  }

  50% {
    fill: #3b82f6;
    transform: scale(1.1);
  }

  to {
    fill: #fff;
    transform: scale(0.8);
  }
}

@keyframes fireworkLine {
  0% {
    right: 20%;
    transform: scale(0);
  }

  25% {
    right: 20%;
    transform: scale(1);
    width: 6px;
  }

  35% {
    right: 0;
    width: 35%;
  }

  70% {
    right: 0;
    transform: scale(1);
    width: 4px;
  }

  to {
    right: 0;
    transform: scale(0);
  }
}

@keyframes fireworkPoint {
  30% {
    transform: scale(0);
  }

  60% {
    transform: scale(1);
  }

  to {
    transform: scale(0);
  }
}

@keyframes bounceIn {
  0% {
    transform: scale(0);
  }

  30% {
    transform: scale(1.25);
  }

  50% {
    transform: scale(0.9);
  }

  70% {
    transform: scale(1.1);
  }

  80% {
    transform: scale(1);
  }
}

@keyframes crackLeft {
  0% {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(-45deg);
  }
}

@keyframes crackRight {
  0% {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(45deg);
  }
}

@keyframes crack {
  0% {
    stroke-dasharray: 15;
    stroke-dashoffset: 15;
  }

  80% {
    opacity: 1;
    stroke-dasharray: 15;
    stroke-dashoffset: 0;
  }

  to {
    opacity: 0;
  }
}

@keyframes hide {
  0% {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

@media only screen and (min-width: 991px) and (max-width: 1199px) {
  .box-header {
    margin-top: 0;
  }

  .box-header__bottom {
    gap: 8px;
  }

  .box-header__bottom .box-bottom-item svg,
  .box-header__bottom .pdp-compare-button-box svg {
    height: 22px;
    width: 22px;
  }

  .box-header__bottom .box-bottom-item .label,
  .box-header__bottom .pdp-compare-button-box .label {
    font-size: 13px;
    white-space: nowrap;
  }
}

@media only screen and (min-width: 769px) and (max-width: 990px) {
  .box-header {
    margin-top: 0;
  }

  .box-header__bottom {
    gap: 8px;
  }

  .box-header__bottom .box-bottom-item svg,
  .box-header__bottom .pdp-compare-button-box svg {
    height: 22px;
    width: 22px;
  }

  .box-header__bottom .box-bottom-item .label,
  .box-header__bottom .pdp-compare-button-box .label {
    font-size: 13px;
    white-space: nowrap;
  }

  .box-detail-product__box-left {
    width: 50%;
  }
}

@media only screen and (min-width: 541px) and (max-width: 768px) {
  .mobile {
    display: block;
  }

  .box-header {
    flex-direction: column;
    margin: 10px 0;
  }

  .box-header .box-rating {
    font-size: 12px;
    margin: 10px 0 0;
  }

  .box-header .box-rating svg {
    color: #ffd530;
  }

  .box-header__bottom {
    gap: 8px;
  }

  .box-header__bottom .box-bottom-item svg,
  .box-header__bottom .pdp-compare-button-box svg {
    height: 22px;
    width: 22px;
  }

  .box-header__bottom .box-bottom-item .label,
  .box-header__bottom .pdp-compare-button-box .label {
    font-size: 13px;
    white-space: nowrap;
  }

  .box-header .box-product-name h1 {
    font-size: 16px;
    line-height: 1.5;
  }

  .box-header-desktop {
    display: none !important;
  }

  .box-gallery .desktop {
    display: none;
  }

  .box-detail-product__box-left {
    position: relative;
    top: 10px !important;
  }
}

@media only screen and (max-width: 540px) {
  .mobile {
    display: block;
  }

  .box-header {
    flex-direction: column;
    margin: 10px 0;
  }

  .box-header .box-product-name h1 {
    font-size: 16px;
    line-height: 1.5;
  }

  .box-header .box-rating {
    font-size: 12px;
  }

  .box-header .box-rating svg {
    height: 18px;
    width: 18px;
  }

  .box-header__bottom {
    gap: 10px;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .box-header__bottom .box-bottom-item svg,
  .box-header__bottom .pdp-compare-button-box svg {
    height: 16px;
    width: 16px;
  }

  .box-header__bottom .box-bottom-item .label,
  .box-header__bottom .pdp-compare-button-box .label {
    font-size: 10px;
    white-space: nowrap;
  }

  .box-header-desktop {
    display: none !important;
  }

  .box-gallery .desktop {
    display: none;
  }

  .box-detail-product__box-left {
    position: relative;
    top: 10px !important;
  }

  #wishListBtn .text-wishlist {
    display: none;
  }
}

@media only screen and (min-width: 541px) and (max-width: 1199px) {
  .box-header__bottom #wishListBtn {
    height: 17px;
    width: 17px;
  }

  .box-header__bottom #wishListBtn .icon-svg {
    height: 17px;
    margin-top: 1px;
    width: 17px;
  }

  .box-header__bottom #wishListBtn .heart-border {
    height: 17px;
    width: 17px;
  }
}

@media only screen and (max-width: 540px) {
  .box-header__bottom #wishListBtn {
    height: 13px;
    width: 13px;
  }

  .box-header__bottom #wishListBtn .icon-svg {
    height: 13px;
    margin-top: 2px;
    width: 13px;
  }

  .box-header__bottom #wishListBtn .heart-border {
    height: 13px;
    width: 13px;
  }
}

@media screen and (max-width: 1199px) {
  .gallery-product-detail .gallery-slide {
    margin-bottom: 16px;
  }

  .gallery-product-detail
    .gallery-slide.swiper-container
    .swiper-slide.ksp-gallery {
    padding: 0;
  }

  .gallery-product-detail
    .gallery-slide.swiper-container
    .swiper-slide.ksp-gallery
    .ksp-video
    .video-thumbnail-wrapper
    .video-thumbnail,
  .gallery-product-detail
    .gallery-slide.swiper-container
    .swiper-slide.ksp-gallery
    .ksp-video
    iframe {
    height: 325px;
  }

  .gallery-product-detail
    .gallery-slide.swiper-container
    .swiper-slide.ksp-gallery
    .box-ksp
    > img {
    height: 200px;
    width: 200px;
  }

  .gallery-product-detail
    .gallery-slide.swiper-container
    .swiper-slide.ksp-gallery
    .box-ksp
    ul
    li {
    font-size: 13px;
  }
}

@media screen and (max-width: 990px) {
  .gallery-product-detail .gallery-slide {
    margin-bottom: 14px;
  }

  .gallery-product-detail .gallery-slide.swiper-container {
    height: 340px;
    padding: 0;
  }

  .gallery-product-detail .gallery-slide.swiper-container .swiper-slide img {
    width: 80%;
  }

  .gallery-product-detail
    .gallery-slide.swiper-container
    .swiper-slide.ksp-gallery
    .ksp-video
    .video-thumbnail-wrapper
    .video-thumbnail,
  .gallery-product-detail
    .gallery-slide.swiper-container
    .swiper-slide.ksp-gallery
    .ksp-video
    iframe {
    height: 340px;
  }

  .gallery-product-detail
    .gallery-slide.swiper-container
    .swiper-slide.ksp-gallery
    .box-ksp
    .title {
    font-size: 12px;
  }

  .gallery-product-detail
    .gallery-slide.swiper-container
    .swiper-slide.ksp-gallery
    .box-ksp
    > img {
    height: 90px;
  }

  .gallery-product-detail
    .gallery-slide.swiper-container
    .swiper-slide.ksp-gallery
    .box-ksp
    ul {
    height: auto;
  }

  .gallery-product-detail
    .gallery-slide.swiper-container
    .swiper-slide.ksp-gallery
    .box-ksp
    ul
    li {
    font-size: 11px;
  }
}

@media screen and (max-width: 768px) {
  .gallery-product-detail .gallery-slide {
    height: fit-content;
    margin-bottom: 12px;
  }

  .gallery-product-detail .gallery-slide.swiper-container {
    height: 340px;
    padding: 0;
  }

  .gallery-product-detail .gallery-slide.swiper-container .swiper-slide img {
    width: 40%;
  }

  .gallery-product-detail
    .gallery-slide.swiper-container
    .swiper-slide.ksp-gallery
    .box-ksp {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    overflow: hidden;
    padding: 10px;
  }

  .gallery-product-detail
    .gallery-slide.swiper-container
    .swiper-slide.ksp-gallery
    .box-ksp
    .title {
    font-size: 20px;
    margin-top: 10px;
  }

  .gallery-product-detail
    .gallery-slide.swiper-container
    .swiper-slide.ksp-gallery
    .box-ksp
    .mobile {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: calc(100% - 100px);
  }

  .gallery-product-detail
    .gallery-slide.swiper-container
    .swiper-slide.ksp-gallery
    .box-ksp
    .desktop {
    display: none;
  }

  .gallery-product-detail
    .gallery-slide.swiper-container
    .swiper-slide.ksp-gallery
    .box-ksp
    > img {
    height: 140px;
    width: 140px;
  }

  .gallery-product-detail
    .gallery-slide.swiper-container
    .swiper-slide.ksp-gallery
    .box-ksp
    ul {
    margin-left: 5px;
    position: relative;
    top: 10px;
  }

  .gallery-product-detail
    .gallery-slide.swiper-container
    .swiper-slide.ksp-gallery
    .box-ksp
    ul
    li {
    font-size: 14px;
  }

  .box-warranty-info .box-content.warranty-info .item-warranty-info {
    align-items: flex-start;
    border-radius: 8px;
    display: flex;
    gap: 8px;
    height: calc(100% - 16px);
    padding: 8px;
  }

  .box-warranty-info .box-content.warranty-info .item-warranty-info .icon {
    height: 24px;
    min-width: 24px;
    width: 24px;
  }

  .box-warranty-info .box-title p {
    font-size: 16px;
  }

  #boxFAQ {
    margin: 12px auto;
  }

  #boxFAQ .title {
    font-size: 16px;
  }
}

@media screen and (max-width: 540px) {
  .gallery-product-detail .gallery-slide {
    margin-bottom: 10px;
    max-height: 220px;
    width: 100%;
  }

  .gallery-product-detail .gallery-slide.swiper-container .swiper-slide img {
    width: 50%;
  }

  .gallery-product-detail
    .gallery-slide.swiper-container
    .swiper-slide.ksp-gallery
    .box-ksp.ksp-video {
    height: 100%;
    width: 100%;
  }

  .gallery-product-detail
    .gallery-slide.swiper-container
    .swiper-slide.ksp-gallery
    .box-ksp.ksp-video
    .video-thumbnail-wrapper
    .video-thumbnail,
  .gallery-product-detail
    .gallery-slide.swiper-container
    .swiper-slide.ksp-gallery
    .box-ksp.ksp-video
    iframe {
    height: 220px;
  }

  .gallery-product-detail
    .gallery-slide.swiper-container
    .swiper-slide.ksp-gallery
    .box-ksp
    .icon {
    left: 43%;
  }

  .gallery-product-detail
    .gallery-slide.swiper-container
    .swiper-slide.ksp-gallery
    .box-ksp
    .title {
    font-size: 16px;
    margin-bottom: 0;
    position: relative;
    text-align: left;
  }

  .gallery-product-detail
    .gallery-slide.swiper-container
    .swiper-slide.ksp-gallery
    .box-ksp
    > img {
    height: 80px;
    width: 80px;
  }

  .gallery-product-detail
    .gallery-slide.swiper-container
    .swiper-slide.ksp-gallery
    .box-ksp
    ul
    li {
    font-size: 12px;
  }

  .gallery-product-detail .gallery-slide.swiper-container .swiper-button-next,
  .gallery-product-detail .gallery-slide.swiper-container .swiper-button-prev {
    font-size: 1.2rem;
    height: 50px;
    width: 25px;
  }

  .gallery-product-detail
    .thumbnail-slide.swiper-container
    .swiper-wrapper
    .swiper-slide.ksp-thumbs
    p {
    font-size: 8px;
    font-weight: 600;
  }
}
</style>
