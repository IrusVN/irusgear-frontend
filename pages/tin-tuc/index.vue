<template>
  <div class="news-page">
    <div class="container-xl">
      <div class="news-page__header">
        <h1 class="news-page__title">
          <i class="bi bi-newspaper"></i>
          {{ $t('footerNav.news') || 'Tin tức' }}
        </h1>
      </div>

      <div class="news-page__coming-soon">
        <div class="news-page__placeholder">
          <i class="bi bi-journal-text"></i>
          <h2>{{ $t('news.comingSoon') || 'Tin tức đang được cập nhật' }}</h2>
          <p>{{ $t('news.desc') || 'Các bài viết tin tức công nghệ sẽ sớm được cập nhật. Hãy quay lại sau!' }}</p>
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
  title: 'Tin tức - IrusGear',
})
</script>

<style scoped>
.news-page {
  padding: 40px 0 80px;
}

.news-page__header {
  margin-bottom: 32px;
}

.news-page__title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
  font-weight: 700;
  color: #18181b;
  margin: 0;
}

.news-page__title i {
  color: #d70018;
}

.news-page__coming-soon {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.news-page__placeholder {
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

.news-page__placeholder i {
  font-size: 64px;
  color: #d70018;
}

.news-page__placeholder h2 {
  font-size: 22px;
  font-weight: 700;
  color: #18181b;
  margin: 0;
}

.news-page__placeholder p {
  color: #71717a;
  font-size: 15px;
  margin: 0;
  line-height: 1.6;
}

@media (max-width: 991.98px) {
  .news-page {
    padding: 32px 0 80px;
  }

  .news-page__header {
    margin-bottom: 24px;
  }

  .news-page__title {
    font-size: 26px;
  }

  .news-page__coming-soon {
    min-height: 360px;
  }

  .news-page__placeholder {
    max-width: 440px;
    padding: 48px 20px;
  }

  .news-page__placeholder i {
    font-size: 56px;
  }

  .news-page__placeholder h2 {
    font-size: 20px;
  }

  .news-page__placeholder p {
    font-size: 14px;
  }
}

@media (max-width: 767.98px) {
  .news-page {
    padding: 24px 0 80px;
  }

  .news-page__header {
    margin-bottom: 20px;
  }

  .news-page__title {
    font-size: 24px;
  }

  .news-page__coming-soon {
    min-height: 320px;
  }

  .news-page__placeholder {
    max-width: 420px;
    padding: 40px 20px;
    border-radius: 14px;
  }

  .news-page__placeholder i {
    font-size: 52px;
  }

  .news-page__placeholder h2 {
    font-size: 19px;
  }

  .news-page__placeholder p {
    font-size: 14px;
  }
}

@media (max-width: 575.98px) {
  .news-page {
    padding: 20px 0 60px;
  }

  .news-page__title {
    font-size: 22px;
  }

  .news-page__placeholder {
    padding: 40px 16px;
  }

  .news-page__placeholder i {
    font-size: 48px;
  }

  .news-page__placeholder h2 {
    font-size: 18px;
  }
}
</style>
