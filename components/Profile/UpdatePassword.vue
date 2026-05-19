<template>
  <QuickView
    :model-value="modelValue"
    title="Đổi mật khẩu"
    close-label="Đóng"
    @update:model-value="(v) => emit('update:modelValue', v)"
    @close="emit('close')"
    @open="resetForm"
  >
    <template #body-wrapper>
      <form class="profile-password__form" @submit.prevent="submitPassword">
        <div class="quick-view__body profile-password__body">
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

        <footer class="quick-view__footer profile-password__footer">
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
    </template>
  </QuickView>
</template>

<script setup>
import { reactive, ref } from "vue";
import { toast } from "vue-sonner";
import { useUserInfoStore } from "@/stores/userInfoStore";
import QuickView from "@/components/Common/QuickView.vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "close", "updated"]);

const userInfoStore = useUserInfoStore();

const isSubmitting = ref(false);

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
</script>

<style scoped>
/* Shell drawer (overlay/panel/header/transition/body padding) đã chuyển sang
   <QuickView />. Ở đây chỉ giữ style nội dung password form.
   Lưu ý: class .quick-view__body / .quick-view__footer được thêm song song để
   kế thừa layout (padding, overflow, sticky shadow) từ stylesheet global của QuickView
   khi cần — vì scoped chặn ở component biên, ta dùng style :deep ở dưới để override. */

.profile-password__form {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.profile-password__body {
  /* override màu/gap riêng nếu cần */
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
  color: var(--irus-color-danger, #d70018);
  font-size: 11px;
  font-weight: 500;
  line-height: 1.35;
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
  background: var(--irus-color-surface-strong);
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

@keyframes profile-password-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
