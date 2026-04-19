<template>
  <div class="contact-page" :class="isMobile ? 'bg-mobile' : 'bg-light'">

    <!-- ═══ MOBILE ═══ -->
    <template v-if="isMobile">
      <!-- Hero -->
      <div class="m-contact-hero">
        <i class="bi bi-headset m-contact-hero-icon"></i>
        <h1 class="m-contact-hero-title">{{ $t('contact.heroTitle') }}</h1>
        <p class="m-contact-hero-sub">{{ $t('contact.heroSubtitle') }}</p>
      </div>

      <!-- Info Cards -->
      <div class="m-contact-cards">
        <div class="m-info-card" v-for="card in infoCards" :key="card.icon">
          <div class="m-info-icon-wrap"><i :class="'bi bi-' + card.icon"></i></div>
          <div>
            <div class="m-info-label">{{ card.label }}</div>
            <div class="m-info-value">{{ card.value }}</div>
            <div v-if="card.value2" class="m-info-value">{{ card.value2 }}</div>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="m-contact-form-wrap">
        <h2 class="m-section-title">{{ $t('contact.form.title') }}</h2>

        <div v-if="submitted" class="m-success-box">
          <i class="bi bi-check-circle-fill m-success-icon"></i>
          <h3 class="m-success-title">{{ $t('contact.form.successTitle') }}</h3>
          <p class="m-success-msg">{{ $t('contact.form.successMsg') }}</p>
          <button class="m-btn-again" @click="resetForm">{{ $t('contact.form.sendAnother') }}</button>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="m-form">
          <div class="m-field">
            <label>{{ $t('contact.form.name') }}</label>
            <input v-model="form.name" type="text" :placeholder="$t('contact.form.namePlaceholder')" required />
          </div>
          <div class="m-field">
            <label>{{ $t('contact.form.email') }}</label>
            <input v-model="form.email" type="email" :placeholder="$t('contact.form.emailPlaceholder')" required />
          </div>
          <div class="m-field">
            <label>{{ $t('contact.form.phone') }}</label>
            <input v-model="form.phone" type="tel" :placeholder="$t('contact.form.phonePlaceholder')" />
          </div>
          <div class="m-field">
            <label>{{ $t('contact.form.subject') }}</label>
            <input v-model="form.subject" type="text" :placeholder="$t('contact.form.subjectPlaceholder')" required />
          </div>
          <div class="m-field">
            <label>{{ $t('contact.form.message') }}</label>
            <textarea v-model="form.message" rows="4" :placeholder="$t('contact.form.messagePlaceholder')" required></textarea>
          </div>
          <button type="submit" class="m-submit-btn" :disabled="sending">
            <i v-if="sending" class="bi bi-arrow-repeat spin"></i>
            {{ sending ? $t('contact.form.sending') : $t('contact.form.submit') }}
          </button>
        </form>
      </div>

      <!-- FAQ -->
      <div class="m-faq-wrap">
        <h2 class="m-section-title">{{ $t('contact.faq.title') }}</h2>
        <div class="m-faq-list">
          <div v-for="(item, i) in faqItems" :key="i" class="m-faq-item" :class="{ open: openFaq === i }">
            <button class="m-faq-q" @click="toggleFaq(i)">
              <span>{{ item.q }}</span>
              <i class="bi" :class="openFaq === i ? 'bi-dash' : 'bi-plus'"></i>
            </button>
            <div class="m-faq-a" v-show="openFaq === i">{{ item.a }}</div>
          </div>
        </div>
      </div>

      <!-- Map -->
      <div class="m-map-wrap">
        <h2 class="m-section-title">{{ $t('contact.map.title') }}</h2>
        <div class="m-map-frame">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.0241!2d106.7!3d10.73!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQzJzQ4LjAiTiAxMDbCsDQyJzAwLjAiRQ!5e0!3m2!1svi!2s!4v1"
            width="100%" height="250" style="border:0;" allowfullscreen loading="lazy"
          ></iframe>
        </div>
      </div>

      <MobileFooter />
    </template>

    <!-- ═══ DESKTOP ═══ -->
    <template v-else>
      <!-- Hero -->
      <section class="d-hero">
        <div class="d-hero-bg"></div>
        <div class="container position-relative z-1 text-center">
          <div class="d-hero-badge"><i class="bi bi-headset"></i> IrusGear</div>
          <h1 class="d-hero-title">{{ $t('contact.heroTitle') }}</h1>
          <p class="d-hero-sub">{{ $t('contact.heroSubtitle') }}</p>
        </div>
      </section>

      <!-- Info Cards -->
      <section class="container-xl px-3" style="margin-top:-60px; position:relative; z-index:2;">
        <div class="row g-4 justify-content-center">
          <div v-for="card in infoCards" :key="card.icon" class="col-lg-3 col-md-6">
            <div class="d-info-card">
              <div class="d-info-icon"><i :class="'bi bi-' + card.icon"></i></div>
              <h6 class="d-info-label">{{ card.label }}</h6>
              <p class="d-info-value">{{ card.value }}</p>
              <p v-if="card.value2" class="d-info-value">{{ card.value2 }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Form + Map -->
      <section class="container-xl px-3 py-5">
        <div class="row g-5">
          <!-- Form -->
          <div class="col-lg-6">
            <div class="d-form-card">
              <h2 class="d-form-title">{{ $t('contact.form.title') }}</h2>

              <div v-if="submitted" class="d-success-box">
                <div class="d-success-check"><i class="bi bi-check-lg"></i></div>
                <h3 class="d-success-title">{{ $t('contact.form.successTitle') }}</h3>
                <p class="d-success-msg">{{ $t('contact.form.successMsg') }}</p>
                <button class="d-btn-again" @click="resetForm">{{ $t('contact.form.sendAnother') }}</button>
              </div>

              <form v-else @submit.prevent="handleSubmit">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="d-label">{{ $t('contact.form.name') }}</label>
                    <input v-model="form.name" class="d-input" type="text" :placeholder="$t('contact.form.namePlaceholder')" required />
                  </div>
                  <div class="col-md-6">
                    <label class="d-label">{{ $t('contact.form.email') }}</label>
                    <input v-model="form.email" class="d-input" type="email" :placeholder="$t('contact.form.emailPlaceholder')" required />
                  </div>
                  <div class="col-md-6">
                    <label class="d-label">{{ $t('contact.form.phone') }}</label>
                    <input v-model="form.phone" class="d-input" type="tel" :placeholder="$t('contact.form.phonePlaceholder')" />
                  </div>
                  <div class="col-md-6">
                    <label class="d-label">{{ $t('contact.form.subject') }}</label>
                    <input v-model="form.subject" class="d-input" type="text" :placeholder="$t('contact.form.subjectPlaceholder')" required />
                  </div>
                  <div class="col-12">
                    <label class="d-label">{{ $t('contact.form.message') }}</label>
                    <textarea v-model="form.message" class="d-input" rows="5" :placeholder="$t('contact.form.messagePlaceholder')" required></textarea>
                  </div>
                  <div class="col-12">
                    <button type="submit" class="d-submit-btn" :disabled="sending">
                      <i v-if="sending" class="bi bi-arrow-repeat spin me-2"></i>
                      <i v-else class="bi bi-send me-2"></i>
                      {{ sending ? $t('contact.form.sending') : $t('contact.form.submit') }}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <!-- Map -->
          <div class="col-lg-6">
            <div class="d-map-card">
              <h2 class="d-form-title mb-4">{{ $t('contact.map.title') }}</h2>
              <div class="d-map-frame">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.0241!2d106.7!3d10.73!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQzJzQ4LjAiTiAxMDbCsDQyJzAwLjAiRQ!5e0!3m2!1svi!2s!4v1"
                  width="100%" height="100%" style="border:0;" allowfullscreen loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="container-xl px-3 pb-5">
        <h2 class="d-faq-title text-center mb-4">{{ $t('contact.faq.title') }}</h2>
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="d-faq-list">
              <div v-for="(item, i) in faqItems" :key="i" class="d-faq-item" :class="{ open: openFaq === i }">
                <button class="d-faq-q" @click="toggleFaq(i)">
                  <span>{{ item.q }}</span>
                  <i class="bi" :class="openFaq === i ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                </button>
                <Transition name="slide">
                  <div v-if="openFaq === i" class="d-faq-a">{{ item.a }}</div>
                </Transition>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useHead, useI18n } from '#imports'
import { useIsMobile } from '~/composables/useIsMobile'
import MobileFooter from '~/components/Mobile/MobileFooter.vue'

definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { isMobile } = useIsMobile()

useHead({ title: computed(() => t('page_titles.contact')) })

const form = ref({ name: '', email: '', phone: '', subject: '', message: '' })
const sending = ref(false)
const submitted = ref(false)
const openFaq = ref(null)

const infoCards = computed(() => [
  { icon: 'geo-alt-fill', label: t('contact.info.address'), value: t('contact.info.addressValue') },
  { icon: 'telephone-fill', label: t('contact.info.phone'), value: t('contact.info.phoneValue'), value2: t('contact.info.phoneValue2') },
  { icon: 'envelope-fill', label: t('contact.info.email'), value: t('contact.info.emailValue'), value2: t('contact.info.emailValue2') },
  { icon: 'clock-fill', label: t('contact.info.hours'), value: t('contact.info.hoursValue'), value2: t('contact.info.hoursValue2') },
])

const faqItems = computed(() => [
  { q: t('contact.faq.q1'), a: t('contact.faq.a1') },
  { q: t('contact.faq.q2'), a: t('contact.faq.a2') },
  { q: t('contact.faq.q3'), a: t('contact.faq.a3') },
  { q: t('contact.faq.q4'), a: t('contact.faq.a4') },
])

function toggleFaq(i) { openFaq.value = openFaq.value === i ? null : i }

async function handleSubmit() {
  sending.value = true
  await new Promise(r => setTimeout(r, 1500))
  sending.value = false
  submitted.value = true
}

function resetForm() {
  form.value = { name: '', email: '', phone: '', subject: '', message: '' }
  submitted.value = false
}
</script>

<style scoped>
/* ══════════════════════════════════════
   SHARED
   ══════════════════════════════════════ */
.bg-mobile { background: #f2f3f7; }

@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin .8s linear infinite; }

/* ══════════════════════════════════════
   DESKTOP
   ══════════════════════════════════════ */

/* Hero */
.d-hero {
  position: relative;
  padding: 120px 0 100px;
  overflow: hidden;
}
.d-hero-bg {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%);
}
.d-hero-bg::after {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(circle at 30% 50%, rgba(99,102,241,.15) 0%, transparent 60%),
              radial-gradient(circle at 70% 30%, rgba(139,92,246,.1) 0%, transparent 50%);
}
.d-hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12);
  border-radius: 999px; padding: 6px 18px; font-size: .8rem;
  color: rgba(255,255,255,.7); margin-bottom: 20px;
  backdrop-filter: blur(8px);
}
.d-hero-title {
  font-size: 3rem; font-weight: 800; color: #fff;
  margin-bottom: 16px; letter-spacing: -.5px;
}
.d-hero-sub {
  font-size: 1.1rem; color: rgba(255,255,255,.6);
  max-width: 600px; margin: 0 auto; line-height: 1.7;
}

/* Info Cards */
.d-info-card {
  background: #fff; border-radius: 20px;
  padding: 32px 24px; text-align: center;
  box-shadow: 0 4px 24px rgba(0,0,0,.06);
  border: 1px solid rgba(0,0,0,.04);
  transition: transform .3s, box-shadow .3s;
  height: 100%;
}
.d-info-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(0,0,0,.1);
}
.d-info-icon {
  width: 56px; height: 56px; border-radius: 16px;
  background: linear-gradient(135deg, #0f0f0f, #1a1a2e);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px; color: #fff; font-size: 1.3rem;
}
.d-info-label {
  font-weight: 700; font-size: .85rem;
  text-transform: uppercase; letter-spacing: 1px;
  color: #6b7280; margin-bottom: 8px;
}
.d-info-value {
  font-size: .92rem; color: #1f2937;
  margin: 0; line-height: 1.6;
}

/* Form Card */
.d-form-card, .d-map-card {
  background: #fff; border-radius: 24px;
  padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,.05);
  border: 1px solid rgba(0,0,0,.04); height: 100%;
}
.d-form-title {
  font-size: 1.5rem; font-weight: 800; color: #111;
  margin-bottom: 28px;
}
.d-label {
  display: block; font-size: .82rem; font-weight: 600;
  color: #374151; margin-bottom: 6px; text-transform: uppercase;
  letter-spacing: .5px;
}
.d-input {
  width: 100%; padding: 12px 16px; border-radius: 12px;
  border: 1.5px solid #e5e7eb; font-size: .95rem;
  transition: border-color .2s, box-shadow .2s;
  background: #fafafa; outline: none;
}
.d-input:focus {
  border-color: #111; box-shadow: 0 0 0 3px rgba(0,0,0,.06);
  background: #fff;
}
textarea.d-input { resize: vertical; min-height: 120px; }
.d-submit-btn {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 14px 36px; border-radius: 14px; border: none;
  background: linear-gradient(135deg, #0f0f0f, #1a1a2e);
  color: #fff; font-weight: 700; font-size: .95rem;
  cursor: pointer; transition: transform .2s, box-shadow .2s;
}
.d-submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,.2);
}
.d-submit-btn:disabled { opacity: .6; cursor: not-allowed; }

/* Success */
.d-success-box {
  text-align: center; padding: 40px 20px;
}
.d-success-check {
  width: 72px; height: 72px; border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 20px; color: #fff; font-size: 2rem;
  animation: popIn .4s cubic-bezier(.175,.885,.32,1.275);
}
@keyframes popIn { 0% { transform: scale(0); } 100% { transform: scale(1); } }
.d-success-title { font-size: 1.4rem; font-weight: 800; color: #111; margin-bottom: 8px; }
.d-success-msg { color: #6b7280; margin-bottom: 24px; }
.d-btn-again {
  padding: 10px 24px; border-radius: 12px; border: 2px solid #111;
  background: transparent; color: #111; font-weight: 600;
  cursor: pointer; transition: all .2s;
}
.d-btn-again:hover { background: #111; color: #fff; }

/* Map */
.d-map-frame {
  border-radius: 16px; overflow: hidden;
  height: calc(100% - 80px); min-height: 350px;
  background: #f3f4f6;
}

/* FAQ */
.d-faq-title { font-size: 1.8rem; font-weight: 800; color: #111; }
.d-faq-list { display: flex; flex-direction: column; gap: 12px; }
.d-faq-item {
  background: #fff; border-radius: 16px;
  border: 1px solid rgba(0,0,0,.05);
  overflow: hidden; transition: box-shadow .3s;
}
.d-faq-item.open { box-shadow: 0 4px 20px rgba(0,0,0,.08); }
.d-faq-q {
  width: 100%; display: flex; justify-content: space-between;
  align-items: center; padding: 20px 24px; border: none;
  background: transparent; font-size: 1rem; font-weight: 600;
  color: #111; cursor: pointer; text-align: left;
}
.d-faq-q i { color: #9ca3af; transition: transform .2s; }
.d-faq-item.open .d-faq-q i { transform: rotate(180deg); color: #111; }
.d-faq-a {
  padding: 0 24px 20px; color: #6b7280;
  font-size: .95rem; line-height: 1.7;
}
.slide-enter-active, .slide-leave-active { transition: all .2s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-8px); }

/* ══════════════════════════════════════
   MOBILE
   ══════════════════════════════════════ */

.m-contact-hero {
  background: linear-gradient(135deg, #0f0f0f, #1a1a2e);
  padding: 40px 20px 36px; text-align: center;
}
.m-contact-hero-icon { font-size: 2.2rem; color: rgba(255,255,255,.5); margin-bottom: 12px; }
.m-contact-hero-title { font-size: 1.5rem; font-weight: 800; color: #fff; margin-bottom: 8px; }
.m-contact-hero-sub { font-size: .8rem; color: rgba(255,255,255,.55); line-height: 1.6; margin: 0; }

/* Info Cards */
.m-contact-cards { padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.m-info-card {
  display: flex; align-items: flex-start; gap: 14px;
  background: #fff; border-radius: 14px; padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,.04);
}
.m-info-icon-wrap {
  width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
  background: linear-gradient(135deg, #0f0f0f, #1a1a2e);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 1rem;
}
.m-info-label { font-size: .72rem; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: .5px; }
.m-info-value { font-size: .82rem; color: #1f2937; line-height: 1.5; }

/* Form */
.m-contact-form-wrap { padding: 20px 16px; }
.m-section-title { font-size: 1.15rem; font-weight: 800; color: #111; margin-bottom: 16px; }
.m-form { display: flex; flex-direction: column; gap: 14px; }
.m-field label { display: block; font-size: .75rem; font-weight: 600; color: #374151; margin-bottom: 5px; text-transform: uppercase; letter-spacing: .3px; }
.m-field input, .m-field textarea {
  width: 100%; padding: 12px 14px; border-radius: 12px;
  border: 1.5px solid #e5e7eb; font-size: .9rem;
  background: #fff; outline: none; transition: border-color .2s;
  box-sizing: border-box;
}
.m-field input:focus, .m-field textarea:focus { border-color: #111; }
.m-field textarea { resize: vertical; min-height: 100px; }
.m-submit-btn {
  width: 100%; padding: 14px; border-radius: 14px; border: none;
  background: linear-gradient(135deg, #0f0f0f, #1a1a2e);
  color: #fff; font-weight: 700; font-size: .95rem;
  cursor: pointer; display: flex; align-items: center;
  justify-content: center; gap: 8px;
}
.m-submit-btn:disabled { opacity: .6; }

/* Success */
.m-success-box { text-align: center; padding: 30px 10px; }
.m-success-icon { font-size: 3rem; color: #10b981; margin-bottom: 12px; animation: popIn .4s cubic-bezier(.175,.885,.32,1.275); }
.m-success-title { font-size: 1.2rem; font-weight: 800; color: #111; margin-bottom: 6px; }
.m-success-msg { font-size: .85rem; color: #6b7280; margin-bottom: 20px; }
.m-btn-again {
  padding: 10px 24px; border-radius: 12px; border: 2px solid #111;
  background: transparent; color: #111; font-weight: 600;
  font-size: .85rem; cursor: pointer;
}

/* FAQ */
.m-faq-wrap { padding: 20px 16px; }
.m-faq-list { display: flex; flex-direction: column; gap: 8px; }
.m-faq-item {
  background: #fff; border-radius: 12px; overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
}
.m-faq-item.open { box-shadow: 0 2px 12px rgba(0,0,0,.08); }
.m-faq-q {
  width: 100%; display: flex; justify-content: space-between;
  align-items: center; padding: 14px 16px; border: none;
  background: transparent; font-size: .88rem; font-weight: 600;
  color: #111; cursor: pointer; text-align: left; gap: 10px;
}
.m-faq-q i { color: #9ca3af; flex-shrink: 0; }
.m-faq-a { padding: 0 16px 14px; font-size: .8rem; color: #6b7280; line-height: 1.6; }

/* Map */
.m-map-wrap { padding: 10px 16px 20px; }
.m-map-frame { border-radius: 14px; overflow: hidden; background: #e5e7eb; }
</style>
