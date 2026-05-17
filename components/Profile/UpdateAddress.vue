<template>
  <QuickView
    :model-value="modelValue"
    title="Thêm địa chỉ"
    close-label="Đóng"
    :close-on-esc="!openDropdown"
    :z-index="zIndex"
    @update:model-value="(v) => emit('update:modelValue', v)"
    @close="emit('close')"
    @open="onOpen"
  >
    <template #body-wrapper>
      <form class="profile-address__form" @submit.prevent="submitAddress">
        <div class="quick-view__body profile-address__body">
          <h3 class="profile-address__section-title">Địa chỉ nhận hàng</h3>

          <div class="profile-address__field">
            <span class="profile-address__label">Tỉnh/Thành phố</span>
            <div
              class="profile-address__select"
              :class="{ 'is-open': openDropdown === 'province' }"
            >
              <button
                type="button"
                class="profile-address__select-trigger"
                @click.stop="toggleDropdown('province')"
              >
                <span :class="{ 'is-placeholder': !form.province }">
                  {{ form.province?.label || "Chọn Tỉnh/Thành phố" }}
                </span>
                <i class="bi bi-chevron-down"></i>
              </button>

              <Transition name="profile-address-menu">
                <div
                  v-if="openDropdown === 'province'"
                  class="profile-address__select-menu"
                  role="listbox"
                >
                  <div class="profile-address__select-search" @click.stop>
                    <i class="bi bi-search"></i>
                    <input
                      v-model="searchTerms.province"
                      type="search"
                      placeholder="Tìm kiếm"
                      @keydown.stop
                    />
                  </div>
                  <div class="profile-address__select-list">
                    <button
                      v-if="!provinceOptions.length"
                      type="button"
                      class="profile-address__select-option is-muted"
                      disabled
                    >
                      Đang tải...
                    </button>
                    <button
                      v-else-if="!filteredProvinceOptions.length"
                      type="button"
                      class="profile-address__select-option is-muted"
                      disabled
                    >
                      Không tìm thấy
                    </button>
                    <button
                      v-for="option in filteredProvinceOptions"
                      :key="option.value"
                      type="button"
                      class="profile-address__select-option"
                      :class="{ 'is-selected': form.province?.value === option.value }"
                      role="option"
                      :aria-selected="form.province?.value === option.value"
                      @click.stop="selectProvince(option)"
                    >
                      <span>{{ option.label }}</span>
                      <i
                        v-if="form.province?.value === option.value"
                        class="bi bi-check2"
                      ></i>
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>

          <div class="profile-address__field">
            <span class="profile-address__label">Quận/Huyện</span>
            <div
              class="profile-address__select"
              :class="{
                'is-open': openDropdown === 'district',
                'is-disabled': !form.province,
              }"
            >
              <button
                type="button"
                class="profile-address__select-trigger"
                :disabled="!form.province"
                @click.stop="toggleDropdown('district')"
              >
                <span :class="{ 'is-placeholder': !form.district }">
                  {{ districtPlaceholder }}
                </span>
                <i class="bi bi-chevron-down"></i>
              </button>

              <Transition name="profile-address-menu">
                <div
                  v-if="openDropdown === 'district'"
                  class="profile-address__select-menu"
                  role="listbox"
                >
                  <div class="profile-address__select-search" @click.stop>
                    <i class="bi bi-search"></i>
                    <input
                      v-model="searchTerms.district"
                      type="search"
                      placeholder="Tìm kiếm"
                      @keydown.stop
                    />
                  </div>
                  <div class="profile-address__select-list">
                    <button
                      v-if="districtsLoading || !districtOptions.length"
                      type="button"
                      class="profile-address__select-option is-muted"
                      disabled
                    >
                      {{ districtsLoading ? "Đang tải..." : "Không có dữ liệu" }}
                    </button>
                    <button
                      v-else-if="!filteredDistrictOptions.length"
                      type="button"
                      class="profile-address__select-option is-muted"
                      disabled
                    >
                      Không tìm thấy
                    </button>
                    <button
                      v-for="option in filteredDistrictOptions"
                      :key="option.value"
                      type="button"
                      class="profile-address__select-option"
                      :class="{ 'is-selected': form.district?.value === option.value }"
                      role="option"
                      :aria-selected="form.district?.value === option.value"
                      @click.stop="selectDistrict(option)"
                    >
                      <span>{{ option.label }}</span>
                      <i
                        v-if="form.district?.value === option.value"
                        class="bi bi-check2"
                      ></i>
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>

          <div class="profile-address__field">
            <span class="profile-address__label">Phường/Xã</span>
            <div
              class="profile-address__select"
              :class="{
                'is-open': openDropdown === 'ward',
                'is-disabled': !form.district,
              }"
            >
              <button
                type="button"
                class="profile-address__select-trigger"
                :disabled="!form.district"
                @click.stop="toggleDropdown('ward')"
              >
                <span :class="{ 'is-placeholder': !form.ward }">
                  {{ wardPlaceholder }}
                </span>
                <i class="bi bi-chevron-down"></i>
              </button>

              <Transition name="profile-address-menu">
                <div
                  v-if="openDropdown === 'ward'"
                  class="profile-address__select-menu"
                  role="listbox"
                >
                  <div class="profile-address__select-search" @click.stop>
                    <i class="bi bi-search"></i>
                    <input
                      v-model="searchTerms.ward"
                      type="search"
                      placeholder="Tìm kiếm"
                      @keydown.stop
                    />
                  </div>
                  <div class="profile-address__select-list">
                    <button
                      v-if="wardsLoading || !wardOptions.length"
                      type="button"
                      class="profile-address__select-option is-muted"
                      disabled
                    >
                      {{ wardsLoading ? "Đang tải..." : "Không có dữ liệu" }}
                    </button>
                    <button
                      v-else-if="!filteredWardOptions.length"
                      type="button"
                      class="profile-address__select-option is-muted"
                      disabled
                    >
                      Không tìm thấy
                    </button>
                    <button
                      v-for="option in filteredWardOptions"
                      :key="option.value"
                      type="button"
                      class="profile-address__select-option"
                      :class="{ 'is-selected': form.ward?.value === option.value }"
                      role="option"
                      :aria-selected="form.ward?.value === option.value"
                      @click.stop="selectWard(option)"
                    >
                      <span>{{ option.label }}</span>
                      <i
                        v-if="form.ward?.value === option.value"
                        class="bi bi-check2"
                      ></i>
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>

          <label class="profile-address__field">
            <span class="profile-address__label">Địa chỉ nhà</span>
            <input
              v-model.trim="form.detail"
              type="text"
              class="profile-address__control"
              placeholder="Nhập địa chỉ nhà"
            />
          </label>

          <div class="profile-address__divider" aria-hidden="true"></div>

          <label class="profile-address__field">
            <span class="profile-address__label">Đặt tên gợi nhớ</span>
            <input
              v-model.trim="form.reminderName"
              type="text"
              class="profile-address__control"
              placeholder="Đặt tên gợi nhớ"
            />
          </label>

          <div class="profile-address__field">
            <span class="profile-address__label">Loại địa chỉ</span>
            <div class="profile-address__type-options">
              <button
                type="button"
                class="profile-address__type-btn"
                :class="{ 'is-active': form.label === 'home' }"
                @click="form.label = 'home'"
              >
                Nhà
              </button>
              <button
                type="button"
                class="profile-address__type-btn"
                :class="{ 'is-active': form.label === 'office' }"
                @click="form.label = 'office'"
              >
                Văn phòng
              </button>
            </div>
          </div>

          <div class="profile-address__divider" aria-hidden="true"></div>

          <label class="profile-address__default-row">
            <span>Đặt làm địa chỉ mặc định</span>
            <input
              v-model="form.isDefault"
              type="checkbox"
              class="profile-address__switch-input"
            />
            <span class="profile-address__switch" aria-hidden="true"></span>
          </label>
        </div>

        <footer class="quick-view__footer profile-address__footer">
          <button
            type="submit"
            class="profile-address__submit"
            :disabled="isSubmitDisabled"
          >
            <span
              v-if="addressSaving"
              class="profile-address__spinner"
              aria-hidden="true"
            ></span>
            <span>{{ addressSaving ? "Đang thêm..." : "Thêm địa chỉ" }}</span>
          </button>
        </footer>
      </form>
    </template>
  </QuickView>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { toast } from "vue-sonner";
import { useAddress } from "@/composables/useAddress";
import { useAuthStore } from "@/stores/authStore";
import { useCheckoutStore } from "@/stores/checkoutStore";
import QuickView from "@/components/Common/QuickView.vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  /**
   * Controlled mode: nếu truyền `customer` (object) → component không tự call
   * checkoutStore.saveAddress (vốn save cho auth user). Thay vào đó emit `save`
   * với payload, parent chịu trách nhiệm POST (vd: admin tạo address cho customer
   * khác). Cũng dùng `customer.name`/`customer.phone_number` làm receiver thay
   * vì auth user.
   */
  customer: {
    type: Object,
    default: null,
  },
  /** Parent-controlled loading state (override addressSaving của checkoutStore khi controlled mode) */
  saving: {
    type: Boolean,
    default: false,
  },
  /** z-index forward cho QuickView — set cao hơn khi stack trên drawer khác */
  zIndex: {
    type: [Number, String],
    default: 10030,
  },
});

const emit = defineEmits(["update:modelValue", "close", "saved", "save"]);

const authStore = useAuthStore();
const checkoutStore = useCheckoutStore();
const { user } = storeToRefs(authStore);
const { addressSaving: storeSaving } = storeToRefs(checkoutStore);

// Mode flag: controlled (admin/external) vs uncontrolled (user profile)
const isControlled = computed(() => !!props.customer);

// Combined saving state: parent's khi controlled, store's khi uncontrolled.
const addressSaving = computed(() => (isControlled.value ? props.saving : storeSaving.value));

const form = reactive({
  province: null,
  district: null,
  ward: null,
  detail: "",
  reminderName: "",
  label: "home",
  isDefault: false,
});

const {
  provinceOptions,
  districtOptions,
  wardOptions,
  districtsLoading,
  wardsLoading,
  loadProvinces,
  loadDistricts,
  loadWards,
  resetAddressFields,
} = useAddress(form);

const openDropdown = ref(null);
const searchTerms = reactive({
  province: "",
  district: "",
  ward: "",
});

const normalizeKeyword = (value = "") =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .trim();

const filterOptions = (options, keyword) => {
  const query = normalizeKeyword(keyword);
  if (!query) return options;
  return options.filter((option) => normalizeKeyword(option.label).includes(query));
};

const receiverName = computed(() => {
  const profile = user.value || {};
  return (
    profile.full_name ||
    profile.fullName ||
    profile.name ||
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
    ""
  ).trim();
});

const receiverPhone = computed(() => {
  const profile = user.value || {};
  return (profile.phone || profile.phone_number || profile.mobile || "").trim();
});

const districtPlaceholder = computed(() => {
  if (form.district?.label) return form.district.label;
  if (districtsLoading.value) return "Đang tải...";
  return "Chọn Quận/Huyện";
});

const wardPlaceholder = computed(() => {
  if (form.ward?.label) return form.ward.label;
  if (wardsLoading.value) return "Đang tải...";
  return "Chọn Phường/Xã";
});

const filteredProvinceOptions = computed(() =>
  filterOptions(provinceOptions.value, searchTerms.province)
);

const filteredDistrictOptions = computed(() =>
  filterOptions(districtOptions.value, searchTerms.district)
);

const filteredWardOptions = computed(() => filterOptions(wardOptions.value, searchTerms.ward));

const isSubmitDisabled = computed(() => {
  return (
    addressSaving.value ||
    !form.province ||
    !form.district ||
    !form.ward ||
    !form.detail.trim()
  );
});

const resetForm = () => {
  Object.assign(form, {
    province: null,
    district: null,
    ward: null,
    detail: "",
    reminderName: "",
    label: "home",
    isDefault: false,
  });
  resetAddressFields(form);
  openDropdown.value = null;
  searchTerms.province = "";
  searchTerms.district = "";
  searchTerms.ward = "";
};

const close = () => {
  emit("update:modelValue", false);
  emit("close");
};

const closeDropdown = () => {
  openDropdown.value = null;
};

// Khi QuickView mở: load provinces + reset trạng thái dropdown nội bộ.
const onOpen = () => {
  openDropdown.value = null;
  loadProvinces();
};

// ESC trong khi 1 dropdown đang mở: chỉ đóng dropdown.
// QuickView đã được prop `close-on-esc="!openDropdown"` nên ESC ở mức panel
// sẽ KHÔNG bắn khi dropdown đang mở → consumer xử lý case này riêng.
const onKeydown = (event) => {
  if (event.key === "Escape" && openDropdown.value) {
    openDropdown.value = null;
  }
};

const toggleDropdown = (name) => {
  if (name === "district" && !form.province) return;
  if (name === "ward" && !form.district) return;
  const nextDropdown = openDropdown.value === name ? null : name;
  openDropdown.value = nextDropdown;
  if (nextDropdown) {
    searchTerms[name] = "";
  }
};

const selectProvince = (option) => {
  form.province = option;
  form.district = null;
  form.ward = null;
  openDropdown.value = null;
  searchTerms.province = "";
  searchTerms.district = "";
  searchTerms.ward = "";
  loadDistricts(option);
};

const selectDistrict = (option) => {
  form.district = option;
  form.ward = null;
  openDropdown.value = null;
  searchTerms.district = "";
  searchTerms.ward = "";
  loadWards(option);
};

const selectWard = (option) => {
  form.ward = option;
  openDropdown.value = null;
  searchTerms.ward = "";
};

const submitAddress = async () => {
  if (!form.province || !form.district || !form.ward || !form.detail.trim()) {
    toast.error("Vui lòng nhập đầy đủ địa chỉ nhận hàng.");
    return;
  }

  if (!receiverPhone.value) {
    toast.error("Vui lòng cập nhật số điện thoại trước khi thêm địa chỉ.");
    return;
  }

  try {
    await checkoutStore.saveAddress({
      name: receiverName.value || form.reminderName.trim() || "Khách hàng",
      phone: receiverPhone.value,
      province: form.province,
      district: form.district,
      ward: form.ward,
      detail: form.detail.trim(),
      label: form.label,
      isDefault: form.isDefault,
    });

    toast.success("Thêm địa chỉ thành công.");
    emit("saved");
    resetForm();
    close();
  } catch (error) {
    toast.error(
      error?.data?.message ||
        error?.response?._data?.message ||
        error?.message ||
        "Không thể thêm địa chỉ. Vui lòng thử lại."
    );
  }
};

// Listener click-outside cho dropdown — chỉ active khi drawer đang mở.
watch(
  () => props.modelValue,
  (visible) => {
    if (typeof window === "undefined") return;
    if (visible) {
      window.addEventListener("click", closeDropdown);
      window.addEventListener("keydown", onKeydown);
    } else {
      window.removeEventListener("click", closeDropdown);
      window.removeEventListener("keydown", onKeydown);
    }
  }
);

onMounted(() => {
  if (props.modelValue) {
    window.addEventListener("click", closeDropdown);
    window.addEventListener("keydown", onKeydown);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("click", closeDropdown);
    window.removeEventListener("keydown", onKeydown);
  }
});
</script>

<style scoped>
.profile-address__form {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
}

.profile-address__body {
  gap: 12px;
}

.profile-address__section-title {
  margin: 0 0 4px;
  color: #111827;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;
}

.profile-address__field {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
}

.profile-address__label {
  color: #30343b;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.35;
}

.profile-address__control,
.profile-address__select-trigger {
  width: 100%;
  height: 39px;
  padding: 0 12px;
  color: #111827;
  font-size: 12px;
  font-weight: 400;
  background: #fff;
  border: 1px solid #cfd4dc;
  border-radius: 5px;
  outline: 0;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.profile-address__control::placeholder,
.profile-address__select-trigger .is-placeholder {
  color: #c1c6cf;
}

.profile-address__control:focus,
.profile-address__select.is-open .profile-address__select-trigger {
  border-color: #98a2b3;
  box-shadow: 0 0 0 3px rgba(152, 162, 179, 0.14);
}

.profile-address__select {
  position: relative;
}

.profile-address__select.is-disabled {
  opacity: 0.72;
}

.profile-address__select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
  text-align: left;
}

.profile-address__select-trigger:disabled {
  cursor: not-allowed;
  background: #f9fafb;
}

.profile-address__select-trigger span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-address__select-trigger i {
  flex-shrink: 0;
  color: #111827;
  font-size: 13px;
  transition: transform 0.18s ease;
}

.profile-address__select.is-open .profile-address__select-trigger i {
  transform: rotate(180deg);
}

.profile-address__select-menu {
  position: absolute;
  z-index: 3;
  top: calc(100% + 6px);
  right: 0;
  left: 0;
  max-height: 228px;
  padding: 0;
  overflow: hidden;
  background: #fff;
  border: 1px solid #d9dde4;
  border-radius: 6px;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.14);
}

.profile-address__select-search {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 10px;
  color: #111827;
  background: #fff;
  border-bottom: 1px solid #edf0f3;
}

.profile-address__select-search i {
  flex-shrink: 0;
  font-size: 14px;
}

.profile-address__select-search input {
  min-width: 0;
  width: 100%;
  height: 100%;
  color: #111827;
  background: transparent;
  border: 0;
  outline: 0;
  font-size: 12px;
}

.profile-address__select-search input::placeholder {
  color: #b8bec8;
}

.profile-address__select-search input::-webkit-search-cancel-button {
  display: none;
}

.profile-address__select-list {
  max-height: 180px;
  padding: 6px;
  overflow-y: auto;
}

.profile-address__select-list::-webkit-scrollbar {
  width: 4px;
}

.profile-address__select-list::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 999px;
}

.profile-address__select-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 34px;
  gap: 10px;
  padding: 8px 10px;
  color: #111827;
  cursor: pointer;
  background: #fff;
  border: 0;
  border-radius: 5px;
  font-size: 12px;
  text-align: left;
}

.profile-address__select-option:hover,
.profile-address__select-option.is-selected {
  color: var(--irus-color-accent);
  background: var(--irus-color-accent-soft);
}

.profile-address__select-option.is-muted {
  color: #98a2b3;
  cursor: default;
  background: #fff;
}

.profile-address__select-option i {
  flex-shrink: 0;
  font-size: 14px;
}

.profile-address__divider {
  width: 100%;
  height: 1px;
  border-top: 1px dashed #d9dde4;
}

.profile-address__type-options {
  display: flex;
  align-items: center;
  gap: 8px;
}

.profile-address__type-btn {
  height: 32px;
  padding: 0 13px;
  color: #252a31;
  cursor: pointer;
  background: #fff;
  border: 1px solid #e1e5ea;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 500;
  transition:
    color 0.18s ease,
    border-color 0.18s ease,
    background-color 0.18s ease;
}

.profile-address__type-btn:hover,
.profile-address__type-btn.is-active {
  color: var(--irus-color-accent);
  background: var(--irus-color-accent-soft);
  border-color: #f2a8b1;
}

.profile-address__default-row {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  width: fit-content;
  color: #252a31;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.35;
}

.profile-address__switch-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.profile-address__switch {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 20px;
  background: #d1d5db;
  border-radius: 999px;
  transition: background-color 0.18s ease;
}

.profile-address__switch::after {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  content: "";
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.18);
  transition: transform 0.18s ease;
}

.profile-address__switch-input:checked + .profile-address__switch {
  background: var(--irus-color-accent);
}

.profile-address__switch-input:checked + .profile-address__switch::after {
  transform: translateX(12px);
}

.profile-address__footer {
  padding: 13px 18px 13px;
}

.profile-address__submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 38px;
  gap: 8px;
  color: #fff;
  cursor: pointer;
  background: var(--irus-color-surface-strong);
  border: 0;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 700;
  transition:
    background-color 0.18s ease,
    opacity 0.18s ease;
}

.profile-address__submit:hover:not(:disabled) {
  background: #c40016;
}

.profile-address__submit:disabled {
  cursor: not-allowed;
  opacity: 0.62;
}

.profile-address__spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255, 255, 255, 0.42);
  border-top-color: #fff;
  border-radius: 50%;
  animation: profile-address-spin 0.8s linear infinite;
}

.profile-address-menu-enter-active,
.profile-address-menu-leave-active {
  transition:
    opacity 0.14s ease,
    transform 0.14s ease;
}

.profile-address-menu-enter-from,
.profile-address-menu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@keyframes profile-address-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
