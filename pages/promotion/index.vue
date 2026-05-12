<template>
  <ProfileLayout>
    <div class="promotion-page">
      <section class="promotion-offers" aria-labelledby="promotion-offers-title">
        <h1 id="promotion-offers-title" class="promotion-offers__title">Ưu đãi của bạn</h1>
        <div class="promotion-offers__empty">
          <img
            class="promotion-offers__empty-img"
            src="https://cdn-static.smember.com.vn/_next/static/media/empty.f8088c4d.png"
            alt="empty"
            loading="lazy"
          />
          <p>Bạn đang chưa có ưu đãi nào</p>
        </div>
      </section>

      <section class="member-ranks" aria-label="Hạng thành viên">
        <div class="member-ranks__carousel">
          <button
            type="button"
            class="member-ranks__nav member-ranks__nav--prev"
            :disabled="activeRankIndex === 0"
            aria-label="Hạng trước"
            @click="goToPrevRank"
          >
            <i class="bi bi-chevron-left"></i>
          </button>

          <div ref="carouselViewport" class="member-ranks__viewport">
            <div class="member-ranks__track">
              <div
                v-for="(item, index) in carouselItems"
                :key="item.key"
                class="member-ranks__slide"
                :class="{
                  'member-ranks__slide--active': index === activeRankIndex && !item.isMax,
                  'member-ranks__slide--max': item.isMax,
                }"
                :data-rank-index="index"
              >
                <button
                  v-if="!item.isMax"
                  type="button"
                  class="member-rank-card"
                  :class="[
                    `member-rank-card--${item.key}`,
                    {
                      'member-rank-card--active': index === activeRankIndex,
                      'member-rank-card--current': index === currentRankIndex,
                      'member-rank-card--locked': index > currentRankIndex,
                    },
                  ]"
                  :style="{ backgroundImage: `url(${item.background})` }"
                  @click="setActiveRank(index)"
                >
                  <span v-if="index === currentRankIndex && currentUser?.isStudent" class="member-rank-card__student">
                    S-Student
                  </span>

                  <span class="member-rank-card__tier">{{ item.name }}</span>

                  <div v-if="index === currentRankIndex" class="member-rank-card__current-body">
                    <div class="member-rank-card__customer">
                      <span class="member-rank-card__avatar" aria-hidden="true">
                        <i class="bi bi-person-fill"></i>
                      </span>
                      <strong>{{ displayName }}</strong>
                    </div>

                    <div class="member-rank-card__spend">
                      <span>
                        Đã mua
                        <strong>{{ totalSpentText }}</strong>/<span>{{ thresholdText(item.key) }}</span>
                      </span>
                      <div class="member-rank-card__progress" aria-hidden="true">
                        <span :style="{ width: `${progressPercent}%` }"></span>
                      </div>
                      <small v-if="currentUser?.renewalDate">
                        Hạng thành viên được cập nhật lại sau {{ currentUser.renewalDate }}
                      </small>
                      <small v-if="currentUser?.amountToNextRankFormatted">
                        Cần chi tiêu thêm <strong>{{ currentUser.amountToNextRankFormatted }}</strong>
                        để lên hạng <strong>{{ currentUser.nextRankName || nextRankName }}</strong>
                      </small>
                    </div>
                  </div>

                  <div v-else class="member-rank-card__locked-body">
                    <i class="bi bi-lock-fill"></i>
                    <span>Chưa mở khóa hạng thành viên</span>
                  </div>
                </button>

                <div v-else class="member-rank-card member-rank-card--max">
                  <span>Đang xem hạng cao nhất</span>
                  <i class="bi bi-chevron-right"></i>
                </div>

                <div class="member-ranks__timeline" aria-hidden="true">
                  <span class="member-ranks__line" :class="{ 'member-ranks__line--done': index <= activeRankIndex }"></span>
                  <span class="member-ranks__line" :class="{ 'member-ranks__line--done': index < activeRankIndex }"></span>
                  <span
                    v-if="!item.isMax"
                    class="member-ranks__marker"
                    :class="{
                      'member-ranks__marker--done': index <= currentRankIndex,
                      'member-ranks__marker--active': index === activeRankIndex,
                    }"
                  >
                    <i v-if="index <= currentRankIndex" class="bi bi-check-lg"></i>
                    <span v-else></span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            class="member-ranks__nav member-ranks__nav--next"
            :disabled="activeRankIndex >= rankCards.length - 1"
            aria-label="Hạng tiếp theo"
            @click="goToNextRank"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>

        <div class="member-rank-detail">
          <div class="member-rank-detail__section">
            <h2>Điều kiện thăng cấp</h2>
            <div class="member-rank-detail__item">
              <span class="member-rank-detail__icon">
                <i class="bi bi-gem"></i>
              </span>
              <p>{{ activeRankContent.condition }}</p>
            </div>
          </div>

          <div v-if="activeRankContent.familyVoucher" class="member-rank-detail__section">
            <h2>Đặc quyền tặng voucher cho người thân</h2>
            <div class="member-rank-detail__item">
              <span class="member-rank-detail__icon">
                <i class="bi bi-gift"></i>
              </span>
              <p v-html="activeRankContent.familyVoucher"></p>
              <span class="member-rank-detail__new">Mới</span>
            </div>
          </div>

          <div class="member-rank-detail__section">
            <h2>Ưu đãi mua hàng</h2>
            <div
              v-for="(benefit, index) in activeRankContent.shoppingBenefits"
              :key="`shopping-${index}`"
              class="member-rank-detail__item"
            >
              <span class="member-rank-detail__icon">
                <i :class="benefit.icon"></i>
              </span>
              <p v-html="benefit.html"></p>
            </div>
          </div>

          <div class="member-rank-detail__section member-rank-detail__section--last">
            <h2>Chính sách phục vụ</h2>
            <template v-if="activeRankContent.servicePolicies.length">
              <div
                v-for="(policy, index) in activeRankContent.servicePolicies"
                :key="`policy-${index}`"
                class="member-rank-detail__item"
              >
                <span class="member-rank-detail__icon">
                  <i :class="policy.icon"></i>
                </span>
                <p v-html="policy.html"></p>
              </div>
            </template>
            <div v-else class="member-rank-detail__locked">
              <i class="bi bi-lock-fill"></i>
              <span>Hiện chưa có chính sách ưu đãi phục vụ đặc biệt cho hạng thành viên {{ activeRankName }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </ProfileLayout>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMemberRankStore } from '@/stores/memberRankStore'
import ProfileLayout from '@/components/Common/ProfileLayout.vue'

definePageMeta({ layout: 'default' })
useHead({ title: 'Hạng thành viên và ưu đãi - IrusGear' })

const memberRankStore = useMemberRankStore()
const { currentUser, ranks } = storeToRefs(memberRankStore)

const carouselViewport = ref(null)
const activeRankIndex = ref(0)

const rankAssets = {
  snull: {
    name: 'S-NULL',
    background: 'https://cdn-static.smember.com.vn/_next/static/media/snull-bg-card.7284811e.png',
    threshold: '3.000.000đ',
  },
  snew: {
    name: 'S-NEW',
    background: 'https://cdn-static.smember.com.vn/_next/static/media/snew-bg-card.f753cfbc.png',
    threshold: '15.000.000đ',
  },
  smem: {
    name: 'S-MEM',
    background: 'https://cdn-static.smember.com.vn/_next/static/media/smem-bg-card.1fa74fdc.png',
    threshold: '50.000.000đ',
  },
  svip: {
    name: 'S-VIP',
    background: 'https://cdn-static.smember.com.vn/_next/static/media/svip-bg-card.59d559cc.png',
    threshold: '50.000.000đ',
  },
}

const defaultRanks = [
  { key: 'snull', name: 'S-NULL' },
  { key: 'snew', name: 'S-NEW' },
  { key: 'smem', name: 'S-MEM' },
  { key: 'svip', name: 'S-VIP' },
]

const rankContent = {
  snull: {
    condition:
      'Tổng số tiền mua hàng tích luỹ trong năm nay và năm liền trước đạt từ 0 đến 3 triệu đồng, không tính đơn hàng doanh nghiệp B2B',
    shoppingBenefits: [
      {
        icon: 'bi bi-gift',
        html: 'Hiện chưa có ưu đãi mua hàng đặc biệt cho hạng thành viên S-Null',
      },
    ],
    servicePolicies: [],
  },
  snew: {
    condition:
      'Tổng số tiền mua hàng tích luỹ trong năm nay và năm liền trước đạt từ 3 đến 15 triệu đồng, không tính đơn hàng doanh nghiệp B2B',
    shoppingBenefits: [
      {
        icon: 'bi bi-gift',
        html: '<strong>Tặng voucher 50K</strong> khi lên hạng (từ SNULL lên SNEW)',
      },
      {
        icon: 'bi bi-gift',
        html: '<strong>Giảm thêm 0.5%</strong> khi mua các sản phẩm thuộc nhóm hàng linh kiện PC, phụ kiện IT - Thiết bị văn phòng, phụ kiện Apple, ốp - bao da Apple/Samsung, đồng hồ, camera giám sát',
      },
      {
        icon: 'bi bi-gift',
        html: '<strong>Giảm thêm 2%</strong> khi mua các sản phẩm thuộc nhóm hàng sim thẻ, bao túi xách, ốp dán còn lại, cáp, sạc dự phòng,...',
      },
      {
        icon: 'bi bi-wallet2',
        html: '<strong>Giảm thêm 5% (tối đa 100.000đ)</strong> khi sử dụng các dịch vụ sửa chữa tại Điện Thoại Vui',
      },
      {
        icon: 'bi bi-cart3',
        html: '<strong>Giảm thêm 5% (tối đa 200.000đ)</strong> khi thực hiện thu cũ lên đời',
      },
      {
        icon: 'bi bi-calendar-heart',
        html: 'Ưu đãi sinh nhật: Tặng phiếu mua hàng trị giá <strong>50.000đ</strong> (Code chỉ sử dụng 1 lần, áp dụng cho các đơn hàng Trừ thẻ cào, sim, phi thu hộ, gói BHMR có giá trị lớn gấp đôi giá trị code)',
      },
    ],
    servicePolicies: [],
  },
  smem: {
    condition:
      'Tổng số tiền mua hàng tích luỹ trong năm nay và năm liền trước đạt từ 15 đến 50 triệu đồng, không tính đơn hàng doanh nghiệp B2B',
    familyVoucher:
      '<strong>Nhận voucher trị giá 10% tối đa 150K</strong> tặng cho người thân, bạn bè (Voucher chỉ áp dụng cho khách hàng chưa có tài khoản Smember và chưa từng mua hàng tại CellphoneS)',
    shoppingBenefits: [
      {
        icon: 'bi bi-wallet2',
        html: '<strong>Ưu đãi thu cũ 5% lên đến 300K</strong> cho các sản phẩm mua tại CellphoneS',
      },
      {
        icon: 'bi bi-truck',
        html: '<strong>Miễn phí giao hàng</strong> áp dụng cho mọi đơn hàng',
      },
      {
        icon: 'bi bi-cart3',
        html: '<strong>Tặng voucher 100K</strong> khi lên hạng (từ SNEW lên SMEM)',
      },
      {
        icon: 'bi bi-gift',
        html: '<strong>Giảm thêm 0.5%</strong> khi mua các sản phẩm máy (điện thoại, máy tính, máy tính bảng, Apple Watch), loa - tai nghe, điện máy, gia dụng, máy ảnh, hàng cũ',
      },
      {
        icon: 'bi bi-gift',
        html: '<strong>Giảm thêm 1%</strong> khi mua các sản phẩm phụ kiện IT, thiết bị văn phòng, đồng hồ, camera giám sát, phụ kiện Apple, ốp bao da Samsung - Apple',
      },
      {
        icon: 'bi bi-gift',
        html: '<strong>Giảm thêm 3%</strong> khi mua các sản phẩm thuộc nhóm hàng sạc dự phòng, củ cáp, phụ kiện tiện ích, ốp bao da (trừ Apple, Samsung), balo, túi xách',
      },
      {
        icon: 'bi bi-wallet2',
        html: '<strong>Giảm thêm 5% (tối đa 200.000đ)</strong> khi sử dụng các dịch vụ sửa chữa tại Điện Thoại Vui',
      },
      {
        icon: 'bi bi-cart3',
        html: '<strong>Giảm thêm 5% (tối đa 300.000đ)</strong> khi thực hiện thu cũ lên đời',
      },
      {
        icon: 'bi bi-calendar-heart',
        html: 'Ưu đãi sinh nhật: Tặng phiếu mua hàng trị giá <strong>200.000đ</strong> (Code chỉ sử dụng 1 lần, áp dụng cho các đơn hàng Trừ thẻ cào, sim, phi thu hộ, gói BHMR có giá trị lớn gấp đôi giá trị code)',
      },
    ],
    servicePolicies: [],
  },
  svip: {
    condition:
      'Tổng số tiền mua hàng tích luỹ trong năm nay và năm liền trước đạt từ 50 triệu đồng trở lên, không tính đơn hàng doanh nghiệp B2B',
    familyVoucher:
      '<strong>Nhận voucher trị giá 10% tối đa 150K</strong> tặng cho người thân, bạn bè (Voucher chỉ áp dụng cho khách hàng chưa có tài khoản Smember và chưa từng mua hàng tại CellphoneS)',
    shoppingBenefits: [
      {
        icon: 'bi bi-wallet2',
        html: '<strong>Ưu đãi thu cũ 5% lên đến 500K</strong> cho các sản phẩm mua tại CellphoneS',
      },
      {
        icon: 'bi bi-truck',
        html: '<strong>Miễn phí giao hàng</strong> áp dụng cho mọi đơn hàng',
      },
      {
        icon: 'bi bi-cart3',
        html: '<strong>Tặng voucher 300K</strong> khi lên hạng (từ SMEM lên SVIP)',
      },
      {
        icon: 'bi bi-gift',
        html: '<strong>Giảm thêm 1%</strong> khi mua các sản phẩm máy (điện thoại, máy tính, máy tính bảng, Apple Watch), loa - tai nghe, điện máy, gia dụng, máy ảnh, hàng cũ',
      },
      {
        icon: 'bi bi-gift',
        html: '<strong>Giảm thêm 2%</strong> khi mua các sản phẩm phụ kiện IT, thiết bị văn phòng, đồng hồ, ốp bao da Samsung - Apple, camera giám sát, phụ kiện Apple',
      },
      {
        icon: 'bi bi-gift',
        html: '<strong>Giảm thêm 5%</strong> khi mua các sản phẩm thuộc nhóm hàng phụ kiện sim thẻ, pin dự phòng, sạc cáp, phụ kiện tiện ích, ốp bao da, balo túi xách',
      },
      {
        icon: 'bi bi-wallet2',
        html: '<strong>Giảm thêm 5% (tối đa 300.000đ)</strong> khi sử dụng các dịch vụ sửa chữa tại Điện Thoại Vui',
      },
      {
        icon: 'bi bi-cart3',
        html: '<strong>Giảm thêm 5% (tối đa 500.000đ)</strong> khi thực hiện thu cũ lên đời',
      },
      {
        icon: 'bi bi-calendar-heart',
        html: 'Ưu đãi sinh nhật: Tặng phiếu mua hàng trị giá <strong>500.000đ</strong> (Code chỉ sử dụng 1 lần, áp dụng cho các đơn hàng Trừ thẻ cào, sim, phi thu hộ, gói BHMR có giá trị lớn gấp đôi giá trị code)',
      },
    ],
    servicePolicies: [
      {
        icon: 'bi bi-gift',
        html: 'Tham gia chương trình đặt trước sản phẩm không cần đặt cọc tiền',
      },
      {
        icon: 'bi bi-wallet2',
        html: 'Tổng đài hỗ trợ và chăm sóc đặc biệt <strong>1800.2097</strong>',
      },
    ],
  },
}

const normalizeRankKey = (value) => String(value || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '')

const rankCards = computed(() => {
  const sourceRanks = ranks.value?.length ? ranks.value : defaultRanks

  return sourceRanks
    .map((rank) => {
      const key = normalizeRankKey(rank.key || rank.rank_key || rank.name)
      const asset = rankAssets[key]
      if (!asset) return null

      return {
        key,
        name: rank.name || asset.name,
        background: asset.background,
        threshold: rank.spentThresholdFormatted || asset.threshold,
      }
    })
    .filter(Boolean)
})

const carouselItems = computed(() => [
  ...rankCards.value,
  {
    key: 'highest-rank-placeholder',
    isMax: true,
  },
])

const currentRankIndex = computed(() => {
  const currentKey = normalizeRankKey(currentUser.value?.rankKey || 'snull')
  const index = rankCards.value.findIndex((rank) => rank.key === currentKey)
  return index >= 0 ? index : 0
})

const activeRank = computed(() => rankCards.value[activeRankIndex.value] || rankCards.value[0] || rankAssets.snull)

const activeRankName = computed(() => activeRank.value?.name || 'S-NULL')

const activeRankContent = computed(() => rankContent[activeRank.value?.key] || rankContent.snull)

const displayName = computed(() => (currentUser.value?.name || 'Khách hàng').toUpperCase())

const progressPercent = computed(() => {
  const value = Number(currentUser.value?.progressPercent || 0)
  return Math.max(0, Math.min(100, value))
})

const totalSpentText = computed(() => currentUser.value?.totalSpentFormatted || '0đ')

const nextRankName = computed(() => {
  const nextRank = rankCards.value[currentRankIndex.value + 1]
  return nextRank?.name || ''
})

const thresholdText = (rankKey) => {
  const rank = rankCards.value.find((item) => item.key === rankKey)
  return rank?.threshold || rankAssets[rankKey]?.threshold || '0đ'
}

const scrollActiveRankIntoView = (behavior = 'smooth') => {
  const viewport = carouselViewport.value
  if (!viewport) return

  const activeSlide = viewport.querySelector(`[data-rank-index="${activeRankIndex.value}"]`)
  activeSlide?.scrollIntoView({
    behavior,
    block: 'nearest',
    inline: 'center',
  })
}

const setActiveRank = (index) => {
  if (index < 0 || index >= rankCards.value.length) return
  activeRankIndex.value = index
}

const goToPrevRank = () => setActiveRank(activeRankIndex.value - 1)

const goToNextRank = () => setActiveRank(activeRankIndex.value + 1)

watch(
  () => currentRankIndex.value,
  (index) => {
    activeRankIndex.value = index
    nextTick(() => scrollActiveRankIntoView('auto'))
  },
  { immediate: true },
)

watch(activeRankIndex, () => {
  nextTick(() => scrollActiveRankIntoView())
})

onMounted(() => {
  memberRankStore.fetchMemberRank().catch(() => {})
  memberRankStore.fetchBenefits().catch(() => {})
  nextTick(() => scrollActiveRankIntoView('auto'))
})
</script>

<style scoped>
.promotion-page {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  color: #121214;
}

.promotion-offers,
.member-ranks {
  background: #fff;
  border: 1px solid #ececf1;
  border-radius: 12px;
}

.promotion-offers {
  min-height: 232px;
  padding: 12px;
}

.promotion-offers__title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
}

.promotion-offers__empty {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.promotion-offers__empty-img {
  width: 140px;
  height: 104px;
  object-fit: contain;
}

.promotion-offers__empty p {
  margin: 0;
  color: #a1a1aa;
  font-size: 11px;
}

.member-ranks {
  padding: 12px;
  overflow: hidden;
}

.member-ranks__carousel {
  position: relative;
  width: 100%;
  user-select: none;
}

.member-ranks__viewport {
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: 42px;
  scrollbar-width: none;
  padding-inline: 30px;
}

.member-ranks__viewport::-webkit-scrollbar {
  display: none;
}

.member-ranks__track {
  display: flex;
  align-items: center;
  gap: 40px;
  min-height: 195px;
}

.member-ranks__slide {
  position: relative;
  flex: 0 0 268px;
  min-height: 195px;
  padding-bottom: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: center;
  transition: flex-basis 0.2s ease;
}

.member-ranks__slide--active {
  flex-basis: 338px;
}

.member-ranks__slide--max {
  flex-basis: 268px;
}

.member-ranks__nav {
  position: absolute;
  top: 76px;
  z-index: 3;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 999px;
  background: #f7f7f8;
  box-shadow: 0 1px 8px rgba(18, 18, 20, 0.08);
  color: #52525b;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, opacity 0.15s ease;
}

.member-ranks__nav:hover:not(:disabled) {
  background: #fbe6e8;
  color: #d70018;
}

.member-ranks__nav:disabled {
  opacity: 0.35;
  cursor: default;
}

.member-ranks__nav--prev {
  left: 0;
}

.member-ranks__nav--next {
  right: 0;
}

.member-rank-card {
  position: relative;
  width: 260px;
  height: 100px;
  overflow: hidden;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  background-color: #f7f7f8;
  background-position: center;
  background-size: cover;
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.06), 0 4px 20px -8px rgba(0, 0, 0, 0.11);
  color: #1d1d20;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  padding: 0;
  cursor: pointer;
  transition: width 0.2s ease, height 0.2s ease, transform 0.2s ease;
}

.member-rank-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.03);
  pointer-events: none;
}

.member-rank-card--active {
  width: 324px;
  height: 150px;
}

.member-rank-card--svip {
  color: #fff;
}

.member-rank-card--max {
  cursor: default;
  background: #f7f7f8;
  color: #a1a1aa;
  align-items: center;
  justify-content: center;
  gap: 14px;
  flex-direction: row;
  filter: drop-shadow(0 8px 16px rgba(18, 18, 20, 0.04));
}

.member-rank-card--max i {
  font-size: 12px;
  color: #52525b;
}

.member-rank-card__student {
  position: absolute;
  top: 12px;
  right: 10px;
  z-index: 2;
  padding: 2px 8px;
  border-radius: 999px;
  background: linear-gradient(122deg, #31b47e 4.7%, #2eaf79 99.03%, #20ab71 193.35%);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  line-height: 1.5;
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.06), 0 4px 20px -8px rgba(0, 0, 0, 0.11);
}

.member-rank-card__tier {
  position: relative;
  z-index: 1;
  width: fit-content;
  min-width: 90px;
  margin-left: 16px;
  padding: 6px 18px 6px 14px;
  border: 1px solid rgba(228, 228, 231, 0.85);
  border-radius: 999px;
  background: linear-gradient(
    17deg,
    #85878d 6.52%,
    #b3b3b3 76.27%,
    #aeafaf 94.99%,
    #a2a3a4 113.7%,
    #979899 127.31%,
    #929394 139.22%,
    #858588 152.83%,
    #6f6f73 166.44%,
    #5d5c62 176.65%
  );
  background-blend-mode: soft-light;
  mix-blend-mode: hard-light;
  color: inherit;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
}

.member-rank-card--current.member-rank-card--active .member-rank-card__tier {
  position: absolute;
  top: 0;
  left: 0;
  min-width: 130px;
  margin: 0;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  border-radius: 0 0 999px 0;
  padding: 10px 24px 10px 16px;
}

.member-rank-card__current-body {
  position: relative;
  z-index: 1;
  margin-top: auto;
  padding: 0 14px 9px;
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.member-rank-card__customer {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  color: #2b2b30;
  font-size: 11px;
  line-height: 1.2;
}

.member-rank-card__customer strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.member-rank-card__avatar {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: rgba(173, 156, 157, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.72);
  color: #ad9c9d;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.member-rank-card__spend {
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: #2b2b30;
  font-size: 10px;
}

.member-rank-card__spend small {
  color: #ad9c9d;
  font-size: 10px;
  line-height: 1.25;
}

.member-rank-card__progress {
  width: 100%;
  height: 5px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.35);
}

.member-rank-card__progress span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #c6c0c0 -43.17%, #c6c0c0 100%);
}

.member-rank-card__locked-body {
  position: relative;
  z-index: 1;
  margin-top: 12px;
  padding-inline: 16px;
  color: #b88a6e;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 10px;
  line-height: 1.4;
}

.member-rank-card--smem .member-rank-card__locked-body {
  color: #c0904a;
}

.member-rank-card--svip .member-rank-card__locked-body {
  color: rgba(255, 255, 255, 0.56);
}

.member-rank-card__locked-body i {
  font-size: 18px;
}

.member-ranks__timeline {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.member-ranks__line {
  flex: 1;
  height: 4px;
  background: #e4e4e7;
}

.member-ranks__line--done {
  background: #d70018;
}

.member-ranks__slide--max .member-ranks__line {
  background: #e4e4e7;
}

.member-ranks__marker {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30px;
  height: 20px;
  padding: 0 5px;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.member-ranks__marker > span {
  width: 100%;
  height: 100%;
  border-radius: 999px;
  background: #e4e4e7;
  border: 3px solid #fff;
  outline: 3px solid #e4e4e7;
}

.member-ranks__marker--done {
  background: #fff;
}

.member-ranks__marker--done i {
  width: 100%;
  height: 100%;
  border-radius: 999px;
  background: #d70018;
  color: #fff;
  font-size: 13px;
  line-height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.member-ranks__marker--active {
  transform: translate(-50%, -50%) scale(1.15);
}

.member-rank-detail {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 8px 12px 0;
}

.member-rank-detail__section {
  padding: 20px 0;
  border-top: 1px dashed #cfcfd3;
}

.member-rank-detail__section:first-child {
  border-top: 0;
  padding-top: 12px;
}

.member-rank-detail__section--last {
  padding-bottom: 10px;
}

.member-rank-detail__section h2 {
  margin: 0 0 18px;
  color: #000;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.4;
  text-align: center;
  text-transform: uppercase;
}

.member-rank-detail__item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  min-height: 28px;
  margin-top: 14px;
  color: #121214;
  font-size: 13px;
  line-height: 1.55;
}

.member-rank-detail__item:first-of-type {
  margin-top: 0;
}

.member-rank-detail__item p {
  flex: 1;
  margin: 0;
}

.member-rank-detail__icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: linear-gradient(231deg, #ed8a95 -68.73%, #c40016 91.14%);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 14px;
}

.member-rank-detail__new {
  align-self: center;
  min-width: 36px;
  padding: 2px 9px;
  border-radius: 999px;
  background: #d70018;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  text-align: center;
}

.member-rank-detail__locked {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #d4d4d8;
  text-align: center;
}

.member-rank-detail__locked i {
  font-size: 48px;
  line-height: 1;
}

.member-rank-detail__locked span {
  color: #d4d4d8;
  font-size: 12px;
}

@media (max-width: 991.98px) {
  .promotion-offers {
    min-height: 190px;
  }

  .promotion-offers__empty {
    min-height: 140px;
  }

  .promotion-offers__empty-img {
    width: 104px;
    height: 78px;
  }

  .member-ranks {
    padding: 10px 8px;
  }

  .member-ranks__viewport {
    padding-inline: 22px;
  }

  .member-ranks__track {
    gap: 24px;
  }

  .member-ranks__slide {
    flex-basis: 232px;
  }

  .member-ranks__slide--active {
    flex-basis: 292px;
  }

  .member-rank-card {
    width: 220px;
  }

  .member-rank-card--active {
    width: 280px;
    height: 132px;
  }

  .member-ranks__nav {
    width: 28px;
    height: 28px;
    top: 82px;
  }

  .member-rank-detail {
    padding-inline: 6px;
  }

  .member-rank-detail__section h2 {
    font-size: 13px;
  }

  .member-rank-detail__item {
    font-size: 12px;
  }
}

@media (max-width: 575.98px) {
  .member-ranks__viewport {
    padding-inline: 14px;
  }

  .member-ranks__track {
    gap: 18px;
  }

  .member-ranks__slide,
  .member-ranks__slide--active,
  .member-ranks__slide--max {
    flex-basis: 268px;
  }

  .member-rank-card,
  .member-rank-card--active {
    width: 248px;
  }

  .member-rank-card--active {
    height: 132px;
  }

  .member-rank-card--current.member-rank-card--active .member-rank-card__tier {
    min-width: 118px;
    padding: 9px 20px 9px 14px;
  }
}
</style>
