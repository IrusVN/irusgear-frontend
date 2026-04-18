<template>
  <div class="home-page pb-4" :class="isMobile ? 'bg-mobile' : 'bg-light'">
    <!-- ═══ Mobile Home ═══ -->
    <template v-if="isMobile">
      <MobileHeroBanner />

      <div class="mobile-home-spacing">
        <MobileCategoryBar />
      </div>

      <MobileFlashSale />

      <MobileProductSection
        title="Điện thoại nổi bật"
        :products="deviceSection?.products || []"
        :view-all-link="deviceSection?.viewAllUrl || '/products?category=dien-thoai'"
      />

      <MobileProductSection
        title="Laptop"
        :products="laptopSection?.products || []"
        :view-all-link="laptopSection?.viewAllUrl || '/products?category=laptop'"
      />

      <MobileProductSection
        title="Đồng hồ"
        :products="watchSection?.products || []"
        :view-all-link="watchSection?.viewAllUrl || '/products?category=dong-ho'"
      />

      <MobileProductSection
        title="Tivi"
        :products="tvSection?.products || []"
        :view-all-link="tvSection?.viewAllUrl || '/products?category=tivi'"
      />

      <MobileProductSection
        title="Đồ gia dụng"
        :products="homeLifeSection?.products || []"
        :view-all-link="homeLifeSection?.viewAllUrl || '/products?category=do-gia-dung'"
      />

      <MobileUsedGoodsSection />

      <MobileFooter />
    </template>

    <!-- ═══ Desktop Home (unchanged) ═══ -->
    <template v-else>
      <HomeHero />

      <div class="container-xl px-3 py-4">
        <HomeProdSection section-key="device" />

        <HomeAccessoryGrid />

        <HomeProdSection section-key="laptop" />

        <HomeProdSection section-key="watchAudio" :desktop-product-rows="1" />

        <HomeProdSection section-key="tv" :desktop-product-rows="1" />

        <HomeProdSection section-key="homeLife" :desktop-product-rows="1" />

        <HomeProdSection section-key="cooling" :desktop-product-rows="1" />

        <HomeUsedGoodsGrid />
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useHead, useI18n } from "#imports";
import { useHomeSectionsStore } from "~/stores/homeSectionsStore";
import { useIsMobile } from "~/composables/useIsMobile";

/* Mobile components */
import MobileHeroBanner from "~/components/Mobile/MobileHeroBanner.vue";
import MobileCategoryBar from "~/components/Mobile/MobileCategoryBar.vue";
import MobileFlashSale from "~/components/Mobile/MobileFlashSale.vue";
import MobileProductSection from "~/components/Mobile/MobileProductSection.vue";
import MobileUsedGoodsSection from "~/components/Mobile/MobileUsedGoodsSection.vue";
import MobileFooter from "~/components/Mobile/MobileFooter.vue";

definePageMeta({ layout: "default" });

const { t } = useI18n();
useHead({ title: computed(() => t("page_titles.home")) });

const { isMobile } = useIsMobile();
const homeSectionsStore = useHomeSectionsStore();

/* Computed sections for mobile */
const deviceSection = computed(() => homeSectionsStore.getSection("device"));
const laptopSection = computed(() => homeSectionsStore.getSection("laptop"));
const watchSection = computed(() => homeSectionsStore.getSection("watchAudio"));
const tvSection = computed(() => homeSectionsStore.getSection("tv"));
const homeLifeSection = computed(() => homeSectionsStore.getSection("homeLife"));

onMounted(() => {
  homeSectionsStore.initHomeSections();
});
</script>

<style scoped>
.bg-mobile {
  background: #f2f3f7;
}

.mobile-home-spacing {
  margin-top: 10px;
}
</style>

