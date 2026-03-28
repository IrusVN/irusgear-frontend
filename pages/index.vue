<template>
  <div class="home-page pb-4 bg-light">
    <!-- HERO SECTION -->
    <HomeHero />

    <!-- MAIN CONTENT -->
    <div class="container-xl px-3 py-4">
      
      <!-- ĐIỆN THOẠI -->
      <HomeProdSection 
        title="ĐIỆN THOẠI" 
        :tabs="phoneTabs" 
        :products="phoneState.data" 
        :loading="phoneState.loading"
        color="#c62828" 
        @change-tab="fetchPhones"
      />

      <!-- LAPTOP -->
      <HomeProdSection 
        title="LAPTOP" 
        :tabs="laptopTabs" 
        :products="laptopState.data" 
        :loading="laptopState.loading"
        color="#1565c0" 
        @change-tab="fetchLaptops"
      />

      <!-- ÂM THANH -->
      <HomeProdSection 
        title="ÂM THANH" 
        :tabs="audioTabs" 
        :products="audioState.data" 
        :loading="audioState.loading"
        color="#2e7d32" 
        @change-tab="fetchAudio"
      />

      <!-- ĐỒNG HỒ -->
      <HomeProdSection 
        title="ĐỒNG HỒ" 
        :tabs="watchTabs" 
        :products="watchState.data" 
        :loading="watchState.loading"
        color="#6a1b9a" 
        @change-tab="fetchWatches"
      />

      <!-- MÁY TÍNH BẢNG -->
      <HomeProdSection 
        title="MÁY TÍNH BẢNG" 
        :tabs="tabletTabs" 
        :products="tabletState.data" 
        :loading="tabletState.loading"
        color="#00695c" 
        @change-tab="fetchTablets"
      />

      <!-- NEWS -->
      <HomeNews />

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n, useHead } from "#imports";

/* Nuxt 3 auto-imports components from ~/components/,
   so <HomeHero>, <HomeProdSection>, <HomeNews> are available automatically. */

definePageMeta({ layout: 'default' });
const { t } = useI18n();
useHead({ title: computed(() => t('page_titles.home')) });

// --- TABS DATA ---
const phoneTabs  = ['Tất cả','iPhone','Samsung','Xiaomi','OPPO','Vivo','realme'];
const laptopTabs = ['Tất cả','MacBook','Dell','HP','Asus','Lenovo','Acer'];
const audioTabs  = ['Tất cả','Tai nghe','Loa','AirPods','Sony','JBL','Bose'];
const watchTabs  = ['Tất cả','Apple Watch','Samsung','Garmin','Casio','Xiaomi'];
const tabletTabs = ['Tất cả','iPad','Samsung','Xiaomi','Lenovo','Huawei'];

// --- MOCK DATA GENERATOR (BE Team có thể xoá sau khi gắn API) ---
const mkProducts = (names) =>
  Array.from({ length: 10 }, (_, i) => ({
    id: `${names[0]}-${Date.now()}-${i}`,
    name: `${names[i % names.length]} ${['Pro Max 256GB','Ultra 512GB','Plus 128GB','Standard 256GB'][i%4]} Chính hãng VN/A`,
    price: (Math.floor(Math.random()*18)+5)*1000000,
    originalPrice: (Math.floor(Math.random()*8)+20)*1000000,
    discount: Math.floor(Math.random()*25)+5,
    rating: (Math.random()*0.8+4.1).toFixed(1),
    sold: Math.floor(Math.random()*800)+100,
    badge: ['GIẢM SỐC','TRẢ GÓP 0%',null,'MỚI'][i%4],
    gifts: ['Ốp lưng chính hãng','Miếng dán cường lực'],
    img: `https://placehold.co/200x200/f5f5f5/999?text=${encodeURIComponent(names[i%names.length])}`,
  }));

const smPhonesMock = mkProducts(['iPhone 16','Samsung S25','Xiaomi 15','OPPO Find X8','Vivo X200']);
const laptopsMock = mkProducts(['MacBook Air','Dell XPS','HP Spectre','Asus ZenBook','Lenovo ThinkPad']);
const audioMock = mkProducts(['AirPods Pro','Sony WH-1000','JBL Tune','Samsung Buds','Bose QC45']);
const watchesMock = mkProducts(['Apple Watch','Samsung Watch','Garmin Fenix','Casio G-Shock','Xiaomi Watch']);
const tabletsMock = mkProducts(['iPad Pro','Samsung Tab','Xiaomi Pad','Lenovo Tab','Huawei MatePad']);

// --- PRODUCT STATES & FETCH FUNCTIONS ---

const phoneState = ref({ data: smPhonesMock, loading: false });
const fetchPhones = async (tabName) => {
  phoneState.value.loading = true;
  // TODO [Backend Team]: Thay thế đoạn mã mock dưới đây bằng API thực tế
  // Ví dụ: phoneState.value.data = await $fetch(`/api/products?category=phone&brand=${tabName}`);
  
  // Giả lập thời gian load API (xóa khi gắn API thật)
  setTimeout(() => {
    phoneState.value.data = mkProducts([tabName === 'Tất cả' ? 'Phone Mới' : tabName]);
    phoneState.value.loading = false;
  }, 500);
};

const laptopState = ref({ data: laptopsMock, loading: false });
const fetchLaptops = async (tabName) => {
  laptopState.value.loading = true;
  setTimeout(() => {
    laptopState.value.data = mkProducts([tabName === 'Tất cả' ? 'Laptop Mới' : tabName]);
    laptopState.value.loading = false;
  }, 500);
};

const audioState = ref({ data: audioMock, loading: false });
const fetchAudio = async (tabName) => {
  audioState.value.loading = true;
  setTimeout(() => {
    audioState.value.data = mkProducts([tabName === 'Tất cả' ? 'Tai nghe Mẫu' : tabName]);
    audioState.value.loading = false;
  }, 500);
};

const watchState = ref({ data: watchesMock, loading: false });
const fetchWatches = async (tabName) => {
  watchState.value.loading = true;
  setTimeout(() => {
    watchState.value.data = mkProducts([tabName === 'Tất cả' ? 'Đồng hồ Mẫu' : tabName]);
    watchState.value.loading = false;
  }, 500);
};

const tabletState = ref({ data: tabletsMock, loading: false });
const fetchTablets = async (tabName) => {
  tabletState.value.loading = true;
  setTimeout(() => {
    tabletState.value.data = mkProducts([tabName === 'Tất cả' ? 'Tablet Mới' : tabName]);
    tabletState.value.loading = false;
  }, 500);
};
</script>

<style scoped>
/* Tất cả CSS tuỳ chỉnh thừa đã được di chuyển vào các components con tương ứng hoặc thay thế bằng Bootstrap utilities */
</style>
