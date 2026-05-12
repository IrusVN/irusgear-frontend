<template>
  <Teleport to="body">
    <Transition name="profile-update-fade">
      <div
        v-if="modelValue"
        class="profile-update"
        role="presentation"
        @click.self="close"
      >
        <aside
          class="profile-update__panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-update-title"
        >
          <header class="profile-update__header">
            <h2 id="profile-update-title" class="profile-update__title">
              Cập nhật thông tin cá nhân
            </h2>
            <button
              type="button"
              class="profile-update__close"
              aria-label="Đóng"
              @click="close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </header>

          <form class="profile-update__form" @submit.prevent="submit">
            <div class="profile-update__body">
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

            <footer class="profile-update__footer">
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
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/authStore";
import { useUserInfoStore } from "@/stores/userInfoStore";

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

let previousBodyOverflow = "";

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

const lockBodyScroll = () => {
  if (typeof document === "undefined") return;
  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
};

const unlockBodyScroll = () => {
  if (typeof document === "undefined") return;
  document.body.style.overflow = previousBodyOverflow;
};

const close = () => {
  isGenderDropdownOpen.value = false;
  emit("update:modelValue", false);
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

const onKeydown = (event) => {
  if (event.key === "Escape" && isGenderDropdownOpen.value) {
    isGenderDropdownOpen.value = false;
    return;
  }

  if (event.key === "Escape" && props.modelValue) {
    close();
  }
};

const onWindowClick = () => {
  if (isGenderDropdownOpen.value) {
    isGenderDropdownOpen.value = false;
  }
};

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      resetForm();
      lockBodyScroll();
    } else {
      isGenderDropdownOpen.value = false;
      unlockBodyScroll();
    }
  },
);

watch(
  () => user.value,
  () => {
    if (props.modelValue) resetForm();
  },
  { deep: true },
);

onMounted(() => {
  if (props.modelValue) {
    resetForm();
    lockBodyScroll();
  }

  if (typeof window !== "undefined") {
    window.addEventListener("keydown", onKeydown);
    window.addEventListener("click", onWindowClick);
  }
});

onBeforeUnmount(() => {
  unlockBodyScroll();

  if (typeof window !== "undefined") {
    window.removeEventListener("keydown", onKeydown);
    window.removeEventListener("click", onWindowClick);
  }
});
</script>

<style scoped>
.profile-update {
  align-items: stretch;
  background: rgba(0, 0, 0, 0.58);
  backdrop-filter: blur(3px);
  display: flex;
  inset: 0;
  justify-content: flex-end;
  padding: 16px;
  position: fixed;
  z-index: 1400;
}

.profile-update__panel {
  animation: profileUpdateSlideIn 0.24s ease-out;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 20px 70px rgba(15, 23, 42, 0.24);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 32px);
  max-width: 100%;
  overflow: hidden;
  width: 454px;
}

.profile-update__header {
  align-items: center;
  border-bottom: 1px solid #e6e8ee;
  display: flex;
  flex: 0 0 auto;
  min-height: 45px;
  justify-content: space-between;
  padding: 12px 14px 12px 13px;
}

.profile-update__title {
  color: #111113;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.25;
  margin: 0;
}

.profile-update__close {
  align-items: center;
  background: #f2f3f5;
  border: 0;
  border-radius: 999px;
  color: #6f737c;
  cursor: pointer;
  display: inline-flex;
  font-size: 18px;
  height: 20px;
  justify-content: center;
  line-height: 1;
  padding: 0;
  transition: background 0.15s ease, color 0.15s ease;
  width: 20px;
}

.profile-update__close:hover {
  background: #e6e8ee;
  color: #191b1f;
}

.profile-update__form {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
}

.profile-update__body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 13px;
  min-height: 0;
  overflow-y: auto;
  padding: 15px 18px 24px;
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
  background: #fff1f2;
  color: #d70018;
}

.profile-update__dropdown-check {
  color: #d70018;
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
  background: #fff;
  box-shadow: 0 -18px 32px rgba(255, 255, 255, 0.96);
  display: grid;
  flex: 0 0 auto;
  gap: 12px;
  grid-template-columns: 1fr 1fr;
  padding: 12px 18px 24px;
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
  background: #d70018;
  border: 1px solid #d70018;
  color: #fff;
}

.profile-update__button--submit:hover:not(:disabled) {
  background: #c40016;
  border-color: #c40016;
}

.profile-update-fade-enter-active,
.profile-update-fade-leave-active {
  transition: opacity 0.18s ease;
}

.profile-update-fade-enter-from,
.profile-update-fade-leave-to {
  opacity: 0;
}

@keyframes profileUpdateSlideIn {
  from {
    opacity: 0;
    transform: translateX(28px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 575.98px) {
  .profile-update {
    padding: 0;
  }

  .profile-update__panel {
    border-radius: 0;
    height: 100vh;
    width: 100%;
  }

  .profile-update__body {
    padding: 16px;
  }

  .profile-update__footer {
    grid-template-columns: 1fr;
    padding: 12px 16px 20px;
  }
}
</style>
