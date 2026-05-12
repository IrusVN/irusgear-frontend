<template>
  <Teleport to="body">
    <Transition name="profile-password-fade">
      <div
        v-if="modelValue"
        class="profile-password"
        role="presentation"
        @click.self="close"
      >
        <aside
          class="profile-password__panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-password-title"
        >
          <header class="profile-password__header">
            <h2 id="profile-password-title" class="profile-password__title">
              Đổi mật khẩu
            </h2>
            <button
              type="button"
              class="profile-password__close"
              aria-label="Đóng"
              @click="close"
            >
              <i class="bi bi-x-lg" aria-hidden="true"></i>
            </button>
          </header>

          <form class="profile-password__form" @submit.prevent="submitPassword">
            <div class="profile-password__body">
              <label class="profile-password__field">
                <span class="profile-password__label">Mật khẩu cũ</span>
                <span class="profile-password__control-wrap">
                  <input
                    v-model.trim="form.currentPassword"
                    :type="visibleFields.current ? 'text' : 'password'"
                    class="profile-password__control"
                    :class="{ 'is-invalid': errors.currentPassword }"
                    placeholder="Nhập mật khẩu cũ của bạn"
                    autocomplete="current-password"
                    @input="clearError('currentPassword')"
                  />
                  <button
                    type="button"
                    class="profile-password__eye"
                    :aria-label="visibleFields.current ? 'Ẩn mật khẩu cũ' : 'Hiện mật khẩu cũ'"
                    @click="toggleVisibility('current')"
                  >
                    <i
                      :class="visibleFields.current ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"
                      aria-hidden="true"
                    ></i>
                  </button>
                </span>
                <span v-if="errors.currentPassword" class="profile-password__error">
                  {{ errors.currentPassword }}
                </span>
              </label>

              <label class="profile-password__field">
                <span class="profile-password__label">Mật khẩu mới</span>
                <span class="profile-password__control-wrap">
                  <input
                    v-model.trim="form.newPassword"
                    :type="visibleFields.new ? 'text' : 'password'"
                    class="profile-password__control"
                    :class="{ 'is-invalid': errors.newPassword }"
                    placeholder="Nhập mật khẩu mới của bạn"
                    autocomplete="new-password"
                    @input="clearError('newPassword')"
                  />
                  <button
                    type="button"
                    class="profile-password__eye"
                    :aria-label="visibleFields.new ? 'Ẩn mật khẩu mới' : 'Hiện mật khẩu mới'"
                    @click="toggleVisibility('new')"
                  >
                    <i
                      :class="visibleFields.new ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"
                      aria-hidden="true"
                    ></i>
                  </button>
                </span>
                <span class="profile-password__hint">
                  <i class="bi bi-info-circle-fill" aria-hidden="true"></i>
                  <span>Mật khẩu tối thiểu 8 ký tự, có ít nhất chữ hoa và chữ thường, số</span>
                </span>
                <span v-if="errors.newPassword" class="profile-password__error">
                  {{ errors.newPassword }}
                </span>
              </label>

              <label class="profile-password__field">
                <span class="profile-password__label">Nhập lại mật khẩu mới</span>
                <span class="profile-password__control-wrap">
                  <input
                    v-model.trim="form.confirmPassword"
                    :type="visibleFields.confirm ? 'text' : 'password'"
                    class="profile-password__control"
                    :class="{ 'is-invalid': errors.confirmPassword }"
                    placeholder="Nhập lại mật khẩu mới của bạn"
                    autocomplete="new-password"
                    @input="clearError('confirmPassword')"
                  />
                  <button
                    type="button"
                    class="profile-password__eye"
                    :aria-label="visibleFields.confirm ? 'Ẩn mật khẩu nhập lại' : 'Hiện mật khẩu nhập lại'"
                    @click="toggleVisibility('confirm')"
                  >
                    <i
                      :class="visibleFields.confirm ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"
                      aria-hidden="true"
                    ></i>
                  </button>
                </span>
                <span v-if="errors.confirmPassword" class="profile-password__error">
                  {{ errors.confirmPassword }}
                </span>
              </label>
            </div>

            <footer class="profile-password__footer">
              <button
                type="submit"
                class="profile-password__submit"
                :disabled="isSubmitting"
              >
                <span
                  v-if="isSubmitting"
                  class="profile-password__spinner"
                  aria-hidden="true"
                ></span>
                <span>{{ isSubmitting ? "Đang đổi mật khẩu..." : "Đổi mật khẩu" }}</span>
              </button>
            </footer>
          </form>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref, watch } from "vue";
import { toast } from "vue-sonner";
import { useUserInfoStore } from "@/stores/userInfoStore";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "close", "updated"]);

const userInfoStore = useUserInfoStore();

const isSubmitting = ref(false);
const previousBodyOverflow = ref("");

const form = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const errors = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const visibleFields = reactive({
  current: false,
  new: false,
  confirm: false,
});

const resetForm = () => {
  form.currentPassword = "";
  form.newPassword = "";
  form.confirmPassword = "";
  errors.currentPassword = "";
  errors.newPassword = "";
  errors.confirmPassword = "";
  visibleFields.current = false;
  visibleFields.new = false;
  visibleFields.confirm = false;
};

const clearError = (field) => {
  errors[field] = "";
};

const toggleVisibility = (field) => {
  visibleFields[field] = !visibleFields[field];
};

const lockBodyScroll = () => {
  if (typeof document === "undefined") return;
  previousBodyOverflow.value = document.body.style.overflow;
  document.body.style.overflow = "hidden";
};

const unlockBodyScroll = () => {
  if (typeof document === "undefined") return;
  document.body.style.overflow = previousBodyOverflow.value;
};

const close = () => {
  emit("update:modelValue", false);
  emit("close");
};

const validateForm = () => {
  errors.currentPassword = "";
  errors.newPassword = "";
  errors.confirmPassword = "";

  if (!form.currentPassword) {
    errors.currentPassword = "Vui lòng nhập mật khẩu cũ.";
  }

  if (!form.newPassword) {
    errors.newPassword = "Vui lòng nhập mật khẩu mới.";
  } else if (form.newPassword.length < 6) {
    errors.newPassword = "Mật khẩu tối thiểu 6 ký tự.";
  } else if (!/[A-Za-z]/.test(form.newPassword) || !/\d/.test(form.newPassword)) {
    errors.newPassword = "Mật khẩu cần có ít nhất 1 chữ và 1 số.";
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = "Vui lòng nhập lại mật khẩu mới.";
  } else if (form.confirmPassword !== form.newPassword) {
    errors.confirmPassword = "Mật khẩu nhập lại không khớp.";
  }

  return !errors.currentPassword && !errors.newPassword && !errors.confirmPassword;
};

const submitPassword = async () => {
  if (isSubmitting.value || !validateForm()) return;

  isSubmitting.value = true;
  try {
    const result = await userInfoStore.changePassword({
      current_password: form.currentPassword,
      new_password: form.newPassword,
      new_password_confirmation: form.confirmPassword,
    });

    if (result?.success) {
      emit("updated");
      resetForm();
      close();
    }
  } catch (error) {
    toast.error(
      error?.data?.message ||
        error?.response?._data?.message ||
        error?.message ||
        "Không thể đổi mật khẩu. Vui lòng thử lại."
    );
  } finally {
    isSubmitting.value = false;
  }
};

const onKeydown = (event) => {
  if (event.key === "Escape" && props.modelValue) {
    close();
  }
};

watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      resetForm();
      lockBodyScroll();
      window.addEventListener("keydown", onKeydown);
      return;
    }

    unlockBodyScroll();
    window.removeEventListener("keydown", onKeydown);
  }
);

onBeforeUnmount(() => {
  unlockBodyScroll();
  if (typeof window !== "undefined") {
    window.removeEventListener("keydown", onKeydown);
  }
});
</script>

<style scoped>
.profile-password {
  position: fixed;
  inset: 0;
  z-index: 10030;
  display: flex;
  justify-content: flex-end;
  padding: 16px 16px 16px 0;
  background: rgba(0, 0, 0, 0.56);
  backdrop-filter: blur(3px);
}

.profile-password__panel {
  display: flex;
  flex-direction: column;
  width: min(454px, calc(100vw - 16px));
  height: 100%;
  overflow: hidden;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 18px 60px rgba(15, 23, 42, 0.18);
}

.profile-password__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 45px;
  padding: 0 14px 0 13px;
  border-bottom: 1px solid #edf0f3;
}

.profile-password__title {
  margin: 0;
  color: #111827;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.4;
}

.profile-password__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: #6b7280;
  cursor: pointer;
  background: #f3f4f6;
  border: 0;
  border-radius: 50%;
  transition:
    color 0.18s ease,
    background-color 0.18s ease;
}

.profile-password__close:hover {
  color: #111827;
  background: #e5e7eb;
}

.profile-password__close i {
  font-size: 10px;
  line-height: 1;
}

.profile-password__form {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.profile-password__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 13px;
  min-height: 0;
  padding: 16px 18px 24px;
  overflow-y: auto;
}

.profile-password__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
}

.profile-password__label {
  color: #111827;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.35;
}

.profile-password__control-wrap {
  position: relative;
  display: block;
  width: 100%;
}

.profile-password__control {
  width: 100%;
  height: 39px;
  padding: 0 42px 0 12px;
  color: #111827;
  font-size: 12px;
  font-weight: 500;
  background: #fff;
  border: 1px solid #cfd4dc;
  border-radius: 5px;
  outline: 0;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.profile-password__control::placeholder {
  color: #c1c6cf;
  font-weight: 500;
}

.profile-password__control:focus {
  border-color: #98a2b3;
  box-shadow: 0 0 0 3px rgba(152, 162, 179, 0.14);
}

.profile-password__control.is-invalid {
  border-color: #e45464;
}

.profile-password__eye {
  position: absolute;
  top: 50%;
  right: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: #6b7280;
  cursor: pointer;
  background: #f1f2f4;
  border: 0;
  border-radius: 50%;
  transform: translateY(-50%);
  transition:
    color 0.18s ease,
    background-color 0.18s ease;
}

.profile-password__eye:hover {
  color: #111827;
  background: #e7e9ee;
}

.profile-password__eye i {
  font-size: 10px;
  line-height: 1;
}

.profile-password__hint {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.35;
}

.profile-password__hint i {
  font-size: 11px;
}

.profile-password__error {
  color: #d70018;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.35;
}

.profile-password__footer {
  padding: 13px 18px 24px;
  background: #fff;
  box-shadow: 0 -18px 34px rgba(255, 255, 255, 0.96);
}

.profile-password__submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  gap: 8px;
  color: #fff;
  cursor: pointer;
  background: #d70018;
  border: 0;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 800;
  line-height: 1;
  transition:
    background-color 0.18s ease,
    opacity 0.18s ease;
}

.profile-password__submit:hover:not(:disabled) {
  background: #c40016;
}

.profile-password__submit:disabled {
  cursor: not-allowed;
  opacity: 0.68;
}

.profile-password__spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255, 255, 255, 0.42);
  border-top-color: #fff;
  border-radius: 50%;
  animation: profile-password-spin 0.8s linear infinite;
}

.profile-password-fade-enter-active,
.profile-password-fade-leave-active {
  transition: opacity 0.2s ease;
}

.profile-password-fade-enter-from,
.profile-password-fade-leave-to {
  opacity: 0;
}

.profile-password-fade-enter-active .profile-password__panel,
.profile-password-fade-leave-active .profile-password__panel {
  transition: transform 0.24s ease;
}

.profile-password-fade-enter-from .profile-password__panel,
.profile-password-fade-leave-to .profile-password__panel {
  transform: translateX(16px);
}

@keyframes profile-password-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .profile-password {
    padding: 0;
  }

  .profile-password__panel {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
  }
}
</style>
