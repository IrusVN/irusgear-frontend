import { computed, ref } from "vue";
import { vietnamAddressApi } from "./useVietnamAddressApi";

const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);
const districtsLoading = ref(false);
const wardsLoading = ref(false);

const provinceOptions = computed(() => provinces.value);
const districtOptions = computed(() => districts.value);
const wardOptions = computed(() => wards.value);

const loadProvinces = async () => {
  if (provinces.value.length > 0) return;
  provinces.value = await vietnamAddressApi.getProvinces();
};

const loadDistricts = async (province) => {
  const code = province?.code || province?.value;
  if (!code) {
    districts.value = [];
    return;
  }
  districtsLoading.value = true;
  try {
    districts.value = await vietnamAddressApi.getDistricts(code);
  } catch {
    districts.value = [];
  } finally {
    districtsLoading.value = false;
  }
};

const loadWards = async (district) => {
  const code = district?.code || district?.value;
  if (!code) {
    wards.value = [];
    return;
  }
  wardsLoading.value = true;
  try {
    wards.value = await vietnamAddressApi.getWards(code);
  } catch {
    wards.value = [];
  } finally {
    wardsLoading.value = false;
  }
};

const onProvinceChange = (province) => {
  wards.value = [];
  if (!province) {
    districts.value = [];
    return;
  }
  const code = province.code || province.value;
  if (!code) {
    districts.value = [];
    return;
  }
  loadDistricts(province);
};

const onDistrictChange = (district) => {
  if (!district) {
    wards.value = [];
    return;
  }
  const code = district.code || district.value;
  if (!code) {
    wards.value = [];
    return;
  }
  loadWards(district);
};

const resetAddressFields = (form) => {
  if (form) {
    form.province = null;
    form.district = null;
    form.ward = null;
  }
  districts.value = [];
  wards.value = [];
};

// Load provinces on first use
if (import.meta.client) {
  loadProvinces();
}

export function useAddress(form) {
  return {
    provinces,
    districts,
    wards,
    provinceOptions,
    districtOptions,
    wardOptions,
    districtsLoading,
    wardsLoading,
    loadProvinces,
    loadDistricts,
    loadWards,
    onProvinceChange,
    onDistrictChange,
    resetAddressFields,
  };
}
