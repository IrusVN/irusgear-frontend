<template>
  <QuickView
    :model-value="modelValue"
    title="Cập nhật thông tin cá nhân"
    close-label="Đóng"
    @update:model-value="(v) => emit('update:modelValue', v)"
    @close="onClose"
    @open="resetForm"
  >
    <template #body-wrapper>
      <form class="profile-update__form" @submit.prevent="submit">
        <div class="quick-view__body profile-update__body">
          <label class="profile-update__field">
            <span class="profile-update__label">Họ và tên</span>
            <input
              :value="fullName"
              class="profile-update__control profile-update__control--readonly profile-update__control--name"
              type="text"
              disabled
            />
          </label>

          <div class="profile-update__field">
            <span class="profile-update__label profile-update__label--strong">Giới tính</span>
            <div
              class="profile-update__dropdown"
              :class="{ 'profile-update__dropdown--open': isGenderDropdownOpen }"
            >
              <button
                type="button"
                class="profile-update__dropdown-trigger"
                :aria-expanded="isGenderDropdownOpen"
                aria-controls="profile-update-gender-menu"
                aria-haspopup="listbox"
                @click.stop="toggleGenderDropdown"
              >
                <span
                  class="profile-update__dropdown-value"
                  :class="{ 'profile-update__dropdown-value--placeholder': !form.gender }"
                >
                  {{ selectedGenderLabel }}
                </span>
                <i class="bi bi-chevron-down profile-update__dropdown-icon" aria-hidden="true"></i>
              </button>

              <Transition name="profile-update-dropdown">
                <ul
                  v-if="isGenderDropdownOpen"
                  id="profile-update-gender-menu"
                  class="profile-update__dropdown-menu"
                  role="listbox"
                >
                  <li
                    v-for="option in genderOptions"
                    :key="option.value"
                    class="profile-update__dropdown-item-wrap"
                    role="presentation"
                  >
                    <button
                      type="button"
                      class="profile-update__dropdown-item"
                      :class="{ 'profile-update__dropdown-item--active': form.gender === option.value }"
                      role="option"
                      :aria-selected="form.gender === option.value"
                      @click.stop="selectGender(option.value)"
                    >
                      <span>{{ option.label }}</span>
                      <i
                        v-if="form.gender === option.value"
                        class="bi bi-check-lg profile-update__dropdown-check"
                        aria-hidden="true"
                      ></i>
                    </button>
                  </li>
                </ul>
              </Transition>
            </div>
          </div>

          <label class="profile-update__field">
            <span class="profile-update__label">Ngày sinh</span>
            <span class="profile-update__date">
              <input
                v-model="form.birthday"
                class="profile-update__control profile-update__date-input"
                type="date"
              />
              <i class="bi bi-calendar-event profile-update__date-icon" aria-hidden="true"></i>
            </span>
          </label>

          <label class="profile-update__field">
            <span class="profile-update__label">Số điện thoại</span>
            <input
              :value="user?.phone || ''"
              class="profile-update__control profile-update__control--readonly"
              type="tel"
              disabled
            />
          </label>

          <label class="profile-update__field">
            <span class="profile-update__label">Email</span>
            <input
              :value="user?.email || ''"
              class="profile-update__control profile-update__control--readonly"
              type="email"
              disabled
            />
          </label>
        </div>

        <footer class="quick-view__footer profile-update__footer">
          <button
            type="button"
            class="profile-update__button profile-update__button--reset"
            :disabled="isSubmitting"
            @click="resetForm"
          >
            Thiết lập lại
          </button>
          <button
            type="submit"
            class="profile-update__button profile-update__button--submit"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "Đang cập nhật..." : "Cập nhật thông tin" }}
          </button>
        </footer>
      </form>
    </template>
  </QuickView>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/authStore";
import { useUserInfoStore } from "@/stores/userInfoStore";
import QuickView from "@/components/Common/QuickView.vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "close", "updated"]);

const authStore = useAuthStore();
const userInfoStore = useUserInfoStore();
const { user } = storeToRefs(authStore);

const isSubmitting = ref(false);
const isGenderDropdownOpen = ref(false);
const form = reactive({
  gender: "",
  birthday: "",
});

const genderOptions = [
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
];

const fullName = computed(() => {
  const currentUser = user.value || {};
  const parts = [currentUser.first_name, currentUser.last_name].filter(Boolean);
  return currentUser.full_name || currentUser.name || parts.join(" ") || "";
});

const selectedGenderLabel = computed(() => {
  return genderOptions.find((option) => option.value === form.gender)?.label || "Chọn giới tính";
});

const normalizeBirthday = (value) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const resetForm = () => {
  form.gender = user.value?.gender || "";
  form.birthday = normalizeBirthday(user.value?.birthday);
  isGenderDropdownOpen.value = false;
};

const close = () => {
  isGenderDropdownOpen.value = false;
  emit("update:modelValue", false);
  emit("close");
};

const onClose = () => {
  isGenderDropdownOpen.value = false;
  emit("close");
};

const toggleGenderDropdown = () => {
  isGenderDropdownOpen.value = !isGenderDropdownOpen.value;
};

const selectGender = (value) => {
  form.gender = value;
  isGenderDropdownOpen.value = false;
};

const submit = async () => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;
  try {
    const result = await userInfoStore.updateProfile({
      full_name: fullName.value,
      gender: form.gender || null,
      birthday: form.birthday || null,
    });

    if (result?.success) {
      emit("updated", result.data);
      close();
    }
  } finally {
    isSubmitting.value = false;
  }
};

// Click ngoài dropdown gender → đóng dropdown (không đóng cả drawer; ESC + overlay đã do QuickView lo)
const onWindowClick = () => {
  if (isGenderDropdownOpen.value) {
    isGenderDropdownOpen.value = false;
  }
};

watch(
  () => user.value,
  () => {
    if (props.modelValue) resetForm();
  },
  { deep: true },
);

onMounted(() => {
  if (typeof window !== "undefined") {
    window.addEventListener("click", onWindowClick);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("click", onWindowClick);
  }
});
</script>

<style scoped>
.profile-update__form {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
}

.profile-update__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
}

.profile-update__label {
  color: #777b84;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.2;
}

.profile-update__label--strong {
  color: #111113;
}

.profile-update__control {
  background: #fff;
  border: 1px solid #d7dbe2;
  border-radius: 5px;
  color: #17191f;
  font-size: 13px;
  font-weight: 500;
  height: 39px;
  outline: none;
  padding: 0 12px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  width: 100%;
}

.profile-update__control:focus {
  border-color: #a8adb7;
  box-shadow: 0 0 0 3px rgba(82, 82, 91, 0.08);
}

.profile-update__control--readonly {
  background: #f2f3f5;
  color: #8b9099;
  cursor: not-allowed;
}

.profile-update__control--name {
  text-transform: uppercase;
}

.profile-update__dropdown {
  position: relative;
  width: 100%;
}

.profile-update__dropdown-trigger {
  align-items: center;
  background: #fff;
  border: 1px solid #d7dbe2;
  border-radius: 5px;
  color: #17191f;
  cursor: pointer;
  display: flex;
  font-size: 13px;
  font-weight: 500;
  height: 39px;
  justify-content: space-between;
  outline: none;
  padding: 0 11px 0 12px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  width: 100%;
}

.profile-update__dropdown-trigger:hover,
.profile-update__dropdown--open .profile-update__dropdown-trigger {
  border-color: #a8adb7;
}

.profile-update__dropdown--open .profile-update__dropdown-trigger {
  box-shadow: 0 0 0 3px rgba(82, 82, 91, 0.08);
}

.profile-update__dropdown-value {
  color: #17191f;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-update__dropdown-value--placeholder {
  color: #b4b8c2;
  font-weight: 500;
}

.profile-update__dropdown-icon {
  color: #292d32;
  flex: 0 0 auto;
  font-size: 14px;
  margin-left: 12px;
  transition: transform 0.16s ease;
}

.profile-update__dropdown--open .profile-update__dropdown-icon {
  transform: rotate(180deg);
}

.profile-update__dropdown-menu {
  background: #fff;
  border: 1px solid #e0e3e8;
  border-radius: 7px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.14);
  left: 0;
  list-style: none;
  margin: 6px 0 0;
  overflow: hidden;
  padding: 4px;
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 3;
}

.profile-update__dropdown-item-wrap {
  margin: 0;
  padding: 0;
}

.profile-update__dropdown-item {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 5px;
  color: #292d32;
  cursor: pointer;
  display: flex;
  font-size: 13px;
  font-weight: 600;
  height: 34px;
  justify-content: space-between;
  padding: 0 9px;
  text-align: left;
  transition: background 0.15s ease, color 0.15s ease;
  width: 100%;
}

.profile-update__dropdown-item:hover {
  background: #f6f7f9;
}

.profile-update__dropdown-item--active {
  background: var(--irus-color-accent-soft);
  color: var(--irus-color-accent);
}

.profile-update__dropdown-check {
  color: var(--irus-color-accent);
  font-size: 14px;
}

.profile-update-dropdown-enter-active,
.profile-update-dropdown-leave-active {
  transition: opacity 0.14s ease, transform 0.14s ease;
}

.profile-update-dropdown-enter-from,
.profile-update-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.profile-update__date {
  display: block;
  position: relative;
}

.profile-update__date-input {
  background: #f2f3f5;
  color: #8b9099;
  padding-right: 40px;
}

.profile-update__date-input::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0;
  position: absolute;
  right: 0;
  width: 40px;
  z-index: 2;
}

.profile-update__date-icon {
  color: #525761;
  font-size: 15px;
  pointer-events: none;
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
}

.profile-update__footer {
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr 1fr;
}

.profile-update__button {
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
  display: inline-flex;
  font-size: 14px;
  font-weight: 700;
  height: 40px;
  justify-content: center;
  line-height: 1;
  padding: 0 14px;
  transition: background 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
  white-space: nowrap;
}

.profile-update__button:disabled {
  cursor: not-allowed;
  opacity: 0.68;
}

.profile-update__button--reset {
  background: #fff;
  border: 1px solid #cfd3da;
  color: #292d32;
}

.profile-update__button--reset:hover:not(:disabled) {
  background: #f7f7f8;
}

.profile-update__button--submit {
  background: var(--irus-color-surface-strong);
  border: 1px solid var(--irus-color-surface-strong);
  color: #fff;
}

.profile-update__button--submit:hover:not(:disabled) {
  background: #c40016;
  border-color: #c40016;
}

@media (max-width: 575.98px) {
  .profile-update__footer {
    grid-template-columns: 1fr;
  }
}
</style>
