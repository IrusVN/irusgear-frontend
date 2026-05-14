<template>
  <div ref="rootEl" class="box-detail-product__box-center column">
    <div class="box-product-price">
      <div class="box-product-price-wrapper">
        <div class="price-label-container">
          <div class="d-flex align-items-center">
            <div class="sale-price">{{ productStore.productDetail?.pricing?.salePrice?.formatted || '' }}</div>
            <del
              v-if="productStore.productDetail?.pricing?.basePrice?.value > productStore.productDetail?.pricing?.salePrice?.value"
              class="base-price">
              {{ productStore.productDetail?.pricing?.basePrice?.formatted || '' }}
            </del>
          </div>
        </div>
        <div class="devide-price-label" v-if="productStore.productDetail?.pricing?.tradeInPrice?.value">
          <div class="divide top mb-3"></div>
          <p>{{ $t('product.or') }}</p>
          <div class="divide bottom"></div>
        </div>
        <div class="trade-price-label" v-if="productStore.productDetail?.pricing?.tradeInPrice?.value">
          <div class="price-label">{{ $t('product.tradeInFrom') }}</div>
          <div class="trade-price-info d-flex align-items-center">
            <div class="sale-price">{{ productStore.productDetail?.pricing?.tradeInPrice?.formatted || '' }}</div>
            <span class="text-navi" v-if="productStore.productDetail?.pricing?.tradeInSupport?.value"><span>
                {{ $t('product.tradeInSupport') }}
                <span class="value">{{ productStore.productDetail?.pricing?.tradeInSupport?.formatted || ''
                }}</span></span>
              <a> {{ $t('product.rateNow') }} </a></span>
          </div>
        </div>
      </div>
      <div class="exclusive-price-block pt-1">
        <div class="d-flex flex-column align-items-center justify-content-center text-center flex-grow-1 pe-0"
          style="background-image: linear-gradient(to right, #9bb8f3 50%, transparent 50%); 
                  background-size: 14px 1px; 
                  background-repeat: repeat-x; 
                  background-position: top;">
          <div class="promotion-row member-row">
            <p class="promotion-row__icon">
              <i class="bi bi-tag-fill" style="font-size:1.5rem;color:var(--irus-color-accent)"></i>
            </p>
            <div class="promotion-row__ct is-member">
              <div class="txt">
                {{ $t('product.memberSaving') }}
                <strong class="bold">{{ productStore.productDetail?.pricing?.memberSaving?.formatted || '' }}</strong>
                {{ $t('product.forSmember') }}
                <a class="dang_nhap_xem_gia link text-decoration-none"> {{ $t('product.checkNow') }} </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="box-linked">
      <div class="box-title">
        <p>{{ $t('product.version') }}</p>
      </div>
      <div class="list-linked">
        <a v-for="storage in productStore.productDetail?.storageOptions || []" :key="storage.id" :href="storage.url"
          @click.prevent="handleChangeStorage(storage)"
          class="item-linked button__link" :class="[{ active: storage.active }, `linked-${storage.id}`]"><strong>{{
            storage.label }}</strong></a>
      </div>
    </div>
    <div class="box-product-variants">
      <div class="box-title">
        <p>{{ $t('product.color') }}</p>
      </div>
      <div class="box-content">
        <ul class="list-variants ps-0 mb-0">
          <li v-for="color in productStore.productDetail?.colorOptions || []" :key="color.id"
            :data-product-id="color.productId" class="item-variant"
            :class="{ active: color.active, disable: color.disabled }">
            <img v-if="color.flashSale?.enabled"
              :src="color.flashSale?.badgeImage || ''"
              height="30" alt="Flash Sale" loading="lazy" class="sticker-flash-sale" />
            <a :href="buildColorHref(color)" @click.prevent="handleChangeColor(color)" :title="color.name"
              class="button__change-color d-flex align-items-center" :class="{ disabled: color.disabled }"><img
                :src="color.thumbnail" width="50" height="50" :alt="color.name" loading="lazy" />
              <div class="d-flex flex-column">
                <strong class="item-variant-name">{{ color.name }}</strong>
                <span class="item-variant-price"> {{ color.price?.formatted || '' }} </span>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div>
      <div style="display: none">
        <div class="box-thu-cu-len-doi-v2">
          <div class="box-price">
            <div class="icon-thu-cu">
              <svg width="48" height="49" viewBox="0 0 48 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect y="0.5" width="48" height="48" rx="8" fill="url(#paint0_linear_97_9297)"></rect>
                <g clip-path="url(#clip0_97_9297)">
                  <path
                    d="M22.1147 12.5L13.3334 21.2813C12.9602 21.6543 12.7061 22.1295 12.6031 22.6469C12.5001 23.1643 12.5529 23.7006 12.7547 24.188L12.8454 24.3813C13.069 24.8184 13.4089 25.1852 13.8277 25.4414C14.2465 25.6976 14.7278 25.8332 15.2187 25.8333H18.6667V28.5C18.6667 28.8536 18.8072 29.1928 19.0573 29.4428C19.3073 29.6929 19.6464 29.8333 20.0001 29.8333H28.0001L28.1561 29.824C28.4804 29.7858 28.7794 29.6299 28.9964 29.3858C29.2135 29.1418 29.3334 28.8266 29.3334 28.5L29.3321 25.8333H32.7814C33.3087 25.8332 33.8242 25.6768 34.2626 25.3837C34.701 25.0907 35.0428 24.6743 35.2445 24.1871C35.4463 23.6999 35.4991 23.1638 35.3963 22.6466C35.2934 22.1294 35.0396 21.6543 34.6667 21.2813L25.8854 12.5C25.3853 12.0001 24.7072 11.7192 24.0001 11.7192C23.293 11.7192 22.6148 12.0001 22.1147 12.5Z"
                    fill="url(#paint1_linear_97_9297)"></path>
                  <path
                    d="M28.0001 35.1667C28.3399 35.167 28.6668 35.2972 28.9139 35.5305C29.161 35.7638 29.3097 36.0826 29.3296 36.4219C29.3495 36.7611 29.2392 37.0952 29.021 37.3558C28.8029 37.6164 28.4935 37.7839 28.1561 37.824L28.0001 37.8333H20.0001C19.6602 37.833 19.3334 37.7028 19.0862 37.4695C18.8391 37.2362 18.6904 36.9174 18.6705 36.5781C18.6506 36.2389 18.761 35.9048 18.9791 35.6442C19.1972 35.3836 19.5066 35.2161 19.8441 35.176L20.0001 35.1667H28.0001Z"
                    fill="url(#paint2_linear_97_9297)"></path>
                  <path
                    d="M28.0001 31.1667C28.3399 31.167 28.6668 31.2972 28.9139 31.5305C29.161 31.7638 29.3097 32.0826 29.3296 32.4219C29.3495 32.7611 29.2392 33.0952 29.021 33.3558C28.8029 33.6164 28.4935 33.7839 28.1561 33.824L28.0001 33.8333H20.0001C19.6602 33.833 19.3334 33.7028 19.0862 33.4695C18.8391 33.2362 18.6904 32.9174 18.6705 32.5781C18.6506 32.2389 18.761 31.9048 18.9791 31.6442C19.1972 31.3836 19.5066 31.2161 19.8441 31.176L20.0001 31.1667H28.0001Z"
                    fill="url(#paint3_linear_97_9297)"></path>
                </g>
                <defs>
                  <linearGradient id="paint0_linear_97_9297" x1="26.9247" y1="-99.25" x2="-75.9002" y2="-15.9732"
                    gradientUnits="userSpaceOnUse">
                    <stop stop-color="#ED8A95"></stop>
                    <stop offset="0.815713" stop-color="#C40016"></stop>
                  </linearGradient>
                  <linearGradient id="paint1_linear_97_9297" x1="23.9996" y1="11.7192" x2="23.9996" y2="37.8333"
                    gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FFF5F0"></stop>
                    <stop offset="1" stop-color="#F4C8D0"></stop>
                  </linearGradient>
                  <linearGradient id="paint2_linear_97_9297" x1="23.9996" y1="11.7192" x2="23.9996" y2="37.8333"
                    gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FFF5F0"></stop>
                    <stop offset="1" stop-color="#F4C8D0"></stop>
                  </linearGradient>
                  <linearGradient id="paint3_linear_97_9297" x1="23.9996" y1="11.7192" x2="23.9996" y2="37.8333"
                    gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FFF5F0"></stop>
                    <stop offset="1" stop-color="#F4C8D0"></stop>
                  </linearGradient>
                  <clipPath id="clip0_97_9297">
                    <rect width="32" height="32" fill="white" transform="translate(8 8.5)"></rect>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div>
              <div class="price-thu-cu">
                <strong>{{ $t('product.tradeInTitle') }}</strong>
                <hr class="divider" />
                <span>{{ $t('product.tradeInFrom') }} <strong> {{ productStore.productDetail?.pricing?.tradeInPrice?.formatted || '' }}
                  </strong></span>
              </div>
              <div class="member-discount">
                {{ $t('product.tradeInIncluded') }}&nbsp;<b>{{ productStore.productDetail?.pricing?.tradeInSupport?.formatted || ''
                }}</b>
              </div>
            </div>
          </div>
          <button class="btn-submit-search desktop">
            <span>{{ $t('product.checkNow') }}</span>
            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12.5H19" stroke="var(--irus-color-accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              </path>
              <path d="M13 18.5L19 12.5" stroke="var(--irus-color-accent)" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path d="M13 6.5L19 12.5" stroke="var(--irus-color-accent)" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="box-product-promotion">
      <div class="box-product-promotion-header d-flex has-text-weight-semibold align-items-center">
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2 15.5H11V24.5H7C5.67392 24.5 4.40215 23.9732 3.46447 23.0355C2.52678 22.0979 2 20.8261 2 19.5V15.5ZM24 11.5C24 12.0304 23.7893 12.5391 23.4142 12.9142C23.0391 13.2893 22.5304 13.5 22 13.5H13V9.457C12.664 9.483 12.329 9.5 12 9.5C11.671 9.5 11.336 9.483 11 9.457V13.5H2C1.46957 13.5 0.960859 13.2893 0.585786 12.9142C0.210714 12.5391 0 12.0304 0 11.5C0 10.4391 0.421427 9.42172 1.17157 8.67157C1.92172 7.92143 2.93913 7.5 4 7.5H5.738C5.1726 7.0016 4.7238 6.38488 4.42344 5.6936C4.12307 5.00232 3.97851 4.25341 4 3.5C4 3.23478 4.10536 2.98043 4.29289 2.79289C4.48043 2.60536 4.73478 2.5 5 2.5C5.26522 2.5 5.51957 2.60536 5.70711 2.79289C5.89464 2.98043 6 3.23478 6 3.5C6 6.122 8.371 7.03 10.174 7.341C9.50852 6.16105 9.10791 4.85037 9 3.5C9 2.70435 9.31607 1.94129 9.87868 1.37868C10.4413 0.81607 11.2044 0.5 12 0.5C12.7956 0.5 13.5587 0.81607 14.1213 1.37868C14.6839 1.94129 15 2.70435 15 3.5C14.8921 4.85037 14.4915 6.16105 13.826 7.341C15.629 7.03 18 6.122 18 3.5C18 3.23478 18.1054 2.98043 18.2929 2.79289C18.4804 2.60536 18.7348 2.5 19 2.5C19.2652 2.5 19.5196 2.60536 19.7071 2.79289C19.8946 2.98043 20 3.23478 20 3.5C20.0215 4.25341 19.8769 5.00232 19.5766 5.6936C19.2762 6.38488 18.8274 7.0016 18.262 7.5H20C21.0609 7.5 22.0783 7.92143 22.8284 8.67157C23.5786 9.42172 24 10.4391 24 11.5ZM11 3.5C11.1207 4.56283 11.4613 5.58891 12 6.513C12.5387 5.58891 12.8793 4.56283 13 3.5C13 3.23478 12.8946 2.98043 12.7071 2.79289C12.5196 2.60536 12.2652 2.5 12 2.5C11.7348 2.5 11.4804 2.60536 11.2929 2.79289C11.1054 2.98043 11 3.23478 11 3.5ZM13 24.5H17C17.6566 24.5 18.3068 24.3707 18.9134 24.1194C19.52 23.8681 20.0712 23.4998 20.5355 23.0355C20.9998 22.5712 21.3681 22.02 21.6194 21.4134C21.8707 20.8068 22 20.1566 22 19.5V15.5H13V24.5Z"
            fill="url(#paint0_linear_0_11239)"></path>
          <defs>
            <linearGradient id="paint0_linear_0_11239" x1="18" y1="-13.5" x2="-5.9444" y2="3.07082"
              gradientUnits="userSpaceOnUse">
              <stop stop-color="#ED8A95"></stop>
              <stop offset="0.815713" stop-color="#C40016"></stop>
            </linearGradient>
          </defs>
        </svg>
        <span>{{ $t('product.promotionIncluded') }}</span>
      </div>
      <div class="box-product-promotion-content show-all">
        <div class="list-promotion-pack">
          <div class="promotion-pack_item is-flex is-align-content-center">
            <div class="box-product-promotion-number has-text-primary-light">
              <p>1</p>
            </div>
            <p class="box-product-promotion-detail has-text-black button__promotion">
              {{ $t('product.tradeInPrivilege') }}
              <a target="_blank" href="">&nbsp; {{ $t('product.details') }}</a>
            </p>
          </div>
          <div class="promotion-pack_item is-flex is-align-content-center">
            <div class="box-product-promotion-number has-text-primary-light">
              <p>2</p>
            </div>
            <p class="box-product-promotion-detail has-text-black button__promotion">
              {{ $t('product.simOffer') }}
              {{ $t('product.simOfferDetail') }}
              <a target="_blank" href="">&nbsp;
                {{ $t('product.details') }}</a>
            </p>
          </div>
          <div class="promotion-pack_item is-flex is-align-content-center">
            <div class="box-product-promotion-number has-text-primary-light">
              <p>3</p>
            </div>
            <p class="box-product-promotion-detail has-text-black button__promotion">
              {{ $t('product.accessoryDiscount') }}
              <a target="_blank" href="">&nbsp; {{ $t('product.details') }}</a>
            </p>
          </div>
        </div>
        <div></div>
        <div></div>
      </div>
    </div>
    <div v-if="false" class="block-special-promotion-banner my-3">
      <div class="swiper-container banner-slide">
        <div class="swiper-wrapper" style="transform: translate3d(0px, 0px, 0px)">
          <div class="swiper-slide" style="width: 592px; margin-right: 10px">
            <a class="button__special-promotion-banner"><img
                src="" height="120"
                alt="Banner Trả góp" loading="lazy" /></a>
          </div>
        </div>
        <span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>
      </div>
      <div id="modalVoucher" class="modal" style="display: none">
        <div id="modalVoucherBg" class="modal-background"></div>
        <div class="modal-card">
          <section class="modal-card-body modal-card-body--rounded">
            <div class="icon-check-outline">
              <div class="icon-check">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_1902_5203)">
                    <path
                      d="M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.23279 13.1819 3 12 3C10.8181 3 9.64778 3.23279 8.55585 3.68508C7.46392 4.13738 6.47177 4.80031 5.63604 5.63604C4.80031 6.47177 4.13738 7.46392 3.68508 8.55585C3.23279 9.64778 3 10.8181 3 12Z"
                      stroke="#5AC955" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M9 12L11 14L15 10" stroke="#5AC955" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round"></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_1902_5203">
                      <rect width="24" height="24" fill="white"></rect>
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
            <p class="title-promo"></p>
            <p class="description-promo"></p>
            <div class="voucher-clipboard-outline"></div>
          </section>
          <footer class="modal-card-foot">
            <button class="button">{{ $t('product.close') }}</button>
          </footer>
        </div>
      </div>
      <div id="modalLuckyWheel" class="modal" style="display: none">
        <div id="modalLuckyWheelbg" class="modal-background"></div>
        <div class="modal-card">
          <section class="modal-card-body modal-card-body--rounded">
            <button class="button close">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30 18L18 30" stroke="#18181B" stroke-width="1.5" stroke-linecap="round"
                  stroke-linejoin="round"></path>
                <path d="M18 18L30 30" stroke="#18181B" stroke-width="1.5" stroke-linecap="round"
                  stroke-linejoin="round"></path>
              </svg>
            </button>
            <p class="title">{{ $t('product.joinProgram') }}</p>
            <div>
              <p class="has-text-centered mb-3 mx-auto">
                {{ $t('product.enterPhoneToJoin') }}
              </p>
              <div class="field">
                <p class="control has-icons-right">
                  <input id="phoneGuest" type="text" :placeholder="$t('register.enterPhone')" maxlength="10" class="input" />
                  <span class="icon is-small is-right" style="display: none"><svg width="48" height="48"
                      viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M30 18L18 30" stroke="#18181B" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round"></path>
                      <path d="M18 18L30 30" stroke="#18181B" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round"></path>
                    </svg></span>
                </p>
              </div>
            </div>
            <div style="display: none">
              <p class="has-text-centered mb-3 mx-auto">
                Vui lòng nhập OTP vừa được gửi đến số điện thoại<br /><strong></strong>
              </p>
              <div class="otp-input">
                <input type="number" min="0" max="9" required="required" />
                <input type="number" min="0" max="9" required="required" />
                <input type="number" min="0" max="9" required="required" />
                <input type="number" min="0" max="9" required="required" />
              </div>
            </div>
            <button disabled="disabled" class="button submit-phone">
              {{ $t('product.continue') }}
            </button>
          </section>
        </div>
      </div>
    </div>
    <div v-if="false" class="box-more-promotion my-3">
      <div class="box-more-promotion-title has-text-black has-text-weight-semibold">
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2 15.5H11V24.5H7C5.67392 24.5 4.40215 23.9732 3.46447 23.0355C2.52678 22.0979 2 20.8261 2 19.5V15.5ZM24 11.5C24 12.0304 23.7893 12.5391 23.4142 12.9142C23.0391 13.2893 22.5304 13.5 22 13.5H13V9.457C12.664 9.483 12.329 9.5 12 9.5C11.671 9.5 11.336 9.483 11 9.457V13.5H2C1.46957 13.5 0.960859 13.2893 0.585786 12.9142C0.210714 12.5391 0 12.0304 0 11.5C0 10.4391 0.421427 9.42172 1.17157 8.67157C1.92172 7.92143 2.93913 7.5 4 7.5H5.738C5.1726 7.0016 4.7238 6.38488 4.42344 5.6936C4.12307 5.00232 3.97851 4.25341 4 3.5C4 3.23478 4.10536 2.98043 4.29289 2.79289C4.48043 2.60536 4.73478 2.5 5 2.5C5.26522 2.5 5.51957 2.60536 5.70711 2.79289C5.89464 2.98043 6 3.23478 6 3.5C6 6.122 8.371 7.03 10.174 7.341C9.50852 6.16105 9.10791 4.85037 9 3.5C9 2.70435 9.31607 1.94129 9.87868 1.37868C10.4413 0.81607 11.2044 0.5 12 0.5C12.7956 0.5 13.5587 0.81607 14.1213 1.37868C14.6839 1.94129 15 2.70435 15 3.5C14.8921 4.85037 14.4915 6.16105 13.826 7.341C15.629 7.03 18 6.122 18 3.5C18 3.23478 18.1054 2.98043 18.2929 2.79289C18.4804 2.60536 18.7348 2.5 19 2.5C19.2652 2.5 19.5196 2.60536 19.7071 2.79289C19.8946 2.98043 20 3.23478 20 3.5C20.0215 4.25341 19.8769 5.00232 19.5766 5.6936C19.2762 6.38488 18.8274 7.0016 18.262 7.5H20C21.0609 7.5 22.0783 7.92143 22.8284 8.67157C23.5786 9.42172 24 10.4391 24 11.5ZM11 3.5C11.1207 4.56283 11.4613 5.58891 12 6.513C12.5387 5.58891 12.8793 4.56283 13 3.5C13 3.23478 12.8946 2.98043 12.7071 2.79289C12.5196 2.60536 12.2652 2.5 12 2.5C11.7348 2.5 11.4804 2.60536 11.2929 2.79289C11.1054 2.98043 11 3.23478 11 3.5ZM13 24.5H17C17.6566 24.5 18.3068 24.3707 18.9134 24.1194C19.52 23.8681 20.0712 23.4998 20.5355 23.0355C20.9998 22.5712 21.3681 22.02 21.6194 21.4134C21.8707 20.8068 22 20.1566 22 19.5V15.5H13V24.5Z"
            fill="url(#paint0_linear_bmp)"></path>
          <defs>
            <linearGradient id="paint0_linear_bmp" x1="18" y1="-13.5" x2="-5.9444" y2="3.07082"
              gradientUnits="userSpaceOnUse">
              <stop stop-color="#ED8A95"></stop>
              <stop offset="0.815713" stop-color="#C40016"></stop>
            </linearGradient>
          </defs>
        </svg>
        <span>{{ $t('product.paymentOffers') }}</span>
      </div>
      <div class="swiper-container box-more-promotion-swiper">
        <div class="swiper-wrapper" style="transform: translate3d(0px, 0px, 0px)">
          <div class="box-more-promotion-slide swiper-slide" style="width: 232px; margin-right: 8px">
            <div class="box-more-promotion-item">
              <div class="box-more-promotion-item__head">
                <img src="" alt="" loading="lazy"
                  class="icon" />
              </div>
              <div class="box-more-promotion-item__content">
                <p class="box-more-promotion-item__desc">
                  {{ $t('product.paymentOffer1') }}
                </p>
                <div class="box-more-promotion-item__info">
                  <p class="box-more-promotion-item__date box-more-promotion-item__date--ongoing">
                    {{ $t('product.ongoing') }}
                  </p>
                  <a href="" target="_blank"
                    rel="noopener noreferrer" class="box-more-promotion-item__link"><span>{{ $t('product.details') }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <g clip-path="url(#clip0_13879_97176)">
                        <path d="M4.5 3L7.5 6L4.5 9" stroke="#3B82F6" stroke-width="1.125" stroke-linecap="round"
                          stroke-linejoin="round"></path>
                      </g>
                      <defs>
                        <clipPath id="clip0_13879_97176">
                          <rect width="12" height="12" fill="white"></rect>
                        </clipPath>
                      </defs>
                    </svg></a>
                </div>
              </div>
            </div>
          </div>
          <div class="box-more-promotion-slide swiper-slide" style="width: 232px; margin-right: 8px">
            <div class="box-more-promotion-item">
              <div class="box-more-promotion-item__head">
                <img src="" alt="" loading="lazy"
                  class="icon" />
              </div>
              <div class="box-more-promotion-item__content">
                <p class="box-more-promotion-item__desc">
                  {{ $t('product.paymentOffer2') }}
                </p>
                <div class="box-more-promotion-item__info">
                  <p class="box-more-promotion-item__date box-more-promotion-item__date--ongoing">
                    {{ $t('product.ongoing') }}
                  </p>
                  <a href="" target="_blank" rel="noopener noreferrer"
                    class="box-more-promotion-item__link"><span>{{ $t('product.details') }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <g clip-path="url(#clip0_13879_97176)">
                        <path d="M4.5 3L7.5 6L4.5 9" stroke="#3B82F6" stroke-width="1.125" stroke-linecap="round"
                          stroke-linejoin="round"></path>
                      </g>
                      <defs>
                        <clipPath id="clip0_13879_97176">
                          <rect width="12" height="12" fill="white"></rect>
                        </clipPath>
                      </defs>
                    </svg></a>
                </div>
              </div>
            </div>
          </div>
          <div class="box-more-promotion-slide swiper-slide" style="width: 232px; margin-right: 8px">
            <div class="box-more-promotion-item">
              <div class="box-more-promotion-item__head">
                <img
                  src=""
                  alt="" loading="lazy" class="icon" />
              </div>
              <div class="box-more-promotion-item__content">
                <p class="box-more-promotion-item__desc">
                  {{ $t('product.creditCardRefund') }}
                </p>
                <div class="box-more-promotion-item__info">
                  <p class="box-more-promotion-item__date box-more-promotion-item__date--ongoing">
                    {{ $t('product.ongoing') }}
                  </p>
                  <a href="" target="_blank"
                    rel="noopener noreferrer" class="box-more-promotion-item__link"><span>{{ $t('product.details') }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <g clip-path="url(#clip0_13879_97176)">
                        <path d="M4.5 3L7.5 6L4.5 9" stroke="#3B82F6" stroke-width="1.125" stroke-linecap="round"
                          stroke-linejoin="round"></path>
                      </g>
                      <defs>
                        <clipPath id="clip0_13879_97176">
                          <rect width="12" height="12" fill="white"></rect>
                        </clipPath>
                      </defs>
                    </svg></a>
                </div>
              </div>
            </div>
          </div>
          <div class="box-more-promotion-slide swiper-slide" style="width: 232px; margin-right: 8px">
            <div class="box-more-promotion-item">
              <div class="box-more-promotion-item__head">
                <img
                  src=""
                  alt="" loading="lazy" class="icon" />
              </div>
              <div class="box-more-promotion-item__content">
                <p class="box-more-promotion-item__desc">
                  {{ $t('product.paymentOffer3') }}
                </p>
                <div class="box-more-promotion-item__info">
                  <p class="box-more-promotion-item__date box-more-promotion-item__date--ongoing">
                    {{ $t('product.ongoing') }}
                  </p>
                  <a href="" target="_blank" rel="noopener noreferrer"
                    class="box-more-promotion-item__link"><span>{{ $t('product.details') }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <g clip-path="url(#clip0_13879_97176)">
                        <path d="M4.5 3L7.5 6L4.5 9" stroke="#3B82F6" stroke-width="1.125" stroke-linecap="round"
                          stroke-linejoin="round"></path>
                      </g>
                      <defs>
                        <clipPath id="clip0_13879_97176">
                          <rect width="12" height="12" fill="white"></rect>
                        </clipPath>
                      </defs>
                    </svg></a>
                </div>
              </div>
            </div>
          </div>
          <div class="box-more-promotion-slide swiper-slide" style="width: 232px; margin-right: 8px">
            <div class="box-more-promotion-item">
              <div class="box-more-promotion-item__head">
                <img
                  src=""
                  alt="" loading="lazy" class="icon" />
              </div>
              <div class="box-more-promotion-item__content">
                <p class="box-more-promotion-item__desc">
                  {{ $t('product.paymentOffer4') }}
                </p>
                <div class="box-more-promotion-item__info">
                  <p class="box-more-promotion-item__date box-more-promotion-item__date--ongoing">
                    {{ $t('product.ongoing') }}
                  </p>
                  <a href="" target="_blank"
                    rel="noopener noreferrer" class="box-more-promotion-item__link"><span>{{ $t('product.details') }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <g clip-path="url(#clip0_13879_97176)">
                        <path d="M4.5 3L7.5 6L4.5 9" stroke="#3B82F6" stroke-width="1.125" stroke-linecap="round"
                          stroke-linejoin="round"></path>
                      </g>
                      <defs>
                        <clipPath id="clip0_13879_97176">
                          <rect width="12" height="12" fill="white"></rect>
                        </clipPath>
                      </defs>
                    </svg></a>
                </div>
              </div>
            </div>
          </div>
          <div class="box-more-promotion-slide swiper-slide" style="width: 232px; margin-right: 8px">
            <div class="box-more-promotion-item">
              <div class="box-more-promotion-item__head">
                <img
                  src=""
                  alt="" loading="lazy" class="icon" />
              </div>
              <div class="box-more-promotion-item__content">
                <p class="box-more-promotion-item__desc">
                  {{ $t('product.paymentOffer5') }}
                </p>
                <div class="box-more-promotion-item__info">
                  <p class="box-more-promotion-item__date box-more-promotion-item__date--ongoing">
                    {{ $t('product.ongoing') }}
                  </p>
                  <a href="" target="_blank"
                    rel="noopener noreferrer" class="box-more-promotion-item__link"><span>{{ $t('product.details') }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <g clip-path="url(#clip0_13879_97176)">
                        <path d="M4.5 3L7.5 6L4.5 9" stroke="#3B82F6" stroke-width="1.125" stroke-linecap="round"
                          stroke-linejoin="round"></path>
                      </g>
                      <defs>
                        <clipPath id="clip0_13879_97176">
                          <rect width="12" height="12" fill="white"></rect>
                        </clipPath>
                      </defs>
                    </svg></a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="swiper-pagination swiper-pagination-clickable swiper-pagination-bullets">
          <span class="swiper-pagination-bullet swiper-pagination-bullet-active" tabindex="0" role="button"
            aria-label="Go to slide 1"></span><span class="swiper-pagination-bullet" tabindex="0" role="button"
            aria-label="Go to slide 2"></span><span class="swiper-pagination-bullet" tabindex="0" role="button"
            aria-label="Go to slide 3"></span><span class="swiper-pagination-bullet" tabindex="0" role="button"
            aria-label="Go to slide 4"></span><span class="swiper-pagination-bullet" tabindex="0" role="button"
            aria-label="Go to slide 5"></span>
        </div>
        <div class="swiper-button-next button__view-gallery-next" tabindex="0" role="button" aria-label="Next slide"
          aria-disabled="false">
          <div class="icon">
            <ArrowIcon direction="right" />
          </div>
        </div>
        <div class="swiper-button-prev button__view-gallery-prev" tabindex="0" role="button" aria-label="Previous slide"
          aria-disabled="false">
          <div class="icon">
            <ArrowIcon direction="left" />
          </div>
        </div>
        <span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>
      </div>
    </div>
    <div v-if="false" class="box-on-stock-stores">
      <div class="box-on-stock-option-location">
        <div class="box-on-stock-count">
          <strong>{{ $t('product.viewBranches') }}</strong>
          <p>
            {{ $t('product.inStock') }}
            <span class="count">48</span>
            {{ $t('product.storesWithProduct') }}
          </p>
        </div>
        <div class="box-on-stock-option button__change-province">
          {{ $t('product.hoChiMinh') }}
          <div class="icon-down">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="10" height="10">
              <path
                d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z">
              </path>
            </svg>
          </div>
        </div>
        <div class="box-on-stock-option">
          <select id="districtOptions">
            <option value="">{{ $t('product.selectDistrict') }}</option>
            <option class="button__change-district" value="1">{{ $t('product.district1') }}</option>
            <option class="button__change-district" value="2">{{ $t('product.district2') }}</option>
            <option class="button__change-district" value="4">{{ $t('product.district4') }}</option>
            <option class="button__change-district" value="5">{{ $t('product.district5') }}</option>
            <option class="button__change-district" value="6">{{ $t('product.district6') }}</option>
            <option class="button__change-district" value="7">{{ $t('product.district7') }}</option>
            <option class="button__change-district" value="8">{{ $t('product.district8') }}</option>
            <option class="button__change-district" value="9">{{ $t('product.district9') }}</option>
            <option class="button__change-district" value="10">{{ $t('product.district10') }}</option>
            <option class="button__change-district" value="11">{{ $t('product.district11') }}</option>
            <option class="button__change-district" value="12">{{ $t('product.district12') }}</option>
            <option class="button__change-district" value="13">
              {{ $t('product.thuDuc') }}
            </option>
            <option class="button__change-district" value="14">
              Huyện Hóc Môn
            </option>
            <option class="button__change-district" value="15">
              Huyện Bình Chánh
            </option>
            <option class="button__change-district" value="16">
              Huyện Nhà Bè
            </option>
            <option class="button__change-district" value="17">
              Huyện Củ Chi
            </option>
            <option class="button__change-district" value="74">
              {{ $t('product.tanBinh') }}
            </option>
            <option class="button__change-district" value="86">
              {{ $t('product.binhThanh') }}
            </option>
            <option class="button__change-district" value="87">
              {{ $t('product.goVap') }}
            </option>
            <option class="button__change-district" value="109">
              {{ $t('product.binhTan') }}
            </option>
            <option class="button__change-district" value="127">
              {{ $t('product.tanPhu') }}
            </option>
            <option class="button__change-district" value="157">
              {{ $t('product.phuNhuan') }}
            </option>
          </select>
          <div class="icon-down">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="10" height="10">
              <path
                d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z">
              </path>
            </svg>
          </div>
        </div>
      </div>
      <div class="box-on-stock-address">
        <div class="swiper-container swiper-pdp">
          <div class="swiper-wrapper" style="transform: translate3d(0px, 0px, 0px)">
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="55B Trần Quang Khải, P. Tân Định, Q. 1, TP. HCM" class="address">
                  55B Trần Quang Khải, P. Tân Định, Q. 1, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871083355" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871083355</span></a>
                  <a title="55B Trần Quang Khải, P. Tân Định, Q. 1, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://g.page/cps55bhcm?share" class="map"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="134 Nguyễn Thái Học, P. Phạm Ngũ Lão, Q.1, TP HCM" class="address">
                  134 Nguyễn Thái Học, P. Phạm Ngũ Lão, Q.1, TP HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871000132" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871000132</span></a>
                  <a title="134 Nguyễn Thái Học, P. Phạm Ngũ Lão, Q.1, TP HCM" target="_blank" rel="noopener nofollow"
                    href="https://g.page/r/CcUv-Bg4yfcvEAE" class="map"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="218-220 Trần Quang Khải, P. Tân Định, Q.1, TP. HCM" class="address">
                  218-220 Trần Quang Khải, P. Tân Định, Q.1, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871000218" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871000218</span></a>
                  <a title="218-220 Trần Quang Khải, P. Tân Định, Q.1, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://goo.gl/maps/tEsBob3iz5z7HNo68" class="map"><svg width="16" height="16"
                      viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="157-159 Nguyễn Thị Minh Khai, P. Phạm Ngũ Lão, Q. 1, TP. HCM" class="address">
                  157-159 Nguyễn Thị Minh Khai, P. Phạm Ngũ Lão, Q. 1, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871066159" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871066159</span></a>
                  <a title="157-159 Nguyễn Thị Minh Khai, P. Phạm Ngũ Lão, Q. 1, TP. HCM" target="_blank"
                    rel="noopener nofollow" href="https://g.page/r/CfMj9yennN2bEAE" class="map"><svg width="16"
                      height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="139 Trần Não, P. Bình An, Q.2, TP. HCM" class="address">
                  139 Trần Não, P. Bình An, Q.2, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871000139" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871000139</span></a>
                  <a title="139 Trần Não, P. Bình An, Q.2, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://g.page/cps139hcm?gm" class="map"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="190 Nguyễn Thị Định, khu phố 2, P. An Phú, Q.2, TP. HCM" class="address">
                  190 Nguyễn Thị Định, khu phố 2, P. An Phú, Q.2, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871010190" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871010190</span></a>
                  <a title="190 Nguyễn Thị Định, khu phố 2, P. An Phú, Q.2, TP. HCM" target="_blank"
                    rel="noopener nofollow" href="https://g.page/r/Cazj4BdrnSs7EBA" class="map"><svg width="16"
                      height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="177 Khánh Hội, P. 3, Q. 4, TP. HCM" class="address">
                  177 Khánh Hội, P. 3, Q. 4, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871067171" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871067171</span></a>
                  <a title="177 Khánh Hội, P. 3, Q. 4, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://g.page/r/Cc6DULzgXhO5EAE" class="map"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="785 Trần Hưng Đạo, P.1, Q.5, TP. HCM" class="address">
                  785 Trần Hưng Đạo, P.1, Q.5, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871011785" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871011785</span></a>
                  <a title="785 Trần Hưng Đạo, P.1, Q.5, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://g.page/r/CbY9KG3a0gcYEBM" class="map"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="1075B Hậu Giang, P. 11, Q. 6, TP. HCM" class="address">
                  1075B Hậu Giang, P. 11, Q. 6, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871088075" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871088075</span></a>
                  <a title="1075B Hậu Giang, P. 11, Q. 6, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://goo.gl/maps/Ucwy7b5Mbq6bQems5" class="map"><svg width="16" height="16"
                      viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="458 - 460 Hậu Giang, P.12, Q.6, TP. HCM" class="address">
                  458 - 460 Hậu Giang, P.12, Q.6, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871000460" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871000460</span></a>
                  <a title="458 - 460 Hậu Giang, P.12, Q.6, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://g.page/r/CQaVjh9biTQWEAE" class="map"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="248 Nguyễn Thị Thập, P. Tân Quy, Q.7, TP. HCM" class="address">
                  248 Nguyễn Thị Thập, P. Tân Quy, Q.7, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871088248" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871088248</span></a>
                  <a title="248 Nguyễn Thị Thập, P. Tân Quy, Q.7, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://goo.gl/maps/LwBg8yAs5GMSqDch8" class="map"><svg width="16" height="16"
                      viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="571 Huỳnh Tấn Phát, P. Tân Thuận Đông, Q.7, TP. HCM" class="address">
                  571 Huỳnh Tấn Phát, P. Tân Thuận Đông, Q.7, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871000571" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871000571</span></a>
                  <a title="571 Huỳnh Tấn Phát, P. Tân Thuận Đông, Q.7, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://g.page/r/CYu9GMcLPoXQEAE" class="map"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="435 Nguyễn Thị Thập, P. Tân Phong, Q.7, TP. HCM" class="address">
                  435 Nguyễn Thị Thập, P. Tân Phong, Q.7, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871000435" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871000435</span></a>
                  <a title="435 Nguyễn Thị Thập, P. Tân Phong, Q.7, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://g.page/r/CZ4NDz2QayicEBA" class="map"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="579 Dương Bá Trạc, P.1, Q.8, TP. HCM" class="address">
                  579 Dương Bá Trạc, P.1, Q.8, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871001579" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871001579</span></a>
                  <a title="579 Dương Bá Trạc, P.1, Q.8, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://g.page/r/CbJMdjKPy8tgEAE" class="map"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="125 Lê Văn Việt, P. Hiệp Phú, Q. 9, TP. HCM" class="address">
                  125 Lê Văn Việt, P. Hiệp Phú, Q. 9, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871061125" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871061125</span></a>
                  <a title="125 Lê Văn Việt, P. Hiệp Phú, Q. 9, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://g.page/cps125hcm?share" class="map"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="241 Lê Văn Việt, P. Hiệp Phú, Q.9, TP. HCM" class="address">
                  241 Lê Văn Việt, P. Hiệp Phú, Q.9, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871000241" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871000241</span></a>
                  <a title="241 Lê Văn Việt, P. Hiệp Phú, Q.9, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://g.page/r/CZ9eYH0AgnQvEBA" class="map"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="241-243, Đỗ Xuân Hợp, P. Phước Long B, Q.9, TP. HCM" class="address">
                  241-243, Đỗ Xuân Hợp, P. Phước Long B, Q.9, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871088241" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871088241</span></a>
                  <a title="241-243, Đỗ Xuân Hợp, P. Phước Long B, Q.9, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://goo.gl/maps/wTW57Gp2KFsQBFhr7" class="map"><svg width="16" height="16"
                      viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="347 Nguyễn Tri Phương, Phường 5, Quận 10, TP. HCM" class="address">
                  347 Nguyễn Tri Phương, Phường 5, Quận 10, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871000347" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871000347</span></a>
                  <a title="347 Nguyễn Tri Phương, Phường 5, Quận 10, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://g.page/r/CWKo-PuuwVYcEAE" class="map"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="288 Đường 3/2, P. 12, Q. 10, TP. HCM" class="address">
                  288 Đường 3/2, P. 12, Q. 10, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871066288" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871066288</span></a>
                  <a title="288 Đường 3/2, P. 12, Q. 10, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://g.page/cps288hcm?share" class="map"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="457B Lê Đại Hành, P.11, Q.11, TP. HCM" class="address">
                  457B Lê Đại Hành, P.11, Q.11, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871000457" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871000457</span></a>
                  <a title="457B Lê Đại Hành, P.11, Q.11, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://g.page/cps457bhcm?gm" class="map"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="17 Phan Văn Hớn, P. Tân Thới Nhất, Q.12, TP. HCM" class="address">
                  17 Phan Văn Hớn, P. Tân Thới Nhất, Q.12, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871012017" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871012017</span></a>
                  <a title="17 Phan Văn Hớn, P. Tân Thới Nhất, Q.12, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://g.page/r/CScC9T3PfzGsEBA" class="map"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="93/8C Nguyễn Ảnh Thủ, P. Trung Mỹ Tây, Q.12, TP. HCM" class="address">
                  93/8C Nguyễn Ảnh Thủ, P. Trung Mỹ Tây, Q.12, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871000093" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871000093</span></a>
                  <a title="93/8C Nguyễn Ảnh Thủ, P. Trung Mỹ Tây, Q.12, TP. HCM" target="_blank"
                    rel="noopener nofollow" href="https://g.page/cps938chcm/" class="map"><svg width="16" height="16"
                      viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="1A Nguyễn Ảnh Thủ, khu phố 1, P. Hiệp Thành, Q.12, TP. HCM" class="address">
                  1A Nguyễn Ảnh Thủ, khu phố 1, P. Hiệp Thành, Q.12, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871088001" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871088001</span></a>
                  <a title="1A Nguyễn Ảnh Thủ, khu phố 1, P. Hiệp Thành, Q.12, TP. HCM" target="_blank"
                    rel="noopener nofollow" href="https://g.page/r/CaYKCN2S9qI4EAE" class="map"><svg width="16"
                      height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="632A Kha Vạn Cân, P. Linh Đông, TP. Thủ Đức, TP. HCM" class="address">
                  632A Kha Vạn Cân, P. Linh Đông, TP. Thủ Đức, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871000632" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871000632</span></a>
                  <a title="632A Kha Vạn Cân, P. Linh Đông, TP. Thủ Đức, TP. HCM" target="_blank"
                    rel="noopener nofollow" href="https://g.page/r/CdBHCjsKoZihEAE" class="map"><svg width="16"
                      height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="943 Kha Vạn Cân, P. Linh Trung, Thủ Đức, TP. HCM" class="address">
                  943 Kha Vạn Cân, P. Linh Trung, Thủ Đức, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871000943" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871000943</span></a>
                  <a title="943 Kha Vạn Cân, P. Linh Trung, Thủ Đức, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://g.page/r/CZag32KsdAoxEAE" class="map"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="18 Võ Văn Ngân, P. Trường Thọ, Q. Thủ Đức, TP. HCM" class="address">
                  18 Võ Văn Ngân, P. Trường Thọ, Q. Thủ Đức, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871097939" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871097939</span></a>
                  <a title="18 Võ Văn Ngân, P. Trường Thọ, Q. Thủ Đức, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://goo.gl/maps/ZjV4M4C8LHP2pasU9" class="map"><svg width="16" height="16"
                      viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="4/39 Quang Trung, Thới Tam Thôn, H. Hóc Môn, TP. HCM" class="address">
                  4/39 Quang Trung, Thới Tam Thôn, H. Hóc Môn, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871088439" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871088439</span></a>
                  <a title="4/39 Quang Trung, Thới Tam Thôn, H. Hóc Môn, TP. HCM" target="_blank"
                    rel="noopener nofollow" href="https://g.page/cps439ahcm?share" class="map"><svg width="16"
                      height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="C3/1A Phạm Hùng, X. Bình Hưng, H. Bình Chánh, TP. HCM" class="address">
                  C3/1A Phạm Hùng, X. Bình Hưng, H. Bình Chánh, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871000312" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871000312</span></a>
                  <a title="C3/1A Phạm Hùng, X. Bình Hưng, H. Bình Chánh, TP. HCM" target="_blank"
                    rel="noopener nofollow" href="https://g.page/r/CShKqciVe2r8EBA" class="map"><svg width="16"
                      height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="1716/1 Huỳnh Tấn Phát, thị trấn Nhà Bè, Huyện Nhà Bè, TP. HCM" class="address">
                  1716/1 Huỳnh Tấn Phát, thị trấn Nhà Bè, Huyện Nhà Bè, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871061716" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871061716</span></a>
                  <a title="1716/1 Huỳnh Tấn Phát, thị trấn Nhà Bè, Huyện Nhà Bè, TP. HCM" target="_blank"
                    rel="noopener nofollow" href="https://g.page/r/CRwQAIw6UNfFEAI" class="map"><svg width="16"
                      height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="193 Tỉnh Lộ 8, Khu phố 3, Thị trấn Củ Chi, H. Củ Chi, TP. HCM" class="address">
                  193 Tỉnh Lộ 8, Khu phố 3, Thị trấn Củ Chi, H. Củ Chi, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871000193" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871000193</span></a>
                  <a title="193 Tỉnh Lộ 8, Khu phố 3, Thị trấn Củ Chi, H. Củ Chi, TP. HCM" target="_blank"
                    rel="noopener nofollow" href="https://g.page/r/CSTIUrxwmeh4EBA" class="map"><svg width="16"
                      height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="58 Tỉnh Lộ 8, Ấp 1, Xã Tân Thạnh Tây, Huyện Củ Chi, TP. HCM" class="address">
                  58 Tỉnh Lộ 8, Ấp 1, Xã Tân Thạnh Tây, Huyện Củ Chi, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871200058" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871200058</span></a>
                  <a title="58 Tỉnh Lộ 8, Ấp 1, Xã Tân Thạnh Tây, Huyện Củ Chi, TP. HCM" target="_blank"
                    rel="noopener nofollow" href="https://g.page/r/CUWbraDQmGrlEAI" class="map"><svg width="16"
                      height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="359 Cộng Hòa, P.13, Q. Tân Bình, TP. HCM" class="address">
                  359 Cộng Hòa, P.13, Q. Tân Bình, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871015359" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871015359</span></a>
                  <a title="359 Cộng Hòa, P.13, Q. Tân Bình, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://g.page/cps359hcm?share" class="map"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="190B Hoàng Văn Thụ, P4, Q. Tân Bình, TP. HCM" class="address">
                  190B Hoàng Văn Thụ, P4, Q. Tân Bình, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871000190" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871000190</span></a>
                  <a title="190B Hoàng Văn Thụ, P4, Q. Tân Bình, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://g.page/r/CSw3xpegdNvnEAE" class="map"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="672-674 Âu Cơ, P. 14, Q. Tân Bình, TP. HCM" class="address">
                  672-674 Âu Cơ, P. 14, Q. Tân Bình, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871088672" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871088672</span></a>
                  <a title="672-674 Âu Cơ, P. 14, Q. Tân Bình, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://g.page/cps672hcm?share" class="map"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="956 Âu Cơ, P.14, Q. Tân Bình, TP. HCM" class="address">
                  956 Âu Cơ, P.14, Q. Tân Bình, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871000956" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871000956</span></a>
                  <a title="956 Âu Cơ, P.14, Q. Tân Bình, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://g.page/cps956hcm?gm" class="map"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="377-379 Điện Biên Phủ, P. 25, Q. Bình Thạnh, TP. HCM" class="address">
                  377-379 Điện Biên Phủ, P. 25, Q. Bình Thạnh, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871077377" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871077377</span></a>
                  <a title="377-379 Điện Biên Phủ, P. 25, Q. Bình Thạnh, TP. HCM" target="_blank"
                    rel="noopener nofollow" href="https://g.page/cps377hcm?share" class="map"><svg width="16"
                      height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="536 Xô Viết Nghệ Tĩnh, P. 25, Q. Bình Thạnh, TP. HCM" class="address">
                  536 Xô Viết Nghệ Tĩnh, P. 25, Q. Bình Thạnh, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871065536" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871065536</span></a>
                  <a title="536 Xô Viết Nghệ Tĩnh, P. 25, Q. Bình Thạnh, TP. HCM" target="_blank"
                    rel="noopener nofollow" href="https://g.page/cps536hcm?share" class="map"><svg width="16"
                      height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="59 Quang Trung, P. 10, Q. Gò Vấp, TP. HCM" class="address">
                  59 Quang Trung, P. 10, Q. Gò Vấp, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871088059" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871088059</span></a>
                  <a title="59 Quang Trung, P. 10, Q. Gò Vấp, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://g.page/cps59hcm?share" class="map"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="272 Nguyễn Oanh, P.17, Q. Gò Vấp, TP. HCM" class="address">
                  272 Nguyễn Oanh, P.17, Q. Gò Vấp, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871000272" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871000272</span></a>
                  <a title="272 Nguyễn Oanh, P.17, Q. Gò Vấp, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://g.page/r/CdDvY-OoSsE2EBA" class="map"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="567 Lê Quang Định, P.1, Q. Gò Vấp, TP. HCM" class="address">
                  567 Lê Quang Định, P.1, Q. Gò Vấp, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871000567" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871000567</span></a>
                  <a title="567 Lê Quang Định, P.1, Q. Gò Vấp, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://g.page/r/CeKNFfsg2bdREBA" class="map"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="525 Quang Trung, P.10, Q. Gò Vấp, TP. HCM" class="address">
                  525 Quang Trung, P.10, Q. Gò Vấp, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871000525" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871000525</span></a>
                  <a title="525 Quang Trung, P.10, Q. Gò Vấp, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://g.page/cps525ahcm?gm" class="map"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="888 Tỉnh Lộ 10, P. Bình Trị Đông A, Q. Bình Tân, TP. HCM" class="address">
                  888 Tỉnh Lộ 10, P. Bình Trị Đông A, Q. Bình Tân, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871068880" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871068880</span></a>
                  <a title="888 Tỉnh Lộ 10, P. Bình Trị Đông A, Q. Bình Tân, TP. HCM" target="_blank"
                    rel="noopener nofollow" href="https://g.page/r/CXd0aw__78GLEBA" class="map"><svg width="16"
                      height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="127 Nguyễn Thị Tú, P. Bình Hưng Hoà B, Q. Bình Tân, TP. HCM" class="address">
                  127 Nguyễn Thị Tú, P. Bình Hưng Hoà B, Q. Bình Tân, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871000229" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871000229</span></a>
                  <a title="127 Nguyễn Thị Tú, P. Bình Hưng Hoà B, Q. Bình Tân, TP. HCM" target="_blank"
                    rel="noopener nofollow" href="https://g.page/cps229hcm" class="map"><svg width="16" height="16"
                      viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="386 Hương Lộ 2, P. Bình Trị Đông, Q. Bình Tân (Ngã Tư Bốn Xã), TP. HCM" class="address">
                  386 Hương Lộ 2, P. Bình Trị Đông, Q. Bình Tân (Ngã Tư Bốn Xã),
                  TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871087386" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871087386</span></a>
                  <a title="386 Hương Lộ 2, P. Bình Trị Đông, Q. Bình Tân (Ngã Tư Bốn Xã), TP. HCM" target="_blank"
                    rel="noopener nofollow" href="https://g.page/cps386hcm/" class="map"><svg width="16" height="16"
                      viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="161 Nguyễn Sơn, P. Phú Thạnh, Q. Tân Phú, TP. HCM" class="address">
                  161 Nguyễn Sơn, P. Phú Thạnh, Q. Tân Phú, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871016161" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871016161</span></a>
                  <a title="161 Nguyễn Sơn, P. Phú Thạnh, Q. Tân Phú, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://g.page/cps161hcm?share" class="map"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="449 - 451 Tân Kỳ Tân Quý, P. Tân Quý, Q. Tân Phú, TP. HCM" class="address">
                  449 - 451 Tân Kỳ Tân Quý, P. Tân Quý, Q. Tân Phú, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871000449" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871000449</span></a>
                  <a title="449 - 451 Tân Kỳ Tân Quý, P. Tân Quý, Q. Tân Phú, TP. HCM" target="_blank"
                    rel="noopener nofollow" href="https://g.page/r/CcJ6J_Hle1tzEAE" class="map"><svg width="16"
                      height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="472 - 474 Lê Trọng Tấn, P. Tây Thạnh, Q. Tân Phú, TP. HCM" class="address">
                  472 - 474 Lê Trọng Tấn, P. Tây Thạnh, Q. Tân Phú, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871000472" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871000472</span></a>
                  <a title="472 - 474 Lê Trọng Tấn, P. Tây Thạnh, Q. Tân Phú, TP. HCM" target="_blank"
                    rel="noopener nofollow" href="https://g.page/cps472hcm?share" class="map"><svg width="16"
                      height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
            <div class="swiper-slide" style="margin-right: 10px">
              <div class="box-on-stock-item">
                <p title="114 Phan Đăng Lưu, P. 3, Q. Phú Nhuận, TP. HCM" class="address">
                  114 Phan Đăng Lưu, P. 3, Q. Phú Nhuận, TP. HCM
                </p>
                <div class="d-flex">
                  <a href="tel:02871097020" class="phone disabled"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.33333 2.66675H6L7.33333 6.00008L5.66667 7.00008C6.38064 8.44777 7.55231 9.61944 9 10.3334L10 8.66675L13.3333 10.0001V12.6667C13.3333 13.0204 13.1929 13.3595 12.9428 13.6096C12.6928 13.8596 12.3536 14.0001 12 14.0001C9.39951 13.842 6.94677 12.7377 5.10455 10.8955C3.26234 9.05331 2.15803 6.60057 2 4.00008C2 3.64646 2.14048 3.30732 2.39052 3.05727C2.64057 2.80722 2.97971 2.66675 3.33333 2.66675Z"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M10 4.66675C10.3536 4.66675 10.6928 4.80722 10.9428 5.05727C11.1929 5.30732 11.3333 5.64646 11.3333 6.00008"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M10 2C11.0609 2 12.0783 2.42143 12.8284 3.17157C13.5786 3.92172 14 4.93913 14 6"
                        stroke="var(--irus-color-accent)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>02871097020</span></a>
                  <a title="114 Phan Đăng Lưu, P. 3, Q. Phú Nhuận, TP. HCM" target="_blank" rel="noopener nofollow"
                    href="https://g.page/cps114hcm?share" class="map"><svg width="16" height="16" viewBox="0 0 16 16"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 7.33325C6 7.86368 6.21071 8.37239 6.58579 8.74747C6.96086 9.12254 7.46957 9.33325 8 9.33325C8.53043 9.33325 9.03914 9.12254 9.41421 8.74747C9.78929 8.37239 10 7.86368 10 7.33325C10 6.80282 9.78929 6.29411 9.41421 5.91904C9.03914 5.54397 8.53043 5.33325 8 5.33325C7.46957 5.33325 6.96086 5.54397 6.58579 5.91904C6.21071 6.29411 6 6.80282 6 7.33325Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path
                        d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
                        stroke="#18181B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{{ $t('product.viewOnMap') }}</span></a>
                </div>
              </div>
            </div>
          </div>
          <div class="swiper-button-next button-navigate-thumbnail__next" tabindex="0" role="button"
            aria-label="Next slide" aria-disabled="false">
            <div class="icon">
              <ArrowIcon direction="right" />
            </div>
          </div>
          <div class="swiper-button-prev button-navigate-thumbnail__prev" tabindex="0" role="button"
            aria-label="Previous slide" aria-disabled="false">
            <div class="icon">
              <ArrowIcon direction="left" />
            </div>
          </div>
          <div class="swiper-pagination swiper-pagination-clickable swiper-pagination-bullets" style="display: none">
            <span class="swiper-pagination-bullet swiper-pagination-bullet-active" tabindex="0" role="button"
              aria-label="Go to slide 1"></span>
          </div>
          <span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>
        </div>
      </div>
    </div>
    <div class="box-delivery-address">
      <div class="head">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon">
          <path
            d="M5 17C5 17.5304 5.21071 18.0391 5.58579 18.4142C5.96086 18.7893 6.46957 19 7 19C7.53043 19 8.03914 18.7893 8.41421 18.4142C8.78929 18.0391 9 17.5304 9 17C9 16.4696 8.78929 15.9609 8.41421 15.5858C8.03914 15.2107 7.53043 15 7 15C6.46957 15 5.96086 15.2107 5.58579 15.5858C5.21071 15.9609 5 16.4696 5 17Z"
            stroke="#A1A1AA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          <path
            d="M15 17C15 17.5304 15.2107 18.0391 15.5858 18.4142C15.9609 18.7893 16.4696 19 17 19C17.5304 19 18.0391 18.7893 18.4142 18.4142C18.7893 18.0391 19 17.5304 19 17C19 16.4696 18.7893 15.9609 18.4142 15.5858C18.0391 15.2107 17.5304 15 17 15C16.4696 15 15.9609 15.2107 15.5858 15.5858C15.2107 15.9609 15 16.4696 15 17Z"
            stroke="#A1A1AA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          <path d="M5 17H3V13M2 5H13V17M9 17H15M19 17H21V11M21 11H13M21 11L18 6H13" stroke="#A1A1AA" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round"></path>
          <path d="M3 9H7" stroke="#A1A1AA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
        <p class="title">{{ $t('product.shippingInfo') }}</p>
      </div>
      <div class="content">
        <div class="btn-change-address">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon">
            <path
              d="M6 7.33337C6 7.86381 6.21071 8.37251 6.58579 8.74759C6.96086 9.12266 7.46957 9.33337 8 9.33337C8.53043 9.33337 9.03914 9.12266 9.41421 8.74759C9.78929 8.37251 10 7.86381 10 7.33337C10 6.80294 9.78929 6.29423 9.41421 5.91916C9.03914 5.54409 8.53043 5.33337 8 5.33337C7.46957 5.33337 6.96086 5.54409 6.58579 5.91916C6.21071 6.29423 6 6.80294 6 7.33337Z"
              stroke="#3B82F6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path
              d="M11.7712 11.1047L8.94251 13.9334C8.6925 14.1831 8.35356 14.3234 8.00017 14.3234C7.64678 14.3234 7.30785 14.1831 7.05784 13.9334L4.22851 11.1047C3.48265 10.3588 2.97473 9.40852 2.76896 8.37396C2.5632 7.3394 2.66883 6.26706 3.07251 5.29254C3.47618 4.31801 4.15977 3.48508 5.03683 2.89905C5.91388 2.31303 6.94502 2.00024 7.99984 2.00024C9.05466 2.00024 10.0858 2.31303 10.9629 2.89905C11.8399 3.48508 12.5235 4.31801 12.9272 5.29254C13.3308 6.26706 13.4365 7.3394 13.2307 8.37396C13.0249 9.40852 12.517 10.3588 11.7712 11.1047Z"
              stroke="#3B82F6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          <span>{{ $t('product.selectAddressForOffer') }}</span>
          <div class="label-new">{{ $t('product.newLabel') }}</div>
        </div>
      </div>
    </div>
    <div>
      <div user="[object Object]" data-fetch-key="BoxOrderButton:0">
        <div class="box-order-button-container">
          <div class="mb-3 d-flex justify-content-between" style="gap: 6px">
            <div class="installment-wrapper">
              <div style="height: 100%">
                <button id="installmentCta" class="btn-cta installment-group-cta">
                  <strong>{{ $t('common.installment0') }}</strong>
                </button>
              </div>
            </div>
            <button
              class="btn-cta order-button button--large d-flex justify-content-center align-items-center"
              :disabled="cartBusy"
              @click="buyCurrentProductNow"
            >
              <strong>{{ $t('common.buyNowAction') }}</strong>
              <span>{{ $t('product.fastDeliveryNote') }}</span>
            </button>
            <button
              class="btn-cta button button--small add-to-cart-button"
              :disabled="cartBusy"
              @click="addCurrentProductToCart()"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="">
                <circle cx="6" cy="19" r="2" stroke="var(--irus-color-accent)" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round"></circle>
                <circle cx="17" cy="19" r="2" stroke="var(--irus-color-accent)" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round"></circle>
                <path d="M17 17H6V3H4" stroke="var(--irus-color-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                </path>
                <path
                  d="M6.07126 4.00254C5.52038 3.96319 5.0419 4.37786 5.00254 4.92874C4.96319 5.47962 5.37786 5.9581 5.92874 5.99746L6.07126 4.00254ZM11.9337 6.42646C12.4846 6.46581 12.9631 6.05114 13.0025 5.50026C13.0418 4.94938 12.6271 4.4709 12.0763 4.43154L11.9337 6.42646ZM20.1329 12.1438C20.2112 11.5971 19.8315 11.0904 19.2848 11.0121C18.7381 10.9338 18.2314 11.3135 18.1531 11.8602L20.1329 12.1438ZM19 13V14C19.4975 14 19.9193 13.6343 19.9899 13.1418L19 13ZM6 12C5.44772 12 5 12.4477 5 13C5 13.5523 5.44772 14 6 14V12ZM5.92874 5.99746L11.9337 6.42646L12.0763 4.43154L6.07126 4.00254L5.92874 5.99746ZM18.1531 11.8602L18.0101 12.8582L19.9899 13.1418L20.1329 12.1438L18.1531 11.8602ZM19 12H6V14H19V12Z"
                  fill="var(--irus-color-accent)"></path>
                <path
                  d="M15 5C14.4477 5 14 5.44772 14 6C14 6.55228 14.4477 7 15 7V5ZM21 7C21.5523 7 22 6.55228 22 6C22 5.44772 21.5523 5 21 5V7ZM19 3C19 2.44772 18.5523 2 18 2C17.4477 2 17 2.44772 17 3H19ZM17 9C17 9.55228 17.4477 10 18 10C18.5523 10 19 9.55228 19 9H17ZM15 7H21V5H15V7ZM17 3V9H19V3H17Z"
                  fill="var(--irus-color-accent)"></path>
              </svg>
              <strong class="">{{ $t('product.addToCart') }}</strong>
            </button>
          </div>
        </div>
      </div>
    </div>
    <ProductSuggest />
    <ProductBoxWarranty />
    <div></div>
    <div></div>
    <div></div>
    <div style="">
      <div></div>
    </div>
  </div>
</template>
<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import ProductBoxWarranty from "@/components/Products/ProductDetail/ProductBoxWarranty.vue";
import ProductSuggest from "@/components/Products/ProductDetail/ProductSuggest.vue";
import ArrowIcon from "@/components/Icons/ArrowIcon.vue";
import { useProductStore } from '@/stores/productStore';
import { useCartActions } from '@/composables/useCartActions';

const productStore = useProductStore();
const { cartBusy, addCurrentProductToCart, buyCurrentProductNow } = useCartActions();
const route = useRoute();
const router = useRouter();

const buildColorHref = (color) => {
  if (!color?.productId) {
    return route.fullPath;
  }

  const query = new URLSearchParams();
  Object.entries(route.query || {}).forEach(([key, value]) => {
    if (value == null || key === "product_id") return;
    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
      return;
    }
    query.set(key, value);
  });
  query.set("product_id", color.productId);

  return `${route.path}?${query.toString()}`;
};

const handleChangeStorage = async (storage) => {
  if (!storage?.url || storage.active) return;

  await router.push(storage.url);
};

const handleChangeColor = async (color) => {
  if (!color || color.active || !color.productId) return;

  productStore.selectColorVariant(color.productId);

  await router.replace({
    path: route.path,
    query: {
      ...route.query,
      product_id: color.productId,
    },
  });
};

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const rootEl = ref(null);
let morePromotionSwiper = null;
let onStockSwiper = null;

const initMorePromotionSwiper = async () => {
  if (!import.meta.client || !rootEl.value) return;

  const [{ default: Swiper }, modules] = await Promise.all([
    import("swiper"),
    import("swiper/modules"),
  ]);

  const { Navigation, Pagination } = modules;
  const promotionEl = rootEl.value.querySelector(".box-more-promotion-swiper");

  if (!promotionEl) return;

  if (morePromotionSwiper && !morePromotionSwiper.destroyed) {
    morePromotionSwiper.destroy(true, true);
  }

  morePromotionSwiper = new Swiper(promotionEl, {
    modules: [Navigation, Pagination],
    slidesPerView: "auto",
    spaceBetween: 8,
    navigation: {
      nextEl: promotionEl.querySelector(".swiper-button-next"),
      prevEl: promotionEl.querySelector(".swiper-button-prev"),
    },
    pagination: {
      el: promotionEl.querySelector(".swiper-pagination"),
      clickable: true,
    },
    observer: true,
    observeParents: true,
  });
};

const initOnStockSwiper = async () => {
  if (!import.meta.client || !rootEl.value) return;

  const [{ default: Swiper }, modules] = await Promise.all([
    import("swiper"),
    import("swiper/modules"),
  ]);

  const { Navigation, Pagination } = modules;
  const onStockEl = rootEl.value.querySelector(
    ".box-on-stock-address .swiper-container.swiper-pdp"
  );

  if (!onStockEl) return;

  if (onStockSwiper && !onStockSwiper.destroyed) {
    onStockSwiper.destroy(true, true);
  }

  onStockSwiper = new Swiper(onStockEl, {
    modules: [Navigation, Pagination],
    slidesPerView: "auto",
    spaceBetween: 10,
    navigation: {
      nextEl: onStockEl.querySelector(".button-navigate-thumbnail__next"),
      prevEl: onStockEl.querySelector(".button-navigate-thumbnail__prev"),
    },
    pagination: {
      el: onStockEl.querySelector(".swiper-pagination"),
      clickable: true,
    },
    observer: true,
    observeParents: true,
  });
};

onMounted(async () => {
  await nextTick();
  await initMorePromotionSwiper();
  await initOnStockSwiper();
});

onBeforeUnmount(() => {
  if (morePromotionSwiper && !morePromotionSwiper.destroyed) {
    morePromotionSwiper.destroy(true, true);
  }
  if (onStockSwiper && !onStockSwiper.destroyed) {
    onStockSwiper.destroy(true, true);
  }
  morePromotionSwiper = null;
  onStockSwiper = null;
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

.has-text-black {
  color: #0a0a0a !important;
}

.has-text-primary-light {
  color: #ebfffc !important;
}

.has-text-weight-semibold {
  font-weight: 600 !important;
}

.has-text-centered {
  text-align: center !important;
}

.mb-3 {
  margin-bottom: 0.75rem !important;
}

.mx-auto {
  margin-left: auto !important;
  margin-right: auto !important;
}

.my-3 {
  margin-bottom: 0.75rem !important;
  margin-top: 0.75rem !important;
}

.icon {
  align-items: center;
  display: inline-flex;
  height: 0.8rem;
  justify-content: center;
  width: 1.5rem;
  color: #000;
}

.icon.is-small {
  height: 1rem;
  width: 1rem;
}

.button,
.input,
.textarea {
  align-items: center;
  border: 1px solid transparent;
  border-radius: 4px;
  box-shadow: none;
  display: inline-flex;
  font-size: 1rem;
  height: 2.5em;
  justify-content: flex-start;
  line-height: 1.5;
  padding: calc(0.5em - 1px) calc(0.75em - 1px);
  position: relative;
  vertical-align: top;
}

.control {
  box-sizing: border-box;
  clear: both;
  font-size: 1rem;
  position: relative;
  text-align: inherit;
}

.control.has-icons-right .input {
  padding-right: 2.5em;
}

.control.has-icons-right .icon.is-right {
  right: 0;
}

.control.has-icons-left .icon,
.control.has-icons-right .icon {
  color: #dbdbdb;
  height: 2.5em;
  pointer-events: none;
  position: absolute;
  top: 0;
  width: 2.5em;
  z-index: 4;
}

.box-detail-product__box-center {
  height: max-content;
  overflow-x: hidden;
  padding: 0;
  position: sticky;
  top: 88px;
  width: 50%;
  z-index: 10;
}

.box-detail-product__box-center .box-product-promotion {
  padding: 8px 12px 12px;
  position: relative;
}

.box-detail-product__box-center .box-product-promotion .box-product-promotion-header {
  font-size: 16px;
}

.box-detail-product__box-center .box-product-promotion .box-product-promotion-header svg {
  height: 20px !important;
  width: 18px;
}

.box-delivery-address {
  background: #f7f7f8;
  border-radius: 12px;
  margin-top: 12px;
  padding: 12px;
}

.box-delivery-address .head {
  align-items: center;
  display: flex;
  gap: 8px;
}

.box-delivery-address .head .icon {
  flex-shrink: 0;
  height: 18px;
  width: 18px;
}

.box-delivery-address .title {
  color: #1d1d20;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.box-delivery-address .content {
  margin-top: 8px;
}

.box-delivery-address .btn-change-address {
  align-items: center;
  color: #3b82f6;
  display: inline-flex;
  flex-wrap: wrap;
  font-size: 14px;
  font-weight: 500;
  gap: 6px;
  line-height: 1.35;
}

.box-delivery-address .btn-change-address .icon {
  flex-shrink: 0;
  height: 16px;
  width: 16px;
}

.box-delivery-address .btn-change-address .label-new {
  background: var(--irus-color-accent);
  border-radius: 999px;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  padding: 3px 8px;
}

.box-order-button-container {
  margin-top: 10px;
}

.box-order-button-container .mb-3 {
  align-items: stretch;
  display: flex;
  gap: 8px;
  margin-bottom: 0 !important;
}

.box-order-button-container .btn-cta {
  align-items: center;
  border: 1px solid transparent;
  border-radius: 10px;
  display: flex;
  font-family: inherit;
  justify-content: center;
  min-height: 58px;
  padding: 8px 10px;
  text-align: center;
}

.box-order-button-container .installment-wrapper {
  flex: 0 0 22%;
}

.box-order-button-container .installment-group-cta {
  background: #fff;
  border-color: #3b82f6;
  color: #2563eb;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  width: 100%;
}

.box-order-button-container .order-button.button--large {
  background: var(--irus-color-surface-strong);
  border-color: var(--irus-color-accent);
  color: #fff;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  padding-left: 14px;
  padding-right: 14px;
}

.box-order-button-container .order-button.button--large strong {
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
}

.box-order-button-container .order-button.button--large span {
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
}

.box-order-button-container .add-to-cart-button {
  background: #fff;
  border-color: var(--irus-color-accent);
  color: var(--irus-color-accent);
  flex: 0 0 22%;
  gap: 6px;
  white-space: nowrap;
}

.box-order-button-container .add-to-cart-button svg {
  flex-shrink: 0;
  height: 18px;
  width: 18px;
}

.box-order-button-container .add-to-cart-button strong {
  color: var(--irus-color-accent);
  font-size: 14px;
  font-weight: 700;
}

.box-product-price {
  background:
    linear-gradient(to top right, #fcfeff, #eff5ff) padding-box,
    linear-gradient(to top right, #dbe8fe, #609afa) border-box;
  border: 1px solid transparent;
  border-radius: 16px;
  box-sizing: border-box;
  margin-bottom: 16px;
  max-width: 584px;
  padding: 6px 8px;
  width: 100%;
}

.box-product-price-wrapper {
  align-items: center;
  display: flex;
  gap: 16px;
}

.box-product-price .exclusive-price-block {
  background: transparent;
  margin: 0;
  padding: 0;
}

.box-product-price .exclusive-price-block .promotion-row {
  align-items: center;
  display: flex;
  flex: 1;
  gap: 8px;
}

.box-product-price .exclusive-price-block .promotion-row__icon {
  max-width: 36px;
  width: 100%;
}

.box-product-price .exclusive-price-block .promotion-row__icon img {
  object-fit: contain;
  width: 100%;
}

.box-product-price .exclusive-price-block .promotion-row__ct {
  color: #1d1d20;
  font-size: 12px;
  font-weight: 400;
  padding-right: 10px;
}

.box-product-price .exclusive-price-block .promotion-row__ct .bold {
  color: #1d1d20;
  font-size: 14px;
  font-weight: 600;
}

.box-product-price .exclusive-price-block .promotion-row__ct .txt {
  display: inline;
  margin-right: 4px;
}

.box-product-price .exclusive-price-block .promotion-row__ct .link {
  display: inline-flex;
}

.box-product-price .exclusive-price-block .promotion-row__ct .link:hover {
  text-decoration: underline;
}

.box-product-price .devide-price-label {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
}

.box-product-price .devide-price-label p {
  color: #71717a;
  font-size: 12px;
}

.box-product-price .devide-price-label .divide {
  border-right: 1px solid #bfd7fe;
  height: 22px;
  width: 1px;
}

.box-product-price .price-label-container,
.box-product-price .trade-price-label {
  flex: 1;
  min-width: 0;
}

.box-product-price .price-label-container .d-flex,
.box-product-price .trade-price-label .d-flex {
  flex-direction: column;
  flex-wrap: wrap;
  gap: 0;
  justify-content: center;
}

.box-product-price .price-label-container .d-flex .sale-price,
.box-product-price .trade-price-label .d-flex .sale-price {
  color: #1d1d20;
  font-size: 20px;
  font-weight: 600;
  line-height: 100%;
}

.box-product-price .price-label-container .d-flex .base-price,
.box-product-price .trade-price-label .d-flex .base-price {
  color: #a1a1aa;
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
}

.box-product-price .price-label-container .price-label,
.box-product-price .trade-price-label .price-label {
  align-items: center;
  color: #1d1d20;
  display: flex;
  font-size: 14px;
  font-weight: 500;
  width: fit-content;
}

.box-product-price .trade-price-label {
  text-align: center;
}

.box-product-price .trade-price-label .price-label {
  color: #3b82f6;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 0;
  margin-left: auto;
  margin-right: auto;
  padding: 0 8px 2px;
  width: fit-content;
}

.box-product-price .trade-price-label .trade-price-info>span {
  align-items: center;
  color: #b0b0b0;
  display: flex;
  flex-wrap: wrap;
  font-size: 16px;
  font-weight: 400;
  gap: 6px;
}

.box-product-price .trade-price-label .trade-price-info>span>span {
  color: #1d1d20;
  font-size: 12px;
  font-weight: 400;
  white-space: nowrap;
}

.box-product-price .trade-price-label .trade-price-info>span>span .value {
  color: #3b82f6;
  font-size: 14px;
  font-weight: 600;
}

.box-product-price .trade-price-label .trade-price-info>span>a {
  align-items: center;
  color: var(--irus-color-accent);
  display: inline-flex;
  font-size: 12px;
  font-weight: 500;
  margin-top: 2px;
  text-decoration: none;
  transition: color 0.2s;
  white-space: nowrap;
}

.box-product-price .trade-price-label .trade-price-info>span>a:hover {
  text-decoration: underline;
}

.box-linked {
  margin-bottom: 20px;
}

.box-linked .list-linked {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
}

.box-linked .list-linked .item-linked {
  align-items: center;
  background: #fff;
  border: 2px solid transparent;
  border-radius: 8px;
  box-sizing: border-box;
  color: #1d1d20;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  justify-content: center;
  min-height: 50px;
  outline: 1px solid #e4e4e7;
  outline-offset: -1px;
  padding: 2px 8px;
  position: relative;
  text-align: center;
  text-decoration: none;
  white-space: wrap;
}

.box-linked .list-linked .item-linked>strong {
  font-weight: 500;
}

.box-linked .list-linked .item-linked.active {
  outline: 2px solid var(--irus-color-accent);
  outline-offset: -2px;
}

.box-linked .list-linked .item-linked.active:after {
  align-content: center;
  background-color: var(--irus-color-accent);
  border-radius: 0 4px 0 8px;
  color: #fff;
  content: "✓";
  display: flex;
  font-size: 10px;
  height: 16px;
  justify-content: center;
  padding-bottom: 15px;
  padding-left: 4px;
  position: absolute;
  right: 0;
  top: 0;
  width: 16px;
}

.box-linked .box-title {
  align-items: center;
  display: flex;
  gap: 10px;
  justify-content: space-between;
  margin-bottom: 8px;
}

.box-linked .box-title p {
  color: #1d1d20;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 10px;
}

.box-product-variants {
  margin-bottom: 20px;
}

.box-product-variants .list-variants {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
}

.box-product-variants .list-variants .item-variant {
  align-items: center;
  background: #fff;
  border: 2px solid transparent;
  border-radius: 8px;
  color: #1d1d20;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  gap: 10px;
  justify-content: center;
  outline: 1px solid #e4e4e7;
  outline-offset: -1px;
  position: relative;
  text-decoration: none;
  width: 100%;
}

.box-product-variants .list-variants .item-variant a {
  color: inherit;
  gap: 8px;
  justify-content: flex-start;
  padding: 4px 12px;
  text-decoration: none;
  width: 100%;
}

.box-product-variants .list-variants .item-variant a:hover,
.box-product-variants .list-variants .item-variant a:focus {
  text-decoration: none;
}

.box-product-variants .list-variants .item-variant a span,
.box-product-variants .list-variants .item-variant a strong {
  color: #1d1d20;
  text-align: left;
}

.box-product-variants .list-variants .item-variant a img {
  height: 40px;
  position: relative;
  width: 40px;
}

.box-product-variants .list-variants .item-variant.active {
  outline: 2px solid var(--irus-color-accent);
  outline-offset: -2px;
}

.box-product-variants .list-variants .item-variant.active:after {
  align-content: center;
  background-color: var(--irus-color-accent);
  border-radius: 0 4px 0 8px;
  color: #fff;
  content: "✓";
  display: flex;
  font-size: 10px;
  height: 16px;
  justify-content: center;
  padding-bottom: 15px;
  padding-left: 4px;
  position: absolute;
  right: 0;
  top: 0;
  width: 16px;
}

.box-product-variants .list-variants .item-variant .sticker-flash-sale {
  display: none;
  height: 16px;
  left: 8px;
  position: absolute;
  top: -10px;
}

.box-product-variants .box-title p {
  color: #1d1d20;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 10px;
}

.box-thu-cu-len-doi-v2 {
  align-items: center;
  background-color: #f7f7f8;
  border-radius: 16px;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  padding: 16px;
  width: 100%;
}

.box-thu-cu-len-doi-v2 .box-price {
  align-items: center;
  display: flex;
  gap: 14px;
  justify-content: center;
}

.box-thu-cu-len-doi-v2 .box-price .icon-thu-cu {
  flex-shrink: 0;
  height: 48px;
  width: 48px;
}

.box-thu-cu-len-doi-v2 .box-price .price-thu-cu {
  align-items: center;
  display: flex;
  flex-direction: row;
  text-align: center;
  width: fit-content;
}

.box-thu-cu-len-doi-v2 .box-price .price-thu-cu strong {
  color: #18181b;
  font-size: 20px;
  text-wrap: wrap;
}

.box-thu-cu-len-doi-v2 .box-price .price-thu-cu .divider {
  border-left: 1px solid #cfcfd3;
  height: 12px;
  margin: 0 16px;
  width: 1px;
}

.box-thu-cu-len-doi-v2 .box-price .member-discount {
  font-size: 14px;
  font-weight: 400;
}

.box-thu-cu-len-doi-v2 .btn-submit-search {
  align-items: center;
  background-color: #fbe6e8;
  border: none;
  border-radius: 8px;
  color: var(--irus-color-accent);
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;
  font-weight: 700;
  gap: 4px;
  justify-content: center;
  outline: none;
  padding: 8px 16px;
  width: fit-content;
}

.box-product-promotion {
  background: linear-gradient(249.83deg,
      #eff5ff 3.89%,
      rgba(244, 251, 255, 0.25) 65.75%);
  border: 1px solid #609afa;
  border-radius: 16px;
  overflow: hidden;
  padding: 18px;
  position: relative;
}

.box-product-promotion .box-product-promotion-header {
  align-items: center;
  display: flex;
  font-size: 20px;
  gap: 8px;
  justify-content: start;
  width: 100%;
}

.box-product-promotion .box-product-promotion-header svg {
  height: 24px !important;
  width: 24px;
}

.box-product-promotion-content .list-promotion-pack {
  margin-top: 8px;
}

.box-product-promotion-content .promotion-pack_item {
  align-items: flex-start;
  display: flex;
  gap: 8px;
  justify-content: flex-start;
  margin-top: 8px;
}

.box-product-promotion-content .promotion-pack_item .box-product-promotion-detail {
  color: #1d1d20;
  font-size: 14px;
}

.box-product-promotion-content .box-product-promotion-number {
  background: none;
  height: 24px;
  padding: 2px;
  width: 24px;
}

.box-product-promotion-content .box-product-promotion-number p {
  align-items: center;
  background: linear-gradient(233.74deg, #eff5ff -33.75%, #3b82f6 71.83%);
  border-radius: 50%;
  display: flex;
  font-size: 10px;
  font-weight: 600;
  height: 100%;
  justify-content: center;
  width: 100%;
}

.box-product-promotion-content .box-product-promotion-detail {
  font-size: 14px;
  width: calc(100% - 25px);
}

.box-product-promotion-content .box-product-promotion-detail a {
  color: #3b82f6;
  font-size: 12px;
  font-weight: 500;
  text-wrap: nowrap;
}

.box-product-promotion .show-all {
  min-height: fit-content;
  padding-bottom: 8px;
  transition: min-height 1s ease;
}

.block-special-promotion-banner {
  margin: 10px auto;
}

.block-special-promotion-banner .banner-slide .button__special-promotion-banner {
  display: block;
  width: 100%;
}

.block-special-promotion-banner .banner-slide .button__special-promotion-banner img {
  border-radius: 5px;
  display: block;
  width: 100%;
}

.block-special-promotion-banner .banner-slide.swiper-container .swiper-wrapper {
  align-items: center;
}

.block-special-promotion-banner .banner-slide.swiper-container .swiper-wrapper .swiper-slide {
  border-radius: 5px;
  display: flex;
}

.block-special-promotion-banner .banner-slide .swiper-button-prev {
  border-radius: 0 100px 100px 0;
  left: 0;
  padding-left: 0;
}

.block-special-promotion-banner .banner-slide .swiper-button-next {
  border-radius: 100px 0 0 100px;
  padding-right: 0;
  right: 0;
}

.block-special-promotion-banner .banner-slide .swiper-button-next,
.block-special-promotion-banner .banner-slide .swiper-button-prev {
  background-color: #fff;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.1);
  font-size: 1.8rem;
  height: 40px;
  margin: 0 0 10px;
  opacity: 0.7;
  outline: none;
  top: calc(50% - 20px);
  transition: 0.3s;
  width: 20px;
}

.block-special-promotion-banner .banner-slide .swiper-button-next .icon,
.block-special-promotion-banner .banner-slide .swiper-button-prev .icon {
  width: 15px;
}

.block-special-promotion-banner .banner-slide .swiper-button-next .icon svg,
.block-special-promotion-banner .banner-slide .swiper-button-prev .icon svg {
  fill: #707070;
}

.block-special-promotion-banner .banner-slide .swiper-button-next.swiper-button-disabled,
.block-special-promotion-banner .banner-slide .swiper-button-next:after,
.block-special-promotion-banner .banner-slide .swiper-button-prev.swiper-button-disabled,
.block-special-promotion-banner .banner-slide .swiper-button-prev:after {
  display: none;
}

.block-special-promotion-banner #modalVoucher .modal-card-body .icon-check-outline {
  text-align: center;
}

.block-special-promotion-banner #modalVoucher .modal-card-body p.title-promo {
  color: #5ac955;
  font-size: 24px;
  text-align: center;
}

.block-special-promotion-banner #modalVoucher .modal-card-body .description-promo {
  margin: 12px auto;
}

.block-special-promotion-banner #modalVoucher .modal-card-body .voucher-clipboard-outline {
  text-align: center;
}

.block-special-promotion-banner #modalVoucher footer.modal-card-foot .button {
  background-color: var(--irus-color-accent);
  color: #fff;
  font-weight: 600;
  transition: 0.3s;
  width: 100%;
}

#modalLuckyWheel .modal-card-body p.title {
  font-size: 24px;
  font-weight: 600;
  margin: 20px auto;
  text-align: center;
  text-transform: uppercase;
}

#modalLuckyWheel .modal-card-body .field,
#modalLuckyWheel .modal-card-body p.has-text-centered {
  display: block;
  margin: auto;
  max-width: 375px;
}

#modalLuckyWheel .modal-card-body .field input:focus,
#modalLuckyWheel .modal-card-body p.has-text-centered input:focus {
  border-color: #a6a6a6;
  box-shadow: 0 0 0 0.18px hsla(0, 0%, 78%, 0.25);
}

#modalLuckyWheel .modal-card-body .field .icon,
#modalLuckyWheel .modal-card-body p.has-text-centered .icon {
  background-color: #f2f2f3;
  border-radius: 50%;
  height: 1.5rem;
  pointer-events: auto;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 1.5rem;
}

#modalLuckyWheel .modal-card-body .otp-input {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

#modalLuckyWheel .modal-card-body .otp-input input {
  background-color: #fff;
  border: 2px solid #d7d7d7;
  border-radius: 12px;
  color: #000;
  font-size: 1.5rem;
  height: 50px;
  margin: 0 8px;
  text-align: center;
  transition: all 0.3s ease;
  width: 50px;
}

#modalLuckyWheel .modal-card-body button.button {
  background: #f2f2f3;
  border: 0;
  display: block;
  margin: 20px auto;
  max-width: 375px;
  width: 100%;
}

#modalLuckyWheel .modal-card-body button.button.close {
  background: transparent;
  height: 50px;
  margin: 0;
  padding: 0;
  position: absolute;
  right: 15px;
  top: 15px;
  width: 50px;
}

#modalLuckyWheel .modal-card-body button.button.submit-phone:not([disabled]) {
  background: var(--irus-color-accent);
  color: #fff;
}

.modal-card-body--rounded {
  border-radius: 8px;
}

.box-more-promotion {
  background: #f7f7f8;
  border-radius: 16px;
  overflow: hidden;
  padding: 8px 12px 26px;
  position: relative;
}

.box-more-promotion .box-more-promotion-title {
  align-items: center;
  display: flex;
  font-size: 16px;
  gap: 8px;
  justify-content: flex-start;
  margin-bottom: 12px;
}

.box-more-promotion .box-more-promotion-title svg {
  flex-shrink: 0;
  height: 21px;
  width: 18px;
}

.box-more-promotion .box-more-promotion-swiper.swiper-container {
  --swiper-theme-color: var(--irus-color-accent);
  cursor: grabbing;
  padding-bottom: 0;
  position: static;
}

.box-more-promotion .box-more-promotion-swiper :deep(.swiper-pagination) {
  bottom: 6px;
}

.box-more-promotion .box-more-promotion-swiper :deep(.swiper-pagination .swiper-pagination-bullet) {
  background-color: #e4e4e7;
  border-radius: 50px;
  height: 2px;
  margin: 0 2px;
  opacity: 1;
  transition: 0.3s;
  width: 8px;
}

.box-more-promotion .box-more-promotion-swiper :deep(.swiper-pagination .swiper-pagination-bullet-active) {
  background: var(--irus-color-accent);
  border-radius: 50px;
  width: 16px;
}

.box-more-promotion .box-more-promotion-swiper :deep(.swiper-button-next),
.box-more-promotion .box-more-promotion-swiper :deep(.swiper-button-prev) {
  align-items: center;
  background-color: #fff;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  font-size: 1.8rem;
  /* height: 60px; */
  justify-content: center;
  margin: 0;
  opacity: 1;
  outline: none;
  top: 50%;
  transform: translateY(-50%);
  transition: 0.3s;
  width: 30px;
  z-index: 2;
}

.box-more-promotion .box-more-promotion-swiper :deep(.swiper-button-prev) {
  border-radius: 0 100px 100px 0;
  left: -8px;
  padding-left: 0;
}

.box-more-promotion .box-more-promotion-swiper :deep(.swiper-button-next) {
  border-radius: 100px 0 0 100px;
  padding-right: 0;
  right: -8px;
}

.box-more-promotion .box-more-promotion-swiper :deep(.swiper-button-next .icon),
.box-more-promotion .box-more-promotion-swiper :deep(.swiper-button-prev .icon) {
  align-items: center;
  color: #707070;
  display: flex;
  justify-content: center;
  line-height: 1;
}

.box-more-promotion .box-more-promotion-swiper :deep(.swiper-button-next .icon svg),
.box-more-promotion .box-more-promotion-swiper :deep(.swiper-button-prev .icon svg) {
  fill: #707070;
  transform: translateY(-1px);
}

.box-more-promotion .box-more-promotion-swiper :deep(.swiper-button-next:after),
.box-more-promotion .box-more-promotion-swiper :deep(.swiper-button-prev:after) {
  display: none;
}

.box-more-promotion .box-more-promotion-slide {
  height: auto;
}

.box-more-promotion .box-more-promotion-item {
  align-items: center;
  background: #fff;
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  color: inherit;
  display: flex;
  gap: 6px;
  /* height: calc(100% - 18px); */
  mask:
    radial-gradient(circle 8px at left center, transparent 98%, #000) left,
    radial-gradient(circle 8px at right center, transparent 98%, #000) right,
    linear-gradient(#000, #000);
  mask-composite: exclude;
  mask-repeat: no-repeat;
  min-height: 57px;
  padding: 8px 12px;
  position: relative;
  text-decoration: none;
}

.box-more-promotion .box-more-promotion-item__head {
  align-items: center;
  display: flex;
  gap: 4px;
  justify-content: space-between;
  width: 38px;
}

.box-more-promotion .box-more-promotion-item__head .icon {
  display: block;
  flex-shrink: 0;
  max-width: 32px;
  object-fit: contain;
  width: 100%;
}

.box-more-promotion .box-more-promotion-item__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
}

.box-more-promotion .box-more-promotion-item__info {
  align-items: center;
  display: flex;
  gap: 4px;
  justify-content: space-between;
}

.box-more-promotion .box-more-promotion-item__date {
  background-color: #dbe8fe;
  border-radius: 3px;
  color: #1d1d20;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: -0.2px;
  margin: 0;
  padding: 1px 4px;
  text-align: center;
}

.box-more-promotion .box-more-promotion-item__date--ongoing {
  background-color: #dff9e8;
  color: #1b4c2f;
  font-weight: 500;
}

.box-more-promotion .box-more-promotion-item__desc {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #1d1d20;
  display: -webkit-box;
  font-size: 12px;
  line-clamp: 2;
  line-height: 150%;
  margin: 0;
  overflow: hidden;
}

.box-more-promotion .box-more-promotion-item__link {
  align-items: center;
  color: #3b82f6;
  display: inline-flex;
  flex: 1;
  flex-wrap: nowrap;
  font-size: 10px;
  font-weight: 500;
  justify-content: flex-end;
  text-align: right;
  text-decoration: none;
  white-space: nowrap;
}

.box-on-stock-stores {
  background-color: #f7f7f8;
  border-radius: 16px;
  margin-top: 8px;
  padding: 16px;
}

.box-on-stock-stores .box-on-stock-option-location {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
}

.box-on-stock-stores .box-on-stock-option-location .box-on-stock-option {
  align-items: center;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  height: 40px;
  padding: 5px 10px;
  position: relative;
  text-align: left;
  transition: box-shadow 0.3s ease-in;
  width: calc(33.33333% - 10px);
}

.box-on-stock-stores .box-on-stock-option-location .box-on-stock-option select {
  appearance: none;
  border: none;
  border-radius: 10px;
  color: #18181b;
  cursor: pointer;
  height: 100%;
  padding: 5px 30px 5px 10px;
  width: 100%;
}

.box-on-stock-stores .box-on-stock-option-location .box-on-stock-option .icon-down {
  align-items: center;
  display: flex;
  height: 16px;
  justify-content: center;
  pointer-events: none;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
}

.box-on-stock-stores .box-on-stock-count {
  font-size: 14px;
}

.box-on-stock-stores .box-on-stock-count span {
  color: #3b82f6;
  font-weight: 700;
}

.box-on-stock-stores .box-on-stock-address .swiper-slide {
  width: auto !important;
}

.box-on-stock-stores .box-on-stock-address .box-on-stock-item {
  background-color: #fff;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  flex-shrink: 0;
  font-size: 12px;
  padding: 12px;
  width: 240px;
}

.box-on-stock-stores .box-on-stock-address .box-on-stock-item .address {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #18181b;
  display: -webkit-box;
  height: 36px;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.box-on-stock-stores .box-on-stock-address .box-on-stock-item .map,
.box-on-stock-stores .box-on-stock-address .box-on-stock-item .phone {
  align-items: center;
  border-radius: 16px;
  display: flex;
  gap: 4px;
  padding: 3px 8px;
}

.box-on-stock-stores .box-on-stock-address .box-on-stock-item .phone {
  background-color: #fbe6e8;
  border: 1px solid #fbe6e8;
  color: var(--irus-color-accent);
  fill: var(--irus-color-accent);
  margin-right: 8px;
}

.box-on-stock-stores .box-on-stock-address .box-on-stock-item .phone.disabled {
  cursor: default;
  pointer-events: none;
}

.box-on-stock-stores .box-on-stock-address .box-on-stock-item .map {
  border: 1px solid #cfcfd3;
  color: #18181b;
  stroke: #18181b;
}

.box-on-stock-stores .box-on-stock-address .swiper-container.swiper-pdp {
  overflow: hidden;
  position: relative;
}

.box-on-stock-stores .box-on-stock-address .swiper-container.swiper-pdp .swiper-button-next {
  right: 8px;
}

.swiper-container.swiper-pdp:has(.swiper-pagination):has(.swiper-pagination > .swiper-pagination-bullet:nth-child(n + 2)) {
  padding-bottom: 20px;
}

.swiper-container.swiper-pdp:has(.swiper-pagination):has(.swiper-pagination > .swiper-pagination-bullet:nth-child(n + 2)) .swiper-button-next,
.swiper-container.swiper-pdp:has(.swiper-pagination):has(.swiper-pagination > .swiper-pagination-bullet:nth-child(n + 2)) .swiper-button-prev {
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

.swiper-container.swiper-pdp .swiper-pagination .swiper-pagination-bullet {
  background: #e4e4e7;
  border-radius: 4px;
  height: 2px;
  margin: 0;
  opacity: 1;
  transition: all 0.3s ease-in-out;
  width: 8px;
}

.swiper-container.swiper-pdp .swiper-pagination .swiper-pagination-bullet.swiper-pagination-bullet-active {
  background: var(--irus-color-accent);
  width: 16px;
}

.modal {
  align-items: center;
  display: none;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  position: fixed;
  z-index: 40;
}

.modal.is-active {
  display: flex;
}

.modal-background {
  background-color: hsla(0, 0%, 4%, 0.86);
}

.modal-card {
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 40px);
  overflow: hidden;
  position: relative;
  width: 100%;
}

.modal-card-foot {
  align-items: center;
  background-color: #f5f5f5;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  border-top: 1px solid #dbdbdb;
  display: flex;
  flex-shrink: 0;
  justify-content: flex-start;
  padding: 20px;
  position: relative;
}

.modal-card-body {
  background-color: #fff;
  flex-grow: 1;
  flex-shrink: 1;
  overflow: auto;
  padding: 20px;
}

@media only screen and (max-width: 1199px) {
  .box-linked .list-linked .item-linked {
    font-size: 12px;
  }
}

@media only screen and (max-width: 990px) {
  .box-detail-product__box-center {
    max-width: 100%;
    width: 100%;
  }

  .box-product-price {
    max-width: 100%;
    width: 100%;
  }

  .box-product-price-wrapper {
    gap: clamp(8px, 2vw, 16px);
  }

  .box-product-price .price-label-container .d-flex .sale-price,
  .box-product-price .trade-price-label .d-flex .sale-price {
    font-size: clamp(18px, 2.6vw, 20px);
    overflow-wrap: anywhere;
  }

  .box-product-price .price-label-container .d-flex .base-price,
  .box-product-price .trade-price-label .d-flex .base-price {
    font-size: clamp(12px, 1.8vw, 14px);
  }

  .box-product-price .exclusive-price-block .promotion-row__ct {
    padding-right: 0;
  }

  .box-product-price .exclusive-price-block .promotion-row__ct,
  .box-product-price .trade-price-label .trade-price-info>span>span,
  .box-product-price .trade-price-label .trade-price-info>span>a {
    font-size: clamp(11px, 1.8vw, 12px);
  }

  .box-product-variants .list-variants {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media only screen and (max-width: 768px) {
  .box-detail-product__box-center {
    position: relative;
    top: 10px !important;
    width: 100%;
  }

  .box-product-variants .list-variants {
    grid-template-columns: repeat(3, 1fr);
  }

  .box-product-variants .list-variants .item-variant,
  .box-linked .list-linked .item-linked {
    font-size: 12px;
  }

  .box-more-promotion .box-more-promotion-item {
    gap: 4px;
  }
}

@media only screen and (max-width: 540px) {
  .box-product-price {
    border-radius: 12px;
    margin-top: 6px;
    padding: 10px;
  }

  .box-product-price-wrapper {
    align-items: stretch;
    flex-direction: column;
    gap: 8px;
  }

  .box-product-price .price-label-container,
  .box-product-price .trade-price-label {
    width: 100%;
  }

  .box-product-price .price-label-container .d-flex,
  .box-product-price .trade-price-label .d-flex {
    align-items: flex-start !important;
    text-align: left;
  }

  .box-product-price .price-label-container .d-flex .sale-price,
  .box-product-price .trade-price-label .d-flex .sale-price {
    font-size: 18px;
    line-height: 1.2;
  }

  .box-product-price .devide-price-label {
    flex-direction: row;
    gap: 8px;
    width: 100%;
  }

  .box-product-price .devide-price-label .divide {
    border-right: 0;
    border-top: 1px solid #bfd7fe;
    flex: 1;
    height: 1px;
    width: auto;
  }

  .box-product-price .devide-price-label p {
    margin: 0;
  }

  .box-product-price .trade-price-label {
    text-align: left;
  }

  .box-product-price .trade-price-label .price-label {
    margin-left: 0;
    margin-right: 0;
    padding-left: 0;
  }

  .box-product-price .trade-price-label .trade-price-info>span {
    align-items: flex-start;
    gap: 4px;
  }

  .box-product-price .trade-price-label .trade-price-info>span>span,
  .box-product-price .trade-price-label .trade-price-info>span>a {
    white-space: normal;
  }

  .box-product-price .exclusive-price-block .promotion-row {
    align-items: flex-start;
  }

  .box-product-price .exclusive-price-block .promotion-row__icon {
    flex: 0 0 28px;
    max-width: 28px;
  }

  .box-product-price .exclusive-price-block .promotion-row__icon i {
    font-size: 1.25rem !important;
  }

  .box-product-price .exclusive-price-block .promotion-row__ct,
  .box-product-price .exclusive-price-block .promotion-row__ct .bold {
    font-size: 12px;
  }

  .box-product-promotion {
    padding: 12px;
  }

  .box-on-stock-stores {
    background-color: transparent;
    border-radius: 0;
    padding: 0;
  }

  .box-on-stock-stores .box-on-stock-option-location {
    margin-bottom: 8px;
  }

  .box-on-stock-stores .box-on-stock-option-location .box-on-stock-option {
    width: 100%;
  }

  .box-delivery-address {
    border-radius: 10px;
    padding: 10px;
  }

  .box-order-button-container .mb-3 {
    gap: 6px;
  }

  .box-order-button-container .installment-wrapper,
  .box-order-button-container .add-to-cart-button {
    flex-basis: 23%;
  }

  .box-order-button-container .btn-cta {
    min-height: 52px;
    padding: 6px 8px;
  }

  .box-order-button-container .installment-group-cta,
  .box-order-button-container .add-to-cart-button strong {
    font-size: 13px;
  }

  .box-order-button-container .order-button.button--large strong {
    font-size: 18px;
  }

  .box-order-button-container .order-button.button--large span {
    font-size: 11px;
  }
}
</style>
