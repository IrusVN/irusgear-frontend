<template>
  <div class="contact-page">
    <div class="container-xl">
      <div class="contact-page__header">
        <h1 class="contact-page__title">
          <i class="bi bi-headset"></i>
          {{ $t('footerNav.contact') || 'Liên hệ' }}
        </h1>
      </div>

      <div class="contact-page__body">
        <div class="contact-page__info-card">
          <h2>Liên hệ với IrusGear</h2>
          <p>Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ qua các kênh dưới đây:</p>

          <div class="contact-page__contact-list">
            <div class="contact-page__contact-item">
              <i class="bi bi-telephone"></i>
              <div>
                <strong>Hotline</strong>
                <span>1900 1234 (8:00 - 21:00)</span>
              </div>
            </div>
            <div class="contact-page__contact-item">
              <i class="bi bi-envelope"></i>
              <div>
                <strong>Email</strong>
                <span>support@irusgear.com</span>
              </div>
            </div>
            <div class="contact-page__contact-item">
              <i class="bi bi-geo-alt"></i>
              <div>
                <strong>Địa chỉ</strong>
                <span>123 Đường ABC, Quận 1, TP. Hồ Chí Minh</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
})

useHead({
  title: 'Liên hệ - IrusGear',
})
</script>

<style scoped>
.contact-page {
  padding: 40px 0 80px;
}

.contact-page__header {
  margin-bottom: 32px;
}

.contact-page__title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
  font-weight: 700;
  color: #18181b;
  margin: 0;
}

.contact-page__title i {
  color: var(--irus-color-accent);
}

.contact-page__info-card {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  padding: 32px;
  max-width: 600px;
}

.contact-page__info-card h2 {
  font-size: 20px;
  font-weight: 700;
  color: #18181b;
  margin: 0 0 8px;
}

.contact-page__info-card > p {
  color: #71717a;
  font-size: 15px;
  margin: 0 0 24px;
  line-height: 1.6;
}

.contact-page__contact-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-page__contact-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.contact-page__contact-item > i {
  font-size: 20px;
  color: var(--irus-color-accent);
  flex-shrink: 0;
  margin-top: 2px;
}

.contact-page__contact-item > div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.contact-page__contact-item strong {
  font-size: 14px;
  font-weight: 700;
  color: #18181b;
}

.contact-page__contact-item span {
  font-size: 14px;
  color: #71717a;
}

@media (max-width: 991.98px) {
  .contact-page {
    padding: 32px 0 80px;
  }

  .contact-page__header {
    margin-bottom: 24px;
  }

  .contact-page__title {
    font-size: 26px;
  }

  .contact-page__info-card {
    padding: 28px;
  }

  .contact-page__info-card h2 {
    font-size: 19px;
  }

  .contact-page__contact-list {
    gap: 14px;
  }

  .contact-page__contact-item > i {
    font-size: 18px;
  }

  .contact-page__contact-item strong {
    font-size: 13px;
  }

  .contact-page__contact-item span {
    font-size: 13px;
  }
}

@media (max-width: 767.98px) {
  .contact-page {
    padding: 24px 0 80px;
  }

  .contact-page__header {
    margin-bottom: 20px;
  }

  .contact-page__title {
    font-size: 24px;
  }

  .contact-page__info-card {
    padding: 24px;
    border-radius: 14px;
  }

  .contact-page__info-card h2 {
    font-size: 18px;
  }

  .contact-page__info-card > p {
    font-size: 14px;
    margin-bottom: 20px;
  }

  .contact-page__contact-list {
    gap: 12px;
  }

  .contact-page__contact-item {
    gap: 12px;
  }

  .contact-page__contact-item > i {
    font-size: 18px;
  }

  .contact-page__contact-item strong {
    font-size: 13px;
  }

  .contact-page__contact-item span {
    font-size: 13px;
  }
}

@media (max-width: 575.98px) {
  .contact-page {
    padding: 20px 0 60px;
  }

  .contact-page__title {
    font-size: 22px;
  }

  .contact-page__info-card {
    padding: 20px;
    border-radius: 14px;
  }

  .contact-page__info-card h2 {
    font-size: 18px;
  }
}

/* ── Bottom Clearance: Mobile Bottom Nav ─── */
@media (max-width: 991.98px) {
  .contact-page {
    padding-bottom: 110px;
  }
}

@media (max-width: 767.98px) {
  .contact-page {
    padding-bottom: 100px;
  }
}

@media (max-width: 575.98px) {
  .contact-page {
    padding-bottom: 90px;
  }
}

@media (max-width: 480px) {
  .contact-page {
    padding-bottom: 80px;
  }
}
</style>
