import { computed, ref, watch } from "vue";

const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);
const districtsLoading = ref(false);
const wardsLoading = ref(false);

const provinceOptions = computed(() =>
  provinces.value.map((p) => ({
    value: p.id || p.code || p.name,
    label: p.name,
  }))
);

const districtOptions = computed(() =>
  districts.value.map((d) => ({
    value: d.id || d.code || d.name,
    label: d.name,
  }))
);

const wardOptions = computed(() =>
  wards.value.map((w) => ({
    value: w.id || w.code || w.name,
    label: w.name,
  }))
);

const loadDistricts = async (province) => {
  if (!province) {
    districts.value = [];
    return;
  }
  districtsLoading.value = true;
  try {
    const code = province.code || province.value;
    if (!code) {
      districts.value = [];
      return;
    }
    const res = await fetch(`/data/vn-addresses/districts/${code}.json`);
    if (res.ok) {
      districts.value = await res.json();
    } else {
      districts.value = [];
    }
  } catch {
    districts.value = [];
  } finally {
    districtsLoading.value = false;
  }
};

const loadWards = async (district) => {
  if (!district) {
    wards.value = [];
    return;
  }
  wardsLoading.value = true;
  try {
    const code = district.code || district.value;
    if (!code) {
      wards.value = [];
      return;
    }
    const res = await fetch(`/data/vn-addresses/wards/${code}.json`);
    if (res.ok) {
      wards.value = await res.json();
    } else {
      wards.value = [];
    }
  } catch {
    wards.value = [];
  } finally {
    wardsLoading.value = false;
  }
};

const loadProvinces = async () => {
  if (provinces.value.length > 0) return;
  try {
    const res = await fetch("/data/vn-addresses/provinces.json");
    if (res.ok) {
      provinces.value = await res.json();
    }
  } catch {
    provinces.value = [];
  }
};

const onProvinceChange = (province) => {
  wards.value = [];
  districts.value = [];
  if (province) {
    loadDistricts(province);
  }
};

const onDistrictChange = (district) => {
  wards.value = [];
  if (district) {
    loadWards(district);
  }
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
