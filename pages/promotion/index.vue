<template>
  <!-- Your Offers (Empty State) -->
  <ProfileLayout>
  <div class="promotion-card">
    <div class="promotion-card__header">
      <h3 class="promotion-card__title">{{ $t('profile.promotion.yourOffers') }}</h3>
    </div>
    <div class="promotion-card__body promotion-card__body--center">
      <img
        src="https://cdn-static.smember.com.vn/_next/static/media/empty.f8088c4d.png"
        alt="empty"
        class="promotion-card__empty-img"
      />
      <p class="promotion-card__empty-text">{{ $t('profile.promotion.noOffers') }}</p>
    </div>
  </div>

  <!-- Rank Stepper: Carousel -->
  <div class="promotion-card">
    <div class="promotion-card__header">
      <h3 class="promotion-card__title">{{ $t('profile.promotion.rankTitle') }}</h3>
    </div>
    <div class="promotion-card__body promotion-card__body--rank">

      <!-- Carousel -->
      <div class="rank-carousel">
        <!-- Prev Arrow -->
        <button
          type="button"
          class="rank-carousel__arrow rank-carousel__arrow--prev"
          :class="{ 'rank-carousel__arrow--disabled': activeRankIndex === 0 }"
          :disabled="activeRankIndex === 0"
          @click="prevRank"
        >
          <i class="bi bi-chevron-left"></i>
        </button>

        <!-- Overflow wrapper -->
        <div class="rank-carousel__viewport" ref="carouselViewport">
          <!-- Track: positioned absolutely, moved by transform -->
          <div
            class="rank-carousel__track"
            :style="{ transform: `translateX(${-trackOffset}px)` }"
            @mousedown.prevent="startDrag"
            @mousemove="onDrag"
            @mouseup="endDrag"
            @mouseleave="endDrag"
          >
            <div
              v-for="(rank, idx) in ranks"
              :key="rank.key"
              class="rank-card"
              :class="{
                'rank-card--active': idx === activeRankIndex,
                'rank-card--done': idx < activeRankIndex,
                'rank-card--locked': idx > activeRankIndex,
                [`rank-card--${rank.key}`]: true,
              }"
              @click="setActiveRank(idx)"
            >
              <div class="rank-card__content" :class="{ 'rank-card__content--center': idx !== activeRankIndex }">

                <!-- Active Card: Current user's rank -->
                <template v-if="idx === activeRankIndex && currentUser && rank.key === currentUser.rankKey">
                  <div class="rank-card__top">
                    <span class="rank-card__name" :class="`rank-card__name--${rank.key}`">{{ $t(`profile.promotion.ranks.${rank.key}`) }}</span>
                    <span v-if="currentUser.isStudent" class="rank-card__tag rank-card__tag--student">{{ $t('profile.promotion.student') }}</span>
                  </div>
                  <div class="rank-card__user">
                    <i class="bi bi-person-fill"></i>
                    <span>{{ currentUser.name }}</span>
                  </div>
                  <div class="rank-card__bottom">
                    <p class="rank-card__spent">{{ $t('profile.promotion.spent') }} <strong>{{ currentUser.totalSpentFormatted }}</strong>/{{ rank.spentThresholdFormatted }}</p>
                    <div class="rank-card__progress-bar">
                      <div class="rank-card__progress-fill" :style="{ width: currentUser.progressPercent + '%' }"></div>
                    </div>
                    <p v-if="currentUser.renewalDate" class="rank-card__renew">{{ $t('profile.promotion.renewHint') }} {{ currentUser.renewalDate }}</p>
                    <p v-if="currentUser.nextRankName" class="rank-card__next">{{ $t('profile.promotion.needSpend') }} <strong>{{ currentUser.amountToNextRankFormatted }}</strong> {{ $t('profile.promotion.toRank') }} <strong>{{ currentUser.nextRankName }}</strong></p>
                  </div>
                </template>

                <!-- Active Card: Other ranks (not user's current) -->
                <template v-else-if="idx === activeRankIndex">
                  <div class="rank-card__top">
                    <span class="rank-card__name" :class="`rank-card__name--${rank.key}`">{{ $t(`profile.promotion.ranks.${rank.key}`) }}</span>
                  </div>
                  <div class="rank-card__unlock-info">
                    <i class="bi bi-lock-fill"></i>
                    <span>{{ $t('profile.promotion.notUnlocked') }}</span>
                  </div>
                </template>

                <!-- Side Cards (non-active) -->
                <template v-else>
                  <div class="rank-card__name rank-card__name--side" :class="`rank-card__name--${rank.key}`">{{ $t(`profile.promotion.ranks.${rank.key}`) }}</div>
                  <div class="rank-card__lock-info">
                    <i class="bi bi-lock-fill"></i>
                    <span>{{ $t('profile.promotion.notUnlocked') }}</span>
                  </div>
                </template>

              </div>
            </div>
          </div>
        </div>

        <!-- Next Arrow -->
        <button
          type="button"
          class="rank-carousel__arrow rank-carousel__arrow--next"
          :class="{ 'rank-carousel__arrow--disabled': activeRankIndex === ranks.length - 1 }"
          :disabled="activeRankIndex === ranks.length - 1"
          @click="nextRank"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>

      <!-- Stepper Bar -->
      <div class="rank-stepper-bar">
        <div class="rank-stepper-bar__track">
          <div
            class="rank-stepper-bar__fill"
            :style="{ width: (activeRankIndex / (ranks.length - 1) * 100) + '%' }"
          ></div>
        </div>
        <div class="rank-stepper-bar__dots">
          <div
            v-for="(rank, idx) in ranks"
            :key="rank.key"
            class="rank-stepper-bar__dot"
            :class="{
              'rank-stepper-bar__dot--done': idx < activeRankIndex,
              'rank-stepper-bar__dot--active': idx === activeRankIndex,
            }"
          >
            <i v-if="idx < activeRankIndex" class="bi bi-check"></i>
            <i v-else-if="idx === activeRankIndex" class="bi bi-circle-fill"></i>
          </div>
        </div>
      </div>

    </div>
  </div>


  <!-- Benefits Section -->
  <div class="promotion-card">
    <div class="promotion-card__header">
      <h3 class="promotion-card__title">{{ $t('profile.promotion.shoppingBenefits') }}</h3>
    </div>
    <div v-if="shoppingBenefits.length === 0 && !isLoadingBenefits" class="promotion-card__body promotion-card__body--benefits">
      <div class="benefit-item">
        <div class="benefit-item__icon benefit-item__icon--locked">
          <i class="bi bi-cart"></i>
        </div>
        <div class="benefit-item__content">
          <div class="benefit-item__title">{{ $t('profile.promotion.yourOffers') }}</div>
          <div class="benefit-item__desc">{{ $t('profile.promotion.noOffers') }}</div>
        </div>
        <div class="benefit-item__lock">
          <i class="bi bi-lock-fill"></i>
        </div>
      </div>
    </div>
    <div v-else class="promotion-card__body promotion-card__body--benefits">
      <div
        v-for="benefit in shoppingBenefits"
        :key="benefit.id"
        class="benefit-item"
        :class="{ 'benefit-item--locked': benefit.isLocked }"
      >
        <div class="benefit-item__icon" :class="benefit.isLocked ? 'benefit-item__icon--locked' : ''">
          <i :class="benefit.icon || 'bi bi-star'"></i>
        </div>
        <div class="benefit-item__content">
          <div class="benefit-item__title">{{ benefit.title }}</div>
          <div class="benefit-item__desc">{{ benefit.description }}</div>
        </div>
        <div v-if="benefit.isLocked" class="benefit-item__lock">
          <i class="bi bi-lock-fill"></i>
        </div>
      </div>
    </div>
  </div>

  <!-- Service Policy -->
  <div class="promotion-card">
    <div class="promotion-card__header">
      <h3 class="promotion-card__title">{{ $t('profile.promotion.servicePolicy') }}</h3>
    </div>
    <div v-if="servicePolicies.length === 0 && !isLoadingBenefits" class="promotion-card__body promotion-card__body--center promotion-card__body--benefits">
      <div class="benefit-locked">
        <i class="bi bi-shield-lock"></i>
        <p>{{ $t('profile.promotion.noOffers') }}</p>
      </div>
    </div>
    <div v-else class="promotion-card__body promotion-card__body--benefits">
      <div
        v-for="policy in servicePolicies"
        :key="policy.id"
        class="benefit-item"
        :class="{ 'benefit-item--locked': policy.isLocked }"
      >
        <div class="benefit-item__icon" :class="policy.isLocked ? 'benefit-item__icon--locked' : ''">
          <i :class="policy.icon || 'bi bi-shield'"></i>
        </div>
        <div class="benefit-item__content">
          <div class="benefit-item__title">{{ policy.title }}</div>
          <div class="benefit-item__desc">{{ policy.description }}</div>
        </div>
        <div v-if="policy.isLocked" class="benefit-item__lock">
          <i class="bi bi-lock-fill"></i>
        </div>
      </div>
    </div>
  </div>

  <!-- Upgrade Conditions -->
  <div class="promotion-card">
    <div class="promotion-card__header">
      <h3 class="promotion-card__title">{{ $t('profile.promotion.upgradeConditions') }}</h3>
    </div>
    <div class="promotion-card__body promotion-card__body--benefits">
      <div class="condition-table">
        <div class="condition-table__header">
          <span>{{ $t('profile.promotion.rankTitle') }}</span>
          <span>{{ $t('profile.promotion.spent') }}</span>
        </div>
        <div
          v-for="rank in ranks"
          :key="rank.key"
          class="condition-table__row"
          :class="{ 'condition-table__row--active': currentUser && rank.key === currentUser.rankKey }"
        >
          <span class="condition-table__rank">
            <i :class="rank.icon"></i>
            {{ $t(`profile.promotion.ranks.${rank.key}`) }}
          </span>
          <span class="condition-table__threshold">{{ rank.spentThresholdFormatted }}</span>
        </div>
      </div>
    </div>
  </div>
</ProfileLayout>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMemberRankStore } from '@/stores/memberRankStore'
import ProfileLayout from '@/components/Common/ProfileLayout.vue'

definePageMeta({ layout: 'default' })
useHead({ title: 'Hạng thành viên và ưu đãi - IrusGear' })

const memberRankStore = useMemberRankStore()
const { currentUser, ranks, shoppingBenefits, servicePolicies, isLoadingRank, isLoadingBenefits } = storeToRefs(memberRankStore)

memberRankStore.fetchMemberRank()
memberRankStore.fetchBenefits()

const carouselViewport = ref(null)
const activeRankIndex = ref(0)
const trackOffset = ref(0)
const isDragging = ref(false)

let dragStartX = 0
let dragStartOffset = 0
let lastDragX = 0
let lastDragTime = 0
let velocity = 0 // pixels per ms, positive = swiping left

// Fixed card dimensions (must match CSS)
const CARD_GAP = 10
const CARD_WIDTH_NORMAL = 240
const CARD_WIDTH_ACTIVE = 300
const CARD_STEP = CARD_WIDTH_NORMAL + CARD_GAP  // 250px per card

// Velocity threshold (px/ms) to trigger directional snap
// 0.4 px/ms ≈ 240px/s ≈ fast swipe
const VELOCITY_THRESHOLD = 0.3
// Distance threshold (px) to trigger directional snap even with low velocity
const DIST_THRESHOLD = 80

const setActiveRank = (idx) => {
  if (isDragging.value) return
  activeRankIndex.value = idx
}

// Move track so that activeRankIndex card is centered in viewport
const centerActiveCard = () => {
  nextTick(() => {
    const viewport = carouselViewport.value
    if (!viewport) return

    const vw = viewport.offsetWidth
    const idx = activeRankIndex.value

    let cardStartX = 0
    for (let i = 0; i < idx; i++) {
      cardStartX += CARD_STEP
    }

    const cardCenterX = cardStartX + CARD_WIDTH_ACTIVE / 2
    trackOffset.value = cardCenterX - vw / 2
  })
}

watch(activeRankIndex, centerActiveCard)

onMounted(() => {
  centerActiveCard()
})

const startDrag = (e) => {
  isDragging.value = true
  dragStartX = e.pageX
  dragStartOffset = trackOffset.value
  lastDragX = e.pageX
  lastDragTime = Date.now()
  velocity = 0
}

const onDrag = (e) => {
  if (!isDragging.value) return

  const now = Date.now()
  const dt = now - lastDragTime
  const dx = lastDragX - e.pageX

  // Calculate velocity (px per ms)
  if (dt > 0) {
    velocity = dx / dt
  }

  lastDragX = e.pageX
  lastDragTime = now

  const delta = dragStartX - e.pageX
  trackOffset.value = dragStartOffset + delta
}

const endDrag = () => {
  if (!isDragging.value) return
  isDragging.value = false

  nextTick(() => {
    const viewport = carouselViewport.value
    if (!viewport) return

    const vw = viewport.offsetWidth
    const viewportCenterX = vw / 2
    const totalCards = ranks.length

    // Find all card centers using fixed-width math
    const cardCenters = []
    let cardX = 0
    for (let i = 0; i < totalCards; i++) {
      cardCenters.push(cardX + CARD_WIDTH_ACTIVE / 2)
      cardX += CARD_STEP
    }

    // ── 1. Velocity-based snap ──────────────────────────────
    // If swiping fast enough, jump in swipe direction
    const swipeLeft = velocity > VELOCITY_THRESHOLD      // dragging left → want next card
    const swipeRight = velocity < -VELOCITY_THRESHOLD     // dragging right → want prev card

    if (swipeLeft || swipeRight) {
      const suggestedIdx = activeRankIndex.value + (swipeLeft ? 1 : -1)
      activeRankIndex.value = Math.max(0, Math.min(suggestedIdx, totalCards - 1))
      return
    }

    // ── 2. Distance-threshold snap ──────────────────────────
    // If dragged far enough past a card boundary, snap to next/prev
    const currentOffset = dragStartOffset + (lastDragX - dragStartX)
    // Distance the current active card's center has moved from viewport center
    let currentCardStartX = 0
    for (let i = 0; i < activeRankIndex.value; i++) {
      currentCardStartX += CARD_STEP
    }
    const currentCardCenterX = currentCardStartX + CARD_WIDTH_ACTIVE / 2
    const offsetFromCenter = currentOffset - (currentCardCenterX - vw / 2)

    if (offsetFromCenter < -DIST_THRESHOLD && activeRankIndex.value < totalCards - 1) {
      // Dragged left enough → next card
      activeRankIndex.value++
      return
    }
    if (offsetFromCenter > DIST_THRESHOLD && activeRankIndex.value > 0) {
      // Dragged right enough → prev card
      activeRankIndex.value--
      return
    }

    // ── 3. Nearest-center snap (fallback) ───────────────────
    let nearestIdx = 0
    let nearestDist = Infinity
    cardCenters.forEach((centerX, i) => {
      const dist = Math.abs(centerX - viewportCenterX)
      if (dist < nearestDist) {
        nearestDist = dist
        nearestIdx = i
      }
    })
    activeRankIndex.value = nearestIdx
  })
}

onUnmounted(() => {
  isDragging.value = false
})

const prevRank = () => {
  if (activeRankIndex.value > 0) {
    activeRankIndex.value--
  }
}

const nextRank = () => {
  if (activeRankIndex.value < ranks.length - 1) {
    activeRankIndex.value++
  }
}
</script>

<style scoped>
/* ── Card ─── */
.promotion-card {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 18px;
  overflow: hidden;
}

.promotion-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #f4f4f5;
  gap: 12px;
  flex-wrap: wrap;
}

.promotion-card__title {
  font-size: 15px;
  font-weight: 700;
  color: #18181b;
  margin: 0;
}

.promotion-card__badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.promotion-card__badge--student {
  background: #ed0017;
  color: #fff;
}

.promotion-card__body {
  padding: 16px;
}

.promotion-card__body--center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px 16px;
}

.promotion-card__body--benefits {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.promotion-card__body--rank {
  padding: 0;
}

/* ── Empty State ─── */
.promotion-card__empty-img {
  width: 88px;
  height: auto;
  object-fit: contain;
}

.promotion-card__empty-text {
  font-size: 14px;
  color: #a1a1aa;
  margin: 0;
  text-align: center;
}

/* ── Rank Carousel ─── */
.rank-carousel {
  position: relative;
  display: flex;
  align-items: center;
}

.rank-carousel__viewport {
  overflow: hidden;
  width: 100%;
}

.rank-carousel__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #e4e4e7;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #52525b;
  font-size: 18px;
  transition: background 0.15s, color 0.15s, box-shadow 0.15s;
  flex-shrink: 0;
}

.rank-carousel__arrow:hover:not(:disabled) {
  background: #f4f4f5;
  color: #18181b;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.rank-carousel__arrow--disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.rank-carousel__arrow--prev {
  left: 8px;
}

.rank-carousel__arrow--next {
  right: 8px;
}

.rank-carousel__track {
  display: flex;
  gap: 10px;
  cursor: grab;
  user-select: none;
  padding: 8px 0;
  /* No overflow-x: auto — uses transform instead */
  will-change: transform;
  transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.rank-carousel__track--dragging {
  cursor: grabbing;
  /* Disable transition during drag for real-time response */
  transition: none;
}

/* ── Rank Card ─── */
.rank-card {
  flex-shrink: 0;
  width: 240px;
  height: 150px;
  border-radius: 14px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: transform 0.25s ease, opacity 0.25s ease, box-shadow 0.25s ease, width 0.25s ease, height 0.25s ease;
  opacity: 0.5;
  transform: scale(0.88);
  background: linear-gradient(135deg, #6b7280, #9ca3af);
}

.rank-card--active {
  opacity: 1;
  transform: scale(1);
  width: 300px;
  height: 160px;
  box-shadow: 0 4px 20px rgba(215, 0, 24, 0.15), 0 0 32px rgba(0, 0, 0, 0.06);
  z-index: 2;
  border: 2px solid rgba(215, 0, 24, 0.25);
}

.rank-card--done {
  opacity: 0.7;
}

.rank-card--snull { background: linear-gradient(135deg, #6b7280, #9ca3af); }
.rank-card--snew { background: linear-gradient(135deg, #2563eb, #60a5fa); }
.rank-card--smem { background: linear-gradient(135deg, #7c3aed, #a78bfa); }
.rank-card--svip { background: linear-gradient(135deg, #d97706, #fbbf24); }

.rank-card--active.rank-card--snull { background: linear-gradient(135deg, #4b5563, #6b7280); }
.rank-card--active.rank-card--snew { background: linear-gradient(135deg, #1d4ed8, #2563eb); }
.rank-card--active.rank-card--smem { background: linear-gradient(135deg, #6d28d9, #7c3aed); }
.rank-card--active.rank-card--svip { background: linear-gradient(135deg, #b45309, #d97706); }

.rank-card--locked {
  background: linear-gradient(135deg, #4b5563, #6b7280) !important;
}

.rank-card__content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
}

.rank-card__content--center {
  align-items: center;
  justify-content: center;
}

/* Card Name */
.rank-card__name {
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #85878D 6.52%, #B3B3B3 76.27%, #AEAFAF 94.99%, #A2A3A4 113.7%, #979899 127.31%, #858588 152.83%, #6F6F73 166.44%, #5D5C62 176.65%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.rank-card__name--side {
  font-size: 11px;
}

.rank-card__tag {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 999px;
}

.rank-card__tag--student {
  background: #ed0017;
  color: #fff;
  -webkit-text-fill-color: #fff;
}

/* Active Card content layout */
.rank-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: auto;
}

.rank-card__user {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: #18181b;
  margin-bottom: 6px;
}

.rank-card__user i {
  font-size: 16px;
  color: #71717a;
  flex-shrink: 0;
}

.rank-card__bottom {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.rank-card__spent {
  font-size: 12px;
  color: #18181b;
  margin: 0;
}

.rank-card__spent strong {
  font-weight: 800;
}

.rank-card__progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 999px;
  overflow: hidden;
  margin: 2px 0;
}

.rank-card__progress-fill {
  height: 100%;
  background: #d70018;
  border-radius: 999px;
  transition: width 0.4s ease;
}

.rank-card__renew {
  font-size: 10px;
  color: #71717a;
  margin: 0;
}

.rank-card__next {
  font-size: 10px;
  color: #52525b;
  margin: 0;
}

.rank-card__next strong {
  font-weight: 700;
  color: #18181b;
}

/* Unlock info (active locked cards) */
.rank-card__unlock-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #b88a6e;
  font-size: 11px;
  text-align: center;
  margin-top: auto;
}

.rank-card__unlock-info i {
  font-size: 24px;
}

/* Side card lock */
.rank-card__lock-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #b88a6e;
  font-size: 10px;
  text-align: center;
}

.rank-card__lock-info i {
  font-size: 18px;
}

.rank-card__name--svip {
  background: linear-gradient(135deg, #fff 6.52%, #f0f0f0 50%, #d0d0d0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.rank-card--svip .rank-card__lock-info {
  color: rgba(255, 255, 255, 0.5);
}

/* ── Stepper Bar ─── */
.rank-stepper-bar {
  position: relative;
  padding: 20px 0 24px;
}

.rank-stepper-bar__track {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 4px;
  background: #e4e4e7;
  border-radius: 999px;
  overflow: hidden;
}

.rank-stepper-bar__fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: #d70018;
  border-radius: 999px;
  transition: width 0.35s ease;
}

.rank-stepper-bar__dots {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rank-stepper-bar__dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #e4e4e7;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #a1a1aa;
  flex-shrink: 0;
  transition: all 0.25s ease;
  position: relative;
  z-index: 1;
}

.rank-stepper-bar__dot--done {
  background: #d70018;
  border-color: #d70018;
  color: #fff;
}

.rank-stepper-bar__dot--active {
  background: #d70018;
  border-color: #d70018;
  color: #fff;
  animation: pulse-dot 1.5s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* ── Benefit Item ─── */
.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
}

.benefit-item__icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 16px;
}

.benefit-item__icon--locked {
  background: #f4f4f5;
  color: #a1a1aa;
}

.benefit-item__content {
  flex: 1;
  min-width: 0;
}

.benefit-item__title {
  font-size: 14px;
  font-weight: 600;
  color: #18181b;
  margin-bottom: 4px;
}

.benefit-item__desc {
  font-size: 13px;
  color: #71717a;
  line-height: 1.5;
}

.benefit-item--locked {
  opacity: 0.8;
}

.benefit-item__lock {
  font-size: 16px;
  color: #a1a1aa;
  flex-shrink: 0;
}

/* ── Benefit Locked ─── */
.benefit-locked {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  color: #a1a1aa;
  text-align: center;
}

.benefit-locked i {
  font-size: 32px;
  opacity: 0.5;
}

.benefit-locked p {
  font-size: 13px;
  color: #a1a1aa;
  margin: 0;
  line-height: 1.5;
}

/* ── Condition Table ─── */
.condition-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
}

.condition-item__icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 16px;
}

.condition-item__icon--info {
  background: #d70018;
  color: #fff;
}

.condition-item__content {
  flex: 1;
  min-width: 0;
}

.condition-item__title {
  font-size: 14px;
  font-weight: 600;
  color: #18181b;
  margin-bottom: 4px;
}

.condition-item__desc {
  font-size: 13px;
  color: #71717a;
  line-height: 1.5;
}

.condition-item__desc strong {
  color: #18181b;
  font-weight: 700;
}

.condition-table {
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  overflow: hidden;
}

.condition-table__header {
  display: flex;
  padding: 10px 14px;
  background: #f9fafb;
  border-bottom: 1px solid #e4e4e7;
  font-size: 12px;
  font-weight: 700;
  color: #71717a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  gap: 16px;
}

.condition-table__header span:last-child {
  margin-left: auto;
}

.condition-table__row {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid #f0f0f2;
  font-size: 13px;
  gap: 16px;
}

.condition-table__row:last-child {
  border-bottom: none;
}

.condition-table__row--active {
  background: rgba(215, 0, 24, 0.04);
}

.condition-table__rank {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: #52525b;
}

.condition-table__row--active .condition-table__rank {
  color: #d70018;
}

.condition-table__rank i {
  font-size: 14px;
}

.condition-table__threshold {
  margin-left: auto;
  font-weight: 500;
  color: #71717a;
}

.condition-table__row--active .condition-table__threshold {
  color: #18181b;
}
</style>
