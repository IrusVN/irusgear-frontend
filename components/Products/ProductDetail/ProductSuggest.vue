<template>
  <div class="product-suggest">
    <section id="comboBlock" class="combo-block">
      <div class="combov2 my-3">
        <div class="combov2__wrapper list-option">
          <div class="list-option__head">
            <div class="option__title">
              <div class="icon-fire">
                <img
                  src="https://cdn2.cellphones.com.vn/x/media/wysiwyg/fire-icon-2025.gif"
                  alt="Lửa bập bùng"
                />
              </div>
              <span>Mua kèm giá sốc</span>
            </div>
            <div class="option__action">
              <button type="button">
                Xem tất cả
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 4L10 8L6 12"
                    stroke="#3B82F6"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="list-option__body">
            <div
              v-for="item in comboDeals"
              :key="item.title"
              class="list-option__item"
            >
              <div class="item-wrapper">
                <div class="image">
                  <img :src="item.image" :alt="item.title" />
                </div>
                <div class="info">
                  <a
                    v-if="item.link"
                    :href="item.link"
                    target="_blank"
                    class="info__name"
                  >
                    {{ item.title }}
                  </a>
                  <p v-else class="info__name">
                    {{ item.title }}
                  </p>

                  <div class="upsell-item-action">
                    <div v-if="item.price" class="block-box-price">
                      <div class="box-info__box-price">
                        <p class="product__price--show">{{ item.price }}</p>
                        <p v-if="item.oldPrice" class="product__price--through">
                          {{ item.oldPrice }}
                        </p>
                      </div>
                    </div>

                    <p v-else class="info__percent">{{ item.badge }}</p>

                    <button type="button" class="button">
                      <span>Chọn thêm</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M8 3.33325V12.6666"
                          stroke="#3B82F6"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M3.3335 8H12.6668"
                          stroke="#3B82F6"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="boxUpsell" class="my-3">
      <p class="upsell-title">Phụ kiện mua cùng</p>
      <div class="upsell-block-product">
        <div class="upsell-grid">
          <article
            v-for="item in accessoryDeals"
            :key="item.title"
            class="upsell-item"
          >
            <div class="upsell-item-wrapper">
              <img
                :src="item.image"
                :alt="item.title"
                class="upsell-item-image"
              />
              <div class="upsell-item-info">
                <div class="upsell-item-text">
                  <a :href="item.link" target="_blank">
                    <p class="upsell-item-name">{{ item.title }}</p>
                  </a>
                  <p class="upsell-item-member">
                    Smember giảm thêm đến
                    <span>{{ item.memberDiscount }}</span>
                  </p>
                </div>

                <div class="upsell-item-action">
                  <div class="block-box-price">
                    <div class="box-info__box-price">
                      <p class="product__price--show">{{ item.price }}</p>
                      <p class="product__price--through">{{ item.oldPrice }}</p>
                    </div>
                  </div>

                  <button type="button" class="button button-add-cart">
                    <span>Thêm vào giỏ</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 3.33325V12.6666"
                        stroke="#D70018"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M3.3335 8H12.6668"
                        stroke="#D70018"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const comboDeals = [
  {
    title: "Sạc nhanh Belkin 20W 1 cổng USB-C PD/PPS Cubic Wall Charger",
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:90/plain/https://cellphones.com.vn/media/catalog/product/f/r/frame_522_17_.png",
    price: "200.000đ",
    oldPrice: "390.000đ",
    link: "https://cellphones.com.vn/cu-sac-nhanh-belkin-20w-1-cong-usb-c-pd-pps-cubic-wall-charger.html",
  },
  {
    title: "Mua kèm sim giảm thêm 50K",
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:90/plain/https://cellphones.com.vn/media/wysiwyg/Text_ng_n_-_2024-11-19T091535.894.png",
    badge: "Giảm tối đa 50.000đ",
  },
  {
    title: "Khăn lau màn hình Apple - MW693ZA/A",
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:90/plain/https://cellphones.com.vn/media/catalog/product/k/h/khan-lau-man-hinh-apple_1_.png",
    price: "489.000đ",
    oldPrice: "539.000đ",
    link: "https://cellphones.com.vn/khan-lau-man-hinh-apple.html",
  },
  {
    title: "Mua kèm tay cầm chụp ảnh",
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/a/tay-cam-telesin-fun-shot-magnetic-grip-2_2_.png",
    badge: "Giảm thêm 5%",
  },
  {
    title: "Mua kèm ống kính camera",
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:150:150/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ssss_1__87.png",
    badge: "Giảm thêm 5%",
  },
];

const accessoryDeals = [
  {
    title: "Sim 5G Viettel 5G150N 8GB/Ngày (Free TV360 4K)",
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/i/sim-5g-viettel-5g150n-8gb-ngay_2.png",
    memberDiscount: "16.000đ",
    price: "320.000đ",
    oldPrice: "420.000đ",
    link: "https://cellphones.com.vn/sim-5g-viettel-5g150n-8gb-ngay.html",
  },
  {
    title: "Sạc nhanh Apple 20W USB-C chính hãng Apple Việt Nam",
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_117_1.png",
    memberDiscount: "26.000đ",
    price: "520.000đ",
    oldPrice: "890.000đ",
    link: "https://cellphones.com.vn/cu-sac-nhanh-iphone-20w-pd-type-c.html",
  },
  {
    title: "Dán kính cường lực màn hình iPhone 14/13/13 Pro Kasr Full màn hình",
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/k/i/kinh-cuong-luc-iphone-11-kasr-0_1_1.png",
    memberDiscount: "5.000đ",
    price: "109.000đ",
    oldPrice: "120.000đ",
    link: "https://cellphones.com.vn/kinh-cuong-luc-iphone-14-13-13-pro-kasr.html",
  },
  {
    title:
      "Dán kính cường lực màn hình Apple iPhone 16e/14/13/13 Pro Zagg full cao cấp",
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/k/i/kinh-cuong-luc-iphone-13-14-13-pro-se-40-zagg-full_1_.png",
    memberDiscount: "13.000đ",
    price: "261.000đ",
    oldPrice: "290.000đ",
    link: "https://cellphones.com.vn/kinh-cuong-luc-iphone-16e-14-13-13-pro-zagg-full.html",
  },
  {
    title: "Ốp Lưng iPhone 13/14 Filada",
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_9_2_3.png",
    memberDiscount: "11.000đ",
    price: "225.000đ",
    oldPrice: "250.000đ",
    link: "https://cellphones.com.vn/op-lung-iphone-13-14-filada.html",
  },
  {
    title: "Dán kính cường lực màn hình iPhone 14/13/13 Pro JCPal",
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/3/7/37_1.png",
    memberDiscount: "14.000đ",
    price: "270.000đ",
    oldPrice: "390.000đ",
    link: "https://cellphones.com.vn/kinh-cuong-luc-iphone-14-13-13-pro-jcpal.html",
  },
];
</script>

<style scoped>
.product-suggest {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.combov2 {
  color: #444;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  width: 100%;
}

.combov2__wrapper {
  width: 100%;
}

.list-option {
  overflow: hidden;
}

.list-option__head {
  align-items: center;
  background-clip: padding-box, border-box;
  background-image:
    linear-gradient(90deg, #fff5c7, #fffced),
    linear-gradient(90deg, #ffe880, #fffcb0);
  background-origin: border-box;
  border: 1px solid transparent;
  border-radius: 16px 16px 0 0;
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
}

.option__title {
  align-items: center;
  color: #1d1d20;
  display: flex;
  font-size: 20px;
  font-weight: 700;
  gap: 8px;
}

.icon-fire {
  align-items: center;
  display: flex;
  flex-shrink: 0;
  height: 24px;
  width: 24px;
}

.icon-fire img {
  height: 100%;
  object-fit: contain;
  width: 100%;
}

.option__action button {
  align-items: center;
  background: transparent;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: 500;
  gap: 4px;
  padding: 0;
}

.list-option__body {
  background: #fff;
  border: 1px solid #f3e7a4;
  border-radius: 0 0 16px 16px;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  padding: 10px;
}

.list-option__item {
  min-width: 0;
}

.item-wrapper {
  align-items: center;
  background: #fffced;
  border: 1px solid #ffe880;
  border-radius: 12px;
  display: flex;
  gap: 10px;
  height: 100%;
  padding: 10px;
}

.image {
  align-items: center;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  width: 72px;
}

.image img {
  display: block;
  max-width: 72px;
  width: 100%;
}

.info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.info__name {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #18181b;
  display: -webkit-box;
  font-size: 14px;
  font-weight: 600;
  line-clamp: 2;
  line-height: 1.4;
  overflow: hidden;
  text-decoration: none;
}

.info__percent {
  color: #d70018;
  font-size: 13px;
  font-weight: 700;
}

.upsell-item-action {
  align-items: center;
  display: flex;
  gap: 8px;
  justify-content: space-between;
}

.upsell-item-action .block-box-price {
  flex: 1;
}

.upsell-item-action .button {
  margin-left: auto;
}

.block-box-price {
  min-width: 0;
}

.box-info__box-price {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.product__price--show {
  color: #d70018;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.3;
}

.product__price--through {
  color: #71717a;
  font-size: 12px;
  text-decoration: line-through;
}

.button {
  align-items: center;
  background: #fff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  color: #3b82f6;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 600;
  gap: 4px;
  padding: 8px 10px;
}

#boxUpsell {
  background: #f7f7f8;
  border-radius: 16px;
  padding: 16px;
}

.upsell-title {
  color: #18181b;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
}

.upsell-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.upsell-item {
  min-width: 0;
}

.upsell-item-wrapper {
  background: #fff;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  display: flex;
  gap: 8px;
  height: 100%;
  padding: 10px;
}

.upsell-item-image {
  aspect-ratio: 1;
  border-radius: 10px;
  display: block;
  flex-shrink: 0;
  height: 82px;
  object-fit: cover;
  width: 82px;
}

.upsell-item-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}

.upsell-item-text a {
  color: inherit;
  text-decoration: none;
}

.upsell-item-name {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #18181b;
  display: -webkit-box;
  font-size: 13px;
  font-weight: 600;
  line-clamp: 2;
  line-height: 1.35;
  margin-bottom: 4px;
  overflow: hidden;
}

.upsell-item-member {
  color: #444;
  font-size: 11px;
  line-height: 1.3;
}

.upsell-item-member span {
  color: #d70018;
  font-weight: 700;
}

.button-add-cart {
  border-color: #fecaca;
  color: #d70018;
}

.my-3 {
  margin-bottom: 0.75rem;
  margin-top: 0.75rem;
}

@media screen and (max-width: 990px) {
  .list-option__body,
  .upsell-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media screen and (max-width: 540px) {
  .list-option__head,
  #boxUpsell {
    padding: 12px;
  }

  .option__title,
  .upsell-title {
    font-size: 16px;
  }

  .list-option__body,
  .upsell-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .item-wrapper,
  .upsell-item-wrapper {
    padding: 8px;
  }

  .image {
    width: 56px;
  }

  .image img {
    max-width: 56px;
  }

  .upsell-item-image {
    height: 58px;
    width: 58px;
  }

  .button {
    font-size: 12px;
    padding: 6px 8px;
  }

  .product__price--show {
    font-size: 14px;
  }
}
</style>
