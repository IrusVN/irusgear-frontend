<template>
  <div class="promotion-page">
    <div class="container-xl">
      <div class="promotion-page__header">
        <h1 class="promotion-page__title">
          <i class="bi bi-tags"></i>
          {{ $t('home.promotion') }}
        </h1>
      </div>

      <div class="promotion-page__coming-soon">
        <div class="promotion-page__placeholder">
          <i class="bi bi-megaphone"></i>
          <h2>{{ $t('promotion.comingSoon') || 'Khuyến mãi đang được cập nhật' }}</h2>
          <p>{{ $t('promotion.desc') || 'Các chương trình khuyến mãi hấp dẫn sẽ sớm được cập nhật. Hãy quay lại sau!' }}</p>
          <NuxtLink :to="localePath('/')" class="btn btn-dark rounded-pill px-4 py-2">
            <i class="bi bi-house-door me-2"></i>
            {{ $t('home.backToHome') || 'Quay về trang chủ' }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLocalePath } from '#imports'

definePageMeta({
  layout: 'default',
})

const localePath = useLocalePath()

useHead({
  title: 'Khuyến mãi - IrusGear',
})
</script>

<style scoped>
.promotion-page {
  padding: 40px 0 80px;
}

.promotion-page__header {
  margin-bottom: 32px;
}

.promotion-page__title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
  font-weight: 700;
  color: #18181b;
  margin: 0;
}

.promotion-page__title i {
  color: var(--irus-color-accent);
}

.promotion-page__coming-soon {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.promotion-page__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  padding: 60px 20px;
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  max-width: 480px;
  width: 100%;
}

.promotion-page__placeholder i {
  font-size: 64px;
  color: var(--irus-color-accent);
}

.promotion-page__placeholder h2 {
  font-size: 22px;
  font-weight: 700;
  color: #18181b;
  margin: 0;
}

.promotion-page__placeholder p {
  color: #71717a;
  font-size: 15px;
  margin: 0;
  line-height: 1.6;
}

@media (max-width: 991.98px) {
  .promotion-page {
    padding: 32px 0 80px;
  }

  .promotion-page__header {
    margin-bottom: 24px;
  }

  .promotion-page__title {
    font-size: 26px;
  }

  .promotion-page__coming-soon {
    min-height: 360px;
  }

  .promotion-page__placeholder {
    max-width: 440px;
    padding: 48px 20px;
  }

  .promotion-page__placeholder i {
    font-size: 56px;
  }

  .promotion-page__placeholder h2 {
    font-size: 20px;
  }

  .promotion-page__placeholder p {
    font-size: 14px;
  }
}

@media (max-width: 767.98px) {
  .promotion-page {
    padding: 24px 0 80px;
  }

  .promotion-page__header {
    margin-bottom: 20px;
  }

  .promotion-page__title {
    font-size: 24px;
  }

  .promotion-page__coming-soon {
    min-height: 320px;
  }

  .promotion-page__placeholder {
    max-width: 420px;
    padding: 40px 20px;
    border-radius: 14px;
  }

  .promotion-page__placeholder i {
    font-size: 52px;
  }

  .promotion-page__placeholder h2 {
    font-size: 19px;
  }

  .promotion-page__placeholder p {
    font-size: 14px;
  }
}

@media (max-width: 575.98px) {
  .promotion-page {
    padding: 20px 0 60px;
  }

  .promotion-page__title {
    font-size: 22px;
  }

  .promotion-page__placeholder {
    padding: 40px 16px;
  }

  .promotion-page__placeholder i {
    font-size: 48px;
  }

  .promotion-page__placeholder h2 {
    font-size: 18px;
  }
}

/* ── Bottom Clearance: Mobile Bottom Nav ─── */
@media (max-width: 991.98px) {
  .promotion-page {
    padding-bottom: 110px;
  }
}

@media (max-width: 767.98px) {
  .promotion-page {
    padding-bottom: 100px;
  }
}

@media (max-width: 575.98px) {
  .promotion-page {
    padding-bottom: 90px;
  }
}

@media (max-width: 480px) {
  .promotion-page {
    padding-bottom: 80px;
  }
}
</style>
