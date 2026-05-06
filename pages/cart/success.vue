<template>
  <section class="order-success-page">
    <div class="container">
      <CheckoutProgress :current-step="4" />

      <!-- ── Phase: confirming ── -->
      <div v-if="phase === 'confirming'" class="order-success-page__card">
        <div class="order-success-page__icon order-success-page__icon--confirming">
          <i class="bi bi-arrow-repeat spin"></i>
        </div>
        <h1 class="order-success-page__title">{{ $t("payment.confirmingPayment") }}</h1>
        <p class="order-success-page__message">{{ $t("payment.confirmingDesc") }}</p>

        <div v-if="resolvedOrderId" class="order-success-page__order-number">
          <span class="order-success-page__label">{{ $t("orderSuccess.orderNumber") }}</span>
          <strong>{{ resolvedOrderId }}</strong>
        </div>

        <div class="order-success-page__polling-bar">
          <div class="order-success-page__polling-dots">
            <span></span><span></span><span></span>
          </div>
          <span>{{ $t("payment.pollingIndicator") }}</span>
        </div>

        <!-- Mobile: hien thi trang thai cho poll -->
        <div v-if="mobilePollResult" class="order-success-page__mobile-result">
          <div v-if="mobilePollResult.timeout" class="order-success-page__mobile-result-timeout">
            <i class="bi bi-clock-fill"></i>
            {{ $t("payment.confirmTimeout") }}
          </div>
          <div v-else-if="mobilePollResult.error" class="order-success-page__mobile-result-error">
            <i class="bi bi-exclamation-triangle-fill"></i>
            Đã xảy ra lỗi khi xác nhận thanh toán
          </div>
        </div>
      </div>

      <!-- ── Phase: no-info ── -->
      <div v-else-if="phase === 'no-info'" class="order-success-page__card">
        <div class="order-success-page__icon order-success-page__icon--failed">
          <i class="bi bi-exclamation-triangle-fill"></i>
        </div>
        <h1 class="order-success-page__title">{{ $t("payment.noPaymentInfo") }}</h1>
        <p class="order-success-page__message">{{ $t("payment.noPaymentInfoDesc") }}</p>
        <div class="order-success-page__actions">
          <button
            type="button"
            class="order-success-page__btn order-success-page__btn--primary"
            @click="navigateTo('/')"
          >
            <i class="bi bi-house"></i>
            {{ $t("orderSuccess.gotoHome") }}
          </button>
          <button
            type="button"
            class="order-success-page__btn order-success-page__btn--secondary"
            @click="navigateTo('/cart')"
          >
            <i class="bi bi-cart3"></i>
            {{ $t("orderSuccess.backToCart") }}
          </button>
        </div>
      </div>

      <!-- ── Phase: confirmed ── -->
      <div v-else-if="phase === 'confirmed'" class="order-success-page__confirmed">

        <!-- ══ DESKTOP UI (lg+) ══ -->
        <div v-if="!isMobileRef.value" class="order-success-page__confirmed-desktop">
          <!-- Header row -->
          <div class="order-success-page__desktop-header">
            <div class="order-success-page__desktop-header-left">
              <div class="order-success-page__icon order-success-page__icon--success">
                <i class="bi bi-check-circle-fill"></i>
              </div>
              <div>
                <h1 class="order-success-page__title">{{ $t("payment.confirmSuccess") }}</h1>
                <p class="order-success-page__message">{{ $t("orderSuccess.orderPlaced") }}</p>
              </div>
            </div>

            <!-- Order info: skeleton khi loading -->
            <div class="order-success-page__desktop-header-right">
              <template v-if="!order">
                <div class="order-success-page__skeleton order-success-page__skeleton--order-num"></div>
                <div class="order-success-page__skeleton order-success-page__skeleton--badge"></div>
              </template>
              <template v-else>
                <div class="order-success-page__order-number">
                  <span class="order-success-page__label">{{ $t("orderSuccess.orderNumber") }}</span>
                  <strong>{{ order.orderNumber }}</strong>
                </div>
                <div v-if="order?.payment" class="order-success-page__payment-badge">
                  <i :class="paymentIcon"></i>
                  {{ paymentMethodLabel }}
                  <span class="order-success-page__payment-badge-status">
                    {{ order.payment.statusLabel || order.payment.status }}
                  </span>
                </div>
              </template>
            </div>
          </div>

          <!-- Body: 2 columns -->
          <div v-if="!order" class="order-success-page__desktop-body">
            <!-- Left col skeleton -->
            <div class="order-success-page__desktop-col">
              <div class="order-success-page__bill-section">
                <div class="order-success-page__skeleton-title"></div>
                <div v-for="i in 2" :key="i" class="order-success-page__skeleton-item">
                  <div class="order-success-page__skeleton order-success-page__skeleton--img"></div>
                  <div class="order-success-page__skeleton-item-info">
                    <div class="order-success-page__skeleton order-success-page__skeleton--text"></div>
                    <div class="order-success-page__skeleton order-success-page__skeleton--text-sm"></div>
                  </div>
                  <div class="order-success-page__skeleton order-success-page__skeleton--price"></div>
                </div>
              </div>
              <div class="order-success-page__bill-section">
                <div class="order-success-page__skeleton-title"></div>
                <div class="order-success-page__skeleton order-success-page__skeleton--text"></div>
                <div class="order-success-page__skeleton order-success-page__skeleton--text-sm"></div>
              </div>
            </div>
            <!-- Right col skeleton -->
            <div class="order-success-page__desktop-col">
              <div class="order-success-page__bill-section">
                <div class="order-success-page__skeleton-title"></div>
                <div class="order-success-page__skeleton order-success-page__skeleton--text"></div>
                <div class="order-success-page__skeleton order-success-page__skeleton--text"></div>
                <div class="order-success-page__skeleton order-success-page__skeleton--text"></div>
                <div class="order-success-page__skeleton order-success-page__skeleton--total"></div>
              </div>
              <div class="order-success-page__bill-section">
                <div class="order-success-page__skeleton-title"></div>
                <div class="order-success-page__skeleton order-success-page__skeleton--text"></div>
                <div class="order-success-page__skeleton order-success-page__skeleton--text-sm"></div>
              </div>
            </div>
          </div>

          <div v-else-if="order" class="order-success-page__desktop-body">
            <!-- Left column: Items -->
            <div class="order-success-page__desktop-col">
              <div v-if="order?.items?.length" class="order-success-page__bill-section">
                <h2 class="order-success-page__bill-title">
                  <i class="bi bi-box-seam"></i>
                  {{ $t("payment.billItems") }}
                </h2>
                <div class="order-success-page__bill-items">
                  <div
                    v-for="(item, idx) in order.items"
                    :key="idx"
                    class="order-success-page__bill-item"
                  >
                    <img
                      :src="item.thumbnail || fallbackImage"
                      :alt="item.name"
                      class="order-success-page__bill-item-img"
                      loading="lazy"
                    />
                    <div class="order-success-page__bill-item-info">
                      <p class="order-success-page__bill-item-name">{{ item.name }}</p>
                      <p class="order-success-page__bill-item-meta">
                        {{ item.quantity }} × {{ formatMoney(item.unitPrice) }}
                        <span v-if="item.selectedOptions && Object.keys(item.selectedOptions).length">
                          · {{ Object.values(item.selectedOptions).join(", ") }}
                        </span>
                      </p>
                    </div>
                    <span class="order-success-page__bill-item-total">
                      {{ formatMoney(item.lineTotal) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Shipping -->
              <div v-if="order?.address" class="order-success-page__bill-section">
                <h2 class="order-success-page__bill-title">
                  <i class="bi bi-geo-alt"></i>
                  {{ $t("payment.billShipping") }}
                </h2>
                <div class="order-success-page__bill-address">
                  <strong>{{ order.address.name }}</strong>
                  <span>{{ order.address.phone }}</span>
                  <p>{{ [order.address.line1, order.address.city].filter(Boolean).join(", ") }}</p>
                </div>
              </div>

              <!-- Gateway details -->
              <div v-if="isVNPay || isMoMo" class="order-success-page__bill-section">
                <h2 class="order-success-page__bill-title">
                  <i class="bi bi-info-circle"></i>
                  {{ $t("orderSuccess.transactionDetails") }}
                </h2>
                <template v-if="isVNPay">
                  <div class="order-success-page__detail-row">
                    <span class="order-success-page__detail-key">{{ $t("orderSuccess.bank") }}</span>
                    <span class="order-success-page__detail-val">{{ vnpayData.bankName }}</span>
                  </div>
                  <div v-if="vnpayData.cardType !== 'N/A'" class="order-success-page__detail-row">
                    <span class="order-success-page__detail-key">{{ $t("orderSuccess.cardType") }}</span>
                    <span class="order-success-page__detail-val">{{ vnpayData.cardType }}</span>
                  </div>
                  <div v-if="vnpayData.transactionNo !== 'N/A'" class="order-success-page__detail-row">
                    <span class="order-success-page__detail-key">{{ $t("orderSuccess.transactionNo") }}</span>
                    <span class="order-success-page__detail-val">{{ vnpayData.transactionNo }}</span>
                  </div>
                  <div v-if="vnpayData.payDate" class="order-success-page__detail-row">
                    <span class="order-success-page__detail-key">{{ $t("orderSuccess.transactionDate") }}</span>
                    <span class="order-success-page__detail-val">{{ vnpayData.payDate }}</span>
                  </div>
                </template>
                <template v-else-if="isMoMo">
                  <div class="order-success-page__detail-row">
                    <span class="order-success-page__detail-key">{{ $t("orderSuccess.momoTransactionId") }}</span>
                    <span class="order-success-page__detail-val">{{ momoData.transactionId }}</span>
                  </div>
                </template>
              </div>
            </div>

            <!-- Right column: Pricing + Payment + Actions -->
            <div class="order-success-page__desktop-col">
              <!-- Pricing -->
              <div class="order-success-page__bill-section">
                <h2 class="order-success-page__bill-title">
                  <i class="bi bi-receipt"></i>
                  {{ $t("payment.billSummary") }}
                </h2>
                <dl class="order-success-page__bill-pricing">
                  <div class="order-success-page__bill-pricing-row">
                    <dt>{{ $t("checkout.subtotal") }}</dt>
                    <dd>{{ formatMoney(order?.pricing?.subtotal || 0) }}</dd>
                  </div>
                  <div v-if="order?.pricing?.deliveryFee > 0" class="order-success-page__bill-pricing-row">
                    <dt>{{ $t("checkout.deliveryFee") }}</dt>
                    <dd>{{ formatMoney(order.pricing.deliveryFee) }}</dd>
                  </div>
                  <div v-if="order?.pricing?.voucherDiscount > 0" class="order-success-page__bill-pricing-row order-success-page__bill-pricing-row--discount">
                    <dt>{{ $t("checkout.voucher") }}</dt>
                    <dd>-{{ formatMoney(order.pricing.voucherDiscount) }}</dd>
                  </div>
                  <div v-if="order?.pricing?.freeshipDiscount > 0" class="order-success-page__bill-pricing-row order-success-page__bill-pricing-row--discount">
                    <dt>{{ $t("checkout.freeship") }}</dt>
                    <dd>-{{ formatMoney(order.pricing.freeshipDiscount) }}</dd>
                  </div>
                  <div class="order-success-page__bill-pricing-total">
                    <dt>{{ $t("checkout.total") }}</dt>
                    <dd>{{ formatMoney(order?.pricing?.total || 0) }}</dd>
                  </div>
                </dl>
              </div>

              <!-- Payment info -->
              <div v-if="order?.payment" class="order-success-page__bill-section">
                <h2 class="order-success-page__bill-title">
                  <i class="bi bi-credit-card"></i>
                  {{ $t("payment.billPayment") }}
                </h2>
                <dl class="order-success-page__bill-pricing">
                  <div class="order-success-page__bill-pricing-row">
                    <dt>{{ $t("orderSuccess.amount") }}</dt>
                    <dd class="order-success-page__bill-pricing-row--highlight">{{ formatMoney(order.payment.amount) }}</dd>
                  </div>
                  <div v-if="order.payment.paidAt" class="order-success-page__bill-pricing-row">
                    <dt>{{ $t("orderSuccess.transactionDate") }}</dt>
                    <dd>{{ formatDate(order.payment.paidAt) }}</dd>
                  </div>
                </dl>
              </div>

              <!-- Next steps -->
              <div class="order-success-page__next-steps">
                <h2 class="order-success-page__section-title">{{ $t("orderSuccess.nextSteps") }}</h2>
                <ul class="order-success-page__steps-list">
                  <li class="order-success-page__step">
                    <span class="order-success-page__step-num">1</span>
                    <span>{{ $t("orderSuccess.stepConfirm") }}</span>
                  </li>
                  <li class="order-success-page__step">
                    <span class="order-success-page__step-num">2</span>
                    <span>{{ $t("orderSuccess.stepDelivery") }}</span>
                  </li>
                  <li v-if="paymentMethod === 'cod'" class="order-success-page__step">
                    <span class="order-success-page__step-num">3</span>
                    <span>{{ $t("orderSuccess.stepCod") }}</span>
                  </li>
                </ul>
              </div>

              <!-- Actions -->
              <div class="order-success-page__actions">
                <button
                  type="button"
                  class="order-success-page__btn order-success-page__btn--secondary"
                  @click="navigateTo('/account/orders')"
                >
                  <i class="bi bi-bag"></i>
                  {{ $t("payment.viewOrders") }}
                </button>
                <button
                  type="button"
                  class="order-success-page__btn order-success-page__btn--primary"
                  @click="navigateTo('/')"
                >
                  <i class="bi bi-house"></i>
                  {{ $t("orderSuccess.gotoHome") }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ══ MOBILE UI ══ -->
        <div v-else class="order-success-page__card">
          <div class="order-success-page__icon order-success-page__icon--success">
            <i class="bi bi-check-circle-fill"></i>
          </div>
          <h1 class="order-success-page__title">{{ $t("payment.confirmSuccess") }}</h1>
          <p class="order-success-page__message">{{ $t("orderSuccess.orderPlaced") }}</p>

          <div v-if="order" class="order-success-page__order-number">
            <span class="order-success-page__label">{{ $t("orderSuccess.orderNumber") }}</span>
            <strong>{{ order.orderNumber }}</strong>
          </div>

          <div v-if="order?.payment" class="order-success-page__payment-badge">
            <i :class="paymentIcon"></i>
            {{ paymentMethodLabel }}
            <span class="order-success-page__payment-badge-status">
              {{ order.payment.statusLabel || order.payment.status }}
            </span>
          </div>

          <!-- Items -->
          <div v-if="order?.items?.length" class="order-success-page__bill-section">
            <h2 class="order-success-page__bill-title">
              <i class="bi bi-box-seam"></i>
              {{ $t("payment.billItems") }}
            </h2>
            <div class="order-success-page__bill-items">
              <div
                v-for="(item, idx) in order.items"
                :key="idx"
                class="order-success-page__bill-item"
              >
                <img
                  :src="item.thumbnail || fallbackImage"
                  :alt="item.name"
                  class="order-success-page__bill-item-img"
                  loading="lazy"
                />
                <div class="order-success-page__bill-item-info">
                  <p class="order-success-page__bill-item-name">{{ item.name }}</p>
                  <p class="order-success-page__bill-item-meta">
                    {{ item.quantity }} × {{ formatMoney(item.unitPrice) }}
                    <span v-if="item.selectedOptions && Object.keys(item.selectedOptions).length">
                      · {{ Object.values(item.selectedOptions).join(", ") }}
                    </span>
                  </p>
                </div>
                <span class="order-success-page__bill-item-total">
                  {{ formatMoney(item.lineTotal) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Pricing -->
          <div class="order-success-page__bill-section">
            <h2 class="order-success-page__bill-title">
              <i class="bi bi-receipt"></i>
              {{ $t("payment.billSummary") }}
            </h2>
            <dl class="order-success-page__bill-pricing">
              <div class="order-success-page__bill-pricing-row">
                <dt>{{ $t("checkout.subtotal") }}</dt>
                <dd>{{ formatMoney(order?.pricing?.subtotal || 0) }}</dd>
              </div>
              <div v-if="order?.pricing?.deliveryFee > 0" class="order-success-page__bill-pricing-row">
                <dt>{{ $t("checkout.deliveryFee") }}</dt>
                <dd>{{ formatMoney(order.pricing.deliveryFee) }}</dd>
              </div>
              <div v-if="order?.pricing?.voucherDiscount > 0" class="order-success-page__bill-pricing-row order-success-page__bill-pricing-row--discount">
                <dt>{{ $t("checkout.voucher") }}</dt>
                <dd>-{{ formatMoney(order.pricing.voucherDiscount) }}</dd>
              </div>
              <div v-if="order?.pricing?.freeshipDiscount > 0" class="order-success-page__bill-pricing-row order-success-page__bill-pricing-row--discount">
                <dt>{{ $t("checkout.freeship") }}</dt>
                <dd>-{{ formatMoney(order.pricing.freeshipDiscount) }}</dd>
              </div>
              <div class="order-success-page__bill-pricing-total">
                <dt>{{ $t("checkout.total") }}</dt>
                <dd>{{ formatMoney(order?.pricing?.total || 0) }}</dd>
              </div>
            </dl>
          </div>

          <!-- Shipping -->
          <div v-if="order?.address" class="order-success-page__bill-section">
            <h2 class="order-success-page__bill-title">
              <i class="bi bi-geo-alt"></i>
              {{ $t("payment.billShipping") }}
            </h2>
            <div class="order-success-page__bill-address">
              <strong>{{ order.address.name }}</strong>
              <span>{{ order.address.phone }}</span>
              <p>{{ [order.address.line1, order.address.city].filter(Boolean).join(", ") }}</p>
            </div>
          </div>

          <!-- Payment -->
          <div v-if="order?.payment" class="order-success-page__bill-section">
            <h2 class="order-success-page__bill-title">
              <i class="bi bi-credit-card"></i>
              {{ $t("payment.billPayment") }}
            </h2>
            <dl class="order-success-page__bill-pricing">
              <div class="order-success-page__bill-pricing-row">
                <dt>{{ $t("orderSuccess.amount") }}</dt>
                <dd class="order-success-page__bill-pricing-row--highlight">{{ formatMoney(order.payment.amount) }}</dd>
              </div>
              <div v-if="order.payment.paidAt" class="order-success-page__bill-pricing-row">
                <dt>{{ $t("orderSuccess.transactionDate") }}</dt>
                <dd>{{ formatDate(order.payment.paidAt) }}</dd>
              </div>
            </dl>
          </div>

          <!-- Gateway details -->
          <div v-if="isVNPay || isMoMo" class="order-success-page__bill-section">
            <h2 class="order-success-page__bill-title">
              <i class="bi bi-info-circle"></i>
              {{ $t("orderSuccess.transactionDetails") }}
            </h2>
            <template v-if="isVNPay">
              <div class="order-success-page__detail-row">
                <span class="order-success-page__detail-key">{{ $t("orderSuccess.bank") }}</span>
                <span class="order-success-page__detail-val">{{ vnpayData.bankName }}</span>
              </div>
              <div v-if="vnpayData.cardType !== 'N/A'" class="order-success-page__detail-row">
                <span class="order-success-page__detail-key">{{ $t("orderSuccess.cardType") }}</span>
                <span class="order-success-page__detail-val">{{ vnpayData.cardType }}</span>
              </div>
              <div v-if="vnpayData.transactionNo !== 'N/A'" class="order-success-page__detail-row">
                <span class="order-success-page__detail-key">{{ $t("orderSuccess.transactionNo") }}</span>
                <span class="order-success-page__detail-val">{{ vnpayData.transactionNo }}</span>
              </div>
              <div v-if="vnpayData.payDate" class="order-success-page__detail-row">
                <span class="order-success-page__detail-key">{{ $t("orderSuccess.transactionDate") }}</span>
                <span class="order-success-page__detail-val">{{ vnpayData.payDate }}</span>
              </div>
            </template>
            <template v-else-if="isMoMo">
              <div class="order-success-page__detail-row">
                <span class="order-success-page__detail-key">{{ $t("orderSuccess.momoTransactionId") }}</span>
                <span class="order-success-page__detail-val">{{ momoData.transactionId }}</span>
              </div>
            </template>
          </div>

          <!-- Actions -->
          <div class="order-success-page__actions">
            <button
              type="button"
              class="order-success-page__btn order-success-page__btn--primary"
              @click="navigateTo('/account/orders')"
            >
              <i class="bi bi-bag"></i>
              {{ $t("payment.viewOrders") }}
            </button>
            <button
              type="button"
              class="order-success-page__btn order-success-page__btn--secondary"
              @click="navigateTo('/')"
            >
              <i class="bi bi-house"></i>
              {{ $t("orderSuccess.gotoHome") }}
            </button>
          </div>
        </div>
      </div>

      <!-- ── Phase: failed ── -->
      <div v-else-if="phase === 'failed'" class="order-success-page__card">
        <div class="order-success-page__icon order-success-page__icon--failed">
          <i class="bi bi-x-circle-fill"></i>
        </div>
        <h1 class="order-success-page__title">{{ $t("orderSuccess.titleFailed") }}</h1>
        <p class="order-success-page__message">{{ $t("payment.confirmFailed") }}</p>

        <div v-if="resolvedOrderId" class="order-success-page__order-number">
          <span class="order-success-page__label">{{ $t("orderSuccess.orderNumber") }}</span>
          <strong>{{ resolvedOrderId }}</strong>
        </div>

        <div v-if="failureReason" class="order-success-page__failure-banner">
          <div class="order-success-page__failure-banner-icon">
            <i class="bi bi-exclamation-triangle-fill"></i>
          </div>
          <div class="order-success-page__failure-banner-content">
            <strong>{{ $t("orderSuccess.errorReason") }}</strong>
            <span>{{ failureReason }}</span>
          </div>
        </div>

        <div v-if="isVNPay || isMoMo" class="order-success-page__details">
          <h2 class="order-success-page__details-title">
            <i class="bi bi-receipt"></i>
            {{ $t("orderSuccess.transactionDetails") }}
          </h2>
          <template v-if="isVNPay">
            <div class="order-success-page__detail-row">
              <span class="order-success-page__detail-key">{{ $t("orderSuccess.amount") }}</span>
              <span class="order-success-page__detail-val order-success-page__detail-val--highlight">{{ vnpayData.amount }}</span>
            </div>
            <div class="order-success-page__detail-row">
              <span class="order-success-page__detail-key">{{ $t("orderSuccess.bank") }}</span>
              <span class="order-success-page__detail-val">{{ vnpayData.bankName }}</span>
            </div>
            <div class="order-success-page__detail-row">
              <span class="order-success-page__detail-key">{{ $t("orderSuccess.transactionNo") }}</span>
              <span class="order-success-page__detail-val">{{ vnpayData.transactionNo }}</span>
            </div>
          </template>
          <template v-else-if="isMoMo">
            <div class="order-success-page__detail-row">
              <span class="order-success-page__detail-key">{{ $t("orderSuccess.amount") }}</span>
              <span class="order-success-page__detail-val order-success-page__detail-val--highlight">{{ momoData.amount }}</span>
            </div>
            <div class="order-success-page__detail-row">
              <span class="order-success-page__detail-key">{{ $t("orderSuccess.momoTransactionId") }}</span>
              <span class="order-success-page__detail-val">{{ momoData.transactionId }}</span>
            </div>
          </template>
        </div>

        <div v-if="verifyError" class="order-success-page__verify-warning">
          <i class="bi bi-exclamation-circle"></i>
          {{ $t("orderSuccess.verifyFailed") }}
        </div>

        <div class="order-success-page__actions">
          <button
            type="button"
            class="order-success-page__btn order-success-page__btn--secondary"
            @click="navigateTo('/cart')"
          >
            <i class="bi bi-cart3"></i>
            {{ $t("orderSuccess.backToCart") }}
          </button>
          <button
            type="button"
            class="order-success-page__btn order-success-page__btn--primary"
            @click="retryVerify"
          >
            <i class="bi bi-arrow-repeat"></i>
            {{ $t("payment.retryConfirm") }}
          </button>
        </div>
      </div>

      <!-- ── Phase: timeout ── -->
      <div v-else-if="phase === 'timeout'" class="order-success-page__card">
        <div class="order-success-page__icon order-success-page__icon--timeout">
          <i class="bi bi-clock-fill"></i>
        </div>
        <h1 class="order-success-page__title">{{ $t("payment.confirmTimeout") }}</h1>
        <p class="order-success-page__message">{{ $t("payment.confirmTimeoutDesc") }}</p>

        <div v-if="resolvedOrderId" class="order-success-page__order-number">
          <span class="order-success-page__label">{{ $t("orderSuccess.orderNumber") }}</span>
          <strong>{{ resolvedOrderId }}</strong>
        </div>

        <div class="order-success-page__actions">
          <button
            type="button"
            class="order-success-page__btn order-success-page__btn--secondary"
            @click="navigateTo('/cart')"
          >
            <i class="bi bi-cart3"></i>
            {{ $t("orderSuccess.backToCart") }}
          </button>
          <button
            type="button"
            class="order-success-page__btn order-success-page__btn--primary"
            @click="retryVerify"
          >
            <i class="bi bi-arrow-repeat"></i>
            {{ $t("payment.retryConfirm") }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useCartStore } from "@/stores/cartStore";
import { useDeviceDetection } from "@/composables/useDeviceDetection";
import CheckoutProgress from "@/components/Checkout/CheckoutProgress.vue";

definePageMeta({
  layout: "default",
});

const route = useRoute();
const checkoutStore = useCheckoutStore();
const cartStore = useCartStore();
const { isMobile, isMobileRef } = useDeviceDetection();

// ── State machine: confirming | confirmed | failed | timeout | no-info ──
const phase = ref("confirming");
const order = ref(null);
const orderLoading = ref(false);
const payment = ref(null);
const verifyError = ref(false);
const mobilePollResult = ref(null);
let pollTimer = null;
const MAX_POLLS = 20;
let pollCount = 0;

const fallbackImage = "https://placehold.co/56x56/f4f4f5/d4d4d8?text=%20";

// ── Data maps ────────────────────────────────────────────────
const bankNameMap = {
  NCB: "Ngân hàng Quốc Dân (NCB)",
  VISA: "Thẻ Visa / Mastercard",
  ATM: "Thẻ ATM",
  MB: "MB Bank",
  VPB: "VPBank",
  VCB: "Vietcombank",
  TCB: "Techcombank",
  CTG: "VietinBank",
  BIDV: "BIDV",
  ACB: "ACB",
  SHB: "SHB",
  HDB: "HDBank",
  MSB: "MSB",
  OCB: "OCB",
  TPB: "TPBank",
  VIB: "VIB",
};

const vnpayResponseCodeMap = {
  "00": "Giao dịch thành công",
  "07": "Giao dịch bị nghi ngờ (liên quan đến hack)",
  "09": "Thẻ chưa đăng ký Internet Banking",
  "10": "Xác thực sai OTP",
  "11": "Hết hạn chọn thanh toán",
  "12": "Thẻ không đủ số dư",
  "13": "Sai mật khẩu thanh toán",
  "24": "Khách hàng hủy giao dịch",
  "51": "Tài khoản không đủ tiền",
  "65": "Vượt quá hạn mức giao dịch",
  "75": "Ngân hàng đang bảo trì",
  "79": "Sai mật khẩu thanh toán (lần thứ 3)",
  "99": "Lỗi không xác định",
};

const momoResultCodeMap = {
  "0": "Giao dịch thành công",
  "1006": "Hủy giao dịch bởi người dùng",
  "1003": "Giao dịch đang xử lý",
  "1001": "Giao dịch bị từ chối",
  "1002": "Sai thông tin thanh toán",
  "1009": "�ơn hàng không tồn tại",
};

// ── Helpers ──────────────────────────────────────────────────
const formatMoney = (value = 0) => {
  return `${new Intl.NumberFormat("vi-VN").format(Number(value))}đ`;
};

const formatDate = (isoStr) => {
  if (!isoStr) return "";
  try {
    const d = new Date(isoStr);
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoStr;
  }
};

const formatVnpayDate = (dateStr) => {
  if (!dateStr || dateStr.length !== 14) return dateStr || "";
  const y = dateStr.slice(0, 4);
  const m = dateStr.slice(4, 6);
  const d = dateStr.slice(6, 8);
  const h = dateStr.slice(8, 10);
  const min = dateStr.slice(10, 12);
  const s = dateStr.slice(12, 14);
  return `${d}/${m}/${y} ${h}:${min}:${s}`;
};

// ── Gateway detection ────────────────────────────────────────
const isVNPay = computed(() => !!route.query.vnp_TxnRef);
const isMoMo = computed(() => !!route.query.orderId || !!route.query.resultCode);

const paymentMethod = computed(() => {
  if (isVNPay.value) return "vnpay";
  if (isMoMo.value) return "momo";
  return route.query.payment_method || "cod";
});

const paymentMethodLabel = computed(() => {
  if (paymentMethod.value === "vnpay") return "VNPay";
  if (paymentMethod.value === "momo") return "MoMo";
  return "COD";
});

const paymentIcon = computed(() => {
  if (paymentMethod.value === "vnpay") return "bi bi-credit-card-2-front-fill";
  if (paymentMethod.value === "momo") return "bi bi-wallet2";
  return "bi bi-cash-coin";
});

// ── Parsed gateway data from redirect query params ──────────────
const vnpayData = computed(() => {
  if (!isVNPay.value) return null;
  const code = route.query.vnp_ResponseCode;
  return {
    amount: route.query.vnp_Amount
      ? Number(route.query.vnp_Amount).toLocaleString("vi-VN") + "đ"
      : null,
    bankCode: route.query.vnp_BankCode,
    bankName: bankNameMap[route.query.vnp_BankCode] || route.query.vnp_BankCode || "N/A",
    cardType: route.query.vnp_CardType || "N/A",
    transactionNo: route.query.vnp_TransactionNo || "N/A",
    payDate: formatVnpayDate(route.query.vnp_PayDate),
    responseCode: code,
    isSuccess: code === "00",
    orderInfo: route.query.vnp_OrderInfo || "",
  };
});

const momoData = computed(() => {
  if (!isMoMo.value) return null;
  const code = String(route.query.resultCode || "");
  return {
    amount: route.query.amount
      ? Number(route.query.amount).toLocaleString("vi-VN") + "đ"
      : null,
    transactionId: route.query.transId || route.query.transactionId || "N/A",
    resultCode: code,
    isSuccess: code === "0",
    orderId: route.query.orderId || "N/A",
  };
});

// ── Unified gateway status from query params ───────────────────
const gatewayStatusFromQuery = computed(() => {
  if (isVNPay.value) return vnpayData.value?.isSuccess ? "success" : "failed";
  if (isMoMo.value) return momoData.value?.isSuccess ? "success" : "failed";
  return route.query.status === "success" || route.query.status === "paid" ? "success" : null;
});

// ── Order number resolution ──────────────────────────────────
const resolvedOrderId = computed(() => {
  if (isVNPay.value) return route.query.vnp_TxnRef;
  if (isMoMo.value) return route.query.orderId;
  return route.query.order_id || checkoutStore.preparedOrderId || null;
});

// ── Failure reason ─────────────────────────────────────────────
const failureReason = computed(() => {
  if (isVNPay.value && !vnpayData.value?.isSuccess) {
    return (
      vnpayResponseCodeMap[route.query.vnp_ResponseCode] ||
      `Mã lỗi: ${route.query.vnp_ResponseCode}`
    );
  }
  if (isMoMo.value && !momoData.value?.isSuccess) {
    return (
      momoResultCodeMap[String(route.query.resultCode)] ||
      `Mã lỗi: ${route.query.resultCode}`
    );
  }
  return route.query.message || route.query.error || null;
});

// ── Full order data fetch ──────────────────────────────────
const fetchFullOrder = async (orderId) => {
  orderLoading.value = true;
  try {
    const data = await checkoutStore.fetchOrderById(orderId);
    return data || null;
  } catch {
    return null;
  } finally {
    orderLoading.value = false;
  }
};

// ── Polling: verify payment status ───────────────────────────
const doPoll = async () => {
  const orderId = resolvedOrderId.value;
  if (!orderId) return;

  pollCount++;
  try {
    const params = { order_id: orderId, gateway: paymentMethod.value };

    if (isVNPay.value) {
      Object.entries(route.query).forEach(([k, v]) => {
        if (k.startsWith("vnp_")) params[k] = v;
      });
    } else if (isMoMo.value) {
      ["orderId", "resultCode", "transId", "amount", "message"].forEach((k) => {
        if (route.query[k]) params[k] = route.query[k];
      });
    }

    const data = await checkoutStore.verifyPayment(params);

    if (!data) {
      if (pollCount >= MAX_POLLS) {
        phase.value = "timeout";
        stopPoll();
      }
      return;
    }

    const pStatus = data.payment?.status?.toLowerCase();
    payment.value = data.payment || null;

    if (pStatus === "completed" || pStatus === "paid" || pStatus === "confirmed") {
      phase.value = "confirmed";
      const orderData = await fetchFullOrder(orderId);
      if (orderData) {
        order.value = orderData;
        payment.value = orderData.payment || data.payment || null;
      } else {
        order.value = data.order || null;
      }
      cartStore.clearCart();
      checkoutStore.resetCheckout();
      stopPoll();
      return;
    }

    if (pStatus === "failed" || pStatus === "cancelled" || pStatus === "expired") {
      phase.value = "failed";
      stopPoll();
      return;
    }

    if (pollCount >= MAX_POLLS) {
      phase.value = "timeout";
      stopPoll();
    }
  } catch {
    verifyError.value = true;
    if (pollCount >= MAX_POLLS) {
      phase.value = "timeout";
      stopPoll();
    }
  }
};

const startPoll = () => {
  pollTimer = setInterval(doPoll, 3000);
};

const stopPoll = () => {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
};

const retryVerify = async () => {
  pollCount = 0;
  verifyError.value = false;
  phase.value = "confirming";
  await doPoll();
  if (phase.value === "confirming") {
    startPoll();
  }
};

// ── Lifecycle ────────────────────────────────────────────────
const handleResize = () => {
  isMobileRef.value = window.innerWidth < 992;
};

onMounted(async () => {
  isMobileRef.value = window.innerWidth < 992;
  window.addEventListener("resize", handleResize);

  const orderId = resolvedOrderId.value;

  if (!orderId) {
    phase.value = "no-info";
    return;
  }

  // VNPay/MoMo redirect back only AFTER successful payment.
  // If response code indicates success, skip polling and go straight to confirmed.
  if (gatewayStatusFromQuery.value === "success") {
    phase.value = "confirming";
    orderLoading.value = true;
    const orderData = await fetchFullOrder(orderId);
    if (orderData) {
      order.value = orderData;
      payment.value = orderData.payment || null;
    }
    phase.value = "confirmed";
    cartStore.clearCart();
    checkoutStore.resetCheckout();
    return;
  }

  if (gatewayStatusFromQuery.value === "failed") {
    phase.value = "failed";
    startPoll();
    return;
  }

  phase.value = "confirming";
  await doPoll();
  if (phase.value === "confirming") {
    startPoll();
  }
});

onUnmounted(() => {
  stopPoll();
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.order-success-page {
  overflow-x: hidden;
  padding: 40px 0 80px;
}

/* ── Desktop confirmed layout ── */

.order-success-page__confirmed-desktop {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 20px;
  margin: 0 auto;
  overflow-x: hidden;
  padding: 32px;
}

.order-success-page__desktop-header {
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 24px;
}

.order-success-page__desktop-header-left {
  align-items: center;
  display: flex;
  gap: 20px;
}

.order-success-page__desktop-header-left .order-success-page__icon {
  flex-shrink: 0;
  height: 80px;
  width: 80px;
  font-size: 48px;
}

.order-success-page__desktop-header-right {
  align-items: flex-end;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: right;
}

.order-success-page__desktop-body {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  overflow-x: hidden;
}

/* ══ Responsive: iPad Pro 12.9" ══ */
@media (max-width: 1199.98px) {
  .order-success-page__desktop-body {
    grid-template-columns: 1fr 320px;
  }
}

/* ══ Responsive: iPad Pro 11" (834px) ══ */
@media (max-width: 1023.98px) {
  .order-success-page__desktop-body {
    grid-template-columns: 1fr;
  }
}

/* ══ Responsive: iPad Mini (768px) ══ */
@media (max-width: 991.98px) {
  .order-success-page__desktop-body {
    grid-template-columns: 1fr;
  }

  .order-success-page__desktop-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .order-success-page__desktop-header-right {
    align-items: flex-start;
    text-align: left;
  }

  .order-success-page__confirmed-desktop {
    padding: 20px;
  }
}

/* ══ Responsive: iPhone 14 Pro Max / 15 Plus (430px) ══ */
@media (max-width: 767.98px) {
  .order-success-page {
    padding: 16px 0 80px;
  }

  .order-success-page__confirmed-desktop {
    border-radius: 14px;
    padding: 16px;
  }

  .order-success-page__desktop-header-left .order-success-page__icon {
    height: 60px;
    width: 60px;
    font-size: 36px;
  }

  .order-success-page__desktop-col:last-child {
    position: static;
  }

  .order-success-page__bill-section {
    padding: 12px;
  }

  .order-success-page__title {
    font-size: 22px;
  }
}

/* ══ Responsive: iPhone 12/13/14/15 Pro (390px) ══ */
@media (max-width: 575.98px) {
  .order-success-page__desktop-header-left {
    gap: 12px;
  }

  .order-success-page__desktop-header-left .order-success-page__icon {
    height: 52px;
    width: 52px;
    font-size: 30px;
  }

  .order-success-page__title {
    font-size: 20px;
  }

  .order-success-page__message {
    font-size: 13px;
  }

  .order-success-page__next-steps {
    padding: 14px;
  }
}

/* ══ Responsive: iPhone SE (375px) ══ */
@media (max-width: 480px) {
  .order-success-page {
    padding: 12px 0 80px;
  }

  .order-success-page__confirmed-desktop {
    border-radius: 12px;
    padding: 14px;
  }

  .order-success-page__title {
    font-size: 18px;
  }

  .order-success-page__message {
    font-size: 13px;
    margin-bottom: 16px;
  }

  .order-success-page__bill-section {
    padding: 10px;
    border-radius: 10px;
  }

  .order-success-page__bill-title {
    font-size: 13px;
    margin-bottom: 8px;
  }

  .order-success-page__bill-item {
    gap: 8px;
  }

  .order-success-page__bill-item-img {
    height: 40px;
    width: 40px;
  }

  .order-success-page__bill-item-name {
    font-size: 12px;
  }

  .order-success-page__bill-item-meta {
    font-size: 11px;
  }

  .order-success-page__bill-item-total {
    font-size: 13px;
  }

  .order-success-page__bill-pricing-row {
    font-size: 12px;
  }

  .order-success-page__bill-pricing-total {
    font-size: 14px;
  }

  .order-success-page__bill-pricing-total dd {
    font-size: 16px !important;
  }

  .order-success-page__actions {
    gap: 8px;
  }

  .order-success-page__btn {
    font-size: 14px;
    min-height: 44px;
    padding: 10px 16px;
    border-radius: 10px;
  }
}

/* ══ Responsive: Ultra narrow (≤460px) ══ */
@media (max-width: 460px) {
  .order-success-page__confirmed-desktop {
    padding: 12px;
    border-radius: 10px;
  }

  .order-success-page__desktop-header-left .order-success-page__icon {
    height: 48px;
    width: 48px;
    font-size: 28px;
    flex-shrink: 0;
  }

  .order-success-page__title {
    font-size: 17px;
  }

  .order-success-page__message {
    font-size: 12px;
    margin-bottom: 14px;
  }

  .order-success-page__bill-section {
    padding: 10px;
    border-radius: 8px;
  }

  .order-success-page__bill-title {
    font-size: 12px;
    margin-bottom: 8px;
  }

  .order-success-page__bill-item {
    gap: 6px;
  }

  .order-success-page__bill-item-img {
    height: 36px;
    width: 36px;
    flex-shrink: 0;
  }

  .order-success-page__bill-item-name {
    font-size: 11px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .order-success-page__bill-item-meta {
    font-size: 10px;
  }

  .order-success-page__bill-item-total {
    font-size: 12px;
    flex-shrink: 0;
  }

  .order-success-page__bill-pricing-row {
    font-size: 11px;
    gap: 6px;
  }

  .order-success-page__bill-pricing-total {
    font-size: 13px;
  }

  .order-success-page__bill-pricing-total dd {
    font-size: 15px !important;
  }

  .order-success-page__detail-row {
    font-size: 11px;
  }

  .order-success-page__next-steps {
    padding: 12px;
  }

  .order-success-page__section-title {
    font-size: 13px;
    margin-bottom: 10px;
  }

  .order-success-page__step {
    font-size: 12px;
    gap: 8px;
  }

  .order-success-page__step-num {
    height: 18px;
    width: 18px;
    font-size: 10px;
  }

  .order-success-page__actions {
    gap: 6px;
  }

  .order-success-page__btn {
    font-size: 13px;
    min-height: 40px;
    padding: 8px 12px;
    border-radius: 8px;
    width: 100%;
  }

  .order-success-page__order-number {
    padding: 10px 12px;
    border-radius: 8px;
    margin-bottom: 10px;
  }

  .order-success-page__label {
    font-size: 10px;
  }

  .order-success-page__order-number strong {
    font-size: 15px;
  }

  .order-success-page__payment-badge {
    font-size: 12px;
    padding: 6px 10px;
    border-radius: 6px;
  }

  .order-success-page__payment-badge-status {
    font-size: 11px;
    padding: 2px 6px;
  }

  .order-success-page__skeleton--order-num {
    width: 120px;
    height: 36px;
  }

  .order-success-page__skeleton--badge {
    width: 100px;
    height: 28px;
  }
}

.order-success-page__desktop-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.order-success-page__desktop-col:last-child {
  position: sticky;
  top: 100px;
  align-self: start;
}

/* ── Skeleton loading ── */
.order-success-page__skeleton {
  background: linear-gradient(90deg, #f4f4f5 25%, #e4e4e7 50%, #f4f4f5 75%);
  background-size: 200% 100%;
  border-radius: 6px;
  animation: shimmer 1.5s infinite;
}

.order-success-page__skeleton-title {
  background: linear-gradient(90deg, #f4f4f5 25%, #e4e4e7 50%, #f4f4f5 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
  height: 16px;
  width: 120px;
  margin-bottom: 12px;
}

.order-success-page__skeleton--order-num {
  height: 48px;
  width: 180px;
  border-radius: 10px;
}

.order-success-page__skeleton--badge {
  height: 32px;
  width: 120px;
  border-radius: 20px;
}

.order-success-page__skeleton-item {
  align-items: center;
  display: flex;
  gap: 10px;
  padding: 8px 0;
}

.order-success-page__skeleton-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.order-success-page__skeleton--img {
  height: 48px;
  width: 48px;
  border-radius: 8px;
  flex-shrink: 0;
}

.order-success-page__skeleton--text {
  height: 14px;
  width: 80%;
  border-radius: 4px;
}

.order-success-page__skeleton--text-sm {
  height: 12px;
  width: 50%;
  border-radius: 4px;
}

.order-success-page__skeleton--price {
  height: 14px;
  width: 60px;
  border-radius: 4px;
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .order-success-page__skeleton--img {
    height: 40px;
    width: 40px;
  }

  .order-success-page__skeleton--order-num {
    width: 140px;
    height: 40px;
  }
}

.order-success-page__skeleton--total {
  height: 20px;
  width: 100%;
  border-radius: 4px;
  margin-top: 8px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Common ── */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spin {
  animation: spin 0.8s linear infinite;
}

/* Card */
.order-success-page__card {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 20px;
  max-width: 560px;
  margin: 0 auto;
  overflow: hidden;
  padding: 40px 32px;
  text-align: center;
}

@media (max-width: 480px) {
  .order-success-page__card {
    border-radius: 14px;
    padding: 28px 16px;
  }
}

/* Icon */
.order-success-page__icon {
  align-items: center;
  border-radius: 50%;
  display: flex;
  font-size: 64px;
  height: 96px;
  justify-content: center;
  margin: 0 auto 20px;
  width: 96px;
}

.order-success-page__icon--success {
  background: #f0fdf4;
  color: #15803d;
}

.order-success-page__icon--failed {
  background: #fff1f2;
  color: #be123c;
}

.order-success-page__icon--confirming {
  background: #fffbeb;
  color: #d97706;
}

.order-success-page__icon--timeout {
  background: #fff7ed;
  color: #ea580c;
}

/* Title & message */
.order-success-page__title {
  color: #18181b;
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 8px;
}

.order-success-page__message {
  color: #71717a;
  font-size: 15px;
  margin: 0 0 24px;
}

/* Order number */
.order-success-page__order-number {
  background: #f9f9fb;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
  padding: 14px;
}

.order-success-page__label {
  color: #71717a;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.order-success-page__order-number strong {
  color: #18181b;
  font-size: 18px;
  font-weight: 800;
}

/* Polling bar */
.order-success-page__polling-bar {
  align-items: center;
  background: #f9f9fb;
  border-radius: 10px;
  color: #71717a;
  display: flex;
  flex-direction: column;
  font-size: 13px;
  gap: 8px;
  padding: 16px;
  text-align: center;
}

.order-success-page__polling-dots {
  display: flex;
  gap: 6px;
}

.order-success-page__polling-dots span {
  background: #d70018;
  border-radius: 50%;
  display: block;
  height: 8px;
  width: 8px;
  animation: pollingPulse 1.4s ease-in-out infinite both;
}

.order-success-page__polling-dots span:nth-child(1) { animation-delay: -0.32s; }
.order-success-page__polling-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes pollingPulse {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

/* Mobile poll result */
.order-success-page__mobile-result {
  margin-top: 12px;
}

.order-success-page__mobile-result-timeout,
.order-success-page__mobile-result-error {
  align-items: center;
  border-radius: 8px;
  display: flex;
  font-size: 13px;
  font-weight: 600;
  gap: 6px;
  justify-content: center;
  padding: 8px 14px;
}

.order-success-page__mobile-result-timeout {
  background: #fff7ed;
  color: #ea580c;
}

.order-success-page__mobile-result-error {
  background: #fff1f2;
  color: #be123c;
}

/* Payment badge */
.order-success-page__payment-badge {
  align-items: center;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  color: #15803d;
  display: flex;
  font-size: 14px;
  font-weight: 600;
  gap: 6px;
  margin-bottom: 12px;
  padding: 8px 14px;
}

.order-success-page__payment-badge-status {
  background: #dcfce7;
  border-radius: 20px;
  color: #15803d;
  font-size: 12px;
  font-weight: 600;
  margin-left: auto;
  padding: 2px 8px;
}

/* Bill sections */
.order-success-page__bill-section {
  background: #f9f9fb;
  border-radius: 14px;
  margin-bottom: 12px;
  padding: 16px;
  text-align: left;
}

.order-success-page__bill-title {
  align-items: center;
  color: #18181b;
  display: flex;
  font-size: 14px;
  font-weight: 700;
  gap: 6px;
  margin: 0 0 12px;
}

.order-success-page__bill-title i {
  color: #d70018;
}

.order-success-page__bill-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-success-page__bill-item {
  align-items: center;
  display: flex;
  gap: 10px;
}

.order-success-page__bill-item-img {
  border-radius: 8px;
  flex-shrink: 0;
  height: 48px;
  object-fit: cover;
  width: 48px;
}

.order-success-page__bill-item-info {
  flex: 1;
  min-width: 0;
}

.order-success-page__bill-item-name {
  color: #18181b;
  font-size: 13px;
  font-weight: 500;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-success-page__bill-item-meta {
  color: #71717a;
  font-size: 12px;
  margin: 2px 0 0;
}

.order-success-page__bill-item-total {
  color: #18181b;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.order-success-page__bill-pricing {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
}

.order-success-page__bill-pricing-row {
  align-items: center;
  display: flex;
  font-size: 13px;
  justify-content: space-between;
}

.order-success-page__bill-pricing-row dt {
  color: #71717a;
  margin: 0;
}

.order-success-page__bill-pricing-row dd {
  color: #18181b;
  font-weight: 600;
  margin: 0;
}

.order-success-page__bill-pricing-row--discount dt,
.order-success-page__bill-pricing-row--discount dd {
  color: #15803d;
}

.order-success-page__bill-pricing-row--highlight {
  color: #d70018 !important;
  font-size: 15px !important;
}

.order-success-page__bill-pricing-total {
  align-items: center;
  border-top: 2px solid #18181b;
  display: flex;
  font-size: 16px;
  font-weight: 700;
  justify-content: space-between;
  margin-top: 4px;
  padding-top: 8px;
}

.order-success-page__bill-pricing-total dt {
  color: #18181b;
  margin: 0;
}

.order-success-page__bill-pricing-total dd {
  color: #d70018 !important;
  font-size: 18px !important;
  margin: 0;
}

.order-success-page__bill-address {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.order-success-page__bill-address strong {
  color: #18181b;
  font-size: 14px;
}

.order-success-page__bill-address span {
  color: #71717a;
  font-size: 13px;
}

.order-success-page__bill-address p {
  color: #52525b;
  font-size: 13px;
  margin: 4px 0 0;
}

/* Detail rows */
.order-success-page__detail-row {
  align-items: center;
  display: flex;
  font-size: 13px;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid #f0f0f2;
}

.order-success-page__detail-row:last-child {
  border-bottom: none;
}

.order-success-page__detail-key {
  color: #71717a;
  flex-shrink: 0;
}

.order-success-page__detail-val {
  color: #18181b;
  font-weight: 600;
  text-align: right;
  word-break: break-all;
}

.order-success-page__detail-val--highlight {
  color: #d70018;
  font-size: 14px;
}

/* Details panel */
.order-success-page__details {
  background: #f9f9fb;
  border-radius: 14px;
  margin-bottom: 16px;
  padding: 16px 18px;
  text-align: left;
}

.order-success-page__details-title {
  align-items: center;
  color: #18181b;
  display: flex;
  font-size: 14px;
  font-weight: 700;
  gap: 6px;
  margin: 0 0 12px;
}

.order-success-page__details-title i {
  color: #d70018;
}

/* Failure banner */
.order-success-page__failure-banner {
  align-items: flex-start;
  background: #fff1f2;
  border: 1px solid #fecdd3;
  border-radius: 12px;
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding: 14px 16px;
  text-align: left;
}

.order-success-page__failure-banner-icon {
  color: #be123c;
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 1px;
}

.order-success-page__failure-banner-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.order-success-page__failure-banner-content strong {
  color: #be123c;
  font-size: 14px;
}

.order-success-page__failure-banner-content span {
  color: #9f1239;
  font-size: 13px;
}

/* Verify warning */
.order-success-page__verify-warning {
  align-items: center;
  background: #fffbeb;
  border-radius: 8px;
  color: #d97706;
  display: flex;
  font-size: 12px;
  gap: 6px;
  margin-bottom: 16px;
  padding: 8px 12px;
  text-align: left;
}

/* Next steps */
.order-success-page__next-steps {
  background: #f9f9fb;
  border-radius: 14px;
  margin-bottom: 24px;
  padding: 20px;
  text-align: left;
}

.order-success-page__section-title {
  color: #18181b;
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 14px;
}

.order-success-page__steps-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.order-success-page__step {
  align-items: center;
  color: #52525b;
  display: flex;
  font-size: 13px;
  gap: 10px;
}

.order-success-page__step-num {
  align-items: center;
  background: #d70018;
  border-radius: 50%;
  color: #fff;
  display: flex;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 700;
  height: 20px;
  justify-content: center;
  width: 20px;
}

/* Actions */
.order-success-page__actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-success-page__btn {
  align-items: center;
  border-radius: 12px;
  cursor: pointer;
  display: inline-flex;
  font-size: 15px;
  font-weight: 700;
  gap: 8px;
  justify-content: center;
  min-height: 48px;
  padding: 12px 24px;
  transition: background 0.15s ease;
}

.order-success-page__btn--primary {
  background: #d70018;
  border: none;
  color: #fff;
}

.order-success-page__btn--primary:hover {
  background: #b80015;
}

.order-success-page__btn--secondary {
  background: #f4f4f5;
  border: none;
  color: #52525b;
}

.order-success-page__btn--secondary:hover {
  background: #e4e4e7;
}
</style>
